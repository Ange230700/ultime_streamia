// src\utils\unwrapApi.ts

import type { ApiResponse } from "@/types/api-response";

export function unwrapApi<T>(response: ApiResponse<T>): T {
  if (response.success) return response.data;
  throw new Error(response.error);
}
