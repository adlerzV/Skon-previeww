import { NextResponse } from "next/server";
import { getAdminBootstrap } from "@/lib/admin/server";

export async function GET() {
  const started = performance.now();
  try {
    const data = await getAdminBootstrap();
    const response = NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
    response.headers.set("Server-Timing", `admin-bootstrap;dur=${(performance.now() - started).toFixed(1)}`);
    return response;
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
}
