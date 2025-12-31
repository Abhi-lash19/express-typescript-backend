// src/routes/internal.ts

import { Router, Request, Response } from "express";
import { apiMeta } from "../internal/apiMeta";

export const internalRouter = Router();

/**
 * Internal metadata APIs
 * Read-only, no business logic
 */
internalRouter.get("/meta/apis", (req: Request, res: Response) => {
  res.status(200).json({ apis: apiMeta });
});
