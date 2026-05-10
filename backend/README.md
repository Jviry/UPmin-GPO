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
| GET | `/admins` | Superadmin | Get all admin |

### Office

| Method | Endpoint  | Access | Description              |
| ------ | --------- | ------ | ------------------------ |
| GET    | `/office` | Public | Get office data (seeded) |
| PATCH    | `/office` | Admin/Superadmin | Patch Organizational Chart |

### Announcement

| Method | Endpoint  | Access | Description              |
| ------ | --------- | ------ | ------------------------ |
| GET    | `/announcements` | Public | Get all announcements (seeded) |
| GET    | `/announcements/:id` | Public | Get announcement by id (seeded) |
| POST   | `/announcements` | Admin/Superadmin | Create a new announcement |
| PUT    | `/announcements/:id` | Admin/Superadmin | Update announcement attributes |
| DELETE | `/announcement/:id` | Admin/Superadmin | Delete an announcement |

### Scholarship

| Method | Endpoint                 | Access           | Description                     |
| ------ | ------------------------ | ---------------- | ------------------------------- |
| GET    | `/scholarships`          | Public           | Get all available scholarships  |
| GET    | `/scholarships/:id`      | Public           | Get scholarship by its id       |
| POST   | `/scholarships`          | Admin/Superadmin | Create new scholarship          |
| DELETE | `/scholarships/:id`      | Admin/Superadmin | Delete existing scholarship     |
| PUT    | `/scholarships/:id`      | Admin/Superadmin | Edit scholarship info           |

### Program

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/programs` | Public | Get all programs |
| GET | `/programs/:id` | Public | Get program by ID with course pools, study plans, program application, and faculty |
| POST | `/programs` | Admin/Superadmin | Create new program |
| PUT | `/programs/:id` | Admin/Superadmin | Edit program info |
| DELETE | `/programs/:id` | Admin/Superadmin | Delete program |
| PUT | `/programs/:id/faculty` | Admin/Superadmin | Sync faculty under a program |

### Study Plans

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/programs/:program_id/study-plan` | Public | Get all study plans by program |
| POST | `/programs/:program_id/study-plan` | Admin/Superadmin | Create study plan under a program |
| DELETE | `/programs/:program_id/study-plan/:id` | Admin/Superadmin | Delete study plan by ID |
| PUT | `/programs/:program_id/study-plan/:id/entries` | Admin/Superadmin | Sync courses in a study plan |

### Course Pools

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/programs/:program_id/course-pool` | Public | Get all course pools by program |
| POST | `/programs/:program_id/course-pool` | Admin/Superadmin | Create course pool under a program |
| DELETE | `/programs/:program_id/course-pool/:id` | Admin/Superadmin | Delete course pool by ID |
| PUT | `/programs/:program_id/course-pool/:id/entries` | Admin/Superadmin | Sync courses in a pool |

### Courses

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/courses?type=core` | Public | Get courses filtered by type |
| POST | `/courses` | Admin/Superadmin | Create new course |
| DELETE | `/courses/:id` | Admin/Superadmin | Delete course by ID |

### Faculty

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/faculty` | Public | Get all faculty with credentials |
| GET | `/faculty?position=` | Public | Get faculty filtered by position |
| POST | `/faculty` | Admin/Superadmin | Create faculty with credentials |
| PUT | `/faculty/:id` | Admin/Superadmin | Update faculty and credentials |
| DELETE | `/faculty/:id` | Admin/Superadmin | Delete faculty by ID |
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
