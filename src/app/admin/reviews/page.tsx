import AdminReviewsClient from "@/components/admin/AdminReviewsClient";
import { getAdminBootstrap, getAdminReviewsWithContext } from "@/lib/admin/server";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const initial = await getAdminReviewsWithContext(bootstrap, { state: "pending" });
  return <AdminReviewsClient initial={initial} />;
}
