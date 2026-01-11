# 📕 Low Level Design (LLD)

**Secure Task Management Backend – Implementation Blueprint**

---

## 1. 📦 Module-Level Breakdown (File → Responsibility)

This section defines **file-level ownership**, ensuring every module has a **single, well-defined responsibility**.

---

### 1.1 `server.ts` – Application Bootstrap & Composition Root

**Primary Responsibility**

- Application lifecycle orchestration
- Global middleware ordering
- Route registration
- Error boundary definition
- HTTP server startup

This file acts as the **composition root** of the application.

---

### Middleware Ordering (Intentional & Critical)

```
helmet
→ cors
→ rateLimiter
→ requestLogger
→ body parsers
→ routes
→ 404 handler
→ errorHandler

```

### Why this order matters

| Layer | Guarantee |
| --- | --- |
| Helmet | Security headers applied before any response |
| CORS | Requests blocked early if origin is invalid |
| Rate Limiter | Abuse prevented before business logic |
| Logger | All requests (including failures) are logged |
| Body Parsers | Controllers receive parsed input |
| Routes | Business logic execution |
| 404 Handler | Unknown routes handled explicitly |
| Error Handler | No error escapes unhandled |

This ensures **fail-fast behavior**, **predictable logs**, and **zero unhandled exceptions**.

---

## 2. 🔐 Authentication & Authorization (LLD)

Authentication and authorization are **explicitly decoupled** and implemented using **request-scoped context**.

---

## 2.1 Supabase Client Design

### `config/supabase.ts` – System-Level Supabase Client

**Characteristics**

- Singleton instance
- Stateless (`persistSession: false`)
- Never scoped to a user

**Used Exclusively For**

- JWT verification
- Auth-related operations

**Never used for**

- Data access
- User queries
- Mutations

This prevents accidental privilege escalation.

---

### `config/supabaseUser.ts` – User-Scoped Supabase Client Factory

**Characteristics**

- Factory function (not singleton)
- Creates **request-scoped client**
- Injects JWT into headers

**Purpose**

- Enables PostgreSQL Row Level Security (RLS)
- Ensures DB queries execute **as the authenticated user**

Each request receives its **own isolated Supabase client instance**.

---

## 2.2 `supabaseAuth` Middleware (Critical Path)

**File:** `middleware/supabaseAuth.ts`

This middleware defines the **authentication boundary** for the entire system.

---

### Input

```
Authorization: Bearer <Supabase JWT>

```

---

### Execution Steps

1. Validate presence of `Authorization` header
2. Validate `Bearer <token>` format
3. Verify token using Supabase Auth
4. Extract authenticated user identity
5. Create request-scoped Supabase client
6. Attach context to request
7. Forward request

---

### Output (Mutated Request Object)

```tsx
req.user = {
  id: string,
  email?: string
}

req.supabase = SupabaseClient // user-scoped

```

---

### Failure Modes

| Scenario | HTTP Status |
| --- | --- |
| Missing header | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Expired token | 401 Unauthorized |

No downstream middleware or controller executes on failure.

---

### Authentication Sequence Diagram

```
Client
  |
  | Authorization: Bearer JWT
  v
supabaseAuth
  |
  | supabase.auth.getUser()
  v
Supabase Auth
  |
  | user identity
  v
supabaseAuth
  |
  | attach req.user + req.supabase
  v
Next Middleware / Controller

```

---

## 3. 🧪 Validation Layer (LLD)

Validation is **explicit, schema-driven, and fail-fast**.

---

### 3.1 Zod Schemas

**File:** `schemas/task.schema.ts`

**Responsibilities**

- Define strong input contracts
- Enforce type safety at API boundaries
- Reject invalid inputs early

**Key Constraints**

- IDs treated as strings (parsed later)
- Pagination:
    - `page > 0`
    - `limit ≤ 100`
- Optional search strings trimmed and bounded

---

### 3.2 `validate.ts` – Validation Middleware Factory

**Responsibilities**

- Validate:
    - `req.body`
    - `req.params`
    - `req.query`
- Perform validation independently per section
- Never mutate request data
- Throw `AppError(400)` on validation failure

---

### Validation Flow

```
Request
  |
  |→ validate({ body, params, query })
  |
  | safeParse()
  |   ├─ success → next()
  |   └─ failure → AppError(400)
  |
ErrorHandler

```

This ensures **controllers never receive invalid input**.

---

## 4. 🧭 Routing Layer (LLD)

Routing is responsible for **wiring only**.

---

### 4.1 Task Routes

**File:** `routes/tasks.ts`

**Global Enforcement**

```tsx
taskRouter.use(supabaseAuth)

```

This guarantees:

- Every task route is authenticated
- RLS is always active
- No accidental public exposure

---

### Route → Controller Mapping

| HTTP Method | Route | Controller |
| --- | --- | --- |
| GET | `/tasks` | `taskController.list` |
| GET | `/tasks/:id` | `taskController.getById` |
| POST | `/tasks` | `taskController.create` |
| PUT | `/tasks/:id` | `taskController.update` |
| DELETE | `/tasks/:id` | `taskController.delete` |

---

## 5. 🎮 Controller Layer (LLD)

### 5.1 `task.controller.ts`

**Responsibility**

- Handle HTTP semantics only
- Extract request parameters
- Invoke services
- Format standardized responses

**Explicitly Forbidden**

- Business logic
- Database access
- Authorization rules

---

### Example: `list()` Controller

```tsx
list(req, res) {
  const { search, page, limit } = req.query;

  const result = taskService.getTasks(
    req.supabase,
    req.user.id,
    search,
    page,
    limit
  );

  sendSuccess(res, mappedDTOs, 200, paginationMeta);
}

```

---

### Controller Flow Diagram

```
Client
  |
  | GET /tasks
  v
Controller
  |
  | call service
  v
Service
  |
  | return result
  v
Controller
  |
  | sendSuccess()

```

---

## 6. 🧠 Service Layer (LLD)

### 6.1 `task.service.ts`

This layer represents the **true application logic**.

---

### Responsibilities

- Business rules
- Pagination math
- Ownership semantics
- Error translation
- Repository orchestration

---

### Method Breakdown

### `getTasks()`

- Compute offset
- Select repository strategy:
    - `findAll`
    - `findBySearch`

### `getTaskById()`

- Translate `undefined → 404`

### `createTask()`

- Apply defaults (`completed = false`)

### `updateTask()`

- Full replacement semantics
- Missing row → `404`

### `deleteTask()`

- Boolean result
- `false → 404`

---

### Error Translation Pattern

| Repository Result | Service Action |
| --- | --- |
| `undefined` | Throw `AppError(404)` |
| Success | Return entity |
| DB error | Bubble up |

This cleanly separates **data access** from **HTTP semantics**.

---

## 7. 🗄️ Repository Layer (LLD)

### 7.1 `task.repository.ts`

**Responsibility**

- Pure data access
- Supabase query construction
- No business logic
- No HTTP knowledge

---

### Query Invariant

All queries explicitly enforce:

```sql
WHERE user_id = authenticated_user_id

```

This provides:

- Explicit backend filtering
- Redundant protection with RLS

---

### Repository Methods

| Method | Description |
| --- | --- |
| `findAll` | Pagination + total count |
| `findBySearch` | Case-insensitive title search |
| `findById` | `.single()` fetch |
| `create` | Insert + return |
| `update` | Update + return |
| `delete` | Count-based deletion |

---

### Update Flow Diagram

```
Service
  |
  | updateTask()
  v
Repository
  |
  | UPDATE tasks
  | WHERE id AND user_id
  v
Supabase
  |
  | affected rows
  v
Repository
  |
  | return entity or undefined
  v
Service
  |
  | return or throw 404

```

---

## 8. 📤 DTO & Mapping Layer

### Purpose

- Prevent DB schema leakage
- Enforce stable API contracts
- Enable future API versioning

---

### Mapping

```tsx
TaskEntity → TaskResponseDTO

```

Only mapped DTOs are ever returned to clients.

---

## 9. ⚠️ Error Handling (LLD)

### 9.1 `AppError`

**Characteristics**

- Represents operational errors
- HTTP-status aware
- Safe to expose to clients

---

### 9.2 Global `errorHandler`

**Responsibilities**

- Capture all thrown errors
- Log structured context via Pino
- Normalize error responses
- Choose renderer:
    - JSON → APIs
    - EJS → Admin UI

---

### Error Flow

```
Any Layer
  |
  | throw Error
  v
errorHandler
  |
  | log + normalize
  v
Client Response

```

---

## 10. 🖥️ Admin UI (LLD)

### Architecture

- Server-rendered EJS
- Vanilla JavaScript
- Read-only by design
- Uses internal APIs only

---

### Key Client-Side Modules

| File | Responsibility |
| --- | --- |
| `dashboard.js` | System metrics |
| `admin-dashboard.js` | Auth context |
| `playground.js` | API testing |
| `app.js` | Shared helpers |

---

### API Playground Design

- Fetches `/internal/meta/apis`
- Dynamically renders:
    - Path params
    - Query params
    - Headers
    - Body editor
- Sends real HTTP requests
- JWT auto-injection

Acts as a **controlled Swagger alternative** for demos.

---

## 11. 🧪 Internal APIs (LLD)

### `/internal/meta/apis`

- Returns structured API metadata
- Drives Playground UI
- Reflects live backend behavior

---

### `/internal/meta/system`

- Health status
- Runtime metadata
- Environment
- Security explanation

---

## 12. 🧠 Data Contracts (Explicit)

### Task Table (Derived from Code)

```tsx
tasks {
  id: number
  title: string
  completed: boolean
  user_id: string
}

```

RLS ensures `user_id = auth.uid()`.

---

## 13. 🧭 Cross-Cutting Concerns

| Concern | Implementation |
| --- | --- |
| Security | JWT + RLS |
| Validation | Zod |
| Logging | Pino |
| Rate Limiting | express-rate-limit |
| Errors | Centralized |
| Versioning | `/api/v1` |
| Backward Compatibility | `/tasks` |

---

## 14. 🚦 Edge Cases Covered

- Missing or invalid JWT
- Expired tokens
- Invalid payloads
- Cross-user access attempts
- Missing resources
- Rate-limit abuse
- Unexpected runtime errors

---

## 15. 📌 LLD Boundary

This Low Level Design intentionally excludes:

- SQL & RLS policy definitions
- Indexing strategies
- Performance tuning
- Infrastructure scripts

These belong in **DB Design** and **Ops Documentation**.

---