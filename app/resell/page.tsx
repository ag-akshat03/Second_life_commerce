"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export default function ResellPage() {
  const [step, setStep] = useState<Step>(1);
  const [invoiceResult, setInvoiceResult] = useState<any>(null);
  const [conditionResult, setConditionResult] = useState<any>(null);
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [productName, setProductName] = useState("Dell UltraSharp 27 4K Monitor");
  const [orderId, setOrderId] = useState("ORD-001");
  const [amountPaid, setAmountPaid] = useState("35000");
  const [category, setCategory] = useState("monitors");
  const [cosmeticScore, setCosmeticScore] = useState("95");
  const [ageYears, setAgeYears] = useState("1");
  const [functionalResponses, setFunctionalResponses] = useState({
    power_on: "yes",
    battery_health: "good (>80%)",
    performance: "same as new",
  });

  const handleVerifyInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resale/verify-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user",
          skuId: "sku_002",
          invoiceData: {
            product_name: productName,
            order_id: orderId,
            amount_paid: parseFloat(amountPaid),
            purchase_date: "2025-06-15",
            seller_name: "Amazon",
          },
          orderHistory: [{ order_id: orderId, sku_id: "sku_002", amount: parseFloat(amountPaid) }],
          skuPriceRange: [parseFloat(amountPaid) * 0.8, parseFloat(amountPaid) * 1.2],
        }),
      });
      const data = await res.json();
      setInvoiceResult(data);
      if (data.ownership_verified) setStep(2);
    } catch (err: any) {
      setInvoiceResult({ error: err.message });
    }
    setLoading(false);
  };

  const handleCondition = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resale/condition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cosmeticScore: parseInt(cosmeticScore),
          functionalResponses,
          category,
        }),
      });
      const data = await res.json();
      setConditionResult(data);
      setStep(3);
    } catch (err: any) {
      setConditionResult({ error: err.message });
    }
    setLoading(false);
  };

  const handlePricing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resale/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrice: parseFloat(amountPaid),
          conditionTier: conditionResult?.conditionTier,
          finalConditionScore: conditionResult?.finalConditionScore,
          cosmeticScore: parseInt(cosmeticScore),
          functionalScore: conditionResult?.functionalScore,
          category,
          ageYears: parseFloat(ageYears),
          isBuyingReplacement: false,
          invoiceData: { product_name: productName, amount_paid: parseFloat(amountPaid) },
          functionalResponses,
        }),
      });
      const data = await res.json();
      setPricingResult(data);
      setStep(4);
    } catch (err: any) {
      setPricingResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-amazon-teal hover:underline">← Back to Home</Link>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Sell on Amazon Resale</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Get the best price for your pre-owned products</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              step >= s ? "bg-amazon-gold text-slate-950" : "bg-slate-200 text-slate-500"
            }`}>{s}</div>
            {s < 4 && <div className={`h-0.5 w-8 ${step > s ? "bg-amazon-gold" : "bg-slate-200"}`} />}
          </div>
        ))}
        <span className="ml-3 text-sm text-slate-500">
          {step === 1 && "Verify Invoice"}{step === 2 && "Condition Assessment"}{step === 3 && "Get Offer"}{step === 4 && "Review & Accept"}
        </span>
      </div>

      {/* Step 1: Invoice */}
      {step >= 1 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Step 1: Invoice Verification</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-600">Product Name</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Order ID</label>
              <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Amount Paid (₹)</label>
              <input value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800">
                <option value="monitors">Monitors</option>
                <option value="laptops">Laptops</option>
                <option value="electronics">Electronics</option>
                <option value="footwear">Footwear</option>
                <option value="apparel">Apparel</option>
              </select>
            </div>
          </div>
          {!invoiceResult && (
            <button onClick={handleVerifyInvoice} disabled={loading} className="mt-4 rounded bg-amazon-gold px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">
              {loading ? "Verifying..." : "Verify Invoice"}
            </button>
          )}
          {invoiceResult && (
            <div className={`mt-3 rounded p-3 text-sm ${invoiceResult.ownership_verified ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {invoiceResult.ownership_verified ? "✅ Ownership verified" : "❌ Verification failed"} — Confidence: {Math.round((invoiceResult.confidence || 0) * 100)}%
            </div>
          )}
        </div>
      )}

      {/* Step 2: Condition */}
      {step >= 2 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Step 2: Condition Assessment</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Cosmetic Score (1-100)</label>
              <input value={cosmeticScore} onChange={(e) => setCosmeticScore(e.target.value)} type="number" min="1" max="100" className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Age (years)</label>
              <input value={ageYears} onChange={(e) => setAgeYears(e.target.value)} type="number" step="0.5" className="mt-1 w-full rounded border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            {["electronics", "laptops", "monitors"].includes(category) && (
              <div className="rounded border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-950/20">
                <p className="text-xs font-bold text-blue-800">Functional Questionnaire</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-40 text-xs">Powers on normally?</span>
                    <select value={functionalResponses.power_on} onChange={(e) => setFunctionalResponses({...functionalResponses, power_on: e.target.value})} className="rounded border px-2 py-1 text-xs dark:bg-slate-800">
                      <option value="yes">Yes</option><option value="intermittent">Intermittent</option><option value="no">No</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-40 text-xs">Battery health?</span>
                    <select value={functionalResponses.battery_health} onChange={(e) => setFunctionalResponses({...functionalResponses, battery_health: e.target.value})} className="rounded border px-2 py-1 text-xs dark:bg-slate-800">
                      <option value="good (>80%)">Good (&gt;80%)</option><option value="fair (50-80%)">Fair (50-80%)</option><option value="poor (<50%)">Poor (&lt;50%)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-40 text-xs">Performance?</span>
                    <select value={functionalResponses.performance} onChange={(e) => setFunctionalResponses({...functionalResponses, performance: e.target.value})} className="rounded border px-2 py-1 text-xs dark:bg-slate-800">
                      <option value="same as new">Same as new</option><option value="slightly slower">Slightly slower</option><option value="significantly slower">Significantly slower</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!conditionResult && (
            <button onClick={handleCondition} disabled={loading} className="mt-4 rounded bg-amazon-gold px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">
              {loading ? "Assessing..." : "Assess Condition"}
            </button>
          )}
          {conditionResult && (
            <div className="mt-3 rounded bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm"><strong>Score:</strong> {conditionResult.finalConditionScore}/100 — <strong>Tier:</strong> <span className={`font-bold ${conditionResult.conditionTier === "LIKE_NEW" ? "text-green-600" : conditionResult.conditionTier === "GOOD" ? "text-blue-600" : conditionResult.conditionTier === "ACCEPTABLE" ? "text-amber-600" : "text-red-600"}`}>{conditionResult.conditionTier}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Get Pricing */}
      {step >= 3 && !pricingResult && (
        <div className="mt-4 text-center">
          <button onClick={handlePricing} disabled={loading} className="rounded bg-amazon-gold px-6 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50">
            {loading ? "Calculating..." : "Get Pricing Offer"}
          </button>
        </div>
      )}

      {/* Step 4: Result */}
      {step >= 4 && pricingResult && (
        <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-950/20">
          <h2 className="text-lg font-bold text-green-800 dark:text-green-200">Your Offer</h2>
          <p className="text-sm text-green-700 dark:text-green-300">Recommendation: <strong>{pricingResult.recommendation}</strong></p>

          {pricingResult.listingPrice && (
            <div className="mt-4">
              <p className="text-3xl font-bold text-green-800 dark:text-green-200">₹{pricingResult.listingPrice.toLocaleString()}</p>
              <p className="text-sm text-slate-600">Estimated listing price (after {Math.round((1 - pricingResult.depreciationFactor) * 100)}% depreciation)</p>
              <p className="text-xs text-slate-500">Commission: {Math.round(pricingResult.commissionRate * 100)}% → Payout: ₹{pricingResult.sellerPayout?.toLocaleString()}</p>
            </div>
          )}

          {pricingResult.exchangeValue && (
            <div className="mt-3 rounded bg-amber-50 p-3 dark:bg-amber-950/20">
              <p className="text-sm font-bold text-amber-800">Exchange option: ₹{pricingResult.exchangeValue.toLocaleString()} off a new purchase</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button className="rounded bg-amazon-gold px-5 py-2 text-sm font-bold text-slate-950">✓ Accept & List</button>
            <button className="rounded border border-slate-300 px-5 py-2 text-sm font-bold text-slate-700">✗ Decline</button>
          </div>
        </div>
      )}
    </div>
  );
}
