import { Star } from "lucide-react";

import { cn, compactNumber } from "@/lib/utils";

export function Rating({
  value,
  count,
  className
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              index + 1 <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
            )}
          />
        ))}
      </div>
      <span className="font-semibold text-slate-700 dark:text-slate-200">
  {Number(value).toFixed(1)}
</span>
      {typeof count === "number" && <span className="text-amazon-teal">({compactNumber(count)})</span>}
    </div>
  );
}
