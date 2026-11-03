# Blog: facts to confirm before publishing

Each post marks a price or claim "check" when it couldn't be confirmed on the vendor's own site, or when the vendor's pages disagree. The posts link every price to the vendor's pricing page. Hidden from visitors (docs/ is blocked in .htaccess).

## Omniscient (applies to every post)

- Contract Management: contracts come only from files people upload (PDF or Word). Omniscient never drafts or writes contracts and has no contract templates. Posts describe uploads and versions, teammate approval, signing on the page, Otto reading signed contracts for a person to confirm, and renewal alerts at 90, 60 and 30 days, as the app does (098).
- Posts quote the Starter price, $19 per seat a month billed yearly, from the home page pricing section.
- The free trial: posts say 14 days, no card, from the home page.

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
- These sibling posts aren't written yet: /blog/attio-vs-hubspot/, /blog/crm-with-automatic-data-entry/, /blog/best-crm-for-startups/. They are the only broken internal links. Every /product/ link works.
- Builder/shared CSS: at 1280px the tools table scrolls sideways by 2px, because its min-width is 720px and its framed box is only 718px inside (blog.css). Not fixed here.

## omniscient-vs-attio (2500 words, 4 visuals)

- The pricing section doesn't say which Omniscient plan includes custom objects (it lists 'Custom fields and saved views' on Pro). The app doesn't gate custom objects by plan in code.
- Omniscient Free seats: docs/pricing.md says a workspace needs a Pro or Business seat before it can add Free seats. index.html doesn't say this, so the post says only 'teammates who only view or log data'.
- Teams transcripts on Starter: the site FAQ and callSync.ts include Teams, but docs/pricing.md lists only Meet and Zoom for Starter.
- Ask Omniscient 'in the seat price': the site says AI is included, but ask.ts has a per-day cap (ASK_PER_DAY, default 50) and docs/pricing.md lists monthly smart-answer pools. The post doesn't claim unlimited answers.
- Attio iOS and Android apps are confirmed only by the footer links on attio.com/pricing, with no plan restriction stated.
- pacing-day.svg: in the browser pass the axis labels went from 15 to 16px and Lunch from 14 to 15px. Wednesday's lunch box is now 43 minutes instead of 40 (13:08, still within the 30 to 60 minute range), and the black marks no longer touch the green profile-view and invitation marks or the lunch boxes. All 720px blog SVGs, on every post, still shrink to about 0.44x on a 375px phone (text about 7px).
- Site build, not fixed: html scroll-padding-top (80px) plus the h2 scroll-margin-top (88px) put a heading 168px down after a contents click, and blog.js marks the active section at 120px, so the contents highlight the previous section.
- Site build, not fixed: '.bl-tools table {min-width:720px}' in a 720px frame with 1px borders scrolls 2px sideways on desktop. 'Keep reading. More on CRM.' shows two LinkedIn posts. The build's word count includes the CSS inside a shot's <style> block.

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
- Omniscient migration: the site says 'we migrate ... for you' but gives no price, so the post lists the onboarding fee as 'No fee listed'.
- Omniscient call recording add-on: the site says '$25 per seat' without saying whether that is per month. The post repeats the site's wording.
- LinkedIn Sales Navigator Advanced Plus price: not stated in the post. The post only calls it a separate subscription.
