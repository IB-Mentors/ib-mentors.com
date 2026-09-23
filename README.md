# ib-mentors.com — static Framer mirror

Source of truth: <https://amusing-environment-470649.framer.app> (published Framer site)
Deployed at: <https://ib-mentors.com> (Vercel, auto-deploys on push to `main`)
Mode: full-site static mirror — **23 pages** (22 sitemap routes + the styled 404)

| Section | Pages |
| --- | --- |
| Flat pages (`/`, `/courses`, `/blogs`, `/teams`, `/faq`, `/contact`, `/become-mentor`, `/404`) | 8 |
| Courses (`/courses/<slug>`) | 4 |
| Blog posts (`/blogs/<slug>`) | 10 |
| Mentor profiles (`/teams/<slug>`) | 1 |

Page HTML is mirrored from the published Framer site; all CSS/JS/fonts/media
load from Framer's public CDNs (framerusercontent.com, app.framerstatic.com).
Canonical/OG URLs are rewritten to `https://ib-mentors.com`.

The architecture mirrors `kelin-website-framer`: same export/post-process/poll
shape, adapted to a single-language Japanese site with no second domain.

## Hosting

Fully static — serve the directory as-is. Vercel serves `404.html` for
not-found responses.

`vercel.json` is load-bearing, not decoration:

- **`"trailingSlash": false`.** Framer writes *relative* links (`../contact`
  from a blog post, `./contact` from a flat page). Served at `/blogs/<slug>`
  those resolve correctly; served at `/blogs/<slug>/` every link in the header
  and footer resolves one level too deep. The setting makes Vercel redirect the
  slashed form away, so the relative links can never break.
- **`www.ib-mentors.com` → `https://ib-mentors.com`, 308.** Before this, both
  hosts served the whole site with status 200 and no redirect, so every page
  existed twice for a crawler while the canonical tag pointed at the apex only.

## Re-exporting

Automatic. `.github/workflows/framer-export.yml` polls the Framer site every 30
minutes, re-runs `export.sh`, and pushes to `main` **only when the mirrored
output actually changed** — which is what triggers the Vercel production build.
Publishing in Framer is therefore the whole workflow; nothing else is needed.
"Run workflow" on the Actions tab publishes on demand in about a minute.

By hand, after republishing in Framer:

```sh
./export.sh
git add -A && git commit -m "chore: re-export from Framer" && git push
```

`export.sh` is idempotent: running it twice in a row leaves a clean `git diff`.
It does, in order:

1. **Resolve the source host over DNS-over-HTTPS.** Some networks sinkhole
   Framer's hosts (and intercept public resolvers), so the real A record is
   fetched from `dns.google` / `cloudflare-dns.com` and pinned onto every
   request with `curl --resolve`. Falls back to system DNS if DoH is blocked.
2. **Mirror every page** listed in `sitemap.xml`. Framer renders pages on demand
   and serves a degraded variant while its cache is cold: no
   `canonical`/`og:url`, and on CMS detail pages the generic site shell instead
   of the entry's own title. Every page is therefore re-fetched (up to 5
   attempts, 2s apart) until the complete render arrives. Without this, blog
   posts and courses mirror with the homepage title.
3. **Mirror the styled `/404`** (it is not in the sitemap, so it is fetched
   explicitly) and the sitemap + `robots.txt`, domain-rewritten.
4. **Inject measurement** (`scripts/inject-analytics.py`) and the **AdSense
   loader** (`scripts/inject-adsense.py`) — Framer exports carry neither.
5. **Remove Framer's branding badge** (`scripts/remove-framer-badge.py`).
6. **Enforce the metadata convention** (below) — the durability hook — and
   **lock the title through hydration** (`scripts/lock-title.py`).
7. **Add JSON-LD** (`scripts/inject-jsonld.py`) and **regenerate `llms.txt`**
   (`scripts/build-llms-txt.py`).
8. **Copy the finished `404/index.html` to `404.html`**, then prune empty
   directories left by deleted pages.

## Why every step is a script and nothing is hand-edited

Step 1 of the export deletes every `index.html` before re-mirroring. Anything
pasted into a page by hand is therefore gone on the next export. That is not
hypothetical: the GA4 tag and the AdSense loader used to live inline in
`index.html`, which meant they covered the homepage only and would have been
deleted the first time anyone re-exported. Both are now injected on every run,
across every page.

The same rule applies to anything else you want on the live site but not in the
Framer project: it belongs in `scripts/`, called from `export.sh`.

## Measurement

`scripts/inject-analytics.py` has two modes, chosen by `GTM_ID` at the top:

| `GTM_ID` | Behaviour |
| --- | --- |
| set | Injects the GTM container on every page, and strips the inline GA4 block it supersedes so nothing double-counts. |
| empty (**current**) | Injects the site's own GA4 tag `G-13MKYG4YL9` directly, on every page. |

The direct-GA4 mode is a deliberate fallback so measurement is never dark, not
a resting state. Create a GTM container **under an IB Mentors account** — not
kelin.studio's `GTM-NMR9PNN9`, which would mix a client property into Kelin's
container and fire Kelin's conversion tags — put the GA4 tag inside it, paste
the ID into `GTM_ID`, and the next export migrates all 23 pages in one go.
After that, adding or changing a tag is a GTM publish rather than a code change
plus a re-export plus a deploy.

AdSense is deliberately **not** a container tag: `adsbygoogle.js` is an
ad-serving library, auto ads need it in `<head>` on first paint, and the AdSense
reviewer reads raw HTML. Ownership verification is the checked-in `/ads.txt`.

## The metadata convention

Framer serves this site with **one title and one description for the whole
domain**: every flat page carries the homepage title, and every page without
exception carries the homepage description — all ten blog posts, all four
courses, the mentor profiles. In a search result or a LINE preview, 23 pages
were indistinguishable from each other and from the homepage.

`scripts/fix-og-tags.py` runs on **every export**, so a re-export can never
regress that. It writes, per page:

- `<title>` == `og:title` == `twitter:title`
- `meta name="description"` == `og:description` == `twitter:description`
- `og:image` == `twitter:image` == `https://ib-mentors.com/SocialPreview.png`
  (committed at the repo root, 1200×630, so previews do not depend on a Framer
  CDN URL surviving)
- `og:url` == `<link rel="canonical">` == `https://ib-mentors.com/<route>`
- `robots: noindex, follow` on `/404` only

`scripts/add-canonical-links.py` then adds `<link rel="canonical">` on any page
that has `og:url` but no canonical — it **must run after** `fix-og-tags.py`,
which is what guarantees `og:url` exists. Both are idempotent.

### Where the copy comes from

1. **Flat pages** are hand-authored in the `PAGES` dict in `fix-og-tags.py`.
   These are the money pages; edit the dict to change the copy.
2. **Everything else is derived from the page itself**: the title from Framer's
   own per-entry `<title>` (falling back to the first real heading) with the
   section suffix appended, the description from the entry's own opening
   paragraphs, trimmed to a sentence boundary under 120 characters. **A new
   blog post, course or mentor published in Framer therefore gets a correct,
   unique preview with no code change** — just re-export.
3. Only a page with neither falls back to a slug-derived title and the site
   default description.

Titles are joined with a pipe (` | `): `<エントリー名> | IBメンター コース`,
`… | IBメンター ブログ`, `… | IBメンター`. The suffix is only appended when the
title does not already end with it, which is what keeps the script idempotent
across runs. Dashes are not used in the copy authored here; where a break is
needed it is `：`. Titles that come from the Framer CMS are left exactly as the
client wrote them, dashes included.

## The title lock

`fix-og-tags.py` writes a unique `<title>` into the served HTML, and on some
routes Framer's client bundle overwrites `document.title` with the project's
site-wide default the moment it hydrates. Measured on this mirror:

| Route | Served | After hydration, before the fix |
| --- | --- | --- |
| `/contact` | `お問い合わせ | IBメンター` | `IBメンター | IBを勝ち抜くためのオンラインサービス` |
| `/courses` | `コース・プラン一覧 | IBメンター` | unchanged |

Google renders JavaScript, so on the affected routes the generic title is what
would have counted, on exactly the pages the metadata step just fixed.

`scripts/lock-title.py` injects ~300 bytes immediately after `</title>` that
restore the intended title if something changes it, and then get out of the
way: the observer stops as soon as the path changes, so Framer's own
client-side navigation is free to set whatever title that route wants, and it
disconnects after 10 seconds regardless. Nothing else in the head is affected:
the description, `og:*`, canonical and JSON-LD all survive hydration untouched.

## Structured data

`scripts/inject-jsonld.py` emits, by route:

| Route | Type |
| --- | --- |
| `/` | `EducationalOrganization` + `WebSite` |
| `/courses/<slug>` | `Course` with its price in JPY + `BreadcrumbList` |
| `/blogs/<slug>` | `BlogPosting` with `datePublished` + `BreadcrumbList` |
| `/teams/<slug>` | `Person` (with `alumniOf` when the page names a university) + `BreadcrumbList` |
| `/courses`, `/blogs`, `/teams` | `CollectionPage` |
| `/contact` | `ContactPage` |
| `/faq` | `FAQPage` — **gated, see below** |
| `/become-mentor`, `/404` | nothing, deliberately |

Titles, descriptions and canonicals are read back out of each page's own meta
tags rather than re-derived, so the markup cannot contradict them. That is why
this step runs last.

**The FAQ gate.** `/faq` shows 8 questions, but Framer server-renders only the
2 answers whose accordion cards are open by default; the other 6 arrive on
interaction. Google requires the answer to be present in the page, so the
script emits **no** `FAQPage` while that is true, and prints the count on every
export instead. Make all the answers render in Framer and the markup appears by
itself on the next export, with no code change.

## llms.txt

`/llms.txt` is generated by `scripts/build-llms-txt.py` from the finished
mirror, so it lists every route with the description that page actually carries
and stays current as the CMS grows. The header paragraph is the hand-written
part; edit it in the script.

## Adding pages

Nothing to do — publish in Framer. The poll finds the new route in the sitemap,
mirrors it, gives it unique metadata, marks it up and lists it in `llms.txt`.

## Known issues in the Framer source

These are content bugs in the Framer project, not in the mirror, so they cannot
be fixed here without a script that rewrites them on every export (the
architecture supports that; ask before adding one, since these are contact
details).

- **The footer "Email" link on every page is the design template's placeholder**,
  `mailto: info@elearning.com` (138 occurrences across the mirror). The site's
  real addresses, on `/contact`, are `support@ib-mentors.com` and
  `info@ib-mentors.com`.
- `/become-mentor` carries two more template placeholders,
  `jobs.elearn@mail.com` and `info@elearn-design.com`.
- **The footer's social links are crossed and broken.** The link labelled
  "LINE" points at `https://www.instagram.com/` (no handle), and the one
  labelled "Instagram" has no `href` at all. Until there is a real profile URL,
  the JSON-LD deliberately does not claim an Instagram account in `sameAs`.
- Several blog posts contain corrupted Japanese characters from whatever
  produced the copy (e.g. 完異, 構徫, 2种類, 合正する, 想45点, 〖5月). Derived
  descriptions inherit them, because they are what the page says.
