/**
 * POST /api/green-credits/donate-recycle
 * Module 6+9 — Award Green Credits for donation/recycling
 * 
 * ΔCO2e = E_virgin_mfg + E_warehouse_reverse - E_p2p_transport
 * Credits = ΔCO2e × CREDITS_PER_KG_CO2E
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CARBON_FACTORS,
  E_WAREHOUSE_REVERSE_KG,
  E_P2P_TRANSPORT_KG,
  CREDITS_PER_KG_CO2E,
  TREE_EQUIVALENT_KG,
} from "@/lib/second-life-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, itemId, category, choice } = body;

    if (!userId || !category || !choice) {
      return NextResponse.json(
        { error: "userId, category, and choice (donate|recycle) required" },
        { status: 422 }
      );
    }

    // Step 1: Compute ΔCO2e
    const factors = CARBON_FACTORS[category] || CARBON_FACTORS.electronics;
    const eVirginMfg = factors.avg;
    const deltaCo2e = eVirginMfg + E_WAREHOUSE_REVERSE_KG; // No P2P for donation

    // Step 2: Convert to credits
    const creditsAwarded = Math.max(1, Math.round(deltaCo2e * CREDITS_PER_KG_CO2E));

    // Step 3: Write to ledger
    const transactionId = `txn_${userId}_${Date.now()}`;
    await prisma.greenCreditsLedger.create({
      data: {
        userId,
        transactionId,
        type: choice === "donate" ? "DONATION" : "RECYCLING",
        role: "donor",
        creditsAwarded,
        deltaCo2eKg: deltaCo2e,
        category,
        itemId: itemId || null,
      },
    });

    // Step 4: Celebratory message
    const treesEquivalent = Math.round((deltaCo2e / TREE_EQUIVALENT_KG) * 10) / 10;
    const message = `🌱 You just earned ${creditsAwarded} Green Credits and helped avoid ${deltaCo2e.toFixed(1)} kg of CO2e — equivalent to planting ${treesEquivalent} trees!`;

    return NextResponse.json({
      creditsAwarded,
      deltaCo2eKg: deltaCo2e,
      treesEquivalent,
      message,
      transactionId,
      eVirginMfg,
      eWarehouseReverse: E_WAREHOUSE_REVERSE_KG,
    });
  } catch (error: any) {
    console.error("Green credits donate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
