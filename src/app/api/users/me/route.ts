// src\app\api\users\me\route.ts

import { success, error } from "@/utils/apiResponse";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

// GET /api/users/me
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return error("Unauthorized", 401);
  }

  try {
    // 1) Verify and extract user ID
    const { sub } = jwt.verify(token, JWT_SECRET as string) as { sub: string };

    // 2) Fetch user *and* their avatar blob
    const dbUser = await prisma.user.findUnique({
      where: { user_id: BigInt(sub) },
      include: { avatar: true },
    });
    if (!dbUser) {
      return error("User not found", 404);
    }

    // 3) Convert avatar image_data -> data URI if present
    let avatarUrl: string | undefined;
    if (dbUser.avatar.image_data) {
      const b64 = Buffer.from(dbUser.avatar.image_data).toString("base64");
      // adjust MIME if you know it's e.g. PNG
      avatarUrl = `data:image/jpeg;base64,${b64}`;
    }

    // 4) Shape to your UserContext interface
    const user = {
      user_id: Number(dbUser.user_id),
      username: dbUser.username,
      email: dbUser.email,
      is_admin: dbUser.is_admin,
      avatarUrl, // newly added
    };

    return success(user, 200);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return error(`Invalid token: ${msg}`, 401);
  }
}
