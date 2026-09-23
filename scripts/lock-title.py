#!/usr/bin/env python3
"""Keep the title we wrote after Framer's runtime hydrates the page.

The problem this solves
-----------------------
fix-og-tags.py writes a unique <title> into the served HTML. On some routes
Framer's client bundle then overwrites document.title with the project's
site-wide default once it hydrates. Measured on this site:

    /contact   served "お問い合わせ | IBメンター"
               after hydration "IBメンター | IBを勝ち抜くためのオンラインサービス"
    /courses   served and rendered title both survive

A crawler that renders JavaScript (Google does) sees the hydrated DOM, so on
the affected routes the generic title wins and the per-page title we wrote
never counts. The served HTML alone is not enough.

The fix
-------
A ~300 byte inline script placed immediately after </title>, so it reads the
intended title straight from the document. It restores that title whenever
something else changes it, and then gets out of the way:

  * it stops as soon as the path changes, so a client-side navigation inside
    Framer's own router is free to set whatever title that route wants;
  * it disconnects after 10 seconds, well past hydration, so nothing of ours
    is still running while someone reads the page.

Idempotent: a marker means a second run rewrites nothing.
"""

import os
import re
import sys

MARKER = "<!-- Title lock (ib-mentors.com) -->"

PRUNE_DIRS = {".git", "node_modules", "scripts", ".github"}

SNIPPET = (
    MARKER + "\n"
    "<script>(function(){var t=document.title,p=location.pathname;"
    "function f(){if(location.pathname!==p){o.disconnect();return;}"
    "if(document.title!==t){document.title=t;}}"
    "var o=new MutationObserver(f);"
    "o.observe(document.head,{subtree:true,childList:true,characterData:true});"
    "addEventListener('load',f);"
    "setTimeout(function(){o.disconnect();},10000);})();</script>\n"
)


def process(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    if MARKER in html:
        return "already locked"

    # Must sit AFTER the title element: it reads document.title to learn what
    # to hold. Anywhere earlier and it would capture an empty string.
    new, n = re.subn(r"(</title>)", r"\1\n" + SNIPPET, html, count=1, flags=re.IGNORECASE)
    if n != 1:
        return "no <title>"

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new)
    return "locked"


def iter_html(root="."):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in PRUNE_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def main() -> int:
    locked = skipped = 0
    for path in iter_html("."):
        status = process(path)
        if status == "locked":
            locked += 1
        elif status == "no <title>":
            skipped += 1
    print(f"    title lock ensured on all pages ({locked} newly locked)")
    if skipped:
        print(f"    {skipped} file(s) skipped (no <title>)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
