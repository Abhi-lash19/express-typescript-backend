// src/types/express.d.ts

import "express";
import { SupabaseClient } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
      supabase?: SupabaseClient;
    }
  }
}

export {};
