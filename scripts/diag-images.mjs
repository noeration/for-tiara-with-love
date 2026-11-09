import { chromium } from "playwright";

const url = "https://noeration.github.io/for-tiara-with-love/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const net = [];
page.on("response", (r) => {
  if (/\.(webp|jpe?g|png|wav)$/i.test(r.url())) net.push(`${r.status()} ${r.headers()["content-type"] || "?"} ${r.url().split("/").slice(-2).join("/")}`);
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
console.log("html source refs:");
console.log((await page.content()).match(/(?:src|data-full)="[^"]+\.(?:webp|jpg|png|wav)"/g).slice(0, 12).join("\n"));

await page.evaluate(() => document.getElementById("enterBtn").click());
await page.waitForTimeout(700);

// walk every section so lazy images load
for (const id of ["pesan", "kue", "kenangan", "karya", "surat", "lagu", "penutup"]) {
  await page.locator("#" + id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1200);

const report = await page.evaluate(() =>
  [...document.images].map((i) => {
    const r = i.getBoundingClientRect();
    let op = 1, el = i;
    while (el && el !== document.documentElement) {
      const cs = getComputedStyle(el);
      op *= parseFloat(cs.opacity);
      if (cs.display === "none" || cs.visibility === "hidden") op = 0;
      el = el.parentElement;
    }
    return {
      src: i.getAttribute("src"),
      nat: i.naturalWidth + "x" + i.naturalHeight,
      box: Math.round(r.width) + "x" + Math.round(r.height),
      shownOpacity: +op.toFixed(2),
    };
  }),
);
console.log(JSON.stringify(report, null, 1));
console.log("network:");
console.log(net.join("\n"));
await browser.close();
