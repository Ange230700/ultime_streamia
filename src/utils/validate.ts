// src/utils/validate.ts
import { ZodSchema } from "zod";
import { success, error } from "@/utils/apiResponse";

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      response: error("Validation failed", 400, result.error.flatten()),
    };
  }
  return success(result.data, 200);
}
