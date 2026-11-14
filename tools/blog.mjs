// Builds the blog from Markdown. No npm dependencies (Node 22). Writing rules and the block list: README, "Blog".
//
//   node tools/blog.mjs <slug> [<slug> ...]  Builds one post: blog/<slug>/index.html and its cover. Touches nothing else.
//   node tools/blog.mjs --all                Builds every post, blog/index.html, then runs tools/layout.mjs (sitemap).
//   node tools/blog.mjs --index              Rebuilds blog/index.html only.
//
// Sources live in blog/_src/<slug>.md. A file whose name starts with "_" is a draft: it builds when named, with noindex,
// and never shows in the index, related posts or the sitemap. A broken post is skipped with a message, never a crash.
// Each post gets assets/blog/<slug>/cover.svg, a picture with no words drawn by tools/covers.mjs, and og.png (1200x630)
// when Playwright is installed.
// Tool screenshots and logos come from tools/shot-tools.mjs (assets/blog/tools/<domain>.webp, assets/blog/logos/<domain>.png).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, basename, dirname, posix } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { applyLayout } from "./layout.mjs";
import { coverArt, toolsOf } from "./covers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(root, "blog", "_src");
const SITE = "https://tryomniscient.com";
const APP = "https://app.tryomniscient.com/";
const TOPICS = { crm: "CRM" };
const TYPES = ["best-of", "alternatives", "versus", "pricing", "how-to"];
const LENGTH = { "best-of": [2000, 3000], alternatives: [2000, 3000], versus: [1800, 2500], pricing: [1500, 2500], "how-to": [1500, 2500] };
const BANNED = ["delve", "landscape", "game-changer", "game changer", "seamless", "seamlessly", "robust", "leverage", "in today's", "unlock", "elevate", "quietly"];

const rel = (p) => p.slice(root.length).replace(/^\/+/, "");
const topicName = (t) => TOPICS[t] || t.charAt(0).toUpperCase() + t.slice(1);

// ─── Text helpers ────────────────────────────────────────────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const plain = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function slugify(text) {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "section";
}

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// Only http(s), mailto, tel, site paths and anchors become links.
function safeUrl(url) {
  const u = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(u) || /^[/#.]/.test(u) || /^[\w-]+(\/|\.|$)/.test(u)) return u;
  return null;
}

// ─── Frontmatter ─────────────────────────────────────────────────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const m = text.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!m) throw new Error("no frontmatter: the file must start with a --- block");
  const data = {};
  let last = null;
  m[1].split("\n").forEach((raw, n) => {
    if (!raw.trim() || /^\s*#/.test(raw)) return;
    if (/^\s/.test(raw) && last) { data[last] = `${data[last]} ${raw.trim()}`.trim(); return; } // folded value
    const kv = raw.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) throw new Error(`frontmatter line ${n + 2} is not "key: value": ${raw.trim()}`);
    let v = kv[2].trim();
    if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\(["\\])/g, "$1");
    else if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    else if (v === ">" || v === "|" || v === ">-" || v === "|-") v = "";
    else v = v.replace(/\s+#\s.*$/, "");
    last = kv[1].toLowerCase().replace(/-/g, "_");
    data[last] = v;
  });
  return { data, body: text.slice(m[0].length) };
}

// ─── Markdown: inline ────────────────────────────────────────────────────────────────────────────────────────────

// Finds the "]" that closes the "[" at i, skipping escapes, code spans and nested brackets.
function closeBracket(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === "\\") { j++; continue; }
    if (c === "`") { const end = s.indexOf("`", j + 1); if (end > -1) { j = end; continue; } }
    if (c === "[") depth++;
    else if (c === "]" && --depth === 0) return j;
  }
  return -1;
}

// Parses [text](url "title") starting at the "[" at i. Returns null when it isn't a link.
function parseLink(s, i) {
  const close = closeBracket(s, i);
  if (close < 0 || s[close + 1] !== "(") return null;
  let j = close + 2;
  while (s[j] === " ") j++;
  let url = "";
  if (s[j] === "<") {
    const end = s.indexOf(">", j);
    if (end < 0) return null;
    url = s.slice(j + 1, end);
    j = end + 1;
  } else {
    let depth = 0;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === "\\" && j + 1 < s.length) { url += s[++j]; continue; }
      if (c === "(") depth++;
      else if (c === ")") { if (depth === 0) break; depth--; }
      else if (/\s/.test(c)) break;
      url += c;
    }
  }
  while (s[j] === " ") j++;
  let title = "";
  const q = s[j];
  if (q === '"' || q === "'") {
    const end = s.indexOf(q, j + 1);
    if (end < 0) return null;
    title = s.slice(j + 1, end);
    j = end + 1;
    while (s[j] === " ") j++;
  }
  if (s[j] !== ")") return null;
  return { text: s.slice(i + 1, close), url, title, end: j + 1 };
}

// Finds a closing run of exactly n delimiter characters.
function findCloser(s, from, ch, n) {
  for (let j = from; j < s.length; j++) {
    const c = s[j];
    if (c === "\\") { j++; continue; }
    if (c === "`") { const end = s.indexOf("`", j + 1); if (end > -1) { j = end; continue; } }
    if (c !== ch) continue;
    let r = 1;
    while (s[j + r] === ch) r++;
    const okBefore = !/\s/.test(s[j - 1] || " ");
    const okAfter = ch !== "_" || !/[\p{L}\p{N}]/u.test(s[j + r] || "");
    if (r === n && okBefore && okAfter) return j;
    j += r - 1;
  }
  return -1;
}

function inline(s, ctx) {
  let out = "";
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (c === "\\" && i + 1 < s.length && /[\\`*_{}[\]()#+\-.!|<>~"']/.test(s[i + 1])) { out += esc(s[i + 1]); i += 2; continue; }
    if (c === "\\" && s[i + 1] === undefined) { i++; continue; } // trailing backslash: a line break marker, joined already
    if (c === "`") {
      let n = 1;
      while (s[i + n] === "`") n++;
      const fence = "`".repeat(n);
      const end = s.indexOf(fence, i + n);
      if (end > -1) { out += `<code>${esc(s.slice(i + n, end).replace(/^ (.+) $/, "$1"))}</code>`; i = end + n; continue; }
      out += esc(fence); i += n; continue;
    }
    if (c === "!" && s[i + 1] === "[") {
      const l = parseLink(s, i + 1);
      if (l) { out += inlineImage(l, ctx); i = l.end; continue; }
    }
    if (c === "[") {
      const l = parseLink(s, i);
      if (l) { out += link(l, ctx); i = l.end; continue; }
    }
    if (c === "<") {
      const m = s.slice(i).match(/^<((?:https?:\/\/|mailto:)[^\s<>]+)>/i);
      if (m) { out += `<a href="${esc(m[1])}">${esc(m[1].replace(/^mailto:/i, ""))}</a>`; i += m[0].length; continue; }
    }
    if (c === "*" || c === "_") {
      let n = 1;
      while (s[i + n] === c) n++;
      const prev = s[i - 1] || " ";
      const leftOk = !/\s/.test(s[i + n] || " ") && (c === "*" || !/[\p{L}\p{N}]/u.test(prev));
      if (n <= 3 && leftOk) {
        const end = findCloser(s, i + n, c, n);
        if (end > i + n) {
          const inner = inline(s.slice(i + n, end), ctx);
          out += n === 1 ? `<em>${inner}</em>` : n === 2 ? `<strong>${inner}</strong>` : `<strong><em>${inner}</em></strong>`;
          i = end + n; continue;
        }
      }
      out += esc(c.repeat(n)); i += n; continue;
    }
    if (c === "~" && s[i + 1] === "~") {
      const end = s.indexOf("~~", i + 2);
      if (end > i + 2) { out += `<del>${inline(s.slice(i + 2, end), ctx)}</del>`; i = end + 2; continue; }
    }
    if (c === "\n") { out += s[i - 1] === " " && s[i - 2] === " " ? "<br>" : " "; i++; continue; }
    out += esc(c); i++;
  }
  return out;
}

function link(l, ctx) {
  const text = inline(l.text, ctx);
  const url = safeUrl(l.url);
  if (!url) { ctx.warn(`link "${l.text}" has an unsafe or empty address (${l.url || "none"}); shown as text`); return text; }
  ctx.links.push(url);
  const title = l.title ? ` title="${esc(l.title)}"` : "";
  return `<a href="${esc(url)}"${title}>${text}</a>`;
}

function inlineImage(l, ctx) {
  if (/^tool:/i.test(l.url.trim())) { ctx.warn(`![${l.text}](${l.url.trim()}) must sit on its own line to show the screenshot`); return esc(l.text); }
  const src = assetUrl(l.url, ctx);
  if (!src) return esc(l.text);
  return `<img class="bl-inline-img" src="${esc(src)}" alt="${esc(l.text)}"${sizeAttrs(src)} loading="lazy" decoding="async">`;
}

// ─── Images and shots ────────────────────────────────────────────────────────────────────────────────────────────

// Resolves an image address. A bare file name ("chart.svg") means assets/blog/<slug>/chart.svg.
function assetUrl(url, ctx) {
  const u = (url || "").trim();
  if (!u) { ctx.warn("an image has no address"); return null; }
  if (/^https?:\/\//i.test(u)) return u;
  if (!safeUrl(u)) { ctx.warn(`image address ${u} is not allowed`); return null; }
  const path = u.startsWith("/") ? u : `/assets/blog/${ctx.slug}/${u.replace(/^\.\//, "")}`;
  if (!existsSync(join(root, decodeURI(path.split(/[?#]/)[0])))) ctx.warn(`image not found: ${path}`);
  else ctx.visuals++;
  return path;
}

// Reads width and height from a local SVG or PNG, so the page doesn't jump while it loads.
function imageSize(path) {
  if (!path.startsWith("/")) return null;
  const file = join(root, decodeURI(path.split(/[?#]/)[0]));
  if (!existsSync(file)) return null;
  try {
    if (/\.svg$/i.test(file)) {
      const head = readFileSync(file, "utf8").slice(0, 4000);
      const tag = head.match(/<svg\b[^>]*>/i)?.[0] || "";
      const num = (name) => { const m = tag.match(new RegExp(`\\s${name}="\\s*([\\d.]+)(px)?\\s*"`)); return m ? Number(m[1]) : null; };
      const vb = tag.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
      const w = num("width") || (vb && Number(vb[1]));
      const h = num("height") || (vb && Number(vb[2]));
      return w && h ? { w: Math.round(w), h: Math.round(h) } : null;
    }
    if (/\.png$/i.test(file)) {
      const b = readFileSync(file);
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    }
  } catch { /* no size: the image still shows */ }
  return null;
}

function sizeAttrs(src) {
  const s = imageSize(src);
  return s ? ` width="${s.w}" height="${s.h}"` : "";
}

// Width and height of a WebP file (lossy VP8, lossless VP8L or extended VP8X).
function webpSize(file) {
  try {
    const b = readFileSync(file);
    if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (kind === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") { const n = b.readUInt32LE(21); return { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) }; }
  } catch { /* no size */ }
  return null;
}

// A tool's homepage (assets/blog/tools/<domain>.webp from tools/shot-tools.mjs) in a browser frame, in the gray band.
// Returns "" when there's no screenshot.
function toolFigure(domain, name, alt, ctx) {
  if (!domain) return "";
  const file = join(root, "assets", "blog", "tools", `${domain}.webp`);
  if (!existsSync(file)) return "";
  const s = webpSize(file) || { w: 1200, h: 750 };
  const month = statSync(file).mtime.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const src = `/assets/blog/tools/${domain}.webp`;
  const bar = `<div class="bl-browser__bar" aria-hidden="true"><span class="bl-browser__dots"><i></i><i></i><i></i></span><span class="bl-browser__url">${esc(domain)}</span></div>`;
  return `<figure class="bl-fig bl-site"><div class="bl-band"><div class="bl-browser">${bar}<img src="${esc(src)}" alt="${esc(alt || `${name} homepage`)}" width="${s.w}" height="${s.h}" loading="lazy" decoding="async"></div></div><figcaption><a href="https://${esc(domain)}/" rel="nofollow noopener">${esc(name)} homepage, ${month}</a></figcaption></figure>`;
}

function figure({ text: alt, url, title }, ctx) {
  if (/\.shot\.html$/i.test(url.trim())) return shot(url.trim(), alt, title, ctx);
  const tool = url.trim().match(/^tool:(.*)$/i);
  if (tool) {
    const domain = cleanDomain(tool[1]);
    const known = [...ctx.tools.values()].find((t) => t.domain === domain);
    const name = known ? plain(inline(known.name, ctx)) : alt.replace(/\s+homepage$/i, "").trim() || domain;
    const html = toolFigure(domain, name, alt.trim(), ctx);
    if (!html) ctx.warn(`no screenshot for ${domain}: run node tools/shot-tools.mjs ${domain}`);
    return html;
  }
  const src = assetUrl(url, ctx);
  if (!src) return "";
  if (!alt.trim()) ctx.warn(`image ${src} has no alt text`);
  const caption = title ? `<figcaption>${inline(title, ctx)}</figcaption>` : "";
  // A wide chart would shrink its text below reading size on a phone, so its band scrolls sideways there instead.
  const s = imageSize(src);
  const wide = /\.svg$/i.test(src) && s && s.w >= 640 ? " bl-band--wide" : "";
  return `<figure class="bl-fig"><div class="bl-band${wide}"${wide ? ' tabindex="0" role="region" aria-label="Chart"' : ""}><img src="${esc(src)}" alt="${esc(alt)}"${sizeAttrs(src)} loading="lazy" decoding="async"></div>${caption}</figure>`;
}

// Inlines an HTML snippet (<name>.shot.html) inside the gray grain band the product pages use. Shots use home.css.
function shot(url, alt, title, ctx) {
  if (!/\.html$/i.test(url)) url = `${url}.shot.html`;
  const path = url.startsWith("/") ? url : `/assets/blog/${ctx.slug}/${url.replace(/^\.\//, "")}`;
  const file = join(root, path);
  if (!existsSync(file)) { ctx.warn(`shot not found: ${path}`); return ""; }
  let html = readFileSync(file, "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (body) html = [...html.matchAll(/<style[\s\S]*?<\/style>/gi)].map((m) => m[0]).join("\n") + body[1];
  html = html.replace(/<!doctype[^>]*>/i, "").trim();
  ctx.usesShot = true;
  ctx.visuals++;
  const label = alt && !/\brole="img"/.test(html) ? ` role="img" aria-label="${esc(alt)}"` : "";
  const caption = title ? `<figcaption>${inline(title, ctx)}</figcaption>` : "";
  return `<figure class="bl-fig bl-fig--shot"><div class="om-home bl-shot" data-anim${label}><div class="band b-gray">\n${html}\n</div></div>${caption}</figure>`;
}

// ─── Markdown: blocks ────────────────────────────────────────────────────────────────────────────────────────────

const FENCE = /^\s{0,3}(`{3,}|~{3,})\s*([\w-]*)[^`]*$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const HR = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>/;
const LIST = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const blank = (l) => l === undefined || !l.trim();
const isTableStart = (lines, i) => lines[i].includes("|") && i + 1 < lines.length && lines[i + 1].includes("-") && TABLE_SEP.test(lines[i + 1]) && (lines[i + 1].includes("|") || lines[i].trim().startsWith("|"));
const startsBlock = (lines, i) => FENCE.test(lines[i]) || HEADING.test(lines[i]) || HR.test(lines[i]) || QUOTE.test(lines[i]) || /^\s{0,3}([-*+]|1[.)])\s+\S/.test(lines[i]) || isTableStart(lines, i) || /^\s*<!--/.test(lines[i]);

// Reads the fenced block that opens at line i: its kind, its lines and the line after it.
function readFence(lines, i) {
  const f = lines[i].match(FENCE);
  const mark = f[1];
  const body = [];
  for (let j = i + 1; j < lines.length; j++) {
    const t = lines[j].trim();
    if (t.startsWith(mark) && t.replace(/[`~]/g, "") === "" && t[0] === mark[0]) return { mark, kind: f[2].toLowerCase(), body, closed: true, next: j + 1 };
    body.push(lines[j]);
  }
  return { mark, kind: f[2].toLowerCase(), body, closed: false, next: lines.length };
}

function blocks(lines, ctx, tight = false) {
  const out = [];
  let i = 0;
  let lastH2 = null; // the text of a ## heading when it's the block just before

  while (i < lines.length) {
    const line = lines[i];
    if (blank(line)) { i++; continue; }

    // HTML comments are notes for writers: dropped.
    if (/^\s*<!--/.test(line)) {
      while (i < lines.length && !lines[i].includes("-->")) i++;
      i++; continue;
    }

    if (FENCE.test(line)) {
      const f = readFence(lines, i);
      i = f.next;
      if (!f.closed) ctx.warn(`a ${f.mark}${f.kind} block never closes; it runs to the end of the post`);
      if (f.kind === "faq" && lastH2 !== null) ctx.warn(`the ## "${lastH2}" heading sits right before the faq block, which prints its own "FAQs" heading; delete it`);
      lastH2 = null;
      out.push(special(f.kind, f.body, ctx));
      continue;
    }

    const h = line.match(HEADING);
    if (h) {
      const html = heading(h[1].length, h[2], ctx);
      lastH2 = /^<h2\b/.test(html) ? plain(html) : null;
      out.push(html); i++;
      // A numbered tool heading: its ```rating line (when it comes next) sits under the name, then the screenshot.
      if (ctx.pendingFig !== undefined) {
        const fig = ctx.pendingFig;
        ctx.pendingFig = undefined;
        let j = i;
        while (j < lines.length && blank(lines[j])) j++;
        if (j < lines.length && FENCE.test(lines[j]) && readFence(lines, j).kind === "rating") {
          const f = readFence(lines, j);
          if (!f.closed) ctx.warn("a rating block never closes; it runs to the end of the post");
          out.push(rating(f.body, ctx, true));
          i = f.next;
        }
        if (fig) out.push(fig);
      }
      continue;
    }
    lastH2 = null;

    if (HR.test(line)) { out.push("<hr>"); i++; continue; }

    if (QUOTE.test(line)) {
      const inner = [];
      while (i < lines.length && !blank(lines[i]) && (QUOTE.test(lines[i]) || !startsBlock(lines, i))) inner.push(lines[i++].replace(/^\s{0,3}> ?/, ""));
      out.push(`<blockquote>${blocks(inner, ctx)}</blockquote>`);
      continue;
    }

    if (LIST.test(line)) { const r = list(lines, i, ctx); out.push(r.html); i = r.next; continue; }

    if (isTableStart(lines, i)) { const r = table(lines, i, ctx); out.push(r.html); i = r.next; continue; }

    // Paragraph
    const para = [line.trim()];
    for (i++; i < lines.length && !blank(lines[i]) && !startsBlock(lines, i); i++) {
      const prev = para[para.length - 1];
      para[para.length - 1] = prev.endsWith("\\") ? `${prev.slice(0, -1)}  ` : prev;
      para.push(lines[i].trim());
    }
    const text = para.join("\n");
    const img = text.match(/^!\[/) && parseLink(text, 1);
    if (img && img.end === text.length) { out.push(figure(img, ctx)); continue; }
    out.push(tight ? inline(text, ctx) : `<p>${inline(text, ctx)}</p>`);
  }
  return out.join("\n");
}

function heading(level, raw, ctx) {
  const html = inline(raw, ctx);
  const text = plain(html);
  if (level === 1) {
    ctx.h1s.push(text);
    if (ctx.h1s.length === 1) return ""; // the page header shows the title
    ctx.warn(`more than one # heading ("${text}"); shown as ##`);
    level = 2;
  }
  if (level > 4) level = 4;
  // A tool's #### headings take its id first ("1-omniscient-pros"), so each one can be linked to.
  const base = level === 4 && ctx.review ? `${ctx.review.id}-${slugify(text)}` : slugify(text);
  let id = base;
  for (let n = 2; ctx.ids.has(id); n++) id = `${base}-${n}`;
  ctx.ids.add(id);
  // A numbered tool section runs from its ### heading to the next ## or ###. Its #### headings (Key features, Pros,
  // Cons, Price and plans) get the review style, and the lists under Pros and Cons get + and − markers.
  if (level <= 3) ctx.review = null;
  if (level === 2) ctx.toc.push({ id, html: html.replace(/<a\b[^>]*>|<\/a>/g, ""), subs: [] });
  if (level === 3) {
    const tool = toolHeading(raw, text, id, ctx);
    if (tool) return tool;
  }
  if (level === 4 && ctx.review) {
    ctx.review.part = /^pros\b/i.test(text) ? "pros" : /^cons\b/i.test(text) ? "cons" : "list";
    return `<h4 id="${id}" class="bl-revh">${html}</h4>`;
  }
  return `<h${level} id="${id}">${html}</h${level}>`;
}

// "### 3. Name" or "### 3. Name: subtitle", when Name is in the post's tools block: the number in a square tag, the
// logo and the name. blocks() puts the tool's ```rating line (if it comes next) and its homepage screenshot under it.
function toolHeading(raw, text, id, ctx) {
  const m = text.match(/^(\d{1,2})\.\s+(.+?)(?::\s+.*)?$/);
  if (!m) return "";
  const tool = ctx.tools.get(toolKey(m[2]));
  if (!tool) return "";
  const name = plain(inline(tool.name, ctx));
  const logo = logoFor(tool.name, tool.domain);
  const rest = inline(raw.replace(/^\s*\d{1,2}\\?\.\s+/, ""), ctx);
  const img = logo ? `<span class="bl-toolh__logo"><img src="${esc(logo)}" alt="" width="20" height="20" loading="lazy" decoding="async"></span>` : "";
  const fig = toolFigure(tool.domain, name, "", ctx);
  if (!fig && tool.domain) ctx.warn(`no screenshot for ${name} (${tool.domain}): run node tools/shot-tools.mjs ${tool.domain}`);
  const n = m[1].padStart(2, "0");
  ctx.pendingFig = fig;
  ctx.toolIds.set(toolKey(tool.name), id);
  ctx.review = { id, part: null };
  ctx.toc[ctx.toc.length - 1]?.subs.push({ id, n, name });
  return `<h3 id="${id}" class="bl-toolh"><span class="bl-toolh__n">${n}</span>${img}<span class="bl-toolh__name">${rest}</span></h3>`;
}

function list(lines, start, ctx) {
  const first = lines[start].match(LIST);
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items = [];
  let cur = null, loose = false, gap = false, i = start;
  const sibling = (m) => m && m[1].length <= base + 1 && /\d/.test(m[2]) === ordered;
  while (i < lines.length) {
    const l = lines[i];
    const m = l.match(LIST);
    if (sibling(m)) {
      if (gap) loose = true;
      cur = { lines: [m[3]], indent: m[1].length + m[2].length + 1 };
      items.push(cur); gap = false; i++; continue;
    }
    if (m && m[1].length <= base + 1) break; // a different kind of list starts
    if (blank(l)) {
      let j = i + 1;
      while (j < lines.length && blank(lines[j])) j++;
      if (j >= lines.length) break;
      const ind = lines[j].match(/^\s*/)[0].length;
      if (ind > base + 1 || sibling(lines[j].match(LIST))) { cur.lines.push(""); gap = true; i++; continue; }
      break;
    }
    const ind = l.match(/^\s*/)[0].length;
    if (ind > base + 1) { cur.lines.push(l.slice(Math.min(ind, cur.indent))); i++; continue; }
    if (!gap && !startsBlock(lines, i)) { cur.lines.push(l.trim()); i++; continue; } // lazy continuation
    break;
  }
  const tag = ordered ? "ol" : "ul";
  const num = ordered ? parseInt(first[2], 10) : 1;
  const startAttr = ordered && num !== 1 ? ` start="${num}"` : "";
  // A top-level list under a #### in a tool section: data-rev="pros", "cons" or "list" (see ctx.review in heading()).
  const part = !ctx.listDepth && ctx.review?.part;
  const revAttr = part ? ` data-rev="${ordered ? "list" : part}"` : "";
  ctx.listDepth = (ctx.listDepth || 0) + 1;
  const lis = items.map((it) => `<li>${blocks(it.lines, ctx, !loose)}</li>`).join("\n");
  ctx.listDepth--;
  return { html: `<${tag}${startAttr}${revAttr}>\n${lis}\n</${tag}>`, next: i };
}

// Splits a table row on "|" outside code spans and links.
function cells(row) {
  let s = row.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  const out = [];
  let cur = "", code = false, depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\" && s[i + 1] === "|") { cur += "|"; i++; continue; }
    if (c === "`") code = !code;
    if (!code && c === "[") depth++;
    if (!code && c === "]" && depth > 0) depth--;
    if (c === "|" && !code && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function table(lines, start, ctx) {
  const head = cells(lines[start]);
  const align = cells(lines[start + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : ""));
  let i = start + 2;
  const rows = [];
  for (; i < lines.length && !blank(lines[i]) && lines[i].includes("|"); i++) rows.push(cells(lines[i]));
  const cols = head.length;
  rows.forEach((r, n) => { if (r.length !== cols) ctx.warn(`table "${plain(inline(head[0], ctx))}": row ${n + 1} has ${r.length} cells, the header has ${cols}`); });
  const td = (tag, c, k, row) => `<${tag}${align[k] ? ` style="text-align:${align[k]}"` : ""}>${row && k > 0 ? priceCell(c || "", row[0] || "", ctx) : inline(c || "", ctx)}</${tag}>`;
  // Three columns fit a phone; four or more scroll inside the frame.
  const minW = cols >= 4 ? ` style="min-width:${Math.min(cols * 130, 700)}px"` : "";
  const html = `<div class="bl-table" role="region" aria-label="Table" tabindex="0"><table${minW}>
<thead><tr>${head.map((c, k) => td("th", c, k)).join("")}</tr></thead>
<tbody>
${rows.map((r) => `<tr>${Array.from({ length: cols }, (_, k) => td("td", r[k], k, r)).join("")}</tr>`).join("\n")}
</tbody></table></div>`;
  return { html, next: i };
}

// A vendor's pricing page: https://<domain>/pricing (Omniscient's is the pricing section on the home page).
const pricingUrl = (domain) => (domain === "tryomniscient.com" ? "/pricing/" : `https://${domain}/pricing`);

// The domain for a table row: its first cell names a tool in the tools block, or links to the tool's site.
function rowDomain(first, ctx) {
  const tool = ctx.tools.get(toolKey(plain(inline(first, { ...ctx, warn() {}, links: [] }))));
  if (tool?.domain) return tool.domain;
  const l = first.match(/\]\((https?:\/\/[^)\s]+)/i);
  return l ? cleanDomain(l[1]) : "";
}

// A cell (in the tools block or a table) that reads "check", "See pricing" or nothing becomes "See pricing", linked
// to the row's pricing page, so no "check" ever shows. "[See pricing](url)" keeps its own address. Other text renders
// as written. Empty cells stay empty in plain tables (pass price=true for the tools block's price column).
function priceCell(raw, first, ctx, price = false) {
  const text = plain(inline(raw, { ...ctx, warn() {}, links: [] }));
  const see = /^see pricing$/i.test(text);
  if (see && /\]\(/.test(raw)) return inline(raw, ctx).replace(/^<a href="([^"]*)"/, (_, h) => `<a class="bl-see" href="${h}"${h.startsWith("/") ? "" : ' rel="nofollow"'}`);
  if (!see && !/^check$/i.test(text) && !(price && !text)) return inline(raw, ctx);
  const name = plain(inline(first, { ...ctx, warn() {}, links: [] })) || "a row";
  if (!see) ctx.checks.push(name);
  const domain = rowDomain(first, ctx);
  if (!domain) { ctx.warn(`"See pricing" for ${name} has no link: add ${name} to the tools block, or write [See pricing](url)`); return "See pricing"; }
  const url = pricingUrl(domain);
  return `<a class="bl-see" href="${esc(url)}"${url.startsWith("/") ? "" : ' rel="nofollow"'}>See pricing</a>`;
}

// ─── Special blocks ──────────────────────────────────────────────────────────────────────────────────────────────

function special(kind, body, ctx) {
  switch (kind) {
    case "tools": return tools(body, ctx);
    case "callout": return `<aside class="bl-callout">${blocks(body, ctx)}</aside>`;
    case "cta": return cta(body, ctx);
    case "faq": return faq(body, ctx);
    case "steps": return steps(body, ctx);
    case "shot": return body.filter((l) => l.trim()).map((l) => shot(l.trim(), "", "", ctx)).join("\n");
    case "rating": return rating(body, ctx, false);
    case "try": return tryButton(body, ctx);
    case "tree": return tree(body, ctx);
    default:
      if (kind && !["", "text", "txt", "html", "css", "js", "json", "bash", "sh", "md", "markdown", "sql", "ts", "tsx", "yaml"].includes(kind)) ctx.warn(`unknown block \`\`\`${kind}: shown as code`);
      return `<pre class="bl-code"><code>${esc(body.join("\n"))}</code></pre>`;
  }
}

const LOGOS = (() => {
  try { return readdirSync(join(root, "assets", "logos")); } catch { return []; }
})();

// Omniscient's own icon, then the logo tools/shot-tools.mjs saved, then assets/logos/, then the site's favicon.
function logoFor(name, domain) {
  if (/omniscient/i.test(name) || domain === "tryomniscient.com") return "/assets/brand/icon.svg";
  if (domain && existsSync(join(root, "assets", "blog", "logos", `${domain}.png`))) return `/assets/blog/logos/${domain}.png`;
  const keys = [name.toLowerCase().replace(/[^a-z0-9]/g, ""), (domain || "").split(".")[0]];
  for (const k of keys) {
    const file = LOGOS.find((f) => f.replace(/\.\w+$/, "") === k);
    if (k && file) return `/assets/logos/${file}`;
  }
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : null;
}

const cleanDomain = (raw) => (raw || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/[/?#].*$/, "").toLowerCase();
const toolKey = (name) => name.replace(/[*_`[\]]/g, "").trim().toLowerCase();

// The rows of a ```tools block. warn gets each line it can't read.
function toolRows(body, warn) {
  const rows = [];
  body.forEach((line, n) => {
    if (!line.trim() || TABLE_SEP.test(line)) return;
    const c = cells(line);
    const [name, domainRaw = ""] = c;
    const domain = cleanDomain(domainRaw);
    const looksDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain);
    if (rows.length === 0 && !looksDomain && /^(name|tool)s?$/i.test(name)) return; // header line
    if (c.length < 3 || !name) { warn(`tools line ${n + 1} needs "Name | domain.com | what it is | price | best for": ${line.trim()}`); return; }
    if (!looksDomain) warn(`tools: "${name}" has no domain (${domainRaw || "empty"}), so no logo`);
    rows.push({ name, domain: looksDomain ? domain : "", what: c[2] || "", price: c[3] || "", best: c[4] || "" });
  });
  return rows;
}

// Every tool in a post's ```tools blocks, by lowercase name, read before the post renders so a numbered heading
// above the table still finds its tool.
function toolsIn(lines) {
  const map = new Map();
  for (let i = 0; i < lines.length;) {
    if (!FENCE.test(lines[i])) { i++; continue; }
    const f = readFence(lines, i);
    i = f.next;
    if (f.kind !== "tools") continue;
    for (const r of toolRows(f.body, () => {})) if (!map.has(toolKey(r.name))) map.set(toolKey(r.name), r);
  }
  return map;
}

function tools(body, ctx) {
  const rows = toolRows(body, ctx.warn);
  if (!rows.length) { ctx.warn("a ```tools block has no tools"); return ""; }
  const tr = rows.map((r) => {
    const logo = logoFor(r.name, r.domain);
    const img = logo ? `<img src="${esc(logo)}" alt="" width="20" height="20" loading="lazy" decoding="async">` : "";
    const href = r.domain === "tryomniscient.com" ? "/" : r.domain ? `https://${r.domain}/` : "";
    const name = href ? `<a href="${esc(href)}"${href === "/" ? "" : ' rel="nofollow"'}>${inline(r.name, ctx)}</a>` : inline(r.name, ctx);
    const price = priceCell(r.price, r.name, ctx, true);
    return `<tr><th scope="row"><span class="bl-tools__name"><span class="bl-tools__logo">${img}</span>${name}</span></th><td>${inline(r.what, ctx)}</td><td class="bl-tools__price">${price}</td><td>${inline(r.best, ctx)}</td></tr>`;
  }).join("\n");
  return `<div class="bl-table bl-tools" role="region" aria-label="Tools compared" tabindex="0"><table>
<thead><tr><th scope="col">Tool</th><th scope="col">What it is</th><th scope="col">Starting price</th><th scope="col">Best for</th></tr></thead>
<tbody>
${tr}
</tbody></table></div>`;
}

function cta(body, ctx) {
  const text = body.map((l) => l.trim()).filter(Boolean).join(" ");
  if (!text) ctx.warn("a ```cta block is empty");
  return `<aside class="bl-cta"><p class="bl-cta__text">${inline(text || "Try Omniscient free for 14 days.", ctx)}</p><div class="bl-cta__row"><a class="btn btn--primary btn--lg" href="${APP}">Start free <span class="nudge" aria-hidden="true">→</span></a><span class="bl-mono">14 days free. No credit card required.</span></div></aside>`;
}

// Five square-cornered stars in a 14px row: gray outlines, and an emerald copy on top clipped to the score.
const STAR = { size: 14, gap: 3, R: 6, r: 6 * 0.42 };
const STAR_PATH = (() => {
  const { size, R, r } = STAR;
  const cx = size / 2, cy = size / 2 + (R - R * Math.cos(Math.PI / 5)) / 2;
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 5, d = k % 2 ? r : R;
    return `${(cx + d * Math.cos(a)).toFixed(2)} ${(cy + d * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
})();

// ```rating: one line, "4.8 | G2 | https://www.g2.com/products/.../reviews". Shown under a numbered tool heading:
// the stars, the score and the source's name linked. No JSON-LD: Google's review snippet rules forbid marking up
// ratings gathered from other websites ("Don't aggregate reviews or ratings from other websites").
function rating(body, ctx, attached) {
  const lines = body.map((l) => l.trim()).filter(Boolean);
  if (lines.length !== 1) ctx.warn(`a rating block needs one line, "4.8 | G2 | https://...", and has ${lines.length}`);
  if (!lines.length) return "";
  const [scoreRaw = "", source = "", urlRaw = ""] = cells(lines[0]);
  const m = scoreRaw.match(/^(\d(?:[.,]\d{1,2})?)(?:\s*\/\s*5)?$/);
  const score = m ? Number(m[1].replace(",", ".")) : NaN;
  if (!(score >= 0 && score <= 5) || !source) { ctx.warn(`rating "${lines[0]}" needs "4.8 | G2 | https://..." with a score from 0 to 5`); return ""; }
  if (!attached) ctx.warn(`the ${source} rating isn't right under a numbered tool heading`);
  const url = /^https:\/\/\S+$/i.test(urlRaw) ? urlRaw : "";
  if (!url) ctx.warn(`the ${source} rating has no https:// address, so ${source} isn't linked`);
  const { size, gap, R } = STAR;
  const full = Math.floor(score), frac = score - full, total = 5 * size + 4 * gap;
  const edge = size / 2 - R * Math.sin((2 * Math.PI) / 5); // where a star's outline starts inside its cell
  const clip = full >= 5 ? total + 2 : full * (size + gap) + (frac > 0 ? edge + frac * (size - 2 * edge) : -gap / 2);
  const stars = Array.from({ length: 5 }, (_, k) => `<path transform="translate(${k * (size + gap)} 0)" d="${STAR_PATH}"/>`).join("");
  const id = `bl-rate-${(ctx.ratings = (ctx.ratings || 0) + 1)}`;
  const svg = `<svg class="bl-stars" viewBox="0 0 ${total} ${size}" width="${total}" height="${size}" aria-hidden="true" focusable="false"><defs><clipPath id="${id}"><rect x="-2" y="-2" width="${(clip + 2).toFixed(2)}" height="${size + 4}"/></clipPath></defs><g class="bl-stars__off" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="miter">${stars}</g><g class="bl-stars__on" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="miter" clip-path="url(#${id})">${stars}</g></svg>`;
  const name = url ? `<a href="${esc(url)}" target="_blank" rel="nofollow noopener">${esc(source)}</a>` : esc(source);
  return `<div class="bl-rating">${svg} <span class="bl-rating__score">${m[1].replace(",", ".")}/5</span> <span class="bl-rating__src">on ${name}</span></div>`;
}

// ```try: one line, "Try Omniscient free | https://app.tryomniscient.com/signup?utm_source=blog". A primary button in the
// flow of the text, under a tool's intro. Links off tryomniscient.com get rel="nofollow noopener".
function tryButton(body, ctx) {
  const lines = body.map((l) => l.trim()).filter(Boolean);
  const [label = "", urlRaw = ""] = lines.length ? cells(lines[0]) : [];
  const url = /^(https:\/\/\S+|\/\S*)$/i.test(urlRaw) ? urlRaw : "";
  if (lines.length !== 1 || !label || !url) { ctx.warn(`a try block needs one line, "Label | https://...": ${lines.join(" ") || "(empty)"}`); return ""; }
  ctx.links.push(url);
  const own = url.startsWith("/") || /^https:\/\/([\w-]+\.)*tryomniscient\.com(?=[/?#]|$)/i.test(url);
  return `<div class="bl-try"><a class="btn btn--primary btn--lg" href="${esc(url)}"${own ? "" : ' rel="nofollow noopener"'}>${esc(label)} <span class="nudge" aria-hidden="true">→</span></a></div>`;
}

function faq(body, ctx) {
  const items = [];
  let cur = null, part = "q";
  for (const line of body) {
    const q = line.match(/^\s*(?:\*\*)?Q(?:uestion)?\s*[:.](?:\*\*)?\s*(.*)$/i);
    const a = line.match(/^\s*(?:\*\*)?A(?:nswer)?\s*[:.](?:\*\*)?\s*(.*)$/i);
    if (q) { cur = { q: [q[1]], a: [] }; items.push(cur); part = "q"; continue; }
    if (a && cur) { cur.a.push(a[1]); part = "a"; continue; }
    if (!cur) { if (line.trim()) ctx.warn(`faq: text before the first "Q:" is dropped: ${line.trim()}`); continue; }
    cur[part].push(line.trim() ? line.trim() : "");
  }
  const good = items.filter((it) => {
    const ok = it.q.join(" ").trim() && it.a.join("").trim();
    if (!ok) ctx.warn(`faq: "${it.q.join(" ").trim() || "(empty)"}" has no answer; left out`);
    return ok;
  });
  if (!good.length) return "";
  const title = heading(2, "FAQs", ctx);
  const html = good.map((it, n) => {
    const q = inline(it.q.join(" ").trim(), ctx);
    const a = blocks(it.a, ctx);
    ctx.faq.push({ q: plain(q), a: plain(a) });
    return `<details${n === 0 ? " open" : ""}><summary>${q}</summary><div class="bl-faq__a">${a}</div></details>`;
  }).join("\n");
  return `${title}\n<div class="bl-faq">\n${html}\n</div>`;
}

function steps(body, ctx) {
  const items = [];
  for (const line of body) {
    const m = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (m) { items.push([m[2]]); continue; }
    if (line.trim() && items.length) items[items.length - 1].push(line.trim());
    else if (line.trim()) ctx.warn(`steps: text before step 1 is dropped: ${line.trim()}`);
  }
  if (!items.length) { ctx.warn("a ```steps block has no numbered lines"); return ""; }
  const lis = items.map((parts, n) => {
    const text = parts.join(" ");
    const m = text.match(/^(?:\*\*)?([^:*]{1,90}?)(?:\*\*)?:(?:\*\*)?\s+(.*)$/);
    const title = m ? `<b class="bl-steps__title">${inline(m[1], ctx)}</b>` : "";
    const rest = inline(m ? m[2] : text, ctx);
    return `<li><span class="bl-steps__n">${String(n + 1).padStart(2, "0")}</span><div>${title}<p>${rest}</p></div></li>`;
  }).join("\n");
  return `<ol class="bl-steps">\n${lis}\n</ol>`;
}

// ```tree: a decision tree. One question, then its branches indented under it as "Label: answer". An answer that ends
// in "?" is another question with its own branches, indented under it; any other answer ends the path: one to four tool
// names split by commas, then "| a short note" if needed. A first line "# Title" names the tree. A tool from the tools
// block links to its numbered section ("Skylead Agency" finds Skylead); "Name (domain.com)" is a tool outside the list,
// shown with its logo and no link.
//
//   # Where to look first
//   Do you want replies on your CRM record?
//     Yes: Omniscient
//     No: Do you run many client accounts?
//       Yes: HeyReach, GetSales.io
//       No: Waalaxy | The smallest bill
//
// On a desktop a question whose branches fit side by side draws them as a tree; the rest stack under their question
// with a rail, as every tree does on a phone. The widths here are the smallest each part reads well at.
const TREE = { W: 664, LEAF: 150, Q: 180, GAP: 16, INDENT: 28 };

function parseTree(body, ctx) {
  let title = "";
  const items = [];
  for (const raw of body) {
    if (!raw.trim()) continue;
    const t = raw.trim();
    if (!items.length && !title && /^#\s+/.test(t)) { title = t.replace(/^#\s+/, ""); continue; }
    items.push({ ind: raw.replace(/\t/g, "  ").match(/^ */)[0].length, t });
  }
  if (!items.length) return null;
  const root = { kind: "q", text: items[0].t, kids: [], ind: items[0].ind };
  if (!/\?$/.test(root.text)) ctx.warn(`tree: the first line should be a question: ${root.text}`);
  const stack = [root];
  for (const it of items.slice(1)) {
    while (stack.length > 1 && it.ind <= stack[stack.length - 1].ind) stack.pop();
    const parent = stack[stack.length - 1];
    if (it.ind <= parent.ind) { ctx.warn(`tree: "${it.t}" isn't indented under a question; left out`); continue; }
    if (parent.kind !== "q") { ctx.warn(`tree: "${it.t}" sits under an answer, not a question; left out`); continue; }
    const m = it.t.match(/^([^:]+?):\s+(.+)$/);
    if (!m) { ctx.warn(`tree: "${it.t}" needs "Label: answer"; left out`); continue; }
    const node = /\?$/.test(m[2])
      ? { kind: "q", label: m[1], text: m[2], kids: [], ind: it.ind }
      : { kind: "leaf", label: m[1], tools: m[2].split("|")[0].split(",").map((x) => x.trim()).filter(Boolean), note: m[2].split("|").slice(1).join("|").trim(), ind: it.ind };
    parent.kids.push(node);
    stack.push(node);
  }
  const check = (n) => {
    if (n.kind === "leaf") { if (n.tools.length < 1 || n.tools.length > 4) ctx.warn(`tree: "${n.label}" ends in ${n.tools.length} tools (1 to 4 read best)`); return; }
    if (n.kids.length < 2 || n.kids.length > 4) ctx.warn(`tree: "${n.text}" has ${n.kids.length} branch${n.kids.length === 1 ? "" : "es"} (2 to 4)`);
    n.kids.forEach(check);
  };
  check(root);
  return { title, root };
}

// The width each part needs: min is the narrowest it reads well at (stacked when its branches don't fit side by side),
// pref is what it takes with every branch side by side.
function treeNeed(n) {
  if (n.kind === "leaf") return (n.need = { min: TREE.LEAF, pref: TREE.LEAF, row: TREE.LEAF });
  const kids = n.kids.map(treeNeed);
  const gaps = TREE.GAP * Math.max(0, n.kids.length - 1);
  const row = kids.reduce((a, k) => a + k.min, 0) + gaps;
  const col = Math.max(TREE.Q, TREE.INDENT + Math.max(0, ...kids.map((k) => k.min)));
  return (n.need = { min: Math.min(row, col), pref: Math.max(TREE.Q, kids.reduce((a, k) => a + k.pref, 0) + gaps), row });
}

// Side by side when the branches fit; each then gets its smallest width plus a share of what's left, by how much more it
// could use.
function treeLayout(n, avail) {
  if (n.kind === "leaf") return;
  n.row = n.kids.length > 1 && n.need.row <= avail;
  if (!n.row) { n.kids.forEach((k) => treeLayout(k, avail - TREE.INDENT)); return; }
  const free = avail - n.need.row;
  const extra = n.kids.reduce((a, k) => a + k.need.pref - k.need.min, 0);
  for (const k of n.kids) {
    k.w = k.need.min + (extra ? (free * (k.need.pref - k.need.min)) / extra : free / n.kids.length);
    treeLayout(k, k.w);
  }
}

// A tool at the end of a path. Its link is filled in by treeLinks() once the numbered headings below have their ids.
function treeTool(raw, ctx) {
  const out = raw.match(/^(.*?)\s*\(([a-z0-9-]+(?:\.[a-z0-9-]+)+)\)$/i);
  let tool = null, label = raw;
  if (out) { label = out[1]; tool = { name: out[1], domain: cleanDomain(out[2]) }; }
  else {
    const key = toolKey(raw);
    tool = ctx.tools.get(key);
    if (!tool) {
      const words = (s) => ` ${s.replace(/[^a-z0-9.]+/g, " ").trim()} `;
      const hits = [...ctx.tools.values()].filter((t) => words(key).includes(words(toolKey(t.name))) || words(toolKey(t.name)).includes(words(key)));
      tool = hits.sort((a, b) => b.name.length - a.name.length)[0] || null;
    }
    if (!tool) ctx.warn(`tree: "${raw}" isn't in the tools block, so it has no logo or link (write "${raw} (domain.com)" for a tool outside the list)`);
  }
  const logo = tool ? logoFor(tool.name, tool.domain) : null;
  const own = tool && (tool.domain === "tryomniscient.com" || /omniscient/i.test(tool.name));
  const img = logo ? `<span class="bl-tree__logo"><img src="${esc(logo)}" alt="" width="16" height="16" loading="lazy" decoding="async"></span>` : "";
  const inner = `${img}<span class="bl-tree__name">${inline(label, ctx)}</span>`;
  const cls = `bl-tree__tool${own ? " bl-tree__tool--own" : ""}`;
  if (!tool || out) return `<span class="${cls}">${inner}</span>`;
  return `\u0001${toolKey(tool.name)}\u0001${cls}\u0001${inner}\u0002`;
}

function treeNode(n, ctx, depth) {
  if (n.kind === "leaf") {
    const tools = n.tools.map((t) => `<li>${treeTool(t, ctx)}</li>`).join("");
    const note = n.note ? `<p class="bl-tree__note">${inline(n.note, ctx)}</p>` : "";
    return `<div class="bl-tree__leaf"><ul class="bl-tree__tools" role="list">${tools}</ul>${note}</div>`;
  }
  const kids = n.kids.map((k) => {
    const style = `--d:${depth + 1}${n.row ? `;flex-grow:${Math.round(k.w)}` : ""}`;
    return `<li class="bl-tree__kid" style="${style}"><span class="bl-tree__label">${inline(k.label, ctx)}</span>${treeNode(k, ctx, depth + 1)}</li>`;
  }).join("\n");
  return `<div class="bl-tree__node bl-tree__node--${n.row ? "row" : "col"}"><p class="bl-tree__q">${inline(n.text, ctx)}</p><ul class="bl-tree__kids" role="list">\n${kids}\n</ul></div>`;
}

function tree(body, ctx) {
  const t = parseTree(body, ctx);
  if (!t) { ctx.warn("a ```tree block is empty"); return ""; }
  treeNeed(t.root);
  treeLayout(t.root, TREE.W);
  ctx.visuals++;
  const id = `bl-tree-${(ctx.trees = (ctx.trees || 0) + 1)}`;
  const title = t.title ? `<p class="bl-tree__title" id="${id}">${inline(t.title, ctx)}</p>` : "";
  const name = t.title ? ` aria-labelledby="${id}"` : ' aria-label="Decision tree"';
  return `<figure class="bl-fig bl-treefig"${name}><div class="bl-band bl-band--tree"><div class="bl-tree reveal">${title}\n${treeNode(t.root, ctx, 0)}\n</div></div></figure>`;
}

// Points each tree tool at its numbered heading ("#3-heyreach"); a tool with no heading on the page shows unlinked.
function treeLinks(html, ctx) {
  return html.replace(/\u0001([^\u0001]*)\u0001([^\u0001]*)\u0001([\s\S]*?)\u0002/g, (_, key, cls, inner) => {
    const id = ctx.toolIds.get(key);
    if (!id) { ctx.warn(`tree: ${plain(inner)} has no numbered heading on this page, so it isn't linked`); return `<span class="${cls}">${inner}</span>`; }
    return `<a class="${cls}" href="#${id}">${inner}</a>`;
  });
}

// ─── Covers ──────────────────────────────────────────────────────────────────────────────────────────────────────

// The art itself lives in tools/covers.mjs. Here it gets its name for screen readers when it stands alone.
function labelled(svg, title) {
  return svg.replace(/^<svg /, `<svg role="img" aria-label="${esc(title)}" `).replace(/(<svg[^>]*>)/, `$1\n<title>${esc(title)}</title>`);
}

// Logos in a cover are named by site path; the PNG render reads them from disk.
const MIME = { ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
function inlineAssets(svg) {
  return svg.replace(/href="(\/assets\/[^"]+)"/g, (m, path) => {
    const file = join(root, path);
    const type = MIME[(path.match(/\.\w+$/) || [""])[0].toLowerCase()];
    return type && existsSync(file) ? `href="data:${type};base64,${readFileSync(file).toString("base64")}"` : m;
  });
}

// Renders 1200x630 PNGs of covers with Playwright, when it's installed. Returns the set of written files.
async function renderPngs(jobs) {
  const done = new Set();
  if (!jobs.length) return done;
  let chromium;
  try { ({ chromium } = createRequire(import.meta.url)("playwright")); } catch {
    console.log("  Playwright isn't installed: share images (og.png) skipped; pages use the default share image.");
    return done;
  }
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    for (const job of jobs) {
      await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:#fff}svg{display:block}</style></head><body>${inlineAssets(job.svg)}</body></html>`, { waitUntil: "load", timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(150); // the logos are inline data; give them a moment to paint
      mkdirSync(dirname(job.out), { recursive: true });
      await page.screenshot({ path: job.out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
      done.add(job.out);
    }
  } catch (e) {
    console.log(`  Share images skipped: ${e.message.split("\n")[0]}`);
  } finally {
    await browser?.close().catch(() => {});
  }
  return done;
}

// ─── Posts ───────────────────────────────────────────────────────────────────────────────────────────────────────

function sources() {
  if (!existsSync(SRC)) return [];
  return readdirSync(SRC).filter((f) => f.endsWith(".md")).sort().map((f) => join(SRC, f));
}

// Reads a post's frontmatter and checks it. Throws with a plain reason when the post can't be built.
function meta(file) {
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const { data, body } = parseFrontmatter(text);
  const fileSlug = basename(file, ".md");
  const draft = fileSlug.startsWith("_");
  const slug = (data.slug || fileSlug).replace(/^\/?(?:blog\/)?/, "").replace(/\/+$/, "");
  if (!(draft ? /^_?[a-z0-9]+(?:-[a-z0-9]+)*$/ : /^[a-z0-9]+(?:-[a-z0-9]+)*$/).test(slug)) throw new Error(`slug "${slug}" must be lowercase words joined by hyphens`);
  const h1 = body.match(/^\s{0,3}#\s+(.+?)\s*#*\s*$/m)?.[1];
  const title = data.title || h1;
  if (!title) throw new Error("no title: add title: to the frontmatter");
  const topic = (data.topic || "").toLowerCase();
  if (!topic) throw new Error(`no topic: add topic: ${Object.keys(TOPICS).join(" or ")}`);
  if (!/^[a-z0-9-]+$/.test(topic)) throw new Error(`topic "${data.topic}" must be one word (${Object.keys(TOPICS).join(", ")})`);
  const updated = data.updated || data.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated || "") || Number.isNaN(Date.parse(updated))) throw new Error(`updated: "${updated || ""}" must be a date like 2026-11-03`);
  const published = /^\d{4}-\d{2}-\d{2}$/.test(data.published || data.date || "") ? data.published || data.date : updated;
  return {
    file, body, draft, slug, fileSlug, title, h1, topic, updated, published,
    type: (data.type || "").toLowerCase(),
    description: data.meta_description || data.description || data.summary || "",
    summary: data.summary || data.meta_description || "",
    keyword: data.target_keyword || "",
    readMinutes: parseInt(data.read_minutes, 10) || 0,
    data,
  };
}

function render(post, known) {
  const warnings = [];
  const ctx = {
    slug: post.slug, toc: [], faq: [], ids: new Set(), h1s: [], links: [], checks: [], visuals: 0, usesShot: false,
    review: null, listDepth: 0, ratings: 0, trees: 0, pendingFig: undefined, toolIds: new Map(),
    warn: (m) => warnings.push(m), tools: toolsIn(post.body.split("\n")),
  };
  const html = treeLinks(blocks(post.body.split("\n"), ctx), ctx);
  // Trees are pictures: their words don't count toward the post's length.
  const words = plain(html.replace(/<figure class="bl-fig bl-treefig"[\s\S]*?<\/figure>/g, " ")).split(/\s+/).filter(Boolean).length;

  // Checks that help writers; none of them stop the build.
  if (post.slug !== post.fileSlug) ctx.warn(`slug "${post.slug}" differs from the file name; the page goes to /blog/${post.slug}/`);
  if (!TOPICS[post.topic]) ctx.warn(`topic "${post.topic}" is new; known topics: ${Object.keys(TOPICS).join(", ")}`);
  if (post.type && !TYPES.includes(post.type)) ctx.warn(`type "${post.type}" isn't one of ${TYPES.join(", ")}`);
  if (!post.description) ctx.warn("no meta_description");
  else if (post.description.length < 150 || post.description.length > 160) ctx.warn(`meta_description is ${post.description.length} characters (aim for 150 to 160)`);
  if (!post.data.summary) ctx.warn("no summary (the index card uses meta_description)");
  if (!ctx.h1s.length) ctx.warn("no # title line in the body (the page uses the frontmatter title)");
  if (!ctx.toc.length) ctx.warn("no ## headings, so the table of contents is empty");
  const range = LENGTH[post.type];
  if (range && (words < range[0] * 0.95 || words > range[1] * 1.05)) ctx.warn(`${words} words; a ${post.type} post runs ${range[0]} to ${range[1]}`);
  if (ctx.visuals < 3) ctx.warn(`${ctx.visuals} visual${ctx.visuals === 1 ? "" : "s"} found; posts need at least 3`);
  if (ctx.checks.length) ctx.warn(`"check" or no price for ${[...new Set(ctx.checks)].join(", ")}: the page shows "See pricing" linked to each pricing page; write the confirmed price, "Custom", or [See pricing](url) when the page isn't at /pricing`);
  const prose = post.body.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, "");
  const dashes = (prose.match(/—/g) || []).length;
  if (dashes) ctx.warn(`${dashes} em dash${dashes > 1 ? "es" : ""}`);
  const bangs = (prose.replace(/!\[/g, "").match(/!/g) || []).length;
  if (bangs) ctx.warn(`${bangs} exclamation mark${bangs > 1 ? "s" : ""}`);
  const banned = BANNED.filter((w) => new RegExp(`\\b${w.replace(/'/g, "['’]")}\\b`, "i").test(prose));
  if (banned.length) ctx.warn(`banned words: ${banned.join(", ")}`);
  for (const url of new Set(ctx.links)) {
    const hash = url.includes("#") ? url.slice(url.indexOf("#") + 1) : "";
    const path = url.split(/[?#]/)[0];
    if (url.startsWith("#")) { if (!ctx.ids.has(hash)) ctx.warn(`link to #${hash}, which matches no heading`); continue; }
    if (!path.startsWith("/") || path.startsWith("//")) continue;
    const b = path.match(/^\/blog\/([^/]+)\/?$/);
    if (b) { if (!known.has(b[1])) ctx.warn(`link to /blog/${b[1]}/, which has no post in blog/_src yet`); continue; }
    if (path === "/" || path === "/blog/") continue;
    const local = join(root, decodeURI(path.split("?")[0]));
    const ok = path.endsWith("/") ? existsSync(join(local, "index.html")) : existsSync(local) || existsSync(join(local, "index.html"));
    if (!ok) ctx.warn(`link to ${path}, which isn't a page on this site (the server would send it to the app)`);
  }

  const readMinutes = post.readMinutes || Math.max(1, Math.round(words / 230));
  return { html, ctx, words, readMinutes, warnings };
}

// ─── Pages ───────────────────────────────────────────────────────────────────────────────────────────────────────

function head({ title, description, canonical, image, imageAlt, type = "website", extra = "" , noindex = false }) {
  const img = image ? `\n<meta property="og:image" content="${esc(image.url)}">${image.w ? `\n<meta property="og:image:width" content="${image.w}">\n<meta property="og:image:height" content="${image.h}">` : ""}\n<meta property="og:image:alt" content="${esc(imageAlt || title)}">` : "";
  return `<!doctype html>
<html lang="en-US">
<head>
<!-- head:start -->
<!-- head:end -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">${noindex ? '\n<meta name="robots" content="noindex, nofollow">' : ""}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Omniscient">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">${img}
<meta name="twitter:card" content="${image?.w ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">${image ? `\n<meta name="twitter:image" content="${esc(image.url)}">` : ""}
${extra}
</head>`;
}

const DEFAULT_IMAGE = { url: `${SITE}/assets/brand/omniscient-app-icon-512.png` };

function shareImage(slug) {
  return existsSync(join(root, "assets", "blog", slug, "og.png")) ? { url: `${SITE}/assets/blog/${slug}/og.png`, w: 1200, h: 630 } : DEFAULT_IMAGE;
}

const coverFor = (p) => labelled(coverArt({ slug: p.slug, type: p.type, topic: p.topic, title: p.title, body: p.body }), p.title);

function card(p, level) {
  const svg = coverFor(p, false).replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"').replace(/<title>[\s\S]*?<\/title>/, "");
  return `<a class="bl-card" href="/blog/${p.slug}/" data-topic="${esc(p.topic)}">
  <div class="bl-card__cover">${svg}</div>
  <div class="bl-card__body">
    <p class="bl-card__meta"><span class="bl-tag">${esc(topicName(p.topic))}</span><span>${p.readMinutes} min read</span></p>
    <h${level} class="bl-card__title">${esc(p.title)}</h${level}>
    <p class="bl-card__sum">${esc(p.summary)}</p>
  </div>
</a>`;
}

function postPage(post, r, related) {
  const url = `${SITE}/blog/${post.slug}/`;
  const image = shareImage(post.slug);
  const topicLabel = topicName(post.topic);
  const ld = [
    jsonLd({
      "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description,
      image: [image.url], datePublished: post.published, dateModified: post.updated, inLanguage: "en-US",
      articleSection: topicLabel, ...(post.keyword ? { keywords: post.keyword } : {}), wordCount: r.words,
      author: { "@type": "Organization", name: "Omniscient", url: `${SITE}/` },
      publisher: { "@type": "Organization", name: "Omniscient", url: `${SITE}/`, logo: { "@type": "ImageObject", url: DEFAULT_IMAGE.url } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url }, url,
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog/` },
        { "@type": "ListItem", position: 2, name: topicLabel, item: `${SITE}/blog/?topic=${post.topic}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    }),
  ];
  if (r.ctx.faq.length) ld.push(jsonLd({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: r.ctx.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }));
  const extra = [
    `<meta property="article:published_time" content="${post.published}">`,
    `<meta property="article:modified_time" content="${post.updated}">`,
    `<meta property="article:section" content="${esc(topicLabel)}">`,
    r.ctx.usesShot ? `<link rel="stylesheet" href="/assets/home.css">` : "",
    `<link rel="stylesheet" href="/assets/blog.css">`,
    ...ld,
    `<script src="/assets/blog.js" defer></script>`,
  ].filter(Boolean).join("\n");

  // The desktop contents list the numbered tools under their ## (3 to 15 of them); blog.js shows them while you read
  // that section. The phone contents keep the ## headings only.
  const subList = (t) => (t.subs.length >= 3 && t.subs.length <= 15
    ? `<ol class="bl-toc__sub">${t.subs.map((s) => `<li><a href="#${s.id}"><span class="bl-toc__n">${s.n}</span>${esc(s.name)}</a></li>`).join("")}</ol>`
    : "");
  const tocItems = (subs) => r.ctx.toc.map((t) => `<li${subs && subList(t) ? ' class="bl-toc__has"' : ""}><a href="#${t.id}">${t.html}</a>${subs ? subList(t) : ""}</li>`).join("");
  const toc = r.ctx.toc.length ? `<nav class="bl-toc" aria-label="On this page"><p class="bl-label">On this page</p><ol class="bl-toc__list">${tocItems(true)}</ol></nav>` : "";
  const tocPhone = r.ctx.toc.length ? `<details class="bl-toc-m"><summary>On this page</summary><ol class="bl-toc__list">${tocItems(false)}</ol></details>` : "";
  const cover = coverFor(post, false).replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"').replace(/<title>[\s\S]*?<\/title>/, "");
  const h1 = esc((post.h1 && plain(inline(post.h1, { slug: post.slug, warn() {}, links: [], visuals: 0 }))) || post.title);
  const relatedHtml = related.length ? `
  <section class="wrap bl-related" aria-labelledby="bl-related">
    <h2 class="bl-related__title" id="bl-related">Keep reading. <span class="two">More on ${esc(topicLabel)}.</span></h2>
    <div class="bl-cards">
${related.map((p) => card(p, 3)).join("\n")}
    </div>
  </section>` : "";

  return `${head({ title: `${post.title} | Omniscient`, description: post.description, canonical: url, image, imageAlt: post.title, type: "article", extra, noindex: post.draft })}
<body class="om om-blog">
<!-- header:start -->
<!-- header:end -->
<main id="main" class="site-main bl-post">
  <div class="wrap">
    <div class="bl-grid">
      <aside class="bl-side">${toc}</aside>
      <article class="bl-article">
        <header class="bl-head">
          <nav class="bl-crumb" aria-label="Breadcrumb"><ol><li><a href="/blog/">Blog</a></li><li><a href="/blog/?topic=${esc(post.topic)}">${esc(topicLabel)}</a></li></ol></nav>
          <h1 class="bl-title">${h1}</h1>
          <p class="bl-meta"><span>Updated <time datetime="${post.updated}">${prettyDate(post.updated)}</time></span><span>${r.readMinutes} min read</span></p>
        </header>
        <figure class="bl-cover">${cover}</figure>
        <div class="bl-body">
${tocPhone}
${r.html}
        </div>
      </article>
    </div>
  </div>${relatedHtml}
</main>
<!-- footer:start -->
<!-- footer:end -->
</body>
</html>
`;
}

function indexPage(posts) {
  const url = `${SITE}/blog/`;
  const counts = {};
  for (const p of posts) counts[p.topic] = (counts[p.topic] || 0) + 1;
  const topics = [...Object.keys(TOPICS), ...Object.keys(counts).filter((t) => !TOPICS[t]).sort()].filter((t) => counts[t]);
  const button = (t, label, n, on) => `<button class="bl-filter__btn" type="button" data-topic="${esc(t)}" aria-pressed="${on}">${esc(label)}<span>${n}</span></button>`;
  const filter = posts.length ? `<div class="bl-filter" role="group" aria-label="Filter by topic">${button("all", "All", posts.length, true)}${topics.map((t) => button(t, topicName(t), counts[t], false)).join("")}</div>` : "";
  const image = existsSync(join(root, "assets", "blog", "og.png")) ? { url: `${SITE}/assets/blog/og.png`, w: 1200, h: 630 } : DEFAULT_IMAGE;
  const description = "Guides, comparisons and pricing for CRM and AI agents, written by the team that builds Omniscient.";
  const extra = [
    `<link rel="stylesheet" href="/assets/blog.css">`,
    jsonLd({
      "@context": "https://schema.org", "@type": "Blog", name: "The Omniscient blog", url, description, inLanguage: "en-US",
      publisher: { "@type": "Organization", name: "Omniscient", url: `${SITE}/` },
      blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.published, dateModified: p.updated })),
    }),
    `<script src="/assets/blog.js" defer></script>`,
  ].join("\n");
  return `${head({ title: "Blog: CRM and AI agents | Omniscient", description, canonical: url, image, extra })}
<body class="om om-blog">
<!-- header:start -->
<!-- header:end -->
<main id="main" class="site-main bl-index">
  <section class="wrap bl-hero">
    <p class="bl-label">Blog</p>
    <h1 class="bl-hero__title">CRM and AI agents. <span class="two">Written by the team that builds Omniscient.</span></h1>
  </section>
  <section class="wrap bl-list" aria-label="Posts">
    ${filter}
    <div class="bl-cards">
${posts.map((p) => card(p, 2)).join("\n")}
    </div>
    <p class="bl-empty"${posts.length ? " hidden" : ""}>No posts yet</p>
  </section>
</main>
<!-- footer:start -->
<!-- footer:end -->
</body>
</html>
`;
}

// ─── Build ───────────────────────────────────────────────────────────────────────────────────────────────────────

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  const prev = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (prev !== content) writeFileSync(file, content);
  return prev !== content;
}

// Reads every source's frontmatter. Bad ones are left out here and reported when they're built.
function catalog() {
  const out = [];
  for (const file of sources()) {
    try {
      const p = meta(file);
      const words = plain(p.body.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, " ")).split(/\s+/).filter(Boolean).length;
      p.readMinutes = p.readMinutes || Math.max(1, Math.round(words / 230));
      out.push(p);
    } catch { /* reported by the build */ }
  }
  return out;
}

function relatedFor(post, pool) {
  const others = pool.filter((p) => p.slug !== post.slug && !p.draft);
  const byDate = (a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title);
  const same = others.filter((p) => p.topic === post.topic).sort(byDate);
  const rest = others.filter((p) => p.topic !== post.topic).sort(byDate);
  return [...same, ...rest].slice(0, 3);
}

function report(post, r) {
  const where = rel(join(root, "blog", post.slug, "index.html"));
  console.log(`Built ${where} (${r.words} words, ${r.readMinutes} min${post.draft ? ", draft: noindex" : ""})`);
  for (const w of r.warnings) console.log(`  ! ${w}`);
}

async function buildPosts(files, pool, { all }) {
  const built = [];
  let skipped = 0;
  const known = new Set(pool.filter((p) => !p.draft).map((p) => p.slug));
  for (const file of files) {
    try {
      const post = meta(file);
      if (post.draft && all) continue;
      const r = render(post, known);
      post.readMinutes = r.readMinutes;
      built.push({ post, r });
    } catch (e) {
      skipped++;
      console.log(`Skipped ${rel(file)}: ${e.message}`);
    }
  }

  // Covers: the SVG, then a PNG for the share image when the SVG changed or the PNG is missing.
  const jobs = [];
  for (const { post } of built) {
    const dir = join(root, "assets", "blog", post.slug);
    const svg = coverFor(post, true);
    const changed = write(join(dir, "cover.svg"), `${svg}\n`);
    if (changed || !existsSync(join(dir, "og.png"))) jobs.push({ svg, out: join(dir, "og.png") });
  }
  await renderPngs(jobs);

  // Related posts link only to pages that exist: every post in --all, built pages otherwise.
  const live = all ? built.map((b) => b.post) : pool.filter((p) => !p.draft && existsSync(join(root, "blog", p.slug, "index.html")));
  for (const { post, r } of built) {
    try {
      const page = applyLayout(postPage(post, r, relatedFor(post, live)));
      write(join(root, "blog", post.slug, "index.html"), page);
      report(post, r);
    } catch (e) {
      skipped++;
      console.log(`Skipped ${rel(post.file)}: ${e.message}`);
    }
  }
  return { built, skipped };
}

async function buildIndex(posts) {
  const list = posts.filter((p) => !p.draft).sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title));
  // The blog's own cover: Omniscient in the middle, the tools the posts cover most around it.
  const count = new Map();
  for (const p of list) for (const d of toolsOf(p.body)) if (d !== "tryomniscient.com") count.set(d, (count.get(d) || 0) + 1);
  const tools = [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([d]) => d).slice(0, 14);
  const svg = labelled(coverArt({ slug: "blog", title: "Blog", tools }), "CRM and AI agents, from the team that builds Omniscient");
  const changed = write(join(root, "assets", "blog", "cover.svg"), `${svg}\n`);
  if (changed || !existsSync(join(root, "assets", "blog", "og.png"))) await renderPngs([{ svg, out: join(root, "assets", "blog", "og.png") }]);
  write(join(root, "blog", "index.html"), applyLayout(indexPage(list)));
  console.log(`Built blog/index.html (${list.length} post${list.length === 1 ? "" : "s"})`);
}

function findSource(arg) {
  const name = basename(arg).replace(/\.md$/, "");
  const direct = join(SRC, `${name}.md`);
  if (existsSync(direct)) return direct;
  return sources().find((f) => { try { return meta(f).slug === name; } catch { return false; } }) || null;
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes("--help") || args.includes("-h")) {
    console.log("Usage:\n  node tools/blog.mjs <slug> [<slug> ...]   build one post\n  node tools/blog.mjs --all                  build every post, the index and the sitemap\n  node tools/blog.mjs --index                rebuild blog/index.html");
    return;
  }
  if (args[0] === "--all") {
    const pool = catalog();
    const { built, skipped } = await buildPosts(sources(), pool, { all: true });
    await buildIndex(built.map((b) => b.post));
    for (const dir of existsSync(join(root, "blog")) ? readdirSync(join(root, "blog")) : []) {
      if (dir.startsWith("_") || !statSync(join(root, "blog", dir)).isDirectory()) continue;
      if (!built.some((b) => b.post.slug === dir)) console.log(`  ! blog/${dir}/ has no source in blog/_src any more; delete it if the post is gone`);
    }
    const lay = spawnSync(process.execPath, [join(root, "tools", "layout.mjs")], { stdio: "inherit" });
    if (lay.status !== 0) console.log("tools/layout.mjs failed; run it by hand.");
    console.log(`Done: ${built.length} built, ${skipped} skipped.`);
    return;
  }
  if (args[0] === "--index") { await buildIndex(catalog().filter((p) => existsSync(join(root, "blog", p.slug, "index.html")))); return; }

  const pool = catalog();
  let failed = 0;
  for (const arg of args) {
    const file = findSource(arg);
    if (!file) { console.log(`Skipped ${arg}: no blog/_src/${basename(arg).replace(/\.md$/, "")}.md`); failed++; continue; }
    const { built } = await buildPosts([file], pool, { all: false });
    if (!built.length) failed++;
  }
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.log(`Blog build stopped: ${e.message}`);
  process.exitCode = 1;
});
