/**
 * POST /api/returns/decision
 * Calls the 5-stage ML decision engine on port 8000
 * Then formats the response for the frontend
 */
import { NextRequest, NextResponse } from "next/server";
import { callMLService } from "@/lib/ml-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId, productId, orderId, images, skuId, variant,
      skuDescription, returnReason, complaintText, customerAnswers,
      productValue = 24999, productAgeMonths = 6, warrantyStatus = "expired",
      category = "electronics"
    } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, productId" },
        { status: 422 }
      );
    }

    // Call the 5-stage decision engine
    let result: any;
    try {
      result = await callMLService("/returns/decide", {
        images: images || [],
        category: category,
        product_value: productValue,
        return_reason: returnReason || "no_longer_needed",
        complaint_text: complaintText || returnReason || "",
        customer_answers: customerAnswers || null,
        user_id: userId,
        weight_kg: 1.0,
        return_history: null,
        product_age_months: productAgeMonths,
        warranty_status: warrantyStatus,
      });
    } catch {
      // ML service unavailable — use sensible default
      result = {
        decision: {
          recommendation: "full_refund_with_return",
          confidence: 0.7,
          reason_codes: ["ml_service_unavailable"],
          refund_amount: productValue,
          customer_explanation: "Return approved. Refund will be processed after pickup.",
          compensation: {
            case: "A",
            compensation_amount: Math.round(productValue * 0.15),
            compensation_percentage: 15,
            options: [
              { id: "full_return", label: `Full refund: ₹${productValue} (after pickup)`, amount: productValue },
              { id: "accept_compensation", label: `Keep product + ₹${Math.round(productValue * 0.15)} refund`, amount: Math.round(productValue * 0.15) },
            ],
            allows_full_return: true,
            explanation: `Product Value: ₹${productValue}\nRecommended: Full return with refund`,
          },
          protection: { protections_applied: [], escalated_to_manual: false },
          options_available: [],
        },
        stages: {},
        processing_time_ms: 0,
      };
    }

    // Format for frontend
    const decision = result.decision || result;
    const compensation = decision.compensation || {};
    const protection = decision.protection || {};

    return NextResponse.json({
      // Core decision
      recommendation: decision.recommendation,
      confidence: decision.confidence,
      refundAmount: decision.refund_amount,
      customerExplanation: decision.customer_explanation,

      // Compensation details
      compensationCase: compensation.case,
      compensationAmount: compensation.compensation_amount,
      compensationPercentage: compensation.compensation_percentage,
      compensationExplanation: compensation.explanation,
      options: compensation.options || decision.options_available || [],
      allowsFullReturn: compensation.allows_full_return !== false,

      // Condition info
      conditionSeverity: result.stages?.condition?.damage_severity_score,
      conditionConfidence: result.stages?.condition?.confidence_score,
      detectedDamage: result.stages?.condition?.detected_damage_categories,

      // Intent
      intent: result.stages?.intent?.primary_intent,
      isGenuineIssue: result.stages?.intent?.is_genuine_issue,

      // Protection
      protectionsApplied: protection.protections_applied || [],
      escalatedToManual: protection.escalated_to_manual || false,

      // Fraud (shown separately, never affects refund)
      fraudRisk: result.stages?.fraud?.fraud_risk_score,

      // Meta
      processingTimeMs: result.processing_time_ms,
      reasonCodes: decision.reason_codes,
    });
  } catch (error: any) {
    console.error("Returns decision error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skuId = searchParams.get("skuId");
  if (!skuId) return NextResponse.json({ matched: false });
  return NextResponse.json({ matched: false });
}
