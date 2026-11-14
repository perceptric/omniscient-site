// Blog covers: picture-only art in the calm style (docs/brand.md in the app repo). No words: the post's title is on
// the page. Each post gets a scene from its type and slug: an orbit of alternatives around the tool they replace,
// two tools face to face, a ranked list in a product window, or a scene drawn for the topic (limits, pricing,
// safety, data entry, sync). Logos come from tools/cover-logos.json (built from assets/blog/logos and the vector marks
// in assets/blog/marks). Everything is seeded by the slug, so a cover only changes when its post or this file does.
//
//   coverArt({ slug, type, topic, title, body })  -> an <svg> string, 1200x630
//
// The SVG names its logos by site path (/assets/...). tools/blog.mjs inlines them as data when it renders og.png.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const LOGOS = JSON.parse(readFileSync(new URL("./cover-logos.json", import.meta.url), "utf8"));

const W = 1200;
const H = 630;
const C = {
  page: "#fafafa", surface: "#ffffff", s2: "#f5f5f5", rail: "#ebebea", line: "#ebebeb",
  ink: "#0a0a0a", text: "#171717", meta: "#737373", faint: "#a3a3a3", bar: "#e4e4e2", bar2: "#efefed",
  // The brand accent is black: what was green is now ink, and its tints are plain grays.
  green: "#0a0a0a", greenStrong: "#0a0a0a", greenInk: "#0a0a0a", g50: "#f6f6f5", g100: "#ededeb", g200: "#dcdcd9", g300: "#b9b9b5",
  mint: "#ffffff", dark: "#0a0a0a", dark2: "#1c1c1c", dark3: "#2e2e2e", amber: "#ea7a1a", red: "#dc2626", linkedin: "#0a66c2",
};

// Names a title or slug can carry, to the tool's domain.
const NAMES = [
  ["linked helper", "linkedhelper.com"], ["linkedhelper", "linkedhelper.com"], ["linked-helper", "linkedhelper.com"],
  ["omniscient", "tryomniscient.com"], ["attio", "attio.com"], ["hubspot", "hubspot.com"], ["folk", "folk.app"],
  ["pipedrive", "pipedrive.com"], ["salesforce", "salesforce.com"], ["heyreach", "heyreach.io"], ["expandi", "expandi.io"],
  ["dripify", "dripify.com"], ["lemlist", "lemlist.com"], ["waalaxy", "waalaxy.com"], ["zoho", "zoho.com"],
  ["close", "close.com"], ["monday", "monday.com"], ["salesflare", "salesflare.com"], ["copper", "copper.com"],
  ["skylead", "skylead.io"], ["dux-soup", "dux-soup.com"], ["dux soup", "dux-soup.com"], ["meetalfred", "meetalfred.com"],
];

// ─── Small helpers ───────────────────────────────────────────────────────────────────────────────────────────────

function hashOf(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
function rngFor(seed) {
  let a = hashOf(seed);
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f1 = (n) => (Math.round(n * 10) / 10).toString();
const rad = (deg) => (deg * Math.PI) / 180;
const polar = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
const attr = (o) => Object.entries(o).filter(([, v]) => v != null && v !== false).map(([k, v]) => `${k}="${v}"`).join(" ");

const known = (dom) => dom === "tryomniscient.com" || !!LOGOS[dom] || existsSync(join(root, "assets", "blog", "logos", `${dom}.png`));
const logo = (dom) => LOGOS[dom] || { mode: "inset", color: "#737373", src: `/assets/blog/logos/${dom}.png` };
const colorOf = (dom) => (dom === "tryomniscient.com" ? C.green : logo(dom).color || "#737373");
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; };
// A soft glow in the tool's color; a quiet white plate for near-black logos, whose glow reads as gray.
const glowFill = (dom) => (dom === "tryomniscient.com" ? C.green : lum(colorOf(dom)) < 0.22 ? "#ffffff" : colorOf(dom));

// The tools in a post's first ```tools block, in order, by domain.
export function toolsOf(body = "") {
  const m = body.match(/```tools\n([\s\S]*?)```/);
  if (!m) return [];
  const out = [];
  for (const line of m[1].split("\n")) {
    const c = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((x) => x.trim());
    const d = (c[1] || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) && !out.includes(d)) out.push(d);
  }
  return out;
}

function domainsIn(text) {
  const t = ` ${text.toLowerCase()} `;
  const hits = [];
  for (const [name, dom] of NAMES) {
    const at = t.search(new RegExp(`[^a-z]${name.replace(/[-\s]/g, "[-\\s]?")}[^a-z]`));
    if (at >= 0 && !hits.some((h) => h.dom === dom)) hits.push({ dom, at });
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.dom);
}

// ─── The drawing kit ─────────────────────────────────────────────────────────────────────────────────────────────

function kit(id) {
  let n = 0;
  const defs = [];
  const uid = (k) => `${id}-${k}${n++}`;
  const S = `url(#${id}-s)`;
  const L = `url(#${id}-l)`;

  // A raised white card: soft shadow, then a 1px ring.
  const card = (x, y, w, h, r = 16, o = {}) =>
    `<rect ${attr({ x: f1(x), y: f1(y), width: f1(w), height: f1(h), rx: r, fill: o.fill || C.surface, filter: o.flat ? null : o.big ? L : S })}/>` +
    `<rect ${attr({ x: f1(x + 0.5), y: f1(y + 0.5), width: f1(w - 1), height: f1(h - 1), rx: r - 0.5, fill: "none", stroke: o.ring || "#000", "stroke-opacity": o.ringOpacity ?? 0.06 })}/>`;

  const bar = (x, y, w, h, fill = C.bar, r) => `<rect ${attr({ x: f1(x), y: f1(y), width: f1(w), height: f1(h), rx: f1(r ?? Math.min(w, h) / 2), fill })}/>`;

  // The Omniscient mark on its black tile: the white Checker, the same squares as the site's logo.
  const CHECKER = `<rect x="8" y="22" width="6" height="6" rx="0.8"/><rect x="8" y="36" width="6" height="6" rx="0.8"/><rect x="15" y="15" width="6" height="6" rx="0.8"/><rect x="15" y="29" width="6" height="6" rx="0.8"/><rect x="15" y="43" width="6" height="6" rx="0.8"/><rect x="22" y="8" width="6" height="6" rx="0.8"/><rect x="22" y="22" width="6" height="6" rx="0.8"/><rect x="22" y="36" width="6" height="6" rx="0.8"/><rect x="22" y="50" width="6" height="6" rx="0.8"/><rect x="29" y="15" width="6" height="6" rx="0.8"/><rect x="29" y="43" width="6" height="6" rx="0.8"/><rect x="36" y="8" width="6" height="6" rx="0.8"/><rect x="36" y="22" width="6" height="6" rx="0.8"/><rect x="36" y="36" width="6" height="6" rx="0.8"/><rect x="36" y="50" width="6" height="6" rx="0.8"/><rect x="43" y="15" width="6" height="6" rx="0.8"/><rect x="43" y="29" width="6" height="6" rx="0.8"/><rect x="43" y="43" width="6" height="6" rx="0.8"/><rect x="50" y="22" width="6" height="6" rx="0.8"/><rect x="50" y="36" width="6" height="6" rx="0.8"/><rect x="29" y="29" width="6" height="6" rx="0.8"/>`;
  const omni = (cx, cy, s, o = {}) => {
    const r = s * 0.24;
    let out = "";
    if (o.glow) {
      out += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(s * 0.95)}" fill="${C.ink}" opacity=".08" filter="url(#${id}-b)"/>`;
      out += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(s * 0.74)}" fill="none" stroke="${C.ink}" stroke-opacity=".14" stroke-width="1.5"/>`;
    }
    out += `<rect ${attr({ x: f1(cx - s / 2), y: f1(cy - s / 2), width: f1(s), height: f1(s), rx: f1(r), fill: C.dark, filter: o.big ? L : S })}/>`;
    out += `<rect ${attr({ x: f1(cx - s / 2 + 0.5), y: f1(cy - s / 2 + 0.5), width: f1(s - 1), height: f1(s - 1), rx: f1(r - 0.5), fill: "none", stroke: "#fff", "stroke-opacity": 0.1 })}/>`;
    const m = s * 0.64, k = m / 64;
    out += `<g fill="#fff" transform="translate(${f1(cx - m / 2)} ${f1(cy - m / 2)}) scale(${(Math.round(k * 1000) / 1000).toString()})">${CHECKER}</g>`;
    return out;
  };

  // A tool's logo on a raised tile, centered on cx, cy.
  const tile = (cx, cy, s, dom, o = {}) => {
    if (dom === "tryomniscient.com") return omni(cx, cy, s, o);
    const lg = logo(dom);
    const r = s * 0.24;
    const x = cx - s / 2;
    const y = cy - s / 2;
    const clip = uid("c");
    let out = "";
    if (o.glow) out += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(s * 0.9)}" fill="${o.glowColor || colorOf(dom)}" opacity=".16" filter="url(#${id}-b)"/>`;
    out += card(x, y, s, s, r, { big: o.big });
    if (lg.mode === "fill") {
      defs.push(`<clipPath id="${clip}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s)}" rx="${f1(r)}"/></clipPath>`);
      out += `<image href="${lg.src}" x="${f1(x)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;
      out += `<rect ${attr({ x: f1(x + 0.5), y: f1(y + 0.5), width: f1(s - 1), height: f1(s - 1), rx: f1(r - 0.5), fill: "none", stroke: "#000", "stroke-opacity": 0.06 })}/>`;
    } else {
      const p = s * (o.pad ?? 0.2);
      out += `<image href="${lg.src}" x="${f1(x + p)}" y="${f1(y + p)}" width="${f1(s - 2 * p)}" height="${f1(s - 2 * p)}" preserveAspectRatio="xMidYMid meet"/>`;
    }
    return out;
  };

  // A small green badge with a check, on the top right of a tile.
  const check = (cx, cy, r = 13) =>
    `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r + 3)}" fill="#fff"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${C.greenStrong}"/>` +
    `<path d="M${f1(cx - r * 0.42)} ${f1(cy + r * 0.02)} l${f1(r * 0.3)} ${f1(r * 0.3)} l${f1(r * 0.56)} ${f1(-r * 0.6)}" fill="none" stroke="#fff" stroke-width="${f1(r * 0.2)}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // A line icon (24px grid, Lucide-like) at x, y with size s.
  const icon = (name, x, y, s = 24, color = C.meta, w = 1.75) => {
    const p = ICONS[name];
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s / 24)})" fill="none" stroke="${color}" stroke-width="${f1((w * 24) / s)}" stroke-linecap="round" stroke-linejoin="round">${p}</g>`;
  };

  // A green connector with a dot at its end.
  const link = (d, o = {}) =>
    `<path d="${d}" fill="none" stroke="${o.color || C.green}" stroke-width="${o.w || 2}" stroke-linecap="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""} opacity="${o.opacity ?? 0.85}"/>`;
  const dot = (x, y, r = 5, fill = C.green) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 2.5)}" fill="#fff"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}"/>`;

  // Otto, the owl, as in the app.
  const otto = (cx, cy, s) => {
    const k = s / 64;
    return `<g transform="translate(${f1(cx - s / 2)} ${f1(cy - s / 2)}) scale(${f1(k)})"><path d="M10 26V6A20 20 0 0 1 30 26Z" fill="${C.dark}"/><path d="M54 26V6A20 20 0 0 0 34 26Z" fill="${C.dark}"/><rect x="8" y="16" width="48" height="44" rx="18" fill="${C.dark}"/><circle cx="22.5" cy="33" r="9.5" fill="#fff"/><circle cx="41.5" cy="33" r="9.5" fill="#fff"/><circle cx="24" cy="33" r="4.4" fill="${C.ink}"/><circle cx="43" cy="33" r="4.4" fill="${C.ink}"/><circle cx="25.4" cy="31.4" r="1.4" fill="#fff"/><circle cx="44.4" cy="31.4" r="1.4" fill="#fff"/><path d="M32 43l3.2 3.6L32 50l-3.2-3.4z" fill="#d4d4d4"/></g>`;
  };

  // A fit score drawn with the mark's four quarters (the app's Quarters).
  const quarters = (cx, cy, s, filled) => {
    const Q = ["M30 30H4A26 26 0 0 1 30 4Z", "M34 30V4A26 26 0 0 1 60 30Z", "M34 34H60A26 26 0 0 1 34 60Z", "M30 34V60H4V34Z"];
    return `<g transform="translate(${f1(cx - s / 2)} ${f1(cy - s / 2)}) scale(${f1(s / 64)})">${Q.map((d, i) => `<path d="${d}" fill="${i < filled ? C.green : "#e2e2de"}"/>`).join("")}</g>`;
  };

  // A face: a soft circle with a head and shoulders.
  const face = (cx, cy, r, tone = C.g200, ink = C.greenInk) =>
    `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${tone}"/>` +
    `<circle cx="${f1(cx)}" cy="${f1(cy - r * 0.18)}" r="${f1(r * 0.3)}" fill="${ink}" opacity=".55"/>` +
    `<path d="M${f1(cx - r * 0.55)} ${f1(cy + r * 0.62)}a${f1(r * 0.55)} ${f1(r * 0.48)} 0 0 1 ${f1(r * 1.1)} 0" fill="${ink}" opacity=".55"/>`;

  const filters = () =>
    `<filter id="${id}-s" x="-40%" y="-40%" width="180%" height="190%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity=".06"/><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".07"/></filter>` +
    `<filter id="${id}-l" x="-30%" y="-30%" width="160%" height="170%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".05"/><feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#000" flood-opacity=".12"/></filter>` +
    `<filter id="${id}-b" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="22"/></filter>`;

  return { id, uid, defs, card, bar, omni, tile, check, icon, link, dot, otto, quarters, face, filters };
}

const ICONS = {
  check: `<path d="M20 6 9 17l-5-5"/>`,
  sparkle: `<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>`,
  userPlus: `<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>`,
  message: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  reply: `<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>`,
  arrows: `<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>`,
  shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  mail: `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>`,
  calendar: `<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`,
  video: `<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  flag: `<path d="M4 22V4h13l-2 4 2 4H4"/>`,
  users: `<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"/>`,
  trend: `<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>`,
  lock: `<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
};

// ─── Backgrounds ─────────────────────────────────────────────────────────────────────────────────────────────────

// A field of small rounded tiles that fills in toward the edges and leaves the middle clear (Claritia's tile field).
function field(kind, rnd, o = {}) {
  const base = { paper: C.page, mint: C.g100, dark: C.dark }[kind];
  const step = 30;
  const cell = 24;
  const cols = Math.ceil(W / step) + 1;
  const rows = Math.ceil(H / step) + 1;
  const ox = (W - (cols - 1) * step - cell) / 2;
  const oy = (H - (rows - 1) * step - cell) / 2;
  const cx = o.cx ?? W / 2;
  const cy = o.cy ?? H / 2;
  const rx = o.rx ?? 0.56;
  const ry = o.ry ?? 0.62;
  let out = `<rect width="${W}" height="${H}" fill="${base}"/>`;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = ox + i * step;
      const y = oy + j * step;
      const dx = (x + cell / 2 - cx) / (W * rx);
      const dy = (y + cell / 2 - cy) / (H * ry);
      const d = Math.sqrt(dx * dx + dy * dy);
      const e = Math.min(1, Math.max(0, (d - 0.62) / 0.5));
      const t = rnd();
      if (kind === "paper") {
        if (t > e * 0.9) continue;
        const a = 0.05 + rnd() * 0.22 * e + (rnd() < 0.05 * e ? 0.45 : 0);
        out += `<rect x="${f1(x)}" y="${f1(y)}" width="${cell}" height="${cell}" rx="6" fill="${C.green}" fill-opacity="${f1(a * 100) / 100}"/>`;
      } else if (kind === "mint") {
        if (t > 0.05 + e * 0.82) continue;
        const pick = rnd();
        const fill = pick < 0.07 * e ? C.green : pick < 0.2 + 0.4 * e ? C.g300 : C.g200;
        const a = 0.35 + rnd() * 0.65 * Math.max(0.35, e);
        out += `<rect x="${f1(x)}" y="${f1(y)}" width="${cell}" height="${cell}" rx="6" fill="${fill}" fill-opacity="${f1(a * 100) / 100}"/>`;
      } else {
        if (t > 0.06 + e * 0.8) continue;
        const pick = rnd();
        const fill = pick < 0.06 * e ? C.green : pick < 0.5 ? C.dark2 : C.dark3;
        out += `<rect x="${f1(x)}" y="${f1(y)}" width="${cell}" height="${cell}" rx="6" fill="${fill}" fill-opacity="${f1((0.5 + rnd() * 0.5) * 100) / 100}"/>`;
      }
    }
  }
  return out;
}

// ─── Scenes ──────────────────────────────────────────────────────────────────────────────────────────────────────

// Alternatives: the tool sits in the middle; the others circle it, and a green path leads to Omniscient.
function orbit(k, rnd, { subject, others, center = "subject" }) {
  const cx = 600;
  const cy = 315;
  const R = [150, 236, 330];
  const rot = Math.floor(rnd() * 360);
  let out = "";
  out += `<circle cx="${cx}" cy="${cy}" r="${R[0]}" fill="none" stroke="${C.ink}" stroke-opacity=".08" stroke-width="1.5"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="${R[1]}" fill="none" stroke="${C.ink}" stroke-opacity=".09" stroke-width="1.5" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="${R[2]}" fill="none" stroke="${C.ink}" stroke-opacity=".07" stroke-width="1.5"/>`;
  // A soft plate behind the middle.
  out += `<circle cx="${cx}" cy="${cy}" r="${R[0] - 22}" fill="#fff" opacity=".7"/>`;
  const omniAt = -38 + Math.floor(rnd() * 20) - 10;
  // The green path along the inner ring to Omniscient.
  const a0 = omniAt - 70;
  const [sx, sy] = polar(cx, cy, R[0], a0);
  const [ex, ey] = polar(cx, cy, R[0], omniAt);
  out += k.link(`M${f1(sx)} ${f1(sy)} A${R[0]} ${R[0]} 0 0 1 ${f1(ex)} ${f1(ey)}`, { w: 3, opacity: 0.9 });
  out += k.dot(sx, sy, 5);
  // Others: the inner ring gets 3, the middle ring 6, the outer ring 4 near the sides.
  const slots = [];
  const inner = center === "omni" ? [omniAt, omniAt + 95, omniAt + 165, omniAt + 245] : [omniAt + 95, omniAt + 165, omniAt + 245];
  inner.forEach((a) => slots.push({ r: R[0], a, s: 74 }));
  const gapTo = (a) => Math.min(...inner.concat(center === "omni" ? [] : [omniAt]).map((b) => Math.abs((((a - b) % 360) + 540) % 360 - 180)));
  let best = rot;
  let bestGap = -1;
  for (let t = 0; t < 60; t += 4) {
    const g = Math.min(...[0, 1, 2, 3, 4, 5].map((i) => gapTo(rot + t + i * 60)));
    if (g > bestGap) { bestGap = g; best = rot + t; }
  }
  for (let i = 0; i < 6; i++) slots.push({ r: R[1], a: best + i * 60, s: 84 });
  [-14, 14, 166, 194].forEach((a) => slots.push({ r: R[2], a: a + (rnd() * 8 - 4), s: 70 }));
  // Small dots ride the rings.
  for (let i = 0; i < 7; i++) {
    const r = R[i % 3];
    const [x, y] = polar(cx, cy, r, rnd() * 360);
    out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i % 3 === 0 ? 4 : 3}" fill="${i % 2 ? C.green : C.ink}" opacity="${i % 2 ? 0.7 : 0.18}"/>`;
  }
  const list = others.filter(known);
  slots.forEach((sl, i) => {
    const dom = list[i];
    if (!dom) return;
    const [x, y] = polar(cx, cy, sl.r, sl.a);
    if (y < -10 || y > H + 10) return;
    out += k.tile(x, y, sl.s, dom);
  });
  if (center !== "omni") out += k.tile(ex, ey, 104, "tryomniscient.com", { glow: true });
  out += center === "omni" ? k.omni(cx, cy, 160, { glow: true, big: true }) : k.tile(cx, cy, 156, subject, { big: true });
  return out;
}

// Versus: two tools face to face over a butterfly chart in their own colors.
function versus(k, rnd, { a, b }) {
  const ca = colorOf(a);
  const cb = colorOf(b);
  let out = "";
  out += `<circle cx="330" cy="235" r="210" fill="${glowFill(a)}" opacity="${glowFill(a) === "#ffffff" ? 0.85 : 0.14}" filter="url(#${k.id}-b)"/>`;
  out += `<circle cx="870" cy="235" r="210" fill="${glowFill(b)}" opacity="${glowFill(b) === "#ffffff" ? 0.85 : 0.14}" filter="url(#${k.id}-b)"/>`;
  out += `<line x1="600" y1="70" x2="600" y2="560" stroke="${C.ink}" stroke-opacity=".1" stroke-width="1.5" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  // The chart: rows of bars from the middle out.
  const rows = 5;
  const top = 392;
  for (let i = 0; i < rows; i++) {
    const y = top + i * 30;
    const la = 90 + rnd() * 250;
    const lb = 90 + rnd() * 250;
    out += k.bar(600 - 30 - la, y, la, 14, ca);
    out += k.bar(630, y, lb, 14, cb);
    out += `<circle cx="600" cy="${y + 7}" r="4" fill="${C.ink}" opacity=".18"/>`;
  }
  out += k.tile(330, 220, 172, a, { big: true });
  out += k.tile(870, 220, 172, b, { big: true });
  // The switch between them.
  out += `<circle cx="600" cy="220" r="36" fill="#fff" filter="url(#${k.id}-s)"/><circle cx="600" cy="220" r="35.5" fill="none" stroke="#000" stroke-opacity=".06"/>`;
  out += k.icon("arrows", 586, 206, 28, C.ink, 2);
  return out;
}

// A product window: a top bar with three dots and an empty address pill.
function windowFrame(k, x, y, w, h, o = {}) {
  let out = k.card(x, y, w, h, 20, { big: true });
  out += `<circle cx="${x + 24}" cy="${y + 22}" r="5" fill="#e2e2de"/><circle cx="${x + 42}" cy="${y + 22}" r="5" fill="#e2e2de"/><circle cx="${x + 60}" cy="${y + 22}" r="5" fill="#e2e2de"/>`;
  if (!o.noUrl) out += k.bar(x + w / 2 - 90, y + 13, 180, 18, C.s2, 9);
  out += `<line x1="${x}" y1="${y + 44}" x2="${x + w}" y2="${y + 44}" stroke="${C.line}"/>`;
  return out;
}

// A ranked list of tools in a window: fit marks, logos, skeleton text, ratings. The first row is picked.
function listWindow(k, rnd, x, y, w, h, tools) {
  let out = windowFrame(k, x, y, w, h);
  const rowH = 58;
  const n = Math.min(tools.length, Math.floor((h - 60) / rowH));
  for (let i = 0; i < n; i++) {
    const ry = y + 52 + i * rowH;
    if (i === 0) out += `<rect x="${x + 10}" y="${ry + 2}" width="${w - 20}" height="${rowH - 6}" rx="12" fill="${C.g50}"/><rect x="${x + 10.5}" y="${ry + 2.5}" width="${w - 21}" height="${rowH - 7}" rx="11.5" fill="none" stroke="${C.g200}"/>`;
    else out += `<line x1="${x + 24}" y1="${ry}" x2="${x + w - 24}" y2="${ry}" stroke="${C.line}"/>`;
    const mid = ry + rowH / 2 - 1;
    out += k.quarters(x + 38, mid, 18, Math.max(1, 4 - Math.floor(i / 2)));
    out += k.tile(x + 82, mid, 38, tools[i]);
    const nw = 120 + rnd() * 90;
    out += k.bar(x + 116, mid - 10, nw, 9, i === 0 ? C.g300 : "#dcdcd8");
    out += k.bar(x + 116, mid + 4, 70 + rnd() * 120, 7, i === 0 ? C.g200 : C.bar2);
    const rx = x + w - 150;
    const score = 5 - Math.floor(i / 2);
    for (let j = 0; j < 5; j++) out += k.bar(rx + j * 22, mid - 4, 16, 8, j < score ? (i === 0 ? C.green : "#bdbdb8") : "#ececea", 4);
    if (i === 0) out += k.check(x + w - 30, mid, 11);
  }
  return out;
}

// Best-of, three ways: a podium beside the ranked list, the same mirrored, or a grid of tools with the pick lifted.
function bestOf(k, rnd, { tools, accent, layout = "podium" }) {
  const list = tools.filter(known);
  if (layout === "grid") return bestGrid(k, rnd, { list, accent });
  const top = list.slice(0, 3);
  const flip = layout === "mirror";
  const wx = flip ? 68 : 520;
  const px = flip ? 632 : 0;
  const extra = accentOf(k, rnd, accent);
  let out = extra.back;
  out += listWindow(k, rnd, wx, 72, 612, 486, list.slice(0, 7));
  // The podium: three steps that run off the bottom, the picks standing on them.
  const base = 660;
  const steps = [
    { x: px + 92, w: 128, h: 250, t: top[1], s: 92, q: 3 },
    { x: px + 228, w: 136, h: 318, t: top[0], s: 118, q: 4 },
    { x: px + 372, w: 128, h: 210, t: top[2], s: 86, q: 2 },
  ];
  for (const st of steps) {
    const y = base - st.h;
    out += k.card(st.x, y, st.w, st.h + 20, 18, { fill: st.q === 4 ? C.g50 : "#fff", ring: st.q === 4 ? C.green : "#000", ringOpacity: st.q === 4 ? 0.3 : 0.06 });
    out += k.quarters(st.x + st.w / 2, y + 40, 30, st.q);
    for (let j = 0; j < 3; j++) out += k.bar(st.x + 30, y + 76 + j * 18, st.w - 60 - j * 18, 7, st.q === 4 ? C.g200 : C.bar2);
  }
  steps.forEach((st) => {
    if (!st.t) return;
    out += k.tile(st.x + st.w / 2, base - st.h - st.s / 2 - 20, st.s, st.t, { glow: st.q === 4 });
  });
  if (top[0]) out += k.check(px + 228 + 68 + 50, base - 318 - 118 - 20 + 8, 16);
  out += flip ? `<g transform="translate(-452 0)">${extra.front}</g>` : extra.front;
  return out;
}

// A grid of the tools in a window, the pick lifted out of it with a green ring; ranked cards beside it.
function bestGrid(k, rnd, { list, accent }) {
  let out = "";
  const wx = 70;
  const wy = 70;
  const ww = 620;
  const wh = 490;
  out += windowFrame(k, wx, wy, ww, wh);
  const cols = 4;
  const cell = ww / cols;
  const grid = list.filter((d) => d !== "tryomniscient.com").slice(0, 11);
  grid.splice(5, 0, "tryomniscient.com");
  grid.slice(0, 12).forEach((d, i) => {
    const cx = wx + cell * (i % cols) + cell / 2;
    const cy = wy + 116 + Math.floor(i / cols) * 140;
    const me = d === "tryomniscient.com";
    if (me) out += `<rect x="${f1(cx - 62)}" y="${f1(cy - 62)}" width="124" height="150" rx="22" fill="${C.g50}" stroke="${C.green}" stroke-opacity=".45" stroke-width="1.5"/>`;
    out += k.tile(cx, cy, me ? 84 : 72, d, { glow: me });
    out += k.bar(cx - 34, cy + 56, 68, 8, me ? C.g300 : "#dcdcd8");
    if (me) {
      out += k.check(cx + 40, cy - 40, 13);
      // The pointer that picked it.
      out += `<path d="M${cx + 30} ${cy + 22} l0 34 l9 -9 l7 15 l6 -3 l-7 -14 l12 0 z" fill="${C.ink}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>`;
    }
  });
  // Ranked cards on the right.
  const top = list.slice(0, 3);
  top.forEach((d, i) => {
    const x = 740 + i * 14;
    const y = 96 + i * 150;
    const first = i === 0;
    out += k.card(x, y, 380 - i * 14, 124, 20, { fill: first ? C.g50 : "#fff", ring: first ? C.green : "#000", ringOpacity: first ? 0.35 : 0.06, big: first });
    out += k.tile(x + 62, y + 62, first ? 72 : 64, d);
    out += k.bar(x + 116, y + 40, 150 - i * 20, 11, first ? C.g300 : "#dcdcd8") + k.bar(x + 116, y + 62, 110, 8, first ? C.g200 : C.bar2);
    for (let j = 0; j < 5; j++) out += k.bar(x + 116 + j * 24, y + 82, 18, 8, j < 5 - i ? (first ? C.green : "#bdbdb8") : "#ececea", 4);
    out += k.quarters(x + 380 - i * 14 - 40, y + 40, 24, 4 - i);
  });
  out += accentOf(k, rnd, accent).front;
  return out;
}

// A small extra on best-of covers, by the post's subject.
function accentOf(k, rnd, accent) {
  let out = "";
  let back = "";
  if (accent === "linkedin") {
    out += k.tile(1112, 92, 78, "linkedin.com", { glow: true, glowColor: C.linkedin });
  } else if (accent === "ai") {
    out += k.card(1044, 466, 120, 120, 28);
    out += k.otto(1104, 526, 70);
    for (const [x, y, s] of [[1018, 456, 24], [1178, 600, 18], [1176, 448, 15]]) out += k.icon("sparkle", x - s / 2, y - s / 2, s, C.green, 2);
  } else if (accent === "pipeline") {
    out += k.card(980, 470, 200, 128, 16);
    for (let c = 0; c < 3; c++) {
      out += k.bar(996 + c * 60, 486, 52, 6, c === 2 ? C.g300 : "#dcdcd8");
      for (let r = 0; r < 3 - c; r++) out += `<rect x="${996 + c * 60}" y="${500 + r * 30}" width="52" height="24" rx="6" fill="${c === 2 && r === 0 ? C.g100 : C.s2}" stroke="${c === 2 && r === 0 ? C.g200 : C.line}"/>`;
    }
  } else if (accent === "chart" || accent === "bars") {
    out += k.card(990, 462, 190, 132, 16);
    if (accent === "chart") {
      out += `<path d="M1010 568 L1048 548 L1084 556 L1120 520 L1160 494" fill="none" stroke="${C.green}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      out += `<path d="M1010 568 L1048 548 L1084 556 L1120 520 L1160 494 L1160 578 L1010 578Z" fill="${C.green}" opacity=".1"/>`;
      out += k.dot(1160, 494, 5);
    } else {
      [28, 40, 36, 56, 74, 92].forEach((h, i) => (out += k.bar(1010 + i * 26, 578 - h, 16, h, i === 5 ? C.green : C.g200, 5)));
    }
  } else if (accent === "sequence") {
    out += k.card(1020, 360, 150, 222, 18);
    const steps = [["userPlus", C.linkedin], ["message", C.text], ["clock", C.meta], ["reply", C.green]];
    steps.forEach(([ic, col], i) => {
      const y = 384 + i * 50;
      if (i) out += `<line x1="1052" y1="${y - 30}" x2="1052" y2="${y - 4}" stroke="${C.line}" stroke-width="2"/>`;
      out += `<rect x="1036" y="${y}" width="32" height="32" rx="9" fill="${i === 3 ? C.g100 : C.s2}"/>` + k.icon(ic, 1043, y + 7, 18, col, 2);
      out += k.bar(1080, y + 12, 60 + (i % 2) * 14, 8, i === 3 ? C.g300 : "#dcdcd8");
    });
  } else if (accent === "agency") {
    // Client workspaces, stacked behind the window.
    for (let i = 2; i >= 1; i--) back += k.card(520 + i * 20, 72 - i * 20, 612, 486, 20, { ringOpacity: 0.08 });
    out += k.card(1030, 446, 150, 150, 18);
    const tones = [[C.g200, C.greenInk], ["#e2effd", "#1e4f9a"], ["#ffe9cc", "#9a3412"], ["#e9e3fd", "#5429d6"]];
    tones.forEach(([t, ink], i) => (out += k.face(1080 + (i % 2) * 50, 496 + Math.floor(i / 2) * 50, 19, t, ink)));
  }
  return { back, front: out };
}

// Safety: a shield holds LinkedIn; the safest tools stand in an arc under it.
function shield(k, rnd, { tools }) {
  const cx = 600;
  let out = "";
  out += `<circle cx="${cx}" cy="250" r="200" fill="none" stroke="${C.green}" stroke-opacity=".2" stroke-width="1.5"/>`;
  out += `<ellipse cx="${cx}" cy="300" rx="330" ry="230" fill="none" stroke="${C.ink}" stroke-opacity=".08" stroke-width="1.5" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  const sh = "M0 -150 L128 -104 Q132 -102 132 -98 L132 6 C132 92 68 136 0 166 C-68 136 -132 92 -132 6 L-132 -98 Q-132 -102 -128 -104 Z";
  out += `<g transform="translate(${cx} 238)"><path d="${sh}" fill="#fff" filter="url(#${k.id}-l)"/><path d="${sh}" fill="none" stroke="#000" stroke-opacity=".06"/><path d="${sh}" transform="scale(.86)" fill="${C.g50}" stroke="${C.g200}" stroke-width="1.5"/></g>`;
  out += k.tile(cx, 222, 116, "linkedin.com", { pad: 0.18 });
  out += k.check(cx + 52, 170, 18);
  // A steady pace: even ticks along the bottom of the shield.
  for (let i = 0; i < 9; i++) out += k.bar(cx - 72 + i * 16, 312, 8, 18, i < 7 ? C.green : C.g300, 4);
  const list = tools.filter(known).filter((d) => d !== "tryomniscient.com").slice(0, 8);
  const angles = [180, 150, 210, 125, 0, 30, -30, 55];
  list.forEach((d, i) => {
    const x = cx + 330 * Math.cos(rad(angles[i]));
    const y = 300 + 230 * Math.sin(rad(angles[i]));
    out += k.tile(x, y, i % 4 === 0 ? 86 : 72, d);
  });
  out += k.tile(cx, 530, 100, "tryomniscient.com", { glow: true });
  return out;
}

// Automating without a ban: a gauge that stays in the green, and days of even work under it.
function gauge(k, rnd, { tools }) {
  const cx = 600;
  const cy = 330;
  const R = 200;
  let out = k.card(cx - 290, 70, 580, 400, 28, { big: true });
  const seg = (a0, a1, col) => {
    const [x0, y0] = polar(cx, cy, R, a0);
    const [x1, y1] = polar(cx, cy, R, a1);
    return `<path d="M${f1(x0)} ${f1(y0)} A${R} ${R} 0 0 1 ${f1(x1)} ${f1(y1)}" fill="none" stroke="${col}" stroke-width="30" stroke-linecap="round"/>`;
  };
  out += seg(-180, -66, C.green) + seg(-54, -24, "#f5b14c") + seg(-12, 0, C.red);
  for (let a = -180; a <= 0; a += 15) {
    const [x0, y0] = polar(cx, cy, R - 34, a);
    const [x1, y1] = polar(cx, cy, R - 46, a);
    out += `<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="${C.ink}" stroke-opacity=".2" stroke-width="2" stroke-linecap="round"/>`;
  }
  const [nx, ny] = polar(cx, cy, R - 60, -122);
  out += `<line x1="${cx}" y1="${cy}" x2="${f1(nx)}" y2="${f1(ny)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="16" fill="${C.ink}"/><circle cx="${cx}" cy="${cy}" r="6" fill="${C.mint}"/>`;
  out += k.tile(cx, cy + 74, 64, "linkedin.com", { pad: 0.16 });
  // Days of even work.
  out += k.card(cx - 250, 490, 500, 92, 20);
  for (let i = 0; i < 14; i++) {
    const h = 30 + ((i * 37) % 11) * 2;
    out += k.bar(cx - 222 + i * 33, 562 - h, 18, h, i === 13 ? C.green : C.g200, 6);
  }
  out += `<line x1="${cx - 230}" y1="${504}" x2="${cx + 230}" y2="${504}" stroke="${C.red}" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 6"/>`;
  const list = tools.filter(known);
  out += k.tile(190, 200, 104, list[0] || "tryomniscient.com", { glow: true });
  if (list[1]) out += k.tile(1010, 200, 104, list[1]);
  return out;
}

// Connection request limits: a week of requests under the limit, and LinkedIn with its weekly ring.
function limit(k, rnd, { tools }) {
  let out = "";
  // LinkedIn with a ring that is most of the way round.
  const cx = 300;
  const cy = 300;
  const r = 150;
  out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" filter="url(#${k.id}-l)"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="${r - 24}" fill="none" stroke="#e8e8e4" stroke-width="22"/>`;
  const [ex, ey] = polar(cx, cy, r - 24, -90 + 360 * 0.78);
  out += `<path d="M${cx} ${cy - (r - 24)} A${r - 24} ${r - 24} 0 1 1 ${f1(ex)} ${f1(ey)}" fill="none" stroke="${C.green}" stroke-width="22" stroke-linecap="round"/>`;
  out += k.tile(cx, cy, 118, "linkedin.com", { pad: 0.16 });
  // People asking to connect, around the ring.
  [[-40, C.g200, C.greenInk], [200, "#e2effd", "#1e4f9a"], [140, "#ffe9cc", "#9a3412"]].forEach(([a, t, ink]) => {
    const [x, y] = polar(cx, cy, r + 34, a);
    out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="30" fill="#fff" filter="url(#${k.id}-s)"/>` + k.face(x, y, 26, t, ink);
    out += `<circle cx="${f1(x + 22)}" cy="${f1(y + 20)}" r="11" fill="${C.greenStrong}" stroke="#fff" stroke-width="3"/><path d="M${f1(x + 22)} ${f1(y + 15)}v10M${f1(x + 17)} ${f1(y + 20)}h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  });
  // The week: seven bars under a dashed limit.
  const x = 560;
  const y = 110;
  const w = 570;
  const h = 410;
  out += k.card(x, y, w, h, 24, { big: true });
  const lim = y + 110;
  const floor = y + h - 50;
  const hs = [0.42, 0.55, 0.5, 0.68, 0.74, 0.3, 0.2];
  hs.forEach((t, i) => {
    const bh = (floor - lim) * t + 20;
    out += k.bar(x + 52 + i * 70, floor - bh, 44, bh, i === 4 ? C.green : C.g200, 10);
  });
  out += `<line x1="${x + 30}" y1="${lim}" x2="${x + w - 30}" y2="${lim}" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="8 8" stroke-linecap="round" opacity=".75"/>`;
  out += `<circle cx="${x + w - 30}" cy="${lim}" r="7" fill="${C.red}" opacity=".85"/>`;
  out += `<line x1="${x + 30}" y1="${floor}" x2="${x + w - 30}" y2="${floor}" stroke="${C.line}" stroke-width="2"/>`;
  out += k.bar(x + 40, y + 34, 130, 10, "#dcdcd8") + k.bar(x + 40, y + 54, 80, 8, C.bar2);
  const list = tools.filter(known).filter((d) => !/linkedin/.test(d));
  list.slice(0, 3).forEach((d, i) => (out += k.tile(x + w - 52 - i * 58, y + 46, 44, d)));
  return out;
}

// Pricing: tools climb a staircase of price columns; Omniscient's column is green.
function pricing(k, rnd, { tools }) {
  const list = tools.filter(known).slice(0, 7);
  const order = [...list].sort((a, b) => (a === "tryomniscient.com" ? 3 : hashOf(a) % 7) - (b === "tryomniscient.com" ? 3 : hashOf(b) % 7));
  let out = "";
  const n = order.length;
  const gap = 18;
  const cw = (1040 - gap * (n - 1)) / n;
  const floor = 560;
  const tops = [];
  order.forEach((d, i) => {
    const x = 80 + i * (cw + gap);
    const hgt = 110 + i * 38;
    const y = floor - hgt;
    const me = d === "tryomniscient.com";
    out += k.card(x, y, cw, hgt + 20, 20, { fill: me ? C.g100 : "#fff", ring: me ? C.green : "#000", ringOpacity: me ? 0.35 : 0.06 });
    // Coins: stacked rounded bars, more as the price rises.
    for (let j = 0; j <= i; j++) out += k.bar(x + 22, floor - 26 - j * 16, cw - 44, 10, me ? C.green : j % 2 ? "#e2e2de" : "#ececea", 5);
    tops.push([x + cw / 2, y - 64]);
    out += k.tile(x + cw / 2, y - 64, Math.min(84, cw - 30), d, { glow: me });
  });
  const pts = tops.map(([x, y]) => `${f1(x)} ${f1(y + 64 - 28)}`);
  out = `<path d="M${pts.join(" L")}" fill="none" stroke="${C.ink}" stroke-opacity=".14" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round"/>` + out;
  return out;
}

// Automatic data entry: email, calendar and calls flow into a record that fills itself in.
function dataflow(k, rnd, { tools }) {
  let out = "";
  const src = [["gmail.com", 150], ["calendar.google.com", 260], ["zoom.us", 370], ["outlook.com", 480]];
  const rx = 640;
  const ry = 92;
  const rw = 470;
  const rh = 450;
  src.forEach(([d, y], i) => {
    const tx = 250 + (i % 2) * 40;
    const ty = rx;
    const fy = ry + 132 + i * 62;
    out += k.link(`M${tx + 44} ${y} C ${tx + 200} ${y}, ${ty - 170} ${fy}, ${ty - 8} ${fy}`, { w: 2.5, opacity: 0.75 });
    out += k.dot(ty - 8, fy, 4.5);
  });
  src.forEach(([d, y], i) => (out += k.tile(250 + (i % 2) * 40, y, 84, d, { pad: 0.22 })));
  out += k.card(rx, ry, rw, rh, 24, { big: true });
  out += k.face(rx + 54, ry + 54, 26) + k.bar(rx + 94, ry + 40, 170, 12, C.ink) + k.bar(rx + 94, ry + 60, 110, 9, "#dcdcd8");
  out += k.tile(rx + rw - 46, ry + 52, 48, "tryomniscient.com");
  out += `<line x1="${rx}" y1="${ry + 100}" x2="${rx + rw}" y2="${ry + 100}" stroke="${C.line}"/>`;
  const fields = 5;
  for (let i = 0; i < fields; i++) {
    const fy = ry + 132 + i * 62;
    out += k.bar(rx + 32, fy - 5, 90, 10, "#dcdcd8");
    if (i < 3) {
      out += `<rect x="${rx + 150}" y="${fy - 18}" width="${rw - 182}" height="36" rx="10" fill="${C.g50}" stroke="${C.g200}"/>`;
      out += k.bar(rx + 166, fy - 5, 110 + i * 40, 10, C.g300) + k.icon("sparkle", rx + rw - 64, fy - 9, 18, C.green, 2);
    } else if (i === 3) {
      out += `<rect x="${rx + 150}" y="${fy - 18}" width="${rw - 182}" height="36" rx="10" fill="#fff" stroke="${C.green}" stroke-dasharray="5 5"/>`;
      out += k.bar(rx + 166, fy - 5, 70, 10, C.g200) + `<rect x="${rx + 242}" y="${fy - 10}" width="2.5" height="20" fill="${C.green}"/>`;
    } else out += `<rect x="${rx + 150}" y="${fy - 18}" width="${rw - 182}" height="36" rx="10" fill="${C.s2}"/>`;
  }
  out += k.card(rx - 46, ry + rh - 78, 92, 92, 24) + k.otto(rx, ry + rh - 32, 60);
  return out;
}

// LinkedIn and the CRM in sync: a profile on one side, a record on the other, arrows both ways, CRMs on a tray.
function sync(k, rnd, { tools, variant }) {
  let out = "";
  // The LinkedIn profile.
  const px = 90;
  const py = 92;
  out += k.card(px, py, 360, 360, 24, { big: true });
  out += `<path d="M${px} ${py + 24} a24 24 0 0 1 24 -24 h312 a24 24 0 0 1 24 24 v66 h-360z" fill="#dbe8f7"/>`;
  out += `<circle cx="${px + 80}" cy="${py + 92}" r="46" fill="#fff"/>` + k.face(px + 80, py + 92, 40, "#e2effd", "#1e4f9a");
  out += k.bar(px + 36, py + 160, 170, 13, C.ink) + k.bar(px + 36, py + 184, 230, 9, "#dcdcd8") + k.bar(px + 36, py + 202, 150, 9, C.bar2);
  out += `<rect x="${px + 36}" y="${py + 236}" width="120" height="34" rx="17" fill="${C.linkedin}"/>` + k.icon("userPlus", px + 84, py + 244, 18, "#fff", 2.2);
  out += `<rect x="${px + 166}" y="${py + 236}" width="110" height="34" rx="17" fill="#fff" stroke="${C.linkedin}" stroke-width="1.5"/>` + k.icon("message", px + 212, py + 244, 18, C.linkedin, 2.2);
  out += k.bar(px + 36, py + 300, 288, 9, C.bar2) + k.bar(px + 36, py + 318, 220, 9, C.bar2);
  out += k.tile(px + 360 - 40, py + 130, 52, "linkedin.com", { pad: 0.16 });
  // The record.
  const rx = 750;
  out += k.card(rx, py, 360, 360, 24, { big: true });
  out += k.face(rx + 50, py + 50, 24) + k.bar(rx + 86, py + 38, 150, 12, C.ink) + k.bar(rx + 86, py + 58, 96, 9, "#dcdcd8");
  out += `<line x1="${rx}" y1="${py + 94}" x2="${rx + 360}" y2="${py + 94}" stroke="${C.line}"/>`;
  for (let i = 0; i < 4; i++) {
    const fy = py + 124 + i * 54;
    out += k.bar(rx + 28, fy, 70, 9, "#dcdcd8");
    const hot = i === 1 || i === 2;
    out += `<rect x="${rx + 116}" y="${fy - 12}" width="216" height="32" rx="9" fill="${hot ? C.g50 : C.s2}" ${hot ? `stroke="${C.g200}"` : ""}/>`;
    out += k.bar(rx + 130, fy, hot ? 120 : 90, 8, hot ? C.g300 : "#dcdcd8");
  }
  out += k.tile(rx + 320, py + 50, 48, variant === "omni" ? "tryomniscient.com" : (tools.filter(known)[1] || "hubspot.com"));
  // Arrows both ways.
  const ar = (x1, x2, y, bend, toRight) => {
    const d = `M${x1} ${y} C ${x1 + 70} ${y + bend}, ${x2 - 70} ${y + bend}, ${x2} ${y}`;
    const tip = toRight ? `M${x2 - 12} ${y - 8} L${x2} ${y} L${x2 - 12} ${y + 8}` : `M${x1 + 12} ${y - 8} L${x1} ${y} L${x1 + 12} ${y + 8}`;
    return k.link(d, { w: 3, opacity: 0.9 }) + `<path d="${tip}" fill="none" stroke="${C.green}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  out += ar(472, 728, 220, -60, true) + ar(472, 728, 300, 60, false);
  out += k.omni(600, 260, 70, { glow: true });
  // The tray of CRMs.
  const list = tools.filter(known).filter((d) => d !== "tryomniscient.com").slice(0, 7);
  const tw = list.length * 64 + 24;
  out += k.card(600 - tw / 2, 486, tw, 84, 42);
  list.forEach((d, i) => (out += k.tile(600 - tw / 2 + 44 + i * 64, 528, 48, d)));
  return out;
}

// LinkedIn outreach that lands in a CRM: a sequence on the left feeds a pipeline board on the right.
function outreachCrm(k, rnd, { tools }) {
  let out = "";
  const sx = 80;
  const sy = 88;
  out += k.card(sx, sy, 300, 454, 24, { big: true });
  const steps = [["userPlus", C.linkedin, "#e2effd"], ["message", C.text, C.s2], ["clock", C.meta, C.s2], ["message", C.text, C.s2], ["reply", C.green, C.g100]];
  steps.forEach(([ic, col, bg], i) => {
    const y = sy + 36 + i * 82;
    if (i) out += `<line x1="${sx + 52}" y1="${y - 46}" x2="${sx + 52}" y2="${y}" stroke="${C.line}" stroke-width="2.5"/>`;
    out += `<rect x="${sx + 28}" y="${y}" width="48" height="48" rx="14" fill="${bg}"/>` + k.icon(ic, sx + 40, y + 12, 24, col, 2);
    out += k.bar(sx + 94, y + 12, 120 + ((i * 29) % 50), 10, i === 4 ? C.g300 : "#dcdcd8") + k.bar(sx + 94, y + 30, 80 + ((i * 17) % 40), 8, C.bar2);
  });
  out += k.tile(sx + 300 - 34, sy + 34, 44, "linkedin.com", { pad: 0.16 });
  // The board.
  const bx = 500;
  const by = 88;
  const bw = 630;
  out += windowFrame(k, bx, by, bw, 454, { noUrl: true });
  const cols = 3;
  const cw = (bw - 48 - 2 * 18) / cols;
  for (let c = 0; c < cols; c++) {
    const x = bx + 24 + c * (cw + 18);
    out += k.bar(x, by + 66, 90, 10, c === 2 ? C.g300 : "#dcdcd8") + `<circle cx="${x + cw - 10}" cy="${by + 71}" r="9" fill="${C.s2}"/>`;
    const cards = [4, 3, 2][c];
    for (let r = 0; r < cards; r++) {
      const y = by + 96 + r * 86;
      const hot = c === 0 && r === 0;
      out += k.card(x, y, cw, 72, 14, { fill: hot ? C.g50 : "#fff", ring: hot ? C.green : "#000", ringOpacity: hot ? 0.4 : 0.06 });
      out += k.face(x + 26, y + 36, 15, ["#e2effd", C.g200, "#ffe9cc", "#e9e3fd"][(r + c) % 4], ["#1e4f9a", C.greenInk, "#9a3412", "#5429d6"][(r + c) % 4]);
      out += k.bar(x + 50, y + 26, 90 + ((r * 23 + c * 11) % 40), 9, hot ? C.g300 : "#dcdcd8") + k.bar(x + 50, y + 42, 60, 7, C.bar2);
    }
  }
  out += k.link(`M${sx + 300} ${sy + 36 + 4 * 82 + 24} C ${sx + 400} ${sy + 380}, ${bx - 40} ${by + 132}, ${bx + 22} ${by + 132}`, { w: 3, opacity: 0.85 });
  out += k.dot(sx + 300, sy + 36 + 4 * 82 + 24, 5);
  const list = tools.filter(known).filter((d) => d !== "tryomniscient.com").slice(0, 5);
  list.forEach((d, i) => (out += k.tile(bx + bw - 26 - i * 34, by + 22, 26, d)));
  out += k.omni(bx + bw - 10, by + 454 - 10, 76, { glow: true });
  return out;
}

// ─── Picking the scene ───────────────────────────────────────────────────────────────────────────────────────────

const SCENES = {
  "linkedin-connection-request-limit": { scene: limit, field: "mint" },
  "linkedin-automation-pricing": { scene: pricing, field: "paper" },
  "automate-linkedin-outreach-without-getting-restricted": { scene: gauge, field: "mint" },
  "safest-linkedin-automation-tools": { scene: shield, field: "mint" },
  "crm-with-automatic-data-entry": { scene: dataflow, field: "mint" },
  "crm-with-linkedin-integration": { scene: sync, field: "paper" },
  "linkedin-outreach-tools-with-crm": { scene: outreachCrm, field: "paper" },
  "best-ai-crm": { accent: "ai", field: "mint" },
  "best-crm-for-b2b-saas": { accent: "pipeline", field: "paper", layout: "mirror" },
  "best-crm-for-founders": { accent: "chart", field: "mint", layout: "grid" },
  "best-crm-for-linkedin": { accent: "linkedin", field: "paper" },
  "best-crm-for-startups": { accent: "bars", field: "mint", layout: "mirror" },
  "best-linkedin-automation-tools": { accent: "none", field: "paper", layout: "grid" },
  "linkedin-automation-tools-for-agencies": { accent: "agency", field: "paper" },
};

export function coverArt({ slug, type = "", topic = "", title = "", body = "", tools: given }) {
  const id = `cv-${slug.replace(/[^a-z0-9]/gi, "").slice(0, 24)}`;
  const k = kit(id);
  const rnd = rngFor(slug);
  const tools = given || toolsOf(body);
  const pick = SCENES[slug] || {};
  let fieldKind = pick.field || (hashOf(slug) % 3 === 0 ? "mint" : "paper");
  let art;
  if (pick.scene) {
    art = pick.scene(k, rnd, { tools });
  } else if (slug === "blog") {
    fieldKind = "paper";
    art = orbit(k, rnd, { subject: "tryomniscient.com", others: tools, center: "omni" });
  } else if (type === "versus" || / vs\.? /i.test(title)) {
    const [a, b] = domainsIn(title);
    art = versus(k, rnd, { a: a || tools[0], b: b || tools[1] || "hubspot.com" });
  } else if (type === "alternatives" || /alternatives/i.test(title)) {
    const subject = domainsIn(`${slug.replace(/-/g, " ")} ${title}`).find((d) => d !== "tryomniscient.com") || tools[1];
    art = orbit(k, rnd, { subject, others: tools.filter((d) => d !== subject && d !== "tryomniscient.com") });
  } else {
    art = bestOf(k, rnd, { tools, accent: pick.accent || (topic === "linkedin" ? "sequence" : "pipeline"), layout: pick.layout || ["podium", "mirror", "grid"][hashOf(slug) % 3] });
  }
  const bg = field(fieldKind, rngFor(`${slug}:field`));
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>${k.filters()}${k.defs.join("")}</defs>
${bg}
${art}
</svg>`;
}
