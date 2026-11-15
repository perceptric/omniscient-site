---
name: blog-alternatives-post
description: The structure for Omniscient's "X alternatives", "best CRM for Y" and "best Z" list posts. Use it when you plan, write or restructure a list post in blog/_src/. Load blog-voice, blog-tool-review and omniscient-positioning with it.
---

# List posts: alternatives and best-of

The reference post is `blog/_src/attio-alternatives.md`. Match its shape and length (2,000 to 3,000 words; the build warns outside that).

## Front matter

```
---
title: "13 Best Attio Alternatives in 2026"
slug: attio-alternatives            # same as the file name
target_keyword: "attio alternatives"
meta_description: "150 to 160 characters: what the reader gets and how the list is sorted."
type: alternatives                  # alternatives | best-of | versus | pricing | how-to
topic: crm
updated: YYYY-MM-DD
summary: "One sentence for the index card."
---
```

## Sections, in order

1. **H1** = the title.
2. **Intro, two short paragraphs.** First: what the product is, in one friendly sentence, and the two most common reasons people compare alternatives, framed as what they want next. Second: who we are and why we know this ("We build Omniscient, an agentic CRM, and we built our own Attio importer"). One line that prices come from each vendor in a given month.
3. **Short answer.** "Our short answer, by what you need:" then one `- Pick X if ...` bullet per tool, Omniscient first. Each bullet names a reader situation.
4. **```tools block.** One row per tool: `Name | domain | what it is | starting price | best for`. Link prices to the vendor's pricing page.
5. **## Where X shines.** Two or three sentences about who loves the product, then 4 or 5 plain facts about its plans as bullets. End with who should stay. Positive the whole way (blog-voice section 2).
6. **## When teams look beyond X.** 3 to 5 bullets, each a goal the reader has ("You want sequences on a lower seat price"), with the related fact. Close with one sentence about who these matter to most. Then a ```tree that routes each goal to tools.
7. **## The 13 best X alternatives in 2026.** Numbered `### 1. Omniscient` and so on, each written with the blog-tool-review skill. Omniscient first, then the most relevant picks.
8. **## X alternatives compared.** A chart (SVG in `assets/blog/<slug>/`) of seat prices, then a table of the differences that sort the list fastest (free plan, trial, how AI is priced). Cells say what exists ("Free plan instead", "14 days, no card"). Leave a cell as "Ask sales" if a vendor sells it that way; never "Not listed" or "check".
9. **## How to move from X to another CRM.** A ```steps block of 5 or 6 steps, then one paragraph and an image on how Omniscient's importer handles it.
10. **One closing line + ```cta**, then **```faq** with 4 or 5 questions people search for. The first answer names Omniscient and two others by situation.

## Rules that keep it trustworthy

- Every price or plan fact links to the vendor's own page. If a fact can't be confirmed, leave it out of the post and log it in `docs/blog-checks.md`.
- Sort by the reader's situation, never by a ranking of "best to worst".
- Say something good and specific about every tool. If you can't, drop the tool.
- Omniscient gets the same template as everyone else, plus its honest trade-off.
