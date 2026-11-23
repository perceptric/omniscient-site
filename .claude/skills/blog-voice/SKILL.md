---
name: blog-voice
description: The voice for every Omniscient blog post, product page and email. Use it when you write or edit any copy for tryomniscient.com, before you write the first sentence, and again when you review a draft.
---

# Omniscient blog voice

Write like a person who knows the CRM market well and is helping a friend choose. You know these products. You are not reading their websites out loud.

## 1. Speak from knowledge, never from a crawl

The reader should never picture a bot visiting pages and reporting back. State what a product is and does, the way an expert would say it in conversation. Put the source in a link on the fact itself.

Never write:
- "Its homepage now opens with ...", "Its site calls it ...", "The homepage says ...", "Its headline reads ..."
- "Its pricing page lists these today:", "The pricing page shows ...", "according to its pricing page"
- "read on November 3", "didn't load for us", "we didn't see", "we couldn't confirm", "the page doesn't say", "not listed"
- Quoting a vendor's tagline in quote marks to describe it

Write instead:

| Crawl voice | Expert voice |
|---|---|
| Its homepage now opens with "Welcome to agentic revenue," and it describes agents that route new leads. | Attio has moved toward agents: they route new leads and flag renewals early. |
| Its [pricing page](url) lists these today: | Here is how Attio's plans work: |
| Its site calls it "the #1 Open Source CRM on GitHub." | Twenty is one of the most popular open source CRMs. |
| Its pricing page didn't load for us on November 3, so check today's plans there. | See [Pipedrive's plans](url) for current prices. |
| We didn't see a free trial on its pricing page. | (Leave it out. Say what is offered.) |

Dates of research and unconfirmed details belong in `docs/blog-checks.md`, never in the post. Keep one dated line per post at most: "Prices are from each vendor's site in November 2026."

## 2. Frame everything positively

Describe what each product is great at and who it is for. Reasons to switch are about what the reader wants next, never about what is wrong with the product they use.

Never write:
- "what you'd give up", "still fits plenty of teams", "falls short", "lacks", "limited to", "only", "stops at", "hard to replace", "the catch", "watch out", "beware"
- "Why teams leave X", "X's limits", "Cons" headings that read as a takedown
- Sentences about another product that start with "But" or "However"

Write instead:

| Negative | Positive |
|---|---|
| Attio still fits plenty of teams, so it helps to know what you'd give up. | Attio is a great fit for teams that like to design their own CRM. Here is where it shines. |
| Why teams look for an Attio alternative | When teams look beyond Attio |
| Free stops at 3 seats and Plus at 10. | Free covers up to 3 seats, and Plus up to 10. |
| Sequences send email only. | Sequences are built for email. |
| Watch the step from Starter to Pro. | Teams that grow past 3 seats move to Pro. |

A plain trade-off is fine when the reader needs it to choose ("Close is the better pick for teams that sell by phone, since Omniscient has no dialer"). Say it once, kindly, and move on.

### List posts: the Listicle guideline wins

In "X alternatives" and "best X" posts, the Listicle Content Structure Guideline (blog-alternatives-post and blog-tool-review skills) overrides this section where they differ:
- Every competitor entry has a **Cons** list of 3 short, fair, true limits, and at least 2 name a gap Omniscient fills. Words like "no", "limited" and "only" are fine inside a con. Keep the overview and pros warm and specific.
- Omniscient's entry has 1 or 2 cons, written as scope.
- The list H2 ends with "!" ("## 13 Best Attio Alternatives in 2027!"). No other exclamation marks.
- Emoji: ⭐ in ratings, ✅ for the definition's feature bullets, 👉 before the CTA link, one at the end of the intro. No others.
- Tables: the recap table only.

## 3. Drop the filler openers

These make copy sound machine-written. Never start a sentence with: Interestingly, Thankfully, Refreshingly, Luckily, Fortunately, Conveniently, Frankly, Personally, Honestly, Admittedly, Notably, Importantly, Essentially, Ultimately, In short, That said, It's worth noting.

## 4. Plain, warm, short

- About 9th grade words. Short sentences. One idea per sentence.
- Talk to the reader as "you". "We'd" is fine for advice ("Close is the one we'd pick for a phone team"). Never talk about us as the makers of Omniscient (section 6).
- Lead with what the reader gets, then how.
- No "not X, but Y", "X, not Y", or lists of exactly three for rhythm. No em dashes, no exclamation marks, no word "quietly".
- No hype ("revolutionary", "game-changing", "powerful", "seamless", "robust", "cutting-edge", "unlock", "supercharge", "leverage").
- Neutral, professional words about people and deals. Never "owe", "chase", "going cold", "nobody". Never "rival" or "rivals": name the product, or say "other CRMs".
- Call Omniscient's agent Otto. Never "the AI" for Otto's work.

## 5. Talking about Omniscient

Confident and calm. Describe it the same way you describe everyone else: what it is, what it is best at, who it fits. Lead with the Omniscience context layer and skills (see the omniscient-positioning skill). Give one honest trade-off. Never claim to be best for everyone.

## 6. The post is a guide, never a vendor speaking

The reader came to answer a question, like "is Attio any good?" The page wins when it answers that question better than anyone else, and Omniscient shows up as a strong option the reader can judge for themselves. A line about who wrote the post pulls the reader away from their question, tells them to discount everything after it, and makes the page read like an ad.

So:
- Never say we build, built, wrote or make Omniscient, or any part of it (importers, sync, forms).
- No disclosure lines: "read this knowing which side we sit on", "Omniscient is our product, so weigh what follows", "full disclosure".
- No builder stories: "when we built X, we had to decide", "the hardest call we made", "what we learned building", "we chose to".
- Describe Omniscient in the third person, exactly like every other tool: "Omniscient leaves the field empty when the site doesn't say."
- Earn trust with specific, correct, fair facts about every tool.

## Review pass

Before you finish, search the draft:

```
grep -niE "homepage|pricing page (lists|shows|says)|read on|didn't load|we didn't see|not listed|give up|still fits|falls short|stops at|interestingly|thankfully|refreshingly|luckily|fortunately|conveniently|frankly|personally|honestly|admittedly|notably|quietly|rivals\?|we build|we built|we wrote|we made|we chose|our own|our importer|our team|which side we sit|our product|—|!" <file>
```

Rewrite every hit unless it is a link label, a product name or a screenshot caption.
