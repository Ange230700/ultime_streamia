// src/utils/validate.ts
import { ZodSchema } from "zod";
import { NextResponse } from "next/server";

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 },
      ),
    };
  }
  return { success: true, data: result.data };
}
