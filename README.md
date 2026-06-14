# Second Life Commerce

### AI-Powered Sustainable Returns & Resale Ecosystem for Amazon

> Every returned, unused, or outgrown product automatically finds its next best owner.

---

## The Problem

- **$890 billion** in retail goods returned annually (16.9% of total retail sales)
- Processing a single return costs **17–66% of the item's retail price**
- **74.7 million tons** of e-waste projected by 2030
- Centralized inspection takes **7–14 days**, is labour-intensive, and frequently uneconomical
- Sizing uncertainty drives **24.5%** return rate in apparel alone

## Our Solution

Second Life Commerce intercepts returns at the edge — at the customer's home, via their smartphone — before the item ever re-enters the reverse-logistics network.

### Four Pillars

| # | Pillar | What It Does |
|---|--------|-------------|
| 01 | **AI Grading** | Instant condition assessment through image analysis. No manual inspection. Under 2 seconds per item. |
| 02 | **Smart Routing** | Millisecond decisions: resell as-is, refurbish, peer-to-peer exchange, or donate. Best path for every item. |
| 03 | **Trust Layer** | Product Health Card — so the next buyer knows exactly what they're getting. Verified condition, history, warranty. |
| 04 | **Prevention** | Predict returns before they happen. "Customers with your foot profile prefer size 8 in this brand." Best return = no return. |

---

## Key Features

### 🔍 AI-Powered Return Assessment
- **5-stage decision pipeline**: Condition Analysis → Intent Classification → Fraud Detection → Logistics Costing → Explainable Decision
- **Never auto-rejects** — always offers options (full refund, partial compensation, resell, donate)
- Every decision includes human-readable reasoning and confidence score
- Customer protection layer ensures genuine claims are never denied

### 👟 Smart Size Assistant (Return Prevention)
- Bayesian prediction model using purchase/return history
- Category-aware fit guidance (apparel vs footwear vs electronics)
- Personalized recommendations: "Based on your previous Levi's purchases, you were more likely to keep size L than size M"
- Brand-specific insights: "Levi's jeans tend to have a slimmer fit. 30% of returns are due to tight fit"
- **Target: Prevent returns before they happen**

### 📱 Sell or Exchange Your Device
- Upload photos → AI grades condition in seconds → Get instant offer
- Three resolution paths:
  - **Resale**: List on marketplace at calculated value (commission: 12%)
  - **Exchange**: Trade-in discount on new purchase (instant credit)
  - **Donate**: Earn Green Credits for future purchases
- Category-specific condition questionnaires (laptops, monitors, smartphones)
- Explainable valuation: depreciation + condition + market demand

### ♻️ Amazon Refurbished Marketplace
- Product Health Card on every listing (AI-verified condition score)
- Trust badges: "Amazon Certified" • "6-month Warranty" • "AI Inspected"
- Green Credits worth **30% more** on refurbished items
- Refurbished suggestions shown while browsing new products

### 🌱 Green Credits & Sustainability
- ΔCO2e formula: (Manufacturing emissions + Avoided reverse shipping) − P2P delivery
- Credits awarded on every sustainable action (donate, resell, recycle)
- 1 Credit = ₹1 (₹1.30 on refurbished items — 30% bonus)
- Platform-wide Net Carbon Avoidance counter
- Tree-equivalent framing for customer engagement

### 🛡️ Compensation Engine
- Fair, explainable partial refunds when full return isn't viable
- Three cases:
  - Minor cosmetic (<20 severity): 5–15% compensation
  - Moderate damage (20–50): 15–40% compensation
  - Severe damage (>50): Full return/replacement/refund always available
- **Never forces compensation-only for severe damage**
- Human-readable reasoning for every offer

---

## Architecture

```
┌─────────────────────────────┐
│   Next.js 15 Frontend        │  Port 3000
│   React 18 + Tailwind CSS    │
│   /app/sell-device           │  Sell/Exchange flow
│   /app/refurbished           │  Refurbished marketplace
│   /app/dashboard/orders      │  Returns with AI grading
│   /app/api/*                 │  Business logic (TypeScript)
└──────────────┬──────────────┘
               │ HTTP
┌──────────────▼──────────────┐
│   ML Service (Python)        │  Port 8000
│   FastAPI + PyTorch          │
│   /returns/decide            │  5-stage decision engine
│   /size-check                │  Bayesian fit prediction
│   /phc/grade                 │  Product Health Card grading
│   /invoice/verify            │  Invoice extraction
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   MongoDB Atlas               │  Prisma ORM
│   Product Health Cards        │
│   Digital Inventory           │
│   Green Credits Ledger        │
│   Resale Listings             │
│   Seller Trust Scores         │
└─────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, Tailwind CSS, TypeScript |
| Backend API | Next.js API Routes (TypeScript) |
| ML Service | FastAPI (Python), PyTorch |
| AI Models | DINOv2 (Meta), CLIP (OpenAI), Donut (Naver) |
| Database | MongoDB Atlas + Prisma ORM |
| Fit Prediction | Bayesian SizeFlags (custom) |
| Decision Engine | 5-stage pipeline + customer protection layer |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas free cluster

### Installation

```bash
# Clone
git clone https://github.com/ag-akshat03/Second_life_commerce.git
cd Second_life_commerce

# Install dependencies
npm install
cd ml-service && pip install -r requirements.txt && cd ..

# Configure environment
cp .env.example .env
# Edit .env → add your DATABASE_URL (MongoDB Atlas)

# Generate Prisma client
npx prisma generate
```

### Run

```bash
# Terminal 1: ML Service
cd ml-service && python app.py

# Terminal 2: Next.js App
npx next dev
```

Open **http://localhost:3000**

---

## Demo Scenarios

### Scenario 1: Smart Return (Defective Product)
1. Dashboard → Orders → "Return or Replace Item"
2. Select "Defective" → Upload photos
3. AI assesses: Full refund approved (₹24,999) with 92% confidence
4. Options: Full refund after pickup / Free replacement

### Scenario 2: Return Prevention (Wrong Size)
1. Browse Levi's jeans → Size Assistant appears
2. Select "M" → 🚨 "95% return risk — you returned this size twice before"
3. Personalized: "Based on your Levi's history, you were more likely to keep size L"
4. Select "L" → ✅ "Good fit — kept this size before"

### Scenario 3: Sell Your Device (Monitor)
1. Sell Device → Monitor → Dell UltraSharp, 7 months old, ₹45,000
2. Upload photos → Answer condition questions
3. AI valuation: Resale ₹24,000 / Exchange ₹19,000 / Green Credits

### Scenario 4: Partial Compensation (Changed Mind)
1. Return → "No longer needed" → Upload photos
2. AI detects: Product in good condition, minor use
3. Options: Full return ₹24,999 / Keep + ₹3,750 / Resell ~₹17,499 / Donate

---

## Impact Metrics (Projected)

| Metric | Target |
|--------|--------|
| Warehouse-bound return reduction | 35–44% |
| Reverse-logistics cost reduction | 30% |
| CO₂e avoided per laptop reused | ~331 kg |
| Return prevention (sizing) | 24.5% → 15% |
| Customer repeat-purchase rate | 92% |
| Decision accuracy | >93% |
| False rejection rate | <2% |
| Processing time | <2.5 seconds |

---

## Team

Built for Amazon Hackon 6.0 by team Trump_card.

---

## License

Hackathon prototype for demonstration purposes.
