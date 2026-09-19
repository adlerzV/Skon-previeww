"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import { useLogout } from "@/lib/hooks/useLogout";
import UserAvatar from "@/components/ui/UserAvatar";

interface Props {
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
}

const ITEMS: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: AdminPermission;
  anyPermissions?: AdminPermission[];
  exact?: boolean;
}> = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, permission: ADMIN_PERMISSIONS.ORDERS_READ },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: LifeBuoy, permission: ADMIN_PERMISSIONS.TICKETS_READ },
  { href: "/admin/gold", label: "مدیریت Gold", icon: Activity, permission: ADMIN_PERMISSIONS.GOLD_READ },
  { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
  { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
  {
    href: "/admin/engine",
    label: "موتور سیستم",
    icon: Package,
    anyPermissions: [
      ADMIN_PERMISSIONS.PRICING_READ,
      ADMIN_PERMISSIONS.ENGINE_SCHEDULER,
      ADMIN_PERMISSIONS.ENGINE_RATES,
      ADMIN_PERMISSIONS.ENGINE_REVALIDATION,
    ],
  },
  { href: "/admin/audit", label: "گزارش حسابرسی", icon: FileText, permission: ADMIN_PERMISSIONS.AUDIT_READ },
  { href: "/admin/settings", label: "تنظیمات", icon: ShieldCheck, permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
  { href: "/admin/admins", label: "مدیران و نقش‌ها", icon: UserRound, permission: ADMIN_PERMISSIONS.USERS_WRITE },
];

export default function AdminSidebar({ user, permissions }: Props) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();
  const [open, setOpen] = useState(false);

  const visible = ITEMS.filter(
    (item) =>
      (!item.permission && !item.anyPermissions) ||
      (item.permission
        ? permissions.includes(item.permission)
        : item.anyPermissions?.some((permission) => permissions.includes(permission))),
  );

  const nav = (
    <aside className="admin-sidebar-panel">
      <div className="admin-sidebar-account">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar src={user.avatarUrl} name={user.name} size="md" ring />
          <div className="min-w-0">
            <div className="admin-sidebar-name">{user.name}</div>
            <div className="admin-sidebar-email" dir="ltr">
              {user.email}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="admin-sidebar-close lg:hidden"
          aria-label="بستن منو"
        >
          <X size={18} />
        </button>
      </div>

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-title">مدیریت فروشگاه</div>
        <div className="admin-sidebar-brand-subtitle">مرکز عملیات و پشتیبانی</div>
      </div>

      <nav className="admin-sidebar-nav" aria-label="منوی مدیریت">
        {visible.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              prefetch={false}
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`admin-sidebar-link ${active ? "is-active" : ""}`}
            >
              <span className="admin-sidebar-icon">
                <Icon size={17} strokeWidth={2.2} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/my-account" className="admin-sidebar-footer-link">
          <UserRound size={16} />
          حساب کاربری
        </Link>
        <button onClick={logout} disabled={isLoggingOut} className="admin-sidebar-footer-link is-danger">
          <LogOut size={16} />
          {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="admin-mobile-trigger"
        aria-label="باز کردن منوی مدیریت"
      >
        <Menu size={19} />
      </button>
      <aside className="admin-sidebar-desktop">{nav}</aside>
      {open && (
        <div className="admin-drawer-backdrop" onClick={() => setOpen(false)}>
          <div className="admin-sidebar-mobile-drawer" onClick={(event) => event.stopPropagation()}>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
