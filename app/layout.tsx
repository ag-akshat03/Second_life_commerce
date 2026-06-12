import type { Metadata } from "next";
import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AiShoppingAssistant } from "@/components/ai/shopping-assistant";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amazon India Clone | Modern Full-Stack Marketplace",
    template: "%s | Amazon India Clone"
  },
  description:
    "A modern full-stack Amazon India-inspired ecommerce app built with Next.js 15, TypeScript, Tailwind CSS, MongoDB, Prisma, NextAuth, and Stripe.",
  keywords: ["Amazon clone", "Next.js ecommerce", "MongoDB Prisma", "Stripe checkout", "NextAuth"],
  openGraph: {
    title: "Amazon India Clone",
    description: "Portfolio-grade ecommerce marketplace with cart, checkout, dashboard, admin panel, and responsive UI.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <AppProviders>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-1 bg-amazon-page dark:bg-slate-950">{children}</main>
          <Footer />
          <AiShoppingAssistant />
        </AppProviders>
      </body>
    </html>
  );
}
