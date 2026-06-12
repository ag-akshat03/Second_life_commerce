"use client";

export function TrustBar() {
  return (
    <div className="flex items-center justify-center gap-6 border-b border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-white/5 dark:bg-slate-900/50">
      {[
        { icon: "🛡️", label: "Amazon Certified" },
        { icon: "🔍", label: "AI Inspected" },
        { icon: "✓", label: "A-to-Z Guarantee" },
        { icon: "🔒", label: "Secure Payment" },
      ].map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}
