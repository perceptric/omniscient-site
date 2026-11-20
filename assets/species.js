/* The three panels under "Introducing a new species of CRM & GTM platform", drawn in white dots to match the earth
   and the monolith. Each loops while its panel is in view.
   1. Single source of truth: scattered records drift in from everywhere and settle into one turning sphere of dots.
   2. CRM intelligence: a stack of record cards whose empty fields fill in as a call's signal sweeps across them.
   3. Agentic GTM: a core sends pulses along spokes to six agents, each lighting up when its job lands.
   Reduced motion shows one still frame of each. */
(function () {
  const cs = [...document.querySelectorAll("canvas[data-dfig]")];
  if (!cs.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const dot = (g, x, y, r, a) => { if (a <= 0.01) return; g.globalAlpha = Math.min(1, a); g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); };

  // points evenly spread on a sphere
  const sphere = (n) => Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), th = i * 2.39996;
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  });
  let seed = 5;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // 1. many records settle into one sphere
  const S1 = sphere(260).map((p) => ({ p, from: [(rnd() - 0.5) * 2.6, (rnd() - 0.5) * 1.5], delay: rnd() * 0.25 }));
  function fig1(g, w, h, t) {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.3, cyc = 9, ph = (t % cyc) / cyc;
    // gather 0-.45, hold .45-.8, scatter .8-1
    const gather = ph < 0.45 ? ph / 0.45 : ph < 0.8 ? 1 : 1 - (ph - 0.8) / 0.2;
    const spin = t * 0.35;
    // a faint orbit ring around it
    g.fillStyle = "#fff";
    for (let k = 0; k < 90; k++) { const a = (k / 90) * 6.283; dot(g, cx + Math.cos(a) * R * 1.55, cy + Math.sin(a) * R * 0.42, 0.8, 0.18 + 0.12 * Math.sin(a + t)); }
    for (const s of S1) {
      const k = ease(clamp((gather - s.delay) / (1 - s.delay)));
      const [x0, y0, z0] = s.p, ca = Math.cos(spin), sa = Math.sin(spin);
      const x = x0 * ca + z0 * sa, z = -x0 * sa + z0 * ca;
      const sx = cx + x * R, sy = cy + y0 * R;
      const fx = cx + s.from[0] * R * 1.3, fy = cy + s.from[1] * R * 1.3;
      const px = fx + (sx - fx) * k, py = fy + (sy - fy) * k;
      const depth = (z + 1) / 2;
      dot(g, px, py, 0.8 + 1.1 * depth * k + 0.5 * (1 - k), (0.25 + 0.75 * depth) * (0.45 + 0.55 * k));
    }
    // the core glows once gathered
    const gl = g.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
    gl.addColorStop(0, `rgba(255,255,255,${0.12 * gather})`); gl.addColorStop(1, "rgba(255,255,255,0)");
    g.globalAlpha = 1; g.fillStyle = gl; g.fillRect(0, 0, w, h); g.fillStyle = "#fff";
  }

  // 2. record cards fill in as a signal passes
  function fig2(g, w, h, t) {
    const cards = 5, cw = w * 0.42, ch = h * 0.5, cyc = 6.5, ph = (t % cyc) / cyc;
    const sweep = -0.2 + ph * 1.5; // 0..1 across the stack, then rests
    const gap = 6.2, cols = Math.floor(cw / gap), rows = Math.floor(ch / gap);
    g.fillStyle = "#fff";
    for (let c = cards - 1; c >= 0; c--) {
      const ox = w * 0.16 + c * w * 0.085, oy = h * 0.2 + (cards - 1 - c) * h * 0.035 - c * h * 0.01;
      const cardPos = c / (cards - 1);
      const filled = clamp((sweep - cardPos) * 4);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = ox + i * gap * (1 - c * 0.015), y = oy + j * gap;
          const edge = i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
          // fields: short lines of dots on alternate rows
          const fieldRow = j > 1 && j < rows - 1 && j % 3 === 1;
          const len = 3 + ((j * 7 + c * 3) % Math.max(4, cols - 6));
          const field = fieldRow && i > 1 && i < 2 + len;
          const head = j === 1 && i > 1 && i < 6;
          let a = edge ? 0.45 : 0.1;
          if (head) a = 0.7;
          if (field) a = 0.22 + 0.78 * clamp(filled * 1.4 - (i / cols) * 0.4);
          const beam = Math.exp(-Math.pow(((ox - w * 0.16) / (w * 0.34) - sweep) * 8, 2));
          a += beam * (edge ? 0.5 : 0.18);
          dot(g, x, y, field && a > 0.5 ? 1.5 : 1.15, a * (0.7 + 0.3 * (c / (cards - 1))));
        }
      }
    }
    // the signal wave running through the stack
    for (let i = 0; i < 70; i++) {
      const u = i / 69, x = w * 0.12 + u * w * 0.76;
      const y = h * 0.5 + Math.sin(u * 14 - t * 3) * h * 0.08 * Math.exp(-Math.pow((u - sweep) * 3, 2));
      dot(g, x, y, 1.3, 0.25 + 0.75 * Math.exp(-Math.pow((u - sweep) * 5, 2)));
    }
  }

  // 3. a core sends jobs to six agents
  const CORE = sphere(90);
  function fig3(g, w, h, t) {
    const cx = w / 2, cy = h * 0.5, R = Math.min(w * 0.42, h * 0.62), rot = t * 0.12;
    const P = (a, rr) => [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.45];
    g.fillStyle = "#fff";
    // orbit ring
    for (let k = 0; k < 120; k++) { const a = (k / 120) * 6.283; const [x, y] = P(a, R); dot(g, x, y, 0.8, 0.12 + 0.18 * (Math.sin(a) + 1) / 2); }
    const agents = Array.from({ length: 6 }, (_, k) => rot + (k / 6) * 6.283);
    const order = agents.map((a, k) => ({ a, k })).sort((p, q) => Math.sin(p.a) - Math.sin(q.a));
    const drawAgent = ({ a, k }) => {
      const [x, y] = P(a, R), depth = (Math.sin(a) + 1) / 2;
      const ph = ((t * 0.5 + k / 6) % 1);
      const lit = ph > 0.55 && ph < 0.85 ? 1 : 0.3;
      // spoke with a pulse running out to the agent
      for (let i = 1; i < 18; i++) { const u = i / 18; dot(g, cx + (x - cx) * u, cy + (y - cy) * u, 0.7, 0.12 * (0.5 + depth)); }
      if (ph < 0.55) { const u = ease(ph / 0.55); for (let j = 0; j < 5; j++) { const v = clamp(u - j * 0.03); dot(g, cx + (x - cx) * v, cy + (y - cy) * v, 1.6 - j * 0.25, (1 - j / 5) * (0.5 + 0.5 * depth)); } }
      // the agent: a small cube of dots
      const sz = 3.5 + depth * 2.5;
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) dot(g, x + i * sz * 1.6, y + j * sz * 1.6, 1.1 + depth * 0.6, (0.35 + 0.65 * lit) * (0.5 + 0.5 * depth));
      if (lit > 0.5) { const gl = g.createRadialGradient(x, y, 0, x, y, 22); gl.addColorStop(0, "rgba(255,255,255,.25)"); gl.addColorStop(1, "rgba(255,255,255,0)"); g.globalAlpha = 1; g.fillStyle = gl; g.fillRect(x - 22, y - 22, 44, 44); g.fillStyle = "#fff"; }
    };
    order.filter((o) => Math.sin(o.a) < 0).forEach(drawAgent);
    // the core sphere
    const cr = R * 0.32, sp = t * 0.6;
    for (const [x0, y0, z0] of CORE) {
      const x = x0 * Math.cos(sp) + z0 * Math.sin(sp), z = -x0 * Math.sin(sp) + z0 * Math.cos(sp), depth = (z + 1) / 2;
      dot(g, cx + x * cr, cy + y0 * cr, 0.8 + depth, 0.25 + 0.75 * depth);
    }
    order.filter((o) => Math.sin(o.a) >= 0).forEach(drawAgent);
  }

  const FIG = { 1: fig1, 2: fig2, 3: fig3 };
  const items = cs.map((c) => ({ c, g: c.getContext("2d"), fn: FIG[c.dataset.dfig], vis: !("IntersectionObserver" in window), w: 0, h: 0, d: 1 }));
  const size = () => items.forEach((it) => {
    it.d = Math.min(2, devicePixelRatio || 1); it.w = it.c.clientWidth; it.h = it.c.clientHeight;
    it.c.width = Math.round(it.w * it.d); it.c.height = Math.round(it.h * it.d);
  });
  const draw = (it, t) => {
    if (!it.fn || !it.w) return;
    it.g.setTransform(it.d, 0, 0, it.d, 0, 0);
    it.g.clearRect(0, 0, it.w, it.h);
    it.fn(it.g, it.w, it.h, t);
    it.g.globalAlpha = 1;
  };
  size();
  items.forEach((it) => draw(it, 4.2));
  addEventListener("resize", () => { size(); items.forEach((it) => draw(it, performance.now() / 1000)); });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const it = items.find((x) => x.c === e.target); if (it) it.vis = e.isIntersecting; }));
    items.forEach((it) => io.observe(it.c));
  }
  if (reduce) return;
  let last = 0;
  const loop = (now) => {
    if (!document.hidden && now - last > 32) { last = now; items.forEach((it) => it.vis && draw(it, now / 1000)); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
