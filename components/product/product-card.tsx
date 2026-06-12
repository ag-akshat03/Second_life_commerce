"use client";

import { motion } from "framer-motion";
import { BarChart2, Eye, Heart, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useCompareStore } from "@/components/providers/compare-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { estimateDeliveryDate } from "@/lib/delivery";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
  sponsored?: boolean;
};

export function ProductCard({ product, compact = false, sponsored = false }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const addCompare = useCompareStore((s) => s.add);
  const [adding, setAdding] = useState(false);

  const savings = product.mrp - product.price;
  const inStock = product.stock > 0;
  const deliveryDate = estimateDeliveryDate(undefined, product.isPrime);

  function addToCart() {
    setAdding(true);
    addItem(product, 1);
    toast.success("Added to cart", { description: product.title });
    setTimeout(() => setAdding(false), 400);
  }

  function buyNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex h-full flex-col overflow-hidden rounded border border-slate-200 bg-white p-3 shadow-card transition hover:shadow-cardHover dark:border-white/10 dark:bg-slate-900"
    >
      {(sponsored || product.isSponsored) && (
        <span className="absolute right-2 top-2 z-10 text-[10px] text-slate-500">Sponsored</span>
      )}

      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded bg-slate-50">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-contain p-2 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-0 top-0 flex flex-col gap-1 p-1">
          {product.discount > 0 && <Badge tone="deal">{product.discount}% off</Badge>}
          {product.isPrime && <Badge tone="prime">prime</Badge>}
          {product.isFlashDeal && <Badge tone="deal">⚡ Deal</Badge>}
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className={cn(
            "rounded-full bg-white/95 p-1.5 shadow-sm dark:bg-slate-900",
            isWishlisted && "text-red-500"
          )}
          aria-label="Wishlist"
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const ok = addCompare(product);
            toast[ok ? "success" : "error"](ok ? "Added to compare" : "Compare list full (max 4)");
          }}
          className="rounded-full bg-white/95 p-1.5 shadow-sm dark:bg-slate-900"
          aria-label="Compare"
        >
          <BarChart2 className="h-4 w-4" />
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="rounded-full bg-white/95 p-1.5 shadow-sm dark:bg-slate-900"
          aria-label="Quick view"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-xs text-slate-500">{product.brand}</p>
        <Link
          href={`/products/${product.slug}`}
          className="amazon-link mt-0.5 line-clamp-2 text-sm leading-snug text-slate-900 dark:text-white"
        >
          {product.title}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} className="mt-1.5" />

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg text-slate-950 dark:text-white">{formatPrice(product.price)}</span>
            <span className="text-xs text-slate-500 line-through">{formatPrice(product.mrp)}</span>
          </div>
          {savings > 0 && (
            <p className="text-xs text-amazon-red">Save {formatPrice(savings)}</p>
          )}
          <p className={cn("mt-1 text-xs", inStock ? "text-amazon-green" : "text-amazon-red")}>
            {inStock ? `FREE delivery ${deliveryDate}` : "Currently unavailable"}
          </p>
        </div>

        {!compact && (
          <div className="mt-auto space-y-2 pt-3">
            <Button onClick={addToCart} className="w-full" size="sm" disabled={!inStock || adding}>
              <motion.span animate={adding ? { scale: [1, 1.2, 1] } : {}} className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </motion.span>
            </Button>
            <Button variant="secondary" onClick={buyNow} className="w-full" size="sm" disabled={!inStock}>
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
