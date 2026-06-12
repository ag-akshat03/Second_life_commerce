import { NextResponse } from "next/server";

import { applyCoupon } from "@/lib/delivery";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string; subtotal?: number };
  const code = body.code?.trim() ?? "";
  const subtotal = Number(body.subtotal ?? 0);

  if (!code || subtotal <= 0) {
    return NextResponse.json({ valid: false, discount: 0, message: "Invalid request" }, { status: 400 });
  }

  const result = applyCoupon(subtotal, code);
  return NextResponse.json({
    valid: result.discount > 0,
    discount: result.discount,
    message: result.message
  });
}
