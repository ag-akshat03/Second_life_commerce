"""
Stage 3: Fraud Detection
Separate from condition assessment — NEVER influences damage scoring.
Only flags suspicious patterns for manual review.
"""
import logging

logger = logging.getLogger(__name__)


def detect_fraud(user_id: str, product_value: float,
                 return_history: dict = None) -> dict:
    """
    Fraud risk assessment.
    This is INDEPENDENT of damage assessment.
    A high fraud score does NOT reduce refund amount.
    It only triggers manual review.
    """
    risk_score = 0
    flags = []

    # Check return frequency (demo: simulate from user_id)
    history = return_history or {}
    returns_last_30d = history.get("returns_last_30d", 0)
    total_returns = history.get("total_returns", 2)
    account_age_days = history.get("account_age_days", 365)

    # Frequency check
    if returns_last_30d > 3:
        risk_score += 25
        flags.append("high_return_frequency")
    elif returns_last_30d > 1:
        risk_score += 10

    # Value check
    if product_value > 50000:
        risk_score += 10  # High-value items get slight flag

    # Account age
    if account_age_days < 30:
        risk_score += 20
        flags.append("new_account")

    # Return rate
    if total_returns > 5 and account_age_days < 180:
        risk_score += 15
        flags.append("high_return_rate")

    risk_score = min(100, risk_score)
    needs_review = risk_score > 50

    return {
        "fraud_risk_score": risk_score,
        "needs_manual_review": needs_review,
        "flags": flags,
        "explanation": _explain(risk_score, flags),
        # CRITICAL: This does NOT affect refund calculation
        "affects_refund": False,
    }


def _explain(score: int, flags: list) -> str:
    if score < 20:
        return "Low risk — normal customer behavior"
    elif score < 50:
        return f"Moderate risk — {', '.join(flags) if flags else 'minor patterns detected'}"
    else:
        return f"High risk — manual review recommended: {', '.join(flags)}"
