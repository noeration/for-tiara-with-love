import { chromium } from "playwright";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tiara-"));
const lone = path.join(tmp, "for-tiara.html");
await fs.copyFile(path.resolve("for-tiara.html"), lone);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const bad = [];
page.on("pageerror", (e) => bad.push("JS " + e.message));
page.on("requestfailed", (r) => bad.push("REQ " + r.url().slice(0, 60)));

await page.goto(pathToFileURL(lone).href, { waitUntil: "load" });
await page.waitForTimeout(1800);
console.log("gate image:", await page.locator(".gate-portrait img").evaluate((i) => i.naturalWidth));
console.log("petals:", await page.locator(".petal").count());
await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(1000);
console.log("confetti:", await page.locator(".confetti-piece").count());
for (const id of ["kenangan", "karya", "surat", "lagu", "penutup"]) {
  await page.locator("#" + id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
}
console.log("broken images:", await page.evaluate(() =>
  [...document.images].filter((i) => i.getAttribute("src") && !(i.complete && i.naturalWidth > 0)).length));
console.log("hidden reveals:", await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length));
console.log("audio:", await page.evaluate(() => {
  const a = document.getElementById("audio");
  return { src: a.getAttribute("src").slice(0, 30), dur: Math.round(a.duration), ready: a.readyState };
}));
await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/single-kenangan.png" });
console.log("errors:", bad.length ? bad.join(" | ") : "none");
await browser.close();
