# Authentication Standards

## Clerk Only

All authentication in this project **must** use [Clerk](https://clerk.com). Under no circumstances should custom auth logic, session management, or alternative auth providers be introduced.

### Rules

1. **Clerk middleware** — protect routes via Clerk middleware in `src/middleware.ts`. All routes are protected by default; only `/sign-in` and `/sign-up` are public.

2. **`auth()` helper** — use `auth()` from `@clerk/nextjs/server` in Server Components to retrieve the current session and `userId`. Never inspect cookies or headers manually.

3. **`useAuth` / `useUser`** — use `useAuth()` and `useUser()` from `@clerk/nextjs` in Client Components when auth state is needed on the client.

4. **User-scoped queries** — pass the `userId` from `auth()` to every data helper. All database queries must be scoped to the authenticated user.

5. **No custom auth** — do not create login/signup forms, password hashing, JWT utilities, or session stores. Rely entirely on Clerk's pre-built components (`<SignIn />`, `<SignUp />`, `<UserButton />`, etc.) and APIs.

6. **Environment variables** — Clerk keys live in `.env.local` only (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`). Never commit them.

### Examples

| ✅ Do | ❌ Don't |
|-------|----------|
| `const { userId } = auth()` in a Server Component | Create a custom JWT or session utility |
| `<SignedIn>...<SignedOut>` from `@clerk/nextjs` | Build a custom login form from scratch |
| `<UserButton />` from `@clerk/nextjs` | Write a custom user menu component |
| Pass `userId` to `getMealsByUser(userId)` | Access the database without user scoping |
