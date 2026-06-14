"""
Dynamic Compensation Engine
Generates fair, explainable compensation with human-readable reasoning.
Never auto-rejects. Always provides options.

Compensation Rules:
- Case A (severity <20): 5-15% — minor cosmetic, fully functional
- Case B (severity 20-50): 15-40% — moderate damage, function intact
- Case C (severity >50): Full return/replacement/refund offered
"""
import logging

logger = logging.getLogger(__name__)


def calculate_compensation(
    product_price: float,
    product_age_months: int,
    damage_severity: float,
    resale_value: float,
    repair_cost: float,
    logistics_cost: float,
    warranty_status: str = "expired",
    category: str = "electronics",
) -> dict:
    """
    Calculate fair compensation with full explainability.
    Every output includes human-readable reasoning.
    """
    # Age depreciation factor
    if product_age_months <= 1:
        age_factor = 1.0
    elif product_age_months <= 6:
        age_factor = 0.90
    elif product_age_months <= 12:
        age_factor = 0.75
    elif product_age_months <= 24:
        age_factor = 0.55
    else:
        age_factor = 0.35

    current_value = product_price * age_factor
    reasoning_parts = []

    # === CASE A: Minor cosmetic (<20 severity) ===
    if damage_severity < 20:
        pct = 0.05 + (damage_severity / 20) * 0.10  # 5-15%
        amount = round(current_value * pct)
        reasoning_parts.append(
            f"Minor cosmetic issue (severity {damage_severity:.0f}/100)")
        reasoning_parts.append("Product remains fully functional")
        reasoning_parts.append(
            f"Compensation: {pct*100:.0f}% of current value (₹{current_value:.0f})")

        return {
            "case": "A",
            "compensation_amount": amount,
            "compensation_percentage": round(pct * 100),
            "current_product_value": round(current_value),
            "explanation": _build_explanation(
                product_price, damage_severity, amount,
                "Visible minor marks but functionality remains fully intact."
            ),
            "reasoning": reasoning_parts,
            "options": [
                {"id": "accept_compensation", "label": f"Accept ₹{amount} compensation (keep product)", "amount": amount},
                {"id": "resell", "label": f"List on marketplace (~₹{round(resale_value)})", "amount": round(resale_value)},
            ],
            "allows_full_return": False,
            "requires_return": False,
        }

    # === CASE B: Moderate damage (20-50 severity) ===
    elif damage_severity <= 50:
        pct = 0.15 + ((damage_severity - 20) / 30) * 0.25  # 15-40%
        amount = round(current_value * pct)
        reasoning_parts.append(
            f"Moderate damage detected (severity {damage_severity:.0f}/100)")
        reasoning_parts.append("Core functionality likely intact")
        reasoning_parts.append(
            f"Compensation: {pct*100:.0f}% of current value (₹{current_value:.0f})")

        # For moderate: offer compensation OR return
        options = [
            {"id": "accept_compensation", "label": f"Accept ₹{amount} compensation (keep product)", "amount": amount},
            {"id": "full_return", "label": f"Full return for ₹{round(current_value)} refund", "amount": round(current_value)},
            {"id": "resell", "label": f"List on marketplace (~₹{round(resale_value)})", "amount": round(resale_value)},
        ]

        # If repair is cheaper than replacement, offer repair option
        if repair_cost < current_value * 0.3:
            options.append({"id": "repair", "label": f"Free repair (est. cost ₹{round(repair_cost)})", "amount": 0})

        return {
            "case": "B",
            "compensation_amount": amount,
            "compensation_percentage": round(pct * 100),
            "current_product_value": round(current_value),
            "explanation": _build_explanation(
                product_price, damage_severity, amount,
                "Noticeable damage affecting appearance. Product functionality may be partially impacted."
            ),
            "reasoning": reasoning_parts,
            "options": options,
            "allows_full_return": True,
            "requires_return": False,
        }

    # === CASE C: Severe damage (>50 severity) ===
    else:
        # NEVER force compensation-only for severe damage
        # Always offer full return / replacement / full refund
        amount = round(current_value * 0.85)  # High compensation if they want to keep
        reasoning_parts.append(
            f"Significant damage detected (severity {damage_severity:.0f}/100)")
        reasoning_parts.append("Full return, replacement, or refund available")

        options = [
            {"id": "full_refund", "label": f"Full refund: ₹{round(current_value)} (after pickup)", "amount": round(current_value)},
            {"id": "replacement", "label": "Free replacement (same product)", "amount": 0},
            {"id": "accept_compensation", "label": f"Keep product + ₹{amount} refund", "amount": amount},
            {"id": "donate", "label": "Donate + earn Green Credits", "amount": 0},
        ]

        # Warranty active = always full refund/replacement
        if warranty_status == "active":
            reasoning_parts.append("Product under warranty — full coverage applies")

        return {
            "case": "C",
            "compensation_amount": amount,
            "compensation_percentage": round((amount / current_value) * 100) if current_value > 0 else 0,
            "current_product_value": round(current_value),
            "explanation": _build_explanation(
                product_price, damage_severity, amount,
                "Significant damage detected. You are entitled to a full return, replacement, or refund."
            ),
            "reasoning": reasoning_parts,
            "options": options,
            "allows_full_return": True,
            "requires_return": False,
        }


def _build_explanation(product_price: float, severity: float,
                       amount: int, condition_desc: str) -> str:
    """Generate human-readable explanation for every compensation offer."""
    return (
        f"Product Value: ₹{product_price:,.0f}\n"
        f"Damage Severity: {severity:.0f}/100\n"
        f"Recommended Compensation: ₹{amount:,}\n"
        f"Explanation: \"{condition_desc}\""
    )
