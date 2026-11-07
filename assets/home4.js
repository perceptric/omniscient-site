// Home page v4 (docs/home-v4.md): draws the two scenes, turns the headline word, plays the Scout search, counts scores,
// plays the step cards, follows the parts in the stage menu and runs the Omniscience sky and orbit.
(function () {
  var NS = "http://www.w3.org/2000/svg", C = Math.cos(Math.PI / 6), S = 0.5;
  function P(x, y, z) { return [(x - y) * C, (x + y) * S - (z || 0)]; }
  function hex(h, f) { var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(c) { return Math.round(f > 0 ? c + (255 - c) * f : c * (1 + f)); }
    return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")"; }
  function Scene(svg) { this.svg = svg; this.b = [1e9, 1e9, -1e9, -1e9]; this.g = document.createElementNS(NS, "g"); svg.appendChild(this.g); }
  Scene.prototype.grow = function (p) { var b = this.b; b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); };
  Scene.prototype.el = function (tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); this.g.appendChild(e); return e; };
  Scene.prototype.poly = function (pts, fill) { var s = this; pts.forEach(function (p) { s.grow(p); });
    return this.el("polygon", { points: pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: fill, stroke: "rgba(0,0,0,.06)", "stroke-width": ".6", "stroke-linejoin": "round" }); };
  Scene.prototype.box = function (x, y, z, w, d, h, col) {
    this.poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], hex(col, -0.12));
    this.poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], hex(col, -0.02));
    this.poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], hex(col, 0.22));
  };
  Scene.prototype.line = function (a, b, cls) { this.grow(a); this.grow(b); return this.el("path", { d: "M" + a[0] + " " + a[1] + " L" + b[0] + " " + b[1], "class": cls }); };
  Scene.prototype.x = function (p) { var g = this.el("g", { "class": "x", transform: "translate(" + p[0] + " " + p[1] + ")" }); var c = document.createElementNS(NS, "circle"); c.setAttribute("r", "6"); g.appendChild(c); var l = document.createElementNS(NS, "path"); l.setAttribute("d", "M-2.4 -2.4 L2.4 2.4 M2.4 -2.4 L-2.4 2.4"); g.appendChild(l); };
  // A label is a white pill with a soft shadow (dark for the main one), sized to its words.
  Scene.prototype.pill = function (p, t, anchor, dark) {
    var g = this.el("g", { "class": "lbl" + (dark ? " lbl--dark" : "") }), r = document.createElementNS(NS, "rect"), e = document.createElementNS(NS, "text");
    g.appendChild(r); g.appendChild(e); e.setAttribute("x", p[0]); e.setAttribute("y", p[1]); e.setAttribute("text-anchor", anchor || "middle"); e.setAttribute("dominant-baseline", "central"); e.textContent = t;
    var b; try { b = e.getBBox(); } catch (x) { b = null; }
    if (!b || !b.width) { var w = t.length * 9; b = { x: p[0] - (anchor === "end" ? w : anchor === "start" ? 0 : w / 2), y: p[1] - 10, width: w, height: 20 }; }
    var px = 14, py = 9; r.setAttribute("x", b.x - px); r.setAttribute("y", b.y - py); r.setAttribute("width", b.width + px * 2); r.setAttribute("height", b.height + py * 2); r.setAttribute("rx", (b.height + py * 2) / 2);
    this.grow([b.x - px - 6, b.y - py - 6]); this.grow([b.x + b.width + px + 6, b.y + b.height + py + 10]);
  };
  Scene.prototype.label = function (p, t) { this.pill(p, t, "middle"); };
  Scene.prototype.fit = function () { var b = this.b, pad = 8; this.svg.setAttribute("viewBox", (b[0] - pad) + " " + (b[1] - pad) + " " + (b[2] - b[0] + pad * 2) + " " + (b[3] - b[1] + pad * 2)); };

  // What sits on each tool's island
  var art = {
    prospect: function (s, x, y, z, col) { // a grid of leads, three standing out
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) { var hi = (i + j) % 2 === 0 && i !== 1; s.box(x + 18 + i * 30, y + 18 + j * 30, z, 18, 18, hi ? 34 : 12, hi ? col : "#eceaf6"); } },
    crm: function (s, x, y, z, col) { // a stack of record sheets
      for (var k = 0; k < 6; k++) s.box(x + 22, y + 26, z + k * 7, 70, 56, 4, k === 5 ? col : "#f4f6fa"); s.box(x + 70, y + 30, z + 44, 14, 14, 14, col); },
    call: function (s, x, y, z, col) { // a sound wave of bars
      var hs = [12, 26, 44, 30, 52, 22, 36, 14]; for (var k = 0; k < hs.length; k++) s.box(x + 14 + k * 12, y + 50, z, 8, 18, hs[k], col); },
    contract: function (s, x, y, z, col, low) { // a standing page and a seal
      var ph = low ? 40 : 72, bz = low ? 14 : 44; s.box(x + 30, y + 40, z, 56, 6, ph, "#ffffff"); s.box(x + 40, y + 34, z + bz, 10, 6, 18, "#e8590c"); s.box(x + 56, y + 34, z + bz, 10, 6, 24, "#f59f00"); s.box(x + 70, y + 70, z, 18, 18, 10, col); }
  };
  var tools = [
    { k: "prospect", t: "Prospecting", c: "#a99de6", slab: "#e4e0f7", x: 0, y: 0 },
    { k: "call", t: "Call & meeting intelligence", c: "#3fb8a6", slab: "#d3eeea", x: 230, y: 0 },
    { k: "crm", t: "Legacy CRM", c: "#5b7bd6", slab: "#dde3f1", x: 0, y: 230 },
    { k: "contract", t: "Contract management", c: "#f2b48a", slab: "#f6e3d4", x: 230, y: 230 }
  ];
  var W = 120;

  var a = document.getElementById("iso-apart");
  if (a) {
    var s = new Scene(a), mid = function (t) { return [t.x + W / 2, t.y + W / 2]; };
    var links = [[0, 1], [1, 3], [3, 2], [2, 0]];
    links.forEach(function (l) { var p = mid(tools[l[0]]), q = mid(tools[l[1]]); var A = P(p[0], p[1], 0), B = P(q[0], q[1], 0); s.line(A, B, "dash"); });
    tools.forEach(function (t) { s.box(t.x, t.y, 0, W, W, 12, t.slab); art[t.k](s, t.x, t.y, 12, t.c); });
    links.forEach(function (l) { var p = mid(tools[l[0]]), q = mid(tools[l[1]]); s.x(P((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0)); });
    tools.forEach(function (t) { var p = P(t.x + W, t.y + W, 0); s.label([p[0], p[1] + 30], t.t); });
    s.fit();
  }

  var o = document.getElementById("iso-one");
  if (o) {
    var s2 = new Scene(o);
    s2.box(-30, -30, 0, 470, 470, 18, "#ecebe4");
    var core = [205, 205];
    tools.forEach(function (t) { var c = [t.x + W / 2 + 15, t.y + W / 2 + 15]; s2.line(P(core[0], core[1], 18), P(c[0], c[1], 18), "live"); });
    [0, 1, 2].forEach(function (i) { var t = tools[i], x = t.x + 15, y = t.y + 15; s2.box(x, y, 18, W - 10, W - 10, 6, "#ffffff"); art[t.k](s2, x - 4, y - 4, 24, t.c); });
    s2.box(178, 178, 18, 54, 54, 40, "#242421"); s2.box(197, 197, 58, 16, 16, 8, "#18e299");
    var t3 = tools[3]; s2.box(t3.x + 15, t3.y + 15, 18, W - 10, W - 10, 6, "#ffffff"); art[t3.k](s2, t3.x + 11, t3.y + 11, 24, t3.c, true);
    function tag(p, txt, anchor, dark) { s2.pill(p, txt, anchor, dark); }
    var a0 = P(15, 15, 24); tag([a0[0], a0[1] - 92], "Scout", "middle");
    var a1 = P(355, 15, 24); tag([a1[0] + 18, a1[1] + 4], "Call notes", "start");
    var a2 = P(15, 355, 24); tag([a2[0] - 18, a2[1] + 4], "CRM", "end");
    var a3 = P(355, 355, 24); tag([a3[0], a3[1] + 30], "Contracts", "middle");
    var b = P(440, 440, 0); tag([b[0], b[1] + 40], "All on Omniscience", "middle", true);
    s2.fit();
  }

  // Omniscience: lines from each source to the core, and from the core to each reader
  function wire() {
    var art2 = document.querySelector(".omni__art"), svg = document.getElementById("omni-lines");
    if (!art2 || !svg) return;
    var R = art2.getBoundingClientRect(); svg.setAttribute("viewBox", "0 0 " + R.width + " " + R.height); svg.innerHTML = "";
    var core = art2.querySelector(".omni__core").getBoundingClientRect();
    if (getComputedStyle(svg).display === "none") return;
    var cx = core.left - R.left, cr = core.right - R.left, cy = core.top - R.top + core.height / 2, n = 0;
    function path(x1, y1, x2, y2) { var mx = (x1 + x2) / 2; var d = "M" + x1 + " " + y1 + " C " + mx + " " + y1 + ", " + mx + " " + y2 + ", " + x2 + " " + y2;
      var p = document.createElementNS(NS, "path"); p.setAttribute("d", d); svg.appendChild(p);
      if (!still) { var c = document.createElementNS(NS, "circle"); c.setAttribute("r", "3"); var am = document.createElementNS(NS, "animateMotion"); am.setAttribute("dur", (2.2 + (n % 3) * 0.4) + "s"); am.setAttribute("begin", "-" + (n * 0.35 + 0.2) + "s"); am.setAttribute("repeatCount", "indefinite"); am.setAttribute("path", d); c.appendChild(am); svg.appendChild(c); }
      n++; }
    art2.querySelectorAll(".omni__in .src").forEach(function (e) { var r = e.getBoundingClientRect(); path(r.right - R.left, r.top - R.top + r.height / 2, cx, cy); });
    art2.querySelectorAll(".omni__out .src").forEach(function (e) { var r = e.getBoundingClientRect(); path(cr, cy, r.left - R.left, r.top - R.top + r.height / 2); });
  }
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  wire(); window.addEventListener("resize", wire); if (document.fonts) document.fonts.ready.then(wire);

  // Rotating word in the headline
  // The box takes the width of the word on screen, so the line stays centered as the word changes.
  var ws = document.querySelectorAll(".rot__w"), i = 0, rot = document.querySelector(".rot");
  function fitWord() { if (rot && ws[i]) rot.style.width = ws[i].offsetWidth + "px"; }
  fitWord(); addEventListener("resize", fitWord); if (document.fonts) document.fonts.ready.then(fitWord);
  if (ws.length && !still) setInterval(function () {
    var cur = ws[i]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    setTimeout(function () { cur.classList.remove("is-out"); }, 520);
    i = (i + 1) % ws.length; ws[i].classList.add("is-on"); fitWord();
  }, 2200);
})();

(function () {
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function seen(el, fn, opts) { if (!el || !("IntersectionObserver" in window)) return; var io = new IntersectionObserver(function (es) { es.forEach(function (e) { fn(e.isIntersecting, e); }); }, opts || { threshold: 0.35 }); io.observe(el); return io; }

  // Scroll progress
  var bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
  function prog() { var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")"; }
  addEventListener("scroll", prog, { passive: true }); prog();

  // Typing demo in the hero
  var typer = document.getElementById("typer");
  if (typer && !still) {
    var tx = document.getElementById("typer-text"), full = tx.textContent, hits = typer.querySelectorAll(".hit"), timer, live = false;
    function run() {
      clearTimeout(timer); typer.classList.add("is-run"); hits.forEach(function (h) { h.classList.remove("is-in"); }); tx.textContent = "";
      var i = 0;
      (function type() { if (!live) return; tx.textContent = full.slice(0, ++i); if (i < full.length) timer = setTimeout(type, 28 + Math.random() * 40); else timer = setTimeout(function () { pop(0); }, 450); })();
      function pop(k) { if (!live) return; if (k < hits.length) { hits[k].classList.add("is-in"); timer = setTimeout(function () { pop(k + 1); }, 170); } else timer = setTimeout(run, 4200); }
    }
    seen(typer, function (on) { if (on && !live) { live = true; run(); } else if (!on && live) { live = false; clearTimeout(timer); tx.textContent = full; hits.forEach(function (h) { h.classList.add("is-in"); }); } }, { threshold: 0.2 });
  }

  // Scores count up
  document.querySelectorAll(".cnt").forEach(function (el) {
    var n = +el.dataset.n, done = false;
    if (still) return;
    seen(el, function (on) { if (!on || done) return; done = true; var t0 = performance.now();
      (function step(t) { var p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0); });
  });

  // Run steps play when they come into view
  document.querySelectorAll("ol.runs").forEach(function (ol) {
    var tags = [].slice.call(ol.querySelectorAll(".tag--green")), done = false;
    if (still || !tags.length) return;
    seen(ol, function (on) { if (!on || done) return; done = true;
      var keep = tags.map(function (t) { return t.textContent; });
      tags.forEach(function (t) { t.classList.remove("tag--green"); t.classList.add("is-busy"); t.textContent = "Working"; });
      tags.forEach(function (t, i) { setTimeout(function () { t.classList.remove("is-busy"); t.classList.add("tag--green", "is-done"); t.textContent = keep[i]; }, 700 + i * 650); });
    });
  });

  // Stage nav follows the part on screen
  var links = document.querySelectorAll("#stages a");
  links.forEach(function (a) { var part = document.querySelector(a.getAttribute("href"));
    seen(part, function (on) { if (on) links.forEach(function (b) { b.classList.toggle("is-on", b === a); }); }, { rootMargin: "-45% 0px -50% 0px" }); });

  // ═══ Cosmos ═══
  var sky = document.getElementById("sky"), orbit = document.getElementById("orbit");
  if (!sky || !orbit) return;
  var NS = "http://www.w3.org/2000/svg", dpr = Math.min(2, window.devicePixelRatio || 1);
  var sctx = sky.getContext("2d"), stars = [], shoot = null, SW = 0, SH = 0;
  function sizeSky() { var r = sky.getBoundingClientRect(); SW = r.width; SH = r.height; sky.width = SW * dpr; sky.height = SH * dpr; sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = []; var n = Math.round(SW * SH / 2600); for (var i = 0; i < n; i++) stars.push({ x: Math.random() * SW, y: Math.random() * SH, r: Math.random() * 1.2 + 0.2, p: Math.random() * 6.28, s: 0.6 + Math.random() * 1.8, g: Math.random() < 0.12 }); }

  var fx = document.getElementById("fx"), fctx = fx.getContext("2d"), rings = document.getElementById("rings");
  var planets = [].slice.call(orbit.querySelectorAll(".planet")), W = 0, H = 0, R = [], parts = [];
  function sizeOrbit() { var r = orbit.getBoundingClientRect(); W = r.width; H = r.height; fx.width = W * dpr; fx.height = H * dpr; fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var nar = W < 600; R = [{ rx: W * (nar ? 0.24 : 0.25), ry: H * 0.2, v: 0.16 }, { rx: W * (nar ? 0.33 : 0.45), ry: H * 0.4, v: -0.085 }];
    rings.setAttribute("viewBox", "0 0 " + W + " " + H); rings.innerHTML = "";
    R.forEach(function (q) { ["", "dash"].forEach(function (c) { var e = document.createElementNS(NS, "ellipse"); e.setAttribute("cx", W / 2); e.setAttribute("cy", H / 2); e.setAttribute("rx", q.rx); e.setAttribute("ry", q.ry); if (c) e.setAttribute("class", c); rings.appendChild(e); }); }); }

  function place(t) {
    return planets.map(function (p) { var q = R[+p.dataset.ring], a = (+p.dataset.a) * Math.PI / 180 + t * q.v;
      var x = W / 2 + q.rx * Math.cos(a), y = H / 2 + q.ry * Math.sin(a), front = Math.sin(a), s = 0.8 + 0.2 * (front + 1) / 2;
      p.style.transform = "translate(" + (x - p.offsetWidth / 2) + "px," + (y - p.offsetHeight / 2) + "px) scale(" + s.toFixed(3) + ")";
      p.style.opacity = (0.68 + 0.32 * (front + 1) / 2).toFixed(2); p.style.zIndex = front > 0 ? 6 : 4; return { x: x, y: y, front: front }; });
  }

  function drawSky(t) {
    sctx.clearRect(0, 0, SW, SH);
    stars.forEach(function (s) { var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.s + s.p)); sctx.globalAlpha = a; sctx.fillStyle = s.g ? "#7dffc9" : "#e9fff5"; sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, 6.283); sctx.fill(); });
    sctx.globalAlpha = 1;
    if (!shoot && Math.random() < 0.006) shoot = { x: Math.random() * SW * 0.7, y: Math.random() * SH * 0.4, t: 0 };
    if (shoot) { shoot.t += 0.02; var len = 140, x = shoot.x + shoot.t * 420, y = shoot.y + shoot.t * 160;
      var g = sctx.createLinearGradient(x - len, y - len * 0.38, x, y); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(220,255,240,.9)");
      sctx.strokeStyle = g; sctx.lineWidth = 1.4; sctx.beginPath(); sctx.moveTo(x - len, y - len * 0.38); sctx.lineTo(x, y); sctx.stroke(); if (shoot.t > 1.2) shoot = null; }
  }

  var last = 0;
  function drawFx(pos, now) {
    fctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2;
    pos.forEach(function (p, i) { // faint tether from each source to the core
      var g = fctx.createLinearGradient(p.x, p.y, cx, cy); g.addColorStop(0, "rgba(24,226,153,0)"); g.addColorStop(1, "rgba(24,226,153," + (0.18 + 0.12 * Math.sin(now / 700 + i)) + ")");
      fctx.strokeStyle = g; fctx.lineWidth = 1; fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(cx, cy); fctx.stroke(); });
    if (now - last > 160) { last = now; var k = Math.floor(Math.random() * pos.length); parts.push({ i: k, t: 0, v: 0.012 + Math.random() * 0.01 }); }
    parts = parts.filter(function (q) { q.t += q.v; return q.t < 1; });
    parts.forEach(function (q) { var p = pos[q.i]; if (!p) return; var e = q.t * q.t, x = p.x + (cx - p.x) * e, y = p.y + (cy - p.y) * e;
      var r = 2.4 * (1 - q.t * 0.5); var gl = fctx.createRadialGradient(x, y, 0, x, y, r * 5); gl.addColorStop(0, "rgba(160,255,215,.95)"); gl.addColorStop(1, "rgba(24,226,153,0)");
      fctx.fillStyle = gl; fctx.beginPath(); fctx.arc(x, y, r * 5, 0, 6.283); fctx.fill(); });
  }

  var on = false, raf = 0, t0 = performance.now();
  function frame(now) { var t = (now - t0) / 1000; drawSky(t); drawFx(place(t), now); if (on) raf = requestAnimationFrame(frame); }
  function setup() { sizeSky(); sizeOrbit(); if (still) { drawSky(0); place(0); } }
  setup(); addEventListener("resize", function () { setup(); });
  if (document.fonts) document.fonts.ready.then(function () { place((performance.now() - t0) / 1000); });
  place(0); drawSky(0);
  if (!still) seen(document.getElementById("omniscience"), function (vis) { if (vis && !on) { on = true; raf = requestAnimationFrame(frame); } else if (!vis) { on = false; cancelAnimationFrame(raf); } }, { threshold: 0 });
})();
