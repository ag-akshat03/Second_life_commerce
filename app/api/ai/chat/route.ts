import { NextResponse } from "next/server";

import { products } from "@/lib/data";

type ChatMessage = { role: "user" | "assistant"; content: string };

const FAQ: Record<string, string> = {
  prime: "Prime members get FREE fast delivery, exclusive deals, and early access to sales on Amazon.in.",
  return: "Most products are eligible for return within 7-30 days depending on category. Go to Your Orders to start a return.",
  delivery: "Standard delivery is 3-5 business days. Prime members often get next-day or 2-day delivery in major cities.",
  payment: "We support cards, UPI, net banking, EMI, and wallets. Stripe/Razorpay/PayPal integrations are ready in checkout.",
  track: "Open Your Orders from the account menu to see live shipment tracking and delivery timeline."
};

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: ChatMessage[] };
  const last = body.messages?.filter((m) => m.role === "user").pop()?.content.toLowerCase() ?? "";

  if (last.includes("track") || last.includes("order")) {
    return NextResponse.json({
      reply: FAQ.track,
      suggestions: ["View my orders", "Cancel an order"]
    });
  }

  if (last.includes("prime")) {
    return NextResponse.json({ reply: FAQ.prime, suggestions: ["Join Prime", "Prime exclusive deals"] });
  }

  if (last.includes("return") || last.includes("refund")) {
    return NextResponse.json({ reply: FAQ.return, suggestions: ["Start a return"] });
  }

  if (last.includes("compare")) {
    const names = products.slice(0, 3).map((p) => `• ${p.brand} ${p.title.split(",")[0]} — ${p.price}`);
    return NextResponse.json({
      reply: `Here are popular picks to compare:\n${names.join("\n")}\nUse the compare button on any product card.`,
      suggestions: ["Best phones under ₹30k", "Top laptops"]
    });
  }

  const matched = products
    .filter(
      (p) =>
        last.includes(p.brand.toLowerCase()) ||
        last.includes(p.category.toLowerCase()) ||
        p.tags.some((t) => last.includes(t.toLowerCase()))
    )
    .slice(0, 3);

  if (matched.length > 0) {
    const list = matched.map((p) => `• ${p.title} — ${p.price} (${p.rating}★)`).join("\n");
    return NextResponse.json({
      reply: `I found these products for you:\n${list}`,
      products: matched,
      suggestions: ["Add to cart", "Show more like this"]
    });
  }

  const trending = products
    .filter((p) => p.isFeatured)
    .slice(0, 3)
    .map((p) => p.title)
    .join(", ");

  return NextResponse.json({
    reply: `I can help with product recommendations, order tracking, Prime benefits, and comparisons. Try asking about: ${trending}`,
    suggestions: ["Today's deals", "Track my order", "What is Prime?"]
  });
}
