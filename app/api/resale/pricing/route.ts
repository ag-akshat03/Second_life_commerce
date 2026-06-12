/**
 * POST /api/resale/pricing
 * Module 8c — Pricing & Exchange Decision Engine
 * 
 * listing_price = original_price × depreciation × tier_multiplier × demand_adj
 * exchange_value = listing_equivalent × exchange_discount_factor
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEPRECIATION_YEAR_1,
  EXCHANGE_DISCOUNT_FACTOR,
  CONDITION_TIERS,
  COMMISSION_RATE,
} from "@/lib/second-life-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      sellerId,
      originalPrice,
      conditionTier,
      finalConditionScore,
      cosmeticScore,
      functionalScore,
      ageYears = 1.0,
      isBuyingReplacement = false,
      invoiceData,
      functionalResponses,
    } = body;

    if (!originalPrice || !conditionTier) {
      return NextResponse.json(
        { error: "originalPrice and conditionTier required" },
        { status: 422 }
      );
    }

    // Get tier multiplier
    const tierConfig = CONDITION_TIERS[conditionTier as keyof typeof CONDITION_TIERS];
    const tierMultiplier = tierConfig?.multiplier ?? 0;

    // Depreciation (flat 70% year-1, compounding)
    const depreciationFactor = Math.pow(DEPRECIATION_YEAR_1, Math.min(ageYears, 5));

    // Demand adjustment (stub: 1.0 — would use live demand data in production)
    const demandAdjustment = 1.0;

    // Recommendation logic
    let recommendation: "list" | "exchange" | "donate_recycle";
    if (conditionTier === "LIKE_NEW" || conditionTier === "GOOD") {
      recommendation = "list";
    } else if (conditionTier === "ACCEPTABLE") {
      recommendation = isBuyingReplacement ? "exchange" : "list";
    } else {
      recommendation = isBuyingReplacement ? "exchange" : "donate_recycle";
    }

    // Compute listing price
    let listingPrice: number | null = null;
    if (recommendation === "list" || conditionTier !== "POOR") {
      listingPrice = Math.round(originalPrice * depreciationFactor * tierMultiplier * demandAdjustment * 100) / 100;
    }

    // Compute exchange value
    let exchangeValue: number | null = null;
    if (isBuyingReplacement || conditionTier === "POOR") {
      const effectiveMultiplier = Math.max(tierMultiplier, 0.3);
      const listingEquivalent = originalPrice * depreciationFactor * effectiveMultiplier;
      exchangeValue = Math.round(listingEquivalent * EXCHANGE_DISCOUNT_FACTOR * 100) / 100;
    }

    // Save to DB if productId and sellerId provided
    let listingId: string | null = null;
    if (productId && sellerId) {
      const listing = await prisma.resaleListing.create({
        data: {
          sellerId,
          productId,
          conditionTier: conditionTier as any,
          cosmeticScore: cosmeticScore || finalConditionScore || 50,
          functionalScore: functionalScore || null,
          finalConditionScore: finalConditionScore || cosmeticScore || 50,
          listingPrice,
          exchangeValue,
          originalPrice,
          depreciationFactor,
          demandAdjustment,
          status: recommendation === "list" ? "LISTED" : "PENDING_VERIFICATION",
          recommendation,
          invoiceData: invoiceData || undefined,
          invoiceVerified: !!invoiceData,
          ownershipVerified: !!invoiceData,
          commissionRate: COMMISSION_RATE,
          functionalResponses: functionalResponses || undefined,
        },
      });
      listingId = listing.id;
    }

    return NextResponse.json({
      recommendation,
      listingPrice,
      exchangeValue,
      originalPrice,
      depreciationFactor: Math.round(depreciationFactor * 10000) / 10000,
      tierMultiplier,
      demandAdjustment,
      conditionTier,
      listingId,
      commissionRate: COMMISSION_RATE,
      sellerPayout: listingPrice ? Math.round(listingPrice * (1 - COMMISSION_RATE) * 100) / 100 : null,
    });
  } catch (error: any) {
    console.error("Resale pricing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
