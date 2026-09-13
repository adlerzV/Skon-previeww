import { NextRequest, NextResponse } from "next/server";
import { KNOWN_REGIONS, DEFAULT_REGION } from "@/lib/regions";

const REGION_COOKIE = "store_region";
const AUTH_TOKEN_COOKIE = "a2b_auth_token";
const REFRESH_TOKEN_COOKIE = "a2b_refresh_token";
const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 3;

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const INTERNAL_WP_GRAPHQL_URL = process.env.INTERNAL_WORDPRESS_API_URL;
const FALLBACK_PROD_URL = "https://api.arena2battle.com/graphql";

function resolveEndpoint(): { url: string; hostHeader?: string } {
  const publicUrl = WP_GRAPHQL_URL || FALLBACK_PROD_URL;
  if (!INTERNAL_WP_GRAPHQL_URL) return { url: publicUrl };
  let hostHeader: string | undefined;
  try {
    hostHeader = new URL(publicUrl).host;
  } catch {
    hostHeader = undefined;
  }
  return { url: INTERNAL_WP_GRAPHQL_URL, hostHeader };
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decodedBinary = atob(padded);
    const bytes = Uint8Array.from(decodedBinary, (c) => c.charCodeAt(0));
    const jsonString = new TextDecoder().decode(bytes);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

function needsRefresh(token: string | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  const exp = payload && typeof payload.exp === "number" ? payload.exp : null;
  if (!exp) return true;
  return Math.floor(Date.now() / 1000) >= exp - 20;
}

async function refreshAuthToken(refreshToken: string): Promise<string | null> {
  const { url, hostHeader } = resolveEndpoint();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(hostHeader ? { Host: hostHeader } : {}),
      },
      body: JSON.stringify({
        query:
          "mutation RefreshToken($refreshToken: String!) { refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) { authToken } }",
        variables: { refreshToken },
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const token = json?.data?.refreshJwtAuthToken?.authToken;
    return typeof token === "string" && token ? token : null;
  } catch {
    return null;
  }
}

async function applyAuthRefresh(request: NextRequest): Promise<string | null> {
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken || !needsRefresh(authToken)) return null;

  const newToken = await refreshAuthToken(refreshToken);
  if (newToken) {
    request.cookies.set(AUTH_TOKEN_COOKIE, newToken);
    return newToken;
  }
  return null;
}

function finalizeAuthCookie(
  response: NextResponse,
  newToken: string | null
): NextResponse {
  if (newToken) {
    response.cookies.set(AUTH_TOKEN_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE,
    });
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const refreshedToken = await applyAuthRefresh(request);

  const isNonRegionRoute =
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/admin-login");

  if (isNonRegionRoute) {
    const response = NextResponse.next({ request });
    return finalizeAuthCookie(response, refreshedToken);
  }

  const cookieRegion = request.cookies.get(REGION_COOKIE)?.value?.toLowerCase();
  const activeRegion =
    cookieRegion && KNOWN_REGIONS.includes(cookieRegion) ? cookieRegion : DEFAULT_REGION;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${activeRegion}`;
    const response = NextResponse.redirect(url);
    return finalizeAuthCookie(response, refreshedToken);
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (KNOWN_REGIONS.includes(firstSegment)) {
    const response = NextResponse.next({ request });
    if (cookieRegion !== firstSegment) {
      response.cookies.set(REGION_COOKIE, firstSegment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return finalizeAuthCookie(response, refreshedToken);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${activeRegion}${pathname}`;
  const response = NextResponse.redirect(url);
  return finalizeAuthCookie(response, refreshedToken);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};