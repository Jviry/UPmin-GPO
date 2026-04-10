# Backend API

## Setup

Clone the repo
Install dependencies

```bash
npm install
```

Setup environment variables

Create a `.env` file:

DATABASE_URL=your_database_url
JWT_SECRET=our_secret

Setup Database migration

```bash
npx prisma migrate deploy
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev --name <nameOfMigration>
```

Start server

```bash
npm run dev
```
