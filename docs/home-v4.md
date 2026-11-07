# Home page v4

The home page laid out section for section like chatwoot.com, in the current site style (`assets/base.css`,
`assets/home.css`). Only the structure is copied. All words, screens and logos are Omniscient's own.

## Rules for this page
- Keep the current look: square frames, pastel bands, HTML copies of real app screens, mono section labels.
- No claim the product can't back. A slot with no real content yet (customer logos, quotes, star counts, badges)
  stays hidden until it has real content. Each one is marked **hold** below.
- The owl is called Omniscient on the site.

## Nav
Same row as Chatwoot: logo on the left, then three menus and two links, then three actions on the right.

| Slot | Omniscient |
|---|---|
| Product menu | CRM, Scout, Contracts, Automation, Chrome extension |
| Solutions menu | Founder-led sales, Sales teams, Agencies, Account management |
| Resources menu | Blog, Help, API docs, Changelog |
| Link 1 | Pricing (new page `/pricing/`) |
| Link 2 | Security (`/#security`) |
| Right side | Sign in (text), Book a demo (outline button), Start free (dark button) |
| Phone | Open menu toggle |

Menus open on hover and click, one panel under the nav, each row an icon, a name and one short line.

## 1. Hero
- Eyebrow tag linking to Scout: "New: Scout finds leads that fit".
- H1: "The CRM and contracts for every deal."
- One line under it: what Omniscient does, in about 20 words.
- Buttons: "Start free" (dark) and "Book a demo" (outline).
- Proof row: two small marks side by side. **Hold** until real (for example a G2 rating or a team count). Until
  then the row shows the Gmail, Outlook and Chrome Web Store logos with "Works with".
- Product tabs, four, each swapping one big screen: **Opportunities**, **Ask**, **People**, **Contracts**.

## 2. Logo strip
- Label above: "Trusted by N teams" with customer logos. **Hold.**
- Until then: "Works with" and the tool logos already in `assets/logos/` (Gmail, Outlook, Google Calendar, Zoom,
  Slack, HubSpot, Salesforce, Attio, Pipedrive, PandaDoc). One row, grayscale, color on hover.

## 3. The AI section (Chatwoot's Captain)
- Eyebrow tag: "AI".
- H2: "Omniscient reads every deal so you don't have to."
- One line under it.
- Numbered list, four items, each an H3 and one line, with a chat screen beside it:
  - 01 Learns from your emails, meetings and notes
  - 02 Writes a brief on every deal
  - 03 Answers questions about any account, with sources
  - 04 Flags emails that need a reply
- Bento, four cards linking to product pages:
  - "Deals that need attention": four status tags (Needs reply, At risk, Next step set, Won).
  - "Ask anything about an account": a question and an answer with source chips (an email, a call note).
  - "Call notes after every meeting": a meeting tile with its notes.
  - "Set a workflow, it runs on its own": three steps (Form filled, Add to CRM, Alert in Slack).

## 4. Every conversation (Chatwoot's Omnichannel)
- Eyebrow tag: "Inbox".
- H2: "Every conversation in one record."
- One line under it.
- Channel icons: Gmail, Outlook, Google Meet, Zoom.
- Numbered list, four items, each an H3 and a link:
  - 01 Email synced and threaded. Link: "See email sync"
  - 02 Meetings with call notes. Link: "See meetings"
  - 03 LinkedIn profiles saved in one click. Link: "Get the Chrome extension"
  - 04 An open API for everything else. Link: "Read the API docs"
- Partner badge slot (for example Google or Microsoft app verification). **Hold** until confirmed.
- Screen: one person's record with an email thread, a meeting tile and a saved LinkedIn profile flowing in.

## 5. Scout, marked New (Chatwoot's Voice)
- Eyebrow tag: "Scout" with a "New" tag.
- H2: "Find the leads that fit."
- One line under it.
- Two feature cards: "Lead lists from one sentence" and "Job changes and lookalike companies".
- Screen: two panels, a lead list (the plan as one sentence, fit bars, Signal column) and a lead's side panel.
- Quote from a customer with photo, name, title and company. **Hold.**

## 6. Contracts (Chatwoot's Help Center)
- Eyebrow tag: "Contracts".
- H2: "Contracts signed and renewed."
- One line under it.
- Numbered list, four items:
  - 01 Upload PDF or Word, or import from PandaDoc
  - 02 Send for signature on your own brand
  - 03 Key terms pulled out, each with its quote and page
  - 04 Renewal and notice dates on the calendar
- Screen: a contracts list on the left, one contract's record on the right with signers, versions and the facts
  panel. Copy must not say Omniscient writes contract text.

## 7. Solutions (Chatwoot's industries)
- Eyebrow: "Solutions".
- H2: "Built for how your team sells."
- One line under it.
- Four numbered tabs with an "All solutions" link: 01 Founder-led sales, 02 Sales teams, 03 Agencies,
  04 Account management.
- Each tab panel: a small label ("01 / Founder-led sales"), an H3, three bullets, two buttons ("Book a demo",
  "Learn more"), and one screen for that team.
- Panels to write: all four. Each one plays its screen once when picked.

## 8. Customer stories
- Eyebrow link: "Customer stories".
- H2: "What our customers say".
- One line and a button: "Read the stories".
- Three quote cards with logo, quote, name and title. **Hold** the whole section until three real quotes exist.

## 9. Security (Chatwoot's Open source)
- Eyebrow tag: "Security".
- H2: "Your data stays yours."
- One line under it.
- Buttons: "Read our security page" and "Data processing addendum".
- Two stats slot. **Hold** unless the numbers are real (for example uptime from the status page).
- Badges: only ones Omniscient holds today. **Hold** SOC 2 and others until they are real.
- Screen: a data controls card (where data lives, who can see it, delete everything) and a three-item list:
  encrypted at rest, row-level access, no training on your data (check each against the app before launch).

## Footer
- Left: logo, a one-line tagline, social icons (LinkedIn, X, YouTube).
- Three columns:
  - Product: CRM, Scout, Contracts, Automation, Chrome extension, Integrations, Changelog.
  - Company: About, Careers, Blog, Contact.
  - Resources: Help, API docs, Security, Status.
- Badge row: Backed by, Partners, Compliance. Each **hold** until real.
- Legal row: "© 2026 Omniscient", Privacy, Security, Terms, and a language picker (English only for now).

## What moves off the home page
Chatwoot's home has no pricing, FAQ or closing band. To match it exactly:
- Pricing and Questions move to a new `/pricing/` page. The nav's Pricing link points there.
- The closing trial band is removed. The hero carries the trial button.
- "Replace four tools with one" is removed. Its point moves into the hero line.

## Files
- `index.html`: the nine sections above.
- `partials/header.html`: three menus with panels. `partials/footer.html`: the new footer.
- `assets/home.css` and `assets/home.js`: hero tabs, bento, solution tabs, menu panels. Screens play once when
  in view. With reduced motion, nothing moves.
- `pricing/index.html`: pricing and questions, moved from the home page.
- `sitemap.xml`: add `/pricing/`.

## Build order
1. Nav and footer.
2. Hero with the four tabs, and the logo strip.
3. Sections 3 to 6 (one screen each).
4. Solutions tabs.
5. Security, and the move of pricing and questions.
6. Customer stories when the quotes are in.

## Running cost
$0 a month at Beta (50 reps) and Growth (500 reps): static pages on the same Fly hosting, with Google Fonts.
