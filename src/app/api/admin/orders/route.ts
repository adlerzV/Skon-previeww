import { NextRequest, NextResponse } from "next/server";
import { adminMutation, getAdminOrders, ADMIN_MUTATIONS } from "@/lib/admin/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const data = await getAdminOrders({
      status: params.get("status") || "",
      search: params.get("search") || "",
      after: params.get("after") || undefined,
    });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin orders GET:", error);
    return NextResponse.json({ error: "خطا در دریافت سفارش‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body?.action || "");
    const map: Record<string, string> = {
      addNote: ADMIN_MUTATIONS.addOrderNote,
      updateStatus: ADMIN_MUTATIONS.updateOrderStatus,
      updateFulfillment: ADMIN_MUTATIONS.updateOrderItemFulfillment,
    };
    if (!map[action]) return NextResponse.json({ error: "عملیات نامعتبر است" }, { status: 400 });
    const variables = action === "addNote"
      ? { orderId: Number(body.orderId), content: String(body.content || "") }
      : action === "updateStatus"
        ? { orderId: Number(body.orderId), status: String(body.status || "") }
        : { orderId: Number(body.orderId), itemId: Number(body.itemId), status: String(body.status || "") };
    const data = await adminMutation(map[action], variables);
    return NextResponse.json(data ?? { success: false });
  } catch (error) {
    console.error("Admin orders POST:", error);
    return NextResponse.json({ error: "عملیات سفارش انجام نشد" }, { status: 500 });
  }
}
