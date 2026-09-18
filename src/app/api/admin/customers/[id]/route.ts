import { NextResponse } from "next/server";
import { getAdminCustomer } from "@/lib/admin/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await getAdminCustomer(Number(id));
    if (!data) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin customer detail:", error);
    return NextResponse.json({ error: "خطا در دریافت کاربر" }, { status: 500 });
  }
}
