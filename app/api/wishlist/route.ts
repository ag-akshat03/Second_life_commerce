import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in to save wishlist items." }, { status: 401 });
  }

  const { productId } = await request.json();
  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      productId
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
  await prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId
      }
    }
  });

  return NextResponse.json({ ok: true });
}
