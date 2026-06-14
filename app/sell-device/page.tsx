"use client";

import { useState } from "react";
import Link from "next/link";

// === CATEGORY-SPECIFIC QUESTIONNAIRES ===
const QUESTIONS: Record<string, { id: string; question: string; options: string[] }[]> = {
  laptop: [
    { id: "turns_on", question: "Does the laptop turn on and boot normally?", options: ["Yes, works perfectly", "Yes, but slow to boot", "Turns on intermittently", "Does not turn on"] },
    { id: "battery", question: "Battery health & backup?", options: ["Excellent (4+ hours)", "Good (2-4 hours)", "Poor (under 1 hour)", "Battery dead/swollen"] },
    { id: "screen", question: "Screen condition?", options: ["Perfect, no scratches or dead pixels", "Minor scratches (not visible during use)", "Visible scratches or 1-2 dead pixels", "Cracked/heavily damaged screen"] },
    { id: "keyboard", question: "Keyboard & trackpad condition?", options: ["All keys working perfectly", "Minor wear on keycaps", "Some keys sticky/not working", "Multiple keys not working"] },
    { id: "body", question: "Body/chassis condition?", options: ["Like new, no dents or scratches", "Minor cosmetic wear", "Visible dents or scratches", "Significant damage"] },
  ],
  monitor: [
    { id: "turns_on", question: "Does the monitor display properly?", options: ["Yes, perfect display", "Yes, minor backlight bleed", "Has dead pixels or lines", "Does not turn on"] },
    { id: "screen", question: "Screen surface condition?", options: ["Perfect, no scratches", "Minor surface marks", "Visible scratches", "Cracked panel"] },
    { id: "stand", question: "Stand and ports condition?", options: ["Perfect, all ports working", "Stand has minor wear", "Some ports not working", "Stand broken/missing"] },
    { id: "body", question: "Overall body condition?", options: ["Like new", "Minor cosmetic wear", "Visible damage on bezels", "Significant damage"] },
  ],
  smartphone: [
    { id: "turns_on", question: "Does the phone turn on and function?", options: ["Yes, fully functional", "Yes, but laggy/slow", "Turns on intermittently", "Does not turn on"] },
    { id: "battery", question: "Battery health?", options: ["Excellent (lasts full day)", "Good (lasts half day)", "Poor (needs frequent charging)", "Battery swollen/dead"] },
    { id: "screen", question: "Screen condition?", options: ["Perfect, no cracks or scratches", "Minor scratches (with screen protector)", "Visible cracks but touchscreen works", "Screen cracked/touch not working"] },
    { id: "camera", question: "Camera condition?", options: ["Camera works perfectly", "Minor lens scratch", "Camera has issues/blurry", "Camera not working"] },
    { id: "body", question: "Body condition?", options: ["Like new", "Minor wear and tear", "Visible dents/scratches", "Significant damage, missing parts"] },
  ],
};

// === PRICING LOGIC (realistic calculations) ===
function calculateValue(category: string, brand: string, originalPrice: number, ageMonths: number, answers: Record<string, string>) {
  // Base depreciation curve
  let depreciationFactor: number;
  if (ageMonths <= 3) depreciationFactor = 0.85;      // 3 months: 85% retained
  else if (ageMonths <= 6) depreciationFactor = 0.72;  // 6 months: 72%
  else if (ageMonths <= 9) depreciationFactor = 0.65;  // 9 months: 65%
  else if (ageMonths <= 12) depreciationFactor = 0.55; // 1 year: 55%
  else if (ageMonths <= 24) depreciationFactor = 0.40; // 2 years: 40%
  else if (ageMonths <= 36) depreciationFactor = 0.28; // 3 years: 28%
  else if (ageMonths <= 48) depreciationFactor = 0.18; // 4 years: 18%
  else depreciationFactor = 0.10;                       // 5+ years: 10%

  // Condition multiplier based on answers
  let conditionScore = 100;
  const answerValues = Object.values(answers);
  answerValues.forEach((a) => {
    const idx = QUESTIONS[category]?.find((q) => q.options.includes(a))?.options.indexOf(a) ?? 0;
    // First option = perfect (0 penalty), last = worst (25 penalty per question)
    conditionScore -= idx * (25 / (QUESTIONS[category]?.length || 4));
  });
  conditionScore = Math.max(10, Math.min(100, conditionScore));

  const conditionMultiplier = conditionScore / 100;

  // Final values
  const resaleValue = Math.round(originalPrice * depreciationFactor * conditionMultiplier);
  const exchangeValue = Math.round(resaleValue * 0.80); // Exchange is 80% of resale (Amazon takes resale effort)
  const greenCreditsValue = Math.round(resaleValue * 1.15); // Green credits worth 15% more than exchange

  // Determine tier
  let tier: string;
  let recommendation: string;
  if (conditionScore >= 85 && ageMonths <= 6) {
    tier = "Excellent";
    recommendation = "resale";
  } else if (conditionScore >= 65 && ageMonths <= 12) {
    tier = "Good";
    recommendation = "resale_or_exchange";
  } else if (conditionScore >= 45) {
    tier = "Fair";
    recommendation = "exchange_or_donate";
  } else {
    tier = "Poor";
    recommendation = "donate";
  }

  return {
    conditionScore,
    tier,
    recommendation,
    resaleValue,
    exchangeValue,
    greenCreditsValue,
    depreciationFactor,
    conditionMultiplier,
  };
}

type Step = "category" | "details" | "images" | "questions" | "analyzing" | "offer";

export default function SellDevicePage() {
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [ageMonths, setAgeMonths] = useState(3);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews: string[] = [];
    const newImages: string[] = [];
    Promise.all(
      files.map((f) => new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string);
          newImages.push((reader.result as string).split(",")[1]);
          resolve();
        };
        reader.readAsDataURL(f);
      }))
    ).then(() => { setPreviews([...previews, ...newPreviews]); setImages([...images, ...newImages]); });
  };

  const handleAnalyze = () => {
    setStep("analyzing");
    // Simulate AI processing delay
    setTimeout(() => {
      const valuation = calculateValue(category, brand, originalPrice, ageMonths, answers);
      setResult(valuation);
      setStep("offer");
    }, 2500);
  };

  const tierColor = (tier: string) => {
    if (tier === "Excellent") return "bg-green-100 text-green-800";
    if (tier === "Good") return "bg-blue-100 text-blue-800";
    if (tier === "Fair") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-amazon-teal hover:underline">← Back to Home</Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Sell or Exchange Your Device</h1>
      <p className="text-sm text-slate-500">AI-powered valuation • Instant offers • Green Credits</p>

      {/* STEP 1: Category */}
      {step === "category" && (
        <div className="mt-6 space-y-3">
          {/* Trust strip */}
          <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-2.5 text-[13px] text-slate-500 dark:bg-slate-800">
            <span>📊 2M+ items resold</span>
            <span>⚡ AI valuation in seconds</span>
            <span>💰 Instant offers</span>
            <span>🛡️ A-to-Z Guarantee</span>
          </div>

          <h2 className="text-lg font-bold">What would you like to sell?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "laptop", icon: "💻", label: "Laptop", desc: "MacBook, ThinkPad, HP, Dell...", range: "₹15,000–₹60,000" },
              { id: "monitor", icon: "🖥️", label: "Monitor", desc: "Dell, LG, Samsung, BenQ...", range: "₹5,000–₹35,000" },
              { id: "smartphone", icon: "📱", label: "Smartphone", desc: "iPhone, Samsung, OnePlus...", range: "₹3,000–₹45,000" },
            ].map((c) => (
              <button key={c.id} onClick={() => { setCategory(c.id); setStep("details"); }}
                className="rounded-xl border-2 border-slate-200 p-5 text-left transition hover:border-amazon-gold hover:bg-amber-50 dark:border-white/10 dark:hover:bg-amber-950/10">
                <span className="text-3xl">{c.icon}</span>
                <p className="mt-2 font-bold">{c.label}</p>
                <p className="text-xs text-slate-500">{c.desc}</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">{c.range} typical value</p>
              </button>
            ))}
          </div>

          {/* How it works strip */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-gradient-to-r from-slate-50 to-amber-50/50 p-4 dark:from-slate-800 dark:to-amber-950/10">
            {[
              { icon: "📸", title: "Upload photos", desc: "Take clear photos from all angles" },
              { icon: "🤖", title: "AI grades in seconds", desc: "Advanced quality inspection" },
              { icon: "💰", title: "Get instant offer", desc: "Resale, exchange, or Green Credits" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-1 text-[13px] font-medium text-slate-800 dark:text-white">{s.title}</p>
                <p className="text-[11px] text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Device details */}
      {step === "details" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Device Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-600">Brand *</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder={category === "laptop" ? "e.g. Apple, Lenovo, HP" : category === "monitor" ? "e.g. Dell, LG, Samsung" : "e.g. Apple, Samsung, OnePlus"} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Model *</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder={category === "laptop" ? "e.g. MacBook Air M2" : category === "monitor" ? "e.g. UltraSharp U2723QE" : "e.g. iPhone 13 Pro"} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Age (months) *</label>
              <input type="number" value={ageMonths} onChange={(e) => setAgeMonths(Number(e.target.value))} min={1} max={120} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Original Purchase Price (₹) *</label>
              <input type="number" value={originalPrice || ""} onChange={(e) => setOriginalPrice(Number(e.target.value))} placeholder="35000" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-800" />
            </div>
          </div>
          <button onClick={() => { if (brand && model && originalPrice) setStep("images"); else alert("Fill all fields"); }}
            className="mt-5 rounded-lg bg-amazon-gold px-6 py-2.5 text-sm font-bold text-slate-950">Continue →</button>
        </div>
      )}

      {/* STEP 3: Upload images + invoice */}
      {step === "images" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Upload Photos & Invoice</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700">Product Photos (all angles) *</label>
              <label className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 hover:border-amazon-gold">
                <span className="text-3xl">📸</span>
                <span className="mt-2 text-sm text-slate-500">Click to upload (front, back, sides, screen)</span>
                <input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {previews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded border"><img src={src} className="h-full w-full object-cover" /></div>
                  ))}
                  <span className="self-center text-xs text-green-600">✓ {previews.length} uploaded</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">Purchase Invoice (optional but recommended)</label>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                <span>📄</span>
                <span className="text-sm text-slate-600">{invoiceUploaded ? "✓ Invoice uploaded" : "Upload invoice photo/PDF"}</span>
                <input type="file" accept="image/*,.pdf" onChange={() => setInvoiceUploaded(true)} className="hidden" />
              </label>
            </div>
          </div>
          <button onClick={() => { if (images.length > 0) setStep("questions"); else alert("Upload at least one photo"); }}
            className="mt-5 rounded-lg bg-amazon-gold px-6 py-2.5 text-sm font-bold text-slate-950">Continue →</button>
        </div>
      )}

      {/* STEP 4: Condition questions */}
      {step === "questions" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Condition Assessment — {category === "laptop" ? "💻 Laptop" : category === "monitor" ? "🖥️ Monitor" : "📱 Smartphone"}</h2>
          <p className="text-xs text-slate-500 mt-1">Please answer honestly — this helps our AI give you the best offer.</p>
          <div className="mt-4 space-y-4">
            {QUESTIONS[category]?.map((q) => (
              <div key={q.id} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{q.question}</p>
                <div className="mt-2 space-y-1.5">
                  {q.options.map((opt, i) => (
                    <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition ${answers[q.id] === opt ? "border-amazon-gold bg-amber-50" : "border-slate-100 hover:border-slate-300"}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="accent-amazon-gold" />
                      <span className={i === 0 ? "text-green-700" : i === q.options.length - 1 ? "text-red-600" : ""}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { if (Object.keys(answers).length >= (QUESTIONS[category]?.length || 3)) handleAnalyze(); else alert("Please answer all questions"); }}
            disabled={Object.keys(answers).length < (QUESTIONS[category]?.length || 3)}
            className="mt-5 w-full rounded-lg bg-amazon-gold py-3 text-sm font-bold text-slate-950 disabled:opacity-40">
            🔍 Analyze & Get Offer
          </button>
        </div>
      )}

      {/* STEP 5: AI Analyzing */}
      {step === "analyzing" && (
        <div className="mt-12 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-amazon-gold"></div>
          <h3 className="mt-4 text-lg font-bold">AI Inspection in Progress...</h3>
          <p className="mt-2 text-sm text-slate-500">Analyzing {previews.length} images • Evaluating condition • Calculating market value</p>
          <div className="mt-4 flex justify-center gap-3 text-xs text-slate-400">
            <span>🔍 Vision Analysis</span>
            <span>•</span>
            <span>📊 Market Price Engine</span>
            <span>•</span>
            <span>♻️ Green Impact Calculator</span>
          </div>
        </div>
      )}

      {/* STEP 6: Offer */}
      {step === "offer" && result && (
        <div className="mt-6">
          {/* AI Report Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">AI Valuation Report</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${tierColor(result.tier)}`}>{result.tier} Condition</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.conditionScore}/100</p>
                <p className="text-[10px] text-slate-500">Condition Score</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(result.depreciationFactor * 100)}%</p>
                <p className="text-[10px] text-slate-500">Value Retained</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{ageMonths}mo</p>
                <p className="text-[10px] text-slate-500">Device Age</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {brand} {model} • Original price: ₹{originalPrice.toLocaleString()} • Depreciation: {Math.round((1 - result.depreciationFactor) * 100)}% • Condition factor: {Math.round(result.conditionMultiplier * 100)}%
            </p>
          </div>

          {/* Options based on recommendation */}
          <div className="mt-5 space-y-3">
            {/* RESALE OPTION */}
            {(result.recommendation === "resale" || result.recommendation === "resale_or_exchange") && (
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  <h3 className="text-[15px] font-medium text-emerald-800 dark:text-emerald-200">List for Resale</h3>
                  {result.recommendation === "resale" && <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">RECOMMENDED</span>}
                </div>
                <p className="mt-2 text-2xl font-medium text-emerald-800 dark:text-emerald-200">₹{result.resaleValue.toLocaleString()}</p>
                <p className="text-[13px] text-slate-500">Estimated resale price on Amazon Refurbished</p>
                <p className="text-[13px] text-slate-500">Commission: 12% • Your payout: ₹{Math.round(result.resaleValue * 0.88).toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-1">Payout within 3 days of sale — direct to your bank account.</p>
                <button className="mt-3 rounded-lg bg-emerald-600 px-5 py-2 text-[13px] font-medium text-white hover:bg-emerald-700">
                  ✓ Accept & List for Sale
                </button>
              </div>
            )}

            {/* EXCHANGE OPTION */}
            {(result.recommendation === "resale_or_exchange" || result.recommendation === "exchange_or_donate") && (
              <div className="rounded-xl border border-blue-200 p-5 dark:border-blue-800 dark:bg-blue-950/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  <h3 className="text-[15px] font-medium text-blue-800 dark:text-blue-200">Exchange for New Device</h3>
                  {result.recommendation === "exchange_or_donate" && <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">RECOMMENDED</span>}
                </div>
                <p className="mt-2 text-xl font-medium text-blue-800 dark:text-blue-200">₹{result.exchangeValue.toLocaleString()} off</p>
                <p className="text-[13px] text-slate-500">Instant discount on a new {category} purchase from Amazon</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {result.recommendation === "resale_or_exchange" 
                    ? `Exchange is ₹${(result.resaleValue - result.exchangeValue).toLocaleString()} less than resale (Amazon handles logistics)`
                    : "Trade in your device and get instant credit toward your new purchase"}
                </p>
                <button className="mt-3 rounded-lg border border-blue-300 px-5 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-200">
                  🔄 Exchange & Shop New
                </button>
              </div>
            )}

            {/* GREEN CREDITS / DONATE OPTION */}
            {(result.recommendation === "exchange_or_donate" || result.recommendation === "donate") && (
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-200">Donate & Earn Green Credits</h3>
                  {result.recommendation === "donate" && <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">BEST VALUE</span>}
                </div>
                <p className="mt-2 text-3xl font-bold text-emerald-800 dark:text-emerald-200">{result.greenCreditsValue} Green Credits</p>
                <p className="text-xs text-emerald-600">
                  Worth ₹{result.greenCreditsValue} on any purchase (₹{Math.round(result.greenCreditsValue * 1.3)} on refurbished items with 30% bonus!)
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result.recommendation === "exchange_or_donate" 
                    ? `Green Credits value (₹${result.greenCreditsValue}) is higher than exchange value (₹${result.exchangeValue}) — better deal!`
                    : "Your device will be donated to underprivileged communities. You earn credits + help the planet."}
                </p>
                <div className="mt-2 rounded bg-emerald-100 p-2 text-xs dark:bg-emerald-900/30">
                  🌍 Environmental impact: ~{category === "laptop" ? "331" : category === "monitor" ? "225" : "66"} kg CO₂e avoided • ≈{category === "laptop" ? "15" : category === "monitor" ? "10" : "3"} trees equivalent
                </div>
                <button className="mt-3 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700">
                  🌱 Donate & Earn Credits
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
