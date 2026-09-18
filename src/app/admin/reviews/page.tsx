import AdminReviewsClient from "@/components/admin/AdminReviewsClient";
import { getAdminReviews, requireAdmin } from "@/lib/admin/server";
export const dynamic = "force-dynamic";
export default async function Page(){await requireAdmin("reviews.moderate");const data=await getAdminReviews({state:"pending"});return <AdminReviewsClient initial={data}/>}
