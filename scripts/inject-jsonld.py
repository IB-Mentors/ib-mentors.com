#!/usr/bin/env python3
"""Inject JSON-LD structured data into every mirrored page.

Why this exists
---------------
Framer exports carry no structured data, so ib-mentors.com served ZERO
machine-readable description of itself. A crawler, an AI assistant or a
rich-result pipeline could read the Japanese copy but had nothing saying that
this is a tutoring service, what the four courses cost, who the mentors are, or
when a blog post was published.

What it emits, chosen by route
------------------------------
  /                   EducationalOrganization + WebSite
  /courses/<slug>     Course (with its price) + BreadcrumbList
  /blogs/<slug>       BlogPosting (with datePublished) + BreadcrumbList
  /teams/<slug>       Person + BreadcrumbList
  /courses,/blogs,/teams  CollectionPage
  /contact            ContactPage
  /faq                FAQPage, but ONLY when every question on the page has its
                      answer in the served HTML. See the note in faq_entries().
  everything else     nothing, deliberately

Marking a page up as something it is not is worse than leaving it bare, so
/become-mentor and /404 get nothing.

Titles, descriptions and canonicals are read back out of each page's own meta
tags rather than re-derived, so this cannot disagree with what fix-og-tags.py
already settled. That is also why export.sh runs this AFTER fix-og-tags.py and
add-canonical-links.py: those two guarantee the tags exist.

Idempotent: a second run replaces its own block rather than stacking another.
"""

from __future__ import annotations

import html as htmllib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARKER = "ibm-jsonld"

SITE = "https://ib-mentors.com"
ORG_NAME = "IBメンター"
ORG_ALT = "IB Mentors"
LANG = "ja"

EXCLUDE_DIRS = {".git", "node_modules", "scripts", ".github"}

# Facts the site states about itself, kept in one place so the markup cannot
# drift from the copy in the footer and on /contact.
POSTAL = {
    "@type": "PostalAddress",
    "postalCode": "156-0043",
    "addressCountry": "JP",
    "addressRegion": "東京都",
    "addressLocality": "世田谷区",
    "streetAddress": "松原６丁目２９－７",
}
EMAIL = "support@ib-mentors.com"
SAME_AS = ["https://lin.ee/EPTH4OI"]   # the Instagram link on the site has no
                                       # handle yet, so it is deliberately not
                                       # claimed here as a profile of ours.

SECTION_NAMES = {"courses": "コース・プラン一覧", "blogs": "ブログ・お役立ち情報",
                 "teams": "メンター紹介"}


# ---------------------------------------------------------------------------
# reading the page back
# ---------------------------------------------------------------------------
def text_of(fragment: str) -> str:
    return re.sub(r"\s+", " ", htmllib.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


def meta(html: str, *patterns: str) -> str | None:
    for p in patterns:
        m = re.search(p, html, re.I)
        if m:
            return htmllib.unescape(m.group(1)).strip()
    return None


def page_title(html: str) -> str | None:
    return meta(html,
                r'<meta\s+property="og:title"\s+content="([^"]+)"',
                r"<title[^>]*>([^<]+)</title>")


def page_desc(html: str) -> str | None:
    return meta(html,
                r'<meta\s+property="og:description"\s+content="([^"]+)"',
                r'<meta\s+name="description"\s+content="([^"]+)"')


def page_url(html: str) -> str | None:
    return meta(html,
                r'<link\s+rel="canonical"\s+href="([^"]+)"',
                r'<meta\s+property="og:url"\s+content="([^"]+)"')


def page_image(html: str) -> str | None:
    return meta(html, r'<meta\s+property="og:image"\s+content="([^"]+)"')


def strip_suffix(title: str) -> str:
    """Drop the ' | IBメンター …' suffix fix-og-tags.py appends."""
    return title.split(" | ")[0].strip()


def published_date(html: str) -> str | None:
    """ISO date from the post's own Date element (Framer renders 2025/02/15)."""
    m = re.search(r'data-framer-name="Date".{0,600}?(\d{4})/(\d{1,2})/(\d{1,2})',
                  html, re.S)
    if not m:
        return None
    y, mo, d = m.groups()
    return f"{y}-{int(mo):02d}-{int(d):02d}"


def price(html: str) -> str | None:
    m = re.search(r"¥\s*([\d,]+)", html)
    return m.group(1).replace(",", "") if m else None


def alma_mater(html: str) -> str | None:
    """A mentor profile names their university as a short ASCII line."""
    body = html[html.find("<body"):] if "<body" in html else html
    for m in re.finditer(r"<p\b[^>]*>(.*?)</p>", body, re.S | re.I):
        t = text_of(m.group(1))
        if t.isascii() and 6 <= len(t) <= 60 and re.search(
            r"\b(University|College|Institute|School of)\b", t
        ):
            return t
    return None


def faq_entries(html: str) -> tuple[list[dict], int, int]:
    """Q&A pairs that are actually present in the served HTML.

    Framer renders the answer only for the accordion cards that are open by
    default; the rest arrive on interaction. Google requires the answer to be
    in the page, so the caller emits FAQPage only when every question has one.
    """
    questions = re.findall(
        r'data-framer-name="Question"[^>]*>\s*<p\b[^>]*>(.*?)</p>', html, re.S)
    pairs, seen = [], set()
    for m in re.finditer(
        r'data-framer-name="Question"(.{0,4000}?)data-framer-name="Answer"(.{0,4000}?)</div>',
        html, re.S,
    ):
        q = re.findall(r"<p\b[^>]*>(.*?)</p>", m.group(1), re.S)
        a = re.findall(r"<p\b[^>]*>(.*?)</p>", m.group(2), re.S)
        if not (q and a):
            continue
        qt, at = text_of(q[0]), text_of(a[0])
        if not qt or not at or qt in seen:
            continue
        seen.add(qt)
        pairs.append({
            "@type": "Question",
            "name": qt,
            "acceptedAnswer": {"@type": "Answer", "text": at},
        })
    unique_questions = len({text_of(q) for q in questions if text_of(q)})
    return pairs, len(pairs), unique_questions


# ---------------------------------------------------------------------------
# the nodes
# ---------------------------------------------------------------------------
def organization() -> dict:
    return {
        "@type": "EducationalOrganization",
        "@id": f"{SITE}/#organization",
        "name": ORG_NAME,
        "alternateName": ORG_ALT,
        "url": SITE + "/",
        "description": (
            "IBディプロマを修了したメンターが、学習計画の設計からIA・EE・TOK対策、"
            "科目別の試験対策までを完全オンラインで伴走するサポートサービスです。"
        ),
        "email": EMAIL,
        "address": POSTAL,
        "areaServed": {"@type": "Country", "name": "Japan"},
        "knowsLanguage": ["ja", "en"],
        "sameAs": SAME_AS,
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": EMAIL,
            "url": f"{SITE}/contact",
            "availableLanguage": ["ja", "en"],
        },
    }


def website() -> dict:
    return {
        "@type": "WebSite",
        "@id": f"{SITE}/#website",
        "url": SITE + "/",
        "name": ORG_NAME,
        "inLanguage": LANG,
        "publisher": {"@id": f"{SITE}/#organization"},
    }


def breadcrumbs(section: str, name: str, url: str) -> dict:
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2,
             "name": SECTION_NAMES.get(section, section),
             "item": f"{SITE}/{section}"},
            {"@type": "ListItem", "position": 3, "name": name, "item": url},
        ],
    }


def base_node(kind: str, html: str) -> dict | None:
    title, url = page_title(html), page_url(html)
    if not (title and url):
        return None
    node = {
        "@type": kind,
        "name": strip_suffix(title),
        "url": url,
        "inLanguage": LANG,
        "isPartOf": {"@id": f"{SITE}/#website"},
    }
    desc = page_desc(html)
    if desc:
        node["description"] = desc
    return node


def graph_for(route: str, html: str) -> list[dict] | None:
    if route == "/":
        return [organization(), website()]

    section = route.strip("/").split("/")[0]
    detail = route.count("/") == 2

    if route in ("/courses", "/blogs", "/teams"):
        node = base_node("CollectionPage", html)
        return [node] if node else None

    if route == "/contact":
        node = base_node("ContactPage", html)
        if not node:
            return None
        node["publisher"] = {"@id": f"{SITE}/#organization"}
        return [node]

    if route == "/faq":
        pairs, found, total = faq_entries(html)
        if not pairs or found < total:
            print(f"    NOTE: /faq has {total} question(s) but only {found} answer(s) "
                  "in the served HTML, so no FAQPage markup was emitted.")
            return None
        node = base_node("FAQPage", html)
        if not node:
            return None
        node["mainEntity"] = pairs
        return [node]

    if not detail:
        return None

    node = base_node(
        {"courses": "Course", "blogs": "BlogPosting", "teams": "Person"}.get(section, ""),
        html,
    )
    if not node:
        return None
    name, url = node["name"], node["url"]

    if section == "courses":
        node["provider"] = {"@id": f"{SITE}/#organization"}
        amount = price(html)
        if amount:
            node["offers"] = {
                "@type": "Offer",
                "price": amount,
                "priceCurrency": "JPY",
                "category": "Subscription",
                "availability": "https://schema.org/InStock",
                "url": url,
            }
    elif section == "blogs":
        node["headline"] = name
        node["mainEntityOfPage"] = {"@type": "WebPage", "@id": url}
        node["author"] = {"@id": f"{SITE}/#organization"}
        node["publisher"] = {"@id": f"{SITE}/#organization"}
        date = published_date(html)
        if date:
            node["datePublished"] = date
        img = page_image(html)
        if img:
            node["image"] = img
    elif section == "teams":
        # Framer titles a mentor page "<名前> 講師"; split the role off the name.
        if node["name"].endswith("講師"):
            node["name"] = node["name"][: -len("講師")].strip()
        node["jobTitle"] = "IBメンター"
        node["worksFor"] = {"@id": f"{SITE}/#organization"}
        school = alma_mater(html)
        if school:
            node["alumniOf"] = {"@type": "CollegeOrUniversity", "name": school}

    return [node, breadcrumbs(section, name, url)]


# ---------------------------------------------------------------------------
# writing
# ---------------------------------------------------------------------------
def block(graph: list[dict]) -> str:
    payload = json.dumps(
        {"@context": "https://schema.org", "@graph": graph},
        ensure_ascii=False, separators=(",", ":"),
    )
    return f'<script type="application/ld+json" id="{MARKER}">{payload}</script>'


def inject(path: Path, route: str) -> bool:
    html = path.read_text(encoding="utf-8", errors="surrogateescape")
    graph = graph_for(route, html)

    existing = re.search(
        rf'<script[^>]*id="{MARKER}"[^>]*>.*?</script>', html, re.S)

    if graph is None:
        if not existing:
            return False
        html = html[: existing.start()] + html[existing.end():]   # route no longer marked up
    else:
        new = block(graph)
        if existing:
            if existing.group(0) == new:
                return False
            html = html[: existing.start()] + new + html[existing.end():]
        elif "</head>" in html:
            html = html.replace("</head>", new + "</head>", 1)
        else:
            return False

    path.write_text(html, encoding="utf-8", errors="surrogateescape")
    return True


def main() -> int:
    changed = 0
    for page in sorted(ROOT.glob("**/index.html")):
        parts = page.relative_to(ROOT).parts[:-1]
        if EXCLUDE_DIRS.intersection(parts):
            continue
        rel = page.relative_to(ROOT).as_posix()
        route = "/" if rel == "index.html" else "/" + rel[: -len("/index.html")]
        if inject(page, route):
            changed += 1
    print(f"    injected JSON-LD into {changed} page(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
