#!/usr/bin/env python3
"""Enforce the search/social metadata convention on every mirrored page.

Why this exists
---------------
Framer serves this site with ONE title and ONE description for the whole
domain. Every flat page (/courses, /blogs, /teams, /faq, /contact,
/become-mentor) carries the homepage title, and every page without exception
carries the homepage description, including all nine blog posts, four courses
and the mentor profiles. In search results and in a LINE or X preview, 23 pages
were indistinguishable from each other and from the homepage.

This script is the durability hook: export.sh runs it on EVERY export, after
mirroring, so a re-export can never regress the metadata back to Framer's
generics.

What it writes, per page
------------------------
  <title>                 == og:title == twitter:title
  meta name="description" == og:description == twitter:description
  og:image                == twitter:image == <site>/SocialPreview.png
  og:url                  == <link rel="canonical"> == <site><route>
  meta robots             noindex on /404 only

Where the copy comes from
-------------------------
1. Flat pages are hand-authored in PAGES below. These are the money pages and
   the copy is stable, so it is worth writing rather than deriving.
2. CMS pages (blog posts, courses, mentor profiles) are DERIVED from the page
   itself: the title from Framer's own per-entry <title> (falling back to the
   first heading), the description from the entry's own opening paragraphs.
   A new blog post or course published in Framer therefore gets a correct,
   unique preview with no code change at all. Just re-export.
3. Only if a page carries neither does it fall back to a slug-derived title and
   the site default description.

Idempotence
-----------
The script rewrites <title>, so on a second run derivation reads back a value
it wrote itself. That stays stable because the section suffix is only appended
when the title does not already end with it, so it can never be applied twice,
and because the description is derived from body copy this script never touches.
"""

from __future__ import annotations

import html as htmllib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SITE = "https://ib-mentors.com"
BRAND = "IBメンター"
OG_IMAGE = f"{SITE}/SocialPreview.png"

EXCLUDE_DIRS = {".git", "node_modules", "scripts", ".github"}

# Framer's site-wide defaults. Seeing these on a CMS page means the page has no
# metadata of its own, so they are a signal to derive rather than a value to keep.
DEFAULT_TITLE = "IBメンター | IBを勝ち抜くためのオンラインサービス"
DEFAULT_DESC = (
    "IBで手一杯になっていませんか IBメンターは実際にIBを生き抜いてきた先輩による学習計画、"
    "エッセイの書き方、試験対策までまとめて支える総合サポートです。"
    " まずは無料相談でお気軽にお話をお聞かせください。"
)

# --- 1. hand-authored copy for the flat pages ------------------------------
# Titles use a pipe ( | ). No em-dashes or en-dashes anywhere, in titles or in
# descriptions; where a description needs that kind of break it uses 「：」.
PAGES: dict[str, tuple[str, str]] = {
    "/": (
        DEFAULT_TITLE,
        "IBメンターは、IBディプロマを実際に勝ち抜いた先輩が専属メンターとして伴走する完全オンラインサポートです。"
        "学習計画の設計からIA・EE・TOK対策、科目別の試験対策までまとめて支えます。まずは無料相談から。",
    ),
    "/courses": (
        f"コース・プラン一覧 | {BRAND}",
        "週次の専属メンタリング、学習計画設計、EE完全サポート、IA科目別サポートまで、"
        "IBメンターのコースと料金を一覧でご確認いただけます。目的に合うプランは無料相談で一緒に選べます。",
    ),
    "/blogs": (
        f"ブログ・お役立ち情報 | {BRAND}",
        "EEのテーマ選び、TOKエッセイ、IAの仕上げ方、Math AAとAIの選択、試験直前の対策まで、"
        "IBを修了したメンターが書いた実践的な記事をまとめています。",
    ),
    "/teams": (
        f"メンター紹介 | {BRAND}",
        "IBディプロマを修了し海外大学へ進学したメンターをご紹介します。"
        "得意科目、出身校、指導方針から、お子さまに合う一人を選んでいただけます。",
    ),
    "/faq": (
        f"よくあるご質問 | {BRAND}",
        "サービス内容、対応科目とコンポーネント、メンターの経歴、オンライン指導の進め方、"
        "料金とお申し込みまで、IBメンターによく寄せられるご質問にお答えします。",
    ),
    "/contact": (
        f"お問い合わせ | {BRAND}",
        "IBメンターへのお問い合わせ窓口です。LINEまたはフォームから、"
        "無料相談のご予約や受講に関するご質問をお気軽にお送りください。",
    ),
    "/become-mentor": (
        f"メンター募集 | {BRAND}",
        "IBメンターではIBディプロマ修了生のメンターを募集しています。"
        "得意科目と指導可能な時間をフォームにご記入のうえ、ご応募ください。",
    ),
    "/404": (
        f"ページが見つかりません | {BRAND}",
        "お探しのページは見つかりませんでした。ホーム、コース一覧、ブログから目的の情報をお探しください。",
    ),
}

# --- 2. section suffixes for the CMS collections ---------------------------
SECTIONS: dict[str, str] = {
    "blogs": f" | {BRAND} ブログ",
    "courses": f" | {BRAND} コース",
    "teams": f" | {BRAND}",
}

# Paragraph text that is chrome rather than content.
NAV_TEXT = {
    "ホーム", "ページ", "ブログ", "コース", "コース一覧", "メンター紹介", "会社概要",
    "お問い合わせ", "メンター募集", "よくあるご質問", "LINE", "Instagram", "Email",
    "LINEで無料相談", "無料相談", "料金",
}
DATE_RE = re.compile(r"^\d{4}[/年]\d{1,2}[/月]\d{1,2}日?$")
DESC_MIN, DESC_TARGET, DESC_MAX = 20, 60, 120


# ---------------------------------------------------------------------------
# reading the page
# ---------------------------------------------------------------------------
def strip_tags(fragment: str) -> str:
    """Tag-free, entity-decoded text.

    Decoding matters: the copy that comes back still carries `&amp;` and
    friends, and esc() below re-escapes on the way out. Skipping the decode is
    how a title picks up `&amp;amp;` after two exports.
    """
    text = re.sub(r"<[^>]+>", "", fragment)
    return re.sub(r"\s+", " ", htmllib.unescape(text)).strip()


def body_paragraphs(html: str) -> list[str]:
    """Visible <p> text, in document order, with chrome filtered out."""
    body = html[html.find("<body") :] if "<body" in html else html
    body = re.sub(r"<(script|style)\b.*?</\1>", " ", body, flags=re.S | re.I)

    out: list[str] = []
    seen: set[str] = set()
    for m in re.finditer(r"<p\b[^>]*>(.*?)</p>", body, re.S | re.I):
        text = strip_tags(m.group(1))
        if not text or text in seen:
            continue
        seen.add(text)
        if text in NAV_TEXT or DATE_RE.match(text):
            continue
        if text.startswith("〒") or text.startswith("©") or "All Rights Reserved" in text:
            continue
        if text.isascii():          # the English design-template boilerplate
            continue
        if len(text) < DESC_MIN:
            continue
        out.append(text)
    return out


def first_heading(html: str) -> str | None:
    body = html[html.find("<body") :] if "<body" in html else html
    for tag in ("h1", "h2", "h3"):
        for m in re.finditer(rf"<{tag}\b[^>]*>(.*?)</{tag}>", body, re.S | re.I):
            text = strip_tags(m.group(1))
            # Skip the site-wide CTA heading that appears on every page.
            if text and text not in NAV_TEXT and "悔いのないIBライフ" not in text:
                return text
    return None


def meta_content(html: str, pattern: str) -> str | None:
    m = re.search(pattern, html, re.I)
    return m.group(1).strip() if m else None


# ---------------------------------------------------------------------------
# deriving the copy
# ---------------------------------------------------------------------------
def truncate(text: str) -> str:
    if len(text) <= DESC_MAX:
        return text
    cut = text.rfind("。", 0, DESC_MAX + 1)
    if cut >= DESC_TARGET:
        return text[: cut + 1]
    return text[: DESC_MAX - 1].rstrip("、。 ") + "…"


def derive_description(html: str) -> str | None:
    """Build a description from the entry's own opening paragraphs."""
    paras = body_paragraphs(html)
    if not paras:
        return None
    text = paras[0]
    # Extend with the next paragraph only across a clean sentence boundary.
    i = 1
    while len(text) < DESC_TARGET and i < len(paras) and text.endswith("。"):
        text += paras[i]
        i += 1
    return truncate(text)


def derive_title(html: str, section: str, slug: str) -> str:
    own = meta_content(html, r"<title[^>]*>(.*?)</title>")
    if own:
        own = strip_tags(own)
    if not own or own == DEFAULT_TITLE:
        own = first_heading(html) or slug.replace("-", " ")
    suffix = SECTIONS.get(section, f" | {BRAND}")
    return own if own.endswith(suffix) else own + suffix


# ---------------------------------------------------------------------------
# writing the page
# ---------------------------------------------------------------------------
def esc(value: str) -> str:
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def set_tag(html: str, pattern: str, replacement: str) -> str:
    """Replace the first match of `pattern`, or insert before </head>."""
    new, n = re.subn(pattern, lambda _m: replacement, html, count=1, flags=re.I)
    if n:
        return new
    return html.replace("</head>", replacement + "\n</head>", 1)


def apply(path: Path, route: str) -> bool:
    html = path.read_text(encoding="utf-8", errors="surrogateescape")
    original = html

    section = route.strip("/").split("/")[0] if route != "/" else ""
    slug = route.rstrip("/").split("/")[-1]

    if route in PAGES:
        title, desc = PAGES[route]
    else:
        title = derive_title(html, section, slug)
        desc = derive_description(html) or DEFAULT_DESC

    url = SITE + "/" if route == "/" else SITE + route

    html = set_tag(html, r"<title[^>]*>.*?</title>", f"<title>{esc(title)}</title>")
    html = set_tag(
        html, r'<meta\s+name="description"\s+content="[^"]*"\s*/?>',
        f'<meta name="description" content="{esc(desc)}">',
    )
    for prop, value in (("og:title", title), ("og:description", desc),
                        ("og:image", OG_IMAGE), ("og:url", url)):
        html = set_tag(
            html, rf'<meta\s+property="{prop}"\s+content="[^"]*"\s*/?>',
            f'<meta property="{prop}" content="{esc(value)}">',
        )
    for name, value in (("twitter:title", title), ("twitter:description", desc),
                        ("twitter:image", OG_IMAGE)):
        html = set_tag(
            html, rf'<meta\s+name="{name}"\s+content="[^"]*"\s*/?>',
            f'<meta name="{name}" content="{esc(value)}">',
        )
    html = set_tag(
        html, r'<link\s+rel="canonical"\s+href="[^"]*"\s*/?>',
        f'<link rel="canonical" href="{url}">',
    )
    # The 404 page is a real route in the mirror so that Vercel can serve it,
    # but it must never compete in search with the pages it apologises for.
    if route == "/404":
        html = set_tag(
            html, r'<meta\s+name="robots"\s+content="[^"]*"\s*/?>',
            '<meta name="robots" content="noindex, follow">',
        )

    if html == original:
        return False
    path.write_text(html, encoding="utf-8", errors="surrogateescape")
    return True


def route_of(page: Path) -> str:
    rel = page.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    return "/" + rel[: -len("/index.html")]


def main() -> int:
    changed = derived = 0
    for page in sorted(ROOT.glob("**/index.html")):
        parts = page.relative_to(ROOT).parts[:-1]
        if EXCLUDE_DIRS.intersection(parts):
            continue
        route = route_of(page)
        if route not in PAGES:
            derived += 1
        if apply(page, route):
            changed += 1
    print(f"    metadata enforced on {changed} page(s) "
          f"({len(PAGES)} hand-authored, {derived} derived from page content)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
