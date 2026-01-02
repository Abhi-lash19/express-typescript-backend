// src/middleware/rateLimiter.ts

import rateLimit from "express-rate-limit";

/**
 * Global rate limiter
 * Protects against abuse & accidental flooding
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

/**
 * Stricter limiter for write operations
 */
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many write requests, slow down.",
  },
});
