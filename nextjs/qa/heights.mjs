// Whole-site sweep: page height live vs ours for every route at each width.
//   node qa/heights.mjs [widths=1440,1000,390]      (needs the dev or prod server on OURS_URL)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");
const LIVE = process.env.LIVE_URL || "https://amusing-environment-470649.framer.app";
const OURS = process.env.OURS_URL || "http://localhost:3410";
const ws = (process.argv[2] || "1440,1000,390").split(",").map(Number);
const routes = readFileSync("qa/framer/routes.txt", "utf8").split("\n").filter(Boolean).map((r) => r || "/");
const browser = await chromium.launch({ channel: "chromium" });
async function height(url, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, timezoneId: "Asia/Singapore" });
  const p = await ctx.newPage();
  const res = await p.goto(url, { waitUntil: "load", timeout: 120000 });
  await p.waitForTimeout(1500);
  // Framer's badge and our "Site by Kelin Studio" credit band are not part of the compared page.
  await p.addStyleTag({ content: "#__framer-badge-container,#__framer-editorbar-container,#__framer-editorbar,#ibm-site-credit,nextjs-portal{display:none!important}" });
  await p.evaluate(() => document.fonts.ready);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.waitForTimeout(800);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  await ctx.close();
  return [res.status(), h];
}
const jobs = routes.flatMap((r) => ws.map((w) => [r, w]));
const out = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => { while (i < jobs.length) { const [r, w] = jobs[i++]; try { const [, a] = await height(LIVE + r, w); const [s, b] = await height(OURS + r, w); out.push([r, w, a, b, s]); console.error(`${r} ${w} ${a} ${b}`); } catch (e) { out.push([r, w, -1, -1, "ERR " + e.message.split("\n")[0]]); } } }));
out.sort((x, y) => (x[0] + x[1]).localeCompare(y[0] + y[1]));
let bad = 0;
for (const [r, w, a, b, s] of out) { const ok = a === b && (s === 200 || (r === "/404" && s === 404)); if (!ok) bad++; console.log(`${ok ? "ok  " : "DIFF"} ${String(w).padEnd(5)} ${r.padEnd(60)} live ${a}  ours ${b}  (${s})`); }
console.log(`${out.length - bad}/${out.length} match`);
await browser.close();
