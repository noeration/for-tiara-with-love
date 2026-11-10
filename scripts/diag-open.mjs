import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const targets = [
  ["docs file://", pathToFileURL(path.resolve("docs/index.html")).href, {}],
  ["public file://", pathToFileURL(path.resolve("public/index.html")).href, {}],
  ["docs file:// reduced", pathToFileURL(path.resolve("docs/index.html")).href, { reducedMotion: "reduce" }],
  ["live reduced", "https://noeration.github.io/for-tiara-with-love/?v=" + Date.now(), { reducedMotion: "reduce" }],
];

const browser = await chromium.launch();
for (const [label, url, opts] of targets) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const bad = [];
  page.on("pageerror", (e) => bad.push("JS " + e.message));
  page.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url().split("/").pop()));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2000);

  const gateImg = await page.locator(".gate-portrait img").evaluate((i) => i.naturalWidth).catch(() => -1);
  await page.evaluate(() => document.getElementById("enterBtn").click());
  await page.waitForTimeout(1200);
  const confetti = await page.locator(".confetti-piece").count();
  for (const id of ["kenangan", "karya", "penutup"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
  }
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.getAttribute("src") && !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src")),
  );
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length,
  );
  const petals = await page.locator(".petal").count();
  const petalAnim = await page.locator(".petal").first().evaluate((p) => getComputedStyle(p).animationName).catch(() => "n/a");
  console.log(`--- ${label}`);
  console.log(`gateImg=${gateImg} broken=${broken.length} hidden=${hidden} petals=${petals} petalAnim=${petalAnim} confetti=${confetti}`);
  if (broken.length) console.log("  broken:", broken.slice(0, 4).join(", "));
  if (bad.length) console.log("  errors:", bad.slice(0, 3).join(" | "));
  await ctx.close();
}
await browser.close();
