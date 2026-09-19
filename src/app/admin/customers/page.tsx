import AdminCustomersClient from "@/components/admin/AdminCustomersClient";
import { getAdminBootstrap, getAdminCustomersWithContext } from "@/lib/admin/server";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminCustomersWithContext(bootstrap, { search: "" });
  return <AdminCustomersClient initial={initial} />;
}
