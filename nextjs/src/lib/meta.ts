import type { Metadata } from "next";
import { BRAND, OG_IMAGE, SITE_URL } from "./site";
import { SEO, type SeoEntry } from "./seo-data";

// Per-route <title>, description, canonical, robots and Open Graph, following the convention the static mirror
// enforces (repo-root README, "The metadata convention"): <title> == og:title == twitter:title, description ==
// og:description == twitter:description, one shared og:image (/SocialPreview.png), canonical == og:url, noindex on
// /404 only. Values come from src/lib/seo-data.ts (a snapshot of the mirror, regenerate with `python3 qa/gen-seo.py`).
// A route missing from the snapshot (a new CMS entry) derives its tags from the fallback the caller passes, with the
// same section suffix scripts/fix-og-tags.py appends.

const SUFFIX = {
  blog: ` | ${BRAND} ブログ`,
  course: ` | ${BRAND} コース`,
  page: ` | ${BRAND}`,
} as const;

export function seoEntry(path: string): SeoEntry | undefined {
  return SEO[path];
}

export function pageMetadata(
  path: string,
  fallback?: { title: string; description?: string; kind?: keyof typeof SUFFIX },
): Metadata {
  const e = SEO[path];
  let title = e?.title ?? null;
  if (!title && fallback) {
    const sfx = SUFFIX[fallback.kind ?? "page"];
    title = fallback.title.endsWith(sfx) ? fallback.title : fallback.title + sfx;
  }
  title ??= BRAND;
  const description = e?.description ?? fallback?.description ?? undefined;
  const canonical = e?.canonical ?? SITE_URL + (path === "/" ? "/" : path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: process.env.SITE_NOINDEX === "1" ? { index: false, follow: false } : (e?.robots ?? "max-image-preview:large"),
    openGraph: { type: "website", title, description, url: canonical, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
