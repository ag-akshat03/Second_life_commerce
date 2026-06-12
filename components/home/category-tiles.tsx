import { ArrowRight, Cpu, Dumbbell, Home, Laptop, Palette, Shirt, ShoppingBasket, Smartphone, Sparkles, WashingMachine } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";

const categoryIcons = {
  Mobiles: Smartphone,
  Electronics: Laptop,
  Fashion: Shirt,
  "Home & Kitchen": Home,
  Beauty: Sparkles,
  Books: Palette,
  Grocery: ShoppingBasket,
  Appliances: WashingMachine,
  Toys: Cpu,
  Sports: Dumbbell
};

export function CategoryTiles({ categories }: { categories: string[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-5">
      <SectionHeading title="Shop by category" subtitle="Fast paths into the aisles Indian shoppers browse most." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] ?? Sparkles;

          return (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="group flex min-h-28 flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amazon-orange hover:shadow-soft dark:border-white/10 dark:bg-slate-900"
            >
              <Icon className="h-7 w-7 text-amazon-teal" />
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-950 dark:text-white">{category}</span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amazon-orange" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
