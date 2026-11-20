# Page copy, written for revenue leaders and decision makers: the business outcome first, then how it works. Overrides the text in content_*.py; the screens stay there.
COPY = {

'product/omniscience': dict(
  h1="Institutional memory for your revenue team",
  lede="Every email, call, meeting and note becomes part of one living record of each customer. Your people, your agents and your forecast all work from the same facts.",
  swap=dict(h="Customer knowledge is your most valuable asset. Most companies leak it.", p="It scatters across inboxes, call recordings and the memory of whoever ran the deal. Omniscience keeps it with the account, where the whole company can build on it.",
    old=["Context rebuilt from old emails before every call", "Agreed terms buried in a recording", "Relationships walk out the door when a rep leaves", "Two reports, two versions of the same deal"],
    new=["The full history is on the record, instantly", "Ask Otto and get the exact quote, with its date", "Every conversation stays with the account", "Each field shows who set it and why"]),
  rows=[
    dict(k="Capture", h="Complete by default", p="Connect inbox, calendar and call recorder once. Every interaction lands on the right account and person from then on, with zero manual logging.",
      pts=["Email, calls, meetings and notes on one timeline", "Duplicates merge, every merge reversible", "Private email stays private"]),
    dict(k="Recall", h="Answers in seconds, with proof", p="What did Linear commit to on pricing? Who signs off? Ask Otto. He answers in a line and shows the exact words and the day they were said."),
    dict(k="Trust", h="Numbers your leadership can defend", p="Every field shows its source: a teammate, a sync, or Otto with the quote behind it. When the forecast is on the line, you know exactly what to trust.",
      pts=["Otto proposes, your team approves", "A full history of every change", "Anything can be undone"]),
  ],
  band=dict(h="<span>One shared memory</span> behind every decision, from first signal to closed revenue.", pts=[
    ('Orbit', 'Every interaction, retained', 'Email, calls, meetings and notes stay with the account long after the people change.'),
    ('Check', 'Facts with provenance', 'Every value shows where it came from, so decisions rest on evidence.'),
    ('Sparkles', 'Built for agents', 'Otto and your connected AI tools read from the same memory your team uses.')]),
  faq=[("What does Omniscience do?", "It's the memory under Omniscient. Every email, meeting, call and note is saved on the right customer, so your team and Otto can look anything up later."),
       ("What does it connect to?", "Gmail, Outlook, Google Calendar, Microsoft calendar, Zoom, Google Meet, Teams and Slack. You can also import from HubSpot, Salesforce, Attio or Pipedrive."),
       ("Can I keep some emails private?", "Yes. You decide which emails your team can see. Private ones stay visible to you alone."),
       ("What if Otto doesn't know the answer?", "He tells you. Otto answers only from what's on the record and shows the quote, so if the record doesn't say, he says so.")]),

'product/data-model': dict(
  h1="A CRM shaped around your business model",
  lede="Model the objects, fields and stages your business actually runs on. Otto keeps them filled from real conversations, so your data model stays complete.",
  swap=dict(h="Your go-to-market is unique. Your CRM should reflect it.", p="Partners, programs, projects: every business tracks something of its own. In Omniscient, your team models it directly, without waiting on an admin.",
    old=["The field you need doesn't exist yet", "Side spreadsheets for partners and programs", "Fields left blank because nobody has time", "Every change waits in an admin queue"],
    new=["Your own objects, fields and stages", "Partners and programs live in the CRM", "Otto fills fields from emails and calls", "Changes ship in minutes"]),
  rows=[
    dict(k="Objects", h="Model what your business runs on", p="Companies, people and opportunities are ready on day one. Add your own record types and link them to anything else, so the CRM mirrors how revenue really flows."),
    dict(k="Fields", h="Fields that fill themselves", p="Text, numbers, currency, dates, picklists, people and relations. Name a field clearly and Otto starts populating it from your conversations.",
      pts=["Picklists in your own colors", "Relations between any two objects", "Otto suggests values with the quote"]),
    dict(k="Views", h="Every leader sees their view", p="Switch any list between table and board, filter, sort and save the views each team opens every morning."),
  ],
  band=dict(h="<span>Designed around your model.</span> Kept current by Otto.", pts=[
    ('TableIcon', 'Your structure', 'Custom objects and fields that mirror how you go to market.'),
    ('Sparkles', 'Always complete', 'Otto fills fields from real conversations, each with its source.'),
    ('Check', 'Changes in minutes', 'Owners shape the model directly, without a project plan.')]),
  faq=[("Can I add my own record types?", "Yes. Owners and admins can add custom objects, give them fields and link them to companies, people or opportunities."),
       ("What kinds of fields can I add?", "Text, number, currency, dropdown, multi-select, date, person, relation, email, phone, website and checkbox."),
       ("Will Otto fill in my own fields?", "Yes. Name the field clearly and Otto suggests values from your emails and calls, each with the quote it came from."),
       ("Can I change things later?", "Yes. Rename, reorder, edit or delete any field, stage or record type you made, whenever you like.")]),

'product/clean-data': dict(
  h1="Data quality that maintains itself",
  lede="Duplicates merge, missing emails and firmographics fill in, and job changes surface on their own. Every change is reversible in one click.",
  swap=dict(h="Bad data taxes every decision you make", p="When the data drifts, adoption drops and reporting loses credibility. Omniscient keeps the record clean as it grows.",
    old=["The same company saved twice", "Contacts with no email address", "A champion's job change discovered months later", "Recurring cleanup projects"],
    new=["Duplicates merge with full history", "Work emails and company details fill in", "Job changes surface the week they happen", "Every merge and fill reversible"]),
  rows=[
    dict(k="Merge", h="One record per customer, always", p="When the same company or person appears twice, Omniscient folds them into one and keeps every email, call and note. Every merge can be undone."),
    dict(k="Fill", h="Complete profiles, sourced", p="Save a person and Omniscient finds their work email. Save a company and it adds industry, size and location, each tagged with its source.",
      pts=["Work emails for the people you save", "Industry, size and location for companies", "Every value tagged with its source"]),
    dict(k="Watch", h="Relationships that follow people", p="When a contact moves to a new company, you know that week. A buyer who already trusts you is your warmest path into a new account."),
  ],
  band=dict(h="<span>Data your leadership can rely on,</span> because it maintains itself.", pts=[
    ('Check', 'Clean by default', 'Merges and enrichment happen as records arrive.'),
    ('Radar', 'Signals that matter', 'Job changes surface while the relationship is still warm.'),
    ('Clock', 'Fully reversible', 'Every automated change can be undone in one click.')]),
  faq=[("How does merging work?", "Omniscient matches records by website, email and name. It keeps everything from both, and you can undo the merge at any time."),
       ("Where do the found emails come from?", "From a lead data provider. Each found email is tagged, and you decide which people to save."),
       ("Does it read LinkedIn in the background?", "No, never. The Chrome extension saves a profile only when you click."),
       ("Does it clean data I import?", "Yes. Imports from HubSpot, Salesforce, Attio, Pipedrive or a CSV file get the same merge and fill, so you start clean.")]),

'product/meetings': dict(
  h1="Every conversation becomes intelligence",
  lede="A brief before every meeting. Notes, next steps and transcript after it. Otto turns what was said into deal updates, ready for your approval.",
  swap=dict(h="The most valuable data in your business is spoken, then lost", p="Commitments, objections and buying signals happen on calls. Omniscient captures them, so the record reflects what customers actually said.",
    old=["Scrambling for context minutes before a call", "Half the attention goes to note-taking", "Next steps lost in a notebook", "Deals that still show last week's stage"],
    new=["A one-page brief before every meeting", "Summary, notes and transcript after every call", "Next steps land on the opportunity", "Stage and amount update on approval"]),
  rows=[
    dict(k="Before", h="Arrive with the full picture", p="Before each meeting, Otto prepares a one-page brief: who's attending, what they care about, what was said last time and where the deal stands."),
    dict(k="After", h="Notes, done before you hang up", p="Omniscient works with Zoom, Google Meet and Teams. Summary, action items and full transcript land on the record as the call ends.",
      pts=["Summary and action items", "Searchable transcripts", "Shared with the right people"]),
    dict(k="Update", h="The pipeline reflects reality", p="Otto proposes the new stage, amount and next step, each with the customer's own words beside it. One approval and the deal is current."),
  ],
  band=dict(h="<span>Be fully present with the customer.</span> Otto captures everything else.", pts=[
    ('Calendar', 'Prepared every time', 'A brief for every meeting, drawn from the full account history.'),
    ('Book', 'Nothing said is lost', 'Notes, actions and transcripts on the record after every call.'),
    ('Check', 'Updates with evidence', 'Every proposed change shows the quote it came from.')]),
  faq=[("Which meeting apps does it work with?", "Zoom, Google Meet and Microsoft Teams. Connect them once, and calls on your calendar get notes from then on."),
       ("Do I have to approve every update?", "Yes. Otto shows each change with the quote behind it, and nothing changes until you accept."),
       ("Who can see the notes?", "Notes live on the customer record, so teammates who can see that customer can see its notes."),
       ("Does the brief work for people I haven't met?", "Yes. For new contacts, the brief draws on their company, past emails and anything you asked Otto to research.")]),

'product/email-sync': dict(
  h1="Every customer conversation, in context",
  lede="Connect Gmail or Outlook once and every thread lands on the right account. The conversations that need a response rise to the top.",
  swap=dict(h="Your inbox holds your pipeline. It shouldn't be locked inside it.", p="Critical threads get buried and stay private to one rep. Omniscient files every conversation by customer and makes it visible to the team.",
    old=["Searching the inbox for the last reply", "Copying emails into the CRM by hand", "A customer question slips through in a busy week", "Each rep sees only their own threads"],
    new=["Every email on the right account, automatically", "Zero manual logging", "Replies that need you surface first", "The team sees the full relationship"]),
  rows=[
    dict(k="Connect", h="Live in one click", p="Sign in with Google or Microsoft. Past and new email syncs, and each thread finds the right company and person.",
      pts=["Gmail and Outlook", "History comes along", "You control what the team sees"]),
    dict(k="Focus", h="Priorities, surfaced", p="Monday morning, two buyers are waiting on answers. Their threads sit at the top, and everything else stays on the record until you need it."),
    dict(k="Reply", h="Responses drafted in your voice", p="Otto drafts replies from the full account history, in your tone. You review, adjust and send from your own inbox."),
  ],
  band=dict(h="<span>Every conversation on the right account,</span> with zero manual work.", pts=[
    ('Mail', 'Complete capture', 'Every thread syncs to the right account and person.'),
    ('Clock', 'Response focus', 'The conversations that move revenue come first.'),
    ('Users', 'Shared context', 'The whole team sees the full relationship.')]),
  faq=[("Does Omniscient send emails for me?", "No. Otto writes drafts. You open them in Gmail or Outlook and send them yourself."),
       ("Can I keep personal emails out?", "Yes. You choose which emails are shared. Personal ones stay visible to you alone."),
       ("How far back does it go?", "When you connect, past emails with people in your CRM come along. New ones sync as they arrive."),
       ("Does it work for a whole team?", "Yes. Each person connects their own inbox, and emails with the same customer show up on one record.")]),

'product/ask-otto': dict(
  h1="An agent that knows your entire business",
  lede="Otto works inside Omniscient. Ask him anything about your customers, or hand him a job: research an account, prepare a meeting, build a lead list. He shows his sources and asks before he changes anything.",
  swap=dict(h="Answers used to take a report. Now they take a sentence.", p="Leaders shouldn't wait on dashboards to understand their own business. With Otto, the question is the interface.",
    old=["Clicking through lists for one answer", "Waiting on a report for a quick question", "Updating fields one at a time", "Every email started from a blank page"],
    new=["Ask in plain words, get a direct answer", "Every answer cites its source", "Update records by asking, then confirm", "Drafts ready in your voice"]),
  rows=[
    dict(k="Answers", h="Direct answers, with proof", p="Ask about any account, deal or person. Otto reads every email, call and note on the record and shows the quote behind his answer."),
    dict(k="Actions", h="Autonomy with oversight", p="Ask Otto to move a deal, add a person or log a note. He lays out every change on a card, and nothing saves until you approve.",
      pts=["Review every change before it saves", "Undo after saving", "A full audit trail"]),
    dict(k="Anywhere", h="Wherever your team works", p="Ask from the app, the bar on any record, or Slack. Between meetings, talk instead of typing."),
  ],
  band=dict(h="<span>Otto handles the execution.</span> Your team owns the decisions.", pts=[
    ('Check', 'You stay in control', 'Every change is proposed, reviewed and reversible.'),
    ('Book', 'Grounded in your data', 'Answers come from your records, with quotes and dates.'),
    ('Box', 'Skills for every job', 'Research, prospecting, meeting prep and more.')]),
  faq=[("Who is Otto?", "Otto is the agent built into Omniscient. He reads your records, emails and calls, and helps at every step, from finding leads and prepping meetings to drafting emails and keeping deals current."),
       ("Does Otto send emails by himself?", "No. Otto writes drafts. You open them in Gmail or Outlook and send them yourself."),
       ("Can Otto change my data?", "Only after you say yes. Each change shows up as a card, nothing saves until you click, and you can undo it afterward."),
       ("Can I use Otto in Slack?", "Yes. Add Omniscient to Slack and mention @Otto in any channel, or message him directly.")]),

'product/find-leads': dict(
  h1="Pipeline on demand",
  lede="Describe your ideal customer in a sentence. Otto searches millions of people and companies, explains why each one fits, and saves only the ones you choose.",
  swap=dict(h="Prospecting is a strategy decision. It deserves better than an afternoon of filters.", p="Your team knows exactly who it wants to sell to. Otto turns that intent into a qualified list in about a minute.",
    old=["Hours spent tuning search filters", "Export, clean, re-import, repeat", "Leads that arrive without an email", "Outreach to accounts you already own"],
    new=["One sentence becomes a qualified list", "Saved straight into the CRM", "Work emails found for you", "Existing relationships flagged"]),
  rows=[
    dict(k="Describe", h="Intent in, pipeline out", p="Specify role, industry, company size, location or recent news. Otto shows his plan in one line, then returns the people who fit.",
      pts=["Plain language, no filters to learn", "The reasoning behind every match", "Existing contacts flagged"]),
    dict(k="Accounts", h="The right people, and more accounts like your best", p="Name a company to find its decision makers. Name your best customers and Otto finds more companies that look like them."),
    dict(k="Save", h="Qualified, enriched, in one click", p="Choose the leads you want. They enter the CRM with work emails filled, and you hear when they change jobs."),
  ],
  band=dict(h="<span>Your next customers already exist.</span> Ask Otto to find them.", pts=[
    ('Radar', 'Qualified lists', 'Describe the buyer and get a list with work emails.'),
    ('Building', 'Account expansion', 'Find decision makers and lookalikes of your best customers.'),
    ('Check', 'Saved on your call', 'Nothing enters the CRM without your click.')]),
  faq=[("Where do the leads come from?", "From a data provider with millions of people and companies. Each result shows why it matches what you asked for."),
       ("Does Otto add leads by himself?", "No. Otto shows you the list, and you pick who to save. Nothing goes into your CRM without your click."),
       ("Does it use LinkedIn?", "No. Otto never reads LinkedIn in the background. To save someone from LinkedIn, use the Chrome extension while you're on their profile."),
       ("How many leads can I find?", "Lead searches use credits from your plan. Pro and Business plans include more each month.")]),

'product/skills': dict(
  h1="Your best playbook, executed by every rep",
  lede="Skills tell Otto how your team does a job, step by step. Start with ready-made skills, or write your own in plain language.",
  swap=dict(h="Your top performer's judgment, available to the whole team", p="Consistency is what separates a sales team from a group of salespeople. Skills make Otto follow your method the same way every time.",
    old=["Every rep qualifies a little differently", "The playbook lives in a forgotten doc", "New hires take months to ramp", "The same long request typed again and again"],
    new=["Define the method once, Otto follows it", "The playbook runs inside the CRM", "New hires work your way from day one", "Type / and choose the job"]),
  rows=[
    dict(k="Pick", h="Any job, one keystroke away", p="Each skill has a name and a line on when to use it. Type / to choose one, or just ask and Otto selects the right skill himself."),
    dict(k="Write", h="Codify how your team wins", p="Describe when to use it, then the steps. Write skills for the whole team, or personal ones for your own work.",
      pts=["Ready-made, team and personal skills", "Owners and admins manage team skills", "An open, portable file format"]),
    dict(k="Trust", h="Governed by default", p="Every skill runs inside Otto's rules: confirmation before any change, emails sent by people, and nothing from LinkedIn."),
  ],
  band=dict(h="<span>Define it once.</span> Your whole team executes it every day.", pts=[
    ('Box', 'Consistent execution', 'Every rep runs the same proven method.'),
    ('Book', 'Faster ramp', 'New hires work the team way from their first day.'),
    ('Check', 'Built-in guardrails', 'Skills follow Otto\'s rules on every run.')]),
  faq=[("What is a skill?", "A skill is a short set of instructions that tells Otto how to do one job, like qualifying a new lead or prepping for a meeting."),
       ("Who can write skills?", "Anyone can write personal skills. Owners and admins write team skills. The ready-made skills come with Omniscient."),
       ("Do I need to know how to code?", "No. A skill is written in plain words: when to use it and the steps to follow."),
       ("Can a skill send emails or change records?", "Skills follow Otto's rules. He checks with you before any change, and you send every email yourself.")]),

'product/knowledge': dict(
  h1="Your company's expertise, in every answer",
  lede="Give Otto your pricing, playbook, product details and positioning. He applies them in every answer and draft, and cites the page he used.",
  swap=dict(h="Inconsistent answers cost deals and credibility", p="When the truth is spread across old documents, people improvise. Knowledge gives Otto one authoritative source.",
    old=["Last year's price list still in circulation", "The playbook nobody can find", "Every rep writes in a different voice", "New hires asking the same questions"],
    new=["Answers use current pricing", "The playbook informs every answer", "Drafts match your brand voice", "New hires ask Otto instead"]),
  rows=[
    dict(k="Teach", h="Pages, files or links", p="Write a page, upload a file or paste a link. Pricing, playbooks, product details and brand voice all work.",
      pts=["Pages you write and edit", "Files and links", "Organized in folders"]),
    dict(k="Answer", h="Accurate on every number", p="A customer asks what 400 seats will cost. Otto answers from your pricing page and names the page he used."),
    dict(k="Draft", h="On-brand by default", p="Otto writes follow-ups in your team's voice, with the right prices and terms. People review and send them."),
  ],
  band=dict(h="<span>Your expertise,</span> applied in every answer Otto gives.", pts=[
    ('Book', 'One source of truth', 'Pricing, playbook and positioning in one place.'),
    ('Check', 'Cited answers', 'Every answer names the page it used.'),
    ('Mail', 'Consistent voice', 'Drafts follow the tone your team defined.')]),
  faq=[("What should I add?", "Anything your team looks up often: pricing, discounts, onboarding, your sales playbook, product sheets, competitor notes and your writing style."),
       ("Who can edit it?", "Owners and admins manage the team's pages. Everyone on the team can read them."),
       ("Will Otto write contracts from it?", "No. Otto never writes or suggests contract text. He uses Knowledge for answers and email drafts."),
       ("Can I remove a page?", "Yes. Delete any page, file or link, and Otto stops using it right away.")]),

'product/workflows': dict(
  h1="Execution that never depends on a good week",
  lede="Turn your best sales motion into workflows. Follow-ups, routing and alerts run around the clock, the same way every time.",
  swap=dict(h="Process breaks exactly when the stakes are highest", p="Launch weeks, quarter end, a rep out sick. Workflows keep the motion running whatever else is happening.",
    old=["Follow-ups slip during a launch", "Reminders that live in someone's head", "New leads waiting hours for an owner", "Every rep running their own process"],
    new=["Follow-ups go out on schedule", "Owners alerted in Slack when it matters", "New leads routed and briefed instantly", "One standard, executed by everyone"]),
  rows=[
    dict(k="Trigger", h="Start from any moment", p="A stage change, a new lead, a booked meeting or an incoming email. Choose the moment, then define the steps.",
      pts=["Stage and field changes", "Meetings and emails", "Schedules and webhooks"]),
    dict(k="Steps", h="Your motion, step by step", p="Send from your team's templates, wait, branch on a reply, update a field or alert the owner in Slack."),
    dict(k="Watch", h="Full visibility, full control", p="Every workflow shows who's in it, what ran and what's next. Pause, edit or delete it whenever you want."),
  ],
  band=dict(h="<span>Design it once.</span> It runs every day without supervision.", pts=[
    ('Workflow', 'Always on', 'Follow-ups and routing run around the clock.'),
    ('Users', 'One standard', 'Every lead gets your best process.'),
    ('Clock', 'Full oversight', 'See every run and pause any time.')]),
  faq=[("What can start a workflow?", "A stage change, a new record, a field change, a booked meeting, an incoming email, a schedule or a webhook."),
       ("Where do workflow emails come from?", "From templates your team writes in Settings > Templates. Things like {{first_name}} fill in from the record."),
       ("Can workflows create tasks?", "No. Omniscient doesn't use tasks. Next steps live on the deal, and workflows can update them or alert the owner."),
       ("Can I test a workflow first?", "Yes. Save it as a draft, check the steps and turn it on when you're ready. You can pause it at any time.")]),

'integrations': dict(
  h1="Your entire stack, connected in an afternoon",
  lede="Gmail, Outlook, your calendar, Zoom, Slack, HubSpot and more. Each one connects with a single sign-in, with no API keys or IT tickets.",
  swap=dict(h="Integration projects shouldn't delay value by a quarter", p="Most CRMs take weeks of setup before anyone benefits. Omniscient connects with sign-in buttons and is useful the same day.",
    old=["Hunting for API keys in settings pages", "Weeks waiting on IT", "Years of history stranded in the old CRM", "Switching apps to see what happened"],
    new=["One sign-in per tool", "Live the same afternoon", "Your existing CRM imported in clicks", "Everything on one record"]),
  rows=[
    dict(k="Connect", h="Sign in, approve, done", p="Every tool has its own button, like Connect Gmail or Add to Slack. Sign in, approve, and Omniscient handles the rest.",
      pts=["No API keys", "Disconnect any time", "Each teammate connects their own inbox"]),
    dict(k="Import", h="Bring your history with you", p="Move companies, people, deals and notes from HubSpot, Salesforce, Attio or Pipedrive, or a CSV. Duplicates merge on the way in."),
    dict(k="Alerts", h="Otto, inside Slack", p="Ask Otto from any channel and get alerts when a deal moves or a customer replies."),
  ],
  band=dict(h="<span>Connected in minutes.</span> Every customer signal in one system.", pts=[
    ('Globe', 'One-click setup', 'Sign in and approve. No keys, no tickets.'),
    ('Download', 'Full migration', 'HubSpot, Salesforce, Attio, Pipedrive or CSV.'),
    ('Code', 'Open by design', 'An API, webhooks and an MCP server when you need them.')]),
  faq=[("Do I need an API key?", "No. Each tool connects with its own sign-in button. API keys are only for developers, under Settings > Apps > Developers."),
       ("Can I move from my old CRM?", "Yes. HubSpot, Salesforce, Attio and Pipedrive import in a few clicks, and CSV files work for anything else."),
       ("Does Omniscient post on LinkedIn?", "Never. The Chrome extension only saves the profile you're looking at, when you click."),
       ("Can I disconnect a tool?", "Yes. Disconnect any tool in Settings > Apps, and syncing stops right away.")]),

'product/chrome-extension': dict(
  h1="Capture any prospect in one click",
  lede="On a profile or company page, one click saves them to Omniscient, with their full record beside the page.",
  swap=dict(h="Manual entry is the slowest part of prospecting", p="Typing contacts by hand wastes time and introduces errors. The extension saves them accurately in one click.",
    old=["Copying names and titles by hand", "Switching tabs to check the CRM", "Retyping the same intro message", "Unsure if a teammate already reached out"],
    new=["One click saves the person and company", "Their record appears beside the page", "Your team's template, ready to edit", "Owner and last touch visible instantly"]),
  rows=[
    dict(k="Save", h="People, companies or whole lists", p="Save the profile you're on, their company, search results or a company's people. Up to 10 at a time, and only when you click.",
      pts=["Profiles and companies", "Search results and people lists", "Up to 10 per click"]),
    dict(k="See", h="Full context, beside the page", p="The side panel shows what your CRM already knows: owner, deal stage, last email and notes."),
    dict(k="Write", h="Your team's message, ready to send", p="Pick a team template and it drops into the message box with their name filled in. You review and send it yourself."),
  ],
  band=dict(h="<span>Your click, your message.</span> It never acts on its own.", pts=[
    ('Download', 'Instant capture', 'People and companies saved accurately in one click.'),
    ('Users', 'Team awareness', 'Owner and history visible before you reach out.'),
    ('Check', 'Always your call', 'It never browses, messages or clicks for you.')]),
  faq=[("Does it send messages for me?", "No. It puts your team's template in the message box. You read it, change it and send it yourself."),
       ("Does it browse LinkedIn for me?", "Never. It only works on the page you have open, when you click. It never scrolls, visits profiles or clicks for you."),
       ("How many people can I save at once?", "Up to 10 per click from search results, a company's people, a post's comments or a reactions list."),
       ("Which browsers does it work in?", "Chrome and other Chromium browsers, like Edge, Arc and Brave.")]),

'product/mcp': dict(
  h1="Your CRM, inside every AI tool your team uses",
  lede="Connect Omniscient to Claude, ChatGPT or Cursor. Look up any account's history or update a record without leaving the assistant.",
  swap=dict(h="AI assistants are only as good as the context they have", p="General assistants reason well and know nothing about your customers. MCP gives them your full customer history, under your permissions.",
    old=["Pasting customer details into a chat", "Answers that miss last week's call", "Copying results back into the CRM", "Yet another app to adopt"],
    new=["Assistants look up customers themselves", "Answers grounded in real history", "Updates save straight to the CRM", "Work stays where your team already is"]),
  rows=[
    dict(k="Connect", h="One address, one sign-in", p="Add the Omniscient address to your assistant, sign in and approve. Keys are available for teams that prefer them."),
    dict(k="Tools", h="Read and act on your CRM", p="Search, open records with full history, check fields, and create or update companies, people, deals and notes.",
      pts=["Search and full history", "Create and update records", "Your permissions still apply"]),
    dict(k="Context", h="The same facts your team sees", p="Assistants read from Omniscience, the same memory Otto and your team use, so every answer matches the CRM."),
  ],
  band=dict(h="<span>Your customer context,</span> in every assistant your team uses.", pts=[
    ('Code', 'Standard protocol', 'Works with Claude, ChatGPT, Cursor and more.'),
    ('Orbit', 'Shared memory', 'The same facts Otto and your team rely on.'),
    ('Check', 'Governed access', 'Read-only or read and write, revocable any time.')]),
  faq=[("What is MCP?", "MCP is a standard way for AI assistants like Claude and ChatGPT to use other tools. Omniscient's lets them read and update your CRM."),
       ("Which assistants work?", "Claude, ChatGPT, Cursor and any assistant that supports remote MCP servers."),
       ("How do I sign in?", "Your assistant opens Omniscient's approve page, where you sign in and approve. Or use an API key from Settings > Apps > Developers."),
       ("Can I limit what it can do?", "Yes. Keys can be read-only or read and write, and you can turn off any key or connection at any time.")]),

'developers': dict(
  h1="Build on your revenue data",
  lede="A clean REST API for companies, people, deals, notes and custom records. Webhooks notify your systems the moment anything changes.",
  swap=dict(h="Your CRM should be the hub of your stack", p="Revenue data belongs everywhere decisions are made. The API and webhooks make that an afternoon of work.",
    old=["Copying data between systems by hand", "Reports built on last week's export", "Form leads sitting in an inbox", "Systems that never hear about changes"],
    new=["Sync any record in a few calls", "Feed your warehouse on a schedule", "Forms create leads directly", "Webhooks fire on every change"]),
  rows=[
    dict(k="Keys", h="Scoped keys in seconds", p="Owners and admins create keys in Settings > Apps > Developers. Name each one, choose read or write access, and revoke it any time.",
      pts=["Read-only or read and write", "Named, revocable keys", "600 requests a minute per key"]),
    dict(k="API", h="One pattern for every object", p="Companies, people, deals, notes, activities, owners and custom records share the same list, get, create and update calls."),
    dict(k="Webhooks", h="Real-time by default", p="Give a URL and pick the events. Each change arrives as JSON the moment it happens."),
  ],
  band=dict(h="<span>Simple to start,</span> ready for whatever you build.", pts=[
    ('Code', 'Consistent API', 'One pattern across every object, custom ones included.'),
    ('Clock', 'Real-time events', 'Webhooks fire the moment data changes.'),
    ('Check', 'Scoped access', 'Named keys, read or write, revocable any time.')]),
  faq=[("Where do I get an API key?", "Owners and admins create keys in Settings > Apps > Developers. Each key is read-only or read and write."),
       ("How do I send the key?", "Put it in the Authorization header as Bearer, followed by your key. Keys start with omn_."),
       ("Are there limits?", "Each key can make up to 600 requests a minute. Past that, you get a 429 response with a Retry-After header."),
       ("Does the API work with custom records?", "Yes. Custom objects and their records use the same calls as built-in ones.")]),

'for/founders': dict(
  h1="Founder-led sales, at the scale of a full team",
  lede="Otto finds leads, prepares your calls, keeps every deal current and drafts your follow-ups. Your time goes to the conversations that close.",
  swap=dict(h="Your time is the scarcest resource in the company", p="Founders sell in the gaps between everything else. Omniscient removes the admin, so every hour on sales is spent selling.",
    old=["The pipeline lives in your head", "Prospecting eats your evenings", "Follow-ups slip during a launch", "A sales hire feels like the only option"],
    new=["Ask where every deal stands, any time", "Qualified lists from one sentence", "A drafted follow-up after every call", "Room to grow before your first hire"]),
  rows=[
    dict(k="Pipeline", h="Clarity on every deal", p="Sunday night, ask Otto where to focus your week. He shows which deals are close and which need you, with the reason for each."),
    dict(k="Leads", h="Pipeline on demand", p="Describe your ideal buyer and Otto builds the list, emails included. Save the best with one click."),
    dict(k="Follow-up", h="No call without a next step", p="After each call, Otto updates the deal and drafts the follow-up in your voice. You review and send."),
  ],
  band=dict(h="<span>Sell like a team of five</span> while you build the company.", pts=[
    ('Radar', 'Pipeline on demand', 'Qualified lists from one sentence.'),
    ('Calendar', 'Prepared for every call', 'A brief and a follow-up for each meeting.'),
    ('Users', 'Ready to scale', 'Add your first reps to the same workspace.')]),
  faq=[("Is Omniscient a fit before we hire salespeople?", "Yes. Founders run sales in Omniscient themselves, then add their first reps to the same workspace when they're ready."),
       ("How long does setup take?", "Most founders are up and running the same afternoon. Connect Gmail and your calendar, import your list, and Otto takes it from there."),
       ("Will it send emails for me?", "No. Otto writes drafts. You send them from your own inbox, so every email sounds like you."),
       ("What does it cost?", "Paid plans start at $19 per seat a month, billed yearly, and you can try Pro free for 14 days with no card. Teammates who only view or log data can use free seats.")]),

'for/sales': dict(
  h1="More selling time. A forecast you can stand behind.",
  lede="Calls become notes, deal updates and follow-up drafts automatically. Reps get their days back, and leaders get a pipeline grounded in what customers actually said.",
  swap=dict(h="Every hour of admin is an hour of selling you never get back", p="Reps lose hours each week to logging and updating. Omniscient returns that time to the customer.",
    old=["Logging every call by hand", "Updating fields after every meeting", "A forecast built on gut feel", "Every follow-up written from scratch"],
    new=["Calls logged with notes automatically", "Deals updated with one approval", "Every stage change backed by a quote", "Follow-ups drafted and ready"]),
  rows=[
    dict(k="Prep", h="Prepared for every meeting", p="A one-page brief arrives before each meeting: who's attending, what they said last time and what to ask next."),
    dict(k="Update", h="The CRM updates itself", p="After each call, Otto proposes the new stage, amount and next step, with the customer's own words as evidence. One click to approve."),
    dict(k="Forecast", h="A pipeline leadership can trust", p="Every stage change is backed by what the customer said. When leadership asks why a deal moved, the answer is on the record."),
  ],
  band=dict(h="<span>Less admin, more revenue.</span> Every deal stays current.", pts=[
    ('Clock', 'Time back for selling', 'Notes and updates happen automatically.'),
    ('Check', 'Evidence-based pipeline', 'Every change backed by the customer\'s words.'),
    ('Mail', 'Faster follow-up', 'Drafts ready after every call.')]),
  faq=[("Do reps still need to log calls?", "No. Calls on Zoom, Google Meet or Teams get notes on their own, and Otto suggests the deal updates."),
       ("Can managers see what changed?", "Yes. Every change shows who made it, or that Otto suggested it and who approved it, with the quote behind it."),
       ("Does it replace our email?", "Your email stays where it is. Emails sync from Gmail or Outlook, and drafts open in your inbox to send."),
       ("Can we keep our own stages?", "Yes. Set your own stages and fields in a few clicks.")]),

'for/marketing': dict(
  h1="Know exactly which demand becomes revenue",
  lede="Build target lists by asking, and trace which accounts become real pipeline. Every lead reaches sales with its full story attached.",
  swap=dict(h="Marketing and sales should share one version of the truth", p="Leads disappear once they reach sales, and attribution becomes an argument. In Omniscient, both teams work from the same records.",
    old=["Guessing which campaigns create deals", "Target lists built by hand", "New leads waiting hours for an owner", "Sales asking 'who is this?' on the first call"],
    new=["Ask which segments drive revenue", "Target lists and lookalikes by asking", "Leads routed and briefed instantly", "Sales sees every touch before the call"]),
  rows=[
    dict(k="Target", h="Target accounts, by asking", p="Describe your ideal customer, or name your best ones, and get matching companies and people with emails, ready for the next campaign."),
    dict(k="Handoff", h="Every handoff arrives warm", p="When a lead books a meeting, a workflow assigns the owner, writes a prep brief and posts in Slack."),
    dict(k="Learn", h="Invest where revenue comes from", p="Ask which sources, industries and company sizes become deals, then plan the next campaign around the answer."),
  ],
  band=dict(h="<span>Invest where the revenue is.</span> Hand off every lead warm.", pts=[
    ('Radar', 'Precise targeting', 'Lists and lookalikes from a description.'),
    ('Workflow', 'Instant routing', 'Owner, brief and Slack alert the moment a lead is ready.'),
    ('Sparkles', 'Revenue insight', 'Ask which segments turn into pipeline.')]),
  faq=[("Can marketing and sales share one workspace?", "Yes. Everyone works from the same records, so sales sees every touch and marketing sees what became revenue."),
       ("Does it send email campaigns?", "Bulk campaigns belong in your marketing email tool. Omniscient handles sales email, and workflows send follow-ups from your team's templates."),
       ("Can we route leads on their own?", "Yes. Workflows can pick an owner, write a prep brief and post in Slack when a lead arrives or books a meeting."),
       ("Can we import event lists?", "Yes. Upload a CSV file, and duplicates merge with people already in your CRM.")]),

'for/customer-success': dict(
  h1="Protect revenue. Expand every account.",
  lede="Every email, call and note for each account, with renewals in view. Otto surfaces the accounts that need attention while there's still time to act.",
  swap=dict(h="Churn announces itself weeks in advance, if you're listening", p="Warning signs show up in silence, job changes and tone long before renewal day. Omniscient makes them visible early.",
    old=["Renewal dates that arrive by surprise", "Account history scattered across tools", "A champion's departure discovered too late", "Context lost in the handoff from sales"],
    new=["Renewals in view, with time to prepare", "The full account story on one record", "Quiet accounts and job changes flagged", "Every handoff keeps the full history"]),
  rows=[
    dict(k="History", h="The whole relationship, before every call", p="Ask about any account and see what they bought, what they asked for and what they said last time, with sources."),
    dict(k="Renewals", h="Renewals, managed ahead of time", p="Renewal dates live on the record. A workflow can alert the owner and prepare an account brief weeks in advance."),
    dict(k="Signals", h="Risk, surfaced early", p="When an account goes quiet or a key contact changes jobs, Otto flags it while there's still time to act."),
  ],
  band=dict(h="<span>Know every account as if it were your only one.</span>", pts=[
    ('Users', 'Full account context', 'Every interaction and commitment on one record.'),
    ('Calendar', 'Renewals in view', 'Owners alerted and briefed well ahead of time.'),
    ('Radar', 'Early risk signals', 'Quiet accounts and job changes flagged automatically.')]),
  faq=[("Can we track renewal dates?", "Yes. Add renewal fields to companies or deals, and use workflows to remind owners ahead of time."),
       ("Can success and sales share accounts?", "Yes. Everyone works from the same record, so handoffs keep every email, call and note."),
       ("Does Otto flag accounts at risk?", "Otto flags accounts that have gone quiet or lost a key contact, and you can ask him which accounts need attention."),
       ("Can we keep a health score?", "Yes. Add a health field with your own options, and Otto can suggest updates from calls and emails.")]),

'for/agencies': dict(
  h1="Win more pitches. Retain every client.",
  lede="Clients, pitches and contacts in one system. Otto prepares every pitch and writes the recap after every client call.",
  swap=dict(h="Client relationships are your agency's balance sheet", p="When account history lives in one person's inbox, every departure puts revenue at risk. Omniscient keeps it with the client.",
    old=["Pitches tracked in a spreadsheet", "Client history in one person's inbox", "Recaps written late at night", "Every pitch prepared from scratch"],
    new=["Every pitch on one board", "Client history the whole team can see", "Call recaps drafted for you", "A pitch brief before every meeting"]),
  rows=[
    dict(k="Pitches", h="Your new business pipeline, at a glance", p="Track pitches from first call to signed, in your own stages. See what's close and what needs a push."),
    dict(k="Clients", h="Continuity on every account", p="Every email, call and note with a client sits on one record, so anyone can step in when the account lead is out."),
    dict(k="Recaps", h="Recaps that impress clients", p="After each client call, Otto writes the recap and next steps. You review and send it the same afternoon."),
  ],
  band=dict(h="<span>More pitches won,</span> every client relationship protected.", pts=[
    ('Briefcase', 'New business clarity', 'Every pitch tracked in your own stages.'),
    ('Users', 'Account continuity', 'Client history visible to the whole team.'),
    ('Mail', 'Client-ready recaps', 'Drafted after every call, sent by you.')]),
  faq=[("Can we track pitches and clients together?", "Yes. Use deals for pitches and companies for clients, or add a custom record type for projects."),
       ("Can we keep some client emails private?", "Yes. Each person chooses which emails are shared with the team."),
       ("Does Otto write contracts?", "No. Otto preps meetings, writes recaps and drafts emails. He never writes contract text."),
       ("Can Otto work in our Slack?", "Yes. Add Omniscient to your Slack to ask Otto questions and get alerts. Client conversations come in through email and call notes.")]),
}

# The tools that matter on each page, shown as a "Works with" row under the hero.
ALL = ['Gmail', 'Outlook', 'Google Calendar', 'Zoom', 'Google Meet', 'Teams', 'Slack', 'HubSpot']
WORKS = {
  'product/omniscience': ALL,
  'product/data-model': ['HubSpot', 'Salesforce', 'Attio', 'Pipedrive'],
  'product/clean-data': ['HubSpot', 'Salesforce', 'Attio', 'Pipedrive', 'LinkedIn'],
  'product/meetings': ['Zoom', 'Google Meet', 'Teams', 'Google Calendar'],
  'product/email-sync': ['Gmail', 'Outlook', 'Google Calendar'],
  'product/ask-otto': ['Slack', 'Gmail', 'Outlook', 'Zoom', 'Google Meet'],
  'product/find-leads': ['LinkedIn', 'HubSpot', 'Salesforce', 'Gmail'],
  'product/skills': ['Slack', 'Gmail', 'Google Meet', 'Zoom'],
  'product/knowledge': ['Gmail', 'Outlook', 'Slack'],
  'product/workflows': ['Slack', 'Gmail', 'Outlook', 'HubSpot'],
  'product/mcp': ['Claude', 'ChatGPT', 'Cursor'],
  'product/chrome-extension': ['LinkedIn', 'Gmail', 'Outlook'],
  'for/founders': ALL, 'for/sales': ALL, 'for/marketing': ['HubSpot', 'Salesforce', 'Slack', 'Gmail', 'LinkedIn'],
  'for/customer-success': ALL, 'for/agencies': ALL,
}

# Each page's closing call to action: the headline in short chunks (they rise in one by one), then one line.
FIN = {
  'product/omniscience': (["Never lose", "what a customer", "told you."], "Connect your inbox and calendar today, and the memory builds itself from the first email."),
  'product/data-model': (["A CRM built", "around how", "you win."], "Model your first custom object in minutes, and let Otto keep it complete."),
  'product/clean-data': (["Data your", "leadership can", "rely on."], "Bring your existing records. They arrive clean and stay that way."),
  'product/meetings': (["Every call,", "captured and", "acted on."], "Connect Zoom, Google Meet or Teams, and your next call writes its own notes."),
  'product/email-sync': (["Every conversation", "on the right", "account."], "Connect Gmail or Outlook in one click and see every relationship in context."),
  'product/ask-otto': (["Ask anything.", "Get the answer,", "with the proof."], "Otto is ready the moment your inbox and calendar are connected."),
  'product/find-leads': (["Your next customers", "are one", "sentence away."], "Describe your ideal buyer, then take them all the way to closed revenue in the same system."),
  'product/skills': (["Your best method,", "run by", "every rep."], "Start with ready-made skills, then codify your own in plain language."),
  'product/knowledge': (["The right answer,", "in your", "company's voice."], "Add your pricing and playbook today, and every answer follows them."),
  'product/workflows': (["Your best process,", "running", "around the clock."], "Turn follow-ups, routing and handoffs into workflows in minutes."),
  'integrations': (["Your whole stack,", "live by", "this afternoon."], "Connect your inbox, calendar and existing CRM in a few clicks."),
  'product/chrome-extension': (["From profile", "to pipeline in", "one click."], "Add the extension and capture the next prospect you view."),
  'product/mcp': (["Your CRM,", "inside every", "AI tool you use."], "Add one address to Claude, ChatGPT or Cursor and sign in."),
  'developers': (["Build on the", "memory behind", "every deal."], "Create a key in Settings and send your first request in minutes."),
  'for/founders': (["Sell like", "you already have", "a sales team."], "Live in an afternoon, then let Otto take the admin."),
  'for/sales': (["More selling.", "Less admin.", "A forecast you trust."], "Give your reps their time back, starting with the next call."),
  'for/marketing': (["Invest where", "the revenue", "really comes from."], "See which demand becomes pipeline, and hand off every lead warm."),
  'for/customer-success': (["Keep every", "customer you", "worked to win."], "Every account and every renewal, in view in one place."),
  'for/agencies': (["Win the pitch.", "Keep the client", "for years."], "Run new business and every client relationship from one system."),
}
for _slug, (_h, _p) in FIN.items():
    COPY.setdefault(_slug, {}).update(fin=_h, fin_p=_p)
for _slug, _l in WORKS.items():
    COPY.setdefault(_slug, {}).update(works=_l)
