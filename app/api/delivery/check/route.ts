import { NextResponse } from "next/server";

import { estimateDeliveryDate, isPincodeServiceable } from "@/lib/delivery";

export async function GET(request: Request) {
  const pincode = new URL(request.url).searchParams.get("pincode") ?? "";
  const prime = new URL(request.url).searchParams.get("prime") === "true";

  if (!isPincodeServiceable(pincode)) {
    return NextResponse.json({ serviceable: false, message: "Enter a valid 6-digit pincode" });
  }

  return NextResponse.json({
    serviceable: true,
    estimatedDelivery: estimateDeliveryDate(pincode, prime),
    message: "Delivery available to this pincode"
  });
}
