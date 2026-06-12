import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

export function ProductShowcase({
  title,
  subtitle,
  products,
  href
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-5">
      <SectionHeading title={title} subtitle={subtitle} href={href} />
      <ProductGrid products={products} />
    </section>
  );
}
