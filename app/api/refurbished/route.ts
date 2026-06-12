/**
 * GET /api/refurbished
 * Fetch available refurbished/resale items from ResaleListing + DigitalInventoryItem
 * Returns merged list with trust badges and PHC data
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    // Try fetching from DB
    let resaleListings: any[] = [];
    let digitalItems: any[] = [];

    try {
      resaleListings = await prisma.resaleListing.findMany({
        where: { status: "LISTED" },
        include: { product: true, seller: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } catch {
      // DB might not be connected — use demo data
    }

    try {
      digitalItems = await prisma.digitalInventoryItem.findMany({
        where: { status: "AVAILABLE" },
        include: { product: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } catch {
      // DB might not be connected — use demo data
    }

    // Map DB results to display format
    const dbItems = [
      ...resaleListings.map((l: any) => ({
        id: l.id,
        type: "resale" as const,
        title: l.product?.title || "Resale Item",
        image: l.product?.images?.[0] || "/placeholder.png",
        originalPrice: l.originalPrice,
        listingPrice: l.listingPrice,
        conditionTier: l.conditionTier,
        cosmeticScore: l.cosmeticScore,
        verified: l.invoiceVerified,
        sellerName: l.seller?.name || "Verified Seller",
        carbonSavings: getCarbonSavings(l.product?.category),
      })),
      ...digitalItems.map((d: any) => ({
        id: d.id,
        type: "digital_inventory" as const,
        title: d.product?.title || "Like New Item",
        image: d.product?.images?.[0] || "/placeholder.png",
        originalPrice: d.product?.price || 0,
        listingPrice: d.product?.price ? Math.round(d.product.price * 0.92) : 0,
        conditionTier: "LIKE_NEW",
        cosmeticScore: d.cosmeticScore,
        verified: true,
        sellerName: "Amazon Digital Inventory",
        carbonSavings: getCarbonSavings(d.product?.category),
      })),
    ];

    // If no DB data, return demo items from the product catalog
    if (dbItems.length === 0) {
      const demoItems = products.slice(0, 8).map((p, i) => ({
        id: `demo-refurb-${i}`,
        type: i % 3 === 0 ? "digital_inventory" : "resale" as any,
        title: p.title,
        image: p.images[0],
        originalPrice: p.mrp,
        listingPrice: Math.round(p.price * 0.75),
        conditionTier: i % 4 === 0 ? "LIKE_NEW" : i % 4 === 1 ? "GOOD" : "ACCEPTABLE",
        cosmeticScore: 95 - i * 5,
        verified: true,
        sellerName: i % 3 === 0 ? "Amazon Digital Inventory" : "Verified Seller",
        carbonSavings: getCarbonSavings(p.category),
      }));
      return NextResponse.json({ items: demoItems, source: "demo" });
    }

    return NextResponse.json({ items: dbItems, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getCarbonSavings(category?: string): number {
  const map: Record<string, number> = {
    laptops: 331, electronics: 60, monitors: 225,
    apparel: 6, footwear: 20, smartphones: 66,
  };
  if (!category) return 50;
  const lower = category.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return 50;
}
