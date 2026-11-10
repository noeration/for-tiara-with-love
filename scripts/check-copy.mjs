import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.resolve("docs/index.html")).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const bad = [];
page.on("pageerror", (e) => bad.push("JS " + e.message));
page.on("console", (m) => m.type() === "error" && bad.push("console " + m.text()));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);

console.log("daytime element:", await page.locator("#daytimeHello").count());
console.log("gate text:", (await page.locator(".gate-copy .script").textContent()).trim());

await page.click("#enterBtn");
await page.waitForTimeout(2000);
console.log("audio:", await page.evaluate(() => {
  const a = document.getElementById("audio");
  return { paused: a.paused, t: +a.currentTime.toFixed(1), dur: Math.round(a.duration) };
}));
console.log("playing ui:", await page.evaluate(() => ({
  btn: document.getElementById("playBtn").classList.contains("playing"),
  vinyl: document.getElementById("vinyl").classList.contains("spinning"),
})));

await page.locator("#kenangan").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
console.log("caps:", JSON.stringify(await page.evaluate(() =>
  [...document.querySelectorAll(".memory-card")].map((c) => ({
    vis: c.querySelector(".cap p").textContent,
    lb: c.getAttribute("data-caption"),
  })))));
console.log("caps match:", await page.evaluate(() =>
  [...document.querySelectorAll(".memory-card")].every((c) => c.querySelector(".cap p").textContent === c.getAttribute("data-caption"))));

await page.locator("#surat").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.click("#envelope");
await page.waitForTimeout(1300);
console.log("stanzas:", await page.locator(".letter .poem .stanza").count());
console.log("poem:", JSON.stringify((await page.locator(".letter .poem").innerText()).split("\n").filter(Boolean)));
console.log("sign:", (await page.locator(".letter .sign").textContent()).trim());

// pause works after autoplay
await page.locator("#lagu").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.click("#playBtn");
await page.waitForTimeout(500);
console.log("paused by button:", await page.evaluate(() => document.getElementById("audio").paused));
await page.click("#playBtn");
await page.waitForTimeout(500);
console.log("resumed by button:", await page.evaluate(() => !document.getElementById("audio").paused));

console.log("errors:", bad.length ? bad.join(" | ") : "none");
await browser.close();
