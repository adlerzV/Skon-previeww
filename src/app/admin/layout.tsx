import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminBootstrap } from "@/lib/admin/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const bootstrap = await getAdminBootstrap();
  return <AdminShell initialContext={bootstrap}>{children}</AdminShell>;
}
