// src/openapi/schemas/pagination.schema.ts

import { OpenAPIV3 } from "openapi-types";

export const PaginationMetaSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    page: { type: "integer" },
    limit: { type: "integer" },
    total: { type: "integer" },
  },
  required: ["page", "limit", "total"],
};
