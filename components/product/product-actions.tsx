"use client";

import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  function addToCart() {
    addItem(product, quantity);
    toast.success("Added to cart", { description: `${quantity} × ${product.title}` });
  }

  return (
    <div className="amazon-card">
      <p className="text-sm text-slate-600">Quantity</p>
      <div className="mt-2 inline-flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="px-3" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-10 text-center font-bold">{quantity}</span>
        <button type="button" onClick={() => setQuantity((v) => Math.min(20, v + 1))} className="px-3" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        <Button onClick={addToCart} disabled={product.stock <= 0}>
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </Button>
        <Link
          href="/checkout"
          onClick={() => addItem(product, quantity)}
          className="amazon-btn-primary flex h-11 items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          {isWishlisted ? "In wishlist" : "Add to wishlist"}
        </Button>
      </div>
    </div>
  );
}
