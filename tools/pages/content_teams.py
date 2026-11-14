from ui import *

def ask_hero(q, otto_parts, skill=None, acc_=''):
    return vis(shell('ask', head('Sparkles', 'Ask Otto', acts=False) + '<div class="dbody" style="padding:26px 40px 110px"><div style="max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:20px">'
        + um(q, skill=skill) + om(*otto_parts)
        + f'</div></div><div class="dock" style="width:min(680px,86%)"><span>Ask anything, or type / for skills</span><span class="sp"></span><span class="ib">{ic("Plus")}</span><span class="send">{ic("ArrowUp")}</span></div>', h=660), w=1360, a=acc_)

def qa(q, *parts, skill=None, w=640):
    return vis(win(head('Sparkles', 'Ask Otto', acts=False) + chat(um(q, skill=skill), om(*parts)), w))

def deals(rows, title='Opportunities', icon='Handshake', n=''):
    return card(icon, title, ''.join(f'<div class="lrow">{logo(k,c,"s28")}<b>{a}</b><span>{b}</span><em>{e}</em></div>' for k, c, a, b, e in rows), right=f'<span style="font-weight:400;color:var(--t4)">{n}</span>' if n else '')

PAGES = [
dict(slug='for/founders',
  title='Omniscient for founders: run sales without a sales team | Omniscient',
  desc='Founder-led sales with an agent at your side. Find leads, prep every call and follow up on time, without hiring a sales team first.',
  h1='Run sales before you hire a sales team',
  lede='Otto finds leads, preps every call, keeps the pipeline current and drafts each follow-up. You stay on the calls that matter.',
  hero=ask_hero('Where should I spend my time this week?', [p('Three deals are close and one needs you personally.'), deals([('MV', '', 'Q1 wholesale', 'Claire wants pricing by Friday', '$86,400'), ('ST', '', 'Café partner program', 'Review on Nov 18', '$74,000'), ('NB', 'l', 'Spring retail rollout', 'No reply in 6 days', '$58,000')], 'Focus this week', n='3')], acc_=acc('tr', 'Brief ready', 'Pricing review, Maison Verre')),
  rows_label='A week with Omniscient',
  rows=[
    dict(k='Pipeline', h='Know where every deal stands', p='Ask in plain words and get the deals that are close, quiet or due, with the reason for each.',
      v=qa('What changed in the pipeline since Monday?', p('Two deals moved forward and one went quiet.'), deals([('MV', '', 'Q1 wholesale', 'Discovery to Proposal', '+$86,400'), ('OC', 'l', 'Annual plan', 'Proposal to Won', '$36,000'), ('NB', 'l', 'Spring retail rollout', 'No reply in 6 days', '$58,000')]))),
    dict(k='Leads', h='Your next customers, by asking', p='Describe the buyer and Otto builds the list with emails. Save the ones you want with one click.',
      v=qa('Founders of DTC beauty brands moving into retail', p('<b style="font-weight:500">5 leads</b>, 4 with a work email', 'color:var(--t3);font-size:13px'), card('Radar', 'Leads', lrow('TL', 'Theo Lindqvist', 'Co-founder, Nordhavn') + lrow('PN', 'Priya Natarajan', 'Founder, Glow Lab') + lrow('CR', 'Camille Roux', 'CEO, Blanc Studio'), foot=pb('Save 3')), skill='Find leads')),
    dict(k='Follow-up', h='Never drop a follow-up', p='After every call, Otto updates the record and drafts the follow-up in your voice. You read it and send it.',
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Email draft<span class="r">{byotto()}</span></div><div class="card-b" style="padding:16px 18px;font-size:14px;line-height:1.6"><div style="color:var(--t3)">To theo@nordhavn.co</div><div style="font-weight:600;margin:2px 0 10px">Re: Spring retail rollout</div><div>Hi Theo, picking up from our call: we can start with 25 doors and lower the minimum to 600 units. Want the order form today?</div></div><div class="card-f" style="padding:10px 18px">{pb("Open in Gmail","Mail")}{ib("Copy")}</div>', 600))),
  ],
  band=dict(k='Founders', h='<span>Sell like a team of five</span> while you build the company.', pts=[
    ('Radar', 'Leads on demand', 'Lead lists with emails from one sentence.'),
    ('Calendar', 'Prepped for every call', 'A one-page brief before each meeting.'),
    ('Mail', 'Follow-ups on time', 'Drafts after every call, sent by you.')]),
  faq=[('Is Omniscient a fit before we have a sales team?', 'Yes. Founders use Omniscient to run sales themselves, then add their first reps to the same workspace.'),
       ('How long does setup take?', 'Most founders are running the same afternoon. Connect Gmail and your calendar, import your list, and Otto takes it from there.'),
       ('Will it send emails for me?', 'No. Otto drafts. You send from your own inbox, so every message sounds like you.'),
       ('What does it cost?', 'There is a free plan, and paid plans are per seat. See pricing on the home page.')],
  rel=['product/ask-otto', 'product/find-leads', 'product/meetings']),

dict(slug='for/sales',
  title='Omniscient for sales teams: more selling, less typing | Omniscient',
  desc='Call notes, record updates and follow-up drafts done for you. Sales reps spend their time selling and managers see a pipeline they can trust.',
  h1='More selling, less typing',
  lede='Calls turn into notes, record updates and follow-up drafts on their own. Reps sell, and managers get a pipeline they can trust.',
  hero=ask_hero('Wrap up my call with Maison Verre', [p('Here is the recap and 3 updates to review.'), card('Calendar', 'Wholesale scoping call', urow('Set <b>Stage</b> to <b>Proposal</b>', "Send us the proposal and we'll take it from there.") + urow('Set <b>Amount</b> to <b>$86,400</b>', 'Around $80 to $90k for the first order.'), right='<span style="font-weight:400;color:var(--t4)">3 updates</span>')], skill='Wrap up a call', acc_=acc('tr', 'Record updated', 'Stage moved to Proposal')),
  rows_label='A week with Omniscient',
  rows=[
    dict(k='Prep', h='Walk into every call ready', p='A one-page brief before each meeting: who is coming, what they said last time and what to ask.',
      v=vis(win(f'<div style="padding:16px 18px"><div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--t3)">{byotto()}Brief for Kiosk pricing, Nov 21</div><p style="margin:12px 0 0;line-height:1.65">Diego wants kiosks in 6 Milan stores by spring. He compared two vendors last month. Ask about install dates.</p></div>', 560))),
    dict(k='Update', h='The CRM updates itself', p='After each call, Otto proposes stage, amount and next step with the quote behind each. Accept in one click.',
      v=vis(win(head('Calendar', 'Kiosk pricing', acts=False, extra=badge('Past')) + urow('Set <b>Next step</b> to <b>Send install dates</b>', 'Can you send install dates by Monday?') + urow('Set <b>Amount</b> to <b>$48,000</b>', 'Six kiosks at eight each works for us.'), 620))),
    dict(k='Forecast', h='A pipeline managers can trust', p='Every stage change has a quote behind it, so the forecast reflects what customers actually said.',
      v=vis(win(lanes([('Discovery', 12, [('Holiday gifting', 'HG', 'g', '$42,000', False)]), ('Proposal', 7, [('Q1 wholesale', 'MV', '', '$86,400', True), ('Wholesale portal', 'BS', 'g', '$31,500', False)]), ('Negotiation', 5, [('Retail kiosks', 'CE', '', '$48,000', False)]), ('Won', 9, [('Annual plan', 'OC', 'l', '$36,000', False)])]), 720), w=800)),
  ],
  band=dict(k='Sales', h='<span>Less admin, more conversations.</span> Every deal stays current.', pts=[
    ('Video', 'Call notes', 'Summary, action items and transcript after every call.'),
    ('Pencil', 'Updates with proof', 'Stage and amount change with the quote behind them.'),
    ('Bell', 'Emails to answer', 'Replies waiting on you, always at the top.')]),
  faq=[('Do reps have to log calls?', 'No. Calls on Zoom, Google Meet or Teams get notes automatically, and Otto suggests the record updates.'),
       ('Can managers see what changed?', 'Yes. Every change shows who made it, or that Otto suggested it and who accepted it, with the quote behind it.'),
       ('Does it replace our email client?', 'No. Emails sync from Gmail or Outlook, and drafts open in your inbox to send.'),
       ('Can we keep our stages?', 'Yes. Set your own stages and fields in the data model.')],
  rel=['product/meetings', 'product/email-sync', 'product/workflows']),

dict(slug='for/marketing',
  title='Omniscient for marketing: know which leads turn into revenue | Omniscient',
  desc='See which leads and companies turn into pipeline, build target lists by asking, and hand warm leads to sales with full context.',
  h1='Know which leads turn into revenue',
  lede='Build target lists by asking, see which companies turn into pipeline, and hand warm leads to sales with the full story attached.',
  hero=ask_hero('Which industries turned into the most pipeline this quarter?', [p('Home and beauty brands lead, with gifting close behind.'), card('Radar', 'Pipeline by industry', ''.join(f'<div class="lrow">{chip("Building")}<b>{n}</b><span>{d}</span><em>{v}</em></div>' for n, d, v in [('Skincare and beauty', '6 opportunities', '$212,000'), ('Gifting', '4 opportunities', '$128,000'), ('Home fragrance', '3 opportunities', '$84,000')]), right='<span style="font-weight:400;color:var(--t4)">This quarter</span>')], acc_=acc('tr', 'List saved', 'Beauty founders, 48 people')),
  rows_label='A week with Omniscient',
  rows=[
    dict(k='Target', h='Target lists by asking', p='Describe your ideal customer and get companies and people that fit, with emails, ready for your next campaign.',
      v=qa('Companies like our three best customers', p('DTC home and beauty brands, 20 to 100 people, selling in stores.'), card('Building', 'Companies', lrow_co('GL', '', 'Glow Lab', 'Skincare, 34 people') + lrow_co('WM', '', 'Wildmoor', 'Home goods, 52 people'), foot=pb('Save 2')), skill='Find leads')),
    dict(k='Handoff', h='Warm leads, handed off with context', p='When a lead books a meeting, a workflow assigns the owner, writes a prep brief and posts in Slack.',
      v=vis(flow('When a meeting is booked', 'With a new lead', [('Users', 'Assign the owner', 'By region'), ('Sparkles', 'Otto writes a prep brief', 'Saved on the record'), ('Tag', 'Post in #sales', 'Slack')]), w=620, style='align-items:center')),
    dict(k='Learn', h='See what turns into pipeline', p='Ask which sources, industries and company sizes become opportunities, and plan the next campaign around them.',
      v=qa('How many new leads became opportunities this month?', p('11 of 64 new leads became opportunities, worth $318,000. Most came from the retail webinar list.'))),
  ],
  band=dict(k='Marketing', h='<span>Spend where the revenue is.</span> Hand off every lead warm.', pts=[
    ('Radar', 'Target lists', 'Ideal customers and lookalikes, with emails.'),
    ('Workflow', 'Instant handoff', 'Owner, brief and Slack alert when a lead books.'),
    ('Orbit', 'Full context', 'Sales sees every touch before the first call.')]),
  faq=[('Can marketing and sales share one workspace?', 'Yes. Everyone works from the same records, so sales sees every touch and marketing sees what turned into pipeline.'),
       ('Does it send campaigns?', 'Omniscient is a CRM, not an email blaster. Workflows send emails from your team\'s templates for follow-ups.'),
       ('Can we route leads automatically?', 'Yes. Workflows can assign owners, write prep briefs and post in Slack when a lead comes in or books a meeting.'),
       ('Can we import event or webinar lists?', 'Yes. Import a CSV, and duplicates merge with the people already in your CRM.')],
  rel=['product/find-leads', 'product/workflows', 'product/data-model']),

dict(slug='for/customer-success',
  title='Omniscient for customer success: every account in view | Omniscient',
  desc='Every email, call and note on the account, renewal dates in view, and Otto flags the accounts that need attention.',
  h1='Every account and every renewal, in view',
  lede='Every email, call and note on the account. Renewal dates in view, and Otto flags the accounts that need your attention.',
  hero=ask_hero('Which accounts need attention before renewal?', [p('Two renewals are coming up and one account has gone quiet.'), deals([('OC', 'l', 'Oro Candle', 'Renews Jan 12, asked about spring scents', '$36,000'), ('LS', 'g', 'Lumen Skin', 'Renews Feb 3, usage up', '$48,000'), ('ST', '', 'Sora Tea', 'No reply in 9 days', '$74,000')], 'Need attention', 'Building', '3')], acc_=acc('tr', 'Brief ready', 'Renewal call, Oro Candle')),
  rows_label='A week with Omniscient',
  rows=[
    dict(k='History', h='The whole story before every call', p='Ask about any account and get what they bought, what they asked for and what they said last time, with sources.',
      v=qa('What has Oro Candle asked for this year?', p('Hana asked for spring scents twice and for net 45 terms once. Both are on the last call.'), card('Book', 'Sources', f'<div class="lrow">{chip("Video")}<b>Call, Oct 30</b><span>"We want the spring scents in."</span></div><div class="lrow">{chip("Mail","c-sky")}<b>Email, Sep 12</b><span>"Could we move to net 45?"</span></div>', right='2'))),
    dict(k='Renewals', h='Renewals you see coming', p='Renewal dates live on the record. A workflow can remind the owner and prep a brief weeks ahead.',
      v=vis(flow('60 days before a renewal date', '3 accounts this month', [('Sparkles', 'Otto writes an account brief', 'Saved on the record'), ('Bell', 'Notify the owner', 'In Slack'), ('Clock', 'Wait 30 days', 'Time')]), w=620, style='align-items:center')),
    dict(k='Signals', h='Spot quiet accounts early', p='Otto notices when an account stops replying or a champion changes jobs, so you can reach out in time.',
      v=vis(win(f'<div class="card-h">{ic("Bell","i14")}Signals<span class="r" style="font-weight:400;color:var(--t4)">This week</span></div><div class="card-b"><div class="lrow">{logo("ST","","s28")}<b>Sora Tea</b><span>No reply in 9 days</span><em>Quiet</em></div><div class="lrow">{av("RS")}<b>Ravi Shah</b><span>Left Lumen Skin</span><em>Job change</em></div></div>', 600))),
  ],
  band=dict(k='Customer success', h='<span>Know every account like it is your only one.</span>', pts=[
    ('Orbit', 'Full history', 'Emails, calls and notes on one account record.'),
    ('Clock', 'Renewals in view', 'Dates, reminders and briefs ahead of time.'),
    ('Briefcase', 'Job changes', 'Know when a champion moves on.')]),
  faq=[('Can we track renewal dates?', 'Yes. Add renewal fields to companies or opportunities, and use workflows to remind owners ahead of time.'),
       ('Can CS and sales share accounts?', 'Yes. Everyone works from the same record, so handoffs keep every email, call and note.'),
       ('Does Otto flag at-risk accounts?', 'Otto flags accounts that have gone quiet or lost a champion, and you can ask him for accounts that need attention.'),
       ('Can we keep a health score?', 'Yes. Add a health field with your own options, and Otto can suggest updates from calls and emails.')],
  rel=['product/omniscience', 'product/workflows', 'product/clean-data']),

dict(slug='for/agencies',
  title='Omniscient for agencies: every client and pitch in one place | Omniscient',
  desc='Track every client, pitch and contact in one place. Otto preps pitch meetings, recaps calls and keeps each account current.',
  h1='Every client and every pitch, in one place',
  lede='Track clients, pitches and contacts together. Otto preps each pitch, recaps every call and keeps each account current.',
  hero=ask_hero('Prep me for the Halden Goods pitch', [p('Sam leads ops at a 120-person gifting company. They want a holiday campaign live by October.'), card('Calendar', 'Pitch brief', ''.join(f'<div style="display:flex;gap:8px;align-items:flex-start;font-size:13px;color:var(--t2);padding:4px 0">{ic("ChevronRight","i12")}<span>{t}</span></div>' for t in ['Budget: $40k to $45k for the season', 'Last agency missed launch dates', 'Ask who signs off besides Sam']), right='<span style="font-weight:400;color:var(--t4)">3 facts</span>')], skill='Prep for a meeting', acc_=acc('tr', 'Brief ready', 'Halden Goods pitch, Nov 20')),
  rows_label='A week with Omniscient',
  rows=[
    dict(k='Pitches', h='Every pitch on one board', p='Track pitches from first call to signed, with your own stages. See what is close and what needs a push.',
      v=vis(win(lanes([('Pitching', 4, [('Holiday campaign', 'HG', 'g', '$42,000', True)]), ('Proposal', 3, [('Retail launch', 'CE', '', '$48,000', False)]), ('Signed', 6, [('Brand refresh', 'BS', 'g', '$31,500', False), ('Café rollout', 'ST', '', '$74,000', False)])]), 680), w=760)),
    dict(k='Clients', h='Each client\'s whole history', p='Every email, call and note with each client on one record, so anyone on the team can pick it up.',
      v=qa('What did Blanc Studio approve last week?', p('Camille approved the spring lookbook and asked for two more store layouts by Dec 1.'), card('Book', 'Sources', f'<div class="lrow">{chip("Mail","c-sky")}<b>Email, Nov 8</b><span>"Lookbook approved, love it."</span></div>', right='1'))),
    dict(k='Recaps', h='Call recaps your clients will notice', p='After each client call, Otto writes the recap and next steps. You check it and send it from your inbox.',
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Recap draft<span class="r">{byotto()}</span></div><div class="card-b" style="padding:16px 18px;font-size:14px;line-height:1.6"><div style="font-weight:600;margin:0 0 10px">Recap: store layouts</div><div>Thanks Camille. Next steps: two more layouts by Dec 1, and a review call on Dec 3.</div></div><div class="card-f" style="padding:10px 18px">{pb("Open in Gmail","Mail")}{ib("Copy")}</div>', 600))),
  ],
  band=dict(k='Agencies', h='<span>More pitches won,</span> every client kept close.', pts=[
    ('Handshake', 'Pitch pipeline', 'Your own stages from first call to signed.'),
    ('Users', 'Shared client history', 'Anyone can pick up any account.'),
    ('Video', 'Recaps after calls', 'Notes and next steps, ready to send.')]),
  faq=[('Can we track both pitches and active clients?', 'Yes. Use opportunities for pitches and companies for clients, or add a custom object for projects.'),
       ('Can we keep some client threads private?', 'Yes. Each person chooses which threads are shared with the team.'),
       ('Does Otto write proposals or contracts?', 'No. Otto preps meetings, recaps calls and drafts emails. He never writes contract text.'),
       ('Can we connect our clients\' Slack?', 'Add Omniscient to your own Slack to ask Otto and get alerts. Client conversations come in through email and call notes.')],
  rel=['product/meetings', 'product/data-model', 'product/ask-otto']),
]
