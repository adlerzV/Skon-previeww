"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ClipboardCheck, LifeBuoy, RefreshCw } from "lucide-react";
import type { AdminPermission } from "@/lib/admin/permissions";

interface AdminSummaryData {
  user: { id: string; databaseId: number; name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  summary: { openTicketsCount: number; pendingReviewsCount: number; processingOrdersCount: number; unreadNotificationsCount: number };
  tickets: Array<{ id: string; databaseId: number; title: string; date?: string; linkedOrderId?: number | null; customerName?: string | null }>;
}

export default function AdminDashboard({ initialData }: { initialData: AdminSummaryData }) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = window.setInterval(async () => {
      try {
        const response = await fetch("/api/admin/summary", { cache: "no-store" });
        if (!response.ok) return;
        setData(await response.json());
      } catch {
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/summary", { cache: "no-store" });
      if (response.ok) setData(await response.json());
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-brand-blue font-black">Operations Center</div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Dashboard</h1>
          <p className="text-xs text-brand-m_khonsa mt-2">سلام {data.user.name}؛ اینجا وضعیت عملیاتی فعلی را می‌بینی.</p>
        </div>
        <button type="button" onClick={refresh} disabled={refreshing} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-surface_hover text-xs font-bold text-white hover:bg-brand-surface_hover disabled:opacity-60">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          بروزرسانی
        </button>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-3"><AlertCircle size={16} className="text-brand-zard" /><h2 className="text-sm font-black text-white">Needs Attention</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <AttentionCard href="/admin/tickets" count={data.summary.openTicketsCount} label="تیکت باز" icon={<LifeBuoy size={18} />} permission="tickets.read" permissions={data.permissions} />
          <AttentionCard href="/admin/reviews" count={data.summary.pendingReviewsCount} label="دیدگاه در انتظار بررسی" icon={<ClipboardCheck size={18} />} permission="reviews.moderate" permissions={data.permissions} />
          <InfoCard label="Processing Orders" value={data.summary.processingOrdersCount.toLocaleString("fa-IR")} />
          <InfoCard label="Admin Notifications" value={data.summary.unreadNotificationsCount.toLocaleString("fa-IR")} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className="bg-brand-surface border border-brand-surface_hover p-5 min-h-[320px]">
          <div className="flex items-center justify-between border-b border-brand-surface_hover pb-3 mb-2">
            <div><div className="text-sm font-black text-white">Recent Open Tickets</div><div className="text-[11px] text-brand-m_khonsa mt-1">فقط داده‌های operational موجود در Engine فعلی</div></div>
            <Link href="/admin/tickets" className="text-xs text-brand-blue hover:text-white font-bold">مشاهده همه</Link>
          </div>
          {data.tickets.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-xs text-brand-m_khonsa">تیکت باز موجود نیست.</div>
          ) : (
            <div className="flex flex-col">
              {data.tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-4 py-3 border-b border-brand-surface_hover last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{ticket.title}</div>
                    <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-brand-m_khonsa">
                      {ticket.customerName && <span>{ticket.customerName}</span>}
                      {ticket.linkedOrderId && <span>Order #{ticket.linkedOrderId}</span>}
                    </div>
                  </div>
                  <div className="text-[10px] text-brand-m_khonsa shrink-0" dir="ltr">{ticket.date ? new Date(ticket.date).toLocaleDateString("fa-IR") : "—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-brand-surface border border-brand-surface_hover p-5 min-h-[320px]">
          <div className="text-sm font-black text-white">Phase 1 Foundation</div>
          <div className="text-[11px] text-brand-m_khonsa mt-1 mb-4">این داشبورد روی داده‌های عملیاتی واقعی Engine سوار است؛ Gold و Engine infrastructure در فازهای بعد تکمیل می‌شوند.</div>
          <div className="space-y-2">
            <StatusRow label="Admin authentication" value="Ready" />
            <StatusRow label="Session binding" value="Ready" />
            <StatusRow label="Granular permissions" value={`${data.permissions.length} permissions`} />
            <StatusRow label="Admin BFF routes" value="Ready" />
            <StatusRow label="Audit storage" value="Ready" />
            <StatusRow label="Orders / Fulfillment" value="Ready" />
            <StatusRow label="Gold Board" value="Phase 4" />
          </div>
        </div>
      </section>
    </div>
  );
}

function AttentionCard({ href, count, label, icon, permission, permissions }: { href: string; count: number; label: string; icon: React.ReactNode; permission: AdminPermission | string; permissions: string[] }) {
  if (!permissions.includes(permission)) return <InfoCard label={label} value="No access" />;
  return <Link href={href} className="bg-brand-surface hover:bg-brand-surface_hover border border-brand-surface_hover p-4 transition-colors"><div className="flex items-center justify-between"><span className="w-9 h-9 flex items-center justify-center bg-brand-zard/10 text-brand-zard">{icon}</span><span className="text-2xl font-black text-white">{count.toLocaleString("fa-IR")}</span></div><div className="text-xs text-brand-m_khonsa mt-3">{label}</div></Link>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="bg-brand-surface border border-brand-surface_hover p-4"><div className="text-[11px] text-brand-m_khonsa">{label}</div><div className="text-lg font-black text-white mt-2">{value}</div></div>;
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 py-2.5 border-b border-brand-surface_hover last:border-0"><span className="text-xs text-brand-m_khonsa">{label}</span><span className="text-[11px] font-black text-white">{value}</span></div>;
}
