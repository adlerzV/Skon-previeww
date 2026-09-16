"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { KNOWN_REGIONS, DEFAULT_REGION } from "@/lib/regions";

export { KNOWN_REGIONS };

function regionFromPathname(pathname: string | null) {
  if (!pathname) return { region: null as string | null, hasRegion: false, pathnameWithoutRegion: "" };
  const segments = pathname.split("/").filter(Boolean);
  const hasRegion = KNOWN_REGIONS.includes(segments[0]?.toLowerCase());
  return {
    region: hasRegion ? segments[0] : null,
    hasRegion,
    pathnameWithoutRegion: hasRegion ? `/${segments.slice(1).join("/")}` : pathname,
  };
}

function readRegionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)store_region=([^;]+)/);
  const value = match?.[1];
  return value && KNOWN_REGIONS.includes(value.toLowerCase()) ? value : null;
}

export function useActiveRegion() {
  const pathname = usePathname();
  const parsed = useMemo(() => regionFromPathname(pathname), [pathname]);
  const [cookieRegion, setCookieRegion] = useState<string | null>(null);

  useEffect(() => {
    if (parsed.hasRegion) return;
    setCookieRegion((prev) => prev ?? readRegionCookie());
  }, [parsed.hasRegion]);

  return useMemo(() => {
    const region = parsed.region ?? cookieRegion ?? DEFAULT_REGION;
    return {
      region,
      pathnameWithoutRegion: parsed.hasRegion ? parsed.pathnameWithoutRegion : (pathname ?? ""),
    };
  }, [parsed, cookieRegion, pathname]);
}

export function buildRegionHref(region: string, link: string): string {
  const clean = link.startsWith("/") ? link : `/${link}`;
  return `/${region}${clean}`;
}