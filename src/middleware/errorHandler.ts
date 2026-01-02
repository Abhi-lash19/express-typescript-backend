// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

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
