"use client";

import { useEffect, useRef } from "react";
import { getClientCookie } from "@/lib/cookies";
import { LOGGED_IN_COOKIE } from "@/lib/auth/constants";

// The proxy is the primary refresh path on navigation. The client only performs
// a low-frequency safety refresh while a user keeps a page open for many hours.
const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;
const LOCK_TIMEOUT_MS = 30_000;
const FAILURE_COOLDOWN_MS = 60_000;
const CLIENT_LOCK_KEY = "a2b_auth_refresh_lock";

function isRefreshNeeded(): boolean {
  // The access token is HttpOnly, so freshness is deliberately checked on the
  // server by /api/auth/refresh. The client only schedules a low-frequency
  // safety check while the page remains open for many hours.
  return getClientCookie(LOGGED_IN_COOKIE) === "1";
}

function acquireClientLock(): (() => void) | null {
  try {
    const raw = window.localStorage.getItem(CLIENT_LOCK_KEY);
    const existing = raw ? Number(raw) : 0;
    const now = Date.now();
    if (Number.isFinite(existing) && existing > now) return null;
    window.localStorage.setItem(CLIENT_LOCK_KEY, String(now + LOCK_TIMEOUT_MS));
    return () => {
      try {
        if (Number(window.localStorage.getItem(CLIENT_LOCK_KEY)) > now) {
          window.localStorage.removeItem(CLIENT_LOCK_KEY);
        }
      } catch {}
    };
  } catch {
    return () => {};
  }
}

export default function AuthRefresher() {
  const lastFailureRef = useRef(0);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const safeRefresh = async () => {
      if (isRefreshingRef.current) return;
      if (getClientCookie(LOGGED_IN_COOKIE) !== "1") return;
      if (!isRefreshNeeded()) return;
      if (Date.now() - lastFailureRef.current < FAILURE_COOLDOWN_MS) return;

      const release = acquireClientLock();
      if (!release) return;

      isRefreshingRef.current = true;
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "X-Requested-With": "a2b-auth-refresh" },
        });
        if (!response.ok) lastFailureRef.current = Date.now();
      } catch {
        lastFailureRef.current = Date.now();
      } finally {
        isRefreshingRef.current = false;
        release();
      }
    };

    // Do not refresh on initial mount or visibility changes. The proxy already
    // handles navigation-time refreshes, which avoids refresh storms on every page load.
    const interval = window.setInterval(() => {
      void safeRefresh();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
