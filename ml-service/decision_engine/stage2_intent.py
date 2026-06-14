"""
Stage 2: Customer Intent Analysis
Classifies the return reason into actionable categories.
"""
import logging

logger = logging.getLogger(__name__)

INTENT_CATEGORIES = {
    "defective": {"keywords": ["defective", "broken", "not working", "faulty", "dead"],
                  "refund_eligibility": "full", "priority": "high"},
    "damaged_in_transit": {"keywords": ["damaged", "shipping", "delivery", "box", "crushed"],
                           "refund_eligibility": "full", "priority": "high"},
    "wrong_item": {"keywords": ["wrong", "different", "not what I ordered", "incorrect"],
                   "refund_eligibility": "full", "priority": "high"},
    "missing_parts": {"keywords": ["missing", "incomplete", "no charger", "no cable"],
                      "refund_eligibility": "full_or_partial", "priority": "medium"},
    "buyer_remorse": {"keywords": ["no longer", "changed mind", "better price", "don't need"],
                      "refund_eligibility": "conditional", "priority": "low"},
    "size_fit": {"keywords": ["size", "fit", "small", "large", "tight", "loose"],
                 "refund_eligibility": "full", "priority": "medium"},
    "warranty_issue": {"keywords": ["warranty", "stopped working", "after some time"],
                       "refund_eligibility": "warranty_claim", "priority": "medium"},
}


def classify_intent(return_reason: str, complaint_text: str = "") -> dict:
    """
    Classify customer intent from reason code + free text.
    """
    combined_text = f"{return_reason} {complaint_text}".lower()

    # Score each category
    scores = {}
    for category, config in INTENT_CATEGORIES.items():
        score = sum(1 for kw in config["keywords"] if kw in combined_text)
        if score > 0:
            scores[category] = score

    # Primary intent = highest scoring
    if scores:
        primary = max(scores, key=scores.get)
    else:
        primary = "buyer_remorse"  # Default if unclear

    config = INTENT_CATEGORIES[primary]
    confidence = min(0.9, 0.5 + (scores.get(primary, 0) * 0.15))

    return {
        "primary_intent": primary,
        "confidence": round(confidence, 2),
        "refund_eligibility": config["refund_eligibility"],
        "priority": config["priority"],
        "all_detected_intents": list(scores.keys()),
        "is_genuine_issue": primary in ["defective", "damaged_in_transit",
                                         "wrong_item", "missing_parts"],
    }
