"""Test the 5-stage decision engine with realistic scenarios."""
import json
from decision_engine.orchestrator import process_return_request

def test(name, **kwargs):
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print(f"{'='*60}")
    result = process_return_request(**kwargs)
    d = result["decision"]
    print(f"  Recommendation: {d['recommendation']}")
    print(f"  Confidence: {d['confidence']}")
    print(f"  Refund amount: ₹{d['refund_amount']:,}")
    print(f"  Customer explanation: {d['customer_explanation'][:100]}...")
    print(f"  Compensation case: {d['compensation']['case']}")
    print(f"  Compensation: ₹{d['compensation']['compensation_amount']:,} ({d['compensation']['compensation_percentage']}%)")
    print(f"  Options: {[o['label'][:40] for o in d['compensation']['options']]}")
    if d['protection']['protections_applied']:
        print(f"  ⚠️ Protections: {d['protection']['protections_applied']}")
    print(f"  Processing: {result['processing_time_ms']}ms")

# Case 1: Genuine defect (should get FULL refund)
test("Genuine defective product (broken laptop)",
     images_b64=[], category="laptop", product_value=75000,
     return_reason="defective", complaint_text="Laptop screen completely dead, not turning on",
     product_age_months=2, warranty_status="active")

# Case 2: Minor cosmetic (should get 5-15% compensation)
test("Minor scratch on phone case",
     images_b64=[], category="smartphone", product_value=25000,
     return_reason="not_as_described", complaint_text="Small scratch on back, barely visible",
     customer_answers={"screen": "Perfect", "body": "Minor wear", "turns_on": "Yes, works perfectly"},
     product_age_months=3)

# Case 3: Moderate damage (should get 15-40% OR full return option)
test("Monitor with dead pixels",
     images_b64=[], category="monitor", product_value=35000,
     return_reason="defective", complaint_text="3 dead pixels visible on dark backgrounds",
     customer_answers={"turns_on": "Yes", "screen": "Visible scratches or 1-2 dead pixels"},
     product_age_months=8)

# Case 4: Buyer remorse, good condition (full return viable)
test("Changed mind, product perfect",
     images_b64=[], category="electronics", product_value=5000,
     return_reason="no_longer_needed", complaint_text="Just don't need it anymore",
     customer_answers={"turns_on": "Yes, works perfectly", "body": "Like new"},
     product_age_months=1)

# Case 5: Safety concern (should ALWAYS escalate)
test("Safety hazard reported",
     images_b64=[], category="electronics", product_value=15000,
     return_reason="defective", complaint_text="Device overheating, smoke coming out, fire hazard",
     product_age_months=4, warranty_status="active")
