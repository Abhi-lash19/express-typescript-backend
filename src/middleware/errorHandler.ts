// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import pino from "pino";

const logger = pino();

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const error =
    err instanceof AppError
      ? err
      : new AppError("Internal Server Error", 500, false);

  // 🔴 Centralized error logging (Phase 3)
  logger.error(
    {
      err,
      path: req.originalUrl,
      method: req.method,
      statusCode: error.statusCode,
    },
    error.message
  );

  // API clients
  if (req.accepts("json")) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  // Server-rendered pages (EJS)
  return res.status(error.statusCode).render("error", {
    message: error.message,
    statusCode: error.statusCode,
  });
}
