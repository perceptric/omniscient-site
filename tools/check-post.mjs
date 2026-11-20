// Checks a built blog post in a real browser at 1440px and 390px wide.
// Usage: node tools/check-post.mjs <slug>
// Serves the repo on a free local port, loads /blog/<slug>/, scrolls the page so lazy pictures load,
// and fails (exit 1) on sideways scroll, console errors, failed requests, broken images or a missing H1.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize, resolve } from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("usage: node tools/check-post.mjs <slug>"); process.exit(2); }
const root = resolve(new URL("..", import.meta.url).pathname);
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };

const server = createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
    let file = join(root, path);
    if (!file.startsWith(root)) throw new Error("outside");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}`;

let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); } catch { console.error("Playwright is not installed"); server.close(); process.exit(2); }
const browser = await chromium.launch();
let failed = false;
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [], bad = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(base)) bad.push(`${r.status()} ${r.url().slice(base.length)}`); });
  await page.goto(`${base}/blog/${slug}/`, { waitUntil: "networkidle" });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({
    sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
    h1: document.querySelector("h1")?.textContent?.trim() || "",
  }));
  const problems = [];
  if (r.sideways > 0) problems.push(`page scrolls sideways by ${r.sideways}px`);
  if (!r.h1) problems.push("no H1");
  if (r.broken.length) problems.push(`broken images: ${r.broken.join(", ")}`);
  if (errors.length) problems.push(`console errors: ${errors.slice(0, 5).join(" | ")}`);
  if (bad.length) problems.push(`failed requests: ${bad.slice(0, 5).join(", ")}`);
  console.log(`${width}px: ${problems.length ? "FAIL " + problems.join("; ") : "ok"} (H1: ${r.h1})`);
  if (problems.length) failed = true;
  await page.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
