/* The home page hero demo: a working copy of the Omniscient app, drawn to the app's own spec (styles in demo.css).
   Every tab is usable with populated data: list pages with a view picker, search, filters, sorting, bulk selection
   and a board; records with a stage path, Otto's brief, tabs, a timeline and a rail of editable fields; an email
   reader with threads, quotes, attachments and Otto's draft; meetings with updates to apply; notes and knowledge you
   can write; skills, workflows with runs and approvals, settings, a command menu on ⌘K and an Ask Otto chat that
   answers from the demo's own data. Changes carry across tabs. Nothing leaves the page. */
(() => {
  const app = document.getElementById('heroapp'), page = document.getElementById('demo');
  if (!app || !page) return;
  const O = window.OMNI || {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, el = page) => el.querySelector(s);
  const $$ = (s, el = page) => [...el.querySelectorAll(s)];
  const money = n => n ? '$' + Math.round(n).toLocaleString('en-US') : '';
  const kmoney = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'k';
  let uid = 1000;

  /* icons the page's sprite doesn't have (Lucide, as the app draws them) */
  const EXTRA = {
    Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    Reply: '<polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
    ReplyAll: '<polyline points="7 17 2 12 7 7"/><polyline points="12 17 7 12 12 7"/><path d="M22 18v-2a4 4 0 0 0-4-4H7"/>',
    Forward: '<polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>',
    Send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    External: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    Kanban: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
    CheckSquare: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    File: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    More: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    Zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    Shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  };
  if (!document.getElementById('i-Star')) {
    const sp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sp.setAttribute('width', '0'); sp.setAttribute('height', '0'); sp.setAttribute('style', 'position:absolute'); sp.setAttribute('aria-hidden', 'true');
    sp.innerHTML = Object.entries(EXTRA).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
    document.body.appendChild(sp);
  }
  const ic = (n, c = 'i') => `<svg class="${c}"><use href="#i-${n}"/></svg>`;

  /* ---------- the team and the data ---------- */
  const TEAM = {
    JR: ['Jonah Reyes', 'Account Executive', null, 'jonah@northwind.co'], AO: ['Amara Okafor', 'Head of Sales', '/assets/img/people/amara.jpg', 'amara@northwind.co'],
    DS: ['Diego Santos', 'Account Executive', '/assets/img/people/diego.jpg', 'diego@northwind.co'], RP: ['Rina Patel', 'Customer Success', '/assets/img/people/rina.jpg', 'rina@northwind.co'],
    TL: ['Theo Lambert', 'RevOps', '/assets/img/people/theo.jpg', 'theo@northwind.co'],
  };
  const S = {
    co: [
      { id: 'linear', n: 'Linear', i: 'LI', d: 'linear.app', rel: 'Customer', arr: 58000, emp: '120', lt: '2 hours ago', ltn: 0.1, pl: 'San Francisco, CA', ind: 'Software', own: 'JR', hl: 5, li: 'linkedin.com/company/linear' },
      { id: 'vercel', n: 'Vercel', i: 'VE', d: 'vercel.com', rel: 'Prospect', arr: 0, emp: '650', lt: 'Yesterday', ltn: 1, pl: 'San Francisco, CA', ind: 'Developer tools', own: 'DS', hl: 4, li: 'linkedin.com/company/vercel' },
      { id: 'notion', n: 'Notion', i: 'NO', d: 'notion.so', rel: 'Prospect', arr: 0, emp: '800', lt: 'Yesterday', ltn: 1.1, pl: 'San Francisco, CA', ind: 'Productivity', own: 'JR', hl: 3, li: 'linkedin.com/company/notionhq' },
      { id: 'stripe', n: 'Stripe', i: 'ST', d: 'stripe.com', rel: 'Customer', arr: 120000, emp: '8,000', lt: '3 hours ago', ltn: 0.12, pl: 'South San Francisco, CA', ind: 'Payments', own: 'AO', hl: 5, li: 'linkedin.com/company/stripe' },
      { id: 'figma', n: 'Figma', i: 'FI', d: 'figma.com', rel: 'Partner', arr: 74000, emp: '1,500', lt: '6 hours ago', ltn: 0.25, pl: 'San Francisco, CA', ind: 'Design', own: 'RP', hl: 3, li: 'linkedin.com/company/figma' },
      { id: 'ramp', n: 'Ramp', i: 'RA', d: 'ramp.com', rel: 'Prospect', arr: 0, emp: '900', lt: '2 days ago', ltn: 2, pl: 'New York, NY', ind: 'Finance', own: 'DS', hl: 4, li: 'linkedin.com/company/ramp' },
      { id: 'airbnb', n: 'Airbnb', i: 'AB', d: 'airbnb.com', rel: 'Customer', arr: 36000, emp: '6,900', lt: '5 days ago', ltn: 5, pl: 'San Francisco, CA', ind: 'Travel', own: 'RP', hl: 1, li: 'linkedin.com/company/airbnb' },
      { id: 'shopify', n: 'Shopify', i: 'SH', d: 'shopify.com', rel: 'Prospect', arr: 0, emp: '8,100', lt: '3 days ago', ltn: 3, pl: 'Ottawa, Canada', ind: 'Commerce', own: 'AO', hl: 3, li: 'linkedin.com/company/shopify' },
      { id: 'anthropic', n: 'Anthropic', i: 'AN', d: 'anthropic.com', rel: 'Prospect', arr: 0, emp: '1,000+', lt: '4 hours ago', ltn: 0.16, pl: 'San Francisco, CA', ind: 'AI research', own: 'JR', hl: 4, li: 'linkedin.com/company/anthropicresearch' },
      { id: 'openai', n: 'OpenAI', i: 'OA', d: 'openai.com', rel: 'Customer', arr: 180000, emp: '3,000', lt: '4 days ago', ltn: 4, pl: 'San Francisco, CA', ind: 'AI research', own: 'AO', hl: 5, li: 'linkedin.com/company/openai' },
    ],
    pe: [
      ['KS', 'Karri Saarinen', 'CEO', 'linear', 'Customer'], ['TA', 'Tuomas Artman', 'CTO', 'linear', 'Customer'], ['GR', 'Guillermo Rauch', 'CEO', 'vercel', 'Engaged'],
      ['IZ', 'Ivan Zhao', 'CEO', 'notion', 'Qualified'], ['AK', 'Akshay Kothari', 'COO', 'notion', 'Contacted'], ['PC', 'Patrick Collison', 'CEO', 'stripe', 'Customer'],
      ['JC', 'John Collison', 'President', 'stripe', 'Customer'], ['DF', 'Dylan Field', 'CEO', 'figma', 'Engaged'], ['EG', 'Eric Glyman', 'CEO', 'ramp', 'Qualified'],
      ['KA', 'Karim Atiyeh', 'CTO', 'ramp', 'Engaged'], ['BC', 'Brian Chesky', 'CEO', 'airbnb', 'Customer'], ['TB', 'Tobi Lütke', 'CEO', 'shopify', 'Contacted'],
      ['HF', 'Harley Finkelstein', 'President', 'shopify', 'Engaged'], ['DA', 'Dario Amodei', 'CEO', 'anthropic', 'Qualified'], ['SA', 'Sam Altman', 'CEO', 'openai', 'Customer'],
      ['GB', 'Greg Brockman', 'President', 'openai', 'Customer'],
    ].map(([a, n, t, co, lc], k) => ({ id: 'p' + k, a, n, t, co, lc, email: n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '@' })),
    de: [
      { id: 'd1', n: 'Team plan expansion', co: 'linear', amt: 58000, st: 'Negotiation', close: 'Dec 12', own: 'JR', who: 'KS', next: 'Send the order form', win: 80, age: 9 },
      { id: 'd2', n: 'Pilot, 40 seats', co: 'vercel', amt: 31500, st: 'Proposal', close: 'Dec 5', own: 'DS', who: 'GR', next: 'Send the pilot proposal', win: 60, age: 2 },
      { id: 'd3', n: 'Workspace migration', co: 'notion', amt: 86400, st: 'Proposal', close: 'Nov 20', late: 1, own: 'JR', who: 'IZ', next: 'Answer the seat minimum question', win: 50, age: 18 },
      { id: 'd4', n: 'Global sales team', co: 'stripe', amt: 120000, st: 'Negotiation', close: 'Dec 19', own: 'AO', who: 'PC', next: 'Pricing with EU seats by Friday', win: 70, age: 6 },
      { id: 'd5', n: 'Design org rollout', co: 'figma', amt: 74000, st: 'Proposal', close: 'Dec 8', own: 'RP', who: 'DF', next: 'Confirm the training dates', win: 55, age: 12 },
      { id: 'd6', n: 'Finance team pilot', co: 'ramp', amt: 48000, st: 'Negotiation', close: 'Dec 15', own: 'DS', who: 'KA', next: 'Return the security questionnaire', win: 65, age: 7 },
      { id: 'd7', n: 'Annual plan', co: 'airbnb', amt: 36000, st: 'Won', close: 'Nov 3', own: 'RP', who: 'BC', next: 'Run the kickoff', win: 100, age: 19 },
      { id: 'd8', n: 'Merchant success team', co: 'shopify', amt: 64000, st: 'Discovery', close: 'Jan 20', own: 'AO', who: 'HF', next: 'Book the reference call', win: 25, age: 8 },
      { id: 'd9', n: 'Enterprise rollout', co: 'anthropic', amt: 240000, st: 'Discovery', close: 'Feb 14', own: 'JR', who: 'DA', next: 'Security review on Tuesday', win: 30, age: 5 },
      { id: 'd10', n: 'Go-to-market team', co: 'openai', amt: 180000, st: 'Won', close: 'Oct 30', own: 'AO', who: 'SA', next: 'Plan the expansion check-in', win: 100, age: 23 },
      { id: 'd11', n: 'Billing team add-on', co: 'stripe', amt: 42000, st: 'Discovery', close: 'Jan 31', own: 'AO', who: 'JC', next: 'Map the billing team', win: 20, age: 3 },
      { id: 'd12', n: 'Support team seats', co: 'linear', amt: 18000, st: 'Won', close: 'Nov 14', own: 'JR', who: 'TA', next: 'Finish onboarding', win: 100, age: 8 },
    ],
    mt: [
      { id: 'm1', up: 1, mo: 'NOV', dy: '24', when: 'Tue, Nov 24, 10:00 AM', t: 'Pricing review', co: 'stripe', de: 'd4', who: ['PC', 'JC'], dur: '45 min', cal: 'Google Meet',
        brief: 'Patrick and John will decide on the 40 US seats and the EU line next week. Patrick signs off himself; John owns the EU rollout and wants those terms in writing. Timing matters more to them than price, so lead with the January start date.',
        facts: [['Budget', '$110k to $130k for the first year'], ['Open question', 'Who signs for the EU entity'], ['Next step', 'Pricing with the EU seats as a separate line']] },
      { id: 'm2', up: 1, mo: 'NOV', dy: '24', when: 'Tue, Nov 24, 2:30 PM', t: 'Security review', co: 'anthropic', de: 'd9', who: ['DA'], dur: '60 min', cal: 'Zoom',
        brief: 'Their security team wants SSO, audit logs and a clear retention policy before a pilot. Dario asked about call recordings by email on Saturday; the answer is in your drafts. Bring the SOC 2 report and the subprocessor list.',
        facts: [['Commitment', 'Pilot decision within two weeks of the review'], ['Risk', 'Data retention for call recordings'], ['Decision maker', 'Dario, with the security lead']] },
      { id: 'm3', up: 1, mo: 'NOV', dy: '25', when: 'Wed, Nov 25, 11:00 AM', t: 'Pilot scoping', co: 'ramp', de: 'd6', who: ['EG', 'KA'], dur: '30 min', cal: 'Google Meet',
        brief: 'Ramp wants 40 seats across finance and sales for the pilot. Karim owns the vendor review and needs the questionnaire back by Friday. They are comparing one other tool, so keep the pilot plan short and concrete.',
        facts: [['Timeline', 'Pilot starts the first week of December'], ['Competitor', 'One other tool in the review'], ['Next step', 'Return the security questionnaire']] },
      { id: 'm4', up: 1, mo: 'DEC', dy: '2', when: 'Wed, Dec 2, 9:00 AM', t: 'Weekly sync', co: 'linear', de: 'd1', who: ['KS', 'TA'], dur: '30 min', cal: 'Google Meet',
        brief: 'The signed order form is on its way. Tuomas asked about adding the support team in January; bring a short plan with seat counts and a start date.',
        facts: [['Commitment', 'Order form signed this week'], ['Next step', 'Plan for the support team']] },
      { id: 'm5', up: 0, mo: 'NOV', dy: '20', when: 'Fri, Nov 20, 2:00 PM', t: 'Scoping call', co: 'vercel', de: 'd2', who: ['GR'], dur: '32 min', cal: 'Zoom',
        sum: 'Guillermo wants a 40-seat pilot for the sales team before the end of the year. Budget for the pilot is around $30k, and he will sign himself. The team will judge the pilot on time saved writing follow-ups.',
        acts: ['Send the pilot proposal', 'Share the security pack', 'Book a demo for the sales leads'],
        tr: [['GR', 'We want 40 seats for the pilot, mostly sales and a few solutions engineers.'], ['DS', 'Is there a date you are working toward?'], ['GR', 'Before the end of the year. Send us the proposal and we will take it from there.'], ['DS', 'And the budget, roughly?'], ['GR', 'Around $30k for the pilot. If it works, we roll it out to the whole team.']],
        upd: [['Stage', 'Proposal', 'Send us the proposal and we will take it from there.'], ['Amount', 31500, 'Around $30k for the pilot.'], ['Next step', 'Send the pilot proposal', 'Send us the proposal.']] },
      { id: 'm6', up: 0, mo: 'NOV', dy: '19', when: 'Thu, Nov 19, 4:00 PM', t: 'Expansion call', co: 'linear', de: 'd1', who: ['KS'], dur: '28 min', cal: 'Google Meet',
        sum: 'Karri confirmed legal is done and the team plan is ready to sign. Two more teams may join in January, starting with support.',
        acts: ['Send the order form', 'Draft the January expansion plan'],
        tr: [['KS', 'Legal is done on our side.'], ['JR', 'Then I can send the order form today.'], ['KS', 'Please do. We may add two more teams in January, support first.']],
        upd: [['Stage', 'Negotiation', 'Legal is done on our side.'], ['Next step', 'Send the order form', 'Then I can send the order form today.']] },
      { id: 'm7', up: 0, mo: 'NOV', dy: '18', when: 'Wed, Nov 18, 10:00 AM', t: 'Rollout planning', co: 'figma', de: 'd5', who: ['DF'], dur: '40 min', cal: 'Google Meet',
        sum: 'The full rollout waits on legal. Dylan wants to start with two design teams in December and move training a week later to avoid the holidays.',
        acts: ['Send the updated rollout plan', 'Confirm the training dates'],
        tr: [['DF', 'Legal still has the contract.'], ['RP', 'Would starting with two teams help in the meantime?'], ['DF', 'Yes. And move training a week later, after the holidays.']],
        upd: [['Next step', 'Confirm the training dates', 'Move training a week later.']] },
      { id: 'm8', up: 0, mo: 'NOV', dy: '13', when: 'Fri, Nov 13, 1:00 PM', t: 'Discovery call', co: 'shopify', de: 'd8', who: ['TB', 'HF'], dur: '45 min', cal: 'Zoom',
        sum: 'Merchant success runs on three tools today. They want one view of every merchant and fewer handoffs between teams.',
        acts: ['Send a commerce case study', 'Book a technical call'],
        tr: [['HF', 'We run three tools for merchant success today.'], ['AO', 'What would one view change for the team?'], ['TB', 'Faster answers for merchants, and fewer handoffs.']],
        upd: [['Stage', 'Discovery', 'We run three tools for merchant success today.']] },
    ],
    em: [
      { id: 'e1', co: 'stripe', de: 'd4', s: 'Pricing for 40 seats', need: 1, when: 'Today 9:41 AM', wd: 0, msgs: [
        { a: 'JR', to: 'Patrick', at: 'Nov 19, 4:12 PM', b: 'Hi Patrick,\n\nThank you for the time on Tuesday. Here is a short recap of what we heard:\n\n- 40 seats across the US sales team, starting in January\n- The EU team, about 15 people, to follow in February\n- One admin per region, with SSO from day one\n\nI will have pricing to you by Friday. If anything above is off, let me know and I will correct it before then.\n\nBest,\nJonah' },
        { a: 'PC', to: 'me, John', at: 'Today 9:41 AM', b: 'Hi Jonah,\n\nThat matches my notes. One addition: John will want to see the EU terms before we sign, since his team owns the rollout there.\n\nCould you send pricing for the 40 seats before Friday, with the EU seats as a separate line? We would like to decide next week.\n\nThanks,\nPatrick' }],
        draft: 'Hi Patrick,\n\nThank you, that helps. Pricing is attached:\n\n- 40 US seats at $44 a seat a month, billed annually\n- 15 EU seats on a separate line at the same rate, starting February 1\n- SSO and two admins included\n\nI have copied John so the EU terms are in the same thread. I am glad to walk you both through it on Monday if that is useful.\n\nBest,\nJonah',
        short: 'Hi Patrick,\n\nPricing is attached: 40 US seats at $44 a seat a month, with the 15 EU seats as a separate line from February 1. I have copied John for the EU terms.\n\nBest,\nJonah', att: ['Northwind pricing, Stripe.pdf'] },
      { id: 'e2', co: 'notion', de: 'd3', s: 'Workspace migration proposal', need: 1, when: 'Yesterday 6:20 PM', wd: 1, msgs: [
        { a: 'JR', to: 'Ivan', at: 'Nov 17, 11:05 AM', b: 'Hi Ivan,\n\nAttached is the proposal for moving your sales team onto Omniscient. The short version: 60 seats, a two-week migration from your current CRM, and a pilot with the product team first.\n\nI kept the migration plan to one page so it is easy to share with Akshay.\n\nBest,\nJonah', att: ['Notion migration proposal.pdf'] },
        { a: 'IZ', to: 'me', at: 'Yesterday 6:20 PM', b: 'Thanks, Jonah. This is clear.\n\nTwo questions before I share it: is there a minimum number of seats, and can we start with the product team alone and add sales in Q1?\n\nIvan' }],
        draft: 'Hi Ivan,\n\nGood questions. The minimum is 25 seats, so starting with the product team works well. Here is how that would look:\n\n- January: 25 seats for the product team, with the migration done in the first week\n- Q1: add the sales team when you are ready, at the same price\n\nI can send an updated proposal with the 25-seat start today. Would that help you share it with Akshay?\n\nBest,\nJonah',
        short: 'Hi Ivan,\n\nThe minimum is 25 seats, so you can start with the product team in January and add sales in Q1 at the same price. I can send an updated proposal today.\n\nBest,\nJonah' },
      { id: 'e3', co: 'linear', de: 'd1', s: 'Order form', need: 0, when: 'Today 7:58 AM', wd: 0.1, msgs: [
        { a: 'KS', to: 'me, Tuomas', at: 'Today 7:20 AM', b: 'Hi Jonah,\n\nLegal is done on our side. I will send the signed order form today.\n\nTuomas asked about adding the support team in January. Could we talk about that at the weekly sync?\n\nKarri' },
        { a: 'JR', to: 'Karri', at: 'Today 7:58 AM', b: 'Hi Karri,\n\nThat is great news, thank you. I will watch for the order form and send the welcome details as soon as it arrives.\n\nYes to the support team. I will bring a short plan with seat counts and a start date to the sync.\n\nBest,\nJonah' }] },
      { id: 'e4', co: 'ramp', de: 'd6', s: 'Vendor security review', need: 1, when: 'Fri 3:14 PM', wd: 2, msgs: [
        { a: 'KA', to: 'Diego, me', at: 'Fri 3:14 PM', b: 'Hi Diego and Jonah,\n\nAs part of our vendor review, could you complete the attached security questionnaire? It has about 60 questions, mostly on data handling, access control and subprocessors.\n\nWe would like it back by Friday so the pilot can start on schedule.\n\nThanks,\nKarim', att: ['Ramp vendor security review.xlsx'] }],
        draft: 'Hi Karim,\n\nThank you for sending this. Most answers are in our security pack, which I have attached along with our SOC 2 Type II report.\n\nWe will return the completed questionnaire by Wednesday, two days before your deadline. If your team has questions in the meantime, I can set up a call with our security lead.\n\nBest,\nJonah',
        short: 'Hi Karim,\n\nOur security pack and SOC 2 report are attached. The completed questionnaire will be with you by Wednesday.\n\nBest,\nJonah', att: ['Northwind security pack.pdf', 'SOC 2 Type II report.pdf'] },
      { id: 'e5', co: 'anthropic', de: 'd9', s: 'Call recordings before Tuesday', need: 1, when: 'Yesterday 10:02 AM', wd: 1.2, msgs: [
        { a: 'DA', to: 'me', at: 'Yesterday 10:02 AM', b: 'Hi Jonah,\n\nAhead of Tuesday\'s security review, one question from our team: how long do you keep call recordings and transcripts, and can we set our own limit?\n\nIt would help to have the answer in writing before the meeting.\n\nThanks,\nDario' }],
        draft: 'Hi Dario,\n\nThank you for asking ahead of time. In short:\n\n- Recordings and transcripts are kept for 90 days by default\n- Your admins can set any shorter limit, down to zero\n- Deleted recordings are removed from backups within 30 days\n\nThe full policy is on page 4 of the attached security pack. I will bring our security lead to Tuesday\'s review in case your team wants to go further.\n\nBest,\nJonah',
        short: 'Hi Dario,\n\nRecordings and transcripts are kept for 90 days by default, and your admins can set any shorter limit. The full policy is on page 4 of the attached security pack.\n\nBest,\nJonah', att: ['Northwind security pack.pdf'] },
      { id: 'e6', co: 'vercel', de: 'd2', s: 'Recap of our scoping call', need: 1, when: 'Sat 8:47 AM', wd: 1.5, msgs: [
        { a: 'DS', to: 'Guillermo', at: 'Nov 20, 4:30 PM', b: 'Hi Guillermo,\n\nThank you for the time today. Here is what we heard:\n\n- A 40-seat pilot for sales and solutions engineering\n- A start before the end of the year\n- Success measured by time saved on follow-ups\n\nI will send the proposal once you confirm this is right.\n\nBest,\nDiego' },
        { a: 'GR', to: 'Diego, me', at: 'Sat 8:47 AM', b: 'Hi Diego,\n\nThanks for the clear recap. That is right. Please send the proposal and we will take it from there.\n\nGuillermo' }],
        draft: 'Hi Guillermo,\n\nThank you for confirming. The proposal for the 40-seat pilot is attached:\n\n- 40 seats for 60 days, starting December 2\n- $31,500 for the first year if you continue after the pilot\n- Setup, imports and training included\n\nIf it looks right, the order form is on the last page. I am free Thursday afternoon to go through any questions.\n\nBest,\nDiego',
        short: 'Hi Guillermo,\n\nThe proposal for the 40-seat pilot is attached: 60 days from December 2, then $31,500 for the first year. The order form is on the last page.\n\nBest,\nDiego', att: ['Vercel pilot proposal.pdf'] },
      { id: 'e7', co: 'figma', de: 'd5', s: 'Rollout plan for the design org', need: 0, when: 'Today 6:15 AM', wd: 0.2, msgs: [
        { a: 'DF', to: 'Rina', at: 'Today 6:15 AM', b: 'Hi Rina,\n\nAttached is the rollout plan for the design org. We would like to start with two teams in December and add the rest once legal signs off.\n\nCould you check the timeline on page 2? We moved training a week later to avoid the holidays.\n\nDylan', att: ['Design org rollout plan.pdf'] }] },
      { id: 'e8', co: 'shopify', de: 'd8', s: 'Case study for commerce teams', need: 0, when: 'Thu 2:40 PM', wd: 3, msgs: [
        { a: 'HF', to: 'Amara', at: 'Thu 11:12 AM', b: 'Hi Amara,\n\nThank you for the discovery call last week. Before we bring in the wider team, do you have a case study from a commerce or marketplace company? Merchant success is the team we would start with.\n\nHarley' },
        { a: 'AO', to: 'Harley', at: 'Thu 2:40 PM', b: 'Hi Harley,\n\nYes. Attached is a two-page case study from a marketplace team of a similar size. They moved merchant success off three tools in four weeks.\n\nI would be glad to introduce you to their head of merchant success if a reference call would help.\n\nBest,\nAmara', att: ['Marketplace case study.pdf'] }] },
      { id: 'e9', co: 'airbnb', de: 'd7', s: 'Kickoff on Tuesday', need: 1, when: 'Mon 5:05 PM', wd: 5, msgs: [
        { a: 'BC', to: 'Rina', at: 'Mon 5:05 PM', b: 'Hi Rina,\n\nLooking forward to the kickoff. I have invited our two regional leads, who will own the rollout day to day.\n\nPlease send the agenda when it is ready.\n\nBrian' }],
        draft: 'Hi Brian,\n\nThank you, it is great to have both regional leads there. Here is the agenda:\n\n1. Goals for the first 30 days\n2. Workspace setup and imports\n3. A training plan for each region\n\nWe will keep it to 45 minutes. I will send the invite with a short pre-read tomorrow.\n\nBest,\nRina',
        short: 'Hi Brian,\n\nHere is the agenda: goals for the first 30 days, workspace setup, and a training plan for each region. We will keep it to 45 minutes.\n\nBest,\nRina' },
    ],
    no: [
      { id: 'n1', co: 'linear', t: 'Rollout plan', b: 'Two teams go first, then support in January. Karri wants one admin per team and a short training for each.', by: 'JR', up: 'Today', cr: 'Today', ty: 'Note' },
      { id: 'n2', co: 'vercel', t: 'Scoping call notes', b: '40 seats, mostly sales. Timing matters more than price. Guillermo signs himself. Pilot before the end of the year.', by: 'DS', up: 'Nov 20', cr: 'Nov 20', ty: 'Call notes' },
      { id: 'n3', co: 'stripe', t: 'Commercial terms', b: 'Annual, net 30. EU team starts February 1 on a separate line. Patrick wants pricing by Friday.', by: 'AO', up: 'Nov 19', cr: 'Nov 17', ty: 'Note' },
      { id: 'n4', co: 'airbnb', t: 'Renewal plan', b: 'Renews in January. Usage fell 40% this month, so plan a check-in with the regional leads before the kickoff.', by: 'RP', up: 'Nov 17', cr: 'Nov 10', ty: 'Account plan' },
      { id: 'n5', co: 'anthropic', t: 'Security requirements', b: 'SSO, audit logs and data retention. Send the SOC 2 report and the subprocessor list before Tuesday.', by: 'JR', up: 'Nov 16', cr: 'Nov 16', ty: 'Note' },
      { id: 'n6', co: 'shopify', t: 'Discovery call notes', b: 'Three tools today for merchant success. They want one view of every merchant and fewer handoffs.', by: 'AO', up: 'Nov 13', cr: 'Nov 13', ty: 'Call notes' },
    ],
    kb: [
      { id: 'k1', t: 'Pricing and discounts', sub: 'Updated today', by: 'TL', sh: 1, body: [['h', 'Seat price'], ['p', '$49 a seat a month up to 100 seats. $44 a seat from 100 to 500. Over 500 seats, Amara approves the price.'], ['h', 'Discounts'], ['p', 'Annual plans get two months free. Pilots run up to 60 days at no charge for 25 seats or more.'], ['h', 'Payment'], ['p', 'Net 30 on annual plans, by card or invoice.']] },
      { id: 'k2', t: 'Sales playbook', sub: '12 pages', by: 'AO', sh: 1, body: [['h', 'Discovery'], ['p', 'Ask about the tools they use today, who signs and the date they are working toward.'], ['h', 'Proposal'], ['p', 'Send within a day of the call. Lead with the pilot, then the annual plan.'], ['h', 'Close'], ['p', 'Agree on the next step in every call. Otto logs it on the record.']] },
      { id: 'k3', t: 'Email tone', sub: 'Short and warm', by: 'JR', sh: 1, body: [['p', 'Write like a person. Three short paragraphs at most, one request per email, and a list when there are more than two points. Sign with your first name.']] },
      { id: 'k4', t: 'Product catalog', sub: 'Spring 2027', by: 'TL', sh: 1, body: [['h', 'Plans'], ['p', 'Starter, Pro and Business. Otto is included in every plan.'], ['h', 'Add-ons'], ['p', 'Extra lead credits, longer call recording storage and a dedicated success manager.']] },
      { id: 'k5', t: 'Security pack', sub: 'SOC 2, SSO, retention', by: 'TL', sh: 1, body: [['p', 'SOC 2 Type II. SSO with SAML on Business. Audit logs on Business. Call recordings kept 90 days by default, with any shorter limit an admin sets.']] },
      { id: 'k6', t: 'My follow-up checklist', sub: 'Personal', by: 'JR', sh: 0, body: [['p', 'Recap within an hour. Pricing within a day. Every email ends with one clear next step.']] },
    ],
    sk: [
      { id: 's1', n: 'Find leads', d: 'Build a lead list from one sentence', g: 'Build pipeline', sp: 'Deep', mine: 0, steps: ['Read the request', 'Search people and companies', 'Rank by fit and say why', 'Mark who is already in the CRM'], ask: 'Find founders of fast-growing software companies' },
      { id: 's2', n: 'Companies like our best customers', d: 'Lookalikes of the accounts you win', g: 'Build pipeline', sp: 'Deep', mine: 0, steps: ['Read your best customers', 'Find companies with the same traits', 'Rank and explain each match'], ask: 'Find companies like Linear and Airbnb' },
      { id: 's3', n: 'Pipeline review', d: 'Deals that need attention this week', g: 'Know your deals', sp: 'Quick', mine: 0, steps: ['Read every open deal', 'Find late and quiet deals', 'Say what to do next'], ask: 'Which deals need me this week?' },
      { id: 's4', n: 'Forecast', d: 'What will close this month', g: 'Know your deals', sp: 'Quick', mine: 0, steps: ['Read stages and amounts', 'Weigh each deal by stage', 'Show the number and what moves it'], ask: 'What will we close in December?' },
      { id: 's5', n: 'Prep for a meeting', d: 'A one-page brief before the call', g: 'Win the deal', sp: 'Quick', mine: 0, steps: ['Read the last call and emails', 'List open questions', 'Write the brief'], ask: 'Prep me for my next meeting' },
      { id: 's6', n: 'Draft a reply', d: 'A reply in your tone, with the facts', g: 'Win the deal', sp: 'Quick', mine: 0, steps: ['Read the thread', 'Follow the email tone page', 'Draft for your review'], ask: 'Draft a reply to Ivan' },
      { id: 's7', n: 'Account summary', d: 'Where an account stands, with sources', g: 'Run the business', sp: 'Quick', mine: 0, steps: ['Read the record, emails and calls', 'Write a short summary', 'Link every source'], ask: 'Summarize Stripe' },
      { id: 's8', n: 'Research an account', d: 'A profile from the web and your CRM', g: 'Helpers', sp: 'Deep', mine: 0, steps: ['Check news and hiring', 'Read the record', 'Write a one-page profile'], ask: 'Research Anthropic' },
      { id: 's9', n: 'Qualify an inbound lead', d: 'Our questions for new requests', g: 'Build pipeline', sp: 'Quick', mine: 1, steps: ['Check size and industry', 'Score against our best customers', 'Route to the right owner'], ask: 'Qualify Ramp as an inbound lead' },
      { id: 's10', n: 'My Friday update', d: 'Deals I own that moved this week', g: 'Run the business', sp: 'Quick', mine: 1, steps: ['List deals I own', 'Show what moved', 'Draft my update for Amara'], ask: 'What will we close in December?' },
    ],
    wf: [
      { id: 'w1', n: 'Proposal follow-up', trig: 'When an opportunity moves to Proposal', steps: [['Mail', 'Send "Proposal follow-up"', '40 sent, 9 replied'], ['Clock', 'Wait 3 days', 'Time'], ['Bell', 'Notify the owner', 'If there is no reply']], live: 1, runs: 38 },
      { id: 'w2', n: 'New lead prep', trig: 'When a meeting is booked with a new lead', steps: [['Sparkles', 'Otto writes a prep brief', 'Saved on the record'], ['Pencil', 'Set stage to Discovery', 'Field update'], ['Chat', 'Post in #sales', 'Slack']], live: 1, runs: 21 },
      { id: 'w3', n: 'Renewal brief', trig: '60 days before a renewal date', steps: [['Sparkles', 'Otto writes an account brief', 'Usage, calls and risks'], ['Bell', 'Notify the owner', 'With the brief']], live: 0, runs: 6 },
      { id: 'w4', n: 'Won deal handoff', trig: 'When an opportunity is won', steps: [['Users', 'Assign customer success', 'Round robin'], ['Mail', 'Send the welcome email', 'From the owner'], ['Calendar', 'Book the kickoff', 'Within a week']], live: 1, runs: 9 },
      { id: 'w5', n: 'Quiet deal alert', trig: 'When a deal has no activity for 14 days', steps: [['Bell', 'Notify the owner', 'With the last touch'], ['Sparkles', 'Otto drafts a check-in', 'For review']], live: 1, runs: 14 },
    ],
    ap: [
      { id: 'a1', wf: 'w5', co: 'notion', who: 'IZ', s: 'Following up on the migration proposal', b: 'Hi Ivan,\n\nI wanted to make sure the proposal reached you and answer any questions before you share it with Akshay. Would a 20-minute call this week help?\n\nBest,\nJonah' },
      { id: 'a2', wf: 'w1', co: 'figma', who: 'DF', s: 'Training dates for the design org', b: 'Hi Dylan,\n\nThank you for the updated plan. Training now starts the week of January 4 for both teams. Does that still work on your side?\n\nBest,\nRina' },
    ],
    apps: [['Gmail', 'gmail.svg', 1, 'Mail & calendar'], ['Google Calendar', 'calendar.svg', 1, 'Mail & calendar'], ['Outlook', 'outlook.jpg', 0, 'Mail & calendar'], ['Zoom', 'zoom.svg', 1, 'Call notes'], ['Google Meet', 'meet.svg', 1, 'Call notes'], ['Slack', 'slack.svg', 1, 'Integrations'], ['HubSpot', 'hubspot.svg', 0, 'Integrations'], ['Salesforce', 'salesforce.svg', 0, 'Integrations']],
    act: [], chat: [], newPeople: new Set(), star: new Set(['stripe']),
  };
  S.pe.forEach(p => { p.email += S.co.find(c => c.id === p.co).d; });
  const CO = id => S.co.find(c => c.id === id), PE = id => S.pe.find(p => p.id === id), DE = id => S.de.find(d => d.id === id), MT = id => S.mt.find(m => m.id === id), EM = id => S.em.find(e => e.id === id);
  const PA = a => S.pe.find(p => p.a === a);
  const nameOf = a => TEAM[a] ? TEAM[a][0] : PA(a).n;
  const first = a => nameOf(a).split(' ')[0];
  const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Won'];
  const REL = ['Customer', 'Prospect', 'Partner'];
  // edits Otto made from calls, shown on the timelines
  S.de.forEach(d => S.act.push({ co: d.co, de: d.id, k: 'edit', t: `<b>Otto</b> set <b>Stage</b> to ${d.st}`, s: 'From the last call', at: 'Nov 9', d: 13 }));

  /* ---------- small parts ---------- */
  const logo = (c, s = '') => `<span class="logo ${s}">${c.i}</span>`;
  const badge = t => `<span class="badge">${t}</span>`;
  const face = (a, s = '') => TEAM[a] && TEAM[a][2] ? `<span class="av ph ${s}" style="background-image:url(${TEAM[a][2]})" title="${TEAM[a][0]}"></span>` : `<span class="av ${s}" title="${esc(nameOf(a))}">${a}</span>`;
  const owner = k => `<span class="dm-own">${face(k, 's20')}${TEAM[k][0]}</span>`;
  const coChip = c => `<span class="dm-cchip" data-go="co:${c.id}">${logo(c, 's16')}${c.n}</span>`;
  const otto = (s = 16) => `<svg width="${s}" height="${s}"><use href="#otto"/></svg>`;
  const byOtto = (s = '') => `<span class="dm-byotto">${otto(14)}Otto</span>${s ? `<span class="dm-mut">${s}</span>` : ''}`;
  const loader = () => '<span class="loader dm-loader"><i></i><i></i><i></i><i></i></span>';
  const ib = (icon, act, tip, extra = '') => `<span class="dm-ib" ${act} title="${tip}" aria-label="${tip}"${extra}>${ic(icon)}</span>`;
  const empty = t => `<div class="dm-empty">${t}</div>`;
  const dash = '<span class="dm-dash">—</span>';
  const health = n => `<span class="dm-health h${n >= 5 ? 'g' : n >= 3 ? 'o' : 'r'}">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  const dateTile = (mo, dy, s = '') => `<span class="dm-dt ${s}"><i>${mo}</i><b>${dy}</b></span>`;
  const seg = (k, opts, cur) => `<span class="dm-seg">${opts.map(([v, l]) => `<span class="${cur === v ? 'on' : ''}" data-act="${k}" data-v="${v}">${l}</span>`).join('')}</span>`;
  const sw = (k, id, on) => `<span class="dm-sw${on ? ' on' : ''}" data-act="sw" data-k="${k}" data-id="${id}" role="switch" aria-checked="${on ? 'true' : 'false'}"><i></i></span>`;
  const dock = (ph = 'Ask Otto') => `<form class="dm-dock" data-form="ask"><textarea name="q" rows="1" placeholder="${esc(ph)}" aria-label="Ask Otto"></textarea><div class="dm-dockr">${ib('Plus', '', 'Add files and more')}${ib('Mic', '', 'Dictate')}<span class="sp"></span><button class="dm-send" type="submit" aria-label="Send">${ic('ArrowUp')}</button></div></form>`;
  const paras = t => esc(t).split('\n\n').map(p => /^(- |\d\. )/.test(p) ? (/^- /.test(p) ? `<ul>${p.split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul>` : `<ol>${p.split('\n').map(l => `<li>${l.replace(/^\d\. /, '')}</li>`).join('')}</ol>`) : `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  /* page header and toolbar, as the app draws them */
  function header(icon, title, { crumb = '', primary = '', star = '', acts = '' } = {}) {
    return `<div class="dm-ph">${crumb ? `<span class="dm-crumb" data-go="${crumb[0]}">${crumb[1]}</span><span class="dm-sl">/</span>` : ''}<span class="dm-phi">${ic(icon)}</span><b>${title}</b><div class="dm-pha">${acts}${star ? ib('Star', `data-act="star" data-id="${star}"`, 'Favorite', S.star.has(star) ? ' data-on="1"' : '') : ib('Star', '', 'Favorite')}${primary}${ib('Sparkles', 'data-go="ask"', 'Ask Otto').replace(ic('Sparkles'), otto())}</div></div>`;
  }
  const primary = (label, act, icon = 'Plus') => `<span class="dm-pri" data-act="${act}">${ic(icon, 'i14')}${label}</span>`;

  /* ---------- list pages: view picker, search, filter, sort, display, table with bulk bar ---------- */
  const L = {};
  const LS = k => (L[k] = L[k] || { sort: null, f: new Set(), sel: new Set(), q: '', layout: k === 'deals' ? 'board' : 'table' });
  function toolbar(k, { view, count, search, filters, layouts, views = [] }) {
    const st = LS(k);
    const lay = layouts ? `${seg('layout:' + k, layouts.map(([v, icn, l]) => [v, ic(icn, 'i14') + l]), st.layout)}` : '';
    return `<div class="dm-tb"><span class="dm-vp">${ic(st.layout === 'board' ? 'Kanban' : 'TableIcon', 'i14')}${view}<small>${count}</small>${ic('ChevronDown', 'i12')}</span>${views.length ? `<span class="dm-vr"></span>${views.map(v => `<span class="dm-vt">${v}</span>`).join('')}` : ''}<label class="dm-srch">${ic('SearchIcon', 'i14')}<input data-input="q" data-k="${k}" value="${esc(st.q)}" placeholder="${search}" autocomplete="off"></label><span class="sp"></span>${lay}<span class="dm-plain">${ic('Download', 'i14')}Import / Export</span>${filters ? ib('FilterIcon', `data-act="filter" data-k="${k}"`, 'Filter', st.f.size ? ' data-on="1"' : '') : ''}${ib('ArrowUpDown', `data-act="sortmenu" data-k="${k}"`, 'Sort')}<span class="dm-plain">${ic('Sliders', 'i14')}Display</span></div>${st.f.size ? `<div class="dm-chips">${[...st.f].map(f => `<span class="dm-fchip"><b>${filters.field}</b> is ${f}<span data-act="unfilter" data-k="${k}" data-v="${esc(f)}">${ic('X', 'i12')}</span></span>`).join('')}<span class="dm-mut dm-clearf" data-act="clearf" data-k="${k}">Clear</span></div>` : ''}`;
  }
  function table(k, cols, rows, { fkey, go, foot, addLabel = 'Add new', bulk = [] }) {
    const st = LS(k);
    let rs = rows.filter(r => !st.f.size || st.f.has(r[fkey]));
    if (st.q) { const q = st.q.toLowerCase(); rs = rs.filter(r => cols.some(c => String(c.sv ? c.sv(r) : r[c.k] ?? '').toLowerCase().includes(q))); }
    if (st.sort) { const [sk, sd] = st.sort, c = cols.find(x => x.k === sk); rs = rs.slice().sort((a, b) => { const x = c.sv ? c.sv(a) : a[sk], y = c.sv ? c.sv(b) : b[sk]; return (x > y ? 1 : x < y ? -1 : 0) * sd; }); }
    const ids = rs.map(r => r.id), all = ids.length && ids.every(i => st.sel.has(i));
    const cb = (on, act, id = '') => `<span class="dm-cb${on ? ' on' : ''}" data-act="${act}" data-k="${k}"${id ? ` data-id="${id}"` : ''}>${on ? ic('Check', 'i12') : ''}</span>`;
    const head = st.sel.size
      ? `<tr class="dm-bulk"><th colspan="${cols.length + 1}"><div>${cb(all, 'selall')}<b>${st.sel.size} selected</b><span class="dm-mut dm-link" data-act="selall" data-k="${k}">Select all ${rs.length}</span><span class="sp"></span>${bulk.map(([icn, tip, act]) => ib(icn, `data-act="${act}" data-k="${k}"`, tip)).join('')}${ib('X', `data-act="selclear" data-k="${k}"`, 'Clear')}</div></th></tr>`
      : `<tr><th class="dm-c0">${cb(all, 'selall')}<span>${cols[0].label}</span>${sortArrow(k, cols[0].k)}</th>${cols.slice(1).map(c => `<th data-act="sort" data-k="${k}" data-c="${c.k}"><span class="dm-thc">${ic(c.icon)}${c.label}${sortArrow(k, c.k)}</span></th>`).join('')}<th class="dm-cadd">${ib('Plus', '', 'Add a column')}</th></tr>`;
    const body = rs.map(r => `<tr data-go="${go(r)}" class="${st.sel.has(r.id) ? 'sel' : ''}${S.newPeople.has(r.id) || r.fresh ? ' dm-fresh' : ''}"><td class="dm-c0">${cb(st.sel.has(r.id), 'sel', r.id)}${cols[0].v(r)}</td>${cols.slice(1).map(c => `<td class="${c.cls || ''}">${c.v(r) || dash}</td>`).join('')}<td></td></tr>`).join('');
    return `<div class="dbody dm-scroll"><table class="dm-tbl"><thead>${head}</thead><tbody>${body || `<tr><td colspan="${cols.length + 2}">${empty('No matches')}</td></tr>`}<tr class="dm-addrow"><td colspan="${cols.length + 2}" data-act="addrow" data-k="${k}">${ic('Plus', 'i14')}${addLabel}</td></tr></tbody><tfoot><tr>${foot ? foot(rs) : `<td>${rs.length} total</td>${cols.slice(1).map(() => '<td></td>').join('')}<td></td>`}</tr></tfoot></table></div>`;
  }
  const sortArrow = (k, c) => { const s = LS(k).sort; return s && s[0] === c ? `<span class="dm-arr">${ic(s[1] > 0 ? 'ArrowUp' : 'ArrowUp', 'i12' + (s[1] < 0 ? ' dm-down' : ''))}</span>` : ''; };

  const V = {};
  const COLS_CO = [
    { k: 'n', label: 'Company', v: c => `<span class="dm-nm">${logo(c)}${c.n}</span>`, sv: c => c.n },
    { k: 'd', label: 'Domain', icon: 'Globe', v: c => `<span class="dm-lnk">${c.d}</span>` },
    { k: 'rel', label: 'Relationship', icon: 'Tag', v: c => badge(c.rel) },
    { k: 'arr', label: 'ARR', icon: 'Dollar', v: c => money(c.arr), cls: 'num' },
    { k: 'hl', label: 'Health', icon: 'Zap', v: c => health(c.hl) },
    { k: 'own', label: 'Owner', icon: 'Users', v: c => owner(c.own), sv: c => TEAM[c.own][0] },
    { k: 'ltn', label: 'Last touch', icon: 'Clock', v: c => `<span class="dm-mut">${c.lt}</span>` },
    { k: 'nm', label: 'Next meeting', icon: 'Calendar', v: c => { const m = S.mt.find(x => x.up && x.co === c.id); return m ? `${m.mo[0] + m.mo.slice(1).toLowerCase()} ${m.dy}` : ''; }, sv: c => { const m = S.mt.find(x => x.up && x.co === c.id); return m ? m.mo + m.dy.padStart(2, '0') : 'ZZZ'; } },
  ];
  V.companies = () => header('Building', 'Companies', { primary: primary('New', 'new-co') }) + toolbar('companies', { view: 'All companies', count: 148 + S.co.length - 10, search: 'Search companies', filters: { field: 'Relationship', opts: REL }, views: ['Customers', 'My accounts'] })
    + table('companies', COLS_CO, S.co, { fkey: 'rel', go: c => 'co:' + c.id, bulk: [['Sparkles', 'Ask Otto about these', 'bulk-ask']], foot: rs => `<td>${rs.length} of ${148 + S.co.length - 10}</td><td></td><td></td><td class="num">${kmoney(rs.reduce((a, c) => a + c.arr, 0))}<small>Sum</small></td><td></td><td></td><td></td><td></td><td></td>` }) + dock();

  const COLS_PE = [
    { k: 'n', label: 'Name', v: p => `<span class="dm-nm">${face(p.a, 's24')}${p.n}${S.newPeople.has(p.id) ? '<span class="badge t-green">New</span>' : ''}</span>`, sv: p => p.n },
    { k: 'email', label: 'Email', icon: 'Mail', v: p => `<span class="dm-lnk">${p.email}</span>` },
    { k: 't', label: 'Title', icon: 'Briefcase', v: p => p.t },
    { k: 'co', label: 'Company', icon: 'Building', v: p => coChip(CO(p.co)), sv: p => CO(p.co).n },
    { k: 'lc', label: 'Lifecycle', icon: 'Tag', v: p => badge(p.lc) },
    { k: 'lt', label: 'Last touch', icon: 'Clock', v: p => `<span class="dm-mut">${CO(p.co).lt}</span>`, sv: p => CO(p.co).ltn },
  ];
  V.people = () => header('Users', 'People', { primary: primary('Find leads', 'find-leads', 'Radar') }) + toolbar('people', { view: 'All people', count: 312 + S.newPeople.size, search: 'Search people', filters: { field: 'Lifecycle', opts: ['Contacted', 'Engaged', 'Qualified', 'Customer'] }, views: ['Decision makers'] })
    + table('people', COLS_PE, S.pe, { fkey: 'lc', go: p => 'pe:' + p.id, bulk: [['Sparkles', 'Ask Otto about these', 'bulk-ask'], ['Mail', 'Email', 'bulk-mail']] }) + dock();

  const COLS_DE = [
    { k: 'n', label: 'Opportunity', v: d => `<span class="dm-nm"><b>${d.n}</b></span>`, sv: d => d.n },
    { k: 'co', label: 'Company', icon: 'Building', v: d => coChip(CO(d.co)), sv: d => CO(d.co).n },
    { k: 'st', label: 'Stage', icon: 'Branch', v: d => badge(d.st), sv: d => STAGES.indexOf(d.st) },
    { k: 'amt', label: 'Amount', icon: 'Dollar', v: d => money(d.amt), cls: 'num' },
    { k: 'close', label: 'Close date', icon: 'Calendar', v: d => d.late && d.st !== 'Won' ? `<span class="dm-late">Late, ${d.close}</span>` : d.close },
    { k: 'own', label: 'Owner', icon: 'Users', v: d => owner(d.own), sv: d => TEAM[d.own][0] },
  ];
  V.deals = () => {
    const st = LS('deals'), top = header('Handshake', 'Opportunities', { primary: primary('New', 'new-deal') }) + toolbar('deals', { view: st.layout === 'board' ? 'Pipeline' : 'All opportunities', count: S.de.length, search: 'Search opportunities', filters: { field: 'Stage', opts: STAGES }, layouts: [['board', 'Kanban', 'Board'], ['table', 'TableIcon', 'Table']] });
    if (st.layout === 'table') return top + table('deals', COLS_DE, S.de, { fkey: 'st', go: d => 'de:' + d.id, foot: rs => `<td>${rs.length} opportunities</td><td></td><td></td><td class="num">${kmoney(rs.reduce((a, d) => a + d.amt, 0))}<small>Sum</small></td><td></td><td></td><td></td>` }) + dock();
    const q = st.q.toLowerCase(), ds0 = S.de.filter(d => (!st.f.size || st.f.has(d.st)) && (!q || (d.n + CO(d.co).n).toLowerCase().includes(q)));
    const lanes = STAGES.map(s => {
      const ds = ds0.filter(d => d.st === s);
      return `<div class="dm-lane" data-drop="${s}"><div class="dm-laneh">${badge(s)}<small>${ds.length}</small><span class="dm-sum">${money(ds.reduce((a, d) => a + d.amt, 0)) || '$0'}</span>${ib('Plus', 'data-act="new-deal"', 'New opportunity')}</div><div class="dm-laneb">${ds.map(d => `<div class="dm-card" draggable="true" data-drag="${d.id}" data-go="de:${d.id}"><b>${d.n}</b><span>${ic('Building', 'i13')}${coChip(CO(d.co))}</span><span>${ic('Dollar', 'i13')}${money(d.amt)}</span><span>${ic('Calendar', 'i13')}${d.late && s !== 'Won' ? `<span class="dm-late">Late, ${d.close}</span>` : d.close}</span><span>${ic('Users', 'i13')}${owner(d.own)}</span></div>`).join('')}<div class="dm-drop">Move here</div></div></div>`;
    }).join('');
    return top + `<div class="dbody dm-scroll dm-board">${lanes}</div>` + dock();
  };

  /* ---------- records ---------- */
  const R = { tab: 'activity', rail: {} };
  const tabs = list => `<div class="dm-tabs">${list.map(([k, label, n]) => `<span class="${R.tab === k ? 'on' : ''}" data-act="tab" data-v="${k}">${label}${n ? `<small>${n}</small>` : ''}</span>`).join('')}</div>`;
  const field = (label, val, { src = '', edit = '' } = {}) => `<div class="dm-f${edit ? ' ed' : ''}"${edit}><span>${label}</span><span>${val || '<span class="dm-faint">Empty</span>'}</span>${src ? `<em class="${src === 'Otto' ? 'o' : ''}">${src}</em>` : ''}</div>`;
  const group = (k, title, inner, n) => { const open = R.rail[k] !== false; return `<div class="dm-grp${open ? ' open' : ''}"><div class="dm-grph" data-act="grp" data-v="${k}">${ic('ChevronRight', 'i12')}${title}${n !== undefined ? `<small>${n}</small>` : ''}</div>${open ? `<div class="dm-grpb">${inner}</div>` : ''}</div>`; };
  const relRow = (go, pic, name, sub, tag = '') => `<div class="dm-rel" data-go="${go}">${pic}<div><b>${name}</b><span>${sub}</span></div>${tag}</div>`;
  function timeline(items) {
    if (!items.length) return empty('No activity yet');
    let lastM = '', out = '';
    for (const it of items) {
      const m = it.d <= -1 ? 'Upcoming' : it.d < 7 ? 'This week' : 'November';
      if (m !== lastM) { out += `<div class="dm-mon">${m}</div>`; lastM = m; }
      const chip = { in: ['ArrowDownLeft', 'in'], out: ['ArrowUpRight', 'out'], meet: ['Calendar', 'meet'], note: ['StickyNote', 'note'], edit: ['Pencil', 'edit'] }[it.k];
      out += `<div class="dm-tl" ${it.go ? `data-go="${it.go}"` : ''}><span class="dm-tlc ${chip[1]}">${ic(chip[0], 'i14')}</span><div><div class="dm-tl1"><span>${it.t}</span>${it.d <= -1 ? '<span class="badge t-blue">Upcoming</span>' : ''}<em>${it.at}</em></div>${it.subj ? `<b>${esc(it.subj)}</b>` : ''}${it.s ? `<p>${esc(it.s)}</p>` : ''}</div></div>`;
    }
    return out;
  }
  function activityFor(match) {
    const items = [];
    S.em.filter(match.em).forEach(e => e.msgs.forEach(m => items.push({ k: TEAM[m.a] ? 'out' : 'in', t: TEAM[m.a] ? `<b>${first(m.a)}</b> emailed <b>${m.to.split(',')[0].replace('me', 'you')}</b>` : `<b>${first(m.a)}</b> emailed ${m.to.startsWith('me') ? 'you' : `<b>${m.to.split(',')[0]}</b>`}`, subj: e.s, s: m.b.split('\n\n')[1] || '', at: m.at, d: e.wd + (m === e.msgs[e.msgs.length - 1] ? 0 : 2), go: 'em:' + e.id })));
    S.mt.filter(match.mt).forEach(m => items.push({ k: 'meet', t: `Meeting with <b>${m.who.map(first).join(', ')}</b>`, subj: m.t, s: m.up ? `${m.dur} on ${m.cal}` : m.sum, at: m.when.replace(/^\w+, /, ''), d: m.up ? -1 : ({ '20': 2, '19': 3, '18': 4, '13': 9 }[m.dy] || 6), go: 'mt:' + m.id }));
    S.no.filter(match.no).forEach(n => items.push({ k: 'note', t: `<b>${first(n.by)}</b> wrote a note`, subj: n.t, s: n.b, at: n.up, d: n.up === 'Today' || n.up === 'Just now' ? 0.05 : 8, go: 'no:' + n.id }));
    S.act.filter(match.act).forEach(a => items.push({ ...a }));
    return items.sort((a, b) => a.d - b.d);
  }
  function nextUp(ds, mt, briefText, facts) {
    let out = '';
    ds.filter(d => d.st !== 'Won').forEach(d => { out += `<div class="dm-nu" data-go="de:${d.id}">${badge(d.st)}<b>${d.n}</b><span>${money(d.amt)}</span><span class="dm-mut">Next step: ${d.next}</span></div>`; });
    if (briefText) out += `<div class="dm-nu dm-brief"><div class="dm-nuh">${byOtto()}<span class="dm-mut">Brief</span><span class="dm-faint">Updated 2 hours ago</span></div><p>${briefText}</p>${facts && facts.length ? `<div class="dm-facts">${facts.map(([k, v]) => `<span>${badge(k)}${v}</span>`).join('')}</div>` : ''}</div>`;
    if (mt) out += `<div class="dm-nu" data-go="mt:${mt.id}">${dateTile(mt.mo, mt.dy, 'sm')}<span class="dm-mut">Next meeting</span><b>${mt.t}</b><span class="dm-faint">${mt.when}</span></div>`;
    return out;
  }
  function recTabs(match, files) {
    const acts = activityFor(match), ems = S.em.filter(match.em), mts = S.mt.filter(match.mt), nos = S.no.filter(match.no);
    const T = [['activity', 'Activity', acts.length], ['emails', 'Emails', ems.length], ['meetings', 'Meetings', mts.length], ['notes', 'Notes', nos.length], ['files', 'Files', files.length]];
    let body = '';
    if (R.tab === 'activity') body = timeline(acts);
    if (R.tab === 'emails') body = emailGroups(ems);
    if (R.tab === 'meetings') body = mts.length ? `<div class="dm-cardlist">${mts.map(m => `<div class="dm-li" data-go="mt:${m.id}">${dateTile(m.mo, m.dy)}<div><b>${m.t}</b><span class="dm-mut">${m.when}, ${m.dur}</span></div><span class="dm-avs">${m.who.map(a => face(a, 's20')).join('')}</span>${m.up ? '<span class="badge t-blue">Upcoming</span>' : m.done ? '<span class="badge t-green">Updated</span>' : '<span class="dm-otl">Notes</span>'}</div>`).join('')}</div>` : empty('No meetings yet');
    if (R.tab === 'notes') body = (match.co ? `<form class="dm-addn" data-form="note" data-co="${match.co}"><input name="t" placeholder="Write a note" autocomplete="off"><button class="dm-pri sm" type="submit">${ic('Plus', 'i14')}Add</button></form>` : '') + (nos.length ? `<div class="dm-cardlist">${nos.map(n => `<div class="dm-li" data-go="no:${n.id}"><span class="dm-tlc note">${ic('StickyNote', 'i14')}</span><div><b>${esc(n.t)}</b><span class="dm-mut">${esc(n.b)}</span></div><span class="dm-faint">${n.up}</span></div>`).join('')}</div>` : empty('Add your first note'));
    if (R.tab === 'files') body = files.length ? `<div class="dm-cardlist">${files.map(f => `<div class="dm-li"><span class="dm-file">${ic('File', 'i14')}</span><div><b>${esc(f[0])}</b><span class="dm-mut">${f[1]}</span></div><span class="dm-faint">${f[2]}</span></div>`).join('')}</div>` : empty('No files yet');
    return tabs(T) + `<div class="dm-tabb">${body}</div>`;
  }
  const filesFor = ems => ems.flatMap(e => [...(e.att || []).map(a => [a, 'Draft attachment', 'Draft']), ...e.msgs.flatMap(m => (m.att || []).map(a => [a, `From ${nameOf(m.a)}`, m.at]))]);

  function coRecord(id) {
    const c = CO(id), ds = S.de.filter(d => d.co === id), ps = S.pe.filter(p => p.co === id), nm = S.mt.find(m => m.up && m.co === id);
    const match = { co: id, em: e => e.co === id, mt: m => m.co === id, no: n => n.co === id, act: a => a.co === id };
    const brief = `${c.n} is a ${c.rel.toLowerCase()}${c.arr ? ` paying ${money(c.arr)} a year` : ''}. ${ds.filter(d => d.st !== 'Won').map(d => `${d.n} is in ${d.st.toLowerCase()} at ${money(d.amt)}; the next step is to ${d.next.charAt(0).toLowerCase() + d.next.slice(1)}.`).join(' ')} Last touch ${c.lt.toLowerCase()}.`;
    const facts = (nm && nm.facts) || [];
    const main = `<div class="dm-head">${logo(c, 's44')}<div><h2>${c.n}</h2><div class="dm-facts1"><span>${ic('Globe', 'i13')}${c.d}</span><span>${ic('MapPin', 'i13')}${c.pl}</span><span>${ic('Users', 'i13')}${c.emp} people</span></div></div></div>
      <div class="dm-nus">${nextUp(ds, nm, brief, facts)}</div>${recTabs(match, filesFor(S.em.filter(match.em)))}`;
    const rail = group('gen', 'General', field('Domain', `<span class="dm-lnk">${c.d}</span>`, { src: 'Sync' }) + field('Relationship', badge(c.rel), { edit: ` data-act="pick" data-f="rel" data-id="${id}"`, src: 'You' }) + field('Industry', c.ind, { src: 'Otto' }) + field('Employees', c.emp, { src: 'Otto' }) + field('ARR', money(c.arr), { src: 'Sync' }) + field('Health', health(c.hl), { src: 'Otto' }) + field('Owner', owner(c.own), { edit: ` data-act="pick" data-f="own" data-id="${id}"` }))
      + group('soc', 'Social', field('LinkedIn', `<span class="dm-lnk">${c.li}</span>`, { src: 'Otto' }))
      + group('ppl', 'People', ps.map(p => relRow('pe:' + p.id, face(p.a, 's22'), p.n, p.t, badge(p.lc))).join(''), ps.length)
      + group('opp', 'Opportunities', ds.map(d => relRow('de:' + d.id, `<span class="dm-tlc edit">${ic('Handshake', 'i13')}</span>`, d.n, money(d.amt), badge(d.st))).join(''), ds.length)
      + group('more', 'More', `<div class="dm-faint dm-folded">3 empty fields</div>`);
    return header('Building', c.n, { crumb: ['companies', 'Companies'], star: id, acts: ib('ChevronUp', 'data-act="step" data-d="-1"', 'Previous') + ib('ChevronDown', 'data-act="step" data-d="1"', 'Next') + ib('Pencil', `data-act="compose" data-co="${id}"`, 'Email') + ib('More', '', 'More') }) + `<div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div><div class="dm-rail dm-scroll">${rail}</div></div>` + dock('Ask about ' + c.n);
  }
  function peRecord(id) {
    const p = PE(id), c = CO(p.co), ds = S.de.filter(d => d.who === p.a), nm = S.mt.find(m => m.up && m.who.includes(p.a));
    const match = { em: e => e.msgs.some(m => m.a === p.a), mt: m => m.who.includes(p.a), no: () => false, act: () => false };
    const main = `<div class="dm-head">${face(p.a, 's44')}<div><h2>${p.n}</h2><div class="dm-facts1"><span>${ic('Briefcase', 'i13')}${p.t}</span>${coChip(c)}<span>${ic('Mail', 'i13')}${p.email}</span><span>${ic('MapPin', 'i13')}${c.pl}</span></div></div></div>
      <div class="dm-nus">${nextUp(ds, nm, `${first(p.a)} is the ${p.t} at ${c.n}${ds.length ? ` and the main contact on ${ds.map(d => d.n).join(' and ')}` : ''}. ${S.em.some(e => e.need && e.msgs[e.msgs.length - 1].a === p.a) ? `There is an email from ${first(p.a)} that needs a reply.` : ''}`)}</div>${recTabs(match, [])}`;
    const rail = group('gen', 'General', field('Email', `<span class="dm-lnk">${p.email}</span>`, { src: 'Sync' }) + field('Title', p.t, { src: 'Otto' }) + field('Company', coChip(c)) + field('Lifecycle', badge(p.lc), { src: 'Otto' }) + field('Location', c.pl, { src: 'Otto' }) + field('Owner', owner(c.own)))
      + group('copp', 'Opportunities', ds.map(d => relRow('de:' + d.id, `<span class="dm-tlc edit">${ic('Handshake', 'i13')}</span>`, d.n, money(d.amt), badge(d.st))).join('') || '<div class="dm-faint dm-folded">None</div>', ds.length);
    return header('Users', p.n, { crumb: ['people', 'People'], acts: ib('Pencil', `data-act="compose" data-pe="${id}"`, 'Email') + ib('More', '', 'More') }) + `<div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div><div class="dm-rail dm-scroll">${rail}</div></div>` + dock('Ask about ' + first(p.a));
  }
  function deRecord(id) {
    const d = DE(id), c = CO(d.co), p = PA(d.who), nm = S.mt.find(m => m.up && m.de === id), cur = STAGES.indexOf(d.st);
    const path = `<div class="dm-path">${STAGES.map((s, k) => `<div class="${k === cur ? 'cur' + (s === 'Won' ? ' won' : '') : k < cur ? 'pass' : ''}" data-act="stage" data-id="${id}" data-v="${s}"><i></i><span>${s}${k === cur && s !== 'Won' ? `<small class="${d.age > 14 ? 'slow' : ''}">${d.age}d</small>` : ''}</span></div>`).join('')}</div>`;
    const match = { em: e => e.de === id, mt: m => m.de === id, no: () => false, act: a => a.de === id || (a.co === d.co && !a.de) };
    const main = `<div class="dm-head"><span class="dm-tile44">${ic('Handshake')}</span><div><h2>${d.n}</h2><div class="dm-facts1">${coChip(c)}<span>${ic('Dollar', 'i13')}${money(d.amt)}</span><span>${ic('Calendar', 'i13')}${d.late && d.st !== 'Won' ? `<span class="dm-late">Late, ${d.close}</span>` : 'Closes ' + d.close}</span></div></div></div>${path}
      <div class="dm-nus">${nextUp([], nm, d.st === 'Won' ? `Won on ${d.close}. The handoff workflow assigned customer success and booked the kickoff.` : `${p.n.split(' ')[0]} is the contact. ${d.next}. ${d.late ? 'The close date has passed, so agree on a new one in your reply.' : `Win chance is ${d.win}% at this stage.`}`, nm && nm.facts)}${d.st !== 'Won' ? `<div class="dm-nuact"><span class="dm-ghost" data-act="draft" data-id="${id}">${ic('Sparkles', 'i14')}Draft the next email</span></div>` : ''}</div>${recTabs(match, filesFor(S.em.filter(match.em)))}`;
    const rail = group('dgen', 'General', field('Name', d.n) + field('Stage', badge(d.st), { edit: ` data-act="pick" data-f="st" data-id="${id}"`, src: 'Otto' }) + field('Amount', money(d.amt), { src: 'Otto' }) + field('Close date', d.close) + field('Win chance', d.win + '%', { src: 'Otto' }) + field('Owner', owner(d.own), { edit: ` data-act="pick" data-f="downer" data-id="${id}"` }) + field('Next step', d.next, { src: 'Otto' }))
      + group('dco', 'Company', relRow('co:' + c.id, logo(c, 's22'), c.n, c.d, badge(c.rel)))
      + group('dppl', 'People', relRow('pe:' + p.id, face(p.a, 's22'), p.n, p.t, badge(p.lc)), 1);
    return header('Handshake', d.n, { crumb: ['deals', 'Opportunities'], acts: ib('More', '', 'More') }) + `<div class="dbody dm-rec"><div class="dm-main dm-scroll">${main}</div><div class="dm-rail dm-scroll">${rail}</div></div>` + dock('Ask about this deal');
  }

  /* ---------- meetings ---------- */
  const LMT = { f: 'up' };
  V.meetings = () => {
    const rows = S.mt.filter(m => LMT.f === 'all' || (LMT.f === 'up' ? m.up : !m.up));
    const st = LS('meetings'), q = st.q.toLowerCase();
    return header('Calendar', 'Meetings', { primary: primary('New meeting', 'new-meeting') }) + `<div class="dm-tb"><label class="dm-srch box">${ic('SearchIcon', 'i14')}<input data-input="q" data-k="meetings" value="${esc(st.q)}" placeholder="Search meetings" autocomplete="off"></label>${seg('mf', [['up', 'Upcoming'], ['past', 'Past'], ['all', 'All']], LMT.f)}<span class="sp"></span><span class="dm-plain">${ic('Video', 'i14')}Recorder on</span></div>`
      + `<div class="dbody dm-scroll"><table class="dm-tbl"><thead><tr><th class="dm-c0"><span>Meeting</span></th>${[['Clock', 'When'], ['Clock', 'Length'], ['Building', 'Company'], ['Handshake', 'Opportunity'], ['Users', 'Attendees'], ['Sparkles', 'Otto']].map(([i, l]) => `<th><span class="dm-thc">${ic(i)}${l}</span></th>`).join('')}<th></th></tr></thead><tbody>${rows.filter(m => !q || (m.t + CO(m.co).n).toLowerCase().includes(q)).map(m => `<tr data-go="mt:${m.id}"><td class="dm-c0"><span class="dm-nm">${dateTile(m.mo, m.dy, 'sm')}${m.t}</span></td><td>${m.when.replace(/^\w+, /, '')}</td><td>${m.dur}</td><td>${coChip(CO(m.co))}</td><td>${DE(m.de).n}</td><td><span class="dm-avs">${m.who.map(a => face(a, 's20')).join('')}</span></td><td><span class="dm-otl">${m.up ? 'Prep brief' : m.done ? 'Updated' : 'Notes'}</span></td><td></td></tr>`).join('')}</tbody></table></div>` + dock();
  };
  function mtPage(id) {
    const m = MT(id), c = CO(m.co), d = DE(m.de);
    if (!R.tab || !['notes', 'transcript'].includes(R.tab)) R.tab = 'notes';
    const head = `<div class="dm-head">${dateTile(m.mo, m.dy, 'lg')}<div><h2>${m.t}</h2><div class="dm-facts1">${coChip(c)}<span>${ic('Clock', 'i13')}${m.when}</span><span>${ic('Video', 'i13')}${m.dur} on ${m.cal}</span></div></div></div>`;
    let body;
    if (m.up) body = `<div class="dm-nus">${nextUp([d], null, m.brief, m.facts)}</div><div class="dm-sec">Attendees</div><div class="dm-cardlist">${m.who.map(a => `<div class="dm-li" data-go="pe:${PA(a).id}">${face(a, 's24')}<div><b>${nameOf(a)}</b><span class="dm-mut">${PA(a).t}, ${c.n}</span></div></div>`).join('')}</div>`;
    else {
      const left = m.upd.filter(u => !u[3]).length;
      const notes = `<div class="dm-nus"><div class="dm-nu dm-brief"><div class="dm-nuh">${byOtto()}<span class="dm-mut">Notes</span></div><p>${m.sum}</p></div></div>
        <div class="dm-sec">Record updates${left ? `<small>${left}</small>` : ''}${left > 1 ? `<span class="dm-ghost sm" data-act="apply-all" data-id="${id}">${ic('Check', 'i14')}Apply all</span>` : ''}</div><div class="dm-cardlist">${m.upd.map((u, k) => `<div class="dm-upd${u[3] ? ' done' : ''}"><div><span>Set <b>${u[0]}</b> to <b>${u[0] === 'Amount' ? money(u[1]) : u[1]}</b> on ${d.n}</span><q>${u[2]}</q></div>${u[3] === 1 ? `<span class="dm-ok">${ic('Check', 'i12')}Applied</span>` : u[3] === 2 ? '<span class="dm-faint">Skipped</span>' : `<span class="dm-ibp" data-act="apply" data-id="${id}" data-k="${k}" title="Apply">${ic('Check', 'i14')}</span><span class="dm-ib" data-act="skip" data-id="${id}" data-k="${k}" title="Skip">${ic('X', 'i14')}</span>`}</div>`).join('')}</div>
        <div class="dm-sec">Action items</div><div class="dm-cardlist">${m.acts.map((a, k) => `<label class="dm-todo"><span class="dm-cb${(m.todo || [])[k] ? ' on' : ''}" data-act="todo" data-id="${id}" data-k="${k}">${(m.todo || [])[k] ? ic('Check', 'i12') : ''}</span><span class="${(m.todo || [])[k] ? 'done' : ''}">${a}</span></label>`).join('')}</div>`;
      const tr = `<div class="dm-cardlist dm-tr">${m.tr.map(([a, t], k) => `<div class="dm-line">${face(a, 's24')}<div><b>${nameOf(a)}</b><em>${['0:42', '1:15', '3:08', '3:30', '5:52'][k] || '6:10'}</em><p>${t}</p></div></div>`).join('')}</div>`;
      body = tabs([['notes', 'Notes'], ['transcript', 'Transcript', m.tr.length]]) + `<div class="dm-tabb">${R.tab === 'transcript' ? tr : notes}</div>`;
    }
    const rail = group('mgen', 'General', field('When', m.when) + field('Length', m.dur) + field('Calendar', m.cal, { src: 'Sync' }) + field('Recorder', '<span class="badge t-green">On</span>')) + group('mco', 'Company', relRow('co:' + c.id, logo(c, 's22'), c.n, c.d, badge(c.rel))) + group('mopp', 'Opportunity', relRow('de:' + d.id, `<span class="dm-tlc edit">${ic('Handshake', 'i13')}</span>`, d.n, money(d.amt), badge(d.st))) + group('matt', 'Attendees', m.who.map(a => relRow('pe:' + PA(a).id, face(a, 's22'), nameOf(a), PA(a).t)).join(''), m.who.length);
    return header('Calendar', m.t, { crumb: ['meetings', 'Meetings'], acts: badge(m.up ? 'Upcoming' : 'Past') }) + `<div class="dbody dm-rec"><div class="dm-main dm-scroll">${head}${body}</div><div class="dm-rail dm-scroll">${rail}</div></div>` + dock('Ask about this meeting');
  }

  /* ---------- emails ---------- */
  const LEM = { f: 'all' };
  const lastIn = e => !TEAM[e.msgs[e.msgs.length - 1].a];
  function emailGroups(list) {
    const f = LEM.f, rows = list.filter(e => f === 'all' || (f === 'need' ? e.need : f === 'sent' ? !lastIn(e) : lastIn(e)));
    const groups = [['This week', rows.filter(e => e.wd < 7)], ['Last week', rows.filter(e => e.wd >= 7)]].filter(g => g[1].length);
    return `<div class="dm-ef">${seg('ef', [['all', `All <small>${list.length}</small>`], ['need', `Needs reply <small>${list.filter(e => e.need).length}</small>`], ['sent', 'Sent'], ['rec', 'Received']], f)}</div>` + (groups.map(([g, es]) => `<div class="dm-mon">${g}</div><div class="dm-cardlist">${es.map(emRow).join('')}</div>`).join('') || empty('No emails here'));
  }
  const emRow = e => { const ws = [...new Set(e.msgs.map(m => m.a))]; const l = e.msgs[e.msgs.length - 1]; return `<div class="dm-er" data-go="em:${e.id}"><span class="dm-avs">${ws.slice(0, 3).map(a => face(a, 's24')).join('')}</span><div><div class="dm-er1">${ic(lastIn(e) ? 'ArrowDownLeft' : 'ArrowUpRight', 'i14')}<b>${ws.map(first).join(', ')}</b>${e.msgs.length > 1 ? `<small>${e.msgs.length}</small>` : ''}</div><div class="dm-er2"><b>${esc(e.s)}</b>${e.need ? '<span class="badge t-yellow">Needs reply</span>' : ''}</div><p>${esc(l.b.split('\n\n')[1] || l.b)}</p></div><em>${e.when}</em></div>`; };
  V.emails = () => {
    const st = LS('emails'), q = st.q.toLowerCase(), f = LEM.f;
    const rows = S.em.filter(e => (f === 'all' || (f === 'need' ? e.need : f === 'sent' ? !lastIn(e) : lastIn(e))) && (!q || (e.s + CO(e.co).n + e.msgs.map(m => nameOf(m.a)).join(' ')).toLowerCase().includes(q)));
    return header('Mail', 'Emails', { primary: primary('New email', 'compose', 'Mail') }) + `<div class="dm-tb"><label class="dm-srch box">${ic('SearchIcon', 'i14')}<input data-input="q" data-k="emails" value="${esc(st.q)}" placeholder="Search emails" autocomplete="off"></label>${seg('ef', [['all', 'All'], ['need', `Needs reply <small>${S.em.filter(e => e.need).length}</small>`], ['sent', 'Sent'], ['rec', 'Received']], f)}<span class="sp"></span><span class="dm-plain">${ic('Mail', 'i14')}2,184 synced</span></div>`
      + `<div class="dbody dm-scroll"><table class="dm-tbl"><thead><tr><th class="dm-c0"><span>Subject</span></th>${[['ArrowUpDown', 'Last'], ['Building', 'Company'], ['Users', 'People'], ['Clock', 'When']].map(([i, l]) => `<th><span class="dm-thc">${ic(i)}${l}</span></th>`).join('')}<th></th></tr></thead><tbody>${rows.map(e => `<tr data-go="em:${e.id}"><td class="dm-c0"><span class="dm-nm"><b>${esc(e.s)}</b>${e.msgs.length > 1 ? `<small class="dm-faint">${e.msgs.length}</small>` : ''}${e.need ? '<span class="badge t-yellow">Needs reply</span>' : ''}</span></td><td><span class="dm-last"><span>${ic(lastIn(e) ? 'ArrowDownLeft' : 'ArrowUpRight', 'i13')}</span>${lastIn(e) ? 'Received' : 'Sent'}</span></td><td>${coChip(CO(e.co))}</td><td><span class="dm-avs">${[...new Set(e.msgs.map(m => m.a))].map(a => face(a, 's20')).join('')}</span></td><td>${e.when.replace(/(\d+:\d+ [AP]M)/, '<span class="dm-faint">$1</span>')}</td><td></td></tr>`).join('') || `<tr><td colspan="6">${empty('No emails here')}</td></tr>`}</tbody></table></div>` + dock();
  };
  // the reader opens as a sheet from the right, as in the app
  let sheet = null;
  function openReader(id) {
    const e = EM(id), c = CO(e.co), d = DE(e.de);
    const ppl = [...new Set(e.msgs.map(m => m.a))];
    const open = e.open || (e.open = new Set([e.msgs.length - 1]));
    const msg = (m, k) => open.has(k) ? `<div class="dm-msg"><div class="dm-msgh">${face(m.a, 's28')}<div><b>${nameOf(m.a)}</b><span class="dm-mut">${TEAM[m.a] ? TEAM[m.a][3] : PA(m.a).email}</span><span class="dm-to">to ${m.to}${ic('ChevronDown', 'i12')}</span></div><em>${m.at}</em></div><div class="dm-msgb">${paras(m.b)}${k > 0 ? `<details class="dm-quote"><summary>${ic('More', 'i14')}</summary><div>On ${e.msgs[k - 1].at}, ${nameOf(e.msgs[k - 1].a)} wrote:<br>${paras(e.msgs[k - 1].b)}</div></details>` : ''}${(m.att || []).map(a => `<span class="dm-att">${ic('Paperclip', 'i13')}${esc(a)}</span>`).join('')}</div></div>`
      : `<div class="dm-msg fold" data-act="unfold" data-id="${id}" data-k="${k}">${face(m.a, 's28')}<b>${nameOf(m.a)}</b><span class="dm-mut">${esc((m.b.split('\n\n')[1] || m.b).slice(0, 110))}</span><em>${m.at}</em></div>`;
    const reply = e.need ? `<div class="dm-reply"><div class="dm-replyh"><span class="dm-mut">Reply</span>${byOtto('Draft by Otto, from the pricing page and your email tone')}</div><div class="dm-rf"><span>To</span><span class="dm-in">${nameOf(e.msgs[e.msgs.length - 1].a)} &lt;${PA(e.msgs[e.msgs.length - 1].a)?.email || ''}&gt;</span></div><div class="dm-rf"><span>Subject</span><span class="dm-in">Re: ${esc(e.s)}</span></div><textarea data-input="draft" data-id="${id}" rows="9">${esc(e.draft)}</textarea>${(e.att || []).length ? `<div>${e.att.map(a => `<span class="dm-att">${ic('Paperclip', 'i13')}${esc(a)}</span>`).join('')}</div>` : ''}<div class="dm-replyf"><span class="dm-ghost" data-act="shorter" data-id="${id}">${ic('Sparkles', 'i14')}Shorter</span><span class="sp"></span><span class="dm-plainb" data-act="close-sheet">Cancel</span><span class="dm-pri" data-act="send" data-id="${id}">${ic('Send', 'i14')}Send</span></div></div>` : `<div class="dm-reply min"><span class="dm-pri" data-act="reply" data-id="${id}">${ic('Reply', 'i14')}Reply</span></div>`;
    const html = `<div class="dm-sheeth">${ic('Mail')}<b>${esc(e.s)}</b><span class="sp"></span>${ib('Handshake', `data-act="sheet-go" data-go="de:${d.id}"`, 'Open opportunity')}${ib('Building', `data-act="sheet-go" data-go="co:${c.id}"`, 'Open company')}${ib('X', 'data-act="close-sheet"', 'Close')}</div>
      <div class="dm-sheetb dm-scroll"><div class="dm-dl"><span>Company</span><span>${coChip(c)}</span><span>Opportunity</span><span><span class="dm-link" data-act="sheet-go" data-go="de:${d.id}">${d.n}</span> ${badge(d.st)}</span><span>People</span><span class="dm-avs-l">${ppl.map(a => `<span class="dm-pp">${face(a, 's20')}${nameOf(a)}</span>`).join('')}</span><span>Messages</span><span>${e.msgs.length}</span></div>${e.msgs.map(msg).join('')}</div>${reply}`;
    showSheet(html, 'em:' + id);
  }
  function showSheet(html, key) {
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.className = 'dm-sheetwrap';
      sheet.innerHTML = '<div class="dm-scrim" data-act="close-sheet"></div><div class="dm-sheet"></div>';
      page.appendChild(sheet);
      requestAnimationFrame(() => sheet && sheet.classList.add('on'));
    }
    sheet.dataset.key = key;
    $('.dm-sheet', sheet).innerHTML = html;
    faces(sheet);
  }
  const closeSheet = () => { if (!sheet) return; const s = sheet; sheet = null; s.classList.remove('on'); setTimeout(() => s.remove(), RM ? 0 : 260); };

  /* ---------- notes, knowledge, skills ---------- */
  V.notes = () => header('StickyNote', 'Notes', { primary: primary('New note', 'new-note') }) + toolbar('notes', { view: 'All notes', count: 58 + S.no.length, search: 'Search notes' })
    + table('notes', [
      { k: 't', label: 'Note', v: n => `<span class="dm-nm"><span class="dm-tlc note sm">${ic('StickyNote', 'i12')}</span><b>${esc(n.t)}</b></span>` },
      { k: 'co', label: 'Record', icon: 'Building', v: n => coChip(CO(n.co)), sv: n => CO(n.co).n },
      { k: 'ty', label: 'Type', icon: 'Tag', v: n => badge(n.ty) },
      { k: 'by', label: 'Author', icon: 'Users', v: n => owner(n.by), sv: n => TEAM[n.by][0] },
      { k: 'up', label: 'Updated', icon: 'Clock', v: n => n.up },
      { k: 'cr', label: 'Created', icon: 'Calendar', v: n => n.cr },
    ], S.no, { go: n => 'no:' + n.id, addLabel: 'New note' }) + dock();
  function noPage(id) {
    const n = S.no.find(x => x.id === id), c = CO(n.co);
    return header('StickyNote', esc(n.t), { crumb: ['notes', 'Notes'], acts: `<span class="dm-saved">${ic('Check', 'i12')}Saved</span>` + ib('More', '', 'More') }) + `<div class="dbody dm-scroll dm-canvasbg"><div class="dm-doc"><div class="dm-meta">${coChip(c)}${badge(n.ty)}${owner(n.by)}<span class="dm-faint">Updated ${n.up}</span></div><div class="dm-h1" contenteditable="true" spellcheck="false" data-edit="t" data-id="${id}">${esc(n.t)}</div><div class="dm-ed" contenteditable="true" spellcheck="false" data-edit="b" data-id="${id}">${esc(n.b)}</div></div></div>`;
  }
  const LK = { cur: 'k1', mode: 'write', scope: 'shared' };
  V.k = () => {
    const list = S.kb.filter(k => LK.scope === 'shared' ? k.sh : !k.sh);
    if (!list.some(k => k.id === LK.cur)) LK.cur = list[0].id;
    const d = S.kb.find(k => k.id === LK.cur);
    const doc = LK.mode === 'write' ? `<div class="dm-h1" contenteditable="true" spellcheck="false" data-kedit="t" data-id="${d.id}">${d.t}</div>${d.body.map(([t, x], i) => t === 'h' ? `<h3 contenteditable="true" spellcheck="false" data-kedit="${i}" data-id="${d.id}">${x}</h3>` : `<p contenteditable="true" spellcheck="false" data-kedit="${i}" data-id="${d.id}">${x}</p>`).join('')}` : `<div class="dm-h1">${d.t}</div>${d.body.map(([t, x]) => t === 'h' ? `<h3>${x}</h3>` : `<p>${x}</p>`).join('')}`;
    return header('Book', 'Knowledge', { primary: primary('New', 'new-kb'), acts: `<span class="dm-plain">${ic('Upload', 'i14')}Upload</span>` }) + `<div class="dbody dm-split"><div class="dm-klist dm-scroll">${list.map(k => `<div class="dm-ki${k.id === LK.cur ? ' on' : ''}" data-act="kb" data-id="${k.id}">${ic(k.sh ? 'Book' : 'File', 'i14')}<div><b>${k.t}</b><span>${k.sub}</span></div></div>`).join('')}</div><div class="dm-scroll dm-canvasbg"><div class="dm-kbar">${seg('kmode', [['write', 'Write'], ['preview', 'Preview']], LK.mode)}${seg('kscope', [['shared', 'Shared'], ['personal', 'Personal']], LK.scope)}<span class="sp"></span><span class="dm-saved">${ic('Check', 'i12')}Saved</span></div><div class="dm-doc">${doc}</div></div></div>`;
  };
  const LSK = { tab: 'All', q: '' };
  V.s = () => {
    const tabsK = ['All', 'Your skills', 'Build pipeline', 'Know your deals', 'Win the deal', 'Run the business', 'Helpers'];
    const q = LSK.q.toLowerCase(), list = S.sk.filter(s => (LSK.tab === 'All' || (LSK.tab === 'Your skills' ? s.mine : s.g === LSK.tab)) && (!q || (s.n + s.d).toLowerCase().includes(q)));
    return header('Box', 'Skills', { primary: primary('New skill', 'new-skill') }) + `<div class="dm-tb"><label class="dm-srch box">${ic('SearchIcon', 'i14')}<input data-input="skq" value="${esc(LSK.q)}" placeholder="Find a skill" autocomplete="off"></label></div><div class="dm-tabs dm-tabsp">${tabsK.map(t => `<span class="${LSK.tab === t ? 'on' : ''}" data-act="sktab" data-v="${t}">${t}</span>`).join('')}</div><div class="dbody dm-scroll"><div class="dm-grid3">${list.map(s => `<div class="dm-skc" data-act="skill" data-id="${s.id}"><div><b>${s.n}</b><span class="badge ${s.sp === 'Deep' ? 't-violet' : 't-gray'}">${s.sp}</span></div><p>${s.d}</p><span class="dm-faint">/${s.n.toLowerCase().replace(/[^a-z]+/g, '-')}</span></div>`).join('') || empty('No matches')}</div></div>` + dock();
  };
  function openSkill(id) {
    const s = S.sk.find(x => x.id === id);
    showSheet(`<div class="dm-sheeth">${ic('Box')}<b>${s.n}</b><span class="badge ${s.sp === 'Deep' ? 't-violet' : 't-gray'}">${s.sp}</span><span class="sp"></span>${ib('X', 'data-act="close-sheet"', 'Close')}</div><div class="dm-sheetb dm-scroll dm-pad"><p class="dm-lead">${s.d}.</p><div class="dm-dl"><span>Group</span><span>${s.g}</span><span>Command</span><span><span class="kbd">/${s.n.toLowerCase().replace(/[^a-z]+/g, '-')}</span></span><span>Owner</span><span>${s.mine ? owner('JR') : 'Omniscient'}</span></div><div class="dm-sec">Steps</div><ol class="dm-steps">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol><div class="dm-sec">Try it</div><div class="dm-try" data-act="run-skill" data-id="${s.id}"><span class="dm-skchip">${ic('Box', 'i12')}${s.n}</span>${s.ask}<span class="dm-send">${ic('ArrowUp')}</span></div></div>`, 'sk:' + id);
  }

  /* ---------- workflows ---------- */
  const LWF = { tab: 'Workflows' };
  V.workflows = () => {
    const t = LWF.tab;
    let body;
    if (t === 'Workflows') body = `<table class="dm-tbl"><thead><tr><th class="dm-c0"><span>Workflow</span></th>${[['Zap', 'Starts'], ['Tag', 'Status'], ['Clock', 'Runs this week'], ['Settings', 'Active']].map(([i, l]) => `<th><span class="dm-thc">${ic(i)}${l}</span></th>`).join('')}<th></th></tr></thead><tbody>${S.wf.map(w => `<tr data-go="wf:${w.id}"><td class="dm-c0"><span class="dm-nm"><span class="dm-tile28">${ic('Workflow', 'i14')}</span><b>${w.n}</b></span></td><td>${w.trig}</td><td><span class="badge ${w.live ? 't-green' : 't-gray'}">${w.live ? 'Active' : 'Paused'}</span></td><td class="num">${w.runs}</td><td>${sw('wf', w.id, w.live)}</td><td></td></tr>`).join('')}</tbody></table>`;
    if (t === 'Agent library') body = `<div class="dm-grid3">${[['Mail', 'Follow up after a proposal', 'Emails the contact three days after a proposal'], ['Calendar', 'Prep every first meeting', 'Writes a brief when a meeting is booked'], ['Bell', 'Flag quiet deals', 'Tells the owner when a deal goes 14 days without activity'], ['Users', 'Hand off won deals', 'Assigns customer success and books the kickoff'], ['Sparkles', 'Wrap up every call', 'Proposes record updates from the transcript'], ['Radar', 'Route inbound leads', 'Scores new leads and assigns an owner']].map(([i, l, a]) => `<div class="dm-skc" data-act="use-agent" data-v="${l}"><span class="dm-tile28">${ic(i, 'i14')}</span><b>${l}</b><p>${a}</p></div>`).join('')}</div>`;
    if (t === 'Runs') body = `<table class="dm-tbl"><thead><tr><th class="dm-c0"><span>Run</span></th>${[['Building', 'Record'], ['Tag', 'Result'], ['Clock', 'When']].map(([i, l]) => `<th><span class="dm-thc">${ic(i)}${l}</span></th>`).join('')}<th></th></tr></thead><tbody>${[['w1', 'vercel', 'Waiting', '2 minutes ago'], ['w2', 'anthropic', 'Done', '1 hour ago'], ['w1', 'figma', 'Replied', '3 hours ago'], ['w5', 'notion', 'Needs approval', 'Today 8:00 AM'], ['w4', 'airbnb', 'Done', 'Nov 3'], ['w1', 'ramp', 'Replied', 'Nov 20']].map(([w, c, r, at]) => `<tr data-go="wf:${w}"><td class="dm-c0"><span class="dm-nm"><span class="dm-tile28">${ic('Workflow', 'i14')}</span>${S.wf.find(x => x.id === w).n}</span></td><td>${coChip(CO(c))}</td><td><span class="badge ${r === 'Needs approval' ? 't-amber' : r === 'Waiting' ? 't-blue' : 't-green'}">${r}</span></td><td class="dm-mut">${at}</td><td></td></tr>`).join('')}</tbody></table>`;
    if (t === 'Approvals') { const a = S.ap.find(x => x.id === LWF.ap) || S.ap[0]; body = S.ap.length ? `<div class="dm-split2"><div class="dm-klist">${S.ap.map(x => `<div class="dm-ki${x === a ? ' on' : ''}" data-act="ap" data-id="${x.id}">${face(x.who, 's24')}<div><b>${esc(x.s)}</b><span>${S.wf.find(w => w.id === x.wf).n}</span></div></div>`).join('')}</div><div class="dm-pad"><span class="badge t-amber">Needs approval</span><h3 class="dm-h3">${esc(a.s)}</h3><div class="dm-dl"><span>To</span><span>${nameOf(a.who)}</span><span>Company</span><span>${coChip(CO(a.co))}</span><span>Workflow</span><span>${S.wf.find(w => w.id === a.wf).n}</span></div><div class="dm-mailbody">${paras(a.b)}</div><div class="dm-replyf"><span class="dm-plainb" data-act="ap-skip" data-id="${a.id}">Skip</span><span class="dm-pri" data-act="ap-ok" data-id="${a.id}">${ic('ArrowUpRight', 'i14')}Approve and open in Gmail</span></div></div></div>` : empty('Nothing to approve'); }
    return header('Bot', 'Workflows', { primary: primary('New workflow', 'new-wf') }) + `<div class="dm-tb"><span class="dm-chiptabs">${['Workflows', 'Agent library', 'Runs', 'Approvals'].map(x => `<span class="${t === x ? 'on' : ''}" data-act="wftab" data-v="${x}">${x}${x === 'Approvals' && S.ap.length ? `<small>${S.ap.length}</small>` : ''}</span>`).join('')}</span></div><div class="dbody dm-scroll">${body}</div>` + dock();
  };
  function wfPage(id) {
    const w = S.wf.find(x => x.id === id);
    const runs = [['vercel', 'Waiting', '2 minutes ago'], ['figma', 'Replied', '3 hours ago'], ['notion', 'Needs approval', 'Today 8:00 AM'], ['ramp', 'Replied', 'Nov 20'], ['stripe', 'Done', 'Nov 18']];
    return header('Workflow', w.n, { crumb: ['workflows', 'Workflows'], acts: `<span class="badge ${w.live ? 't-green' : 't-gray'}">${w.live ? 'Active' : 'Paused'}</span>${sw('wf', w.id, w.live)}` }) + `<div class="dbody dm-rec"><div class="dm-main dm-scroll dm-flowbg"><div class="flow dm-flow${w.live ? ' live' : ''}"><div class="trig"><div class="k">${ic('Zap', 'i14')}Starts</div><b>${w.trig}</b></div>${w.steps.map(([icn, b, s], k) => `<div class="conn">${w.live ? `<span class="flowdot" style="animation-delay:${k * .5}s"></span>` : ''}</div><div class="step"><span class="tile">${ic(icn, 'i14')}</span><div><b>${b}</b><small>${s}</small></div></div>`).join('')}</div></div><div class="dm-rail dm-scroll">${group('wr', 'Runs', runs.map(([c, r, at]) => relRow('co:' + c, logo(CO(c), 's22'), CO(c).n, at, `<span class="badge ${r === 'Needs approval' ? 't-amber' : r === 'Waiting' ? 't-blue' : 't-green'}">${r}</span>`)).join(''), w.runs)}${group('ws', 'Settings', field('Runs as', owner('JR')) + field('Created', 'Oct 2') + field('Approvals', 'Emails only'))}</div></div>`;
  }

  /* ---------- settings ---------- */
  const LST = { cur: 'General' };
  V.settings = () => {
    const G = [['You', ['Account', 'Security', 'Notifications', 'Experience']], ['Workspace', ['General', 'Members', 'Sign-in', 'Brand', 'Templates', 'Plans & billing']], ['Connections', ['Mail & calendar', 'Call notes', 'Chrome extension', 'Integrations']], ['Data', ['Data model', 'Workflows', 'Capture', 'Imports', 'Trash']]];
    const sec = (t, sub, inner) => `<div class="dm-ssec"><h3>${t}</h3><p>${sub}</p>${inner}</div>`;
    const appRows = cat => `<div class="dm-cardlist">${S.apps.map((a, k) => a[3] === cat ? `<div class="dm-li"><span class="dm-blogo"><img src="/assets/logos/${a[1]}" alt="" width="16" height="16"></span><div><b>${a[0]}</b><span class="dm-mut">${a[2] ? 'Connected as jonah@northwind.co' : 'Not connected'}</span></div>${a[2] ? sw('app', k, 1) : `<span class="dm-ghost sm" data-act="sw" data-k="app" data-id="${k}">Connect ${a[0]}</span>`}</div>` : '').join('')}</div>`;
    const P = {
      'General': sec('Workspace', 'The name and logo your team sees', `<div class="dm-card">${field('Name', 'Northwind')}${field('Logo', '<span class="dm-nwl">N</span>')}${field('Address', 'app.tryomniscient.com/northwind')}</div>`) + sec('Otto', 'What Otto can do in this workspace', `<div class="dm-card">${field('Writes drafts', sw('set', 'o1', 1))}${field('Updates records from calls', sw('set', 'o2', 1))}${field('Sends without approval', sw('set', 'o3', 0))}</div>`),
      'Members': sec('Members', 'People in Northwind and what they can change', `<div class="dm-cardlist">${Object.entries(TEAM).map(([k, t]) => `<div class="dm-li">${face(k, 's24')}<div><b>${t[0]}</b><span class="dm-mut">${t[3]}</span></div><span class="badge">${k === 'AO' ? 'Owner' : k === 'TL' ? 'Admin' : 'Member'}</span></div>`).join('')}</div><span class="dm-ghost dm-mt" data-act="invite">${ic('Users', 'i14')}Invite teammates</span>`),
      'Mail & calendar': sec('Mail and calendar', 'Accounts Omniscient reads to log emails and meetings', appRows('Mail & calendar')),
      'Call notes': sec('Call notes', 'Where the recorder joins your calls', appRows('Call notes')),
      'Integrations': sec('Integrations', 'Tools that share records with Omniscient', appRows('Integrations')),
      'Plans & billing': sec('Plan', 'Your plan and seats', `<div class="dm-card dm-plan"><div><span class="badge t-violet">Pro</span><b>$49 a seat a month</b><span class="dm-mut">5 seats, billed yearly, renews January 12</span></div><span class="dm-ghost">Change plan</span></div>`) + sec('Invoices', 'Sent to amara@northwind.co', `<div class="dm-cardlist">${['Nov 12', 'Oct 12', 'Sep 12'].map(d => `<div class="dm-li"><span class="dm-file">${ic('File', 'i14')}</span><div><b>Invoice, ${d}</b><span class="dm-mut">$245.00</span></div><span class="badge t-green">Paid</span></div>`).join('')}</div>`),
      'Account': sec('Account', 'Your name and how you sign in', `<div class="dm-card">${field('Name', 'Jonah Reyes')}${field('Email', 'jonah@northwind.co')}${field('Sign in with', 'Google')}</div>`),
    };
    const content = P[LST.cur] || sec(LST.cur, 'Settings for ' + LST.cur.toLowerCase(), `<div class="dm-card">${field('Status', '<span class="badge t-green">On</span>')}${field('Last changed', 'Nov 12 by Theo Lambert')}</div>`);
    return header('Settings', 'Settings') + `<div class="dbody dm-sets"><div class="dm-snav dm-scroll">${G.map(([g, items]) => `<div class="dm-sg">${g}</div>${items.map(i => `<div class="dm-si${LST.cur === i ? ' on' : ''}" data-act="set" data-v="${i}">${i}</div>`).join('')}`).join('')}</div><div class="dm-scroll dm-sbody"><div class="dm-sin">${content}</div></div></div>`;
  };

  /* ---------- Ask Otto ---------- */
  const GROUPS = { 'Build pipeline': ['Find founders of fast-growing software companies', 'Find companies like Linear and Airbnb'], 'Know your deals': ['Which deals need me this week?', 'What will we close in December?'], 'Win the deal': ['Prep me for my next meeting', 'Draft a reply to Ivan'], 'Run the business': ['How is the pipeline split by owner?', 'What will we close in December?'], 'Helpers': ['Summarize Stripe', 'Research Anthropic'] };
  let askGroup = null;
  V.ask = () => {
    const thread = S.chat.map(m => m.u
      ? `<div class="dm-um dm-in">${m.skill ? `<span class="dm-skchip">${ic('Box', 'i12')}${m.skill}</span>` : ''}<div class="dm-umr"><div class="dm-ubub">${esc(m.t)}</div>${face('JR', 's26')}</div></div>`
      : `<div class="dm-om dm-in">${otto(24)}<div class="dm-omb">${m.busy ? `<div class="dm-think"><span>Thinking</span>${loader()}<span class="dm-faint">${m.busy}</span></div>` : `${m.used ? `<div class="dm-used">${ic('Box', 'i12')}Used ${m.used}</div>` : ''}${m.h}`}</div></div>`).join('');
    const welcome = `<div class="dm-hello"><div class="dm-h1">What can I help you with?</div><div class="dm-pills">${Object.keys(GROUPS).map(g => `<span class="${askGroup === g ? 'on' : ''}" data-act="agroup" data-v="${g}">${g}</span>`).join('')}</div>${askGroup ? `<div class="dm-prompts dm-in">${GROUPS[askGroup].map(q => `<div data-act="ask" data-q="${esc(q)}">${ic('Sparkles', 'i14')}${q}${ic('ArrowUpRight', 'i14')}</div>`).join('')}</div>` : ''}</div>`;
    return header('Sparkles', S.chat.length ? esc(S.chat[0].t) : 'Ask Otto', { acts: S.chat.length ? `<span class="dm-plain" data-act="new-chat">${ic('Plus', 'i14')}New chat</span>` : '' }).replace(/<span class="dm-ib"[^>]*data-act="star"[^>]*>.*?<\/span>|<span class="dm-ib"[^>]*title="Favorite"[^>]*>.*?<\/span>/, '')
      + `<div class="dbody dm-scroll dm-chat">${S.chat.length ? `<div class="dm-thread">${thread}${!asking ? `<div class="dm-next">${Object.values(GROUPS).flat().filter((q, i, a) => a.indexOf(q) === i && !S.chat.some(m => m.t === q)).slice(0, 3).map(q => `<span data-act="ask" data-q="${esc(q)}">${q}</span>`).join('')}</div>` : ''}</div>` : welcome}</div>`
      + `<form class="dm-dock dm-askdock${S.chat.length ? '' : ' mid'}" data-form="ask"><textarea name="q" rows="1" placeholder="Ask anything, or type / for skills" aria-label="Ask Otto"></textarea><div class="dm-dockr">${ib('Plus', '', 'Add files and more')}${ib('Mic', '', 'Dictate')}<span class="sp"></span><button class="dm-send" type="submit" aria-label="Send">${ic('ArrowUp')}</button></div></form>`;
  };
  const card = (icon, label, chip, body, foot = '') => `<div class="dm-ocard"><div class="dm-ocardh">${ic(icon, 'i14')}<span>${label}</span>${chip || ''}</div><div class="dm-ocardb">${body}</div>${foot ? `<div class="dm-ocardf">${foot}</div>` : ''}</div>`;
  const cardFoot = (label, act, icon = 'Check') => `<span class="dm-pri sm" ${act}>${ic(icon, 'i14')}${label}</span>${ib('Copy', 'data-act="copy"', 'Copy')}<span class="sp"></span>${ib('X', 'data-act="dismiss"', 'Dismiss')}`;
  function answer(q) {
    const s = q.toLowerCase();
    const co = S.co.find(c => s.includes(c.n.toLowerCase()));
    const pe = S.pe.find(p => s.includes(p.n.split(' ')[0].toLowerCase()));
    const open = S.de.filter(d => d.st !== 'Won');
    const dealRow = d => `<div class="dm-orow" data-go="de:${d.id}">${logo(CO(d.co), 's20')}<b>${d.n}</b>${badge(d.st)}<em>${money(d.amt)}</em></div>`;
    if (/like (linear|airbnb|our best)|lookalike/.test(s)) return { used: 'Companies like our best customers', busy: 'Reading your best customers', h: `<p>Companies that look like Linear and Airbnb: product-led, 100 to 1,000 people, selling to teams. Three are already in Northwind.</p>${card('Building', 'Companies', '', [['vercel', 'Developer tools, 650 people'], ['notion', 'Productivity, 800 people'], ['figma', 'Design, 1,500 people']].map(([id, sub]) => `<div class="dm-orow" data-go="co:${id}">${logo(CO(id), 's20')}<b>${CO(id).n}</b><span class="dm-mut">${sub}</span><em>In CRM</em></div>`).join(''), cardFoot('Add to a list', 'data-act="done-card"'))}` };
    if (/lead|find|founder|heads? of/.test(s)) {
      const LD = [['GR', 'p2', 'CEO, Vercel'], ['DF', 'p7', 'CEO, Figma'], ['IZ', 'p3', 'CEO, Notion'], ['DA', 'p13', 'CEO, Anthropic']];
      return { used: 'Find leads', busy: 'Searching people and companies', h: `<p>Founders and CEOs of fast-growing software companies, ranked by fit. All four are already in Northwind, so I matched them to their records.</p>${card('Radar', 'Leads', '<span class="dm-cnt">4 found</span>', LD.map(([a, id, t]) => `<div class="dm-orow" data-go="pe:${id}">${face(a, 's24')}<b>${nameOf(a)}</b><span class="dm-mut">${t}</span><em>In CRM</em></div>`).join(''), cardFoot('Add to a list', 'data-act="save-leads"'))}` };
    }
    if (/close|forecast|december|month/.test(s)) {
      const neg = S.de.filter(d => d.st === 'Negotiation'), pro = S.de.filter(d => d.st === 'Proposal'), list = [...neg, ...pro].sort((a, b) => b.amt - a.amt);
      const likely = neg.reduce((a, d) => a + d.amt, 0) + Math.round(pro.reduce((a, d) => a + d.amt, 0) * .4 / 1000) * 1000, max = Math.max(...list.map(d => d.amt), 1);
      return { used: 'Forecast', busy: 'Running code on ' + open.length + ' open opportunities', h: `<p><b>${money(likely)}</b> is likely to close in December: all ${neg.length} deals in negotiation, plus a weighted share of the ${pro.length} in proposal.</p>${card('Dollar', 'December forecast', `<span class="dm-cnt">${kmoney(likely)}</span>`, list.map(d => `<div class="dm-bar" data-go="de:${d.id}"><span>${CO(d.co).n}</span><i class="${d.st === 'Negotiation' ? 'hot' : ''}" style="--w:${Math.round(d.amt / max * 100)}%"></i><em>${kmoney(d.amt)}</em></div>`).join(''))}<p class="dm-faint dm-small">Dark bars are in negotiation. Move a deal on the board and ask again to see the number change.</p>` };
    }
    if (/owner|split|by rep/.test(s)) {
      const by = Object.keys(TEAM).map(k => [k, open.filter(d => d.own === k)]).filter(x => x[1].length).sort((a, b) => b[1].reduce((t, d) => t + d.amt, 0) - a[1].reduce((t, d) => t + d.amt, 0));
      const max = Math.max(...by.map(x => x[1].reduce((t, d) => t + d.amt, 0)));
      return { used: 'Pipeline review', busy: 'Reading every open opportunity', h: `<p>${kmoney(open.reduce((a, d) => a + d.amt, 0))} of open pipeline across ${by.length} owners.</p>${card('Users', 'Pipeline by owner', '', by.map(([k, ds]) => { const t = ds.reduce((a, d) => a + d.amt, 0); return `<div class="dm-bar">${owner(k)}<i class="hot" style="--w:${Math.round(t / max * 100)}%"></i><em>${kmoney(t)}</em></div>`; }).join(''))}` };
    }
    if (/need|this week|attention|pipeline|late|quiet/.test(s)) {
      const att = open.filter(d => d.late || ['d4', 'd5', 'd6'].includes(d.id)).slice(0, 4);
      const w = att.map(d => d.late ? `<li><b>${d.n}</b> is past its close date of ${d.close}, and ${first(d.who)} asked about the seat minimum yesterday.</li>` : d.id === 'd4' ? `<li><b>${d.n}</b> needs pricing with the EU seats by Friday. Patrick signs off himself.</li>` : d.id === 'd5' ? `<li><b>${d.n}</b> is waiting on legal; Dylan sent an updated rollout plan this morning.</li>` : `<li><b>${d.n}</b> needs the security questionnaire back by Friday.</li>`).join('');
      return { used: 'Pipeline review', busy: 'Reading ' + open.length + ' opportunities and 41 emails', h: `<p>${att.length} deals need you this week.</p>${card('Bell', 'Need attention', `<span class="dm-cnt">${att.length}</span>`, att.map(dealRow).join(''))}<ul>${w}</ul><p>Replies to Ivan and Karim are drafted and ready for your review.</p>${card('Mail', 'Email draft', coChip(CO('notion')), `<div class="dm-mut">To Ivan Zhao</div><b>Re: Workspace migration proposal</b><div class="dm-mailbody sm">${paras(EM('e2').draft.split('\n\n').slice(0, 2).join('\n\n'))}</div>`, cardFoot('Review and send', 'data-go="em:e2"', 'Mail'))}` };
    }
    if (/prep|brief|next meeting/.test(s)) {
      const m = S.mt.find(x => x.up);
      return { used: 'Prep for a meeting', busy: 'Reading the last call and emails', h: `<p>Your next meeting is <b>${m.t}</b> with ${CO(m.co).n}, ${m.when}.</p>${card('Calendar', 'Brief', coChip(CO(m.co)), `<p>${m.brief}</p><div class="dm-facts">${m.facts.map(([k, v]) => `<span>${badge(k)}${v}</span>`).join('')}</div>`, cardFoot('Open the meeting', `data-go="mt:${m.id}"`, 'Calendar'))}` };
    }
    if (/draft|email|reply|follow|write/.test(s)) {
      const e = S.em.find(x => x.need && (!pe || x.msgs.some(m => m.a === pe.a))) || S.em.find(x => x.need);
      if (!e) return { busy: 'Reading your inbox', h: '<p>Every email has a reply. Nothing needs you right now.</p>' };
      const to = e.msgs[e.msgs.length - 1].a;
      return { used: 'Draft a reply', busy: 'Reading the thread and the email tone page', h: `<p>Here is a reply to ${first(to)}, in your tone and with the numbers from the pricing page.</p>${card('Mail', 'Email draft', coChip(CO(e.co)), `<div class="dm-mut">To ${nameOf(to)}</div><b>Re: ${esc(e.s)}</b><div class="dm-mailbody sm">${paras(e.draft)}</div>`, cardFoot('Review and send', `data-go="em:${e.id}"`, 'Mail'))}` };
    }
    if (co || pe) {
      const c = co || CO(pe.co), ds = S.de.filter(d => d.co === c.id), nx = S.mt.find(m => m.co === c.id && m.up), em = S.em.find(e => e.co === c.id && e.need);
      return { used: /research/.test(s) ? 'Research an account' : 'Account summary', busy: `Reading ${c.n}: emails, calls and notes`, h: `<p><b>${c.n}</b> is a ${c.rel.toLowerCase()}${c.arr ? ` paying ${money(c.arr)} a year` : ''}, owned by ${TEAM[c.own][0]}. ${c.ind}, ${c.emp} people, based in ${c.pl}. Last touch ${c.lt.toLowerCase()}.</p><ul>${ds.map(d => `<li><b>${d.n}</b>: ${d.st.toLowerCase()}, ${money(d.amt)}. Next step: ${d.next.toLowerCase()}.</li>`).join('')}${nx ? `<li>Next meeting: <b>${nx.t}</b>, ${nx.when}.</li>` : ''}${em ? `<li>An email from ${first(em.msgs[em.msgs.length - 1].a)} needs a reply: "${esc(em.s)}".</li>` : ''}</ul>${card('Building', 'Company', coChip(c), ds.map(dealRow).join('') || '<span class="dm-mut">No opportunities</span>', cardFoot('Open ' + c.n, `data-go="co:${c.id}"`, 'ArrowUpRight'))}` };
    }
    return { busy: 'Reading Northwind', h: `<p>Here is where Northwind stands: ${open.length} open deals worth ${kmoney(open.reduce((a, d) => a + d.amt, 0))}, ${S.em.filter(e => e.need).length} emails to answer and ${S.mt.filter(m => m.up).length} meetings this week.</p>${card('Handshake', 'Largest open deals', '', open.slice().sort((a, b) => b.amt - a.amt).slice(0, 4).map(dealRow).join(''))}<p class="dm-faint dm-small">Ask about a company, a person, the forecast or your next meeting.</p>` };
  }
  let asking = 0;
  function ask(q, skill) {
    q = q.trim(); if (!q || asking) return;
    closeSheet();
    S.chat.push({ u: 1, t: q, skill });
    const a = answer(q), m = { busy: a.busy };
    S.chat.push(m); asking = 1;
    nav('ask');
    setTimeout(() => { m.busy = null; m.h = a.h; m.used = skill || a.used; asking = 0; if (route === 'ask') render(); }, RM ? 0 : 1500);
  }

  /* ---------- command menu ---------- */
  let pal = null;
  function palette() {
    closeMenus();
    const GO = [['companies', 'Building', 'Companies'], ['people', 'Users', 'People'], ['deals', 'Handshake', 'Opportunities'], ['meetings', 'Calendar', 'Meetings'], ['emails', 'Mail', 'Emails'], ['notes', 'StickyNote', 'Notes'], ['ask', 'Sparkles', 'Ask Otto'], ['k', 'Book', 'Knowledge'], ['s', 'Box', 'Skills'], ['workflows', 'Bot', 'Workflows'], ['settings', 'Settings', 'Settings']];
    const base = [
      ...[['new-co', 'Building', 'New company'], ['new-deal', 'Handshake', 'New opportunity'], ['new-note', 'StickyNote', 'New note'], ['compose', 'Mail', 'New email']].map(([a, i, n]) => ({ act: a, i: ic(i, 'i14'), n, grp: 'Actions' })),
      ...GO.map(([g, i, n]) => ({ g, i: ic(i, 'i14'), n, grp: 'Go to' })),
    ];
    const recs = [
      ...S.co.map(c => ({ g: 'co:' + c.id, i: logo(c, 's16'), n: c.n, hint: c.d, grp: 'Companies' })),
      ...S.de.map(d => ({ g: 'de:' + d.id, i: ic('Handshake', 'i14'), n: d.n, hint: CO(d.co).n, grp: 'Opportunities' })),
      ...S.pe.map(p => ({ g: 'pe:' + p.id, i: face(p.a, 's20'), n: p.n, hint: p.email, grp: 'People' })),
    ];
    const el = document.createElement('div');
    el.className = 'dm-cmd';
    el.innerHTML = `<div class="dm-cmdbox" role="dialog" aria-label="Search"><label class="dm-cmdin">${ic('SearchIcon')}<input placeholder="Search or ask Otto" autocomplete="off"></label><div class="dm-cmdl"></div><div class="dm-cmdf"><span><span class="kbd">↑</span><span class="kbd">↓</span>to move</span><span><span class="kbd">↵</span>to open</span><span><span class="kbd">esc</span>to close</span></div></div>`;
    page.appendChild(el);
    const inp = $('input', el), list = $('.dm-cmdl', el);
    let cur = 0, shown = [];
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      shown = q ? [...recs, ...base].filter(it => (it.n + ' ' + (it.hint || '')).toLowerCase().includes(q)).slice(0, 10).concat([{ ask: inp.value.trim(), i: otto(16), n: `Ask Otto: ${esc(inp.value.trim())}`, grp: 'Ask' }]) : base;
      cur = Math.min(cur, shown.length - 1);
      let g = '';
      list.innerHTML = shown.map((it, k) => (it.grp !== g ? `<div class="dm-cmdg">${g = it.grp}</div>` : '') + `<div class="dm-cmdr${k === cur ? ' on' : ''}" data-k="${k}">${it.i}<b>${it.n}</b>${it.hint ? `<span>${it.hint}</span>` : ''}${k === cur ? ic('ChevronRight', 'i14') : ''}</div>`).join('');
      faces(list);
      const on = $('.dm-cmdr.on', list); if (on) on.scrollIntoView({ block: 'nearest' });
    };
    const pick = k => { const it = shown[k]; closePal(); if (!it) return; if (it.ask) ask(it.ask); else if (it.act) act({ dataset: { act: it.act } }, { stopPropagation() { } }); else nav(it.g); };
    inp.addEventListener('input', () => { cur = 0; draw(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { cur = Math.min(shown.length - 1, cur + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { cur = Math.max(0, cur - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(cur); }
      else if (e.key === 'Escape') closePal();
    });
    list.addEventListener('click', e => { const r = e.target.closest('.dm-cmdr'); if (r) pick(+r.dataset.k); });
    list.addEventListener('mousemove', e => { const r = e.target.closest('.dm-cmdr'); if (r && +r.dataset.k !== cur) { cur = +r.dataset.k; draw(); } });
    el.addEventListener('mousedown', e => { if (e.target === el) closePal(); });
    pal = el; draw(); inp.focus({ preventScroll: true });
  }
  const closePal = () => { if (pal) { pal.remove(); pal = null; } };

  /* ---------- menus, modals, toasts ---------- */
  let menu = null;
  function closeMenus() { if (menu) { menu.remove(); menu = null; } }
  function openMenu(anchor, opts, cur, onPick, multi) {
    closeMenus();
    const pr = page.getBoundingClientRect(), r = anchor.getBoundingClientRect(), s = pr.width / page.offsetWidth || 1;
    const el = document.createElement('div');
    el.className = 'dm-menu';
    el.style.left = Math.min((r.left - pr.left) / s, page.offsetWidth - 240) + 'px';
    el.style.top = ((r.bottom - pr.top) / s + 6) + 'px';
    const isOn = v => multi ? cur.has(v) : cur === v;
    const draw = () => { el.innerHTML = opts.map(([v, l]) => `<div class="dm-mi${isOn(v) ? ' on' : ''}" data-v="${esc(v)}">${l}${isOn(v) ? ic('Check', 'i14') : ''}</div>`).join(''); faces(el); };
    draw();
    el.addEventListener('click', e => {
      const it = e.target.closest('.dm-mi'); if (!it) return; e.stopPropagation();
      if (multi) { cur.has(it.dataset.v) ? cur.delete(it.dataset.v) : cur.add(it.dataset.v); onPick(); }
      else { closeMenus(); onPick(it.dataset.v); }
    });
    page.appendChild(el); menu = el;
  }
  let modal = null;
  function openModal(title, fields, okLabel, onOk) {
    closeModal();
    const el = document.createElement('div');
    el.className = 'dm-modalwrap';
    el.innerHTML = `<div class="dm-scrim" data-act="close-modal"></div><form class="dm-modal" data-form="modal"><div class="dm-modalh">${title}${ib('X', 'data-act="close-modal"', 'Close')}</div><div class="dm-modalb">${fields.map(([k, label, ph, val, type]) => `<label class="dm-mf"><span>${label}</span>${type === 'area' ? `<textarea name="${k}" rows="6" placeholder="${ph}">${esc(val || '')}</textarea>` : `<input name="${k}" placeholder="${ph}" value="${esc(val || '')}" autocomplete="off">`}</label>`).join('')}</div><div class="dm-modalf"><span class="dm-plainb" data-act="close-modal">Cancel</span><button class="dm-pri" type="submit">${okLabel}</button></div></form>`;
    page.appendChild(el); modal = { el, onOk };
    const f = $('input,textarea', el); if (f) f.focus({ preventScroll: true });
  }
  const closeModal = () => { if (modal) { modal.el.remove(); modal = null; } };
  function toast(html, undo) {
    let box = app.querySelector('.dm-toasts');
    if (!box) { box = document.createElement('div'); box.className = 'dm-toasts'; app.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'dm-toast';
    t.innerHTML = `<span class="dm-tic">${ic('Check', 'i12')}</span><div>${html}</div>${undo ? '<span class="dm-undo">Undo</span>' : ''}`;
    if (undo) t.querySelector('.dm-undo').addEventListener('click', () => { undo(); t.remove(); });
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3700);
  }
  // new activity sorts to the top of "This week", newest first
  let logN = 0;
  const log = (co, t, s, k = 'edit', de) => S.act.unshift({ co, de, k, t, s, at: 'Just now', d: -0.5 - (logN++) * 1e-6 });

  /* ---------- routing and render ---------- */
  let route = 'companies';
  const NAV = { co: 'companies', pe: 'people', de: 'deals', mt: 'meetings', no: 'notes', wf: 'workflows' };
  // tag hues follow the app: relationship, stage, lifecycle, fact kinds and states
  const TONES = { Customer: 'green', Prospect: 'blue', Partner: 'violet', Churned: 'red', Lead: 'gray', Discovery: 'blue', Proposal: 'violet', Negotiation: 'amber', Won: 'green', Lost: 'red',
    New: 'green', Contacted: 'blue', Engaged: 'violet', Qualified: 'amber', 'Needs reply': 'yellow', Upcoming: 'blue', Past: 'gray', Active: 'green', Paused: 'gray', On: 'green', Paid: 'green', Pro: 'violet',
    Waiting: 'blue', Replied: 'green', Done: 'green', Updated: 'green', 'Needs approval': 'amber', Deep: 'violet', Quick: 'gray', Budget: 'green', 'Open question': 'amber', 'Next step': 'blue', Timeline: 'blue',
    Commitment: 'violet', Risk: 'red', Competitor: 'red', Objection: 'red', 'Decision maker': 'gray' };
  const faces = root => {
    if (O.faces) O.faces(root);
    (root || page).querySelectorAll('.badge').forEach(el => { el.className = el.className.replace(/\s*\bt-\w+/g, '') + ' t-' + (TONES[el.textContent.trim()] || 'gray'); });
  };
  function render(keep) {
    const sc = keep ? $$('.dm-scroll').map(e => e.scrollTop) : null;
    closeMenus(); closePal();
    const [k, id] = route.split(':');
    page.innerHTML = id ? ({ co: coRecord, pe: peRecord, de: deRecord, mt: mtPage, no: noPage, wf: wfPage }[k] || V.companies)(id) : (V[k] || V.companies)();
    if (sheet) page.appendChild(sheet);
    if (modal) page.appendChild(modal.el);
    app.querySelectorAll('.sb .lk').forEach(l => l.classList.toggle('on', l.dataset.v === (id ? NAV[k] : k)));
    faces(page);
    if (sc) $$('.dm-scroll').forEach((e, i) => { e.scrollTop = sc[i] || 0; });
    if (route === 'ask') { const c = $('.dm-chat'); if (c) c.scrollTop = c.scrollHeight; }
  }
  function nav(r) {
    if (r.startsWith('em:')) { openReader(r.slice(3)); return; }
    const same = r === route;
    if (!same) { closeSheet(); if (!/^(co|pe|de|mt):/.test(r) || r.split(':')[0] !== route.split(':')[0]) R.tab = r.startsWith('mt:') ? 'notes' : 'activity'; }
    route = r; render(same);
    const b = $('.dbody'); if (b && !RM && !same) { b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); }
  }

  /* ---------- events ---------- */
  app.addEventListener('click', e => {
    const t = e.target;
    if (menu && !t.closest('.dm-menu')) closeMenus();
    if (t.closest('.sb .search')) { palette(); return; }
    if (t.closest('details,summary')) return;
    const a = t.closest('[data-act]');
    if (a && app.contains(a)) { act(a, e); return; }
    if (t.closest('input,textarea,[contenteditable],.dm-dock')) return;
    const g = t.closest('[data-go],.lk[data-v]');
    if (g && app.contains(g)) nav(g.dataset.go || g.dataset.v);
  });
  function act(a, e) {
    const d = a.dataset, k = d.act, keep = () => render(true);
    if (k === 'close-sheet') return closeSheet();
    if (k === 'close-modal') return closeModal();
    if (k === 'sheet-go') { closeSheet(); return nav(d.go); }
    if (k === 'palette') return palette();
    if (k === 'sort' || k === 'sortmenu') {
      const st = LS(d.k);
      if (k === 'sort') { st.sort = st.sort && st.sort[0] === d.c ? (st.sort[1] > 0 ? [d.c, -1] : null) : [d.c, 1]; return keep(); }
      const cols = { companies: COLS_CO, people: COLS_PE, deals: COLS_DE }[d.k]; if (!cols) return;
      return openMenu(a, cols.map(c => [c.k, c.label]), st.sort && st.sort[0], v => { st.sort = st.sort && st.sort[0] === v ? [v, -st.sort[1]] : [v, 1]; keep(); });
    }
    if (k === 'filter') {
      const st = LS(d.k), opts = { companies: REL, people: ['Contacted', 'Engaged', 'Qualified', 'Customer'], deals: STAGES }[d.k].map(o => [o, badge(o)]);
      const again = () => { keep(); const b = $(`[data-act="filter"][data-k="${d.k}"]`); if (b) openMenu(b, opts, st.f, again, true); };
      return openMenu(a, opts, st.f, again, true);
    }
    if (k === 'unfilter') { LS(d.k).f.delete(d.v); return keep(); }
    if (k === 'clearf') { LS(d.k).f.clear(); return keep(); }
    if (k === 'sel') { e.stopPropagation(); const st = LS(d.k); st.sel.has(d.id) ? st.sel.delete(d.id) : st.sel.add(d.id); return keep(); }
    if (k === 'selall') { const st = LS(d.k), ids = $$('tbody tr[data-go]').map(tr => tr.dataset.go.split(':')[1]); const all = ids.every(i => st.sel.has(i)); ids.forEach(i => all ? st.sel.delete(i) : st.sel.add(i)); return keep(); }
    if (k === 'selclear') { LS(d.k).sel.clear(); return keep(); }
    if (k === 'bulk-ask') { const st = LS(d.k), names = [...st.sel].map(i => (d.k === 'companies' ? CO(i) : PE(i)).n); st.sel.clear(); return ask('Summarize ' + names.slice(0, 3).join(', ')); }
    if (k === 'bulk-mail') { const st = LS(d.k), n = st.sel.size; st.sel.clear(); keep(); return toast(`Drafts ready for <b>${n} people</b>`); }
    if (k.startsWith('layout:')) { LS(k.split(':')[1]).layout = d.v; return keep(); }
    if (k === 'tab') { R.tab = d.v; return keep(); }
    if (k === 'grp') { R.rail[d.v] = R.rail[d.v] === false; return keep(); }
    if (k === 'star') { S.star.has(d.id) ? S.star.delete(d.id) : S.star.add(d.id); toast(S.star.has(d.id) ? `Added <b>${CO(d.id).n}</b> to favorites` : `Removed from favorites`); return keep(); }
    if (k === 'step') { const id = route.split(':')[1], i = S.co.findIndex(c => c.id === id); return nav('co:' + S.co[(i + +d.d + S.co.length) % S.co.length].id); }
    if (k === 'pick') {
      if (d.f === 'rel') { const c = CO(d.id), old = c.rel; return openMenu(a, REL.map(o => [o, badge(o)]), c.rel, v => { c.rel = v; log(c.id, `<b>Jonah</b> set <b>Relationship</b> to ${v}`, ''); keep(); toast(`Set <b>Relationship</b> to ${v}`, () => { c.rel = old; keep(); }); }); }
      if (d.f === 'own' || d.f === 'downer') { const x = d.f === 'own' ? CO(d.id) : DE(d.id); return openMenu(a, Object.keys(TEAM).map(t => [t, owner(t)]), x.own, v => { x.own = v; keep(); toast(`Owner set to <b>${TEAM[v][0]}</b>`); }); }
      if (d.f === 'st') { const x = DE(d.id); return openMenu(a, STAGES.map(o => [o, badge(o)]), x.st, v => setStage(x, v)); }
    }
    if (k === 'stage') return setStage(DE(d.id), d.v);
    if (k === 'draft') { const x = DE(d.id); return ask(`Draft a reply to ${first(x.who)}`, 'Draft a reply'); }
    if (k === 'mf') { LMT.f = d.v; return keep(); }
    if (k === 'ef') { LEM.f = d.v; return keep(); }
    if (k === 'apply' || k === 'skip') { applyUpd(MT(d.id), +d.k, k === 'apply'); return keep(); }
    if (k === 'apply-all') { const m = MT(d.id), left = m.upd.filter(u => !u[3]).length; m.upd.forEach((u, i) => { if (!u[3]) applyUpd(m, i, true, true); }); keep(); return toast(`Applied <b>${left} updates</b> to ${DE(m.de).n}`); }
    if (k === 'todo') { e.preventDefault(); const m = MT(d.id); m.todo = m.todo || []; m.todo[+d.k] = !m.todo[+d.k]; return keep(); }
    if (k === 'unfold') { const em = EM(d.id); em.open.add(+d.k); return openReader(d.id); }
    if (k === 'shorter') { const em = EM(d.id); if (em.short) { em.draft = em.short; em.short = null; } const ta = $('textarea[data-input="draft"]', sheet); if (ta) ta.value = em.draft; return toast('Otto made the draft shorter'); }
    if (k === 'reply') { const em = EM(d.id); em.need = 1; em.draft = em.draft || `Hi ${first(em.msgs[em.msgs.length - 1].a)},\n\nThank you for the update.\n\nBest,\nJonah`; return openReader(d.id); }
    if (k === 'send') {
      const em = EM(d.id), ta = $('textarea[data-input="draft"]', sheet), to = em.msgs[em.msgs.length - 1].a;
      em.msgs.push({ a: 'JR', to: first(to), at: 'Just now', b: ta ? ta.value : em.draft, att: em.att }); em.att = null;
      em.need = 0; em.when = 'Just now'; em.wd = 0; em.open.add(em.msgs.length - 1);
      log(em.co, `<b>Jonah</b> replied to <b>${first(to)}</b>`, em.s, 'out', em.de);
      openReader(d.id); keep(); return toast(`Sent to <b>${nameOf(to)}</b>`);
    }
    if (k === 'compose') {
      const c = d.co ? CO(d.co) : d.pe ? CO(PE(d.pe).co) : null, p = d.pe ? PE(d.pe) : c ? S.pe.find(x => x.co === c.id) : null;
      return openModal('New email', [['to', 'To', 'name@company.com', p ? p.email : ''], ['s', 'Subject', 'Subject', c ? `Next steps for ${c.n}` : ''], ['b', 'Message', '', p ? `Hi ${p.n.split(' ')[0]},\n\nThank you for the time this week. Here is a short summary of where we are and what comes next.\n\nBest,\nJonah` : '', 'area']], `${ic('Send', 'i14')}Send`, v => {
        const pp = S.pe.find(x => x.email === v.to.trim());
        const em = { id: 'e' + uid++, co: pp ? pp.co : 'linear', de: (S.de.find(x => x.co === (pp ? pp.co : 'linear')) || S.de[0]).id, s: v.s || 'No subject', need: 0, when: 'Just now', wd: 0, msgs: [{ a: 'JR', to: pp ? first(pp.a) : v.to, at: 'Just now', b: v.b }] };
        S.em.unshift(em); log(em.co, `<b>Jonah</b> emailed <b>${pp ? first(pp.a) : v.to}</b>`, em.s, 'out', em.de); keep(); toast(`Sent to <b>${pp ? pp.n : esc(v.to)}</b>`);
      });
    }
    if (k === 'new-co') return openModal('New company', [['d', 'Domain', 'company.com', '']], 'Create', v => {
      const dom = v.d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (!dom) return;
      const n = dom.split('.')[0].replace(/^./, x => x.toUpperCase());
      const c = { id: 'c' + uid++, n, i: n.slice(0, 2).toUpperCase(), d: dom, rel: 'Prospect', arr: 0, emp: '', lt: 'Just now', ltn: 0, pl: '', ind: '', own: 'JR', hl: 3, li: 'linkedin.com/company/' + dom.split('.')[0], fresh: 1 };
      S.co.unshift(c); render(true); toast(`Created <b>${n}</b>. Otto is filling in the details.`);
      setTimeout(() => { c.ind = 'Software'; c.emp = '51 to 200'; c.pl = 'San Francisco, CA'; c.fresh = 0; if (route === 'companies' || route === 'co:' + c.id) render(true); }, RM ? 0 : 1600);
    });
    if (k === 'new-deal') return openModal('New opportunity', [['n', 'Name', 'What are they buying?', ''], ['c', 'Company', 'Company name', 'Vercel'], ['a', 'Amount', '$0', '']], 'Create', v => {
      const c = S.co.find(x => x.n.toLowerCase() === v.c.trim().toLowerCase()) || S.co[1];
      const dl = { id: 'd' + uid++, n: v.n.trim() || 'New opportunity', co: c.id, amt: +String(v.a).replace(/[^0-9]/g, '') || 25000, st: 'Discovery', close: 'Jan 30', own: 'JR', who: S.pe.find(p => p.co === c.id).a, next: 'Book a discovery call', win: 20, age: 0 };
      S.de.push(dl); log(c.id, `<b>Jonah</b> created <b>${dl.n}</b>`, '', 'edit', dl.id); render(true); toast(`Created <b>${dl.n}</b>`);
    });
    if (k === 'new-note') { const n = { id: 'n' + uid++, co: route.startsWith('co:') ? route.slice(3) : 'linear', t: 'Untitled', b: '', by: 'JR', up: 'Just now', cr: 'Just now', ty: 'Note' }; S.no.unshift(n); nav('no:' + n.id); const h = $('.dm-h1[contenteditable]'); if (h) { h.focus(); document.getSelection().selectAllChildren(h); } return; }
    if (k === 'addrow') { if (d.k === 'companies') return act({ dataset: { act: 'new-co' } }, e); if (d.k === 'deals') return act({ dataset: { act: 'new-deal' } }, e); if (d.k === 'notes') return act({ dataset: { act: 'new-note' } }, e); return act({ dataset: { act: 'find-leads' } }, e); }
    if (k === 'find-leads') return ask('Find founders of fast-growing software companies', 'Find leads');
    if (k === 'new-meeting') return toast('Meetings come in from your calendar');
    if (k === 'kb') { LK.cur = d.id; return keep(); }
    if (k === 'kmode') { LK.mode = d.v; return keep(); }
    if (k === 'kscope') { LK.scope = d.v; return keep(); }
    if (k === 'new-kb') { const kb = { id: 'k' + uid++, t: 'Untitled page', sub: 'Just now', by: 'JR', sh: LK.scope === 'shared' ? 1 : 0, body: [['p', 'Write anything Otto should know: pricing, process or tone.']] }; S.kb.unshift(kb); LK.cur = kb.id; LK.mode = 'write'; return keep(); }
    if (k === 'sktab') { LSK.tab = d.v; return keep(); }
    if (k === 'skill') return openSkill(d.id);
    if (k === 'run-skill') { const s = S.sk.find(x => x.id === d.id); return ask(s.ask, s.n); }
    if (k === 'new-skill') return openModal('New skill', [['n', 'Name', 'Weekly account review', ''], ['d', 'What it does', 'Tell Otto what to do, step by step', '', 'area']], 'Create', v => { S.sk.push({ id: 's' + uid++, n: v.n || 'New skill', d: (v.d || 'A skill for your team').split('\n')[0], g: 'Helpers', sp: 'Quick', mine: 1, steps: (v.d || 'Read the record\nWrite a summary').split('\n').filter(Boolean), ask: 'Summarize Stripe' }); LSK.tab = 'Your skills'; keep(); toast('Skill created'); });
    if (k === 'wftab') { LWF.tab = d.v; return keep(); }
    if (k === 'ap') { LWF.ap = d.id; return keep(); }
    if (k === 'ap-ok' || k === 'ap-skip') { const i = S.ap.findIndex(x => x.id === d.id), x = S.ap[i]; S.ap.splice(i, 1); LWF.ap = null; if (k === 'ap-ok') log(x.co, `<b>Otto</b> emailed <b>${first(x.who)}</b>`, x.s, 'out'); keep(); return toast(k === 'ap-ok' ? `Approved. Opened in Gmail for <b>${nameOf(x.who)}</b>` : 'Skipped'); }
    if (k === 'use-agent') { S.wf.push({ id: 'w' + uid++, n: d.v, trig: 'When you turn it on', steps: [['Sparkles', d.v, 'Otto'], ['Bell', 'Notify the owner', 'When it runs']], live: 0, runs: 0 }); LWF.tab = 'Workflows'; keep(); return toast(`Added <b>${d.v}</b>. Turn it on when ready.`); }
    if (k === 'new-wf') return act({ dataset: { act: 'wftab', v: 'Agent library' } }, e);
    if (k === 'sw') {
      e.stopPropagation();
      if (d.k === 'wf') { const w = S.wf.find(x => x.id === d.id); w.live = !w.live; keep(); return toast(`<b>${w.n}</b> is ${w.live ? 'active' : 'paused'}`); }
      if (d.k === 'app') { const ap = S.apps[+d.id]; ap[2] = !ap[2]; keep(); return toast(`<b>${ap[0]}</b> ${ap[2] ? 'connected' : 'disconnected'}`); }
      a.classList.toggle('on'); return;
    }
    if (k === 'set') { LST.cur = d.v; return keep(); }
    if (k === 'invite') return openModal('Invite teammates', [['e', 'Emails', 'name@northwind.co', '']], 'Invite', v => toast(`Invite sent to <b>${esc(v.e || 'your teammate')}</b>`));
    if (k === 'agroup') { askGroup = askGroup === d.v ? null : d.v; return keep(); }
    if (k === 'ask') return ask(d.q);
    if (k === 'new-chat') { S.chat = []; askGroup = null; return keep(); }
    if (k === 'save-leads') { ['p2', 'p7', 'p3', 'p13'].forEach(i => S.newPeople.add(i)); doneCard(a, 'Added to Founders'); return toast('Added <b>4 people</b> to Founders'); }
    if (k === 'done-card') { doneCard(a, 'Added to a list'); return toast('Added to a list'); }
    if (k === 'copy') return toast('Copied');
    if (k === 'dismiss') { const c = a.closest('.dm-ocard'); if (c) c.remove(); return; }
  }
  function doneCard(a, label) { const c = a.closest('.dm-ocard'); if (!c) return; const f = $('.dm-ocardf', c); if (f) f.remove(); const h = $('.dm-ocardh', c); if (h) h.insertAdjacentHTML('beforeend', `<span class="dm-done">${ic('Check', 'i12')}${label}</span>`); }
  function setStage(dl, v) {
    if (!dl || dl.st === v) return render(true);
    const old = dl.st; dl.st = v; dl.age = 0;
    log(dl.co, `<b>Jonah</b> moved <b>${dl.n}</b> to ${v}`, `From ${old}`, 'edit', dl.id);
    if (v === 'Won') { const w = S.wf.find(x => x.id === 'w4'); if (w) w.runs++; const c = CO(dl.co); c.rel = 'Customer'; c.arr += dl.amt; dl.win = 100; dl.late = 0; }
    render(true);
    toast(v === 'Won' ? `<b>${dl.n}</b> is won. The handoff workflow started.` : `Moved <b>${dl.n}</b> to ${v}`, () => { dl.st = old; render(true); });
  }
  function applyUpd(m, i, yes, quiet) {
    const u = m.upd[i]; if (u[3]) return;
    u[3] = yes ? 1 : 2;
    if (yes) {
      const dl = DE(m.de);
      if (u[0] === 'Stage') dl.st = u[1]; else if (u[0] === 'Amount') dl.amt = u[1]; else if (u[0] === 'Next step') dl.next = u[1];
      log(dl.co, `<b>Otto</b> set <b>${u[0]}</b> to ${u[0] === 'Amount' ? money(u[1]) : u[1]}`, `"${u[2]}"`, 'edit', dl.id);
      if (!quiet) toast(`Set <b>${u[0]}</b> on ${dl.n}`);
    }
    if (m.upd.every(x => x[3])) m.done = 1;
  }

  app.addEventListener('submit', e => {
    const f = e.target.closest('form'); if (!f) return; e.preventDefault();
    if (f.dataset.form === 'ask') {
      const q = f.q.value.trim(); f.q.value = ''; if (!q) return;
      const [rk, rid] = route.split(':');
      const c = rk === 'co' ? CO(rid) : rk === 'de' ? CO(DE(rid).co) : rk === 'pe' ? CO(PE(rid).co) : rk === 'mt' ? CO(MT(rid).co) : null;
      ask(c && !S.co.some(x => q.toLowerCase().includes(x.n.toLowerCase())) ? `${q} (${c.n})` : q);
    }
    if (f.dataset.form === 'note') { const t = f.t.value.trim(); if (!t) return; S.no.unshift({ id: 'n' + uid++, co: f.dataset.co, t: t.length > 42 ? t.slice(0, 40).replace(/\s+\S*$/, '') + '…' : t, b: t, by: 'JR', up: 'Just now', cr: 'Just now', ty: 'Note' }); render(true); toast('Note added'); }
    if (f.dataset.form === 'modal' && modal) { const v = Object.fromEntries(new FormData(f)); const ok = modal.onOk; closeModal(); ok(v); }
  });
  app.addEventListener('keydown', e => {
    const t = e.target;
    if (t.matches('.dm-dock textarea') && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); t.closest('form').requestSubmit(); }
    if (e.key === 'Enter' && t.matches('[contenteditable][data-edit="t"]')) { e.preventDefault(); const b = $('.dm-ed'); if (b) b.focus(); }
  });
  app.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.input === 'q') { LS(t.dataset.k).q = t.value; const pos = t.selectionStart; render(true); const n = $(`[data-input="q"][data-k="${t.dataset.k}"]`); if (n) { n.focus({ preventScroll: true }); n.setSelectionRange(pos, pos); } }
    if (t.dataset.input === 'skq') { LSK.q = t.value; const pos = t.selectionStart; render(true); const n = $('[data-input="skq"]'); if (n) { n.focus({ preventScroll: true }); n.setSelectionRange(pos, pos); } }
    if (t.dataset.input === 'draft') { const em = EM(t.dataset.id); if (em) em.draft = t.value; }
    if (t.dataset.edit) { const n = S.no.find(x => x.id === t.dataset.id); if (n) { n[t.dataset.edit] = t.textContent; n.up = 'Just now'; pulse(); } }
    if (t.dataset.kedit) { const kb = S.kb.find(x => x.id === t.dataset.id); if (kb) { if (t.dataset.kedit === 't') kb.t = t.textContent; else kb.body[+t.dataset.kedit][1] = t.textContent; kb.sub = 'Updated just now'; pulse(); } }
    if (t.matches('.dm-dock textarea')) { t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px'; }
  });
  const pulse = () => { const sv = $('.dm-saved'); if (sv) { sv.classList.remove('pulse'); void sv.offsetWidth; sv.classList.add('pulse'); } };
  let over = false;
  app.addEventListener('pointerenter', () => { over = true; });
  app.addEventListener('pointerleave', () => { over = false; });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && (over || app.contains(document.activeElement))) { e.preventDefault(); pal ? closePal() : palette(); }
    if (e.key === 'Escape' && (over || app.contains(document.activeElement))) { closeMenus(); closePal(); closeModal(); closeSheet(); }
  });
  // drag deals across the board
  let dragId = null;
  app.addEventListener('dragstart', e => { const c = e.target.closest('[data-drag]'); if (!c) return; dragId = c.dataset.drag; c.classList.add('dm-dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) { } app.classList.add('dm-isdrag'); });
  app.addEventListener('dragend', () => { dragId = null; app.classList.remove('dm-isdrag'); $$('.dm-lane.over').forEach(l => l.classList.remove('over')); $$('.dm-dragging').forEach(c => c.classList.remove('dm-dragging')); });
  app.addEventListener('dragover', e => { const l = e.target.closest('[data-drop]'); if (!l || !dragId) return; e.preventDefault(); $$('.dm-lane.over').forEach(x => x !== l && x.classList.remove('over')); l.classList.add('over'); });
  app.addEventListener('drop', e => { const l = e.target.closest('[data-drop]'); if (!l || !dragId) return; e.preventDefault(); const dl = DE(dragId); dragId = null; app.classList.remove('dm-isdrag'); setStage(dl, l.dataset.drop); });

  render();
})();
