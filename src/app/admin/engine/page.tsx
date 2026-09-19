import AdminEngineClient from "@/components/admin/AdminEngineClient";
import { getAdminBootstrap } from "@/lib/admin/server";
import { getAdminEngineWithContext } from "@/lib/admin/engineServer";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminEngineWithContext(bootstrap);
  return <AdminEngineClient initial={initial} />;
}
