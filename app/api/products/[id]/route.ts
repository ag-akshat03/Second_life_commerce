import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getProductById } from "@/lib/products";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true } } }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.warn("PRODUCT_DB_FALLBACK", error);
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);
  }
}
