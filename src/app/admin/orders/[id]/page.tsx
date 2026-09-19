import AdminOrderDetail from "@/components/admin/AdminOrderDetail";
import { getAdminBootstrap, getAdminOrderWithContext } from "@/lib/admin/server";

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const orderId=Number(id);
  const bootstrap=await getAdminBootstrap();
  const order=await getAdminOrderWithContext(bootstrap, orderId);
  return <AdminOrderDetail id={orderId} order={order ?? undefined}/>;
}
