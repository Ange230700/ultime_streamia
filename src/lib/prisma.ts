// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` to preserve across module reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma || new PrismaClient({ log: ["query", "error"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
