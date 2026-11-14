from ui import *

def leads_card(rows, n, save):
    return card('Radar', 'Leads', ''.join(rows), right=f'<span style="font-weight:400;color:var(--t4)">{n}</span>', foot=pb(save) + ib('X'))

PAGES = [
# ------------------------------------------------------------------ Ask Otto
dict(slug='product/ask-otto',
  title='Ask Otto: ask your CRM anything | Omniscient',
  desc='Otto is the agent built into Omniscient. Ask a question, find leads, prep a meeting or update a record. He shows his sources and asks before he changes anything.',
  h1='Ask your CRM anything',
  lede='Otto is the agent inside Omniscient. Ask a question, find leads, prep for a meeting or update a record. He shows his sources and asks before he changes anything.',
  hero=vis(shell('ask', head('Sparkles', 'Ask Otto', acts=False) + '<div class="dbody" style="padding:26px 40px 110px"><div style="max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:20px">'
      + um('Which deals need attention this week?')
      + om(p('Three deals have gone quiet or have a date coming up.'), card('Handshake', 'Need attention', f'<div class="lrow">{logo("NB","l","s28")}<b>Spring retail rollout</b><span>No reply in 6 days</span><em>$58,000</em></div><div class="lrow">{logo("CE","","s28")}<b>Retail kiosks</b><span>Pricing review Nov 21</span><em>$48,000</em></div><div class="lrow">{logo("MV","","s28")}<b>Q1 wholesale</b><span>Pricing promised by Friday</span><em>$86,400</em></div>', right='<span style="font-weight:400;color:var(--t4)">3</span>'))
      + um('Draft a follow-up to Theo')
      + om(p('Here is a draft based on your last call. Open it in Gmail to send.'))
      + f'</div></div><div class="dock" style="width:min(680px,86%)"><span>Ask anything, or type / for skills</span><span class="sp"></span><span class="ib">{ic("Plus")}</span><span class="send">{ic("ArrowUp")}</span></div>', h=660), w=1360,
    a=acc('tr', 'Draft ready', 'Re: Spring retail rollout', lead=f'<span class="acc-ic">{ic("Mail","i14")}</span>')),
  rows=[
    dict(k='Answers', h='Straight answers, with the source', p='Ask about any account, deal or person. Otto reads every email, call and note on the record, and shows the quote behind each answer.',
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('Who signs off at Maison Verre?'), om(p('Claire Duval signs off herself. Luc Martin handles freight.'), card('Book', 'Sources', f'<div class="lrow">{chip("Video")}<b>Call, Nov 14</b><span>"I sign off on this myself."</span></div><div class="lrow">{chip("Mail","c-sky")}<b>Email, Nov 15</b><span>"Luc will sort the UK freight."</span></div>', right='2'))), 640))),
    dict(k='Actions', h='He asks before he changes anything', p='Ask Otto to update a deal, add a person or log a note. He shows a card with each change, and nothing is saved until you click.',
      pts=['A card for every change', 'Undo after saving', 'Every change is in the history'],
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('Move Maison Verre to Proposal and set the amount to $86,400'), om(card('Pencil', 'Update Q1 wholesale', f'<div style="display:grid;grid-template-columns:90px 1fr;gap:8px;font-size:13px"><span style="color:var(--t3)">Stage</span><span>Discovery {ic("ChevronRight","i12")} {badge("Proposal")}</span><span style="color:var(--t3)">Amount</span><span>– {ic("ChevronRight","i12")} $86,400</span></div>', foot=pb('Save') + ib('X')))), 640))),
    dict(k='Anywhere', h='In the app, in Slack, by voice', p='Ask from Ask Otto, the bar on any record, or Slack. Talk instead of typing when you are between meetings.',
      v=vis(win(f'<div style="padding:16px 18px;display:flex;gap:12px;align-items:flex-start">{av("JR")}<div style="flex:1"><b style="font-weight:500">Jonah Reyes</b> <span style="font-size:12px;color:var(--t4)">9:41 AM</span><div style="margin-top:4px">@Otto what is the latest with Sora Tea?</div></div></div><div style="padding:4px 18px 18px;display:flex;gap:12px;align-items:flex-start"><span class="av s28" style="background:#0a0a0a;display:grid;place-items:center">{otto(18)}</span><div style="flex:1"><b style="font-weight:500">Otto</b> <span style="font-size:12px;color:var(--t4)">9:41 AM</span><div style="margin-top:4px;line-height:1.55">Marcus confirmed the café rollout for 12 stores. Pricing review is Nov 18 at 10:00 AM. Open item: monthly order size.</div></div></div>', 600, 'padding-top:4px'))),
  ],
  band=dict(k='Otto', h='<span>An agent that does the busy work</span> and leaves the decisions to you.', pts=[
    ('Check', 'You stay in charge', 'Confirm cards before any change, drafts you send yourself.'),
    ('Book', 'Grounded in your data', 'Answers come from your records, with quotes and dates.'),
    ('Box', 'Skills for every job', 'Find leads, prep meetings, wrap up calls and more.')]),
  faq=[('Who is Otto?', 'Otto is the agent built into Omniscient. He reads your records, emails and calls, and helps you find leads, prep meetings, draft emails and keep records up to date.'),
       ('Does Otto send emails on his own?', 'No. Otto writes drafts. You open them in Gmail or Outlook and send them yourself.'),
       ('Can Otto change my data?', 'Only with your OK. Each change shows as a card, and nothing is saved until you click. You can undo after.'),
       ('Can I use Otto in Slack?', 'Yes. Add Omniscient to Slack and mention @Otto in any channel or message him directly.')],
  rel=['product/skills', 'product/find-leads', 'product/knowledge']),

# ------------------------------------------------------------------ Find leads
dict(slug='product/find-leads',
  title='Find leads: lead lists, just by asking | Omniscient',
  desc='Describe the buyer you want in plain words. Otto builds a lead list with emails, finds people at a company, or finds lookalikes of your best customers.',
  h1='Lead lists, just by asking',
  lede='Describe the buyer you want in plain words. Otto searches millions of people and companies, shows why each one fits, and saves the ones you pick.',
  hero=vis(shell('ask', head('Sparkles', 'Ask Otto', acts=False) + '<div class="dbody" style="padding:26px 40px 110px"><div style="max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:20px">'
      + um('Founders of DTC beauty brands in the US moving into retail', skill='Find leads')
      + om(p('Founders and CEOs at US beauty brands with a recent retail move.'), p('<b style="font-weight:500">5 leads</b>, 4 with a work email', 'color:var(--t3);font-size:13px;margin-top:-4px'), leads_card([lrow('AO', 'Amara Okafor', 'Founder, Lumen Skin', 'In CRM'), lrow('TL', 'Theo Lindqvist', 'Co-founder, Nordhavn', ''), lrow('PN', 'Priya Natarajan', 'Founder, Glow Lab', ''), lrow('CR', 'Camille Roux', 'CEO, Blanc Studio', ''), lrow('HM', 'Hana Mori', 'Co-founder, Oro Candle', '')], '5 found', 'Save 4'))
      + f'</div></div><div class="dock" style="width:min(680px,86%)"><span>Ask anything, or type / for skills</span><span class="sp"></span><span class="ib">{ic("Plus")}</span><span class="send">{ic("ArrowUp")}</span></div>', h=660), w=1360,
    a=acc('tr', 'Saved 4 people', 'Added to People, emails found')),
  rows=[
    dict(k='Describe', h='One sentence in, a lead list out', p='Say who you want to reach: role, industry, size, place, recent moves. Otto turns it into a search and shows the plan in one line before he runs it.',
      pts=['Plain words, no filters to learn', 'Why each lead fits', 'People already in your CRM are marked'],
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('Heads of operations at gifting companies in Colorado, 20 to 200 people', skill='Find leads'), om(p('Operations leaders at gifting and corporate gift companies in Colorado with 20 to 200 people.'), p('<b style="font-weight:500">3 leads</b>, all with a work email', 'color:var(--t3);font-size:13px;margin-top:-4px'), leads_card([lrow('SW', 'Sam Whitley', 'Head of Ops, Halden Goods'), lrow('IB', 'Inès Bernard', 'Operations, Peak Parcel'), lrow('MK', 'Marcus Kell', 'COO, Summit Box')], '3 found', 'Save 3'))), 640))),
    dict(k='Accounts', h='People at a company, and lookalikes', p='Name a company and get the people you should talk to. Point at your best customers and get companies that look like them.',
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('Companies like Lumen Skin and Oro Candle', skill='Find leads'), om(p('DTC home and beauty brands, 20 to 100 people, selling in stores.'), card('Building', 'Companies', ''.join(lrow_co(k, c, n, s) for k, c, n, s in [('GL', '', 'Glow Lab', 'Skincare, 34 people'), ('WM', '', 'Wildmoor', 'Home goods, 52 people'), ('ST', '', 'Sora Tea', 'Beverages, 61 people', )]), right='<span style="font-weight:400;color:var(--t4)">3 found</span>', foot=pb('Save 3')))), 640))),
    dict(k='Save', h='Saved on your click, with emails', p='Pick the leads you want. They land in People and Companies with work emails filled, and job changes are watched from then on.',
      v=vis(f'<div style="display:flex;flex-direction:column;gap:12px">' + toast('Saved <b style="font-weight:500">4 people</b> to People') + toast('Finding emails for 4 people', undo=False, load=True) + win(head('Users', 'People', '316', acts=False) + mini([mrow(av('TL'), 'Theo Lindqvist', 'theo@nordhavn.co', badge('New', 't-blue')), mrow(av('PN'), 'Priya Natarajan', 'priya@glowlab.co', badge('New', 't-blue')), mrow(av('CR'), 'Camille Roux', 'camille@blanc.studio', badge('New', 't-blue'))]), 600) + '</div>', w=680)),
  ],
  band=dict(k='Find leads', h='<span>Your next customers are out there.</span> Ask for them.', pts=[
    ('Radar', 'Lead lists', 'Describe the buyer and get a list with emails.'),
    ('Building', 'Lookalike companies', 'Find more companies like your best customers.'),
    ('Briefcase', 'Job changes', 'Know when a champion moves to a new company.')]),
  faq=[('Where do the leads come from?', 'From a data provider with millions of people and companies. Results are checked and shown with why each one fits.'),
       ('Does Otto save leads on his own?', 'No. Otto shows the list, and you pick who to save. Nothing lands in your CRM without your click.'),
       ('Does it use LinkedIn?', 'No. Otto never reads LinkedIn in the background. To save someone from LinkedIn, use the Chrome extension on their profile.'),
       ('How many leads can I find?', 'Lead searches use credits from your plan. Pro and Business plans include more each month.')],
  rel=['product/clean-data', 'product/ask-otto', 'product/chrome-extension']),

# ------------------------------------------------------------------ Skills
dict(slug='product/skills',
  title='Skills: teach Otto how your team works | Omniscient',
  desc='Skills are how Otto does a job. Use ready skills for leads, meeting prep and call wrap-ups, or write your own for your team and yourself.',
  h1='Teach Otto how your team works',
  lede='Skills are how Otto does a job. Type / to pick one, or let Otto choose. Use ours, or write your own for your team and yourself.',
  hero=vis(shell('s', head('Box', 'Skills', '15') + mini([
      mrow(chip('Box'), 'Find leads', 'Build a lead list from one sentence', badge('System')),
      mrow(chip('Box'), 'Research an account', 'A short profile with sources', badge('System')),
      mrow(chip('Box'), 'Prep for a meeting', 'A one-page brief before the call', badge('System')),
      mrow(chip('Box'), 'Wrap up a call', 'Recap, updates and a follow-up draft', badge('System')),
      mrow(chip('Box', 'c-vio'), 'Qualify an inbound lead', 'Our questions for new demo requests', badge('Workspace', 't-violet')),
      mrow(chip('Box', 'c-vio'), 'Retail pitch', 'How we pitch store rollouts', badge('Workspace', 't-violet')),
      mrow(chip('Box', 'c-sky'), 'My Friday review', 'Deals I own that moved this week', badge('Personal', 't-blue'))], pad='8px 22px'), h=660), w=1360,
    a=acc('tr', 'Skill saved', 'Qualify an inbound lead')),
  rows=[
    dict(k='Pick', h='Type / and pick the job', p='Every skill has a name and says when to use it. Type / in Ask Otto to choose one, or just ask and Otto picks the right skill himself.',
      v=vis(win(slash('System skills', ['Find leads', 'Prep for a meeting', 'Wrap up a call', 'Review the pipeline', 'Research an account']), 420), w=600)),
    dict(k='Write', h='Write skills in plain words', p='A skill is a short page of instructions: when to use it and the steps to follow. Write one for your whole team, or a personal one just for you.',
      pts=['System, Workspace and Personal skills', 'Owners and admins edit Workspace skills', 'Standard Agent Skills format'],
      v=vis('<pre class="code"><span class="c">---</span>\n<span class="k">name:</span> <span class="s">Qualify an inbound lead</span>\n<span class="k">description:</span> <span class="s">Use it when a new demo request comes in.</span>\n<span class="c">---</span>\n\n1. Research the company and the person.\n2. Check size, region and what they sell.\n3. Score fit from 1 to 5 with one line why.\n4. Suggest the owner and a first email draft.</pre>', w=640)),
    dict(k='Trust', h='Skills keep the rules', p='Every skill works inside Otto\'s rules: a card before any change, drafts you send yourself, and nothing from LinkedIn.',
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('New demo request from Glow Lab', skill='Qualify an inbound lead'), om(p('Glow Lab is a 34-person skincare brand in Austin. Fit: 4 of 5, they just opened their first retail store.'), card('Plus', 'Add Glow Lab', f'<div style="display:grid;grid-template-columns:90px 1fr;gap:8px;font-size:13px"><span style="color:var(--t3)">Owner</span><span style="display:flex;align-items:center;gap:6px">{av("JR","s20")} Jonah Reyes</span><span style="color:var(--t3)">Fit</span><span>4 of 5</span></div>', foot=pb('Save') + ib('X')))), 640))),
  ],
  band=dict(k='Skills', h='<span>Your best rep\'s know-how,</span> written once and used every day.', pts=[
    ('Box', 'Ready skills', 'Leads, research, meeting prep, call wrap-ups and pipeline reviews.'),
    ('Users', 'Team skills', 'Write how your team works once, and everyone gets it.'),
    ('Sparkles', 'Picked by Otto', 'Otto reads each description and picks the right skill.')]),
  faq=[('What is a skill?', 'A skill is a short set of instructions that tells Otto how to do one job, like qualifying a lead or prepping a meeting.'),
       ('Who can write skills?', 'Anyone can write Personal skills. Owners and admins write Workspace skills for the whole team. System skills come from us and are read-only.'),
       ('What format do skills use?', 'Skills are SKILL.md files in the Agent Skills format, so they are easy to read, share and move.'),
       ('Can a skill send emails or change records?', 'Skills follow the same rules as Otto: a confirm card before any change and drafts that you send yourself.')],
  rel=['product/ask-otto', 'product/knowledge', 'product/workflows']),

# ------------------------------------------------------------------ Knowledge
dict(slug='product/knowledge',
  title='Knowledge: your pricing, playbook and tone | Omniscient',
  desc='Give Otto your pricing, playbook, product catalog and tone. His answers and drafts follow them, and he shows which page he used.',
  h1='Otto knows your business',
  lede='Give Otto your pricing, playbook, catalog and tone. His answers and drafts follow them, and he shows which page he used.',
  hero=vis(shell('k', head('Book', 'Knowledge', '12') + '<div class="dbody" style="display:grid;grid-template-columns:340px 1fr"><div style="border-right:1px solid var(--l1)">' + mini([
      mrow(chip('Book'), 'Wholesale pricing', 'Updated today'), mrow(chip('Book'), 'Sales playbook', '12 pages'), mrow(chip('Book'), 'Email tone', 'Short and warm'), mrow(chip('Book'), 'Product catalog', 'Spring 2027'), mrow(chip('Book'), 'Freight and shipping', 'US, UK, EU'), mrow(chip('Book'), 'Competitors', '6 pages')], pad='8px 18px')
      + '</div><div style="padding:22px 28px;min-width:0"><div style="font-size:20px;font-weight:500;letter-spacing:-.02em">Wholesale pricing</div><div style="font-size:12px;color:var(--t4);margin-top:4px">Updated today by Jonah</div>'
      + '<div style="margin-top:18px;line-height:1.7;color:var(--t2)"><b style="font-weight:500;color:var(--t1)">Unit price</b><br>$16 a unit up to 1,000 units. $14 a unit from 1,000 to 5,000. Over 5,000, talk to Jonah.<br><br><b style="font-weight:500;color:var(--t1)">Freight</b><br>Free to US stores on orders over 2,000 units. UK and EU freight is quoted per order.<br><br><b style="font-weight:500;color:var(--t1)">Payment</b><br>Net 30 for stores with two past orders.</div></div></div>', h=660), w=1360,
    a=acc('tr', 'Page added', 'Wholesale pricing')),
  rows=[
    dict(k='Teach', h='Add pages, files or links', p='Write a page, upload a file or paste a link. Pricing, playbooks, product sheets and your tone of voice all count.',
      pts=['Pages you write and edit', 'Files and links', 'Organized in folders'],
      v=vis(win(head('Book', 'Knowledge', '12') + mini([mrow(chip('Book'), 'Wholesale pricing', 'Updated today'), mrow(chip('Book'), 'Sales playbook', '12 pages'), mrow(chip('Book'), 'Email tone', 'Short and warm'), mrow(chip('Upload', 'c-vio'), 'Spring catalog.pdf', 'Uploaded Nov 10')]), 600))),
    dict(k='Answer', h='Answers that match your pricing', p='Ask Otto what a store should pay or how you handle freight, and the answer comes from your pages, with the page named.',
      v=vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um('What do we charge Maison Verre for 4,000 units?'), om(p('$14 a unit, so $56,000. UK freight is quoted per order, so add a freight line for their London stores.'), card('Book', 'From Knowledge', f'<div class="lrow">{chip("Book")}<b>Wholesale pricing</b><span>"$14 a unit from 1,000 to 5,000."</span></div>', right='1'))), 640))),
    dict(k='Draft', h='Drafts in your team\'s voice', p='Otto writes follow-ups in the tone your team set, using the right prices and terms. You read and send them yourself.',
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Email draft<span class="r">{byotto()}</span></div><div class="card-b" style="padding:16px 18px;font-size:14px;line-height:1.6"><div style="color:var(--t3)">To claire@maisonverre.co</div><div style="font-weight:600;margin:2px 0 10px">Pricing for 4,000 units</div><div>Hi Claire, 4,000 units comes to $14 each. I will add a freight quote for the London stores today.</div><div style="margin-top:10px">Jonah</div></div><div class="card-f" style="padding:10px 18px">{pb("Open in Gmail","Mail")}{ib("Copy")}</div>', 600))),
  ],
  band=dict(k='Knowledge', h='<span>The right price and the right tone,</span> in every answer.', pts=[
    ('Book', 'One source of truth', 'Pricing, playbooks and product facts in one place.'),
    ('Sparkles', 'Used by Otto', 'Answers and drafts follow what your pages say.'),
    ('Check', 'Always cited', 'Otto names the page behind each answer.')]),
  faq=[('What should I add to Knowledge?', 'Anything your team looks up: pricing, discounts, freight, your sales playbook, product sheets, competitor notes and your email tone.'),
       ('Who can edit Knowledge?', 'Owners and admins manage workspace pages. Everyone on the team can read them.'),
       ('Does Otto write contracts from Knowledge?', 'No. Otto never writes or suggests contract text. He uses Knowledge for answers and email drafts.'),
       ('Can I delete a page?', 'Yes. Every page, file and link can be deleted, and Otto stops using it right away.')],
  rel=['product/skills', 'product/ask-otto', 'product/email-sync']),

# ------------------------------------------------------------------ Workflows
dict(slug='product/workflows',
  title='Workflows: run any sales motion on its own | Omniscient',
  desc='Turn the steps your best rep follows into a workflow. Triggers, emails from your team\'s templates, waits, branches and alerts run around the clock.',
  h1='Your best playbook, running on its own',
  lede='Turn the steps your best rep follows into a workflow. Triggers, emails, waits, branches and alerts run around the clock.',
  hero=vis(shell('workflows', head('Bot', 'Proposal follow-up', crumb='Workflows', acts=False, extra=badge('Live', 't-green')) + '<div class="dbody" style="display:grid;grid-template-columns:1fr 300px"><div style="display:flex;justify-content:center;padding-top:26px;min-width:0">'
      + flow('When an opportunity moves to Proposal', '12 in it now', [('Mail', 'Send "Proposal follow-up"', '40 sent, 9 replied'), ('Clock', 'Wait 3 days', 'Time'), ('Branch', 'If they replied', 'Stop here'), ('Bell', 'Notify their owner', 'In Slack')])
      + '</div><div style="border-left:1px solid var(--l1);padding:16px"><div style="font-size:12px;font-weight:500;color:var(--t4);padding:2px 4px 10px">Recent runs</div>'
      + ''.join(f'<div style="display:flex;align-items:center;gap:10px;padding:8px 4px">{logo(k,c,"s20")}<span style="flex:1">{n}</span>{badge(s, t)}</div>' for k, c, n, s, t in [('NB', 'l', 'Nordhavn', 'Waiting', ''), ('MV', '', 'Maison Verre', 'Replied', 't-green'), ('CE', '', 'Corvo', 'Waiting', ''), ('BS', 'g', 'Blanc Studio', 'Notified', 't-blue'), ('ST', '', 'Sora Tea', 'Replied', 't-green')])
      + '</div></div>', h=660), w=1360,
    a=f'<div class="acc acc-br acc-stat"><div><span>Runs this week</span><b>38</b></div><svg viewBox="0 0 120 36" class="spark"><path d="M0 30 L15 26 L30 28 L45 18 L60 21 L75 12 L90 15 L105 6 L120 8" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="120" cy="8" r="3" fill="#0a0a0a"/></svg></div>'),
  rows=[
    dict(k='Trigger', h='Start on any change', p='Stage moves, new records, meetings booked, emails received, fields changed or a schedule. Pick the moment, then add steps.',
      pts=['Record and field changes', 'Meetings and emails', 'Schedules and webhooks'],
      v=vis(win(f'<div class="card-h">{ic("Workflow","i14")}Starts when</div>' + mini([mrow(chip('Handshake'), 'An opportunity moves stage', 'Pick the stage'), mrow(chip('Plus', 'c-sky'), 'A record is added', 'Companies, people or any object'), mrow(chip('Calendar', 'c-vio'), 'A meeting is booked', 'With a customer or lead'), mrow(chip('Mail'), 'An email arrives', 'From someone in your CRM'), mrow(chip('Clock'), 'On a schedule', 'Every Monday at 9:00 AM')], pad='6px 18px 10px'), 560))),
    dict(k='Steps', h='Emails, waits, branches and alerts', p='Send an email from your team\'s own templates, wait, branch on a reply, update a field or alert the owner in Slack.',
      v=vis(flow('When a meeting is booked', 'With a new lead', [('Sparkles', 'Otto writes a prep brief', 'Saved on the record'), ('Pencil', 'Set stage to Discovery', 'Field update'), ('Tag', 'Post in #sales', 'Slack')]), w=620, cls='vis-in', style='align-items:center')),
    dict(k='Watch', h='See every run, pause any time', p='Each workflow shows who is in it, what ran and what is waiting. Pause, edit or delete it whenever you want.',
      v=vis(win(head('Bot', 'Workflows', '5') + mini([mrow(chip('Workflow'), 'Proposal follow-up', '12 in it, 38 runs this week', badge('Live', 't-green')), mrow(chip('Workflow'), 'New lead prep', '4 in it, 11 runs this week', badge('Live', 't-green')), mrow(chip('Workflow'), 'Renewal reminder', '0 in it', badge('Paused')), mrow(chip('Workflow'), 'Won deal handoff', '2 in it, 6 runs this week', badge('Live', 't-green'))]), 600))),
  ],
  band=dict(k='Workflows', h='<span>Set it up once.</span> It runs every day without you.', pts=[
    ('Workflow', 'Any trigger', 'Stage moves, new records, meetings, emails and schedules.'),
    ('Mail', 'Your templates', 'Emails come from templates your team writes.'),
    ('Pause', 'Full control', 'See every run, and pause or edit any workflow.')]),
  faq=[('What can start a workflow?', 'A stage change, a new record, a field change, a booked meeting, an incoming email, a schedule or a webhook.'),
       ('Where do workflow emails come from?', 'From templates your team writes in Settings > Templates. Variables like {{first_name}} fill in from the record.'),
       ('Can workflows create tasks?', 'No. Omniscient has no tasks. Next steps live on the opportunity, and workflows can update that field or alert the owner.'),
       ('Can I test a workflow first?', 'Yes. Save it as a draft, check the steps, and turn it on when you are ready. You can pause it any time.')],
  rel=['product/skills', 'developers', 'integrations']),
]
