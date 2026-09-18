import { NextResponse } from "next/server";
import { getAdminTicket } from "@/lib/admin/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await getAdminTicket(Number(id));
    if (!data) return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin ticket detail:", error);
    return NextResponse.json({ error: "خطا در دریافت تیکت" }, { status: 500 });
  }
}
