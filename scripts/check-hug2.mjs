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
  await page.waitForTimeout(1200);

  const sizes = await page.evaluate(() => {
    const w = [...document.querySelectorAll(".petal")].map((p) => parseFloat(p.style.width));
    return { n: w.length, min: Math.min(...w), max: Math.max(...w) };
  });
  await page.evaluate(() => document.getElementById("enterBtn").click());
  await page.waitForTimeout(600);
  await page.locator("#penutup").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  await page.click("#hugBtn");
  await page.waitForTimeout(700);
  const openState = await page.evaluate(() => ({
    open: document.getElementById("hugModal").classList.contains("open"),
    hearts: document.querySelectorAll(".hug-heart").length,
    confetti: document.querySelectorAll(".confetti-piece").length,
    locked: document.body.classList.contains("locked"),
    heartsLayerZ: getComputedStyle(document.getElementById("confettiLayer")).zIndex,
    modalZ: getComputedStyle(document.getElementById("hugModal")).zIndex,
  }));
  await page.waitForTimeout(3200);
  const after = await page.evaluate(() => ({
    open: document.getElementById("hugModal").classList.contains("open"),
    heartsStillFloating: document.querySelectorAll(".hug-heart").length,
    locked: document.body.classList.contains("locked"),
  }));
  await page.waitForTimeout(2600);
  const settled = await page.evaluate(() => document.querySelectorAll(".hug-heart").length);

  // manual close path
  await page.click("#hugBtn");
  await page.waitForTimeout(400);
  await page.click("#hugClose");
  await page.waitForTimeout(500);
  const manual = await page.evaluate(() => ({
    open: document.getElementById("hugModal").classList.contains("open"),
    locked: document.body.classList.contains("locked"),
  }));

  console.log(`--- ${label}`);
  console.log("petals:", JSON.stringify(sizes));
  console.log("on open:", JSON.stringify(openState));
  console.log("after 3.9s:", JSON.stringify(after), "| hearts after 6.5s:", settled);
  console.log("manual close:", JSON.stringify(manual));
  console.log("errors:", bad.length ? bad.join(" | ") : "none");
  await ctx.close();
}

await run("normal", {});
await run("reduced", { reducedMotion: "reduce" });
await browser.close();
