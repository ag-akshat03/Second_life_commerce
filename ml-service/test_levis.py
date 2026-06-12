from sizeflags.engine import predict_fit

print("=== Rahul picks SIZE M from Levi's (returned twice!) ===")
r = predict_fit("rahul", "sku", "M", item_info={"brand": "Levi's", "category": "apparel"})
print(f"  Risk: {r['return_probability']*100:.0f}%  Prediction: {r['fit_prediction']}")
print(f"  Recommended: {r['recommended_size']}")
print(f"  Nudge: {r['nudge_message']}")
for a in r["alerts"]:
    print(f"  [{a['severity']}] {a['message']}")

print()
print("=== Rahul picks SIZE L from Levi's (kept!) ===")
r2 = predict_fit("rahul", "sku", "L", item_info={"brand": "Levi's", "category": "apparel"})
print(f"  Risk: {r2['return_probability']*100:.0f}%  Prediction: {r2['fit_prediction']}")

print()
print("=== Rahul picks SIZE 32 from Levi's (returned - too tight!) ===")
r3 = predict_fit("rahul", "sku", "32", item_info={"brand": "Levi's", "category": "apparel"})
print(f"  Risk: {r3['return_probability']*100:.0f}%  Prediction: {r3['fit_prediction']}")
print(f"  Recommended: {r3['recommended_size']}")
for a in r3["alerts"]:
    print(f"  [{a['severity']}] {a['message']}")

print()
print("=== Rahul picks SIZE 34 from Levi's (kept!) ===")
r4 = predict_fit("rahul", "sku", "34", item_info={"brand": "Levi's", "category": "apparel"})
print(f"  Risk: {r4['return_probability']*100:.0f}%  Prediction: {r4['fit_prediction']}")
