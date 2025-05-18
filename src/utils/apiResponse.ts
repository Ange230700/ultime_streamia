// src/utils/apiResponse.ts

import { NextResponse } from "next/server";
import type { ErrorResponse, SuccessResponse } from "@/types/api-response";

export function success<T>(data: T, status = 200): NextResponse {
  const body: SuccessResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function error(
  message: string,
  status = 400,
  details?: unknown,
): NextResponse {
  const body: ErrorResponse = { success: false, error: message, details };
  return NextResponse.json(body, { status });
}
