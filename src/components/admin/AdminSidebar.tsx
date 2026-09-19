"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Activity, ClipboardList, FileText, LayoutDashboard, LifeBuoy, LogOut, Package, ShieldCheck, ShoppingCart, UserCog, UserRound, Users, X } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import AdminBadge from "@/components/ui/AdminBadge";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import { useLogout } from "@/lib/hooks/useLogout";
import Skeleton from "@/components/ui/Skeleton";

interface Props {
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: AdminPermission;
  anyPermissions?: AdminPermission[];
  exact?: boolean;
};

const NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "پیشخوان", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, permission: ADMIN_PERMISSIONS.ORDERS_READ },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: LifeBuoy, permission: ADMIN_PERMISSIONS.TICKETS_READ },
  { href: "/admin/gold", label: "تابلوی طلا", icon: Activity, permission: ADMIN_PERMISSIONS.GOLD_READ },
  { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
  { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
  {
    href: "/admin/engine",
    label: "موتور فروش",
    icon: Package,
    anyPermissions: [ADMIN_PERMISSIONS.PRICING_READ, ADMIN_PERMISSIONS.ENGINE_SCHEDULER, ADMIN_PERMISSIONS.ENGINE_RATES, ADMIN_PERMISSIONS.ENGINE_REVALIDATION],
  },
  { href: "/admin/cdkeys", label: "CD Keyها", icon: ShieldCheck, permission: ADMIN_PERMISSIONS.CDKEYS_READ },
  { href: "/admin/audit", label: "گزارش رویدادها", icon: FileText, permission: ADMIN_PERMISSIONS.AUDIT_READ },
  { href: "/admin/settings", label: "تنظیمات حساب", icon: UserCog, permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
  { href: "/admin/admins", label: "مدیران و نقش‌ها", icon: UserRound, permission: ADMIN_PERMISSIONS.USERS_WRITE },
];

export default function AdminSidebar({ user, permissions, isOpen, isDesktop, onClose }: Props) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.permission) return permissions.includes(item.permission);
    if (item.anyPermissions?.length) return item.anyPermissions.some((permission) => permissions.includes(permission));
    return true;
  });

  const containerClasses = isDesktop
    ? `shrink-0 h-screen bg-brand-surface rounded-none border-l border-brand-surface_hover overflow-hidden transition-[width] duration-300 ease-in-out ${isOpen ? "w-[260px]" : "w-0"}`
    : `fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-brand-surface border-l border-brand-surface_hover z-[9999] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`;

  return (
    <aside className={containerClasses} role={!isDesktop ? "dialog" : undefined} aria-modal={!isDesktop ? isOpen : undefined}>
      <div className="flex flex-col h-full w-[260px]">
        <div className="relative flex flex-col items-center rounded-none gap-3 p-6 border-b border-brand-surface_hover shrink-0">
          {!isDesktop && (
            <button type="button" onClick={onClose} className="absolute top-3 left-3 text-brand-m_khonsa hover:text-white transition-colors p-1.5" aria-label="بستن منو">
              <X size={18} />
            </button>
          )}
          <UserAvatar src={user.avatarUrl} name={user.name} size="lg" ring />
          <AdminBadge />
          <span className="text-sm font-bold text-white truncate max-w-full">{user.name}</span>
          <span className="text-[10px] text-brand-m_khonsa truncate max-w-full" dir="ltr">{user.email}</span>
          <Link href="/" prefetch={false} className="text-xs text-brand-m_khonsa hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowRight size={14} />
            بازگشت به فروشگاه
          </Link>
        </div>

        <div className="px-5 pt-4 pb-2 text-[9px] font-black tracking-[0.12em] text-brand-m_khonsa/60">پنل مدیریت</div>

        <nav className="flex flex-col rounded-none flex-1 overflow-y-auto">
          {visibleItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                prefetch={false}
                href={href}
                onClick={!isDesktop ? onClose : undefined}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-r-[3px] rounded-none transition-colors ${active ? "border-brand-blue text-white bg-brand-blue/5" : "border-transparent text-brand-m_khonsa hover:text-white hover:bg-white/5"}`}
              >
                <Icon size={18} strokeWidth={2.25} />
                {label}
              </Link>
            );
          })}

          <Link href="/my-account" prefetch={false} onClick={!isDesktop ? onClose : undefined} className="flex items-center gap-3 px-5 rounded-none py-3.5 text-sm font-semibold whitespace-nowrap text-brand-m_khonsa hover:text-white hover:bg-white/5 transition-colors mt-auto shrink-0 border-t border-brand-surface_hover">
            <UserRound size={18} strokeWidth={2.25} />
            حساب کاربری
          </Link>

          <button onClick={logout} disabled={isLoggingOut} className="flex items-center gap-3 px-5 rounded-none py-3.5 text-sm font-semibold whitespace-nowrap text-red-500 hover:bg-red-500/10 transition-colors shrink-0 disabled:opacity-50">
            <LogOut size={18} strokeWidth={2.25} />
            {isLoggingOut ? "در حال خروج..." : "خروج از پنل"}
          </button>
        </nav>
      </div>
    </aside>
  );
}
