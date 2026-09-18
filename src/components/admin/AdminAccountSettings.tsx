"use client";

import { useEffect, useState } from "react";
import AvatarPicker from "@/components/account/AvatarPicker";
import ProfileEditForm from "@/components/account/ProfileEditForm";
import SetPasswordForm from "@/components/account/SetPasswordForm";
import SessionsList from "@/components/account/SessionsList";

interface SettingsData {
  user: {
    avatarId: string | null;
    avatarUrl: string | null;
    name: string;
    email: string;
    isStaff: boolean;
    hasManualPassword: boolean;
  };
  sessions: Array<{ sessionId: string; deviceLabel?: string; ipAddress?: string; lastActive?: string; createdAt?: string }>;
  currentSessionId: string | null;
}

export default function AdminAccountSettings() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/account-settings", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error || "خطا در دریافت تنظیمات حساب");
        setData(body);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "خطا در دریافت تنظیمات حساب"));
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <div className="text-[11px] font-black text-brand-blue">حساب مدیریت</div>
        <h1 className="text-2xl font-black text-white mt-1">تنظیمات حساب</h1>
        <p className="text-sm text-brand-m_khonsa mt-2">همه تنظیمات مربوط به حساب مدیر همین‌جا انجام می‌شود و از پنل کاربری عمومی جداست.</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4">{error}</div>}

      <section className="bg-brand-surface border border-brand-surface_hover p-6 flex flex-col gap-6">
        {!data ? <StaticSettingsPlaceholder title="اطلاعات حساب" /> : <>
          <AvatarPicker currentAvatarId={data.user.avatarId} currentAvatarUrl={data.user.avatarUrl} name={data.user.name} isStaff={data.user.isStaff} />
          <div className="border-t border-brand-surface_hover pt-6"><ProfileEditForm name={data.user.name} email={data.user.email} /></div>
        </>}
      </section>

      <section className="bg-brand-surface border border-brand-surface_hover p-6">
        {!data ? <StaticSettingsPlaceholder title="امنیت حساب" /> : <SetPasswordForm hasManualPassword={data.user.hasManualPassword} />}
      </section>

      <section className="flex flex-col gap-3">
        <div><span className="text-sm font-bold text-white block">نشست‌های فعال</span><span className="text-xs text-brand-m_khonsa">دستگاه‌ها و نشست‌های متصل به حساب مدیریت</span></div>
        {!data ? <StaticSettingsPlaceholder title="نشست‌های متصل" /> : <SessionsList sessions={data.sessions} currentSessionId={data.currentSessionId} />}
      </section>
    </div>
  );
}

function StaticSettingsPlaceholder({ title }: { title: string }) {
  return <div className="min-h-[92px] flex items-center justify-center border border-brand-surface_hover text-xs text-brand-m_khonsa">{title} در حال دریافت اطلاعات...</div>;
}
