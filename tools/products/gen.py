# Writes the three product pages: product/crm, product/automation and product/contract-management. (Deal Room was
# removed in Nov 2026 with Experiences and the Library; /product/deal-room/ redirects to Contract Management.)
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
    ext = "jpg" if n == "outlook" else "png" if n in ("pipedrive", "attio", "teams", "pandadoc") else "svg"
    return f'<img class="lg" src="{L}{n}.{ext}" alt="{alt}" width="{s}" height="{s}">'


OWL = '<svg width="18" height="18" viewBox="0 0 64 64" aria-hidden="true"><path d="M10 26V6A20 20 0 0 1 30 26Z" fill="#242421"/><path d="M54 26V6A20 20 0 0 0 34 26Z" fill="#242421"/><rect x="8" y="16" width="48" height="44" rx="18" fill="#242421"/><circle cx="22.5" cy="33" r="9.5" fill="#fff"/><circle cx="41.5" cy="33" r="9.5" fill="#fff"/><circle cx="22.5" cy="33" r="4.4" fill="#0a0a0a"/><circle cx="41.5" cy="33" r="4.4" fill="#0a0a0a"/><path d="M32 43l3.2 3.6L32 50l-3.2-3.4z" fill="#d4d4d4"/></svg>'  # Otto, as in the app's Mascot.tsx
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
I_FLAG = '<path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/>'

# ---- Contract Management shots (in the app: src/lib/contracts, src/components/contracts, docs/deal-room.md) ----
# Contracts come only from files people upload or import (PandaDoc, 106). Otto never writes contract text: he reads an
# uploaded or signed file and suggests facts, each with its quote, for a person to confirm. People may edit a draft
# (108); Otto has no part in it. Finding signature fields only reads where words sit, and what changed between versions
# is counted from the files, with no AI. Statuses are the app's one status (contractStatus in src/lib/contracts/flow.ts).
I_LOCK = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
I_SEARCH = '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'
I_SEND = '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'
I_FILE = '<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/>'
I_CHEV = '<path d="m6 9 6 6 6-6"/>'
I_UNDO = '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'
I_REDO = '<path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>'
I_HL = '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'
I_ALIGN = '<path d="M3 6h18M3 12h12M3 18h16"/>'
I_BUL = '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>'
I_NUM = '<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 4h1.5v4"/><path d="M3.5 14.5c.3-.9 2.5-.9 2.5.4 0 1-2.5 1.6-2.5 3.1H6"/>'
I_LINK = '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
I_TYPE = '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>'
I_IMG = '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'
I_TABLE = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M12 3v18"/>'
I_BREAK = '<path d="M3 12h18"/><path d="m8 8 4-4 4 4"/><path d="m16 16-4 4-4-4"/>'
I_CLIP = '<path d="m21.4 11-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6L15.6 6.4"/>'
I_RADIO = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>'
I_CBOX = '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>'
I_DROP = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m9 11 3 3 3-3"/>'
I_STAMP = '<path d="M5 22h14"/><path d="M19.3 13.7a2.5 2.5 0 0 0-1.8-.7h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.7-.3-1.3-.7-1.8z"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/>'
I_DOWN = '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 20h16"/>'
I_ARCH = '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>'


def av(ini, bg, s=16):  # a company's or person's initials, where there is no portrait
    return f'<span class="av" style="background:{bg};width:{s}px;height:{s}px;font-size:{max(7, round(s * .36))}px">{ini}</span>'


# The list (lean contracts, Nov 2026, and 112): four numbers that filter the list, status tabs, folders first, and one
# primary New contract (Upload file, Blank document, a team template, Import from PandaDoc).
LTABS = ["All", "Drafts", "Waiting", "Signed"]
STATS4 = [("Drafts", "12"), ("Waiting for signature", "7"), ("Signed this month", "9"), ("Renewals in 90 days", "3")]


def ctabs(on, to=None, at=None):  # the status tabs over the list; the underline moves from `on` to `to` at step `at`
    def mark(x):
        if x == on:
            return f'<i class="tu"{A(None, at)}></i>' if to else '<i class="tu"></i>'
        return f'<i class="tu fx-x"{A(at)}></i>' if x == to else ""
    return '<div class="ctabs">' + "".join(f"<span>{x}{mark(x)}</span>" for x in LTABS) + "</div>"


def stats4(ring_at=None, d_at=None):
    return ('<div class="cstats c4">' + "".join(f'<span class="cst fx-drop"{A(d_at, d=k * 70) if d_at else ""}><small>{l}</small><b>{v}</b>'
                                              + (f'<i class="cring fx-pop"{A(ring_at)}></i>' if ring_at and k == 3 else "") + "</span>" for k, (l, v) in enumerate(STATS4)) + "</div>")


CTS = [("Pallet Cloud order form", "Rina Sato, Marcus Lee", "t-teal", "Viewed", "sam", "Sam Okoye", "Oct 24"),
       ("Harbor &amp; Pine master agreement", "Omar Haddad", "t-purple", "Waiting for approval", "theo", "Theo Walsh", "Oct 23"),
       ("Northwind Health master agreement", "Diego Ruiz", "t-yellow", "Renewal soon", "sam", "Sam Okoye", "Oct 20"),
       ("Verda Robotics order form", "Kim Park", "t-gray", "Draft", "leo", "Leo Park", "Oct 19"),
       ("Orbit Mills NDA", "Lena Fischer", "t-green", "Signed", "theo", "Theo Walsh", "Oct 12")]
CT_HERO = shot(
    stats4() + ctabs("All")
    + '<div class="scroll-x"><table class="tb ctb"><thead><tr><th>Name</th><th class="hide-s">Recipients</th><th>Status</th><th class="hide-s">Owner</th><th class="hide-s">Modified</th></tr></thead><tbody class="rows">'
    + f'<tr><td class="nm"><span class="who">{ic(I_FOLDER, 14)}Customers</span></td><td class="hide-s sub">18 contracts</td><td></td><td class="hide-s"></td><td class="hide-s"></td></tr>'
    + "".join(f'<tr{" class=open" if k == 0 else ""}><td class="nm"><span class="who">{ic(I_FILE, 14)}{n}</span></td><td class="hide-s sub">{r}</td><td><span class="tag {t}">{st}</span></td>'
              f'<td class="hide-s"><span class="who own">{face(f, 18)}{o}</span></td><td class="hide-s sub">{m}</td></tr>'
              for k, (n, r, t, st, f, o, m) in enumerate(CTS))
    + "</tbody></table></div>",
    "b-gray",
    f'<b>Contracts <span>214</span></b><span class="grow"></span><span class="ui-btn">{ic(I_FOLDER)}New folder</span><span class="ui-btn pri">{ic(I_PLUS)}New contract</span>',
)

# From PandaDoc (106): documents listed with PandaDoc's own status, ticked and imported, one job a document; each one is
# then "In Contracts", and a completed one lands as Signed with its signed PDF, owner, folder and tags.
PD_DOCS = [("Pallet Cloud order form", "Completed", "t-green", "Oct 26"), ("Northwind MSA renewal", "Viewed", "t-teal", "Oct 24"),
           ("Harbor &amp; Pine SOW 3", "Sent", "t-blue", "Oct 21"), ("Verda Robotics NDA", "Draft", "t-gray", "Oct 18")]
PD_FILTERS = ["All", "Draft", "Sent", "Viewed", "Completed", "Expired", "Declined"]


def ckb(on, done):  # a checkbox ticked at step `on`, then the check of a document already in Contracts at step `done`
    return sw(('<span class="ckb"></span>', None, on, ""), (f'<span class="ckb on">{ic(I_CHECK, 9, 3)}</span>', on, done, "fx-pop"),
              (f'<span class="ckin">{ic(I_CHECK, 13, 2.4)}</span>', done, None, "fx-fade"))


CT_PANDA = scene(
    '<div class="pdi"><div class="pdflt">' + "".join(f'<span{" class=on" if k == 0 else ""}>{x}</span>' for k, x in enumerate(PD_FILTERS)) + '</div><div class="pdl">'
    + "".join(f'<div class="pdr fx-l"{A(1, d=k * 90)}>' + ckb(2, 4) + f'<span class="pdn">{ic(I_FILE, 14)}<b>{n}</b></span><span class="pdm">'
              f'<small class="ckt fx-fade"{A(4, d=k * 110)}>In Contracts</small><span class="tag {t}">{st}</span><small>{d}</small></span></div>'
              for k, (n, st, t, d) in enumerate(PD_DOCS))
    + "</div></div>"
    '<div class="bulk"><span class="ui-btn">Back</span><span class="grow"></span>'
    + sw(("Import", None, 2, "ui-btn"), ("Import 4", 2, 3, "ui-btn pri fx-pop"), (LDR + "Importing 4", 3, 4, "sub fx-fade"), (CK + "4 imported", 4, None, "tag t-green fx-pop")) + "</div>"
    f'<div class="pdland fx-r"{A(5)}><span class="clh">{logo("pandadoc", 14)}<b>Pallet Cloud order form</b><span class="tag t-green">Signed</span></span>'
    f'<span class="pdchips"><span class="tag t-gray">{face("sam", 14)}Sam Okoye</span><span class="tag t-gray">{ic(I_FOLDER)}Customers</span>'
    f'<span class="tag t-gray">Renewal 2027</span><span class="tag t-gray">{ic(I_FILE)}Signed PDF</span><span class="tag t-gray">Signed Oct 26, 2026</span></span></div>',
    "b-gray", [300, 900, 1000, 1500, 900],
    f'<span style="display:flex;align-items:center;gap:8px">{logo("pandadoc", 16)}<b>Import from PandaDoc</b></span>')

# The four numbers (statCounts, counted from the same rows the list shows): Renewals in 90 days is clicked and the list
# shows what's due; a second click clears it.
LALL = [("Pallet Cloud order form", "Rina Sato, Marcus Lee", "t-teal", "Viewed", "Oct 24"), ("Harbor &amp; Pine master agreement", "Omar Haddad", "t-purple", "Waiting for approval", "Oct 23"),
        ("Verda Robotics order form", "Kim Park", "t-gray", "Draft", "Oct 22")]
LREN = [("Northwind Health master agreement", "Diego Ruiz", "t-yellow", "Renewal soon", "Nov 30"), ("Atlas Cargo order form", "Jon Reyes", "t-yellow", "Renewal soon", "Dec 31"),
        ("Orbit Mills master agreement", "Lena Fischer", "t-green", "Active", "Jan 29")]


def lrows(rows, col):
    return (f'<div class="crw ch2"><span class="grow">Name</span><span>Status</span><span class="cd">{col}</span></div>'
            + "".join(f'<div class="crw"><span class="grow"><b>{n}</b><small>{r}</small></span><span class="tag {t}">{st}</span><span class="cd sub">{d}</span></div>' for n, r, t, st, d in rows))


CT_LIST = scene(
    stats4(3, 1) + ctabs("All")
    + f'<div class="swap clist"><div class="fx-fade"{A(2, 3)}>{lrows(LALL, "Modified")}</div><div class="fx-fade"{A(3)}>{lrows(LREN, "Renewal notice")}</div></div>',
    "b-stone", [300, 800, 1500],
    f'<b>Contracts <span>214</span></b><span class="grow"></span><span class="ui-btn pri">{ic(I_PLUS)}New contract</span>')


# Recipients first (112): the path of three stages, people from the opportunity as you type, Signer or CC, and the
# signing order by dragging.
PATH3 = ["Recipients", "Edit document", "Review &amp; send"]
RCP = [("rina", "Rina Sato", "rina@palletcloud.com", "Signer"), ("sam", "Sam Okoye", "sam@lumenlabs.com", "Signer"), ("amara", "Dana Ortiz", "dana@palletcloud.com", "CC")]


def path3(at):  # the stage path: done stages carry a check, the current one is dark
    return '<div class="cstp">' + "".join(f'<span class="cs3{" cur" if k == at else ""}"><span class="cn{" ok" if k < at else ""}">' + (ic(I_CHECK, 9, 3) if k < at else str(k + 1)) + f"</span>{n}</span>" for k, n in enumerate(PATH3)) + "</div>"


CT_RECIP = scene(
    path3(0) + '<div class="cpn">'
    + "".join(f'<div class="crp fx-l"{A(1 if k < 2 else 3, d=k * 90)}><span class="grip"></span>{face(f, 22)}<span class="grow"><b>{n}</b><small>{e}</small></span><span class="cpick">{r}{ic(I_CHEV, 10)}</span></div>' for k, (f, n, e, r) in enumerate(RCP))
    + f'<div class="cadd fx-drop"{A(2)}><span class="fld">{words("Dana", 2)}</span><span class="csug2"><span>{face("amara", 16)}Dana Ortiz<small>From the opportunity</small></span></span></div>'
    + '<div class="cs"><span>Sign in order</span><span class="grow"></span><span class="tog"></span></div></div>',
    "b-gray", [300, 900, 1300, 900],
    '<b>Order form, 25 seats</b><span class="tag t-gray">Draft</span><span class="grow"></span><span class="ui-btn pri">Next</span>')


def cff(c, label, d=0):  # a signature field Omniscient found: dashed while suggested, solid once added
    return f'<b class="cff {c} fx-pop"{A(2, d=d)}><span>{label}</span></b>'


# Fields: the tags on the client's side and the signature block on yours become fields, and each signer is filled in.
SIGNERS = [("c1", "Signer 1", "Rina Sato", "rina@palletcloud.com", "From the opportunity"), ("c2", "Signer 2", "Sam Okoye", "sam@lumenlabs.com", "You")]
CT_FIELDS = scene(
    '<div class="cfld"><div class="cpage"><s></s><s></s><s></s><s></s><div class="ccols">'
    '<div class="cblk"><small>Client: Pallet Cloud</small>'
    f'<span class="cln"><i>By:</i><u><code class="ctag">\\s1\\</code>{cff("c1", "Signature")}</u></span>'
    f'<span class="cln"><i>Date:</i><u><code class="ctag">\\d1\\</code>{cff("c1", "Date signed", 100)}</u></span></div>'
    '<div class="cblk"><small>Lumen Labs</small>'
    f'<span class="cln"><i>By:</i><u>{cff("c2", "Signature", 200)}</u></span>'
    f'<span class="cln"><i>Date:</i><u>{cff("c2", "Date signed", 300)}</u></span></div></div></div>'
    '<div class="feed csig"><div class="ch">Recipients</div>'
    + "".join(f'<div class="csr"><i class="cdot {c}"></i><span class="grow">'
              + sw((f"<b>{ph}</b><small>No email yet</small>", None, 4, ""), (f"<b>{n}</b><small>{e}</small>", 4, None, "fx-fade"))
              + f'<span class="tag t-gray fx-pop"{A(4, d=150)}>{src}</span></span></div>' for c, ph, n, e, src in SIGNERS)
    + '</div></div><div class="bulk"><span class="sub">From 2 tags and a signature block</span><span class="grow"></span>'
    + sw(("Add all", None, 3, "ui-btn"), (CK + "Added", 3, None, "ui-btn pri fx-pop")) + "</div>",
    "b-gray", [300, 1000, 1200, 900],
    '<b>Fields</b><span class="grow"></span><span class="sub">'
    + sw((LDR + "Finding fields", 1, 2, "fx-fade"), ("4 field suggestions", 2, 3, "fx-fade"), ("4 fields", 3, None, "fx-fade")) + "</span>")


# Editing a draft (108, DocEditor.tsx): a Word file in the editor with its toolbar; the "+" beside the cursor's block
# opens Insert (Text, Image, Table, Page break, Signature block), the signature block goes in with its signing tags
# marked, the draft saves on its own, and Save as new version makes version 2 while the upload stays version 1.
def eb(inner, cls=""):  # one toolbar button
    return f'<span class="eb{" " + cls if cls else ""}">{inner}</span>'


ESEP = '<i class="esep"></i>'
EDTB = ('<div class="edtb">' + eb(ic(I_UNDO)) + eb(ic(I_REDO)) + ESEP + eb("Normal" + ic(I_CHEV, 10), "sel") + ESEP
        + eb("<b>B</b>") + eb("<i>I</i>") + eb("<u>U</u>") + ESEP
        + eb(ic(I_BUL)) + eb(ic(I_NUM)) + eb(ic(I_ALIGN)) + eb(ic(I_LINK)) + "</div>")
INSERTS = [(I_TYPE, "Text"), (I_TABLE, "Table"), (I_IMG, "Image"), (I_BREAK, "Page break"), (I_SIGN, "Signature block")]


def stg(t):  # a signing tag, marked in the text
    return f'<code class="stg">{{{{{t}}}}}</code>'


SIGBLK = ('<div class="edsig">' + "".join(f'<div><b>{h}</b><span>By: {stg("sig:" + n)}</span><span>Name: {stg("name:" + n)}</span>'
                                          f'<span>Title: {stg("title:" + n)}</span><span>Date: {stg("date:" + n)}</span></div>' for h, n in [("Lumen Labs", "1"), ("Pallet Cloud", "2")]) + "</div>")
CT_EDIT = scene(
    EDTB + '<div class="edoc"><div class="edpage">'
    '<p><b>7. Payment.</b> Invoices are due forty-five (45) days after receipt.</p>'
    '<p><b>8. Term.</b> This order form between Lumen Labs and <code class="stg">{{Client.Company}}</code> runs for twelve (12) months.</p>'
    f'<div class="edslot"><span class="edplus">{ic(I_PLUS, 12)}</span>'
    f'<span class="edmenu fx-drop"{A(1, 3)}>' + "".join(f"<span>" + (f'<i class="edhl fx-fade"{A(2)}></i>' if l == "Signature block" else "") + f"{ic(i, 12)}{l}</span>" for i, l in INSERTS) + "</span>"
    f'<div class="swap edins"><span class="edcar"{A(None, 3)}></span><div class="fx-drop"{A(3)}>{SIGBLK}</div></div></div></div></div>'
    f'<div class="bulk"><span class="to"><span class="tag t-gray">Version 1</span><span class="tag t-purple fx-pop"{A(5)}>Version 2, edited</span></span><span class="grow"></span>'
    + sw(("Next", None, 5, "ui-btn pri"), (CK + "Saved as version 2", 5, None, "tag t-green fx-pop")) + "</div>",
    "b-stone", [400, 800, 800, 900, 1100],
    '<b>Order form, 25 seats</b><span class="tag t-gray">Draft</span><span class="grow"></span><span class="sub">'
    + sw(("Saved", None, 3, ""), (LDR + "Saving", 3, 4, "fx-fade"), ("Saved", 4, None, "fx-fade")) + "</span>")


# Review & send (112, 114): what the signer gets, Before sending ticked off, reminders and expiry, and the email going
# out from the rep's own Gmail.
CHECKS = ["Every signer has a Signature field", "Subject and message", "Rina Sato signs first"]
CT_SEND = scene(
    path3(2) + '<div class="mail">'
    f'<div class="f"><span>From</span><span class="to">{logo("gmail", 14, "Gmail")}sam@lumenlabs.com</span></div>'
    f'<div class="f"><span>To</span><span class="to"><span class="tag t-gray">Rina Sato</span><span class="tag t-gray">Sam Okoye</span><span class="tag t-gray">Dana Ortiz, CC</span></span></div>'
    f'<div class="f"><span>Subject</span>{words("Order form, 25 seats, ready to sign", 1)}</div>'
    '<div class="tl" style="margin:10px 0">' + "".join(f'<div class="fx-l"{A(2, d=k * 120)}><span class="cok">{ic(I_CHECK, 11, 3)}</span>{c}</div>' for k, c in enumerate(CHECKS)) + "</div>"
    '<div class="cs" style="padding:6px 0"><span>Reminders</span><span class="tag t-gray">Day 2</span><span class="tag t-gray">Day 5</span><span class="grow"></span><span class="sub">Link expires in 30 days</span></div>'
    '<div class="sendrow"><span class="ui-btn">' + ic(I_LINK) + 'Copy link instead</span><span class="grow"></span>'
    + sw((ic(I_SEND) + "Send document", None, 3, "ui-btn pri"), (CK + "Sent from your Gmail", 3, None, "ui-btn pri done fx-pop")) + "</div></div>",
    "b-stone", [300, 1300, 1400, 900],
    '<b>Order form, 25 seats</b><span class="tag t-gray">Draft</span>')


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
    '<div class="skbtns">' + sw(("Sign", None, 3, "play"), (CK + "Signed", 3, None, "play ok fx-pop")) + '<span class="play2">Send back changes</span><span class="play2">Decline</span></div></div></div>'
    '<div class="feed csig"><div class="ch">Signers<span class="grow"></span><span class="tag t-gray">In order</span></div>'
    f'<div class="ev">{face("rina", 22)}<span class="grow">Rina Sato<small>Signer 1</small></span>' + sw(("Opened", None, 3, "tag t-purple"), ("Signed", 3, None, "tag t-green fx-pop")) + "</div>"
    f'<div class="ev">{face("marcus", 22)}<span class="grow">Marcus Lee<small>Signer 2</small></span>' + sw(("Waiting", None, 4, "tag t-gray"), ("Link sent", 4, None, "tag t-blue fx-pop")) + "</div></div></div>",
    "b-gray", [300, 700, 1500, 800], f'<span style="display:flex;align-items:center;gap:8px">{ic(I_SIGN, 16)}<b>Signing</b></span>')

# The status panel (106, StatusPanel.tsx): the one status and its sentence, the actions (Edit document and Send again
# only while it's out), each recipient with their role and state, then Owner, Created, Sent, Folder and Expiration date.
# Marcus signs, the contract turns Signed, and the signed PDF gets its certificate page.
SROWS = [("rina", "Rina Sato", "rina@palletcloud.com", "Signer", '<span class="ok">Signed</span>'),
         ("marcus", "Marcus Lee", "marcus@palletcloud.com", "Signer", sw(("Opened", None, 2, ""), ('<span class="ok">Signed</span>', 2, None, "fx-pop"))),
         ("amara", "Dana Ortiz", "dana@palletcloud.com", "CC", "")]
SDET = [("Owner", "Sam Okoye"), ("Created", "Oct 20, 2026"), ("Sent", "Oct 22, 2026"), ("Folder", "Customers"), ("Expiration date", "Nov 21, 2026")]
CT_STATUS = scene(
    '<div class="cstat"><div class="cdocs">' + "".join(f'<span class="pgx"><s></s><s></s><s></s><s></s><small>Page {k + 1}</small></span>' for k in range(3))
    + f'<span class="pgx cert fx-drop"{A(3)}><b>Certificate</b><s></s><s></s><small>Page 4</small></span></div>'
    '<div class="cpanel"><span class="cstag">' + sw(("Viewed", None, 2, "tag t-teal"), ("Signed", 2, None, "tag t-green fx-pop")) + "</span>"
    '<b class="cline">' + sw(("Waiting for Marcus Lee", None, 2, ""), ("Signed by everyone on October 26, 2026", 2, None, "fx-fade")) + "</b>"
    + sw((f'<span class="cacts"><span class="ib">{ic(I_PEN)}<i class="ctip fx-fade"{A(1, 2)}>Edit document</i></span><span class="ib">{ic(I_SEND)}</span><span class="ib">{ic(I_DOWN)}</span><span class="ib">{ic(I_ARCH)}</span></span>', None, 2, ""),
         (f'<span class="cacts"><span class="ib">{ic(I_DOWN)}</span><span class="ib">{ic(I_ARCH)}</span></span>', 2, None, "fx-fade"))
    + '<small class="clab">Recipients</small>'
    + "".join(f'<span class="csrow">{face(f, 22)}<span class="grow"><b>{n}</b><small>{e}</small></span><span class="csst"><small>{r}</small>{st}</span></span>' for f, n, e, r, st in SROWS)
    + '<span class="cdet">' + "".join(f"<span><small>{l}</small>{v}</span>" for l, v in SDET) + "</span></div></div>",
    "b-gray", [300, 1600, 900], "<b>Pallet Cloud order form</b>")


# Contracts in the CRM (109, 114): the opportunity's stage follows the contract, each step lands on its timeline, and
# a renewal opportunity is made 90 days before the notice date.
STAGES = ["Proposal", "Contract sent", "Won"]
TLE = [("t-blue", "Contract sent", "Order form, 25 seats", 1), ("t-purple", "Opened", "Rina Sato", 2), ("t-green", "Signed contract changed Stage to Won", "Amount $30,000, close date Nov 4", 3)]
CT_CRM = scene(
    '<div class="cdeal"><span class="cstg">' + "".join(f'<span class="cstgi">{n}<i class="cstgon fx-fade"{A(at, off)}>{n}</i></span>' for n, at, off in [(STAGES[0], None, 1), (STAGES[1], 1, 3), (STAGES[2], 3, None)]) + "</span>"
    '<span class="cctr"><small>Contract</small>' + sw(("Order form, 25 seats<i>Draft</i>", None, 1, ""), ("Order form, 25 seats<i>Waiting, 0 of 2 signed</i>", 1, 3, "fx-fade"), ("Order form, 25 seats<i>Signed Nov 4</i>", 3, None, "fx-fade")) + "</span></div>"
    '<div class="tl" style="margin:0 14px 10px">' + "".join(f'<div class="fx-l"{A(at)}><span class="tag {t}">{"Contract" if k < 2 else "Won"}</span><span class="grow"><b>{n}</b> <span class="sub">{d}</span></span></div>' for k, (t, n, d, at) in enumerate(TLE)) + "</div>"
    f'<div class="qt" style="margin:0 14px 14px"{A(4)}>{ic(I_BRANCH)}<span class="sub">Renewal opportunity</span><span class="grow"></span><b>Pallet Cloud renewal 2027</b></div>',
    "b-gray", [300, 1100, 1000, 1100, 1000],
    f'<span style="display:flex;align-items:center;gap:8px">{face("rina", 18)}<b>Pallet Cloud, 25 seats</b></span><span class="grow"></span>' + sw(("Proposal", None, 1, "tag t-gray"), ("Contract sent", 1, 3, "tag t-blue fx-pop"), ("Won", 3, None, "tag t-green fx-pop")))


# Read by Otto: each fact comes with its quote and page, and waits for a person to confirm it. The renewal notice date
# then sets the owner's alerts, 90, 60 and 30 days before it.
FACTS = [("End date", "Oct 31, 2027", "The initial term ends on October 31, 2027.", 2),
         ("Auto-renews", "Yes", "renews automatically for successive 12-month terms", 4),
         ("Notice period in days", "60", "at least sixty (60) days before the end of the then-current term", 4),
         ("Payment terms", "Net 45", "Invoices are due forty-five (45) days after receipt.", 3)]
CT_READ = scene(
    "".join(f'<div class="fact cfact fx-l"{A(2, d=k * 100)}><span class="grow"><small class="sub">{l}</small><b>{v}</b><q>{q}</q></span><span class="cite">p. {p}</span>'
            + sw((f'<span class="btns"><span class="no">×</span><span class="ok">{CK}</span></span>', None, 3 + k, ""), ("Confirmed", 3 + k, None, "tag t-green fx-pop")) + "</div>" for k, (l, v, q, p) in enumerate(FACTS))
    + f'<div class="qt" style="margin:12px 12px 8px"{A(7)}><span class="sub">Renewal notice date</span><span class="grow"></span><b>Sep 1, 2027</b></div>'
    + f'<div class="qt calrt" style="margin:0 12px 12px"{A(8)}>{ic(I_BELL)}<span class="sub">Alerts</span><span class="grow"></span>'
    + "".join(f'<span class="tag t-gray fx-pop"{A(8, d=150 + k * 110)}>{x}</span>' for k, x in enumerate(["Jun 3", "Jul 3", "Aug 2"])) + "</div>",
    "b-stone", [300, 1300, 800, 600, 600, 600, 700, 800],
    f'<span style="display:flex;align-items:center;gap:8px">{OWL}<b>Read by Otto</b></span><span class="grow"></span><span class="sub">'
    + sw((LDR + "Reading 6 pages", 1, 2, "fx-fade"), *((f"{4 - k} to confirm", 2 + k, 3 + k, "fx-fade") for k in range(4)), ("All confirmed", 6, None, "fx-fade")) + "</span>")

CT = [
    ("Upload yours or bring them from PandaDoc", "New contract takes a PDF or Word file, a .zip of many, a blank document or one of your team's own templates. Or connect PandaDoc and bring every document with its status, dates and signed PDF.", CT_PANDA),
    ("Four numbers that filter the list", "Drafts, Waiting for signature, Signed this month and Renewals in 90 days. Click one to see those contracts and click again to clear it. Keep contracts in folders and archive what's done.", CT_LIST),
    ("Recipients first", "Step one of three. Type a name and pick people from the opportunity or your team, make each a Signer or CC, and drag them into the order they sign.", CT_RECIP),
    ("Edit it like a doc", "A Word file opens in an editor with the toolbar you know, and the + adds text, a table, an image, a page break or a signature block. Variables like {{Client.FirstName}} fill in from the recipients and the deal. Save a contract as your team's template for next time. Otto never writes contract text.", CT_EDIT),
    ("Signature fields placed for you", "Omniscient finds where each person signs from the tags other tools leave (DocuSign-style \\s1\\, Dropbox Sign, Adobe Sign or {{sig:1}}) or from the signature blocks. Accept the suggestions, or drag a signature, initials, date, name, text or checkbox onto the page.", CT_FIELDS),
    ("Review and send from your own inbox", "See the email each signer gets and a Before sending checklist. Reminders go out on days 2 and 5 and links expire in 30 days, or copy the link instead. It sends from your own Gmail, Outlook or other mailbox, so replies land in your thread.", CT_SEND),
    ("Signing on a page in your brand", "Up to ten signers, in order or all at once. Each private link opens in your brand. The signer confirms their name and email, agrees to sign electronically, then types or draws a signature, and Next field walks them through the rest.", CT_SIGN),
    ("See where each contract stands", "One line says where it is, like \"Waiting for Marcus Lee\", with each person's sent, opened and signed times and a Remind button. A bounced email shows in red with Edit email. When everyone has signed, the signed PDF gets a certificate page and the audit trail.", CT_STATUS),
    ("The deal moves with the contract", "Link a contract to its opportunity, or take Otto's suggested match. Sending moves the deal to Contract sent, signing moves it to Won with the value and close date, and each step shows on its timeline. A renewal opportunity appears 90 days before the notice date.", CT_CRM),
    ("Otto reads the signed contract", "Otto reads the signed copy for its dates, renewal terms, notice period, value and key obligations. Each suggestion shows its quote and page, and nothing is saved until a person confirms it. The owner gets a notice and an email 90, 60 and 30 days before the renewal notice date.", CT_READ),
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
FOLDERS = [("Follow-ups", [("After the demo", 1, 1), ("Meeting no-show", 1, 0), ("No reply in 5 days", 0, 0)]), ("Contracts", [("Contract renewal due", 1, 0), ("Contract signed", 1, 0), ("Over $25,000 to Finance", 1, 0)])]
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
PICK = [(I_MAIL, "Send email", 1), (I_CLOCK, "Wait", 0), (I_BRANCH, "Branch", 0), (I_PEN, "Update field", 0), (I_BELL, "Notify owner", 0), (I_CHECK, "Ask for approval", 0), (I_CODE, "Webhook", 0), (I_STOP, "Stop", 0)]
AU_BUILD = scene(
    '<div class="wf-cv">'
    + wcard(I_BOLT, "Meeting held", "Starts when", 1, cls=" wtrig") + wline(2) + wcard(I_CLOCK, "Wait 2 days", "Wait", 2, d=120) + wline(3)
    + '<div class="wslot">' + sw((f'<span class="wplus">{ic(I_PLUS)}</span>', 3, 4, "fx-pop"), (wcard(I_MAIL, AU_NEXT_HTML, "Send email"), 4, None, ""))
    + f'<div class="wpick fx-r"{A(3, 4, 150)}>' + "".join(f'<span class="{"on" if on else ""}">{ic(i)}{n}</span>' for i, n, on in PICK) + "</div></div>"
    + wline(5) + wcard(I_BRANCH, "Replied in the last 3 days", "Branch", 5, d=120) + wline(5, 250) + yesno(FLOW_YES, FLOW_NO, 5, 350) + "</div>",
    "b-stone", [300, 600, 700, 1300, 800], '<b>After the demo</b><span class="tag t-gray">Draft</span>')

# Triggers: a different event is picked each time, and the step under it changes with it.
TRIG = [("Records", ["Field changed", "Opportunity stage changed"]), ("Meetings", ["Meeting held", "Meeting no-show"]), ("Email", ["Email replied"]),
        ("Contracts", ["Contract sent", "Contract signed", "Contract renewal due", "Contract version uploaded", "Contract sent back with changes"]), ("Time and people", ["On a schedule", "Added in bulk"])]
PICKED = {"Meeting held": (2, 3), "Contract sent": (3, 4), "Contract signed": (4, 5), "Contract sent back with changes": (5, None)}
AU_TRIG = scene(
    '<div class="wtrg"><div class="wtl">'
    + "".join(f'<div class="wtg"><small>{g}</small>' + "".join(f'<span class="wtc fx-pop"{A(1, d=(gi * 2 + k) * 50)}>{t}' + (f'<s class="ring fx-pop"{A(*PICKED[t])}></s>' if t in PICKED else "") + "</span>" for k, t in enumerate(items)) + "</div>" for gi, (g, items) in enumerate(TRIG))
    + '</div><div class="wf-cv">'
    + f'<div class="wfc wtrig fx-drop"{A(1)}><span class="wi">{ic(I_BOLT)}</span><span class="wt"><small>Starts when</small><b>' + sw(("Meeting held", None, 3, ""), ("Contract sent", 3, 4, "fx-fade"), ("Contract signed", 4, 5, "fx-fade"), ("Contract sent back with changes", 5, None, "fx-fade")) + "</b></span></div>"
    + wline(2) + '<div class="wslot">'
    + sw((wcard(I_MAIL, 'Thanks for today, <span class="tok">{{first_name|there}}</span>', "Send email"), 2, 3, ""), (wcard(I_BELL, "Notify the owner", "Notify owner", extra=wtags(f'<span class="tag t-gray">{logo("slack", 11)}Slack</span>')), 3, 4, ""),
         (wcard(I_PEN, "Company stage to Customer", "Update field"), 4, 5, ""), (wcard(I_CHECK, "Ask Legal to approve", "Ask for approval", extra=wtags('<span class="tag t-gray">In order</span>')), 5, None, ""))
    + "</div></div></div>",
    "b-gray", [300, 900, 1400, 1400, 1400], "<b>Starts when</b>")


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

# Contract events: a sent order form, a signed one, a renewal notice and changes sent back each start their own workflow.
EVENTS = [(I_SEND, "Order form sent to Marcus", wcard(I_BELL, "Notify the owner", "Contract sent", extra=wtags(f'<span class="tag t-gray">{logo("slack", 11)}Slack</span>'))),
          (I_SIGN, "Order form signed", wcard(I_MAIL, "Welcome to Lumen Labs", "Contract signed", extra=wtags(OK_TAG))),
          (I_CAL, "Renewal notice in 90 days", wcard(I_CLOCK, "Wait until 1 day before the next meeting", "Contract renewal due")),
          (I_REPLY, "Client sent back changes", wcard(I_CHECK, "Ask Legal to approve", "Contract sent back with changes", extra=wtags('<span class="tag t-gray">Reminder after 2 days</span>')))]
AU_DEAL = scene(
    '<div class="wev">' + "".join(f'<span class="wevc fx-l"{A(2 * k + 1)}>{ic(i)}{t}</span><span class="wevl fx-x"{A(2 * k + 2)}></span><span class="wevw fx-r"{A(2 * k + 2, d=150)}>{c}</span>' for k, (i, t, c) in enumerate(EVENTS)) + "</div>",
    "b-stone", [300, 600, 700, 600, 700, 600, 700, 600], "<b>From Contracts</b>")

AU = [
    ("Workflows on a canvas", "Start from a trigger and add steps: send an email, wait, branch, update a field, notify the owner, ask for approval, call a webhook or stop. Keep your workflows in folders.", AU_BUILD),
    ("Start from what happens in a deal", "A workflow can start when a record or an opportunity's stage changes, a meeting is held or missed, or an email gets a reply. Contracts start them too: when one is sent or signed, a new version is uploaded, the client sends back changes or a renewal is due. It can also run on a schedule, or for people you add in bulk.", AU_TRIG),
    ("Every email approved before Publish", "Write each email with merge fields, or ask Otto, the AI in Omniscient, to draft it. Every email starts unapproved, changing its words asks for approval again, and Publish waits until each one is approved.", AU_APPROVE),
    ("Sent from the owner's own mailbox", "Emails go from the record owner's Gmail, Microsoft 365 or IMAP mailbox, as a new email or a reply in the same thread. Each one ends with a one-click unsubscribe link.", AU_MAIL),
    ("A steady pace from each mailbox", "Each mailbox sends only in its owner's working hours, with a random gap of 2 to 6 minutes between emails and a daily cap. A newly connected mailbox starts at 20 emails a day and adds 10 a day.", AU_PACE),
    ("A reply stops the run", "When someone replies, their runs stop in every workflow. A bounce stops the run and an unsubscribe stops every run, and workflows skip that address from then on.", AU_REPLY),
    ("Contracts and approval rules", "Contracts start workflows too: a contract sent or signed, a new version, changes sent back or a renewal notice coming up. The Ask for approval step sends a contract to the right teammates, in order or all at once. Only if can test its value or whether it's on the client's paper.", AU_DEAL),
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
        "desc": "Workflows that follow up after meetings, replies and contract events. Each email is approved first, sent from your own mailbox and stopped by a reply.",
        "h1": "Follow-ups that run on their own.", "h1b": "From your own mailbox.",
        "lede": "Build a workflow once. Omniscient sends each email your team approved from the owner's own mailbox, at a steady pace, and stops when someone replies.",
        "hero": AU_HERO, "feats": AU,
        "list": ["Workflows on a canvas, in folders", "Record and stage triggers", "Meeting and email triggers", "Contract triggers", "Schedules and Add to workflow", "Email, wait, branch and update steps", "Ask for approval on contracts", "Approval before Publish", "Replies and unsubscribes stop runs", "Working hours, caps and warm-up"],
        "faq": [
            ("Does anything send before we approve it?", "No. Every email in a workflow starts unapproved, and Publish waits until someone on your team approves each one. Changing an approved email's words asks for approval again."),
            ("Which mailbox sends the emails?", "The record owner's own mailbox: the opportunity's owner, or else the workflow's owner. Gmail, Microsoft 365 and any mailbox connected over IMAP and SMTP can send."),
            ("What stops a run?", "A reply from the person stops their runs in every workflow. A bounce stops the run, and an unsubscribe stops every run for that address. Workflows skip a bounced or unsubscribed address from then on, and you can stop a run or take a person out by hand."),
            ("How fast does it send?", "Only in the owner's working hours and days, with a random 2 to 6 minute gap between emails. Each mailbox has a daily cap, 100 by default and 50 for a free Gmail address, and a newly connected mailbox starts at 20 a day and adds 10 a day."),
            ("Can Otto write the emails?", "When you ask. Otto drafts or rewrites an email step and it's marked as his. It still needs a person's approval before the workflow can go live."),
            ("Can someone go through a workflow twice?", "You choose: once, or again after a gap once their last run has ended. A person is never in the same workflow twice at once."),
            ("Can a workflow ask for approval on a contract?", "Yes. Start from Contract version uploaded or Contract sent back with changes, and add the Ask for approval step. Pick the approvers, in order or all at once, and a reminder after a set number of days. Only if and Branch can test the contract's value, status, end date, version number, whether it's on the client's paper and whether changes were sent back. A contract over $25,000 can ask Finance, for example."),
        ],
    },
    {
        "slug": "contract-management", "name": "Contract Management", "band": "b-stone",
        "title": "Contract Management: send, sign and renew next to the deal | Omniscient",
        "desc": "Upload your contracts or bring them from PandaDoc, edit a draft like a doc, send it in three steps from your own inbox, and let the deal move to Won when it's signed.",
        "h1": "Every contract, from draft to renewal.", "h1b": "Right next to the deal.",
        "lede": "Upload your contracts or bring them from PandaDoc. Edit a draft like a doc and send it in three steps from your own inbox. The deal moves when it's signed, and you hear about renewals in time.",
        "hero": CT_HERO, "feats": CT,
        "list": ["PDF, Word and .zip upload", "Import from PandaDoc", "Blank document and team templates", "Folders and archive", "Four numbers that filter", "Recipients from the opportunity", "Signer or CC, in order", "Edit Word files like a doc", "Variables from the deal", "Signature fields placed for you", "Email preview and checklist", "Sent from your own inbox", "Reminders, expiry and email codes", "Signing page in your brand", "Signed PDF with certificate", "Bounced emails flagged", "Deal moves to Contract sent and Won", "Renewal opportunities", "Dates and terms read by Otto", "Alerts at 90, 60 and 30 days"],
        "faq": [
            ("Can I bring my PandaDoc documents?", "Yes. Connect PandaDoc from New contract and every document is listed with its status and date, up to 500 at a time. Pick the ones you want. Each comes in with its status and dates, completed ones bring their signed PDF, and one that's already in Omniscient is skipped."),
            ("Which files can I upload?", "PDF or Word (.docx) files up to 25 MB each, one at a time or many at once, even as a .zip. Mark each one Draft or Signed, with its signed date if you know it."),
            ("Does Omniscient write or draft contracts?", "No. Otto never writes, drafts or suggests contract text, and there are no ready-made templates. Your contracts are the files you upload or import, a blank document you write, or your team's own templates. Otto only reads a contract to find where people sign and to suggest its dates and terms, each with its quote, for a person to confirm."),
            ("Can I edit the contract in Omniscient?", "Yes, while it's a draft. A Word file opens in an editor with undo, styles, bold, italic, underline, lists, alignment and links, and the + adds text, a table, an image, a page break or a signature block. A PDF takes text boxes. Your edits become the next version, and your upload stays version 1."),
            ("How does Omniscient find where people sign?", "It reads the tags other tools put in contracts: DocuSign-style tags like \\s1\\, Dropbox Sign and Adobe Sign tags, and {{sig:1}}. Without tags, it reads the signature blocks, such as \"By:\", \"Name:\" and \"Date:\" lines, in one column or several. You accept each field before you send."),
            ("How does sending work?", "Three steps: Recipients, Edit document, then Review and send. Send to up to ten signers, in order or all at once, and add CC for anyone who only needs the signed copy. Reminders go out on days 2 and 5 and links expire after 30 days unless you change it."),
            ("Do signing emails come from my address?", "Yes, when your Gmail, Outlook or other mailbox is connected and allowed to send. The email sits in your Sent folder and a reply lands in the same thread. Without one, it goes as \"Your name via Omniscient\" with replies coming to you."),
            ("What happens to the deal?", "Sending moves the opportunity to your Contract sent stage, and signing moves it to Won with the contract's value and the signed date. Each step shows on the deal's timeline. 90 days before the renewal notice date, a renewal opportunity is created. Each of these can be turned off."),
            ("What does Otto read?", "Parties, effective date, term, end date, auto-renewal, notice period, renewal notice date, value, payment terms, termination rights and key obligations, each with a quote and a page from the file. A suggestion whose quote isn't in the file is dropped, and nothing is saved until a person confirms it."),
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
    form = '<form class="signup" action="https://app.tryomniscient.com/signup" method="get"><input type="email" name="email" placeholder="Work email" aria-label="Work email" autocomplete="email"><button class="btn btn--primary" type="submit">Start free trial</button></form>'
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
