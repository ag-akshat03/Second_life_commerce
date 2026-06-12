"use client";

import Image from "next/image";
import Link from "next/link";

import { useCompareStore } from "@/components/providers/compare-store";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  if (items.length === 0) {
    return (
      <div className="amazon-section py-16 text-center">
        <h1 className="text-2xl font-bold">Compare products</h1>
        <p className="mt-2 text-slate-600">Add up to 4 products from any product card.</p>
        <Link href="/search" className="amazon-btn-primary mt-6 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  const rows = [
    { label: "Price", get: (p: (typeof items)[0]) => formatPrice(p.price) },
    { label: "M.R.P.", get: (p: (typeof items)[0]) => formatPrice(p.mrp) },
    { label: "Discount", get: (p: (typeof items)[0]) => `${p.discount}%` },
    { label: "Rating", get: (p: (typeof items)[0]) => `${p.rating} ★` },
    { label: "Reviews", get: (p: (typeof items)[0]) => String(p.reviewCount) },
    { label: "Prime", get: (p: (typeof items)[0]) => (p.isPrime ? "Yes" : "No") },
    { label: "Stock", get: (p: (typeof items)[0]) => (p.stock > 0 ? "In stock" : "Out of stock") }
  ];

  return (
    <div className="amazon-section py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare ({items.length}/4)</h1>
        <button type="button" onClick={clear} className="text-sm text-amazon-teal hover:underline">
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left" />
              {items.map((product) => (
                <th key={product.id} className="amazon-card p-3 align-top">
                  <button type="button" onClick={() => remove(product.id)} className="float-right text-xs text-slate-400 hover:text-red-500">
                    Remove
                  </button>
                  <div className="relative mx-auto mt-4 h-24 w-24">
                    <Image src={product.images[0]} alt="" fill className="object-contain" sizes="96px" />
                  </div>
                  <Link href={`/products/${product.slug}`} className="amazon-link mt-2 line-clamp-2 block text-xs">
                    {product.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-slate-200 dark:border-white/10">
                <td className="p-3 font-bold">{row.label}</td>
                {items.map((product) => (
                  <td key={product.id} className="p-3 text-center">
                    {row.get(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
