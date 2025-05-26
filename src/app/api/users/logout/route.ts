// src\app\api\users\logout\route.ts

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { success } from "@/utils/apiResponse";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST() {
  const token = (await cookies()).get("refresh_token")?.value;
  if (token) {
    try {
      const { jti } = jwt.verify(token, process.env.JWT_SECRET!) as {
        jti: string;
      };
      await prisma.refresh_token.delete({ where: { token_id: jti } });
    } catch {}
  }

  // 1) lock everything
  await prisma.video.updateMany({
    data: { is_available: false },
  });

  // 2) unlock “half” again — here: videos whose `video_id % 2 === 0`
  //    (MySQL supports modulo on BIGINTs)
  await prisma.$executeRaw`
    UPDATE video
      SET is_available = true
    WHERE MOD(video_id, 2) = 0
  `;

  const res = success({ message: "Logged out" }, 200);

  res.headers.set(
    "Set-Cookie",
    serialize("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Delete cookie
    }),
  );

  return res;
}
