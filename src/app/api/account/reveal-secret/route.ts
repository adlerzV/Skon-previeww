// src/app/api/account/reveal-secret/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchGraphQL } from "@/lib/graphql";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const REVEAL_MUTATION = `
  mutation RevealOrderSecret($orderId: Int!, $itemId: Int!, $fieldType: String!) {
    revealOrderSecret(input: { orderId: $orderId, itemId: $itemId, fieldType: $fieldType }) {
      values
    }
  }
`;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`reveal:${ip}`, { max: 20, windowMs: 5 * 60 * 1000 }))) {
    return NextResponse.json({ error: "تعداد درخواست بیش از حد مجاز است" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });

  try {
    const body = await request.json();
    const orderId = Number(body?.orderId);
    const itemId = Number(body?.itemId);
    const requestedFieldTypes: unknown = body?.fieldTypes ?? ["cdkey"];
    if (
      !Array.isArray(requestedFieldTypes) ||
      requestedFieldTypes.length !== 1 ||
      requestedFieldTypes[0] !== "cdkey"
    ) {
      return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
    }

    if (!Number.isInteger(orderId) || orderId <= 0 || !Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
    }

    if (requestedFieldTypes[0] === "cdkey") {
      const data = await fetchGraphQL(REVEAL_MUTATION, { orderId, itemId, fieldType: "cdkey" }, [], "no-store", token);
      const values = data?.revealOrderSecret?.values;
      if (!Array.isArray(values) || values.length === 0) {
        return NextResponse.json({ error: "کد یافت نشد یا سفارش تکمیل نشده" }, { status: 404 });
      }
      return NextResponse.json({ values });
    }

    return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
  } catch (error) {
    console.error("Reveal secret error:", error);
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}