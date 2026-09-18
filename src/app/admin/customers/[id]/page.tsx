import AdminCustomerDetail from "@/components/admin/AdminCustomerDetail";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <AdminCustomerDetail id={Number(id)} />;}
