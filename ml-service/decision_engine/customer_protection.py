"""
Customer Protection Layer
Safeguards to prevent genuine claim rejection.

RULES:
1. Low confidence (<70%) → manual review
2. Severe complaints → always escalate
3. Category exceptions (electronics, appliances, high-value)
4. Image + complaint disagreement → manual review
5. NEVER auto-reject

Allowed outputs ONLY:
- approve_return
- approve_replacement
- offer_partial_refund
- manual_review

DISALLOWED:
- auto_reject (NEVER)
"""
import logging

logger = logging.getLogger(__name__)

# Categories that always get elevated review
PROTECTED_CATEGORIES = ["electronics", "appliances", "laptop", "smartphone", "monitor"]
HIGH_VALUE_THRESHOLD = 10000  # ₹10,000+

# Severe complaint keywords that always escalate
SEVERE_KEYWORDS = [
    "safety", "hazard", "fire", "smoke", "burn", "electric shock",
    "injury", "broken", "exploded", "dangerous", "health risk",
    "completely dead", "not working at all", "fraud",
]


def apply_protections(
    condition: dict,
    intent: dict,
    fraud: dict,
    logistics: dict,
    decision: dict,
    product_value: float,
    category: str,
    complaint_text: str = "",
) -> dict:
    """
    Apply customer protection safeguards.
    Can ONLY upgrade decisions (more favorable to customer).
    Can NEVER downgrade or reject.
    """
    original_recommendation = decision["recommendation"]
    protections_applied = []
    escalate_to_manual = False
    override_to_approve = False

    # === SAFEGUARD 1: Low confidence → manual review ===
    if condition["confidence_score"] < 0.70:
        escalate_to_manual = True
        protections_applied.append(
            "Low AI confidence (< 70%) — escalating to human reviewer")

    # === SAFEGUARD 2: Severe complaints → always escalate ===
    complaint_lower = complaint_text.lower()
    if any(kw in complaint_lower for kw in SEVERE_KEYWORDS):
        escalate_to_manual = True
        override_to_approve = True  # Bias toward customer
        protections_applied.append(
            "Severe complaint detected — prioritizing customer safety")

    # === SAFEGUARD 3: Protected categories ===
    if category.lower() in PROTECTED_CATEGORIES or product_value >= HIGH_VALUE_THRESHOLD:
        if condition["damage_severity_score"] > 30:
            escalate_to_manual = True
            protections_applied.append(
                f"Protected category ({category}) or high-value item — human review required")

    # === SAFEGUARD 4: Image vs complaint disagreement ===
    if condition.get("disagreement_flag"):
        escalate_to_manual = True
        protections_applied.append(
            "Image analysis and customer report disagree — manual review needed")

    # === SAFEGUARD 5: NEVER auto-reject ===
    # If somehow the decision says reject, override it
    if "reject" in str(original_recommendation).lower():
        override_to_approve = True
        protections_applied.append(
            "Auto-reject overridden — customer protection policy")

    # Apply protections
    final_recommendation = original_recommendation
    if override_to_approve:
        final_recommendation = "approve_return"
    elif escalate_to_manual and original_recommendation not in [
        "full_refund", "full_refund_with_return", "approve_return"
    ]:
        final_recommendation = "manual_review"

    # Ensure output is only from allowed list
    ALLOWED = ["approve_return", "approve_replacement",
               "offer_partial_refund", "manual_review",
               "full_refund", "full_refund_with_return",
               "compensation_keep_product", "offer_choices"]

    if final_recommendation not in ALLOWED:
        final_recommendation = "manual_review"
        protections_applied.append(f"Unknown recommendation '{original_recommendation}' → manual review")

    return {
        "final_recommendation": final_recommendation,
        "original_recommendation": original_recommendation,
        "protections_applied": protections_applied,
        "escalated_to_manual": escalate_to_manual,
        "customer_protected": override_to_approve,
        "decision_modified": final_recommendation != original_recommendation,
    }
