// src/routes/admin.ts

import { Router } from "express";

export const adminRouter = Router();

/**
 * ------------------------
 * Admin UI Pages (Read-only)
 * ------------------------
 * These routes only render EJS views.
 * No business logic should live here.
 */

adminRouter.get("/dashboard", (_req, res) => {
  res.render("pages/admin/dashboard", {
    title: "Admin Dashboard",
  });
});

adminRouter.get("/playground", (_req, res) => {
  res.render("pages/admin/playground", {
    title: "API Playground",
  });
});

adminRouter.get("/docs", (_req, res) => {
  res.render("pages/admin/docs", {
    title: "API Documentation",
  });
});
