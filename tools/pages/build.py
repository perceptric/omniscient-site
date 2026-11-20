# Builds the product, integration, developer and team pages in the home page's style.
# Shared look: assets/omni.css and assets/omni.js are cut from index.html, so they always match the home page.
# Run: python3 tools/pages/build.py [batch ...]   then: node tools/layout.mjs
import os, re, sys, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.dirname(__file__))
from ui import ic, blogo, LOGOS

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
  ('security', 'Security', 'How we keep your data safe', 'Ban', 'Trust'),
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
      + rcol('Company', [('Security', 'How we keep your data safe', '/security/'), ('Pricing', 'Per seat, with Otto included', '/pricing/'), ('Contact', 'hello@tryomniscient.com', 'mailto:hello@tryomniscient.com')])
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
      {col('Company', [('Pricing', '/pricing/'), ('Blog', '/blog/'), ('Security', '/security/'), ('Contact', 'mailto:hello@tryomniscient.com')])}
    </div>
    <div class="fbot"><span class="fleg">© 2026 Omniscient<a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="#cookies">Cookie settings</a><a href="https://unsplash.com/" rel="noopener">Photos: Unsplash</a></span><span>The all-seeing CRM</span></div>
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
.phero{position:relative;isolation:isolate;overflow:hidden;padding-block:84px 0}
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
.phero .wrap{display:flex;flex-direction:column;align-items:center;text-align:center}
.phero .hpill{margin-top:4px}
.hpill .hp-ic{display:inline-grid;place-items:center;color:var(--ink)}
.hpill .hp-ic svg{width:14px;height:14px}
.phero h1{margin:26px auto 0;max-width:17ch;font-size:clamp(42px,6.4vw,88px)}
.phero .plede{margin:24px auto 0;max-width:46ch;text-wrap:balance}
.phero .hero-form{margin:32px auto 0}
.phero .horizon.phz{margin-top:56px;padding-top:84px!important}
.phz>.fit{position:relative;z-index:2}
.phz .acc{z-index:6}
.phz .acc-tr{top:40px}
.phz .acc-bl,.phz .acc-br{bottom:auto;top:40px}
.pshot{position:relative}
.pshot::after{content:"";position:absolute;left:0;right:0;bottom:0;height:180px;z-index:7;pointer-events:none;background:linear-gradient(rgba(255,255,255,0),#fff 92%)}
@media (max-width:900px){.phero .horizon.phz{margin-top:40px;padding-top:56px!important}.pshot::after{height:90px}}
.pshot{margin-top:0}
.plogos{display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:56px}
.plogos p{margin:0;font-size:13px;color:var(--muted)}
.plogos>div{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.plogo{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 9px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);font-size:14px;color:var(--ink)}
.plogo img{box-shadow:none!important;padding:0!important}
.um-by{display:block;align-self:flex-end;margin-bottom:4px;font-size:12px;font-weight:500;color:var(--t3,#737373)}
/* motion: screens fill in one line at a time, cards drift, old ways get struck through */
.rv .um,.rv .om,.rv .lrow,.rv .urow,.rv .mrow,.rv .tli,.rv .flow>*,.rv .oc,.rv .src,.rv .slash a,.rv .card-b>div,.rv .toast,.rv .plogo,.rv .pts>div,.rv .cmp li{opacity:0;transform:translateY(8px);transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}
.rv.in .um,.rv.in .om,.rv.in .lrow,.rv.in .urow,.rv.in .mrow,.rv.in .tli,.rv.in .flow>*,.rv.in .oc,.rv.in .src,.rv.in .slash a,.rv.in .card-b>div,.rv.in .toast,.rv.in .plogo,.rv.in .pts>div,.rv.in .cmp li{opacity:1;transform:none}
.acc{animation:acc-in .7s cubic-bezier(.22,1,.36,1) both,acc-float 6s ease-in-out 1.2s infinite}
@keyframes acc-float{50%{transform:translateY(-6px)}}
.cmp-old li span{background:linear-gradient(currentColor,currentColor) 0 58%/0 1px no-repeat;transition:background-size .7s cubic-bezier(.65,0,.35,1)}
.cmp-old.in li span{background-size:100% 1px}
.cmp-new li i{transform:scale(.4);opacity:0;transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .3s}
.cmp-new.in li i{transform:none;opacity:1}
.plogo{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s,opacity .55s}
.plogo:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(0,0,0,.1),0 10px 24px -12px rgba(0,0,0,.3)}
.ubub{position:relative}
.rv.in .om .body>p:first-child::after{content:"";display:inline-block;width:2px;height:1em;margin-left:3px;vertical-align:-2px;background:currentColor;animation:caret 1s steps(1) 4 both}
@keyframes caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.rv .um,.rv .om,.rv .lrow,.rv .urow,.rv .mrow,.rv .tli,.rv .flow>*,.rv .oc,.rv .src,.rv .slash a,.rv .card-b>div,.rv .toast,.rv .plogo,.rv .pts>div,.rv .cmp li{opacity:1;transform:none;transition:none}.acc{animation:none}.cmp-old li span{background-size:100% 1px;transition:none}.cmp-new li i{transform:none;opacity:1}}
.phero:has(+ #pricing){padding-bottom:0}
.cmpt{overflow-x:auto;border-radius:16px;box-shadow:0 0 0 1px rgba(0,0,0,.07);background:#fff}
.cmpt table{width:100%;min-width:680px;border-collapse:collapse;font-size:14px}
.cmpt th,.cmpt td{padding:13px 18px;border-top:1px solid #f0f0ee;text-align:center;vertical-align:middle}
.cmpt thead th{border-top:0;font-weight:600;font-size:15px;padding:18px;position:sticky;top:0;background:#fff}
.cmpt thead th small{display:block;margin-top:4px;font-weight:400;font-size:13px;color:var(--muted)}
.cmpt thead th.pop{background:#0a0a0a;color:#fff;border-radius:12px 12px 0 0}
.cmpt thead th.pop small{color:#a8a8a5}
.cmpt tbody th{text-align:left;font-weight:400;color:#3b3b3b;min-width:260px}
.cmpt tr.grp th{text-align:left;font-weight:600;font-size:13px;color:var(--ink);background:#fafaf9;padding-top:16px}
.cmpt td:nth-child(4){background:#fafaf9}
.cmpt .tick{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#0a0a0a;color:#fff}
.cmpt .tick svg{width:12px;height:12px}
.cmpt .no{color:#c4c4c4}
.cmpt td b{font-weight:500}
.fleg{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px 18px}
.fleg a{color:inherit}
.fleg a:hover{color:var(--ink)}
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
/* night pages: the home page's structure and look on every product, team and pricing page */
body.cosmic .phero{padding-block:120px 0}
body.cosmic .phero h1{color:#f6f6f3;text-shadow:0 0 60px rgba(160,175,255,.18)}
body.cosmic .plede{color:#a8a8a6}
body.cosmic .phero .horizon.phz{margin-top:64px;padding-top:clamp(200px,19vw,290px)!important}
body.cosmic .pshot::after{background:linear-gradient(rgba(3,3,4,0),var(--bg) 92%)}
body.cosmic .plogo{background:rgba(255,255,255,.04);color:#f2f2ee;box-shadow:var(--glass-sh)}
body.cosmic .plogo img{background:#fff;border-radius:6px;padding:2px!important}
body.cosmic .plogos p{color:#8a8a8e}
body.cosmic .pr-sub{margin:20px 0 0;max-width:46ch;font-size:17px;line-height:1.55;color:#9a9a9e}
body.cosmic .pr-items{margin-top:40px}
body.cosmic .pr-it b{font-weight:400;color:#8f8f94;text-decoration:line-through;text-decoration-color:rgba(255,255,255,.25)}
body.cosmic .pr-it p{display:flex;align-items:flex-start;gap:10px;margin-top:8px;color:#f2f2ee;font-size:16.5px}
body.cosmic .pr-it p svg{flex:none;margin-top:4px;color:#5fc79a}
body.cosmic .sec-title.duo{color:#7f7f84}
body.cosmic .sec-title.duo span{color:#f4f4f1}
body.cosmic .prows{padding-top:110px}
body.cosmic .prow+.prow{border-top-color:rgba(255,255,255,.08)}
body.cosmic .pcopy h2{color:#f4f4f1;max-width:20ch}
body.cosmic .pcopy h2 .num{color:#6f6f74;font-variant-numeric:tabular-nums}
body.cosmic .pcopy li{color:#c4c4c0}
body.cosmic .pcopy li svg{color:#f4f4f1}
body.cosmic .rel a{background:var(--glass);box-shadow:var(--glass-sh)}
body.cosmic .rel a:hover{background:rgba(255,255,255,.06);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 0 0 1px rgba(255,255,255,.18),0 20px 40px -20px rgba(0,0,0,.9)}
body.cosmic .rel i{background:#f4f4f1;color:#0a0a0a}
body.cosmic .rel span{color:#9a9a9e}
body.cosmic .rel em{color:#f4f4f1}
body.cosmic .cmpt{background:rgba(255,255,255,.02);box-shadow:var(--glass-sh)}
body.cosmic .cmpt th,body.cosmic .cmpt td{border-top-color:rgba(255,255,255,.07)}
body.cosmic .cmpt thead th{background:#0b0b0d;color:#f2f2ee}
body.cosmic .cmpt thead th.pop{background:#f4f4f1;color:#0a0a0a}
body.cosmic .cmpt thead th.pop small{color:#555}
body.cosmic .cmpt tbody th{color:#c4c4c0}
body.cosmic .cmpt tr.grp th{background:rgba(255,255,255,.03);color:#f2f2ee}
body.cosmic .cmpt td:nth-child(4){background:rgba(255,255,255,.03)}
body.cosmic .cmpt .tick{background:#f4f4f1;color:#0a0a0a}
body.cosmic .cmpt .no{color:#55555a}
body.cosmic .code{background:#0b0b0d;box-shadow:0 0 0 1px rgba(255,255,255,.09),0 30px 70px -24px rgba(0,0,0,.9)}
@media (max-width:900px){body.cosmic .phero{padding-block:72px 0}body.cosmic .phero .horizon.phz{padding-top:200px!important}}
'''

def build_assets(s):
    css = cut(s, '<style>\n', '</style>')[len('<style>\n'):]
    open(os.path.join(ROOT, 'assets', 'omni.css'), 'w').write(css + PAGE_CSS)
    js = s[s.index('<script>\n(() => {'):]
    parts = [
      cut(js, '/* star tile for dark stages */', '/* ---------- clickable hero demo ---------- */'),
      cut(js, '/* fit scaler */', '/* billing toggle */'),
      cut(js, '/* starfield in every black band */', '/* hero constellation'),
      cut(js, '/* hero starlight', '/* nav: mega menus').replace("querySelectorAll('.wrap h1,.hero-form,.hlive,.hlede,.hpill,.hchecks')", "querySelectorAll('.wrap h1,.hero-form,.hlive,.hlede,.hpill,.hchecks,.plede,.pchip,.pcrumb')"),
      cut(js, '/* nav: mega menus', '/* hero email field'),
      cut(js, '/* finale: reveal and its own starfield */', '/* loop */'),
      cut(js, '/* the night sky behind the whole page', '/* sticky feature story */'),
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
/* reveal on scroll: each revealed block fills in its lines one after another */
const STAGGER='.um,.om,.lrow,.urow,.mrow,.tli,.flow>*,.oc,.src,.slash a,.card-b>div,.toast,.plogo,.pts>div,.cmp li,.cmp li span,.cmp li i';
document.querySelectorAll('.rv').forEach(r=>{ let k=0; r.querySelectorAll(STAGGER).forEach(el=>{ if(el.matches('.cmp li span,.cmp li i')){ el.style.transitionDelay=(180+[...el.closest('ul').children].indexOf(el.closest('li'))*160)+'ms'; return; } el.style.transitionDelay=Math.min(1400,120+k++*90)+'ms'; }); });
(function(){ const els=[...document.querySelectorAll('.rv')]; if(!('IntersectionObserver' in window)||reduce){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'}); els.forEach(e=>io.observe(e)); })();
/* billing switch on the Pricing page */
(function(){ const by=document.getElementById('b-year'), bm=document.getElementById('b-month'); if(!by||!bm) return;
  const set=y=>{ by.setAttribute('aria-pressed',y); bm.setAttribute('aria-pressed',!y);
    document.querySelectorAll('.price b[data-y]').forEach(b=>b.textContent='$'+(y?b.dataset.y:b.dataset.m));
    document.querySelectorAll('.note[data-y]').forEach(n=>n.textContent=y?n.dataset.y:n.dataset.m); };
  by.addEventListener('click',()=>set(true)); bm.addEventListener('click',()=>set(false)); })();
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
    return f'<section class="sec"><div class="wrap"><h2 class="sec-title">Keep exploring</h2><div class="rel">{cards}</div></div></section>'

def faq_html(items, n='4.0'):
    det = ''.join(f'<details{" open" if k==0 else ""}><summary>{q}<span class="pm">{ic("Plus","i14")}</span></summary><p>{a}</p></details>' for k, (q, a) in enumerate(items))
    return f'<section class="sec" id="faq"><div class="wrap faq"><div class="side"><h2>Questions, answered</h2><p>Still curious? <a href="{DEMO}" style="text-decoration:underline">Book a demo</a> and we\'ll walk you through it.</p></div><div>{det}</div></div></section>'

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

# The page body for night pages: the starfield layer and the scripts that draw the globe, monolith and panels
SPACE = '<div class="space" aria-hidden="true"><div class="nebula"></div><canvas id="space"></canvas></div>'
NIGHT_JS = '<script src="/assets/globe.js" defer></script>\n<script src="/assets/species.js" defer></script>\n'

def shell_html(s, title, desc, path, body):
    return ('<!doctype html>\n<html lang="en-US">\n' + head_html(s, title, desc, path) + '<body class="sub cosmic">\n' + SPACE + '\n' + defs_html(s) + '\n' + nav_html() + '\n'
            + body + footer_html() + '\n' + NIGHT_JS + '<script src="/assets/consent.js" defer></script>\n<script src="/assets/omni.js" defer></script>\n</body>\n</html>\n')

def problem_html(sw):
    # the problem, as on the home page: the monolith beside each old way and what replaces it
    items = ''.join(f'<div class="pr-it"><b>{o}</b><p>{ic("Check","i14")}{n}</p></div>' for o, n in zip(sw['old'], sw['new']))
    return (f'<section class="problem"><div class="wrap pr-grid"><div class="pr-art"><img src="/assets/img/monolith-700.webp" srcset="/assets/img/monolith-700.webp 700w, /assets/img/monolith.webp 1254w" sizes="(max-width:900px) 92vw, 600px" width="1254" height="1254" loading="lazy" decoding="async" alt="A black monolith labeled legacy CRM towers over a person on rocky ground at dawn"></div>'
            f'<div class="pr-copy"><h2 class="pr-h">{sw["h"]}</h2><p class="pr-sub">{sw["p"]}</p><div class="pr-items">{items}</div></div></div></section>')

def panels_html(band):
    # three panels in dots, as in "Introducing a new species" on the home page
    figs = ''.join(f'<figure class="panel rv"><canvas data-dfig="{k+1}" aria-hidden="true"></canvas><figcaption><b>{b}</b><span>{t}</span></figcaption></figure>' for k, (i, b, t) in enumerate(band['pts'][:3]))
    return f'<section class="cosmos species"><canvas class="sky" aria-hidden="true"></canvas><div class="wrap"><h2 class="sec-title duo">{band["h"]}</h2><div class="figs">{figs}</div></div></section>'

def page(s, P):
    P = merge(P)
    slug = P['slug']; _, name, line, icon, group = BY[slug]
    crumbs = {'Context': ('Product', '/#product'), 'Otto': ('Product', '/#product'), 'Ecosystem': ('Product', '/#product'), 'Teams': ('Teams', '/#teams'), 'Trust': ('Security', '/security/')}[group]
    # the numbered parts, as in the home page's story
    rows = ''
    for k, r in enumerate(P['rows']):
        pts = ''.join(f'<li>{ic("Check")}<span>{x}</span></li>' for x in r.get('pts', []))
        rows += (f'<div class="prow{" flip" if k % 2 else ""}"><div class="pcopy rv"><h2><span class="num">{k+1}.</span> {r["h"]}</h2><p class="lede">{r["p"]}</p>'
                 + (f'<ul>{pts}</ul>' if pts else '') + f'</div><div class="rv">{r["v"]}</div></div>')
    extra = re.sub(r'<div class="mono-row[^"]*"[^>]*>.*?</div>', '', P.get('extra', ''))
    hero = P['hero']
    if hero.startswith('<div class="vis">'):
        hero = '<div class="horizon phz"><div class="planet" aria-hidden="true"></div>' + hero[len('<div class="vis">'):]
    works = ''
    if P.get('works'):
        works = '<div class="wrap plogos rv"><p>Works with</p><div>' + ''.join(f'<span class="plogo">{blogo(n, 22, 6)}{n}</span>' for n in P['works'] if n in LOGOS) + '</div></div>'
    problem = problem_html(P['swap']) if P.get('swap') else ''
    HOW = {'Data model': 'How the data model works', 'Clean data': 'How clean data works', 'Meetings': 'How meetings work', 'Email sync': 'How email sync works',
           'Find leads': 'How finding leads works', 'Skills': 'How skills work', 'Knowledge': 'How knowledge works', 'Workflows': 'How workflows work', 'Apps': 'How apps connect',
           'Chrome extension': 'How the Chrome extension works', 'Developers': 'How the API works', 'Customer success': 'How customer success teams use Omniscient', 'Agencies': 'How agencies use Omniscient', 'Founders': 'How founders use Omniscient'}
    title = P.get('rows_title') or HOW.get(name) or {'Teams': f'How {name.lower()} teams use Omniscient', 'Trust': 'How we protect your data'}.get(group, f'How {name} works')
    body = f'''<main id="top">
<section class="phero">
  <canvas id="hsky" aria-hidden="true"></canvas>
  <div class="wrap">
    <a class="hpill" href="{crumbs[1]}"><span class="hp-new">{ {"Teams": "For teams", "Trust": "Trust"}.get(group, group) }</span><span class="hp-ic">{ic(icon)}</span>{name}</a>
    <h1>{P["h1"]}</h1>
    <p class="plede">{P["lede"]}</p>
    <form class="hero-form" action="{SIGNUP}" novalidate>
      <label class="sr" for="hero-email">Work email</label>
      <input id="hero-email" name="email" type="email" autocomplete="email" placeholder="Work email" required>
      <button class="btn btn-black lg" type="submit">Get started {ic("ChevronRight","i14")}</button>
    </form>
    <ul class="hchecks"><li>{ic("Check","i14")}Try Pro free for 14 days</li><li>{ic("Check","i14")}No card needed</li></ul>
  </div>
  <div class="widebox pshot rv">{hero}</div>
  {works}
</section>
{problem}
{panels_html(P['band'])}
<section class="sec prows"><div class="wrap"><h2 class="sec-title">{title}</h2>{rows}</div></section>
{extra}
{faq_html(P["faq"])}
{related(P["rel"])}
{finale_html(s, P.get("fin"), P.get("fin_p"))}</main>
'''
    out = shell_html(s, P['title'], P['desc'], url(slug), body)
    d = os.path.join(ROOT, slug); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(out)
    return slug

FOOT_CSS = '\n/* footer: six columns */\n.fgrid{grid-template-columns:1.2fr repeat(5,minmax(0,1fr))!important}\n@media (max-width:900px){.fgrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}\n'

def patch_home(s):
    if '/assets/consent.js' not in s and '</body>' in s:
        k = s.rindex('</body>'); s = s[:k] + '<script src="/assets/consent.js" defer></script>\n' + s[k:]
    s = s.replace(FOOT_CSS, '')
    i = s.index('<style>\n'); j = s.index('</style>', i)
    s = s[:j] + FOOT_CSS + s[j:]
    s = re.sub(r'<header class="nav">.*?</header>', lambda m: nav_html(), s, count=1, flags=re.S)
    s = re.sub(r'<footer id="contact">.*?</footer>', lambda m: footer_html(), s, count=1, flags=re.S)
    s = s.replace('<form class="hero-form" action="#start" novalidate>', f'<form class="hero-form" action="{SIGNUP}" novalidate>')
    s = s.replace("    location.hash='start'; });", "    location.href=f.action+'?email='+encodeURIComponent(v); });")
    s = re.sub(r'href="#start">(Start free[^<]*)', lambda m: f'href="{SIGNUP}">{m.group(1)}', s)
    s = s.replace('href="#demo">Book a demo', f'href="{DEMO}">Book a demo')
    s = s.replace('href="#start">Choose Starter', f'href="{SIGNUP}">Choose Starter').replace('href="#demo">Talk to sales', f'href="{DEMO}">Talk to sales')
    return s

# ---------- the header and footer for the older pages (blog, pricing, security, privacy, terms, 404) ----------
# partials/header.html and footer.html get the home page's nav and footer, inside <div class="oc">.
# assets/chrome.css holds only the nav, menu, footer and button rules, scoped to .oc so they never touch base.css.
KEEP = re.compile(r'^(\.nav\b|\.brand\b|\.links\b|\.nav-cta\b|\.btn\b|\.btn-black|\.btn-text|\.mm|footer\b|\.fgrid\b|\.fbot\b|\.wrap\b)')

def scope_rules(css):
    out = []; i = 0; n = len(css)
    def block_end(j):
        d = 0
        while j < n:
            if css[j] == '{': d += 1
            elif css[j] == '}':
                d -= 1
                if d == 0: return j
            j += 1
        return n
    while i < n:
        b = css.find('{', i)
        if b < 0: break
        sel = re.sub(r'/\*.*?\*/', '', css[i:b], flags=re.S).strip()
        e = block_end(b)
        body = css[b+1:e]
        if sel.startswith('@media'):
            inner = scope_rules(body)
            if inner: out.append(sel + '{' + inner + '}')
        elif sel and not sel.startswith('@'):
            parts = [p.strip() for p in sel.split(',')]
            keep = [p for p in parts if KEEP.match(p)]
            if keep: out.append(','.join('.oc ' + p for p in keep) + '{' + body + '}')
        i = e + 1
    return '\n'.join(out)

def build_chrome(s):
    css = cut(s, '<style>\n', '</style>')[len('<style>\n'):]
    root = re.search(r':root\{(.*?)\n\}', css, flags=re.S).group(1)
    chrome = ('/* Home page nav, menus and footer for the older pages. Written by tools/pages/build.py. */\n'
              '.oc{display:contents;' + root.strip() + '}\n'
              '.oc .nav,.oc footer{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased}\n'
              '.oc .nav a:not(.btn),.oc footer a{color:inherit;text-decoration:none}.oc .nav a.btn{text-decoration:none}\n'
              '.oc .nav button{font:inherit}\n'
              '.oc .nav *,.oc footer *{box-sizing:border-box}\n'
              '.oc footer{background:#fff}\n'
              + scope_rules(css) + '\n')
    open(os.path.join(ROOT, 'assets', 'chrome.css'), 'w').write(chrome)
    js = s[s.index('<script>\n(() => {'):]
    open(os.path.join(ROOT, 'assets', 'chrome.js'), 'w').write('/* Home page menus for the older pages. Written by tools/pages/build.py. */\n' + cut(js, '/* nav: mega menus', '/* hero email field'))
    mark = re.search(r'<symbol id="mark".*?</symbol>', s, flags=re.S).group(0)
    defs = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{mark}</defs></svg>'
    open(os.path.join(ROOT, 'partials', 'header.html'), 'w').write(f'<div class="oc">\n{defs}\n{nav_html()}\n</div>\n')
    open(os.path.join(ROOT, 'partials', 'footer.html'), 'w').write(f'<div class="oc">\n{footer_html()}\n</div>\n')
    h = open(os.path.join(ROOT, 'partials', 'head.html')).read()
    if 'chrome.css' not in h:
        h = h.replace('<link rel="stylesheet" href="/assets/base.css">', '<link rel="stylesheet" href="/assets/base.css">\n<link rel="stylesheet" href="/assets/chrome.css">')
        h = h.replace('<script src="/assets/site.js" defer></script>', '<script src="/assets/site.js" defer></script>\n<script src="/assets/chrome.js" defer></script>')
    if 'consent.js' not in h:
        h = h.replace('<script src="/assets/chrome.js" defer></script>', '<script src="/assets/chrome.js" defer></script>\n<script src="/assets/consent.js" defer></script>')
    open(os.path.join(ROOT, 'partials', 'head.html'), 'w').write(h)

# ---------- the Pricing page, in the same style ----------
CMP = [
  ('Capture and records', [
    ('Gmail, Outlook and calendar capture', 1, 1, 1, 1),
    ('Search, view and share records', 1, 1, 1, 1),
    ('People, companies and the activity timeline', 1, 1, 1, 1),
    ('Record pages, tables and notes', 0, 1, 1, 1),
    ('Custom fields and saved views', 0, 0, 1, 1)]),
  ('Otto and AI', [
    ('Ask Otto, fast answers', 0, 'No limit', 'No limit', 'No limit'),
    ('Smart answers per seat a month', 0, 0, '150', '300'),
    ('"Think harder" answers per seat a month', 0, 0, '20', '50'),
    ('Follow-up email drafts', 0, 1, 1, 1),
    ('Otto fills fields with proof, plus a Suggestions inbox', 0, 0, 1, 1),
    ('AI columns', 0, 0, 1, 1),
    ('Automated skills', 0, '2', '5', '15'),
    ('Workspace-wide AI instructions', 0, 0, 0, 1)]),
  ('Meetings', [
    ('Meeting notes from Meet and Zoom transcripts', 0, 1, 1, 1),
    ('Meeting prep briefs', 0, 0, 1, 1),
    ('MEDDICC and BANT filled in from calls', 0, 0, 0, 1)]),
  ('Pipeline and reporting', [
    ('Daily digest', 0, 1, 1, 1),
    ('Pipeline board and forecast', 0, 0, 1, 1),
    ('Slack alerts and digest', 0, 0, 1, 1),
    ('Deal review, rep scorecards and call coaching', 0, 0, 0, 1),
    ('Dashboards from a sentence', 0, 0, 0, 1)]),
  ('Team and admin', [
    ('Add Free teammates who view or log data', 0, 0, 1, 1),
    ('Admin controls', 0, 0, 0, 1)]),
]

PRICING_FAQ = [
  ('Do I have to leave my current CRM?', 'No. Connect your inbox and calendar and run Omniscient next to it. When you are ready, we move your companies, people, deals and notes over from HubSpot, Salesforce, Pipedrive or Attio for you.'),
  ('Who gets a Free seat?', 'Teammates who only view records or log their own email and meetings. Free seats come with a workspace that has at least one Pro or Business seat.'),
  ('Is the AI really included?', 'Yes. Every paid seat includes Otto. Fast answers have no limit, and Pro and Business add a monthly pool of smart and "Think harder" answers shared across the workspace. When a pool runs out, fast answers keep working until the next month.'),
  ('Does a bot join my calls?', 'Only if you want one. Omniscient reads the transcripts Google Meet, Zoom and Teams already create. The call recording add-on sends a notetaker when you would rather Omniscient record the call.'),
  ('Can Omniscient send follow-up emails for me?', 'Otto writes drafts that you send from your own inbox. Workflows can also send follow-ups from your team\'s own templates, from each owner\'s mailbox, and a reply stops the run.'),
  ('What if Otto gets something wrong?', 'Every value Otto suggests shows the quote it came from, and it waits for you to accept or skip it. Values a person typed are never changed, and you can undo any change.'),
  ('Do you offer discounts for bigger teams?', 'Yes. Teams of 21 to 50 seats get 10% off, and 51 to 100 seats get 20% off. For more than 100 seats, talk to us.'),
]

def pricing_page(s):
    cell = lambda v: (f'<td><span class="tick">{ic("Check","i14")}</span></td>' if v == 1 else '<td><span class="no">–</span></td>' if v == 0 else f'<td><b>{v}</b></td>')
    rows = ''
    for g, items in CMP:
        rows += f'<tr class="grp"><th colspan="5">{g}</th></tr>' + ''.join(f'<tr><th>{n}</th>{cell(a)}{cell(b)}{cell(c)}{cell(d)}</tr>' for n, a, b, c, d in items)
    table = (f'<div class="cmpt rv"><table><thead><tr><th></th><th>Free<small>$0</small></th><th>Starter<small>$19</small></th><th class="pop">Pro<small>$49</small></th><th>Business<small>$99</small></th></tr></thead><tbody>{rows}</tbody></table></div>')
    plans = cut(s, '<section class="sec" id="pricing">', '<section class="sec" id="faq">')
    plans = plans.replace('<div class="mono-row"><span>Pricing</span><span>6.0</span></div>', '<div class="mono-row"><span>Plans</span><span>1.0</span></div>')
    plans = re.sub(r'<div class="sec-head">.*?</div>\s*</div>', '<div class="sec-head"><div><h2>Pick the plan that fits your team</h2></div><div><p>Teammates who only view or log data are free on Pro and Business.</p></div></div>', plans, count=1, flags=re.S)
    plans = plans.replace('<div class="plans">', '<div class="plans rv">', 1)
    body = f'''<main id="top">
<section class="phero">
  <canvas id="hsky" aria-hidden="true"></canvas>
  <div class="wrap">
    <span class="hpill"><span class="hp-new">Pricing</span><span class="hp-ic">{ic("Dollar")}</span>Per seat, AI included</span>
    <h1>Pay per seat. Otto is included.</h1>
    <p class="plede">Every paid seat comes with Otto and the AI behind him, so a busy month never adds a usage bill. Start with a 14-day free trial of Pro.</p>
    <form class="hero-form" action="{SIGNUP}" novalidate>
      <label class="sr" for="hero-email">Work email</label>
      <input id="hero-email" name="email" type="email" autocomplete="email" placeholder="Work email" required>
      <button class="btn btn-black lg" type="submit">Start free trial {ic("ChevronRight","i14")}</button>
    </form>
    <ul class="hchecks"><li>{ic("Check","i14")}Try Pro free for 14 days</li><li>{ic("Check","i14")}No card needed</li></ul>
  </div>
</section>
{plans}
<section class="sec"><div class="wrap"><div class="sec-head"><div><h2>Everything in each plan</h2></div><div><p>Prices are per seat a month, billed yearly. Monthly billing costs 20% more.</p></div></div>{table}</div></section>
{faq_html(PRICING_FAQ)}
{finale_html(s, ['Start free.', 'Pick a plan', 'when it clicks.'], 'Try Pro free for 14 days. No card needed.')}</main>
'''
    out = shell_html(s, 'Pricing: Omniscient', 'Omniscient pricing per seat, with Otto and the AI included. Free seats for viewers, Starter $19, Pro $49, Business $99, billed yearly. Try Pro free for 14 days.', '/pricing/', body)
    open(os.path.join(ROOT, 'pricing', 'index.html'), 'w').write(out)

if __name__ == '__main__':
    import importlib
    s = home()
    s2 = patch_home(s)
    if s2 != s: open(os.path.join(ROOT, 'index.html'), 'w').write(s2); s = s2
    build_assets(s)
    build_chrome(s)
    pricing_page(s)
    batches = sys.argv[1:] or ['context', 'otto', 'ecosystem', 'teams', 'company']
    for b in batches:
        mod = importlib.import_module('content_' + b)
        for P in mod.PAGES: print('built', page(s, P))
