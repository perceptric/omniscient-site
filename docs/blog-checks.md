# Blog: facts to confirm before publishing

Each post marks a price or claim "check" when it couldn't be confirmed on the vendor's own site, or when the vendor's pages disagree. The posts link every price to the vendor's pricing page. Hidden from visitors (docs/ is blocked in .htaccess).

## Omniscient (applies to every post)

- Which plan includes LinkedIn outreach. Posts quote the Starter price, $19 per seat a month billed yearly, from the home page pricing section.
- The free trial: posts say 14 days, no card, from the home page.
- Scout's AI is called Otto in the posts (CLAUDE.md), while docs/sales.md in the app calls it Quad.

## automate-linkedin-outreach-without-getting-restricted (2497 words, 4 visuals)

- Omniscient pricing: '$19 per seat a month, billed yearly' and '14 days free, no credit card' match index.html, but index.html doesn't say which plan includes LinkedIn outreach. Confirm before publishing.
- Vendor levels: 'about 100 a week' (FAQ), 'Fast's 150 a week is above the 100 that vendor guides usually give' and 'save it for Sales Navigator accounts' come from the RECOMMENDED tips in Senders.tsx (PhantomBuster, La Growth Machine, checked October 2026) plus a web search today. LinkedIn publishes no number.
- The title changed from 'Without Getting Restricted' to 'Without Getting Banned'. Resolved by this build: cover.svg, og.png, the <title>, og:title and the H1 now all say 'Banned'. The slug and URL still end in '-restricted'.
- senders.shot.html uses example values (warming up day 4, 6 of 10 invitations, Accepted 31%, Pending 18, 26 actions before 'now'). They agree with the engine's warmup and 80 to 100% rules (085_pacing.sql outreach_warm and outreach_limit, likes 30 and withdrawals 50 fallbacks) but aren't real account data.
- Frontmatter 'updated: 2026-11-03' assumes the batch publishes that day.
- Agent name: the post uses Otto (per CLAUDE.md and the brief), but docs/sales.md calls the Scout agent 'Quad'.

## linkedin-connection-request-limit (2339 words, 4 visuals)

- About 100 invitations a week over a rolling seven days comes from vendors (La Growth Machine, Overloop, FirstSales, Topo). LinkedIn publishes no weekly number.
- 150 to 200 a week on older Premium or Sales Navigator accounts comes from vendors (FirstSales, La Growth Machine). LinkedIn hasn't confirmed it.
- The suggestion of 10 to 25 invitations a day is Overloop's advice, not a LinkedIn figure.
- Pending ceiling: the draft said 1,500 to 3,000, but SalesRobot's site doesn't give 3,000. It now says 'about 1,500 in several guides' (confirmed on FirstSales and Topo). LinkedIn gives no number.
- 'Withdrawing doesn't give back weekly room' comes from vendors (La Growth Machine, Overloop, FirstSales), not LinkedIn.
- LinkedIn's help pages disagree on how many notes you get without Premium: a563153 says 3 a month, while a550555 and a6239760 say 5. The post gives both.
- Only a6239760 gives 300 characters for Premium notes. a563153 says 200. The post gives both.
- Using InMail while invitations are restricted is our reading of a6239760. LinkedIn doesn't say it.
- Restriction ladder step 5 (email address for every invitation) comes from a1340458. a551012 says only that repeated suspensions may lead to permanent restriction. Steps 1 to 4 match a551012, which I rechecked today.

## best-linkedin-automation-tools (2999 words, 4 visuals)

- Omniscient: the pricing section of index.html doesn't say which plan includes LinkedIn outreach, and plans.ts doesn't gate it to a plan. The post says 'Paid seats start at $19 per seat a month, billed yearly' (Starter).
- Expandi $99 a month (Business): the pricing page doesn't say whether that is per seat, per user or per LinkedIn account. 'Dedicated IP per account' comes from 'Dedicated country-based IP-address'. The page doesn't say whether the 7-day trial needs a card.
- lemlist $87 per user a month, billed yearly: the page never says 'billed annually' (Yearly looks like the default toggle), and 'per user' comes from its FAQ. The FAQ gives a 14-day trial, but a banner offers 30 days.
- lemlist where it runs: its own blog lists it as cloud, but its help center says its Chrome extension 'is required for LinkedIn automation'. The post now says that. Whether LinkedIn steps send with the browser closed is unconfirmed.
- HeyReach trial (14 days, no card, 3 accounts) comes from its FAQ, which calls the plan 'Starter'. The Agency card lists both '25 senders' and '50 senders' with no explanation. HeyReach's cloud status comes from its blog. The proxy and weekly-cooldown claims are now sourced to its pricing FAQ and help center.
- Linked Helper and Dux-Soup 'None listed' for email steps is based on their pricing pages only.
- La Growth Machine lists Ultimate at the same €120 as Pro and quotes Pro at '$110/month billed annually' elsewhere. The post uses only Basic €60 and Pro €120.
- Skylead and Waalaxy trial pages don't say whether a card is needed (the table doesn't claim 'no card' for them).

## heyreach-alternatives (2994 words, 3 visuals)

- HeyReach trial: the pricing FAQ gives 14 days, no card and 3 LinkedIn accounts on a 'Starter' plan, but the plans listed are Growth, Agency and Unlimited. The 30-day trial for Agency and Unlimited is on request only.
- HeyReach Agency: the page shows a 50-sender option with no price.
- Expandi: the page doesn't say what the $99 a month is billed per; its FAQ mentions 'seats for your LinkedIn accounts'. It also doesn't say whether the 7-day trial needs a card.
- lemlist: the FAQ says the trial is 14 days, but a banner on the same page advertises an extended 30-day trial.
- Skylead Agency: $999 for 25 seats and $1,999 for unlimited seats are a first-year promotion, and the second-year price isn't listed. The page doesn't say whether the trial needs a card.
- La Growth Machine: Ultimate shows €120, the same as Pro, plus a separate '$110/month billed annually' line. It's unclear whether Basic includes the unified inbox.
- Linked Helper: the pricing page doesn't say whether email can be a step in a sequence, so the comparison table shows 'check'.
- Omniscient: the pricing section on index.html doesn't say which plan includes LinkedIn outreach, and $19 is the Starter seat price. docs/sales.md also says sending is turned on per workspace (sales_settings.sending), so check it's available to new signups.

## best-ai-crm (3066 words, 4 visuals)

- Pipedrive: the pricing page still returns 403 and we didn't try to get around it, so its price and free plan stay 'check'. The homepage confirms the AI Sales Assistant, that Nova is in all plans, and the 14-day trial with no card.
- HubSpot: the Starter price ($20, or 'starts at $7' for new customers) and the Professional price ($90 or $100) appear without a billing term.
- Close: the page doesn't say which price is monthly and which is yearly. We read the lower figures ($9, $35, $99, $139) as yearly because annual plans are discounted.
- Day AI: the plan cards don't state a billing term. 'Prices reflect annual billing, paid upfront' sits under the volume table only. Super's unit isn't stated, so the post now says only '$800 a month'.
- Clarify Starter: $50 a month with 5,000 credits. The table shows a 5,000 to 40,000 credit range, but no prices for the higher amounts.
- Salesforce: the trial length isn't stated, so the table says 'Length not stated'.
- folk: the workflow assistant limit (1,500 a month) has no unit, and no free plan is listed.
- Attio: Call Intelligence is named in the Pro plan description. Which plans include it in the comparison table isn't confirmed.
- Day AI: 'nothing went out without your approval' comes from an example on its homepage. The page doesn't say how sending is gated.
- Omniscient: the site gives call recording as '$25 per seat' with no 'a month', and doesn't say which plan includes LinkedIn outreach.
- These sibling posts aren't written yet: /blog/attio-vs-hubspot/, /blog/crm-with-automatic-data-entry/, /blog/best-crm-for-startups/. They are the only broken internal links. Every /product/ link works.
- Builder/shared CSS: at 1280px the tools table scrolls sideways by 2px, because its min-width is 720px and its framed box is only 718px inside (blog.css). Not fixed here.

## omniscient-vs-attio (2500 words, 4 visuals)

- Which Omniscient plan includes Scout, Campaigns and the Inbox isn't in the site's pricing section, and neither is whether Scout searches use a monthly allowance (scout.ts reserves units against one). The tools block shows 'Paid from $19' next to 'LinkedIn outreach you approve'.
- The pricing section doesn't say which Omniscient plan includes custom objects (it lists 'Custom fields and saved views' on Pro). The app doesn't gate custom objects by plan in code.
- Omniscient Free seats: docs/pricing.md says a workspace needs a Pro or Business seat before it can add Free seats. index.html doesn't say this, so the post says only 'teammates who only view or log data'.
- Teams transcripts on Starter: the site FAQ and callSync.ts include Teams, but docs/pricing.md lists only Meet and Zoom for Starter.
- Ask Omniscient 'in the seat price': the site says AI is included, but ask.ts has a per-day cap (ASK_PER_DAY, default 50) and docs/pricing.md lists monthly smart-answer pools. The post doesn't claim unlimited answers.
- Attio iOS and Android apps are confirmed only by the footer links on attio.com/pricing, with no plan restriction stated.
- pacing-day.svg: in the browser pass the axis labels went from 15 to 16px and Lunch from 14 to 15px. Wednesday's lunch box is now 43 minutes instead of 40 (13:08, still within the 30 to 60 minute range), and the black marks no longer touch the green profile-view and invitation marks or the lunch boxes. All 720px blog SVGs, on every post, still shrink to about 0.44x on a 375px phone (text about 7px).
- Site build, not fixed: html scroll-padding-top (80px) plus the h2 scroll-margin-top (88px) put a heading 168px down after a contents click, and blog.js marks the active section at 120px, so the contents highlight the previous section.
- Site build, not fixed: '.bl-tools table {min-width:720px}' in a 720px frame with 1px borders scrolls 2px sideways on desktop. 'Keep reading. More on CRM.' shows two LinkedIn posts. The build's word count includes the CSS inside a shot's <style> block.

## safest-linkedin-automation-tools (2971 words, 3 visuals)

- La Growth Machine's pricing page contradicts itself. Pro and Ultimate are both shown at €120, one line says 'lgm pro is just $110/month (billed annually)', and the page never says whether €60 is the monthly or the annual rate. The post uses only Basic, at €60 per identity a month.
- HeyReach's 14 day trial with no card comes from its pricing FAQ, which calls the plan 'Starter', while the plan card calls it Growth.
- HeyReach Agency at $999 a month: the card lists '25 senders' twice and '50 senders' once, with no visible selector. The post says 25 senders.
- Expandi: the 7 day trial is confirmed, but the page doesn't say whether it needs a card. Its random delays between actions appear only on its blog.
- Waalaxy: the 14 day trial's card terms aren't stated. IP handling, warmup, slowdowns and random gaps between actions aren't published. Working hours are confirmed in its help center (Settings > Account Activity).
- La Growth Machine says 'Actions spaced out' without saying the gaps are random, so the post now says only that 'most' tools space actions out at random.
- Dripify doesn't define 'Advanced LinkedIn protection'. The post reads 'activity control' as an automatic slowdown on Advanced only.
- Linked Helper's pricing page doesn't show a base price for Pro. The post uses Standard at $15 per account on a monthly term.
- Omniscient: the app repo has no dedicated IP or proxy for each sender, so the post says it 'doesn't list' one. The team should confirm that wording.
- Omniscient pricing: $19 is the Starter seat, and the home page doesn't say which plan includes LinkedIn outreach. The wording matches the sibling posts.
- HeyReach's company page removal on March 25, 2026 comes only from HeyReach's own blog post.

## linkedin-automation-tools-for-agencies (2989 words, 3 visuals)

- Omniscient: the site's pricing doesn't say which plan includes LinkedIn senders and campaigns, or whether a connected sender costs extra. The post says only that paid seats start at $19 per seat a month, billed yearly.
- HeyReach Agency: $999 for 25 senders and $1,399 for 50 come from the JSON-LD (structured data) on HeyReach's own pricing page. The visible card shows a 25/50 toggle. Open the live toggle once to confirm.
- HeyReach: the FAQ says the old 'Starter' plan has a residential proxy for each sender. The post applies this to Growth, the plan you pay per sender.
- Meet Alfred: $39 per user a month, billed yearly, comes from the comparison tables on its pricing page, because the plan card loads its price with JavaScript. The 3-seat minimum is read from the card's seat counter, which starts at 3.
- Expandi: Agency (10+ seats) is priced on request. It isn't clear whether the 7-day trial covers Agency or needs a card.
- Skylead Agency at $999 for 25 seats or $1,999 for unlimited is a first-year promotion, so it will go out of date.
- GetSales.io: the page doesn't say what '$500 a month in resources' covers for white label (Business setup), or whether the 7-day trial needs a card.
- SalesRobot: white label goes through its partner program, and no price is listed.
- LinkedIn doesn't publish exact invitation limits. The post says so and quotes help page a550555.

## linkedin-outreach-tools-with-crm (3131 words, 4 visuals)

- Omniscient: the pricing section of index.html doesn't say which plan includes LinkedIn outbound. The post says paid seats start at $19 per seat a month, billed yearly, and puts the pipeline board and forecast on Pro at $49.
- NetHunt CRM: the site only ever says 'Professional Network'. Its sequences page lists connecting, withdrawing requests and messaging, with automatic actions and delays, but the post still tells readers to confirm in the trial which LinkedIn steps send on their own.
- NetHunt CRM: the pricing page doesn't say whether the 14-day trial needs a card.
- Kanbox: the monthly Starter price ($20) has no billing label, so the post uses only $12 a month billed yearly. The Starter account limit isn't stated. It no longer says the FAQ calls Kanbox a Chrome extension, because today's page says 'Cloud 24/7 (runs without your computer)' and only links to an extension download.
- Meet Alfred: monthly and quarterly prices show as '$00' placeholders, so only yearly prices are confirmed. The plan summary says Individual, Business and Teams, while the plan cards say LinkedIn Only, Multi-Channel and Agency. The Agency/Teams seat picker starts at '3 +', which isn't stated in the post. The 7-day no-card trial and the cloud/no-extension FAQ come from the homepage.
- Linked Helper: 'from $8.25 a month on longer terms' is the page's 'Local from $8.25 / month'. The Pro price isn't shown on the pricing page.
- Breakcold: syncing LinkedIn, email, WhatsApp and Telegram rests on its nav pages ('LinkedIn CRM', 'WhatsApp CRM', 'Telegram CRM'), 'One inbox for every channel' and its blog. 'No automated LinkedIn invitation sequences' only means the pricing page doesn't list them.
- folk: 'no automated LinkedIn invitations' only means the pricing page doesn't list them. The 2,000-message allowance appears under 'Messages & Sequences', and what counts as a message isn't defined. The Sales Navigator capture comes from the folkX page.
- Waalaxy: the pricing page lists 'CRM Sync (2000+ tools)' and names no CRM.
- Comparison table: the 'Email on the same record' values for Breakcold and folk come from their marketing pages and weren't tested.

## expandi-alternatives (3138 words, 3 visuals)

- Meet Alfred: the static text on the pricing page says $29, $49 and $39 billed yearly. When the page loads, its own pricing script replaces these with $39 (LinkedIn Only), $49 (Multi-Channel) and $59 per seat (Agency, from 3 seats) billed yearly, or $59, $69 and $79 monthly. The post uses the script's numbers. Confirm them in a browser.
- Waalaxy: the €19, €49 and €69 prices show with the Yearly switch on by default (up to 50% off), and the page source has no monthly prices. The tools table says 'check billing period'. Business's 'multiple sender accounts' was read from comparison-table icons.
- Waalaxy: 'Cloud on Advanced and Business' comes from Waalaxy's own blog. That article doesn't mention the Pro plan.
- HeyReach: the dedicated residential proxy per sender and the 14-day trial (no card, 3 accounts) come from a pricing FAQ that calls the plan 'Starter'. The post says 'entry plan' and 'Growth'.
- Skylead: the 'First-year promotion' label sits above both Agency prices ($999 for 25 seats and $1,999 for unlimited seats). Which plans include the HubSpot, Pipedrive and Salesforce sync is still unclear.
- Dripify: 'dedicated IP in your location' comes from Dripify's FAQ, but Expandi's comparison table says Dripify has no dedicated IP.
- Expandi: these are claims that something is absent, scoped to the pages we read: 'Not listed' for slowing down when acceptance drops, and 'the pricing page lists no email finder'. Separately, 'up to 300+ connection requests weekly' is a marketing line in the product menu, not a plan limit.
- Omniscient: the pricing section doesn't say which plan includes LinkedIn outreach. The app gates sending by seller seat, not by plan. The post says 'Paid seats start at $19 per seat a month, billed yearly'.
- Omniscient: whether Unipile sends from a dedicated IP isn't confirmed. The post says 'we don't list a dedicated IP'.

## waalaxy-alternatives (3104 words, 3 visuals)

- Waalaxy monthly prices: the pricing page opens on the Yearly tab (-50%) showing Pro €19, Advanced €49, Business €69 per user a month; monthly figures aren't in the page source. The help center gives Business a standard €139 a month, varying by country. The post tells readers to check the monthly price at checkout.
- Waalaxy Advanced/Business daily invitations: help center says 80 to 100 a day (max 200 a week), the quotas article says 100 max a day, the pricing page says 800 a month. The post uses 80 to 100 a day, at most 200 a week.
- lemlist trial: FAQ says 14 days with Multichannel features and 200 credits, a banner on the same page offers 30 days; card requirement not stated.
- Expandi: $79 annual price is shown beside '2 months free' without saying it's a monthly equivalent; 'per seat' and 'dedicated IP for each seat' come from Expandi's own comparison pages, not its pricing page.
- HeyReach: trial terms (14 days, no card, 3 accounts) are given in an FAQ that calls the plan 'Starter' while the table says 'Growth'; Agency shows a 25 or 50 sender option at $999.
- Omniscient: the site's pricing section doesn't say which paid plan includes LinkedIn outreach; src/lib/plans.ts doesn't gate it. The post uses the sibling wording '$19 per seat a month, billed yearly'.

## dripify-alternatives (2999 words, 3 visuals)

- Expandi: the pricing page doesn't say how many seats or LinkedIn accounts Business covers, or whether the 7 day trial needs a card. The comparison table shows 'check' under Billed per.
- HeyReach Agency: $999 is a flat monthly price, but the card offers both 25 and 50 senders without saying which one $999 covers. The article now names both options.
- HeyReach trial: the FAQ ties the 14 day trial (no card, 3 accounts) to a 'Starter' plan. The cards call that plan Growth, and we read them as the same plan.
- HeyReach CRMs: the integrations page lists HubSpot, Attio and Breakcold without saying whether they are native. The table says 'listed'.
- Waalaxy: the page loads with the Yearly toggle on, so EUR 19, 49 and 69 are yearly-billed prices. Monthly prices load only through JavaScript and we couldn't confirm them. The page also doesn't say whether the trial needs a card.
- La Growth Machine: the page loads with Annual selected, so EUR 60 and 120 per identity are yearly-billed prices, and monthly prices weren't visible. The same page also says 'lgm pro is just $110/month (billed annualy)' and lists Ultimate at EUR 120.
- lemlist: the page says pricing depends on the number of users but doesn't label the $87 as per user. A banner offers a 30 day trial, while the FAQ says 14 days.
- Skylead: the plan behind the HubSpot, Pipedrive and Salesforce sync isn't clear, the 'first-year promotion' label may cover only the $999 price, and the page doesn't say whether the trial needs a card.
- Linked Helper: the page gives $15 as the base price per license and doesn't clearly name it Standard. The Cloud storage version starts higher.
- Dripify: we found no working hours setting on its own pages, so the Timing row now says only 'Random delays between actions'.
- Dripify: its features page says up to 20 variables, its help center lists 17, and the AI icebreaker page says 'coming soon'. We removed the '20+ variables and AI icebreaker' claim.
- Omniscient: the site's pricing cards don't list LinkedIn outreach under any plan. In the code, sending needs a paid (seller) seat and plans.ts doesn't gate it by plan. Confirm it's sold from Starter at $19.

## linked-helper-alternatives (2995 words, 3 visuals)

- Omniscient: the site's pricing section doesn't say which plan includes LinkedIn outreach. The app doesn't gate it by plan (it uses a per-workspace allowlist). The post only says paid seats start at $19 per seat a month, billed yearly.
- STACKED by Dux-Soup: the pricing page gives no trial length, though the homepage says 'start free trial'. The post tells readers to ask.
- La Growth Machine: €60 (Basic) and €120 (Pro) per identity a month appear under the Annual tab, which is on by default, so the post says 'billed yearly'. The same page also says 'lgm pro is just $110/month (billed annualy)' and shows Ultimate at €120 too.
- HeyReach: the FAQ question asks about 'Growth', but its answer calls the plan 'Starter' when it gives each sender a dedicated residential proxy. The post says 'the per sender plan', and the comparison table says 'on Growth'.
- Linked Helper: the post's line that it has no email steps comes from not finding any on its pages, not from a vendor statement. It's worded 'We didn't find' and 'None found'.

## lemlist-alternatives (2995 words, 4 visuals)

- Omniscient: the site's pricing section doesn't say which plan includes LinkedIn campaigns. The post only says 'Paid seats start at $19 per seat a month, billed yearly'.
- Waalaxy: the static pricing page doesn't label the billing term for €19, €49 and €69. The post calls them yearly prices because the page's yearly tab saves 50% and Waalaxy's subscriptions help article gives Business a standard price of €139 a month. Confirm the default tab in a browser.
- La Growth Machine Ultimate: the page source shows €120, the same as Pro, so the real price is unclear. The post doesn't state it.
- Skylead Agency ($999 for 25 seats, $1,999 for unlimited) is labelled a 'First-year promotion', and year-two pricing isn't published. The post tells readers to ask.

## heyreach-vs-expandi (2495 words, 3 visuals)

- Expandi MCP: the help center marks it Beta, the pricing page says 'Expandi MCP is here', and the integrations page says it was 'launching September 30'. The post says 'In beta'.
- HeyReach volume pricing: Expandi's comparison page claims $59 per sender at 10 or more and $1,399 for 50 senders. HeyReach's own pricing page shows no volume tiers, so the post gives no volume price.
- HeyReach Agency with 50 senders: the option appears on the pricing page with no price shown.
- Expandi prices that aren't published: the Agency plan is on request, and the image, GIF and video add-ons have no listed price.
- These Expandi claims come only from its comparison page (expandi.io/expandi-vs-heyreach): a reply pauses the lead; post likes count as a signal; profile signals need Premium or Sales Navigator; signals sync about once a day; it has no voice notes; teammates and clients are free; it has more conditions than HeyReach; and the quote 'No tool can promise zero risk'.
- Expandi warmup: you switch it on with a toggle, and the help center doesn't say whether it starts on. The post now says 'a warmup you switch on'.
- HeyReach's 40 a day limit on warmup actions: the help article doesn't say whether the 40 is shared or counted per action. The post says only 'a daily limit of 40 per sender'.
- Our inference: HeyReach reaches Salesforce and Pipedrive through Zapier, Make, n8n or the API. Its integrations page lists neither CRM.
- LinkedIn removing HeyReach's company page on March 25, 2026: the only source is HeyReach's own blog post from August 7, 2026.
- HeyReach's help articles disagree on whether working hours are set per sender or per campaign. The post cites only the suggested 8 to 12 hour window.
- Expandi spells its video partner both 'Senspark' and 'SendSpark'. The post uses Sendspark.

## waalaxy-vs-lemlist (2499 words, 4 visuals)

- Waalaxy's monthly prices for Pro, Advanced and Business. Its pricing page opens on the Yearly tab (€19, €49, €69) and its HTML holds no monthly figures. The only monthly number is the €139 'standard' monthly Business price in its help center, which 'may vary depending on your country'.
- Waalaxy Inbox price: its pricing page says €20 a month, but the writer saw €10 on Waalaxy's own Waalaxy vs lemlist page. I didn't open that page. The post uses €20.
- Waalaxy trial terms. Every plan card on the pricing page says '14-day free trial'. Its subscriptions article says the trial is of Advanced or Business and needs a credit card. The same article contradicts itself on what the trial becomes: a 7-day trial turns into monthly Advanced and a 14-day one into yearly Advanced, but elsewhere it says a monthly Business subscription starts at €139. The post says only '14 days on the pricing page, and its help center asks for a card'.
- lemlist SMS: the Multichannel plan card lists 'SMS automation', but the pricing FAQ says SMS and WhatsApp are 'available as add-ons'. The post follows the plan card.
- Whether lemlist's enrichment add-on ($20, or $16 yearly) and intent-signal add-on ($29, or $21 yearly) are charged per user or per workspace.
- Which Omniscient plan includes LinkedIn outreach. The pricing section on index.html doesn't say. The post only says 'Plans start at $19 per seat a month, billed yearly'.
- lemlist's pricing page shows a limited-time 30-day trial banner tied to a creator referral. The post uses the 14-day trial from its FAQ.
- How lemlist's '5 senders per user' on Multichannel fits with its help article saying each lemlist account connects to one LinkedIn account. The post states both as published.

## linkedin-automation-pricing (2488 words, 4 visuals)

- Waalaxy: the US dollar prices ($19/$39/$69 monthly, $16/$32/$55 yearly) come from the page as rendered for us. The static HTML shows €19/€49/€69 and a -50% yearly badge, but the rendered page shows -20%. Which currency a visitor sees depends on where they are.
- Waalaxy LinkedIn Inbox at €20 a month comes from its FAQ. No US dollar price is given.
- lemlist trial: the FAQ says 14 days with Multichannel features and 200 credits. The writer saw a 30-day trial banner. It didn't appear when I loaded the page.
- Expandi: the $79 yearly figure appears with no unit. We say 'a month, billed yearly', which matches its '20% off'. The Agency plan (10+ seats) and the image, GIF and Sendspark add-ons are priced on request or not listed.
- Skylead: the Agency prices ($999 for 25 seats, $1,999 unlimited) are a first-year promotion with no end date and no later price. The Annual plan has no listed price.
- HeyReach: the FAQ calls the plan 'Starter' for the trial (14 days, no card, 3 accounts) and the proxy, but the pricing table calls it 'Growth'. Trial terms for Agency and Unlimited and the price of credit top-ups aren't listed.
- Linked Helper: the Pro price ($45 a month, $24.75 on 12 months) and the Cloud storage price ($29.90, $16.50 on 12 months) come from the page's price calculator, not from its static text.
- La Growth Machine: the prices come from the rendered billing tabs (Monthly €60/€120/€180, Annual €50/€100/€150). The static HTML shows Ultimate at €120, and the page also says 'lgm pro is just $110/month'.
- Dripify: the header says 'up to 35% off', but the listed prices work out to about 25% (Pro) and 20% (Advanced).
- Dux-Soup: the pricing page mentions no free trial.
- Omniscient: the home page pricing (index.html) says teammates who only view or log data are free, with no condition. The app (024_billing.sql) gives free seats only on Pro and Business. The post now says that. index.html should be updated to match.
- Omniscient: 'each connected account costs us the same' relies on Unipile charging per account with no per-call fee. docs/costs.md marks that 'check'.
- Entry-prices chart: Waalaxy's $16 and $19 markers sit 3 dollars apart, so the two boxes overlap by a few pixels at both widths. Both labels still read. Left as is because the positions match the data.

## best-crm-for-startups (2996 words, 4 visuals)

- HubSpot Sales Hub Starter: the pricing page shows 'Starts at $7/mo/seat' and '$20/mo/seat' with '*Discounts available for new customers only'. It doesn't say which price is monthly and which is yearly billing, or how long the $7 lasts. The post quotes the page as written.
- HubSpot Professional: the card shows $90 and $100 per seat with 'Commit annually' and doesn't label which is pay-yearly and which is pay-monthly. The post says 'starts at $90 per seat a month with a yearly commitment'.
- HubSpot for Startups: the top tier lists 90%, 50% and 25% off over three years, but the FAQ says the discount 'typically' lasts two years. The post and startup-discounts.svg now state both and tell readers to ask which applies.
- Attio for Startups: the eligibility wording conflicts ('must be venture-backed' versus 'venture backed or affiliated with one of our startup partners'), and the FAQ adds signing up within 90 days and incorporation less than 10 years ago. The post now gives both versions. The credit amount isn't stated. The startup-discounts.svg subtitle and its alt text said only 'venture backed'. They now say 'Yearly Pro plan and credits, workspaces up to 10 seats' and leave eligibility to the text.

## best-crm-for-founders (2928 words, 3 visuals)

- Pipedrive: pricing page still returns 403, so its starting price and free plan say check. Homepage facts are confirmed (Nova on all plans, 14 day trial, no card).
- HubSpot: Sales Hub Starter shows $20 next to a '$7 starts at' price marked 'for new customers only'. The page doesn't say how long the discount lasts.
- Day AI: $24 and $60 are shown under 'prices reflect annual billing, paid upfront', and the page meta gives Professional at $75 a month. But the FAQ says to contact Day to set up yearly billing.
- folk: the pricing FAQ mentions a free plan with no details, so the table says 'Not listed'.
- Omniscient: the site pricing says teammates who only view or log data are free, but doesn't say this needs a Pro or Business seat. The app (plans.ts freeSeats: pro, docs/pricing.md) requires one, and the post says so.

## best-crm-for-b2b-saas (2987 words, 4 visuals)

- Pipedrive prices: the pricing page still returns 403. I removed the unverified $14 to $79 range. The tools table shows 'check', and the post sends readers to Pipedrive's pricing page.
- Pipedrive built-in outreach is unconfirmed, so the comparison table shows 'check'.
- Pipedrive's 14-day trial with no card comes from a search summary of Pipedrive's homepage. I couldn't open that page directly.
- HubSpot Sales Hub Starter: the page shows $20 and 'starts at $7' without saying which billing period each is. The $7 is marked 'Discounts available for new customers only'.
- HubSpot Professional: the page shows $90 and $100 without billing labels. The post now says only 'starts at $90' plus the required $1,500 onboarding fee.
- HubSpot sequences and forecasting rows have no tier labels. The table says 'Email sequences (check tier)', and I removed the claim that Professional adds custom forecasting.
- Day AI: the price table says 'Prices reflect annual billing, paid upfront', but the FAQ offers a 20% annual discount through sales. So it's unclear whether $24, $60, $200 and $800 are yearly or monthly prices.
- Salesforce: the pricing page doesn't state a free trial length. The table says 'Length not stated'.
- Freshsales: the page's meta description mentions a free plan, but no plan card is free. The table says 'Not listed'.

## best-crm-for-linkedin (2992 words, 4 visuals)

- HubSpot Sales Hub Starter: the page shows 'Starts at $7/mo/seat' next to $20 and says 'Discounts available for new customers only'. It doesn't say which price goes with monthly or yearly billing, so the post quotes both.
- Zoho's Sales Navigator help page requires Advanced Plus and an administrator to install it, but it doesn't name the Zoho CRM edition the extension needs.
- Breakcold trial: the pricing page says '14-day free trial, card required' and its FAQ explains why. The LinkedIn CRM page says '14 day free trial, no credit card'. The post follows the pricing page.
- Salesforce: LinkedIn's CRM Sync guide lists Enterprise, Unlimited, Developer, Performance, or Professional with API access. Neither vendor says whether Starter Suite or Pro Suite qualifies. Salesforce's pricing page also doesn't give a trial length.
- Sales Navigator: Advanced Plus has no public price. The compare-plans page lists 'Advanced CRM Integrations' as a top feature without naming its plan, while LinkedIn's help pages say CRM sync is Advanced Plus only. The post follows the help pages.
- folk: neither the pricing page nor the folkX help page says whether LinkedIn message history syncs into folk. The writer found the folk help pages disagree on bulk-add size (10 vs 25), so no number is given.
- Salesflare: only the pricing page mentions LinkedIn ('LinkedIn sidebar', 'works right in LinkedIn'). Nothing confirms that it saves profiles or syncs LinkedIn messages, so the post now says only 'adds a CRM sidebar'.
- Surfe (Pipedrive) and HeyReach (Attio) details come only from their marketplace listings.
- Omniscient: LinkedIn sending is switched on per workspace (sales_settings), not tied to a plan on the site's pricing section. The post says only that paid seats start at $19.

## crm-with-linkedin-integration (3000 words, 4 visuals)

- Omniscient: the pricing section on index.html doesn't say which plan includes the LinkedIn Inbox and outreach. In the code, sending is limited to paid 'seller' seats rather than a plan tier. The post says only 'Paid seats start at $19'.
- Omniscient: 'Messages you type on LinkedIn itself are saved to the same thread' rests on the webhook code, which records outbound messages, and on Unipile's own description that message_received also fires for sent messages. Not tested on a live account.
- Breakcold: the pricing page says '14-day free trial, card required' and lists 2 connected accounts on X1. Its LinkedIn CRM page says 'no credit card' and one LinkedIn account. The post follows the pricing page and says only '1 seat'.
- HubSpot: the pricing page shows $90 and $100 per seat for Sales Hub Professional without saying which billing term each one is. The post says 'starts at $90'.
- Salesforce: LinkedIn's admin guide (a16260001) names the Enterprise, Performance, Unlimited and Developer editions, plus Professional with API Access. Salesforce's pricing page sells Starter, Pro Suite and Core/Advanced/Max, so which of those qualifies is unconfirmed. The post tells readers to ask Salesforce.
- Zoho CRM: Zoho's help article doesn't name a Zoho CRM edition for the Sales Navigator extension, and LinkedIn's overview (a106005) doesn't list Zoho. The $14/$20 Standard prices come from Zoho's own pricing data file (crm-pricing-val.json), because the page draws its prices with JavaScript.
- Pipedrive: no price is stated, because the pricing page returned 403 to the writer.
- NetHunt CRM: the comparison table now calls it 'Connected account, in sequences', to match the four-kinds chart. NetHunt's pages say 'Professional Network' and don't explain how the account connects or whether replies are matched to records. Confirm in a trial.

## crm-with-automatic-data-entry (2995 words, 3 visuals)

- Pipedrive price: pipedrive.com/en/pricing and /pricing both returned 403 to WebFetch on Nov 3, so the tools block still says 'check' and the body links to the pricing page. Nova, the 14-day trial and the five email accounts come from the homepage.
- HubSpot Sales Hub Starter: the page says 'Starts at $7/mo/seat', also shows $20 without a label, and has a footnote saying discounts are for new customers only. The post gives both prices and the note. It doesn't say which price is the regular one.
- HubSpot Professional: the post uses the page's 'Starts at $90/mo/seat'. The page also shows $100 without saying which billing period it belongs to.
- HubSpot and Salesforce call notes: the pricing pages list transcription hours (HubSpot) and Conversation Intelligence and Activity Capture (Salesforce), but don't show which plan includes them. The comparison table still says 'check' for both.
- Coffee: the pricing table doesn't show which tiers include automatic contact and company creation. The post takes that feature from the homepage and doesn't name a tier.
- Attio: the per-tier checkmarks for Call Intelligence and Ask Attio didn't come through, so the post says Call Intelligence is on Pro, as Pro's plan card lists it.
- Copper: neither the homepage nor the pricing page mentions AI meeting notes. The table says 'Not listed' and the body names both pages. A notetaker may still exist somewhere else on Copper's site.
- Lightfield Starter's 'up to 3 seats' and Pro's capture-seat sync come from the pricing page and its FAQ, read through WebFetch's summary.
- Omniscient free seats: the app code (plans.ts NEEDS.freeSeats = pro) and docs/pricing.md say free seats need a Pro workspace. The site's pricing section doesn't say this. The post now says 'on a Pro workspace', and index.html may need the same line.

## attio-alternatives (2954 words, 3 visuals)

- Pipedrive: pipedrive.com/en/pricing still returns 403 to our reader. Every plan price stays 'check' in the tools table, and so does its free plan in the comparison table. Search snippets show $14, $39, $59 and $79 per seat billed annually, but we couldn't confirm these on the page itself.
- HubSpot: Sales Hub Starter shows 'starts at' $7 per seat for new customers next to $20, and neither has a billing label. The pricing page's Sequences row doesn't say which plan each value belongs to. HubSpot's own Sales Hub pricing guide (blog.hubspot.com, updated 09/09/26) lists sequences for Starter as 'None', so the post now says sequences start on Professional and cites that guide.
- Close: each plan shows two prices ($9/$19, $35/$49) with no monthly or yearly label, so the post says 'depending on billing'.
- Attio: 5,000 extra workspace credits show $70 and $85 with no billing label, so the post says 'depending on billing'. The page doesn't say whether the email limits (200 on Free, 1,000 on Plus) count per user or per workspace.
- Twenty: the page gives only yearly prices ($9 and $39). It shows no monthly price and names no license.
- folk: the Workflow Assistant limit (1,500 a month on Standard) has no unit. The page mentions a free plan only in its cancellation FAQ, so the comparison table says 'Not listed'.
- Clarify: the page mentions no free trial. Starter says 5,000 credits but its table shows 5k to 40k. The 30 credits per meeting summary comes from an FAQ example, and the post says so.
- Affinity: its pricing page mentions no free trial.
- Import shot: the counts (1,240 accounts and so on) are made up. Labels, tab order, status tag and count wording match ImportsDialog.tsx.

## hubspot-crm-alternatives (2965 words, 4 visuals)

- Pipedrive plan prices: pipedrive.com/en/pricing returned 403 again on Nov 3, 2026, so the tools table still says 'check'
- Pipedrive: whether a free plan exists and which plan email sequences start on are not confirmed ('check' in the comparison table)
- Zoho CRM: the pricing page doesn't say which plan has cadences or sequences, or how long the trial lasts. Prices of $14/$20 and $23/$35 were confirmed in Zoho's own pricing data file (zohowebstatic crm-pricing-val.json), because the page fills them in with JavaScript
- HubSpot Starter: the page shows a $20 price and a 'starts at' $7 (new customers only) without saying which billing each one goes with. HubSpot's pricing guide gives other figures
- HubSpot Professional: $90 sits next to 'Commit annually', and an unlabeled $100 is also shown. Only the HubSpot guide says $90 is the yearly price
- HubSpot calling minutes (500 Starter, 3,000 Professional): the page doesn't say whether they are per seat or per account
- HubSpot: no free trial of the paid plans is mentioned on the pricing page
- EngageBay: the first price block labels Basic $14.99 'per user/month, paid yearly' next to the Monthly toggle, while the yearly tab shows $13.79
- Freshsales: a free plan appears only in the page metadata, with no limits. Monthly prices sit behind a toggle and aren't in the page source
- folk: a free plan is mentioned in the page title and FAQ, but no free tier or limits are listed
- Import shot numbers (portal 48291, 1,180 accounts, 3,402 contacts, 615 leads) are example data, and the alt text says 'An example'
- Sibling links /blog/attio-vs-hubspot/ and /blog/omniscient-vs-hubspot/ have sources in blog/_src but aren't built yet. They only resolve after the final --all build

## pipedrive-alternatives (2996 words, 3 visuals)

- Pipedrive prices: pipedrive.com/en/pricing still returned 403 on Nov 3, 2026, so the post gives no Pipedrive prices. Plan limits come from its help center articles (updated Sept 3 and Sept 23, 2026). Growth's '50 reports' isn't labeled per user or per company.
- Zoho CRM USD prices: the comparison page shows only INR, so the tools table says check. The homepage says 'flexible free trial' with no length, and the flattened table doesn't show which edition has the Sales Navigator integration.
- HubSpot: the pricing page doesn't label which of $7/$20 (Starter) or $90/$100 (Professional) is monthly. 'Sequences under Professional and Enterprise' comes from reading unlabeled comparison columns.
- Close: each plan shows two prices ($9/$19 Solo, $35/$49 Essentials, $99/$109 Growth) and the page doesn't say which is yearly. The post says so.
- monday CRM: $12/$17/$28 sit next to crossed-out $18/$25/$41 with no billing label. The toggle says yearly saves 33% but the FAQ says 18%. The post gives no savings figure.
- Pipedrive has no native LinkedIn feature: this is inferred because LinkedIn isn't in its homepage's visible text or its plans article. LinkMatch (Logical Pure Minds) is confirmed on its Marketplace listing.
- Omniscient: the site's pricing section doesn't say which plan includes LinkedIn campaigns, so the post doesn't either. One-click 'Connect Pipedrive' needs the Pipedrive OAuth app configured, otherwise the importer asks for an API token.
- Omniscient free teammate seats: the site pricing says teammates who only view or log data are free, but the app (src/lib/plans.ts, NEEDS.freeSeats) gates free seats at Pro. The post follows the site, so confirm which is right.
- Omniscient Starter vs Pro: the site and src/lib/plans.ts put the pipeline board and field filling ('Fields filled with proof', NEEDS.fields) on Pro. The post now says the board and Otto's field rules come with Pro. The tools table still pairs 'A CRM that fills itself in' with the $19 Starter price, so confirm that wording is acceptable.

## folk-crm-alternatives (2936 words, 4 visuals)

- Pipedrive: the pricing page still returns 403, so its plan prices, whether it has a free plan and where email sequences start stay marked check. The plan names (Lite, Growth, Premium, Ultimate) come from Pipedrive's pricing help article dated Sep 3, 2026.
- HubSpot: the pricing page shows $7 and $20 for Starter, and $90 and $100 for Professional, without saying which is yearly. The post now says 'starts at' and dropped the unconfirmed 'yearly commitment'. HubSpot's knowledge base confirms that sequences start on Professional, at 500 emails a day per seat.
- Attio: the Pro card names 'Call Intelligence & sequences', but the comparison table's checkmarks didn't load. It isn't confirmed that Plus has no sequences.
- Nimble: email sequences are listed among Nimble's features, but the pricing page doesn't say whether the one plan includes them.
- Copper: the pricing page doesn't say which plans include Gmail and Calendar sync. 'Start free, no credit card' gives no trial length.
- folk: the post says we didn't find automated LinkedIn invitations or LinkedIn sequence steps. That is an absence claim. We checked the pricing page, the folkX page and the help articles on sequences and message templates.
- folk: the pricing page doesn't explain whether 'Interactions sharing: last 30' is per contact or per workspace, or what kind of account 'Accounts sync 1/member' means.
- folk export: the post says 'a few fields stay behind'. The help article lists contact custom field, strongest connection and people in the company view, and it is dated only 'updated over a week ago'.
- Omniscient: the homepage says teammates who view or log data are free. docs/pricing.md and plans.ts (NEEDS.freeSeats = pro) say Free seats need a Pro or Business seat.
- Omniscient: the homepage pricing doesn't say which plan includes LinkedIn campaigns. The post, the FAQ and the seat chart use Starter at $19 as the starting seat price.
- Omniscient import shot: the names, rows and the 312 count are sample data in a mock of the real ImportDialog. The Company to Skip and Job title to Title matches are drawn as if the user picked them.
- Omniscient import shot: in the app's ImportDialog, guess() matches a 'Company' header to Name on a people import, so the shot's Company to Skip is something the user would change by hand. The shot also leaves out the dialog's last line, 'Need another field? Add it from any record page with Add field, then import again.'
- Salesflare: the pricing page doesn't say whether LinkedIn messages sync into the CRM. The post tells readers to test it.

## salesforce-alternatives-for-startups (2996 words, 4 visuals)

- Pipedrive: plan prices (Lite, Growth, Premium, Ultimate) and whether there's a free plan. pipedrive.com/en/pricing still returns 403 to our reader, so the tools block and the table say "check". The 14 day trial with no card and Nova on every plan are confirmed on Pipedrive's homepage.
- HubSpot: free trial length. Sales Hub's pricing page doesn't state one, so the table says "check".
- HubSpot for Startups: the funding tier lists 90%, 50% and 25% off over three years, but the FAQ says the discount lasts "typically two years". The post tells readers to confirm the third year.
- Salesforce Launchpad: the startups page says it adds "exclusive discounts and implementation support" for venture backed startups but gives no amount. The post gives no figure.
- Zoho CRM: the per user prices (Standard $14 yearly or $20 monthly, Professional $23 or $35) come from Zoho's pricing data file (crm-pricing-val.json), not the page text. The trial length isn't stated.
- Close: the pricing page doesn't say which of each plan's two prices is yearly and which is monthly, so the post shows both.
- Twenty: monthly prices aren't listed. Only $9 for Pro and $39 for Organization, billed yearly, are confirmed.
- Attio: the pricing text runs the figures together, and we read them as Plus $44 monthly or $35 yearly and Pro $99 or $79. The 14 day Pro trial is in the FAQ. "No credit card" comes only from the page header, so the table no longer says "no card".

## attio-vs-hubspot (2500 words, 4 visuals)

- HubSpot shows Sales Hub Starter at $7 a seat billed yearly and $10 monthly for new customers, against a listed $20. HubSpot doesn't say how long the discount lasts. Its CRM pricing page only says 'Select offers available for a limited time'.
- Attio's extra workspace credits are written as '$70 billed yearly, or $85 monthly'. The page shows both prices without labelling them. We matched them to billing periods by the Monthly/Annual toggle order, which follows the same pattern as its seat prices ($44/$35).
- HubSpot custom objects on Enterprise come from hubspot.com/products/crm (Smart CRM Enterprise). The Sales Hub pricing page doesn't say whether Sales Hub Enterprise alone includes them.
- Attio's Chrome extension saving LinkedIn profiles as records rests only on a 2023 changelog entry. Its current help page doesn't mention LinkedIn, and the post now says so.
- Attio's help page says credits renew monthly, but neither it nor the pricing page says whether unused credits carry over. The post says rollover isn't stated.
- HubSpot Notetaker on Starter: the Sales Hub pricing table and the Notetaker product page list Starter, but the 'Notetaker best practices' help page (updated October 1, 2026) lists only Professional and Enterprise.

## omniscient-vs-hubspot (2492 words, 4 visuals)

- HubSpot Starter price: the pricing page card shows both 'Starts at $7/mo/seat' and '$20/mo/seat' under '*Discounts available for new customers only', with no monthly or yearly labels. HubSpot's own pricing guide (updated 09/09/26) says $9 a year or $15 a month, which conflicts. The post says 'from $7 per seat a month (check)' and tells readers to confirm their price with HubSpot.
- HubSpot trial: no Sales Hub trial appears on the pricing page. Third-party sites mention 14-day trials, mostly for Marketing Hub Professional. The post only says 'None shown on the pricing page'.
- Omniscient LinkedIn outreach: no plan in the pricing section lists Scout, Campaigns or the Inbox, and Scout discovery is turned on per workspace (sales_settings.discovery defaults to false). Confirm that trial workspaces get it, since the post describes Scout and campaigns.
- Omniscient migration: the site says 'we migrate ... for you' but gives no price, so the post lists the onboarding fee as 'No fee listed'.
- Omniscient call recording add-on: the site says '$25 per seat' without saying whether that is per month. The post repeats the site's wording.
- LinkedIn Sales Navigator Advanced Plus price: not stated in the post. The post only calls it a separate subscription.
