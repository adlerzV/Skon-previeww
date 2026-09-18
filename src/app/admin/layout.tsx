import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_TOKEN_COOKIE)?.value) redirect("/admin-login");

  return <AdminShell>{children}</AdminShell>;
}
