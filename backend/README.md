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
├── public/           ← media assets(pictures)
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
npx prisma db seed  # ←  get default data

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

For resetting db

```bash
# reset db
npx prisma migrate reset  # wipes DB, runs migrations, then auto-runs seed
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

### Office

| Method | Endpoint  | Access | Description              |
| ------ | --------- | ------ | ------------------------ |
| GET    | `/office` | Public | Get office data (seeded) |
| PUT    | `/office` | Public(to be updated) | Update office attributes |

### Program

| Method | Endpoint  | Access | Description              |
| ------ | --------- | ------ | ------------------------ |
| GET    | `/programs` | Public | Get program names (seeded) |

## Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## Static Files (Pictures/logos)

All uploaded files are served from:
Base URL:
<http://localhost:3001>

Frontend usage:
<img src={`http://localhost:3001${data.logo}`} />
