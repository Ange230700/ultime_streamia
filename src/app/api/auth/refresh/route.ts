// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 401 },
    );
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      sub: string;
    };
    const newAccessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );

    return NextResponse.json({ token: newAccessToken });
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 },
    );
  }
}
