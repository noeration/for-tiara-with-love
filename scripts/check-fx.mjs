import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.resolve("docs/index.html")).href;
const browser = await chromium.launch();

async function run(label, opts) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const bad = [];
  page.on("pageerror", (e) => bad.push("JS " + e.message));
  page.on("console", (m) => m.type() === "error" && bad.push("console " + m.text()));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const petals = await page.locator(".petal").count();
  const petalAnim = await page.locator(".petal").first().evaluate((p) => {
    const cs = getComputedStyle(p);
    return { name: cs.animationName, dur: cs.animationDuration, op: cs.opacity };
  });

  await page.evaluate(() => document.getElementById("enterBtn").click());
  await page.waitForTimeout(600);
  const confettiOnEnter = await page.locator(".confetti-piece").count();

  // clear leftovers so the finale burst is unambiguous
  await page.waitForTimeout(9200);
  await page.evaluate(() => (document.getElementById("confettiLayer").innerHTML = ""));
  const before = await page.locator(".confetti-piece").count();

  await page.locator("#penutup").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const atFinale = await page.locator(".confetti-piece").count();

  await page.click("#celebrateBtn");
  await page.waitForTimeout(500);
  const afterBtn = await page.locator(".confetti-piece").count();

  // press again later: layer must be refilled, not wiped early
  await page.waitForTimeout(2000);
  const mid = await page.locator(".confetti-piece").count();
  await page.click("#celebrateBtn");
  await page.waitForTimeout(500);
  const second = await page.locator(".confetti-piece").count();

  console.log(`--- ${label}`);
  console.log(`petals=${petals} anim=${petalAnim.name} ${petalAnim.dur} op=${petalAnim.op}`);
  console.log(`enter=${confettiOnEnter} before=${before} finale=${atFinale} btn=${afterBtn} mid=${mid} btn2=${second}`);
  console.log("errors:", bad.length ? bad.join(" | ") : "none");
  await ctx.close();
}

await run("normal", {});
await run("reduced-motion", { reducedMotion: "reduce" });
await browser.close();
