---
name: Zoophilist project setup
description: Key architectural facts about the Zoophilist monorepo needed across sessions
---

## Stack
- pnpm workspace monorepo: `artifacts/zoophilist` (React+Vite), `artifacts/api-server` (Express 5), `lib/db` (Drizzle+PG), `lib/api-zod` (Zod schemas), `lib/api-client-react` (TanStack Query hooks), `lib/api-spec` (OpenAPI)
- Database: Replit-provisioned PostgreSQL via `DATABASE_URL` env var (always exists, no setup needed)
- Auth: admin Bearer token stored in `localStorage` as `adminToken`; `requireAdmin` middleware in `artifacts/api-server/src/routes/admin.ts`

## OpenAPI codegen pipeline
Run `pnpm --filter @workspace/api-spec run codegen` to regenerate both `lib/api-zod/src/generated/` and `lib/api-client-react/src/generated/` from `lib/api-spec/openapi.yaml`. Always update the YAML spec first, then regenerate — never hand-edit generated files permanently.

**Why:** The orval config generates two targets simultaneously; editing generated files directly is lost on next codegen run.

## DB schema push
`pnpm --filter @workspace/db run push` (or `push-force` to skip confirmation). Run after any schema change in `lib/db/src/schema/`.

## Booking ID format
`ZOO-YYYY-XXXXXX` (e.g. `ZOO-2026-000001`). Generated in `artifacts/api-server/src/routes/bookings.ts` by counting existing rows + 1 then zero-padding to 6 digits. Stored in `bookingId` column (unique, nullable for legacy rows).

## Settings persistence
Settings are stored in a `settings` table (key-value). The `businessSettings` proxy in `settings.ts` reads from an in-memory cache that is lazily loaded from DB on first request. Env vars always override at read time. Run `push-force` after any settings schema change.
