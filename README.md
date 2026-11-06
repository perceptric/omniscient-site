# tryomniscient.com

Static site for Omniscient. Plain HTML: no WordPress, no build step.

The app itself lives at app.tryomniscient.com. This repo is only the marketing site: the home page, four product pages (Omniscient CRM, Automation, Deal Room, Contract Management), Privacy and Terms. More pages follow `docs/site-architecture.md`.

## How it's laid out

| Path | What |
|---|---|
| `index.html` | The home page. |
| `privacy/index.html`, `terms/index.html` | Privacy and Terms. One folder per page. The URL is the folder path. |
| `404.html` | Page not found. |
| `partials/head.html` | Icons, fonts and the shared CSS. |
| `partials/header.html`, `partials/footer.html` | The site header and footer. |
| `assets/base.css` | Brand tokens, reset, type, tags, buttons, the header with the Product and Resources menus, the phone menu, footer, reading pages. |
| `assets/home.css`, `assets/home.js` | The home page (`docs/home-v3.md`): hero, three full-screen sections (conversations, proposals, contracts) each with one big product screen, tools it replaces, security, pricing and questions. |
| `product/crm/`, `product/automation/`, `product/deal-room/`, `product/contract-management/` | The four product pages, written by `tools/products/gen.py` (edit the copy there, then run it and `node tools/layout.mjs`). Styles in `assets/product.css`, shots reuse `assets/home.css`. Each feature's shot is a scene that plays what the feature does (see `assets/scenes.js`); `assets/product.js` plays the hero shots once. |
| `assets/img/people/` | Portraits used in the product shots, from Unsplash (free to use, credited in the footer). |
| `assets/site.js` | Opens and closes the menus, the phone menu, the header line on scroll and scroll reveals. |
| `assets/scenes.js`, `assets/scenes.css` | Scenes: small product screens in HTML and CSS that play step by step. A part with `data-at="n"` comes in at step n and one with `data-off="n"` leaves; `data-t` lists the wait before each step. The Product and Resources menus' scenes (written in `partials/header.html`; the product ones are shown again on the product pages' other-product cards) play while the menu is open and loop on the hovered card; product page scenes and the home page's four security scenes play once in view and again on hover or tap. Transform and opacity only; reduced motion shows the last frame. |
| `assets/logos/` | Logos of the tools Omniscient works with. |
| `assets/brand/` | favicon.ico, icon.svg, apple-icon.png, share image, and `omniscient-brand.css` (the brand stylesheet for embeds, emails and decks). |
| `tools/layout.mjs` | Copies the partials into every page, stamps the CSS and JS links and rebuilds `sitemap.xml`. |
| `blog/_src/<slug>.md` | Blog posts in Markdown. `tools/blog.mjs` writes `blog/<slug>/index.html` and `blog/index.html`. A file whose name starts with `_` is a draft (`_sample.md` uses every block). |
| `assets/blog.css`, `assets/blog.js` | Blog posts and the index: contents that follow the reading position, the topic filter, shots that play once. |
| `assets/blog/<slug>/` | A post's pictures and `*.shot.html` snippets, plus the `cover.svg` and `og.png` share image the build writes. |
| `.htaccess` | 404 page, https/www redirects, icon redirects, unknown paths to the app. |

## Editing

- **A page:** edit its `index.html` between `<!-- header:end -->` and `<!-- footer:start -->`.
- **Header, footer, icons or fonts:** edit the file in `partials/`, then run `node tools/layout.mjs`.
- **CSS or JS:** edit the file in `assets/`, then run `node tools/layout.mjs`. It adds `?v=<hash>` to each CSS and JS
  link, so browsers fetch the new file.
- **New page:** copy a page folder, change the content and the tags under `<!-- head:end -->`
  (title, description, canonical, og tags), then run `node tools/layout.mjs`. It adds the page to `sitemap.xml`.
- **Blog post:** write `blog/_src/<slug>.md` and build it. See "Blog" below.
- **Privacy or Terms:** edit the text in `privacy/index.html` or `terms/index.html` and change the
  "Last updated" date. Google's OAuth review reads these pages, so keep the URLs `/privacy` and `/terms`.
- **Footer year:** it is plain text in `partials/footer.html`. Change it each January.
- **Brand:** follow `docs/brand.md` in the app repo: the calm style shared with Claritia. A warm off-white page, white
  cards lifted by soft ring shadows, corners that grow with the size of the thing, Inter for every word, green
  (#0C8C5E) as the one accent and a dark gray primary button. Headings are one tone. Product shots sit on a soft rounded
  field. No gradients. The logo is the O: a ring with a green point.
- **Site plan:** `docs/site-architecture.md` (menus, sitemap, page template, build order). Hidden from visitors.

Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000.
The `.htaccess` rules only run on Hostinger.

Push to `main` and Hostinger deploys it.

## Blog

Posts are Markdown files in `blog/_src/`. `tools/blog.mjs` (Node 22, no npm packages) turns each one into
`blog/<slug>/index.html` with the site's header and footer, and writes `blog/index.html` with every post.

### Add a post

1. Write `blog/_src/<slug>.md`: the frontmatter, then one `#` title line, then the post.
2. Put its pictures in `assets/blog/<slug>/`: SVG charts and diagrams, and `<name>.shot.html` snippets for product
   shots drawn like the ones on the product pages. At least 3 per post. Charts follow the calm style: a white
   ground with no outer frame (the page rounds it and adds the shadow), a small gray Inter label over a one-tone
   title, light #EBEBEB lines, rounded boxes, dark gray (#333333) for marks and bars, and green (#0C8C5E) only for
   Omniscient or the one thing that matters. Shots use `var(--frame)` for lines and `var(--solid)` for dark fills.
3. Run `node tools/blog.mjs <slug>` and fix what it prints. Preview at http://localhost:8000/blog/<slug>/.
4. Run `node tools/blog.mjs --all`, so the index, the related posts on other pages and `sitemap.xml` pick it up.
5. Commit the `.md` file, `blog/<slug>/`, `blog/index.html`, `sitemap.xml` and `assets/blog/<slug>/` (with the
   `cover.svg` and `og.png` the build writes).

Covers are pictures with no words, drawn by `tools/covers.mjs` from the post's type and the tools in its first
```tools block: alternatives circle the tool they replace, a versus post puts two tools face to face, a best-of post
gets a podium and a ranked list. Posts about a topic (limits, pricing, safety, data entry, sync) have their own scene,
listed in `SCENES` there. Logos come from `tools/cover-logos.json`: add a new tool's logo there (or let
`tools/shot-tools.mjs` save it to `assets/blog/logos/`) so it shows on covers.

```
---
title: "Best CRMs for Startups in 2026"
slug: best-crm-for-startups
target_keyword: "best crm for startups"
meta_description: "150 to 160 characters for search results."
type: best-of
topic: crm
updated: 2026-11-03
read_minutes: 9
summary: "One sentence for the index card."
---
```

| Key | What |
|---|---|
| `title` | The page title, the index card and the cover. |
| `slug` | The URL, `/blog/<slug>/`. Keep it the same as the file name. |
| `topic` | `crm`. The tag on the card and the filter on the index. |
| `type` | `best-of`, `alternatives`, `versus`, `pricing` or `how-to`. Sets the length the build checks for. |
| `updated` | YYYY-MM-DD. Shown on the post, orders the index and is the post's date in `sitemap.xml`. |
| `meta_description` | 150 to 160 characters. The search snippet and the share text. |
| `summary` | One sentence for the index card. |
| `target_keyword` | The search phrase the post is written for. |
| `read_minutes` | Shown on the post and the card. Left out, the build counts it from the words. |
| `published` | Optional. The first publish date (defaults to `updated`). |

### Blocks

Plain Markdown works: `##` and `###` headings (they fill the contents list), paragraphs, `-` and `1.` lists,
`**bold**`, `[links](/product/crm/)`, `>` quotes, `|` tables (wide ones scroll inside their frame on a phone),
code and `---`. These fenced blocks render in the brand:

| Block | Write | Renders |
|---|---|---|
| ` ```tools ` | One line per tool: `Name \| domain.com \| what it is \| starting price \| best for`. | A framed comparison table. Each tool gets its logo from `assets/blog/logos/`, else `assets/logos/`, else its site's favicon. |
| ` ```rating ` | One line: `4.8 \| G2 \| https://www.g2.com/products/<tool>/reviews`. Only a rating read on that site. | Right under a numbered tool heading, above its screenshot: five stars filled to the score, "4.8/5" and the source's name, linked in a new tab with `rel="nofollow noopener"`. No JSON-LD, since Google doesn't allow review markup for ratings gathered from other sites. |
| ` ```try ` | One line: `Try Omniscient free \| https://app.tryomniscient.com/?utm_source=blog&utm_medium=<slug>&start=crm`. `start=crm` makes a new workspace start with the CRM (`start=content` or `both` for the others). | A dark gray primary button with the arrow, in the text where you put it (under Omniscient's intro). Links off tryomniscient.com get `rel="nofollow noopener"`. |
| ` ```callout ` | One or two sentences. | A note on a white card with a green dot. |
| ` ```cta ` | One line of text. | That line with the "Start free" button to the app. |
| ` ```faq ` | `Q:` and `A:` lines. A blank line starts a second paragraph in an answer. No heading above it. | A "FAQs" heading (in the contents list), questions that open and close, plus FAQPage JSON-LD. |
| ` ```steps ` | `1. Title: text` lines. | A numbered step list on a white card. |
| ` ```tree ` | A decision tree: `# Title`, then one question, then its branches indented under it as `Label: answer`. An answer ending in `?` is a further question with its own branches; any other answer ends the path with 1 to 4 tools split by commas, plus `\| a short note` if needed. See below. | A tree on the gray band: the question on top, labeled branches joined by lines, and tool cards with each tool's logo, linked to its numbered `###` section. Steps rise in once in view. |

A ` ```tree ` replaces a "reason → tools" picture. Put the most decisive question first, give each question 2 to 4
branches, and end every path in the 1 to 4 tools that truly fit it:

````
```tree
# Where to look first when leaving Dripify
Who are you sending for?
  Client accounts: HeyReach, GetSales, Skylead, Closely
  Your team: What's missing in Dripify?
    Replies on your CRM record: Omniscient
    Calls or X steps: Which one?
      Calls: La Growth Machine, lemlist
      X: Meet Alfred, La Growth Machine
  Just you: Waalaxy, Kanbox, Linked Helper | A smaller bill
```
````

Tool names come from the post's tools block (logo and link to the tool's numbered heading); a longer name like
`Skylead Agency` finds Skylead and keeps its own wording. Write `Attio (attio.com)` for a tool outside the list, such
as the one the post replaces: it gets its logo and no link. On a desktop, a question whose branches fit the reading
column draws them side by side; the rest stack under their question on a rail, as the whole tree does below 784px.
The build warns about a line it can't read, a question without 2 to 4 branches, a path with more than 4 tools and a
tool with no heading to link to. A tree counts as a picture, and its words don't count toward the post's length.

Pictures sit in the gray grain band:

- `![alt](chart.svg "caption")` shows an image. A bare file name looks in `assets/blog/<slug>/`. The caption is
  optional.
- `![alt](name.shot.html)` inlines that HTML snippet, styled by `assets/home.css`, and plays it once in view.
- `![Name homepage](tool:domain.com)` shows that tool's homepage screenshot in a browser frame.

Prices: in the tools block and in any table, a cell that reads `check`, `See pricing` or (in the tools block's price
column) nothing shows "See pricing", linked to `https://<domain>/pricing` for that row's tool (the row's first cell
names a tool from the tools block, or links to its site). When the pricing page lives elsewhere, write
`[See pricing](https://vendor.com/en/pricing)`. Write `Custom` for tools sold only by quote. The word "check" never
reaches the page.

### Tools: numbered headings, screenshots and logos

A numbered `###` heading whose name is in the post's `tools` block (`### 3. HeyReach` or `### 3. HeyReach: for
agencies`) shows the number in a square tag, the tool's logo and the name, with its homepage screenshot right under
it. Capture screenshots and logos first:

```
node tools/shot-tools.mjs heyreach.io expandi.io [--force] [--wait 8000]
```

It opens each homepage at 1440x900 through Playwright, accepts or hides cookie, chat and popup layers, and saves
`assets/blog/tools/<domain>.webp` (1200px wide) and `assets/blog/logos/<domain>.png`. It keeps files that exist
unless `--force`, and prints ok or the reason it failed for each domain. A bot wall or blank page fails: try once
with `--wait 8000`, else leave that tool without a screenshot.

Each numbered tool reads like a review. Under the heading, in this order: the ` ```rating ` block (only when you
read the rating today), a 2 or 3 sentence intro, the ` ```try ` block for Omniscient only, then four `####`
headings:

````
### 3. Salesflare

```rating
4.8 | G2 | https://www.g2.com/products/salesflare/reviews
```

[Salesflare](https://salesflare.com/) is a sales CRM built for small and medium B2B teams that ...

#### Key features

- **Automated data entry:** Captures contact and company details and logs meetings and calls.

#### Pros

- **Low CRM admin:** ...

#### Cons

- **No free plan:** ...

#### Price and plans

You can try Salesflare free for 30 days. Paid plans, billed yearly:

- **Growth:** $29 per user, per month.
````

Inside a numbered tool, `####` headings are plain 16px semibold, their lists sit tight, and the lists under Pros
and Cons get a small rounded + (green) or − (gray) in place of the bullet. Their ids start with the tool's
(`#3-salesflare-pros`). On a desktop, the contents list shows a list's 3 to 15 numbered tools under its `##`
while you read that section; the phone contents keep the `##` headings only.

Every image needs alt text, and every SVG a `<title>`.

### Build

| Command | What it does |
|---|---|
| `node tools/blog.mjs <slug> [<slug> ...]` | Builds those posts and their covers. Touches nothing else. |
| `node tools/blog.mjs --all` | Builds every post and `blog/index.html`, then runs `tools/layout.mjs` (header, footer, `sitemap.xml`). |
| `node tools/blog.mjs --index` | Rebuilds `blog/index.html` only. |

- **What the build checks:** missing pictures or alt text, links to pages that don't exist here (the server would
  send them to the app), links to posts with no source yet, length outside the type's range, the
  `meta_description` length, fewer than 3 pictures, prices left as `check` or empty, a `rating` or `try` line it
  can't read, a rating away from its tool heading, em dashes, exclamation marks and banned words. It prints each one under the post. A post it can't read is skipped, and the rest still build.
- **Share images:** `og.png` (1200x630) needs Playwright. Without it, posts use the site's default share image.
- **Drafts:** a file whose name starts with `_` builds only when named, with `noindex`, and never shows in the index,
  related posts or the sitemap. `_sample.md` uses most blocks: build it with `node tools/blog.mjs _sample` to check
  the layout after changing the builder or `assets/blog.css`, then delete `blog/_sample/` and the `cover.svg` and
  `og.png` it writes. To check `rating`, `try` and a tool's `####` sections, add a numbered tool with them to a
  copy named `_something.md`, build it the same way and delete the copy and its output after.
- **Not served:** `.htaccess` answers 403 for any path with a part that starts with `_` (so `blog/_src/`) and for
  `*.shot.html`, since Hostinger deploys the whole repo.
- **Removing a post:** delete its `.md`, `blog/<slug>/` and `assets/blog/<slug>/`, add its path to the "Removed pages" redirect in `.htaccess` (else the server sends it to the app), then run `--all`.

## Where the words come from

The site was ported from the Next.js marketing pages in the app repo. Keep them in step when either side changes.

| Here | In the app repo |
| --- | --- |
| `index.html` | Written here first (October 2026). The app's `src/app/page.tsx` still has the old home page. |
| `partials/header.html`, `partials/footer.html` | Written here first. The menus follow `docs/site-architecture.md`. |
| `privacy/index.html`, `terms/index.html` | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |
| Company name, email, "Last updated" date | `src/lib/legal.ts` |
| Plan prices and features in `index.html` | `src/lib/plans.ts` (yearly prices) and `docs/pricing.md` |
| Tokens at the top of `assets/base.css`, the icons in `assets/brand/` | `src/app/globals.css`, `src/app/icon.svg` and `docs/brand.md` |

## Paths that go to the app

Like the app's `src/proxy.ts`, any path with no page here goes to the same path on the app. `/today` goes to
`https://app.tryomniscient.com/today`, and the query string comes along. Real files and folders are served here.
A missing file (a path that ends in `.png`, `.js` and so on) gets `404.html`.

## Hostinger setup

1. **Add the site.** In hPanel, go to Websites → Add website, and add `tryomniscient.com` as an empty site.
   Do not install WordPress. If WordPress is already there, remove it first, so `public_html` is empty.
2. **Connect Git.** In hPanel, open the site, then Advanced → Git. Add this repo, branch `main`, and leave the
   install path empty, so it deploys to the domain's `public_html`. The folder must be empty the first time.
   For a private repo, copy the SSH key hPanel shows into the repo's deploy keys on GitHub. Turn on auto-deploy and
   add the webhook URL hPanel gives you to the repo's webhooks, so every push to `main` goes live.
3. **Turn on SSL.** In hPanel → Security → SSL, make sure the certificate covers `tryomniscient.com` and `www`.
4. **Check it.**
   - `curl -I https://tryomniscient.com/` shows `200`.
   - `/privacy` and `/terms` answer `301` to `/privacy/` and `/terms/`, which show `200`.
   - `curl -I https://www.tryomniscient.com/` and `curl -I http://tryomniscient.com/` answer `301` to `https://tryomniscient.com/`.
   - `curl -I https://tryomniscient.com/today` answers `301` to `https://app.tryomniscient.com/today`.
   - `curl -I https://tryomniscient.com/missing.png` shows `404`.

If LiteSpeed Cache is on for the site, purge it after a deploy.

## DNS

- `tryomniscient.com` and `www.tryomniscient.com` point to Hostinger. Use the A record (and the `www` CNAME) that
  hPanel shows for the site. `.htaccess` sends `www` to the bare domain.
- `app.tryomniscient.com` is a CNAME to `omniscient-web.fly.dev` (the app on Fly.io). Run
  `fly certs add app.tryomniscient.com --app omniscient-web` and add any record it asks for. Do not point it at Hostinger.
- Keep every email record as it is: MX, SPF (TXT), DMARC, and the Resend records (the `resend._domainkey` DKIM record
  and the `send` subdomain's MX and TXT records). The app sends digests from `digest@tryomniscient.com` through Resend.
- Google's OAuth consent screen links to `https://tryomniscient.com`, `/privacy` and `/terms`. Those keep working.

## Running cost

$0 extra a month at every stage (Beta 50 reps, Growth 500 reps). The site runs on the Hostinger plan we already pay
for. It has no server code, no database and no paid service. The blog adds nothing: it builds on your machine (Node
and Playwright are free) and ships as static files.
