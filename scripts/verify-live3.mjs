import { chromium } from "playwright";

const url = "https://noeration.github.io/for-tiara-with-love/?v=" + Date.now();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const bad = [];
page.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url()));
page.on("pageerror", (e) => bad.push("JS " + e));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("petals:", await page.locator(".petal").count(), "| z:", await page.locator(".ambient").evaluate((e) => getComputedStyle(e).zIndex));
const petalOverGate = await page.evaluate(() => {
  const g = document.getElementById("gate").getBoundingClientRect();
  return [...document.querySelectorAll(".petal")].some((p) => {
    const r = p.getBoundingClientRect();
    return r.top >= g.top && r.top <= g.bottom && r.left >= g.left && r.left <= g.right;
  });
});
console.log("petal inside gate area:", petalOverGate);

await page.click("#enterBtn");
await page.waitForTimeout(700);
console.log("confetti:", await page.locator(".confetti-piece").count());

const audio = await page.evaluate(() =>
  new Promise((res) => {
    const a = document.getElementById("audio");
    const done = () => res({ src: a.getAttribute("src"), dur: Math.round(a.duration), ready: a.readyState });
    a.readyState >= 1 ? done() : a.addEventListener("loadedmetadata", done, { once: true });
    setTimeout(done, 5000);
  }),
);
console.log("audio:", JSON.stringify(audio));
console.log("song title:", (await page.locator(".song-info h3").textContent()).trim(), "| artist:", (await page.locator(".song-info .artist").textContent()).trim());

// memories: scroll fast to end, nothing should stay hidden
await page.evaluate(() => document.getElementById("penutup").scrollIntoView());
await page.waitForTimeout(1000);
console.log("hidden reveals after jump:", await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length));
console.log("broken images:", await page.evaluate(() =>
  [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).length));
console.log("failures:", bad.length ? bad.join(" | ") : "none");
await browser.close();
