// Head tags per route: production (the static mirror on https://ib-mentors.com) vs ours.
//   node qa/seo-check.mjs            (OURS_URL default http://localhost:3410, PROD_URL default https://ib-mentors.com)
// Compares <title>, description, robots, canonical, og:*, twitter:* and the JSON-LD @types. Intended JSON-LD
// differences (FAQPage on /faq, parentOrganization + founder on /) are reported as notes, not failures.
import { readFileSync } from "node:fs";
const OURS = (process.env.OURS_URL || "http://localhost:3410").replace(/\/$/, "");
const PROD = (process.env.PROD_URL || "https://ib-mentors.com").replace(/\/$/, "");
const routes = readFileSync("qa/framer/routes.txt", "utf8").split("\n").filter(Boolean);
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
function tags(html) {
  const head = html.slice(0, html.indexOf("</head>") > 0 ? html.indexOf("</head>") : 200000);
  const out = {};
  const t = head.match(/<title[^>]*>([^<]*)<\/title>/);
  out.title = t ? dec(t[1]).trim() : null;
  for (const m of head.matchAll(/<meta\s+([^>]+?)\/?>/g)) {
    const a = Object.fromEntries([...m[1].matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)].map((x) => [x[1].toLowerCase(), dec(x[2])]));
    const k = a.name || a.property;
    if (k && /^(description|robots|og:|twitter:)/.test(k)) out[k] = a.content;
  }
  const c = head.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  out.canonical = c ? c[1] : null;
  const types = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      for (const n of j["@graph"] || [j]) types.push(n["@type"]);
    } catch { types.push("PARSE_ERROR"); }
  }
  out.jsonld = types.join(",");
  return out;
}
let bad = 0;
for (const r of routes) {
  const [a, b] = await Promise.all([PROD + r, OURS + r].map((u) => fetch(u).then(async (res) => [res.status, await res.text()])));
  const ta = tags(a[1]), tb = tags(b[1]);
  const keys = [...new Set([...Object.keys(ta), ...Object.keys(tb)])].filter((k) => k !== "og:type" || ta[k]);
  const diffs = keys.filter((k) => ta[k] !== tb[k]);
  const notes = [];
  if (diffs.includes("jsonld") && ((r === "/faq" && tb.jsonld === "FAQPage") )) { diffs.splice(diffs.indexOf("jsonld"), 1); notes.push("jsonld +FAQPage (intended)"); }
  const statusOk = a[0] === b[0];
  if (diffs.length || !statusOk) bad++;
  console.log(`${diffs.length || !statusOk ? "DIFF" : "ok  "} ${r.padEnd(48)} ${a[0]}/${b[0]} ${notes.join(" ")}`);
  for (const k of diffs) console.log(`       ${k}\n         prod: ${ta[k]}\n         ours: ${tb[k]}`);
}
console.log(`${routes.length - bad}/${routes.length} routes match`);
