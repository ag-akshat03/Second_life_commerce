import { NextResponse } from "next/server";

import { products } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const productId = searchParams.get("productId");
  const type = searchParams.get("type") ?? "personalized";

  let result = [...products];

  if (productId) {
    const source = products.find((p) => p.id === productId);
    if (source) {
      result = products.filter((p) => p.category === source.category && p.id !== source.id);
    }
  } else if (category) {
    result = products.filter((p) => p.category === category);
  }

  switch (type) {
    case "trending":
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "deals":
      result = result.filter((p) => p.discount >= 15).sort((a, b) => b.discount - a.discount);
      break;
    case "prime":
      result = result.filter((p) => p.isPrime);
      break;
    default:
      result = result.filter((p) => p.isFeatured || p.rating >= 4.2);
  }

  return NextResponse.json({ products: result.slice(0, 12) });
}
