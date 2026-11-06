---
name: Next.js App Router
description: Use for any work in this Next.js 16 App Router project — creating or editing pages, layouts, route handlers, server/client components, data fetching, caching, metadata, and running dev/build/lint commands.
---

# Next.js App Router — project conventions

## Stack

- Next.js **16.4.3** with App Router, React **19.3**, TypeScript, Tailwind CSS **v4** (via `@tailwindcss/turbopack`).
- UI: shadcn/ui (`base-nova` style, Base UI primitives) — see the `shadcn-ui` skill.
- Animation: `motion` (Framer Motion) — see the `motion` skill.
- Images: `next/image` — see the `nextjs-image` skill.
- Code lives in `app/` (no `src/`). Import alias: `@/*` → project root.
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`.

## Read the local docs before writing code

This Next.js version has breaking changes. `node_modules/next/dist/docs/` ships the exact docs for the installed version. Read the relevant file before changing behavior:

| Topic | File |
| --- | --- |
| Project structure | `01-app/01-getting-started/02-project-structure.md` |
| Layouts & pages | `03-layouts-and-pages.md` |
| Linking & navigating | `04-linking-and-navigating.md` |
| Server & Client Components | `05-server-and-client-components.md` |
| Fetching / mutating data | `06-fetching-data.md`, `07-mutating-data.md` |
| Caching (cacheComponents) | `08-caching.md`, `09-revalidating.md` |
| Error handling | `10-error-handling.md` |
| CSS / Tailwind | `11-css.md` |
| Images | `12-images.md` |
| Fonts | `13-fonts.md` |
| Metadata & OG images | `14-metadata-and-og-images.md` |
| Route handlers | `15-route-handlers.md` |
| API reference | `01-app/03-api-reference/` |

Also read `node_modules/next/AGENTS.md`. If the local docs do not answer a question, query Context7 (`tools.context7["query-docs"]`) for `/vercel/next.js` instead of guessing.

## Rules

1. **Server Components first.** Add `"use client"` only to the leaf component that needs state, effects, event handlers, or browser APIs. Pass serializable props from server to client.
2. **Async dynamic APIs.** `params` and `searchParams` are Promises. Prefer the generated route types:
   ```tsx
   export default async function Page({ params }: PageProps<"/posts/[slug]">) {
     const { slug } = await params
   }
   ```
   Layouts use `LayoutProps<"/route">`. Never type them by hand if the generated type exists.
3. **Data fetching happens on the server.** `fetch` is not cached by default. Before adding caching, read `08-caching.md` and use `"use cache"`, `cacheLife`, and `cacheTag` consistently with `cacheComponents: true`.
4. **Mutations:** prefer Server Actions (`"use server"`) over API routes for forms; validate input and return only serializable data. Use `app/api/<name>/route.ts` when a real HTTP endpoint is required.
5. **Styling:** Tailwind utilities plus the design tokens defined in `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, …). No hard-coded hex colors.
6. **File conventions:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `route.ts`; route groups `(marketing)` do not affect the URL; dynamic segments use `[slug]`.
7. **Navigation:** `next/link` for internal links. `usePathname`/`useRouter` only inside client components.
8. **Metadata:** export `metadata` or `generateMetadata` per route; fonts use `next/font` (Geist is already configured in `app/layout.tsx`).
9. **Images and animation:** always go through the `nextjs-image` and `motion` skills rather than inline ad-hoc patterns.
10. **Verify before finishing:** `npm.cmd run lint` and `npx.cmd tsc --noEmit` (or `npm.cmd run build`).

## Commands (PowerShell)

PowerShell blocks `npm.ps1`/`npx.ps1` on this machine — call the `.cmd` shims:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npx.cmd" tsc --noEmit
```

## Structure conventions

```text
app/                 routes, layouts, route handlers
components/ui/       shadcn/ui generated primitives
components/          app-specific composed components
lib/                 helpers (cn in lib/utils.ts)
hooks/               client hooks
public/              static assets
```
