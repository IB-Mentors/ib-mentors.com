#!/usr/bin/env bash
# Re-mirror the published Framer site into this repo as a static export.
# Usage: ./export.sh   then:  git add -A && git commit && git push
#
# The export is idempotent: running it twice in a row produces a clean git diff.
set -euo pipefail
export PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin:${PATH:-}

SRC_HOST="amusing-environment-470649.framer.app"   # published Framer site (source of truth)
SRC="https://$SRC_HOST"
DST="https://ib-mentors.com"                       # live domain (canonical/OG rewrite target)

cd "$(dirname "$0")"

# Everything below walks the repo root. Nothing here is a separate app, so the
# prune list only has to protect git metadata and the tooling itself.
PRUNE=(-path ./.git -prune -o -path ./scripts -prune -o -path ./.github -prune -o -path ./node_modules -prune -o)

# ---------------------------------------------------------------------------
# 0. DNS workaround.
#    Some networks sinkhole Framer's hosts and intercept public resolvers too,
#    so a plain `curl $SRC` can resolve to a LAN IP and fail. Resolve the real
#    A record over DNS-over-HTTPS (which travels inside HTTPS and cannot be
#    intercepted) and pin it with `curl --resolve` on every request to $SRC.
# ---------------------------------------------------------------------------
doh_lookup() {
  local url
  for url in "https://dns.google/resolve?name=$SRC_HOST&type=A" \
             "https://cloudflare-dns.com/dns-query?name=$SRC_HOST&type=A"; do
    curl -fsS -m 15 -H 'accept: application/dns-json' "$url" 2>/dev/null | python3 -c '
import ipaddress, json, sys
try:
    answers = json.load(sys.stdin).get("Answer", [])
except Exception:
    sys.exit(1)
for a in answers:
    if a.get("type") != 1:          # A records only (skip CNAME chains)
        continue
    try:
        addr = ipaddress.ip_address(a.get("data", ""))
    except ValueError:
        continue
    if not (addr.is_private or addr.is_loopback or addr.is_link_local):
        print(addr); sys.exit(0)
sys.exit(1)
' && return 0
  done
  return 1
}

CURL=(curl -sS)
SRC_IP="$(doh_lookup || true)"
if [ -n "$SRC_IP" ]; then
  CURL+=(--resolve "$SRC_HOST:443:$SRC_IP")
  echo "DNS-over-HTTPS: $SRC_HOST -> $SRC_IP (pinned with curl --resolve)"
else
  echo "DNS-over-HTTPS lookup failed; falling back to system DNS." >&2
fi

fetch() { "${CURL[@]}" "$@"; }

# Portable in-place sed. BSD/macOS sed requires an explicit backup suffix
# argument; GNU sed (the CI runners) must not be given one. Detect once.
if sed --version >/dev/null 2>&1; then
  sed_i() { sed -i "$@"; }        # GNU
else
  sed_i() { sed -i '' "$@"; }     # BSD / macOS
fi

if ! fetch -fsS -m 20 -o /dev/null "$SRC/robots.txt"; then
  echo "ERROR: cannot reach $SRC (DNS sinkhole? site unpublished?)" >&2
  exit 1
fi

echo "Source: $SRC"

# Framer renders pages on demand and serves a DEGRADED variant while its cache
# is cold: no <link rel="canonical">, and on CMS detail pages the generic site
# shell (<title>IBメンター | ...</title>) instead of the entry's own title.
# Mirroring that variant would bake generic titles into every blog post, course
# and mentor page, so detect it and re-fetch.
# Exit 0 = incomplete (retry), 1 = complete.
is_incomplete() {
  python3 - "$1" "$2" <<'PYIN'
import re, sys
path, detail = sys.argv[1], sys.argv[2] == "1"
html = open(path, encoding="utf-8", errors="replace").read()
if '<link rel="canonical"' not in html:
    sys.exit(0)
if detail:
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    title = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else ""
    # The site-default title means the CMS entry's own metadata has not rendered.
    if title in ("", "IBメンター | IBを勝ち抜くためのオンラインサービス"):
        sys.exit(0)
sys.exit(1)
PYIN
}

# ---------------------------------------------------------------------------
# 1. Remove previously generated artifacts (never touches .git, scripts/,
#    .github/, README.md, export.sh, llms.txt, ads.txt, SocialPreview.png)
# ---------------------------------------------------------------------------
# NOTE: -delete is not usable here. GNU find implies -depth for -delete, which
# disables the -prune guards above and makes it refuse to run at all.
# -exec rm -f keeps the prunes effective and behaves the same on BSD and GNU.
find . "${PRUNE[@]}" -name index.html -exec rm -f {} + >/dev/null
rm -f 404.html sitemap.xml robots.txt sitemap_*.xml

# ---------------------------------------------------------------------------
# 2. Discover every page from the sitemap and mirror it.
#    Framer serves a flat sitemap here, but may switch to a sitemap INDEX (one
#    sub-sitemap per locale) if a second language is ever added, so expand any
#    nested *.xml sitemaps into page paths.
# ---------------------------------------------------------------------------
index_locs=$(fetch -fsS -m 20 "$SRC/sitemap.xml" \
  | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g')

paths=""
sub_sitemaps=""
while read -r loc; do
  [ -z "$loc" ] && continue
  case "$loc" in
    *.xml)
      sub_sitemaps="$sub_sitemaps $loc"
      sub=$(fetch -fsS -m 20 "$loc" \
        | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g; s#'"$SRC"'##')
      paths="$paths"$'\n'"$sub"
      ;;
    *)
      paths="$paths"$'\n'"${loc#$SRC}"
      ;;
  esac
done <<< "$index_locs"

# Normalise: drop blank padding lines, treat a bare host as "/", and dedupe so
# a sitemap that lists the same route twice is not mirrored twice.
paths=$(printf '%s\n' "$paths" | sed -E 's#^$#/#' | awk 'NF && !seen[$0]++')

count=0
while read -r p; do
  [ -z "$p" ] && continue
  if [ "$p" = "/" ]; then dir="."; else dir="${p#/}"; dir="${dir%/}"; fi
  mkdir -p "$dir"
  out="$dir/index.html"

  # CMS detail pages (blog posts, courses, mentor profiles) carry per-page
  # titles that the cold render replaces with the generic site shell.
  case "$p" in
    /blogs/*|/courses/*|/teams/*) detail=1 ;;
    *) detail=0 ;;
  esac

  for attempt in 1 2 3 4 5; do
    # no -f: we still want the body for non-200 pages (e.g. the styled /404)
    code=$(fetch -m 30 -w '%{http_code}' "$SRC$p" -o "$out" || echo "ERR")
    is_incomplete "$out" "$detail" || break
    if [ "$attempt" = 5 ]; then
      echo "  WARN: $p served an incomplete render after $attempt fetches" >&2
      break
    fi
    sleep 2
  done

  # rewrite the published domain -> live domain (canonical, og:url, etc.)
  # NOTE: do NOT rewrite framerusercontent.com URLs here — that would clobber
  # every body <img src>/srcset. og:image/twitter:image pinning to
  # SocialPreview.png is handled (targeted, meta-tags only) by
  # scripts/fix-og-tags.py in step 6.
  sed_i "s#$SRC#$DST#g" "$out"
  printf '  %s  %8sB  %s\n' "$code" "$(wc -c <"$out" | tr -d ' ')" "$out"
  count=$((count+1))
done <<< "$paths"

# ---------------------------------------------------------------------------
# 3. The styled 404. It is not in the sitemap, so fetch it explicitly, and
#    copy it to /404.html which is what Vercel serves for not-found responses.
# ---------------------------------------------------------------------------
mkdir -p 404
for attempt in 1 2 3 4 5; do
  fetch -m 30 -o 404/index.html "$SRC/404" || true
  is_incomplete 404/index.html 0 || break
  sleep 2
done
sed_i "s#$SRC#$DST#g" 404/index.html
echo "  404 page mirrored ($(wc -c <404/index.html | tr -d ' ')B)"
# NOTE: the copy to /404.html happens at the END, after post-processing, so the
# two files can never drift and the post-processors only ever see one route.

# 4. sitemap (+ any per-locale sub-sitemaps) + robots, domain-rewritten
fetch -fsS -m 15 "$SRC/sitemap.xml" | sed "s#$SRC#$DST#g" > sitemap.xml
for sm in $sub_sitemaps; do
  fn=$(basename "$sm")
  fetch -fsS -m 15 "$sm" | sed "s#$SRC#$DST#g" > "$fn"
done
fetch -fsS -m 15 "$SRC/robots.txt"  | sed "s#$SRC#$DST#g" > robots.txt

# 4b. Inject measurement into every mirrored page.
#     Framer exports carry no analytics of their own, and anything pasted into
#     a page by hand is wiped by the next re-export — which is exactly what
#     happened to the GA4 tag that used to live inline in index.html. Injecting
#     it here is what makes it survive.
python3 scripts/inject-analytics.py

# 4c. Inject the AdSense loader into every mirrored page.
#     Deliberately NOT a tag-manager tag: adsbygoogle.js is an ad-serving
#     library, not a measurement tag. Auto ads need it in <head> on first paint,
#     and the AdSense reviewer reads raw HTML, so it must not sit behind gtm.js.
#     Ownership verification is the checked-in /ads.txt, not this script.
python3 scripts/inject-adsense.py

# 5. Remove Framer's exported branding badge from every mirrored page.
find . "${PRUNE[@]}" -name '*.html' -exec python3 scripts/remove-framer-badge.py {} +

# ---------------------------------------------------------------------------
# 6. Enforce the search/social metadata convention on every mirrored page.
#    This is the durability hook: it runs on EVERY export, after mirroring, so
#    a re-export can never regress the titles/descriptions/canonicals back to
#    Framer's generics. Framer serves the SAME title and description on every
#    flat page and the same description on every CMS page, so without this step
#    all 23 pages compete in search with identical snippets.
#
#    og:image/twitter:image are pinned to SocialPreview.png HERE, by a targeted
#    meta-tag replace. Never do that with a blanket framerusercontent.com sed —
#    it rewrites every body <img src>/srcset too.
#
#      fix-og-tags.py          <title> / meta description / og:* / twitter:* /
#                              og:url / canonical  (convention in README)
#      add-canonical-links.py  adds <link rel="canonical"> on any page that has
#                              og:url but no canonical — must run AFTER
#                              fix-og-tags, which is what guarantees og:url.
#    Both are idempotent: a second run rewrites nothing.
# ---------------------------------------------------------------------------
python3 scripts/fix-og-tags.py
python3 scripts/add-canonical-links.py

# 6b. Hold that title through hydration. Framer's client bundle overwrites
#     document.title with the project's site-wide default on some routes
#     (/contact is one), which would hand a JavaScript-rendering crawler the
#     generic title on exactly the pages the step above just fixed.
python3 scripts/lock-title.py

# ---------------------------------------------------------------------------
# 7. Add JSON-LD structured data.
#    Framer exports none, so before this step ib-mentors.com served zero
#    machine-readable description of what the business is. Runs LAST because it
#    reads each page's og:title / og:description / canonical back out of the
#    HTML: the two steps above are what guarantee those exist, so the markup
#    can never contradict the meta tags.
# ---------------------------------------------------------------------------
python3 scripts/inject-jsonld.py

# ---------------------------------------------------------------------------
# 7b. Regenerate /llms.txt from the finished mirror.
#     Reads the titles and descriptions back out of the pages, so a new blog
#     post or course appears in it with no code change. Runs after the two
#     metadata steps for the same reason inject-jsonld.py does.
# ---------------------------------------------------------------------------
python3 scripts/build-llms-txt.py

# ---------------------------------------------------------------------------
# 8. Publish the finished 404 as /404.html, which is what Vercel serves for
#    not-found responses. Copied last so it carries every post-processing step.
# ---------------------------------------------------------------------------
cp 404/index.html 404.html

# 9. Prune any now-empty directories left by deleted pages.
# Same -prune/-delete incompatibility as above, so rmdir instead. rmdir only
# removes empty directories, and repeating collapses nested empties.
for _ in 1 2 3; do
  find . "${PRUNE[@]}" -type d -empty -exec rmdir {} + >/dev/null 2>&1 || true
done

echo "Done. Mirrored $count pages."
echo "Next: git add -A && git commit -m 'chore: re-export from Framer' && git push"
