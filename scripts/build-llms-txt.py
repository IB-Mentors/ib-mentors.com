#!/usr/bin/env python3
"""Generate /llms.txt from the mirrored pages.

llms.txt (llmstxt.org) is the plain-text index an AI assistant reads when it is
asked about a site: one file, every route, each with the one-line description
that page actually carries. It is the cheapest way for this site to be
described accurately by an assistant instead of guessed at from scraped HTML.

Generated rather than hand-written, so publishing a new blog post or course in
Framer puts it in llms.txt on the next export with no code change. It reads the
titles and descriptions back out of the mirrored pages, which means it can
never contradict what fix-og-tags.py settled — and, like inject-jsonld.py, it
must therefore run after it.
"""

from __future__ import annotations

import html as htmllib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://ib-mentors.com"

EXCLUDE_DIRS = {".git", "node_modules", "scripts", ".github"}
SKIP_ROUTES = {"/404"}

HEADER = """# IBメンター (IB Mentors)

> IBディプロマ（DP）を修了したメンターが、学習計画の設計からIA・EE・TOK対策、\
科目別の試験対策までを完全オンラインで伴走する、日本語のIB専門サポートサービスです。\
運営は東京都世田谷区。問い合わせと無料相談はLINEまたはフォームから受け付けています。

An online International Baccalaureate mentoring service for students in Japan,
delivered in Japanese by mentors who completed the IB Diploma themselves.
Support covers study planning, IA, EE, TOK and subject exam preparation.

- 連絡先 / Contact: support@ib-mentors.com
- 無料相談 / Free consultation: https://ib-mentors.com/contact
"""

SECTIONS = [
    ("メインページ / Main pages", ["/", "/courses", "/blogs", "/teams", "/faq",
                                   "/contact", "/become-mentor"]),
    ("コース / Courses", "/courses/"),
    ("メンター / Mentors", "/teams/"),
    ("ブログ / Blog", "/blogs/"),
]


def read(route: str) -> tuple[str, str] | None:
    rel = "index.html" if route == "/" else route.lstrip("/") + "/index.html"
    path = ROOT / rel
    if not path.is_file():
        return None
    html = path.read_text(encoding="utf-8", errors="surrogateescape")

    def grab(*patterns: str) -> str:
        for p in patterns:
            m = re.search(p, html, re.I)
            if m:
                return re.sub(r"\s+", " ", htmllib.unescape(m.group(1))).strip()
        return ""

    title = grab(r'<meta\s+property="og:title"\s+content="([^"]+)"',
                 r"<title[^>]*>([^<]+)</title>")
    desc = grab(r'<meta\s+name="description"\s+content="([^"]+)"')
    return (title, desc) if title else None


def routes() -> list[str]:
    out = []
    for page in sorted(ROOT.glob("**/index.html")):
        parts = page.relative_to(ROOT).parts[:-1]
        if EXCLUDE_DIRS.intersection(parts):
            continue
        rel = page.relative_to(ROOT).as_posix()
        route = "/" if rel == "index.html" else "/" + rel[: -len("/index.html")]
        if route not in SKIP_ROUTES:
            out.append(route)
    return out


def main() -> int:
    known = routes()
    lines = [HEADER]
    listed: set[str] = set()

    for heading, spec in SECTIONS:
        if isinstance(spec, list):
            members = [r for r in spec if r in known]
        else:
            members = sorted(r for r in known
                             if r.startswith(spec) and r.count("/") == 2)
        members = [r for r in members if r not in listed]
        if not members:
            continue
        lines.append(f"\n## {heading}\n")
        for route in members:
            got = read(route)
            if not got:
                continue
            title, desc = got
            listed.add(route)
            url = SITE + "/" if route == "/" else SITE + route
            lines.append(f"- [{title}]({url})" + (f": {desc}" if desc else ""))

    leftover = [r for r in known if r not in listed]
    if leftover:
        lines.append("\n## その他 / Other\n")
        for route in leftover:
            got = read(route)
            if not got:
                continue
            title, desc = got
            url = SITE + route
            lines.append(f"- [{title}]({url})" + (f": {desc}" if desc else ""))

    text = "\n".join(lines).rstrip() + "\n"
    out = ROOT / "llms.txt"
    if not out.is_file() or out.read_text(encoding="utf-8") != text:
        out.write_text(text, encoding="utf-8")
        print(f"    llms.txt written ({len(listed)} route(s))")
    else:
        print(f"    llms.txt unchanged ({len(listed)} route(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
