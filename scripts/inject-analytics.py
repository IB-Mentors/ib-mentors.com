#!/usr/bin/env python3
"""Inject measurement into every mirrored page.

Why this exists
---------------
Framer exports carry no analytics. The GA4 tag for this site used to be pasted
by hand into index.html, which meant two things: it only ever covered the
homepage, and the next re-export would silently delete it. Injecting on every
export is what makes measurement survive a re-export.

Two modes, chosen by GTM_ID below
---------------------------------
  GTM_ID set   -> inject the Google Tag Manager container, and strip the inline
                  GA4 block this supersedes so a page can never carry both and
                  double-count. Tag changes then become a GTM publish, not a
                  code change plus a re-export plus a deploy. This is how
                  kelin.studio does it.
  GTM_ID empty -> inject the site's own GA4 tag directly. This is a deliberate
                  fallback, not a default to settle for: it keeps measurement
                  alive until the IB Mentors container exists. Set GTM_ID and
                  the next export migrates every page in one go.

Idempotent: a marker means a second run rewrites nothing.
"""

import os
import re
import sys

# --- configuration ---------------------------------------------------------
# IB Mentors' own GTM container. Create it under the IB Mentors GTM account
# (do NOT reuse kelin.studio's GTM-NMR9PNN9 — that would mix a client property
# into Kelin's container and its conversion tags), then paste the ID here.
GTM_ID = ""                      # e.g. "GTM-XXXXXXX"

# Direct GA4 property for ib-mentors.com, used while GTM_ID is empty. Once the
# container is live this should be configured as a tag INSIDE it, not here.
GA4_ID = "G-13MKYG4YL9"

GTM_MARKER = "<!-- Google Tag Manager (ib-mentors.com) -->"
GA4_MARKER = "<!-- GA4 (ib-mentors.com) -->"

PRUNE_DIRS = {".git", "node_modules", "scripts", ".github"}
# ---------------------------------------------------------------------------


def gtm_head() -> str:
    return (
        GTM_MARKER + "\n"
        "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push("
        "{'gtm.start':new Date().getTime(),event:'gtm.js'});"
        "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),"
        "dl=l!='dataLayer'?'&l='+l:'';j.async=true;"
        "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;"
        "f.parentNode.insertBefore(j,f);})"
        "(window,document,'script','dataLayer','" + GTM_ID + "');</script>\n"
    )


def gtm_body() -> str:
    return (
        "\n<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id="
        + GTM_ID
        + "\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\">"
        "</iframe></noscript>"
    )


def ga4_head() -> str:
    return (
        GA4_MARKER + "\n"
        '<script async src="https://www.googletagmanager.com/gtag/js?id='
        + GA4_ID + '"></script>\n'
        "<script>window.dataLayer=window.dataLayer||[];"
        "function gtag(){dataLayer.push(arguments);}"
        "gtag('js',new Date());gtag('config','" + GA4_ID + "');</script>\n"
    )


def strip_marked_block(html: str, marker: str) -> tuple[str, int]:
    """Remove `marker` and the <script> blocks that immediately follow it.

    Our injectors always write the marker followed by one or more
    <script>...</script> tags separated only by whitespace, so consuming that
    run is exact — it cannot eat unrelated markup further down the page.
    """
    removed = 0
    while True:
        i = html.find(marker)
        if i == -1:
            break
        j = i + len(marker)
        while True:
            k = j
            while k < len(html) and html[k] in " \t\r\n":
                k += 1
            if not html.startswith("<script", k):
                break
            end = html.find("</script>", k)
            if end == -1:
                break
            j = end + len("</script>")
        html = html[:i] + html[j:]
        removed += 1
    return html, removed


def strip_handwritten_ga4(html: str) -> tuple[str, int]:
    """Remove a hand-pasted gtag.js pair that carries no marker of ours.

    The pre-pipeline homepage had exactly this: an unmarked
    `<script async src=".../gtag/js?id=G-...">` followed by the inline
    gtag() config block. Left in place next to an injected tag it would
    double-count every pageview.
    """
    pattern = re.compile(
        r'\s*<script[^>]*src="https://www\.googletagmanager\.com/gtag/js\?id=[^"]*"[^>]*>'
        r"\s*</script>\s*<script>[^<]*?gtag\(\s*['\"]config['\"][^<]*?</script>",
        re.S,
    )
    html, n = pattern.subn("", html)
    return html, n


def process(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    original = html
    notes = []

    # Always clear hand-pasted GA4 first — it is never the source of truth.
    html, n = strip_handwritten_ga4(html)
    if n:
        notes.append("%d hand-pasted GA4 block(s) removed" % n)

    if GTM_ID:
        html, n = strip_marked_block(html, GA4_MARKER)
        if n:
            notes.append("inline GA4 superseded by GTM")
        marker, head, body = GTM_MARKER, gtm_head(), gtm_body()
    else:
        html, n = strip_marked_block(html, GTM_MARKER)
        if n:
            notes.append("GTM removed (GTM_ID unset)")
        marker, head, body = GA4_MARKER, ga4_head(), None

    if marker in html:
        status = "already tagged"
    else:
        # Insert after <meta charset> when present, so the declaration keeps
        # its place at the very top of <head>; otherwise straight after <head>.
        html, n = re.subn(
            r"(<meta[^>]*charset[^>]*>)", r"\1\n" + head, html, count=1,
            flags=re.IGNORECASE,
        )
        if n != 1:
            html, n = re.subn(
                r"(<head[^>]*>)", r"\1\n" + head, html, count=1,
                flags=re.IGNORECASE,
            )
        if n != 1:
            return "no <head>"
        status = "tagged"
        if body:
            html, m = re.subn(
                r"(<body[^>]*>)", r"\1" + body, html, count=1, flags=re.IGNORECASE
            )
            if m != 1:
                status = "tagged (head only, no <body>)"

    if html != original:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)

    return status + ("; " + ", ".join(notes) if notes else "")


def iter_html(root="."):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in PRUNE_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def main() -> int:
    tagged = skipped = cleaned = 0
    for path in iter_html("."):
        status = process(path)
        if status == "no <head>":
            skipped += 1
        elif status.startswith("tagged"):
            tagged += 1
        if ";" in status:
            cleaned += 1

    if GTM_ID:
        print("  GTM (%s) ensured on all pages." % GTM_ID)
    else:
        print("  GTM_ID is unset in scripts/inject-analytics.py.")
        print("  Falling back to the direct GA4 tag (%s) on all pages." % GA4_ID)
    if tagged:
        print("    %d page(s) newly tagged." % tagged)
    if cleaned:
        print("    %d page(s) had superseded tags removed." % cleaned)
    if skipped:
        print("    %d file(s) skipped (no <head>)." % skipped)
    return 0


if __name__ == "__main__":
    sys.exit(main())
