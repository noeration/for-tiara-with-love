---
name: shadcn/ui
description: Use when adding, browsing, searching, or modifying shadcn/ui components in this project — covers the shadcn MCP tools, components.json settings, Base UI primitives, and styling rules.
---

# shadcn/ui — project workflow

## Configuration (already initialized)

`components.json`:

- `style: "base-nova"` — Base UI primitives, **not** Radix.
- `rsc: true`, `tsx: true`, `tailwind.css: "app/globals.css"`, `baseColor: "neutral"`, `cssVariables: true`.
- `iconLibrary: "lucide"`.
- Aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.

Components use Base UI's `render` prop (e.g. `<Button render={<a href="/x" />}>`) instead of Radix's `asChild`. Custom class merging uses `cn` from `cn` (re-exported by `lib/utils.ts`).

## Workflow

1. **Check what already exists** before adding anything: `ls components/ui`.
2. **Discover with the shadcn MCP server** (call inside `execute`):
   - `tools.shadcn.get_project_registries()` — configured registries.
   - `tools.shadcn.list_items_in_registries({ registries: ["@shadcn"], types: ["ui"] })` — browse.
   - `tools.shadcn.search_items_in_registries({ query: "data table" })` — fuzzy search.
   - `tools.shadcn.view_items_in_registries({ items: ["@shadcn/card"] })` — see the code before installing.
   - `tools.shadcn.get_item_examples_from_registries({ query: "card-demo" })` — usage examples with full code.
   - `tools.shadcn.get_add_command_for_items({ items: ["@shadcn/button"] })` — exact install command.
3. **Install with the CLI** so files, dependencies, and CSS get wired up correctly:
   ```powershell
   & "C:\Program Files\nodejs\npx.cmd" shadcn@latest add button card dialog
   ```
   Never paste component source manually when the registry has it.
4. **Import from the aliases:**
   ```tsx
   import { Button } from "@/components/ui/button"
   ```
5. **Audit after finishing:** `tools.shadcn.get_audit_checklist()` and fix anything it flags.

## Rules

- Reuse installed primitives instead of rebuilding buttons, dialogs, menus, etc.
- Keep `components/ui/*` close to upstream, but you may adjust variants/classes. Put app-specific compositions in `components/` and leave the primitives generic.
- Use the semantic tokens from `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, …). Never hard-code hex colors; add new tokens to `globals.css` when the design needs them.
- Use `cn()` for conditional classes, and `cva` when a component needs variants.
- Preserve accessibility: keep labels, `aria-*`, focus styles, and keyboard behavior from the primitives.
- Use `lucide-react` icons and size them with the component's `data-icon`/`size-*` conventions.
- Components that use hooks/events must be client components (`"use client"`) only when needed; shadcn primitives already declare it where required.

## Useful commands

```powershell
& "C:\Program Files\nodejs\npx.cmd" shadcn@latest add <component>
& "C:\Program Files\nodejs\npx.cmd" shadcn@latest add <component> -c .
& "C:\Program Files\nodejs\npx.cmd" shadcn@latest view <component>
```
