"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, KeyRound, RefreshCw, UploadCloud } from "lucide-react";
import { useAdminContext } from "./AdminContext";

interface Row {
  stockId: number;
  productId: number;
  variationId: number;
  productName: string;
  variationName: string;
  status: string;
  orderId: number | null;
  itemId: number | null;
  createdAt: string | null;
  usedAt: string | null;
  failureReason: string | null;
  assignmentAttempts: number;
}
interface Data {
  nodes: Row[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  summary: { available: number; reserved: number; used: number; failed: number; total: number };
}

const LABELS: Record<string, string> = { available: "موجود", reserved: "رزروشده", used: "مصرف‌شده", duplicate: "تکراری", decrypt_failed: "خطای رمزگشایی" };

export default function AdminCdKeysClient() {
  const { permissions } = useAdminContext();
  const [data, setData] = useState<Data>({ nodes: [], pageInfo: { hasNextPage: false, endCursor: null }, summary: { available: 0, reserved: 0, used: 0, failed: 0, total: 0 } });
  const [status, setStatus] = useState("all");
  const [productId, setProductId] = useState("");
  const [variationId, setVariationId] = useState("");
  const [keys, setKeys] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async (after?: string | null) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ status });
      if (productId.trim()) qs.set("productId", productId.trim());
      if (variationId.trim()) qs.set("variationId", variationId.trim());
      if (after) qs.set("after", after);
      const response = await fetch(`/api/admin/cdkeys?${qs.toString()}`, { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "خطا در دریافت موجودی");
      setData(json);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در دریافت موجودی");
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const importKeys = async () => {
    if (!productId || !variationId || !keys.trim()) return;
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/admin/cdkeys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "import", productId: Number(productId), variationId: Number(variationId), keys }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "ورود CD Key انجام نشد");
      setMessage(`${json?.adminImportCdKeys?.added ?? 0} کد اضافه شد؛ ${json?.adminImportCdKeys?.rejected ?? 0} مورد رد شد.`);
      setKeys("");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "ورود CD Key انجام نشد"); }
    finally { setLoading(false); }
  };

  if (!permissions.includes("cdkeys.read")) return <div className="text-sm text-red-400">شما مجوز مشاهده CD Keyها را ندارید.</div>;

  return <div className="flex flex-col gap-4">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
      <div><div className="text-[11px] tracking-[0.18em] uppercase font-black text-brand-blue">Engine</div><h1 className="text-2xl font-black text-white mt-1">مدیریت CD Key</h1><p className="text-xs text-brand-m_khonsa mt-2">موجودی و تخصیص کلیدها؛ متن کلیدها در فهرست نمایش داده نمی‌شود.</p></div>
      <button onClick={() => load()} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-surface_hover text-xs font-bold text-white disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""}/> بروزرسانی</button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {[["موجود",data.summary.available], ["رزروشده",data.summary.reserved], ["مصرف‌شده",data.summary.used], ["خطادار",data.summary.failed], ["کل",data.summary.total]].map(([label,value]) => <div key={String(label)} className="bg-brand-surface border border-brand-surface_hover p-4"><div className="text-[10px] text-brand-m_khonsa">{label}</div><div className="text-xl font-black text-white mt-1" dir="ltr">{value}</div></div>)}
    </div>

    {permissions.includes("cdkeys.write") && <section className="bg-brand-surface border border-brand-surface_hover p-5">
      <div className="flex items-center gap-2 mb-3"><UploadCloud size={17} className="text-brand-blue"/><h2 className="text-sm font-black text-white">افزودن موجودی</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2"><input value={productId} onChange={e=>setProductId(e.target.value)} placeholder="شناسه محصول" className="bg-brand-bg border border-brand-surface_hover px-3 py-2.5 text-xs text-white outline-none" dir="ltr"/><input value={variationId} onChange={e=>setVariationId(e.target.value)} placeholder="شناسه Variation" className="bg-brand-bg border border-brand-surface_hover px-3 py-2.5 text-xs text-white outline-none" dir="ltr"/></div>
      <textarea value={keys} onChange={e=>setKeys(e.target.value)} rows={5} placeholder="هر CD Key در یک خط" className="mt-2 w-full bg-brand-bg border border-brand-surface_hover p-3 text-xs text-white outline-none" dir="ltr"/>
      <div className="mt-2 flex items-center gap-3"><button onClick={importKeys} disabled={loading || !productId || !variationId || !keys.trim()} className="px-4 py-2.5 bg-brand-blue text-white text-xs font-black disabled:opacity-50">افزودن به موجودی</button>{message && <div className="text-xs text-brand-m_khonsa">{message}</div>}</div>
    </section>}

    <section className="bg-brand-surface border border-brand-surface_hover overflow-x-auto">
      <div className="p-4 border-b border-brand-surface_hover flex flex-col md:flex-row gap-2"><select value={status} onChange={e=>setStatus(e.target.value)} className="bg-brand-bg border border-brand-surface_hover px-3 py-2.5 text-xs text-white"><option value="all">همه وضعیت‌ها</option><option value="available">موجود</option><option value="reserved">رزروشده</option><option value="used">مصرف‌شده</option><option value="duplicate">تکراری</option><option value="decrypt_failed">خطای رمزگشایی</option></select><button onClick={()=>load()} className="px-4 py-2.5 bg-brand-blue text-white text-xs font-black">اعمال فیلتر</button></div>
      <table className="min-w-[1100px] w-full text-right"><thead><tr className="border-b border-brand-surface_hover text-[10px] text-brand-m_khonsa"><th className="p-3">شناسه</th><th className="p-3">محصول</th><th className="p-3">Variation</th><th className="p-3">وضعیت</th><th className="p-3">سفارش</th><th className="p-3">تاریخ</th><th className="p-3">تلاش تخصیص</th></tr></thead><tbody>{data.nodes.map(row=><tr key={row.stockId} className="border-b border-brand-surface_hover last:border-0"><td className="p-3 text-xs text-white" dir="ltr">#{row.stockId}</td><td className="p-3"><div className="text-xs text-white font-bold">{row.productName}</div><div className="text-[10px] text-brand-m_khonsa" dir="ltr">{row.productId}</div></td><td className="p-3"><div className="text-xs text-white">{row.variationName}</div><div className="text-[10px] text-brand-m_khonsa" dir="ltr">{row.variationId}</div></td><td className="p-3 text-xs"><span className="px-2 py-1 bg-white/5 text-white">{LABELS[row.status] ?? row.status}</span></td><td className="p-3 text-xs text-white" dir="ltr">{row.orderId ? `#${row.orderId}` : "—"}</td><td className="p-3 text-[10px] text-brand-m_khonsa" dir="ltr">{row.createdAt ? new Date(row.createdAt).toLocaleString("fa-IR") : "—"}</td><td className="p-3 text-xs text-white" dir="ltr">{row.assignmentAttempts}</td></tr>)}</tbody></table>
      {data.nodes.length === 0 && <div className="p-10 text-center text-xs text-brand-m_khonsa"><KeyRound size={20} className="mx-auto mb-2 opacity-50"/>موردی پیدا نشد.</div>}
    </section>
    {data.pageInfo.hasNextPage && <div className="flex justify-center"><button onClick={()=>load(data.pageInfo.endCursor)} className="inline-flex items-center gap-2 border border-brand-surface_hover bg-brand-surface px-4 py-2.5 text-xs font-bold text-white"><ChevronLeft size={15}/> صفحه بعد</button></div>}
  </div>;
}
