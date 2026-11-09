import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.resolve("docs/index.html")).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push("JS " + e));
page.on("console", (m) => m.type() === "error" && errors.push("console " + m.text()));
page.on("response", (r) => r.status() >= 400 && errors.push(r.status() + " " + r.url()));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);

// petals visible OVER the gate?
const petals = await page.evaluate(() =>
  [...document.querySelectorAll(".petal")].slice(0, 8).map((p) => {
    const r = p.getBoundingClientRect();
    return { top: Math.round(r.top), left: Math.round(r.left), z: getComputedStyle(p.closest(".ambient")).zIndex };
  }),
);
console.log("petals on gate:", JSON.stringify(petals));
console.log("gate covers viewport:", await page.evaluate(() => {
  const r = document.getElementById("gate").getBoundingClientRect();
  return r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2;
}));
await page.screenshot({ path: "shots/gate-petals.png" });

await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(800);
console.log("confetti on enter:", await page.locator(".confetti-piece").count());

// audio = best part
const audio = await page.evaluate(() =>
  new Promise((res) => {
    const a = document.getElementById("audio");
    a.addEventListener("loadedmetadata", () => res({ src: a.getAttribute("src"), dur: Math.round(a.duration), ready: a.readyState }), { once: true });
    setTimeout(() => res({ src: a.getAttribute("src"), dur: a.duration, ready: a.readyState }), 4000);
  }),
);
console.log("audio:", JSON.stringify(audio));

// scatter: cards start scattered then settle
await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(1400);
const cards = await page.evaluate(() =>
  [...document.querySelectorAll(".memory-card")].map((c) => ({
    op: +getComputedStyle(c).opacity,
    transform: getComputedStyle(c).transform,
  })),
);
console.log("cards after reveal:", JSON.stringify(cards));
await page.screenshot({ path: "shots/scatter-settled.png" });

// mid-scatter shot: scroll fresh so cards start scattered (no reveal yet)
await page.evaluate(() => document.getElementById("penutup").scrollIntoView());
await page.waitForTimeout(500);
await page.evaluate(() => document.getElementById("karya").scrollIntoView());
await page.waitForTimeout(350);
await page.screenshot({ path: "shots/scatter-mid.png" });

// hover lift works after reveal?
await page.waitForTimeout(1400);
await page.locator(".memory-card").first().hover();
await page.waitForTimeout(700);
console.log("hover transform:", await page.locator(".memory-card").first().evaluate((c) => getComputedStyle(c).transform));

// regression: envelope + wishes gated + hug
await page.locator("#surat").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.click("#envelope");
await page.waitForTimeout(1300);
console.log("letter height:", Math.round(await page.locator(".letter-shell").evaluate((e) => e.getBoundingClientRect().height)));
await page.locator("#kue").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
console.log("wishes gated:", await page.locator(".wish-card").first().evaluate((e) => getComputedStyle(e).opacity));

console.log("errors:", errors.length ? errors.join(" | ") : "none");
await browser.close();
