import { NextRequest, NextResponse } from "next/server";
import { fetchGraphQLWithErrors } from "@/lib/graphql/rawFetch";
import { REQUEST_ADMIN_SMS_OTP_MUTATION } from "@/lib/graphql/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`admin-sms-request:${ip}`, { max: 10, windowMs: 10 * 60 * 1000 }))) {
    return NextResponse.json({ error: "تعداد درخواست بیش از حد مجاز است" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const pendingTicket = typeof body?.pendingTicket === "string" ? body.pendingTicket : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;

    if (!pendingTicket) {
      return NextResponse.json({ error: "نشست نامعتبر است" }, { status: 400 });
    }

    const { data, errorMessage } = await fetchGraphQLWithErrors(REQUEST_ADMIN_SMS_OTP_MUTATION, {
      pendingTicket,
      phone,
    });

    const result = data?.requestAdminSmsOtp;

    if (!result || (!result.success && !result.requiresPhoneInput)) {
      return NextResponse.json({ error: errorMessage || "ارسال کد با خطا مواجه شد" }, { status: 400 });
    }

    return NextResponse.json({
      success: Boolean(result.success),
      requiresPhoneInput: Boolean(result.requiresPhoneInput),
      maskedPhone: result.maskedPhone ?? null,
      cooldownSeconds: result.cooldownSeconds ?? 60,
    });
  } catch (error) {
    console.error("Admin SMS OTP request error:", error);
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}