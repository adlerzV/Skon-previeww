import AdminTicketsClient from "@/components/admin/AdminTicketsClient";
import { getAdminTickets, requireAdmin } from "@/lib/admin/server";
export const dynamic = "force-dynamic";
export default async function Page(){await requireAdmin("tickets.read");const data=await getAdminTickets({status:"open"});return <AdminTicketsClient initial={data}/>}
