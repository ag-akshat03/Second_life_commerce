"use client";

import { useState } from "react";
import { ScoreRing } from "./score-ring";

interface ProductHealthCardProps {
  cosmeticScore: number;
  conditionTier: string;
  brand: string;
  model: string;
  ageMonths: number;
  inspectionDate?: string;
  warranty?: string;
  previousOwners?: number;
  defectsFound?: string[];
}

export function ProductHealthCard({
  cosmeticScore,
  conditionTier,
  brand,
  model,
  ageMonths,
  inspectionDate = new Date().toLocaleDateString("en-IN"),
  warranty = "6 months Amazon Renewed Guarantee",
  previousOwners = 1,
  defectsFound = [],
}: ProductHealthCardProps) {
  const [expanded, setExpanded] = useState(false);

  const tierColor = conditionTier === "Excellent" ? "from-green-500 to-emerald-600" :
    conditionTier === "Good" ? "from-blue-500 to-cyan-600" :
    conditionTier === "Fair" ? "from-amber-500 to-orange-600" : "from-red-500 to-rose-600";

  const scoreColor = cosmeticScore >= 90 ? "text-green-600" : cosmeticScore >= 75 ? "text-blue-600" : cosmeticScore >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      {/* Header bar */}
      <div className="bg-[#131921] px-4 py-2.5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span className="text-sm font-bold">Amazon Verified — Product Health Card</span>
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">AI Inspected</span>
        </div>
      </div>

      {/* Score + Key info */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Score ring */}
          <ScoreRing score={cosmeticScore} size={56} />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                conditionTier === "Excellent" ? "bg-green-100 text-green-800" :
                conditionTier === "Good" ? "bg-blue-100 text-blue-800" :
                "bg-amber-100 text-amber-800"
              }`}>{conditionTier}</span>
              <span className="text-xs text-slate-500">{brand} {model}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {conditionTier === "Excellent" ? "Like new — no visible wear, fully functional" :
               conditionTier === "Good" ? "Minor cosmetic wear — fully functional" :
               "Noticeable wear — functional with minor issues"}
            </p>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            ✓ Amazon Certified
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            🛡️ {warranty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
            🔍 AI Verified {inspectionDate}
          </span>
        </div>

        {/* Expand button */}
        <button onClick={() => setExpanded(!expanded)} className="mt-3 text-xs font-bold text-amazon-teal hover:underline">
          {expanded ? "Hide details ▲" : "View full inspection report ▼"}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-500">Device Age:</span> <strong>{ageMonths} months</strong></div>
              <div><span className="text-slate-500">Previous Owners:</span> <strong>{previousOwners}</strong></div>
              <div><span className="text-slate-500">Inspection Status:</span> <strong>Verified for Quality</strong></div>
              <div><span className="text-slate-500">Warranty:</span> <strong>{warranty}</strong></div>
            </div>
            {defectsFound.length > 0 ? (
              <div className="mt-2">
                <p className="font-bold text-slate-600">Noted issues:</p>
                <ul className="mt-1 list-inside list-disc text-slate-500">
                  {defectsFound.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            ) : (
              <p className="mt-2 font-bold text-green-600">✓ No defects detected during AI inspection</p>
            )}
            <p className="mt-2 text-slate-400">
              This product was inspected using Amazon&apos;s advanced quality verification system. 
              Covered by Amazon A-to-Z Guarantee — full refund if item materially differs from this report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
