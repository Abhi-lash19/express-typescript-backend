# 📘 High Level Design (HLD)

**Secure Task Management Backend with Supabase Authentication & Admin Console**

---

## 1. 🎯 System Purpose & Scope

This system is a **production-ready backend platform** designed to demonstrate **secure API design, modern authentication, database-level authorization, and developer-friendly tooling**.

### Primary Objectives

- Provide a **secure, user-scoped Tasks REST API**
- Enforce **strong authentication and authorization** using Supabase JWTs
- Guarantee **data isolation** using **Row Level Security (RLS)** at the database layer
- Offer a **developer-focused Admin Console** for:
    - API inspection and testing
    - Security model transparency
    - Interactive documentation (Swagger + Playground)
- Apply **production-grade backend practices**:
    - Rate limiting
    - Input validation
    - Centralized logging
    - Standardized error handling

### Design Intent

The system is intentionally built to be:

- ✅ Secure by default
- ✅ Interview-ready and demo-friendly
- ✅ Easy to reason about and explain
- ✅ Extensible for future features (roles, projects, audit logs, etc.)

---

## 2. 👤 Actors & System Users

### 2.1 End User (API Consumer)

A standard authenticated user interacting with the Tasks API.

**Capabilities**

- Authenticate using Supabase credentials
- Obtain a Supabase-issued JWT
- Perform full CRUD operations on **only their own tasks**
- Use search and pagination features

**Restrictions**

- Cannot read or mutate other users’ data
- Cannot bypass authentication or RLS
- Cannot access admin or internal APIs

---

### 2.2 Admin / Reviewer

A non-privileged user accessing the **Admin Console UI**.

**Capabilities**

- View system health and metadata
- Understand authentication & authorization rules
- Explore APIs via:
    - Swagger UI
    - Custom API Playground

**Restrictions**

- Read-only access
- Cannot mutate user data
- Cannot bypass JWT or RLS rules

---

### 2.3 System / Infrastructure

Automated actors responsible for system stability.

**Responsibilities**

- Health checks
- Monitoring
- CI/CD execution
- Deployment orchestration (Render)

---

## 3. 🏗️ High-Level Architecture

```
Clients (REST / Browser / Admin UI)
        |
        v
-----------------------------
 Express.js Backend Server
-----------------------------
  ├── Global Middleware Layer
  │     ├── Security (Helmet, CORS)
  │     ├── Rate Limiting
  │     ├── Logging (Pino)
  │     ├── Authentication (Supabase JWT)
  │     └── Validation (Zod)
  |
  ├── Routing Layer
  │     ├── Public APIs (/api/v1/*)
  │     ├── Legacy APIs (/tasks)
  │     ├── Internal APIs (/internal/*)
  │     └── Admin UI Routes (/admin/*)
  |
  ├── Controller Layer
  ├── Service Layer
  ├── Repository Layer
  |
  └── Supabase Platform
        ├── PostgreSQL
        ├── Supabase Auth
        └── Row Level Security (RLS)

```

---

## 4. 📜 API Contract & Documentation Strategy (OpenAPI)

The backend exposes a **formal OpenAPI 3.1 specification** that accurately represents **real runtime behavior**.

### Key Principles

- **Single source of truth** for API contracts
- Generated from actual backend definitions
- No mock or hand-written specs
- Always aligned with deployed behavior

### What the OpenAPI Spec Covers

- Authentication endpoints
- Tasks CRUD APIs
- JWT Bearer security scheme
- Request/response schemas
- Validation rules
- Pagination metadata
- Error formats

### Exposed Documentation Endpoints

| Endpoint | Purpose |
| --- | --- |
| `/openapi.json` | Machine-readable OpenAPI spec |
| `/admin/docs` | Swagger UI |

This guarantees:

- API correctness
- Long-term maintainability
- Easy onboarding for reviewers and developers

---

## 5. 🔐 Security Model (Core Design Principle)

Security is enforced **defensively at multiple layers**.

---

### 5.1 Authentication

All user-specific or mutating requests require:

```
Authorization: Bearer <Supabase JWT>

```

### Token Validation Flow

- JWT is extracted from the `Authorization` header
- Token is validated via Supabase Auth:
    
    ```
    supabase.auth.getUser(token)
    
    ```
    
- On success:
    - `req.user` is attached
    - A **user-scoped Supabase client** is injected into the request

---

### 5.2 Token Generation API

To avoid embedding credentials in UI logic, the system provides:

**POST `/auth/token`**

**Responsibilities**

- Accepts email and password
- Authenticates via Supabase Auth
- Returns a Supabase-issued JWT

**Used by**

- Custom API Playground
- Swagger UI
- External REST clients

---

### 5.3 Authorization (Defense in Depth)

Authorization is enforced at **two independent layers**:

### 1. Backend-Level Filtering

Every data query includes:

```
.eq("user_id", authenticatedUserId)

```

### 2. Database-Level Row Level Security (RLS)

- PostgreSQL policies enforce ownership
- Even a compromised backend cannot bypass RLS

---

### 5.4 Core Security Philosophy

> The backend never trusts the client.
> 
> 
> The database never trusts the backend alone.
> 

---

### 5.5 Security Transparency (Developer UX)

The Admin UI explicitly explains:

- JWT requirements
- Data ownership rules
- Why unauthorized access returns `404`
- How RLS protects user data

This ensures developers understand **why requests fail**, not just that they fail.

---

## 6. 🔄 End-to-End Request Flow

### Example: `GET /api/v1/tasks?search=test&page=1`

```
Client
  |
  v
Express Server
  |
  |→ Helmet + CORS
  |→ Global Rate Limiter
  |→ Request Logger
  |→ JSON Body Parser
  |
  |→ Authentication Middleware
  |     - Extract JWT
  |     - Validate via Supabase
  |     - Attach req.user
  |     - Attach scoped Supabase client
  |
  |→ Zod Validation Middleware
  |
  |→ Task Controller
  |
  |→ Task Service
  |     - Apply pagination logic
  |     - Determine search strategy
  |
  |→ Task Repository
  |     - Execute RLS-protected query
  |
  |→ DTO Mapping
  |
  |→ Standardized JSON Response
  |
  v
Client Receives Response

```

---

## 7. 🧩 Layer-by-Layer Responsibilities

### 7.1 Routes

**Responsibility:** Wiring only

**Contains:** No business logic

- `/api/v1/tasks` – primary API
- `/tasks` – legacy alias
- `/internal/*` – system metadata
- `/admin/*` – Admin UI pages

---

### 7.2 Middleware Layer

| Middleware | Responsibility |
| --- | --- |
| Helmet | Security headers |
| CORS | Origin control |
| Rate Limiter | Abuse prevention |
| Logger (Pino) | Structured logging |
| Supabase Auth | JWT validation |
| Zod Validator | Input validation |
| Error Handler | Centralized error handling |

---

### 7.3 Controllers

**Responsibility:** HTTP boundary

- Parse requests
- Call services
- Map results to responses
- Return standardized output

❌ No business logic

❌ No database access

---

### 7.4 Services (Application Layer)

**Responsibility:** Business logic

- Pagination & search rules
- Ownership semantics
- Error translation (`404`, `403`)
- Decision making

This layer represents the **core application behavior**.

---

### 7.5 Repositories

**Responsibility:** Data access only

- Supabase query construction
- RLS-aware execution
- No HTTP knowledge
- No business rules

---

### 7.6 DTOs & Mappers

**Responsibility:** API stability

- Prevents DB schema leakage
- Enables API versioning
- Clean separation of internal vs external models

---

## 8. 📡 User-Facing APIs

### Tasks API (User-Scoped)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks (pagination + search) |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update owned task |
| DELETE | `/tasks/:id` | Delete owned task |

All endpoints require:

- Valid JWT
- Backend ownership check
- Database RLS enforcement

---

## 9. 🧠 Internal & Admin Capabilities

### 9.1 Internal APIs

| Endpoint | Purpose |
| --- | --- |
| `/internal/meta/apis` | API discovery (Playground) |
| `/internal/meta/system` | Health, uptime, env, version |

---

### 9.2 Admin Console

**Purpose:** Inspection, testing, and explanation

**Design:** Read-only by default

| Route | Description |
| --- | --- |
| `/admin/dashboard` | Security & architecture overview |
| `/admin/playground` | Custom API testing tool |
| `/admin/docs` | Swagger UI |

---

## 10. 🧪 Custom API Playground

A purpose-built testing UI designed for demos and interviews.

### Features

- Dynamic endpoint listing
- Path & query parameter editors
- JSON request body editor
- Auto-injected JWT
- Live response viewer
- Execution timing & status codes
- Rate-limit visibility

### Authentication Support

- JWT generation inside Playground
- Token persistence via local storage
- Automatic reuse across requests

---

## 11. 📘 Swagger UI (OpenAPI Explorer)

- Fully interactive documentation
- JWT Bearer auth support
- “Try it out” enabled
- Always synced with backend

Available at: `/admin/docs`

---

## 12. ❗ Error Handling Strategy

- All errors extend `AppError`
- Unknown errors masked as `500`
- Single global error handler
- Dual rendering:
    - JSON for APIs
    - EJS for Admin UI

No stack traces or internals leak to users.

---

## 13. 🚀 Deployment Model

- Platform: Render
- Build Pipeline:
    
    ```
    TypeScript → dist/
    
    ```
    
- Runtime:
    
    ```
    NODE_ENV=production
    
    ```
    
- Secure secret injection
- Health endpoint used for monitoring

---

## 14. 🧭 System Capabilities Summary

### End User

- Secure authentication
- Full control over own tasks
- Pagination & search
- Guaranteed data isolation

### Admin / Reviewer

- Inspect security model
- Test APIs safely
- Understand architecture clearly

### Developer / Interviewer

- Explore formal API contracts
- Validate runtime behavior
- See layered security in action
- Review clean architectural separation

---

## 15. 🚧 HLD Boundary

This High Level Design **intentionally excludes**:

- Low-level class diagrams
- Method-level logic
- SQL or RLS policy definitions
- Performance tuning and indexing

These belong in **Low Level Design (LLD)**.

---