#!/usr/bin/env python3
"""Inject the Cloudflare Web Analytics beacon into every mirrored page.

Runs from export.sh on every re-export, so a fresh Framer mirror can never
silently drop it. Same shape as scripts/inject-adsense.py: a marker makes it
idempotent, and it walks the same mirrored pages with the same prune list.

Why the manual beacon: the ib-mentors.com record at Cloudflare is DNS-only
(grey cloud) pointing at Vercel, so Cloudflare never sees a visitor and cannot
inject the beacon itself. Proxying was tried and reverted (it broke Vercel geo
detection, added an SG to HKG hop and 403'd AI crawlers).

Why it is gated on the hostname: the same HTML is served by every Vercel
preview deploy and by a local `python3 -m http.server`, and none of those
should report as the live site. The gate lives in the page because this is a
static mirror with no server to decide per request. The beacon is cookieless,
so it sits outside any consent gate.
"""

import os
import re
import sys

# --- configuration ---------------------------------------------------------
# Web Analytics site "ib-mentors.com" in the Kelin Studio Cloudflare account.
TOKEN = "92f77c51d67f4f1c815fe7d9113ca7a3"

# Hosts that count as production. www 308s to the apex (vercel.json), so it
# never serves a page today; it is listed so a redirect change cannot go dark.
HOSTS = ("ib-mentors.com", "www.ib-mentors.com")

MARKER = "<!-- Cloudflare Web Analytics (ib-mentors.com) -->"

PRUNE_DIRS = {".git", "node_modules", "scripts", ".github"}
# ---------------------------------------------------------------------------


def head_snippet() -> str:
    hosts = ",".join('"%s"' % h for h in HOSTS)
    return (
        MARKER + "\n"
        "<script>(function(){if([" + hosts + "].indexOf(location.hostname)<0)return;"
        'var s=document.createElement("script");s.defer=true;'
        's.src="https://static.cloudflareinsights.com/beacon.min.js";'
        "s.setAttribute(\"data-cf-beacon\",'{\"token\": \"" + TOKEN + "\"}');"
        "document.head.appendChild(s);})();</script>\n"
    )


def process(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    if MARKER in html:
        return "already tagged"

    # Insert after the AdSense block, else the measurement block, so the tags
    # that need first paint keep the top of <head>; otherwise <head> itself.
    for anchor in (
        "<!-- Google AdSense (ib-mentors.com) -->",
        "<!-- Google Tag Manager (ib-mentors.com) -->",
        "<!-- GA4 (ib-mentors.com) -->",
    ):
        i = html.find(anchor)
        if i == -1:
            continue
        # Consume the whitespace-separated run of <script> blocks that the
        # anchor's injector wrote, and insert after the last of them.
        j = i + len(anchor)
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
        html = html[:j] + "\n" + head_snippet().rstrip("\n") + html[j:]
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
        return "tagged"

    html, n = re.subn(
        r"(<head[^>]*>)", r"\1\n" + head_snippet(), html, count=1, flags=re.IGNORECASE
    )
    if n != 1:
        return "no <head>"

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(html)
    return "tagged"


def iter_html(root="."):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in PRUNE_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def main() -> int:
    tagged = skipped = 0
    for path in iter_html("."):
        status = process(path)
        if status == "no <head>":
            skipped += 1
        elif status == "tagged":
            tagged += 1

    print("  Cloudflare Web Analytics ensured on all pages.")
    if tagged:
        print("    %d page(s) newly tagged." % tagged)
    if skipped:
        print("    %d file(s) skipped (no <head>)." % skipped)
    return 0


if __name__ == "__main__":
    sys.exit(main())
