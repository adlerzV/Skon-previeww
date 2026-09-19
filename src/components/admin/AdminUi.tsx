import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { RefreshCw, Search } from "lucide-react";

const buttonBase = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[6px] px-3.5 text-xs font-black transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30";
const fieldBase = "w-full min-h-10 rounded-[6px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 placeholder:text-brand-m_khonsa";

export function AdminPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1500px] ${className}`}>{children}</div>;
}

export function AdminPageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-[9px] font-black tracking-[0.14em] text-brand-blue">{eyebrow}</div>}
        <h1 className="text-[clamp(21px,2.2vw,28px)] font-black leading-tight tracking-[-0.03em] text-white">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[11px] leading-6 text-brand-m_khonsa sm:text-xs">{description}</p>}
      </div>
      {action && <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">{action}</div>}
    </div>
  );
}

export function AdminBackLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} prefetch={false} className="inline-flex items-center gap-2 text-xs font-bold text-brand-m_khonsa transition hover:text-white">{children}</Link>;
}

export function AdminButton({ variant = "secondary", className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variantClass = {
    primary: "bg-brand-blue text-white shadow-[0_6px_24px_rgba(0,119,255,.12)] hover:brightness-110",
    secondary: "border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover",
    danger: "border border-red-400/20 bg-red-500/5 text-red-200 hover:bg-red-500/10",
    ghost: "bg-transparent text-brand-m_khonsa hover:bg-white/[.04] hover:text-white",
  }[variant];
  return <button type="button" className={`${buttonBase} ${variantClass} ${className}`} {...props}>{children}</button>;
}

export function AdminRefreshButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return <AdminButton onClick={onClick} disabled={loading}><RefreshCw size={14} className={loading ? "animate-spin" : ""} /> بروزرسانی</AdminButton>;
}

export function AdminCard({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`rounded-[7px] border border-brand-surface_hover bg-brand-surface shadow-[0_10px_30px_rgba(0,0,0,.06)] ${className}`}>{children}</section>;
}

export function AdminSectionHeader({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/[.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-brand-blue/10 text-brand-blue">{icon}</span>}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-black text-white">{title}</h2>
          {description && <p className="mt-1 text-[10px] leading-5 text-brand-m_khonsa">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AdminFilterBar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <AdminCard className={`mb-4 p-3 ${className}`}><div className="flex flex-col gap-2 lg:flex-row lg:items-center">{children}</div></AdminCard>;
}

export function AdminSearchInput({ value, onChange, onEnter, placeholder }: { value: string; onChange: (value: string) => void; onEnter?: () => void; placeholder: string }) {
  return (
    <label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-[6px] border border-brand-surface_hover bg-brand-bg px-3 transition focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20">
      <Search size={15} className="shrink-0 text-brand-m_khonsa" />
      <input value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onEnter?.()} placeholder={placeholder} className="w-full border-0 bg-transparent px-0 text-xs text-white outline-none placeholder:text-brand-m_khonsa" />
    </label>
  );
}

export function AdminField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldBase} ${className}`} {...props} />;
}

export function AdminSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldBase} ${className}`} {...props} />;
}

export function AdminTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldBase} min-h-24 py-3 ${className}`} {...props} />;
}

export function AdminTable({ children, minWidth = "1000px", className = "" }: { children: ReactNode; minWidth?: string; className?: string }) {
  return (
    <div className={`hidden overflow-x-auto rounded-[7px] border border-brand-surface_hover bg-brand-surface lg:block ${className}`}>
      <table style={{ minWidth }} className="w-full border-collapse text-right [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-white/[.06] [&_th]:px-3.5 [&_th]:py-3.5 [&_th]:text-[9px] [&_th]:font-black [&_th]:text-brand-m_khonsa [&_td]:border-b [&_td]:border-white/[.055] [&_td]:px-3.5 [&_td]:py-3.5 [&_td]:align-middle [&_tr:last-child_td]:border-b-0 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-white/[.018]">{children}</table>
    </div>
  );
}

export function AdminMobileList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-2 lg:hidden ${className}`}>{children}</div>;
}

export function AdminListCard({ children, href, className = "" }: { children: ReactNode; href?: string; className?: string }) {
  const classes = `block rounded-[7px] border border-brand-surface_hover bg-brand-surface p-4 shadow-[0_8px_24px_rgba(0,0,0,.06)] transition hover:border-brand-blue/20 hover:bg-white/[.018] ${className}`;
  return href ? <Link href={href} prefetch={false} className={classes}>{children}</Link> : <div className={classes}>{children}</div>;
}

export function AdminStatCard({ label, value, helper, tone = "default" }: { label: string; value: string | number; helper?: string; tone?: "default" | "info" | "warning" | "success" }) {
  const toneClass = { default: "border-brand-surface_hover", info: "border-brand-blue/20", warning: "border-brand-zard/20", success: "border-brand-sabz/20" }[tone];
  return <div className={`min-w-0 rounded-[7px] border bg-brand-surface p-4 shadow-[0_8px_24px_rgba(0,0,0,.05)] ${toneClass}`}><div className="text-[10px] font-black text-brand-m_khonsa">{label}</div><div className="mt-2 text-[22px] font-black tracking-[-0.03em] text-white sm:text-2xl">{typeof value === "number" ? value.toLocaleString("fa-IR") : value}</div>{helper && <div className="mt-1 text-[10px] text-brand-m_khonsa">{helper}</div>}</div>;
}

export function AdminEmpty({ title = "موردی پیدا نشد.", description }: { title?: string; description?: string }) {
  return <div className="rounded-[7px] border border-dashed border-brand-surface_hover bg-white/[.012] px-5 py-11 text-center"><div className="text-xs font-black text-brand-white">{title}</div>{description && <div className="mt-1 text-[10px] text-brand-m_khonsa">{description}</div>}</div>;
}

export function AdminBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "info" | "success" | "warning" | "danger" }) {
  const toneClass = { neutral: "bg-white/[.06] text-brand-m_khonsa", info: "bg-brand-blue/10 text-blue-200", success: "bg-brand-sabz/10 text-emerald-200", warning: "bg-brand-zard/10 text-amber-200", danger: "bg-red-500/10 text-red-200" }[tone];
  return <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-[9px] font-black whitespace-nowrap ${toneClass}`}>{children}</span>;
}

export function AdminFieldRow({ label, value, ltr = true }: { label: string; value: ReactNode; ltr?: boolean }) {
  return <div className="flex items-start justify-between gap-3 border-b border-brand-surface_hover py-2.5 last:border-0"><span className="shrink-0 text-[10px] text-brand-m_khonsa">{label}</span><span className="text-left text-[11px] font-bold text-white break-all" dir={ltr ? "ltr" : undefined}>{value}</span></div>;
}
