# Second Life Commerce — Local Deployment

## Prerequisites
- Node.js 18+ (you have v24)
- Python 3.11+ (you have 3.13)
- MongoDB Atlas free cluster (for Prisma DB)

## Quick Start (3 terminals)

### Terminal 1: ML Service (Python — port 8000)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```
Wait for "ML Service ready" (~25s for model loading from cache).

### Terminal 2: Next.js App (port 3000)
```bash
# First time only:
cp .env.example .env
# Edit .env → add your DATABASE_URL (MongoDB Atlas connection string)

npx prisma generate
npx prisma db push
npm run dev
```

### Terminal 3 (optional): Seed demo data
```bash
npm run db:seed
```

## Access Points
- **Frontend**: http://localhost:3000
- **ML Service API Docs**: http://localhost:8000/docs
- **ML Service Health**: http://localhost:8000/health

## Demo Script (3 scenarios in <5 min)

### 1. Rahul — Return (Digital Inventory)
1. Go to Dashboard → Orders
2. Click "Return or Replace Item" on any delivered order
3. Upload a shoe photo, set variant to "size_10_black"
4. See PHC score + instant refund + Digital Inventory listing

### 2. Akshay — Resell (Monitor)
1. Click "Resell" in nav bar
2. Fill: Product="Dell Monitor", Order ID="ORD-001", Amount=₹35,000, Category=Monitors
3. Click through: Verify Invoice → Assess Condition → Get Pricing
4. See listing price ~₹20,825 with Accept/Decline

### 3. Raghav — Donate (Laptop → Green Credits)
1. On Resell page, change: Category=Laptops, Cosmetic=78
2. Set functional: Performance="significantly slower", Battery="poor"
3. Get "POOR" tier → recommendation = donate/exchange
4. Go to Refurbished page → see items with trust badges + Green Credit bonus

## Environment Variables (.env)
```
DATABASE_URL="mongodb+srv://USER:PASS@cluster.mongodb.net/second-life?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"
ML_SERVICE_URL="http://localhost:8000"
NEXT_PUBLIC_ML_SERVICE_URL="http://localhost:8000"
```

## Architecture
```
┌─────────────────┐     ┌──────────────────┐
│  Browser :3000  │────▶│  Next.js App     │
│  (React UI)     │     │  /app/api/*      │
└─────────────────┘     │  Business Logic  │
                        │  Prisma → MongoDB│
                        └────────┬─────────┘
                                 │ HTTP
                        ┌────────▼─────────┐
                        │  ML Service :8000│
                        │  FastAPI (Python) │
                        │  DINOv2 + CLIP   │
                        │  SizeFlags       │
                        │  Donut (Invoice) │
                        └──────────────────┘
```
