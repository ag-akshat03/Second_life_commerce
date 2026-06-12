import { NextResponse } from "next/server";

import { products } from "@/lib/data";
import { trendingSearches } from "@/lib/design-tokens";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (!q) {
    return NextResponse.json({ products: [], queries: trendingSearches.slice(0, 6) });
  }

  const matched: Product[] = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q))
    )
    .slice(0, 6);

  const queries = [
    ...trendingSearches.filter((term) => term.includes(q)),
    ...products
      .map((p) => p.brand)
      .filter((brand, index, arr) => brand.toLowerCase().includes(q) && arr.indexOf(brand) === index)
  ].slice(0, 6);

  return NextResponse.json({ products: matched, queries });
}
