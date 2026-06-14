import httpx, json

print("=== Levi's JEANS (apparel) - Size M ===")
r = httpx.post("http://localhost:8000/size-check", json={
    "user_id": "rahul", "sku_id": "s", "selected_size": "M",
    "brand": "Levi's", "category": "apparel"
}, timeout=5)
d = r.json()
print(f"  Prediction: {d['fit_prediction']}")
print(f"  Risk: {d['return_probability']*100:.0f}%")
print(f"  Nudge: {d['nudge_message']}")
for a in d.get("alerts", []):
    print(f"  Alert: {a['message']}")

print("\n=== Levi's JEANS (apparel) - Size L ===")
r = httpx.post("http://localhost:8000/size-check", json={
    "user_id": "rahul", "sku_id": "s", "selected_size": "L",
    "brand": "Levi's", "category": "apparel"
}, timeout=5)
d = r.json()
print(f"  Prediction: {d['fit_prediction']}")
print(f"  Risk: {d['return_probability']*100:.0f}%")

print("\n=== Nike SHOES (footwear) - Size UK 8 ===")
r = httpx.post("http://localhost:8000/size-check", json={
    "user_id": "rahul", "sku_id": "s", "selected_size": "UK 8",
    "brand": "Nike", "category": "footwear"
}, timeout=5)
d = r.json()
print(f"  Prediction: {d['fit_prediction']}")
print(f"  Risk: {d['return_probability']*100:.0f}%")
print(f"  Nudge: {d['nudge_message']}")
for a in d.get("alerts", []):
    print(f"  Alert: {a['message']}")
