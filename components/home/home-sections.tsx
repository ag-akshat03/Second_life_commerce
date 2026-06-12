import Link from "next/link";

import { DealShelf } from "@/components/home/deal-shelf";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/lib/data";
import { getFeaturedProducts } from "@/lib/products";
import type { Product } from "@/types";

function sliceProducts(filter: (p: Product) => boolean, limit = 5) {
  return products.filter(filter).slice(0, limit);
}

export function TodaysDeals() {
  const deals = sliceProducts((p) => p.discount >= 10, 10);
  return (
    <ProductShowcase
      title="Today's Deals"
      subtitle="Limited-time offers refreshed throughout the day."
      products={deals}
      href="/search?deal=today"
    />
  );
}

export function LightningDeals() {
  const deals = sliceProducts((p) => p.discount >= 20, 6);
  return <DealShelf products={deals} title="Lightning Deals" />;
}

export function TrendingProducts() {
  const trending = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  return (
    <ProductShowcase title="Trending now" subtitle="What Indian shoppers are buying this week." products={trending} href="/search?sort=popular" />
  );
}

export function BestSellers() {
  const best = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  return <ProductShowcase title="Best Sellers" subtitle="Top-rated products across categories." products={best} href="/search?sort=rating" />;
}

export function NewArrivals() {
  const newest = products.slice(-5).reverse();
  return <ProductShowcase title="New Arrivals" subtitle="Fresh launches and latest additions." products={newest} href="/search?sort=newest" />;
}

export function RecommendedForYou() {
  const featured = getFeaturedProducts().slice(0, 5);
  return (
    <ProductShowcase
      title="Recommended for you"
      subtitle="Personalized picks based on browsing patterns."
      products={featured}
      href="/search"
    />
  );
}

export function PrimeExclusiveDeals() {
  const prime = sliceProducts((p) => p.isPrime && p.discount > 0, 5);
  return (
    <section className="amazon-section">
      <SectionHeading title="Prime Exclusive Deals" href="/prime" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {prime.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function SponsoredProducts() {
  const sponsored = sliceProducts((p) => p.isFeatured, 4);
  return (
    <section className="amazon-section">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Sponsored products</h2>
        <span className="text-xs text-slate-500">Ad</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sponsored.map((product) => (
          <ProductCard key={product.id} product={product} sponsored />
        ))}
      </div>
    </section>
  );
}

export function SeasonalOffers() {
  return (
    <section className="amazon-section">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Great Indian Festival", href: "/search?deal=flash", color: "from-orange-600 to-red-600" },
          { title: "Electronics Upgrade", href: "/search?category=Electronics", color: "from-blue-700 to-indigo-800" },
          { title: "Home & Kitchen", href: "/search?category=Home%20%26%20Kitchen", color: "from-emerald-700 to-teal-800" }
        ].map((offer) => (
          <Link
            key={offer.title}
            href={offer.href}
            className={`rounded-lg bg-gradient-to-br ${offer.color} p-6 text-white shadow-card transition hover:shadow-cardHover`}
          >
            <p className="text-xs font-bold uppercase opacity-90">Seasonal</p>
            <h3 className="mt-2 text-2xl font-bold">{offer.title}</h3>
            <p className="mt-2 text-sm opacity-90">Shop now →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContinueShopping() {
  const picks = products.slice(0, 4);
  return (
    <ProductShowcase title="Continue shopping" subtitle="Pick up where you left off." products={picks} href="/search" />
  );
}
