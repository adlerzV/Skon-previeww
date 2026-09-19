"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, KeyRound, Plus, Save } from "lucide-react";
import { useAdminContext } from "./AdminContext";

interface OrderItem {
  databaseId: number;
  productId: number;
  variationId: number;
  productName: string;
  quantity: number;
  deliveryMethod: string;
  deliveredQuantity: number;
  fulfillmentStatus: string;
}
interface Order {
  databaseId:number; orderNumber:string; status:string; paymentStatus:string; fulfillmentStatus:string; total:string; currency:string; date:string;
  customerId:number|null; customerName:string; customerEmail:string; linkedTicketIds:number[];
  items:OrderItem[]; notes:Array<{id:number;content:string;date:string;author:string}>;
}

const ORDER_STATUS_LABELS: Record<string,string> = { pending:"در انتظار", processing:"در حال پردازش", "on-hold":"در انتظار اقدام", completed:"تکمیل‌شده", cancelled:"لغوشده", refunded:"مستردشده", failed:"ناموفق" };
const PAYMENT_STATUS_LABELS: Record<string,string> = { paid:"پرداخت‌شده", unpaid:"پرداخت‌نشده" };
const FULFILLMENT_STATUS_LABELS: Record<string,string> = { queued:"در صف", processing:"در حال تکمیل", completed:"تکمیل کامل" };

export default function AdminOrderDetail({ order: initialOrder, id }: { order?: Order; id: number }) {
  const { permissions } = useAdminContext();
  const [order, setOrder] = useState<Order | null>(initialOrder ?? null);
  const [status, setStatus] = useState(initialOrder?.status ?? "processing");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(!initialOrder);
  const [saving, setSaving] = useState(false);
  const [fulfillLoading, setFulfillLoading] = useState<number | null>(null);
  const [cdkeyBusy, setCdkeyBusy] = useState<number | null>(null);
  const [manualKeys, setManualKeys] = useState<Record<number,string>>({});
  const [assignQty, setAssignQty] = useState<Record<number,number>>({});
  const [revealed, setRevealed] = useState<Record<number,string[]>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrder) return;
    fetch(`/api/admin/orders/${id}`, { cache: "no-store" })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data?.error || "سفارش یافت نشد"); setOrder(data); setStatus(data.status); })
      .catch(reason => setError(reason instanceof Error ? reason.message : "خطا در دریافت سفارش"))
      .finally(() => setLoading(false));
  }, [id, initialOrder]);

  const reload = async () => {
    if (!order) return;
    const response = await fetch(`/api/admin/orders/${order.databaseId}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setOrder(data); setStatus(data.status);
  };

  const postOrder = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/admin/orders", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "عملیات سفارش انجام نشد");
    return data;
  };

  const postCdKey = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/admin/cdkeys", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "عملیات CD Key انجام نشد");
    return data;
  };

  const addNote = async () => {
    if (!order || !note.trim()) return;
    setSaving(true); setError("");
    try { await postOrder({action:"addNote",orderId:order.databaseId,content:note}); setNote(""); await reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "ذخیره یادداشت انجام نشد"); }
    finally { setSaving(false); }
  };

  const updateStatus = async () => {
    if (!order) return;
    setSaving(true); setError("");
    try { await postOrder({action:"updateStatus",orderId:order.databaseId,status}); await reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "تغییر وضعیت انجام نشد"); }
    finally { setSaving(false); }
  };

  const updateFulfillment = async (itemId:number, next:string) => {
    if (!order) return;
    setFulfillLoading(itemId); setError("");
    try { await postOrder({action:"updateFulfillment",orderId:order.databaseId,itemId,status:next}); await reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "تکمیل آیتم انجام نشد"); }
    finally { setFulfillLoading(null); }
  };

  const assignFromStock = async (item:OrderItem) => {
    if (!order) return;
    const quantity = Math.max(1, Math.min(item.quantity - item.deliveredQuantity, Number(assignQty[item.databaseId] || 1)));
    setCdkeyBusy(item.databaseId); setError("");
    try { await postCdKey({action:"assign",orderId:order.databaseId,itemId:item.databaseId,quantity}); await reload(); setAssignQty(prev=>({...prev,[item.databaseId]:1})); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "تخصیص CD Key انجام نشد"); }
    finally { setCdkeyBusy(null); }
  };

  const assignManual = async (item:OrderItem) => {
    if (!order) return;
    const value = String(manualKeys[item.databaseId] || "").trim();
    if (!value) return;
    setCdkeyBusy(item.databaseId); setError("");
    try { await postCdKey({action:"manualAssign",orderId:order.databaseId,itemId:item.databaseId,key:value}); setManualKeys(prev=>({...prev,[item.databaseId]:""})); await reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "تخصیص دستی CD Key انجام نشد"); }
    finally { setCdkeyBusy(null); }
  };

  const revealKeys = async (item:OrderItem) => {
    if (!order) return;
    setCdkeyBusy(item.databaseId); setError("");
    try { const data = await postCdKey({action:"reveal",orderId:order.databaseId,itemId:item.databaseId}); setRevealed(prev=>({...prev,[item.databaseId]:Array.isArray(data?.adminRevealCdKeys?.values) ? data.adminRevealCdKeys.values : []})); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "نمایش CD Key انجام نشد"); }
    finally { setCdkeyBusy(null); }
  };

  return <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3"><Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-brand-m_khonsa hover:text-white"><ArrowRight size={15}/> بازگشت به سفارش‌ها</Link><div className="text-xs text-brand-m_khonsa">جزئیات سفارش</div></div>
    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-4">{error}</div>}
    {!order ? <StaticCard title="اطلاعات سفارش" loading={loading}/> : <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
      <div className="space-y-4">
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><div className="flex items-center justify-between border-b border-brand-surface_hover pb-3"><div><h1 className="text-xl font-black text-white">سفارش #{order.orderNumber}</h1><div className="text-[11px] text-brand-m_khonsa mt-1" dir="ltr">{order.date ? new Date(order.date).toLocaleString("fa-IR") : "—"}</div></div><div className="text-left"><div className="text-[10px] text-brand-m_khonsa">مبلغ</div><div className="text-lg font-black text-white" dir="ltr">{order.total} {order.currency}</div></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"><Stat label="وضعیت" value={ORDER_STATUS_LABELS[order.status] ?? order.status}/><Stat label="پرداخت" value={PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}/><Stat label="تکمیل سفارش" value={FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus] ?? order.fulfillmentStatus}/><Stat label="مشتری" value={order.customerName || "—"}/></div></section>

        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white mb-3">اقلام سفارش</h2><div className="divide-y divide-brand-surface_hover">{order.items.map(item => <div key={item.databaseId} className="py-4 flex flex-col gap-3"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3"><div><div className="text-xs font-black text-white">{item.productName}</div><div className="text-[10px] text-brand-m_khonsa mt-1">شناسه {item.databaseId} · {item.deliveryMethod === "code" ? "CD Key" : item.deliveryMethod} · {item.quantity} عدد</div></div><div className="flex items-center gap-3 text-xs"><span className="text-brand-m_khonsa">{item.deliveredQuantity}/{item.quantity}</span><span className="text-white font-bold">{FULFILLMENT_STATUS_LABELS[item.fulfillmentStatus] ?? item.fulfillmentStatus}</span>{permissions.includes("orders.fulfill") && item.deliveryMethod !== "code" && item.fulfillmentStatus !== "completed" && <button disabled={fulfillLoading===item.databaseId} onClick={()=>updateFulfillment(item.databaseId,"completed")} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-blue text-white text-[11px] font-black"><Save size={12}/>{fulfillLoading===item.databaseId?"...":"تکمیل"}</button>}</div></div>
          {item.deliveryMethod === "code" && permissions.includes("cdkeys.read") && <div className="border border-brand-surface_hover bg-brand-bg/60 p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><KeyRound size={15} className="text-brand-blue"/><div><div className="text-xs font-black text-white">تحویل CD Key</div><div className="text-[10px] text-brand-m_khonsa mt-1">تخصیص‌شده: {item.deliveredQuantity} از {item.quantity}</div></div></div>{item.deliveredQuantity >= item.quantity && permissions.includes("cdkeys.reveal") && <button onClick={()=>revealKeys(item)} disabled={cdkeyBusy===item.databaseId} className="inline-flex items-center gap-1 px-3 py-2 border border-brand-surface_hover text-xs font-bold text-white"><Eye size={13}/> نمایش کدها</button>}</div>
            {permissions.includes("cdkeys.write") && item.deliveredQuantity < item.quantity && order.paymentStatus === "paid" && <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_auto] gap-2 mt-3"><input type="number" min={1} max={item.quantity-item.deliveredQuantity} value={assignQty[item.databaseId] ?? 1} onChange={e=>setAssignQty(prev=>({...prev,[item.databaseId]:Number(e.target.value)}))} className="bg-brand-surface border border-brand-surface_hover px-3 py-2.5 text-xs text-white"/><div className="flex items-center border border-brand-surface_hover px-3 text-[11px] text-brand-m_khonsa">رزرو و تخصیص از موجودی داخلی</div><button onClick={()=>assignFromStock(item)} disabled={cdkeyBusy===item.databaseId} className="px-4 py-2.5 bg-brand-blue text-white text-xs font-black">تخصیص</button></div>}
            {permissions.includes("cdkeys.write") && item.deliveredQuantity < item.quantity && order.paymentStatus === "paid" && <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2 mt-2"><input value={manualKeys[item.databaseId] ?? ""} onChange={e=>setManualKeys(prev=>({...prev,[item.databaseId]:e.target.value}))} placeholder="ثبت دستی یک CD Key" className="bg-brand-surface border border-brand-surface_hover px-3 py-2.5 text-xs text-white outline-none" dir="ltr"/><button onClick={()=>assignManual(item)} disabled={cdkeyBusy===item.databaseId || !String(manualKeys[item.databaseId]||"").trim()} className="px-4 py-2.5 border border-brand-surface_hover text-white text-xs font-black">ثبت دستی</button></div>}
            {revealed[item.databaseId]?.length ? <div className="mt-3 space-y-2">{revealed[item.databaseId].map((value,index)=><div key={`${item.databaseId}-${index}`} className="bg-black/30 border border-red-500/20 p-3 text-xs text-white" dir="ltr">{value}</div>)}</div> : null}
            {item.deliveredQuantity < item.quantity && order.paymentStatus !== "paid" && <div className="mt-3 text-[11px] text-brand-zard">برای تخصیص CD Key، سفارش باید پرداخت‌شده باشد.</div>}
          </div>}
        </div>)}</div></section>

        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white mb-3">یادداشت‌های داخلی</h2><div className="space-y-2 mb-4">{order.notes.map(n=><div key={n.id} className="border border-brand-surface_hover p-3"><div className="text-xs text-white whitespace-pre-wrap">{n.content}</div><div className="text-[10px] text-brand-m_khonsa mt-2">{n.author} · {n.date ? new Date(n.date).toLocaleString("fa-IR") : "—"}</div></div>)}{order.notes.length===0&&<div className="text-xs text-brand-m_khonsa">یادداشت داخلی وجود ندارد.</div>}</div>{permissions.includes("orders.write")&&<div className="flex flex-col gap-2"><textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="یادداشت داخلی..." className="w-full bg-brand-bg border border-brand-surface_hover p-3 text-xs text-white outline-none"/><button onClick={addNote} disabled={saving||!note.trim()} className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-xs font-black"><Plus size={14}/> ذخیره یادداشت</button></div>}</section>
      </div>
      <div className="space-y-4"><section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">مشتری</h2><div className="mt-3 space-y-2 text-xs"><Row label="نام" value={order.customerName || "—"}/><Row label="ایمیل" value={order.customerEmail || "—"}/>{order.customerId&&<Link href={`/admin/customers/${order.customerId}`} className="inline-block mt-2 text-brand-blue font-bold">پروفایل مشتری</Link>}</div></section>
        {permissions.includes("orders.write")&&<section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">وضعیت سفارش</h2><select value={status} onChange={e=>setStatus(e.target.value)} className="mt-3 w-full bg-brand-bg border border-brand-surface_hover p-3 text-xs text-white"><option value="pending">در انتظار</option><option value="processing">در حال پردازش</option><option value="on-hold">در انتظار اقدام</option><option value="completed" disabled={order.fulfillmentStatus!=="completed"}>تکمیل‌شده</option><option value="cancelled">لغوشده</option><option value="refunded">مستردشده</option><option value="failed">ناموفق</option></select><button onClick={updateStatus} disabled={saving||status===order.status} className="mt-2 px-4 py-2.5 bg-brand-blue text-white text-xs font-black">ذخیره وضعیت</button></section>}
        <section className="bg-brand-surface border border-brand-surface_hover p-5"><h2 className="text-sm font-black text-white">تیکت‌های مرتبط</h2><div className="mt-3 space-y-2">{order.linkedTicketIds.map(ticketId=><Link key={ticketId} href={`/admin/tickets/${ticketId}`} className="block text-xs text-brand-blue">تیکت #{ticketId}</Link>)}{order.linkedTicketIds.length===0&&<div className="text-xs text-brand-m_khonsa">تیکت مرتبطی ثبت نشده است.</div>}</div></section></div>
    </div>}
  </div>;
}
function StaticCard({title,loading}:{title:string;loading:boolean}){return <div className="bg-brand-surface border border-brand-surface_hover min-h-[260px] flex items-center justify-center text-xs text-brand-m_khonsa">{loading?`${title} در حال دریافت اطلاعات...`:`${title} یافت نشد.`}</div>}
function Stat({label,value}:{label:string;value:string}){return <div className="border border-brand-surface_hover p-3"><div className="text-[10px] text-brand-m_khonsa">{label}</div><div className="text-xs font-black text-white mt-1 break-words">{value}</div></div>}
function Row({label,value}:{label:string;value:string}){return <div className="flex items-start justify-between gap-3 border-b border-brand-surface_hover pb-2"><span className="text-brand-m_khonsa">{label}</span><span className="text-white font-bold text-left break-all" dir="ltr">{value}</span></div>}
