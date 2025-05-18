// src/app/api/auth/refresh/route.ts
import { success, error } from "@/utils/apiResponse";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken) {
    return error("Missing refresh token", 401);
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      sub: string;
      jti: string;
    };

    const stored = await prisma.refresh_token.findUnique({
      where: { token_id: payload.jti },
    });
    if (!stored || new Date() > stored.expires_at) {
      return error("Refresh token invalid", 403);
    }

    const newAccessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );

    return success({ token: newAccessToken }, 200);
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return error("Invalid refresh token", 403);
  }
}
