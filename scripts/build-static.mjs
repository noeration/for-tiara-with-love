/**
 * Build the standalone static site into docs/ (for GitHub Pages).
 * Copies only the assets the HTML uses, converts PNG -> WebP with sharp.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const OUT = path.join(ROOT, "docs");

let html = await fs.readFile(path.join(ROOT, "public/index.html"), "utf8");

const refs = new Set();
for (const m of html.matchAll(/(?:src|href|data-full)="((?:images|uploads|audio)\/[^"]+)"/g)) {
  refs.add(m[1]);
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

for (const ref of refs) {
  const src = path.join(ROOT, "public", ref);
  await fs.access(src);
  const ext = path.extname(ref).toLowerCase();
  const relDir = path.posix.dirname(ref);
  const base = path.posix.basename(ref, path.extname(ref));
  let outRel = ref;
  let data;

  if (ext === ".png" || ext === ".jpeg" || ext === ".jpg") {
    const img = sharp(src).rotate();
    const meta = await img.metadata();
    const resized =
      Math.max(meta.width ?? 0, meta.height ?? 0) > 1600
        ? img.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        : img;
    data = await resized.webp({ quality: 82, effort: 5 }).toBuffer();
    outRel = path.posix.join(relDir, `${base}.webp`);
  } else {
    data = await fs.readFile(src);
  }

  const dest = path.join(OUT, outRel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, data);

  if (outRel !== ref) {
    html = html.replaceAll(`"${ref}"`, `"${outRel}"`);
  }
  console.log(`${ref} -> ${outRel} (${(data.length / 1024).toFixed(0)} KB)`);
}

// Google Fonts are the only external dependency; keep them, they are fast.
await fs.writeFile(path.join(OUT, "index.html"), html, "utf8");
await fs.writeFile(path.join(OUT, ".nojekyll"), "");

const total = (await fs.readdir(OUT, { recursive: true }))
  .map((f) => path.join(OUT, f))
  .reduce(async (accP, f) => {
    const acc = await accP;
    const st = await fs.stat(f).catch(() => null);
    return acc + (st?.isFile() ? st.size : 0);
  }, Promise.resolve(0));
console.log(`total: ${((await total) / 1024 / 1024).toFixed(2)} MB`);
