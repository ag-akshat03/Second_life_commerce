"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

export function InfiniteProductGrid({ products, batchSize = 8 }: { products: Product[]; batchSize?: number }) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const hasMore = visibleCount < products.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + batchSize, products.length));
        }
      },
      { rootMargin: "360px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [batchSize, hasMore, products.length]);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [batchSize, products]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5" aria-label="Loading more products">
          {Array.from({ length: Math.min(batchSize, products.length - visibleCount) }).map((_, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-5 h-10 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
