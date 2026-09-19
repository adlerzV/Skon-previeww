import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

export function AdminPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`admin-page ${className}`}>{children}</div>;
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
    <div className="admin-page-intro">
      <div className="min-w-0">
        {eyebrow && <div className="admin-eyebrow">{eyebrow}</div>}
        <h1 className="admin-title">{title}</h1>
        {description && <p className="admin-description">{description}</p>}
      </div>
      {action && <div className="admin-page-actions">{action}</div>}
    </div>
  );
}

export function AdminRefreshButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className="admin-button admin-button-muted">
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      بروزرسانی
    </button>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`admin-card ${className}`}>{children}</section>;
}

export function AdminStatCard({ label, value, helper, tone = "default" }: { label: string; value: string | number; helper?: string; tone?: "default" | "warning" | "success" }) {
  return (
    <div className={`admin-stat admin-stat-${tone}`}>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{typeof value === "number" ? value.toLocaleString("fa-IR") : value}</div>
      {helper && <div className="admin-stat-helper">{helper}</div>}
    </div>
  );
}

export function AdminEmpty({ title = "موردی پیدا نشد.", description }: { title?: string; description?: string }) {
  return (
    <div className="admin-empty">
      <div className="admin-empty-title">{title}</div>
      {description && <div className="admin-empty-description">{description}</div>}
    </div>
  );
}

export function AdminBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "info" | "success" | "warning" | "danger" }) {
  return <span className={`admin-badge admin-badge-${tone}`}>{children}</span>;
}
