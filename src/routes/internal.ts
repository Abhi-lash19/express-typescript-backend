// src/routes/internal.ts

import { Router, Request, Response } from "express";
import { apiMeta } from "../internal/apiMeta";

export const internalRouter = Router();

/**
 * Internal metadata APIs
 * Read-only, no business logic
 */

internalRouter.get("/meta/apis", (_req: Request, res: Response) => {
  res.status(200).json({ apis: apiMeta });
});

/**
 * System metrics for admin UI
 */
internalRouter.get("/meta/system", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    security: "JWT + Supabase RLS",
    timestamp: new Date().toISOString(),
  });
});
