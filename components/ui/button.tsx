import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-amazon-orange/50 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-amazon-gold text-slate-950 shadow-sm hover:bg-[#f5a742] active:translate-y-px",
        variant === "secondary" && "bg-amazon-orange text-slate-950 shadow-sm hover:bg-[#ed8c00]",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
        variant === "dark" && "bg-amazon-navy text-white hover:bg-amazon-blue",
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-900 hover:border-amazon-orange hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        size === "icon" && "h-10 w-10 p-0",
        className
      )}
      {...props}
    />
  );
}
