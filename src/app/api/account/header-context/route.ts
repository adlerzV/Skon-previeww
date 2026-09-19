import { NextResponse } from "next/server";
import { getHeaderViewerData } from "@/lib/auth/session";

export async function GET() {
  const { user, wishlistCount } = await getHeaderViewerData().catch(() => ({ user: null, wishlistCount: 0 }));

  return NextResponse.json(
    {
      user,
      wishlistCount,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
