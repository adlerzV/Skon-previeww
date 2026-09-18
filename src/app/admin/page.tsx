import { getAdminSummary } from "@/lib/admin/server";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminSummary();
  return <AdminDashboard initialData={data} />;
}
