import { createRequire } from "node:module";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");
const [url, w = "1440"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chromium" });
const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "load", timeout: 120000 });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => { const out=[]; const walk=(el,d)=>{ for (const c of el.children){ const cs=getComputedStyle(c); if(cs.display==="none") continue; const r=c.getBoundingClientRect();  const n=c.getAttribute("data-framer-name"); out.push(`${"  ".repeat(d)}${c.tagName.toLowerCase()} ${n||"-"} ${cs.position==="fixed"?"FIXED ":""}y=${Math.round(r.y+scrollY)} h=${Math.round(r.height)} w=${Math.round(r.width)}`); if(d<2 || (!n && d<4)) walk(c,d+1);} }; walk(document.querySelector("main")||document.querySelector("#main"),0); return out.join("\n"); }));
await b.close();
