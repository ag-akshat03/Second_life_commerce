import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default"
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "deal" | "prime" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-xs font-bold",
        tone === "default" && "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
        tone === "deal" && "bg-red-600 text-white",
        tone === "prime" && "bg-cyan-50 text-amazon-teal dark:bg-cyan-950/50 dark:text-cyan-200",
        tone === "success" && "bg-emerald-50 text-amazon-green dark:bg-emerald-950/50 dark:text-emerald-200",
        className
      )}
    >
      {children}
    </span>
  );
}
