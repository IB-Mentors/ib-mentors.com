import {
  ADSENSE_CLIENT,
  CF_BEACON_LOADER,
  CLARITY_LOADER,
  GA4_MEASUREMENT_ID,
  GTAG_INIT,
  GTM_CONTAINER_ID,
  GTM_LOADER,
  MEASUREMENT_GUARD,
} from "@/lib/measurement";

/* The tags, server-rendered so they are in the initial HTML (Google's tag checker, Search Console and the
   AdSense reviewer read raw HTML). Script ids are never "clarity"/"posthog"/"gtag": an element id shadows the
   window global of the same name.

   Where each one sits, and why:
   - <head>: only the two external loaders (gtag.js, adsbygoogle.js). React 19 hoists async src scripts as
     resources and never hydrates them by position.
   - Start of <body>: the inline scripts (guard first, then GTM, gtag init, beacon). adsbygoogle.js inserts its
     show_ads_impl script before the first <script> of the document, which is in <head>. Inline scripts in <head>
     are hydrated by position, so that inserted node was matched against ibm-guard and every route logged a
     hydration mismatch. In <body> nothing is inserted ahead of them. The guard still runs before any config: the
     gtag.js loader only queues until GTAG_INIT runs. */
export function MeasurementHead() {
  return (
    <>
      {GA4_MEASUREMENT_ID && <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} />}
      {ADSENSE_CLIENT && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}

/** First thing in <body>: GTM's <noscript> fallback, then the inline tags in the order they must run. */
export function MeasurementBodyStart() {
  return (
    <>
      {GTM_CONTAINER_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      <script id="ibm-guard" dangerouslySetInnerHTML={{ __html: MEASUREMENT_GUARD }} />
      {GTM_LOADER && <script id="ibm-gtm" dangerouslySetInnerHTML={{ __html: GTM_LOADER }} />}
      {GA4_MEASUREMENT_ID && <script id="ibm-gtag" dangerouslySetInnerHTML={{ __html: GTAG_INIT }} />}
      {CLARITY_LOADER && <script id="ibm-clarity" dangerouslySetInnerHTML={{ __html: CLARITY_LOADER }} />}
      {CF_BEACON_LOADER && <script id="ibm-cf-beacon" dangerouslySetInnerHTML={{ __html: CF_BEACON_LOADER }} />}
    </>
  );
}
