"""
Module 1 — Product Health Card Engine (Lean: DINOv2 + CLIP, no SAM)

Pipeline:
1. CLIP semantic SKU verification (cosine similarity image vs text)
2. DINOv2 structural anomaly detection (patch-level embedding comparison)
3. Simplified DMA fusion (weighted aggregation)
4. Cosmetic Score (1-100) + condition label + heatmap

# FUTURE ENHANCEMENT: SAM (Segment Anything Model)
# Insert background removal between image input and model inference:
#   masked_image = sam_segment(raw_image)
# This isolates the product from clutter for cleaner DINOv2/CLIP analysis.
# Skipped in lean prototype to conserve compute.
"""
import base64
import io
import logging
import time
from datetime import datetime, timezone

import numpy as np
import torch
from PIL import Image, ImageDraw

logger = logging.getLogger(__name__)

# Config
CLIP_SIMILARITY_THRESHOLD = 0.25
ANOMALY_THRESHOLD = 0.5
DMA_STRUCTURAL_WEIGHT = 0.7
DMA_SEMANTIC_WEIGHT = 0.3
MODEL_VERSION = "dinov2-base+clip-vit-base-patch32-v1"
CONDITION_LABELS = {(90, 100): "Like New", (75, 89): "Good", (60, 74): "Acceptable", (1, 59): "For Parts/Refurb Only"}

# Global state
_dinov2_model = None
_dinov2_processor = None
_clip_model = None
_clip_processor = None
_reference_bank = {}
_phc_store = {}
_loaded = False


def load_models():
    global _dinov2_model, _dinov2_processor, _clip_model, _clip_processor, _loaded
    from transformers import AutoModel, AutoImageProcessor, CLIPModel, CLIPProcessor

    t0 = time.time()
    logger.info("Loading DINOv2...")
    _dinov2_processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base")
    _dinov2_model = AutoModel.from_pretrained("facebook/dinov2-base")
    _dinov2_model.eval()
    t1 = time.time()

    logger.info("Loading CLIP...")
    _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    _clip_model.eval()
    t2 = time.time()

    _loaded = True
    logger.info(f"Models loaded: DINOv2={t1-t0:.1f}s, CLIP={t2-t1:.1f}s, total={t2-t0:.1f}s")
    return {"dinov2_time": t1-t0, "clip_time": t2-t1, "total": t2-t0}


def build_reference_bank(images_dir: str, manifest: list, skus: list):
    """Build reference embeddings from pristine catalog images."""
    global _reference_bank
    from pathlib import Path

    cat_to_skus = {}
    for sku in skus:
        cat_to_skus.setdefault(sku.get("category", ""), []).append(sku["id"])

    for entry in manifest:
        if entry.get("is_damaged"):
            continue
        img_path = Path(images_dir) / entry["filename"]
        if not img_path.exists():
            continue
        img = Image.open(img_path).convert("RGB").resize((224, 224))
        patches = _extract_patches(img)
        for sku_id in cat_to_skus.get(entry["category"], []):
            if sku_id not in _reference_bank:
                _reference_bank[sku_id] = patches
            else:
                _reference_bank[sku_id] = (_reference_bank[sku_id] + patches) / 2

    logger.info(f"Reference bank: {len(_reference_bank)} SKUs")


def _extract_patches(image: Image.Image) -> np.ndarray:
    inputs = _dinov2_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        out = _dinov2_model(**inputs)
    return out.last_hidden_state[0, 1:, :].numpy()


def _clip_similarity(image: Image.Image, text: str) -> float:
    inputs = _clip_processor(text=[text], images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        out = _clip_model(**inputs)
    img_e = out.image_embeds[0].numpy()
    txt_e = out.text_embeds[0].numpy()
    return float(np.dot(img_e, txt_e) / (np.linalg.norm(img_e) * np.linalg.norm(txt_e) + 1e-8))


def _compute_anomaly(image: Image.Image, sku_id: str):
    if sku_id not in _reference_bank:
        return np.zeros(196)
    ref = _reference_bank[sku_id]
    query = _extract_patches(image)
    n = min(len(ref), len(query))
    r = ref[:n] / (np.linalg.norm(ref[:n], axis=1, keepdims=True) + 1e-8)
    q = query[:n] / (np.linalg.norm(query[:n], axis=1, keepdims=True) + 1e-8)
    return 1.0 - np.sum(r * q, axis=1)


def _make_heatmap(anomaly_map: np.ndarray, size=256) -> str:
    n = len(anomaly_map)
    g = int(np.ceil(np.sqrt(n)))
    padded = np.zeros(g*g)
    padded[:n] = anomaly_map
    grid = padded.reshape(g, g)
    norm = np.clip(grid / (grid.max() + 1e-8), 0, 1)

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cw, ch = size/g, size/g
    for i in range(g):
        for j in range(g):
            v = norm[i, j]
            draw.rectangle([int(j*cw), int(i*ch), int((j+1)*cw), int((i+1)*ch)],
                          fill=(int(255*v), 0, int(255*(1-v)), int(180*v)))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def _get_label(score: int) -> str:
    for (lo, hi), label in CONDITION_LABELS.items():
        if lo <= score <= hi:
            return label
    return "For Parts/Refurb Only"


def grade(images_b64: list, sku_id: str, item_id: str, sku_description: str) -> dict:
    """Full grading pipeline."""
    if not _loaded:
        raise RuntimeError("Models not loaded")

    anomaly_maps, clip_scores = [], []
    for b64 in images_b64:
        img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB").resize((224, 224))
        clip_scores.append(_clip_similarity(img, sku_description))
        anomaly_maps.append(_compute_anomaly(img, sku_id))

    avg_clip = float(np.mean(clip_scores)) if clip_scores else 0.0
    if anomaly_maps:
        n = min(len(a) for a in anomaly_maps)
        avg_anomaly = np.mean([a[:n] for a in anomaly_maps], axis=0)
    else:
        avg_anomaly = np.zeros(196)

    structural = float(avg_anomaly.mean())
    semantic_penalty = max(0, 1.0 - avg_clip)
    fused = DMA_STRUCTURAL_WEIGHT * structural + DMA_SEMANTIC_WEIGHT * semantic_penalty
    fused = float(np.clip(fused, 0, 1))

    score = max(1, min(100, round(100 * (1 - fused))))
    label = _get_label(score)
    manual_review = bool(avg_clip < CLIP_SIMILARITY_THRESHOLD)
    heatmap = _make_heatmap(avg_anomaly)

    phc = {
        "item_id": item_id,
        "cosmetic_score": score,
        "condition_label": label,
        "defect_heatmap": heatmap,
        "sku_match_confidence": round(avg_clip, 4),
        "manual_review_required": manual_review,
        "is_unused_verified": score >= 95 and not manual_review,
        "model_version": MODEL_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _phc_store[item_id] = phc
    return phc


def get_phc(item_id: str):
    return _phc_store.get(item_id)
