// src/routes/admin.ts
import { Router } from "express";
export const adminRouter = Router();

/**
 * Admin root → redirect to home
 */
adminRouter.get("/", (_req, res) => {
  res.redirect("/");
});

/**
 * Admin Home (HLD + LLD embedded)
 */
adminRouter.get("/home", (_req, res) => {
  res.render("pages/admin/home", {
    title: "Home",
  });
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
