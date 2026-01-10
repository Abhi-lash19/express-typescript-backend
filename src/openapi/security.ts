// src/openapi/security.ts

import { OpenAPIV3_1 } from "openapi-types";

export const securitySchemes: OpenAPIV3_1.ComponentsObject["securitySchemes"] = {
  BearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "JWT Authorization header using the Bearer scheme",
  },
};

