// src/routes/admin.ts
import { Router } from "express";
import { renderMarkdown } from "../utils";

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
  const hld = renderMarkdown("docs/hld.md");
  const lld = renderMarkdown("docs/lld.md");

  res.render("pages/admin/home", {
    title: "Home",
    hld,
    lld,
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
