"""
Decision Engine Orchestrator
Runs all 5 stages + compensation + customer protection.
NEVER auto-rejects. Always provides options.
"""
import logging
import time

from .stage1_condition import assess_condition
from .stage2_intent import classify_intent
from .stage3_fraud import detect_fraud
from .stage4_logistics import analyze_logistics
from .stage5_decision import make_decision
from .compensation import calculate_compensation
from .customer_protection import apply_protections

logger = logging.getLogger(__name__)


def process_return_request(
    images_b64: list,
    category: str,
    product_value: float,
    return_reason: str,
    complaint_text: str = "",
    customer_answers: dict = None,
    user_id: str = "unknown",
    weight_kg: float = 1.0,
    return_history: dict = None,
    product_age_months: int = 6,
    warranty_status: str = "expired",
) -> dict:
    """
    Full pipeline: 5 stages + compensation + customer protection.
    """
    t0 = time.time()

    # Stage 1: Product Condition
    condition = assess_condition(images_b64, category, customer_answers)

    # Stage 2: Customer Intent
    intent = classify_intent(return_reason, complaint_text)

    # Stage 3: Fraud (independent)
    fraud = detect_fraud(user_id, product_value, return_history)

    # Stage 4: Logistics
    logistics = analyze_logistics(
        product_value, category, weight_kg,
        condition["damage_severity_score"]
    )

    # Stage 5: Decision
    decision = make_decision(condition, intent, fraud, logistics, product_value)

    # Compensation calculation (explainable)
    compensation = calculate_compensation(
        product_price=product_value,
        product_age_months=product_age_months,
        damage_severity=condition["damage_severity_score"],
        resale_value=logistics["estimated_resale_value"],
        repair_cost=logistics["refurbishment_cost"],
        logistics_cost=logistics["reverse_logistics_cost"],
        warranty_status=warranty_status,
        category=category,
    )

    # Customer protection layer (NEVER rejects)
    protection = apply_protections(
        condition, intent, fraud, logistics, decision,
        product_value, category, complaint_text,
    )

    elapsed = time.time() - t0

    return {
        "decision": {
            **decision,
            "recommendation": protection["final_recommendation"],
            "compensation": compensation,
            "protection": protection,
        },
        "stages": {
            "condition": condition,
            "intent": intent,
            "fraud": fraud,
            "logistics": logistics,
        },
        "processing_time_ms": round(elapsed * 1000),
    }
