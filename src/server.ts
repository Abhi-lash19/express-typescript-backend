// src/server.ts

import 'dotenv/config';

if (process.env.NODE_ENV !== "production") {
  require("source-map-support/register");
}

import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";

import { requestLogger } from "./middleware/requestLogger";
import {
  globalRateLimiter,
  authRateLimiter,
} from "./middleware/rateLimiter";

import { internalRouter } from "./routes/internal";
import { adminRouter } from "./routes/admin";
import { taskRouter } from "./routes/tasks";
import { authRouter } from "./routes/auth";

import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./errors/AppError";
import { buildOpenApiSpec } from "./openapi";

const app = express();

/**
 * ------------------------
 * Render / Proxy Settings
 * ------------------------
 * REQUIRED for correct IP detection behind Render proxy
 */
app.set("trust proxy", 1);

/**
 * ------------------------
 * GLOBAL CONTRACT NOTES
 * ------------------------
 *
 * - Authentication is JWT-based and stateless
 * - All API routes assume Supabase-issued tokens
 * - Ownership is enforced downstream (service + RLS)
 * - OpenAPI will later reflect these guarantees
 */

/**
 * ------------------------
 * Core Middleware
 * ------------------------
 */

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // required for EJS inline scripts
  })
);

// Controlled CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server & REST clients
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
      ];

      if (process.env.NODE_ENV === "production") {
        allowedOrigins.push("https://express-typescript-backend.onrender.com");
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Structured request logging (safe after proxy trust)
app.use(requestLogger);

/**
 * ------------------------
 * Views & Static Assets
 * ------------------------
 * NEVER rate-limited
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.locals.env = process.env.NODE_ENV || "development";
  next();
});

/**
 * ------------------------
 * ROUTES
 * ------------------------
 */

/**
 * Health Check
 * - Used by Render
 * - MUST NOT be rate-limited
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * HOME = ADMIN DASHBOARD
 * - No rate limiting (SSR page)
 */
app.get("/", (_req, res) => {
  res.redirect("/admin/dashboard");
});

/**
 * Authentication Routes
 * - STRICT rate limiting
 */
app.use("/auth", authRateLimiter, authRouter);

/**
 * APIs
 * - MODERATE rate limiting
 */
app.use("/api/v1/tasks", globalRateLimiter, taskRouter);
app.use("/tasks", globalRateLimiter, taskRouter);

/**
 * Admin & Internal
 * - NO rate limiting
 */
app.use("/admin", adminRouter);
app.use("/internal", internalRouter);

/**
 * OpenAPI
 */
app.get("/openapi.json", (_req, res) => {
  res.json(buildOpenApiSpec());
});

/**
 * ------------------------
 * Error Handling
 * ------------------------
 */
app.use((req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

/**
 * ------------------------
 * Server Start
 * ------------------------
 */
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express running on port ${PORT}`);
});
