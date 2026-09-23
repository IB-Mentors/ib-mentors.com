#!/usr/bin/env python3
"""Inject the Google AdSense loader into every mirrored page.

Runs from export.sh on every re-export, so a fresh Framer mirror can never
silently drop the ad code — which is what would have happened to the loader
that was pasted into index.html by hand. Same shape as inject-analytics.py: a
marker makes it idempotent, and it walks the same mirrored pages.

Why this is NOT a tag-manager tag:

  adsbygoogle.js is an ad-serving library, not a measurement tag. Auto ads need
  it parsed in <head> on first paint to pick slots before the page settles, and
  AdSense's own crawler reads the raw HTML when it reviews a site. Loading it
  through a container would put it behind gtm.js and cost both.

Ownership verification is handled by /ads.txt, a checked-in static file at the
repo root rather than anything this script generates.
"""

import os
import re
import sys

# --- configuration ---------------------------------------------------------
# AdSense publisher: Kelin Studio account, site ib-mentors.com (see ads.txt).
PUB_ID = "ca-pub-8631844190242419"

MARKER = "<!-- Google AdSense (ib-mentors.com) -->"

# The loader that was pasted into index.html by hand, before this script
# existed. Unmarked, so it has to be matched by src rather than by marker.
HANDWRITTEN = re.compile(
    r'\s*<script[^>]*src="https://pagead2\.googlesyndication\.com/pagead/js/'
    r'adsbygoogle\.js\?client=[^"]*"[^>]*>\s*</script>',
    re.S,
)

PRUNE_DIRS = {".git", "node_modules", "scripts", ".github"}
# ---------------------------------------------------------------------------


def head_snippet() -> str:
    return (
        MARKER + "\n"
        '<script async src="https://pagead2.googlesyndication.com/pagead/js/'
        'adsbygoogle.js?client=' + PUB_ID + '" crossorigin="anonymous"></script>\n'
    )


def process(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    original = html

    if MARKER in html:
        status = "already tagged"
    else:
        # Drop any hand-pasted loader first; two copies would both request ads.
        html = HANDWRITTEN.sub("", html)

        # Insert after the measurement block when it is present so measurement
        # still wins the first slot in <head>; otherwise fall back to <head>.
        cut = -1
        for tag in ("<!-- Google Tag Manager (ib-mentors.com) -->",
                    "<!-- GA4 (ib-mentors.com) -->"):
            i = html.find(tag)
            if i == -1:
                continue
            # Consume the whitespace-separated run of <script> blocks the
            # measurement injector wrote, and insert after the last of them.
            j = i + len(tag)
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
            cut = j
            break

        if cut != -1:
            html = html[:cut] + "\n" + head_snippet() + html[cut:]
            status = "tagged"
        else:
            html, n = re.subn(
                r"(<head[^>]*>)", r"\1\n" + head_snippet(), html, count=1,
                flags=re.IGNORECASE,
            )
            if n != 1:
                return "no <head>"
            status = "tagged"

    if html != original:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
    return status


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

    print("  AdSense (%s) ensured on all pages." % PUB_ID)
    if tagged:
        print("    %d page(s) newly tagged." % tagged)
    if skipped:
        print("    %d file(s) skipped (no <head>)." % skipped)
    return 0


if __name__ == "__main__":
    sys.exit(main())
