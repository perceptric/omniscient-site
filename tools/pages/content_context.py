from ui import *

def rail(rows, people=None):
    r = ''.join(f'<div style="display:grid;grid-template-columns:104px 1fr;gap:8px;padding:6px;align-items:center"><span style="font-size:12px;color:var(--t3)">{k}</span><span style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">{v}</span></div>' for k, v in rows)
    pp = ''
    if people:
        pp = '<div style="font-size:12px;font-weight:500;color:var(--t4);padding:14px 6px 8px">People</div>' + ''.join(f'<div style="display:flex;align-items:center;gap:10px;padding:6px">{av(a)}<div><b style="font-weight:500;display:block">{n}</b><span style="font-size:12px;color:var(--t4)">{t}</span></div></div>' for a, n, t in people)
    return f'<div style="border-left:1px solid var(--l1);padding:14px">{"<div style=\"font-size:12px;font-weight:500;color:var(--t4);padding:4px 6px 8px\">General</div>"}{r}{pp}</div>'

def record(k, c, name, facts, deal, items, rows, people, ask):
    top = f'<div style="padding:20px 22px 8px;display:flex;gap:14px;align-items:center">{logo(k,c,"s40")}<div><div style="font-size:20px;font-weight:500;letter-spacing:-.02em">{name}</div><div class="facts">{facts}</div></div></div>'
    d = f'<div style="padding:6px 22px 4px"><div class="card" style="margin:0"><div class="card-b" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">{badge(deal[2])}<b style="font-weight:500;color:var(--t1)">{deal[0]}</b><span>{deal[1]}</span></div></div></div>' if deal else ''
    tl = f'<div style="padding:6px 22px 0">{"".join(items)}</div>'
    return (head('Building', name, crumb='Companies', acts=False, extra=f'{ib("ChevronUp")}{ib("ChevronDown")}<span class="ib">{otto()}</span>')
            + f'<div class="dbody" style="display:grid;grid-template-columns:1fr 300px"><div style="min-width:0">{top}{d}{tl}</div>{rail(rows, people)}</div>' + dock(ask))

LS_FACTS = f'<span>{ic("Globe","i13")}lumenskin.com</span><span>{ic("MapPin","i13")}Brooklyn, NY</span>{badge("Customer")}'

PAGES = [
# ------------------------------------------------------------------ Omniscience
dict(slug='product/omniscience',
  title='Omniscience: the context layer for every deal | Omniscient',
  desc='One memory behind every deal. Every email, call, meeting and note lands on the right record, and your team and Otto work from the same facts.',
  h1='One memory behind every deal',
  lede='Every email, call, meeting and note lands on the right record by itself. Your team and Otto work from the same facts, with the quote behind each one.',
  hero=vis(shell('companies', record('LS', 'g', 'Lumen Skin', LS_FACTS, ('Spring retail rollout', '$58,000', 'Negotiation'), [
      tli('ArrowDownLeft', 'c-sky', '<b>Amara</b> emailed you', 'Sending the PO today', '2h ago'),
      tli('Video', '', 'Call with <b>Amara, Ravi</b>', 'Retail rollout, 32 min, notes ready', 'Yesterday'),
      tli('Calendar', 'c-vio', 'Meeting with <b>Ravi</b>', 'Store list review', 'Nov 12'),
      tli('StickyNote', 'c-yel', '<b>Note</b> from Jonah', 'Brooklyn and Austin go first', 'Nov 10'),
      tli('Pencil', '', '<b>Otto</b> set <b>Stage</b> to Negotiation', '"Let\'s lock pricing this week."', 'Nov 9'),
    ], [('Domain', 'lumenskin.com'), ('Relationship', badge('Customer')), ('Industry', 'Skincare' + src_o()), ('ARR', '$48,000'), ('Employees', '48' + src_o()), ('Owner', av('JR', 's20') + ' Jonah Reyes')],
    [('AO', 'Amara Okafor', 'Founder and CEO'), ('RS', 'Ravi Shah', 'Head of Retail'), ('EB', 'Elle Brandt', 'COO')], 'Ask about Lumen Skin'), h=640), w=1360,
    a=acc('tr', 'Call notes added', 'Lumen Skin, 3 updates to review')),
  rows=[
    dict(k='Capture', h='Everything flows in, nothing to type', p='Connect Gmail or Outlook, your calendar and your call recorder once. From then on, every conversation lands on the right company and person.',
      pts=['Emails, meetings, calls and notes on one timeline', 'Duplicates merge, and you can undo any merge', 'Private threads stay private'],
      v=vis(f'''<div class="srcs app"><div class="src">{chip("Mail")}Gmail<small>214</small></div><div class="src">{chip("Calendar","c-vio")}Calendar<small>18</small></div><div class="src">{chip("Video")}Zoom notes<small>9</small></div><div class="src">{chip("Tag")}Slack<small>32</small></div></div>''' + win(head('Users', 'Amara Okafor', crumb='People', acts=False) + f'<div style="padding:10px 18px 12px">{tli("ArrowDownLeft","c-sky","<b>Amara</b> emailed you","Sending the PO today","2h ago")}{tli("Video","","Call with <b>Amara</b>","Retail rollout, 32 min","Yesterday")}{tli("Calendar","c-vio","Meeting with <b>Amara, Ravi</b>","Weekly sync","Nov 12")}</div>', 520), w=860, cls='vis-in row')),
    dict(k='Recall', h='Ask anything, get the answer with its source', p='Otto reads every email and call on the record. Ask a question and get a straight answer, with the quote and the date it came from.',
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('What did Lumen Skin agree to on pricing?'), om(p('Amara agreed to $14 a unit for the first 4,000 units, with free freight to the Brooklyn and Austin stores.'), card('Book', 'Sources', f'<div class="lrow">{chip("Video")}<b>Call, Nov 12</b><span>"Fourteen works if freight is on you."</span></div><div class="lrow">{chip("Mail","c-sky")}<b>Email, Nov 13</b><span>"Confirming 4,000 units at $14."</span></div>', right='2'))), 640))),
    dict(k='Trust', h='Every field shows where it came from', p='A field Otto filled carries his tag and the quote behind it. Fields from you or a sync say so too, so nobody wonders whether a number is right.',
      pts=['Otto suggests, you accept', 'Every change is in the history', 'Undo anything'],
      v=vis(win(f'<div class="card-h">{ic("Building","i14")}Lumen Skin<span class="r">{byotto()}</span></div>' + '<div style="padding:8px 12px 12px">' + ''.join(f'<div style="display:grid;grid-template-columns:120px 1fr auto;gap:10px;align-items:center;padding:10px 6px;border-bottom:1px solid var(--l2)"><span style="font-size:12px;color:var(--t3)">{k}</span><span style="display:flex;align-items:center;gap:6px">{v}</span><span style="font-size:12px;color:var(--t4)">{s}</span></div>' for k, v, s in [('Industry', 'Skincare' + src_o(), 'From their site'), ('ARR', '$48,000', 'Set by Jonah'), ('Employees', '48' + src_o(), '"We\'re 48 people now"'), ('Stage', badge('Negotiation'), 'From the Nov 9 call'), ('Owner', av('JR', 's20') + ' Jonah Reyes', 'HubSpot sync')]) + '</div>', 620))),
  ],
  band=dict(k='Context', h='<span>Your team and your agents</span> work from the same facts, every time.', pts=[
    ('Orbit', 'One record per company', 'People, opportunities, emails, calls and notes live together.'),
    ('Check', 'Proof on every fact', 'Each answer and update carries the quote it came from.'),
    ('Code', 'Open to your tools', 'Claude, ChatGPT and your own code read the same memory.')]),
  faq=[('What is Omniscience?', 'It is the memory behind Omniscient. Every email, meeting, call and note is saved on the right record, so you and Otto can look anything up later.'),
       ('Which sources does it read?', 'Gmail, Outlook, Google Calendar, Microsoft calendar, Zoom, Google Meet and Teams call notes, Slack, notes you write, and records you import from HubSpot, Salesforce, Attio or Pipedrive.'),
       ('Can I keep some emails private?', 'Yes. You choose which inboxes and threads are shared with the team, and private threads stay visible only to you.'),
       ('Does Otto make things up?', 'Otto answers from what is on the record and shows the quote behind each answer. If the record does not say, he tells you.')],
  rel=['product/ask-otto', 'product/email-sync', 'product/meetings']),

# ------------------------------------------------------------------ Data model
dict(slug='product/data-model',
  title='Data model: shape your CRM your way | Omniscient',
  desc='Custom objects, fields, stages and relationships. Shape Omniscient around how your team sells, then let Otto fill it in.',
  h1='A CRM shaped around how you sell',
  lede='Add the objects, fields and stages your team needs. Otto fills them in from your emails and calls, and every view stays in sync.',
  hero=vis(shell('companies', head('Building', 'Companies', '148', extra=f'{ib("FilterIcon")}{ib("Sliders")}') + tbl(['Company', 'Relationship', 'Industry', 'ARR', 'Region', 'Partner tier'], [
      [nm(logo('LS', 'g'), 'Lumen Skin'), badge('Customer'), 'Skincare' + src_o(), '$48,000', 'US East', badge('Gold', 't-amber')],
      [nm(logo('MV'), 'Maison Verre'), badge('Prospect'), 'Glassware' + src_o(), '–', 'Europe', '–'],
      [nm(logo('NB', 'l'), 'Nordhavn Botanics'), badge('Prospect'), 'Body care', '–', 'Nordics', '–'],
      [nm(logo('ST'), 'Sora Tea'), badge('Customer'), 'Beverages', '$74,000', 'US West', badge('Silver')],
      [nm(logo('BS', 'g'), 'Blanc Studio'), badge('Partner'), 'Furniture' + src_o(), '$31,500', 'Europe', badge('Gold', 't-amber')],
      [nm(logo('CE'), 'Corvo Eyewear'), badge('Prospect'), 'Eyewear', '–', 'Europe', '–'],
      [nm(logo('OC', 'l'), 'Oro Candle'), badge('Customer'), 'Home fragrance', '$36,000', 'US South', badge('Silver')],
      [nm(logo('HG', 'g'), 'Halden Goods'), badge('Prospect'), 'Gifting' + src_o(), '–', 'US West', '–']]), h=600), w=1360,
    a=acc('br', 'Field added', 'Partner tier on Companies')),
  rows=[
    dict(k='Objects', h='Add the objects your business runs on', p='Companies, People and Opportunities come ready. Add your own, like Partners, Stores or Projects, and link them to anything.',
      v=vis(win(f'<div class="card-h">{ic("TableIcon","i14")}Data model</div>' + mini([mrow(chip('Building'), 'Companies', '24 fields, 148 records'), mrow(chip('Users'), 'People', '19 fields, 312 records'), mrow(chip('Handshake'), 'Opportunities', '16 fields, 31 records'), mrow(chip('Folder', 'c-vio'), 'Partners', 'Custom, 9 fields, 22 records', badge('New', 't-blue')), mrow(chip('MapPin', 'c-sky'), 'Stores', 'Custom, 7 fields, 64 records')], pad='6px 18px 10px'), 600))),
    dict(k='Fields', h='Every field type you need', p='Text, numbers, money, dates, picklists, people and links to other records. Rename, reorder or delete any of them.',
      pts=['Picklists with your own colors', 'Relations between any two objects', 'Otto fills fields from emails and calls'],
      v=vis(win(f'<div class="card-h">{ic("Plus","i14")}New field<span class="r" style="font-weight:400;color:var(--t4)">Companies</span></div><div style="padding:16px 18px 18px;display:flex;flex-direction:column;gap:14px"><div><div style="font-size:12px;color:var(--t3);margin-bottom:6px">Name</div><div style="height:36px;border-radius:8px;box-shadow:var(--sh-input);display:flex;align-items:center;padding:0 12px">Partner tier</div></div><div><div style="font-size:12px;color:var(--t3);margin-bottom:8px">Type</div><div style="display:flex;flex-wrap:wrap;gap:6px">' + ''.join(f'<span class="badge{" t-blue" if t == "Select" else ""}" style="height:28px;padding:0 10px">{t}</span>' for t in ['Text', 'Number', 'Currency', 'Select', 'Multi-select', 'Date', 'Person', 'Relation', 'URL', 'Checkbox']) + f'</div></div><div><div style="font-size:12px;color:var(--t3);margin-bottom:8px">Options</div><div style="display:flex;gap:6px">{badge("Gold","t-amber")}{badge("Silver")}{badge("Bronze","t-red")}</div></div><div style="display:flex;justify-content:flex-end">{pb("Create field","Check")}</div></div>', 560))),
    dict(k='Views', h='See it as a table, a board or a record', p='Filter, sort and group any object. Drag opportunities across your own stages, and save the views your team uses every day.',
      v=vis(win(lanes([('Discovery', 12, [('Holiday gifting', 'HG', 'g', '$42,000', False), ('Retail kiosks', 'CE', '', '$48,000', False)]), ('Proposal', 7, [('Spring retail rollout', 'NB', 'l', '$58,000', True), ('Wholesale portal', 'BS', 'g', '$31,500', False)]), ('Negotiation', 5, [('Café partner program', 'ST', '', '$74,000', False)]), ('Won', 9, [('Q1 wholesale', 'MV', '', '$86,400', False), ('Annual plan', 'OC', 'l', '$36,000', False)])]), 720), w=800)),
  ],
  band=dict(k='Data model', h='<span>Your process, your words.</span> Otto keeps every field current.', pts=[
    ('Folder', 'Custom objects', 'Model partners, stores, projects or anything else you track.'),
    ('Branch', 'Relationships', 'Link records both ways and see them on each side.'),
    ('Sparkles', 'Filled by Otto', 'Fields fill in from calls and emails, with the quote as proof.')]),
  faq=[('Can I add my own objects?', 'Yes. Owners and admins can add custom objects in Settings, give them fields, and link them to companies, people or opportunities.'),
       ('Which field types are there?', 'Text, number, currency, select, multi-select, date, person, relation, email, phone, URL and checkbox.'),
       ('Will Otto fill in my custom fields?', 'Yes. Give a field a clear name and Otto suggests values from your emails and calls, each with the quote it came from.'),
       ('Can I change or delete fields later?', 'Yes. Rename, reorder, change options or delete any field you made.')],
  rel=['product/clean-data', 'product/omniscience', 'product/workflows']),

# ------------------------------------------------------------------ Clean data
dict(slug='product/clean-data',
  title='Clean data: duplicates merged, blanks filled | Omniscient',
  desc='Omniscient merges duplicates, fills missing emails and company facts, and notices job changes. Undo anything.',
  h1='Clean data without the cleanup',
  lede='Duplicates merge, missing emails and company facts fill in, and job changes show up on their own. You can undo any of it.',
  hero=vis(shell('people', head('Users', 'People', '312', extra=ib('FilterIcon')) + tbl(['Name', 'Email', 'Title', 'Company', 'Last touch'], [
      [nm(av('AO'), 'Amara Okafor'), 'amara@lumenskin.com', 'Founder and CEO', nm(logo('LS', 'g', 's16'), 'Lumen Skin'), '2h ago'],
      [nm(av('CD'), 'Claire Duval'), 'claire@maisonverre.co' + src_o(), 'Founder', nm(logo('MV', '', 's16'), 'Maison Verre'), 'Today'],
      [nm(av('TL'), 'Theo Lindqvist'), 'theo@nordhavn.co', 'Co-founder', nm(logo('NB', 'l', 's16'), 'Nordhavn Botanics'), '4d ago'],
      [nm(av('MK'), 'Marcus Kell'), 'marcus@soratea.com' + src_o(), 'Café partnerships', nm(logo('ST', '', 's16'), 'Sora Tea'), '2h ago'],
      [nm(av('CR'), 'Camille Roux'), 'camille@blanc.studio', 'CEO', nm(logo('BS', 'g', 's16'), 'Blanc Studio'), '6h ago'],
      [nm(av('DM'), 'Diego Marín'), 'diego@corvo.eu' + src_o(), 'Founder', nm(logo('CE', '', 's16'), 'Corvo Eyewear'), '1d ago'],
      [nm(av('HM'), 'Hana Mori'), 'hana@orocandle.com', 'Co-founder', nm(logo('OC', 'l', 's16'), 'Oro Candle'), '5d ago'],
      [nm(av('SW'), 'Sam Whitley'), 'sam@haldengoods.com' + src_o(), 'Head of Ops', nm(logo('HG', 'g', 's16'), 'Halden Goods'), '1d ago']]), h=600), w=1360,
    a=acc('tr', 'Found 4 emails', 'Added to People', undo=True)),
  rows=[
    dict(k='Merge', h='Duplicates merge themselves', p='When the same company or person shows up twice, Omniscient merges them and keeps every email, call and note. One click undoes it.',
      v=vis(f'<div style="display:flex;flex-direction:column;gap:12px;align-items:stretch">' + win(f'<div style="padding:14px 16px;display:flex;align-items:center;gap:12px">{logo("LS","g","s28")}<div style="flex:1"><b style="font-weight:500">Lumen Skin Inc.</b><div style="font-size:12px;color:var(--t4)">lumenskin.com, 3 people</div></div>{ic("ArrowDownLeft","i14")}</div><div style="padding:14px 16px;border-top:1px solid var(--l2);display:flex;align-items:center;gap:12px">{logo("LS","g","s28")}<div style="flex:1"><b style="font-weight:500">Lumen Skin</b><div style="font-size:12px;color:var(--t4)">lumenskin.com, 5 people, 214 emails</div></div>{badge("Kept","t-green")}</div>', 560) + toast('Merged <b style="font-weight:500">2 duplicates</b>') + '</div>', w=640)),
    dict(k='Fill', h='Missing emails and facts fill in', p='Omniscient finds work emails for people you save and fills company facts like industry, size and location. Each one is tagged so you know where it came from.',
      pts=['Work emails for saved people', 'Industry, size and location for companies', 'Tagged with its source'],
      v=vis(f'<div style="display:flex;flex-direction:column;gap:12px">' + toast('Finding emails for 6 people', undo=False, load=True) + win(f'<div class="card-h">{ic("Users","i14")}Lead list<span class="r" style="font-weight:400;color:var(--t4)">6 people</span></div><div class="card-b">{lrow("PN","Priya Natarajan","priya@glowlab.co","Found")}{lrow("CR","Camille Roux","camille@blanc.studio","Found")}{lrow("DM","Diego Marín","diego@corvo.eu","Found")}{lrow("SW","Sam Whitley","Searching")}</div>', 600) + '</div>', w=680)),
    dict(k='Watch', h='Job changes, noticed for you', p='When a champion moves to a new company, Omniscient notices and shows you both records. It is often the warmest lead you have.',
      v=vis(win(f'<div class="card-h">{ic("Briefcase","i14")}Job changes<span class="r" style="font-weight:400;color:var(--t4)">This week</span></div><div class="card-b">' + f'<div class="lrow">{av("RS")}<b>Ravi Shah</b><span>Lumen Skin to Corvo Eyewear</span><em>New role</em></div><div class="lrow">{av("EB")}<b>Elle Brandt</b><span>Now COO at Lumen Skin</span><em>Promoted</em></div><div class="lrow">{av("LM")}<b>Luc Martin</b><span>Maison Verre to Blanc Studio</span><em>New role</em></div>' + f'</div><div class="card-f">{pb("Save new records","Plus")}</div>', 600))),
  ],
  band=dict(k='Clean data', h='<span>A CRM people trust</span> is one nobody has to clean.', pts=[
    ('Check', 'Duplicates merged', 'Companies and people merge with their full history kept.'),
    ('Undo', 'Undo anything', 'Every merge and fill can be reversed in one click.'),
    ('Ban', 'Privacy first', 'Data you remove is purged, and nothing comes from LinkedIn in the background.')]),
  faq=[('How does merging work?', 'Omniscient matches records by domain, email and name. It keeps every email, call, note and field from both, and you can undo the merge.'),
       ('Where do found emails come from?', 'From email finding on our lead data provider. Each found email is tagged, and you choose which people to save.'),
       ('Does it read LinkedIn?', 'No. Omniscient never reads LinkedIn in the background. The Chrome extension only saves the profile you are looking at when you click.'),
       ('What happens to my imported data?', 'Imports from HubSpot, Salesforce, Attio, Pipedrive or CSV go through the same merge and fill, so you start clean.')],
  rel=['product/data-model', 'product/find-leads', 'product/chrome-extension']),

# ------------------------------------------------------------------ Meetings
dict(slug='product/meetings',
  title='Meetings: notes and next steps from every call | Omniscient',
  desc='A prep brief before every meeting, notes after every call, and record updates with the quote behind each one.',
  h1='Every call ends with the CRM up to date',
  lede='A one-page brief before each meeting. Notes, next steps and record updates after it, each with the quote it came from.',
  hero=vis(shell('meetings', head('Calendar', 'Wholesale scoping call', crumb='Meetings', acts=False, extra=badge('Past')) + f'''<div class="dbody" style="display:grid;grid-template-columns:1fr 320px"><div style="min-width:0;padding:18px 22px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">{logo("MV","","s28")}<b style="font-weight:500">Maison Verre</b><span style="color:var(--t3)">Nov 14, 32 min</span><span style="display:flex;margin-left:auto">{av("CD")}{av("LM")}{av("JR")}</span></div>
      <div style="margin-top:18px;font-weight:500">Summary {byotto()}</div>
      <p style="margin:8px 0 0;line-height:1.6;color:var(--t2)">Claire wants 40 doors by March. Timing matters more than price. She signs off herself, with Luc handling freight to the UK stores.</p>
      <div style="margin-top:18px;font-weight:500">Record updates to review <span style="color:var(--t4);font-weight:400">3</span></div>
      <div style="margin-top:6px;border-radius:12px;box-shadow:0 0 0 1px var(--l1)">{urow("Set <b>Stage</b> to <b>Proposal</b>", "Send us the proposal and we'll take it from there.")}{urow("Set <b>Amount</b> to <b>$86,400</b>", "Around $80 to $90k for the first order.")}{urow("Set <b>Next step</b> to <b>Send pricing by Friday</b>", "Can we have pricing before Friday?")}</div>
    </div><div style="border-left:1px solid var(--l1);padding:16px">
      <div style="font-size:12px;font-weight:500;color:var(--t4);padding:2px 4px 10px">Transcript</div>
      {"".join(f'<div style="display:flex;gap:10px;padding:8px 4px">{av(a,"s20")}<div><b style="font-weight:500;font-size:12px">{n}</b><div style="font-size:13px;line-height:1.5;color:var(--t2)">{t}</div></div></div>' for a, n, t in [("CD","Claire","We need 40 doors live by March."),("JR","Jonah","Is price the main thing for you?"),("CD","Claire","Timing over price, honestly."),("LM","Luc","I'll handle freight to the UK stores."),("CD","Claire","Send us the proposal and we'll take it from there.")])}
    </div></div>''', h=620), w=1360, a=acc('bl', 'Notes ready', 'Wholesale scoping call, 32 min', lead=f'<span class="acc-ic">{ic("Video","i14")}</span>')),
  rows=[
    dict(k='Before', h='Walk in with a one-page brief', p='Before each meeting, Otto writes a short brief from every email, call and note on the record: who is coming, what they care about and what to ask.',
      v=vis(win(f'<div style="padding:16px 18px"><div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--t3)">{byotto()}Brief for Pricing review, Dec 2</div><p style="margin:12px 0 0;line-height:1.65">Claire signs off herself. Budget is $80k to $90k. Freight to the UK stores is still open, so ask Luc about timing.</p><div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">' + ''.join(f'<div style="display:flex;gap:8px;align-items:flex-start;font-size:13px;color:var(--t2)">{ic("ChevronRight","i12")}<span>{t}</span></div>' for t in ['Last call: timing matters more than price', 'Open question: UK freight', 'Next step: pricing by Friday']) + '</div></div>', 560))),
    dict(k='After', h='Notes and next steps, written for you', p='Omniscient joins through Zoom, Google Meet or Teams notes. When the call ends, the summary, action items and transcript are on the record.',
      pts=['Summary and action items', 'Searchable transcript', 'Shared with the right people'],
      v=vis(win(head('Calendar', 'Meetings', '18') + mini([mrow(datetile('NOV', '18'), 'Café partner review', 'Sora Tea, notes ready', tm('10:00 AM')), mrow(datetile('NOV', '20'), 'Intro with Ops', 'Halden Goods, brief ready', tm('2:30 PM')), mrow(datetile('NOV', '21'), 'Kiosk pricing', 'Corvo Eyewear, brief ready', tm('11:00 AM')), mrow(datetile('DEC', '2'), 'Pricing review', 'Maison Verre, brief ready', tm('9:00 AM'))]), 600))),
    dict(k='Update', h='The record updates itself, with proof', p='Otto proposes changes to stage, amount and next step, each with the exact quote behind it. You accept or skip, and the record is current.',
      v=vis(win(head('Calendar', 'Wholesale scoping call', acts=False, extra=badge('Past')) + f'<div style="padding:14px 16px 4px;font-weight:500">Record updates to review <span style="color:var(--t4);font-weight:400">2</span></div>' + urow('Set <b>Next step</b> to <b>Send pricing by Friday</b>', 'Can we have pricing before Friday?') + urow('Add <b>Luc Martin</b> as <b>Freight contact</b>', "I'll handle freight to the UK stores."), 620), a=acc('tr', 'Record updated', 'Stage moved to Proposal'))),
  ],
  band=dict(k='Meetings', h='<span>Be fully present on the call.</span> Otto takes it from there.', pts=[
    ('Calendar', 'Prep briefs', 'A one-page brief lands before every external meeting.'),
    ('Video', 'Call notes', 'Summary, action items and transcript after every call.'),
    ('Pencil', 'Updates with quotes', 'Stage, amount and next step update with your OK.')]),
  faq=[('Which meeting tools work?', 'Zoom, Google Meet and Microsoft Teams. Connect them once, and calls on your calendar get notes.'),
       ('Do I have to accept every update?', 'Yes. Otto suggests each change with the quote behind it. Nothing changes on the record until you accept.'),
       ('Who can see meeting notes?', 'Notes follow the record. Teammates who can see the company can see its meeting notes.'),
       ('Can Otto prep me for meetings with new people?', 'Yes. For people not yet in your CRM, the brief uses their company, past emails and what you asked Otto to research.')],
  rel=['product/omniscience', 'product/email-sync', 'product/ask-otto']),

# ------------------------------------------------------------------ Email sync
dict(slug='product/email-sync',
  title='Email sync: every thread on the right record | Omniscient',
  desc='Connect Gmail or Outlook once. Every thread lands on the right company and person, and replies that need you rise to the top.',
  h1='Your inbox, on the right record',
  lede='Connect Gmail or Outlook once. Every thread lands on the right company and person, and the replies that need you rise to the top.',
  hero=vis(shell('emails', head('Mail', 'Emails', '2,184', extra=f'{ib("FilterIcon")}') + mini([
      mrow(av('CD'), 'Claire Duval', 'Pricing for 40 doors?', badge('Needs reply', 't-yellow')),
      mrow(av('TL'), 'Theo Lindqvist', 'Re: Order minimums', badge('Needs reply', 't-yellow')),
      mrow(av('AO'), 'Amara Okafor', 'Sending the PO today', tm('2h ago')),
      mrow(av('DM'), 'Diego Marín', 'Kiosk sizes attached', tm('1d ago')),
      mrow(av('CR'), 'Camille Roux', 'Portal mockups', tm('6h ago')),
      mrow(av('MK'), 'Marcus Kell', 'Café rollout dates', tm('2d ago')),
      mrow(av('HM'), 'Hana Mori', 'Renewal for spring scents', tm('5d ago'))], pad='8px 22px'), h=560), w=1360,
    a=acc('tr', '2 emails to answer', 'Claire and Theo are waiting', lead=f'<span class="acc-ic">{ic("Mail","i14")}</span>')),
  rows=[
    dict(k='Connect', h='One click for Gmail or Outlook', p='Sign in with Google or Microsoft. Past and new threads sync, and each one lands on the right company and person on its own.',
      pts=['Gmail and Outlook', 'Past threads come along', 'Choose what the team can see'],
      v=vis(win(f'<div style="padding:22px;display:flex;flex-direction:column;gap:12px">' + ''.join(f'<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;box-shadow:0 0 0 1px var(--l1)">{chip(i)}<b style="font-weight:500;flex:1">{n}</b>{r}</div>' for i, n, r in [('Mail', 'Gmail', badge('Connected', 't-green')), ('Mail', 'Outlook', pb('Connect', 'Plus')), ('Calendar', 'Google Calendar', badge('Connected', 't-green'))]) + '</div>', 520))),
    dict(k='Focus', h='Replies that need you, first', p='Omniscient spots the emails waiting on you and puts them at the top. Everything else stays on the record, ready when you need it.',
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Emails to answer<span class="r" style="font-weight:400;color:var(--t4)">2</span></div>' + mini([mrow(av('CD'), 'Claire Duval', 'Pricing for 40 doors?', badge('Needs reply', 't-yellow')), mrow(av('TL'), 'Theo Lindqvist', 'Re: Order minimums', badge('Needs reply', 't-yellow')), mrow(av('RS'), 'Ravi Shah', 'Store list attached', tm('1d'))], pad='4px 18px 10px'), 580))),
    dict(k='Reply', h='Drafts in your voice, sent by you', p='Otto drafts a reply from everything on the record, in your tone. You read it, change it and send it from your own inbox.',
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Email draft<span class="r">{byotto()}</span></div><div class="card-b" style="padding:16px 18px;font-size:14px;line-height:1.6"><div style="color:var(--t3)">To claire@maisonverre.co</div><div style="font-weight:600;margin:2px 0 10px">Re: Pricing for 40 doors?</div><div>Hi Claire, for 40 doors we can hold $14 a unit and ship to the UK stores in February. I can send the proposal today.</div><div style="margin-top:10px">Jonah</div></div><div class="card-f" style="padding:10px 18px">{pb("Open in Gmail","Mail")}{ib("Copy")}</div>', 600))),
  ],
  band=dict(k='Email sync', h='<span>Never dig for a thread again.</span> It is on the record.', pts=[
    ('Mail', 'Every thread captured', 'Past and new emails land on the right company and person.'),
    ('Bell', 'Emails to answer', 'Replies waiting on you are always at the top.'),
    ('Pencil', 'Drafts you send', 'Otto drafts, you read and send from your inbox.')]),
  faq=[('Does Omniscient send email for me?', 'No. Otto writes drafts. You open them in Gmail or Outlook, change what you want and send them yourself.'),
       ('Can I keep personal emails out?', 'Yes. Choose which threads are shared. Personal and private threads stay visible only to you.'),
       ('How far back does it sync?', 'Past threads with people and companies in your CRM come along when you connect, then new ones sync as they arrive.'),
       ('Does it work with shared inboxes?', 'Yes. Each teammate connects their own inbox, and threads with the same company show up on one record.')],
  rel=['product/meetings', 'product/omniscience', 'product/workflows']),
]
