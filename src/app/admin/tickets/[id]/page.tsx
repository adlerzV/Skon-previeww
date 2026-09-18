import AdminTicketDetail from "@/components/admin/AdminTicketDetail";
import { getAdminTicket, requireAdmin } from "@/lib/admin/server";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Page({params}:{params:Promise<{id:string}>}){const {permissions}=await requireAdmin("tickets.read");const {id}=await params;const data=await getAdminTicket(Number(id));if(!data)notFound();return <AdminTicketDetail data={data} permissions={permissions}/>}
