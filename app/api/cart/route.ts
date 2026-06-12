import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in to sync your cart." }, { status: 401 });
  }

  const payload = cartItemSchema.parse(await request.json());
  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: payload.productId
      }
    },
    update: { quantity: payload.quantity },
    create: {
      userId: session.user.id,
      productId: payload.productId,
      quantity: payload.quantity
    },
    include: { product: true }
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { productId } = await request.json();

  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId
      }
    }
  });

  return NextResponse.json({ ok: true });
}
