import Link from "next/link";

export default function AdminModulePlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl w-full bg-brand-surface border border-brand-surface_hover p-8 text-center">
        <div className="text-[11px] text-brand-blue font-black">{phase}</div>
        <h1 className="text-2xl font-black text-white mt-2">{title}</h1>
        <p className="text-xs text-brand-m_khonsa leading-7 mt-4">ساختار این بخش در پنل مدیریت آماده است و منطق عملیاتی آن در فاز تعیین‌شده در سند معماری تکمیل می‌شود.</p>
        <Link href="/admin" className="inline-flex mt-5 px-4 py-2.5 bg-brand-blue text-white text-xs font-bold">بازگشت به پیشخوان</Link>
      </div>
    </div>
  );
}
