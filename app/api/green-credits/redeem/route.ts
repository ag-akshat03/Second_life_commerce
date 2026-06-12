/**
 * POST /api/green-credits/redeem
 * Module 9 — Redeem Green Credits with bonus multiplier for refurbished items
 * 
 * Standard: 1 credit = ₹1
 * Refurbished: 1 credit = ₹1.30 (REFURBISHED_BONUS_MULTIPLIER)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REFURBISHED_BONUS_MULTIPLIER } from "@/lib/second-life-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, creditsToRedeem, targetItemIsRefurbished = false } = body;

    if (!userId || !creditsToRedeem || creditsToRedeem <= 0) {
      return NextResponse.json(
        { error: "userId and positive creditsToRedeem required" },
        { status: 422 }
      );
    }

    // Get current balance from ledger
    const ledgerEntries = await prisma.greenCreditsLedger.findMany({
      where: { userId },
    });

    const balance = ledgerEntries.reduce((sum, entry) => sum + entry.creditsAwarded, 0);

    if (creditsToRedeem > balance) {
      return NextResponse.json({
        success: false,
        error: `Insufficient credits. Balance: ${balance}, requested: ${creditsToRedeem}`,
      });
    }

    // Apply bonus multiplier
    const multiplier = targetItemIsRefurbished ? REFURBISHED_BONUS_MULTIPLIER : 1.0;
    const discountValue = Math.round(creditsToRedeem * multiplier * 100) / 100;

    // Write redemption to ledger (negative credits)
    const transactionId = `redeem_${userId}_${Date.now()}`;
    await prisma.greenCreditsLedger.create({
      data: {
        userId,
        transactionId,
        type: "REDEMPTION",
        role: "buyer",
        creditsAwarded: -creditsToRedeem, // Negative for redemption
        deltaCo2eKg: 0,
        bonusMultiplierApplied: multiplier,
        discountValue,
      },
    });

    const newBalance = balance - creditsToRedeem;
    const bonusMsg = targetItemIsRefurbished
      ? ` (includes ${Math.round((multiplier - 1) * 100)}% bonus for refurbished item!)`
      : "";

    return NextResponse.json({
      success: true,
      creditsRedeemed: creditsToRedeem,
      discountValue,
      multiplierApplied: multiplier,
      remainingBalance: newBalance,
      message: `₹${discountValue.toFixed(0)} discount applied${bonusMsg}`,
    });
  } catch (error: any) {
    console.error("Green credits redeem error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
