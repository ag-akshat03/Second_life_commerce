"""
Stage 5: Decision Layer
Explainable rule-based + ML hybrid approach.
Does NOT use a single threshold score for final decisions.
Uses multiple signals with transparent reasoning.
"""
import logging

logger = logging.getLogger(__name__)


def make_decision(condition: dict, intent: dict,
                  fraud: dict, logistics: dict,
                  product_value: float) -> dict:
    """
    Final decision using ALL stage outputs.
    Rules are explicit and explainable — no black-box scoring.
    """
    severity = condition["damage_severity_score"]
    confidence = condition["confidence_score"]
    intent_type = intent["primary_intent"]
    is_genuine = intent["is_genuine_issue"]
    fraud_risk = fraud["fraud_risk_score"]
    return_viable = logistics["return_economically_viable"]

    reason_codes = []
    recommendation = None
    refund_amount = 0
    customer_explanation = ""

    # === RULE 1: Genuine defect/damage → full refund regardless ===
    if is_genuine and intent_type in ["defective", "damaged_in_transit", "wrong_item"]:
        recommendation = "full_refund"
        refund_amount = round(product_value)
        reason_codes.append("genuine_product_issue")
        reason_codes.append(f"intent:{intent_type}")
        customer_explanation = (
            "We're sorry for the inconvenience. Based on our assessment, "
            "this qualifies for a full refund. A pickup will be scheduled."
        )

    # === RULE 2: Missing parts → partial or full based on severity ===
    elif intent_type == "missing_parts":
        if severity < 30:
            recommendation = "full_refund"
            refund_amount = round(product_value)
            reason_codes.append("missing_parts_product_functional")
        else:
            recommendation = "partial_refund_keep_product"
            refund_amount = round(product_value * 0.3)
            reason_codes.append("missing_parts_partial_impact")
        customer_explanation = (
            "We understand parts are missing. "
            f"{'Full refund with return.' if recommendation == 'full_refund' else 'Partial refund — you may keep the product.'}"
        )

    # === RULE 3: Good condition + return viable → standard return ===
    elif severity < 25 and return_viable:
        recommendation = "full_refund_with_return"
        refund_amount = round(product_value)
        reason_codes.append("product_in_good_condition")
        reason_codes.append("return_economically_viable")
        customer_explanation = (
            "Your product is in good condition. Full refund will be processed "
            "after pickup. A delivery agent will collect it within 2-3 days."
        )

    # === RULE 4: Good condition but return NOT viable → keep + partial ===
    elif severity < 25 and not return_viable:
        recommendation = "partial_refund_keep_product"
        pct = 0.20  # 20% for good condition, economics don't justify return
        refund_amount = round(product_value * pct)
        reason_codes.append("product_good_condition")
        reason_codes.append("return_logistics_exceed_value")
        customer_explanation = (
            f"The return shipping cost exceeds the practical value. "
            f"You can keep the product and receive ₹{refund_amount} as compensation."
        )

    # === RULE 5: Moderate damage + return viable → refund with return ===
    elif severity < 50 and return_viable:
        recommendation = "full_refund_with_return"
        refund_amount = round(product_value)
        reason_codes.append("moderate_condition")
        reason_codes.append("return_viable_for_resale")
        customer_explanation = (
            "Refund approved. Please schedule a pickup — the product can still "
            "be refurbished and resold, helping reduce waste."
        )

    # === RULE 6: Moderate damage + return NOT viable → compensation ===
    elif severity < 50 and not return_viable:
        compensation_pct = logistics["compensation_percentage"] / 100
        recommendation = "compensation_keep_product"
        refund_amount = logistics["optimal_compensation_amount"]
        reason_codes.append("moderate_condition")
        reason_codes.append("compensation_more_efficient")
        customer_explanation = (
            f"Based on our assessment, we can offer ₹{refund_amount} "
            f"({logistics['compensation_percentage']}% of product value) as compensation. "
            f"You keep the product — no return needed."
        )

    # === RULE 7: Significant damage → offer choices ===
    elif severity >= 50:
        compensation_pct = logistics["compensation_percentage"] / 100
        refund_amount = logistics["optimal_compensation_amount"]
        recommendation = "offer_choices"
        reason_codes.append("significant_condition_issues")
        reason_codes.append("multiple_options_available")
        customer_explanation = (
            f"Our AI detected condition issues (score: {100 - round(severity)}/100). "
            f"Options: (1) Keep product + ₹{refund_amount} compensation, "
            f"(2) Resell on marketplace, (3) Donate for Green Credits."
        )

    # === RULE 8: Low confidence → manual review ===
    if confidence < 0.5 and recommendation != "full_refund":
        reason_codes.append("low_confidence_manual_review")
        customer_explanation += " (Our system wants a human reviewer to confirm this assessment.)"

    # === Fraud handling (NEVER reduces refund, only adds review) ===
    if fraud["needs_manual_review"]:
        reason_codes.append("fraud_flag_manual_review")
        # Do NOT change refund_amount based on fraud score

    # Final decision confidence
    decision_confidence = min(confidence, intent["confidence"])
    if fraud["needs_manual_review"]:
        decision_confidence *= 0.8

    return {
        "recommendation": recommendation or "manual_review",
        "confidence": round(decision_confidence, 2),
        "reason_codes": reason_codes,
        "refund_amount": refund_amount,
        "customer_explanation": customer_explanation,
        "refund_percentage": round((refund_amount / product_value) * 100) if product_value > 0 else 0,
        "options_available": _get_available_options(recommendation, refund_amount, logistics, severity),
        "stage_summaries": {
            "condition": f"Severity {severity}/100, confidence {confidence}",
            "intent": f"{intent_type} (genuine={is_genuine})",
            "fraud": f"Risk {fraud_risk}/100 ({'review needed' if fraud['needs_manual_review'] else 'ok'})",
            "logistics": f"Return {'viable' if return_viable else 'not viable'}, "
                        f"resale value ₹{logistics['estimated_resale_value']}",
        },
    }


def _get_available_options(recommendation: str, refund_amount: int,
                          logistics: dict, severity: float) -> list:
    """Generate available options for the customer."""
    options = []

    if recommendation in ["full_refund", "full_refund_with_return"]:
        options.append({
            "id": "full_refund",
            "title": "Full Refund",
            "description": f"₹{refund_amount} refund after pickup",
            "amount": refund_amount,
            "requires_return": True,
        })
    
    if recommendation in ["partial_refund_keep_product", "compensation_keep_product", "offer_choices"]:
        options.append({
            "id": "compensation",
            "title": "Keep Product + Compensation",
            "description": f"₹{refund_amount} credited to your account (no return needed)",
            "amount": refund_amount,
            "requires_return": False,
        })

    if severity < 60:
        options.append({
            "id": "resell",
            "title": "Resell on Marketplace",
            "description": f"List for ~₹{logistics['estimated_resale_value']} on Amazon Resale",
            "amount": logistics["estimated_resale_value"],
            "requires_return": False,
        })

    options.append({
        "id": "donate",
        "title": "Donate & Earn Green Credits",
        "description": "Help someone in need + earn credits for future purchases",
        "amount": 0,
        "requires_return": True,
    })

    return options
