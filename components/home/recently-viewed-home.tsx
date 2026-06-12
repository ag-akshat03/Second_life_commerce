"use client";

import { ProductShowcase } from "@/components/home/product-showcase";
import { products } from "@/lib/data";

export function RecentlyViewedHome() {
  if (typeof window === "undefined") return null;

  let slugs: string[] = [];
  try {
    slugs = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]") as string[];
  } catch {
    slugs = [];
  }

  const viewed = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 5);

  if (viewed.length === 0) return null;

  return (
    <ProductShowcase
      title="Recently viewed"
      subtitle="Products you looked at recently."
      products={viewed as typeof products}
      href="/search"
    />
  );
}
