// src/routes/admin.ts

import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

adminRouter.get("/docs", (req, res) => {
  res.render("admin/docs");
});

adminRouter.get("/playground", (req, res) => {
  res.render("admin/playground");
});
