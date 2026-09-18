import { NextRequest, NextResponse } from "next/server";
import { adminMutation, getAdminNotifications } from "@/lib/admin/server";
import { MARK_ADMIN_NOTIFICATIONS_READ_MUTATION } from "@/lib/graphql/admin";

export async function GET(request: NextRequest) {
  try {
    const unreadOnly = request.nextUrl.searchParams.get("unreadOnly") === "true";
    const data = await getAdminNotifications(unreadOnly);
    return NextResponse.json({ notifications: data }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin notifications GET:", error);
    return NextResponse.json({ error: "خطا در دریافت اعلان‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = Array.isArray(body?.notificationIds) ? body.notificationIds.map(Number) : [];
    const data = await adminMutation(MARK_ADMIN_NOTIFICATIONS_READ_MUTATION, { notificationIds: ids });
    return NextResponse.json(data ?? { success: false });
  } catch (error) {
    console.error("Admin notifications POST:", error);
    return NextResponse.json({ error: "اعلان‌ها به‌روزرسانی نشدند" }, { status: 500 });
  }
}
