import httpx, json

scenarios = [
    ("defective", 24999, "Defective product"),
    ("wrong_size", 24999, "Wrong size"),
    ("no_longer_needed", 24999, "Changed mind"),
    ("damaged_in_transit", 24999, "Shipping damage"),
]

for reason, price, label in scenarios:
    r = httpx.post("http://localhost:8000/returns/decide",
                   json={"return_reason": reason, "product_value": price}, timeout=5)
    d = r.json()["decision"]
    print(f"\n{'='*50}")
    print(f"SCENARIO: {label}")
    print(f"  Decision: {d['recommendation']}")
    print(f"  Refund: ₹{d['refund_amount']:,}")
    print(f"  Confidence: {d['confidence']*100:.0f}%")
    print(f"  Damage: {d['ai_reasoning']['damage_assessment']['type']} ({d['ai_reasoning']['damage_assessment']['score']}/100)")
    print(f"  Options:")
    for o in d["compensation"]["options"]:
        print(f"    • {o['label']}")
