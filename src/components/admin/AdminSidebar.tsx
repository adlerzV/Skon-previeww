"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, FileText, KeyRound, LayoutDashboard, LifeBuoy, Menu, Package, ShieldCheck, ShoppingCart, UserRound, Users, X } from "lucide-react";
import { useState } from "react";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import UserAvatar from "@/components/ui/UserAvatar";

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
  { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
  { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
  { href: "/admin/engine", label: "موتور و زیرساخت", icon: Package, permission: ADMIN_PERMISSIONS.PRICING_READ },
  { href: "/admin/cdkeys", label: "CD Keyها", icon: KeyRound, permission: ADMIN_PERMISSIONS.CDKEYS_READ },
  { href: "/admin/audit", label: "گزارش حسابرسی", icon: FileText, permission: ADMIN_PERMISSIONS.AUDIT_READ },
  { href: "/admin/settings", label: "تنظیمات حساب", icon: ShieldCheck, permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
  { href: "/admin/admins", label: "مدیران و نقش‌ها", icon: UserRound, permission: ADMIN_PERMISSIONS.USERS_WRITE },
];

export default function AdminSidebar({ user, permissions, contextLoading }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visible = contextLoading ? ITEMS : ITEMS.filter((item) => !item.permission || permissions.includes(item.permission));

  const nav = (
    <div className="flex h-full w-[280px] flex-col bg-brand-surface border-l border-brand-surface_hover">
      <div className="flex items-center gap-3 p-5 border-b border-brand-surface_hover">
        <UserAvatar src={user.avatarUrl} name={user.name} size="md" ring />
        <div className="min-w-0">
          <div className="text-sm font-black text-white truncate">{user.name}</div>
          {user.email && <div className="text-[11px] text-brand-m_khonsa truncate" dir="ltr">{user.email}</div>}
        </div>
        <button type="button" onClick={() => setOpen(false)} className="mr-auto lg:hidden text-brand-m_khonsa hover:text-white" aria-label="بستن منو">
          <X size={18} />
        </button>
      </div>

      <div className="px-5 py-4 border-b border-brand-surface_hover">
        <div className="text-[11px] font-black text-brand-blue">مرکز عملیات</div>
        <div className="text-[10px] text-brand-m_khonsa mt-1">مدیریت یکپارچه Battleee</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {visible.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold border-r-[3px] transition-colors ${active ? "border-brand-blue text-white bg-brand-blue/5" : "border-transparent text-brand-m_khonsa hover:text-white hover:bg-white/5"}`}
            >
              <Icon size={17} strokeWidth={2.2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="lg:hidden fixed top-3 right-3 z-40 p-2.5 bg-brand-surface border border-brand-surface_hover text-white" aria-label="باز کردن منوی مدیریت">
        <Menu size={19} />
      </button>
      <aside className="hidden lg:flex fixed inset-y-0 right-0 z-30">{nav}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)}>
          <div className="h-full" onClick={(event) => event.stopPropagation()}>{nav}</div>
        </div>
      )}
    </>
  );
}
