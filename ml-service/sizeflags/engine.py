"""
Module 5 — Bayesian SizeFlags (Predictive Return Prevention)

Implements P(Fit|User,Item) ∝ P(Item Features|Fit) · P(User Profile|Fit) · P(Fit)

For the hackathon demo:
- Pre-loaded synthetic order history for demo users
- Real Bayesian logic computing P(return) from history
- Alerts based on BOTH user history AND product-level return rates

Production would use actual Amazon order/return database.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ============================================================
# PRE-LOADED DEMO DATA — Simulates Amazon's order/return history
# This is what makes the demo convincing without real data
# ============================================================

DEMO_USER_PROFILES = {
    "rahul": {
        "name": "Rahul Sharma",
        "foot_size_actual": "UK 9",  # His actual comfortable size
        "orders": [
            {"brand": "Nike", "size": "UK 8", "category": "footwear", "kept": False, "return_reason": "too_small"},
            {"brand": "Nike", "size": "UK 8", "category": "footwear", "kept": False, "return_reason": "too_small"},
            {"brand": "Nike", "size": "UK 9", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Adidas", "size": "UK 8", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Adidas", "size": "UK 8.5", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Puma", "size": "UK 8", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Reebok", "size": "UK 8", "category": "footwear", "kept": False, "return_reason": "too_small"},
            {"brand": "Reebok", "size": "UK 9", "category": "footwear", "kept": True, "return_reason": None},
            # Apparel history
            {"brand": "Levi's", "size": "M", "category": "apparel", "kept": False, "return_reason": "too_small"},
            {"brand": "Levi's", "size": "M", "category": "apparel", "kept": False, "return_reason": "too_tight"},
            {"brand": "Levi's", "size": "L", "category": "apparel", "kept": True, "return_reason": None},
            {"brand": "Levi's", "size": "32", "category": "apparel", "kept": False, "return_reason": "too_tight"},
            {"brand": "Levi's", "size": "34", "category": "apparel", "kept": True, "return_reason": None},
            {"brand": "Zara", "size": "M", "category": "apparel", "kept": True, "return_reason": None},
            {"brand": "H&M", "size": "L", "category": "apparel", "kept": False, "return_reason": "too_large"},
            {"brand": "H&M", "size": "M", "category": "apparel", "kept": True, "return_reason": None},
        ],
    },
    "priya": {
        "name": "Priya Patel",
        "foot_size_actual": "UK 6",
        "orders": [
            {"brand": "Nike", "size": "UK 5", "category": "footwear", "kept": False, "return_reason": "too_small"},
            {"brand": "Nike", "size": "UK 6", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Zara", "size": "S", "category": "apparel", "kept": False, "return_reason": "too_small"},
            {"brand": "Zara", "size": "M", "category": "apparel", "kept": True, "return_reason": None},
            {"brand": "H&M", "size": "M", "category": "apparel", "kept": False, "return_reason": "too_large"},
            {"brand": "H&M", "size": "S", "category": "apparel", "kept": True, "return_reason": None},
        ],
    },
    "akshay": {
        "name": "Akshay Kumar",
        "foot_size_actual": "UK 10",
        "orders": [
            {"brand": "Nike", "size": "UK 9", "category": "footwear", "kept": False, "return_reason": "too_small"},
            {"brand": "Nike", "size": "UK 10", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Adidas", "size": "UK 10", "category": "footwear", "kept": True, "return_reason": None},
            {"brand": "Puma", "size": "UK 10", "category": "footwear", "kept": True, "return_reason": None},
        ],
    },
    # Default profile for any user
    "default": {
        "name": "New User",
        "orders": [],
    }
}

# Product-level return data (simulates aggregate return stats per SKU)
PRODUCT_RETURN_STATS = {
    # Format: (brand, category) -> stats
    # This ensures fit guidance is ALWAYS category-specific
    ("Nike", "footwear"): {"runs_small": True, "size_offset": -0.5, "return_rate_size_issue": 0.32,
        "fit_message": "Nike shoes tend to run small. 32% of size-related returns are due to tight fit."},
    ("Reebok", "footwear"): {"runs_small": True, "size_offset": -0.5, "return_rate_size_issue": 0.28,
        "fit_message": "Reebok shoes tend to run narrow. 28% of size-related returns are due to tight fit."},
    ("Adidas", "footwear"): {"runs_small": False, "size_offset": 0.0, "return_rate_size_issue": 0.12,
        "fit_message": "Adidas shoes are generally true to size."},
    ("Puma", "footwear"): {"runs_small": False, "size_offset": 0.0, "return_rate_size_issue": 0.10,
        "fit_message": "Puma shoes fit true to size for most customers."},
    ("Levi's", "apparel"): {"runs_small": True, "size_offset": -0.5, "return_rate_size_issue": 0.30,
        "fit_message": "Levi's jeans tend to have a slimmer fit around the waist and thighs. 30% of size-related returns are due to a tighter-than-expected fit."},
    ("Zara", "apparel"): {"runs_small": True, "size_offset": -0.3, "return_rate_size_issue": 0.35,
        "fit_message": "Zara clothing often runs smaller than standard sizing. 35% of returns cite tight fit."},
    ("H&M", "apparel"): {"runs_small": False, "size_offset": 0.3, "return_rate_size_issue": 0.18,
        "fit_message": "H&M clothing tends to run slightly larger than standard. Consider sizing down."},
    ("Yonex", "sports"): {"runs_small": False, "size_offset": 0.0, "return_rate_size_issue": 0.08,
        "fit_message": "Yonex sports equipment is standard sized."},
}


def _get_product_stats(brand: str, category: str) -> dict:
    """Get category-specific brand stats. Never mix categories."""
    # Try exact (brand, category) match first
    key = (brand, category.lower())
    if key in PRODUCT_RETURN_STATS:
        return PRODUCT_RETURN_STATS[key]
    
    # Try partial brand match within same category
    for (b, c), stats in PRODUCT_RETURN_STATS.items():
        if b.lower() == brand.lower() and c == category.lower():
            return stats
    
    # No match — return empty (no guidance rather than wrong guidance)
    return {}

# ============================================================
# PREDICTION ENGINE
# ============================================================

def _parse_size(size_str: str) -> float:
    """Convert size string to numeric for comparison."""
    s = size_str.upper().replace("UK", "").replace("US", "").replace("EU", "").strip()
    size_map = {"XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "XXL": 6}
    if s in size_map:
        return float(size_map[s])
    try:
        return float(s)
    except ValueError:
        return 8.0


def _get_user_brand_history(user_id: str, brand: str, category: str = "") -> dict:
    """Analyze user's history with a specific brand IN THE SAME CATEGORY."""
    profile = DEMO_USER_PROFILES.get(user_id, DEMO_USER_PROFILES["default"])
    orders = profile.get("orders", [])
    
    # Filter by brand AND category — never mix categories
    brand_orders = [o for o in orders 
                    if o["brand"].lower() == brand.lower()
                    and (not category or o["category"].lower() == category.lower())]
    if not brand_orders:
        return {"has_history": False}
    
    kept = [o for o in brand_orders if o["kept"]]
    returned = [o for o in brand_orders if not o["kept"]]
    returned_sizes = [o["size"] for o in returned]
    kept_sizes = [o["size"] for o in kept]
    return_reasons = [o["return_reason"] for o in returned if o["return_reason"]]
    
    return {
        "has_history": True,
        "total_orders": len(brand_orders),
        "kept_count": len(kept),
        "returned_count": len(returned),
        "return_rate": len(returned) / len(brand_orders),
        "kept_sizes": kept_sizes,
        "returned_sizes": returned_sizes,
        "return_reasons": return_reasons,
        "preferred_size": kept_sizes[0] if kept_sizes else None,
    }


def _get_user_category_history(user_id: str, category: str) -> dict:
    """Analyze user's overall history in a category."""
    profile = DEMO_USER_PROFILES.get(user_id, DEMO_USER_PROFILES["default"])
    orders = profile.get("orders", [])
    
    cat_orders = [o for o in orders if o["category"].lower() == category.lower()]
    if not cat_orders:
        return {"has_history": False}
    
    kept = [o for o in cat_orders if o["kept"]]
    returned = [o for o in cat_orders if not o["kept"]]
    
    # Find the most common kept size
    kept_sizes = [o["size"] for o in kept]
    size_counts = {}
    for s in kept_sizes:
        size_counts[s] = size_counts.get(s, 0) + 1
    most_common_size = max(size_counts, key=size_counts.get) if size_counts else None
    
    return {
        "has_history": True,
        "total_orders": len(cat_orders),
        "return_rate": len(returned) / len(cat_orders) if cat_orders else 0,
        "most_kept_size": most_common_size,
        "all_kept_sizes": kept_sizes,
    }


def predict_fit(user_id: str, sku_id: str, selected_size: str,
                user_profile: Optional[dict] = None,
                item_info: Optional[dict] = None) -> dict:
    """
    Full SizeFlags prediction.
    
    Combines:
    1. User's personal history with this brand
    2. User's overall size pattern across brands
    3. Product-level aggregate return data
    """
    item_info = item_info or {}
    brand = item_info.get("brand", "").strip() or "default"
    category = item_info.get("category", "footwear")
    
    # Normalize user_id for demo lookup
    uid = user_id.lower().replace("user_", "").replace("demo-", "")
    if uid not in DEMO_USER_PROFILES:
        uid = "rahul"  # Default demo user
    
    # Gather intelligence (CATEGORY-AWARE — never mix categories)
    brand_history = _get_user_brand_history(uid, brand, category)
    category_history = _get_user_category_history(uid, category)
    product_stats = _get_product_stats(brand, category)
    
    # Compute return probability using Bayesian-style reasoning
    # P(return) = base_rate × brand_factor × personal_factor
    base_rate = 0.245 if category == "apparel" else 0.30 if category == "footwear" else 0.10
    
    # Factor 1: Does this brand have sizing issues IN THIS CATEGORY?
    brand_return_rate = product_stats.get("return_rate_size_issue", 0.15)
    brand_factor = brand_return_rate / 0.15  # normalize against average
    
    # Factor 2: Has THIS USER returned THIS SIZE from THIS BRAND before?
    personal_factor = 1.0
    alerts = []
    
    if brand_history["has_history"]:
        if selected_size in brand_history.get("returned_sizes", []):
            personal_factor = 3.0  # Very high risk — they returned this exact size before
            alerts.append({
                "type": "personal_history",
                "severity": "high",
                "message": f"You ordered {brand} in {selected_size} before and returned it ({', '.join(brand_history['return_reasons'])})"
            })
        elif selected_size in brand_history.get("kept_sizes", []):
            personal_factor = 0.2  # Very LOW risk — they kept this size before
        elif brand_history.get("preferred_size") and brand_history["preferred_size"] != selected_size:
            personal_factor = max(personal_factor, 2.0)
            alerts.append({
                "type": "size_mismatch", 
                "severity": "medium",
                "message": f"Your preferred size in {brand} is {brand_history['preferred_size']} (kept {brand_history['kept_count']} times)"
            })
    
    # Factor 3: Product-level alert (CATEGORY-SPECIFIC, never cross-category)
    if product_stats.get("runs_small") and product_stats.get("fit_message"):
        # Only show if we have a category-specific message
        alerts.append({
            "type": "product_sizing",
            "severity": "medium", 
            "message": product_stats["fit_message"],
        })
    
    # Final probability
    return_probability = min(0.95, base_rate * brand_factor * personal_factor)
    
    # Generate recommendation (PRIORITIZED hierarchy)
    recommended_size = selected_size
    nudge_message = None
    
    if return_probability > 0.40:
        # Priority 1: Personal history with this brand+category
        if brand_history.get("preferred_size"):
            recommended_size = brand_history["preferred_size"]
            nudge_message = (f"Based on your previous {brand} purchases, "
                           f"you were more likely to keep size {recommended_size} than size {selected_size}.")
        # Priority 2: Product-specific insight
        elif product_stats.get("runs_small"):
            current = _parse_size(selected_size)
            if category == "apparel":
                # For apparel: suggest next letter size
                size_map = {"XS": "S", "S": "M", "M": "L", "L": "XL", "XL": "XXL"}
                recommended_size = size_map.get(selected_size, str(current + 1))
                nudge_message = f"Customers with a similar profile prefer {recommended_size} in {brand} {category}."
            else:
                recommended_size = f"UK {current + 1:.0f}" if "UK" in selected_size.upper() else str(current + 1)
                nudge_message = f"Customers with your foot profile prefer {recommended_size} in {brand}."
        # Priority 3: Category-level insight
        elif category_history.get("most_kept_size"):
            recommended_size = category_history["most_kept_size"]
            nudge_message = f"Your most commonly kept size in {category} is {recommended_size}."
        else:
            nudge_message = f"This size has a {int(return_probability*100)}% return risk based on similar customers."
    
    # Build response
    confidence = min(0.95, 0.5 + (brand_history.get("total_orders", 0) * 0.1))
    
    return {
        "user_id": user_id,
        "sku_id": sku_id,
        "selected_size": selected_size,
        "brand": brand,
        "category": category,
        "return_probability": round(return_probability, 3),
        "recommended_size": recommended_size,
        "nudge_message": nudge_message,
        "confidence": round(confidence, 3),
        "fit_prediction": "true_to_size" if return_probability < 0.25 else "at_risk" if return_probability < 0.50 else "high_risk",
        "alerts": alerts,
        "history_summary": {
            "brand_orders": brand_history.get("total_orders", 0),
            "brand_returns": brand_history.get("returned_count", 0),
            "preferred_size": brand_history.get("preferred_size"),
            "category_most_kept": category_history.get("most_kept_size"),
        },
    }
