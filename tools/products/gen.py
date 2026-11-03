# Writes the three product pages: product/linkedin-outbound, product/crm and product/deal-room.
# Each page: hero with the email field and the main product shot, feature rows with a shot each, what's included,
# questions, the other two products and a closing band. Shots reuse the home page's product-shot styles (home.css);
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
DOTS = '<span class="dots3"><i></i><i></i><i></i></span>'

LEADS = [("Jordan Blake", "jordan", 8, "Commented on a CRM post", "Tallyfin"), ("Rina Sato", "rina", 8, "Hiring 3 sales reps", "Pallet Cloud"), ("Diego Marín", "diego", 7, "New in role", "Shiftwise"), ("Amara Kofi", "amara", 8, "Posted about pipeline", "Ledgerly")]

# ---- Outbound LinkedIn shots ----
LI_HERO = shot(
    '<div class="canvas"><div class="dots">'
    f'<div class="step"><span class="si">{logo("linkedin", 14)}</span><span><b>Send an invite</b><small>With a short, personal note</small></span></div><div class="wait">Wait 2 days</div>'
    '<div class="step" style="flex-direction:column;align-items:stretch"><span style="display:flex;gap:10px;align-items:center"><span class="si"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14v10H9l-4 4z"/></svg></span><span><b>Message with lead magnet</b><small>After they accept</small></span></span><span class="magnet"><span class="pdf">PDF</span><span><b>Sales handoff benchmark</b><small>Made for Pallet Cloud</small></span></span></div><div class="wait">Wait 3 days</div>'
    '<div class="step"><span class="si"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14v10H9l-4 4z"/></svg></span><span><b>Follow up</b><small>Stops when they reply</small></span></div></div>'
    '<div class="people"><div class="hd"><span>People <span class="sub mono">250</span></span><span class="ui-btn pri" style="height:26px">Approve 250</span></div>'
    + "".join(f'<div class="pr">{face(f)}<span class="nm"><b>{n}</b><span>{co}</span></span><span class="tag t-gray">Needs approval</span></div>' for n, f, _, _, co in LEADS)
    + "</div></div>",
    "b-gray",
    '<span class="sub mono crumb">Campaigns /</span><b>US SaaS founders</b><span class="tag t-gray" style="margin-left:6px">Draft</span><span class="grow"></span><span class="ui-btn pri">Go live</span>',
)
def lead_row(c, at):  # a lead arrives, then its fit squares fill
    n, f, fit, sig, co = c
    q = "".join("<i></i>" if i < (4 if fit == 8 else 3) else '<i class="off"></i>' for i in range(4))
    return f'<tr{A(at)}><td><span class="who">{face(f)}{n}</span></td><td><span class="fit"><span class="q">{q}</span>{fit}/8</span></td><td><span class="sig"><i></i>{sig}</span></td><td class="hide-s">{co}</td></tr>'


# Scout: the search is read, then leads arrive with their fit.
LI_FIND = scene(
    f'<div class="sentence" style="font-size:18px">Founders in <u class="fx-u"{A(1)}>United States</u> at <u class="fx-u"{A(2)}>software</u> companies with <u class="fx-u"{A(3)}>11 to 200 people</u></div>'
    f'<div class="meta">{sw((LDR + "Searching people and companies", 4, 5, "fx-fade"), ("<b>1,920</b> people match", 5, None, "fx-fade"))}</div>'
    '<div class="scroll-x"><table class="tb"><thead><tr><th>Name</th><th>Fit</th><th>Signal</th><th class="hide-s">Company</th></tr></thead><tbody>'
    + "".join(lead_row(c, 5 + i) for i, c in enumerate(LEADS)) + "</tbody></table></div>",
    "b-stone", [250, 220, 220, 300, 1100, 240, 240, 240])

# Fit: each reason lands and adds to the score.
WHY = [("t-green", "Match", "Role: Founder or CEO", "Profile"), ("t-green", "Match", "Company size: 38 people", "Profile"), ("t-purple", "Signal", "Hiring 3 sales reps", "2d ago"), ("t-purple", "Signal", "Commented on a CRM post", "5d ago")]
LI_WHY = scene(
    f'<div class="rec"><div class="top2">{face("rina", 40)}<div class="grow"><h4>Rina Sato</h4><span class="sub">Co-founder &amp; CEO, Pallet Cloud</span></div>'
    '<div class="fitm"><span class="segs">' + "".join(f'<i class="fx-pop"{A(k // 2 + 1, d=(k % 2) * 90)}></i>' for k in range(8)) + "</span>"
    f'<b>Fit {sw(*[(f"{2 * k}/8", k or None, k + 1 if k < 4 else None, "") for k in range(5)])}</b></div></div>'
    '<div class="tl">' + "".join(f'<div class="fx-l"{A(i + 1)}><span class="tag {t}">{k}</span>{x}<span class="when">{w}</span></div>' for i, (t, k, x, w) in enumerate(WHY)) + "</div></div>",
    "b-gray", [400, 650, 650, 650])

# The message: Otto reads the signal, writes, the reason is marked, and the rep approves.
MSG = "Rina, I saw Pallet Cloud is hiring three sales reps. I put together a short benchmark on how teams your size hand leads from marketing to sales. Want a copy?"
LI_WRITE = scene(
    f'<div class="tl" style="margin:14px 14px 0"><div{A(1)}><span class="tag t-purple">Signal</span>Hiring 3 sales reps<span class="when">LinkedIn, 2d ago</span></div></div>'
    f'<div class="msgs"><div class="bub me"{A(2)}><div class="m">{OWL}{sw(("Writing " + DOTS, 2, 3, "fx-fade"), ("Written by Omniscient", 3, None, "fx-fade"))}</div>{words(MSG, 3, (6, 10))}</div></div>'
    f'<div class="bulk"><span class="sub">Message 1 of 3</span><span class="grow"></span><span class="ui-btn">Edit</span>{sw(("Approve", None, 5, "ui-btn pri"), (CK + "Approved", 5, None, "ui-btn pri done fx-pop"))}</div>',
    "b-stone", [300, 600, 700, 1700, 900])


def mag(kind, title, sub, at, extra=""):
    return f'<span class="magnet"{A(at)}><span class="pdf"><s></s><s></s><s></s>{kind}</span><span class="grow"><b>{title}</b><small>{sub}</small></span>{extra}</span>'


# Lead magnets: one is made for each company, then the first goes into the message.
LI_MAGNET = scene(
    '<div class="mags">'
    + mag("PDF", "Sales handoff benchmark", "Made for Pallet Cloud, 6 pages", 1, f'<span class="tag t-green fx-pop"{A(5, d=200)}>In message 1</span>')
    + mag("PDF", "Pipeline review checklist", "Made for Tallyfin, 2 pages", 2) + mag("WEB", "CRM audit", "Made for Ledgerly, 5 questions", 3)
    + f'<div class="bub me full"{A(4)}>Rina, here is the benchmark I mentioned, made for Pallet Cloud.<span class="att fx-drop"{A(5)}><span class="pdf">PDF</span><b>Sales handoff benchmark</b></span></div></div>',
    "b-stone", [300, 500, 500, 700, 800])


# Pacing: the day runs from 9:00, actions land at uneven gaps, nothing in the lunch break, and the warm-up cap is kept.
def pct(m):  # minutes after midnight on a 7:00 to 19:00 bar
    return round((m - 420) / 7.2, 2)


SWEEP = 4000
def when(m):
    return round((m - 540) / (980 - 540) * SWEEP)


INV = [552, 571, 598, 641, 667, 712, 824, 860, 898, 937, 965]
MSGS = [580, 622, 690, 734, 838, 912, 950]
SENT = [("t-green", "Sent", "Invite to Jordan Blake", 552), ("t-green", "Sent", "Message 1 to Rina Sato", 580), ("t-gray", "Stopped", "Amara Kofi replied", 605)]
LI_SAFE = scene(
    '<div class="day"><div class="dh"><b>Today</b><span class="tag t-green">Warming up, day 4</span><span class="grow"></span><span class="lgd"><i class="iv"></i>Invites</span><span class="lgd"><i class="ms"></i>Messages</span></div>'
    f'<div class="track"><span class="win" style="left:{pct(540)}%;width:{pct(1020) - pct(540)}%"></span><span class="lunch" style="left:{pct(750)}%;width:{pct(810) - pct(750)}%"></span>'
    + "".join(f'<i class="dt {k} fx-pop"{A(1, d=when(m), s=f"left:{pct(m)}%")}></i>' for k, ms in (("iv", INV), ("ms", MSGS)) for m in ms)
    + f'<span class="now"{A(1, s=f"--from:translateX({pct(540)}%);--on:translateX({pct(980)}%)")}><i></i></span></div>'
    f'<div class="ticks"><span style="left:{pct(540)}%">9:00</span><span style="left:{pct(780)}%">Lunch</span><span style="left:{pct(1020)}%">17:00</span></div></div>'
    '<div class="facts" style="margin:0 14px">'
    f'<div><small>Invites today</small>11 of 11<span class="pbar"><i class="fx-x lin"{A(1, s="width:100%")}></i></span></div>'
    f'<div><small>Messages today</small>7 of 30<span class="pbar"><i class="fx-x lin"{A(1, s="width:23%")}></i></span></div>'
    '<div><small>Gap between actions</small>4 to 9 min</div></div>'
    '<div class="tl" style="margin:10px 14px 14px">' + "".join(f'<div class="fx-l"{A(1, d=when(m))}><span class="tag {t}">{k}</span>{x}<span class="when">{m // 60}:{m % 60:02d}</span></div>' for t, k, x, m in SENT) + "</div>",
    "b-gray", [300, 4200])

# Inbox: replies land, get sorted, the sequence stops and an answer is drafted.
THREADS = [("Rina Sato", "Thanks for the benchmark. What would a trial look like?", "t-green", "Interested"), ("Jordan Blake", "Next Tuesday works for a call.", "t-green", "Interested"), ("Amara Kofi", "Looping in our head of sales.", "t-yellow", "Needs reply")]
REPLY = "Happy to set it up. You get 14 days free for your team, and I can walk you through it on a 20-minute call. Does Thursday work?"
LI_INBOX = scene(
    '<div class="tabs3"><span class="on">All</span><span>Needs reply</span><span>Interested</span></div>'
    + "".join(f'<div class="th fx-drop"{A(i + 1)}><span class="un"></span><span class="grow"><b>{n}</b><span class="sub">{m}</span></span><span class="tag {t} fx-pop"{A(4, d=i * 120)}>{k}</span></div>' for i, (n, m, t, k) in enumerate(THREADS))
    + f'<div class="draft"{A(5)}><div class="m">{OWL}Reply drafted for Rina</div>{words(REPLY, 5, d=250)}<div class="drf"><span class="tag t-gray fx-pop"{A(6)}>Sequence stopped</span><span class="grow"></span><span class="ui-btn">Edit</span><span class="ui-btn pri">Send</span></div></div>',
    "b-gray", [300, 500, 500, 700, 700, 1700], "<b>Inbox <span>3 to answer</span></b>")

# Results: the funnel fills, then the weekly reply rate.
FUN = [("Invites sent", "250", 100), ("Accepted", "103 (41%)", 41), ("Replied", "53 (21%)", 21), ("Meetings", "12", 4.8)]
LI_RESULTS = scene(
    '<div class="fun">' + "".join(f'<span>{l}</span><span class="pbar"><i class="fx-x"{A(i + 1, s=f"width:{w}%")}></i></span><b class="fx-fade"{A(i + 1, d=200)}>{v}</b>' for i, (l, v, w) in enumerate(FUN)) + "</div>"
    '<div class="learn" style="border-top:1px solid var(--frame)"><span class="mono" style="color:var(--ink-2)">Reply rate, last 4 weeks</span><span class="bars2">'
    + "".join(f'<i class="fx-y"{A(5, d=k * 110, s=f"height:{h}%")}></i>' for k, h in enumerate([40, 52, 66, 84]))
    + f'</span><span class="big fx-pop"{A(6)}>21%</span></div>',
    "b-gray", [300, 450, 450, 450, 600, 700], '<b>US SaaS founders</b><span class="grow"></span><span class="sub mono">Last 4 weeks</span>')

LI = [
    ("Find leads with buying intent", "Type who you want to reach. Scout searches people and companies and gives each lead a fit score against your rules.", LI_FIND),
    ("See why each lead fits", "Each lead shows the rules it matches and the signals behind the score: posts, comments, new roles and hiring.", LI_WHY),
    ("Write a personal message for every lead", "Omniscient writes each message from the lead's profile and recent activity. Edit it or approve it as it is.", LI_WRITE),
    ("Attach a lead magnet", "Open the conversation with something useful: a benchmark, a guide or a short audit made for the lead's company.", LI_MAGNET),
    ("Run LinkedIn sequences safely", "Invites, messages and follow-ups go out in your working hours, with a lunch break, uneven gaps and a warm-up for new accounts, within daily limits that protect your account. A sequence stops as soon as the lead replies.", LI_SAFE),
    ("Answer every reply in one inbox", "Replies from all campaigns go to one inbox, sorted into Needs reply, Interested and Later, with an answer drafted for each.", LI_INBOX),
    ("Track campaign results", "See invites accepted, replies and meetings booked for each campaign, week by week.", LI_RESULTS),
]

# ---- CRM shots ----
CRM_HERO = shot(
    '<div class="scroll-x"><table class="tb"><thead><tr><th>Company</th><th>Stage</th><th class="hide-s">Source</th><th>Last touch</th><th class="hide-s">Pipeline</th></tr></thead><tbody class="rows">'
    + "".join(f'<tr{" class=open" if o else ""}><td><span class="who"><span class="av" style="background:{bg}">{i}</span>{n}</span></td><td><span class="tag {t}">{st}</span></td><td class="hide-s sub">{src}</td><td class="sub">{lt}</td><td class="hide-s">{v}</td></tr>'
              for n, i, bg, t, st, src, lt, v, o in [
                  ("Northwind Health", "NW", "#efe3ff", "t-green", "Customer", "Inbound form", "Email, 2h ago", "$84,000", 0),
                  ("Harbor &amp; Pine", "HP", "#dbeafe", "t-yellow", "Proposal", "Event", "Call, yesterday", "$126,500", 1),
                  ("Pallet Cloud", "PC", "#fde68a", "t-blue", "Discovery", f'<span style="display:inline-flex;align-items:center;gap:6px">{logo("linkedin", 14)}LinkedIn campaign</span>', "LinkedIn, 3d ago", "$42,000", 0),
                  ("Verda Robotics", "VR", "#d1fae5", "t-purple", "Meeting set", "Scout", "Meeting, 4d ago", "$61,000", 0),
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
DUPS = [("t-gray", "Event", "Rina Sato", "Scanned at SaaS Connect", "translate(40px,24px) scale(.5)"), ("t-purple", "LinkedIn", "Rina S.", "Replied to a campaign", "translate(-40px,24px) scale(.5)"),
        ("t-blue", "Email", "rina@palletcloud.com", "Asked for pricing", "translate(40px,-24px) scale(.5)"), ("t-green", "Inbound", "R. Sato", "Filled the pricing form", "translate(-40px,-24px) scale(.5)")]
HIST = [("t-gray", "Event", "Scanned at SaaS Connect", "Oct 14"), ("t-purple", "LinkedIn", "Replied to a campaign", "Oct 9"), ("t-blue", "Email", "Asked for pricing", "Oct 3"), ("t-green", "Inbound", "Filled the pricing form", "Oct 2")]
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
    ("One record for every lead", "Leads from website forms, LinkedIn campaigns, events and imports are matched by email, LinkedIn and company domain. Each person gets one record with their full history.", CRM_ONE),
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

# Approve: the buyer approves on the page, the deal moves to Won and the team hears about it.
DR_WIN = scene(
    f'<div class="prop sign"{A(1)}><div class="pnav"><b>Lumen Labs × Pallet Cloud</b></div><div class="sg"><span><small>CONTRACT</small><b>25 seats, $30,000 a year</b></span>'
    + sw(("Approve", None, 2, "play"), (CK + "Approved", 2, None, "play ok fx-pop")) + "</div></div>"
    f'<div class="feed" style="border:0"><div class="ev"{A(3)}>{face("marcus", 22)}<span>Marcus approved the contract<small>Thu, 16:48</small></span></div>'
    '<div class="won" style="margin-top:0"><span class="sub">Stage</span><span class="wt">'
    + sw(("Proposal", None, 4, "tag t-yellow"), ("Won", 4, None, "tag t-green fx-pop"))
    + f'<span class="burst"{A(4)}>' + "".join(f'<i style="--bx:{x}px;--by:{y}px"></i>' for x, y in [(-22, -12), (20, -14), (-16, 12), (24, 10), (2, -20), (-4, 18)]) + "</span></span>"
    + f'<span class="tag t-gray fx-pop"{A(5)}>{logo("slack", 12)}Team alerted</span><span class="grow"></span><span class="sub mono">$30,000</span></div></div>',
    "b-gray", [300, 900, 700, 800, 700], "<b>Pallet Cloud, 25 seats</b>")

DR = [
    ("Keep your sales content in one library", "Import your website, case studies, decks and videos. Omniscient tags each item by industry, use case and objection.", DR_LIB),
    ("Build a proposal for each deal", "Pick a deal. Omniscient builds the proposal from the deal, your calls and your Library, in your brand, one tab at a time.", DR_BUILD),
    ("Netflix-style rows for each stakeholder", "The top of the proposal shows the buyer's goals and your plan. Below are rows of videos, case studies and documents for each person on the buying team.", DR_ROWS),
    ("Your prices, or a quote after a call", "Omniscient uses your saved price list. If it has no prices, it asks you once how you price and saves the answer. You can also choose to quote after a call.", DR_PRICE),
    ("Send it from your own inbox", "Send the proposal link from Gmail or Outlook. Each person gets their own link, so you know who opened it.", DR_SEND),
    ("See who watched what", "See which person opened the proposal, which videos they watched and which pages they read. Get an alert by email or Slack when the buying team is active.", DR_WATCH),
    ("Approve on the page", "Buyers approve the proposal on the page. The deal moves to Won and the team gets an alert.", DR_WIN),
]

PAGES = [
    {
        "slug": "linkedin-outbound", "name": "Outbound LinkedIn", "band": "b-gray",
        "title": "Outbound LinkedIn: find leads and message them on LinkedIn | Omniscient",
        "desc": "Find leads with buying intent, write a personal message for each one, attach a lead magnet and run LinkedIn sequences you approve.",
        "h1": 'Find leads and message them on LinkedIn.', "h1b": "You approve every message.",
        "lede": "Search for leads, get a personal message written for each one, and run LinkedIn sequences with safe daily limits.",
        "hero": LI_HERO, "feats": LI,
        "list": ["Lead search in plain English", "Fit score with reasons", "Intent signals", "Personal messages for each lead", "Lead magnets per company", "Invites, messages and follow-ups", "Approval before sending", "Safe daily limits", "One inbox for all replies", "Campaign results by week"],
        "faq": [
            ("Does Omniscient send LinkedIn messages on its own?", "No. Omniscient writes each message, and nothing is sent until someone on your team approves it."),
            ("Is it safe for my LinkedIn account?", "Sending stays within daily limits for invites and messages, only during your working hours. You can lower the limits in the campaign's settings."),
            ("Where do the leads come from?", "Scout searches people and companies by role, company, size and location, and finds people who engaged with posts on your topic."),
            ("What happens when a lead replies?", "The sequence stops for that lead, and the reply goes to your inbox with a drafted answer."),
            ("Can I use my own lists?", "Yes. Add people from your CRM or from a saved Scout list to any campaign."),
        ],
    },
    {
        "slug": "crm", "name": "Omniscient CRM", "band": "b-stone",
        "title": "Omniscient CRM: emails, calls and leads in one place | Omniscient",
        "desc": "A CRM that records your emails, meetings and calls, keeps one record per lead, writes your call notes and answers questions about any account.",
        "h1": "A CRM that fills itself in.", "h1b": "Emails, calls and leads in one place.",
        "lede": "Omniscient records your emails, meetings and calls, keeps one record for every lead, and answers questions about any account.",
        "hero": CRM_HERO, "feats": CRM,
        "list": ["Email and calendar capture", "One record per lead", "Inbound, outbound and event leads", "Call notes from transcripts", "Facts with quotes", "Deal updates you approve", "Ask Omniscient", "Pipeline and forecast", "Custom fields and views", "Migration from your CRM"],
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
            ("How do buyers approve?", "On the proposal page. The deal moves to Won and your team gets an alert."),
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
