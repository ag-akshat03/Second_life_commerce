import { CategoryTiles } from "@/components/home/category-tiles";
import { ContinueShoppingClient } from "@/components/home/continue-shopping";
import { HeroCarousel } from "@/components/home/hero-carousel";
import {
  BestSellers,
  LightningDeals,
  NewArrivals,
  PrimeExclusiveDeals,
  RecommendedForYou,
  SeasonalOffers,
  SponsoredProducts,
  TodaysDeals,
  TrendingProducts
} from "@/components/home/home-sections";
import { PrimePanel } from "@/components/home/prime-panel";
import { RecentlyViewedHome } from "@/components/home/recently-viewed-home";
import { categories, products } from "@/lib/data";
import { getFeaturedProducts } from "@/lib/products";

import { ProductShowcase } from "@/components/home/product-showcase";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const electronics = products
    .filter((p) => p.category === "Electronics" || p.category === "Mobiles")
    .slice(0, 5);
  const home = products
    .filter((p) => p.category === "Home & Kitchen" || p.category === "Appliances")
    .slice(0, 5);

  return (
    <div className="pb-8">
      <HeroCarousel />
      <div className="-mt-24 relative z-10 space-y-6">
        <div className="amazon-section">
          <CategoryTiles categories={categories} />
        </div>
        <TodaysDeals />
        <LightningDeals />
        <TrendingProducts />
        <BestSellers />
        <NewArrivals />
        <RecommendedForYou />
        <RecentlyViewedHome />
        <ContinueShoppingClient />
        <ProductShowcase
          title="Featured for Indian shoppers"
          subtitle="Prime badges, discounts, reviews, and quick cart actions."
          products={featured}
          href="/search"
        />
        <PrimePanel />
        <PrimeExclusiveDeals />
        <SponsoredProducts />
        <SeasonalOffers />
        <ProductShowcase
          title="Electronics and mobiles"
          subtitle="Launches, upgrades, audio gear, and essentials."
          products={electronics}
          href="/search?category=Electronics"
        />
        <ProductShowcase
          title="Home, kitchen, and appliances"
          subtitle="Everyday products for modern Indian homes."
          products={home}
          href="/search?category=Home%20%26%20Kitchen"
        />
      </div>
    </div>
  );
}
