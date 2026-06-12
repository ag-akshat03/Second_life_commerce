"use client";

import { useState } from "react";
import { ScoreRing } from "./score-ring";
import { GreenCreditsPill } from "./green-credits-pill";
import { TrustBar } from "./trust-bar";

interface ReturnButtonProps {
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
}

type Step = "reason" | "upload" | "analyzing" | "approved" | "not_returnable";

const RETURN_REASONS = [
  { id: "wrong_size", label: "Wrong size / doesn't fit" },
  { id: "not_as_described", label: "Item not as described" },
  { id: "defective", label: "Defective / damaged on arrival" },
  { id: "no_longer_needed", label: "No longer needed" },
  { id: "better_price", label: "Found better price elsewhere" },
  { id: "wrong_item", label: "Wrong item delivered" },
];

export function ReturnButton({ orderId, productId, productTitle, productImage }: ReturnButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>("reason");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [variant, setVariant] = useState("default");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Generate previews
    const newPreviews: string[] = [];
    const newImages: string[] = [];
    
    Promise.all(
      files.map(
        (f) =>
          new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string;
              newPreviews.push(dataUrl);
              newImages.push(dataUrl.split(",")[1]); // base64 only
              resolve();
            };
            reader.readAsDataURL(f);
          })
      )
    ).then(() => {
      setPreviews(newPreviews);
      setImages(newImages);
    });
  };

  const handleAnalyze = async () => {
    if (!images.length) return alert("Please upload at least one photo of the product");
    setStep("analyzing");
    setLoading(true);

    try {
      const res = await fetch("/api/returns/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          productId,
          orderId,
          images,
          skuId: productId,
          variant,
          skuDescription: productTitle,
          returnReason: reason,
        }),
      });
      const data = await res.json();
      setResult(data);

      // Route based on condition
      if (data.cosmeticScore >= 75 || data.decision === "digital_inventory") {
        setStep("approved");
      } else {
        setStep("not_returnable");
      }
    } catch (err: any) {
      setResult({ error: err.message });
      setStep("not_returnable");
    }
    setLoading(false);
  };

  const handleDonate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/green-credits/donate-recycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          itemId: productId,
          category: "electronics",
          choice: "donate",
        }),
      });
      const data = await res.json();
      setResult({ ...result, greenCredits: data });
    } catch {}
    setLoading(false);
  };

  const resetFlow = () => {
    setShowModal(false);
    setStep("reason");
    setReason("");
    setImages([]);
    setPreviews([]);
    setResult(null);
  };

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-slate-800 dark:text-slate-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Return or Replace Item
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Return Request</h4>
        <button onClick={resetFlow} className="text-sm text-slate-400 hover:text-slate-600">✕ Close</button>
      </div>
      <p className="mt-1 text-sm text-slate-500">{productTitle}</p>

      {/* STEP 1: Select reason */}
      {step === "reason" && (
        <div className="mt-4">
          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200">Why are you returning this item?</h5>
          <div className="mt-3 space-y-2">
            {RETURN_REASONS.map((r) => (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  reason === r.id
                    ? "border-amazon-gold bg-amber-50 dark:bg-amber-950/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.id}
                  checked={reason === r.id}
                  onChange={() => setReason(r.id)}
                  className="accent-amazon-gold"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">{r.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => reason && setStep("upload")}
            disabled={!reason}
            className="mt-4 w-full rounded-lg bg-amazon-gold py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2: Upload images */}
      {step === "upload" && (
        <div className="mt-4">
          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            📸 Upload photos of the product
          </h5>
          <p className="mt-1 text-xs text-slate-500">
            Please capture clear photos showing the product&apos;s current condition. Our AI will inspect the item to verify it&apos;s eligible for return.
          </p>

          <div className="mt-3">
            <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-slate-300 p-6 transition hover:border-amazon-gold dark:border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="mt-2 text-sm text-slate-500">Click to upload photos (1-6 images)</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <img src={src} alt={`Upload ${i+1}`} className="h-full w-full object-cover" />
                </div>
              ))}
              <p className="ml-2 self-center text-xs text-green-600">✓ {previews.length} photo(s) ready</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep("reason")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20">
              Back
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!images.length}
              className="flex-1 rounded-lg bg-amazon-gold py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40"
            >
              🔍 Analyze Product Condition
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Analyzing */}
      {step === "analyzing" && (
        <div className="mt-6 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amazon-gold"></div>
          <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
            AI Inspection in Progress...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Our DINOv2 + CLIP models are analyzing your product&apos;s condition
          </p>
        </div>
      )}

      {/* STEP 4: Approved — product is in good condition */}
      {step === "approved" && result && (
        <div className="mt-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <h5 className="text-base font-bold text-green-800 dark:text-green-200">Return Approved!</h5>
            </div>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              Your product has been inspected and found to be in <strong>{result.conditionLabel || "good"}</strong> condition.
            </p>

            {/* AI Inspection Results */}
            <div className="mt-3 rounded-md bg-white/80 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-bold text-slate-600">AI Inspection Report</p>
              <div className="mt-1 flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  (result.cosmeticScore || 80) >= 90 ? "bg-green-100 text-green-800" :
                  (result.cosmeticScore || 80) >= 75 ? "bg-blue-100 text-blue-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  Condition Score: {result.cosmeticScore || 80}/100
                </span>
                <span className="text-xs text-slate-500">{result.conditionLabel || "Good"}</span>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-green-200 bg-green-100/50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <p className="text-sm font-bold text-green-800 dark:text-green-200">
                💰 Your refund will be initiated after pickup
              </p>
              <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                A delivery agent will pick up the item within 2-3 business days. Refund will be processed to your original payment method within 5-7 days of pickup.
              </p>
            </div>

            {result.decision === "digital_inventory" && (
              <p className="mt-3 text-xs text-blue-600">
                🔄 This item will be directly matched to a new buyer — saving reverse logistics costs and carbon emissions!
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: Not returnable — offer alternatives */}
      {step === "not_returnable" && result && !result.compensationAccepted && (
        <div className="mt-4">
          <TrustBar />
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            {/* Score Result Card */}
            <div className="flex items-center gap-4">
              <ScoreRing score={result.cosmeticScore || 45} size={64} />
              <div>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-medium text-red-800">
                  {result.conditionLabel || "For Parts/Refurb Only"}
                </span>
                <p className="mt-1 text-[13px] text-slate-500">
                  Product shows significant wear/damage. Standard return not available due to logistics costs exceeding item residual value.
                </p>
              </div>
            </div>

            {/* Options — clear hierarchy */}
            <div className="mt-5 space-y-3">
              {/* PRIMARY: Partial Refund / Compensation — keep the product */}
              <div className="rounded-xl border-2 border-amazon-gold bg-amber-50/50 p-4 dark:border-amber-700 dark:bg-amber-950/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-lg">💰</span>
                  <div>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-white">Keep the product + Get partial refund</p>
                    <p className="text-[13px] text-slate-500">No need to return — receive compensation directly to your account</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white px-4 py-3 dark:bg-slate-800">
                  <p className="text-[13px] text-slate-600">Compensation amount:</p>
                  <p className="text-2xl font-medium text-amazon-gold">₹{Math.round((result.cosmeticScore || 45) * 0.35 * 50).toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400">({Math.round((result.cosmeticScore || 45) * 0.35)}% of product value • Credited within 24 hours)</p>
                </div>
                <button
                  onClick={() => setResult({ ...result, compensationAccepted: true, compensationAmount: Math.round((result.cosmeticScore || 45) * 0.35 * 50) })}
                  className="mt-3 w-full rounded-lg bg-amazon-gold py-2.5 text-[13px] font-medium text-slate-950">
                  ✓ Accept Compensation — Keep Product
                </button>
              </div>

              {/* SECONDARY: Resell on Marketplace */}
              <button
                onClick={() => window.location.href = "/resell"}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-800">🏷️</span>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-slate-900 dark:text-white">Resell on Amazon Marketplace</p>
                  <p className="text-[13px] text-slate-500">List it yourself — set your own price, reach verified buyers</p>
                </div>
                <span className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:border-white/20 dark:text-slate-200">List</span>
              </button>

              {/* TERTIARY: Donate */}
              <button
                onClick={handleDonate}
                disabled={loading}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-800">🌱</span>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-slate-900 dark:text-white">Donate & Earn Green Credits</p>
                  <p className="text-[13px] text-slate-500">Help someone in need + earn credits for future purchases</p>
                </div>
                <span className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:border-white/20 dark:text-slate-200">Donate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compensation accepted confirmation */}
      {result?.compensationAccepted && (
        <div className="mt-4 rounded-xl border-2 border-green-200 bg-green-50 p-5 text-center dark:border-green-800 dark:bg-green-950/20">
          <span className="text-3xl">✅</span>
          <h5 className="mt-2 text-[15px] font-medium text-green-800 dark:text-green-200">Compensation Accepted!</h5>
          <p className="mt-1 text-2xl font-medium text-green-800">₹{result.compensationAmount?.toLocaleString()}</p>
          <p className="mt-1 text-[13px] text-green-600">
            Partial refund of ₹{result.compensationAmount?.toLocaleString()} will be credited to your account within 24 hours.
          </p>
          <p className="mt-2 text-[13px] text-slate-500">You can keep the product — no return needed.</p>
        </div>
      )}

      {/* Green Credits celebration */}
      {result?.greenCredits && (
        <div className="mt-4">
          <div className="rounded-lg bg-green-50 p-5 text-center dark:bg-green-950/20">
            <p className="text-3xl">🌱🎉</p>
            <h5 className="mt-2 text-lg font-bold text-green-800 dark:text-green-200">
              Thank you for your donation!
            </h5>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              {result.greenCredits.message}
            </p>
            <div className="mt-4 inline-flex items-center gap-4 rounded-full bg-green-100 px-4 py-2 dark:bg-green-900/30">
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">{result.greenCredits.creditsAwarded}</p>
                <p className="text-[10px] text-green-600">Credits Earned</p>
              </div>
              <div className="h-6 w-px bg-green-300"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">{result.greenCredits.deltaCo2eKg} kg</p>
                <p className="text-[10px] text-green-600">CO₂e Avoided</p>
              </div>
              <div className="h-6 w-px bg-green-300"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">≈{result.greenCredits.treesEquivalent}</p>
                <p className="text-[10px] text-green-600">Trees 🌳</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-600">
              💡 Use your Green Credits on any purchase — get 30% bonus when buying refurbished items!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
