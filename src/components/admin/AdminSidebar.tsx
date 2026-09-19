"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, FileText, LayoutDashboard, LifeBuoy, LogOut, Menu, Package, ShieldCheck, ShoppingCart, UserRound, Users, X } from "lucide-react";
import { useState } from "react";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import { useLogout } from "@/lib/hooks/useLogout";
import UserAvatar from "@/components/ui/UserAvatar";
import AdminNotificationsBell from "./AdminNotificationsBell";

interface Props {
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
}

const ITEMS: Array<{ href: string; label: string; icon: typeof LayoutDashboard; permission?: AdminPermission; anyPermissions?: AdminPermission[]; exact?: boolean }> = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, permission: ADMIN_PERMISSIONS.ORDERS_READ },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: LifeBuoy, permission: ADMIN_PERMISSIONS.TICKETS_READ },
  { href: "/admin/gold", label: "تابلوی طلا", icon: Activity, permission: ADMIN_PERMISSIONS.GOLD_READ },
  { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
  { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
  { href: "/admin/engine", label: "موتور فروش", icon: Package, anyPermissions: [ADMIN_PERMISSIONS.PRICING_READ, ADMIN_PERMISSIONS.ENGINE_SCHEDULER, ADMIN_PERMISSIONS.ENGINE_RATES, ADMIN_PERMISSIONS.ENGINE_REVALIDATION] },
  { href: "/admin/audit", label: "گزارش رویدادها", icon: FileText, permission: ADMIN_PERMISSIONS.AUDIT_READ },
  { href: "/admin/settings", label: "تنظیمات", icon: ShieldCheck, permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
  { href: "/admin/admins", label: "مدیران و نقش‌ها", icon: UserRound, permission: ADMIN_PERMISSIONS.USERS_WRITE },
];

export default function AdminSidebar({ user, permissions }: Props) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();
  const [open, setOpen] = useState(false);
  const visible = ITEMS.filter((item) => (!item.permission && !item.anyPermissions) || (item.permission ? permissions.includes(item.permission) : item.anyPermissions?.some((permission) => permissions.includes(permission))));

  const nav = (
    <div className="flex h-full w-[264px] flex-col border-l border-brand-surface_hover bg-brand-surface">
      <div className="border-b border-brand-surface_hover p-4">
        <div className="flex items-center gap-3">
          <UserAvatar src={user.avatarUrl} name={user.name} size="md" ring />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-black text-white">{user.name}</div>
            <div className="mt-0.5 truncate text-[10px] text-brand-m_khonsa" dir="ltr">{user.email}</div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-brand-m_khonsa hover:text-white lg:hidden" aria-label="بستن منو"><X size={18} /></button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-brand-surface_hover px-4 py-3">
        <div>
          <div className="text-[9px] font-black tracking-[0.16em] text-brand-blue">BATTLEEE</div>
          <div className="mt-0.5 text-[10px] text-brand-m_khonsa">پنل مدیریت فروشگاه</div>
        </div>
        <AdminNotificationsBell />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-2 px-2 text-[9px] font-black text-brand-m_khonsa/60">منوی مدیریت</div>
        <div className="space-y-0.5">
          {visible.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                prefetch={false}
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex min-h-10 items-center gap-3 rounded-[5px] border-r-2 px-3 text-xs font-black transition-colors ${active ? "border-brand-blue bg-brand-blue/10 text-white" : "border-transparent text-brand-m_khonsa hover:bg-white/[.035] hover:text-white"}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] ${active ? "bg-brand-blue/15 text-brand-blue" : "bg-white/[.025] text-brand-m_khonsa group-hover:text-white"}`}><Icon size={15} strokeWidth={2.2} /></span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-brand-surface_hover p-2">
        <Link href="/my-account" className="flex min-h-10 items-center gap-3 rounded-[5px] px-3 text-xs font-black text-brand-m_khonsa transition hover:bg-white/[.035] hover:text-white">
          <UserRound size={15} /> حساب کاربری
        </Link>
        <button onClick={logout} disabled={isLoggingOut} className="flex min-h-10 w-full items-center gap-3 rounded-[5px] px-3 text-xs font-black text-red-300 transition hover:bg-red-500/10 disabled:opacity-50">
          <LogOut size={15} /> {isLoggingOut ? "در حال خروج..." : "خروج از پنل"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed right-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-[5px] border border-brand-surface_hover bg-brand-surface text-white shadow-lg lg:hidden" aria-label="باز کردن منوی مدیریت"><Menu size={18} /></button>
      <aside className="fixed inset-y-0 right-0 z-30 hidden lg:flex">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full" onClick={(event) => event.stopPropagation()}>{nav}</div>
        </div>
      )}
    </>
  );
}
