import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const payload = productSchema.parse(await request.json());
  const product = await prisma.product.create({ data: payload });

  return NextResponse.json({ product }, { status: 201 });
}
