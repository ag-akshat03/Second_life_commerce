"use client";

interface GreenCreditsPillProps {
  credits: number;
  showBonus?: boolean;
  size?: "sm" | "md";
}

export function GreenCreditsPill({ credits, showBonus = true, size = "sm" }: GreenCreditsPillProps) {
  const rupeeValue = credits;
  const bonusValue = Math.round(credits * 1.3);

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}`}>
      <span>🌱</span>
      <span>{credits} Credits</span>
      {showBonus && <span className="text-emerald-600 dark:text-emerald-400">(₹{rupeeValue} / ₹{bonusValue} on refurbished)</span>}
    </span>
  );
}
