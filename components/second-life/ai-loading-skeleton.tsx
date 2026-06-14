"use client";

export function AILoadingSkeleton({ message = "Inspecting your product for quality verification..." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 animate-pulse rounded-full bg-gradient-to-br from-amber-200 to-orange-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" style={{ animationDelay: `${i * 150}ms` }}></div>
        ))}
      </div>
      <p className="mt-4 text-center text-[13px] text-slate-400">{message}</p>
    </div>
  );
}
