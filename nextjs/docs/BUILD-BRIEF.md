# Build brief: 1:1 Next.js rebuild of ib-mentors.com

ib-mentors.com is today a static mirror of the Framer site `https://amusing-environment-470649.framer.app`
(the repo root of `IB-Mentors/ib-mentors.com`: `export.sh` plus `scripts/*.py`). This folder (`nextjs/`) rebuilds
that Framer site in Next.js 16 (App Router) + React 19 so it looks and behaves **identically**: same layout at every
width, same Japanese copy, same images, same hover / press / appear / scroll animations and interactive effects.
No redesigns, no "improvements", no copy fixes (Framer's typos, the template's placeholder `mailto: info@elearning.com`
and the crossed LINE/Instagram footer links stay as they are; see the repo README "Known issues in the Framer source").
The source of truth is the **Framer publish** at `amusing-environment-470649.framer.app`, not the mirror in the repo root.
The mirror only tells you what production adds on top (metadata, JSON-LD, tags, the "Site by Kelin Studio" credit), and
all of that is already wired in the scaffold.

## Stack and conventions

- Next.js 16 App Router, React 19, TypeScript, **CSS Modules** (one `X.module.css` next to `X.tsx`). No Tailwind.
  Read `src/app/globals.css`, `src/app/tokens.css` and `src/app/presets.css` first.
- Animation: the `motion` package (`import { motion } from "motion/react"`). Framer springs map directly:
  `{ type: "spring", bounce, duration }` or `{ type: "spring", stiffness, damping, mass }`. Framer appear effects
  (`__framer__styleAppearEffectEnabled` + `__framer__enter` / `__framer__animateOnce` / `__framer__threshold` in the
  modules, `data-framer-appear-id` + the `<script type="framer/appear">` JSON in the HTML) must be ported with the same
  values. Example, home hero: Title Wrapper and Card Wrapper rise from `y: 40, opacity: 0.001` to `y: 0, opacity: 1`,
  tween `[0.44, 0, 0.56, 1]`, 0.4 s and 0.5 s.
- **Breakpoints are this project's own, not Framer's default**: desktop `>= 1380px`, tablet `768px..1379.98px`,
  phone `<= 767.98px` (the Framer CSS says `@media (max-width:1379px) and (min-width:768px)` and
  `@media (max-width:767px) and (min-width:0)`). Desktop-first: `@media (max-width: 1379.98px)` then
  `@media (max-width: 767.98px)`. Helper classes `hide-desktop` / `hide-tablet` / `hide-phone` exist in globals.css
  (Framer's `hidden-<id>` classes. Ids differ per page: the shared shell uses `hidden-1e5skm9` = hidden on desktop,
  `hidden-vmqbp5` = hidden on tablet, `hidden-icv8o9` = hidden on phone; each page's own ids are declared in its
  file as `@media(min-width: 1380px){.hidden-xxx{display:none!important}}` and so on: grep them).
- **Colours:** `--token-<id>` variables in `tokens.css` carry Framer's token ids, so `var(--token-xxx, #fallback)` from the
  Framer CSS can be pasted as-is. Page background is `--token-e8209ae6-...` (#f4f1ea), set on `body`.
- **Text styles:** Framer's text presets are classes in `presets.css`: `.framer-styles-preset-1da19g0` in the Framer HTML
  == `className="p-1da19g0"` here, tablet/phone overrides included. Inline overrides on the Framer element
  (`--framer-text-color`, `--framer-text-alignment`, `--framer-font-size`, ...) still have to be applied on top in your
  module CSS. Text without a preset uses inline `--framer-*` vars on the element: translate them to real properties.
  Fonts: Instrument Sans (everything), Instrument Serif, Inter, all self-hosted in `fonts.css`. Japanese glyphs fall
  back to the system sans, exactly as on the live site.
- **Images** are in `public/framer/<file>` (same filename as on framerusercontent.com, capped at 2048px). Reference as
  `/framer/<file>`. Plain `<img>` (next/image optimisation is off). Copy `alt`, sizing, `object-fit`/`object-position`
  from the Framer markup. Missing image:
  `curl -o public/framer/<file> "https://framerusercontent.com/images/<file>?scale-down-to=2048"`.
- Server components by default; `"use client"` only for interactive parts. Static copy lives in the component (or a
  small typed array at the top of the file). CMS content comes from `src/content/` (below), never retyped.
- Every section root gets `data-section="<Framer layer name>"` (e.g. `data-section="Hero Section"`) so
  `qa/compare.mjs` can find it. Names are exact, trailing spaces included (`"Header "`). The page stubs already carry
  them: keep them on your real section roots.
- Links: Framer writes relative hrefs (`./contact`, `../blogs`). Use absolute paths (`/contact`, `/blogs`), never a
  trailing slash. External links keep `target="_blank"` / `rel` exactly as Framer has them. LINE CTAs go to
  `LINE_URL` in `src/lib/site.ts`.

## CMS content (already extracted, typed)

`python3 qa/extract-content.py` generated these from the Framer SSR HTML; import them, do not retype copy:

| Module | What | Accessor |
|---|---|---|
| `src/content/courses.ts` | 4 courses: card fields (price, unit, author, time, designation, image), hero title + short description, the five rich-text blocks `content[0..4]` ("Content 01".."05"), "Course Information" `info` rows, `detailPrice`, `overview` list, mentor block | `COURSES`, `getCourse(slug)` |
| `src/content/blogs.ts` | 10 posts, oldest first (the /blogs order): title, date (`2025/02/15`), category, author byline (null for the 4 posts Framer does not server-render on /blogs; take it from the live page after もっと見る), image, rich-text `html` | `BLOG_POSTS`, `getPost(slug)` |
| `src/content/teams.ts` | 1 mentor (`e-f`): university line, name, description, image, social icons, course slugs | `MENTORS`, `getMentor(slug)` |

Rich text is Framer's markup with classes stripped (`h2`-`h4`, `p`, `ul/li`, `strong`, `a`, `img`); style it with the
Framer rich-text CSS of that page (the `.framer-text` rules and the preset classes on the container). Copy is verbatim,
including the corrupted characters some posts carry.

## The page frame (already wired)

Every page component returns `<Page>sections</Page>` (`src/components/shell/Page.tsx`): `Navigation` (Framer
"Header ", which overlays the top of every page: main starts at y = 0 under it), `<main>`, `Footer` (Framer
"Footer Section") and `SiteCredit` (the production "Site by Kelin Studio" band, `#ibm-site-credit`, not on the Framer
site; the qa scripts hide it). Do not render any of those yourself.

Shared components (import, do not copy). They start as stubs with a fixed props contract; the owner fills in the
visuals while you work. If you need a prop that is missing, say so in your report instead of editing another
builder's file:

| Component | Path | Framer source | Owner |
|---|---|---|---|
| `Page`, `Navigation`, `Footer`, `SiteCredit` | `src/components/shell/` | `script_main.*.mjs` (`Navigation`, `Navigation Item`, `Navigation Trigger`, `Navigation Icon`, `All Page`, `Footer`, `Footer pages Link`, `Footer Social Link`, `Footer Button`, `Time & Date`) | shell + home builder |
| `Button` (Framer "Hero Button": variants `Hero Button V1/V2`, `Secondary V1/V2`, `Tertiary Button V1/V2`, `Quaternary`, `Quinary V1/V2`) | `src/components/ui/Button.tsx` | `dunpihvNu.*.mjs` | shell + home builder |
| `LoadMoreButton` (Framer "Load More Button": `Load More V1/V2`, states Loading / Hidden) | `src/components/ui/LoadMoreButton.tsx` | `mwYJaWKu3.*.mjs` | shell + home builder |
| `CourseCard` (Framer "Course Card") | `src/components/cards/CourseCard.tsx` | `MlJdimrhP.*.mjs` | courses + mentors builder |
| `TeamCard` (Framer "Team Card") | `src/components/cards/TeamCard.tsx` | `Zyjm7l3ce.*.mjs` | courses + mentors builder |

## Reference material (read, do not guess)

| What | Where |
|---|---|
| Live page | `https://amusing-environment-470649.framer.app<path>` (open it in Playwright) |
| Framer SSR HTML for every route, with all Framer CSS (per breakpoint, hover variants) | `qa/framer/<path>.html` (home: `qa/framer/index.html`) |
| Computed style + box dump of every visible element | `qa/ref/<slug>-{1440,1000,390}.json` (slug: `home`, `courses`, `courses-ib-weekly-mentoring`, `blogs-ee-theme-erabi-guide`, `teams-e-f`, `faq`, `404`, ...) |
| Readable outline of a dump | `python3 qa/outline.py qa/ref/<slug>-1440.json ["<LayerName>"] [depth]` |
| Framer component source (prettified) | `qa/framer-src/*.mjs`; which modules a route loads: `qa/framer/route-modules.txt` |
| Locate layers in the SSR HTML by name | `qa/framerhtml.py` (`parse`, `find`, `text`, `clean_rich`), as used by `qa/extract-content.py` |
| All images / videos the site uses | `qa/framer/images.txt`, `qa/framer/assets.txt` |

Grep `` displayName = `Name` `` in `qa/framer-src` to find a component. On this site: `Home` (page module of `/`,
`QWoqitfISDBm*.mjs`, which also holds `Action Card`, `Read More Button`, `Counter Card`, `Blog Card V1`,
`Process Card V1`, `Bento List`, `Brand Title Wrapper`, `Hero Card Button`), `Courses` / `Courses Details List` /
`Course Information List` / `Star Icon` (`/courses/<slug>`), `Blogs` (`/blogs/<slug>`), `Blog Card V2` (`/blogs`),
`FAQ  Card` (two spaces) / `Faq Tab 01` / `Faq Tab 02` (`/faq`), `Team Social Icon` (`/teams/<slug>`),
`Go Back Button`, `Form Button`, `Load More Button`, `Course Card`, `Team Card`, `Hero Button`.
Animation values (`whileHover`, `variants`, `transition`, appear effects) are in these files: port them exactly.

The dumps were taken at 1440/1000/390 wide (one per breakpoint), 900 tall, after scrolling the whole page (appear
animations finished). Framer's "Made in Framer" badge (`#__framer-badge-container`, the "Light" layer) and the editor
bar (`#__framer-editorbar*`) are Framer's: never rebuild them.

Tips for the Framer HTML: each element has a hashed class (`framer-1abc23`); its CSS lives in the `<style>` blocks of
the same file, desktop first, then `@media (min-width: 768px) and (max-width: 1379.98px)` and
`@media (max-width: 767.98px)` overrides (selectors prefixed with a page hash like `.framer-Z9vZR`). Inline `style=""`
holds border/radius/background values. Each breakpoint's variant of a component exists in the SSR HTML side by side
(`ssr-variant` wrappers + `hidden-<id>` classes), so a layer name usually appears up to three times.
Python + regex is fastest:
`python3 -c "import re;h=open('qa/framer/index.html').read();print(set(re.findall(r'\.framer-1abc23\{[^}]*\}',h)))"`.

## Forms

`/contact`, `/faq` ("Contact Section") and `/become-mentor` have Framer forms (Name, `Email ` with Framer's trailing
space, Message; become-mentor adds `Phone number` and a `Location` select). Ours post JSON to `/api/contact`
(`src/app/api/contact/route.ts`): `{ form: "contact" | "faq" | "become-mentor", page, fields: { Name, "Email ", ... },
attribution: attributionParams(), referrer }`. Framer's hidden honeypot inputs map to `honeypot`. 200 = delivered;
503 = no delivery configured (the form shows its Error state, never a fake success). After a 200 call
`trackConversion("generate_lead", { form, page })` from `src/lib/measurement.ts`. The "Form Button" component
(`KQ0N_aKll.*.mjs`) has the states Default / Loading / Success / Error / Phone: port them.

**Never submit a form on the live Framer site.** Every submission there is a real lead email. Test ours with Playwright
`page.route("**/api/contact", ...)` interception only.

## Measurement, SEO (already wired, do not touch)

`src/lib/measurement.ts` + `src/components/measurement/`: GA4 `G-13MKYG4YL9` (gtag.js, host-gated to ib-mentors.com),
AdSense `ca-pub-8631844190242419`, the Cloudflare Web Analytics beacon, first-party click-ID capture (`ms_attr_v1`)
and a delegated click listener (LINE / mailto / tel = `contact_click`, links to /contact = `cta_click`). Titles,
descriptions, canonicals and JSON-LD come from `src/lib/seo-data.ts` (snapshot of the mirror, `python3 qa/gen-seo.py`)
via `pageMetadata()` / `<JsonLd>` in the route files. `/sitemap.xml`, `/robots.txt`, `/ads.txt`, `/llms.txt` and
`/SocialPreview.png` are served. You never add tags, metadata or JSON-LD yourself.

## Verifying (required before you report done)

The dev server runs at http://localhost:3410 (already running, log in `/tmp/ib-mentors-dev.log`; do not start another
and **never run `next build` in this folder while it runs**: it breaks the dev server's `.next`. If you must build,
`NEXT_DIST_DIR=.next-build npm run build`). If it is down: `nohup npm run dev > /tmp/ib-mentors-dev.log 2>&1 &`. Then:

```bash
node qa/compare.mjs <path> @page 1440,1000,390          # whole page, 900px bands, live left / ours right
node qa/compare.mjs <path> "<LayerName>" 1440,1000,390  # one named section, e.g. "Hero Section"
node qa/heights.mjs                                      # every route, page height live vs ours at 1440/1000/390
```

Look at the `qa/out/*-side.png` images with the Read tool. Iterate until page heights match exactly at all three widths
and the bands are indistinguishable: text wraps at the same characters, same spacing, colours, image crops. The footer
date ("Time & Date") shows today's date, so that line may differ. `/404` answers status 404 on both sides.

Also check interactions in a Playwright script (launch recipe in `qa/compare.mjs`: `chromium.launch({ channel:
"chromium" })`, playwright resolved from `/Users/edward/Github/Fruition-Service/fruition-website-monorepo/package.json`
via `createRequire`): hover states, the mobile menu, accordions, tabs, load more, sticky cards, form focus/error states.
Compare against the live site doing the same thing.

QA traps from the earlier rebuilds:
- Wait for `"load"`, never `"networkidle"` (Framer and the tags keep connections open).
- Always set a viewport: a hidden browser lays pages out at 0 px wide.
- Wait for `document.fonts.ready` before a screenshot, or full-page shots catch fonts mid-load.
- Writing `-webkit-backdrop-filter` beside `backdrop-filter` makes the CSS compiler drop the standard one: write only
  `backdrop-filter`.
- A script element with `id="clarity"` / `id="posthog"` shadows the window global of that name: prefix ids (`ibm-`).

Finally `npx tsc --noEmit` and `npx eslint <your files>` must pass.

## Ownership rules (several builders work in parallel)

- Edit only the files your task names, plus new files under the folders it names. Never touch `src/app/**` (routes,
  layout, API), `globals.css`, `tokens.css`, `presets.css`, `fonts.css`, `src/lib/**`, `src/content/**`,
  `src/components/measurement/**` or another builder's files. If you need a global change, say so in your report.
- `qa/` scripts are shared: you may add your own scratch scripts as `qa/scratch-<you>-*.mjs`; outputs land in `qa/out/`
  (prefix your file names to avoid clashes).
- Do not commit, do not push, do not touch git branches or stash. The lead commits.
- Writing style for prose (comments, your report): no em dashes or en dashes.
