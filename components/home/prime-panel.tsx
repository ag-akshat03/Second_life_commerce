import { ShieldCheck, Sparkles, Truck, WalletCards } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Tomorrow delivery",
    copy: "Prime-style fulfilment cues across the buying journey."
  },
  {
    icon: WalletCards,
    title: "Stripe checkout",
    copy: "Secure card payments with order metadata and webhook updates."
  },
  {
    icon: ShieldCheck,
    title: "Protected orders",
    copy: "Order states, payment status, and admin visibility."
  },
  {
    icon: Sparkles,
    title: "Premium browsing",
    copy: "Animated carousel, filters, wishlist, and dark mode."
  }
];

export function PrimePanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-5">
      <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-white/10 dark:bg-slate-900 lg:grid-cols-[1fr_1.4fr]">
        <div className="bg-amazon-navy p-6 text-white sm:p-8">
          <p className="mb-3 text-sm font-black uppercase text-amazon-gold">Prime inspired</p>
          <h2 className="text-3xl font-black tracking-normal">A polished marketplace stack, not just a storefront mockup.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-200">
            The experience includes cart persistence, auth-aware routes, admin management, seed data, Prisma models, and Stripe-ready checkout.
          </p>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="border-b border-slate-200 p-6 sm:[&:nth-child(3)]:border-b-0 last:border-b-0 sm:odd:border-r dark:border-white/10">
              <item.icon className="h-7 w-7 text-amazon-teal" />
              <h3 className="mt-4 font-bold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
