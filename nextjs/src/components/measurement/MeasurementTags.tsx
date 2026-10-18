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

/* The tags, server-rendered at the top of <head> so they are in the initial HTML (Google's tag
   checker, Search Console and the AdSense reviewer read raw HTML). The guard must stay first:
   every tag after it reads window.__msMeasure. Script ids are never "clarity"/"posthog"/"gtag":
   an element id shadows the window global of the same name. */
export function MeasurementHead() {
  return (
    <>
      <script id="ibm-guard" dangerouslySetInnerHTML={{ __html: MEASUREMENT_GUARD }} />
      {GTM_LOADER && <script id="ibm-gtm" dangerouslySetInnerHTML={{ __html: GTM_LOADER }} />}
      {GA4_MEASUREMENT_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} />
          <script id="ibm-gtag" dangerouslySetInnerHTML={{ __html: GTAG_INIT }} />
        </>
      )}
      {ADSENSE_CLIENT && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      )}
      {CLARITY_LOADER && <script id="ibm-clarity" dangerouslySetInnerHTML={{ __html: CLARITY_LOADER }} />}
      {CF_BEACON_LOADER && <script id="ibm-cf-beacon" dangerouslySetInnerHTML={{ __html: CF_BEACON_LOADER }} />}
    </>
  );
}

/** GTM's <noscript> fallback, first thing in <body> (renders nothing while GTM_CONTAINER_ID is empty). */
export function MeasurementBodyStart() {
  if (!GTM_CONTAINER_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
