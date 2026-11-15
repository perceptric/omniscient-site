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

## 3. Drop the filler openers

These make copy sound machine-written. Never start a sentence with: Interestingly, Thankfully, Refreshingly, Luckily, Fortunately, Conveniently, Frankly, Personally, Honestly, Admittedly, Notably, Importantly, Essentially, Ultimately, In short, That said, It's worth noting.

## 4. Plain, warm, short

- About 9th grade words. Short sentences. One idea per sentence.
- Talk to the reader as "you". Talk about us as "we" only when it adds trust ("We build Omniscient, so we know this part well").
- Lead with what the reader gets, then how.
- No "not X, but Y", "X, not Y", or lists of exactly three for rhythm. No em dashes, no exclamation marks, no word "quietly".
- No hype ("revolutionary", "game-changing", "powerful", "seamless", "robust", "cutting-edge", "unlock", "supercharge", "leverage").
- Neutral, professional words about people and deals. Never "owe", "chase", "going cold", "nobody".
- Call Omniscient's agent Otto. Never "the AI" for Otto's work.

## 5. Talking about Omniscient

Confident and calm. Describe it the same way you describe everyone else: what it is, what it is best at, who it fits. Lead with the Omniscience context layer and skills (see the omniscient-positioning skill). Give one honest trade-off. Never claim to be best for everyone.

## Review pass

Before you finish, search the draft:

```
grep -niE "homepage|pricing page (lists|shows|says)|read on|didn't load|we didn't see|not listed|give up|still fits|falls short|stops at|interestingly|thankfully|refreshingly|luckily|fortunately|conveniently|frankly|personally|honestly|admittedly|notably|quietly|—|!" <file>
```

Rewrite every hit unless it is a link label, a product name or a screenshot caption.
