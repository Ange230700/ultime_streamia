// src\app\api\users\me\route.ts

import { success, error } from "@/utils/apiResponse";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

// GET /api/users/me
export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.split(" ")[1];
  if (!auth) return error("Unauthorized", 401);
  try {
    const payload = jwt.verify(auth, JWT_SECRET as string) as { sub: string };
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(payload.sub) },
    });
    return success(user, 200);
  } catch (e) {
    return error(`Invalid token: ${e}`, 401);
  }
}
