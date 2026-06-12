"""Quick test of all modules without model downloads."""
import json

# Test SizeFlags
from sizeflags.engine import predict_fit
result = predict_fit("user_1", "sku_001", "9",
    user_profile={"size_offset": 0.5, "return_history_count": 3},
    item_info={"brand": "Nike", "category": "footwear"})
print("=== SizeFlags ===")
print(json.dumps(result, indent=2))

# Test Invoice (mock mode, no Donut model)
from invoice.engine import verify_invoice
inv_result = verify_invoice(
    user_id="user_1", sku_id="sku_002",
    invoice_data={"product_name": "Dell Monitor", "order_id": "ORD-001", "amount_paid": 450},
    order_history=[{"order_id": "ORD-001", "sku_id": "sku_002", "amount": 450}],
    sku_price_range=(300, 600))
print("\n=== Invoice Verification ===")
print(json.dumps(inv_result, indent=2))

print("\n✅ All modules working (PHC requires model download on first run)")
