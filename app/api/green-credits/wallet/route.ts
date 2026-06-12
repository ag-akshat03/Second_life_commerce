/**
 * GET /api/green-credits/wallet?userId=xxx
 * Module 6 — Get user's Green Credits wallet (balance + lifetime CO2e + transactions)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query param required" }, { status: 422 });
  }

  const ledgerEntries = await prisma.greenCreditsLedger.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const creditsBalance = ledgerEntries.reduce((sum, e) => sum + e.creditsAwarded, 0);
  const lifetimeCo2eAvoided = ledgerEntries
    .filter((e) => e.deltaCo2eKg > 0)
    .reduce((sum, e) => sum + e.deltaCo2eKg, 0);

  return NextResponse.json({
    userId,
    creditsBalance,
    lifetimeCo2eAvoided: Math.round(lifetimeCo2eAvoided * 100) / 100,
    transactions: ledgerEntries.map((e) => ({
      id: e.transactionId,
      type: e.type,
      credits: e.creditsAwarded,
      co2e: e.deltaCo2eKg,
      category: e.category,
      bonusMultiplier: e.bonusMultiplierApplied,
      discountValue: e.discountValue,
      createdAt: e.createdAt,
    })),
  });
}
