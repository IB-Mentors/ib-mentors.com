/* Site measurement for ib-mentors.com: which tags load, where, and the events the code sends them.
   Same house pattern as oglabs.io (Fruition-Service/oglabs-website-monorepo/nextjs/src/lib/measurement.ts).

   What production (the static mirror, scripts/inject-*.py) carries today, and where it lives here:
   - GA4 G-13MKYG4YL9, loaded directly with gtag.js (inject-analytics.py).                 -> GA4_MEASUREMENT_ID
   - GTM-PBHMLWMQ: not in the mirror. Loaded here, empty (see GTM_CONTAINER_ID).           -> GTM_CONTAINER_ID
   - AdSense ca-pub-8631844190242419 in <head> on every page (inject-adsense.py). Not a
     measurement tag and not host-gated: the AdSense reviewer reads raw HTML.                -> ADSENSE_CLIENT
   - Cloudflare Web Analytics beacon, production hosts only (inject-cf-beacon.py).          -> CF_WEB_ANALYTICS_TOKEN
   - No Clarity, no PostHog, no Meta pixel.

   - Paid is decided by the click ID the ad platform appends (gclid, fbclid...), never by
     what utm_medium claims. A first-party copy of the click ID (ms_attr_v1) rides on every
     conversion event, so a lead can be traced to the click that bought it.
   - Only MEASURED_HOSTS report. localhost and preview deployments load the tags but send
     nothing, and say so once in the console.

   Every ID below is a public client-side value. Leave one empty to switch that tag off. */

export const MEASURED_HOSTS = ["ib-mentors.com", "www.ib-mentors.com"];

/* The site's own container in the "Kelin Studio" GTM account (edward.zhang@kelin.studio, created
   10 Sep 2026; not Kelin's GTM-NMR9PNN9, so nothing of Kelin's fires here). Checked 18 Oct 2026:
   gtm.js?id=GTM-PBHMLWMQ answers 200 with published version 1, which holds no tags, triggers or
   variables beyond the built-ins. So it is loaded (on MEASURED_HOSTS only), and a tag added in GTM
   later goes live with a publish, no deploy. GA4 stays direct (GTAG_INIT below) because the
   container does not fire G-13MKYG4YL9. If a GA4 Google tag for G-13MKYG4YL9 is ever added to the
   container, empty GA4_MEASUREMENT_ID in the same change, or every page_view counts twice. */
export const GTM_CONTAINER_ID = "GTM-PBHMLWMQ";

/* GA4 property for ib-mentors.com (personal "Edward" GA4 account per the Google estate audit). */
export const GA4_MEASUREMENT_ID = "G-13MKYG4YL9";

/* No Google Ads account for IB Mentors yet. When one exists, set its AW- ID here and map each
   conversion event to its label, e.g. { generate_lead: "AbC123..." }. */
const GOOGLE_ADS_TAG_ID = "";
const ADS_CONVERSION_LABELS: Record<string, string> = {};

/* Microsoft Clarity: none for this site. */
const CLARITY_PROJECT_ID = "";

/* Cloudflare Web Analytics site "ib-mentors.com", Kelin Studio Cloudflare account. The DNS
   record is grey-cloud to Vercel, so Cloudflare cannot inject the beacon itself. */
const CF_WEB_ANALYTICS_TOKEN = "92f77c51d67f4f1c815fe7d9113ca7a3";

/* AdSense publisher (Kelin Studio account). Ownership is public/ads.txt. */
export const ADSENSE_CLIENT = "ca-pub-8631844190242419";

/* Contact signals: the LINE official account is the primary conversion path on this site. */
export const LINE_HOSTS = ["lin.ee", "line.me"];
export const CTA_PATHS = ["/contact"];

/* Runs first in <head>, before any tag reads the URL. Decides whether this page is measured
   (window.__msMeasure) and strips UTMs that claim a paid medium without the click ID a real
   ad click carries. */
export const MEASUREMENT_GUARD = `(function(){
  var measured = ${JSON.stringify(MEASURED_HOSTS)}.indexOf(location.hostname) !== -1;
  window.__msMeasure = measured;
  window.__msAfterLoad = function(fn){
    if (document.readyState === 'complete') { setTimeout(fn, 0); return; }
    window.addEventListener('load', function(){ setTimeout(fn, 0); }, { once: true });
  };
  if (!measured && window.console) {
    console.info('[measurement] off: ' + location.hostname + ' is not in MEASURED_HOSTS (src/lib/measurement.ts).');
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ms_measured_host: measured });
  try {
    var p = new URLSearchParams(location.search);
    var medium = (p.get('utm_medium') || '').toLowerCase();
    var claimsPaid = ['cpc','ppc','paid','paidsearch','paid_search','paid_social','display','retargeting','cpm','cpv'].indexOf(medium) !== -1;
    var hasClickId = ['gclid','gbraid','wbraid','fbclid','ttclid','msclkid','li_fat_id','rdt_cid'].some(function(k){ return p.get(k); });
    if (claimsPaid && !hasClickId) {
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id'].forEach(function(k){ p.delete(k); });
      var q = p.toString();
      history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash);
    }
  } catch (e) { /* URL parsing must never break a page render. */ }
})();`;

export const GTM_LOADER = GTM_CONTAINER_ID
  ? `if (window.__msMeasure) (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`
  : "";

/* send_page_view stays on: nothing else sends the page_view (the GTM container has no GA4 tag). Enhanced measurement reports App
   Router navigations itself; a manual page_view on route change would double them. */
export const GTAG_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
if (window.__msMeasure) {
${[GA4_MEASUREMENT_ID, GOOGLE_ADS_TAG_ID].filter(Boolean).map((id) => `  gtag('config', '${id}');`).join("\n")}
}`;

export const CLARITY_LOADER = CLARITY_PROJECT_ID
  ? `if (window.__msMeasure) {
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
window.__msAfterLoad(function(){t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);});
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
}`
  : "";

export const CF_BEACON_LOADER = CF_WEB_ANALYTICS_TOKEN
  ? `if (window.__msMeasure) window.__msAfterLoad(function(){
  var s = document.createElement('script'); s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token": "${CF_WEB_ANALYTICS_TOKEN}"}');
  document.head.appendChild(s);
});`
  : "";

/* ---- First-party attribution ---------------------------------------------------------
   The click ID and campaign that brought the visitor in, kept 90 days in localStorage.
   First touch is written once; last touch follows each campaign landing. */

const ATTR_KEY = "ms_attr_v1";
const ATTR_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const CLICK_IDS = ["gclid", "wbraid", "gbraid", "fbclid", "li_fat_id", "msclkid", "ttclid", "rdt_cid"] as const;
const CLICK_ID_SOURCE: Record<(typeof CLICK_IDS)[number], string> = {
  gclid: "google", wbraid: "google", gbraid: "google", fbclid: "meta", li_fat_id: "linkedin",
  msclkid: "microsoft", ttclid: "tiktok", rdt_cid: "reddit",
};

type Touch = { source: string; medium: string; campaign?: string; term?: string; content?: string; click_id?: string; landing: string; at: string };
type Attribution = { first?: Touch; last?: Touch };

function readAttribution(): Attribution {
  try {
    const raw = window.localStorage.getItem(ATTR_KEY);
    if (!raw) return {};
    const a = JSON.parse(raw) as Attribution & { ts?: number };
    if (!a.ts || Date.now() - a.ts > ATTR_MAX_AGE_MS) return {};
    return a;
  } catch {
    return {};
  }
}

/** Call once per page load, before any conversion can fire. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const p = new URLSearchParams(window.location.search);
    const id = CLICK_IDS.find((k) => p.get(k));
    const campaign = p.get("utm_campaign") || undefined;
    const stored = readAttribution();
    if (!id && !campaign && stored.first) return;
    let source = "direct";
    let medium = "none";
    if (id) {
      source = CLICK_ID_SOURCE[id];
      medium = "cpc";
    } else if (p.get("utm_source")) {
      source = p.get("utm_source") as string;
      medium = p.get("utm_medium") || "referral";
    } else if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host !== window.location.hostname.replace(/^www\./, "")) {
        source = host;
        medium = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia)\./.test(host) ? "organic" : "referral";
      }
    }
    const touch: Touch = {
      source, medium, campaign,
      term: p.get("utm_term") || undefined,
      content: p.get("utm_content") || undefined,
      click_id: id ? `${id}:${p.get(id)}` : undefined,
      landing: window.location.pathname,
      at: new Date().toISOString(),
    };
    const next: Attribution = { first: stored.first ?? touch, last: id || campaign ? touch : stored.last ?? touch };
    window.localStorage.setItem(ATTR_KEY, JSON.stringify({ ...next, ts: Date.now() }));
  } catch {
    /* Private mode or blocked storage: attribution is a nice-to-have. */
  }
}

/** The click and campaign behind this visit as flat parameters, for GA4 events and lead payloads:
    click_id ("gclid:..."), ad_source / first_source ("google / cpc"), the last touch's utm_campaign,
    utm_term, utm_content and landing page, and the first touch's landing page. */
export function attributionParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const { first, last } = readAttribution();
  const out: Record<string, string> = {};
  if (last?.click_id) out.click_id = last.click_id.slice(0, 100);
  if (last) out.ad_source = `${last.source} / ${last.medium}`;
  if (last?.campaign) out.utm_campaign = last.campaign.slice(0, 100);
  if (last?.term) out.utm_term = last.term.slice(0, 100);
  if (last?.content) out.utm_content = last.content.slice(0, 100);
  if (last?.landing) out.landing_page = last.landing.slice(0, 100);
  if (first) out.first_source = `${first.source} / ${first.medium}`;
  if (first?.landing) out.first_landing_page = first.landing.slice(0, 100);
  return out;
}

/* ---- Events ------------------------------------------------------------------------------ */

type Gtag = (...args: unknown[]) => void;

/** Sends one GA4 event. No-op off MEASURED_HOSTS, and never throws. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __msMeasure?: boolean; gtag?: Gtag };
  if (!w.__msMeasure || typeof w.gtag !== "function") return;
  try {
    w.gtag("event", event, params);
  } catch {
    /* Instrumentation never breaks the action it measures. */
  }
}

/** A conversion: GA4 (mark the event as a key event) and, once GOOGLE_ADS_TAG_ID and a label
    are set, Google Ads, from the same call. Forms call trackConversion("generate_lead", {...})
    only after the API answered 200. */
export function trackConversion(event: string, params: Record<string, unknown> = {}) {
  const full = { ...params, ...attributionParams() };
  track(event, full);
  const label = ADS_CONVERSION_LABELS[event];
  if (GOOGLE_ADS_TAG_ID && label) track("conversion", { send_to: `${GOOGLE_ADS_TAG_ID}/${label}` });
}
