/**
 * POST /api/resale/verify-invoice
 * Module 8a — Invoice Verification (calls ml-service for Donut extraction)
 */
import { NextRequest, NextResponse } from "next/server";
import { callMLService } from "@/lib/ml-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skuId, invoiceData, invoiceImageB64, orderHistory, skuPriceRange } = body;

    if (!userId || !skuId) {
      return NextResponse.json(
        { error: "userId and skuId required" },
        { status: 422 }
      );
    }

    // Call ML service for invoice extraction + verification
    const result = await callMLService("/invoice/verify", {
      user_id: userId,
      sku_id: skuId,
      invoice_data: invoiceData || {},
      invoice_image_b64: invoiceImageB64 || null,
      order_history: orderHistory || null,
      sku_price_range: skuPriceRange || null,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Invoice verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
