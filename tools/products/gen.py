# Writes the four product pages: product/crm, product/automation, product/deal-room and product/contract-management.
# Each page: hero with the email field and the main product shot, feature rows with a shot each, what's included,
# questions, the other three products and a closing band. Shots reuse the home page's product-shot styles (home.css);
# each feature's shot is a scene that plays what the feature does (assets/scenes.js, styles in product.css).
# Run: python3 tools/products/gen.py && node tools/layout.mjs
import html, json, math, os, re

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
P = "/assets/img/people/"
L = "/assets/logos/"


def face(n, s=28):
    return f'<img class="av" src="{P}{n}.jpg" alt="" width="{s}" height="{s}" style="width:{s}px;height:{s}px">'


def logo(n, s=16, alt=""):
    ext = "jpg" if n == "outlook" else "png" if n in ("pipedrive", "attio", "teams") else "svg"
    return f'<img class="lg" src="{L}{n}.{ext}" alt="{alt}" width="{s}" height="{s}">'


OWL = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="18" fill="#0a0a0a"/><circle cx="8.5" cy="11" r="3" fill="#fff"/><circle cx="15.5" cy="11" r="3" fill="#fff"/><circle cx="8.5" cy="11" r="1.3" fill="#0a0a0a"/><circle cx="15.5" cy="11" r="1.3" fill="#0a0a0a"/></svg>'
CK = '<svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>'


def shot(inner, band="b-gray", title=None):
    head = f'<div class="ph">{title}</div>' if title else ""
    return f'<div class="band {band} p-shot" data-anim><div class="app" style="grid-template-columns:minmax(0,1fr)"><div class="main">{head}{inner}</div></div></div>'



# ---- Scenes: each feature's shot plays what the feature does (assets/scenes.js). A part with data-at="n" comes in at
# step n and one with data-off="n" leaves at step n; t lists the wait in ms before each step. Styles: product.css. ----
def A(at=None, off=None, d=None, s=""):
    r = (f' data-at="{at}"' if at is not None else "") + (f' data-off="{off}"' if off is not None else "")
    st = (f"--d:{d}ms;" if d else "") + s
    return r + (f' style="{st}"' if st else "")


def scene(inner, band, t, title=None, raw=False):
    head = f'<div class="ph">{title}</div>' if title else ""
    body = inner if raw else f'<div class="app" style="grid-template-columns:minmax(0,1fr)"><div class="main">{head}{inner}</div></div>'
    return f'<div class="band {band} p-shot sc" data-scene data-t="{",".join(map(str, t))}" aria-hidden="true">{body}</div>'


def sw(*parts):  # parts that take turns in one place: (html, at, off, classes)
    return '<span class="swap">' + "".join(f'<span class="{c}"{A(a, o)}>{h}</span>' if c else f"<span{A(a, o)}>{h}</span>" for h, a, o, c in parts) + "</span>"


def words(text, at, hl=None, d=0):  # a message's words come in one after another; hl marks the words from hl[0] to hl[1]
    out = " ".join(f'<span{HL if hl and hl[0] <= i < hl[1] else ""} style="--i:{i}">{w}</span>' for i, w in enumerate(text.split(" ")))
    return f'<span class="wd fx-fade"{A(at, d=d)}>{out}</span>'


HL = ' class="hl"'
LDR = '<span class="ldr"><i></i><i></i><i></i><i></i></span>'

# ---- CRM shots ----
CRM_HERO = shot(
    '<div class="scroll-x"><table class="tb"><thead><tr><th>Company</th><th>Stage</th><th class="hide-s">Source</th><th>Last touch</th><th class="hide-s">Pipeline</th></tr></thead><tbody class="rows">'
    + "".join(f'<tr{" class=open" if o else ""}><td><span class="who"><span class="av" style="background:{bg}">{i}</span>{n}</span></td><td><span class="tag {t}">{st}</span></td><td class="hide-s sub">{src}</td><td class="sub">{lt}</td><td class="hide-s">{v}</td></tr>'
              for n, i, bg, t, st, src, lt, v, o in [
                  ("Northwind Health", "NW", "#efe3ff", "t-green", "Customer", "Inbound form", "Email, 2h ago", "$84,000", 0),
                  ("Harbor &amp; Pine", "HP", "#dbeafe", "t-yellow", "Proposal", "Event", "Call, yesterday", "$126,500", 1),
                  ("Pallet Cloud", "PC", "#fde68a", "t-blue", "Discovery", "Referral", "Meeting, 3d ago", "$42,000", 0),
                  ("Verda Robotics", "VR", "#d1fae5", "t-purple", "Meeting set", "Website chat", "Email, 4d ago", "$61,000", 0),
                  ("Atlas Cargo", "AC", "#fee2e2", "t-gray", "Lead", f'<span style="display:inline-flex;align-items:center;gap:6px">{logo("hubspot", 14)}HubSpot import</span>', "Email, 1w ago", "$18,000", 0)])
    + "</tbody></table></div>",
    "b-stone",
    '<b>Companies <span>1,284</span></b><span class="grow"></span><span class="ui-btn pri">+ New company</span>',
)
CRM_SRC = [("gmail", "Gmail", "1,240 emails added this month", 2), ("outlook", "Outlook", "Connected for 2 teammates", 4), ("meet", "Google Calendar", "86 meetings added this month", 3)]
CRM_TL = [("t-blue", "Email", "Rina Sato asked for pricing", "9:14"), ("t-purple", "Meeting", "Discovery call with Rina and Marcus", "Tue 10:00"), ("t-blue", "Email", "Marcus Lee joined the thread", "11:02")]
# Capture: each email and meeting arrives from its inbox or calendar and lands on the right person, company and deal.
CRM_CAPTURE = scene(
    '<div class="cap"><div class="srcs">'
    + "".join(f'<div class="src"{A(1, d=i * 100)}><span class="k">{logo(k, 14)}</span><span class="grow"><b>{n}</b><small>{x}</small></span><i class="ping fx-pop"{A(at)}></i></div>' for i, (k, n, x, at) in enumerate(CRM_SRC))
    + f'</div><div class="capr"><div class="crh">{face("rina", 24)}<b>Rina Sato</b><span class="sub">Pallet Cloud</span></div><div class="tl">'
    + "".join(f'<div class="fx-l"{A(i + 2)}><span class="tag {t}">{k}</span>{x}<span class="when">{w}</span></div>' for i, (t, k, x, w) in enumerate(CRM_TL))
    + f'</div><div class="added"{A(5)}><span class="sub">Added to</span>'
    + "".join(f'<span class="tag t-gray fx-pop"{A(5, d=150 + i * 100)}>{x}</span>' for i, x in enumerate(["Rina Sato", "Pallet Cloud", "Pallet Cloud, 25 seats"])) + "</div></div></div>",
    "b-gray", [300, 700, 800, 800, 700])

# One record: four copies of the same lead are matched and become one record with the full history.
DUPS = [("t-gray", "Event", "Rina Sato", "Scanned at SaaS Connect", "translate(40px,24px) scale(.5)"), ("t-purple", "Meeting", "Rina S.", "Booked a demo", "translate(-40px,24px) scale(.5)"),
        ("t-blue", "Email", "rina@palletcloud.com", "Asked for pricing", "translate(40px,-24px) scale(.5)"), ("t-green", "Inbound", "R. Sato", "Filled the pricing form", "translate(-40px,-24px) scale(.5)")]
HIST = [("t-gray", "Event", "Scanned at SaaS Connect", "Oct 14"), ("t-purple", "Meeting", "Booked a demo", "Oct 9"), ("t-blue", "Email", "Asked for pricing", "Oct 3"), ("t-green", "Inbound", "Filled the pricing form", "Oct 2")]
CRM_ONE = scene(
    '<div class="merge"><div class="dups">'
    + "".join(f'<span class="dup"{A(i + 1, 6, s="--to:" + to)}><span class="tag {t}">{k}</span><b>{n}</b><small>{x}</small></span>' for i, (t, k, n, x, to) in enumerate(DUPS))
    + f'<span class="tag t-green mtag fx-pop"{A(5, 6)}>Matched by email, LinkedIn and domain</span></div>'
    f'<div class="rec"><div class="top2 fx-pop"{A(6)}>{face("rina", 40)}<div><h4>Rina Sato</h4><span class="sub">Co-founder &amp; CEO, Pallet Cloud</span></div></div><div class="tl">'
    + "".join(f'<div{A(7, d=i * 120)}><span class="tag {t}">{k}</span>{x}<span class="when">{w}</span></div>' for i, (t, k, x, w) in enumerate(HIST)) + "</div></div></div>",
    "b-stone", [300, 300, 300, 300, 700, 900, 400])

# Call notes: the call is read, then notes and facts with quotes are written.
WAVE = [round(18 + 80 * abs(math.sin(k * .7) * math.cos(k * .23))) for k in range(64)]  # a call's sound, drawn as bars
NOTE = "Rina wants one place for inbound and outbound leads before January. She will bring Marcus from finance to the next call."
CRM_CALL = scene(
    f'<div class="callw"><span class="wave"><span class="read fx-x"{A(2)}></span>' + "".join(f'<i style="height:{h}%;--i:{k}"></i>' for k, h in enumerate(WAVE)) + "</span>"
    f'<span class="sub mono">{sw(("32 min", None, 2, ""), ("Reading", 2, 3, "fx-fade"), ("32 min", 3, None, "fx-fade"))}</span></div>'
    f'<div class="cnotes"><div class="card"{A(3)}><div class="ch">{OWL}Notes</div><div class="cb">{words(NOTE, 3, d=200)}</div></div>'
    f'<div class="card"{A(4)}><div class="fact"{A(4)}><span class="tag t-green">Budget</span><span>About $30,000 a year<q>We set aside roughly thirty thousand.</q></span></div>'
    f'<div class="fact"{A(5)}><span class="tag t-yellow">Timeline</span><span>Live before January 15<q>It has to work before the new region opens.</q></span></div></div></div>',
    "b-gray", [300, 500, 1500, 1500, 600], f'<span style="display:flex;align-items:center;gap:8px">{logo("meet", 16)}<b>Pallet Cloud discovery call</b></span>')

# Deal updates: each suggestion shows its source; the rep accepts or skips, and the count goes down.
UPD = [('Amount <s class="strk">$18,000</s> $30,000', "Call, Oct 21", 1), ("Close date: Jan 15", "Call, Oct 21", 1), ("Stage: Negotiation", "Email, Oct 22", 0), ("Next step: call with Marcus", "Email, Oct 22", 1)]
CRM_UPDATES = scene(
    "".join(f'<div class="upd{"" if ok else " sk"}"{A(1, d=i * 90)}><span class="ut">{x}<span class="cite">{src}</span></span>'
            + sw((f'<span class="ok">{CK}</span><span class="no">×</span>', None, 3 + i, "btns"), ("Accepted" if ok else "Skipped", 3 + i, None, "tag fx-pop " + ("t-green" if ok else "t-gray"))) + "</div>"
            for i, (x, src, ok) in enumerate(UPD)),
    "b-stone", [300, 800, 900, 700, 700, 700],
    f'<b>Deal updates to review <span>{sw(("4", None, 3, ""), ("3", 3, 4, ""), ("2", 4, 5, ""), ("1", 5, 6, ""), ("0", 6, None, ""))}</span></b>')

# Ask: the question goes in, Otto reads the account, and each answer cites its source.
CRM_ASK = scene(
    f'<div class="thread2" style="padding:16px"><div class="ask fx-r"{A(1)}>What is blocking the Pallet Cloud deal?</div>'
    f'<div class="ans"><span class="fx-pop"{A(2)}>{OWL}</span><div class="body">{sw((LDR + "Reading 14 emails and 3 calls", 2, 3, "fx-fade"), ("The CFO has not been involved yet.", 3, None, "fx-fade"))}<ul>'
    f'<li{A(4)}><span>Marcus Lee signs anything over $20,000.<span class="cite fx-pop"{A(4, d=250)}>Call, Oct 21</span></span></li>'
    f'<li{A(5)}><span>They need it live before January 15.<span class="cite fx-pop"{A(5, d=250)}>Call, Oct 21</span></span></li></ul></div></div></div>',
    "b-gray", [300, 600, 1400, 600, 600], f'<span style="display:flex;align-items:center;gap:8px">{OWL}<b>Ask Omniscient</b></span>')

# Pipeline: stages fill, a deal is won and the forecast adds up by month.
FC = [("Nov", "$81,000", 36), ("Dec", "$160,500", 71), ("Jan", "$226,000", 100)]
CRM_PIPE = scene(
    '<div class="facts pipe" style="margin:14px">'
    f'<div><small>Discovery</small>$186,000<span class="pbar"><i class="fx-x"{A(1, s="width:75%")}></i></span></div>'
    f'<div><small>Proposal</small>$248,500<span class="pbar"><i class="fx-x"{A(1, d=100, s="width:100%")}></i></span></div>'
    f'<div><small>Negotiation</small>{sw(("$94,000", None, 3, ""), ("$33,000", 3, None, "fx-fade"))}<span class="pbar"><i class="fx-x neg"{A(1, d=200, s="width:38%")}></i></span></div>'
    f'<div><small>Won this month</small>{sw(("$0", None, 3, ""), ("$61,000", 3, None, "fx-fade"))}<span class="pbar"><i class="fx-x wonb"{A(3, s="width:25%")}></i></span></div></div>'
    '<div class="tl" style="margin:0 14px 14px">'
    f'<div{A(2)}><span class="tag t-yellow">Proposal</span>Harbor &amp; Pine<span class="when">$126,500</span></div>'
    f'<div{A(2, d=100)}><span class="tag t-blue">Discovery</span>Pallet Cloud<span class="when">$30,000</span></div>'
    f'<div{A(2, d=200)}>{sw(("Negotiation", None, 3, "tag t-purple"), ("Won", 3, None, "tag t-green fx-pop"))}Verda Robotics<span class="when">$61,000</span></div></div>'
    '<div class="fc"><span class="sub mono">Forecast</span>'
    + "".join(f'<span class="fcm"><span class="fcb"><i class="fx-y"{A(4, d=k * 110, s=f"height:{h}%")}></i></span><small>{m}</small><b class="fx-fade"{A(4, d=200 + k * 110)}>{v}</b></span>' for k, (m, v, h) in enumerate(FC)) + "</div>",
    "b-stone", [300, 700, 1000, 800], "<b>Pipeline <span>Q4</span></b>")

# Migration: each step is ticked off as the move goes.
MIG = [("Export received: 4,210 contacts, 860 deals", "Mon"), ("Fields mapped, including 12 custom fields", "Tue"), ("Test import checked with you", "Wed"), ("Full migration", "Thu")]
NEXT = '<span class="tag t-gray">Next</span>'
MIG_TAG = [("Done", "t-green"), ("Done", "t-green"), ("In review", "t-yellow")]
CRM_MIG = scene(
    '<div class="works" style="padding:16px 16px 0"><div class="row" style="grid-template-columns:repeat(4,1fr)">'
    + "".join(f'<span class="wl fx-pop"{A(1, d=i * 90)}>{logo(k, 18, n)}<span>{n}</span></span>' for i, (k, n) in enumerate([("hubspot", "HubSpot"), ("salesforce", "Salesforce"), ("pipedrive", "Pipedrive"), ("attio", "Attio")])) + "</div></div>"
    '<div class="prog">' + "".join(f'<span><i class="fx-x{" half" if i == 2 else ""}"{A(2 + i)}></i></span>' if i < 3 else "<span></span>" for i in range(4)) + "</div>"
    '<div class="tl" style="margin:0 14px 14px">'
    + "".join(f'<div>{sw(("Next", None, 2 + i, "tag t-gray"), (MIG_TAG[i][0], 2 + i, None, "tag fx-pop " + MIG_TAG[i][1])) if i < 3 else NEXT}{x}<span class="when">{w}</span></div>' for i, (x, w) in enumerate(MIG)) + "</div>",
    "b-gray", [300, 600, 700, 700], "<b>Your migration</b>")

CRM = [
    ("Emails and meetings recorded for you", "Connect Gmail or Outlook and your calendar. Every email and meeting is added to the right person, company and deal.", CRM_CAPTURE),
    ("One record for every lead", "Leads from website forms, emails, meetings, events and imports are matched by email, LinkedIn profile and company domain. Each person gets one record with their full history.", CRM_ONE),
    ("Call notes written for you", "Omniscient reads the transcripts from Google Meet, Zoom and Teams and writes notes, next steps and key facts with quotes.", CRM_CALL),
    ("Deal updates you approve", "When a call or email changes a deal, Omniscient suggests the update with its source. Accept it or skip it. Values your team typed are never changed.", CRM_UPDATES),
    ("Ask Omniscient about any account", "Ask a question in plain English. The answer links to the emails, calls and notes it came from.", CRM_ASK),
    ("Pipeline and forecast", "See every open deal by stage, with amounts, close dates and next steps. The forecast adds them up by month.", CRM_PIPE),
    ("We migrate you from your current CRM", "Send us an export from HubSpot, Salesforce, Pipedrive, Attio or a spreadsheet. We map your fields, move your companies, contacts, deals and notes, and check the result with you. You can run both side by side until you are ready.", CRM_MIG),
]

# ---- Deal Room shots ----
def tiles(rows):
    return "".join(f'<div class="rowt">{t} <span>{s}</span></div><div class="tiles">' + "".join(f'<div class="tile t{i % 5 + 1}"><b>{n}</b><small>{k}</small></div>' for i, (n, k) in enumerate(items)) + "</div>" for t, s, items in rows)


PROP = (f'<div class="prop"><div class="pnav"><b>Lumen Labs × Pallet Cloud</b><span class="on">For you</span><span>Plan</span><span>Pricing</span><span>Security</span><span class="grow"></span><span class="mono" style="font-size:10.5px;display:flex;align-items:center;gap:8px">{face("rina", 22)}Prepared for Rina Sato</span></div>'
        '<div class="billboard"><small>YOUR PROPOSAL</small><h4>One lead pipeline before the new region opens</h4><p>Inbound, outbound and event leads in one place by January 15, for a team of 25.</p><span class="play">▶ Watch the 3-minute overview</span><span class="play2">See the plan</span></div>'
        + tiles([("For Rina", "Your goals", [("Inbound and outbound in one timeline", "VIDEO 3:40"), ("How Northwind unified 4 lead sources", "CASE STUDY"), ("Your rollout, week by week", "PLAN"), ("Event leads, captured at the booth", "VIDEO 1:30"), ("Orbit Mills: live in 3 weeks", "CASE STUDY")]),
                 ("For Marcus", "Finance", [("Pricing for 25 seats", "PRICING"), ("Cost of the tools it replaces", "CALCULATOR"), ("Payment terms", "PAGE"), ("Return in the first year", "BUSINESS CASE"), ("Contract, ready to sign", "APPROVAL")])])
        + '<div class="pad"></div></div>')
DR_HERO = f'<div class="band b-gray p-shot" data-anim>{PROP}</div>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
LIB = [("VIDEO 3:40", "Inbound and outbound in one timeline", ["Demo", "Lead handoff"], "vid", 1), ("CASE STUDY", "How Northwind unified 4 lead sources", ["Logistics", "Lead handoff"], "doc", 1), ("GUIDE", "Security and data handling", ["IT review"], "doc", 0)]
# Library: content comes in, gets tagged, and the items that fit this deal are marked.
DR_LIB = scene(
    '<div class="lib lib3">' + "".join(
        f'<div class="item"{A(i + 1)}><div class="thumb {kind}">' + (f'<span class="pl">{PLAY}</span>' if kind == "vid" else "<s></s><s></s><s></s>") + f'<span>{k}</span></div><div class="ib">'
        + (f'<span class="tag t-green fx-pop"{A(5, d=i * 140)}>Match</span>' if m else "") + f"<b>{n}</b>"
        + '<div class="tags">' + "".join(f'<span class="fx-pop"{A(4, d=i * 120 + j * 80)}>{t}</span>' for j, t in enumerate(tg)) + "</div></div></div>"
        for i, (k, n, tg, kind, m) in enumerate(LIB)) + "</div>",
    "b-stone", [300, 300, 300, 700, 800], '<b>Library <span>148</span></b><span class="grow"></span><span class="ui-btn">Import</span>')

# A proposal: the rep asks, Otto builds it tab by tab from the deal, the calls and the Library.
TABS = [("Overview", "6 facts used"), ("Your goals", "4 facts used"), ("Plan", "5 facts used"), ("Pricing", "Your price list"), ("Next steps", "2 facts used")]
DR_BUILD = scene(
    f'<div class="msgs"><div class="bub me fx-r"{A(1)}>A proposal for Pallet Cloud, 25 seats</div><div class="bub fx-l"{A(2)}><div class="m" style="display:flex;align-items:center;gap:6px">{OWL}Omniscient</div>Building 5 tabs from the deal, 2 calls and your Library.</div></div>'
    '<div class="tl" style="margin:0 14px 14px">'
    + "".join(f'<div{A(3, d=k * 60)}>' + sw(*([("Queued", None, 3 + k, "tag t-gray")] if k else []), ("Building", 3 + k, 4 + k, "tag t-yellow"), ("Done", 4 + k, None, "tag t-green fx-pop")) + f'{n}<span class="when fx-fade"{A(4 + k)}>{x}</span></div>' for k, (n, x) in enumerate(TABS))
    + f'</div><div class="bulk"><span class="sub">Pallet Cloud, 25 seats</span><span class="grow"></span><span class="ui-btn pri fx-pop"{A(9)}>Open proposal</span></div>',
    "b-gray", [300, 700, 500, 700, 600, 600, 600, 600, 500], f'<span style="display:flex;align-items:center;gap:8px">{OWL}<b>Ask Omniscient</b></span>')


def rail(items, at, cls, extra):
    return f'<div class="strip"><div class="rail {cls}">' + "".join(f'<div class="tile t{i % 5 + 1}"{A(at, d=i * 60)}>{extra.get(i, "")}<b>{n}</b><small>{k}</small></div>' for i, (n, k) in enumerate(items)) + "</div></div>"


# Rows: each person's row fills, Marcus's row scrolls, Dana opens a video and the seller sees it.
R1 = [("Pricing for 25 seats", "PRICING"), ("Return in the first year", "BUSINESS CASE"), ("Payment terms", "PAGE"), ("Cost of the tools it replaces", "CALCULATOR"), ("Contract, ready to sign", "APPROVAL")]
R2 = [("Security and data handling", "GUIDE"), ("Single sign-on setup", "VIDEO 2:10"), ("Data processing terms", "PAGE"), ("Admin roles and access", "VIDEO 1:45"), ("Uptime and support", "PAGE")]
DR_ROWS = scene(
    '<div class="prop rows2"><div class="rowt">For Marcus <span>Finance</span></div>'
    + rail(R1, 1, "r1", {3: f'<s class="pg fx-x"{A(5, d=150, s="width:60%")}></s>'})
    + '<div class="rowt">For Dana <span>IT</span></div>'
    + rail(R2, 2, "r2", {1: f'<s class="ring fx-pop"{A(4)}></s><s class="pg fx-x"{A(5, s="width:100%")}></s>'})
    + f'<div class="pad"></div><div class="ptoast fx-r"{A(6)}>{face("amara", 28)}<span>Dana watched Single sign-on setup<small>Just now</small></span></div></div>',
    "b-stone", [300, 400, 900, 800, 500, 1000], raw=True)

NIL = '<u class="nil"></u>'
# Prices: Otto asks once how you price, saves the answer and prices this deal with it.
DR_PRICE = scene(
    f'<div class="pq"><div class="card"{A(1)}><div class="ch">{OWL}How do you price this?</div><div class="cb opts">'
    + sw(("Per seat", 2, 3, "ui-btn"), (CK + "Per seat", 3, None, "ui-btn pri fx-pop"))
    + "".join(f'<span class="ui-btn fx-pop"{A(2, d=90 * (i + 1))}>{x}</span>' for i, x in enumerate(["Fixed fee", "Quote after a call"]))
    + '</div></div><div class="facts">'
    + "".join(f'<div><small>{k}</small>{sw((NIL, None, 4, ""), (v, 4, None, "fx-r"))}</div>' for k, v in [("Method", "Per seat"), ("Price", "$49 a month"), ("Saved for", "Every proposal")])
    + f'</div><div class="qt"{A(5)}><span class="sub">Pallet Cloud, 25 seats</span><span class="grow"></span><b>$1,225 a month</b></div></div>',
    "b-stone", [300, 600, 900, 700, 700], "<b>Your prices</b>")

# Send: the email is written, the proposal link goes in, and each person gets their own link.
BODY = "Here is the proposal we discussed. Marcus, pricing and payment terms are in the row made for you."
DR_SEND = scene(
    '<div class="mail">'
    f'<div class="f"><span>To</span><span class="to"><span class="tag t-gray fx-pop"{A(1)}>Rina Sato</span><span class="tag t-gray fx-pop"{A(2)}>Marcus Lee</span></span></div>'
    f'<div class="f"><span>Subject</span>{words("Your proposal for the January rollout", 3)}</div>'
    f'<div class="bodytx">{words(BODY, 4)}</div>'
    f'<div class="linkcard fx-drop"{A(5)}><span class="lt">L × P</span><span class="lb"><b>Lumen Labs × Pallet Cloud</b><small>Prepared for Rina and Marcus</small></span></div>'
    f'<div class="sendrow">{logo("gmail", 16, "Gmail")}<span class="sub">Sending from sam@lumenlabs.com</span><span class="grow"></span>{sw(("Send", None, 6, "ui-btn pri"), (CK + "Sent", 6, None, "ui-btn pri done fx-pop"))}</div>'
    '<div class="links">' + "".join(f'<span class="lk fx-pop"{A(7, d=i * 120)}>{face(f, 18)}{t}</span>' for i, (f, t) in enumerate([("rina", "Link for Rina"), ("marcus", "Link for Marcus")])) + "</div></div>",
    "b-gray", [300, 300, 500, 900, 1500, 900, 600])

# Activity: each view comes in as it happens, then the alert.
EV = [("rina", "Rina watched the overview", "Mon, 9:31", True), ("marcus", "Marcus opened Pricing, 3 times", "Mon, 14:10", False), ("marcus", "Marcus shared it with Dana, IT", "Tue, 10:05", False)]
DR_WATCH = scene(
    '<div class="feed" style="border:0">'
    + "".join(f'<div class="ev fx-l"{A(i + 1)}>{face(f, 22)}<span class="grow">{t}<small>{w}</small>' + (f'<span class="pbar"><i class="fx-x"{A(1, d=300, s="width:100%")}></i></span>' if bar else "") + "</span></div>" for i, (f, t, w, bar) in enumerate(EV))
    + f'</div><div class="alert fx-r"{A(4)}>{logo("slack", 16, "Slack")}<span><b>Pallet Cloud is active</b><small>Marcus and Dana are viewing Pricing</small></span></div>',
    "b-gray", [300, 900, 700, 900], '<b>Activity</b><span class="grow"></span><span class="live">Live</span>')

# Approve: the buyer approves on the page, and the team hears about it by Slack and email.
DR_WIN = scene(
    f'<div class="prop sign"{A(1)}><div class="pnav"><b>Lumen Labs × Pallet Cloud</b></div><div class="sg"><span><small>PROPOSAL</small><b>25 seats, $30,000 a year</b></span>'
    + sw(("Approve", None, 2, "play"), (CK + "Approved", 2, None, "play ok fx-pop")) + "</div></div>"
    f'<div class="feed" style="border:0"><div class="ev"{A(3)}>{face("marcus", 22)}<span>Marcus approved the proposal<small>Thu, 16:48</small></span></div>'
    '<div class="won" style="margin-top:0"><span class="sub">Alert sent</span>'
    + f'<span class="tag t-gray fx-pop"{A(4)}>{logo("slack", 12)}Slack</span><span class="tag t-gray fx-pop"{A(4, d=120)}>Email</span><span class="grow"></span><span class="sub mono">$30,000</span></div></div>',
    "b-gray", [300, 900, 700, 800], "<b>Pallet Cloud, 25 seats</b>")

DR = [
    ("Keep your sales content in one library", "Import your website, case studies, decks and videos. Omniscient tags each item by industry, use case and objection.", DR_LIB),
    ("Build a proposal for each deal", "Pick a deal. Omniscient builds the proposal from the deal, your calls and your Library, in your brand, one tab at a time.", DR_BUILD),
    ("Netflix-style rows for each stakeholder", "The top of the proposal shows the buyer's goals and your plan. Below are rows of videos, case studies and documents for each person on the buying team.", DR_ROWS),
    ("Your prices, or a quote after a call", "Omniscient uses your saved price list. If it has no prices, it asks you once how you price and saves the answer. You can also choose to quote after a call.", DR_PRICE),
    ("Send it from your own inbox", "Send the proposal link from Gmail or Outlook. Each person gets their own link, so you know who opened it.", DR_SEND),
    ("See who watched what", "See which person opened the proposal, which videos they watched and which pages they read. Get an alert by email or Slack when the buying team is active.", DR_WATCH),
    ("Approve on the page", "Buyers approve the proposal on the page, and your team gets an alert by email or Slack. The contract you upload goes out for signature from Contract Management.", DR_WIN),
]

# ---- Line icons for the Contract Management and Automation shots ----
def ic(d, s=13, w=2):
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'


I_UP = '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'
I_MAIL = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
I_CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
I_BRANCH = '<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M6 7.5v9M18 9.5c0 5-6 4-11 7.5"/>'
I_BELL = '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'
I_PEN = '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
I_CODE = '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'
I_STOP = '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>'
I_BOLT = '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'
I_REPLY = '<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>'
I_EYE = '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
I_SIGN = '<path d="M3 17c3-1 4-9 7-9s-1 8 2 8 3-4 5-4 2 3 4 3"/>'
I_CAL = '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
I_FOLDER = '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
I_PLUS = '<path d="M12 5v14M5 12h14"/>'
I_CHECK = '<path d="m5 12 5 5 9-10"/>'

# ---- Contract Management shots (in the app: src/lib/contracts, src/components/contracts, docs/deal-room.md) ----
# Contracts come only from files people upload. Otto never writes contract text: he reads an uploaded or signed file
# and suggests facts, each with its quote, for a person to confirm.
CTS = [("Pallet Cloud", "PC", "#fde68a", "Order form, 25 seats", "t-blue", "Sent", "$30,000", "None"),
       ("Northwind Health", "NW", "#efe3ff", "Master agreement", "t-yellow", "Expiring", "$84,000", "Nov 30, 2026"),
       ("Harbor &amp; Pine", "HP", "#dbeafe", "Order form, 60 seats", "t-yellow", "In review", "$126,500", "None"),
       ("Verda Robotics", "VR", "#d1fae5", "Order form, 40 seats", "t-purple", "Approved", "$61,000", "None"),
       ("Orbit Mills", "OM", "#e0f2fe", "Master agreement", "t-green", "Active", "$210,000", "Jan 29, 2027")]
CT_HERO = shot(
    '<div class="seg cseg"><span class="on">All</span><span>Renewals coming up</span><span>For you</span></div>'
    '<div class="scroll-x"><table class="tb"><thead><tr><th>Company</th><th>Contract</th><th>Status</th><th class="hide-s">Value</th><th class="hide-s">Renewal notice</th></tr></thead><tbody class="rows">'
    + "".join(f'<tr{" class=open" if k == 0 else ""}><td><span class="who"><span class="av" style="background:{bg}">{i}</span>{n}</span></td><td class="sub">{c}</td><td><span class="tag {t}">{st}</span></td><td class="hide-s">{v}</td><td class="hide-s sub">{r}</td></tr>'
              for k, (n, i, bg, c, t, st, v, r) in enumerate(CTS))
    + "</tbody></table></div>",
    "b-gray",
    f'<b>Contracts <span>214</span></b><span class="grow"></span><span class="ui-btn pri">{ic(I_UP)}Upload contract</span>',
)

# Versions: each upload is the next version and nothing is written over; the contract sits on its company and opportunity.
VERS = [(3, "Order form v3.docx", "DOCX", "Upload, Sam Okoye, Oct 21"), (2, "Order form, Marcus changes.pdf", "PDF", "Changes from signer, Marcus Lee, Oct 18"), (1, "Order form.pdf", "PDF", "Upload, Sam Okoye, Oct 14")]
CT_VERSIONS = scene(
    '<div class="vlist">'
    + "".join(f'<div class="vrow fx-drop"{A(n)}><span class="vfile">{k}</span><span class="grow"><b>{f}</b><small>Version {n}. {w}</small></span>'
              f'<span class="tag t-gray fx-pop"{A(n, None if n == 3 else n + 1, d=200)}>Current</span></div>' for n, f, k, w in VERS)
    + f'</div><div class="bulk"><span class="sub">Linked to</span><span class="tag t-gray fx-pop"{A(4)}>Pallet Cloud</span><span class="tag t-gray fx-pop"{A(4, d=120)}>Pallet Cloud, 25 seats</span></div>',
    "b-gray", [300, 700, 900, 900, 700], f'<b>Versions</b><span class="grow"></span><span class="ui-btn">{ic(I_UP)}Upload a new version</span>')


def mk(word, kind, at, d=None):  # a word the compare marks as taken out or put in
    return f'<span class="mk {kind}">{word}<i class="fx-fade"{A(at, d=d)}></i></span>'


# Compare: two versions side by side, with what was taken out and put in marked.
CT_COMPARE = scene(
    '<div class="cmph"><span class="tag t-gray">Version 1</span><span class="sub">and</span><span class="tag t-gray">Version 2</span><span class="grow"></span><span class="sub">Only changes</span><span class="tog"></span></div>'
    '<div class="vcmp">'
    f'<div class="fx-fade"{A(1)}><small>Version 1, upload</small><p>Invoices are due {mk("thirty (30)", "del", 2)} days after receipt.</p>'
    f'<p>This order form runs for {mk("twenty-four (24)", "del", 2, 150)} months from November 1, 2026.</p></div>'
    f'<div class="fx-fade"{A(1, d=120)}><small>Version 2, changes from signer</small><p>Invoices are due {mk("forty-five (45)", "ins", 3)} days after receipt.</p>'
    f'<p>This order form runs for {mk("twelve (12)", "ins", 3, 150)} months from November 1, 2026.</p></div></div>'
    f'<div class="bulk"><span class="sub fx-fade"{A(4)}>2 changes, side by side</span><span class="grow"></span><span class="ui-btn">Open version 2</span></div>',
    "b-stone", [300, 600, 900, 900, 600], "<b>Compare versions</b>")

# Approval: teammates are asked in the app and by email, each approves with a comment, and the version can go out.
APPR = [("theo", "Theo Walsh", "Head of sales", "Net 45 is fine for a 12-month term.", 2), ("leo", "Leo Park", "Finance", "Approved.", 3)]
CT_APPROVAL = scene(
    '<div class="tl" style="margin:14px">'
    f'<div class="fx-l"{A(1)}><span class="tag t-gray">Asked</span>Theo and Leo, in the app and by email<span class="when">9:40</span></div>'
    + "".join(f'<div class="fx-l"{A(1, d=100 + k * 100)}>{face(f, 22)}<span class="grow"><b>{n}</b> <span class="sub">{r}</span><small class="cmt fx-fade"{A(at, d=200)}>{c}</small></span>'
              + sw(("Waiting", None, at, "tag t-gray"), ("Approved", at, None, "tag t-green fx-pop")) + "</div>" for k, (f, n, r, c, at) in enumerate(APPR))
    + '</div><div class="bulk"><span class="sub">Order form, version 3</span><span class="grow"></span>' + sw(("Send for signature", None, 4, "ui-btn"), (ic(I_SIGN) + "Send for signature", 4, None, "ui-btn pri fx-pop")) + "</div>",
    "b-stone", [300, 900, 900, 700],
    "<b>Approval</b>" + sw(("In review", None, 4, "tag t-yellow"), ("Approved", 4, None, "tag t-purple fx-pop")))

# Signing: the private link opens the contract in the seller's brand; Rina agrees, draws her signature and signs, and
# Marcus, next in order, gets his link.
SIGWAVE = '<svg class="sigline" viewBox="0 0 200 50" aria-hidden="true"><path d="M6 36c14-2 18-26 30-26 9 0-4 30 8 30 10 0 12-22 22-22 8 0 2 18 12 18s16-14 26-14 6 12 16 12 18-8 30-10 22-2 40-2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
CT_SIGN = scene(
    '<div class="csign"><div class="sk">'
    '<div class="sktop"><b>Lumen Labs</b><span>Order form, 25 seats</span></div>'
    '<div class="skb"><h5>Sign</h5>'
    '<div class="skf"><small>Full name</small><span>Rina Sato</span></div>'
    '<div class="skf"><small>Email this link was sent to</small><span>rina@palletcloud.com</span></div>'
    '<div class="skc"><span class="box">' + sw(("", None, 1, ""), (ic(I_CHECK, 9, 3), 1, None, "fx-pop")) + '</span><span>I agree to sign this document electronically.</span></div>'
    '<div class="sktab"><span>Type</span><span class="on">Draw</span></div>'
    f'<div class="skpad">{SIGWAVE}<s class="skcover"{A(None, 2)}></s></div>'
    '<div class="skbtns">' + sw(("Sign", None, 3, "play"), (CK + "Signed", 3, None, "play ok fx-pop")) + '<span class="play2">Send back changes</span></div></div></div>'
    '<div class="feed csig"><div class="ch">Signers<span class="grow"></span><span class="tag t-gray">In order</span></div>'
    f'<div class="ev">{face("rina", 22)}<span class="grow">Rina Sato<small>Signer 1</small></span>' + sw(("Opened", None, 3, "tag t-purple"), ("Signed", 3, None, "tag t-green fx-pop")) + "</div>"
    f'<div class="ev">{face("marcus", 22)}<span class="grow">Marcus Lee<small>Signer 2</small></span>' + sw(("Waiting", None, 4, "tag t-gray"), ("Link sent", 4, None, "tag t-blue fx-pop")) + "</div></div></div>",
    "b-gray", [300, 700, 1500, 800], f'<span style="display:flex;align-items:center;gap:8px">{ic(I_SIGN, 16)}<b>Signing</b></span>')

# Certificate: the signed pages stay as they were, then a certificate page and the audit trail; each signer gets a copy.
CERT = [("Document SHA-256", "9f2c41d07a8e…e0b7"), ("Signer 1", "Rina Sato, rina@palletcloud.com"), ("Signed", "Oct 23, 2026, 11:20 UTC"), ("IP address", "203.0.113.24"), ("Browser", "Chrome on macOS")]
TRAIL = [("Oct 22, 09:14", "Link sent to Rina Sato"), ("Oct 23, 11:18", "Opened by Rina Sato"), ("Oct 23, 11:20", "Signed by Rina Sato")]
CT_CERT = scene(
    '<div class="ccert"><div class="pages">' + "".join(f'<span class="pgx fx-pop"{A(1, d=k * 90)}><s></s><s></s><s></s><s></s><small>Page {k + 1}</small></span>' for k in range(3))
    + f'<span class="pgx cert fx-drop"{A(2)}><b>Certificate</b><s></s><s></s><small>Page 4</small></span></div>'
    f'<div class="card"{A(3)}><div class="ch">Signature certificate</div>' + "".join(f'<div class="fact fx-l"{A(3, d=k * 80)}><span class="sub ck">{a}</span><span class="grow cv">{b}</span></div>' for k, (a, b) in enumerate(CERT)) + "</div>"
    f'<div class="card"{A(4)}><div class="ch">Audit trail</div>' + "".join(f'<div class="fact fx-l"{A(4, d=k * 120)}><span class="sub ck">{a}</span><span class="grow cv">{b}</span></div>' for k, (a, b) in enumerate(TRAIL)) + "</div>"
    f'<div class="qt"{A(5)}><span class="sub">Signed copy</span><span class="grow"></span><span class="tag t-green">Emailed to 2 signers</span></div></div>',
    "b-stone", [300, 700, 900, 900, 700], "<b>Pallet Cloud order form, signed</b>")

# Read by Otto: each fact comes with its quote and page, and waits for a person to confirm it.
FACTS = [("End date", "Oct 31, 2027", "The initial term ends on October 31, 2027.", 2),
         ("Auto-renews", "Yes", "renews automatically for successive 12-month terms", 4),
         ("Notice period in days", "60", "at least sixty (60) days before the end of the then-current term", 4),
         ("Payment terms", "Net 45", "Invoices are due forty-five (45) days after receipt.", 3)]
CT_READ = scene(
    "".join(f'<div class="fact cfact fx-l"{A(2, d=k * 100)}><span class="grow"><small class="sub">{l}</small><b>{v}</b><q>{q}</q></span><span class="cite">p. {p}</span>'
            + sw((f'<span class="btns"><span class="no">×</span><span class="ok">{CK}</span></span>', None, 3 + k, ""), ("Confirmed", 3 + k, None, "tag t-green fx-pop")) + "</div>" for k, (l, v, q, p) in enumerate(FACTS))
    + f'<div class="qt" style="margin:12px"{A(7)}><span class="sub">Renewal notice date</span><span class="grow"></span><b>Sep 1, 2027</b></div>',
    "b-gray", [300, 1300, 800, 600, 600, 600, 700],
    f'<span style="display:flex;align-items:center;gap:8px">{OWL}<b>Read by Otto</b></span><span class="grow"></span><span class="sub">'
    + sw((LDR + "Reading 6 pages", 1, 2, "fx-fade"), *((f"{4 - k} to confirm", 2 + k, 3 + k, "fx-fade") for k in range(4)), ("All confirmed", 6, None, "fx-fade")) + "</span>")

# Renewals: a contract near its notice date turns Expiring, and the owner hears 90, 60 and 30 days before it.
REN = [("Northwind Health", "NW", "#efe3ff", "Master agreement", "Nov 30, 2026", "30 days", 0),
       ("Atlas Cargo", "AC", "#fee2e2", "Order form, 10 seats", "Dec 31, 2026", "60 days", 0),
       ("Orbit Mills", "OM", "#e0f2fe", "Master agreement", "Jan 29, 2027", "90 days", 1)]
CT_RENEW = scene(
    '<div class="scroll-x"><table class="tb ren"><thead><tr><th>Contract</th><th>Status</th><th class="hide-s">Renewal notice</th><th>Alert</th></tr></thead><tbody>'
    + "".join(f'<tr class="fx-l"{A(1, d=k * 100)}><td><span class="who"><span class="av" style="background:{bg}">{i}</span><span>{n}<small class="sub cn">{c}</small></span></span></td><td>'
              + (sw(("Active", None, 2, "tag t-green"), ("Expiring", 2, None, "tag t-yellow fx-pop")) if flip else '<span class="tag t-yellow">Expiring</span>')
              + f'</td><td class="hide-s sub">{dt}</td><td><span class="tag t-gray fx-pop"{A(3, d=k * 120)}>{al}</span></td></tr>' for k, (n, i, bg, c, dt, al, flip) in enumerate(REN))
    + f'</tbody></table></div><div class="alert fx-r"{A(4)}>{ic(I_MAIL, 16)}<span><b>Orbit Mills master agreement: renewal notice by Jan 29, 2027</b><small>Emailed to Sam Okoye, 90 days before</small></span></div>',
    "b-stone", [300, 900, 800, 900], "<b>Renewals coming up</b>")

# Ask Otto: a question across contracts, answered from the facts the team confirmed, each linked to its contract.
CT_ASK = scene(
    f'<div class="thread2" style="padding:16px"><div class="ask fx-r"{A(1)}>Which contracts need a renewal notice before February?</div>'
    f'<div class="ans"><span class="fx-pop"{A(2)}>{OWL}</span><div class="body">{sw((LDR + "Reading contracts", 2, 3, "fx-fade"), ("Three contracts, $312,000 a year in total.", 3, None, "fx-fade"))}<ul>'
    f'<li{A(4)}><span>Northwind Health, notice by Nov 30, $84,000.<span class="cite fx-pop"{A(4, d=250)}>Master agreement</span></span></li>'
    f'<li{A(4, d=150)}><span>Atlas Cargo, notice by Dec 31, $18,000.<span class="cite fx-pop"{A(4, d=400)}>Order form</span></span></li>'
    f'<li{A(5)}><span>Orbit Mills, notice by Jan 29, $210,000.<span class="cite fx-pop"{A(5, d=250)}>Master agreement</span></span></li></ul></div></div></div>',
    "b-gray", [300, 600, 1400, 600, 600], f'<span style="display:flex;align-items:center;gap:8px">{OWL}<b>Ask Otto</b></span>')

CT = [
    ("Upload the contract you already use", "Upload a PDF or Word file and link it to its opportunity and company. Each new upload becomes the next version, and nothing is written over.", CT_VERSIONS),
    ("Compare any two versions", "Pick two versions and read them side by side, with what was taken out and what was put in marked, down to the word.", CT_COMPARE),
    ("Approval from your team", "Ask teammates to approve a version, in the app and by email. They approve or decline with a comment, and a new version asks the same people again.", CT_APPROVAL),
    ("E-signature on a page in your brand", "Send the approved version to up to ten signers, in order or all at once. Each private link opens the contract in your brand, where the signer types or draws a signature, or sends back a changed file instead.", CT_SIGN),
    ("A signed PDF with a certificate", "When everyone has signed, the original pages stay as they were and a certificate page follows: who signed, when, from which IP address and browser, and the file's SHA-256, then the audit trail. Each signer gets a copy by email.", CT_CERT),
    ("Otto reads the signed contract", "Otto, the AI in Omniscient, reads the signed contract for its dates, renewal terms, notice period, value and key obligations. Each suggestion shows its quote and page, and nothing is saved until a person confirms it.", CT_READ),
    ("Renewal alerts before the notice date", "Contracts move to Active, Expiring and Expired on their own dates. The owner gets a notice and an email 90, 60 and 30 days before the renewal notice date, and Renewals coming up lists what is due next.", CT_RENEW),
    ("Ask Otto about your contracts", "Ask which contracts renew next quarter or what was signed this month. Otto answers from the facts your team confirmed, and each answer links to the contract.", CT_ASK),
]

# ---- Automation shots (in the app: src/components/automation, src/lib/automation, docs/workflows.md) ----
def wcard(icon, title, kind, at=None, d=None, extra="", cls=""):  # one step on the canvas
    return f'<div class="wfc{cls} fx-drop"{A(at, d=d)}><span class="wi">{ic(icon)}</span><span class="wt"><small>{kind}</small><b>{title}</b>{extra}</span></div>'


def wline(at=None, d=None):
    return f'<span class="wfl fx-y"{A(at, d=d)}></span>'


def wtags(*tags):
    return '<span class="wtags">' + "".join(tags) + "</span>"


def yesno(yes, no, at=None, d=None):  # a Branch's two paths
    return f'<div class="wyn fx-fade"{A(at, d=d)}><div><span class="wlb">Yes</span>{yes}</div><div><span class="wlb">No</span>{no}</div></div>'


Q = "&quot;"
AU_NEXT = "Next steps for {{company|your team}}"
AU_NEXT_HTML = 'Next steps for <span class="tok">{{company|your team}}</span>'
OK_TAG = '<span class="tag t-green">Approved</span>'
FLOW_YES = wcard(I_BELL, "Notify the owner", "Notify owner", cls=" sm", extra=wtags(f'<span class="tag t-gray">{logo("slack", 11)}Slack</span>'))
FLOW_NO = wcard(I_MAIL, "Reply in the same thread", "Send email", cls=" sm", extra=wtags(OK_TAG))

# Hero: the Workflows page, folders on the left and one live workflow on its canvas.
FOLDERS = [("Follow-ups", [("After the demo", 1, 1), ("Proposal viewed", 1, 0), ("No reply in 5 days", 0, 0)]), ("Renewals", [("Contract renewal due", 1, 0), ("Contract signed", 1, 0)])]
AU_HERO = (
    '<div class="band b-gray p-shot" data-anim><div class="app wfapp"><aside class="side wfold">'
    f'<div class="wfh"><b>Workflows</b><span class="grow"></span><span class="ib">{ic(I_PLUS)}</span></div>'
    + "".join(f'<div class="wff">{ic(I_FOLDER)}{f}</div>' + "".join(f'<div class="wfr{" on" if on else ""}"><span class="grow">{n}</span>{"<i></i>" if live else ""}</div>' for n, live, on in rows) for f, rows in FOLDERS)
    + '</aside><div class="main"><div class="ph"><b>After the demo</b><span class="tag t-green">Live</span><span class="grow"></span><span class="seg2"><span class="on">Build</span><span>Runs</span></span></div>'
    '<div class="wf-cv">'
    + wcard(I_BOLT, "Meeting held", "Starts when", cls=" wtrig", extra=wtags('<span class="sub">14 in it now</span>')) + wline()
    + wcard(I_CLOCK, "Wait 2 days", "Wait") + wline()
    + wcard(I_MAIL, AU_NEXT_HTML, "Send email", cls=" on", extra=wtags(OK_TAG, '<span class="sub">31 sent, 9 replied</span>')) + wline()
    + wcard(I_BRANCH, "Replied in the last 3 days", "Branch") + wline() + yesno(FLOW_YES, FLOW_NO)
    + "</div></div></div></div>")

# Build: a trigger and a wait, then the + opens the step picker, an email goes in, and a Branch adds its two paths.
PICK = [(I_MAIL, "Send email", 1), (I_CLOCK, "Wait", 0), (I_BRANCH, "Branch", 0), (I_PEN, "Update field", 0), (I_BELL, "Notify owner", 0), (I_CODE, "Webhook", 0), (I_STOP, "Stop", 0)]
AU_BUILD = scene(
    '<div class="wf-cv">'
    + wcard(I_BOLT, "Meeting held", "Starts when", 1, cls=" wtrig") + wline(2) + wcard(I_CLOCK, "Wait 2 days", "Wait", 2, d=120) + wline(3)
    + '<div class="wslot">' + sw((f'<span class="wplus">{ic(I_PLUS)}</span>', 3, 4, "fx-pop"), (wcard(I_MAIL, AU_NEXT_HTML, "Send email"), 4, None, ""))
    + f'<div class="wpick fx-r"{A(3, 4, 150)}>' + "".join(f'<span class="{"on" if on else ""}">{ic(i)}{n}</span>' for i, n, on in PICK) + "</div></div>"
    + wline(5) + wcard(I_BRANCH, "Replied in the last 3 days", "Branch", 5, d=120) + wline(5, 250) + yesno(FLOW_YES, FLOW_NO, 5, 350) + "</div>",
    "b-stone", [300, 600, 700, 1300, 800], '<b>After the demo</b><span class="tag t-gray">Draft</span>')

# Triggers: a different event is picked each time, and the step under it changes with it.
TRIG = [("Records", ["Field changed", "Opportunity stage changed"]), ("Meetings", ["Meeting held", "Meeting no-show"]), ("Email", ["Email replied"]),
        ("Deal Room", ["Proposal viewed", "Contract signed", "Contract renewal due"]), ("Time and people", ["On a schedule", "Added in bulk"])]
PICKED = {"Meeting held": (2, 3), "Proposal viewed": (3, 4), "Contract signed": (4, None)}
AU_TRIG = scene(
    '<div class="wtrg"><div class="wtl">'
    + "".join(f'<div class="wtg"><small>{g}</small>' + "".join(f'<span class="wtc fx-pop"{A(1, d=(gi * 2 + k) * 50)}>{t}' + (f'<s class="ring fx-pop"{A(*PICKED[t])}></s>' if t in PICKED else "") + "</span>" for k, t in enumerate(items)) + "</div>" for gi, (g, items) in enumerate(TRIG))
    + '</div><div class="wf-cv">'
    + f'<div class="wfc wtrig fx-drop"{A(1)}><span class="wi">{ic(I_BOLT)}</span><span class="wt"><small>Starts when</small><b>' + sw(("Meeting held", None, 3, ""), ("Proposal viewed", 3, 4, "fx-fade"), ("Contract signed", 4, None, "fx-fade")) + "</b></span></div>"
    + wline(2) + '<div class="wslot">'
    + sw((wcard(I_MAIL, 'Thanks for today, <span class="tok">{{first_name|there}}</span>', "Send email"), 2, 3, ""), (wcard(I_BELL, "Notify the owner", "Notify owner", extra=wtags(f'<span class="tag t-gray">{logo("slack", 11)}Slack</span>')), 3, 4, ""),
         (wcard(I_PEN, "Company stage to Customer", "Update field"), 4, None, ""))
    + "</div></div></div>",
    "b-gray", [300, 900, 1400, 1400], "<b>Starts when</b>")


def mailwords(text, at, d=0):  # like words(), with merge fields marked
    out = []
    for i, w in enumerate(re.findall(r"\{\{[^}]+\}\}\S*|\S+", text)):
        m = re.match(r"^(\{\{[^}]+\}\})(.*)$", w)
        out.append(f'<span style="--i:{i}"><span class="tok">{m.group(1)}</span>{m.group(2)}</span>' if m else f'<span style="--i:{i}">{w}</span>')
    return f'<span class="wd fx-fade"{A(at, d=d)}>{" ".join(out)}</span>'


# Approve, then Publish: Otto drafts the email when asked, someone approves it, and Publish puts the workflow live.
BODY_AU = "Hi {{first_name|there}}, thanks for the time today. Here are the next steps we agreed on, and [the pricing for your team]."
AU_APPROVE = scene(
    f'<div class="wfi"><div class="wih"><span class="wi">{ic(I_MAIL)}</span><b>Send email</b><span class="grow"></span>' + sw(("Needs approval", None, 3, "tag t-yellow"), ("Approved", 3, None, "tag t-green fx-pop")) + "</div>"
    f'<div class="wotto"><span class="wob">{OWL}Ask Otto to draft it</span><div class="fld">{words("Thank them and share the next steps", 1)}</div></div>'
    f'<span class="wlab">Subject</span><div class="fld">{mailwords(AU_NEXT, 2)}</div>'
    f'<span class="wlab">Email</span><div class="fld area">{mailwords(BODY_AU, 2, 150)}</div>'
    f'<div class="wapp"><span class="tag t-gray fx-pop"{A(2, d=600)}>By Otto</span><span class="grow"></span>' + sw(("Approve", None, 3, "ui-btn"), (CK + "Approved", 3, None, "ui-btn pri done fx-pop")) + "</div></div>"
    f'<div class="alert fx-r"{A(5)}>{ic(I_CHECK, 16)}<span><b>Version 1 is live</b><small>Published by Sam Okoye</small></span></div>',
    "b-stone", [300, 900, 1700, 900, 900],
    "<b>After the demo</b>" + sw(("Draft", None, 5, "tag t-gray"), ("Live", 5, None, "tag t-green fx-pop")) + '<span class="grow"></span>' + sw(("Publish", None, 4, "ui-btn"), ("Publish", 4, None, "ui-btn pri fx-pop")))

# Own mailbox: the record owner's mailbox sends it, with the unsubscribe line at the end.
BOXES = [(logo("gmail", 14), "Gmail"), (logo("outlook", 14), "Microsoft 365"), (ic(I_MAIL), "IMAP and SMTP")]
AU_MAIL = scene(
    '<div class="wbox">' + "".join(f'<span class="wbx fx-pop"{A(1, d=k * 90)}>{lg}{n}' + (f'<s class="ring fx-pop"{A(2)}></s>' if k == 0 else "") + "</span>" for k, (lg, n) in enumerate(BOXES)) + "</div>"
    '<div class="mail">'
    f'<div class="f"><span>From</span><span class="fx-fade"{A(2)}>sam@lumenlabs.com</span></div>'
    f'<div class="f"><span>To</span><span class="to"><span class="tag t-gray fx-pop"{A(3)}>Rina Sato</span></span></div>'
    f'<div class="f"><span>Subject</span>{words("Next steps for Pallet Cloud", 3)}</div>'
    f'<div class="bodytx">{words("Hi Rina, thanks for the time today. Here are the next steps we agreed on, and the pricing for 25 seats.", 3, d=200)}'
    f'<span class="unsub fx-fade"{A(4)}>--<br>Unsubscribe: app.tryomniscient.com/api/automation/unsubscribe?t=…</span></div>'
    f'<div class="sendrow">{logo("gmail", 16, "Gmail")}<span class="sub">From the opportunity owner\'s mailbox</span><span class="grow"></span>' + sw(("Queued", None, 5, "tag t-gray"), (CK + "Sent 9:42", 5, None, "tag t-green fx-pop")) + "</div></div>",
    "b-gray", [300, 700, 700, 1600, 900])

# Pacing: inside working hours, sends spaced by a random 2 to 6 minutes, and a new mailbox warms up day by day.
TICKS = [4, 9, 13, 19, 22, 28, 33, 37, 43, 47, 52, 58]
WARM = [20, 30, 40, 50, 60, 70, 80]
AU_PACE = scene(
    '<div class="wpace">'
    '<div class="wdays">' + "".join(f'<span class="{"on " if k < 5 else ""}fx-pop"{A(1, d=k * 50)}>{d}</span>' for k, d in enumerate(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])) + '<span class="sub">09:00 to 17:00</span></div>'
    '<div class="wday"><span class="sub mono">09:00</span><span class="wtrack">' + "".join(f'<i class="fx-pop"{A(2, d=k * 110, s=f"left:{x}%")}></i>' for k, x in enumerate(TICKS))
    + f'<b class="wgap fx-fade"{A(3, s="left:40%")}>4 min</b></span><span class="sub mono">17:00</span></div>'
    '<div class="wwarm"><span class="sub">Warm-up for a new mailbox</span><span class="wbars">' + "".join(f'<span><i class="fx-y{" now" if k == 2 else ""}"{A(4, d=k * 90, s=f"height:{v}%")}></i><small>Day {k + 1}</small></span>' for k, v in enumerate(WARM)) + "</span></div>"
    f'<div class="qt"{A(5)}><span class="sub">Sent today from sam@lumenlabs.com</span><span class="grow"></span><b>37 of 40</b></div></div>',
    "b-stone", [300, 700, 1500, 800, 900], f'<span style="display:flex;align-items:center;gap:8px">{logo("gmail", 16)}<b>Sending</b></span>')

# A reply stops the run: Rina answers, her run stops, and the email's replies go up.
RUNS = [("rina", "Rina Sato", "Wait 2 days"), ("marcus", "Marcus Lee", "Next steps for Pallet Cloud"), ("amara", "Dana Ortiz", "Reply in the same thread")]
RUN_TAG = ['', '<span class="tag t-blue">Running</span>', '<span class="tag t-green">Finished</span>']
AU_REPLY = scene(
    f'<div class="wstat"><span class="wi">{ic(I_MAIL)}</span><span class="grow"><b>Next steps for Pallet Cloud</b><small>12 sent, ' + sw(("3", None, 3, ""), ("4", 3, None, "fx-fade")) + ' replied</small></span></div>'
    '<div class="scroll-x"><table class="tb wruns"><thead><tr><th>Person</th><th>Status</th><th class="hide-s">Step</th></tr></thead><tbody>'
    + "".join(f'<tr class="fx-l"{A(1, d=k * 100)}><td><span class="who">{face(f, 22)}{n}</span></td><td>'
              + (sw(("Waiting", None, 3, "tag t-purple"), ("Stopped", 3, None, "tag t-gray fx-pop")) + f'<span class="sub wrs fx-fade"{A(3, d=150)}>Replied</span>' if k == 0 else RUN_TAG[k])
              + f'</td><td class="hide-s sub">{st}</td></tr>' for k, (f, n, st) in enumerate(RUNS))
    + f'</tbody></table></div><div class="wrep fx-l"{A(2)}>{face("rina", 22)}<span><b>Rina Sato</b><small>Thursday works. Can we add Marcus?</small></span>{ic(I_REPLY)}</div>',
    "b-gray", [300, 900, 900],
    '<b>After the demo</b><span class="grow"></span><span class="seg2"><span>Build</span><span class="on">Runs</span></span>')

# Deal Room events: a proposal view, a signed contract and a renewal notice each start their own workflow.
EVENTS = [(I_EYE, "Marcus viewed the proposal", wcard(I_BELL, "Notify the owner", "Proposal viewed", extra=wtags(f'<span class="tag t-gray">{logo("slack", 11)}Slack</span>'))),
          (I_SIGN, "Order form signed", wcard(I_MAIL, "Welcome to Lumen Labs", "Contract signed", extra=wtags(OK_TAG))),
          (I_CAL, "Renewal notice in 90 days", wcard(I_CLOCK, "Wait until 1 day before the next meeting", "Contract renewal due"))]
AU_DEAL = scene(
    '<div class="wev">' + "".join(f'<span class="wevc fx-l"{A(2 * k + 1)}>{ic(i)}{t}</span><span class="wevl fx-x"{A(2 * k + 2)}></span><span class="wevw fx-r"{A(2 * k + 2, d=150)}>{c}</span>' for k, (i, t, c) in enumerate(EVENTS)) + "</div>",
    "b-stone", [300, 600, 700, 600, 700, 600], "<b>From Deal Room</b>")

AU = [
    ("Workflows on a canvas", "Start from a trigger and add steps: send an email, wait, branch, update a field, notify the owner, call a webhook or stop. Keep your workflows in folders.", AU_BUILD),
    ("Start from what happens in a deal", "A workflow can start when a record or an opportunity's stage changes, a meeting is held or missed, an email gets a reply, a proposal is viewed or a contract is signed. It can also run on a schedule, or for people you add in bulk.", AU_TRIG),
    ("Every email approved before Publish", "Write each email with merge fields, or ask Otto, the AI in Omniscient, to draft it. Every email starts unapproved, changing its words asks for approval again, and Publish waits until each one is approved.", AU_APPROVE),
    ("Sent from the owner's own mailbox", "Emails go from the record owner's Gmail, Microsoft 365 or IMAP mailbox, as a new email or a reply in the same thread. Each one ends with a one-click unsubscribe link.", AU_MAIL),
    ("A steady pace from each mailbox", "Each mailbox sends only in its owner's working hours, with a random gap of 2 to 6 minutes between emails and a daily cap. A newly connected mailbox starts at 20 emails a day and adds 10 a day.", AU_PACE),
    ("A reply stops the run", "When someone replies, their runs stop in every workflow. A bounce stops the run and an unsubscribe stops every run, and workflows skip that address from then on.", AU_REPLY),
    ("Follow up on proposals and contracts", "Deal Room starts workflows too: a proposal viewed, a contract sent or signed, a renewal notice coming up. Wait until a set time before the next meeting, branch on whether they opened Deal Room, or notify the owner in Slack.", AU_DEAL),
]

PAGES = [
    {
        "slug": "crm", "name": "Omniscient CRM", "band": "b-stone",
        "title": "Omniscient CRM: emails, calls and leads in one place | Omniscient",
        "desc": "A CRM that records your emails, meetings and calls, keeps one record per lead, writes your call notes and answers questions about any account.",
        "h1": "A CRM that fills itself in.", "h1b": "Emails, calls and leads in one place.",
        "lede": "Omniscient records your emails, meetings and calls, keeps one record for every lead, and answers questions about any account.",
        "hero": CRM_HERO, "feats": CRM,
        "list": ["Email and calendar capture", "One record per lead", "Inbound, referral and event leads", "Call notes from transcripts", "Facts with quotes", "Deal updates you approve", "Ask Omniscient", "Pipeline and forecast", "Custom fields and views", "Migration from your CRM"],
        "faq": [
            ("Do I have to leave my current CRM?", "No. Connect your email and calendar and run both side by side. When you are ready, we migrate your companies, contacts, deals and notes for you."),
            ("How does migration work?", "Send us an export from your CRM or a spreadsheet. We map your fields to Omniscient, run a test import and check it with you, then move everything over. We support HubSpot, Salesforce, Pipedrive and Attio."),
            ("Does a bot join my calls?", "Only if you want one. Omniscient reads the transcripts Google Meet, Zoom and Teams already create. The call recording add-on sends a bot when you would rather Omniscient record the call."),
            ("Who can see my emails?", "You choose per inbox: share everything, share only that a conversation happened, or keep it private."),
            ("What if Omniscient gets a fact wrong?", "Every fact shows the quote it came from. Deal updates wait for you to accept or skip them, and values your team typed are never changed."),
            ("Do you train AI models on my data?", "No. Your emails and calls are never used to train models."),
        ],
    },
    {
        "slug": "automation", "name": "Automation", "band": "b-gray",
        "title": "Automation: follow-ups from your own mailbox | Omniscient",
        "desc": "Workflows that follow up after meetings, proposal views and contract events. Each email is approved first, sent from your own mailbox and stopped by a reply.",
        "h1": "Follow-ups that run on their own.", "h1b": "From your own mailbox.",
        "lede": "Build a workflow once. Omniscient sends each email your team approved from the owner's own mailbox, at a steady pace, and stops when someone replies.",
        "hero": AU_HERO, "feats": AU,
        "list": ["Workflows on a canvas", "Folders for workflows", "Record and stage triggers", "Meeting and email triggers", "Proposal and contract triggers", "Schedules and Add to workflow", "Email, wait, branch and update steps", "Approval before Publish", "Replies and unsubscribes stop runs", "Working hours, caps and warm-up"],
        "faq": [
            ("Does anything send before we approve it?", "No. Every email in a workflow starts unapproved, and Publish waits until someone on your team approves each one. Changing an approved email's words asks for approval again."),
            ("Which mailbox sends the emails?", "The record owner's own mailbox: the opportunity's owner, or else the workflow's owner. Gmail, Microsoft 365 and any mailbox connected over IMAP and SMTP can send."),
            ("What stops a run?", "A reply from the person stops their runs in every workflow. A bounce stops the run, and an unsubscribe stops every run for that address. Workflows skip a bounced or unsubscribed address from then on, and you can stop a run or take a person out by hand."),
            ("How fast does it send?", "Only in the owner's working hours and days, with a random 2 to 6 minute gap between emails. Each mailbox has a daily cap, 100 by default and 50 for a free Gmail address, and a newly connected mailbox starts at 20 a day and adds 10 a day."),
            ("Can Otto write the emails?", "When you ask. Otto drafts or rewrites an email step and it's marked as his. It still needs a person's approval before the workflow can go live."),
            ("Can someone go through a workflow twice?", "You choose: once, or again after a gap once their last run has ended. A person is never in the same workflow twice at once."),
        ],
    },
    {
        "slug": "deal-room", "name": "Deal Room", "band": "b-gray",
        "title": "Deal Room: Netflix-style proposals for every deal | Omniscient",
        "desc": "Build a proposal for each deal from your content, in your brand, with rows for each stakeholder. Send it from your inbox and see who watched what.",
        "h1": "Netflix-style proposals for every deal.", "h1b": "Built from your content.",
        "lede": "Keep your sales content in one library, build a proposal for each deal in your brand, send it from your inbox and see who watched what.",
        "hero": DR_HERO, "feats": DR,
        "list": ["Content library", "Tags by industry and objection", "Proposals built from the deal", "Your brand and colors", "Rows for each stakeholder", "Your prices or a quote after a call", "Send from Gmail or Outlook", "Views per person and page", "Email and Slack alerts", "Approval on the page"],
        "faq": [
            ("What is a Deal Room proposal?", "A web page for one deal, in your brand. The top shows the buyer's goals, your plan and the price. Below are rows of videos, case studies and documents for each person on the buying team."),
            ("Where does the content come from?", "From your Library: your website, case studies, decks and videos. Omniscient only uses facts from the deal, your calls and your Library."),
            ("What does a proposal cost?", "A proposal uses 40 proposal credits and an edit uses 2. Every paid seat adds credits each month. A proposal that fails to build is refunded."),
            ("Can I edit the proposal?", "Yes. Change any text, section or style in the builder before you send it."),
            ("How do buyers approve?", "On the proposal page, and your team gets an alert by email or Slack. Then upload your contract in Contract Management and send it for signature."),
        ],
    },
    {
        "slug": "contract-management", "name": "Contract Management", "band": "b-stone",
        "title": "Contract Management: upload, sign and renew contracts | Omniscient",
        "desc": "Upload contracts as PDF or Word, compare versions, get your team's approval, collect e-signatures on a page in your brand and get alerts before renewals.",
        "h1": "Contracts signed, tracked and renewed.", "h1b": "Right next to the deal.",
        "lede": "Upload the contract you already use. Omniscient keeps every version, gets it approved and signed, and reminds you before it renews.",
        "hero": CT_HERO, "feats": CT,
        "list": ["PDF and Word upload", "Every version kept", "Side-by-side compare", "Approval from teammates", "Signing in order or all at once", "A signing page in your brand", "Certificate and audit trail", "Dates and terms read by Otto", "Alerts at 90, 60 and 30 days", "Ask Otto about contracts"],
        "faq": [
            ("Which files can I upload?", "PDF or Word (.docx) files up to 25 MB. Each upload becomes a new version of the contract, and earlier versions stay as they were."),
            ("Does Omniscient write or draft contracts?", "No. Omniscient has no contract templates and never writes contract text. Your contracts are the files you upload. Otto only reads them to suggest dates and terms, each with its quote, for a person to confirm."),
            ("How does signing work?", "Send the approved version to up to ten signers, in order or all at once. Each signer opens a private link, confirms their name and email, agrees to sign electronically and types or draws a signature. When everyone has signed, you get a signed PDF with a certificate page and an audit trail."),
            ("What if the other side wants changes?", "They can send back a changed file from the signing page instead of signing. It becomes a new version and goes back to review, and you can compare it with the version you sent."),
            ("What does Otto read?", "Parties, effective date, term, end date, auto-renewal, notice period, renewal notice date, value, payment terms, termination rights and key obligations, each with a quote and a page from the file. A suggestion whose quote isn't in the file is dropped, and nothing is saved until a person confirms it."),
            ("Can I bring in contracts I already signed?", "Yes. Upload them as already signed. Otto reads them the same way, and renewal alerts start once their dates are confirmed."),
        ],
    },
]


# The Product menu's scene for each product (partials/header.html), shown again on the "rest of the platform" cards.
HEADER = open(os.path.join(ROOT, "partials", "header.html")).read()


def mini(slug):
    tile = re.search(r'href="/product/' + slug + r'/">(.*?</span>)<b>', HEADER, re.S).group(1)
    assert tile.count("<span") == tile.count("</span>"), slug
    return tile


def page(p):
    others = [o for o in PAGES if o is not p]
    feats = "".join(
        f'''
    <section class="p-feat{" p-feat--flip" if i % 2 else ""}">
      <div class="p-feat__shot">{s}</div>
      <div class="p-feat__text"><span class="mono br p-num">{i + 1:02d}</span><h2>{html.escape(t)}</h2><p>{html.escape(d)}</p></div>
    </section>'''
        for i, (t, d, s) in enumerate(p["feats"]))
    included = "".join(f"<li>{html.escape(x)}</li>" for x in p["list"])
    faq = "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q, a in p["faq"])
    cards = "".join(f'<a class="p-other" href="/product/{o["slug"]}/">{mini(o["slug"])}<b>{o["name"]}</b><small>{html.escape(o["h1"])}</small><span class="mono">Learn more →</span></a>' for o in others)
    ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]}
    form = '<form class="signup" action="https://app.tryomniscient.com/" method="get"><input type="email" name="email" placeholder="Work email" aria-label="Work email" autocomplete="email"><button class="btn btn--primary" type="submit">Start free trial</button></form>'
    url = f'https://tryomniscient.com/product/{p["slug"]}/'
    return f'''<!doctype html>
<html lang="en-US">
<head>
<!-- head:start -->
<!-- head:end -->
<title>{html.escape(p["title"])}</title>
<meta name="description" content="{html.escape(p["desc"])}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Omniscient">
<meta property="og:title" content="{html.escape(p["title"])}">
<meta property="og:description" content="{html.escape(p["desc"])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="https://tryomniscient.com/assets/brand/omniscient-app-icon-512.png">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/assets/home.css">
<link rel="stylesheet" href="/assets/product.css">
<script type="application/ld+json">{json.dumps(ld)}</script>
<script src="/assets/product.js" defer></script>
</head>
<body class="om om-home om-product">
<!-- header:start -->
<!-- header:end -->
<main id="main" class="site-main">
  <section class="p-hero wrap">
    <div class="kicker mono"><i></i><span class="br">{p["name"]}</span></div>
    <h1>{html.escape(p["h1"])} <span>{html.escape(p["h1b"])}</span></h1>
    <p class="lede">{html.escape(p["lede"])}</p>
    {form}
    <p class="note mono">14 days free. No credit card required.</p>
  </section>
  <section class="wrap p-heroshot">{p["hero"]}</section>
  <div class="wrap p-feats">{feats}
  </div>
  <section class="wrap p-included">
    <div class="p-sechead"><span class="mono br">Included</span><h2>Everything in {p["name"]}</h2></div>
    <ul>{included}</ul>
  </section>
  <section class="wrap faq" id="faq">
    <div><div class="mono br chev-cap">Questions</div><h2>Questions</h2><p style="color:var(--ink-2)">Something else? <a href="mailto:hello@tryomniscient.com" style="text-decoration:underline">hello@tryomniscient.com</a></p></div>
    <div>{faq}</div>
  </section>
  <section class="wrap p-others">
    <div class="p-sechead"><span class="mono br">Also in Omniscient</span><h2>The rest of the platform</h2></div>
    <div class="p-others__grid">{cards}</div>
  </section>
  <section class="closing wrap">
    <div class="band {p["band"]}">
      <h2>Try {p["name"]} free for 14 days.</h2>
      {form}
      <p class="note mono">No credit card required.</p>
    </div>
  </section>
</main>
<!-- footer:start -->
<!-- footer:end -->
</body>
</html>
'''


for p in PAGES:
    d = os.path.join(ROOT, "product", p["slug"])
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(page(p))
print("wrote", len(PAGES), "pages")
