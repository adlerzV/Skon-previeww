"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  FileText,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Store,
  Users,
  UserCog,
  X,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/permissions";
import UserAvatar from "@/components/ui/UserAvatar";
import { useLogout } from "@/lib/hooks/useLogout";

interface Props {
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  contextLoading: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: AdminPermission;
  exact?: boolean;
}
interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  { label: "اصلی", items: [{ href: "/admin", label: "پیشخوان", icon: LayoutDashboard, exact: true }] },
  {
    label: "عملیات",
    items: [
      { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, permission: ADMIN_PERMISSIONS.ORDERS_READ },
      { href: "/admin/tickets", label: "تیکت‌ها", icon: LifeBuoy, permission: ADMIN_PERMISSIONS.TICKETS_READ },
      { href: "/admin/gold", label: "برد طلا", icon: Activity, permission: ADMIN_PERMISSIONS.GOLD_READ },
      { href: "/admin/reviews", label: "دیدگاه‌ها", icon: ClipboardList, permission: ADMIN_PERMISSIONS.REVIEWS_MODERATE },
      { href: "/admin/customers", label: "مشتریان", icon: Users, permission: ADMIN_PERMISSIONS.USERS_READ },
    ],
  },
  {
    label: "زیرساخت",
    items: [
      { href: "/admin/cdkeys", label: "CD Keyها", icon: KeyRound, permission: ADMIN_PERMISSIONS.CDKEYS_READ },
      { href: "/admin/engine", label: "موتور و زیرساخت", icon: Activity, permission: ADMIN_PERMISSIONS.PRICING_READ },
    ],
  },
  {
    label: "سیستم",
    items: [
      { href: "/admin/audit", label: "گزارش حسابرسی", icon: FileText, permission: ADMIN_PERMISSIONS.AUDIT_READ },
      { href: "/admin/admins", label: "مدیران و نقش‌ها", icon: UserCog, permission: ADMIN_PERMISSIONS.USERS_WRITE },
    ],
  },
];

export default function AdminSidebar({ user, permissions, contextLoading }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, isLoggingOut } = useLogout();

  const visibleSections = SECTIONS
    .map((section) => ({
      ...section,
      items: contextLoading ? section.items : section.items.filter((item) => !item.permission || permissions.includes(item.permission)),
    }))
    .filter((section) => section.items.length > 0);

  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const nav = (
    <div className="admin-sidebar" dir="rtl">
      <div className="admin-sidebar-head">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue text-xs font-black">B</div>
            <div>
              <div className="text-sm font-black text-white">BATTLEEE</div>
              <div className="text-[9px] font-bold text-brand-m_khonsa">مرکز عملیات</div>
            </div>
          </div>
        </div>
        <button type="button" onClick={closeMenu} className="lg:hidden text-brand-m_khonsa hover:text-white" aria-label="بستن منو">
          <X size={18} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {visibleSections.map((section, sectionIndex) => (
          <div key={section.label} className={sectionIndex ? "mt-5" : ""}>
            <div className="admin-sidebar-label">{section.label}</div>
            <div className="space-y-1">
              {section.items.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link key={href} href={href} onClick={closeMenu} className={`admin-nav-item ${active ? "is-active" : ""}`}>
                    <span className="admin-nav-icon"><Icon size={16} strokeWidth={2.2} /></span>
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        {profileOpen && (
          <div className="admin-profile-popover">
            <div className="admin-profile-summary">
              <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
              <div className="min-w-0">
                <div className="truncate text-xs font-black text-white">{user.name || "مدیر"}</div>
                {user.email && <div className="mt-0.5 truncate text-[10px] text-brand-m_khonsa" dir="ltr">{user.email}</div>}
              </div>
            </div>
            <Link href="/admin/settings" onClick={closeMenu} className="admin-profile-action">
              <Settings size={15} />
              تنظیمات پروفایل
            </Link>
            <button type="button" onClick={() => void logout()} disabled={isLoggingOut} className="admin-profile-action is-danger">
              <LogOut size={15} />
              {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setProfileOpen((value) => !value)} className={`admin-bottom-button ${profileOpen ? "is-open" : ""}`}>
            <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
            <span className="truncate">پروفایل</span>
            <ChevronUp size={13} className={`mr-auto transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>
          <Link href="/" onClick={closeMenu} className="admin-bottom-button">
            <Store size={15} />
            <span>فروشگاه</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="admin-mobile-menu" aria-label="باز کردن منوی مدیریت">
        <Menu size={18} />
      </button>
      <aside className="fixed inset-y-0 right-0 z-30 hidden lg:flex">{nav}</aside>
      {open && (
        <div className="admin-drawer-backdrop" onClick={closeMenu}>
          <div className="h-full" onClick={(event) => event.stopPropagation()}>{nav}</div>
        </div>
      )}
    </>
  );
}
