"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { AdminContextProvider, useAdminContext } from "./AdminContext";
import type { AdminBootstrap } from "@/lib/admin/server";

const AdminNotificationsBell = dynamic(() => import("./AdminNotificationsBell"), {
  ssr: false,
  loading: () => (
    <button type="button" className="relative inline-flex h-9 w-9 items-center justify-center rounded-[5px] border border-brand-surface_hover text-brand-m_khonsa" aria-label="اعلان‌ها" disabled>
      <Bell size={17} />
    </button>
  ),
});

export default function AdminShell({ children, initialContext }: { children: ReactNode; initialContext?: AdminBootstrap }) {
  return (
    <AdminContextProvider initialContext={initialContext}>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminContextProvider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const { user, permissions, loading } = useAdminContext();
  const currentUser = user ?? {
    name: loading ? "در حال بارگذاری" : "مدیر",
    email: "",
    avatarUrl: null,
  };

  return (
    <div className="min-h-[100dvh] bg-brand-bg text-white" dir="rtl">
      <AdminSidebar user={currentUser} permissions={permissions} />
      <main className="min-h-[100dvh] lg:pr-[264px]">
        <div className="mx-auto min-h-[100dvh] w-full max-w-[1700px]">
          <header className="sticky top-0 z-30 flex min-h-[58px] items-center justify-between gap-4 border-b border-brand-surface_hover bg-brand-bg px-4 lg:px-6">
            <div className="min-w-0">
              <div className="text-[9px] font-black tracking-[0.15em] text-brand-blue">مدیریت فروشگاه</div>
              <div className="mt-0.5 truncate text-sm font-black text-white">مرکز عملیات Battleee</div>
            </div>
            <div className="shrink-0">
              <AdminNotificationsBell />
            </div>
          </header>
          <div className="min-h-[calc(100dvh-58px)] px-3 pb-8 pt-4 sm:px-4 lg:px-6 lg:pt-5">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
