# UI Standards

## Only shadcn/ui Components

All UI elements in this project **must** be built using [shadcn/ui](https://ui.shadcn.com) components. Absolutely no custom UI components should be created.

### Rules

1. **Always install from shadcn** — use `npx shadcn@latest add <component>` to pull in any needed component. Never hand-roll your own.

2. **No custom UI components** — do not create components like `MyButton.tsx`, `CustomInput.tsx`, or any wrapper around raw HTML elements for styling purposes.

3. **Composition over customization** — compose shadcn components together using their documented APIs (`asChild`, variants, etc.) instead of modifying or extending them.

4. **Tailwind only for layout** — Tailwind utility classes may be used for layout, spacing, and sizing, but not for replicating component-level styling that shadcn already provides.

5. **Use the CLI** — components should be added via the shadcn CLI to ensure they stay in sync with the project's `components.json` config and theme.

6. **Keep defaults** — do not modify the base styles of shadcn components. If you need a variation, use the existing `variant` prop or compose with `asChild`.

### Examples

| ✅ Do | ❌ Don't |
|-------|----------|
| `npx shadcn@latest add button` then use `<Button>` | Create a `Button.tsx` manually |
| `npx shadcn@latest add input` then `<Input>` | Write `<input className="..." />` with Tailwind |
| Use `variant="destructive"` on `<Button>` | Clone `<Button>` to make a `DeleteButton` |
