// src/routes/auth.ts

import { Router } from "express";
import { validate } from "../validation/validate";
import { signupSchema } from "../validation/auth.schema";
import { authController } from "../controllers/auth.controller";
import { authRateLimiter } from "../middleware/rateLimiter";

export const authRouter = Router();

/**
 * POST /auth/signup
 * - Creates a new user in Supabase Auth
 * - Email does not need to be a real inbox
 * - Password must be strong (demo constraint)
 */
authRouter.post(
  "/signup",
  authRateLimiter,
  validate({ body: signupSchema }),
  authController.signup
);
