# Fetch one Framer page into qa/framer/ (retrying until the warm render with a canonical arrives).
# Framer serves a degraded variant while its cache is cold: no canonical/og:url, and on CMS detail pages the
# generic site shell instead of the entry's own title. So each page is re-fetched until the full render arrives.
#   cd qa/framer && cat all-urls.txt | xargs -P 8 -n 1 bash ../fetch-page.sh
LIVE="${LIVE_URL:-https://amusing-environment-470649.framer.app}"
u="$1"; p="${u#$LIVE}"; [ -z "$p" ] && p="/"
if [ "$p" = "/" ]; then f=index.html; else f="${p#/}.html"; fi
mkdir -p "$(dirname "$f")"
for i in 1 2 3 4 5 6 7 8; do
  curl -sS -m 30 "$u" -o "$f.tmp"
  if grep -q 'rel="canonical"' "$f.tmp" && grep -q 'property="og:url"' "$f.tmp"; then mv "$f.tmp" "$f"; echo "ok $p"; exit 0; fi
  sleep 2
done
mv "$f.tmp" "$f"; echo "COLD $p"
