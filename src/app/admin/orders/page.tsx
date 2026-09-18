import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { requireAdmin, getAdminOrders } from "@/lib/admin/server";
export const dynamic = "force-dynamic";
export default async function Page(){const {permissions}=await requireAdmin("orders.read");const data=await getAdminOrders({status:"processing"});return <AdminOrdersClient initial={data} permissions={permissions}/>}
