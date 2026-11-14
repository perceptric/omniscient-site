# Small builders for product screens, in the same classes the home page uses.
def ic(n, c='i'): return f'<svg class="{c}"><use href="#i-{n}"/></svg>'
def otto(s=16): return f'<svg width="{s}" height="{s}"><use href="#otto"/></svg>'
def av(k, s='s28'): return f'<span class="av {s}">{k}</span>'
def logo(k, c='', s=''): return f'<span class="logo {c} {s}">{k}</span>'
def badge(t, cls=''): return f'<span class="badge {cls}">{t}</span>'
def byotto(): return f'<span class="byotto">{otto(14)}Otto</span>'

def head(icon, title, ct='', crumb='', acts=True, extra=''):
    a = f'<div class="acts">{extra}<span class="pb">{ic("Plus","i14")}New</span><span class="ib">{otto()}</span></div>' if acts else (f'<div class="acts">{extra}</div>' if extra else '')
    c = f'<span class="cr">{crumb}</span><span class="sl">/</span>' if crumb else ''
    n = f'<span class="ct">{ct}</span>' if ct else ''
    return f'<div class="win-h">{c}<span class="pi">{ic(icon)}</span><b>{title}</b>{n}{a}</div>'

def dock(ph='Ask Otto'):
    return f'<div class="dock"><svg class="o"><use href="#otto"/></svg><span>{ph}</span><span class="sp"></span><span class="ib">{ic("Mic")}</span><span class="send">{ic("ArrowUp")}</span></div>'

def shell(active, page, h=660):
    h = max(h, 660)
    return f'<div class="app shell" style="height:{h}px"><div class="sb" data-sb="{active}"></div><div class="page">{page}</div></div>'

def win(inner, w=620, style=''):
    return f'<div class="app win" style="width:{w}px;{style}">{inner}</div>'

def card(icon, title, body, right='', foot='', style=''):
    r = f'<span class="r">{right}</span>' if right else ''
    f = f'<div class="card-f">{foot}</div>' if foot else ''
    return f'<div class="card" style="{style}"><div class="card-h">{ic(icon,"i14")}{title}{r}</div><div class="card-b">{body}</div>{f}</div>'

def pb(t, icon='Check'): return f'<span class="pb sm">{ic(icon,"i14")}{t}</span>'
def ib(icon): return f'<span class="ib">{ic(icon)}</span>'

def um(text, skill=None, who='JR'):
    s = f'<span class="skchip">{ic("Box","i12")}{skill}</span>' if skill else ''
    return f'<div class="um"><div class="stack">{s}<div class="ubub">{text}</div></div>{av(who)}</div>'

def om(*parts):
    return f'<div class="om"><svg><use href="#otto"/></svg><div class="body">{"".join(parts)}</div></div>'

def p(t, style=''): return f'<p style="{style}">{t}</p>'

def chat(*items, pad='26px 28px 20px'):
    return f'<div style="padding:{pad};display:flex;flex-direction:column;gap:20px;background:#fff">{"".join(items)}</div>'

def composer(ph='Ask anything, or type / for skills'):
    return f'<div class="composer"><div class="ta">{ph}</div><div class="row">{ib("Plus")}{ib("Mic")}<span class="sp"></span><span class="send">{ic("ArrowUp")}</span></div></div>'

def lrow(a, name, sub, em=''):
    e = f'<em>{em}</em>' if em else ''
    return f'<div class="lrow">{av(a)}<b>{name}</b><span>{sub}</span>{e}</div>'

def lrow_co(k, c, name, sub, em=''):
    e = f'<em>{em}</em>' if em else ''
    return f'<div class="lrow">{logo(k,c,"s28")}<b>{name}</b><span>{sub}</span>{e}</div>'

def mini(rows, pad='8px 20px'): return f'<div class="mini" style="padding:{pad}">{"".join(rows)}</div>'
def mrow(lead, b, small, right=''):
    return f'<div class="mrow">{lead}<div class="tx"><b>{b}</b><small>{small}</small></div>{right}</div>'
def chip(icon, cls=''): return f'<span class="chip {cls}">{ic(icon,"i14")}</span>'
def tm(t): return f'<span class="tm">{t}</span>'
def datetile(m, d): return f'<span class="datetile"><i>{m}</i><b>{d}</b></span>'

def tli(icon, cls, t1, t2, when):
    t2h = f'<div class="t2">{t2}</div>' if t2 else ''
    return f'<div class="tli">{chip(icon,cls)}<div><div class="t1">{t1}</div>{t2h}</div><span class="tm">{when}</span></div>'

def urow(text, quote):
    return f'<div class="urow"><div class="tx">{text}<small>"{quote}"</small></div><span class="ibp">{ic("Check","i14")}</span><span class="ibg">{ic("X","i14")}</span></div>'

def tbl(cols, rows):
    th = ''.join(f'<th>{c}</th>' for c in cols)
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="dbody"><table class="tbl"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'

def nm(lead, t): return f'<div class="nm">{lead}{t}</div>'

def flow(trigger, small, steps):
    out = f'<div class="trig"><div class="k">{ic("Workflow","i14")}Starts</div><b>{trigger}</b><small>{small}</small></div>'
    for k, (icon, b, s) in enumerate(steps):
        out += f'<div class="conn"><span class="flowdot" style="animation-delay:{k*.4:.1f}s"></span></div><div class="step"><span class="tile">{ic(icon,"i14")}</span><div><b>{b}</b><small>{s}</small></div></div>'
    return f'<div class="app flow">{out}</div>'

def spath(stages, cur):
    out = ''
    for k, s in enumerate(stages):
        cls = 'pass' if k < cur else ('cur' if k == cur else '')
        out += f'<div class="{cls}"><i></i><span>{s}</span></div>'
    return f'<div class="spath">{out}</div>'

def lanes(cols):
    out = ''
    for name, n, cards in cols:
        cs = ''.join(f'<div class="oc{" sel" if sel else ""}"><b>{t}</b><span>{logo(k,c,"s16")}{amt}</span></div>' for t, k, c, amt, sel in cards)
        out += f'<div class="lane"><div class="lane-h">{name} <small>{n}</small></div><div class="lane-b">{cs}</div></div>'
    return f'<div class="lanes" style="grid-template-columns:repeat({len(cols)},1fr);padding:16px">{out}</div>'

def slash(label, items, on=0):
    a = ''.join(f'<a{" class=\"on\"" if k==on else ""}>{ic("Box","i14")}{t}</a>' for k, t in enumerate(items))
    return f'<div class="slash"><div class="lab">{label}</div>{a}</div>'

def toast(text, undo=True, load=False):
    lead = '<span class="loader"><i></i><i></i><i></i><i></i></span>' if load else ic('Check','i14')
    u = '<span class="u">Undo</span>' if undo else ''
    return f'<div class="app toast">{lead}<span style="flex:1">{text}</span>{u}</div>'

def field(k, v): return f'<div class="fld"><span>{k}</span><span>{v}</span></div>'
def src_o(): return '<span class="src-o">Otto</span>'

def acc(pos, title, sub, lead=None, undo=False):
    l = lead or f'<span class="acc-ic">{ic("Check","i14")}</span>'
    u = '<span class="acc-u">Undo</span>' if undo else ''
    return f'<div class="acc acc-{pos}">{l}<div><b>{title}</b><span>{sub}</span></div>{u}</div>'

def vis(inner, w=760, a='', cls='vis-in', style=''):
    return f'<div class="vis">{a}<div class="fit" data-w="{w}"><div class="fit-inner" style="width:{w}px"><div class="{cls}" style="{style}">{inner}</div></div></div></div>'

# Tool logos, cut from the home page's integration grid.
import os as _os, re as _re
def logos():
    s = open(_os.path.join(_os.path.dirname(__file__), '..', '..', 'index.html')).read()
    return {n: (src, kind) for src, n, kind in _re.findall(r'<div class="intg"><img src="([^"]+)"[^>]*><div><b>([^<]+)</b><span>([^<]+)</span>', s)}
LOGOS = logos()
def blogo(name, size=28, r=8):
    return f'<img src="{LOGOS[name][0]}" alt="{name}" title="{name}" width="{size}" height="{size}" style="width:{size}px;height:{size}px;border-radius:{r}px;object-fit:contain;background:#fff;box-shadow:var(--sh-chip);padding:{max(3,size//7)}px;flex:none">'
def intg_grid(names=None):
    names = names or list(LOGOS)
    return '<div class="intgs">' + ''.join(f'<div class="intg rv">{blogo(n,40,10)}<div><b>{n}</b><span>{LOGOS[n][1]}</span></div></div>' for n in names) + '</div>'
