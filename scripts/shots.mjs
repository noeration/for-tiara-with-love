import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.resolve("docs/index.html")).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1800);
await page.screenshot({ path: "shots/gate.png" });

await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(1200);

await page.locator("#pesan").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: "shots/pesan.png" });

await page.locator("#kue").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
for (const s of [".candle.c1", ".candle.c2", ".candle.c3"]) await page.click(s);
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/kue.png" });

await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/kenangan.png" });

await page.locator("#surat").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.click("#envelope");
await page.waitForTimeout(1800);
await page.screenshot({ path: "shots/surat.png" });

await page.locator("#lagu").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: "shots/lagu.png" });

await page.locator("#penutup").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/penutup.png" });

const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(url, { waitUntil: "load" });
await mob.waitForTimeout(1500);
await mob.screenshot({ path: "shots/mob-gate.png" });
await mob.evaluate(() => document.getElementById("enterBtn").click());
await mob.waitForTimeout(1000);
await mob.locator("#surat").scrollIntoViewIfNeeded();
await mob.waitForTimeout(600);
await mob.click("#envelope");
await mob.waitForTimeout(1600);
await mob.screenshot({ path: "shots/mob-surat.png" });
await browser.close();
console.log("shots done");
