"""
Second Life Commerce — ML Service
Independent FastAPI app serving AI/ML endpoints for the Next.js frontend.
Runs on port 8000, CORS allows localhost:3000.

Modules:
- Module 1: PHC Engine (DINOv2 + CLIP grading)
- Module 5: SizeFlags (Bayesian fit prediction)
- Module 8a: Invoice Verification (Donut-based extraction)
"""
import logging
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# === Lifespan: load models on startup ===
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ML Service — loading models...")
    try:
        from phc.engine import load_models as load_phc
        load_phc()
        logger.info("PHC models loaded ✓")
    except Exception as e:
        logger.warning(f"PHC models failed to load: {e}")

    try:
        from invoice.engine import load_model as load_invoice
        load_invoice()
        logger.info("Invoice model loaded ✓")
    except Exception as e:
        logger.warning(f"Invoice model failed to load (mock mode): {e}")

    logger.info("ML Service ready.")
    yield
    logger.info("ML Service shutting down.")


app = FastAPI(
    title="Second Life Commerce — ML Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH
# ============================================================
@app.get("/health")
def health():
    return {"status": "running", "service": "ml-service", "modules": ["phc", "sizeflags", "invoice"]}


# ============================================================
# MODULE 1: PHC (Product Health Card)
# ============================================================
class PHCGradeRequest(BaseModel):
    sku_id: str
    sku_description: Optional[str] = None
    images: list[str]  # base64-encoded
    item_id: Optional[str] = None


@app.post("/phc/grade")
def phc_grade(request: PHCGradeRequest):
    """Grade product images → Product Health Card."""
    from phc.engine import grade, _loaded
    if not _loaded:
        return {
            "item_id": request.item_id or "stub",
            "cosmetic_score": 80,
            "condition_label": "Good",
            "defect_heatmap": "",
            "sku_match_confidence": 0.85,
            "manual_review_required": False,
            "is_unused_verified": False,
            "model_version": "stub",
            "timestamp": "2024-01-01T00:00:00Z",
        }

    if not request.images or len(request.images) > 6:
        raise HTTPException(422, "Provide 1-6 base64-encoded images")

    desc = request.sku_description or f"product {request.sku_id}"
    item_id = request.item_id or f"grade_{id(request)}"

    try:
        return grade(request.images, request.sku_id, item_id, desc)
    except Exception as e:
        logger.error(f"PHC error: {e}", exc_info=True)
        raise HTTPException(500, "Grading failed")


@app.get("/phc/{item_id}")
def phc_get(item_id: str):
    """Retrieve stored PHC."""
    from phc.engine import get_phc
    phc = get_phc(item_id)
    if not phc:
        raise HTTPException(404, f"No PHC for {item_id}")
    return phc


# ============================================================
# MODULE 5: SIZE FLAGS
# ============================================================
class SizeCheckRequest(BaseModel):
    user_id: str
    sku_id: str
    selected_size: str
    brand: Optional[str] = None
    category: Optional[str] = "apparel"
    user_size_offset: Optional[float] = 0.0
    return_history_count: Optional[int] = 0


@app.post("/size-check")
def size_check(request: SizeCheckRequest):
    """Predict fit probability and recommend size."""
    from sizeflags.engine import predict_fit
    return predict_fit(
        user_id=request.user_id,
        sku_id=request.sku_id,
        selected_size=request.selected_size,
        user_profile={
            "size_offset": request.user_size_offset,
            "return_history_count": request.return_history_count,
        },
        item_info={
            "brand": request.brand or "default",
            "category": request.category or "apparel",
        },
    )


# ============================================================
# MODULE 8a: INVOICE VERIFICATION
# ============================================================
class InvoiceVerifyRequest(BaseModel):
    user_id: str
    sku_id: str
    invoice_data: Optional[dict] = None
    invoice_image_b64: Optional[str] = None
    order_history: Optional[list] = None
    sku_price_range: Optional[list] = None  # [min, max]


@app.post("/invoice/verify")
def invoice_verify(request: InvoiceVerifyRequest):
    """Verify invoice ownership via Donut extraction + cross-checks."""
    from invoice.engine import verify_invoice

    price_range = tuple(request.sku_price_range) if request.sku_price_range else None

    return verify_invoice(
        user_id=request.user_id,
        sku_id=request.sku_id,
        invoice_data=request.invoice_data or {},
        invoice_image_b64=request.invoice_image_b64,
        order_history=request.order_history,
        sku_price_range=price_range,
    )


# ============================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
