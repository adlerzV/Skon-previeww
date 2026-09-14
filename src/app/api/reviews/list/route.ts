import { NextRequest, NextResponse } from "next/server";
import { getProductReviews } from "@/lib/graphql/reviews";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`reviews-list:${ip}`, { max: 60, windowMs: 60 * 1000 }))) {
    return NextResponse.json({ error: "تعداد درخواست بیش از حد مجاز است" }, { status: 429 });
  }

  const productId = Number(request.nextUrl.searchParams.get("productId"));
  const after = request.nextUrl.searchParams.get("after") || undefined;

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "شناسه محصول نامعتبر است" }, { status: 400 });
  }

  const { reviews, pageInfo } = await getProductReviews(productId, after);
  return NextResponse.json({ reviews, pageInfo });
}