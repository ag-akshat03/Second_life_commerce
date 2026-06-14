"""
Stage 4: Logistics Cost Analysis
Calculates real economics of return vs compensation vs resale.
"""
import logging

logger = logging.getLogger(__name__)

# Cost constants (₹, India market)
SHIPPING_COST_PER_KG = 80  # avg last-mile pickup
REVERSE_LOGISTICS_BASE = 150  # warehouse processing
INSPECTION_COST = 50
REPACKAGING_COST = 75


def analyze_logistics(product_value: float, category: str,
                      weight_kg: float = 1.0,
                      condition_severity: float = 30) -> dict:
    """
    Calculate the economics of each disposition path.
    Returns actual cost/value for each option.
    """
    # Shipping & reverse logistics
    shipping = SHIPPING_COST_PER_KG * weight_kg
    reverse_total = shipping + REVERSE_LOGISTICS_BASE + INSPECTION_COST

    # Refurbishment cost (category-dependent)
    refurb_cost = _estimate_refurb_cost(category, condition_severity)

    # Resale value after refurbishment
    condition_factor = max(0.1, 1 - (condition_severity / 100))
    resale_value = round(product_value * condition_factor * 0.75)

    # Is return economically viable?
    return_cost = reverse_total + REPACKAGING_COST
    net_recovery = resale_value - return_cost - refurb_cost

    # Compensation calculation (what makes economic sense)
    # If returning costs more than keeping → offer compensation
    if net_recovery < 0:
        # Better to compensate than process return
        optimal_compensation = round(product_value * _compensation_pct(condition_severity))
    else:
        optimal_compensation = 0  # Full return is viable

    return {
        "shipping_cost": shipping,
        "reverse_logistics_cost": reverse_total,
        "refurbishment_cost": refurb_cost,
        "estimated_resale_value": resale_value,
        "net_recovery_if_returned": net_recovery,
        "return_economically_viable": net_recovery > 0,
        "optimal_compensation_amount": optimal_compensation,
        "compensation_percentage": round(_compensation_pct(condition_severity) * 100),
    }


def _estimate_refurb_cost(category: str, severity: float) -> int:
    """Category-specific refurbishment cost."""
    base_costs = {
        "laptop": 2000, "monitor": 800, "smartphone": 1500,
        "electronics": 500, "apparel": 100, "footwear": 200,
    }
    base = base_costs.get(category, 500)
    # Higher severity = more refurb needed
    return round(base * (severity / 50))


def _compensation_pct(severity: float) -> float:
    """
    Calculate fair compensation percentage based on actual condition.
    This is NOT arbitrary — it follows a clear economic model:
    - Severity 0-20 (near-perfect): 15-20% compensation
    - Severity 20-40 (minor issues): 20-35% compensation
    - Severity 40-60 (moderate): 35-50% compensation
    - Severity 60-80 (significant): 50-65% compensation
    - Severity 80-100 (severe): 65-80% compensation
    
    Logic: compensation should cover customer's loss proportional
    to how much value remains in the product.
    """
    if severity <= 20:
        return 0.15 + (severity / 20) * 0.05  # 15-20%
    elif severity <= 40:
        return 0.20 + ((severity - 20) / 20) * 0.15  # 20-35%
    elif severity <= 60:
        return 0.35 + ((severity - 40) / 20) * 0.15  # 35-50%
    elif severity <= 80:
        return 0.50 + ((severity - 60) / 20) * 0.15  # 50-65%
    else:
        return 0.65 + ((severity - 80) / 20) * 0.15  # 65-80%
