import { NextRequest, NextResponse } from "next/server";
import { adminEngineMutation, getAdminEngine } from "@/lib/admin/engineServer";

export async function GET() {
  try {
    return NextResponse.json(await getAdminEngine(), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Admin engine GET:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در دریافت وضعیت Engine" },
      { status: 403 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body?.action || "");
    const variables: Record<string, unknown> = {};
    if (action === "pricingRebuild") {
      variables.currencies = Array.isArray(body?.currencies)
        ? body.currencies.map((value: unknown) => String(value))
        : [];
    } else if (action === "retryFailedJob") {
      variables.actionId = Number(body?.actionId);
    }
    if (!["rateSync", "pricingRebuild", "revalidation", "retryFailedJob"].includes(action)) {
      return NextResponse.json({ error: "عملیات Engine نامعتبر است" }, { status: 400 });
    }
    const result = await adminEngineMutation(action, variables);
    return NextResponse.json(result ?? { success: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Admin engine POST:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "عملیات Engine ناموفق بود" },
      { status: 403 }
    );
  }
}
