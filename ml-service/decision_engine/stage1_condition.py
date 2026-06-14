"""
Stage 1: Product Condition Assessment
Analyzes images to detect damage categories and severity.
Uses DINOv2 patch-level analysis + heuristic damage classifiers.
"""
import logging
from typing import Optional
import numpy as np

logger = logging.getLogger(__name__)

DAMAGE_CATEGORIES = [
    "scratches", "dents", "cracks", "missing_parts",
    "discoloration", "water_damage", "screen_damage",
    "wear_normal", "wear_heavy", "pristine"
]


def assess_condition(images_b64: list, category: str,
                     customer_answers: Optional[dict] = None) -> dict:
    """
    Multi-signal condition assessment.
    Combines: image analysis + customer-reported answers + category context.
    Never uses a single score for final decisions.
    """
    # Image-based assessment
    image_scores = _analyze_images(images_b64, category)

    # Customer-reported condition (weighted lower than visual)
    reported_score = _score_customer_answers(customer_answers, category)

    # Combine with appropriate weights
    # Images are primary (60%), customer answers secondary (40%)
    # This prevents over-reliance on either signal
    visual_weight = 0.60
    reported_weight = 0.40

    combined_severity = (visual_weight * image_scores["severity"]
                        + reported_weight * reported_score["severity"])

    # Confidence is the LOWER of the two (conservative)
    confidence = min(image_scores["confidence"], reported_score["confidence"])

    # If signals disagree significantly, lower confidence further
    disagreement = abs(image_scores["severity"] - reported_score["severity"])
    if disagreement > 30:
        confidence *= 0.7  # Significant disagreement = less certain
        logger.warning(f"Condition signals disagree: visual={image_scores['severity']}, "
                      f"reported={reported_score['severity']}, gap={disagreement}")

    # Detected damages from both sources
    detected = list(set(image_scores["detected_categories"]
                       + reported_score.get("reported_issues", [])))

    return {
        "damage_severity_score": round(combined_severity, 1),
        "confidence_score": round(confidence, 2),
        "detected_damage_categories": detected,
        "visual_assessment": image_scores,
        "reported_assessment": reported_score,
        "disagreement_flag": disagreement > 30,
    }


def _analyze_images(images_b64: list, category: str) -> dict:
    """
    Image-based damage detection.
    In production: DINOv2 patch anomaly + trained damage classifier.
    For prototype: uses heuristic scoring based on image properties.
    """
    if not images_b64:
        return {"severity": 50, "confidence": 0.3,
                "detected_categories": ["unable_to_assess"],
                "note": "No images provided"}

    # Simulate intelligent grading based on image count and category
    # More images = higher confidence (shows customer is transparent)
    base_confidence = min(0.85, 0.5 + len(images_b64) * 0.1)

    # For prototype: analyze image size/complexity as proxy
    # Real implementation would use DINOv2 patch comparison
    try:
        import base64
        from PIL import Image
        import io

        severities = []
        detected = []
        for b64 in images_b64[:6]:
            img_bytes = base64.b64decode(b64)
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            # Analyze color variance as damage proxy
            arr = np.array(img)
            variance = np.var(arr) / 1000
            # High variance often indicates damage/wear marks
            if variance > 8:
                severities.append(min(60, variance * 3))
                detected.append("wear_normal")
            elif variance > 5:
                severities.append(min(40, variance * 2))
                detected.append("scratches")
            else:
                severities.append(max(5, variance))
                detected.append("pristine")

        avg_severity = np.mean(severities) if severities else 30
        return {
            "severity": round(float(avg_severity), 1),
            "confidence": round(base_confidence, 2),
            "detected_categories": list(set(detected)),
        }
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        return {"severity": 35, "confidence": 0.4,
                "detected_categories": ["analysis_error"]}


def _score_customer_answers(answers: Optional[dict], category: str) -> dict:
    """Score condition from customer questionnaire answers."""
    if not answers:
        return {"severity": 30, "confidence": 0.5,
                "reported_issues": [], "note": "No answers provided"}

    severity_map = {
        # Positive answers = low severity
        "Yes, works perfectly": 0, "Excellent": 0, "Perfect": 0,
        "Like new": 0, "Yes, fully functional": 0,
        "Good": 10, "Minor": 15, "slightly slower": 20,
        "Yes, but slow": 25, "Minor wear": 20,
        # Moderate issues
        "Fair": 35, "Visible": 40, "intermittent": 45,
        "significantly slower": 50, "poor": 55,
        # Severe issues
        "No": 70, "Cracked": 75, "not working": 80,
        "dead": 85, "Significant damage": 90,
    }

    scores = []
    issues = []
    for key, answer in answers.items():
        matched = False
        for pattern, score in severity_map.items():
            if pattern.lower() in str(answer).lower():
                scores.append(score)
                if score > 25:
                    issues.append(f"{key}: {answer}")
                matched = True
                break
        if not matched:
            scores.append(25)  # Unknown = moderate

    avg = np.mean(scores) if scores else 30
    confidence = min(0.85, 0.6 + len(answers) * 0.05)

    return {
        "severity": round(float(avg), 1),
        "confidence": round(confidence, 2),
        "reported_issues": issues,
    }
