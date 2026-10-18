"""Helpers to locate Framer layers in the SSR HTML (qa/framer/*.html) by data-framer-name. Used by qa/extract-content.py."""
import re, html as H
from html.parser import HTMLParser
VOID={'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}
class Spans(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=False); s.stack=[]; s.spans=[]
    def handle_starttag(s,t,a):
        if t in VOID: return
        pos=s.getpos(); s.stack.append((t,dict(a),s.off()))
    def off(s):
        l,c=s.getpos(); return s.lo[l-1]+c
    def handle_endtag(s,t):
        if t in VOID: return
        while s.stack:
            tt,a,st=s.stack.pop()
            end=s.off()
            s.spans.append((tt,a,st,end+len(t)+3))
            if tt==t: break
def parse(h):
    h2=re.sub(r'<(script|style)\b.*?</\1>',lambda m:' '*len(m.group(0)),h,flags=re.S)
    p=Spans(); p.lo=[0]
    for line in h2.splitlines(keepends=True): p.lo.append(p.lo[-1]+len(line))
    p.feed(h2); p.close()
    return sorted(p.spans,key=lambda x:x[2])
def find(spans,name,within=None):
    out=[]
    for t,a,s,e in spans:
        if a.get('data-framer-name')==name and (within is None or (s>=within[0] and e<=within[1])):
            out.append((t,a,s,e))
    return out
def text(h):
    h=re.sub(r'<br\s*/?>','\n',h)
    return re.sub(r'[ \t\r\f\v]+',' ',H.unescape(re.sub(r'<[^>]+>','',h))).strip()
KEEP={'h1','h2','h3','h4','h5','h6','p','ul','ol','li','strong','em','b','i','a','br','img','blockquote','code','pre','table','thead','tbody','tr','td','th','hr','figure','figcaption'}
def clean_rich(h):
    """Rich text inner HTML with Framer classes/styles stripped; keeps semantic tags, href, src, alt."""
    def tag(m):
        close, name, attrs = m.group(1), m.group(2).lower(), m.group(3) or ''
        if name not in KEEP: return ''
        if close: return f'</{name}>'
        keep=[]
        for k in ('href','src','alt','target','rel'):
            mm=re.search(rf'\b{k}="([^"]*)"',attrs)
            if mm: keep.append(f'{k}="{mm.group(1)}"')
        return f'<{name}{(" "+" ".join(keep)) if keep else ""}>'
    h=re.sub(r'<(/?)([a-zA-Z0-9]+)([^>]*)>',tag,h)
    return re.sub(r'\s+\n','\n',h).strip()
