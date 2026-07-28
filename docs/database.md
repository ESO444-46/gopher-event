# Database

The backend uses PostgreSQL with Prisma. The schema is in `backend/prisma/schema.prisma`.

| Model | Purpose |
| --- | --- |
| `User` | Stores account details, verification status, and organizer status |
| `Otp` | Stores email verification codes and expiry times |
| `Event` | Stores event details and its creator |
| `UserEvent` | Stores event registrations |

## Local setup

Add your PostgreSQL connection string to `backend/.env` as `DATABASE_URL`.

Run migrations after pulling schema changes:

```bash
cd backend
npx prisma migrate dev
```

Generate the Prisma client if needed:

```bash
npx prisma generate
```

## Seed data

The seed script creates sample users, events, and registrations.

```bash
cd backend
npx prisma db seed
```

The seed users are organizers, so they can be used to test event creation. The seeded passwords are placeholder values, not login passwords.
