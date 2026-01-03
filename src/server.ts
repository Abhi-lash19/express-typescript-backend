// src/server.ts

if (process.env.NODE_ENV !== "production") {
  // Improves stack traces in dev only
  require("source-map-support/register");
}

import 'dotenv/config';

if (process.env.NODE_ENV !== "production") {
  require("source-map-support/register");
}

import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middleware/requestLogger";
import { globalRateLimiter } from "./middleware/rateLimiter";
import { internalRouter } from "./routes/internal";
import { adminRouter } from "./routes/admin";
import { taskRouter } from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./errors/AppError";

const app = express();

/**
 * ------------------------
 * Global Middleware
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

// Global rate limiting
app.use(globalRateLimiter);

// Structured request logging
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ------------------------
 * View Engine & Static Files
 * ------------------------
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

/**
 * ------------------------
 * Routes
 * ------------------------
 */
app.get("/", (req, res) => {
  res.render("index", { text1: "Hello from EJS!" });
});

/**
 * Public API (Versioned)
 */
app.use("/api/v1/tasks", taskRouter);

/**
 * Legacy API (Backward compatibility)
 * NOTE: Can be deprecated later
 */
app.use("/tasks", taskRouter);

app.use("/internal", internalRouter);
app.use("/admin", adminRouter);

/**
 * ------------------------
 * HEALTH CHECK
 * ------------------------
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * ------------------------
 * Error Handling (LAST)
 * ------------------------
 */
app.use((req, res, next) => {
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
