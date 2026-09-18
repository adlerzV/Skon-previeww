import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin/server";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, permissions } = await requireAdmin();

  return (
    <div className="min-h-[100dvh] bg-brand-bg" dir="rtl">
      <AdminShell
        user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
        permissions={permissions}
      >
        {children}
      </AdminShell>
    </div>
  );
}
