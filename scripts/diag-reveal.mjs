import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(pathToFileURL(path.resolve("docs/index.html")).href, { waitUntil: "load" });
await page.click("#enterBtn");
await page.waitForTimeout(600);

// worst case: jump straight to the end, skipping every section
await page.evaluate(() => document.getElementById("penutup").scrollIntoView());
await page.waitForTimeout(900);
const hidden = await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length,
);
console.log("reveal elements still hidden after jump:", hidden);

// and check image opacity after walking back up
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await page.evaluate(() => document.getElementById("kenangan").scrollIntoView());
await page.waitForTimeout(900);
const cards = await page.evaluate(() =>
  [...document.querySelectorAll(".memory-card")].map((c) => ({
    src: c.querySelector("img").getAttribute("src").split("/").pop(),
    op: +getComputedStyle(c).opacity,
    nat: c.querySelector("img").naturalWidth,
  })),
);
console.log(JSON.stringify(cards));
await browser.close();
