/**
 * POST /api/resale/condition
 * Module 8b — Condition Grading (cosmetic + functional → final score → tier)
 */
import { NextRequest, NextResponse } from "next/server";
import { COSMETIC_WEIGHT, FUNCTIONAL_WEIGHT, CONDITION_TIERS } from "@/lib/second-life-constants";

const FUNCTIONAL_SCORE_MAP: Record<string, Record<string, number>> = {
  power_on: { yes: 100, intermittent: 50, no: 0 },
  battery_health: { "good (>80%)": 100, "fair (50-80%)": 60, "poor (<50%)": 20 },
  performance: { "same as new": 100, "slightly slower": 60, "significantly slower": 15 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cosmeticScore, functionalResponses, category } = body;

    if (cosmeticScore === undefined) {
      return NextResponse.json({ error: "cosmeticScore required" }, { status: 422 });
    }

    // Compute functional score from questionnaire responses
    let functionalScore = 100;
    if (functionalResponses && category && ["electronics", "laptops", "monitors"].includes(category)) {
      const scores: number[] = [];
      for (const [qId, answer] of Object.entries(functionalResponses)) {
        const map = FUNCTIONAL_SCORE_MAP[qId];
        if (map) {
          scores.push(map[answer as string] ?? 50);
        }
      }
      functionalScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
    }

    // Combined score (weighted for electronics, cosmetic-only otherwise)
    let finalScore: number;
    if (["electronics", "laptops", "monitors"].includes(category)) {
      finalScore = Math.round(COSMETIC_WEIGHT * cosmeticScore + FUNCTIONAL_WEIGHT * functionalScore);
    } else {
      finalScore = cosmeticScore;
    }
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Map to tier
    let conditionTier = "POOR";
    for (const [tier, { min, max }] of Object.entries(CONDITION_TIERS)) {
      if (finalScore >= min && finalScore <= max) {
        conditionTier = tier;
        break;
      }
    }

    return NextResponse.json({
      finalConditionScore: finalScore,
      conditionTier,
      cosmeticScore,
      functionalScore: Math.round(functionalScore * 10) / 10,
      category,
      weights: ["electronics", "laptops", "monitors"].includes(category)
        ? { cosmetic: COSMETIC_WEIGHT, functional: FUNCTIONAL_WEIGHT }
        : { cosmetic: 1.0 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
