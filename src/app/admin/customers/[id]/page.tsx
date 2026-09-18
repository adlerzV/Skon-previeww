import AdminCustomerDetail from "@/components/admin/AdminCustomerDetail";
import { getAdminCustomer, requireAdmin } from "@/lib/admin/server";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Page({params}:{params:Promise<{id:string}>}){await requireAdmin("users.read");const {id}=await params;const data=await getAdminCustomer(Number(id));if(!data)notFound();return <AdminCustomerDetail data={data}/>}
