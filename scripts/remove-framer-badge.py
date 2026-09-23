#!/usr/bin/env python3
"""Remove Framer's exported branding badge without rewriting page markup."""

from __future__ import annotations

import re
import sys
from pathlib import Path

BADGE_OPEN = re.compile(
    r'<div\b[^>]*\s+id\s*=\s*(["\'])__framer-badge-container\1[^>]*>', re.IGNORECASE
)
DIV_TAG = re.compile(r'</?div\b[^>]*>', re.IGNORECASE)


def remove_badge(html: str) -> tuple[str, int]:
    removed = 0

    while match := BADGE_OPEN.search(html):
        depth = 1
        for tag in DIV_TAG.finditer(html, match.end()):
            depth += -1 if tag.group().startswith("</") else 1
            if depth == 0:
                start, end = match.start(), tag.end()
                line_start = html.rfind("\n", 0, start) + 1
                line_end = html.find("\n", end)
                if html[line_start:start].strip() == "":
                    start = line_start
                if line_end != -1 and html[end:line_end].strip() == "":
                    end = line_end + 1
                html = html[:start] + html[end:]
                removed += 1
                break
        else:
            raise ValueError("Framer badge container has no matching closing </div>")

    return html, removed


def main(paths: list[str]) -> int:
    total = 0
    for name in paths:
        path = Path(name)
        html = path.read_text(encoding="utf-8")
        cleaned, removed = remove_badge(html)
        if removed:
            path.write_text(cleaned, encoding="utf-8")
            total += removed
    print(f"Removed {total} Framer badge container(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
