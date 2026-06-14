"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductHealthCard } from "@/components/second-life/product-health-card";

interface RefurbishedItem {
  id: string;
  type: "resale" | "digital_inventory";
  title: string;
  image: string;
  originalPrice: number;
  listingPrice: number;
  conditionTier: string;
  cosmeticScore: number;
  verified: boolean;
  sellerName: string;
  carbonSavings: number;
}

export default function RefurbishedPage() {
  const [items, setItems] = useState<RefurbishedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/refurbished")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = filter === "all" ? items : items.filter((i) => i.conditionTier === filter);

  const tierColor = (tier: string) => {
    switch (tier) {
      case "LIKE_NEW": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200";
      case "GOOD": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "ACCEPTABLE": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const tierLabel = (tier: string) => {
    switch (tier) {
      case "LIKE_NEW": return "Like New";
      case "GOOD": return "Good";
      case "ACCEPTABLE": return "Acceptable";
      default: return tier;
    }
  };

  return (
    <div className="mx-auto max-w-amazon px-4 py-6">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 px-8 py-12 text-white">
        <p className="text-sm font-bold text-emerald-300">♻️ Amazon Resale & Renewed</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Verified Second-Life Products</h1>
        <p className="mt-2 max-w-xl text-slate-200">
          Every item is AI-inspected with a Product Health Card. Save money and the planet — 
          your Green Credits go 30% further here.
        </p>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">✓ AI Verified Condition</span>
          <span className="rounded-full bg-white/20 px-3 py-1">✓ Amazon Guarantee</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🌱 Green Credits 1.3x Bonus</span>
        </div>
      </section>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-bold text-slate-600">Filter:</span>
        {["all", "LIKE_NEW", "GOOD", "ACCEPTABLE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              filter === f
                ? "bg-amazon-gold text-slate-950"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f === "all" ? "All" : tierLabel(f)}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-500">{filteredItems.length} items</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-12 text-center text-slate-500">Loading refurbished inventory...</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900">
              {/* Image */}
              <div className="relative aspect-square bg-slate-50 dark:bg-slate-800">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover p-4"
                />
                {/* Trust badges */}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {item.verified && (
                    <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                      ✓ Amazon Verified
                    </span>
                  )}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${tierColor(item.conditionTier)}`}>
                    {tierLabel(item.conditionTier)}
                  </span>
                  {item.type === "digital_inventory" && (
                    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Unused — Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                {/* PHC Score + Health Card */}
                <div className="mt-2">
                  <ProductHealthCard
                    cosmeticScore={item.cosmeticScore}
                    conditionTier={tierLabel(item.conditionTier)}
                    brand={item.sellerName.includes("Amazon") ? "Amazon" : "Seller"}
                    model={item.title.split(" ").slice(0, 3).join(" ")}
                    ageMonths={item.conditionTier === "LIKE_NEW" ? 3 : item.conditionTier === "GOOD" ? 8 : 18}
                    warranty={item.conditionTier === "LIKE_NEW" ? "6 months Amazon Renewed Guarantee" : "3 months Amazon Renewed Guarantee"}
                    defectsFound={item.conditionTier === "ACCEPTABLE" ? ["Minor cosmetic wear noted"] : []}
                  />
                </div>

                {/* Pricing */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ₹{item.listingPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-red-600">
                    {Math.round((1 - item.listingPrice / item.originalPrice) * 100)}% off
                  </span>
                </div>

                {/* Carbon savings */}
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                  <span>🌱</span>
                  Buying this saves ~{item.carbonSavings} kg CO₂e
                </p>

                {/* Green credit bonus */}
                <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-medium text-white shadow">
                  🌱 Credits ×1.3
                </span>

                {/* Seller */}
                <p className="mt-2 text-[11px] text-slate-500">
                  Sold by {item.sellerName}
                </p>

                <button className="mt-3 w-full rounded bg-amazon-gold py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400">
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <div className="mt-12 text-center">
          <p className="text-slate-500">No items match this filter.</p>
          <Link href="/sell-device" className="mt-2 inline-block text-sm font-bold text-amazon-teal hover:underline">
            Sell your items on Amazon Resale →
          </Link>
        </div>
      )}
    </div>
  );
}
