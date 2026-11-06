---
name: Motion (Framer Motion)
description: Use when adding transitions, entrance/exit animations, hover and tap interactions, list staggering, scroll-linked effects, layout animations, or page transitions with the motion package (formerly Framer Motion) in this project.
---

# Motion (Framer Motion) — project conventions

## Package

- Installed: `motion` (**v14**, the successor of `framer-motion`).
- Always import from `motion/react`:
  ```tsx
  import { motion, AnimatePresence, useReducedMotion } from "motion/react"
  ```
- Never import from `framer-motion` — it is not installed and the APIs differ.

## Client components

Motion needs hooks, refs, and events, so the file that uses it must be a Client Component:

```tsx
"use client"

import { motion } from "motion/react"

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

In Server Components, import a small client wrapper like the one above instead of adding `"use client"` to a whole page. `motion/react-client` also exports pre-marked client motion elements if you need them directly.

## Core patterns

**Variants + stagger (lists, grids):**

```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((it) => (
    <motion.li key={it.id} variants={item}>{it.label}</motion.li>
  ))}
</motion.ul>
```

**Enter/exit with `AnimatePresence`** — every child needs a stable, unique `key`:

```tsx
<AnimatePresence mode="wait">
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
    />
  )}
</AnimatePresence>
```

**Scroll reveal** — animate once when the element enters the viewport:

```tsx
<motion.section
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5 }}
/>
```

**Layout and shared-element transitions:**

```tsx
<motion.div layout layoutId="active-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
```

**Hover/tap:** use `whileHover` / `whileTap` instead of CSS transitions for spring-driven feedback.

**Scroll-linked:** `useScroll`, `useTransform`, `useSpring` from `motion/react` (client only).

## Accessibility

Respect reduced motion:

```tsx
const reduce = useReducedMotion()
const y = reduce ? 0 : 16
```

Never rely on animation alone to convey state; keep focus styles and semantics intact.

## Performance

- Animate `transform` and `opacity`. Avoid animating `width`, `height`, `top`, or `left` on large lists.
- For heavy pages, use `LazyMotion` + the `m` component (`motion/react-m`) to cut bundle size.
- Keep client components small and pass content as `children` from Server Components.
- Don't animate the same CSS property with both Tailwind `transition-*` and Motion; pick one.

## Page transitions (App Router caveat)

`AnimatePresence` keyed on `usePathname()` is unreliable in the App Router — pages unmount outside Motion's control and can flash. Prefer:

1. A simple enter animation in `app/template.tsx` (it re-mounts on navigation), or
2. `AnimateView` from `motion/react-animate-view` — available because this project uses React 19.3, which supports View Transitions:

```tsx
import { AnimateView } from "motion/react-animate-view"

<AnimateView name="page" enter={{ opacity: [0, 1] }} exit={{ opacity: 0 }}>
  {children}
</AnimateView>
```

Read the local Next.js caching/navigation docs before adding route-level animation that depends on navigation timing.
