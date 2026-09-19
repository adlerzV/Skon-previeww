import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

const buttonBase = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50";
const buttonMuted = "border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover";

export function AdminPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1500px] ${className}`}>{children}</div>;
}

export function AdminPageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-[10px] font-black tracking-[0.12em] text-brand-blue">{eyebrow}</div>}
        <h1 className="text-[clamp(21px,2.2vw,28px)] font-black leading-tight tracking-[-0.03em] text-white">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[11px] leading-6 text-brand-m_khonsa sm:text-xs">{description}</p>}
      </div>
      {action && <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">{action}</div>}
    </div>
  );
}

export function AdminRefreshButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className={`${buttonBase} ${buttonMuted}`}>
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      بروزرسانی
    </button>
  );
}

export function AdminCard({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`rounded-[5px] border border-brand-surface_hover bg-brand-surface ${className}`}>{children}</section>;
}

export function AdminStatCard({ label, value, helper, tone = "default" }: { label: string; value: string | number; helper?: string; tone?: "default" | "info" | "warning" | "success" }) {
  const toneClass = {
    default: "border-brand-surface_hover",
    info: "border-brand-blue/20",
    warning: "border-brand-zard/20",
    success: "border-brand-sabz/20",
  }[tone];
  return (
    <div className={`min-w-0 rounded-[5px] border bg-brand-surface p-4 ${toneClass}`}>
      <div className="text-[10px] font-black text-brand-m_khonsa">{label}</div>
      <div className="mt-2 text-[22px] font-black tracking-[-0.03em] text-white sm:text-2xl">{typeof value === "number" ? value.toLocaleString("fa-IR") : value}</div>
      {helper && <div className="mt-1 text-[10px] text-brand-m_khonsa">{helper}</div>}
    </div>
  );
}

export function AdminEmpty({ title = "موردی پیدا نشد.", description }: { title?: string; description?: string }) {
  return (
    <div className="rounded-[5px] border border-dashed border-brand-surface_hover bg-white/[.015] px-5 py-11 text-center">
      <div className="text-xs font-black text-brand-white">{title}</div>
      {description && <div className="mt-1 text-[10px] text-brand-m_khonsa">{description}</div>}
    </div>
  );
}

export function AdminBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "info" | "success" | "warning" | "danger" }) {
  const toneClass = {
    neutral: "bg-white/[.06] text-brand-m_khonsa",
    info: "bg-brand-blue/10 text-blue-200",
    success: "bg-brand-sabz/10 text-emerald-200",
    warning: "bg-brand-zard/10 text-amber-200",
    danger: "bg-red-500/10 text-red-200",
  }[tone];
  return <span className={`inline-flex min-h-6 items-center rounded-full px-2 text-[9px] font-black whitespace-nowrap ${toneClass}`}>{children}</span>;
}
