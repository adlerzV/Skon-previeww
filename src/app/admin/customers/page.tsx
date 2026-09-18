import AdminCustomersClient from "@/components/admin/AdminCustomersClient";
import { getAdminCustomers, requireAdmin } from "@/lib/admin/server";
export const dynamic = "force-dynamic";
export default async function Page(){await requireAdmin("users.read");const data=await getAdminCustomers();return <AdminCustomersClient initial={data}/>}
