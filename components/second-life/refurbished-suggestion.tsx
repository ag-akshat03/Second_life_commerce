"use client";

import Link from "next/link";

interface RefurbishedSuggestionProps {
  category: string;
  currentPrice: number;
}

// Simulated refurbished alternatives
const REFURBISHED_ITEMS: Record<string, { title: string; price: number; savings: number; score: number; warranty: string }[]> = {
  Electronics: [
    { title: "Sony WH-1000XM4 (Renewed)", price: 18999, savings: 32, score: 94, warranty: "6 months" },
    { title: "boAt Airdopes 441 (Certified Refurbished)", price: 999, savings: 45, score: 91, warranty: "6 months" },
  ],
  Mobiles: [
    { title: "OnePlus Nord CE 3 Lite (Renewed)", price: 13499, savings: 28, score: 92, warranty: "6 months" },
    { title: "iPhone 13 (Amazon Renewed)", price: 44999, savings: 35, score: 96, warranty: "6 months" },
  ],
  "Home & Kitchen": [
    { title: "Instant Pot Duo 7-in-1 (Renewed)", price: 4999, savings: 40, score: 93, warranty: "6 months" },
  ],
  Appliances: [
    { title: "Philips Air Fryer HD9200 (Renewed)", price: 5499, savings: 35, score: 90, warranty: "6 months" },
  ],
  default: [
    { title: "Amazon Renewed Item (Certified)", price: 2999, savings: 30, score: 88, warranty: "6 months" },
  ],
};

export function RefurbishedSuggestion({ category, currentPrice }: RefurbishedSuggestionProps) {
  const items = REFURBISHED_ITEMS[category] || REFURBISHED_ITEMS["default"];
  const relevantItems = items.filter((i) => i.price < currentPrice * 0.9); // Show items cheaper than current

  if (relevantItems.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-800 dark:from-emerald-950/20 dark:to-teal-950/20">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">♻️ SAVE MORE</span>
        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Amazon Renewed — Same quality, smaller price</span>
      </div>

      <div className="mt-3 space-y-2">
        {relevantItems.slice(0, 2).map((item, i) => (
          <Link href="/refurbished" key={i} className="flex items-center gap-3 rounded-lg bg-white/70 p-2.5 transition hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 text-lg dark:bg-emerald-900/30">
              {category === "Mobiles" ? "📱" : category === "Electronics" ? "🎧" : "📦"}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-700">₹{item.price.toLocaleString()}</span>
                <span className="text-[10px] text-red-600 font-bold">{item.savings}% off</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">Score: {item.score}/100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-slate-500">🛡️ {item.warranty}</span>
              <span className="block text-[9px] text-emerald-600 font-bold">✓ Amazon Certified</span>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/refurbished" className="mt-2 inline-flex text-xs font-bold text-emerald-700 hover:underline">
        View all refurbished options →
      </Link>
    </div>
  );
}
