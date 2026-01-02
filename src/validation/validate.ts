// src/validation/validate.ts

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../errors/AppError";

type ValidationSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body) as any;
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new AppError(err.issues[0]?.message || "Invalid request", 400);
      }

      throw new AppError("Invalid request", 400);
    }
  };
}
