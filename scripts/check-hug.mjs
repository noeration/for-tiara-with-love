import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.resolve("docs/index.html")).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const bad = [];
page.on("pageerror", (e) => bad.push("JS " + e.message));
page.on("console", (m) => m.type() === "error" && bad.push("console " + m.text()));
page.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url().split("/").pop()));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(900);
await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(600);

// captions
await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
console.log("captions:", JSON.stringify(await page.evaluate(() =>
  [...document.querySelectorAll(".memory-card")].map((c) => c.getAttribute("data-caption")))));

// art prose
console.log("art prose:", (await page.locator("#karya .section-head p").last().textContent()).trim());

// letter poem
await page.locator("#surat").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.click("#envelope");
await page.waitForTimeout(1400);
console.log("poem stanzas:", await page.locator(".letter .poem .stanza").count());
console.log("poem first:", (await page.locator(".letter .poem .stanza").first().innerText()).split("\n")[0]);
console.log("poem last:", (await page.locator(".letter .poem .stanza").last().innerText()).split("\n").slice(-1)[0]);

// hug
await page.locator("#penutup").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
console.log("hug label:", (await page.locator("#hugBtn .hug-label").textContent()).trim());
await page.click("#hugBtn");
await page.waitForTimeout(900);
console.log("modal open:", await page.locator("#hugModal").evaluate((m) => m.classList.contains("open")));
console.log("modal aria-hidden:", await page.locator("#hugModal").getAttribute("aria-hidden"));
console.log("hug img:", await page.locator(".hug-photo img").evaluate((i) => i.naturalWidth));
console.log("hearts:", await page.locator(".hug-heart").count());
console.log("confetti:", await page.locator(".confetti-piece").count());
console.log("card transform:", await page.locator(".hug-card").evaluate((c) => getComputedStyle(c).transform));
await page.screenshot({ path: "shots/hug-modal.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
console.log("closed:", await page.locator("#hugModal").evaluate((m) => !m.classList.contains("open")),
  "| body locked:", await page.evaluate(() => document.body.classList.contains("locked")),
  "| hearts cleared:", await page.locator(".hug-heart").count());

// reopen via keyboard + close button
await page.locator("#hugBtn").focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
console.log("reopened by keyboard:", await page.locator("#hugModal").evaluate((m) => m.classList.contains("open")));
await page.click("#hugClose");
await page.waitForTimeout(500);
console.log("closed by button:", await page.locator("#hugModal").evaluate((m) => !m.classList.contains("open")));

// mobile
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(url, { waitUntil: "load" });
await mob.waitForTimeout(800);
await mob.evaluate(() => document.getElementById("enterBtn").click());
await mob.waitForTimeout(600);
await mob.locator("#penutup").scrollIntoViewIfNeeded();
await mob.waitForTimeout(500);
await mob.click("#hugBtn");
await mob.waitForTimeout(900);
const box = await mob.locator(".hug-card").boundingBox();
console.log("mobile card box:", JSON.stringify(box), "| fits:", box.y >= 0 && box.y + box.height <= 845);
await mob.screenshot({ path: "shots/mob-hug.png" });

console.log("errors:", bad.length ? bad.join(" | ") : "none");
await browser.close();
