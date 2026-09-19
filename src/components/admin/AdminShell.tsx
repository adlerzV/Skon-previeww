"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminNotificationsBell from "./AdminNotificationsBell";
import { AdminContextProvider, useAdminContext } from "./AdminContext";

const TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: "/admin/orders/", title: "جزئیات سفارش" },
  { prefix: "/admin/orders", title: "سفارش‌ها" },
  { prefix: "/admin/tickets/", title: "جزئیات تیکت" },
  { prefix: "/admin/tickets", title: "تیکت‌ها" },
  { prefix: "/admin/gold", title: "برد طلا" },
  { prefix: "/admin/reviews", title: "دیدگاه‌ها" },
  { prefix: "/admin/customers/", title: "پرونده مشتری" },
  { prefix: "/admin/customers", title: "مشتریان" },
  { prefix: "/admin/cdkeys", title: "CD Keyها" },
  { prefix: "/admin/engine", title: "موتور و زیرساخت" },
  { prefix: "/admin/audit", title: "گزارش حسابرسی" },
  { prefix: "/admin/admins", title: "مدیران و نقش‌ها" },
  { prefix: "/admin/settings", title: "تنظیمات پروفایل" },
];

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "پیشخوان";
  return TITLES.find((item) => pathname.startsWith(item.prefix))?.title ?? "مرکز عملیات";
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminContextProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminContextProvider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, permissions, loading } = useAdminContext();
  const currentUser = user ?? { name: "مدیر", email: "", avatarUrl: null };

  return (
    <div className="admin-ui min-h-[100dvh] bg-brand-bg">
      <AdminSidebar user={currentUser} permissions={permissions} contextLoading={loading} />

      <main className="min-h-[100dvh] lg:pr-[286px]">
        <div className="mx-auto min-h-[100dvh] w-full max-w-[1760px]">
          <header className="admin-topbar" dir="rtl">
            <div className="min-w-0 pr-11 lg:pr-0">
              <div className="text-[10px] font-bold text-brand-m_khonsa">Battleee Admin</div>
              <div className="truncate text-base font-black text-white">{getPageTitle(pathname)}</div>
            </div>
            <div className="shrink-0">
              <AdminNotificationsBell />
            </div>
          </header>

          <div className="admin-content" dir="rtl">{children}</div>
        </div>
      </main>
    </div>
  );
}
