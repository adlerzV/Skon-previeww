"use client";
import Link from "next/link";
import { Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Notification = { databaseId: number; type: string; title: string; body: string; link: string | null; isRead: boolean; createdAt: string };

export default function AdminNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const response = await fetch("/api/admin/notifications?unreadOnly=false", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setItems(data.notifications || []);
    }
  };

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const unread = items.filter((item) => !item.isRead).length;
  const markAll = async () => {
    await fetch("/api/admin/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationIds: [] }) });
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div ref={rootRef} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className={`admin-icon-button ${open ? "is-active" : ""}`} aria-label="اعلان‌ها">
        <Bell size={18} />
        {unread > 0 && <span className="admin-notification-count">{unread > 9 ? "۹+" : unread.toLocaleString("fa-IR")}</span>}
      </button>

      {open && (
        <div className="admin-notification-popover" dir="rtl">
          <div className="admin-popover-head">
            <div>
              <div className="text-sm font-black text-white">اعلان‌ها</div>
              <div className="mt-0.5 text-[10px] text-brand-m_khonsa">آخرین رویدادهای عملیاتی</div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => void markAll()} className="admin-popover-action"><Check size={12} /> همه خوانده</button>
              <button type="button" onClick={() => setOpen(false)} className="admin-popover-close" aria-label="بستن"><X size={15} /></button>
            </div>
          </div>
          <div className="max-h-[min(62vh,520px)] overflow-y-auto">
            {items.slice(0, 20).map((item) => {
              const content = (
                <>
                  <div className="text-xs font-black text-white">{item.title}</div>
                  <div className="mt-1 text-[11px] leading-5 text-brand-m_khonsa">{item.body}</div>
                  <div className="mt-2 text-[9px] text-brand-m_khonsa" dir="ltr">{new Date(item.createdAt).toLocaleString("fa-IR")}</div>
                </>
              );
              return item.link ? (
                <Link key={item.databaseId} href={item.link} onClick={() => setOpen(false)} className={`admin-notification-row ${item.isRead ? "" : "is-unread"}`}>{content}</Link>
              ) : (
                <div key={item.databaseId} className={`admin-notification-row ${item.isRead ? "" : "is-unread"}`}>{content}</div>
              );
            })}
            {items.length === 0 && <div className="p-8 text-center text-xs text-brand-m_khonsa">اعلانی وجود ندارد.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
