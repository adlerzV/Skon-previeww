import AdminGoldClient from "@/components/admin/AdminGoldClient";
import { getAdminBootstrap } from "@/lib/admin/server";
import { getGoldBoardWithContext } from "@/lib/admin/goldServer";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getGoldBoardWithContext(bootstrap);
  return <AdminGoldClient initial={initial} />;
}
