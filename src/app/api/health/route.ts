import { NextResponse } from "next/server";
import { getRateLimitHealth } from "@/lib/rateLimit";

export async function GET() {
  const rateLimit = getRateLimitHealth();
  const ok = !rateLimit.production
    || (rateLimit.distributedConfigured || rateLimit.memoryFallbackAllowed)
      && rateLimit.proxyTrustConfigured;
  return NextResponse.json(
    {
      ok,
      rateLimit: {
        distributedConfigured: rateLimit.distributedConfigured,
        production: rateLimit.production,
        memoryFallbackAllowed: rateLimit.memoryFallbackAllowed,
        proxyTrustConfigured: rateLimit.proxyTrustConfigured,
      },
    },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
