import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { fetchGraphQL } from "@/lib/graphql";
import { AUTH_TOKEN_COOKIE, SESSION_ID_COOKIE } from "./constants";
import { resolveAvatarUrl } from "@/lib/avatars";

export interface SessionUser {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  avatarId: string | null;
  avatarUrl: string | null;
  isStaff: boolean;
  hasManualPassword: boolean;
}

export interface HeaderViewerData {
  user: { name: string; avatarUrl: string | null; isStaff: boolean } | null;
  wishlistIds: number[];
}

const VIEWER_QUERY = `
  query GetViewer($sessionId: String) {
    viewer {
      id
      databaseId
      name
      email
      avatarUrl
      isStaff
      hasManualPassword
      activeSessionValid(sessionId: $sessionId)
    }
  }
`;

const VIEWER_WITH_WISHLIST_QUERY = `
  query GetHeaderViewer($sessionId: String) {
    viewer {
      id
      name
      avatarUrl
      isStaff
      activeSessionValid(sessionId: $sessionId)
      wishlistIds
    }
  }
`;

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_ID_COOKIE)?.value ?? null;
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const sessionId = await getSessionId();
    const data = await fetchGraphQL(VIEWER_QUERY, { sessionId }, [], "no-store", token);
    if (!data?.viewer?.id) return null;
    if (data.viewer.activeSessionValid === false) return null;

    const viewer = data.viewer;
    const avatarId = viewer.avatarUrl ?? null;
    const avatarUrl = await resolveAvatarUrl(avatarId);

    return {
      ...viewer,
      avatarId,
      avatarUrl,
      isStaff: Boolean(viewer.isStaff),
      hasManualPassword: Boolean(viewer.hasManualPassword),
    } as SessionUser;
  } catch {
    return null;
  }
});

export const getHeaderViewerData = cache(async (): Promise<HeaderViewerData> => {
  const token = await getAuthToken();
  if (!token) return { user: null, wishlistIds: [] };

  try {
    const sessionId = await getSessionId();
    const data = await fetchGraphQL(VIEWER_WITH_WISHLIST_QUERY, { sessionId }, [], "no-store", token);
    const viewer = data?.viewer;

    if (!viewer?.id) return { user: null, wishlistIds: [] };

    const wishlistIds = Array.isArray(viewer.wishlistIds)
      ? viewer.wishlistIds.filter((id: unknown) => typeof id === "number")
      : [];

    if (viewer.activeSessionValid === false) {
      return { user: null, wishlistIds };
    }

    const avatarUrl = await resolveAvatarUrl(viewer.avatarUrl ?? null);

    return {
      user: { name: viewer.name, avatarUrl, isStaff: Boolean(viewer.isStaff) },
      wishlistIds,
    };
  } catch {
    return { user: null, wishlistIds: [] };
  }
});