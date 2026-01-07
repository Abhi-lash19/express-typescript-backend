// src/middleware/supabaseAuth.ts

import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { AppError } from "../errors/AppError";
import { createSupabaseUserClient } from "../config/supabaseUser";

/**
 * Supabase Authentication Middleware
 *
 * Contract:
 * - Expects Supabase-issued JWT in Authorization header
 * - Stateless (no sessions)
 * - Attaches:
 *   - req.user (identity)
 *   - req.supabase (user-scoped client for RLS)
 *
 * Failure always results in 401
 */

export async function supabaseAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Missing or invalid authorization token", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AppError("Unauthorized", 401);
  }

  req.user = {
    id: data.user.id,
    email: data.user.email ?? undefined,
  };
  //user-scoped Supabase client for RLS
  req.supabase = createSupabaseUserClient(token);

  next();
}
