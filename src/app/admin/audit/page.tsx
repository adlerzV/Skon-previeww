import AdminAuditClient from "@/components/admin/AdminAuditClient";
import { getAdminBootstrap } from "@/lib/admin/server";
import { getAdminAuditLogsWithContext } from "@/lib/admin/engineServer";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminAuditLogsWithContext(bootstrap, { first: 100 });
  return <AdminAuditClient initial={initial} />;
}
