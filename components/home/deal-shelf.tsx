import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function DealShelf({ products, title = "Lightning deals" }: { products: Product[]; title?: string }) {
  return (
    <section className="amazon-section">
      <SectionHeading
        title={title}
        subtitle="High-discount picks with Prime-style delivery promise and clean marketplace cards."
        href="/search?sort=discount"
      />
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {products
          .slice()
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 8)
          .map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product.id}
              className="group w-64 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-soft dark:border-white/10 dark:bg-slate-900"
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image src={product.images[0]} alt={product.title} fill sizes="260px" className="object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <Badge tone="deal">Up to {product.discount}% off</Badge>
                <h3 className="mt-3 line-clamp-2 min-h-11 font-semibold text-slate-950 dark:text-white">{product.title}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-black">{formatPrice(product.price)}</span>
                  <span className="text-sm text-slate-500 line-through">{formatPrice(product.mrp)}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
