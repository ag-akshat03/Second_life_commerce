import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[linear-gradient(110deg,#e5e7eb,45%,#f8fafc,55%,#e5e7eb)] bg-[length:200%_100%] dark:bg-[linear-gradient(110deg,#1f2937,45%,#334155,55%,#1f2937)]",
        className
      )}
    />
  );
}
