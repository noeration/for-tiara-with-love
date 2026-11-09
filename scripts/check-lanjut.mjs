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
await page.waitForTimeout(1300);
console.log("daytime:", JSON.stringify((await page.locator("#daytimeHello").textContent()).trim()));
await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(800);

// tap hearts: pointerdown on a plain paragraph
await page.evaluate(() => {
  const p = document.querySelector("#pesan .prose p");
  p.dispatchEvent(new PointerEvent("pointerdown", { clientX: 300, clientY: 300, bubbles: true }));
});
await page.waitForTimeout(350);
console.log("tap hearts spawned:", await page.locator(".tap-heart").count());
// click on a button should NOT spawn
await page.locator("#shuffleBtn").click();
await page.waitForTimeout(300);
console.log("tap hearts after button click:", await page.locator(".tap-heart").count());
console.log("lightbox via shuffle:", await page.locator("#lightbox").evaluate((e) => e.classList.contains("open")));
console.log("lightbox src:", await page.locator("#lbImg").getAttribute("src"));
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// hug: hold
await page.locator("#penutup").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const hp = page.locator("#hugBtn");
await hp.dispatchEvent("pointerdown");
await page.waitForTimeout(700);
console.log("hug progress mid:", await hp.evaluate((b) => b.style.getPropertyValue("--hp")));
await page.waitForTimeout(1100);
console.log("hug label after hold:", (await page.locator(".hug-label").textContent()).trim());
console.log("confetti after hug:", await page.locator(".confetti-piece").count());
await hp.dispatchEvent("pointerup");

// hug cancel path
await page.waitForTimeout(3300);
await hp.dispatchEvent("pointerdown");
await page.waitForTimeout(400);
await hp.dispatchEvent("pointerup");
await page.waitForTimeout(300);
console.log("hug label after early release:", (await page.locator(".hug-label").textContent()).trim());
console.log("hug progress reset:", JSON.stringify(await hp.evaluate((b) => b.style.getPropertyValue("--hp"))));

// envelope + cake still fine
await page.locator("#surat").scrollIntoViewIfNeeded();
await page.click("#envelope");
await page.waitForTimeout(1400);
console.log("letter height:", Math.round(await page.locator(".letter-shell").evaluate((e) => e.getBoundingClientRect().height)));
await page.locator("#kue").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
console.log("wishes gated:", await page.locator(".wish-card").first().evaluate((e) => getComputedStyle(e).opacity));

console.log("errors:", errors.length ? errors.join(" | ") : "none");
await browser.close();
