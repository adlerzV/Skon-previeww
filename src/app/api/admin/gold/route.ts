import { NextRequest, NextResponse } from "next/server";
import { getGoldBoard, goldMutation } from "@/lib/admin/goldServer";

export async function GET() {
  try { return NextResponse.json(await getGoldBoard(), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { console.error("Admin gold GET:", error); return NextResponse.json({ error: error instanceof Error ? error.message : "خطا در دریافت برد Gold" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); const action = String(body?.action || ""); const variables: Record<string, unknown> = {};
    switch (action) {
      case "create": variables.gameSlug=String(body.gameSlug||""); variables.gameName=String(body.gameName||""); variables.region=String(body.region||""); variables.amount=Number(body.amount||0); variables.offerAmount=String(body.offerAmount||"0"); variables.ratePer1k=String(body.ratePer1k||"0"); variables.timerMinutes=body.timerMinutes===""||body.timerMinutes==null?null:Number(body.timerMinutes); break;
      case "claim": variables.proposalId=Number(body.proposalId); break;
      case "start": variables.proposalId=Number(body.proposalId); break;
      case "status": variables.dealId=Number(body.dealId); variables.status=String(body.status||""); variables.reason=body.reason?String(body.reason):null; break;
      case "confirm": variables.dealId=Number(body.dealId); variables.amount=body.amount?Number(body.amount):null; break;
      case "payout": variables.dealId=Number(body.dealId); variables.amount=String(body.amount||"0"); variables.note=body.note?String(body.note):null; break;
      case "strike": variables.userId=Number(body.userId); variables.reason=String(body.reason||""); break;
      default: return NextResponse.json({ error: "عملیات Gold نامعتبر است." }, { status: 400 });
    }
    return NextResponse.json(await goldMutation(action, variables), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { console.error("Admin gold POST:", error); return NextResponse.json({ error: error instanceof Error ? error.message : "عملیات Gold انجام نشد" }, { status: 500 }); }
}
