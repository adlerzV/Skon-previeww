"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ClipboardCheck, LifeBuoy, RefreshCw } from "lucide-react";
import { useAdminContext } from "./AdminContext";

interface AdminSummaryData {
  user: { id: string; databaseId: number; name: string; email: string; avatarUrl: string | null };
  permissions: string[];
  summary: { openTicketsCount: number; pendingReviewsCount: number; processingOrdersCount: number; unreadNotificationsCount: number };
  tickets: Array<{ id: string; databaseId: number; title: string; date?: string; linkedOrderId?: number | null; customerName?: string | null }>;
}

const EMPTY_DATA: AdminSummaryData = {
  user: { id: "", databaseId: 0, name: "", email: "", avatarUrl: null },
  permissions: [],
  summary: { openTicketsCount: 0, pendingReviewsCount: 0, processingOrdersCount: 0, unreadNotificationsCount: 0 },
  tickets: [],
};

export default function AdminDashboard() {
  const { user, permissions } = useAdminContext();
  const [data, setData] = useState<AdminSummaryData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const response = await fetch("/api/admin/summary", { cache: "no-store" });
      if (!response.ok) return;
      const next = await response.json();
      setData(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const effectivePermissions = data.permissions.length ? data.permissions : permissions;
  const displayName = data.user.name || user?.name || "مدیر";

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="text-[11px] text-brand-blue font-black">مرکز عملیات</div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">پیشخوان مدیریت</h1>
          <p className="text-xs text-brand-m_khonsa mt-2">سلام {displayName}؛ وضعیت عملیاتی فعلی را اینجا می‌بینی.</p>
        </div>
        <button type="button" onClick={refresh} disabled={refreshing} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-surface_hover text-xs font-bold text-white hover:bg-brand-surface_hover disabled:opacity-60">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> بروزرسانی
        </button>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-3"><AlertCircle size={16} className="text-brand-zard" /><h2 className="text-sm font-black text-white">نیازمند اقدام</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <AttentionCard href="/admin/tickets" count={data.summary.openTicketsCount} label="تیکت باز" icon={<LifeBuoy size={18} />} permission="tickets.read" permissions={effectivePermissions} loading={loading} />
          <AttentionCard href="/admin/reviews" count={data.summary.pendingReviewsCount} label="دیدگاه در انتظار بررسی" icon={<ClipboardCheck size={18} />} permission="reviews.moderate" permissions={effectivePermissions} loading={loading} />
          <InfoCard label="سفارش در حال پردازش" value={loading ? "—" : data.summary.processingOrdersCount.toLocaleString("fa-IR")} />
          <InfoCard label="اعلان‌های خوانده‌نشده" value={loading ? "—" : data.summary.unreadNotificationsCount.toLocaleString("fa-IR")} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className="bg-brand-surface border border-brand-surface_hover p-5 min-h-[320px]">
          <div className="flex items-center justify-between border-b border-brand-surface_hover pb-3 mb-2">
            <div><div className="text-sm font-black text-white">تیکت‌های باز اخیر</div><div className="text-[11px] text-brand-m_khonsa mt-1">داده‌های عملیاتی از BTL Engine</div></div>
            <Link href="/admin/tickets" className="text-xs text-brand-blue hover:text-white font-bold">مشاهده همه</Link>
          </div>
          {loading ? <div className="h-[240px] flex items-center justify-center text-xs text-brand-m_khonsa">در حال دریافت اطلاعات...</div> : data.tickets.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-xs text-brand-m_khonsa">تیکت بازی وجود ندارد.</div>
          ) : (
            <div className="flex flex-col">
              {data.tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-4 py-3 border-b border-brand-surface_hover last:border-0">
                  <div className="min-w-0"><div className="text-sm font-bold text-white truncate">{ticket.title}</div><div className="flex flex-wrap gap-2 mt-1 text-[10px] text-brand-m_khonsa">{ticket.customerName && <span>{ticket.customerName}</span>}{ticket.linkedOrderId && <span>سفارش #{ticket.linkedOrderId}</span>}</div></div>
                  <div className="text-[10px] text-brand-m_khonsa shrink-0" dir="ltr">{ticket.date ? new Date(ticket.date).toLocaleDateString("fa-IR") : "—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-brand-surface border border-brand-surface_hover p-5 min-h-[320px]">
          <div className="text-sm font-black text-white">وضعیت زیرساخت مدیریت</div>
          <div className="text-[11px] text-brand-m_khonsa mt-1 mb-4">پوسته مدیریت بلافاصله نمایش داده می‌شود و داده‌های زنده در پس‌زمینه دریافت می‌شوند.</div>
          <div className="space-y-2">
            <StatusRow label="احراز هویت مدیریت" value="فعال" />
            <StatusRow label="اتصال نشست" value="فعال" />
            <StatusRow label="مجوزهای تفکیکی" value={loading ? "—" : `${effectivePermissions.length} مجوز`} />
            <StatusRow label="مسیرهای BFF مدیریت" value="فعال" />
            <StatusRow label="ذخیره حسابرسی" value="فعال" />
            <StatusRow label="سفارش و تکمیل" value="فعال" />
            <StatusRow label="برد طلا" value="فاز ۴" />
          </div>
        </div>
      </section>
    </div>
  );
}

function AttentionCard({ href, count, label, icon, permission, permissions, loading }: { href: string; count: number; label: string; icon: React.ReactNode; permission: string; permissions: string[]; loading: boolean }) {
  if (loading) return <InfoCard label={label} value="—" icon={icon} />;
  if (!permissions.includes(permission)) return <InfoCard label={label} value="بدون دسترسی" icon={icon} />;
  return <Link href={href} className="bg-brand-surface hover:bg-brand-surface_hover border border-brand-surface_hover p-4 transition-colors"><div className="flex items-center justify-between"><span className="w-9 h-9 flex items-center justify-center bg-brand-zard/10 text-brand-zard">{icon}</span><span className="text-2xl font-black text-white">{count.toLocaleString("fa-IR")}</span></div><div className="text-xs text-brand-m_khonsa mt-3">{label}</div></Link>;
}
function InfoCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div className="bg-brand-surface border border-brand-surface_hover p-4"><div className="flex items-center justify-between gap-3"><div className="text-[11px] text-brand-m_khonsa">{label}</div>{icon && <span className="text-brand-zard">{icon}</span>}</div><div className="text-lg font-black text-white mt-2">{value}</div></div>; }
function StatusRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 py-2.5 border-b border-brand-surface_hover last:border-0"><span className="text-xs text-brand-m_khonsa">{label}</span><span className="text-[11px] font-black text-white">{value}</span></div>; }
