import { NextRequest, NextResponse } from "next/server";
import { getAdminCustomers } from "@/lib/admin/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const data = await getAdminCustomers({ search: params.get("search") || "", after: params.get("after") || undefined });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin customers GET:", error);
    return NextResponse.json({ error: "خطا در دریافت کاربران" }, { status: 500 });
  }
}
