// Measurement check against a local production build (next start), with the host guard satisfied for real:
// Chromium resolves ib-mentors.com to the local server, so location.hostname is the production host and the
// guard measures. Every request that would reach Google or Cloudflare with data is intercepted and fulfilled
// locally (GA4 /g/collect, the Cloudflare RUM post, AdSense ad requests): nothing reaches the real properties.
//   NEXT_DIST_DIR=.next-build npx next start -p 3411 &   then   node qa/tags-check.mjs [port=3411]
// Checks: GA4 page_view fires; GTM loads; the CF beacon loads; click-ID capture (ms_attr_v1) from a ?gclid landing;
// a mocked 200 on /api/contact fires generate_lead with the click ID; a 503 shows the error state and fires nothing;
// on plain localhost (not a measured host) no hit is sent.
import { createRequire } from "node:module";
const require = createRequire("/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json");
const { chromium } = require("playwright");
const PORT = process.argv[2] || "3411";
const b = await chromium.launch({ channel: "chromium", args: [`--host-resolver-rules=MAP ib-mentors.com 127.0.0.1:${PORT}`] });
const results = [];
const ok = (name, cond, extra = "") => { results.push([cond ? "ok  " : "FAIL", name, extra]); };

async function session(base, { mockContact } = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const hits = [], loaded = [], blocked = [];
  await p.route(/google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect/, (r) => { hits.push(r.request().url() + "&" + (r.request().postData() || "")); r.fulfill({ status: 204 }); });
  await p.route(/cloudflareinsights\.com\/cdn-cgi\/rum/, (r) => { blocked.push("cf-rum"); r.fulfill({ status: 204 }); });
  await p.route(/googlesyndication\.com\/pagead\/(?!js\/adsbygoogle)|doubleclick\.net|googleadservices|adtrafficquality/, (r) => { blocked.push("ads"); r.abort(); });
  const mock = { status: mockContact };
  if (mockContact) await p.route("**/api/contact", (r) => { results.push(["info", "payload", r.request().postData().slice(0, 400)]); r.fulfill({ status: mock.status, contentType: "application/json", body: mock.status === 200 ? '{"ok":true}' : '{"error":"x"}' }); });
  p.on("request", (r) => { const u = r.url(); if (/gtag\/js|gtm\.js|beacon\.min\.js|adsbygoogle\.js/.test(u)) loaded.push(u.split("?")[0].split("/").pop() + (u.includes("id=") ? "?" + u.split("id=")[1].split("&")[0] : "")); });
  return { ctx, p, hits, loaded, blocked, mock };
}
const ev = (hits, name) => hits.filter((h) => new URLSearchParams(h.split("?")[1]).getAll("en").includes(name) || h.includes(`en=${name}`));

// 1) Measured host: page view, tags, click-ID capture
{
  const s = await session(`http://ib-mentors.com`);
  await s.p.goto(`http://ib-mentors.com/?gclid=TEST-GCLID-123&utm_source=google&utm_medium=cpc&utm_campaign=qa-test`, { waitUntil: "load" });
  await s.p.waitForTimeout(5000);
  const measured = await s.p.evaluate(() => window.__msMeasure);
  const attr = await s.p.evaluate(() => localStorage.getItem("ms_attr_v1"));
  ok("guard: __msMeasure true on ib-mentors.com", measured === true);
  ok("gtag.js G-13MKYG4YL9 loaded", s.loaded.some((l) => l.includes("G-13MKYG4YL9")), s.loaded.join(" "));
  ok("gtm.js GTM-PBHMLWMQ loaded", s.loaded.some((l) => l.includes("GTM-PBHMLWMQ")));
  ok("adsbygoogle.js loaded", s.loaded.some((l) => l.includes("adsbygoogle")));
  ok("Cloudflare beacon.min.js loaded", s.loaded.some((l) => l.includes("beacon.min.js")));
  ok("GA4 page_view hit to G-13MKYG4YL9", ev(s.hits, "page_view").some((h) => h.includes("tid=G-13MKYG4YL9")), `${s.hits.length} hits`);
  ok("ms_attr_v1 holds gclid + campaign", !!attr && attr.includes("gclid:TEST-GCLID-123") && attr.includes("qa-test"), attr || "");
  const pv = ev(s.hits, "page_view").length;
  ok("exactly one page_view on load (no double count)", pv === 1, `page_view hits: ${pv}`);
  // 2) contact form, mocked 200 -> generate_lead
  await s.ctx.close();
}
{
  const s = await session(`http://ib-mentors.com`, { mockContact: 200 });
  await s.p.goto(`http://ib-mentors.com/?gclid=TEST-GCLID-123&utm_campaign=qa-test`, { waitUntil: "load" });
  await s.p.waitForTimeout(1500);
  await s.p.goto(`http://ib-mentors.com/contact`, { waitUntil: "load" });
  await s.p.waitForTimeout(2500);
  const f = s.p.locator('form[data-v="contact"]').first();
  await f.locator('input[name="Name"]').fill("QA test");
  await f.locator('input[name="Email "]').fill("qa@example.com");
  await f.locator('textarea[name="Message"]').fill("mocked submission");
  await f.locator('[type="submit"]').first().click();
  await s.p.waitForTimeout(1500);
  ok("mocked 200 shows the success state", /Thank you/i.test(await f.innerText()));
  // GA4 batches events (a few seconds, or on leaving the page): wait, then leave to flush the rest.
  await s.p.waitForTimeout(6000);
  await s.p.goto("about:blank");
  await s.p.waitForTimeout(1500);
  results.push(["info", "events sent", s.hits.map((h) => [...h.matchAll(/(?:^|[?&\n])en=([a-z_]+)/g)].map((m) => m[1]).join("+")).join(", ")]);
  const leads = ev(s.hits, "generate_lead");
  ok("generate_lead fired once on mocked 200", leads.length === 1, leads.map((h) => decodeURIComponent(h).match(/ep\.[a-z_]+=[^&]*/g)?.join(" ")).join(" | "));
  ok("generate_lead carries the gclid", leads.some((h) => decodeURIComponent(h).includes("gclid:TEST-GCLID-123")));
  await s.ctx.close();
}
// 3) mocked 503 -> error state, no generate_lead
{
  const s = await session(`http://ib-mentors.com`, { mockContact: 503 });
  await s.p.goto(`http://ib-mentors.com/become-mentor`, { waitUntil: "load" });
  await s.p.waitForTimeout(2500);
  const f = s.p.locator('form[data-v="become-mentor"]').first();
  await f.locator('input[name="Name"]').fill("QA test");
  await f.locator('input[name="Email "]').fill("qa@example.com");
  await f.locator('input[name="Phone number"]').fill("123");
  for (const sel of await f.locator("select").all()) { const v = await sel.locator("option").nth(1).getAttribute("value"); await sel.selectOption(v ?? { index: 1 }); }
  await f.locator('[type="submit"]').first().click();
  await s.p.waitForTimeout(2500);
  const text = await f.innerText();
  ok("503 shows the error state", /Something went wrong/i.test(text), text.replace(/\s+/g, " ").slice(-80));
  await s.p.waitForTimeout(5000);
  ok("no generate_lead on 503", ev(s.hits, "generate_lead").length === 0);
  // From Error the visitor can submit again; this time the API answers 200.
  s.mock.status = 200;
  await f.locator('[type="submit"]').first().click();
  await s.p.waitForTimeout(1500);
  ok("retry after error reaches success", /Thank you/i.test(await f.innerText()));
  await s.p.waitForTimeout(6000);
  await s.p.goto("about:blank");
  await s.p.waitForTimeout(1500);
  ok("retry fires generate_lead once", ev(s.hits, "generate_lead").length === 1);
  await s.ctx.close();
}
// 4) Unmeasured host: nothing sent
{
  const s = await session(`http://localhost:${PORT}`);
  await s.p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await s.p.waitForTimeout(4000);
  ok("localhost: no GA4 hits, no GTM, no beacon", s.hits.length === 0 && !s.loaded.some((l) => /GTM-|beacon/.test(l)), `${s.hits.length} hits; loaded ${s.loaded.join(" ")}`);
  await s.ctx.close();
}
for (const r of results) console.log(r.join("  "));
await b.close();
