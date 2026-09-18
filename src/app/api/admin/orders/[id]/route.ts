import { NextResponse } from "next/server";
import { getAdminOrder } from "@/lib/admin/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await getAdminOrder(Number(id));
    if (!data) return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin order detail:", error);
    return NextResponse.json({ error: "خطا در دریافت سفارش" }, { status: 500 });
  }
}
