import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch();

/* ---------- 1. LIVE, no cache ---------- */
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
await ctx.route("**/*", (r) => r.continue()); // keep network, fresh profile = no cache
const page = await ctx.newPage();
const bad = [];
page.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url()));
page.on("pageerror", (e) => bad.push("JS " + e));
page.on("console", (m) => m.type() === "error" && bad.push("console " + m.text()));

await page.goto("https://noeration.github.io/for-tiara-with-love/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
console.log("LIVE gate h1:", await page.locator(".gate h1").evaluate((e) => getComputedStyle(e).opacity));
console.log("LIVE gate img:", await page.locator(".gate-portrait img").evaluate((i) => i.naturalWidth));
await page.screenshot({ path: "shots/live-gate.png" });
await page.click("#enterBtn");
await page.waitForTimeout(1000);

// scroll through everything
for (const id of ["pesan", "kue", "kenangan", "karya", "surat", "lagu", "penutup"]) {
  await page.locator("#" + id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
}
console.log("LIVE hidden after full scroll:", await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length));
console.log("LIVE broken images:", await page.evaluate(() =>
  [...document.images].filter((i) => i.getAttribute("src") && !(i.complete && i.naturalWidth > 0)).map((i) => i.src)));
console.log("LIVE zero-opacity images:", await page.evaluate(() =>
  [...document.images].filter((i) => {
    let el = i, op = 1;
    while (el && el !== document.documentElement) { op *= parseFloat(getComputedStyle(el).opacity); el = el.parentElement; }
    return op < 0.05 && i.naturalWidth > 0;
  }).map((i) => i.src.split("/").pop())));
await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: "shots/live-kenangan.png" });
console.log("LIVE failures:", bad.length ? bad.join(" | ") : "none");
await ctx.close();

/* ---------- 2. LOCAL file ---------- */
const ctx2 = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const p2 = await ctx2.newPage();
const bad2 = [];
p2.on("pageerror", (e) => bad2.push("JS " + e));
p2.on("response", (r) => r.status() >= 400 && bad2.push(r.status() + " " + r.url()));
await p2.goto(pathToFileURL(path.resolve("public/index.html")).href, { waitUntil: "load" });
await p2.waitForTimeout(2000);
console.log("LOCAL gate h1:", await p2.locator(".gate h1").evaluate((e) => getComputedStyle(e).opacity));
console.log("LOCAL gate img:", await p2.locator(".gate-portrait img").evaluate((i) => i.naturalWidth));
await p2.evaluate(() => document.getElementById("enterBtn").click());
await p2.waitForTimeout(900);
for (const id of ["kenangan", "penutup"]) {
  await p2.locator("#" + id).scrollIntoViewIfNeeded();
  await p2.waitForTimeout(700);
}
console.log("LOCAL broken images:", await p2.evaluate(() =>
  [...document.images].filter((i) => i.getAttribute("src") && !(i.complete && i.naturalWidth > 0)).map((i) => i.src)));
console.log("LOCAL hidden:", await p2.evaluate(() =>
  [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length));
console.log("LOCAL audio src:", await p2.locator("#audio").getAttribute("src"));
console.log("LOCAL failures:", bad2.length ? bad2.join(" | ") : "none");
await browser.close();
