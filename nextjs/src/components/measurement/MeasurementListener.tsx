"use client";

import { useEffect } from "react";
import { CTA_PATHS, LINE_HOSTS, captureAttribution, track, trackConversion } from "@/lib/measurement";

/* Site-wide click instrumentation: one delegated listener in the capture phase (so a component's
   stopPropagation cannot hide a click) covers every current and future link without per-component wiring.

     contact_click   LINE (lin.ee / line.me), mailto:, tel:    conversion
     cta_click       an internal link to /contact               funnel signal

   Outbound clicks, scrolls and file downloads are already reported by GA4 enhanced measurement. Form
   submissions are tracked by the form itself once the API answers 200 (trackConversion("generate_lead")). */

function labelFor(el: HTMLElement): string {
  const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
  // Animated buttons render their label twice (one copy slides in on hover).
  const half = text.length / 2;
  const once = Number.isInteger(half) && text.slice(0, half) === text.slice(half) ? text.slice(0, half) : text;
  return once.slice(0, 80);
}

function onClick(e: MouseEvent) {
  const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a) return;
  let url: URL;
  try {
    url = new URL(a.href, window.location.href);
  } catch {
    return;
  }
  const label = labelFor(a);
  const page = window.location.pathname;
  if (LINE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
    trackConversion("contact_click", { method: "line", link_url: url.origin + url.pathname, cta_text: label, page });
  } else if ((url.protocol === "mailto:" && url.pathname.trim()) || url.protocol === "tel:") {
    trackConversion("contact_click", { method: url.protocol === "mailto:" ? "email" : "phone", cta_text: label, page });
  } else if (url.hostname === window.location.hostname && CTA_PATHS.some((p) => url.pathname.replace(/\/$/, "") === p)) {
    track("cta_click", { cta_text: label, cta_dest: url.pathname, page });
  }
}

export function MeasurementListener() {
  useEffect(() => {
    captureAttribution();
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
