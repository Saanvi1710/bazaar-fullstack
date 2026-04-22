# Bazaar — Full-Stack E-Commerce App

A Docker-based e-commerce application built with **Next.js 16**, **Express.js**, and **PostgreSQL**.

---

## Project Structure

```
bazaar/
├── backend/                 ← NEW: Express.js API server
│   ├── src/
│   │   ├── index.js         ← App entry point
│   │   ├── db.js            ← PostgreSQL connection + table init
│   │   ├── seed.js          ← Seeds categories & products
│   │   ├── middleware/
│   │   │   └── auth.js      ← JWT middleware
│   │   └── routes/
│   │       ├── health.js    ← GET /api/health
│   │       ├── auth.js      ← POST /api/auth/login|signup, GET /api/auth/me
│   │       ├── products.js  ← GET /api/products, /api/products/:id, /:id/related
│   │       ├── categories.js← GET /api/categories
│   │       └── cart.js      ← GET/POST/PUT/DELETE /api/cart (auth required)
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── app/                     ← Next.js pages (frontend)
│   ├── login/page.tsx       ← UPDATED: calls real auth API
│   └── signup/page.tsx      ← UPDATED: calls real auth API
│
├── lib/
│   ├── api.ts               ← NEW: central API client (fetch wrapper)
│   ├── mock-data.ts         ← UPDATED: fetch functions call backend
│   └── store-context.tsx    ← UPDATED: auth persists JWT, cart syncs with backend
│
├── docker-compose.yml       ← UPDATED: frontend + backend + PostgreSQL
├── .env.example             ← UPDATED: all env vars in one place
└── Dockerfile               ← unchanged (frontend)
```

---

## Quick Start (Docker Compose)

### 1. Set up environment variables

```bash
cp .env.example .env
```

> **Important:** Edit `.env` and set a strong `JWT_SECRET` before running in any shared environment.

### 2. Start the full stack

```bash
docker compose up --build
```

Docker Compose will:
1. Start **PostgreSQL** and wait until it's healthy
2. Start the **Express backend** — it creates the tables automatically on first run
3. Run the **seed job** once to populate categories and products
4. Start the **Next.js frontend**

### 3. Open the app

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:3001      |
| API docs | see endpoints below        |

---

## Running Locally (without Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL to your local Postgres instance
npm install
node src/seed.js      # seed the database once
npm run dev           # starts with nodemon on port 3001
```

### Frontend

```bash
# In the project root
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL=http://localhost:3001/api
pnpm install
pnpm dev              # starts on port 3000
```

---

## API Endpoints

### Auth
| Method | Path                | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | /api/auth/signup    | —    | Create account       |
| POST   | /api/auth/login     | —    | Login, returns JWT   |
| GET    | /api/auth/me        | ✅   | Get current user     |

**Request body for signup:** `{ name, email, password }`  
**Request body for login:** `{ email, password }`  
**Response:** `{ user: { id, name, email }, token }`

### Products
| Method | Path                        | Auth | Description                      |
|--------|-----------------------------|------|----------------------------------|
| GET    | /api/products               | —    | List all products                |
| GET    | /api/products?category=X    | —    | Filter by category               |
| GET    | /api/products?search=query  | —    | Search by name/description       |
| GET    | /api/products/:id           | —    | Get single product               |
| GET    | /api/products/:id/related   | —    | Get related products (same cat.) |

### Categories
| Method | Path             | Auth | Description        |
|--------|------------------|------|--------------------|
| GET    | /api/categories  | —    | List all categories|

### Cart
All cart routes require a `Authorization: Bearer <token>` header.

| Method | Path              | Description                    |
|--------|-------------------|--------------------------------|
| GET    | /api/cart         | Get current user's cart        |
| POST   | /api/cart         | Add item `{ productId, quantity }` |
| PUT    | /api/cart/:id     | Update quantity `{ quantity }` |
| DELETE | /api/cart/:id     | Remove item                    |
| DELETE | /api/cart         | Clear entire cart              |

### Health
| Method | Path         | Description             |
|--------|--------------|-------------------------|
| GET    | /api/health  | Check server + DB status|

---

## What Changed in the Frontend

| File | Change |
|------|--------|
| `lib/api.ts` | **New.** Central fetch wrapper with auth token management |
| `lib/mock-data.ts` | `fetchProducts`, `fetchProduct`, `fetchRelatedProducts` now call the backend instead of filtering a local array |
| `lib/store-context.tsx` | `useAuth().login()` now accepts a JWT and stores it; `useAuth().logout()` clears the token; cart syncs with backend when logged in; session is restored on page refresh |
| `app/login/page.tsx` | Calls `authApi.login()` instead of simulating a delay |
| `app/signup/page.tsx` | Calls `authApi.signup()` instead of simulating a delay |

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Frontend port |
| `API_PORT` | `3001` | Backend port |
| `DB_USER` | `postgres` | Postgres username |
| `DB_PASSWORD` | `postgres` | Postgres password |
| `DB_NAME` | `bazaar` | Database name |
| `JWT_SECRET` | *(must set)* | Secret for signing JWTs |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Backend URL (visible to browser) |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL (used by backend for CORS) |
