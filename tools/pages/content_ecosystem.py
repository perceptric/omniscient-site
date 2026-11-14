from ui import *

def app_tile(n, state):
    r = badge('Connected', 't-green') if state else pb('Connect', 'Plus')
    return f'<div style="display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;box-shadow:0 0 0 1px var(--l1);background:#fff">{blogo(n,32)}<div style="flex:1;min-width:0"><b style="font-weight:500;display:block">{n}</b><span style="font-size:12px;color:var(--t4)">{LOGOS[n][1]}</span></div>{r}</div>'

def code(lines): return f'<pre class="code">{lines}</pre>'

def browser(url, inner, side=''):
    bar = f'<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--l1);background:#fafafa"><span style="display:flex;gap:6px"><i style="width:10px;height:10px;border-radius:50%;background:#e5e5e5"></i><i style="width:10px;height:10px;border-radius:50%;background:#e5e5e5"></i><i style="width:10px;height:10px;border-radius:50%;background:#e5e5e5"></i></span><span style="flex:1;margin:0 10px;height:26px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px var(--l1);display:flex;align-items:center;padding:0 12px;font-size:12px;color:var(--t3)">{url}</span><span class="ib" style="background:#0a0a0a;color:#fff;border-radius:6px"><svg width="14" height="14" style="color:#fff"><use href="#mark"/></svg></span></div>'
    body = f'<div style="display:grid;grid-template-columns:1fr {"340px" if side else "0"};min-height:520px"><div style="min-width:0;background:#f6f6f4">{inner}</div>{side}</div>'
    return f'<div class="app win" style="width:1180px;padding:0;overflow:hidden">{bar}{body}</div>'

PROFILE = f'''<div style="padding:24px"><div style="background:#fff;border-radius:12px;box-shadow:0 0 0 1px var(--l1);overflow:hidden"><div style="height:90px;background:linear-gradient(#e9e9e6,#dcdcd8)"></div><div style="padding:0 22px 20px"><span class="av s64" style="width:84px;height:84px;margin-top:-42px;border:4px solid #fff;display:block">PN</span><div style="font-size:22px;font-weight:600;margin-top:8px;letter-spacing:-.02em">Priya Natarajan</div><div style="color:var(--t2);margin-top:2px">Founder at Glow Lab. Clean skincare for sensitive skin.</div><div style="color:var(--t4);font-size:13px;margin-top:6px">Austin, Texas</div><div style="display:flex;gap:8px;margin-top:14px"><span style="height:30px;padding:0 14px;border-radius:999px;background:#d9d9d6;display:inline-flex;align-items:center;font-size:13px;color:var(--t3)">Message</span><span style="height:30px;padding:0 14px;border-radius:999px;box-shadow:0 0 0 1px #cfcfcb;display:inline-flex;align-items:center;font-size:13px;color:var(--t3)">More</span></div></div></div><div style="margin-top:14px;background:#fff;border-radius:12px;box-shadow:0 0 0 1px var(--l1);padding:18px 22px"><b style="font-weight:600">Experience</b><div style="display:flex;gap:12px;margin-top:12px;align-items:center">{logo("GL","","s28")}<div><b style="font-weight:500">Founder</b><div style="font-size:13px;color:var(--t4)">Glow Lab, 2021 to now</div></div></div></div></div>'''

SIDE = f'''<div style="border-left:1px solid var(--l1);background:#fff;padding:16px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;align-items:center;gap:8px"><svg width="18" height="18"><use href="#mark"/></svg><b style="font-weight:600">omniscient</b></div><div style="display:flex;gap:12px;align-items:center">{av("PN","s40")}<div><b style="font-weight:500">Priya Natarajan</b><div style="font-size:12px;color:var(--t4)">Founder, Glow Lab</div></div></div><div style="display:flex;flex-direction:column;gap:2px">{"".join(f'<div style="display:grid;grid-template-columns:84px 1fr;gap:8px;padding:6px 0;font-size:13px"><span style="color:var(--t3)">{k}</span><span>{v}</span></div>' for k, v in [("Email", "priya@glowlab.co"), ("Company", "Glow Lab"), ("Owner", "Jonah Reyes"), ("Stage", badge("Discovery"))])}</div>{pb("Save to Omniscient","Plus")}<div style="border-top:1px solid var(--l1);padding-top:12px"><div style="font-size:12px;font-weight:500;color:var(--t4);margin-bottom:8px">Templates</div><div style="padding:10px 12px;border-radius:10px;box-shadow:0 0 0 1px var(--l1);font-size:13px;line-height:1.5"><b style="font-weight:500">Intro, founders</b><div style="color:var(--t3);margin-top:2px">Hi {{{{first_name}}}}, I saw Glow Lab just opened its first store...</div></div></div></div>'''

PAGES = [
# ------------------------------------------------------------------ Integrations
dict(slug='integrations',
  title='Integrations: one-click connections | Omniscient',
  desc='Connect Gmail, Outlook, your calendar, Zoom, Meet, Teams, Slack, HubSpot, Salesforce, Attio and Pipedrive in one click each. No API keys.',
  h1='Works with the tools you already use',
  lede='Connecting each one is a single click: sign in and approve. No API keys, no setup calls, no waiting on IT.',
  hero=vis(shell('', head('Settings', 'Apps', crumb='Settings', acts=False) + '<div class="dbody" style="padding:22px"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px">'
      + ''.join(app_tile(n, s) for n, s in [('Gmail', 1), ('Google Calendar', 1), ('Zoom', 1), ('Slack', 1), ('Outlook', 0), ('Google Meet', 0), ('Teams', 0), ('HubSpot', 1), ('Salesforce', 0), ('Attio', 0), ('Pipedrive', 0), ('LinkedIn', 1)])
      + '</div></div>', h=660), w=1360, a=acc('tr', 'Slack connected', 'Alerts go to #sales')),
  rows=[
    dict(k='Connect', h='Sign in and approve, that is it', p='Each tool connects with its own sign-in button: Connect Gmail, Add to Slack, Connect HubSpot. Omniscient handles the rest.',
      pts=['No API keys to paste', 'Disconnect any time', 'Each teammate connects their own inbox'],
      v=vis(win('<div style="padding:22px;display:flex;flex-direction:column;gap:12px">' + app_tile('Gmail', 1) + app_tile('Slack', 0) + app_tile('HubSpot', 0) + '</div>', 520))),
    dict(k='Import', h='Bring your old CRM along', p='Import companies, people and deals from HubSpot, Salesforce, Attio or Pipedrive, or a CSV file. Duplicates merge on the way in.',
      v=vis(win(f'<div class="card-h">{ic("Upload","i14")}Import from HubSpot<span class="r" style="font-weight:400;color:var(--t4)">Step 2 of 3</span></div><div style="padding:16px 18px;display:flex;flex-direction:column;gap:10px">' + ''.join(f'<div style="display:flex;align-items:center;gap:10px">{chip(i)}<span style="flex:1">{n}</span><span style="color:var(--t3)">{c}</span>{ic("Check","i14")}</div>' for i, n, c in [('Building', 'Companies', '1,284'), ('Users', 'Contacts', '4,910'), ('Handshake', 'Deals', '312'), ('StickyNote', 'Notes', '2,045')]) + f'</div><div class="card-f" style="padding:10px 18px">{pb("Start import","Upload")}</div>', 560), a=acc('br', 'Merged 38 duplicates', 'During import', undo=True))),
    dict(k='Alerts', h='Otto in Slack', p='Add Omniscient to Slack to ask Otto from any channel and get alerts when deals move, replies come in or a workflow needs you.',
      v=vis(win(f'<div style="padding:16px 18px;display:flex;gap:12px;align-items:flex-start"><span class="av s28" style="background:#0a0a0a;display:grid;place-items:center">{otto(18)}</span><div style="flex:1"><b style="font-weight:500">Otto</b> <span style="font-size:12px;color:var(--t4)">10:02 AM</span><div style="margin-top:4px;line-height:1.55"><b style="font-weight:500">Q1 wholesale</b> moved to Proposal. Claire asked for pricing by Friday.</div><div style="margin-top:10px;display:flex;gap:8px">{pb("Open record","ArrowUpRight")}</div></div></div>', 560))),
  ],
  extra=f'<section class="sec"><div class="wrap"><div class="mono-row"><span>Apps</span><span>2.0</span></div><div class="sec-head"><div><h2>Every app, one click</h2></div><div><p>Email, calendar, call notes, chat and your old CRM.</p></div></div>{intg_grid()}</div></section>',
  band=dict(k='Ecosystem', h='<span>Your tools, connected in minutes.</span> Your data, in one place.', pts=[
    ('Check', 'One click each', 'Sign in and approve. No keys, no tickets.'),
    ('Upload', 'Easy imports', 'HubSpot, Salesforce, Attio, Pipedrive or CSV.'),
    ('Code', 'Open for builders', 'An API, webhooks and an MCP server when you need them.')]),
  faq=[('Do I need an API key to connect a tool?', 'No. Each tool connects with its own sign-in. API keys are only for developers, under Settings > Apps > Developers.'),
       ('Can I import from my old CRM?', 'Yes. HubSpot, Salesforce, Attio and Pipedrive import in a few clicks, and CSV works for anything else.'),
       ('Does Omniscient post to LinkedIn?', 'Never. The Chrome extension only saves the profile you are looking at when you click.'),
       ('Can I disconnect an app?', 'Yes. Disconnect any app in Settings > Apps, and syncing stops right away.')],
  rel=['product/email-sync', 'product/mcp', 'developers']),

# ------------------------------------------------------------------ Chrome extension
dict(slug='product/chrome-extension',
  title='Chrome extension: save a profile in one click | Omniscient',
  desc='Save the profile, company or search results you are looking at to Omniscient in one click, and see their record beside the page.',
  h1='Save a profile in one click',
  lede='Looking at a person or company? Save them to Omniscient with one click and see their record right beside the page.',
  hero=vis(browser('linkedin.com/in/priya-natarajan', PROFILE, SIDE), w=1180, a=acc('tr', 'Saved Priya Natarajan', 'Email found, added to People')),
  rows=[
    dict(k='Save', h='The person, the company or a search', p='Save the profile you are on, their company, a list of search results, a company\'s people or a post\'s commenters. Up to 10 at a time, each on your click.',
      pts=['Profiles and companies', 'Search results and people lists', 'Up to 10 a click'],
      v=vis(win(f'<div class="card-h"><svg width="14" height="14"><use href="#mark"/></svg>Save from this page<span class="r" style="font-weight:400;color:var(--t4)">10 people</span></div><div class="card-b">{lrow("CR","Camille Roux","CEO, Blanc Studio")}{lrow("DM","Diego Marín","Founder, Corvo Eyewear")}{lrow("HM","Hana Mori","Co-founder, Oro Candle","In CRM")}{lrow("SW","Sam Whitley","Head of Ops, Halden Goods")}</div><div class="card-f">{pb("Save 9","Plus")}</div>', 560))),
    dict(k='See', h='Their record, beside the page', p='The side panel shows the person\'s record from your CRM: owner, stage, last email and notes, for the page you have open.',
      v=vis(win(SIDE.replace('border-left:1px solid var(--l1);', ''), 360), w=520)),
    dict(k='Write', h='Your template, ready to edit', p='Pick one of your team\'s templates and it lands in the message box with their name filled in. You read it, change it and send it yourself.',
      v=vis(win(f'<div style="padding:16px 18px"><div style="font-size:12px;color:var(--t3);margin-bottom:8px">Message to Priya</div><div style="min-height:110px;padding:12px 14px;border-radius:10px;box-shadow:var(--sh-input);line-height:1.6">Hi Priya, I saw Glow Lab just opened its first store in Austin. We help skincare brands roll out to retail. Open to a short call next week?</div><div style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;color:var(--t4)">{ic("Pencil","i14")}From template: Intro, founders</div></div>', 560))),
  ],
  band=dict(k='Chrome extension', h='<span>Your click, your message.</span> It never acts on its own.', pts=[
    ('Check', 'Only on your click', 'It saves what you are looking at, when you click.'),
    ('Ban', 'No automation', 'It never sends, scrolls, visits profiles or clicks for you.'),
    ('Pencil', 'You send', 'Templates go into the message box for you to edit and send.')]),
  faq=[('Does the extension send messages for me?', 'No. It puts your team\'s template in the message box. You read it, change it and send it yourself.'),
       ('Does it browse or scroll LinkedIn for me?', 'Never. It only acts on the page you have open, when you click. It never scrolls, pages, visits profiles or clicks for you.'),
       ('How many people can I save at once?', 'Up to 10 per click from search results, a company\'s people, a post\'s commenters or a reactions list.'),
       ('Which browsers does it support?', 'Chrome and other Chromium browsers like Edge, Arc and Brave.')],
  rel=['product/find-leads', 'product/clean-data', 'integrations']),

# ------------------------------------------------------------------ MCP
dict(slug='product/mcp',
  title='MCP: use Omniscient in Claude and ChatGPT | Omniscient',
  desc='Add Omniscient to Claude, ChatGPT, Cursor or any MCP client. Search records, read history and update your CRM from the assistant you already use.',
  h1='Your CRM, inside Claude and ChatGPT',
  lede='Add Omniscient to Claude, ChatGPT, Cursor or any MCP client. Search records, read history and update your CRM from the assistant you already use.',
  hero=vis(win(f'<div style="padding:14px 18px;border-bottom:1px solid var(--l1);display:flex;align-items:center;gap:10px"><span class="pi">{ic("Sparkles")}</span><b style="font-weight:500">Your assistant</b><span style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t3)"><svg width="14" height="14"><use href="#mark"/></svg>Omniscient connected</span></div>'
      + chat(um('Summarize where we are with Maison Verre and add a note that pricing went out today.'),
             f'<div style="display:flex;flex-direction:column;gap:8px;padding-left:4px">' + ''.join(f'<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;box-shadow:0 0 0 1px var(--l1);font-size:13px"><svg width="14" height="14"><use href="#mark"/></svg><b style="font-weight:500;font-family:var(--mono);font-size:12px">{t}</b><span style="color:var(--t3);flex:1">{d}</span>{ic("Check","i14")}</div>' for t, d in [('search', 'Maison Verre'), ('get_record', 'Company with history'), ('add_note', 'Pricing sent today')]) + '</div>',
             f'<div style="line-height:1.65;color:var(--t2)">Maison Verre is in <b style="font-weight:500;color:var(--t1)">Proposal</b> for $86,400. Claire wants 40 doors by March and cares more about timing than price. I added the note to the record.</div>', pad='22px 26px 26px'), 860), w=960, a=acc('tr', 'Note added', 'Maison Verre, by your assistant')),
  rows=[
    dict(k='Connect', h='One address, sign in and go', p='Add the Omniscient server to your MCP client, then sign in on the approve page. Or use an API key from Settings > Apps > Developers.',
      v=vis(code('<span class="c"># Add this server to Claude, ChatGPT, Cursor or any MCP client</span>\n<span class="s">https://app.tryomniscient.com/api/mcp</span>\n\n<span class="c"># Sign in with OAuth on the approve page,</span>\n<span class="c"># or send an API key:</span>\n<span class="k">Authorization:</span> <span class="s">Bearer omn_...</span>'), w=640)),
    dict(k='Tools', h='Read and write your CRM', p='Your assistant can search, read records and their history, list and describe fields, and add or update companies, people, opportunities and notes.',
      pts=['Search and read with history', 'Add and update records', 'Your workspace permissions apply'],
      v=vis(win(f'<div class="card-h">{ic("Code","i14")}Tools<span class="r" style="font-weight:400;color:var(--t4)">9</span></div><div style="padding:8px 14px 12px;display:grid;grid-template-columns:1fr 1fr;gap:6px">' + ''.join(f'<div style="padding:9px 10px;border-radius:8px;background:var(--a-hover);font:400 12px/1.2 var(--mono)">{t}</div>' for t in ['search', 'get_record', 'list_records', 'describe_fields', 'upsert_company', 'upsert_person', 'create_opportunity', 'update_record', 'add_note']) + '</div>', 520))),
    dict(k='Context', h='The same memory your team uses', p='Your assistant reads the same records, emails, calls and notes as Otto and your team, so answers match what is in the CRM.',
      v=vis(win(head('Building', 'Maison Verre', crumb='Companies', acts=False) + f'<div style="padding:10px 18px 14px">{tli("StickyNote","c-yel","<b>Note</b> from your assistant","Pricing sent today","Just now")}{tli("Video","","Call with <b>Claire, Luc</b>","Wholesale scoping, 32 min","Nov 14")}{tli("ArrowDownLeft","c-sky","<b>Claire</b> emailed you","Pricing for 40 doors?","Nov 13")}</div>', 600))),
  ],
  band=dict(k='MCP', h='<span>Work where you already work.</span> Your CRM follows.', pts=[
    ('Sparkles', 'Claude and ChatGPT', 'Plus Cursor and any client that speaks MCP.'),
    ('Check', 'Secure sign-in', 'OAuth on the approve page, or a key you can revoke.'),
    ('Orbit', 'One memory', 'The same records and history your team sees.')]),
  faq=[('What is MCP?', 'The Model Context Protocol lets assistants like Claude and ChatGPT use outside tools. Omniscient\'s MCP server lets them read and update your CRM.'),
       ('Which clients work?', 'Claude, ChatGPT, Cursor and any MCP client that supports remote servers.'),
       ('How does sign-in work?', 'Your client opens the approve page, you sign in to Omniscient and approve. You can also use an API key from Settings > Apps > Developers.'),
       ('Can I limit what an assistant can do?', 'Yes. API keys can be read-only or read and write, and you can revoke any key or connection at any time.')],
  rel=['developers', 'product/ask-otto', 'product/omniscience']),

# ------------------------------------------------------------------ Developers
dict(slug='developers',
  title='Developers: API keys and webhooks | Omniscient',
  desc='A REST API for companies, people, opportunities, notes and custom objects, plus webhooks for record and stage changes.',
  h1='Build on Omniscient',
  lede='A simple REST API for companies, people, opportunities, notes and custom objects, plus webhooks when records change.',
  hero=vis(f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">' + code('<span class="c"># List people at a company</span>\n<span class="k">curl</span> https://app.tryomniscient.com/api/v1/contacts?account_id=acc_42 \\\n  -H <span class="s">"Authorization: Bearer omn_..."</span>\n\n<span class="c"># Move an opportunity</span>\n<span class="k">curl</span> -X PATCH https://app.tryomniscient.com/api/v1/opportunities/opp_7 \\\n  -H <span class="s">"Authorization: Bearer omn_..."</span> \\\n  -d <span class="s">\'{"stage": "Proposal"}\'</span>') + code('{\n  <span class="k">"data"</span>: [\n    {\n      <span class="k">"id"</span>: <span class="s">"con_118"</span>,\n      <span class="k">"name"</span>: <span class="s">"Claire Duval"</span>,\n      <span class="k">"email"</span>: <span class="s">"claire@maisonverre.co"</span>,\n      <span class="k">"title"</span>: <span class="s">"Founder"</span>,\n      <span class="k">"account_id"</span>: <span class="s">"acc_42"</span>\n    }\n  ],\n  <span class="k">"limit"</span>: 50,\n  <span class="k">"offset"</span>: 0\n}') + '</div>', w=1200, cls='', a=acc('tr', '200 OK', 'GET /api/v1/contacts', lead=f'<span class="acc-ic">{ic("Code","i14")}</span>')),
  rows=[
    dict(k='Keys', h='API keys in Settings', p='Owners and admins make keys in Settings > Apps > Developers. Give each one a name and read or write access, and revoke it any time.',
      pts=['Read or read and write', 'Named keys, revoke any time', '600 requests a minute per key'],
      v=vis(win(head('Code', 'Developers', crumb='Settings', acts=False, extra=pb('New key', 'Plus')) + mini([mrow(chip('Code'), 'Zapier sync', 'omn_...4f2a, read and write', tm('Used today')), mrow(chip('Code'), 'Data warehouse', 'omn_...91c0, read', tm('Used 2h ago')), mrow(chip('Code'), 'Website form', 'omn_...7d13, write', tm('Used 1d ago'))]), 620))),
    dict(k='API', h='Every object, one pattern', p='Companies, people, opportunities, notes, activities, relationships, lists, owners and your custom objects, all with the same list, get, create and update calls.',
      v=vis(win(f'<div class="card-h">{ic("Code","i14")}Endpoints<span class="r" style="font-weight:400;color:var(--t4)">/api/v1</span></div><div style="padding:8px 14px 12px;display:grid;grid-template-columns:1fr 1fr;gap:6px">' + ''.join(f'<div style="padding:9px 10px;border-radius:8px;background:var(--a-hover);font:400 12px/1.2 var(--mono)">/{t}</div>' for t in ['accounts', 'contacts', 'opportunities', 'notes', 'activities', 'objects', 'relationships', 'lists', 'owners', 'webhooks']) + '</div>', 520))),
    dict(k='Webhooks', h='Know the moment something changes', p='Subscribe a URL to record and stage changes. Omniscient posts each event as JSON, so your other tools stay in step.',
      v=vis(code('<span class="c"># Events</span>\nrecord.created     record.updated\ncontact.created    contact.updated\nopportunity.created\nopportunity.stage_changed\n\n<span class="c"># Payload</span>\n{\n  <span class="k">"event"</span>: <span class="s">"opportunity.stage_changed"</span>,\n  <span class="k">"data"</span>: { <span class="k">"id"</span>: <span class="s">"opp_7"</span>, <span class="k">"stage"</span>: <span class="s">"Proposal"</span> }\n}'), w=640)),
  ],
  band=dict(k='Developers', h='<span>Simple to start,</span> ready for whatever you build.', pts=[
    ('Code', 'REST API', 'JSON in and out, the same pattern for every object.'),
    ('Bell', 'Webhooks', 'Record and stage changes, posted as they happen.'),
    ('Sparkles', 'MCP server', 'Let Claude, ChatGPT or Cursor use your CRM.')]),
  faq=[('Where do I get an API key?', 'Owners and admins make keys in Settings > Apps > Developers. Each key is read-only or read and write.'),
       ('How do I send the key?', 'Send it in the Authorization header as Bearer omn_ followed by your key.'),
       ('Are there rate limits?', 'Yes. Each key can make up to 600 requests a minute. Over that, you get a 429 with a Retry-After header.'),
       ('Can I use custom objects through the API?', 'Yes. The objects endpoints cover custom objects and their records, using the same calls as built-in ones.')],
  rel=['product/mcp', 'integrations', 'product/workflows']),
]
