// src/app/api/users/register/route.ts

import bcrypt from "bcrypt";
import { withValidation } from "@/lib/withValidation";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/utils/apiResponse";
import { registerSchema, RegisterInput } from "@/schemas/userSchemas";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

async function handleRegister(request: Request, data: RegisterInput) {
  const { username, email, password } = data;

  // 1) Prevent duplicate emails
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return error("Email is already in use", 400);
  }

  // 2) Decide on an avatar_id for new users
  //    (your schema requires avatar_id non-null)
  const defaultAvatar = await prisma.avatar.findFirst();
  if (!defaultAvatar) {
    return error("No default avatar available", 500);
  }

  // 3) Hash & create
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      avatar_id: defaultAvatar.avatar_id,
    },
  });

  // 4) Return the new user (without password!)
  const payload = {
    user_id: Number(user.user_id),
    username: user.username,
    email: user.email,
    is_admin: user.is_admin,
    // no token here—you’ll log in separately
  };

  return success(payload, 201);
}

// Wrap with Zod validation
export const POST = withValidation(registerSchema, handleRegister);
