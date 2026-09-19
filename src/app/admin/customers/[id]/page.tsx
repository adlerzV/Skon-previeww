import AdminCustomerDetail from "@/components/admin/AdminCustomerDetail";
import { getAdminBootstrap, getAdminCustomerWithContext } from "@/lib/admin/server";

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const customerId=Number(id);
  const bootstrap=await getAdminBootstrap();
  const data=await getAdminCustomerWithContext(bootstrap, customerId);
  return <AdminCustomerDetail id={customerId} data={data ?? undefined}/>;
}
