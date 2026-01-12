
---

# express-typescript-backend

A **production-oriented backend system** built with **TypeScript** and **Express.js**, designed to demonstrate **secure API design**, **stateless authentication**, **ownership-based authorization**, and **clean architectural layering**.

This project prioritizes **clarity**, **safety**, and **maintainability** over minimalism, mirroring patterns used in real-world backend services rather than toy examples.

---

## ✨ Overview

This backend provides:

* JWT-based authentication
* Ownership-scoped data access
* Clear separation of responsibilities
* Defensive, non-leaky error handling
* A lightweight **server-rendered Admin UI** for interaction and documentation

The architecture is intentionally explicit and layered, making the system easy to reason about, extend, and audit.

---

## 🏗️ High-Level Architecture

```
Client / Admin UI
        ↓
   Express Routes
        ↓
  Middleware Layer
        ↓
     Controllers
        ↓
 Services (Business Logic)
        ↓
Repositories (DB Access)
        ↓
 Supabase (Postgres + RLS)
```

Each layer has a **single responsibility** and communicates **only with adjacent layers**, ensuring:

* Predictable request → response flow
* Strong separation of concerns
* Long-term maintainability
* Safe refactoring without cascading changes

---

## 🎯 System Goals

* Stateless authentication using JWTs
* Secure, ownership-based authorization
* Deterministic and testable business logic
* Clear boundaries between infrastructure and domain logic
* Easy extensibility without rewriting core components

---

## 🔐 Authentication Model

Authentication is handled using **Supabase Auth**.

* Users authenticate via Supabase (signup / login)
* Supabase issues a signed JWT
* The token is sent with every request:

```http
Authorization: Bearer <JWT>
```

### Key Properties

* No server-side sessions
* No backend-generated user identities
* Every request is authenticated independently
* Authorization decisions are fully stateless and deterministic

---

## 🔒 Authorization & Ownership Model

The system enforces **ownership-based access control**.

### Read Access

Authenticated users may:

* List their tasks
* Fetch a task by ID (only if owned)

### Write Access

Users may only:

* Create tasks for themselves
* Update their own tasks
* Delete their own tasks

### Defense-in-Depth Enforcement

Ownership is enforced at **three independent layers**:

1. **Service Layer**
   Explicit ownership checks before mutations

2. **Repository Layer**
   All queries scoped by `user_id`

3. **Database Layer**
   **PostgreSQL Row Level Security (RLS)** enforced by Supabase

Even if one layer is misconfigured, the remaining layers continue to protect user data.

---

## ⚠️ Error Handling Philosophy

The API follows **defensive error semantics**:

| Status | Meaning                         |
| -----: | ------------------------------- |
|    400 | Invalid request                 |
|    401 | Authentication failed           |
|    404 | Resource not found or not owned |
|    500 | Internal server error           |

**Ownership information is never leaked**.
A user cannot distinguish between “not found” and “not owned.”

This prevents user enumeration and data inference attacks.

---

## 🧭 Admin UI (Server-Rendered)

The project includes a minimal **server-rendered Admin UI** used for exploration and documentation.

### Features

* **Home**

  * System overview
  * Health checks
* **API Playground**

  * Interactive JWT-based API testing
* **Docs**

  * Architecture explanation
  * Design rationale and tradeoffs

Authentication is handled via a **modal-based flow**, keeping the UI:

* Dependency-free
* Easy to audit
* Simple to maintain

---

## 🧪 Demo Assumptions

To keep the system focused and safe, the following assumptions are intentional:

* Email addresses do not need to be real
* No email verification or password reset flows
* Forgotten credentials result in a new isolated user
* No cross-user data access is possible

These are **conscious tradeoffs**, not missing features.

---

## 🚫 Intentionally Excluded Features

The following are deliberately excluded to preserve architectural clarity:

* Email verification
* Password reset flows
* Social authentication
* Admin user management

All of these can be added later **without changing the core design**.

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**

### Authentication & Database

* **Supabase Auth**
* **PostgreSQL**
* **Row Level Security (RLS)**

### Admin UI

* Server-Side Rendering (**EJS**)
* **Pico CSS**
* Vanilla JavaScript

---

## 📂 Project Structure

```
src/
├── routes/          # HTTP route definitions
├── middleware/      # Auth, validation, guards
├── controllers/     # Request/response orchestration
├── services/        # Business logic
├── repositories/    # Database access logic
├── lib/             # Shared utilities
└── app.ts           # Application entry point

views/
├── layout/          # Base layout
├── partials/        # Shared UI components
└── pages/           # Admin UI pages

public/
└── js/              # Client-side helpers
```

Each directory represents a **clear responsibility boundary**, making the codebase easy to navigate and reason about.

---

## 📘 What I Learned Building This Project

* How to design **layered backend architectures** that scale cleanly
* How to combine **JWT authentication** with **database-level security**
* Why authorization should be enforced at multiple layers
* How to avoid leaking sensitive information through error handling
* How to build a minimal Admin UI without frontend complexity
* How to keep backend systems readable and predictable over time

---

## 🚀 Getting Started (Local Development)

```bash
npm install
npm run build
npm run dev
```

The server will be available at:

```
http://localhost:3000
```

---
