// src\app\api\users\login\route.ts

import { serialize } from "cookie";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const userId = user.user_id.toString();
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ sub: userId }, JWT_SECRET as string, {
    expiresIn: "7d",
  });

  // Set refresh token as HttpOnly cookie
  const res = NextResponse.json({
    token: accessToken,
    user: {
      user_id: Number(user.user_id),
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    },
  });

  res.headers.set(
    "Set-Cookie",
    serialize("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }),
  );

  return res;
}
