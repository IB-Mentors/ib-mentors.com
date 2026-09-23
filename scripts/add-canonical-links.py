#!/usr/bin/env python3
"""Add missing <link rel="canonical"> tags where og:url exists but canonical is missing.

Second half of the metadata post-export hook: `fix-og-tags.py` guarantees every
mirrored page has a correct og:url, and this mirrors it into a canonical link on
the pages Framer shipped without one (its cold render drops canonical entirely,
and the /404 page never has one). Run from anywhere; paths resolve relative to
the repo root. Idempotent — pages that already have a canonical link are skipped.
"""
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

EXCLUDE_DIRS = {".git", "node_modules", "scripts", ".github"}

fixed = 0
for f in sorted(REPO_ROOT.glob("**/*.html")):
    rel = f.relative_to(REPO_ROOT)
    if EXCLUDE_DIRS.intersection(rel.parts[:-1]):
        continue

    html = f.read_text(encoding="utf-8")

    if '<link rel="canonical"' in html:
        continue

    m = re.search(r'"og:url" content="([^"]*)"', html)
    if not m:
        print(f"    SKIP {rel}: no og:url found")
        continue

    canonical_url = m.group(1)
    old_tag = f'<meta property="og:url" content="{canonical_url}">'
    new_tag = (
        f'<link rel="canonical" href="{canonical_url}">'
        f'<meta property="og:url" content="{canonical_url}">'
    )

    if old_tag in html:
        f.write_text(html.replace(old_tag, new_tag), encoding="utf-8")
        fixed += 1
    else:
        print(f"    SKIP {rel}: tag format mismatch")

print(f"    added canonical link to {fixed} page(s)")
