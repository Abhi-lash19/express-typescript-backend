// src/routes/admin.ts
import { Router } from "express";

export const adminRouter = Router();

/**
 * Admin root → redirect to home
 * (Home is now the single landing page)
 */
adminRouter.get("/", (_req, res) => {
  res.redirect("/");
});

/**
 * API Playground
 */
adminRouter.get("/playground", (_req, res) => {
  res.render("pages/admin/playground", {
    title: "API Playground",
  });
});

/**
 * Swagger / OpenAPI Docs
 */
adminRouter.get("/docs", (_req, res) => {
  res.render("pages/admin/docs", {
    title: "API Documentation",
  });
});
