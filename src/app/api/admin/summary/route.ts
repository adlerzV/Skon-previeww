import { NextResponse } from "next/server";
import { getAdminSummary } from "@/lib/admin/server";

export async function GET() {
  try {
    const data = await getAdminSummary();
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات مدیریت" }, { status: 500 });
  }
}
