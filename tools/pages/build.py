# Builds the product, integration, developer and team pages in the home page's style.
# Shared look: assets/omni.css and assets/omni.js are cut from index.html, so they always match the home page.
# Run: python3 tools/pages/build.py [batch ...]   then: node tools/layout.mjs
import os, re, sys, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.dirname(__file__))
from ui import ic

SIGNUP = 'https://app.tryomniscient.com/signup'
SIGNIN = 'https://app.tryomniscient.com/signin'
DEMO = 'mailto:hello@tryomniscient.com?subject=Omniscient%20demo'
SITE = 'https://tryomniscient.com'

# ---------- the page map: menu, footer and related cards all come from here ----------
PAGES = [
  # slug, name, menu line, icon, group
  ('product/omniscience', 'Omniscience', 'The context layer for every deal', 'Orbit', 'Context'),
  ('product/data-model', 'Data model', 'Shape records your way', 'TableIcon', 'Context'),
  ('product/clean-data', 'Clean data', 'Duplicates merged, blanks filled', 'Check', 'Context'),
  ('product/meetings', 'Meetings', 'Notes and next steps from every call', 'Calendar', 'Context'),
  ('product/email-sync', 'Email sync', 'Every thread on the right record', 'Mail', 'Context'),
  ('product/ask-otto', 'Ask Otto', 'Ask your CRM anything', 'Sparkles', 'Otto'),
  ('product/find-leads', 'Find leads', 'Lead lists, just by asking', 'Radar', 'Otto'),
  ('product/skills', 'Skills', 'Teach Otto how your team works', 'Box', 'Otto'),
  ('product/knowledge', 'Knowledge', 'Your pricing, playbook and tone', 'Book', 'Otto'),
  ('product/workflows', 'Workflows', 'Run any sales motion on its own', 'Workflow', 'Otto'),
  ('integrations', 'Apps', 'One-click connections', 'Globe', 'Ecosystem'),
  ('product/chrome-extension', 'Chrome extension', 'Save a profile in one click', 'Download', 'Ecosystem'),
  ('product/mcp', 'MCP', 'Use Omniscient in Claude and ChatGPT', 'Code', 'Ecosystem'),
  ('developers', 'Developers', 'API keys and webhooks', 'Sliders', 'Ecosystem'),
  ('for/founders', 'Founders', 'Run sales without a sales team', 'Briefcase', 'Teams'),
  ('for/sales', 'Sales', 'More selling, less typing', 'Handshake', 'Teams'),
  ('for/marketing', 'Marketing', 'Know which leads turn into revenue', 'Radar', 'Teams'),
  ('for/customer-success', 'Customer success', 'Every account, every renewal, in view', 'Users', 'Teams'),
  ('for/agencies', 'Agencies', 'Every client and every pitch in one place', 'Building', 'Teams'),
]
BY = {p[0]: p for p in PAGES}
url = lambda slug: f'/{slug}/'

def nav_html():
    def col(title, group):
        items = ''.join(f'<a class="mm-i" href="{url(s)}"><b>{n}</b><span>{d}</span></a>' for s, n, d, i, g in PAGES if g == group)
        return f'<div class="mm-col"><p class="mm-h">{title}</p>{items}</div>'
    teams = ''.join(f'<a href="{url(s)}">{n}</a>' for s, n, d, i, g in PAGES if g == 'Teams')
    product = ('<div class="mm" id="mm-product" role="menu"><div class="mm-in">' + col('Context', 'Context') + col('Otto', 'Otto') + col('Ecosystem', 'Ecosystem')
      + f'<div class="mm-side"><p class="mm-h">Omniscient for</p>{teams}<p class="mm-h">Get started</p><a href="{SIGNUP}">Start free</a><a href="{DEMO}">Book a demo</a><a href="/#pricing">Pricing</a></div></div></div>')
    def rcol(title, items):
        return f'<div class="mm-col"><p class="mm-h">{title}</p>' + ''.join(f'<a class="mm-i" href="{h}"><b>{t}</b><span>{d}</span></a>' for t, d, h in items) + '</div>'
    res = ('<div class="mm mm-sm" id="mm-res" role="menu"><div class="mm-in">'
      + rcol('Learn', [('Blog', 'Guides for modern GTM teams', '/blog/'), ('Compare', 'Omniscient vs Attio, HubSpot and more', '/blog/omniscient-vs-attio/'), ('FAQ', 'Quick answers', '/#faq')])
      + rcol('Company', [('Security', 'How we keep your data safe', '/security/'), ('Privacy', 'What we collect and why', '/privacy/'), ('Terms', 'The fine print', '/terms/')])
      + '</div></div>')
    chev = '<svg class="mm-c" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    return f'''<header class="nav">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Omniscient home"><svg><use href="#mark"/></svg>omniscient</a>
    <nav class="links" aria-label="Main">
      <button class="mm-t" type="button" aria-expanded="false" aria-controls="mm-product">Product{chev}</button>
      <button class="mm-t" type="button" aria-expanded="false" aria-controls="mm-res">Resources{chev}</button>
      <a href="/integrations/">Integrations</a>
      <a href="/#teams">Customers</a>
      <a href="/#pricing">Pricing</a>
    </nav>
    {product}
    {res}
    <div class="nav-cta">
      <a class="btn btn-text" href="{SIGNIN}">Log in</a>
      <a class="btn btn-black" href="{SIGNUP}">Start free</a>
    </div>
  </div>
</header>'''

def footer_html():
    def col(t, items): return f'<div><h5>{t}</h5>' + ''.join(f'<a href="{h}">{n}</a>' for n, h in items) + '</div>'
    g = lambda grp: [(n, url(s)) for s, n, d, i, gg in PAGES if gg == grp]
    return f'''<footer id="contact">
  <div class="wrap">
    <div class="fgrid">
      <div><a class="brand" href="/"><svg><use href="#mark"/></svg>omniscient</a></div>
      {col('Context', g('Context'))}
      {col('Otto', g('Otto'))}
      {col('Ecosystem', g('Ecosystem'))}
      {col('Teams', g('Teams'))}
      {col('Company', [('Pricing', '/#pricing'), ('Blog', '/blog/'), ('Security', '/security/'), ('Privacy', '/privacy/'), ('Terms', '/terms/'), ('Contact', 'mailto:hello@tryomniscient.com')])}
    </div>
    <div class="fbot"><span>© 2026 Omniscient <a href="https://unsplash.com/" rel="noopener" style="margin-left:14px">Photos: Unsplash</a></span><span>The all-seeing CRM</span></div>
  </div>
</footer>'''

# ---------- pieces cut from the home page ----------
def home():
    return open(os.path.join(ROOT, 'index.html')).read()

def cut(s, a, b):
    i = s.index(a); j = s.index(b, i); return s[i:j]

PAGE_CSS = r'''
/* ===== product and team pages (tools/pages/build.py) ===== */
.fgrid{grid-template-columns:1.2fr repeat(5,minmax(0,1fr))!important}
.phero{position:relative;isolation:isolate;padding-block:84px 0}
.pcrumb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:14px;color:var(--muted)}
.pcrumb a:hover{color:var(--ink)}
.pcrumb svg{width:12px;height:12px}
.pchip{display:inline-flex;align-items:center;gap:8px;height:32px;margin-top:28px;padding:0 14px 0 4px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);font-size:14px;color:var(--ink)}
.pchip i{width:24px;height:24px;border-radius:50%;background:#0a0a0a;color:#fff;display:grid;place-items:center}
.pchip i svg{width:13px;height:13px}
.phero h1{font-weight:500;font-size:clamp(44px,7vw,92px);line-height:.98;letter-spacing:-.052em;margin:20px 0 0;max-width:15ch;text-wrap:balance}
.plede{margin:24px 0 0;font-size:clamp(18px,1.8vw,22px);line-height:1.42;letter-spacing:-.012em;color:var(--dim);max-width:44ch;text-wrap:pretty}
.phero .hero-form{margin-top:34px}
.pshot{margin-top:76px;padding-bottom:16px}
.pshot>.vis{padding:44px}
.prows{padding-top:96px}
.prow{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:72px;align-items:center;padding:64px 0}
.prow+.prow{border-top:1px solid var(--rule)}
.prow.flip .pcopy{order:2}
.pcopy,.prow>*{min-width:0}
.pcopy h2{font-weight:500;font-size:clamp(28px,3.3vw,44px);line-height:1.04;letter-spacing:-.04em;margin:16px 0 0;max-width:16ch;text-wrap:balance}
.pcopy .lede{max-width:38ch!important}
.pcopy ul{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:12px}
.pcopy li{display:flex;align-items:flex-start;gap:10px;font-size:15px;line-height:1.45;color:#3b3b3b}
.pcopy li svg{flex:none;width:16px;height:16px;margin-top:2px;color:var(--ink)}
.pband{padding-block:120px}
.pband .big{margin-top:0}
.pts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-top:88px;border-top:1px solid rgba(255,255,255,.1)}
.pts>div{padding:26px 28px 6px;border-left:1px solid rgba(255,255,255,.1);min-width:0}
.pts>div:first-child{border-left:0;padding-left:0}
.pts i{width:36px;height:36px;border-radius:50%;background:#f4f4f2;color:#0a0a0a;display:grid;place-items:center;box-shadow:0 0 24px rgba(255,255,255,.25)}
.pts i svg{width:16px;height:16px}
.pts b{display:block;margin-top:22px;font-weight:500;font-size:18px;letter-spacing:-.02em;color:#f4f4f2}
.pts span{display:block;margin-top:8px;font-size:15px;line-height:1.5;color:#8b8b88;max-width:32ch}
.rel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.rel a{display:flex;flex-direction:column;gap:6px;min-width:0;padding:22px;border-radius:16px;background:#fbfbfa;box-shadow:inset 0 0 0 1px #ececea;transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s,background .25s}
.rel a:hover{transform:translateY(-2px);background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 18px 40px -18px rgba(0,0,0,.25)}
.rel i{width:32px;height:32px;border-radius:50%;background:#0a0a0a;color:#fff;display:grid;place-items:center;margin-bottom:14px}
.rel i svg{width:15px;height:15px}
.rel b{font-weight:500;font-size:17px;letter-spacing:-.015em}
.rel span{font-size:14px;line-height:1.45;color:var(--dim)}
.rel em{margin-top:auto;padding-top:14px;font-style:normal;font-size:13px;color:var(--ink);display:flex;align-items:center;gap:4px}
.rel em svg{width:12px;height:12px}
.lgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.lgrid .intg{min-width:0}
.code{margin:0;padding:22px 24px;border-radius:14px;background:#0a0a0a;color:#e6e6e3;font:400 13px/1.7 var(--mono);white-space:pre-wrap;overflow-wrap:anywhere;box-shadow:0 30px 70px -24px rgba(0,0,0,.45)}
.code .k{color:#8b8b88}.code .s{color:#ffffff}.code .c{color:#6b6b6b}
.tbl td .src-o{margin-left:6px}
.pnote{margin:14px 0 0;font-size:13px;color:var(--muted)}
.cmp{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.cmp>div{min-width:0;padding:30px 32px 18px;border-radius:20px}
.cmp-old{background:#fbfbfa;box-shadow:inset 0 0 0 1px #ececea}
.cmp-new{background:#0a0a0a;color:#f4f4f2;background-image:radial-gradient(ellipse 80% 60% at 80% 0%,rgba(255,255,255,.1),transparent 70%);box-shadow:0 30px 70px -30px rgba(0,0,0,.55)}
.cmp-h{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:14px;color:var(--muted)}
.cmp-new .cmp-h{color:#a8a8a5}
.cmp-h svg{width:16px;height:16px;color:#fff}
.cmp ul{list-style:none;margin:0;padding:0}
.cmp li{display:flex;align-items:flex-start;gap:12px;padding:15px 0;border-top:1px solid #ececea;font-size:16px;line-height:1.45;letter-spacing:-.01em;color:#6b6b6b}
.cmp-new li{border-top-color:rgba(255,255,255,.1);color:#f4f4f2}
.cmp li>svg{flex:none;width:16px;height:16px;margin-top:3px;color:#b5b5b2}
.cmp li i{flex:none;width:22px;height:22px;border-radius:50%;background:#f4f4f2;color:#0a0a0a;display:grid;place-items:center;margin-top:0}
.cmp li i svg{width:12px;height:12px}
.rv{opacity:0;transform:translateY(14px);filter:blur(2px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1),filter .8s}
.rv.in{opacity:1;transform:none;filter:none}
@media (max-width:900px){
  .prow{grid-template-columns:minmax(0,1fr);gap:32px;padding:48px 0}
  .prow.flip .pcopy{order:0}
  .pts,.rel,.cmp{grid-template-columns:1fr}
  .cmp>div{padding:24px 22px 12px}
  .pts>div{border-left:0;padding-left:0;border-top:1px solid rgba(255,255,255,.1)}
  .pts>div:first-child{border-top:0}
  .lgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pshot>.vis{padding:14px}
  .fgrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;filter:none;transition:none}}
'''

def build_assets(s):
    css = cut(s, '<style>\n', '</style>')[len('<style>\n'):]
    open(os.path.join(ROOT, 'assets', 'omni.css'), 'w').write(css + PAGE_CSS)
    js = s[s.index('<script>\n(() => {'):]
    parts = [
      cut(js, '/* star tile for dark stages */', '/* ---------- clickable hero demo ---------- */'),
      cut(js, '/* fit scaler */', '/* billing toggle */'),
      cut(js, '/* starfield in every black band */', '/* hero constellation'),
      cut(js, '/* hero starlight', '/* nav: mega menus').replace("querySelectorAll('.wrap h1,.hero-form,.hlive')", "querySelectorAll('.wrap h1,.hero-form,.hlive,.plede,.pchip,.pcrumb')"),
      cut(js, '/* nav: mega menus', '/* hero email field'),
      cut(js, '/* finale: reveal and its own starfield */', '/* loop */'),
    ]
    out = ("/* Shared runtime for the product and team pages, cut from index.html by tools/pages/build.py. */\n(() => {\n"
      "const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;\n"
      "const ic = (n, c='i') => `<svg class=\"${c}\"><use href=\"#i-${n}\"/></svg>`;\n" + '\n'.join(parts) + r'''
/* email fields: check the address, then sign up */
document.querySelectorAll('.hero-form').forEach(f=>{ const i=f.querySelector('input');
  i.addEventListener('input',()=>f.classList.remove('bad'));
  f.addEventListener('submit',e=>{ e.preventDefault(); const v=i.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ f.classList.add('bad'); i.focus(); return; }
    location.href=f.action+'?email='+encodeURIComponent(v); }); });
/* reveal on scroll */
(function(){ const els=[...document.querySelectorAll('.rv')]; if(!('IntersectionObserver' in window)||reduce){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'}); els.forEach(e=>io.observe(e)); })();
faces();
function resizeAll(){ layoutFits(); initStars(); drawStars(performance.now()); }
resizeAll();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resizeAll, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(resizeAll);
if (!reduce){ const loop = t => { drawStars(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();
''')
    open(os.path.join(ROOT, 'assets', 'omni.js'), 'w').write(out)

def head_html(s, title, desc, path):
    meta = s[:s.index('<link rel="preconnect"')]
    meta = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', meta)
    meta = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc), meta)
    meta = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc), meta)
    meta = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + html.escape(title), meta)
    meta = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + SITE + path, meta)
    meta = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + SITE + path, meta)
    fonts = cut(s, '<link rel="preconnect"', '<style>\n')
    return meta + fonts + '<link rel="stylesheet" href="/assets/omni.css">\n</head>\n'

def defs_html(s):
    i = s.index('<svg width="0" height="0" style="position:absolute" aria-hidden="true">')
    return s[i:s.index('</svg>\n', s.index('</defs>', i)) + 7]

def finale_html(s, h=None, sub=None):
    f = cut(s, '<section class="finale" id="start">', '</main>')
    f = f.replace('href="#start">Start free', f'href="{SIGNUP}">Start free').replace('href="#demo">Book a demo', f'href="{DEMO}">Book a demo')
    if h: f = re.sub(r'<h2 class="fin-h">.*?</h2>', '<h2 class="fin-h">' + ' '.join(f'<span>{x}</span>' for x in h) + '</h2>', f)
    if sub: f = re.sub(r'<p class="fin-p">.*?</p>', f'<p class="fin-p">{sub}</p>', f)
    return f

def related(slugs, n=5):
    cards = ''
    for sl in slugs:
        s, n, d, i, g = BY[sl]
        cards += f'<a href="{url(s)}" class="rv"><i>{ic(i)}</i><b>{n}</b><span>{d}</span><em>Learn more{ic("ChevronRight")}</em></a>'
    return f'<section class="sec"><div class="wrap"><div class="mono-row"><span>Explore</span><span>{n}.0</span></div><div class="sec-head solo"><h2>Keep exploring</h2></div><div class="rel">{cards}</div></div></section>'

def faq_html(items, n='4.0'):
    det = ''.join(f'<details{" open" if k==0 else ""}><summary>{q}<span class="pm">{ic("Plus","i14")}</span></summary><p>{a}</p></details>' for k, (q, a) in enumerate(items))
    return f'<section class="sec" id="faq"><div class="wrap faq"><div class="side"><div class="mono-row" style="margin-bottom:28px"><span>Questions</span><span>{n}</span></div><h2>Questions, answered</h2><p>Still curious? <a href="{DEMO}" style="text-decoration:underline">Book a demo</a> and we\'ll walk you through it.</p></div><div>{det}</div></div></section>'

def merge(P):
    try:
        from content_copy import COPY
    except ImportError:
        return P
    c = COPY.get(P['slug'])
    if not c: return P
    P = dict(P); rows = c.get('rows')
    for k, v in c.items():
        if k not in ('rows', 'band'): P[k] = v
    if rows: P['rows'] = [dict(P['rows'][i], **r) for i, r in enumerate(rows)]
    if c.get('band'): P['band'] = dict(P['band'], **c['band'])
    return P

def swap_html(sw, n):
    old = ''.join(f'<li>{ic("X")}<span>{x}</span></li>' for x in sw['old'])
    new = ''.join(f'<li><i>{ic("Check")}</i><span>{x}</span></li>' for x in sw['new'])
    return (f'<section class="sec pswap"><div class="wrap"><div class="mono-row"><span>Why it matters</span><span>{n}.0</span></div>'
            f'<div class="sec-head"><div><h2>{sw["h"]}</h2></div><div><p>{sw["p"]}</p></div></div>'
            f'<div class="cmp"><div class="cmp-old rv"><p class="cmp-h">Without Omniscient</p><ul>{old}</ul></div>'
            f'<div class="cmp-new rv"><p class="cmp-h"><svg><use href="#mark"/></svg>With Omniscient</p><ul>{new}</ul></div></div></div></section>')

def page(s, P):
    P = merge(P)
    slug = P['slug']; _, name, line, icon, group = BY[slug]
    crumbs = {'Context': ('Product', '/#product'), 'Otto': ('Product', '/#product'), 'Ecosystem': ('Product', '/#product'), 'Teams': ('Teams', '/#teams')}[group]
    rows = ''
    for k, r in enumerate(P['rows']):
        pts = ''.join(f'<li>{ic("Check")}<span>{x}</span></li>' for x in r.get('pts', []))
        rows += (f'<div class="prow{" flip" if k % 2 else ""}"><div class="pcopy rv"><span class="eyebrow"><b>{k+1:02d}</b> {r["k"]}</span><h2>{r["h"]}</h2><p class="lede">{r["p"]}</p>'
                 + (f'<ul>{pts}</ul>' if pts else '') + f'</div><div class="rv">{r["v"]}</div></div>')
    band = P['band']
    pts = ''.join(f'<div><i>{ic(i)}</i><b>{b}</b><span>{t}</span></div>' for i, b, t in band['pts'])
    extra = P.get('extra', '')
    n = 1; swap = ''
    if P.get('swap'): swap = swap_html(P['swap'], n); n += 1
    nr = n; n += 1
    if extra: extra = extra.replace('<span>2.0</span>', f'<span>{n}.0</span>', 1); n += 1
    nb = n
    body = f'''<main id="top">
<section class="phero">
  <canvas id="hsky" aria-hidden="true"></canvas>
  <div class="wrap">
    <div class="pcrumb"><a href="{crumbs[1]}">{crumbs[0]}</a>{ic("ChevronRight")}<span>{group if group != "Teams" else "Omniscient for"}</span></div>
    <span class="pchip"><i>{ic(icon)}</i>{name}</span>
    <h1>{P["h1"]}</h1>
    <p class="plede">{P["lede"]}</p>
    <form class="hero-form" action="{SIGNUP}" novalidate>
      <label class="sr" for="hero-email">Work email</label>
      <input id="hero-email" name="email" type="email" autocomplete="email" placeholder="Work email" required>
      <button class="btn btn-black lg" type="submit">Get started {ic("ChevronRight","i14")}</button>
    </form>
    <p class="pnote">{P.get("note","Try Pro free for 14 days. No card needed.")}</p>
  </div>
  <div class="widebox pshot rv">{P["hero"]}</div>
</section>
{swap}
<section class="sec prows"><div class="wrap"><div class="mono-row"><span>{P.get("rows_label","How it works")}</span><span>{nr}.0</span></div>{rows}</div></section>
{extra}
<section class="cosmos pband"><canvas class="sky" aria-hidden="true"></canvas><div class="wrap"><div class="mono-row dark"><span>{band["k"]}</span><span>{nb}.0</span></div><h2 class="big">{band["h"]}</h2><div class="pts">{pts}</div></div></section>
{faq_html(P["faq"], f'{nb+1}.0')}
{related(P["rel"], nb+2)}
{finale_html(s, P.get("fin"), P.get("fin_p"))}</main>
'''
    out = '<!doctype html>\n<html lang="en-US">\n' + head_html(s, P['title'], P['desc'], url(slug)) + '<body class="sub">\n' + defs_html(s) + '\n' + nav_html() + '\n' + body + footer_html() + '\n<script src="/assets/omni.js" defer></script>\n</body>\n</html>\n'
    d = os.path.join(ROOT, slug); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(out)
    return slug

def patch_home(s):
    s = re.sub(r'<header class="nav">.*?</header>', lambda m: nav_html(), s, count=1, flags=re.S)
    s = re.sub(r'<footer id="contact">.*?</footer>', lambda m: footer_html(), s, count=1, flags=re.S)
    s = s.replace('<form class="hero-form" action="#start" novalidate>', f'<form class="hero-form" action="{SIGNUP}" novalidate>')
    s = s.replace("    location.hash='start'; });", "    location.href=f.action+'?email='+encodeURIComponent(v); });")
    s = re.sub(r'href="#start">(Start free[^<]*)', lambda m: f'href="{SIGNUP}">{m.group(1)}', s)
    s = s.replace('href="#demo">Book a demo', f'href="{DEMO}">Book a demo')
    s = s.replace('href="#start">Choose Starter', f'href="{SIGNUP}">Choose Starter').replace('href="#demo">Talk to sales', f'href="{DEMO}">Talk to sales')
    return s

if __name__ == '__main__':
    import importlib
    s = home()
    s2 = patch_home(s)
    if s2 != s: open(os.path.join(ROOT, 'index.html'), 'w').write(s2); s = s2
    build_assets(s)
    batches = sys.argv[1:] or ['context', 'otto', 'ecosystem', 'teams']
    for b in batches:
        mod = importlib.import_module('content_' + b)
        for P in mod.PAGES: print('built', page(s, P))
