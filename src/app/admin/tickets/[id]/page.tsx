import AdminTicketDetail from "@/components/admin/AdminTicketDetail";
import { getAdminBootstrap, getAdminTicketWithContext } from "@/lib/admin/server";

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const ticketId=Number(id);
  const bootstrap=await getAdminBootstrap();
  const data=await getAdminTicketWithContext(bootstrap, ticketId);
  return <AdminTicketDetail id={ticketId} data={data ?? undefined}/>;
}
