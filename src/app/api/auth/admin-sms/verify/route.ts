import { NextRequest, NextResponse } from "next/server";
import { fetchGraphQLWithErrors } from "@/lib/graphql/rawFetch";
import { VERIFY_ADMIN_SMS_OTP_MUTATION } from "@/lib/graphql/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { completeLogin } from "@/lib/auth/completeLogin";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`admin-sms-verify:${ip}`, { max: 10, windowMs: 10 * 60 * 1000 }))) {
    return NextResponse.json({ error: "تعداد درخواست بیش از حد مجاز است" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const pendingTicket = typeof body?.pendingTicket === "string" ? body.pendingTicket : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!pendingTicket || !code) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const { data, errorMessage } = await fetchGraphQLWithErrors(VERIFY_ADMIN_SMS_OTP_MUTATION, {
      pendingTicket,
      code,
    });

    const result = data?.verifyAdminSmsOtp;
    if (!result?.authToken) {
      return NextResponse.json({ error: errorMessage || "کد وارد شده صحیح نیست" }, { status: 400 });
    }

    return completeLogin(request, { authToken: result.authToken, refreshToken: result.refreshToken });
  } catch (error) {
    console.error("Admin SMS OTP verify error:", error);
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}