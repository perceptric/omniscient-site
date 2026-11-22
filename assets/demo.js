/* The home page hero demo: a small working copy of the app (styles in demo.css).
   Every sidebar tab is usable with populated data: sortable and filterable tables, a pipeline you can drag deals
   across, records with working tabs and editable fields, meetings with updates you can apply, emails you can answer,
   notes you can write, workflows you can pause, settings you can toggle, a ⌘K command bar and an Ask Otto chat that
   answers from the demo's own data. Changes carry across tabs. Nothing leaves the page. */
(() => {
  const app = document.getElementById('heroapp'), page = document.getElementById('demo');
  if (!app || !page) return;
  const O = window.OMNI || {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ic = O.ic || ((n, c = 'i') => `<svg class="${c}"><use href="#i-${n}"/></svg>`);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, el = page) => el.querySelector(s);
  const $$ = (s, el = page) => [...el.querySelectorAll(s)];
  const money = n => n ? '$' + n.toLocaleString('en-US') : '–';
  const kmoney = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : '$' + Math.round(n / 1000) + 'k';
  let uid = 1000;

  /* ---------- the team and the data ---------- */
  const TEAM = {
    JR: ['Jonah Reyes', 'Account Executive', null], AO: ['Amara Okafor', 'Head of Sales', '/assets/img/people/amara.jpg'],
    DS: ['Diego Santos', 'Account Executive', '/assets/img/people/diego.jpg'], RP: ['Rina Patel', 'Customer Success', '/assets/img/people/rina.jpg'],
    TL: ['Theo Lambert', 'RevOps', '/assets/img/people/theo.jpg'],
  };
  const own = k => { const t = TEAM[k]; return t[2] ? `<span class="av s20 ph" style="background-image:url(${t[2]})" title="${t[0]}"></span>` : `<span class="av s20" title="${t[0]}">${k}</span>`; };
  const ownName = k => `<span class="dm-own">${own(k)}${TEAM[k][0]}</span>`;

  const S = {
    co: [
      { id: 'linear', n: 'Linear', i: 'LI', d: 'linear.app', rel: 'Customer', arr: 58000, emp: '120', lt: '2h ago', ltn: 2, nm: 'Dec 2', pl: 'San Francisco, CA', ind: 'Software', own: 'JR', about: 'Issue tracking and product planning for software teams.' },
      { id: 'vercel', n: 'Vercel', i: 'VE', d: 'vercel.com', rel: 'Prospect', arr: 0, emp: '650', lt: 'Today', ltn: 1, nm: 'Dec 2', pl: 'San Francisco, CA', ind: 'Developer tools', own: 'DS', about: 'A cloud platform for frontend teams.' },
      { id: 'notion', n: 'Notion', i: 'NO', d: 'notion.so', rel: 'Prospect', arr: 0, emp: '800', lt: '4d ago', ltn: 96, nm: '–', pl: 'San Francisco, CA', ind: 'Productivity', own: 'JR', about: 'A connected workspace for docs, wikis and projects.' },
      { id: 'stripe', n: 'Stripe', i: 'ST', d: 'stripe.com', rel: 'Customer', arr: 120000, emp: '8,000', lt: '2h ago', ltn: 2, nm: 'Nov 24', pl: 'South San Francisco, CA', ind: 'Payments', own: 'AO', about: 'Payments infrastructure for the internet.' },
      { id: 'figma', n: 'Figma', i: 'FI', d: 'figma.com', rel: 'Partner', arr: 74000, emp: '1,500', lt: '6h ago', ltn: 6, nm: '–', pl: 'San Francisco, CA', ind: 'Design', own: 'RP', about: 'The collaborative interface design tool.' },
      { id: 'ramp', n: 'Ramp', i: 'RA', d: 'ramp.com', rel: 'Prospect', arr: 0, emp: '900', lt: '1d ago', ltn: 24, nm: 'Nov 25', pl: 'New York, NY', ind: 'Finance', own: 'DS', about: 'Corporate cards and spend management.' },
      { id: 'airbnb', n: 'Airbnb', i: 'AB', d: 'airbnb.com', rel: 'Customer', arr: 36000, emp: '6,900', lt: '5d ago', ltn: 120, nm: '–', pl: 'San Francisco, CA', ind: 'Travel', own: 'RP', about: 'A marketplace for stays and experiences.' },
      { id: 'shopify', n: 'Shopify', i: 'SH', d: 'shopify.com', rel: 'Prospect', arr: 0, emp: '8,100', lt: '1d ago', ltn: 26, nm: 'Nov 26', pl: 'Ottawa, Canada', ind: 'Commerce', own: 'AO', about: 'Commerce software for merchants of every size.' },
      { id: 'anthropic', n: 'Anthropic', i: 'AN', d: 'anthropic.com', rel: 'Prospect', arr: 0, emp: '1,000+', lt: '3h ago', ltn: 3, nm: 'Nov 24', pl: 'San Francisco, CA', ind: 'AI research', own: 'JR', about: 'AI safety and research company.' },
      { id: 'openai', n: 'OpenAI', i: 'OA', d: 'openai.com', rel: 'Customer', arr: 180000, emp: '3,000', lt: '1d ago', ltn: 28, nm: 'Dec 4', pl: 'San Francisco, CA', ind: 'AI research', own: 'AO', about: 'AI research and deployment company.' },
    ],
    pe: [
      ['KS', 'Karri Saarinen', 'CEO', 'linear', '2h ago'], ['TA', 'Tuomas Artman', 'CTO', 'linear', 'Yesterday'], ['GR', 'Guillermo Rauch', 'CEO', 'vercel', 'Today'],
      ['IZ', 'Ivan Zhao', 'CEO', 'notion', '4d ago'], ['AK', 'Akshay Kothari', 'COO', 'notion', '1w ago'], ['PC', 'Patrick Collison', 'CEO', 'stripe', '2h ago'],
      ['JC', 'John Collison', 'President', 'stripe', 'Yesterday'], ['DF', 'Dylan Field', 'CEO', 'figma', '6h ago'], ['EG', 'Eric Glyman', 'CEO', 'ramp', '1d ago'],
      ['KA', 'Karim Atiyeh', 'CTO', 'ramp', '3d ago'], ['BC', 'Brian Chesky', 'CEO', 'airbnb', '5d ago'], ['TB', 'Tobi Lütke', 'CEO', 'shopify', '1d ago'],
      ['HF', 'Harley Finkelstein', 'President', 'shopify', '2d ago'], ['DA', 'Dario Amodei', 'CEO', 'anthropic', '3h ago'], ['SA', 'Sam Altman', 'CEO', 'openai', '1d ago'],
      ['GB', 'Greg Brockman', 'President', 'openai', '4d ago'],
    ].map(([a, n, t, co, lt], k) => ({ id: 'p' + k, a, n, t, co, lt, email: n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '@' + '' })),
    de: [
      { id: 'd1', n: 'Team plan expansion', co: 'linear', amt: 58000, st: 'Negotiation', close: 'Dec 12', own: 'JR', who: 'KS', next: 'Send the order form' },
      { id: 'd2', n: 'Pilot, 40 seats', co: 'vercel', amt: 31500, st: 'Proposal', close: 'Dec 5', own: 'DS', who: 'GR', next: 'Pricing for 40 seats' },
      { id: 'd3', n: 'Workspace migration', co: 'notion', amt: 86400, st: 'Proposal', close: 'Nov 28', own: 'JR', who: 'IZ', next: 'Follow up on the proposal' },
      { id: 'd4', n: 'Global sales team', co: 'stripe', amt: 120000, st: 'Negotiation', close: 'Dec 19', own: 'AO', who: 'PC', next: 'Pricing by Friday' },
      { id: 'd5', n: 'Design org rollout', co: 'figma', amt: 74000, st: 'Proposal', close: 'Dec 8', own: 'RP', who: 'DF', next: 'Legal review' },
      { id: 'd6', n: 'Finance team pilot', co: 'ramp', amt: 48000, st: 'Negotiation', close: 'Dec 15', own: 'DS', who: 'EG', next: 'Security questionnaire' },
      { id: 'd7', n: 'Annual plan', co: 'airbnb', amt: 36000, st: 'Won', close: 'Nov 3', own: 'RP', who: 'BC', next: 'Kickoff call' },
      { id: 'd8', n: 'Merchant success team', co: 'shopify', amt: 64000, st: 'Discovery', close: 'Jan 20', own: 'AO', who: 'TB', next: 'Discovery call' },
      { id: 'd9', n: 'Enterprise rollout', co: 'anthropic', amt: 240000, st: 'Discovery', close: 'Feb 14', own: 'JR', who: 'DA', next: 'Security review' },
      { id: 'd10', n: 'Go-to-market team', co: 'openai', amt: 180000, st: 'Won', close: 'Oct 30', own: 'AO', who: 'SA', next: 'Expansion check-in' },
      { id: 'd11', n: 'Billing team add-on', co: 'stripe', amt: 42000, st: 'Discovery', close: 'Jan 31', own: 'AO', who: 'JC', next: 'Map the billing team' },
      { id: 'd12', n: 'Support team seats', co: 'linear', amt: 18000, st: 'Won', close: 'Nov 14', own: 'JR', who: 'TA', next: 'Onboarding' },
    ],
    mt: [
      { id: 'm1', up: 1, mo: 'NOV', dy: '24', t: 'Pricing review', co: 'stripe', who: ['PC', 'JC'], tm: '10:00 AM', dur: '45 min', brief: ['Patrick signs off himself. Budget is $110k to $130k.', 'Open question: the EU rollout and who owns it.', 'Last call: timing matters more than price.'] },
      { id: 'm2', up: 1, mo: 'NOV', dy: '24', t: 'Security review', co: 'anthropic', who: ['DA'], tm: '2:30 PM', dur: '60 min', brief: ['They want SSO and audit logs before a pilot.', 'Share the security pack and the SOC 2 report.', 'Dario asked about data retention on the last email.'] },
      { id: 'm3', up: 1, mo: 'NOV', dy: '25', t: 'Pilot scoping', co: 'ramp', who: ['EG', 'KA'], tm: '11:00 AM', dur: '30 min', brief: ['40 seats across finance and sales.', 'Karim owns the security questionnaire.', 'They are also looking at one other tool.'] },
      { id: 'm4', up: 1, mo: 'DEC', dy: '2', t: 'Weekly sync', co: 'linear', who: ['KS', 'TA'], tm: '9:00 AM', dur: '30 min', brief: ['The order form is with Karri.', 'Tuomas asked to add two more teams.', 'Renewal moves to an annual plan.'] },
      { id: 'm5', up: 0, mo: 'NOV', dy: '20', t: 'Scoping call', co: 'vercel', who: ['GR'], tm: '2:00 PM', dur: '32 min',
        sum: 'Guillermo wants a 40-seat pilot for the sales team before the end of the year. Budget is around $30k. He will sign himself.',
        acts: ['Send pricing for 40 seats', 'Share the security pack', 'Book a demo for the sales leads'],
        tr: [['GR', 'We want 40 seats for the pilot, mostly sales.'], ['JR', 'Is there a date you are working toward?'], ['GR', 'Before the end of the year. Send us the proposal and we will take it from there.'], ['JR', 'And budget, roughly?'], ['GR', 'Around $30k for the pilot.']],
        upd: [['Stage', 'Proposal', 'Send us the proposal and we will take it from there.', 'd2'], ['Amount', 31500, 'Around $30k for the pilot.', 'd2'], ['Next step', 'Pricing for 40 seats', 'We want 40 seats for the pilot.', 'd2']] },
      { id: 'm6', up: 0, mo: 'NOV', dy: '19', t: 'Expansion call', co: 'linear', who: ['KS'], tm: '4:00 PM', dur: '28 min',
        sum: 'Karri is ready to sign for the team plan. Legal is done. Two more teams may join in January.',
        acts: ['Send the order form', 'Draft the January expansion'],
        tr: [['KS', 'Legal is done on our side.'], ['JR', 'Great, then I can send the order form today.'], ['KS', 'Do that. We may add two more teams in January.']],
        upd: [['Stage', 'Negotiation', 'Legal is done on our side.', 'd1'], ['Next step', 'Send the order form', 'I can send the order form today.', 'd1']] },
      { id: 'm7', up: 0, mo: 'NOV', dy: '18', t: 'Partner review', co: 'figma', who: ['DF'], tm: '10:00 AM', dur: '40 min',
        sum: 'The rollout waits on legal. Dylan wants a short pilot with the design org first.',
        acts: ['Send the pilot plan', 'Follow up with legal'],
        tr: [['DF', 'Legal still has the contract.'], ['RP', 'Would a short pilot help in the meantime?'], ['DF', 'Yes, start with the design org.']],
        upd: [['Next step', 'Legal review', 'Legal still has the contract.', 'd5']] },
      { id: 'm8', up: 0, mo: 'NOV', dy: '14', t: 'Discovery call', co: 'shopify', who: ['TB', 'HF'], tm: '1:00 PM', dur: '45 min',
        sum: 'Merchant success wants one view of every merchant. They run three tools today.',
        acts: ['Send the case study', 'Book a technical call'],
        tr: [['HF', 'We run three tools for merchant success today.'], ['AO', 'What would one view change for the team?'], ['TB', 'Faster answers, and fewer handoffs.']],
        upd: [['Stage', 'Discovery', 'We run three tools for merchant success today.', 'd8']] },
    ],
    em: [
      { id: 'e1', co: 'stripe', from: 'PC', s: 'Pricing for 40 seats?', tm: '9:41 AM', need: 1, msgs: [['PC', 'Hi Jonah, can you send pricing for 40 seats before Friday? We want to start in January.']], draft: 'Hi Patrick, for 40 seats we can hold $44 a seat and start the EU team in February. I attached the order form. Happy to walk through it on Monday.' },
      { id: 'e2', co: 'notion', from: 'IZ', s: 'Re: Workspace migration', tm: 'Yesterday', need: 1, msgs: [['JR', 'Hi Ivan, here is the proposal we discussed.'], ['IZ', 'Thanks. Is there a minimum on seats?']], draft: 'Hi Ivan, the minimum is 25 seats, and we can start with your product team. Want me to send a version with 25?' },
      { id: 'e3', co: 'linear', from: 'KS', s: 'Sending the order form today', tm: '2h ago', need: 0, msgs: [['KS', 'Legal is done. Sending the order form today.']] },
      { id: 'e4', co: 'ramp', from: 'KA', s: 'Security questionnaire', tm: '1d ago', need: 1, msgs: [['KA', 'Attached is our security questionnaire. Could you fill it in this week?']], draft: 'Hi Karim, thanks. Most answers are in our security pack, attached. I will send the rest by Wednesday.' },
      { id: 'e5', co: 'figma', from: 'DF', s: 'Rollout plan attached', tm: '6h ago', need: 0, msgs: [['DF', 'Here is the rollout plan for the design org.']] },
      { id: 'e6', co: 'anthropic', from: 'DA', s: 'Data retention', tm: '3h ago', need: 1, msgs: [['DA', 'Before the security review, how long do you keep call recordings?']], draft: 'Hi Dario, recordings are kept for 90 days by default and you can set any limit. I will bring the details to Monday\'s review.' },
      { id: 'e7', co: 'shopify', from: 'HF', s: 'Case study?', tm: '2d ago', need: 0, msgs: [['HF', 'Do you have a case study from a commerce team?']] },
      { id: 'e8', co: 'airbnb', from: 'BC', s: 'Kickoff next week', tm: '5d ago', need: 0, msgs: [['BC', 'Looking forward to the kickoff next week.']] },
    ],
    no: [
      { id: 'n1', co: 'linear', t: 'Rollout plan', b: 'Two teams go first, then support in January. Karri wants one admin per team.', by: 'JR', tm: 'Today' },
      { id: 'n2', co: 'vercel', t: 'Scoping call', b: '40 seats, timing over price. Guillermo signs himself. Pilot before the end of the year.', by: 'DS', tm: 'Nov 20' },
      { id: 'n3', co: 'stripe', t: 'Partner terms', b: 'Annual, net 30. EU team starts in February. Patrick wants pricing by Friday.', by: 'AO', tm: 'Nov 19' },
      { id: 'n4', co: 'airbnb', t: 'Renewal plan', b: 'Renews in January. Usage fell this month, so plan a check-in call.', by: 'RP', tm: 'Nov 17' },
      { id: 'n5', co: 'anthropic', t: 'Security asks', b: 'SSO, audit logs and data retention. Send the SOC 2 report before Monday.', by: 'JR', tm: 'Nov 16' },
      { id: 'n6', co: 'shopify', t: 'Discovery notes', b: 'Three tools today for merchant success. They want one view of every merchant.', by: 'AO', tm: 'Nov 14' },
    ],
    kb: [
      { id: 'k1', t: 'Pricing and discounts', sub: 'Updated today', by: 'TL', body: [['h', 'Seat price'], ['p', '$49 a seat up to 100 seats. $44 a seat from 100 to 500. Over 500, talk to Amara.'], ['h', 'Discounts'], ['p', 'Annual plans get two months free. Pilots up to 60 days at no charge for 25 seats or more.'], ['h', 'Payment'], ['p', 'Net 30 on annual plans. Card or invoice.']] },
      { id: 'k2', t: 'Sales playbook', sub: '12 pages', by: 'AO', body: [['h', 'Discovery'], ['p', 'Ask about the tools they use today, who signs and the date they work toward.'], ['h', 'Proposal'], ['p', 'Send within a day of the call. Lead with the pilot, then the annual plan.'], ['h', 'Close'], ['p', 'Agree on the next step in every call. Otto logs it on the record.']] },
      { id: 'k3', t: 'Email tone', sub: 'Short and warm', by: 'JR', body: [['p', 'Write like a person. Three short paragraphs at most. One ask per email. Sign with your first name.']] },
      { id: 'k4', t: 'Product catalog', sub: 'Spring 2027', by: 'TL', body: [['h', 'Plans'], ['p', 'Starter, Pro and Business. Otto is in every plan.'], ['h', 'Add-ons'], ['p', 'Extra lead credits, call recording storage and a dedicated success manager.']] },
      { id: 'k5', t: 'Security pack', sub: 'SOC 2, SSO, retention', by: 'TL', body: [['p', 'SOC 2 Type II. SSO with SAML. Audit logs on Business. Call recordings kept 90 days by default, with any limit you set.']] },
    ],
    sk: [
      { id: 's1', n: 'Find leads', d: 'Build a lead list from one sentence', sc: 'System', steps: ['Read the request', 'Search people and companies', 'Rank by fit and say why', 'Flag who is already in the CRM'], ask: 'Find founders of fast-growing software companies in San Francisco' },
      { id: 's2', n: 'Research an account', d: 'A short profile with sources', sc: 'System', steps: ['Read the record and recent emails', 'Check news and hiring', 'Write a one-page profile with sources'], ask: 'Research Stripe' },
      { id: 's3', n: 'Prep for a meeting', d: 'A one-page brief before the call', sc: 'System', steps: ['Read the last call and emails', 'List open questions', 'Write the brief'], ask: 'Prep me for my next meeting' },
      { id: 's4', n: 'Wrap up a call', d: 'Recap, updates and a follow-up', sc: 'System', steps: ['Read the transcript', 'Propose record updates with quotes', 'Draft the follow-up'], ask: 'Wrap up my call with Vercel' },
      { id: 's5', n: 'Draft an email', d: 'A first email, follow-up or reply', sc: 'System', steps: ['Read the thread', 'Follow the tone page', 'Draft for your review'], ask: 'Draft a follow-up to Ivan' },
      { id: 's6', n: 'Review the pipeline', d: 'Deals that need attention', sc: 'System', steps: ['Read every open deal', 'Find stalled and late deals', 'Say what to do next'], ask: 'Which deals need me this week?' },
      { id: 's7', n: 'Qualify an inbound lead', d: 'Our questions for new requests', sc: 'Workspace', steps: ['Check company size and industry', 'Score against our best customers', 'Route to the right owner'], ask: 'Qualify the new lead from Ramp' },
      { id: 's8', n: 'My Friday review', d: 'Deals I own that moved this week', sc: 'Personal', steps: ['List deals I own', 'Show what moved', 'Draft my update for Amara'], ask: 'What will we close in December?' },
    ],
    wf: [
      { id: 'w1', n: 'Proposal follow-up', trig: 'When an opportunity moves to Proposal', steps: [['Mail', 'Send "Proposal follow-up"', '40 sent, 9 replied'], ['Clock', 'Wait 3 days', 'Time'], ['Bell', 'Notify their owner', 'If there is no reply']], live: 1, runs: 38 },
      { id: 'w2', n: 'New lead prep', trig: 'When a meeting is booked with a new lead', steps: [['Sparkles', 'Otto writes a prep brief', 'Saved on the record'], ['Pencil', 'Set stage to Discovery', 'Field update'], ['Chat', 'Post in #sales', 'Slack']], live: 1, runs: 21 },
      { id: 'w3', n: 'Renewal reminder', trig: '60 days before a renewal date', steps: [['Sparkles', 'Otto writes an account brief', 'Usage, calls and risks'], ['Bell', 'Notify the owner', 'With the brief']], live: 0, runs: 6 },
      { id: 'w4', n: 'Won deal handoff', trig: 'When an opportunity is won', steps: [['Users', 'Assign customer success', 'Round robin'], ['Mail', 'Send the welcome email', 'From the owner'], ['Calendar', 'Book the kickoff', 'Within a week']], live: 1, runs: 9 },
      { id: 'w5', n: 'Stalled deal alert', trig: 'When a deal has no activity for 14 days', steps: [['Bell', 'Notify the owner', 'With the last touch'], ['Sparkles', 'Otto drafts a nudge', 'For review']], live: 1, runs: 14 },
    ],
    apps: [['Gmail', 'gmail.svg', 1], ['Google Calendar', 'calendar.svg', 1], ['Google Meet', 'meet.svg', 1], ['Zoom', 'zoom.svg', 1], ['Slack', 'slack.svg', 1], ['WhatsApp', 'whatsapp.svg', 0], ['LinkedIn', 'linkedin.svg', 0]],
    act: [], chat: [], saved: new Set(), newPeople: new Set(),
  };
  S.pe.forEach(p => { p.email += S.co.find(c => c.id === p.co).d; });
  const CO = id => S.co.find(c => c.id === id), PE = id => S.pe.find(p => p.id === id), DE = id => S.de.find(d => d.id === id);
  const PA = a => S.pe.find(p => p.a === a);
  const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Won'];
  const REL = ['Customer', 'Prospect', 'Partner'];
  // activity: the record timelines start from the emails, meetings and notes, and grow as you work
  S.co.forEach(c => {
    const p = S.pe.find(q => q.co === c.id), f = p.n.split(' ')[0];
    S.act.push({ co: c.id, k: 'gmail', t: `<b>${f}</b> emailed you`, s: 'Re: next steps', tm: c.lt });
    S.act.push({ co: c.id, k: 'meet', t: `Meeting with <b>${f}</b>`, s: 'Weekly sync', tm: 'Yesterday' });
    const d = S.de.find(x => x.co === c.id);
    if (d) S.act.push({ co: c.id, k: 'otto', t: `<b>Otto</b> set <b>Stage</b> to ${d.st}`, s: d.n, tm: 'Nov 9' });
  });

  /* ---------- small pieces ---------- */
  const logo = (c, s = '') => `<span class="logo ${s}">${c.i}</span>`;
  const badge = t => `<span class="badge">${t}</span>`;
  const av = (a, s = '') => `<span class="av ${s}">${a}</span>`;
  const coChip = c => `<span class="cchip" data-go="co:${c.id}">${logo(c, 's16')}${c.n}</span>`;
  const otto = (s = 16) => `<svg width="${s}" height="${s}"><use href="#otto"/></svg>`;
  const dock = (ph = 'Ask Otto anything') => `<form class="dock dm-dock" data-form="dock"><svg class="o"><use href="#otto"/></svg><input name="q" placeholder="${esc(ph)}" autocomplete="off" aria-label="Ask Otto"><span class="ib">${ic('Mic')}</span><button class="send" type="submit" aria-label="Send">${ic('ArrowUp')}</button></form>`;
  const head = (icon, title, ct = '', crumb = '', acts = '') => `<div class="win-h">${crumb}<span class="pi">${ic(icon)}</span><b>${title}</b>${ct !== '' ? `<span class="ct">${ct}</span>` : ''}<div class="acts">${acts}<span class="ib" data-act="palette" title="Search">${ic('SearchIcon')}</span><span class="ib" data-go="ask" title="Ask Otto">${otto()}</span></div></div>`;
  const crumb = (go, label) => `<span class="cr" data-go="${go}">${label}</span><span class="sl">/</span>`;
  const empty = t => `<div class="dm-empty">${t}</div>`;

  /* ---------- tables: sort, filter and select ---------- */
  const T = { companies: { sort: ['n', 1], f: new Set(), sel: new Set(), q: '' }, people: { sort: ['n', 1], f: new Set(), sel: new Set(), q: '' }, deals: { sort: ['amt', -1], f: new Set(), sel: new Set(), q: '' } };
  function table(key, cols, rows, fkey, fopts, go, foot) {
    const st = T[key];
    let rs = rows.filter(r => !st.f.size || st.f.has(r[fkey]));
    if (st.q) rs = rs.filter(r => JSON.stringify(cols.map(c => c.txt ? c.txt(r) : r[c.k])).toLowerCase().includes(st.q.toLowerCase()));
    const [sk, sd] = st.sort, col = cols.find(c => c.k === sk);
    rs = rs.slice().sort((a, b) => { const x = col.sv ? col.sv(a) : a[sk], y = col.sv ? col.sv(b) : b[sk]; return (x > y ? 1 : x < y ? -1 : 0) * sd; });
    const all = rs.length && rs.every(r => st.sel.has(r.id));
    const bar = st.sel.size ? `<div class="dm-selbar"><b>${st.sel.size} selected</b><span class="sp"></span><span class="dm-btn" data-act="sel-ask" data-k="${key}">${otto(14)}Ask Otto about these</span><span class="dm-btn" data-act="sel-clear" data-k="${key}">${ic('X', 'i14')}Clear</span></div>` : '';
    const fbar = `<div class="fbar"><span class="vchip">${ic('TableIcon', 'i14')}All ${key === 'deals' ? 'opportunities' : key}</span><span class="fb${st.f.size ? ' on' : ''}" data-act="filter" data-k="${key}">${ic('FilterIcon', 'i14')}${st.f.size ? [...st.f].join(', ') : 'Filter'}</span><label class="dm-find">${ic('SearchIcon', 'i14')}<input data-input="find" data-k="${key}" value="${esc(st.q)}" placeholder="Find in ${key === 'deals' ? 'opportunities' : key}" autocomplete="off"></label><span class="sp"></span>${key === 'deals' ? `<span class="dm-seg"><span data-act="dview" data-v="board">${ic('Sliders', 'i14')}Board</span><span class="on" data-act="dview" data-v="table">${ic('TableIcon', 'i14')}Table</span></span>` : `<span class="fb">${ic('Sliders', 'i14')}Fields</span>`}</div>`;
    const thead = `<tr><th class="cb"><i class="${all ? 'on' : ''}" data-act="sel-all" data-k="${key}">${all ? ic('Check', 'i12') : ''}</i></th>${cols.map(c => `<th data-act="sort" data-k="${key}" data-c="${c.k}" class="${sk === c.k ? 'srt' : ''}"><span class="thc">${ic(c.icon, 'i13')}${c.label}${sk === c.k ? `<span class="dm-arr">${sd > 0 ? '↑' : '↓'}</span>` : ''}</span></th>`).join('')}</tr>`;
    const body = rs.map(r => `<tr data-go="${go(r)}" class="${st.sel.has(r.id) ? 'sel' : ''}${S.newPeople.has(r.id) ? ' dm-newrow' : ''}"><td class="cb"><i class="${st.sel.has(r.id) ? 'on' : ''}" data-act="sel" data-k="${key}" data-id="${r.id}">${st.sel.has(r.id) ? ic('Check', 'i12') : ''}</i></td>${cols.map(c => `<td class="${c.cls || ''}">${c.v(r)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length + 1}">${empty('Nothing matches. Clear the filter to see everything.')}</td></tr>`;
    return fbar + bar + `<div class="dbody dm-scroll"><table class="tbl dm-tbl"><thead>${thead}</thead><tbody>${body}</tbody>${foot ? `<tfoot><tr><td class="cb"></td>${foot(rs)}</tr></tfoot>` : ''}</table></div>`;
  }

  /* ---------- views ---------- */
  const V = {};
  V.companies = () => head('Building', 'Companies', 148, '', `<span class="pb" data-act="new-co">${ic('Plus', 'i14')}New</span>`) + table('companies', [
    { k: 'n', label: 'Company', icon: 'Building', v: c => `<div class="nm">${logo(c)}${c.n}</div>` },
    { k: 'd', label: 'Domain', icon: 'Globe', v: c => `<span class="lnk">${c.d}</span>` },
    { k: 'rel', label: 'Relationship', icon: 'Tag', v: c => badge(c.rel) },
    { k: 'arr', label: 'ARR', icon: 'Dollar', v: c => money(c.arr), cls: 'num' },
    { k: 'own', label: 'Owner', icon: 'Users', v: c => ownName(c.own), sv: c => TEAM[c.own][0] },
    { k: 'ltn', label: 'Last touch', icon: 'Clock', v: c => `<span class="mut">${c.lt}</span>` },
    { k: 'nm', label: 'Next meeting', icon: 'Calendar', v: c => c.nm },
  ], S.co, 'rel', REL, c => 'co:' + c.id, rs => `<td class="mut">${rs.length} of 148 companies</td><td></td><td></td><td class="num mut">${kmoney(rs.reduce((a, c) => a + c.arr, 0))} sum</td><td></td><td></td><td></td>`) + dock();

  V.people = () => head('Users', 'People', 312 + S.newPeople.size, '', `<span class="pb" data-go="ask">${ic('Radar', 'i14')}Find leads</span>`) + table('people', [
    { k: 'n', label: 'Name', icon: 'Users', v: p => `<div class="nm">${av(p.a)}${p.n}${S.newPeople.has(p.id) ? '<span class="badge t-green dm-new">New</span>' : ''}</div>` },
    { k: 'email', label: 'Email', icon: 'Mail', v: p => p.email },
    { k: 't', label: 'Title', icon: 'Briefcase', v: p => p.t },
    { k: 'co', label: 'Company', icon: 'Building', v: p => coChip(CO(p.co)), sv: p => CO(p.co).n },
    { k: 'lt', label: 'Last touch', icon: 'Clock', v: p => `<span class="mut">${p.lt}</span>` },
  ], S.pe, 't', ['CEO', 'CTO', 'COO', 'President'], p => 'pe:' + p.id) + dock();

  let dview = 'board';
  V.deals = () => {
    const acts = `<span class="pb" data-act="new-deal">${ic('Plus', 'i14')}New</span>`;
    if (dview === 'table') return head('Handshake', 'Opportunities', S.de.length, '', acts) + table('deals', [
      { k: 'n', label: 'Opportunity', icon: 'Handshake', v: d => `<b class="dm-strong">${d.n}</b>` },
      { k: 'co', label: 'Company', icon: 'Building', v: d => coChip(CO(d.co)), sv: d => CO(d.co).n },
      { k: 'st', label: 'Stage', icon: 'Branch', v: d => badge(d.st), sv: d => STAGES.indexOf(d.st) },
      { k: 'amt', label: 'Amount', icon: 'Dollar', v: d => money(d.amt), cls: 'num' },
      { k: 'close', label: 'Close date', icon: 'Calendar', v: d => d.close },
      { k: 'own', label: 'Owner', icon: 'Users', v: d => ownName(d.own), sv: d => TEAM[d.own][0] },
    ], S.de, 'st', STAGES, d => 'de:' + d.id, rs => `<td class="mut">${rs.length} opportunities</td><td></td><td></td><td class="num mut">${kmoney(rs.reduce((a, d) => a + d.amt, 0))} sum</td><td></td><td></td>`) + dock();
    const lanes = STAGES.map(s => {
      const ds = S.de.filter(d => d.st === s), sum = ds.reduce((a, d) => a + d.amt, 0);
      return `<div class="lane dm-lane" data-drop="${s}"><div class="lane-h">${badge(s)}<small>${ds.length}</small><span class="dm-sum">${kmoney(sum)}</span></div><div class="lane-b">${ds.map(d => `<div class="oc dm-oc" draggable="true" data-drag="${d.id}" data-go="de:${d.id}"><b>${d.n}</b><span>${logo(CO(d.co), 's16')}${CO(d.co).n}</span><span class="dm-ocr"><span>${ic('Dollar', 'i13')}${money(d.amt)}</span>${own(d.own)}</span></div>`).join('')}<div class="dm-dropzone">Drop here</div></div></div>`;
    }).join('');
    return head('Handshake', 'Opportunities', S.de.length, '', acts) + `<div class="fbar"><span class="vchip">${ic('Sliders', 'i14')}Pipeline</span><span class="fb mut">${ic('Sparkles', 'i14')}Drag a deal to change its stage</span><span class="sp"></span><span class="dm-seg"><span class="on" data-act="dview" data-v="board">${ic('Sliders', 'i14')}Board</span><span data-act="dview" data-v="table">${ic('TableIcon', 'i14')}Table</span></span></div><div class="dbody dm-scroll"><div class="lanes dm-lanes">${lanes}</div></div>` + dock();
  };

  /* records */
  let tab = 'overview';
  const tabs = (list, cur) => `<div class="tabs dm-tabs">${list.map(([k, icon, label, n]) => `<span class="${cur === k ? 'on' : ''}" data-act="tab" data-v="${k}">${ic(icon, 'i14')}${label}${n !== undefined ? `<small>${n}</small>` : ''}</span>`).join('')}</div>`;
  const tli = a => `<div class="tli dm-in"><span class="chip${a.k === 'gmail' || a.k === 'meet' ? ' lg' : ''}">${a.k === 'gmail' ? '<img src="/assets/logos/gmail.svg" alt="" width="16" height="16">' : a.k === 'meet' ? '<img src="/assets/logos/meet.svg" alt="" width="16" height="16">' : a.k === 'note' ? ic('StickyNote', 'i14') : ic(a.k === 'otto' ? 'Sparkles' : 'Pencil', 'i14')}</span><div><div class="t1">${a.t}</div>${a.s ? `<div class="t2">${esc(a.s)}</div>` : ''}</div><span class="tm">${a.tm}</span></div>`;
  const field = (label, val, act = '') => `<div class="dm-field${act ? ' ed' : ''}"${act}><span>${label}</span><span>${val}</span></div>`;
  function coRecord(id) {
    const c = CO(id), ds = S.de.filter(d => d.co === id), ps = S.pe.filter(p => p.co === id), ems = S.em.filter(e => e.co === id), mts = S.mt.filter(m => m.co === id), nos = S.no.filter(n => n.co === id), acts = S.act.filter(a => a.co === id);
    const T2 = [['overview', 'Building', 'Overview'], ['activity', 'Clock', 'Activity', acts.length], ['emails', 'Mail', 'Emails', ems.length], ['meetings', 'Calendar', 'Meetings', mts.length], ['deals', 'Handshake', 'Opportunities', ds.length], ['notes', 'StickyNote', 'Notes', nos.length]];
    let main = '';
    if (tab === 'overview') main = `<div class="dm-hero">${logo(c, 's40')}<div><div class="dm-h1">${c.n}</div><div class="facts"><span>${ic('Globe', 'i13')}${c.d}</span><span>${ic('MapPin', 'i13')}${c.pl}</span>${badge(c.rel)}</div></div></div>
      <div class="dm-otto">${otto(14)}<div><b>Otto's take</b><p>${ds.filter(d => d.st !== 'Won').length ? `${ds.filter(d => d.st !== 'Won').map(d => `<b>${d.n}</b> is in ${d.st}, ${money(d.amt)}. Next: ${d.next.toLowerCase()}.`).join(' ')}` : `No open deals. ${c.n} is a ${c.rel.toLowerCase()} worth ${money(c.arr)} a year.`} Last touch ${c.lt.toLowerCase()}.</p></div></div>
      ${ds.map(d => `<div class="dm-deal" data-go="de:${d.id}">${badge(d.st)}<b>${d.n}</b><span>${money(d.amt)}</span><span class="mut">Closes ${d.close}</span>${ic('ChevronRight', 'i14')}</div>`).join('')}
      <div class="dm-sec">Recent activity</div>${acts.slice(0, 4).map(tli).join('')}`;
    if (tab === 'activity') main = acts.map(tli).join('') || empty('No activity yet.');
    if (tab === 'emails') main = ems.map(emRow).join('') || empty('No emails with ' + c.n + ' yet.');
    if (tab === 'meetings') main = mts.map(mtRow).join('') || empty('No meetings with ' + c.n + ' yet.');
    if (tab === 'deals') main = ds.map(d => `<div class="dm-deal" data-go="de:${d.id}">${badge(d.st)}<b>${d.n}</b><span>${money(d.amt)}</span><span class="mut">Closes ${d.close}</span>${ic('ChevronRight', 'i14')}</div>`).join('') || empty('No opportunities yet.');
    if (tab === 'notes') main = `<form class="dm-add" data-form="note" data-co="${id}"><input name="t" placeholder="Write a note about ${c.n}, then press Enter" autocomplete="off"><button class="pb sm" type="submit">${ic('Plus', 'i14')}Add</button></form>` + (nos.map(noRow).join('') || empty('No notes yet.'));
    const side = `<div class="dm-side"><div class="dm-sec">General</div>
      ${field('Domain', c.d)}${field('Relationship', badge(c.rel) + ic('ChevronDown', 'i12'), ` data-act="pick" data-f="rel" data-id="${id}"`)}${field('Industry', c.ind + '<span class="src-o">Otto</span>')}${field('Employees', c.emp + '<span class="src-o">Otto</span>')}${field('ARR', money(c.arr))}${field('Owner', ownName(c.own) + ic('ChevronDown', 'i12'), ` data-act="pick" data-f="own" data-id="${id}"`)}
      <div class="dm-sec">People <small>${ps.length}</small></div>${ps.map(p => `<div class="dm-person" data-go="pe:${p.id}">${av(p.a, 's28')}<div><b>${p.n}</b><span>${p.t}</span></div></div>`).join('')}</div>`;
    return `<div class="win-h">${crumb('companies', 'Companies')}<span class="pi">${ic('Building')}</span><b>${c.n}</b><div class="acts"><span class="ib" data-act="step" data-d="-1" title="Previous">${ic('ChevronUp')}</span><span class="ib" data-act="step" data-d="1" title="Next">${ic('ChevronDown')}</span><span class="ib" data-go="ask" title="Ask Otto">${otto()}</span></div></div>${tabs(T2, tab)}<div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div>${side}</div>` + dock('Ask about ' + c.n);
  }
  function peRecord(id) {
    const p = PE(id), c = CO(p.co), ems = S.em.filter(e => e.from === p.a), mts = S.mt.filter(m => m.who.includes(p.a)), ds = S.de.filter(d => d.who === p.a);
    const main = `<div class="dm-hero">${av(p.a, 'dm-av48')}<div><div class="dm-h1">${p.n}</div><div class="facts"><span>${ic('Briefcase', 'i13')}${p.t}</span>${coChip(c)}<span>${ic('Mail', 'i13')}${p.email}</span></div></div></div>
      <div class="dm-otto">${otto(14)}<div><b>Otto's take</b><p>${p.n.split(' ')[0]} is the ${p.t} at ${c.n}. ${ds.length ? `Main contact on ${ds.map(d => `<b>${d.n}</b>`).join(' and ')}.` : ''} ${mts.filter(m => m.up).length ? `Next meeting: ${mts.find(m => m.up).t}, ${mts.find(m => m.up).mo} ${mts.find(m => m.up).dy}.` : ''} Last touch ${p.lt.toLowerCase()}.</p></div></div>
      ${ds.map(d => `<div class="dm-deal" data-go="de:${d.id}">${badge(d.st)}<b>${d.n}</b><span>${money(d.amt)}</span><span class="mut">Closes ${d.close}</span>${ic('ChevronRight', 'i14')}</div>`).join('')}
      <div class="dm-sec">Emails</div>${ems.map(emRow).join('') || empty('No emails yet.')}<div class="dm-sec">Meetings</div>${mts.map(mtRow).join('') || empty('No meetings yet.')}`;
    const side = `<div class="dm-side"><div class="dm-sec">About</div>${field('Email', p.email)}${field('Title', p.t)}${field('Company', coChip(c))}${field('Location', c.pl)}${field('Last touch', p.lt)}</div>`;
    return `<div class="win-h">${crumb('people', 'People')}<span class="pi">${ic('Users')}</span><b>${p.n}</b><div class="acts"><span class="ib" data-go="ask">${otto()}</span></div></div><div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div>${side}</div>` + dock('Ask about ' + p.n.split(' ')[0]);
  }
  function deRecord(id) {
    const d = DE(id), c = CO(d.co), p = PA(d.who), acts = S.act.filter(a => a.co === d.co);
    const path = `<div class="dm-path">${STAGES.map((s, k) => `<span class="${s === d.st ? 'cur' : STAGES.indexOf(d.st) > k ? 'pass' : ''}" data-act="stage" data-id="${id}" data-v="${s}">${STAGES.indexOf(d.st) > k ? ic('Check', 'i12') : ''}${s}</span>`).join('')}</div>`;
    const main = `<div class="dm-hero"><span class="dm-tile">${ic('Handshake')}</span><div><div class="dm-h1">${d.n}</div><div class="facts">${coChip(c)}<span>${ic('Dollar', 'i13')}${money(d.amt)}</span><span>${ic('Calendar', 'i13')}Closes ${d.close}</span></div></div></div>${path}
      <div class="dm-otto">${otto(14)}<div><b>Next step</b><p>${d.next}. ${d.st === 'Won' ? 'This one is won. The handoff workflow booked the kickoff.' : `Otto can draft it for ${p.n.split(' ')[0]}.`}</p>${d.st !== 'Won' ? `<span class="dm-btn" data-act="draft" data-id="${id}">${ic('Sparkles', 'i14')}Draft it</span>` : ''}</div></div>
      <div class="dm-sec">Activity</div>${acts.map(tli).join('')}`;
    const side = `<div class="dm-side"><div class="dm-sec">Details</div>${field('Stage', badge(d.st) + ic('ChevronDown', 'i12'), ` data-act="pick" data-f="st" data-id="${id}"`)}${field('Amount', money(d.amt))}${field('Close date', d.close)}${field('Owner', ownName(d.own) + ic('ChevronDown', 'i12'), ` data-act="pick" data-f="downer" data-id="${id}"`)}${field('Company', coChip(c))}
      <div class="dm-sec">Contact</div><div class="dm-person" data-go="pe:${p.id}">${av(p.a, 's28')}<div><b>${p.n}</b><span>${p.t}</span></div></div></div>`;
    return `<div class="win-h">${crumb('deals', 'Opportunities')}<span class="pi">${ic('Handshake')}</span><b>${d.n}</b><div class="acts"><span class="ib" data-go="ask">${otto()}</span></div></div><div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div>${side}</div>` + dock('Ask about this deal');
  }

  /* meetings */
  const mtRow = m => { const c = CO(m.co); return `<div class="mrow dm-row" data-go="mt:${m.id}"><span class="datetile"><i>${m.mo}</i><b>${m.dy}</b></span><div class="tx"><b>${m.t}</b><small>${c.n} · ${m.dur}</small></div><span class="dm-avs">${m.who.map(a => av(a, 's20')).join('')}</span>${m.up ? '<span class="badge t-blue">Brief ready</span>' : m.done ? '<span class="badge t-green">Updates applied</span>' : '<span class="badge t-amber">Updates to review</span>'}<span class="tm">${m.tm}</span></div>`; };
  let mfilter = 'up';
  V.meetings = () => head('Calendar', 'Meetings', S.mt.length) + `<div class="fbar">${seg('mf', [['up', 'Upcoming'], ['past', 'Past']], mfilter)}<span class="sp"></span><span class="fb">${ic('Video', 'i14')}Recorder on for Zoom, Meet and Teams</span></div><div class="dbody dm-scroll"><div class="mini dm-list">${S.mt.filter(m => mfilter === 'up' ? m.up : !m.up).map(mtRow).join('')}</div></div>` + dock();
  function mtPage(id) {
    const m = S.mt.find(x => x.id === id), c = CO(m.co);
    const people = `<div class="dm-avs dm-avs-l">${m.who.map(a => `<span class="dm-person sm" data-go="pe:${PA(a).id}">${av(a, 's20')}${PA(a).n}</span>`).join('')}</div>`;
    let main;
    if (m.up) main = `<div class="dm-otto">${otto(14)}<div><b>Brief for ${m.t}</b><p>Prepared by Otto from the last call, ${S.em.filter(e => e.co === m.co).length} emails and the record.</p></div></div><ul class="dm-brief">${m.brief.map(b => `<li>${ic('ChevronRight', 'i12')}${b}</li>`).join('')}</ul><div class="dm-sec">Open deals</div>${S.de.filter(d => d.co === m.co && d.st !== 'Won').map(d => `<div class="dm-deal" data-go="de:${d.id}">${badge(d.st)}<b>${d.n}</b><span>${money(d.amt)}</span>${ic('ChevronRight', 'i14')}</div>`).join('') || empty('No open deals.')}`;
    else main = `<div class="dm-sec">Summary ${otto(13)}</div><p class="dm-p">${m.sum}</p>
      <div class="dm-sec">Record updates to review <small>${m.upd.filter(u => !u[4]).length}</small></div>${m.upd.map((u, k) => `<div class="urow dm-urow${u[4] ? ' ok' : ''}"><div class="tx">Set <b>${u[0]}</b> to <b>${u[0] === 'Amount' ? money(u[1]) : u[1]}</b><small>"${u[2]}"</small></div>${u[4] ? `<span class="dm-applied">${ic('Check', 'i12')}Applied</span>` : `<span class="ibp" data-act="apply" data-id="${id}" data-k="${k}" title="Apply">${ic('Check', 'i14')}</span><span class="ibg" data-act="skip" data-id="${id}" data-k="${k}" title="Skip">${ic('X', 'i14')}</span>`}</div>`).join('')}
      ${m.upd.some(u => !u[4]) ? `<span class="dm-btn dm-apply-all" data-act="apply-all" data-id="${id}">${ic('Check', 'i14')}Apply all</span>` : ''}
      <div class="dm-sec">Action items</div>${m.acts.map((a, k) => `<label class="dm-check"><input type="checkbox" data-act="todo" data-id="${id}" data-k="${k}"${(m.todo || [])[k] ? ' checked' : ''}><span>${a}</span></label>`).join('')}`;
    const side = m.up ? `<div class="dm-side"><div class="dm-sec">Details</div>${field('When', `${m.mo} ${m.dy}, ${m.tm}`)}${field('Length', m.dur)}${field('Company', coChip(c))}${field('Recorder', '<span class="badge t-green">On</span>')}</div>`
      : `<div class="dm-side dm-tr"><div class="dm-sec">Transcript</div>${m.tr.map(([a, t]) => `<div class="dm-line">${av(a, 's20')}<div><b>${a === 'JR' || TEAM[a] ? TEAM[a][0] : PA(a).n}</b><p>${t}</p></div></div>`).join('')}</div>`;
    return `<div class="win-h">${crumb('meetings', 'Meetings')}<span class="pi">${ic('Calendar')}</span><b>${m.t}</b><div class="acts">${badge(m.up ? 'Upcoming' : 'Past')}</div></div><div class="dm-mh">${coChip(c)}<span class="mut">${m.mo} ${m.dy}, ${m.tm} · ${m.dur}</span>${people}</div><div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div>${side}</div>` + dock('Ask about this meeting');
  }

  /* emails */
  const emRow = e => { const p = PA(e.from), c = CO(e.co); return `<div class="mrow dm-row" data-go="em:${e.id}">${av(p.a, 's28')}<div class="tx"><b>${p.n} <span class="mut">· ${c.n}</span></b><small>${e.s}</small></div>${e.need ? '<span class="badge t-yellow">Needs reply</span>' : e.sent ? '<span class="badge t-green">Replied</span>' : ''}<span class="tm">${e.tm}</span></div>`; };
  let efilter = 'all';
  V.emails = () => head('Mail', 'Emails', '2,184') + `<div class="fbar">${seg('ef', [['all', 'All'], ['need', `Needs reply <small>${S.em.filter(e => e.need).length}</small>`], ['sent', 'Replied']], efilter)}<span class="sp"></span><span class="fb">${ic('Mail', 'i14')}Gmail and Outlook synced</span></div><div class="dbody dm-scroll"><div class="mini dm-list">${S.em.filter(e => efilter === 'all' || (efilter === 'need' ? e.need : e.sent)).map(emRow).join('') || empty('All caught up.')}</div></div>` + dock();
  function emPage(id) {
    const e = S.em.find(x => x.id === id), c = CO(e.co);
    const name = a => TEAM[a] ? TEAM[a][0] : PA(a).n;
    const msgs = e.msgs.map(([a, t]) => `<div class="dm-msg${TEAM[a] ? ' me' : ''}">${av(a, 's28')}<div><b>${name(a)}</b><p>${esc(t)}</p></div></div>`).join('');
    const reply = e.need ? `<div class="dm-draft"><div class="dm-sec">${otto(13)} Draft by Otto <small>in your tone, from the pricing page</small></div><textarea data-input="draft" data-id="${id}">${esc(e.draft)}</textarea><div class="dm-row-btns"><span class="pb sm" data-act="send" data-id="${id}">${ic('ArrowUp', 'i14')}Send</span><span class="dm-btn" data-act="redraft" data-id="${id}">${ic('Sparkles', 'i14')}Shorter</span></div></div>` : '';
    return `<div class="win-h">${crumb('emails', 'Emails')}<span class="pi">${ic('Mail')}</span><b>${e.s}</b><div class="acts">${coChip(c)}</div></div><div class="dbody dm-scroll dm-thread">${msgs}${reply}</div>`;
  }

  /* notes */
  const noRow = n => `<div class="mrow dm-row" data-go="no:${n.id}"><span class="chip c-yel">${ic('StickyNote', 'i14')}</span><div class="tx"><b>${esc(n.t)}</b><small>${esc(n.b)}</small></div>${coChip(CO(n.co))}<span class="tm">${n.tm}</span></div>`;
  V.notes = () => head('StickyNote', 'Notes', 64 + S.no.length - 6, '', `<span class="pb" data-act="new-note">${ic('Plus', 'i14')}New note</span>`) + `<div class="dbody dm-scroll"><div class="mini dm-list">${S.no.map(noRow).join('')}</div></div>` + dock();
  function noPage(id) {
    const n = S.no.find(x => x.id === id), c = CO(n.co);
    return `<div class="win-h">${crumb('notes', 'Notes')}<span class="pi">${ic('StickyNote')}</span><b>${esc(n.t)}</b><div class="acts">${coChip(c)}<span class="dm-saved">${ic('Check', 'i12')}Saved</span></div></div><div class="dbody dm-scroll"><div class="dm-doc"><div class="dm-meta">${ownName(n.by)}<span class="mut">· ${n.tm}</span></div><h3 contenteditable="true" spellcheck="false" data-edit="t" data-id="${id}">${esc(n.t)}</h3><div class="dm-ed" contenteditable="true" spellcheck="false" data-edit="b" data-id="${id}">${esc(n.b)}</div><p class="dm-hint">${ic('Pencil', 'i12')}Click to edit. Changes save as you type.</p></div></div>`;
  }

  /* knowledge */
  let kcur = 'k1';
  V.k = () => { const d = S.kb.find(k => k.id === kcur); return head('Book', 'Knowledge', S.kb.length, '', `<span class="pb">${ic('Upload', 'i14')}Add</span>`) + `<div class="dbody dm-split"><div class="dm-pages">${S.kb.map(k => `<div class="dm-page${k.id === kcur ? ' on' : ''}" data-act="kb" data-id="${k.id}">${ic('Book', 'i14')}<div><b>${k.t}</b><small>${k.sub}</small></div></div>`).join('')}</div><div class="dm-scroll dm-docwrap"><div class="dm-doc dm-in"><div class="dm-meta">${ownName(d.by)}<span class="mut">· ${d.sub}</span><span class="badge t-green">Otto reads this</span></div><h3>${d.t}</h3>${d.body.map(([t, x]) => t === 'h' ? `<h4>${x}</h4>` : `<p>${x}</p>`).join('')}</div></div></div>` + dock('Ask about ' + d.t.toLowerCase()); };

  /* skills */
  let scur = 's1';
  V.s = () => { const s = S.sk.find(k => k.id === scur); return head('Box', 'Skills', 15, '', `<span class="pb">${ic('Plus', 'i14')}New skill</span>`) + `<div class="dbody dm-split"><div class="dm-pages">${S.sk.map(k => `<div class="dm-page${k.id === scur ? ' on' : ''}" data-act="sk" data-id="${k.id}">${ic('Box', 'i14')}<div><b>${k.n}</b><small>${k.d}</small></div>${badge(k.sc)}</div>`).join('')}</div><div class="dm-scroll dm-docwrap"><div class="dm-doc dm-in"><div class="dm-meta"><span class="kbd">/${s.n.toLowerCase().replace(/ /g, '-')}</span>${badge(s.sc)}</div><h3>${s.n}</h3><p>${s.d}.</p><h4>Steps</h4><ol class="dm-steps">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol><h4>Try it</h4><div class="dm-try" data-act="run-skill" data-id="${s.id}"><span class="skchip">${ic('Box', 'i12')}${s.n}</span>${s.ask}<span class="send">${ic('ArrowUp')}</span></div></div></div></div>`; };

  /* workflows */
  V.workflows = () => head('Bot', 'Workflows', S.wf.length, '', `<span class="pb">${ic('Plus', 'i14')}New</span>`) + `<div class="dbody dm-scroll"><div class="mini dm-list">${S.wf.map(w => `<div class="mrow dm-row" data-go="wf:${w.id}"><span class="chip">${ic('Workflow', 'i14')}</span><div class="tx"><b>${w.n}</b><small>${w.trig}</small></div><span class="mut dm-runs">${w.runs} runs this week</span>${toggle('wf', w.id, w.live)}</div>`).join('')}</div></div>` + dock();
  function wfPage(id) {
    const w = S.wf.find(x => x.id === id);
    const runs = S.de.slice(0, 5).map((d, k) => `<div class="dm-run">${logo(CO(d.co), 's16')}<span>${CO(d.co).n}</span><span class="mut">${['2m ago', '1h ago', '3h ago', 'Yesterday', 'Nov 20'][k]}</span>${badge(['Waiting', 'Replied', 'Waiting', 'Notified', 'Replied'][k])}</div>`).join('');
    return `<div class="win-h">${crumb('workflows', 'Workflows')}<span class="pi">${ic('Workflow')}</span><b>${w.n}</b><div class="acts">${toggle('wf', w.id, w.live)}</div></div><div class="dbody dm-rec"><div class="dm-main dm-scroll dm-canvas"><div class="flow dm-flow${w.live ? ' live' : ''}"><div class="trig"><div class="k">${ic('Workflow', 'i14')}Starts</div><b>${w.trig}</b><small>${w.live ? 'Live' : 'Paused'}</small></div>${w.steps.map(([icn, b, s], k) => `<div class="conn">${w.live ? `<span class="flowdot" style="animation-delay:${k * .5}s"></span>` : ''}</div><div class="step"><span class="tile">${ic(icn, 'i14')}</span><div><b>${b}</b><small>${s}</small></div></div>`).join('')}</div></div><div class="dm-side"><div class="dm-sec">Recent runs <small>${w.runs}</small></div>${runs}</div></div>`;
  }

  /* settings */
  V.settings = () => head('Settings', 'Settings') + `<div class="dbody dm-scroll"><div class="dm-set">
    <div class="dm-sec">Workspace</div><div class="dm-card">${field('Name', 'Northwind')}${field('Plan', '<span class="badge t-violet">Pro</span><span class="mut">5 seats, renews Jan 12</span>')}${field('Otto', '<span class="badge t-green">On for everyone</span>')}</div>
    <div class="dm-sec">Members <small>${Object.keys(TEAM).length}</small></div><div class="dm-card">${Object.entries(TEAM).map(([k, t]) => `<div class="dm-member">${own(k)}<div><b>${t[0]}</b><small>${t[1]}</small></div><span class="badge">${k === 'AO' ? 'Owner' : k === 'TL' ? 'Admin' : 'Member'}</span></div>`).join('')}</div>
    <div class="dm-sec">Connected apps</div><div class="dm-card dm-apps">${S.apps.map(([n, f, on], k) => `<div class="dm-app"><span class="chip lg"><img src="/assets/logos/${f}" alt="" width="16" height="16"></span><b>${n}</b><span class="mut">${on ? 'Connected' : 'Not connected'}</span>${toggle('app', k, on)}</div>`).join('')}</div>
  </div></div>`;

  const seg = (k, opts, cur) => `<span class="dm-seg">${opts.map(([v, l]) => `<span class="${cur === v ? 'on' : ''}" data-act="${k}" data-v="${v}">${l}</span>`).join('')}</span>`;
  const toggle = (k, id, on) => `<span class="dm-tog${on ? ' on' : ''}" data-act="tog" data-k="${k}" data-id="${id}" role="switch" aria-checked="${on ? 'true' : 'false'}"><i></i></span>`;

  /* ---------- Ask Otto: a chat that answers from the demo's data ---------- */
  const SUGG = ['Which deals need me this week?', 'Find founders of fast-growing software companies', 'What will we close in December?', 'Summarize Stripe', 'Prep me for my next meeting', 'Draft a follow-up to Ivan'];
  V.ask = () => {
    const body = S.chat.length ? S.chat.map(m => m.u ? `<div class="um dm-in"><div class="stack">${m.skill ? `<span class="skchip">${ic('Box', 'i12')}${m.skill}</span>` : ''}<div class="ubub">${esc(m.t)}</div></div>${av('JR', 's28')}</div>` : `<div class="om dm-in"><svg><use href="#otto"/></svg><div class="body">${m.busy ? `<div class="dm-think"><span class="dm-spn"></span><span class="dm-shim">${m.busy}</span></div>` : m.h}</div></div>`).join('')
      : `<div class="dm-hello"><span class="dm-ottoxl">${otto(40)}</span><h3>What can I do for you, Jonah?</h3><p>Ask about any account, deal or person. I read every email, call and note in Northwind.</p><div class="dm-sugg">${SUGG.map(s => `<span data-act="ask" data-q="${esc(s)}">${esc(s)}</span>`).join('')}</div></div>`;
    return `<div class="win-h"><span class="pi">${ic('Sparkles')}</span><b>Ask Otto</b>${S.chat.length ? `<div class="acts"><span class="dm-btn" data-act="new-chat">${ic('Plus', 'i14')}New chat</span></div>` : ''}</div><div class="dbody dm-scroll dm-chat"><div class="dm-chatin">${body}${S.chat.length && !S.chat[S.chat.length - 1].busy ? `<div class="dm-sugg sm">${SUGG.filter(s => !S.chat.some(m => m.t === s)).slice(0, 3).map(s => `<span data-act="ask" data-q="${esc(s)}">${esc(s)}</span>`).join('')}</div>` : ''}</div></div><form class="dock dm-dock dm-askdock" data-form="dock"><input name="q" placeholder="Ask anything, or type / for skills" autocomplete="off" aria-label="Ask Otto"><span class="ib">${ic('Plus')}</span><button class="send" type="submit" aria-label="Send">${ic('ArrowUp')}</button></form>`;
  };
  function answer(q) {
    const s = q.toLowerCase();
    const co = S.co.find(c => s.includes(c.n.toLowerCase()));
    const pe = S.pe.find(p => s.includes(p.n.split(' ')[0].toLowerCase()));
    const open = S.de.filter(d => d.st !== 'Won');
    const dealRow = d => `<div class="lrow dm-lr" data-go="de:${d.id}">${logo(CO(d.co), 's20')}<b>${d.n}</b><span>${d.st}</span><em>${money(d.amt)}</em></div>`;
    if (/lead|find|founder|heads? of|people like/.test(s)) {
      const L = [['GR', 'Guillermo Rauch', 'CEO, Vercel', 'p2'], ['DF', 'Dylan Field', 'CEO, Figma', 'p7'], ['IZ', 'Ivan Zhao', 'CEO, Notion', 'p3'], ['DA', 'Dario Amodei', 'CEO, Anthropic', 'p13']];
      return { busy: 'Searching 2.4M people and companies', h: `<p>Founders and CEOs at fast-growing software companies, ranked by fit. All four are already in Northwind, so I matched them to their records.</p><div class="card"><div class="card-h">${ic('Radar', 'i14')}Leads<span class="r">4 found</span></div><div class="card-b">${L.map(l => `<div class="lrow dm-lr" data-go="pe:${l[3]}">${av(l[0], 's28')}<b>${l[1]}</b><span>${l[2]}</span><em>In CRM</em></div>`).join('')}</div><div class="card-f"><span class="pb sm" data-act="save-leads">${ic('Check', 'i14')}Add to a list</span><span class="mut" style="font-size:12px">Work emails found for all 4</span></div></div>` };
    }
    if (/close|forecast|december|month|quarter/.test(s)) {
      const neg = S.de.filter(d => d.st === 'Negotiation'), pro = S.de.filter(d => d.st === 'Proposal');
      const likely = neg.reduce((a, d) => a + d.amt, 0) + Math.round(pro.reduce((a, d) => a + d.amt, 0) * .4 / 1000) * 1000;
      const max = Math.max(...[...neg, ...pro].map(d => d.amt));
      return { busy: 'Running code on ' + open.length + ' open opportunities', h: `<p><b>${money(likely)}</b> is likely to close in December, from ${neg.length} deals in Negotiation and part of ${pro.length} in Proposal.</p><div class="card"><div class="card-h">${ic('Dollar', 'i14')}December forecast<span class="r">${kmoney(likely)}</span></div><div class="card-b">${[...neg, ...pro].sort((a, b) => b.amt - a.amt).map(d => `<div class="dm-barrow" data-go="de:${d.id}"><span>${CO(d.co).n}</span><i style="--w:${Math.round(d.amt / max * 100)}%" class="${d.st === 'Negotiation' ? 'hot' : ''}"></i><em>${kmoney(d.amt)}</em></div>`).join('')}</div></div><p class="mut" style="font-size:12.5px;margin-top:8px">Dark bars are in Negotiation. Drag deals on the board and ask again, the number follows.</p>` };
    }
    if (/need|this week|attention|pipeline|stall|deals/.test(s)) {
      const late = open.filter(d => ['d3', 'd5', 'd4', 'd6'].includes(d.id));
      return { busy: 'Reading ' + open.length + ' opportunities and 41 emails', h: `<p>${late.length} deals need you this week.</p><div class="card"><div class="card-h">${ic('Bell', 'i14')}Needs attention<span class="r">${late.length}</span></div><div class="card-b">${late.map(dealRow).join('')}</div></div><ul class="dm-ul"><li><b>Workspace migration</b> is past its close date, and Ivan opened the proposal 3 times since Monday.</li><li><b>Design org rollout</b> has waited on legal since Tuesday.</li><li><b>Global sales team</b> needs pricing by Friday. Patrick signs off himself.</li></ul><p>A follow-up to Ivan is drafted and ready for you to send.</p><span class="dm-btn" data-go="em:e2">${ic('Mail', 'i14')}Open the draft</span>` };
    }
    if (/prep|brief|next meeting/.test(s)) {
      const m = S.mt.find(x => x.up);
      return { busy: 'Reading the last call and emails', h: `<p>Your next meeting is <b>${m.t}</b> with ${CO(m.co).n}, ${m.mo} ${m.dy} at ${m.tm}.</p><div class="card"><div class="card-h">${ic('Calendar', 'i14')}Brief<span class="r">${m.dur}</span></div><div class="card-b">${m.brief.map(b => `<div class="lrow dm-lr">${ic('ChevronRight', 'i12')}<span style="color:var(--t1)">${b}</span></div>`).join('')}</div><div class="card-f"><span class="pb sm" data-go="mt:${m.id}">${ic('Calendar', 'i14')}Open the meeting</span></div></div>` };
    }
    if (/draft|email|follow|write|reply/.test(s)) {
      const e = S.em.find(x => pe ? x.from === pe.a && x.need : x.need) || S.em.find(x => x.need) || S.em[1];
      if (!e) return { busy: 'Reading your inbox', h: '<p>You are all caught up. Nothing needs a reply.</p>' };
      return { busy: 'Reading the thread and the tone page', h: `<p>Here is a reply to ${PA(e.from).n.split(' ')[0]} in your tone, using the pricing page.</p><div class="card"><div class="card-h">${ic('Mail', 'i14')}Re: ${e.s}<span class="r">Draft</span></div><div class="card-b" style="color:var(--t1)">${esc(e.draft)}</div><div class="card-f"><span class="pb sm" data-go="em:${e.id}">${ic('Mail', 'i14')}Review and send</span></div></div>` };
    }
    if (co || pe) {
      const c = co || CO(pe.co), ds = S.de.filter(d => d.co === c.id), nx = S.mt.find(m => m.co === c.id && m.up);
      return { busy: `Reading ${c.n}: emails, calls and notes`, h: `<p><b>${c.n}</b> is a ${c.rel.toLowerCase()}${c.arr ? ` worth ${money(c.arr)} a year` : ''}, owned by ${TEAM[c.own][0]}. Last touch ${c.lt.toLowerCase()}.${nx ? ` Next meeting: ${nx.t}, ${nx.mo} ${nx.dy}.` : ''}</p>${ds.length ? `<div class="card"><div class="card-h">${ic('Handshake', 'i14')}Opportunities<span class="r">${ds.length}</span></div><div class="card-b">${ds.map(dealRow).join('')}</div><div class="card-f"><span class="pb sm" data-go="co:${c.id}">${ic('Building', 'i14')}Open ${c.n}</span></div></div>` : ''}` };
    }
    return { busy: 'Reading Northwind', h: `<p>Here is where things stand. ${open.length} open deals worth ${kmoney(open.reduce((a, d) => a + d.amt, 0))}, ${S.em.filter(e => e.need).length} emails that need a reply and ${S.mt.filter(m => m.up).length} meetings coming up.</p><div class="card"><div class="card-h">${ic('Handshake', 'i14')}Biggest open deals</div><div class="card-b">${open.sort((a, b) => b.amt - a.amt).slice(0, 4).map(dealRow).join('')}</div></div><p class="mut" style="font-size:12.5px;margin-top:8px">Try asking about a company, a person, your forecast or your next meeting.</p>` };
  }
  let asking = 0;
  function ask(q, skill) {
    q = q.trim(); if (!q || asking) return;
    S.chat.push({ u: 1, t: q, skill });
    const a = answer(q), m = { busy: a.busy };
    S.chat.push(m); asking = 1;
    nav('ask', true);
    setTimeout(() => { m.busy = null; m.h = a.h; asking = 0; if (route === 'ask') render(); }, RM ? 0 : 1300);
  }

  /* ---------- ⌘K command bar ---------- */
  let pal = null;
  function palette() {
    closeMenus();
    const items = [
      ...[['ask', 'Sparkles', 'Ask Otto'], ['companies', 'Building', 'Companies'], ['people', 'Users', 'People'], ['deals', 'Handshake', 'Opportunities'], ['meetings', 'Calendar', 'Meetings'], ['emails', 'Mail', 'Emails'], ['notes', 'StickyNote', 'Notes'], ['k', 'Book', 'Knowledge'], ['s', 'Box', 'Skills'], ['workflows', 'Bot', 'Workflows'], ['settings', 'Settings', 'Settings']].map(([g, i, n]) => ({ g, i: ic(i, 'i14'), n, grp: 'Go to' })),
      ...S.co.map(c => ({ g: 'co:' + c.id, i: logo(c, 's16'), n: c.n, sub: c.d, grp: 'Companies' })),
      ...S.pe.map(p => ({ g: 'pe:' + p.id, i: av(p.a, 's20'), n: p.n, sub: `${p.t}, ${CO(p.co).n}`, grp: 'People' })),
      ...S.de.map(d => ({ g: 'de:' + d.id, i: ic('Handshake', 'i14'), n: d.n, sub: `${CO(d.co).n} · ${d.st}`, grp: 'Opportunities' })),
    ];
    const el = document.createElement('div');
    el.className = 'dm-pal';
    el.innerHTML = `<div class="dm-palbox" role="dialog" aria-label="Search"><label class="dm-palin">${ic('SearchIcon')}<input placeholder="Search companies, people, deals, or jump to a page" autocomplete="off"><span class="kbd">esc</span></label><div class="dm-palres"></div></div>`;
    page.appendChild(el);
    const inp = $('input', el), res = $('.dm-palres', el);
    let cur = 0, shown = [];
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      shown = (q ? items.filter(it => (it.n + ' ' + (it.sub || '')).toLowerCase().includes(q)) : items.filter(it => it.grp === 'Go to' || it.grp === 'Companies')).slice(0, 12);
      cur = Math.min(cur, Math.max(0, shown.length - 1));
      let g = '';
      res.innerHTML = shown.map((it, k) => (it.grp !== g ? `<div class="dm-palg">${g = it.grp}</div>` : '') + `<div class="dm-pali${k === cur ? ' on' : ''}" data-k="${k}">${it.i}<b>${it.n}</b>${it.sub ? `<span>${it.sub}</span>` : ''}${k === cur ? '<span class="kbd">↵</span>' : ''}</div>`).join('') || `<div class="dm-palnone">No results. Press Enter to ask Otto instead.</div>`;
      faces(res);
    };
    const pick = k => { const it = shown[k]; closePal(); if (it) nav(it.g); else if (inp.value.trim()) ask(inp.value); };
    inp.addEventListener('input', () => { cur = 0; draw(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { cur = Math.min(shown.length - 1, cur + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { cur = Math.max(0, cur - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(cur); }
      else if (e.key === 'Escape') closePal();
    });
    res.addEventListener('click', e => { const r = e.target.closest('.dm-pali'); if (r) pick(+r.dataset.k); });
    el.addEventListener('mousedown', e => { if (e.target === el) closePal(); });
    pal = el; draw(); inp.focus({ preventScroll: true });
  }
  const closePal = () => { if (pal) { pal.remove(); pal = null; } };

  /* ---------- menus, toasts ---------- */
  let menu = null;
  function closeMenus() { if (menu) { menu.remove(); menu = null; } }
  function openMenu(anchor, opts, cur, onPick, multi) {
    closeMenus();
    const pr = page.getBoundingClientRect(), r = anchor.getBoundingClientRect(), s = pr.width / page.offsetWidth || 1;
    const el = document.createElement('div');
    el.className = 'dm-menu';
    el.style.left = Math.min((r.left - pr.left) / s, page.offsetWidth - 230) + 'px';
    el.style.top = ((r.bottom - pr.top) / s + 6) + 'px';
    const draw = () => { el.innerHTML = opts.map(([v, l]) => `<div class="dm-mi${(multi ? cur.has(v) : cur === v) ? ' on' : ''}" data-v="${esc(v)}">${l}${(multi ? cur.has(v) : cur === v) ? ic('Check', 'i14') : ''}</div>`).join('') + (multi && cur.size ? `<div class="dm-mi dm-clear" data-v="__clear">Clear filter</div>` : ''); faces(el); };
    draw();
    el.addEventListener('click', e => {
      const it = e.target.closest('.dm-mi'); if (!it) return; e.stopPropagation();
      if (multi) { if (it.dataset.v === '__clear') cur.clear(); else cur.has(it.dataset.v) ? cur.delete(it.dataset.v) : cur.add(it.dataset.v); onPick(); draw(); }
      else { closeMenus(); onPick(it.dataset.v); }
    });
    page.appendChild(el); menu = el;
  }
  function toast(html) {
    // toasts live on the shell, outside the page, so a redraw does not clear them
    let box = app.querySelector('.dm-toasts');
    if (!box) { box = document.createElement('div'); box.className = 'dm-toasts'; app.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'dm-toast';
    t.innerHTML = `<span class="dm-tic">${ic('Check', 'i12')}</span><div>${html}</div>`;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }
  const log = (co, t, s, k = 'otto') => S.act.unshift({ co, k, t, s, tm: 'Just now' });

  /* ---------- routing and render ---------- */
  let route = 'companies';
  const NAV = { co: 'companies', pe: 'people', de: 'deals', mt: 'meetings', em: 'emails', no: 'notes', wf: 'workflows' };
  const faces = root => { if (O.faces) O.faces(root); };
  function render(keepScroll) {
    const sc = keepScroll && $('.dm-scroll') ? $$('.dm-scroll').map(e => e.scrollTop) : null;
    closeMenus(); closePal();
    const [k, id] = route.split(':');
    page.innerHTML = id ? ({ co: coRecord, pe: peRecord, de: deRecord, mt: mtPage, em: emPage, no: noPage, wf: wfPage }[k] || V.companies)(id) : (V[k] || V.companies)();
    const navk = id ? NAV[k] : k;
    app.querySelectorAll('.sb .lk').forEach(l => l.classList.toggle('on', l.dataset.v === navk));
    faces(page);
    if (sc) $$('.dm-scroll').forEach((e, i) => { e.scrollTop = sc[i] || 0; });
    if (route === 'ask') { const c = $('.dm-chat'); if (c) c.scrollTop = c.scrollHeight; }
  }
  function nav(r, keep) {
    const same = r === route;
    if (!same && (!/^(co|pe|de):/.test(r) || r.split(':')[0] !== route.split(':')[0])) tab = 'overview';
    route = r; render(keep && same);
    const b = $('.dbody'); if (b && !RM) { b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); }
  }

  /* ---------- events ---------- */
  app.addEventListener('click', e => {
    const t = e.target;
    if (menu && !t.closest('.dm-menu')) closeMenus();
    if (t.closest('.search')) { palette(); return; }
    const a = t.closest('[data-act]');
    if (a && app.contains(a)) { act(a, e); return; }
    if (t.closest('input,textarea,[contenteditable],.dm-dock')) return;
    const g = t.closest('[data-go],.lk[data-v]');
    if (g && app.contains(g)) nav(g.dataset.go || g.dataset.v);
  });
  function act(a, e) {
    const d = a.dataset, k = d.act;
    const keep = () => render(true);
    if (k === 'palette') return palette();
    if (k === 'sort') { const st = T[d.k]; st.sort = st.sort[0] === d.c ? [d.c, -st.sort[1]] : [d.c, 1]; return keep(); }
    if (k === 'filter') {
      const st = T[d.k], opts = (d.k === 'companies' ? REL : d.k === 'deals' ? STAGES : ['CEO', 'CTO', 'COO', 'President']).map(o => [o, d.k === 'people' ? o : badge(o)]);
      // the table redraws under the open menu, so it reopens on the new filter button
      const again = () => { keep(); const b = $(`[data-act="filter"][data-k="${d.k}"]`); if (b) openMenu(b, opts, st.f, again, true); };
      return openMenu(a, opts, st.f, again, true);
    }
    if (k === 'sel') { e.stopPropagation(); const st = T[d.k]; st.sel.has(d.id) ? st.sel.delete(d.id) : st.sel.add(d.id); return keep(); }
    if (k === 'sel-all') { const st = T[d.k], ids = $$('tbody tr [data-act="sel"]').map(x => x.dataset.id); const all = ids.every(i => st.sel.has(i)); ids.forEach(i => all ? st.sel.delete(i) : st.sel.add(i)); return keep(); }
    if (k === 'sel-clear') { T[d.k].sel.clear(); return keep(); }
    if (k === 'sel-ask') { const st = T[d.k], names = [...st.sel].map(i => (d.k === 'companies' ? CO(i) : d.k === 'people' ? PE(i) : DE(i)).n); st.sel.clear(); return ask('Summarize ' + names.slice(0, 3).join(', ')); }
    if (k === 'dview') { dview = d.v; return keep(); }
    if (k === 'tab') { tab = d.v; return keep(); }
    if (k === 'step') { const id = route.split(':')[1], i = S.co.findIndex(c => c.id === id); return nav('co:' + S.co[(i + +d.d + S.co.length) % S.co.length].id); }
    if (k === 'pick') {
      if (d.f === 'rel') { const c = CO(d.id); return openMenu(a, REL.map(o => [o, badge(o)]), c.rel, v => { c.rel = v; log(c.id, `<b>Jonah</b> set <b>Relationship</b> to ${v}`, '', 'edit'); toast(`<b>${c.n}</b> is now a ${v.toLowerCase()}`); keep(); }); }
      if (d.f === 'own' || d.f === 'downer') { const x = d.f === 'own' ? CO(d.id) : DE(d.id); return openMenu(a, Object.keys(TEAM).map(t => [t, ownName(t)]), x.own, v => { x.own = v; toast(`Owner set to <b>${TEAM[v][0]}</b>`); keep(); }); }
      if (d.f === 'st') { const x = DE(d.id); return openMenu(a, STAGES.map(o => [o, badge(o)]), x.st, v => setStage(x, v)); }
    }
    if (k === 'stage') return setStage(DE(d.id), d.v);
    if (k === 'draft') { const x = DE(d.id); return ask(`Draft a follow-up to ${PA(x.who).n.split(' ')[0]}`); }
    if (k === 'mf') { mfilter = d.v; return keep(); }
    if (k === 'ef') { efilter = d.v; return keep(); }
    if (k === 'apply' || k === 'skip') { const m = S.mt.find(x => x.id === d.id); applyUpd(m, +d.k, k === 'apply'); return keep(); }
    if (k === 'apply-all') { const m = S.mt.find(x => x.id === d.id), left = m.upd.filter(u => !u[4]).length; m.upd.forEach((u, i) => { if (!u[4]) applyUpd(m, i, true, true); }); toast(`<b>${left} update${left > 1 ? 's' : ''}</b> applied to ${CO(m.co).n}`); return keep(); }
    if (k === 'todo') { const m = S.mt.find(x => x.id === d.id); m.todo = m.todo || []; m.todo[+d.k] = a.checked; if (a.checked) toast('Action item done'); return; }
    if (k === 'send') { const em = S.em.find(x => x.id === d.id), ta = $('textarea'); em.msgs.push(['JR', ta ? ta.value : em.draft]); em.need = 0; em.sent = 1; em.tm = 'Just now'; log(em.co, `<b>You</b> replied to <b>${PA(em.from).n.split(' ')[0]}</b>`, em.s, 'gmail'); toast(`Reply sent to <b>${PA(em.from).n}</b>`); return keep(); }
    if (k === 'redraft') { const em = S.em.find(x => x.id === d.id); em.draft = em.draft.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'); const ta = $('textarea'); if (ta) ta.value = em.draft; toast('Otto made it shorter'); return; }
    if (k === 'new-note') { const n = { id: 'n' + uid++, co: 'linear', t: 'Untitled note', b: 'Start writing. Otto links the note to the right record.', by: 'JR', tm: 'Just now' }; S.no.unshift(n); nav('no:' + n.id); const h = $('h3[contenteditable]'); if (h) { h.focus(); document.getSelection().selectAllChildren(h); } return; }
    if (k === 'kb') { kcur = d.id; return keep(); }
    if (k === 'sk') { scur = d.id; return keep(); }
    if (k === 'run-skill') { const s = S.sk.find(x => x.id === d.id); return ask(s.ask, s.n); }
    if (k === 'tog') {
      e.stopPropagation();
      if (d.k === 'wf') { const w = S.wf.find(x => x.id === d.id); w.live = !w.live; toast(`<b>${w.n}</b> is ${w.live ? 'live' : 'paused'}`); }
      else { const ap = S.apps[+d.id]; ap[2] = !ap[2]; toast(`<b>${ap[0]}</b> ${ap[2] ? 'connected' : 'disconnected'}`); }
      return keep();
    }
    if (k === 'ask') return ask(d.q);
    if (k === 'new-chat') { S.chat = []; return keep(); }
    if (k === 'save-leads') { ['p2', 'p7', 'p3', 'p13'].forEach(i => S.newPeople.add(i)); a.outerHTML = `<span class="dm-applied">${ic('Check', 'i12')}Added to "Founders" list</span>`; toast('<b>4 people</b> added to a list. See them in People.'); return; }
    if (k === 'new-co') return toast('In the app, Otto fills a new company from its domain');
    if (k === 'new-deal') return toast('In the app, a new deal opens with Otto\'s suggested amount');
  }
  function setStage(dl, v) {
    if (!dl || dl.st === v) return render(true);
    const old = dl.st; dl.st = v;
    log(dl.co, `<b>Jonah</b> moved <b>${dl.n}</b> to ${v}`, `From ${old}`, 'edit');
    toast(v === 'Won' ? `<b>${dl.n}</b> won. The handoff workflow started.` : `<b>${dl.n}</b> moved to ${v}`);
    if (v === 'Won') { const w = S.wf.find(x => x.id === 'w4'); if (w) w.runs++; const c = CO(dl.co); if (c.rel !== 'Customer') { c.rel = 'Customer'; } c.arr += dl.amt; }
    render(true);
  }
  function applyUpd(m, i, yes, quiet) {
    const u = m.upd[i]; if (u[4]) return;
    u[4] = yes ? 1 : 2;
    if (yes) {
      const dl = DE(u[3]);
      if (u[0] === 'Stage') dl.st = u[1]; else if (u[0] === 'Amount') dl.amt = u[1]; else if (u[0] === 'Next step') dl.next = u[1];
      log(dl.co, `<b>Otto</b> set <b>${u[0]}</b> to ${u[0] === 'Amount' ? money(u[1]) : u[1]}`, `"${u[2]}"`);
      if (!quiet) toast(`<b>${u[0]}</b> updated on ${dl.n}`);
    }
    if (m.upd.every(x => x[4])) m.done = 1;
  }

  app.addEventListener('submit', e => {
    const f = e.target.closest('form'); if (!f) return; e.preventDefault();
    if (f.dataset.form === 'dock') {
      // on a record, a question that names no company is about that record's company
      const q = f.q.value.trim(); f.q.value = '';
      const [rk, rid] = route.split(':');
      const c = rk === 'co' ? CO(rid) : rk === 'de' ? CO(DE(rid).co) : rk === 'pe' ? CO(PE(rid).co) : rk === 'mt' ? CO(S.mt.find(m => m.id === rid).co) : null;
      ask(c && !S.co.some(x => q.toLowerCase().includes(x.n.toLowerCase())) ? `${q} (${c.n})` : q);
    }
    if (f.dataset.form === 'note') { const t = f.t.value.trim(); if (!t) return; S.no.unshift({ id: 'n' + uid++, co: f.dataset.co, t: t.length > 42 ? t.slice(0, 40).replace(/\s+\S*$/, '') + '…' : t, b: t, by: 'JR', tm: 'Just now' }); log(f.dataset.co, '<b>You</b> added a note', t, 'note'); toast('Note saved to the record'); render(true); }
  });
  app.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.input === 'find') { T[t.dataset.k].q = t.value; const pos = t.selectionStart; render(true); const n = $(`[data-input="find"][data-k="${t.dataset.k}"]`); if (n) { n.focus({ preventScroll: true }); n.setSelectionRange(pos, pos); } }
    if (t.dataset.input === 'draft') { const em = S.em.find(x => x.id === t.dataset.id); if (em) em.draft = t.value; }
    if (t.dataset.edit) { const n = S.no.find(x => x.id === t.dataset.id); if (n) { n[t.dataset.edit] = t.textContent; const sv = $('.dm-saved'); if (sv) { sv.classList.remove('pulse'); void sv.offsetWidth; sv.classList.add('pulse'); } } }
  });
  app.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[contenteditable][data-edit="t"]')) { e.preventDefault(); const b = $('.dm-ed'); if (b) b.focus(); } });
  // ⌘K / Ctrl+K while the pointer is over the demo or focus is inside it
  let over = false;
  app.addEventListener('pointerenter', () => { over = true; });
  app.addEventListener('pointerleave', () => { over = false; });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && (over || app.contains(document.activeElement))) { e.preventDefault(); pal ? closePal() : palette(); }
    if (e.key === 'Escape') { closeMenus(); closePal(); }
  });
  // drag deals across the pipeline
  let dragId = null;
  app.addEventListener('dragstart', e => { const c = e.target.closest('[data-drag]'); if (!c) return; dragId = c.dataset.drag; c.classList.add('dm-dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) { } app.classList.add('dm-isdrag'); });
  app.addEventListener('dragend', () => { dragId = null; app.classList.remove('dm-isdrag'); $$('.dm-lane.over').forEach(l => l.classList.remove('over')); $$('.dm-dragging').forEach(c => c.classList.remove('dm-dragging')); });
  app.addEventListener('dragover', e => { const l = e.target.closest('[data-drop]'); if (!l || !dragId) return; e.preventDefault(); $$('.dm-lane.over').forEach(x => x !== l && x.classList.remove('over')); l.classList.add('over'); });
  app.addEventListener('drop', e => { const l = e.target.closest('[data-drop]'); if (!l || !dragId) return; e.preventDefault(); const d = DE(dragId); dragId = null; app.classList.remove('dm-isdrag'); setStage(d, l.dataset.drop); });

  render();
})();
