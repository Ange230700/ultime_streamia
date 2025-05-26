// src\app\api\users\logout-all\route.ts

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { success } from "@/utils/apiResponse";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST() {
  const token = (await cookies()).get("refresh_token")?.value;
  if (!token) return success({ message: "No session" }, 200);

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };
    await prisma.refresh_token.deleteMany({ where: { user_id: BigInt(sub) } });
  } catch {}

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

  const res = success({ message: "Logged out from all devices" }, 200);
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
