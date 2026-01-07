# express-typescript-backend

A production-ready backend built using **Express.js + TypeScript**, designed to
demonstrate secure REST API architecture, authentication, authorization,
and clean layering.

This project is intentionally built to be **reviewer-friendly**, **interview-ready**,
and **security-first**.

---

## 🎯 System Goals

- JWT-based authentication using **Supabase Auth**
- User-scoped data access enforced via **Row Level Security (RLS)**
- Clean separation of concerns (middleware → controller → service → repository)
- Built-in admin UI for:
  - system inspection
  - API exploration
  - documentation

---

## 🔐 Authentication Model

- Authentication uses **Supabase-issued JWTs**
- Tokens are passed via:

## Authorization: Bearer <JWT>

- Authentication is **stateless**
- No server-side sessions
- Backend never fabricates user identities

JWT validation flow:

## JWT → Supabase Auth → user.id → RLS → database access


---

## 👀 Read vs ✏️ Write Access Model

This system intentionally separates **read access** from **write access**.

### Read Access
- Any **authenticated user** can:
  - list tasks
  - fetch any task by ID

### Write Access
- Users can **only**:
  - create tasks for themselves
  - update their own tasks
  - delete their own tasks

Ownership is enforced at **three layers**:
1. Service-level checks
2. Repository filters (`user_id`)
3. Supabase Row Level Security (final guard)

---

## 🧪 Demo Assumptions (Intentional)

- Email addresses do **not** need to be real inboxes
- Users must remember their credentials to reuse the same workspace
- Forgetting credentials creates a **new isolated user**
- No cross-user access is possible

These tradeoffs are intentional to keep the demo simple and safe.

---

## ⚠️ Error Semantics

| Status | Meaning |
|------|--------|
| 400 | Invalid request |
| 401 | Authentication failed |
| 404 | Resource not found **or not owned** |
| 500 | Internal server error |

Ownership is **not leaked** via error messages.

---

## 🚫 Intentionally Excluded

- Email verification
- Password reset
- Social login
- Admin user management

These are excluded to keep the demo focused.

---

## 📚 Documentation Layers

- **Admin Playground** → live API testing (runtime)
- **OpenAPI (planned)** → formal API contracts
- **Admin Docs Page** → architectural explanation

Each serves a different audience.

