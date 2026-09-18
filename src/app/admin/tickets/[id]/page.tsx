import AdminTicketDetail from "@/components/admin/AdminTicketDetail";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <AdminTicketDetail id={Number(id)} />;}
