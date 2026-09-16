"use client";

import { useEffect, useRef } from "react";
import { getClientCookie } from "@/lib/cookies";
import { LOGGED_IN_COOKIE } from "@/lib/auth/constants";

const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;
const IDLE_TIMEOUT_MS = 6000;

async function refreshToken() {
  try {
    await fetch("/api/auth/refresh", { method: "POST" });
  } catch {
  }
}

function whenIdle(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const ric = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  }).requestIdleCallback;

  if (ric) {
    const id = ric(cb, { timeout: IDLE_TIMEOUT_MS });
    return () => (window as unknown as { cancelIdleCallback?: (id: number) => void })
      .cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(cb, IDLE_TIMEOUT_MS);
  return () => window.clearTimeout(id);
}

export default function AuthRefresher() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const isLoggedIn = () => getClientCookie(LOGGED_IN_COOKIE) === "1";

    const safeRefresh = async () => {
      if (!isLoggedIn() || isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      await refreshToken();
      isRefreshingRef.current = false;
    };

    const cancelIdle = whenIdle(() => { void safeRefresh(); });

    const interval = setInterval(safeRefresh, REFRESH_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") safeRefresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelIdle();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}