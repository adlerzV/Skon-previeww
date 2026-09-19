import AdminCdKeysClient from "@/components/admin/AdminCdKeysClient";
import { getAdminBootstrap, getAdminCdKeyStockWithContext } from "@/lib/admin/server";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminCdKeyStockWithContext(bootstrap, { status: "all" });
  return <AdminCdKeysClient initial={initial} />;
}
