"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Search, ChevronLeft } from "lucide-react";
import { AdminBadge, AdminCard, AdminEmpty, AdminPage, AdminPageIntro, AdminRefreshButton } from "./AdminUi";

interface OrderNode {
  databaseId: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: string;
  currency: string;
  date: string;
  customerName: string;
  customerEmail: string;
}

const statusLabel: Record<string, string> = { processing: "در حال پردازش", pending: "در انتظار", completed: "تکمیل‌شده", cancelled: "لغوشده", all: "همه" };
const fulfillmentLabel: Record<string, string> = { processing: "در حال پردازش", partially_fulfilled: "ناقص", fulfilled: "تحویل کامل", completed: "تکمیل‌شده", pending: "در انتظار" };

export default function AdminOrdersClient({ initial, permissions = [] }: { initial?: { nodes: OrderNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }; permissions?: string[] }) {
  const empty = { nodes: [] as OrderNode[], pageInfo: { hasNextPage: false, endCursor: null as string | null } };
  const [data, setData] = useState(initial ?? empty);
  const [effectivePermissions, setEffectivePermissions] = useState(permissions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("processing");
  const [loading, setLoading] = useState(false);

  const load = async (after?: string | null) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ status, search });
      if (after) qs.set("after", after);
      const res = await fetch(`/api/admin/orders?${qs.toString()}`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (initial) return;
    void load();
    fetch("/api/admin/context", { cache: "no-store" }).then((res) => res.ok ? res.json() : null).then((ctx) => {
      if (ctx?.permissions) setEffectivePermissions(ctx.permissions);
    }).catch(() => undefined);
  }, []);

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="عملیات" title="سفارش‌ها" description="وضعیت پرداخت و روند تحویل را سریع بررسی کن." action={<AdminRefreshButton onClick={() => load()} loading={loading} />} />

      <AdminCard className="mb-4 p-3">
        <div className="grid gap-2 md:grid-cols-[1fr_170px_110px]">
          <label className="admin-search-wrap">
            <Search size={15} className="text-brand-m_khonsa" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void load()} placeholder="شناسه سفارش، نام یا ایمیل" className="admin-input border-0 bg-transparent px-0 shadow-none focus:shadow-none" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-input">
            <option value="processing">در حال پردازش</option><option value="pending">در انتظار</option><option value="completed">تکمیل‌شده</option><option value="cancelled">لغوشده</option><option value="all">همه</option>
          </select>
          <button type="button" onClick={() => void load()} className="admin-button admin-button-primary">جستجو</button>
        </div>
      </AdminCard>

      <div className="admin-table-wrap desktop-only">
        <table className="admin-table"><thead><tr><th>سفارش</th><th>مشتری</th><th>وضعیت</th><th>پرداخت</th><th>تحویل</th><th>مبلغ</th><th>تاریخ</th><th /></tr></thead>
          <tbody>{data.nodes.map((order) => <tr key={order.databaseId}><td><div className="text-xs font-black text-white">#{order.orderNumber}</div><div className="mt-1 text-[9px] text-brand-m_khonsa">شناسه {order.databaseId}</div></td><td><div className="text-xs font-bold text-white">{order.customerName || "—"}</div><div className="mt-1 text-[9px] text-brand-m_khonsa" dir="ltr">{order.customerEmail || "—"}</div></td><td><AdminBadge tone={order.status === "completed" ? "success" : "info"}>{statusLabel[order.status] ?? order.status}</AdminBadge></td><td><AdminBadge tone={order.paymentStatus === "paid" ? "success" : "warning"}>{order.paymentStatus === "paid" ? "پرداخت‌شده" : order.paymentStatus}</AdminBadge></td><td><span className="text-[11px] text-white">{fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}</span></td><td><span className="text-[11px] font-black text-white" dir="ltr">{order.total} {order.currency}</span></td><td><span className="text-[9px] text-brand-m_khonsa" dir="ltr">{order.date ? new Date(order.date).toLocaleString("fa-IR") : "—"}</span></td><td><Link href={`/admin/orders/${order.databaseId}`} className="inline-flex items-center gap-1 text-[10px] font-black text-brand-blue"><Eye size={14}/> باز کردن</Link></td></tr>)}</tbody>
        </table>
        {data.nodes.length === 0 && <AdminEmpty title="سفارشی با این فیلتر پیدا نشد." />}
      </div>

      <div className="mobile-only-card space-y-2">
        {data.nodes.map((order) => <Link key={order.databaseId} href={`/admin/orders/${order.databaseId}`} className="admin-card block p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-black text-white">#{order.orderNumber}</div><div className="mt-1 text-[10px] text-brand-m_khonsa">{order.customerName || "—"}</div></div><AdminBadge tone={order.status === "completed" ? "success" : "info"}>{statusLabel[order.status] ?? order.status}</AdminBadge></div><div className="mt-4 grid grid-cols-2 gap-3"><Mini label="پرداخت" value={order.paymentStatus === "paid" ? "پرداخت‌شده" : order.paymentStatus}/><Mini label="تحویل" value={fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}/><Mini label="مبلغ" value={`${order.total} ${order.currency}`} ltr/><Mini label="تاریخ" value={order.date ? new Date(order.date).toLocaleDateString("fa-IR") : "—"}/></div></Link>)}
        {data.nodes.length === 0 && <AdminEmpty title="سفارشی پیدا نشد." />}
      </div>

      {data.pageInfo.hasNextPage && <div className="mt-4 flex justify-center"><button type="button" onClick={() => void load(data.pageInfo.endCursor)} disabled={loading} className="admin-button admin-button-muted"><ChevronLeft size={15}/> صفحه بعد</button></div>}
      {!effectivePermissions.includes("orders.write") && <div className="mt-3 text-[10px] text-brand-m_khonsa">این حساب فقط مجوز مشاهده دارد.</div>}
    </AdminPage>
  );
}

function Mini({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) { return <div><div className="text-[9px] text-brand-m_khonsa">{label}</div><div className="mt-1 text-[10px] font-bold text-white" dir={ltr ? "ltr" : undefined}>{value}</div></div>; }
