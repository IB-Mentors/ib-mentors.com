// Crawl every route on OURS_URL: internal links resolve (200), no console errors, no broken images.
//   node qa/links.mjs
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");
const OURS = (process.env.OURS_URL || "http://localhost:3410").replace(/\/$/, "");
const routes = [...readFileSync("qa/framer/routes.txt", "utf8").split("\n").filter(Boolean)];
const b = await chromium.launch({ channel: "chromium" });
const hrefs = new Map(), problems = [];
let i = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (i < routes.length) {
    const r = routes[i++] || "/";
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
    p.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 160)));
    p.on("response", (res) => { if (res.status() >= 400 && res.url().startsWith(OURS)) errs.push(`${res.status()} ${res.url().replace(OURS, "")}`); });
    await p.goto(OURS + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(50); }
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => ({
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      broken: [...document.images].filter((im) => im.complete && im.naturalWidth === 0 && im.currentSrc).map((im) => im.currentSrc),
    }));
    for (const h of info.links) if (h.startsWith("/") && !h.startsWith("//")) { const k = h.split("#")[0].split("?")[0] || "/"; if (!hrefs.has(k)) hrefs.set(k, r); }
    if (errs.length || info.broken.length) problems.push({ route: r, errs: [...new Set(errs)], broken: info.broken });
    await ctx.close();
  }
}));
const bad = [];
for (const [h, from] of hrefs) { const res = await fetch(OURS + h, { redirect: "manual" }); if (res.status !== 200) bad.push(`${res.status} ${h} (linked from ${from})`); }
console.log(`${routes.length} pages crawled, ${hrefs.size} distinct internal links`);
console.log(bad.length ? "BAD LINKS:\n  " + bad.join("\n  ") : "all internal links 200");
console.log(problems.length ? "PAGE PROBLEMS:\n" + JSON.stringify(problems, null, 1) : "no console errors, no broken images");
await b.close();
