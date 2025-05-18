// src\app\api\users\me\route.ts

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

// GET /api/users/me
export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.split(" ")[1];
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = jwt.verify(auth, JWT_SECRET as string) as { sub: string };
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(payload.sub) },
    });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: `Invalid token: ${e}` }, { status: 401 });
  }
}
