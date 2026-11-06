---
name: Next.js Image Optimization
description: Use whenever adding, editing, or reviewing images in this project — covers next/image, static imports, remote patterns, responsive sizes, LCP preloading, blur placeholders, and format/quality settings.
---

# Image optimization with `next/image`

## Rules

1. **Use `next/image`, never a raw `<img>`** (the only exceptions are inline SVG icons or images that genuinely cannot be statically analyzed — then use `unoptimized` deliberately).
2. **Static import local assets** so width, height, and `blurDataURL` are generated at build time:
   ```tsx
   import hero from "@/public/hero.jpg"

   <Image src={hero} alt="..." placeholder="blur" sizes="100vw" />
   ```
3. **Remote images** need explicit `width`/`height` (or `fill`) and an allowlisted host in `next.config.ts`:
   ```ts
   images: {
     remotePatterns: [
       { protocol: "https", hostname: "images.example.com", pathname: "/products/**" },
     ],
   }
   ```
   Be specific — never use `hostname: "**"` or wide path patterns.
4. **Fluid images:** `fill` + `sizes`. The parent must be positioned and sized:
   ```tsx
   <div className="relative aspect-video w-full overflow-hidden rounded-lg">
     <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
   </div>
   ```
   Without `sizes`, `fill` assumes `100vw` and downloads images that are too large.
5. **LCP / hero image:** use `preload` (Next 16). `priority` is deprecated in Next 16.
   ```tsx
   <Image src={hero} alt="..." preload sizes="100vw" />
   ```
   Only one image per page should be preloaded — normally the above-the-fold hero.
6. **Everything else stays lazy** (the default). Do not set `loading="eager"` unless the image must load immediately.
7. **Blur placeholder:** automatic for static imports of jpg/png/webp/avif. For remote/dynamic images pass a tiny `blurDataURL` with `placeholder="blur"`.
8. **Quality:** stay at the default unless there is a reason. If you pass `quality`, add the value to `images.qualities` in `next.config.ts`, otherwise it is coerced to the closest allowed value.
9. **Alt text:** describe the image content; use `alt=""` only for purely decorative images.
10. **Don't upscale or ship oversized originals.** Serve dimensions close to the largest rendered size; Next.js generates the responsive `srcset` from `deviceSizes`/`imageSizes`.

## Useful props

| Need | Prop |
| --- | --- |
| Unknown/fluid dimensions | `fill` + positioned parent + `sizes` |
| Above-the-fold hero | `preload` |
| Lazy (default) | `loading="lazy"` |
| Placeholder | `placeholder="blur"` + optional `blurDataURL` |
| Object fit | `className="object-cover"` / `object-contain` |
| Skip optimizer for a source | `unoptimized` |

## Config reference

`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` and `.../05-config/01-next-config-js/images.md` are the source of truth for the installed version. Check them before changing `remotePatterns`, `qualities`, `deviceSizes`, `formats`, or `loader`.

## Checklist before finishing

- [ ] Every raster image uses `next/image`.
- [ ] `width`/`height` or `fill` + `sizes` is present (no layout shift).
- [ ] The hero/LCP image uses `preload`; other images stay lazy.
- [ ] Remote hosts are allowlisted narrowly in `next.config.ts`.
- [ ] `alt` is meaningful (or empty when decorative).
- [ ] No oversized source files; responsive `sizes` matches the rendered layout.
