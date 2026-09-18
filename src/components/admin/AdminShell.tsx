import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
  user,
  permissions,
}: {
  children: ReactNode;
  user: { name: string; email: string; avatarUrl: string | null };
  permissions: string[];
}) {
  return (
    <div className="min-h-[100dvh]">
      <AdminSidebar user={user} permissions={permissions} />
      <main className="lg:pr-[280px] min-h-[100dvh]">
        <div className="w-full max-w-[1800px] mx-auto min-h-[100dvh] p-4 pt-16 lg:p-6 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
