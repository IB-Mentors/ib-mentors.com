# python3 outline.py ref.json [SectionLayerName] [maxdepth]
import json, sys
d = json.load(open(sys.argv[1]))
want = sys.argv[2] if len(sys.argv) > 2 else None
maxd = int(sys.argv[3]) if len(sys.argv) > 3 else 99
SHORT = {"fontFamily": "ff", "fontSize": "fs", "fontWeight": "fw", "lineHeight": "lh", "letterSpacing": "ls", "backgroundColor": "bg", "borderRadius": "br", "flexDirection": "dir", "alignItems": "ai", "justifyContent": "jc", "fontFeatureSettings": "ffs"}
def fmt(s):
    out = []
    for k, v in s.items():
        if k == "fontFeatureSettings": continue
        if k == "fontFamily": v = v.split(",")[0].strip('"')
        out.append(f"{SHORT.get(k,k)}={v}")
    return " ".join(out)
def walk(n, depth, on):
    if not on and n.get("n") == want: on = True; depth = 0
    if on and depth <= maxd:
        b = n["b"]
        line = "  " * depth + f"<{n['t']}{(' '+n['n']) if n.get('n') else ''}> [{b[0]},{b[1]} {b[2]}x{b[3]}] {fmt(n['s'])}"
        if n.get("x"): line += f'  TEXT="{n["x"][:120]}"'
        if n.get("src"): line += f"  SRC={n['src'].split('/')[-1][:60]}"
        if n.get("href"): line += f"  HREF={n['href']}"
        if n.get("svg"): line += f"  SVG({len(n['svg'])})"
        print(line)
    for c in n.get("c", []):
        walk(c, depth + 1, on)
    return
walk(d["tree"], 0, want is None)
