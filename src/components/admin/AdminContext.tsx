"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface AdminContextValue {
  loading: boolean;
  user: AdminUser | null;
  permissions: string[];
}

const Context = createContext<AdminContextValue>({ loading: true, user: null, permissions: [] });

export function AdminContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AdminContextValue>({ loading: true, user: null, permissions: [] });

  useEffect(() => {
    let active = true;
    fetch("/api/admin/context", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("unauthorized");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setState({
          loading: false,
          user: data?.user ?? null,
          permissions: Array.isArray(data?.permissions) ? data.permissions : [],
        });
      })
      .catch(() => {
        if (!active) return;
        setState({ loading: false, user: null, permissions: [] });
        router.replace("/admin-login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  const value = useMemo(() => state, [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAdminContext() {
  return useContext(Context);
}
