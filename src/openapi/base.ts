// src/openapi/base.ts
import { OpenAPIV3_1 } from "openapi-types";

export const baseSpec: OpenAPIV3_1.Document = {
  openapi: "3.1.0",
  info: {
    title: "Tasks API",
    description: "Production-ready Tasks API with JWT auth and ownership rules",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Current environment",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication APIs" },
    { name: "Tasks", description: "Task management APIs" },
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {},
  },
};
