"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, Eye } from "lucide-react";
import { AdminBadge, AdminButton, AdminEmpty, AdminFilterBar, AdminListCard, AdminMobileList, AdminPage, AdminPageIntro, AdminRefreshButton, AdminSearchInput, AdminSelect, AdminTable } from "./AdminUi";

const STATUS: Record<string,string>={open:"باز",claimed:"در اختیار ادمین",waiting_user:"در انتظار کاربر",waiting_staff:"در انتظار پشتیبانی",resolved:"حل‌شده",closed:"بسته‌شده"};
const PRIORITY: Record<string,string>={low:"کم",normal:"عادی",high:"زیاد",urgent:"فوری"};
type Ticket={databaseId:number;title:string;date:string;status:string;priority:string;customerName:string;customerEmail:string;linkedOrderId:number|null;assigneeName:string|null;claimExpiresAt:string|null};

export default function AdminTicketsClient({initial}:{initial?:{nodes:Ticket[];pageInfo:{hasNextPage:boolean;endCursor:string|null}}}){
  const empty={nodes:[] as Ticket[],pageInfo:{hasNextPage:false,endCursor:null as string|null}};
  const[data,setData]=useState(initial??empty),[status,setStatus]=useState("open"),[search,setSearch]=useState(""),[loading,setLoading]=useState(!initial);
  const load=async(after?:string|null)=>{setLoading(true);try{const q=new URLSearchParams({status,search});if(after)q.set("after",after);const r=await fetch(`/api/admin/tickets?${q}`,{cache:"no-store"});if(r.ok)setData(await r.json())}finally{setLoading(false)}};
  useEffect(()=>{if(!initial)void load()},[]);
  const tone=(value:string)=>value==="resolved"||value==="closed"?"success":value==="open"?"warning":"info" as "success"|"warning"|"info";
  return <AdminPage>
    <AdminPageIntro eyebrow="پشتیبانی" title="تیکت‌ها" description="صف پشتیبانی را claim کن، پاسخ بده و وضعیت را جلو ببر." action={<AdminRefreshButton onClick={()=>void load()} loading={loading}/>}/>
    <AdminFilterBar>
      <AdminSearchInput value={search} onChange={setSearch} onEnter={()=>void load()} placeholder="عنوان یا متن تیکت" />
      <AdminSelect value={status} onChange={e=>setStatus(e.target.value)} className="lg:w-[190px] lg:flex-none"><option value="open">باز</option><option value="claimed">در اختیار ادمین</option><option value="waiting_user">در انتظار کاربر</option><option value="waiting_staff">در انتظار پشتیبانی</option><option value="resolved">حل‌شده</option><option value="closed">بسته‌شده</option><option value="all">همه</option></AdminSelect>
      <AdminButton variant="primary" onClick={()=>void load()} className="lg:min-w-[96px]">اعمال</AdminButton>
    </AdminFilterBar>
    {data.nodes.length===0?<AdminEmpty title="تیکتی با این فیلتر پیدا نشد."/>:<>
      <AdminTable minWidth="1040px"><thead><tr><th>تیکت</th><th>مشتری</th><th>وضعیت</th><th>اولویت</th><th>مسئول</th><th>سفارش</th><th>تاریخ</th><th/></tr></thead><tbody>
        {data.nodes.map(t=><tr key={t.databaseId}><td><div className="max-w-[320px] truncate text-xs font-black text-white">{t.title}</div><div className="mt-1 text-[9px] text-brand-m_khonsa">#{t.databaseId}</div></td><td><div className="text-[10px] font-bold text-white">{t.customerName||"—"}</div><div className="mt-1 text-[9px] text-brand-m_khonsa" dir="ltr">{t.customerEmail||"—"}</div></td><td><AdminBadge tone={tone(t.status)}>{STATUS[t.status]??t.status}</AdminBadge></td><td><AdminBadge tone={t.priority==="urgent"||t.priority==="high"?"danger":"neutral"}>{PRIORITY[t.priority]??t.priority}</AdminBadge></td><td><span className="text-[10px] text-white">{t.assigneeName||"بدون مسئول"}</span></td><td>{t.linkedOrderId?<Link href={`/admin/orders/${t.linkedOrderId}`} className="text-[10px] font-bold text-brand-blue hover:text-white">#{t.linkedOrderId}</Link>:<span className="text-[10px] text-brand-m_khonsa">—</span>}</td><td><span className="text-[9px] text-brand-m_khonsa">{t.date?new Date(t.date).toLocaleDateString("fa-IR"):"—"}</span></td><td><Link href={`/admin/tickets/${t.databaseId}`} className="inline-flex items-center gap-1 text-[10px] font-black text-brand-blue hover:text-white"><Eye size={14}/> باز کردن</Link></td></tr>)}
      </tbody></AdminTable>
      <AdminMobileList>{data.nodes.map(t=><AdminListCard key={t.databaseId} href={`/admin/tickets/${t.databaseId}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="truncate text-sm font-black text-white">{t.title}</div><div className="mt-1 text-[10px] text-brand-m_khonsa">{t.customerName||"—"} · #{t.databaseId}</div></div><AdminBadge tone={tone(t.status)}>{STATUS[t.status]??t.status}</AdminBadge></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Mini label="اولویت" value={PRIORITY[t.priority]??t.priority}/><Mini label="مسئول" value={t.assigneeName||"بدون مسئول"}/><Mini label="سفارش" value={t.linkedOrderId?`#${t.linkedOrderId}`:"—"}/><Mini label="تاریخ" value={t.date?new Date(t.date).toLocaleDateString("fa-IR"):"—"}/></div></AdminListCard>)}</AdminMobileList>
    </>}
    {data.pageInfo.hasNextPage&&<div className="mt-4 flex justify-center"><AdminButton onClick={()=>void load(data.pageInfo.endCursor)} disabled={loading}><ChevronLeft size={15}/> صفحه بعد</AdminButton></div>}
  </AdminPage>
}
function Mini({label,value}:{label:string;value:string}){return <div><div className="text-[9px] text-brand-m_khonsa">{label}</div><div className="mt-1 truncate text-[10px] font-bold text-white">{value}</div></div>}
