// Parity check against the live Framer site (amusing-environment-470649.framer.app).
//
//   node qa/compare.mjs <path> <LayerName|@page> [widths=1440,1000,390] [ourSelector]
//
// <path>       route, e.g. "/" or "/services/hubspot"
// <LayerName>  a Framer layer (data-framer-name) on the live page; ours is [data-section="<LayerName>"]
//              unless ourSelector is given. Use "Name#2" for the 2nd visible match on both sides.
// @page        compare the whole page: full-page shots cut into 900px bands, live left / ours right.
//
// Writes qa/out/<slug>-<w>-{live,ours,side}.png (plus -bandN-side.png for @page) and prints boxes,
// page heights and a differing-pixel percentage. Look at the -side images with the Read tool.
// Env: LIVE_URL (default https://amusing-environment-470649.framer.app), OURS_URL (default http://localhost:3410).
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");

const [path = "/", name = "@page", ws = "1440,1000,390", oursSel] = process.argv.slice(2);
const LIVE = (process.env.LIVE_URL || "https://amusing-environment-470649.framer.app").replace(/\/$/, "");
const OURS = (process.env.OURS_URL || "http://localhost:3410").replace(/\/$/, "");
mkdirSync("qa/out", { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const slug = (path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home") + "-" + name.replace(/[^a-z0-9]+/gi, "_");
const [layer, nth = "1"] = name.split("#");

// Framer's "Made in Framer" badge and Next's dev overlay are not part of the page.
// The "Site by Kelin Studio" credit band is ours only (production carries it, Framer does not), so it is hidden too.
const HIDE = "#__framer-badge-container,#__framer-editorbar-container,#__framer-editorbar,#ibm-site-credit,nextjs-portal,[data-nextjs-toast]{display:none!important}";

async function open(url, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: "light", timezoneId: "Asia/Singapore", reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: HIDE });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(70); }
  await page.evaluate(() => scrollTo(0, 0));
  // Wait for every image to finish loading and decoding, or full-page shots catch blank images.
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 }).catch(() => {});
  await page.evaluate(() => Promise.race([Promise.all([...document.images].map((i) => i.decode().catch(() => {}))), new Promise((r) => setTimeout(r, 8000))]));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  return { ctx, page };
}

async function shootSection(url, sel, w, out, tag) {
  const { ctx, page } = await open(url, w);
  const loc = page.locator(sel).filter({ visible: true }).nth(Number(nth) - 1);
  if (!(await loc.count())) { console.log(tag, "selector not found:", sel, "#" + nth); await ctx.close(); return null; }
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const box = await loc.boundingBox();
  await loc.screenshot({ path: out, animations: "allow" });
  await ctx.close();
  return box;
}

async function shootPage(url, w, out) {
  const { ctx, page } = await open(url, w);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: out, fullPage: true, animations: "allow" });
  await ctx.close();
  return { x: 0, y: 0, width: w, height: H };
}

const PY = (base, band) => `
from PIL import Image, ImageChops
Image.MAX_IMAGE_PIXELS=None
a=Image.open('${base}-live.png').convert('RGB'); b=Image.open('${base}-ours.png').convert('RGB')
def side(a,b,out):
    W=a.width+b.width+20; H=max(a.height,b.height)
    s=Image.new('RGB',(W,H),(255,0,255)); s.paste(a,(0,0)); s.paste(b,(a.width+20,0)); s.save(out)
def diff(a,b):
    h=min(a.height,b.height); a=a.crop((0,0,a.width,h)); b=b.crop((0,0,b.width,h))
    if a.width!=b.width: return None
    d=ImageChops.difference(a,b).convert('L'); n=sum(1 for p in d.getdata() if p>40); return 100*n/(a.width*h)
if ${band ? "True" : "False"}:
    H=max(a.height,b.height); i=0
    for y in range(0,H,900):
        ca=a.crop((0,y,a.width,min(y+900,a.height))) if y<a.height else Image.new('RGB',(a.width,1),(255,0,255))
        cb=b.crop((0,y,b.width,min(y+900,b.height))) if y<b.height else Image.new('RGB',(b.width,1),(255,0,255))
        side(ca,cb,'${base}-band%d-side.png'%i); d=diff(ca,cb)
        print('  band %d (y=%d): %s' % (i,y,'%.2f%% differing'%d if d is not None else 'n/a')); i+=1
else:
    side(a,b,'${base}-side.png')
    if a.size==b.size: print('  same size, differing pixels: %.2f%%' % diff(a,b))
    else: print('  size differs', a.size, b.size, '(top-aligned diff: %s)' % (('%.2f%%'%diff(a,b)) if diff(a,b) is not None else 'n/a'))
`;

for (const w of ws.split(",").map(Number)) {
  const base = `qa/out/${slug}-${w}`;
  let a, b;
  if (layer === "@page") {
    a = await shootPage(LIVE + path, w, `${base}-live.png`);
    b = await shootPage(OURS + path, w, `${base}-ours.png`);
  } else {
    a = await shootSection(LIVE + path, `[data-framer-name="${layer}"]`, w, `${base}-live.png`, "LIVE");
    b = await shootSection(OURS + path, oursSel || `[data-section="${layer}"]`, w, `${base}-ours.png`, "OURS");
  }
  const r = (x) => x && `${Math.round(x.x)},${Math.round(x.y)} ${Math.round(x.width)}x${Math.round(x.height)}`;
  console.log(w, "live", r(a), "| ours", r(b));
  if (a && b) execFileSync("python3", ["-c", PY(base, layer === "@page")], { stdio: "inherit" });
}
await browser.close();
