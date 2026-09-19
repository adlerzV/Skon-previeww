"use client";

import Link from "next/link";
import { Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminContext } from "./AdminContext";

type Notification = {
  databaseId: number;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function AdminNotificationsBell() {
  const { summary } = useAdminContext();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const loadingRef = useRef(false);

  const load = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const response = await fetch("/api/admin/notifications?unreadOnly=false", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setItems(Array.isArray(data.notifications) ? data.notifications : []);
      setLoaded(true);
    } catch {
      // اعلان‌ها نباید روی رندر پنل اثر بگذارند.
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (!open) return;
    void load();
    const id = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(id);
  }, [open]);

  const unread = loaded ? items.filter((item) => !item.isRead).length : summary.unreadNotificationsCount;

  const markAll = async () => {
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds: [] }),
    });
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="admin-icon-button"
        aria-label="اعلان‌ها"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-0 right-0 admin-notification-count">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="بستن اعلان‌ها" onClick={() => setOpen(false)} />
          <div className="admin-notification-popover">
            <div className="admin-popover-head">
              <div className="text-xs font-black text-white">اعلان‌ها</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={markAll} className="admin-popover-action">
                  <Check size={12} /> همه را خوانده‌شده کن
                </button>
                <button type="button" onClick={() => setOpen(false)} className="admin-popover-close" aria-label="بستن">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {items.slice(0, 20).map((notification) => (
                <div key={notification.databaseId} className={`p-3 border-b border-brand-surface_hover ${notification.isRead ? "" : "bg-brand-blue/5"}`}>
                  {notification.link ? (
                    <Link prefetch={false} href={notification.link} onClick={() => setOpen(false)} className="block">
                      <div className="text-xs font-black text-white">{notification.title}</div>
                      <div className="text-[11px] text-brand-m_khonsa mt-1 leading-5">{notification.body}</div>
                    </Link>
                  ) : (
                    <>
                      <div className="text-xs font-black text-white">{notification.title}</div>
                      <div className="text-[11px] text-brand-m_khonsa mt-1 leading-5">{notification.body}</div>
                    </>
                  )}
                  <div className="text-[10px] text-brand-m_khonsa mt-2" dir="ltr">{new Date(notification.createdAt).toLocaleString("fa-IR")}</div>
                </div>
              ))}
              {items.length === 0 && <div className="p-8 text-center text-xs text-brand-m_khonsa">{loaded ? "اعلانی برای نمایش وجود ندارد." : "در حال دریافت اعلان‌ها…"}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
