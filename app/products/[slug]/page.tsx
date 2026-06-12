import RecentlyViewed from "@/components/product/RecentlyViewed";
import TrackView from "@/components/product/TrackView";
import { CheckCircle2, RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeliveryChecker } from "@/components/product/delivery-checker";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductTabs } from "@/components/product/product-tabs";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { SizeFlagsBanner } from "@/components/second-life/size-flags-banner";
import { RefurbishedSuggestion } from "@/components/second-life/refurbished-suggestion";
import { products } from "@/lib/data";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1)
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);
  const alsoBought = products.filter((item) => item.id !== product.id).slice(0, 4);
  const similar = products.filter((item) => item.brand === product.brand && item.id !== product.id).slice(0, 4);
  const bundle = [product, ...related.slice(0, 2)];

  return (
    <div className="mx-auto max-w-amazon px-3 py-6 sm:px-4">
      <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        <Link href="/" className="amazon-link">
          Home
        </Link>{" "}
        /{" "}
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="amazon-link">
          {product.category}
        </Link>
      </div>

      <TrackView product={product} />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)_300px]">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="text-sm text-amazon-teal hover:underline">
            <Link href={`/search?q=${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
          </p>
          <h1 className="mt-1 text-2xl font-normal leading-snug text-slate-950 dark:text-white lg:text-[28px]">
            {product.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} />
            {product.rating >= 4.3 && <Badge tone="success">Amazon&apos;s Choice</Badge>}
          </div>

          <div className="mt-4 border-y border-slate-200 py-4 dark:border-white/10">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl text-slate-950 dark:text-white">{formatPrice(product.price)}</span>
              <span className="text-sm text-slate-500 line-through">M.R.P.: {formatPrice(product.mrp)}</span>
            </div>
            {product.discount > 0 && (
              <p className="mt-1 text-sm text-amazon-red">
                ({product.discount}% off) You save {formatPrice(product.mrp - product.price)}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-600">Inclusive of all taxes. EMI from {formatPrice(Math.ceil(product.price / 12))}/mo</p>
            {product.isPrime && <Badge tone="prime" className="mt-2">prime</Badge>}
          </div>

          <div className="mt-4 lg:hidden">
            <ProductActions product={product} />
          </div>

          {/* Second Life Commerce: SizeFlags predictive fit banner */}
          <SizeFlagsBanner
            productId={product.id}
            brand={product.brand}
            category={product.category}
          />

          {/* Second Life Commerce: Refurbished alternatives suggestion */}
          <RefurbishedSuggestion
            category={product.category}
            currentPrice={product.price}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, label: "FREE delivery" },
              { icon: RotateCcw, label: "Easy returns" },
              { icon: ShieldCheck, label: "Secure payment" }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="amazon-card text-center text-sm">
                <Icon className="mx-auto mb-2 h-5 w-5 text-amazon-teal" />
                {label}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 text-sm text-amazon-teal hover:text-amazon-orange"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <div className="hidden space-y-4 lg:block">
          <ProductActions product={product} />
          <div className="amazon-card text-sm">
            <div className="flex gap-2 text-amazon-green">
              <CheckCircle2 className="h-5 w-5" />
              <strong>{product.stock > 0 ? "In stock" : "Out of stock"}</strong>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Ships from {product.seller ?? "Amazon Fulfilment India"}
            </p>
            <DeliveryChecker isPrime={product.isPrime} />
            {product.warranty && <p className="mt-3 text-xs">Warranty: {product.warranty}</p>}
          </div>
        </div>
      </section>

      <ProductTabs product={product} />

      {bundle.length > 1 && (
        <section className="mt-12">
          <SectionHeading title="Frequently bought together" />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {bundle.map((item, i) => (
              <div key={item.id} className="flex items-center gap-4">
                {i > 0 && <span className="text-2xl text-slate-400">+</span>}
                <Link href={`/products/${item.slug}`} className="amazon-card w-40 text-center text-xs">
                  {item.title.slice(0, 40)}…
                  <p className="mt-2 font-bold">{formatPrice(item.price)}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-12">
          <SectionHeading title="Similar products" href={`/search?q=${encodeURIComponent(product.brand)}`} />
          <ProductGrid products={similar} />
        </section>
      )}

      {alsoBought.length > 0 && (
        <section className="mt-12">
          <SectionHeading title="Customers also bought" href="/search" />
          <ProductGrid products={alsoBought} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeading title="Related products" href={`/search?category=${encodeURIComponent(product.category)}`} />
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed />
    </div>
  );
}
