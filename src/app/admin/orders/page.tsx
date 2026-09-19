import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { getAdminBootstrap, getAdminOrdersWithContext } from "@/lib/admin/server";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminOrdersWithContext(bootstrap, { status: "processing", search: "" });
  return <AdminOrdersClient initial={initial} permissions={bootstrap.permissions} />;
}
