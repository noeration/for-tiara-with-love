/**
 * One-off import: copy the photos from "C:\Users\Vina\Downloads\for tiara"
 * into public/images with stable names.
 */
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/Vina/Downloads/for tiara";
const ROOT = path.resolve("public/images");

const plan = [
  ["opening img/WhatsApp Image 2026-11-04 at 11.35.24 (2).jpeg", "tiara/opening.jpg"],
  ["memories/WhatsApp Image 2026-11-04 at 11.35.24 (1).jpeg", "memories/memory-01.jpg"],
  ["memories/WhatsApp Image 2026-11-04 at 11.35.24 (2).jpeg", "memories/memory-02.jpg"],
  ["memories/WhatsApp Image 2026-11-09 at 09.38.07.jpeg", "memories/memory-03.jpg"],
  ["memories/WhatsApp Image 2026-11-04 at 12.18.48.jpeg", "memories/memory-04.jpg"],
  ["memories/WhatsApp Image 2026-11-04 at 12.18.49.jpeg", "memories/memory-05.jpg"],
  ["memories/WhatsApp Image 2026-11-09 at 09.38.08.jpeg", "memories/memory-06.jpg"],
  ["memories/WhatsApp Image 2026-11-04 at 11.35.24.jpeg", "memories/memory-07.jpg"],
  ["art/WhatsApp Image 2026-11-04 at 11.34.48 (1).jpeg", "artworks/artwork-01.jpg"],
];

for (const [from, to] of plan) {
  const dest = path.join(ROOT, to);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(path.join(SRC, from), dest);
  const st = await fs.stat(dest);
  console.log(`${to} (${(st.size / 1024).toFixed(0)} KB)`);
}
