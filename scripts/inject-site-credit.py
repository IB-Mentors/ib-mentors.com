#!/usr/bin/env python3
"""Add the "Site by Kelin Studio" credit under the footer of every mirrored page.

Runs from export.sh on every re-export: anything pasted into a page by hand is
wiped by the next mirror, so the credit has to be injected like the tags are.

Where it goes: immediately after Framer's `<div id="main">` closes, so it sits
directly under the footer but OUTSIDE the React tree Framer hydrates. Putting
it inside Framer's footer markup would be a hydration mismatch, and React would
either throw it away or log errors on every page view. Outside #main it is
plain static HTML that nothing rewrites.

How it looks: a thin band in the footer's own colour (the Framer token, with
the same literal fallback the footer uses), small muted text, centred, so it
reads as the footer's last line rather than a new section. One link, the brand
name only, to https://kelin.studio.

Idempotent: a marker comment is checked first, so a second run changes nothing.
"""

from __future__ import annotations

import os
import re
import sys

MARKER = "<!-- Site credit (Kelin Studio) -->"

PRUNE_DIRS = {".git", "node_modules", "scripts", ".github"}

FOOTER_BG = "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"

CREDIT = (
    MARKER
    + '<div class="kelin-site-credit" style="background:' + FOOTER_BG + ';'
    "color:rgba(255, 255, 255, 0.45);text-align:center;padding:0 16px 20px;"
    "font-family:&quot;Instrument Sans&quot;, &quot;Instrument Sans Placeholder&quot;, sans-serif;"
    'font-size:12px;line-height:1.6;letter-spacing:0.02em">'
    "Site by "
    '<a href="https://kelin.studio" style="color:rgba(255, 255, 255, 0.65);'
    'text-decoration:none">Kelin Studio</a>'
    "</div>"
)

MAIN_OPEN = re.compile(r'<div\b[^>]*\sid\s*=\s*(["\'])main\1[^>]*>', re.IGNORECASE)
DIV_TAG = re.compile(r"</?div\b[^>]*>", re.IGNORECASE)


def insert_credit(html: str) -> tuple[str, str]:
    if MARKER in html:
        return html, "already credited"

    match = MAIN_OPEN.search(html)
    if match:
        depth = 1
        for tag in DIV_TAG.finditer(html, match.end()):
            depth += -1 if tag.group().startswith("</") else 1
            if depth == 0:
                return html[: tag.end()] + CREDIT + html[tag.end() :], "after #main"

    # No Framer root found: fall back to the end of <body>.
    i = html.lower().rfind("</body>")
    if i == -1:
        return html, "skipped: no #main and no </body>"
    return html[:i] + CREDIT + "\n" + html[i:], "before </body>"


def pages(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in PRUNE_DIRS]
        for name in filenames:
            if name.endswith(".html"):
                yield os.path.join(dirpath, name)


def main(argv: list[str]) -> int:
    targets = argv[1:] or sorted(pages("."))
    for path in targets:
        with open(path, encoding="utf-8") as fh:
            html = fh.read()
        new, status = insert_credit(html)
        if new != html:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new)
        print(f"{path}: {status}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
