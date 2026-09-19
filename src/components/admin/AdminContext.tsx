"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface AdminSummary {
  openTicketsCount: number;
  pendingReviewsCount: number;
  processingOrdersCount: number;
  unreadNotificationsCount: number;
}

export interface AdminContextValue {
  loading: boolean;
  user: AdminUser | null;
  permissions: string[];
  summary: AdminSummary;
  tickets: Array<{
    id: string;
    databaseId: number;
    title: string;
    date?: string;
    linkedOrderId?: number | null;
    customerName?: string | null;
  }>;
  refresh: () => Promise<void>;
}

const EMPTY_SUMMARY: AdminSummary = {
  openTicketsCount: 0,
  pendingReviewsCount: 0,
  processingOrdersCount: 0,
  unreadNotificationsCount: 0,
};

const Context = createContext<AdminContextValue>({
  loading: true,
  user: null,
  permissions: [],
  summary: EMPTY_SUMMARY,
  tickets: [],
  refresh: async () => {},
});

export function AdminContextProvider({ children, initialContext }: { children: ReactNode; initialContext?: {
  user: AdminUser;
  permissions: string[];
  summary: AdminSummary;
  tickets: AdminContextValue["tickets"];
} }) {
  const router = useRouter();
  const [state, setState] = useState<Omit<AdminContextValue, "refresh">>({
    loading: true,
    user: null,
    permissions: [],
    summary: EMPTY_SUMMARY,
    tickets: [],
    ...(initialContext ? {
      loading: false,
      user: initialContext.user,
      permissions: initialContext.permissions,
      summary: initialContext.summary,
      tickets: initialContext.tickets,
    } : {}),
  });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/bootstrap", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 401 || response.status === 403) {
        router.replace("/admin-login");
        return;
      }

      if (!response.ok) throw new Error("bootstrap_failed");

      const data = await response.json();
      setState({
        loading: false,
        user: data?.user ?? null,
        permissions: Array.isArray(data?.permissions) ? data.permissions : [],
        summary: {
          openTicketsCount: Number(data?.summary?.openTicketsCount ?? 0),
          pendingReviewsCount: Number(data?.summary?.pendingReviewsCount ?? 0),
          processingOrdersCount: Number(data?.summary?.processingOrdersCount ?? 0),
          unreadNotificationsCount: Number(data?.summary?.unreadNotificationsCount ?? 0),
        },
        tickets: Array.isArray(data?.tickets) ? data.tickets : [],
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState((current) => ({ ...current, loading: false }));
    }

  }, [router]);

  useEffect(() => { if (!initialContext) void refresh(); }, [initialContext, refresh]);

  const value = useMemo<AdminContextValue>(() => ({ ...state, refresh }), [state, refresh]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAdminContext() {
  return useContext(Context);
}
