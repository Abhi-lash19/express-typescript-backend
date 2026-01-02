// src/middleware/requestLogger.ts

import pinoHttp from "pino-http";

export const requestLogger = pinoHttp({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: ["req.headers.authorization", "req.headers.x-api-key"],
    remove: true,
  },
});
