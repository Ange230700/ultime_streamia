// src\schemas\userSchemas.ts

import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;
