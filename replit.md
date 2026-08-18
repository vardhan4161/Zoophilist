# Zoophilist

A premium pet grooming & services booking platform for India-based doorstep grooming.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + shadcn/ui + Framer Motion (`artifacts/zoophilist`)
- **Backend**: Express 5 API server (`artifacts/api-server`)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **Shared libs**: `lib/api-client-react`, `lib/api-zod`, `lib/db`
- **Package manager**: pnpm workspace monorepo

## Running the project

Both services start automatically via configured workflows:

- **Frontend** (`artifacts/zoophilist: web`): `pnpm --filter @workspace/zoophilist run dev`
- **API server** (`artifacts/api-server: API Server`): `pnpm --filter @workspace/api-server run dev`

## Environment

- `DATABASE_URL` — provisioned automatically by Replit (PostgreSQL)
- `SESSION_SECRET` — set as a Replit secret

## Database

Schema is in `lib/db/src/schema/`. To push schema changes:

```bash
pnpm --filter @workspace/db run push
```

## Services & Pricing

| Service       | Price   |
|---------------|---------|
| Spa Bath      | ₹899    |
| Hair Cut      | ₹1,199  |
| Grooming      | ₹1,599  |
| Medical Bath  | ₹1,699  |
| Subscription  | ₹3,899  |

Business contact: zoophilistpetservice@gmail.com | +91 9515247704

## User Preferences

_None recorded yet._
