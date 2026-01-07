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
}

export const authController = new AuthController();
