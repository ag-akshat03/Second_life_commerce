import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { paginateProducts, searchProducts } from "@/lib/products";
import type { SearchParams } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: SearchParams = {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    page: searchParams.get("page") ?? undefined
  };
  const page = Number(params.page ?? 1);

  try {
    const where = {
      AND: [
        params.q
          ? {
              OR: [
                { title: { contains: params.q, mode: "insensitive" as const } },
                { brand: { contains: params.q, mode: "insensitive" as const } },
                { tags: { has: params.q } }
              ]
            }
          : {},
        params.category && params.category !== "All" ? { category: params.category } : {},
        params.rating ? { rating: { gte: Number(params.rating) } } : {}
      ]
    };

    const orderBy =
      params.sort === "price-asc"
        ? { price: "asc" as const }
        : params.sort === "price-desc"
          ? { price: "desc" as const }
          : params.sort === "rating"
            ? { rating: "desc" as const }
            : params.sort === "discount"
              ? { discount: "desc" as const }
              : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * 8,
        take: 8
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      perPage: 8,
      totalPages: Math.ceil(total / 8)
    });
  } catch (error) {
    console.warn("PRODUCTS_DB_FALLBACK", error);
    return NextResponse.json(paginateProducts(searchProducts(params), page, 8));
  }
}
