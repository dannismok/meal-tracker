# AGENTS.md — Meal Tracker

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** shadcn/ui only — see [docs/ui.md](docs/ui.md)
- **Docs:** All project documentation lives in [docs/](docs/)
- **Auth:** Clerk
- **Database:** PostgreSQL (Neon) via Drizzle ORM
- **Package manager:** npm

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (run before committing) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Conventions

- **Path alias:** `@/` maps to `src/`
- **Components:** shadcn/ui components go in `src/components/ui/` via the CLI (`npx shadcn@latest add <name>`). Never hand-write UI components.
- **Server actions:** Place in a `actions.ts` file co-located with the page route.
- **Database:** Schema in `src/db/schema.ts`, queries use Drizzle ORM. Use server actions or Route Handlers — never expose db queries to the client.
- **Auth:** Clerk middleware protects all routes except `/sign-in` and `/sign-up`.

## Before Submitting

1. Run `npm run build` — must succeed.
2. Run `npm run lint` — no errors.

## Environment

- `.env` contains the `DATABASE_URL`.
- `.env.local` holds Clerk keys (secret, never commit).
