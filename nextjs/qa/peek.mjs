import { createRequire } from "node:module";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");
const [url, w = "1440", out = "qa/out/peek.png"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chromium" });
const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "load", timeout: 120000 });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
const secs = await p.evaluate(() => { const m = document.querySelector("#main > div") || document.querySelector("#main"); const out=[]; const walk=(el,d)=>{ for (const c of el.children){ const r=c.getBoundingClientRect(); if(r.height<2) continue; out.push(`${"  ".repeat(d)}${c.tagName.toLowerCase()} ${c.getAttribute("data-framer-name")||""} y=${Math.round(r.y+scrollY)} h=${Math.round(r.height)}`); if(d<1) walk(c,d+1);} }; walk(m,0); return out.join("\n"); });
console.log("height", await p.evaluate(() => document.documentElement.scrollHeight)); console.log(secs);
await p.screenshot({ path: out, fullPage: true });
await b.close();
