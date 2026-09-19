"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { AdminContextProvider, useAdminContext } from "./AdminContext";

const AdminNotificationsBell = dynamic(() => import("./AdminNotificationsBell"), {
  ssr: false,
  loading: () => (
    <button type="button" className="relative p-2.5 text-brand-m_khonsa" aria-label="اعلان‌ها" disabled>
      <Bell size={18} />
    </button>
  ),
});

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminContextProvider>
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
    <div className="admin-ui min-h-[100dvh] bg-brand-bg">
      <AdminSidebar user={currentUser} permissions={permissions} />

      <main className="lg:pr-[264px] min-h-[100dvh]">
        <div className="w-full max-w-[1800px] mx-auto min-h-[100dvh]">
          <header className="sticky top-0 z-40 h-[60px] border-b border-brand-surface_hover bg-brand-bg/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4" dir="rtl">
            <div className="min-w-0">
              <div className="text-[10px] font-black tracking-[0.16em] text-brand-blue uppercase">مرکز عملیات</div>
              <div className="text-sm font-black text-white truncate">مدیریت Battleee</div>
            </div>
            <div className="shrink-0">
              <AdminNotificationsBell />
            </div>
          </header>

          <div className="p-4 pt-5 lg:p-6 min-h-[calc(100dvh-60px)]" dir="rtl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
