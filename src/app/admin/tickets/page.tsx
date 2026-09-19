import AdminTicketsClient from "@/components/admin/AdminTicketsClient";
import { getAdminBootstrap, getAdminTicketsWithContext } from "@/lib/admin/server";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminTicketsWithContext(bootstrap, { status: "open", search: "" });
  return <AdminTicketsClient initial={initial} />;
}
