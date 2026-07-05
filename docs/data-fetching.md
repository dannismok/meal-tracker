# Data Fetching Standards

## Server Components Only

All data fetching in this project **must** be done inside Server Components. Under absolutely no circumstances should Route Handlers (`app/api/` or Route Handlers) be created or used for fetching data.

### Rules

1. **Server Components only** — fetch data directly in Server Components using `async` component functions. Never use Route Handlers to expose data endpoints for client consumption.

2. **No Route Handlers** — do not create files under `app/api/` or use `export async function GET/POST/PUT/DELETE` in route files. Route Handlers are forbidden for data fetching within this app.

3. **Colocate with pages** — place server action logic in co-located `actions.ts` files alongside page routes using Drizzle ORM queries.

4. **Client components receive data as props** — if a Client Component needs data, it must receive it as props from a parent Server Component. Never fetch data directly in a Client Component.

5. **Drizzle in server context only** — database queries via Drizzle ORM must only ever run in Server Components or server actions. Never expose database queries to the client.

### Data Access Layer

All database queries **must** be written as reusable helper functions inside `src/data/`. These helpers encapsulate Drizzle ORM queries and enforce user-scoped access.

1. **Helpers in `src/data/`** — every database query must be a function defined in a file under `src/data/`. Organise by domain (e.g. `src/data/meals.ts`, `src/data/profiles.ts`).

2. **Drizzle ORM only** — all queries must use Drizzle ORM methods (`db.query.*`, `db.insert()`, `db.update()`, `db.delete()`). Raw SQL (`sql` template tag or `db.execute()`) is forbidden.

3. **User-scoped access** — every query helper that accesses user-owned data **must** accept a `userId` parameter and filter by it. A logged-in user must only ever see, create, update, or delete their own data.

4. **Server Components call helpers** — Server Components import and call these helper functions directly. They never contain inline Drizzle queries.

### Examples

| ✅ Do | ❌ Don't |
|-------|----------|
| `getMealsByUser(userId)` in `src/data/meals.ts` called from a Server Component | Create `app/api/meals/route.ts` with a `GET` handler |
| `createMeal({ userId, name, ... })` inserting scoped to `userId` | Use `fetch("/api/meals")` from a Client Component |
| `deleteMeal(id, userId)` filtering by both `id` and `userId` | Export database query functions to the client bundle |
| `db.select().from(meals).where(eq(meals.userId, userId))` | Raw SQL like `db.execute("SELECT * FROM meals WHERE user_id = ...")` |
