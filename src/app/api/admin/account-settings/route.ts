import { NextResponse } from "next/server";
import { getAuthToken, getCurrentUser, getSessionId } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_SESSIONS_QUERY } from "@/lib/graphql/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.isStaff) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });

    const token = await getAuthToken();
    const currentSessionId = await getSessionId();
    const data = await fetchGraphQL(GET_SESSIONS_QUERY, {}, [], "no-store", token || undefined);

    return NextResponse.json({
      user: {
        avatarId: user.avatarId,
        avatarUrl: user.avatarUrl,
        name: user.name,
        email: user.email,
        isStaff: user.isStaff,
        hasManualPassword: user.hasManualPassword,
      },
      sessions: Array.isArray(data?.viewer?.sessions) ? data.viewer.sessions : [],
      currentSessionId,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin account settings:", error);
    return NextResponse.json({ error: "خطا در دریافت تنظیمات حساب" }, { status: 500 });
  }
}
