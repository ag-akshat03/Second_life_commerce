"use client";

import { useEffect, useState } from "react";

interface SizeFlagsBannerProps {
  productId: string;
  brand: string;
  category: string;
  selectedSize?: string;
}

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || "http://localhost:8000";

export function SizeFlagsBanner({ productId, brand, category, selectedSize }: SizeFlagsBannerProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(selectedSize || "");

  const isRelevant = ["Clothing", "Shoes", "Fashion", "Apparel", "Footwear", "Sportswear", "Sports"].some(
    (c) => category.toLowerCase().includes(c.toLowerCase())
  );

  useEffect(() => {
    if (!isRelevant || !size) return;

    const checkSize = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${ML_SERVICE_URL}/size-check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "rahul",  // Demo user with pre-loaded history
            sku_id: productId,
            selected_size: size,
            brand: brand || "Nike",
            category: category.toLowerCase().includes("shoe") || category.toLowerCase().includes("sport") ? "footwear" : "apparel",
          }),
        });
        if (res.ok) {
          setPrediction(await res.json());
        }
      } catch {
        setPrediction(null);
      }
      setLoading(false);
    };

    const debounce = setTimeout(checkSize, 300);
    return () => clearTimeout(debounce);
  }, [size, productId, brand, category, isRelevant]);

  if (!isRelevant) return null;

  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-900/30 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="flex items-center gap-2">
        <span className="text-lg">👟</span>
        <span className="text-sm font-bold text-blue-800 dark:text-blue-200">Smart Size Assistant</span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30">AI-Powered</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Select size:</label>
        <div className="flex flex-wrap gap-1.5">
          {(category.toLowerCase().includes("fashion") || category.toLowerCase().includes("apparel")
            ? ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"]
            : ["UK 7", "UK 8", "UK 8.5", "UK 9", "UK 9.5", "UK 10", "UK 11"]
          ).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                size === s
                  ? "border-amazon-gold bg-amazon-gold text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-white/20 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-2 text-xs text-slate-500">🔍 Checking your history...</p>}

      {prediction && !loading && (
        <div className="mt-3 space-y-2">
          {/* Main prediction */}
          {prediction.fit_prediction === "true_to_size" ? (
            <div className="flex items-start gap-2 rounded-md bg-green-50 p-2.5 dark:bg-green-950/20">
              <span className="text-base">✅</span>
              <div>
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                  {size} — Good fit for you!
                </p>
                <p className="text-xs text-green-600">
                  {prediction.confidence > 0.7
                    ? `Based on ${prediction.history_summary?.brand_orders || 0} past orders with ${prediction.brand}`
                    : "Based on general sizing data"}
                </p>
              </div>
            </div>
          ) : prediction.fit_prediction === "high_risk" ? (
            <div className="flex items-start gap-2 rounded-md bg-red-50 p-2.5 dark:bg-red-950/20">
              <span className="text-base">🚨</span>
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-300">
                  High return risk ({Math.round(prediction.return_probability * 100)}%)
                </p>
                {prediction.nudge_message && (
                  <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{prediction.nudge_message}</p>
                )}
                {prediction.recommended_size !== size && (
                  <button
                    onClick={() => setSize(prediction.recommended_size)}
                    className="mt-1.5 rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
                  >
                    Switch to {prediction.recommended_size} →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 p-2.5 dark:bg-amber-950/20">
              <span className="text-base">⚠️</span>
              <div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  Moderate risk — consider {prediction.recommended_size}
                </p>
                {prediction.nudge_message && (
                  <p className="mt-0.5 text-xs text-amber-600">{prediction.nudge_message}</p>
                )}
              </div>
            </div>
          )}

          {/* Specific alerts from history */}
          {prediction.alerts?.length > 0 && (
            <div className="space-y-1.5">
              {prediction.alerts.map((alert: any, i: number) => (
                <div key={i} className={`flex items-start gap-2 rounded-md p-2 text-xs ${
                  alert.severity === "high" ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300" :
                  "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300"
                }`}>
                  <span>{alert.severity === "high" ? "⚠️" : "ℹ️"}</span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* History summary — visual dot row */}
          {prediction.history_summary?.brand_orders > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">{prediction.brand} history:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: prediction.history_summary.brand_orders }).map((_, i) => (
                  <span key={i} className={`inline-block h-2.5 w-2.5 rounded-full ${i < prediction.history_summary.brand_returns ? "bg-red-400" : "bg-green-400"}`}></span>
                ))}
              </div>
              <span className="text-[10px] text-slate-400">
                ({prediction.history_summary.brand_orders - prediction.history_summary.brand_returns} kept, {prediction.history_summary.brand_returns} returned)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
