# Second Life Commerce

> **AI-Driven Sustainable Returns & Resale Ecosystem for Amazon**
> 
> Hackathon Prototype — Built for Amazon Smbhav Hackathon 2025

## 🎯 Problem Statement

E-commerce returns cost **$40-88B annually** in reverse logistics. Processing a single return consumes **17-66% of the item's retail price**. Most returned items are liquidated or landfilled even with 90%+ useful life remaining.

## 💡 Our Solution — The Intelligent Bridge

Second Life Commerce intercepts returns at the edge — at the customer's home via their smartphone — before the item ever re-enters the centralized logistics network.

### Four Pillars

| Pillar | Module | What it does |
|--------|--------|--------------|
| **AI Grading** | PHC Engine | DINOv2 + CLIP vision models grade product condition in <2 seconds |
| **Smart Routing** | Decision Engine | Instant decisions: resell, refurbish, exchange, donate |
| **Trust Layer** | Product Health Card | Verified condition, history, and warranty for next buyer |
| **Prevention** | SizeFlags | Predict returns before they happen using purchase history |

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Next.js Frontend       │  ← Port 3000
│   /app/sell-device       │     Sell/Exchange flow
│   /app/refurbished       │     Refurbished marketplace
│   /app/resell            │     Resale listing
│   /app/dashboard/orders  │     Returns with AI grading
│   /app/api/*             │     Business logic (TS)
└───────────┬─────────────┘
            │ HTTP
┌───────────▼─────────────┐
│   ML Service (Python)    │  ← Port 8000
│   /phc/grade             │     DINOv2 + CLIP grading
│   /size-check            │     Bayesian fit prediction
│   /invoice/verify        │     Donut OCR extraction
└──────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas (free tier) — for persistent data

### Run Locally

```bash
# 1. Install dependencies
npm install
cd ml-service && pip install -r requirements.txt && cd ..

# 2. Set up environment
cp .env.example .env
# Edit .env → add DATABASE_URL

# 3. Generate Prisma client
npx prisma generate

# 4. Start ML Service (Terminal 1)
cd ml-service && python app.py

# 5. Start Next.js (Terminal 2)
npx next dev
```

Open **http://localhost:3000**

## 📱 Demo Scenarios

### Scenario 1: Smart Return (Rahul's Shoes)
1. Dashboard → Orders → "Return or Replace Item"
2. Select reason → Upload photos → AI grades condition
3. If pristine: Instant refund + item enters Digital Inventory
4. If damaged: Partial compensation (keep product) OR resell OR donate

### Scenario 2: Sell Your Device (Akshay's Monitor)
1. Sell Device → Select category → Enter details
2. Upload photos + invoice → Answer condition questions
3. AI calculates value → Choose: List for resale OR Exchange for new

### Scenario 3: Size Prediction (Prevention)
1. Browse Levi's jeans → Size Assistant appears
2. Select "M" → 🚨 "95% return risk — you returned this size twice"
3. Select "L" → ✅ "Good fit — kept this size before"

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, Tailwind CSS |
| Backend API | Next.js API Routes (TypeScript) |
| ML Service | FastAPI (Python), PyTorch |
| AI Models | DINOv2 (Meta), CLIP (OpenAI), Donut (Naver) |
| Database | MongoDB Atlas + Prisma ORM |
| Fit Prediction | Bayesian SizeFlags (custom) |

## 📊 Key Metrics (Projected)

- **35-44%** reduction in warehouse-bound returns via P2P/Digital Inventory
- **30%** reduction in reverse-logistics costs
- **~331 kg CO₂e** avoided per laptop reused (vs. manufacturing new)
- **92%** repeat-purchase rate with easy, transparent returns

## 👥 Team

Built for Amazon Smbhav Hackathon 2025

## 📄 License

This project is a hackathon prototype for demonstration purposes.
