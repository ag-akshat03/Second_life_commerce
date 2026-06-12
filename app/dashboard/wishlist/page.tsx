"use client";

import { ProductCard } from "@/components/product/product-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import Link from "next/link";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <DashboardShell title="Your Wishlist">
      {items.length === 0 ? (
        <div className="amazon-card text-center">
          <p className="text-slate-600">Your wishlist is empty.</p>
          <Link href="/search" className="amazon-btn-primary mt-4 inline-flex">
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
