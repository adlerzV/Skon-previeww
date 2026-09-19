import { NextRequest, NextResponse } from "next/server";
import { getAdminAuditLogs } from "@/lib/admin/engineServer";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const data = await getAdminAuditLogs({
      first: params.get("first") || 100,
      action: params.get("action") || "",
      result: params.get("result") || "",
    });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin audit GET:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در دریافت Audit Log" },
      { status: 403 }
    );
  }
}
