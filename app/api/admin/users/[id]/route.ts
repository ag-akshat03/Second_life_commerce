import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleSchema = z.object({
  role: z.enum(["USER", "ADMIN"])
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await context.params;
  const payload = roleSchema.parse(await request.json());
  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: { id: true, name: true, email: true, role: true }
  });

  return NextResponse.json({ user });
}
