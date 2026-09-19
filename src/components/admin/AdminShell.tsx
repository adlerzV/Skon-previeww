"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { AdminContextProvider, useAdminContext } from "./AdminContext";

const AdminNotificationsBell = dynamic(() => import("./AdminNotificationsBell"), {
  ssr: false,
  loading: () => (
    <button type="button" className="admin-icon-button" aria-label="اعلان‌ها" disabled>
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
    <div className="admin-ui min-h-[100dvh]" dir="rtl">
      <AdminSidebar user={currentUser} permissions={permissions} />

      <main className="admin-main">
        <div className="admin-main-inner">
          <header className="admin-topbar">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <div className="admin-eyebrow">مرکز عملیات</div>
                <div className="admin-topbar-title">مدیریت فروشگاه</div>
              </div>
            </div>
            <div className="admin-topbar-actions">
              <AdminNotificationsBell />
            </div>
          </header>

          <div className="admin-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
