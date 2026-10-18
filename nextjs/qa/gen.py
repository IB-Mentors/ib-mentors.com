# Generates tokens/presets/fonts CSS and downloads every Framer asset, from qa/framer/**/*.html.
#   python3 qa/gen.py        (run from nextjs/)
import re, glob, os, subprocess, collections, json, concurrent.futures as cf
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
FR = "qa/framer"
files = sorted(glob.glob(f"{FR}/**/*.html", recursive=True))
H = {f: open(f).read() for f in files}

def route_of(f):
    p = f[len(FR):-5]
    if p == "/index": return "/"
    return p
# ---- routes + modules
routes = sorted(route_of(f) for f in files)
open(f"{FR}/routes.txt", "w").write("\n".join(routes) + "\n")
mods = {}
lines = []
for f, h in H.items():
    ms = re.findall(r'https://framerusercontent\.com/sites/[A-Za-z0-9]+/([A-Za-z0-9_.-]+\.mjs)', h)
    for m in ms: mods[m] = re.search(r'https://framerusercontent\.com/sites/[A-Za-z0-9]+/', h).group(0) + m
    lines.append(route_of(f) + ": " + " ".join(sorted(set(ms))))
open(f"{FR}/route-modules.txt", "w").write("\n".join(sorted(lines)) + "\n")

def dl(url, out):
    if os.path.exists(out) and os.path.getsize(out) > 0: return out
    subprocess.run(["curl", "-sSL", "-m", "120", "-o", out, url], check=False)
    return out
with cf.ThreadPoolExecutor(16) as ex:
    list(ex.map(lambda kv: dl(kv[1], f"qa/framer-src/{kv[0]}"), mods.items()))
# Prettify the modules so displayName / variants / transitions are greppable.
subprocess.run("npx --yes prettier@3.3.3 --log-level silent --ignore-path '' --write 'qa/framer-src/*.mjs'", shell=True, check=False)
src_js = {m: open(f"qa/framer-src/{m}", errors="ignore").read() for m in mods if os.path.exists(f"qa/framer-src/{m}")}

# ---- tokens (union of body{--token-*} rules)
tokens = collections.OrderedDict()
for h in H.values():
    for m in re.finditer(r'body\s*\{((?:--token-[^;}]+;?)+)\}', h):
        for k, v in re.findall(r'(--token-[a-f0-9-]+):([^;}]+)', m.group(1)): tokens.setdefault(k, v)
open("src/app/tokens.css", "w").write("/* Framer colour tokens (body{} rule of the published site). Names are Framer token ids, so\n   var(--token-<id>, <fallback>) from the Framer CSS can be pasted as-is. */\n:root {\n" + "".join(f"  {k}: {v};\n" for k, v in tokens.items()) + "}\n")

# ---- fonts: download every font file, rewrite to /fonts/
faces = []
seen = set()
for h in H.values():
    for ff in re.findall(r'@font-face\s*\{[^}]*\}', h):
        key = re.sub(r'\s+', ' ', ff)
        if key in seen: continue
        seen.add(key); faces.append(ff)
font_urls = set()
for ff in faces: font_urls.update(u.strip('"\'') for u in re.findall(r'url\(([^)]+)\)', ff))
def font_local(u):
    base = u.split("?")[0]
    if "fonts.gstatic.com" in base: name = base.split("/s/")[1].replace("/", "_")
    else: name = base.rsplit("/", 1)[1]
    return name
with cf.ThreadPoolExecutor(16) as ex:
    list(ex.map(lambda u: dl(u, "public/fonts/" + font_local(u)), font_urls))
css = []
for ff in faces:
    ff = re.sub(r'url\(([^)]+)\)', lambda m: "url(/fonts/" + font_local(m.group(1).strip('"\'')) + ")", ff)
    css.append(ff)
open("src/app/fonts.css", "w").write("/* Self-hosted copies of every @font-face the Framer site declares (qa/gen.py). */\n" + "\n".join(css) + "\n")

# ---- presets
PROP = [("--framer-font-family", "font-family"), ("--framer-font-size", "font-size"), ("--framer-font-weight", "font-weight"),
        ("--framer-letter-spacing", "letter-spacing"), ("--framer-line-height", "line-height"), ("--framer-text-color", "color"),
        ("--framer-font-open-type-features", "font-feature-settings"), ("--framer-font-variation-axes", "font-variation-settings"),
        ("--framer-text-transform", "text-transform"), ("--framer-text-decoration", "text-decoration"), ("--framer-font-style", "font-style")]
def conv(body):
    d = dict(re.findall(r'(--framer-[a-z-]+):([^;]+)', body))
    out = []
    for k, p in PROP:
        if k in d:
            v = d[k].strip()
            if p == "font-feature-settings" and v == "normal": continue
            if p == "font-variation-settings" and v == "normal": continue
            out.append(f"{p}:{v}")
    if d.get("--framer-text-alignment", "start").strip() not in ("start", ""): out.append(f"text-align:{d['--framer-text-alignment'].strip()}")
    if "--framer-paragraph-spacing" in d: out.append(f"--paragraph-spacing:{d['--framer-paragraph-spacing'].strip()}")
    for k in ("--framer-link-text-color", "--framer-link-hover-text-color", "--framer-link-current-text-color", "--framer-link-text-decoration"):
        if k in d: out.append(f"{k.replace('--framer-', '--')}:{d[k].strip()}")
    return ";".join(out)
pres = collections.OrderedDict()   # id -> {media: (selector, body)}
# This site's breakpoints are desktop >= 1380, tablet 768..1379.98, phone <= 767.98 (not Framer's 1200/810 default).
# Framer writes preset overrides as "@media (max-width:1379px) and (min-width:768px)"; normalise every one of them to
# "@media (min-width: Apx) and (max-width: B.98px)" so fractional widths between breakpoints behave like Framer's.
def norm_media(m):
    mx = re.search(r"max-width:\s*(\d+)px", m); mn = re.search(r"min-width:\s*(\d+)px", m)
    parts = []
    if mn and mn.group(1) != "0": parts.append(f"(min-width: {mn.group(1)}px)")
    if mx: parts.append(f"(max-width: {mx.group(1)}.98px)")
    return "@media " + " and ".join(parts) if parts else ""
def media_key(m):
    mx = re.search(r"max-width: (\d+)", m); mn = re.search(r"min-width: (\d+)", m)
    return (0 if not m else 1, -(int(mx.group(1)) if mx else 99999), int(mn.group(1)) if mn else 0)
def rules(css):
    """Yield (media, selector, body) for every rule, one level of @media nesting."""
    i, n, media = 0, len(css), ""
    stack = []
    buf_start = 0
    while i < n:
        c = css[i]
        if c == "{":
            head = css[buf_start:i].strip()
            if head.startswith("@"):
                stack.append(head); buf_start = i + 1
            else:
                j = css.find("}", i)
                yield (stack[-1] if stack else ""), head, css[i + 1:j]
                i = j; buf_start = j + 1
        elif c == "}":
            if stack: stack.pop()
            buf_start = i + 1
        i += 1
for h in H.values():
    for css in re.findall(r"<style[^>]*>(.*?)</style>", h, re.S):
        if "framer-styles-preset-" not in css: continue
        for media, sel, body in rules(css):
            pid = re.search(r"framer-styles-preset-([a-z0-9]+)", sel)
            if not pid or "--framer-" not in body: continue
            if media and not media.startswith("@media"): continue
            pres.setdefault(pid.group(1), {}).setdefault(norm_media(media), (sel, body))
out = ["/* Framer text presets (qa/gen.py). Class .p-<id> == Framer .framer-styles-preset-<id>, tablet/phone overrides included.\n * Link presets (selector applies to <a>) carry --link-text-color / --link-hover-text-color vars: use them in your module CSS. */"]
summ = []
for pid, by in sorted(pres.items()):
    sel0 = by.get("", list(by.values())[0])[0]
    is_link = " a" in sel0 or "a.framer" in sel0 or "a:" in sel0
    cls = f".p-{pid}"
    for media in sorted(by, key=media_key):
        body = conv(by[media][1])
        rule = f"{cls}{{{body}}}"
        out.append(rule if not media else f"{media} {{\n  {rule}\n}}")
    d = dict(re.findall(r'(--framer-[a-z-]+):([^;]+)', by.get("", list(by.values())[0])[1]))
    summ.append(f" * {cls}{' (link)' if is_link else ''}: {d.get('--framer-font-family','').split(',')[0]} {d.get('--framer-font-size','')} / {d.get('--framer-font-weight','')} / lh {d.get('--framer-line-height','')} / ls {d.get('--framer-letter-spacing','')} / {d.get('--framer-text-transform','none')}")
out.insert(1, "/* Summary (desktop):\n" + "\n".join(summ) + "\n */")
open("src/app/presets.css", "w").write("\n".join(out) + "\n")

# ---- images & media assets (HTML + JS modules)
blob = "\n".join(H.values()) + "\n".join(src_js.values())
imgs = set(re.findall(r'https://framerusercontent\.com/images/([A-Za-z0-9_-]+\.[a-z0-9]+)', blob))
assets = set(re.findall(r'https://framerusercontent\.com/assets/([A-Za-z0-9_-]+\.(?:mp4|webm|mov|png|jpg|jpeg|webp|svg|gif|json|lottie))', blob))
open(f"{FR}/images.txt", "w").write("\n".join(sorted(imgs)) + "\n")
open(f"{FR}/assets.txt", "w").write("\n".join(sorted(assets)) + "\n")
def dl_img(n):
    u = f"https://framerusercontent.com/images/{n}" + ("" if n.endswith(".svg") or n.endswith(".gif") else "?scale-down-to=2048")
    return dl(u, f"public/framer/{n}")
with cf.ThreadPoolExecutor(16) as ex:
    list(ex.map(dl_img, imgs))
    list(ex.map(lambda n: dl(f"https://framerusercontent.com/assets/{n}", f"public/framer/{n}"), assets))
print(len(routes), "routes;", len(mods), "modules;", len(tokens), "tokens;", len(faces), "font-faces;", len(font_urls), "font files;", len(pres), "presets;", len(imgs), "images;", len(assets), "assets")
