```md
# express-typescript-backend

A **production-oriented backend system** built using **Express.js and TypeScript**, focused on **secure API design**, **authentication**, **authorization**, and **clean architectural layering**.

The goal of this project is to demonstrate how a real backend service can be structured with **clarity**, **safety**, and **maintainability** as first-class concerns.

---

## ✨ Project Overview

This backend provides:

- JWT-based authentication
- User-scoped data access
- Clear separation of responsibilities
- Defensive error handling
- A server-rendered Admin UI for system interaction and documentation

The system mirrors patterns commonly used in real-world backend services rather than minimal examples.

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

````

Each layer has a **single responsibility** and communicates only with adjacent layers.

---

## 🎯 System Goals

- Stateless authentication using JWTs
- Secure, ownership-based access control
- Predictable request → response flow
- Clear boundaries between infrastructure and business logic
- Easy-to-extend architecture without rewriting core logic

---

## 🔐 Authentication Model

- Authentication is handled using **Supabase Auth**
- Supabase issues JWTs after signup/login
- Tokens are sent with each request using:

```http
Authorization: Bearer <JWT>
````

### Key Properties

* No server-side sessions
* No user identity fabrication on the backend
* All requests are authenticated per-call
* Authorization decisions are deterministic and stateless

---

## 🔒 Authorization & Ownership Model

The system enforces **ownership-based access control**.

### Read Access

Authenticated users can:

* List tasks
* Fetch a task by ID

### Write Access

Users can only:

* Create tasks for themselves
* Update their own tasks
* Delete their own tasks

### Enforcement Layers

Ownership is enforced at **three independent layers**:

1. **Service Layer** — explicit ownership checks
2. **Repository Layer** — queries scoped by `user_id`
3. **Database Layer** — Supabase Row Level Security (RLS)

This layered approach ensures that even if one layer fails, others still protect the system.

---

## ⚠️ Error Handling Philosophy

The API uses **defensive error semantics**:

| Status | Meaning                         |
| -----: | ------------------------------- |
|    400 | Invalid request                 |
|    401 | Authentication failed           |
|    404 | Resource not found or not owned |
|    500 | Internal server error           |

Ownership information is **never leaked** through error messages.

---

## 🧭 Admin UI (Server-Rendered)

The project includes a lightweight **server-rendered Admin UI** that provides:

* **Home**

  * System overview
  * Health checks
* **API Playground**

  * Interactive JWT-based API testing
* **Docs**

  * Architecture explanation
  * Design decisions

Authentication is handled via a **modal-based flow**, keeping the UI simple and dependency-free.

---

## 🧪 Demo Assumptions

To keep the system focused and safe:

* Email addresses do not need to be real
* No password reset or email verification
* Forgetting credentials results in a new isolated user
* No cross-user data access is possible

These are intentional tradeoffs, not missing features.

---

## 🚫 Intentionally Excluded Features

The following are deliberately excluded to maintain architectural focus:

* Email verification
* Password reset flows
* Social authentication
* Admin user management

These can be added later without changing the core design.

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

### Frontend (Admin UI)

* **Server-Side Rendering (EJS)**
* **Pico CSS**
* **Vanilla JavaScript**

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

Each directory reflects a **clear responsibility boundary**.

---

## 📘 What I Learned Building This Project

* How to design **layered backend architecture** that scales cleanly
* How to combine **JWT authentication** with **database-level security**
* Why authorization should be enforced at multiple layers
* How to avoid leaking sensitive information through errors
* How to build a minimal Admin UI without introducing frontend complexity
* How to keep backend systems readable and predictable over time

---

## 🚀 Getting Started (Local)

```bash
npm install
npm run build
npm run dev
```

The server runs at:

```
http://localhost:3000
```

---

