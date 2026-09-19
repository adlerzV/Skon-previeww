"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Activity, CheckCircle2, Clock3, Coins, PauseCircle, Plus, ShieldAlert } from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { AdminBadge, AdminCard, AdminEmpty, AdminPage, AdminPageIntro, AdminRefreshButton, AdminStatCard } from "./AdminUi";

type BuyOrder = { databaseId:number; gameName:string; gameSlug:string; region:string; amount:number; offerAmount:string; ratePer1k:string; timerMinutes:number|null; status:string; proposalCount:number; pendingProposalCount:number };
type Proposal = { databaseId:number; buyOrderId:number; userId:number; profileName:string; amount:number; status:string; claimedBy:number|null; claimExpiresAt:string|null; gameName:string; region:string; offerAmount:string; createdAt:string|null };
type Deal = { databaseId:number; buyOrderId:number; proposalId:number; sellerUserId:number; sellerName:string; sellerEmail:string; profileName:string; proposalAmount:number; status:string; timerExpiresAt:string|null; deliveredAmount:number; deliveryConfirmedAt:string|null; suspendedReason:string|null; gameName:string; region:string; offerAmount:string };

type Board = { adminGoldBuyOrders: BuyOrder[]; adminGoldProposals: Proposal[]; adminGoldDeals: Deal[] };
const EMPTY: Board = { adminGoldBuyOrders: [], adminGoldProposals: [], adminGoldDeals: [] };
const statusLabel: Record<string,string> = { active:"فعال", suspended:"معلق", completed:"تکمیل‌شده", closed:"بسته", pending:"در انتظار", claimed:"Claim شده", timer:"در حال معامله", cancelled:"لغوشده" };

function tone(status:string): "neutral"|"info"|"success"|"warning"|"danger" { if(status==='completed'||status==='active') return 'success'; if(status==='pending'||status==='timer'||status==='claimed') return 'info'; if(status==='suspended') return 'warning'; if(status==='cancelled'||status==='closed') return 'danger'; return 'neutral'; }
function fmtGold(value:number){ return value.toLocaleString('fa-IR'); }
function fmtMoney(value:string){ return Number(value||0).toLocaleString('fa-IR'); }

export default function AdminGoldClient({ initial }: { initial?: Board }) {
  const { permissions } = useAdminContext();
  const [board,setBoard]=useState<Board>(initial ?? EMPTY);
  const [loading,setLoading]=useState(!initial);
  const [message,setMessage]=useState("");
  const [gameName,setGameName]=useState("World of Warcraft");
  const [gameSlug,setGameSlug]=useState("wow");
  const [region,setRegion]=useState("EU");
  const [amount,setAmount]=useState(500000);
  const [offerAmount,setOfferAmount]=useState("4500000");
  const [rate,setRate]=useState("9000");
  const [timer,setTimer]=useState("30");
  const [activeDealId,setActiveDealId]=useState<number|null>(null);

  const pollInFlightRef = useRef(false);
  const pollTimerRef = useRef<number | null>(null);
  const schedulePollRef = useRef<() => void>(() => {});
  const mountedRef = useRef(true);
  const boardRef = useRef(board);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const load = useCallback(async (silent = false) => {
    if (pollInFlightRef.current) return;
    pollInFlightRef.current = true;
    if (!silent) setLoading(true);
    try {
      const res=await fetch('/api/admin/gold',{cache:'no-store'});
      const json=await res.json();
      if(!res.ok) throw new Error(json?.error||'خطا در دریافت برد Gold');
      if (!mountedRef.current) return;
      setBoard(json);
      const deal=json?.adminGoldDeals?.find((item:Deal)=>['timer','active','suspended'].includes(item.status));
      setActiveDealId(deal?.databaseId ?? null);
    }
    catch(e){ if (!silent && mountedRef.current) setMessage(e instanceof Error?e.message:'خطا در دریافت برد Gold'); }
    finally{
      pollInFlightRef.current = false;
      if (!silent && mountedRef.current) setLoading(false);
    }
  }, []);

  const schedulePoll = useCallback(() => {
    if (!mountedRef.current) return;
    if (pollTimerRef.current !== null) window.clearTimeout(pollTimerRef.current);

    const hidden = document.visibilityState !== 'visible';
    const currentBoard = boardRef.current;
    const hasLiveActivity = currentBoard.adminGoldDeals.some((deal) => ['timer','active','suspended'].includes(deal.status))
      || currentBoard.adminGoldProposals.some((proposal) => ['pending','claimed','timer'].includes(proposal.status));
    const delay = hidden ? 30_000 : hasLiveActivity ? 5_000 : 15_000;

    pollTimerRef.current = window.setTimeout(async () => {
      if (document.visibilityState === 'visible') await load(true);
      schedulePollRef.current();
    }, delay);
  }, [load]);

  useEffect(() => {
    schedulePollRef.current = schedulePoll;
    mountedRef.current = true;
    const bootstrap = async () => {
      if (!initial) await load();
      schedulePoll();
    };
    void bootstrap();
    const onVisibility = () => schedulePoll();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', onVisibility);
      if (pollTimerRef.current !== null) window.clearTimeout(pollTimerRef.current);
    };
  }, [initial, load, schedulePoll]);

  const proposals = useMemo(()=>board.adminGoldProposals.filter(p=>p.status==='pending'||p.status==='claimed'||p.status==='timer'),[board.adminGoldProposals]);
  const pending = board.adminGoldProposals.filter(p=>p.status==='pending').length;
  const liveDeals = board.adminGoldDeals.filter(d=>['timer','active','suspended'].includes(d.status));
  const activeDeal = board.adminGoldDeals.find(d=>d.databaseId===activeDealId) || liveDeals[0] || null;

  const act = async (action:string, payload:Record<string,unknown>) => {
    setLoading(true); setMessage("");
    try { const res=await fetch('/api/admin/gold',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})}); const json=await res.json(); if(!res.ok) throw new Error(json?.error||'عملیات انجام نشد'); setMessage('عملیات با موفقیت انجام شد.'); await load(); }
    catch(e){setMessage(e instanceof Error?e.message:'عملیات انجام نشد');}
    finally{setLoading(false);}
  };

  if(!permissions.includes('gold.read')) return <AdminPage><AdminEmpty title="دسترسی به عملیات Gold ندارید."/> </AdminPage>;
  return <AdminPage>
    <AdminPageIntro eyebrow="عملیات" title="برد Gold" description="درخواست‌های خرید، پیشنهادهای فروش و معامله‌های جاری را از یک صفحه مدیریت کن." action={<AdminRefreshButton onClick={()=>void load()} loading={loading}/>}/>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-4">
      <AdminStatCard label="درخواست فعال" value={board.adminGoldBuyOrders.filter(x=>x.status==='active').length} helper="خریدهای باز" tone="success"/>
      <AdminStatCard label="پیشنهاد منتظر" value={pending} helper="نیازمند Claim" tone={pending?'warning':'default'}/>
      <AdminStatCard label="معامله جاری" value={liveDeals.length} helper="Timer / Active"/>
      <AdminStatCard label="پیشنهادها" value={board.adminGoldProposals.length} helper="همه وضعیت‌ها"/>
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,.8fr)]">
      <div className="space-y-4">
        <AdminCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[.06] p-4"><div className="flex items-center gap-2"><Activity size={16} className="text-brand-blue"/><div><div className="text-sm font-black text-white">تابلوی زنده طلا</div><div className="mt-1 text-[9px] text-brand-m_khonsa">به‌روزرسانی هوشمند؛ هنگام فعالیت هر ۵ ثانیه</div></div></div><AdminBadge tone="info">زنده</AdminBadge></div>
          <div className="hidden lg:block overflow-x-auto"><table className="w-full border-collapse text-right [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-white/[.06] [&_th]:px-3.5 [&_th]:py-3 [&_th]:text-[9px] [&_th]:font-black [&_th]:text-brand-m_khonsa [&_td]:border-b [&_td]:border-white/[.06] [&_td]:px-3.5 [&_td]:py-3 [&_td]:align-middle [&_tr:last-child_td]:border-b-0 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-white/[.02] min-w-[930px]"><thead><tr><th>درخواست</th><th>مقدار</th><th>پیشنهاد</th><th>وضعیت</th><th>اقدام</th></tr></thead><tbody>{board.adminGoldBuyOrders.map(order=><tr key={order.databaseId}><td><div className="text-xs font-black text-white">{order.gameName} · {order.region}</div><div className="mt-1 text-[9px] text-brand-m_khonsa">خرید #{order.databaseId}</div></td><td className="text-[11px] font-black text-white">{fmtGold(order.amount)} Gold</td><td><div className="text-[11px] font-black text-white">{fmtMoney(order.offerAmount)}</div><div className="mt-1 text-[9px] text-brand-m_khonsa">{order.ratePer1k} / 1K</div></td><td><AdminBadge tone={tone(order.status)}>{statusLabel[order.status]||order.status}</AdminBadge><div className="mt-1 text-[9px] text-brand-m_khonsa">{order.pendingProposalCount.toLocaleString('fa-IR')} پیشنهاد منتظر</div></td><td><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover" onClick={()=>document.getElementById('gold-proposals')?.scrollIntoView({behavior:'smooth'})}>دیدن پیشنهادها</button></td></tr>)}</tbody></table></div>
          <div className="lg:hidden space-y-2 p-3">{board.adminGoldBuyOrders.map(order=><div key={order.databaseId} className="rounded-[5px] border border-white/[.06] bg-black/10 p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black text-white">{order.gameName}</div><div className="mt-1 text-[9px] text-brand-m_khonsa">{order.region} · #{order.databaseId}</div></div><AdminBadge tone={tone(order.status)}>{statusLabel[order.status]||order.status}</AdminBadge></div><div className="mt-3 grid grid-cols-2 gap-3"><div><div className="text-[9px] text-brand-m_khonsa">مقدار</div><div className="mt-1 text-[10px] font-black text-white">{fmtGold(order.amount)}</div></div><div><div className="text-[9px] text-brand-m_khonsa">پیشنهاد معلق</div><div className="mt-1 text-[10px] font-black text-white">{order.pendingProposalCount.toLocaleString('fa-IR')}</div></div></div></div>)}{board.adminGoldBuyOrders.length===0&&<AdminEmpty title="درخواست خریدی وجود ندارد."/>}</div>
        </AdminCard>

        <AdminCard id="gold-proposals" className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[.06] p-4"><Coins size={16} className="text-brand-blue"/><div><div className="text-sm font-black text-white">صف پیشنهادها</div><div className="mt-1 text-[9px] text-brand-m_khonsa">Claim اتمیک برای جلوگیری از دوباره‌کاری مدیرها</div></div></div>
          <div className="space-y-2 p-3">{proposals.map(p=><div key={p.databaseId} className="rounded-[5px] border border-white/[.06] bg-black/10 p-3"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-black text-white">{p.gameName} · {p.region}</span><AdminBadge tone={tone(p.status)}>{statusLabel[p.status]||p.status}</AdminBadge></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-brand-m_khonsa"><span>فروشنده: {p.userId}</span><span>پروفایل: {p.profileName}</span><span>مقدار: {fmtGold(p.amount)}</span><span>مبلغ: {fmtMoney(p.offerAmount)}</span></div></div><div className="flex flex-wrap gap-2">{p.status==='pending'&&<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:brightness-110" disabled={loading||!permissions.includes('gold.claim')} onClick={()=>void act('claim',{proposalId:p.databaseId})}>Claim</button>}{p.status==='claimed'&&<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:brightness-110" disabled={loading||!permissions.includes('gold.claim')} onClick={()=>void act('start',{proposalId:p.databaseId})}>شروع معامله</button>}{p.status==='timer'&&<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover" onClick={()=>{const d=board.adminGoldDeals.find(x=>x.proposalId===p.databaseId); if(d){setActiveDealId(d.databaseId); document.getElementById('gold-live-deal')?.scrollIntoView({behavior:'smooth'});}}}>باز کردن معامله</button>}</div></div></div>)}{proposals.length===0&&<AdminEmpty title="پیشنهاد فعالی وجود ندارد." description="پیشنهادهای کاربران پس از ثبت در این صف نمایش داده می‌شوند."/>}</div>
        </AdminCard>

        <AdminCard id="gold-live-deal">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Clock3 size={16} className="text-brand-blue"/><div><div className="text-sm font-black text-white">معامله فعال</div><div className="mt-1 text-[9px] text-brand-m_khonsa">چرخه تحویل و پرداخت معامله فعال</div></div></div>{activeDeal&&<AdminBadge tone={tone(activeDeal.status)}>{statusLabel[activeDeal.status]||activeDeal.status}</AdminBadge>}</div>
          {!activeDeal?<div className="mt-4"><AdminEmpty title="معامله جاری وجود ندارد."/></div>:<div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-[5px] border border-white/[.06] bg-black/10 p-4"><div className="text-lg font-black text-white">{activeDeal.gameName} · {activeDeal.region}</div><div className="mt-1 text-xs text-brand-m_khonsa">فروشنده: {activeDeal.sellerName || `کاربر ${activeDeal.sellerUserId}`} · پروفایل: {activeDeal.profileName}</div><div className="mt-5 grid grid-cols-2 gap-3"><div><div className="text-[9px] text-brand-m_khonsa">مقدار</div><div className="mt-1 text-sm font-black text-white">{fmtGold(activeDeal.proposalAmount)}</div></div><div><div className="text-[9px] text-brand-m_khonsa">تحویل‌شده</div><div className="mt-1 text-sm font-black text-white">{fmtGold(activeDeal.deliveredAmount)}</div></div></div></div><div className="space-y-2"><div className="flex flex-wrap gap-2">{activeDeal.status!=='completed'&&activeDeal.status!=='cancelled'&&permissions.includes('gold.write')&&<><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:brightness-110" onClick={()=>void act('confirm',{dealId:activeDeal.databaseId,amount:activeDeal.proposalAmount})}><CheckCircle2 size={14}/>تأیید دریافت</button><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover" onClick={()=>void act('status',{dealId:activeDeal.databaseId,status:'suspended',reason:'معلق توسط مدیر'})}><PauseCircle size={14}/>تعلیق</button><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover" onClick={()=>void act('status',{dealId:activeDeal.databaseId,status:'active'})}>فعال</button></>}{permissions.includes('gold.payout')&&activeDeal.status==='completed'&&<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:brightness-110" onClick={()=>void act('payout',{dealId:activeDeal.databaseId,amount:activeDeal.offerAmount})}>ثبت پرداخت</button>}</div>{permissions.includes('gold.write')&&<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 border border-brand-surface_hover bg-brand-surface_hover/60 text-white hover:bg-brand-surface_hover" onClick={()=>{const reason=window.prompt('دلیل Strike را وارد کنید'); if(reason) void act('strike',{userId:activeDeal.sellerUserId,reason});}}><ShieldAlert size={14}/>ثبت Strike برای فروشنده</button>}</div></div>}
        </AdminCard>
      </div>

      <div className="space-y-4">
        {permissions.includes('gold.write')&&<AdminCard><div className="flex items-center gap-2"><Plus size={16} className="text-brand-blue"/><div><div className="text-sm font-black text-white">درخواست خرید جدید</div><div className="mt-1 text-[9px] text-brand-m_khonsa">یک Buy Request برای Sellerها باز کن.</div></div></div><div className="mt-4 space-y-2"><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={gameName} onChange={e=>setGameName(e.target.value)} placeholder="نام Game"/><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={gameSlug} onChange={e=>setGameSlug(e.target.value)} placeholder="Slug" dir="ltr"/><div className="grid grid-cols-2 gap-2"><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={region} onChange={e=>setRegion(e.target.value)} placeholder="Region"/><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={timer} onChange={e=>setTimer(e.target.value)} placeholder="Timer (دقیقه)" dir="ltr"/></div><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={amount} onChange={e=>setAmount(Number(e.target.value)||0)} placeholder="مقدار Gold" dir="ltr"/><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={offerAmount} onChange={e=>setOfferAmount(e.target.value)} placeholder="Offer" dir="ltr"/><input className="w-full min-h-10 rounded-[5px] border border-brand-surface_hover bg-brand-bg px-3 text-xs text-white outline-none placeholder:text-brand-m_khonsa focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" value={rate} onChange={e=>setRate(e.target.value)} placeholder="نرخ / 1K" dir="ltr"/><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-3 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:brightness-110 w-full" disabled={loading} onClick={()=>void act('create',{gameSlug,gameName,region,amount,offerAmount,ratePer1k:rate,timerMinutes:Number(timer)||null})}>ایجاد درخواست خرید</button></div></AdminCard>}
        <AdminCard><div className="text-sm font-black text-white">وضعیت سریع</div><div className="mt-3 space-y-3 text-[10px] text-brand-m_khonsa"><div className="flex items-center justify-between"><span>پیشنهادهای منتظر</span><strong className="text-white">{pending.toLocaleString('fa-IR')}</strong></div><div className="flex items-center justify-between"><span>معامله‌های زنده</span><strong className="text-white">{liveDeals.length.toLocaleString('fa-IR')}</strong></div><div className="flex items-center justify-between"><span>درخواست‌های فعال</span><strong className="text-white">{board.adminGoldBuyOrders.filter(x=>x.status==='active').length.toLocaleString('fa-IR')}</strong></div></div>{message&&<div className="mt-4 rounded-[5px] border border-white/[.06] bg-white/[.02] px-3 py-2 text-[10px] text-brand-m_khonsa">{message}</div>}</AdminCard>
      </div>
    </div>
  </AdminPage>;
}
