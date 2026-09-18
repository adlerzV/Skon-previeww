import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.isStaff) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      databaseId: user.databaseId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    permissions: user.adminPermissions,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
