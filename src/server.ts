// src/server.ts

if (process.env.NODE_ENV !== "production") {
  // Improves stack traces in dev only
  require("source-map-support/register");
}

import express from "express";
import path from "path";
import cors from "cors";
import { requestLogger } from "./middleware/requestLogger";
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
app.use(cors());

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

app.use("/tasks", taskRouter);
app.use("/internal", internalRouter);
app.use("/admin", adminRouter);

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
  console.log(`✅ Express running on port ${PORT}`);
});

