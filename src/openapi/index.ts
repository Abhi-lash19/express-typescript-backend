// src/openapi/index.ts

import { baseSpec } from "./base";
import { securitySchemes } from "./security";
import { authPaths } from "./paths/auth.paths";
import { tasksPaths } from "./paths/tasks.paths";
import { TaskSchema } from "./schemas/task.schema";
import { ErrorSchema } from "./schemas/error.schema";
import { PaginationMetaSchema } from "./schemas/pagination.schema";
import {
  AuthRequestSchema,
  TokenResponseSchema,
} from "./schemas/auth.schema";

export function buildOpenApiSpec() {
  return {
    ...baseSpec,
    components: {
      ...baseSpec.components,
      securitySchemes,
      schemas: {
        Task: TaskSchema,
        Error: ErrorSchema,
        PaginationMeta: PaginationMetaSchema,
        AuthRequest: AuthRequestSchema,
        TokenResponse: TokenResponseSchema,
      },
    },
    paths: {
      ...authPaths,
      ...tasksPaths,
    },
  };
}
