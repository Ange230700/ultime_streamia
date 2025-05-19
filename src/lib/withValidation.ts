// src/lib/withValidation.ts

import { ZodSchema } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";

type Handler<T> = (request: NextRequest, data: T) => Promise<NextResponse>;

export function withValidation<T>(schema: ZodSchema<T>, handler: Handler<T>) {
  return async function (request: NextRequest) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error("Invalid JSON", 400);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      return error("Validation failed", 400, result.error.flatten());
    }

    return handler(request, result.data);
  };
}
