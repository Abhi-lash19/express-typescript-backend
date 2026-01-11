// src/middleware/rateLimiter.ts

import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Safe for Render free tier
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

/**
 * Authentication rate limiter
 * Prevents brute-force & abuse
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
});
