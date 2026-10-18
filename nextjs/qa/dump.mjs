// Computed-style + box dump of every visible element of a live Framer page, for qa/outline.py.
//   node qa/dump.mjs [routes=all] [widths=1440,1000,390]
// routes: comma list of paths ("/" for home) or "all" (qa/framer/routes.txt). Output: qa/ref/<slug>-<w>.json
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");

const SRC = process.env.LIVE_URL || "https://amusing-environment-470649.framer.app";
const [r = "all", ws = "1440,1000,390"] = process.argv.slice(2);
const routes = r === "all" ? readFileSync("qa/framer/routes.txt", "utf8").split("\n").filter((x, i, a) => i < a.length - 1 || x) : r.split(",");
const slugOf = (p) => (p === "" || p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "-"));
mkdirSync("qa/ref", { recursive: true });

const browser = await chromium.launch({ channel: "chromium" });
const jobs = [];
for (const p of routes) for (const w of ws.split(",").map(Number)) jobs.push([p || "/", w]);

async function run([p, w]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: "light", timezoneId: "Asia/Singapore" });
  const page = await ctx.newPage();
  await page.goto(SRC + (p === "/" ? "/" : p), { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.fonts.ready);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const tree = await page.evaluate(() => {
    const KEEP = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "backgroundColor", "backgroundImage", "borderRadius", "border", "borderTop", "borderBottom", "boxShadow", "opacity", "display", "flexDirection", "alignItems", "justifyContent", "gap", "padding", "textAlign", "textTransform", "textDecoration", "fontFeatureSettings", "overflow", "position", "transform", "backdropFilter", "filter", "objectFit", "zIndex"];
    const DEF = { opacity: "1", backgroundColor: "rgba(0, 0, 0, 0)", backgroundImage: "none", borderRadius: "0px", boxShadow: "none", padding: "0px", gap: "normal", letterSpacing: "normal", textAlign: "start", textTransform: "none", overflow: "visible", position: "static", transform: "none", backdropFilter: "none", filter: "none", objectFit: "fill", zIndex: "auto", fontFeatureSettings: "normal", flexDirection: "row", alignItems: "normal", justifyContent: "normal" };
    const TEXTY = new Set(["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "textAlign", "textTransform", "textDecoration", "fontFeatureSettings"]);
    function node(el, ps) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return null;
      const r = el.getBoundingClientRect();
      const kids = [];
      for (const c of el.children) { const k = node(c, cs); if (k) kids.push(k); }
      if ((r.width === 0 || r.height === 0) && !kids.length) return null;
      const direct = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
      const s = {};
      for (const k of KEEP) {
        let v = cs[k];
        if (k.startsWith("border") && /^0px/.test(v)) continue;
        if (DEF[k] === v) continue;
        if (k === "display" && v === "block") continue;
        if (TEXTY.has(k) && !direct && ps && ps[k] === v) continue; // inherited, only show where text lives or it changes
        if (k === "textDecoration" && v.startsWith("none")) continue;
        s[k] = v;
      }
      const o = { t: el.tagName.toLowerCase(), b: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)], s };
      const n = el.getAttribute("data-framer-name"); if (n) o.n = n;
      if (direct) o.x = direct;
      if (el.tagName === "IMG") o.src = el.currentSrc || el.src;
      if (el.tagName === "A") o.href = el.getAttribute("href");
      if (el.tagName === "svg") { o.svg = el.outerHTML.slice(0, 4000); o.c = undefined; return o; }
      if (el.tagName === "VIDEO") o.src = el.currentSrc || el.src;
      if (kids.length) o.c = kids;
      return o;
    }
    return node(document.body, null);
  });
  const H2 = await page.evaluate(() => document.documentElement.scrollHeight);
  writeFileSync(`qa/ref/${slugOf(p)}-${w}.json`, JSON.stringify({ url: SRC + p, width: w, height: H2, tree }));
  console.log(slugOf(p), w, "height", H2);
  await ctx.close();
}
const POOL = 6;
let i = 0;
await Promise.all(Array.from({ length: POOL }, async () => { while (i < jobs.length) { const j = jobs[i++]; try { await run(j); } catch (e) { console.log("FAIL", j, e.message.split("\n")[0]); } } }));
await browser.close();
