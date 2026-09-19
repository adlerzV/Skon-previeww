import { NextResponse } from "next/server";
import { getHeaderViewerData } from "@/lib/auth/session";

export async function GET() {
  const { user, wishlistIds } = await getHeaderViewerData().catch(() => ({ user: null, wishlistIds: [] }));

  return NextResponse.json(
    {
      user,
      wishlistCount: wishlistIds.length,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
