# Backend API

A RESTful backend built with **Node.js**, **Express**, and **Prisma**, following clean architecture principles.

## Architecture

```
backend/
├── controller/       ← HTTP layer, routes only
├── db/               ← connection to db
├── usecases/         ← business logic per action
├── repository/       ← all database access
├── domain/           ← business rules and validation
├── middleware/       ← authentication, role checks
├── prisma/           ← schema and migrations
└── index.js
```

## Prerequisites

- Node.js v18+
- A PostgreSQL database

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

1. Create a `.env` file in the root:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

1. Run migrations and generate Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

1. Start the development server:

```bash
npm run dev
```

## Database

To create a new migration after changing the schema:

```bash
npx prisma migrate dev --name <migration_name>
```

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login and receive a JWT token |

### Admins

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/admins` | Superadmin | Create a new admin |
| PUT | `/admins/:id` | Superadmin | Update an admin's password |
| DELETE | `/admins/:id` | Superadmin | Delete an admin |

## Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```
