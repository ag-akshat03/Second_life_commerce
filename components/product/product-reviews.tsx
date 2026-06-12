"use client";

import { ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Rating } from "@/components/ui/rating";
import { reviews as seedReviews } from "@/lib/data";
import type { Product, ReviewItem } from "@/types";

type SortKey = "helpful" | "recent" | "rating-high" | "rating-low";

export function ProductReviews({ product }: { product: Product }) {
  const [sort, setSort] = useState<SortKey>("helpful");
  const [filter, setFilter] = useState<number | "all">("all");
  const [votes, setVotes] = useState<Record<string, number>>({});

  const items: ReviewItem[] = seedReviews.map((r, i) => ({
    id: `review-${i}`,
    name: r.name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    helpfulVotes: 12 + i * 7,
    verifiedPurchase: i !== 1,
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString()
  }));

  let filtered = [...items];
  if (filter !== "all") filtered = filtered.filter((r) => r.rating === filter);

  filtered.sort((a, b) => {
    switch (sort) {
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "recent":
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      default:
        return (b.helpfulVotes ?? 0) - (a.helpfulVotes ?? 0);
    }
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Customer reviews</h3>
          <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
            aria-label="Sort reviews"
          >
            <option value="helpful">Most helpful</option>
            <option value="recent">Most recent</option>
            <option value="rating-high">Highest rating</option>
            <option value="rating-low">Lowest rating</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
            aria-label="Filter by rating"
          >
            <option value="all">All stars</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((review) => (
          <article key={review.id} className="rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Rating value={review.rating} />
              {review.verifiedPurchase && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amazon-orange dark:bg-white/10">
                  Verified Purchase
                </span>
              )}
            </div>
            <h4 className="mt-2 font-bold">{review.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{review.comment}</p>
            <p className="mt-3 text-xs font-bold text-slate-500">{review.name}</p>
            <button
              type="button"
              onClick={() => setVotes((v) => ({ ...v, [review.id]: (v[review.id] ?? 0) + 1 }))}
              className="mt-3 inline-flex items-center gap-1 text-xs text-slate-600 hover:text-amazon-teal"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({(review.helpfulVotes ?? 0) + (votes[review.id] ?? 0)})
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
