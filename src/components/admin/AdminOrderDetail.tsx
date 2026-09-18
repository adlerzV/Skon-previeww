"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Save, Plus } from "lucide-react";

interface Order { databaseId:number; orderNumber:string; status:string; paymentStatus:string; fulfillmentStatus:string; total:string; currency:string; date:string; customerId:number|null; customerName:string; customerEmail:string; linkedTicketIds:number[]; items:Array<{databaseId:number;productId:number;variationId:number;productName:string;quantity:number;deliveryMethod:string;deliveredQuantity:number;fulfillmentStatus:string}>; notes:Array<{id:number;content:string;date:string;author:string}> }

export default function AdminOrderDetail({ order, permissions }: { order: Order; permissions: string[] }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [fulfillLoading, setFulfillLoading] = useState<number | null>(null);

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error("request_failed");
    return res.json();
  };

  const addNote = async () => { if (!note.trim()) return; setSaving(true); try { await post({ action:"addNote", orderId:order.databaseId, content:note }); setNote(""); window.location.reload(); } finally { setSaving(false); } };
  const updateStatus = async () => { setSaving(true); try { await post({ action:"updateStatus", orderId:order.databaseId, status }); } finally { setSaving(false); } };
  const updateFulfillment = async (itemId:number, next:string) => { setFulfillLoading(itemId); try { await post({ action:"updateFulfillment", orderId:order.databaseId, itemId, status:next }); window.location.reload(); } finally { setFulfillLoading(null); } };

  return <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3"><Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-brand-m_khonsa hover:text-white"><ArrowRight size={15}/> Orders</Link><div className="text-[11px] text-brand-m_khonsa">#{order.orderNumber}</div></div>
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
      <div className="space-y-4">
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><div className="flex items-center justify-between border-b border-brand-surface_hover pb-3"><div><h1 className="text-xl font-black text-white">Order #{order.orderNumber}</h1><div className="text-[11px] text-brand-m_khonsa mt-1" dir="ltr">{order.date ? new Date(order.date).toLocaleString("fa-IR") : "—"}</div></div><div className="text-left"><div className="text-[10px] text-brand-m_khonsa">Total</div><div className="text-lg font-black text-white" dir="ltr">{order.total} {order.currency}</div></div></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"><Stat label="Status" value={order.status}/><Stat label="Payment" value={order.paymentStatus}/><Stat label="Fulfillment" value={order.fulfillmentStatus}/><Stat label="Customer" value={order.customerName || "—"}/></div>
        </section>
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white mb-3">Line Items</h2><div className="divide-y divide-brand-surface_hover">{order.items.map(item => <div key={item.databaseId} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3"><div><div className="text-xs font-black text-white">{item.productName}</div><div className="text-[10px] text-brand-m_khonsa mt-1">#{item.databaseId} · {item.deliveryMethod} · {item.quantity} عدد</div></div><div className="flex items-center gap-3 text-xs"><span className="text-brand-m_khonsa">{item.deliveredQuantity}/{item.quantity}</span><span className="text-white font-bold">{item.fulfillmentStatus}</span>{permissions.includes("orders.fulfill") && item.deliveryMethod !== "code" && item.fulfillmentStatus !== "completed" && <button disabled={fulfillLoading===item.databaseId} onClick={()=>updateFulfillment(item.databaseId,"completed")} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-blue text-white text-[11px] font-black"><Save size={12}/>{fulfillLoading===item.databaseId?"...":"تکمیل"}</button>}</div></div>)}</div><div className="text-[10px] text-brand-m_khonsa mt-3">CD Key fulfillment در Phase 3 مدیریت می‌شود؛ موجودی داخلی در این UI نمایش داده نمی‌شود.</div></section>
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><div className="flex items-center justify-between mb-3"><h2 className="text-sm font-black text-white">Internal Notes</h2></div><div className="space-y-2 mb-4">{order.notes.map(n=><div key={n.id} className="border border-brand-surface_hover p-3"><div className="text-xs text-white whitespace-pre-wrap">{n.content}</div><div className="text-[10px] text-brand-m_khonsa mt-2">{n.author} · {n.date ? new Date(n.date).toLocaleString("fa-IR") : "—"}</div></div>)}{order.notes.length===0&&<div className="text-xs text-brand-m_khonsa">یادداشت داخلی وجود ندارد.</div>}</div>{permissions.includes("orders.write")&&<div className="flex flex-col gap-2"><textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="یادداشت داخلی..." className="w-full bg-brand-bg border border-brand-surface_hover p-3 text-xs text-white outline-none"/><button onClick={addNote} disabled={saving||!note.trim()} className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-xs font-black"><Plus size={14}/> ذخیره یادداشت</button></div>}</section>
      </div>
      <div className="space-y-4">
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">Customer</h2><div className="mt-3 space-y-2 text-xs"><Row label="Name" value={order.customerName || "—"}/><Row label="Email" value={order.customerEmail || "—"}/>{order.customerId&&<Link href={`/admin/customers/${order.customerId}`} className="inline-block mt-2 text-brand-blue font-bold">پروفایل مشتری</Link>}</div></section>
        {permissions.includes("orders.write")&&<section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">Order Status</h2><select value={status} onChange={e=>setStatus(e.target.value)} className="mt-3 w-full bg-brand-bg border border-brand-surface_hover p-3 text-xs text-white"><option value="pending">pending</option><option value="processing">processing</option><option value="on-hold">on-hold</option><option value="completed" disabled={order.fulfillmentStatus!=="completed"}>completed</option><option value="cancelled">cancelled</option><option value="refunded">refunded</option><option value="failed">failed</option></select><button onClick={updateStatus} disabled={saving||status===order.status} className="mt-2 px-4 py-2.5 bg-brand-blue text-white text-xs font-black">ذخیره وضعیت</button></section>}
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">Related Tickets</h2><div className="mt-3 space-y-2">{order.linkedTicketIds.map(id=><Link key={id} href={`/admin/tickets/${id}`} className="block text-xs text-brand-blue">Ticket #{id}</Link>)}{order.linkedTicketIds.length===0&&<div className="text-xs text-brand-m_khonsa">تیکت مرتبطی ثبت نشده است.</div>}</div></section>
      </div>
    </div>
  </div>
}
function Stat({label,value}:{label:string;value:string}){return <div className="border border-brand-surface_hover p-3"><div className="text-[10px] text-brand-m_khonsa">{label}</div><div className="text-xs font-black text-white mt-1 break-words">{value}</div></div>}
function Row({label,value}:{label:string;value:string}){return <div className="flex items-start justify-between gap-3 border-b border-brand-surface_hover pb-2"><span className="text-brand-m_khonsa">{label}</span><span className="text-white font-bold text-left break-all" dir="ltr">{value}</span></div>}
