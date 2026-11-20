# Blog title guide

Titles follow the formulas folk.app uses across its 1,409 articles. Use the formula for the post's job, then check the rules at the bottom. Voice rules (blog-voice) still apply: no em dashes, no exclamation marks, no hype words.

## The year

From October 1, titles use the next year. Every post published from November 2026 says **2027**. Put the year in parentheses at the end, or after "in".

## Formulas by post type

### Alternatives (`type: alternatives`)
- `{N} Best {X} Alternatives in 2027` (default)
- `Top {N} {X} Alternatives (2027)`
- `{X} Alternatives: {N} Best CRM Options (2027)`
- `{N} Best Alternatives to {X} (2027)`

### Review (`type: review`)
- `{X} Review (2027): Is It a Good CRM?` (default)
- `{X} CRM: Full Review (2027)`
- `{X} Review: Features, Pricing, Alternatives (2027)`

### Pricing (`type: pricing`)
- `{X} Pricing: Plans and Costs Explained (2027)` (default)
- `What Is {X} Pricing in 2027?`

### Omniscient vs a rival (`type: versus`)
- `Omniscient vs {X}: Which CRM Is Best for You? (2027)` (default)
- `Omniscient vs {X}: Which AI CRM Wins? (2027)` (for AI CRMs)

### Rival vs rival (`type: versus`)
- `{A} vs {B}: Which CRM Is the Best? (2027)` (default)
- `{A} vs {B}: Which CRM for Startups Wins?` (when the reader is a startup)

### Best CRM for a tool (`type: best-of`)
- `{N} Best CRMs for {Tool} Users (2027)` (default)
- `{N} Best CRMs for {Tool} (2027)`

### Best CRM for a team or business (`type: best-of`)
- `{N} Best CRMs for {Segment} in 2027` (default)
- `{N} Best AI CRMs for {Segment} (2027)`

### Best tools list (`type: best-of`)
- `{N} Best {Category} in 2027` (default)
- `Best {Category} Platforms in 2027`

### Definition (`type: how-to`)
- `What Is {Topic}? Definition, Examples and Best Tools` (default)
- `{Topic}: Definition and Best Tools (2027)`
- `{Topic} 101: Everything You Need to Know`

### How-to (`type: how-to`)
- `How to {Do the Job}? Step-by-Step Guide (2027)` (default)
- `How to {Do the Job} in {N} Easy Steps`

### Guide (`type: how-to`)
- `{Topic}: The Complete Guide (2027)` (default)
- `{Topic}: A Practical Guide (2027)`
- `{N} {Things}: Examples and Templates (2027)` (for question lists and templates)

### MCP and assistant setup (`type: how-to`)
- `{X} MCP: Features, Setup and Best Alternatives` (default)
- `How to Connect {Assistant} to Your CRM? (2027)`

### Migration (`type: how-to`)
- `{X} Migration Guide: How to Move Your CRM (2027)` (default)
- `How to Migrate From {X}? Step-by-Step (2027)`

## Rules

1. **The keyword comes first.** Start with the number or the search phrase. "Attio Review" beats "Our Honest Take on Attio".
2. **{N} is the real count.** The number in the title must match the numbered `###` tools in the post. Count them before you publish. Odd, specific numbers (7, 9, 11, 13) are the norm.
3. **Under 65 characters.** Count them. Cut the part after the colon first.
4. **Title Case.** Capitalize main words. Keep brand spelling as the brand writes it: folk, monday CRM, HubSpot, Day AI.
5. **Questions end with "?"**. "What Is", "How to" and "Is It" titles take a question mark.
6. **The H1 matches the title.** The `#` line in the body is the same text as `title:` in the frontmatter.
7. **The slug never has the year.** `attio-review`, never `attio-review-2027`. The title can change each year without breaking links.
8. **One title per keyword.** Check `docs/blog-queue.csv` and `blog/_src/` before you write, so two posts never target the same search.

## Post shapes for types without a skill

List posts (alternatives, best-of) follow the blog-alternatives-post skill. Versus posts follow `blog/_src/omniscient-vs-attio.md`. For the rest:

### Review (1,800 to 2,500 words)
1. Intro: what {X} is in one friendly sentence, who uses it, and who we are.
2. Short answer: "Is {X} a good CRM?" in two or three sentences, by who it fits.
3. `tools` block with {X} and Omniscient.
4. `## What {X} is best at`, then `## {X} key features` (4 to 6 `###` features, facts only).
5. `## {X} pricing` with a chart of plans.
6. `## Who {X} is for`, then `## When teams look beyond {X}` (goals, kindly framed) with a short pick list that starts with Omniscient.
7. Closing line, `cta`, `faq` (4 or 5 questions people search, like "Is {X} free?").

### Pricing (1,500 to 2,500 words)
1. Intro and a one-line answer: the starting price and the plan most teams pick.
2. `tools` block with {X} and Omniscient.
3. `## {X} plans at a glance` (table and chart), then one `##` per plan.
4. `## What costs extra` (add-ons, AI credits, seats), `## How to pay less` (yearly billing, startup programs).
5. `## {X} pricing vs other CRMs` (chart with Omniscient and 3 to 5 others).
6. Closing line, `cta`, `faq`.

### How-to, definition and guide (1,500 to 2,500 words)
1. Answer the question in the first two sentences.
2. One `##` per step or idea, with a `steps` block for any process.
3. One section shows the job done in Omniscient with a `.shot.html` product shot and a link to the matching product page.
4. Closing line, `cta`, `faq`.
