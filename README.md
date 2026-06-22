# College Discovery Platform — Backend Engineer Submission (Track B)

## Features implemented (4 of 6, per brief)
1. **College Listing + Search** — filters (city, state, type, fees range, min rating), sort, pagination.
2. **College Detail Page** — overview, courses, placements (multi-year), reviews.
3. **Compare Colleges** — 2–3 colleges side-by-side (fees, rating, location, latest placement).
4. **Predictor Tool** — exam + rank + category → matching colleges via cutoff data.

Skipped: Q&A/Discussion (lowest backend-architecture signal of the 6), Auth+Saved Items (would
add real value but every hour went into making search/predictor/compare correct and well-modeled
instead of bolting on a 5th shallow feature).

## Architecture

**Stack:** Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL + Zod, deployed on
Vercel + Neon.

**Why Next.js API routes instead of a separate NestJS service:** the brief allows either. A
single deployable keeps this MVP simple to run/grade, and Next's route handlers give the same
REST semantics NestJS controllers would, without the extra DI/module ceremony for ~4 resources.
If this had >15 endpoints or multiple consuming clients, I'd split out a NestJS service.

**Why Prisma + Postgres:** relational data (College → Courses/Placements/Reviews/ExamCutoffs) is
a textbook 1-to-many fit. Prisma gives type-safe queries and migrations without hand-written SQL
or an ORM that fights TypeScript.

### Schema design decisions (see `prisma/schema.prisma`)
- `slug` is the public identifier everywhere (URLs, APIs) instead of leaking the cuid `id` —
  standard practice for SEO-able, human-readable resource paths.
- Money fields are `Int` (whole rupees), not `Float` — avoids floating-point rounding errors when
  comparing/sorting fees, a real bug class in compensation/fee comparison tools.
- `ExamCutoff` is a separate table, not a JSON blob on `College`, because the predictor needs to
  query across colleges by `(examName, category, cutoffRank)` — that only works well as indexed
  relational rows, not as opaque JSON.
- Composite unique constraints (`[collegeId, year]` on Placement, `[collegeId, examName,
  category, year]` on ExamCutoff) prevent duplicate-data bugs at the database level, not just in
  application code.
- Indexes are placed on exactly the columns the APIs filter/sort by (`city`, `state`, `type`,
  `rating`, `feesPerYear`, and the ExamCutoff composite) — added deliberately, not as decoration.

### API design decisions
- Every route is wrapped in `withErrorHandling` (`src/lib/api-utils.ts`) — Zod validation errors
  become `422`s with field-level detail, unknown errors become a generic `500` (no stack trace
  leak), and nothing ever crashes the process. This is the single place that guarantees the
  "reliability under bad input" requirement instead of repeating try/catch per route.
- All query params are validated with Zod (`src/lib/validation.ts`) before touching Prisma —
  garbage `?minFees=-99999999&page=abc` style input is rejected with a clear error, not used to
  build a malformed query or used to scrape the whole table.
- Pagination is clamped server-side (`parsePagination`): `limit` is capped at 50 regardless of
  what's requested, so a client can't force a full-table dump.
- `/api/compare` distinguishes "found nothing" (404) from "found some, missing others"
  (200 + `missingSlugs` in the response meta) — the caller needs to know *which* requested
  college failed to resolve, not just get a shorter array back silently.
- Consistent envelope: `{ success, data, meta? }` / `{ success: false, error, details? }` on
  every endpoint — no endpoint-specific shape guessing for the frontend.

### Edge cases handled
- Unknown college slug → `404`, not a crash (`/api/colleges/[slug]`, detail page).
- Invalid filter values, malformed numbers, out-of-range pagination → `422` with details, never
  a `500`.
- Predictor with no matching colleges → `200` with an empty array + explanatory message, not an
  error (an empty result is a valid, expected outcome, not a failure).
- Seed data includes a college with **zero placements** for the current year — deliberately, to
  prove the detail page and APIs render "No data available" instead of breaking on missing
  relations.
- Duplicate placement/cutoff rows for the same college+year are prevented at the DB level via
  composite unique constraints, not just app-level checks.

### Known tradeoffs (would address with more time)
- No auth yet — "Saved Items" needs it; the predictor/compare/search APIs themselves don't.
- Search uses Postgres `ILIKE` (`contains`, mode `insensitive`) rather than full-text search —
  fine at this seed-data scale (~10s of colleges), would move to Postgres `tsvector` or a search
  service (Meilisearch/Algolia) before this hit thousands of rows with relevance ranking needs.
- Rating is stored as a denormalized field on `College` rather than computed live from `Review`
  averages — intentional for read performance on the listing page, but means a background job or
  trigger is needed to keep it in sync as reviews come in (not implemented here).

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL (Neon/Railway free Postgres)
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## API reference

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/colleges?q=&city=&state=&type=&minFees=&maxFees=&minRating=&sort=&page=&limit=` | Search/list colleges |
| GET | `/api/colleges/[slug]` | Full detail (courses, placements, reviews) |
| GET | `/api/compare?slugs=slug1,slug2,slug3` | Side-by-side comparison (2–3 colleges) |
| GET | `/api/predictor?examName=&rank=&category=` | Rank-based college recommendations |

## Deployment
- DB: Neon (free Postgres, serverless-friendly, pairs well with Vercel).
- App: Vercel (`vercel.json` not needed — default Next.js detection works out of the box). Set
  `DATABASE_URL` in Vercel project env vars, then run `npx prisma migrate deploy` against the
  Neon connection string before first deploy.
