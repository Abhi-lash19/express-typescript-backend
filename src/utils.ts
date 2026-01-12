// src/utils.ts
import { Response } from "express";

/**
 * Extract safe error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
}

/**
 * Standard success response helper
 */
export function sendSuccess(
  res: Response,
  data: unknown,
  statusCode = 200,
  meta: Record<string, unknown> = {}
) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
}

/**
 * Standard error response helper
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
    },
  });
}
