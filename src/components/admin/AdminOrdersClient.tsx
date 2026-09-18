"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCw, Search, ChevronLeft, Eye } from "lucide-react";

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

export default function AdminOrdersClient({ initial, permissions }: { initial: { nodes: OrderNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }; permissions: string[] }) {
  const [data, setData] = useState(initial);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-3">
        <div>
          <div className="text-[11px] tracking-[0.18em] uppercase font-black text-brand-blue">Operations</div>
          <h1 className="text-2xl font-black text-white mt-1">Orders</h1>
          <p className="text-xs text-brand-m_khonsa mt-2">نمای operational سفارش‌ها؛ بدون exposure اطلاعات حساس.</p>
        </div>
        <button onClick={() => load()} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-surface_hover text-xs font-bold text-white disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /> بروزرسانی</button>
      </div>

      <div className="bg-brand-surface border border-brand-surface_hover p-3 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 border border-brand-surface_hover px-3"><Search size={15} className="text-brand-m_khonsa" /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Order ID / نام / ایمیل" className="w-full bg-transparent py-2.5 text-xs text-white outline-none" /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); }} className="bg-brand-bg border border-brand-surface_hover px-3 py-2.5 text-xs text-white"><option value="processing">Processing</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="all">All</option></select>
        <button onClick={() => load()} className="px-4 py-2.5 bg-brand-blue text-white text-xs font-black">اعمال فیلتر</button>
      </div>

      <div className="bg-brand-surface border border-brand-surface_hover overflow-x-auto">
        <table className="min-w-[900px] w-full text-right"><thead><tr className="border-b border-brand-surface_hover text-[10px] uppercase tracking-wider text-brand-m_khonsa"><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Fulfillment</th><th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3"></th></tr></thead>
          <tbody>{data.nodes.map((order) => <tr key={order.databaseId} className="border-b border-brand-surface_hover last:border-0 hover:bg-white/[0.02]"><td className="p-3"><div className="text-sm font-black text-white">#{order.orderNumber}</div><div className="text-[10px] text-brand-m_khonsa">ID {order.databaseId}</div></td><td className="p-3"><div className="text-xs text-white font-bold">{order.customerName || "—"}</div><div className="text-[10px] text-brand-m_khonsa" dir="ltr">{order.customerEmail || "—"}</div></td><td className="p-3"><span className="px-2 py-1 bg-white/5 text-[10px] text-white">{order.status}</span></td><td className="p-3"><span className={order.paymentStatus === "paid" ? "text-xs text-emerald-400" : "text-xs text-brand-zard"}>{order.paymentStatus}</span></td><td className="p-3"><span className="text-xs text-white">{order.fulfillmentStatus}</span></td><td className="p-3 text-xs text-white font-bold" dir="ltr">{order.total} {order.currency}</td><td className="p-3 text-[10px] text-brand-m_khonsa" dir="ltr">{order.date ? new Date(order.date).toLocaleString("fa-IR") : "—"}</td><td className="p-3"><Link href={`/admin/orders/${order.databaseId}`} className="inline-flex items-center gap-1 text-brand-blue text-xs font-black"><Eye size={14} /> جزئیات</Link></td></tr>)}</tbody>
        </table>
        {data.nodes.length === 0 && <div className="p-10 text-center text-xs text-brand-m_khonsa">سفارشی با این فیلتر پیدا نشد.</div>}
      </div>
      {data.pageInfo.hasNextPage && <div className="flex justify-center"><button onClick={() => load(data.pageInfo.endCursor)} disabled={loading} className="inline-flex items-center gap-2 border border-brand-surface_hover bg-brand-surface px-4 py-2.5 text-xs font-bold text-white"><ChevronLeft size={15} /> صفحه بعد</button></div>}
      {!permissions.includes("orders.write") && <div className="text-[11px] text-brand-m_khonsa">مجوز مشاهده فعال است؛ عملیات تغییردهنده برای این حساب نمایش داده نمی‌شود.</div>}
    </div>
  );
}
