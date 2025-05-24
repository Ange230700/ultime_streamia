// src\app\api\users\login\route.ts

import { serialize } from "cookie";
import { success, error } from "@/utils/apiResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { withValidation } from "@/lib/withValidation";
import { loginSchema, LoginInput } from "@/schemas/userSchemas";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

/**
 * Handler for user login. Assumes data has been validated by withValidation.
 */
async function handleLogin(request: Request, data: LoginInput) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return error("Invalid credentials", 401);
  }

  const userId = user.user_id.toString();
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET as string, {
    expiresIn: "15m",
  });

  const refreshTokenId = crypto.randomUUID();
  const refreshToken = jwt.sign(
    { sub: userId, jti: refreshTokenId },
    JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  // Store refresh token in DB
  await prisma.refresh_token.create({
    data: {
      token_id: refreshTokenId,
      user_id: user.user_id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // after you fetch `user` from the DB
  let avatarUrl: string | undefined;
  if (user.avatar_id) {
    const av = await prisma.avatar.findUnique({
      where: { avatar_id: user.avatar_id },
    });
    if (av?.image_data) {
      avatarUrl = `data:image/jpeg;base64,${Buffer.from(av.image_data).toString("base64")}`;
    }
  }

  // Prepare response with access token and user info
  const res = success(
    {
      token: accessToken,
      user: {
        user_id: Number(user.user_id),
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        avatarUrl,
      },
    },
    200,
  );

  // Set refresh token as a secure, HttpOnly cookie
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

// Export POST handler wrapped with validation
export const POST = withValidation(loginSchema, handleLogin);
