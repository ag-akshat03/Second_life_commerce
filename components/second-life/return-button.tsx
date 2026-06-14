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
  productPrice?: number;
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

export function ReturnButton({ orderId, productId, productTitle, productImage, productPrice = 24999 }: ReturnButtonProps) {
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
      const res = await fetch("/api/returns", {
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
          complaintText: reason,
          productValue: productPrice,
          category: "electronics",
          productAgeMonths: 6,
        }),
      });
      const data = await res.json();
      setResult(data);

      // Route to appropriate step based on recommendation
      if (data.recommendation === "full_refund" || data.recommendation === "full_refund_with_return" || data.recommendation === "approve_return") {
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
            Our advanced AI is analyzing your product&apos;s condition
          </p>
        </div>
      )}

      {/* STEP 4: Approved — full refund path */}
      {step === "approved" && result && (
        <div className="mt-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <h5 className="text-base font-bold text-green-800 dark:text-green-200">Return Approved!</h5>
            </div>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              {result.customerExplanation || "Your return has been approved. Refund will be processed after pickup."}
            </p>

            {/* Refund amount */}
            <div className="mt-3 rounded-md bg-white/80 p-3 dark:bg-slate-800/50">
              <p className="text-lg font-bold text-green-800">Refund: ₹{(result.refundAmount || 2299).toLocaleString()}</p>
              <p className="text-xs text-slate-500">Confidence: {Math.round((result.confidence || 0.7) * 100)}%</p>
              {result.conditionSeverity !== undefined && (
                <p className="text-xs text-slate-500">Condition severity: {result.conditionSeverity}/100</p>
              )}
            </div>

            {/* Options if available */}
            {result.options && result.options.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-slate-600">Choose your preferred option:</p>
                {result.options.map((opt: any, i: number) => (
                  <button key={i} className="flex w-full items-center justify-between rounded-lg border border-green-200 bg-white p-2.5 text-left text-sm hover:border-green-400 dark:bg-slate-800">
                    <span>{opt.label}</span>
                    {opt.amount > 0 && <span className="font-bold text-green-700">₹{opt.amount.toLocaleString()}</span>}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-green-600">
              ✅ Pickup scheduled within 2-3 business days. Refund within 5-7 days of pickup.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: Options screen (powered by 5-stage engine) */}
      {step === "not_returnable" && result && !result.compensationAccepted && (
        <div className="mt-4">
          <TrustBar />
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="text-[13px] text-slate-600 dark:text-slate-300">
              {result.customerExplanation || "Based on our AI assessment, here are your options:"}
            </p>

            {result.conditionSeverity !== undefined && (
              <div className="mt-3 flex items-center gap-3">
                <ScoreRing score={Math.max(10, 100 - (result.conditionSeverity || 30))} size={48} />
                <p className="text-[13px] text-slate-600">Severity: {result.conditionSeverity}/100 • Confidence: {Math.round((result.conditionConfidence || 0.6) * 100)}%</p>
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {(result.options && result.options.length > 0 ? result.options : [
                { id: "full_return", label: `Full return & refund ₹${result.refundAmount || 2299}`, amount: result.refundAmount || 2299 },
                { id: "accept_compensation", label: `Keep product + ₹${result.compensationAmount || 350} partial refund`, amount: result.compensationAmount || 350 },
                { id: "resell", label: "Resell on Amazon Marketplace", amount: 0 },
                { id: "donate", label: "Donate & earn Green Credits", amount: 0 },
              ]).map((opt: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    if (opt.id === "resell") window.location.href = "/sell-device";
                    else if (opt.id === "donate") handleDonate();
                    else setResult({ ...result, compensationAccepted: true, compensationAmount: opt.amount });
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                    i === 0 ? "border-2 border-amazon-gold bg-amber-50/50" : "border-slate-200 hover:border-slate-300 dark:border-white/10"
                  }`}
                >
                  <span className="text-[13px] text-slate-800 dark:text-slate-200">{opt.label}</span>
                  {opt.amount > 0 && <span className="text-[13px] font-medium text-emerald-700">₹{opt.amount.toLocaleString()}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {result?.compensationAccepted && (
        <div className="mt-4 rounded-xl border-2 border-green-200 bg-green-50 p-5 text-center dark:border-green-800 dark:bg-green-950/20">
          <span className="text-3xl">✅</span>
          <h5 className="mt-2 text-[15px] font-medium text-green-800">Confirmed!</h5>
          <p className="mt-1 text-xl font-medium text-green-800">₹{result.compensationAmount?.toLocaleString()}</p>
          <p className="mt-1 text-[13px] text-green-600">Will be credited within 24 hours.</p>
        </div>
      )}

      {result?.greenCredits && (
        <div className="mt-4 rounded-lg bg-green-50 p-5 text-center dark:bg-green-950/20">
          <p className="text-3xl">🌱🎉</p>
          <h5 className="mt-2 text-lg font-bold text-green-800">{result.greenCredits.message}</h5>
        </div>
      )}
    </div>
  );
}
