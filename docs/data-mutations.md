# Data Mutation Standards

## Server Actions Only

All data mutations in this project **must** be performed via Server Actions. Under no circumstances should Route Handlers (`app/api/`) or direct database access from Client Components be used for creating, updating, or deleting data.

### Rules

1. **Server Actions only** — every mutation (create, update, delete) must be defined as a Server Action using the `"use server"` directive. Never use Route Handlers for mutations.

2. **Co-located `actions.ts`** — place Server Actions in an `actions.ts` file co-located with the page route that uses them.

3. **Helpers in `src/data/`** — all database write operations must be encapsulated in reusable helper functions under `src/data/`, organized by domain (e.g. `src/data/meals.ts`). Server Actions import and call these helpers — they never contain inline Drizzle queries.

4. **Drizzle ORM only** — use Drizzle ORM methods (`db.insert()`, `db.update()`, `db.delete()`) in data helpers. Raw SQL is forbidden.

5. **User-scoped mutations** — every mutation helper must accept a `userId` parameter and scope the operation to the authenticated user. A user must never be able to modify another user's data.

6. **`auth()` in actions** — call `auth()` from `@clerk/nextjs/server` at the top of each Server Action to get the current `userId`. Never accept `userId` from client-submitted data.

7. **Explicit TypeScript types** — every parameter passed to a Server Action must have an explicit TypeScript type. Never use `any` or inferred types for action parameters.

8. **No FormData** — Server Actions must accept strongly-typed objects, not `FormData`. Use `zod` or inline interfaces to define the shape of the input, and call the action with a plain object from the client.

9. **No client-side mutations** — Client Components must never call Drizzle or write to the database directly. They invoke Server Actions via `bind` or direct import.

### Examples

| ✅ Do | ❌ Don't |
|-------|----------|
| `"use server"` in `app/meals/actions.ts` calling `createMeal({ userId, name })` | Create `app/api/meals/route.ts` with a `POST` handler |
| `src/data/meals.ts` with `deleteMeal(id, userId)` using `db.delete()` | Write `db.execute("DELETE FROM meals WHERE ...")` |
| `const { userId } = auth()` in the Server Action | Accept `userId` from a form field or request body |
| A form calling `action={createMeal}` via a Server Action | `fetch("/api/meals", { method: "POST" })` from a Client Component |
