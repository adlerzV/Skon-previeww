"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminNotificationsBell from "./AdminNotificationsBell";
import { AdminContextProvider, useAdminContext } from "./AdminContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { useLogout } from "@/lib/hooks/useLogout";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminContextProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminContextProvider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const { user, permissions, loading } = useAdminContext();
  const { logout, isLoggingOut } = useLogout();

  const fallbackUser = {
    name: loading ? "در حال بارگذاری" : "مدیر",
    email: "",
    avatarUrl: null,
  };
  const currentUser = user ?? fallbackUser;

  return (
    <div className="min-h-[100dvh] bg-brand-bg">
      <AdminSidebar user={currentUser} permissions={permissions} contextLoading={loading} />

      <main className="lg:pr-[280px] min-h-[100dvh]">
        <div className="w-full max-w-[1800px] mx-auto min-h-[100dvh]">
          <header className="sticky top-0 z-40 h-[62px] border-b border-brand-surface_hover bg-brand-bg/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4" dir="rtl">
            <div className="min-w-0">
              <div className="text-[10px] font-black tracking-[0.16em] text-brand-blue uppercase">مدیریت Battleee</div>
              <div className="text-sm font-black text-white truncate">مرکز عملیات مدیریت</div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <AdminNotificationsBell />
              <Link href="/admin/settings" className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 text-xs font-bold text-brand-m_khonsa hover:text-white hover:bg-white/5 transition-colors">
                <UserAvatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
                <span className="hidden md:inline">تنظیمات حساب</span>
                <Settings size={16} className="md:hidden" />
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">خروج</span>
              </button>
            </div>
          </header>

          <div className="p-4 pt-5 lg:p-6 min-h-[calc(100dvh-62px)]" dir="rtl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
