// src\app\api\users\logout-all\route.ts

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST() {
  const token = (await cookies()).get("refresh_token")?.value;
  if (!token)
    return NextResponse.json({ message: "No session" }, { status: 204 });

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };
    await prisma.refresh_token.deleteMany({ where: { user_id: BigInt(sub) } });
  } catch {}

  const res = NextResponse.json({ message: "Logged out from all devices" });
  res.headers.set(
    "Set-Cookie",
    serialize("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    }),
  );
  return res;
}
