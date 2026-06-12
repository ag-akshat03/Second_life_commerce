from sizeflags.engine import predict_fit
import json

print("=== Rahul selects UK 8 from Nike (BAD — returned twice) ===")
r1 = predict_fit("rahul", "sku_001", "UK 8", item_info={"brand": "Nike", "category": "footwear"})
print(f"  Return risk: {r1['return_probability']*100:.0f}%")
print(f"  Prediction: {r1['fit_prediction']}")
print(f"  Recommended: {r1['recommended_size']}")
print(f"  Nudge: {r1['nudge_message']}")
print(f"  Alerts: {len(r1['alerts'])}")
for a in r1["alerts"]:
    print(f"    [{a['severity']}] {a['message']}")

print()
print("=== Rahul selects UK 9 from Nike (GOOD — kept before) ===")
r2 = predict_fit("rahul", "sku_001", "UK 9", item_info={"brand": "Nike", "category": "footwear"})
print(f"  Return risk: {r2['return_probability']*100:.0f}%")
print(f"  Prediction: {r2['fit_prediction']}")
print(f"  Alerts: {len(r2['alerts'])}")

print()
print("=== Rahul selects UK 8 from Adidas (OK — kept before) ===")
r3 = predict_fit("rahul", "sku_001", "UK 8", item_info={"brand": "Adidas", "category": "footwear"})
print(f"  Return risk: {r3['return_probability']*100:.0f}%")
print(f"  Prediction: {r3['fit_prediction']}")
print(f"  Alerts: {len(r3['alerts'])}")
