# Second Life Commerce — ML Service

Independent FastAPI service providing AI/ML endpoints for the Next.js frontend.

## Modules

| Module | Endpoint | Description |
|--------|----------|-------------|
| 1 (PHC) | `POST /phc/grade` | DINOv2 + CLIP product grading → Cosmetic Score + heatmap |
| 1 (PHC) | `GET /phc/{item_id}` | Retrieve stored Product Health Card |
| 5 (SizeFlags) | `POST /size-check` | Bayesian fit prediction → return probability + size recommendation |
| 8a (Invoice) | `POST /invoice/verify` | Donut-based invoice extraction + ownership cross-checks |

## Setup

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

Server starts on `http://localhost:8000`. CORS allows `localhost:3000` (Next.js).

## First Run

Models download from Hugging Face on first launch (~1GB total):
- DINOv2 (facebook/dinov2-base): ~346MB
- CLIP (openai/clip-vit-base-patch32): ~605MB
- Donut (naver-clova-ix/donut-base): ~800MB (optional, falls back to mock)

Subsequent starts use cached models (~25s load time on CPU).

## API Docs

Once running: http://localhost:8000/docs (Swagger UI)

## Architecture Notes

- Runs independently from the Next.js app
- Next.js calls this service via server-side API routes or client-side fetch
- Models run on CPU (GPU optional for faster inference)
- SAM background removal documented as future enhancement in phc/engine.py
