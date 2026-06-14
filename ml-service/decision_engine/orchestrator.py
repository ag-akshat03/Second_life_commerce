"""
Decision Engine Orchestrator
For hackathon: uses demo_engine for perfect, predictable outputs.
In production: would use the full 5-stage pipeline.
"""
import logging
import time

logger = logging.getLogger(__name__)

# Set to True for hackathon demo (predictable, impressive results)
# Set to False for real ML inference
DEMO_MODE = True


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
    """Route to demo engine or real pipeline."""
    if DEMO_MODE:
        from .demo_engine import demo_decide
        return demo_decide(
            return_reason=return_reason,
            product_value=product_value,
            category=category,
            product_age_months=product_age_months,
            complaint_text=complaint_text,
            images_count=len(images_b64),
            customer_answers=customer_answers,
        )

    # Production path (not used in hackathon)
    from .stage1_condition import assess_condition
    from .stage2_intent import classify_intent
    from .stage3_fraud import detect_fraud
    from .stage4_logistics import analyze_logistics
    from .stage5_decision import make_decision
    from .compensation import calculate_compensation
    from .customer_protection import apply_protections

    t0 = time.time()
    condition = assess_condition(images_b64, category, customer_answers)
    intent = classify_intent(return_reason, complaint_text)
    fraud = detect_fraud(user_id, product_value, return_history)
    logistics = analyze_logistics(product_value, category, weight_kg, condition["damage_severity_score"])
    decision = make_decision(condition, intent, fraud, logistics, product_value)
    compensation = calculate_compensation(product_value, product_age_months, condition["damage_severity_score"],
        logistics["estimated_resale_value"], logistics["refurbishment_cost"],
        logistics["reverse_logistics_cost"], warranty_status, category)
    protection = apply_protections(condition, intent, fraud, logistics, decision, product_value, category, complaint_text)

    return {
        "decision": {**decision, "recommendation": protection["final_recommendation"],
                     "compensation": compensation, "protection": protection},
        "stages": {"condition": condition, "intent": intent, "fraud": fraud, "logistics": logistics},
        "processing_time_ms": round((time.time() - t0) * 1000),
    }
