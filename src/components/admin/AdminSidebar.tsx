"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, KeyRound, LayoutDashboard, LifeBuoy, LogOut, Menu, Settings, ShoppingCart, UserRound, Users, X, Store } from "lucide-react";
import { useState } from "react";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import UserAvatar from "@/components/ui/UserAvatar";
import { useLogout } from "@/lib/hooks/useLogout";

interface Props {
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  contextLoading: boolean;
}

const ITEMS: Array<{ href: string; label: string; icon: typeof LayoutDashboard; permission?: AdminPermission; exact?: boolean }> = [
  { href: "/admin", label: "پیشخوان", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, permission: ADMIN_PERMISSIONS.ORDERS_READ },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: LifeBuoy, permission: ADMIN_PERMISSIONS.TICKETS_READ },
  { href: "/admin/gold", label: "برد طلا", icon: Activity, permission: ADMIN_PERMISSIONS.GOLD_READ },
  { href: "/admin/cdkeys", label: "CD Key", icon: KeyRound, permission: ADMIN_PERMISSIONS.CDKEYS_READ },
  { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
  { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
];

export default function AdminSidebar({ user, permissions, contextLoading }: Props) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const visible = contextLoading ? ITEMS : ITEMS.filter((item) => !item.permission || permissions.includes(item.permission));

  const nav = (
    <div className="flex h-full w-[264px] flex-col bg-brand-surface border-l border-brand-surface_hover" dir="rtl">
      <div className="px-5 py-5 border-b border-brand-surface_hover">
        <div className="text-[11px] font-black tracking-[0.14em] text-brand-blue">BATTLEEE ADMIN</div>
        <div className="text-[10px] text-brand-m_khonsa mt-1">مرکز عملیات</div>
        <button type="button" onClick={() => setOpen(false)} className="absolute top-4 left-4 lg:hidden text-brand-m_khonsa hover:text-white" aria-label="بستن منو">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="px-3 pb-2 text-[9px] font-black tracking-[0.12em] text-brand-m_khonsa">عملیات</div>
        <div className="space-y-0.5">
          {visible.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                prefetch={false}
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-brand-blue/10 text-white ring-1 ring-brand-blue/20" : "text-brand-m_khonsa hover:bg-white/5 hover:text-white"}`}
              >
                <Icon size={17} strokeWidth={2.2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="relative border-t border-brand-surface_hover p-3 space-y-1.5">
        {profileOpen && (
          <div className="absolute bottom-[calc(100%-8px)] right-3 left-3 overflow-hidden rounded-2xl border border-brand-surface_hover bg-brand-bg shadow-2xl">
            <div className="p-3 border-b border-brand-surface_hover">
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">{user.name}</div>
                  {user.email && <div className="mt-0.5 text-[10px] text-brand-m_khonsa truncate" dir="ltr">{user.email}</div>}
                </div>
              </div>
            </div>
            <Link prefetch={false} href="/admin/settings" onClick={() => { setProfileOpen(false); setOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-brand-m_khonsa hover:bg-white/5 hover:text-white">
              <Settings size={15} />
              تنظیمات پروفایل
            </Link>
            <button type="button" onClick={() => { setProfileOpen(false); void logout(); }} disabled={isLoggingOut} className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-50">
              <LogOut size={15} />
              {isLoggingOut ? "در حال خروج…" : "خروج از حساب"}
            </button>
          </div>
        )}

        <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right hover:bg-white/5 transition-colors">
          <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-black text-white">{user.name}</span>
            <span className="block truncate text-[10px] text-brand-m_khonsa">پروفایل و حساب</span>
          </span>
          <UserRound size={15} className="text-brand-m_khonsa" />
        </button>

        <Link prefetch={false} href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-m_khonsa hover:bg-white/5 hover:text-white transition-colors">
          <Store size={16} />
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="lg:hidden fixed top-3 right-3 z-40 rounded-xl p-2.5 bg-brand-surface border border-brand-surface_hover text-white shadow-lg" aria-label="باز کردن منوی مدیریت">
        <Menu size={19} />
      </button>
      <aside className="hidden lg:flex fixed inset-y-0 right-0 z-30">{nav}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div className="h-full" onClick={(event) => event.stopPropagation()}>{nav}</div>
        </div>
      )}
    </>
  );
}
