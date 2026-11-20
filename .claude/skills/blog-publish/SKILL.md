---
name: blog-publish
description: How to build, check and publish an Omniscient blog post or site page in this repo. Use it after writing or editing anything in blog/_src/, tools/pages/ or assets/, and before you commit or push.
---

# Build, check, publish

## Blog posts

1. Write in `blog/_src/<slug>.md`. Blocks (```tools, ```rating, ```try, ```callout, ```cta, ```faq, ```steps, ```tree) are documented in README.md under "Blocks".
2. Build one post: `node tools/blog.mjs <slug>`. Build all, the index and covers: `node tools/blog.mjs --all`.
3. Read the build warnings. Word count, missing screenshots and unclosed blocks show there. Fix what you changed.
4. Apply the layout and stamp assets: `node tools/layout.mjs`.
5. Run the voice check from the blog-voice skill on every file you changed, and this one for removed features:
   `grep -niE "deal room|proposal|contract|e-sign|library|scout" blog/_src/<slug>.md` (hits must be about other tools only).
6. Log anything you could not confirm in `docs/blog-checks.md` under the post's heading. Never put it in the post.

## Product, integration and team pages

Copy lives in `tools/pages/content_copy.py` (words) and `tools/pages/content_*.py` (screens). Run `python3 tools/pages/build.py`, then `node tools/layout.mjs`.

## Check it in a browser

Run `node tools/check-post.mjs <slug>`. It serves the repo, loads the post at 1440px and 390px wide, and fails on sideways scroll, console errors, failed requests, broken images or a missing H1. Then look at a screenshot or two for cut-off text.

## Publish

Commit with a short message about what changed. Push to `main` only when the person asks; the site deploys from `main` within a minute or two. Then confirm on https://tryomniscient.com with a cache-busting query (`?v=$RANDOM`).
