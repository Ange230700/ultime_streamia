// src\app\api\users\route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret";

// GET /api/users/me
export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.split(" ")[1];
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = jwt.verify(auth, JWT_SECRET) as { sub: string };
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(payload.sub) },
    });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: `Invalid token: ${e}` }, { status: 401 });
  }
}

// POST /api/users/login
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ sub: user.user_id.toString() }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return NextResponse.json({
    token,
    user: {
      user_id: Number(user.user_id),
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    },
  });
}
