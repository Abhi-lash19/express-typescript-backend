// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";

const API_KEY = "mysecretkey";

export function auth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const apiKey = req.header("x-api-key");

  if (!apiKey || apiKey !== API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
}
