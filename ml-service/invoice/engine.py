"""
Module 8a — Invoice & Ownership Verification (Donut-based, single model)

Uses Donut (OCR-free Document Understanding Transformer) for invoice field extraction.
Donut combines a Swin Transformer vision encoder with a BART text decoder,
going directly from image to structured JSON without a separate OCR step.

# FUTURE ENHANCEMENT: LayoutLMv3 ensemble
# Add jinhybr/OCR-LayoutLMv3-Invoice as a second model.
# Require agreement between both models on key fields for higher confidence.
# Currently using only Donut for lean prototype.

# FUTURE ENHANCEMENT: Additional cross-checks
# - Cross-check 2: CLIP semantic match (product name vs declared category)
# - Cross-check 3: Date plausibility
# Currently implementing simplified extraction + basic validation.
"""
import base64
import io
import logging
import time
from datetime import datetime
from typing import Optional

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

_donut_model = None
_donut_processor = None
_loaded = False


def load_model():
    """
    Load Donut model for invoice extraction.
    Using naver-clova-ix/donut-base (smaller, general-purpose).
    For production: use scharnot/donut-invoices (fine-tuned on invoices).
    """
    global _donut_model, _donut_processor, _loaded
    
    try:
        from transformers import DonutProcessor, VisionEncoderDecoderModel
        t0 = time.time()
        logger.info("Loading Donut model (naver-clova-ix/donut-base)...")
        _donut_processor = DonutProcessor.from_pretrained("naver-clova-ix/donut-base")
        _donut_model = VisionEncoderDecoderModel.from_pretrained("naver-clova-ix/donut-base")
        _donut_model.eval()
        _loaded = True
        logger.info(f"Donut loaded in {time.time()-t0:.1f}s")
    except Exception as e:
        logger.warning(f"Donut model failed to load (will use mock extraction): {e}")
        _loaded = False


def extract_fields_from_image(image_b64: str) -> dict:
    """
    Extract structured fields from invoice image using Donut.
    Falls back to mock extraction if model not loaded.
    
    Returns: {product_name, order_id, purchase_date, amount_paid, seller_name, confidence}
    """
    if not _loaded:
        # Mock extraction — returns empty fields that caller must fill
        return {
            "product_name": "",
            "order_id": "",
            "purchase_date": "",
            "amount_paid": 0.0,
            "seller_name": "",
            "confidence": 0.0,
            "extraction_method": "mock_no_model",
        }
    
    try:
        img = Image.open(io.BytesIO(base64.b64decode(image_b64))).convert("RGB")
        
        # Donut inference
        task_prompt = "<s_cord-v2>"  # Document parsing task
        decoder_input_ids = _donut_processor.tokenizer(
            task_prompt, add_special_tokens=False, return_tensors="pt"
        ).input_ids
        
        pixel_values = _donut_processor(img, return_tensors="pt").pixel_values
        
        import torch
        with torch.no_grad():
            outputs = _donut_model.generate(
                pixel_values,
                decoder_input_ids=decoder_input_ids,
                max_length=512,
                early_stopping=True,
                pad_token_id=_donut_processor.tokenizer.pad_token_id,
                eos_token_id=_donut_processor.tokenizer.eos_token_id,
                use_cache=True,
                num_beams=1,
            )
        
        sequence = _donut_processor.batch_decode(outputs)[0]
        sequence = sequence.replace(_donut_processor.tokenizer.eos_token, "").replace(_donut_processor.tokenizer.pad_token, "")
        result = _donut_processor.token2json(sequence)
        
        # Parse Donut output into our expected fields
        extracted = _parse_donut_output(result)
        extracted["extraction_method"] = "donut"
        extracted["confidence"] = 0.75  # Donut general confidence
        return extracted
        
    except Exception as e:
        logger.error(f"Donut extraction failed: {e}")
        return {
            "product_name": "",
            "order_id": "",
            "purchase_date": "",
            "amount_paid": 0.0,
            "seller_name": "",
            "confidence": 0.0,
            "extraction_method": "donut_error",
            "error": str(e),
        }


def _parse_donut_output(raw_output) -> dict:
    """Parse Donut's raw JSON output into standardized fields."""
    # Donut returns varied structures depending on document type
    # We extract what we can find
    fields = {
        "product_name": "",
        "order_id": "",
        "purchase_date": "",
        "amount_paid": 0.0,
        "seller_name": "",
    }
    
    if isinstance(raw_output, dict):
        # Try common field names
        for key, val in raw_output.items():
            key_lower = str(key).lower()
            val_str = str(val) if val else ""
            
            if "product" in key_lower or "item" in key_lower or "desc" in key_lower:
                fields["product_name"] = val_str
            elif "order" in key_lower or "invoice" in key_lower or "ref" in key_lower:
                fields["order_id"] = val_str
            elif "date" in key_lower:
                fields["purchase_date"] = val_str
            elif "amount" in key_lower or "total" in key_lower or "price" in key_lower:
                try:
                    fields["amount_paid"] = float(val_str.replace(",", "").replace("₹", "").replace("$", ""))
                except (ValueError, TypeError):
                    pass
            elif "seller" in key_lower or "vendor" in key_lower or "merchant" in key_lower:
                fields["seller_name"] = val_str
    
    return fields


def verify_invoice(user_id: str, sku_id: str, invoice_data: dict,
                   invoice_image_b64: Optional[str] = None,
                   order_history: Optional[list] = None,
                   sku_price_range: Optional[tuple] = None) -> dict:
    """
    Full invoice verification pipeline.
    
    Steps:
    1. Extract fields (from image via Donut, or accept pre-structured data)
    2. Cross-check 1: order_id match against order history
    3. Cross-check 4: price plausibility against SKU price range
    
    Returns: {ownership_verified, confidence, extracted_fields, flags}
    """
    # Step 1: Field extraction
    if invoice_image_b64:
        extracted = extract_fields_from_image(invoice_image_b64)
        # Merge with any pre-provided data (user corrections)
        for k, v in invoice_data.items():
            if v and not extracted.get(k):
                extracted[k] = v
    else:
        # Accept structured input directly (simulates Donut output)
        extracted = {
            "product_name": invoice_data.get("product_name", ""),
            "order_id": invoice_data.get("order_id", ""),
            "purchase_date": invoice_data.get("purchase_date", ""),
            "amount_paid": float(invoice_data.get("amount_paid", 0)),
            "seller_name": invoice_data.get("seller_name", ""),
            "confidence": 0.9,
            "extraction_method": "pre_structured",
        }
    
    flags = []
    checks_passed = 0
    
    # Cross-check 1: Order history match
    cc1_passed = False
    if order_history and extracted.get("order_id"):
        for order in order_history:
            if order.get("order_id") == extracted["order_id"]:
                cc1_passed = True
                break
        if not cc1_passed:
            flags.append("order_id_not_found_in_history")
    elif not extracted.get("order_id"):
        flags.append("no_order_id_extracted")
    else:
        # No history to check against — give partial credit
        cc1_passed = True  # Assume valid if no history provided
    
    if cc1_passed:
        checks_passed += 1
    
    # Cross-check 4: Price plausibility
    cc4_passed = False
    amount = extracted.get("amount_paid", 0)
    if sku_price_range and amount > 0:
        low, high = sku_price_range
        if low * 0.5 <= amount <= high * 1.5:
            cc4_passed = True
        else:
            flags.append(f"price_outside_range ({amount} vs [{low*0.5:.0f}-{high*1.5:.0f}])")
    elif amount > 0:
        cc4_passed = True  # No range to check against
    else:
        flags.append("no_amount_extracted")
    
    if cc4_passed:
        checks_passed += 1
    
    # Overall verdict
    confidence = (checks_passed / 2) * 0.8 + extracted.get("confidence", 0) * 0.2
    ownership_verified = checks_passed >= 1 and confidence >= 0.4
    
    return {
        "ownership_verified": ownership_verified,
        "confidence": round(confidence, 3),
        "extracted_fields": extracted,
        "flags": flags,
        "checks_passed": checks_passed,
        "total_checks": 2,
    }
