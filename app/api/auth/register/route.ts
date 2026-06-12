import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account already exists for this email." }, { status: 409 });
    }

    const password = await bcrypt.hash(payload.password, 12);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ message: "Unable to create account." }, { status: 400 });
  }
}
