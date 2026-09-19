"use client";

import Link from "next/link";
import { AlertCircle, ClipboardCheck, LifeBuoy, ShoppingCart, Bell, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminPage, AdminPageIntro, AdminRefreshButton, AdminStatCard } from "./AdminUi";

interface AdminSummaryData {
  user: { id: string; databaseId: number; name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  summary: { openTicketsCount: number; pendingReviewsCount: number; processingOrdersCount: number; unreadNotificationsCount: number };
  tickets: Array<{ id: string; databaseId: number; title: string; date?: string; linkedOrderId?: number | null; customerName?: string | null }>;
}

export default function AdminDashboard({ initialData }: { initialData: AdminSummaryData }) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/summary", { cache: "no-store" });
      if (response.ok) setData(await response.json());
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const id = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const hasTickets = data.permissions.includes("tickets.read");
  const hasReviews = data.permissions.includes("reviews.moderate");

  return (
    <AdminPage>
      <AdminPageIntro
        eyebrow="مرکز عملیات"
        title={`سلام ${data.user.name || "مدیر"}`}
        description="کارهای مهم را از همین‌جا ببین و مستقیم وارد عملیات شو."
        action={<AdminRefreshButton onClick={refresh} loading={refreshing} />}
      />

      <div className="admin-stat-grid">
        <AdminStatCard label="سفارش‌های در حال پردازش" value={data.summary.processingOrdersCount} helper="نیازمند پیگیری" tone="info" />
        <AdminStatCard label="تیکت‌های باز" value={data.summary.openTicketsCount} helper="صف پشتیبانی" tone={data.summary.openTicketsCount ? "warning" : "default"} />
        <AdminStatCard label="دیدگاه‌های منتظر بررسی" value={data.summary.pendingReviewsCount} helper="moderation queue" tone={data.summary.pendingReviewsCount ? "warning" : "default"} />
        <AdminStatCard label="اعلان‌های جدید" value={data.summary.unreadNotificationsCount} helper="رویدادهای خوانده‌نشده" tone={data.summary.unreadNotificationsCount ? "info" : "default"} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <AdminCard className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/[.06] px-4 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-white"><AlertCircle size={15} className="text-brand-zard" /> نیازمند توجه</div>
              <div className="mt-1 text-[10px] text-brand-m_khonsa">مواردی که بهتر است از همین حالا بررسی شوند.</div>
            </div>
          </div>
          <div className="grid gap-px bg-white/[.045] sm:grid-cols-2">
            {hasTickets ? <ActionTile href="/admin/tickets" icon={<LifeBuoy size={17} />} value={data.summary.openTicketsCount} title="تیکت باز" detail="ورود به صف پشتیبانی" /> : null}
            {hasReviews ? <ActionTile href="/admin/reviews" icon={<ClipboardCheck size={17} />} value={data.summary.pendingReviewsCount} title="دیدگاه منتظر بررسی" detail="ورود به صف moderation" /> : null}
            <ActionTile href="/admin/orders" icon={<ShoppingCart size={17} />} value={data.summary.processingOrdersCount} title="سفارش در حال پردازش" detail="بررسی fulfillment" />
            <ActionTile href="/admin" icon={<Bell size={17} />} value={data.summary.unreadNotificationsCount} title="اعلان جدید" detail="باز کردن اعلان‌ها از نوار بالا" />
          </div>
        </AdminCard>

        <AdminCard className="overflow-hidden">
          <div className="border-b border-white/[.06] px-4 py-4">
            <div className="text-sm font-black text-white">آخرین تیکت‌های باز</div>
            <div className="mt-1 text-[10px] text-brand-m_khonsa">فقط مواردی که همین الان در دسترسند.</div>
          </div>
          {data.tickets.length === 0 ? (
            <AdminEmpty title="تیکت بازی وجود ندارد." />
          ) : (
            <div>
              {data.tickets.slice(0, 6).map((ticket) => (
                <Link key={ticket.id} href={`/admin/tickets/${ticket.databaseId}`} className="block border-b border-white/[.055] px-4 py-3 last:border-0 hover:bg-white/[.02]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-black text-white">{ticket.title}</div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-brand-m_khonsa">
                        {ticket.customerName && <span>{ticket.customerName}</span>}
                        {ticket.linkedOrderId && <span>سفارش #{ticket.linkedOrderId}</span>}
                      </div>
                    </div>
                    <ArrowLeft size={14} className="mt-0.5 shrink-0 text-brand-m_khonsa" />
                  </div>
                </Link>
              ))}
              <div className="px-4 py-3">
                <Link href="/admin/tickets" className="text-[11px] font-black text-brand-blue hover:text-white">مشاهده همه تیکت‌ها</Link>
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-brand-m_khonsa">
        <AdminBadge tone="success">احراز هویت</AdminBadge>
        <AdminBadge tone="success">نشست امن</AdminBadge>
        <AdminBadge tone="success">Permission فعال</AdminBadge>
        <span>بخش‌های تخصصی مثل Gold و Engine در صفحات مستقل مدیریت می‌شوند.</span>
      </div>
    </AdminPage>
  );
}

function ActionTile({ href, icon, value, title, detail }: { href: string; icon: React.ReactNode; value: number; title: string; detail: string }) {
  return (
    <Link href={href} className="group bg-brand-surface p-4 transition hover:bg-white/[.025]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">{icon}</span>
        <span className="text-2xl font-black text-white">{value.toLocaleString("fa-IR")}</span>
      </div>
      <div className="mt-3 text-xs font-black text-white">{title}</div>
      <div className="mt-1 text-[10px] text-brand-m_khonsa group-hover:text-white">{detail}</div>
    </Link>
  );
}
