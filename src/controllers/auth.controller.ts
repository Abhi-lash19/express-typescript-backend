// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { AppError } from "../errors/AppError";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new AppError(error.message, 400);
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        userId: data.user?.id,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /auth/token
   * - Authenticates user with email + password
   * - Returns Supabase access token (JWT)
   */
  async token(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("Email and password are required", 400);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        throw new AppError("Invalid email or password", 401);
      }

      res.status(200).json({
        success: true,
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
