import AdminOrderDetail from "@/components/admin/AdminOrderDetail";
import { getAdminOrder, requireAdmin } from "@/lib/admin/server";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Page({params}:{params:Promise<{id:string}>}){const {permissions}=await requireAdmin("orders.read");const {id}=await params;const order=await getAdminOrder(Number(id));if(!order)notFound();return <AdminOrderDetail order={order} permissions={permissions}/>}
