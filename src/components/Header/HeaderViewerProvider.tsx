"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface HeaderViewerUser {
  name: string;
  avatarUrl: string | null;
  isStaff?: boolean;
}

interface HeaderViewerState {
  user: HeaderViewerUser | null;
  wishlistCount: number;
  loading: boolean;
}

const HeaderViewerContext = createContext<HeaderViewerState>({
  user: null,
  wishlistCount: 0,
  loading: false,
});

function hasLoginCookie() {
  return typeof document !== "undefined" && document.cookie.split(";").some((part) => part.trim().startsWith("a2b_logged_in=1"));
}

export function HeaderViewerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeaderViewerState>({
    user: null,
    wishlistCount: 0,
    loading: false,
  });

  useEffect(() => {
    if (!hasLoginCookie()) return;

    let cancelled = false;
    setState((current) => ({ ...current, loading: true }));

    fetch("/api/account/header-context", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: HeaderViewerUser | null; wishlistCount?: number } | null) => {
        if (cancelled) return;
        setState({
          user: data?.user ?? null,
          wishlistCount: Number(data?.wishlistCount) || 0,
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ user: null, wishlistCount: 0, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <HeaderViewerContext.Provider value={value}>{children}</HeaderViewerContext.Provider>;
}

export function useHeaderViewer() {
  return useContext(HeaderViewerContext);
}
