// src/routes/admin.ts

import { Router } from "express";

export const adminRouter = Router();

/**
 * Admin root → Dashboard
 */
adminRouter.get("/", (_req, res) => {
  res.redirect("/admin/dashboard");
});

adminRouter.get("/dashboard", (_req, res) => {
  res.render("pages/admin/dashboard", {
    title: "Admin Dashboard",
  });
});

adminRouter.get("/login", (_req, res) => {
  res.render("pages/admin/login", {
    title: "Login / Signup",
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
