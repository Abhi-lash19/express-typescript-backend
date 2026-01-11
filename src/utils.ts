// src/utils.ts
import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import { Response } from "express";

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

/**
 * Markdown renderer for admin documentation (HLD / LLD)
 */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

export function renderMarkdown(relativePath: string): string {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const content = fs.readFileSync(absolutePath, "utf-8");
  return md.render(content);
}
