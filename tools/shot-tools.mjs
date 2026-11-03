// Captures each tool's homepage and logo for the blog. Needs Playwright (Chromium) and Python with Pillow.
//
//   node tools/shot-tools.mjs <domain> [<domain> ...] [--force] [--wait ms]
//
// For each domain it opens https://<domain>/ at 1440x900, accepts or hides cookie, consent, chat and popup layers,
// and saves the first screen as assets/blog/tools/<domain>.webp (1200px wide, about 80 quality, under ~150 KB).
// It saves the site's logo as assets/blog/logos/<domain>.png (64px or larger when the site has one): the
// apple-touch-icon or a large icon link first, then Google's favicon service. Files that exist are kept unless
// --force. --wait sets how long the page settles after loading (default 1500 ms). One line per domain: ok, or
// failed with the reason. The exit code is 0 even when some fail.
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SHOTS = join(root, "assets", "blog", "tools");
const LOGOS = join(root, "assets", "blog", "logos");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const MAX_BYTES = 150 * 1024;
const PARALLEL = 3;

// Buttons that accept a cookie or consent notice, by id or class, then by their words.
const ACCEPT_SELECTORS = [
  "#onetrust-accept-btn-handler", "#accept-recommended-btn-handler", "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#CybotCookiebotDialogBodyButtonAccept", ".cky-btn-accept", "[data-testid='uc-accept-all-button']", "#hs-eu-confirmation-button",
  ".osano-cm-accept-all", "#axeptio_btn_acceptAll", ".iubenda-cs-accept-btn", "#didomi-notice-agree-button", ".cmplz-accept",
  "#cookie_action_close_header", ".cc-allow", ".cc-btn.cc-dismiss", "[data-cookiefirst-action='accept']", ".fc-cta-consent",
  "#truste-consent-button", ".termly-styles-button[data-tid='banner-accept']", "#wt-cli-accept-all-btn", ".cookie-notice-accept",
];
const ACCEPT_WORDS = /^\s*(accept( all)?( cookies)?|allow( all)?( cookies)?|agree( and close)?|i agree|i accept|got it|ok(ay)?|accept and close|accept & close|yes,? i agree|understood|alle akzeptieren|akzeptieren|tout accepter|accepter|aceptar( todo)?|accetta( tutto)?)\s*$/i;

// Layers that cover a page in a screenshot: consent tools, chat widgets and popups.
const HIDE_CSS = `
#onetrust-consent-sdk, #onetrust-banner-sdk, .onetrust-pc-dark-filter, #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay,
.cky-consent-container, .cky-overlay, #usercentrics-root, #usercentrics-cmp-ui, #hs-eu-cookie-confirmation, .osano-cm-window, .osano-cm-dialog,
#axeptio_overlay, #axeptio_main_button, #didomi-host, .iubenda-cs-container, #iubenda-cs-banner, .cmplz-cookiebanner, #cookie-law-info-bar,
.cc-window, .cc-banner, #cookiefirst-root, .fc-consent-root, #truste-consent-track, #termly-code-snippet-support, .termly-styles-root,
#cookie-notice, #cookie-banner, #cookiebanner, #cookie-consent, .cookie-banner, .cookie-consent, .cookie-notice, .cookies-banner,
[id^="cookie" i][role="dialog"], [class*="cookie-banner" i], [class*="cookieBanner"], [class*="consent-banner" i], [aria-label*="cookie" i][role="dialog"],
[aria-label*="consent" i][role="dialog"], #intercom-container, #intercom-frame, .intercom-lightweight-app, .intercom-launcher,
#hubspot-messages-iframe-container, #drift-widget-container, #drift-frame-controller, #drift-frame-chat, #crisp-chatbox, .crisp-client,
#fc_frame, #freshworks-container, #launcher-frame, #tidio-chat, #tidio-chat-iframe, #chat-widget-container, #front-chat-container,
.zsiq_floatmain, #zsiq_float, [id^="zsiq"], #livechat-compact-container, #chat-widget, iframe[title*="chat" i], iframe[src*="intercom"],
.qualified-iframe-container, #qualified-container, [class*="chatlio"], #gist-app, .gist-messenger-bubble-iframe, #beacon-container,
.grecaptcha-badge { display: none !important; visibility: hidden !important; }
html, body { overflow: visible !important; }
*, *::before, *::after { caret-color: transparent !important; }
`;

function usage() {
  console.log("Usage: node tools/shot-tools.mjs <domain> [<domain> ...] [--force] [--wait ms]");
}

function parseArgs(argv) {
  const out = { domains: [], force: false, wait: 1500 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") out.force = true;
    else if (a === "--wait") out.wait = Math.max(0, parseInt(argv[++i], 10) || 0);
    else if (a.startsWith("--wait=")) out.wait = Math.max(0, parseInt(a.slice(7), 10) || 0);
    else if (a === "-h" || a === "--help") out.help = true;
    else {
      const d = a.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/[/?#].*$/, "").toLowerCase();
      if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d)) { if (!out.domains.includes(d)) out.domains.push(d); }
      else console.log(`${a}: failed, not a domain`);
    }
  }
  return out;
}

// Python with Pillow does the image work: webp from the screenshot, png from any icon format.
const PY = String.raw`
import sys, io
from PIL import Image, ImageStat, ImageOps
mode = sys.argv[1]
if mode == "shot":
    src, out, max_bytes = sys.argv[2], sys.argv[3], int(sys.argv[4])
    im = Image.open(src).convert("RGB")
    st = ImageStat.Stat(im.convert("L"))
    if st.stddev[0] < 4:
        print("blank"); sys.exit(0)
    w = 1200
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    for q in (80, 76, 72, 68, 64, 60, 55, 50):
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= max_bytes or q == 50:
            open(out, "wb").write(buf.getvalue())
            print("ok %d %d %d %d" % (im.width, im.height, buf.tell(), q)); break
elif mode == "logo":
    src, out = sys.argv[2], sys.argv[3]
    im = Image.open(src)
    if getattr(im, "format", "") == "ICO":
        sizes = sorted(im.info.get("sizes", []) or [im.size])
        if sizes: im.size = sizes[-1]
        im.load()
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if bbox is None:
        print("empty"); sys.exit(0)
    if im.width != im.height:
        side = max(im.width, im.height)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        im = canvas
    if im.width > 256:
        im = im.resize((256, 256), Image.LANCZOS)
    im.save(out, "PNG", optimize=True)
    print("ok %d" % im.width)
`;

function python(args) {
  const r = spawnSync("python3", ["-I", "-c", PY, ...args], { encoding: "utf8" });
  if (r.status !== 0) return { ok: false, out: (r.stderr || "").trim().split("\n").pop() || "python failed" };
  return { ok: true, out: r.stdout.trim() };
}

const tmp = (name) => join(tmpdir(), `shot-tools-${process.pid}-${name}`);
const clean = (...files) => files.forEach((f) => { try { unlinkSync(f); } catch { /* gone already */ } });

async function dismissConsent(page) {
  for (const frame of page.frames()) {
    for (const sel of ACCEPT_SELECTORS) {
      const el = await frame.$(sel).catch(() => null);
      if (el && (await el.isVisible().catch(() => false))) { await el.click({ timeout: 1500 }).catch(() => {}); }
    }
    const buttons = await frame.$$("button, [role='button'], a.button, a.btn, input[type='button'], input[type='submit']").catch(() => []);
    for (const b of buttons.slice(0, 400)) {
      const text = ((await b.innerText().catch(() => "")) || (await b.getAttribute("value").catch(() => "")) || "").trim();
      if (text.length > 40 || !ACCEPT_WORDS.test(text)) continue;
      if (!(await b.isVisible().catch(() => false))) continue;
      // Only buttons inside something that looks like a notice, so a page's own "Get started" or "OK" isn't pressed.
      const inNotice = await b.evaluate((el) => {
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          const s = `${n.id} ${n.className && n.className.baseVal === undefined ? n.className : ""} ${n.getAttribute("aria-label") || ""} ${n.getAttribute("role") || ""}`;
          if (/cookie|consent|gdpr|privacy|cmp|banner|notice|dialog/i.test(s)) return true;
          const pos = getComputedStyle(n).position;
          if (pos === "fixed" || pos === "sticky") return true;
        }
        return false;
      }).catch(() => false);
      if (inNotice) { await b.click({ timeout: 1500 }).catch(() => {}); break; }
    }
  }
}

// Hides fixed layers that would cover the shot: bars at the bottom, popups in the middle, overlays over the page.
// A header pinned to the top stays.
async function hideLayers(page) {
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const header = r.top <= 1 && r.height < vh * 0.25;
      if (header) continue;
      const z = parseInt(cs.zIndex, 10) || 0;
      const big = r.width * r.height > vw * vh * 0.3 && z >= 10; // a fixed background behind the page has a low z-index
      const bottomBar = r.bottom >= vh - 4 && r.height < vh * 0.5;
      const corner = r.width < vw * 0.4 && r.height < vh * 0.7; // chat bubbles and small popups
      const text = (el.id + " " + (typeof el.className === "string" ? el.className : "")).toLowerCase();
      const looksLayer = /cookie|consent|gdpr|modal|popup|pop-up|overlay|newsletter|chat|banner|toast|backdrop|lightbox|dialog/.test(text) || el.getAttribute("role") === "dialog" || el.getAttribute("aria-modal") === "true";
      if (big || bottomBar || corner || looksLayer) el.style.setProperty("display", "none", "important");
    }
    document.documentElement.style.setProperty("overflow", "visible", "important");
    document.body && document.body.style.setProperty("overflow", "visible", "important");
    scrollTo(0, 0);
  }).catch(() => {});
}

function wallReason(title, text) {
  const t = `${title}\n${text.slice(0, 600)}`;
  if (/just a moment|attention required|checking your browser|verify you are human|cf-chl|cloudflare/i.test(t) && text.length < 2000) return "bot wall (Cloudflare)";
  if (/access denied|request blocked|forbidden|are you a robot|captcha|unusual traffic/i.test(t) && text.length < 2000) return "bot wall";
  return "";
}

async function captureShot(context, domain, wait) {
  const out = join(SHOTS, `${domain}.webp`);
  const page = await context.newPage();
  const raw = tmp(`${domain}.png`);
  try {
    let resp = null;
    try {
      resp = await page.goto(`https://${domain}/`, { waitUntil: "load", timeout: 45000 });
    } catch (e) {
      const msg = e.message.split("\n")[0];
      if (!/Timeout/i.test(msg)) return `failed: ${msg.replace(/^page\.goto:\s*/, "")}`;
      // A page that never finishes loading still shows; carry on with what has drawn.
    }
    const status = resp ? resp.status() : 0;
    await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(wait);
    await dismissConsent(page);
    await page.waitForTimeout(600);
    await hideLayers(page);
    await page.waitForTimeout(400);
    const title = await page.title().catch(() => "");
    const text = await page.evaluate(() => document.body ? document.body.innerText : "").catch(() => "");
    const wall = wallReason(title, text);
    if (wall) return `failed: ${wall}${status ? ` (HTTP ${status})` : ""}`;
    if (status >= 400) return `failed: HTTP ${status}`;
    await page.screenshot({ path: raw, clip: { x: 0, y: 0, width: 1440, height: 900 }, animations: "disabled" });
    const r = python(["shot", raw, out, String(MAX_BYTES)]);
    if (!r.ok) return `failed: ${r.out}`;
    if (r.out === "blank") return "failed: blank page";
    const [, w, h, bytes, q] = r.out.split(" ");
    return `ok (${w}x${h}, ${Math.round(bytes / 1024)} KB, q${q})`;
  } finally {
    clean(raw);
    await page.close().catch(() => {});
  }
}

// Icon links from the page, biggest first: apple-touch-icon, then sized icons, then the rest.
async function iconCandidates(context, domain) {
  const page = await context.newPage();
  try {
    await page.goto(`https://${domain}/`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
    const links = await page.evaluate(() => [...document.querySelectorAll("link[rel*='icon' i], link[rel='apple-touch-icon-precomposed' i], link[rel='mask-icon' i]")].map((l) => ({
      href: l.href, rel: (l.getAttribute("rel") || "").toLowerCase(), sizes: (l.getAttribute("sizes") || "").toLowerCase(), type: (l.getAttribute("type") || "").toLowerCase(),
    }))).catch(() => []);
    const score = (l) => {
      const s = l.sizes === "any" ? 512 : Math.max(0, ...l.sizes.split(/\s+/).map((x) => parseInt(x, 10) || 0));
      if (l.rel.includes("mask-icon")) return -1; // one-color outline for Safari pinned tabs: not a logo
      if (l.rel.includes("apple-touch-icon")) return 10000 + (s || 180);
      if (l.rel === "manifest") return 8000 + Math.min(s, 512);
      if (/svg/.test(l.type) || /\.svg(\?|$)/i.test(l.href)) return 5000;
      return s;
    };
    // A web app manifest often lists 192px and 512px icons.
    const manifest = await page.evaluate(() => document.querySelector("link[rel='manifest' i]")?.href || "").catch(() => "");
    if (manifest) {
      try {
        const res = await context.request.get(manifest, { timeout: 10000, failOnStatusCode: false });
        const icons = res.ok() ? (JSON.parse((await res.text()).replace(/^\uFEFF/, "")).icons || []) : [];
        for (const ic of icons) {
          if (!ic || !ic.src || /monochrome/i.test(ic.purpose || "")) continue;
          links.push({ href: new URL(ic.src, manifest).href, rel: "manifest", sizes: String(ic.sizes || "").toLowerCase(), type: String(ic.type || "").toLowerCase() });
        }
      } catch { /* no manifest icons */ }
    }
    const seen = new Set();
    const list = links.filter((l) => l.href && /^https?:/i.test(l.href) && score(l) >= 0).sort((a, b) => score(b) - score(a)).map((l) => l.href).filter((h) => !seen.has(h) && seen.add(h));
    list.push(new URL("/apple-touch-icon.png", `https://${domain}/`).href);
    return list;
  } finally {
    await page.close().catch(() => {});
  }
}

// An SVG icon is drawn by the browser at 128px on a clear background.
async function svgToPng(context, svgText, file) {
  const page = await context.newPage({ viewport: { width: 128, height: 128 } }).catch(() => context.newPage());
  try {
    await page.setViewportSize({ width: 128, height: 128 });
    const data = `data:image/svg+xml;base64,${Buffer.from(svgText).toString("base64")}`;
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent"><img id="i" src="${data}" style="width:128px;height:128px;object-fit:contain;display:block"></body></html>`);
    await page.waitForFunction(() => document.getElementById("i").complete, null, { timeout: 5000 }).catch(() => {});
    await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: 128, height: 128 } });
    return true;
  } catch { return false; } finally { await page.close().catch(() => {}); }
}

async function saveLogo(context, domain) {
  const out = join(LOGOS, `${domain}.png`);
  const candidates = [...(await iconCandidates(context, domain)), `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`];
  let best = null; // the largest one under 64px, kept in case nothing bigger turns up
  for (const url of candidates) {
    const raw = tmp(`${domain}-icon`);
    const png = tmp(`${domain}-icon.png`);
    try {
      const res = await context.request.get(url, { timeout: 15000, failOnStatusCode: false });
      if (!res.ok()) continue;
      const body = await res.body();
      if (body.length < 100) continue;
      const type = (res.headers()["content-type"] || "").toLowerCase();
      const isSvg = /svg/.test(type) || /^\s*(<\?xml[^>]*>\s*)?<svg/i.test(body.slice(0, 300).toString("utf8"));
      if (/text\/html/.test(type) && !isSvg) continue;
      let src = raw;
      if (isSvg) { if (!(await svgToPng(context, body.toString("utf8"), png))) continue; src = png; }
      else writeFileSync(raw, body);
      const r = python(["logo", src, tmp(`${domain}-logo.png`)]);
      if (!r.ok || !r.out.startsWith("ok")) continue;
      const size = parseInt(r.out.split(" ")[1], 10);
      const from = url.includes("google.com/s2/favicons") ? "google" : isSvg ? "svg icon" : url.includes("apple-touch") ? "apple-touch-icon" : "icon";
      if (size >= 64) {
        python(["logo", src, out]);
        clean(tmp(`${domain}-logo.png`), best?.file || "");
        return `logo ${size}px from ${from}`;
      }
      if (!best || size > best.size) {
        const keep = tmp(`${domain}-best-${size}`);
        writeFileSync(keep, readFileSync(src));
        clean(best?.file || "");
        best = { size, file: keep, from };
      }
    } catch { /* try the next one */ } finally {
      clean(raw, png, tmp(`${domain}-logo.png`));
    }
  }
  if (best) {
    python(["logo", best.file, out]);
    clean(best.file);
    return `logo only ${best.size}px from ${best.from}`;
  }
  return "logo failed: no icon found";
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.domains.length) { usage(); return; }
  let chromium;
  try { ({ chromium } = createRequire(import.meta.url)("playwright")); } catch {
    for (const d of opts.domains) console.log(`${d}: failed, Playwright isn't installed`);
    return;
  }
  mkdirSync(SHOTS, { recursive: true });
  mkdirSync(LOGOS, { recursive: true });
  // Outbound traffic goes through the session's proxy. Chromium trusts its CA through the system NSS store.
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  let browser;
  try {
    browser = await chromium.launch({ ...(proxy ? { proxy: { server: proxy } } : {}), args: ["--disable-blink-features=AutomationControlled"] });
  } catch (e) {
    for (const d of opts.domains) console.log(`${d}: failed, Chromium didn't start (${e.message.split("\n")[0]})`);
    return;
  }
  const queue = [...opts.domains];
  const worker = async () => {
    while (queue.length) {
      const domain = queue.shift();
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, userAgent: UA, locale: "en-US", timezoneId: "America/New_York" });
      const parts = [];
      let failed = false;
      try {
        const shotFile = join(SHOTS, `${domain}.webp`);
        if (!opts.force && existsSync(shotFile)) parts.push("screenshot kept");
        else {
          const r = await captureShot(context, domain, opts.wait).catch((e) => `failed: ${e.message.split("\n")[0]}`);
          if (r.startsWith("failed")) { failed = true; parts.push(`screenshot ${r}`); }
          else parts.push(`screenshot ${r}`);
        }
        const logoFile = join(LOGOS, `${domain}.png`);
        if (!opts.force && existsSync(logoFile)) parts.push("logo kept");
        else {
          const r = await saveLogo(context, domain).catch((e) => `logo failed: ${e.message.split("\n")[0]}`);
          if (r.startsWith("logo failed")) failed = true;
          parts.push(r);
        }
      } finally {
        await context.close().catch(() => {});
      }
      console.log(`${domain}: ${failed ? "failed" : "ok"}, ${parts.join(", ")}`);
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.min(PARALLEL, opts.domains.length) }, worker));
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((e) => { console.log(`shot-tools stopped: ${e.message}`); }).finally(() => { process.exitCode = 0; });
