/* The problem section's picture: a black monolith on rocky ground at dawn, after the opening of 2001: A Space
   Odyssey (drawn from scratch, no film still). A bright sky with dark streaks of cloud, a dark overhanging cliff on
   the left, layered rock ledges with caves in front, an ape on the right rock, and the slab standing between them. The scene is painted small on a hidden canvas, then
   redrawn as a grid of white dots whose size follows the brightness. Dawn breaks once the section comes into view;
   after that the clouds drift and the dots shimmer. Pauses when out of view; reduced motion shows the full dawn. */
(function () {
  const c = document.getElementById("monolith");
  if (!c) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const g = c.getContext("2d");
  const N = 240;
  const o = document.createElement("canvas");
  o.width = o.height = N;
  const s = o.getContext("2d", { willReadFrequently: true });

  // value noise for rock and cloud texture
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const G = 64, grid = Array.from({ length: G * G }, rnd);
  const vn = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const at = (i, j) => grid[((j % G + G) % G) * G + ((i % G + G) % G)];
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (at(xi, yi) * (1 - u) + at(xi + 1, yi) * u) * (1 - v) + (at(xi, yi + 1) * (1 - u) + at(xi + 1, yi + 1) * u) * v;
  };
  const fbm = (x, y) => vn(x, y) * 0.55 + vn(x * 2.1, y * 2.1) * 0.28 + vn(x * 4.3, y * 4.3) * 0.17;

  const img = s.createImageData(N, N);
  const HZ = 0.6; // the horizon
  // rock ledges: bands of lit stone with dark cracks between them
  const ledge = (x, y) => {
    const band = Math.sin((y * 34 + fbm(x * 3, y * 2) * 3.2) * 1.0);
    const crack = Math.max(0, 1 - Math.abs(band) * 5);
    return 0.62 + 0.25 * fbm(x * 7, y * 9) - 0.45 * crack;
  };
  const scene = (dawn, t) => {
    const D = img.data, drift = t * 0.01;
    for (let j = 0; j < N; j++) {
      const y = j / N;
      for (let i = 0; i < N; i++) {
        const x = i / N;
        let v;
        if (y < HZ) {
          // a bright sky, brightest just above the horizon, with dark streaks of cloud
          const glow = Math.exp(-(Math.pow((x - 0.66) / 0.42, 2) + Math.pow((y - HZ) / 0.22, 2)));
          v = (0.62 + 0.3 * (y / HZ) + 0.12 * glow) * (0.55 + 0.45 * dawn);
          const cl = fbm(x * 4.2 + drift, y * 15);
          const band = Math.exp(-Math.pow((y - 0.05) / 0.07, 2)) + Math.exp(-Math.pow((y - 0.17) / 0.05, 2)) * 0.9 + Math.exp(-Math.pow((y - 0.33) / 0.035, 2)) * 0.8 + Math.exp(-Math.pow((y - 0.48) / 0.03, 2)) * 0.7;
          v *= 1 - Math.min(0.75, Math.max(0, cl - 0.5) * 3.4 * band);
        } else {
          // the rocky ground: lit ledges, darker toward the bottom
          v = ledge(x, y) * (1 - (y - HZ) * 0.5) * (0.6 + 0.4 * dawn);
        }
        const k = (j * N + i) * 4;
        D[k] = D[k + 1] = D[k + 2] = Math.max(0, Math.min(255, v * 255));
        D[k + 3] = 255;
      }
    }
    s.putImageData(img, 0, 0);
    const P = (v) => v * N;
    const poly = (pts, fill) => { s.fillStyle = fill; s.beginPath(); pts.forEach(([a, b], k) => (k ? s.lineTo(P(a), P(b)) : s.moveTo(P(a), P(b)))); s.closePath(); s.fill(); };
    // the overhanging cliff on the left, dark against the sky
    poly([[0, 0], [0.34, 0], [0.33, 0.04], [0.29, 0.1], [0.24, 0.18], [0.255, 0.27], [0.3, 0.36], [0.33, 0.47], [0.33, 0.58], [0.0, 0.62]], "rgba(6,6,6,1)");
    // dark rock on the right edge, and the ape on it
    poly([[0.93, 0.02], [1, 0], [1, 0.52], [0.95, 0.46], [0.92, 0.3], [0.94, 0.15]], "rgba(8,8,8,1)");
    // the ape: a hunched back, a head held low and forward, long arms down to the rock
    s.fillStyle = "rgba(10,10,10,1)";
    s.beginPath(); s.ellipse(P(0.895), P(0.49), P(0.055), P(0.06), -0.5, 0, 6.283); s.fill();
    s.beginPath(); s.ellipse(P(0.862), P(0.448), P(0.026), P(0.03), 0.2, 0, 6.283); s.fill();
    poly([[0.838, 0.47], [0.858, 0.47], [0.86, 0.565], [0.842, 0.565]], "rgba(10,10,10,1)");
    poly([[0.905, 0.5], [0.935, 0.5], [0.945, 0.565], [0.92, 0.565]], "rgba(10,10,10,1)");
    // a low ridge on the horizon
    poly([[0.45, 0.6], [0.55, 0.585], [0.62, 0.59], [0.7, 0.575], [0.78, 0.585], [0.78, 0.62], [0.45, 0.62]], "rgba(30,30,30,1)");
    // caves under the ledges
    const cave = (cx, cy, rx, ry) => { const gr = s.createRadialGradient(P(cx), P(cy), 0, P(cx), P(cy), P(Math.max(rx, ry))); gr.addColorStop(0, "rgba(0,0,0,.85)"); gr.addColorStop(0.6, "rgba(0,0,0,.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); s.fillStyle = gr; s.beginPath(); s.ellipse(P(cx), P(cy), P(rx), P(ry), 0, 0, 6.283); s.fill(); };
    cave(0.25, 0.83, 0.09, 0.03);
    cave(0.75, 0.81, 0.15, 0.06);
    cave(0.6, 0.72, 0.06, 0.018);
    cave(0.07, 0.94, 0.07, 0.02);
    // the slab: a dark front face, a sliver of lit side, standing on the ground
    poly([[0.325, 0.085], [0.43, 0.085], [0.43, 0.905], [0.325, 0.9]], "#000");
    poly([[0.43, 0.085], [0.445, 0.095], [0.445, 0.9], [0.43, 0.905]], "rgba(48,48,48,1)");
    // its shadow on the ground
    poly([[0.325, 0.9], [0.445, 0.9], [0.4, 1], [0.24, 1]], "rgba(0,0,0,.55)");
  };

  let W = 0, H = 0, d = 1, start = 0, vis = false, seen = false, last = 0;
  const size = () => {
    d = Math.min(2, devicePixelRatio || 1);
    W = c.clientWidth; H = c.clientHeight;
    c.width = Math.round(W * d); c.height = Math.round(H * d);
  };
  const draw = (now) => {
    const t = now / 1000;
    const p = reduce ? 1 : seen ? Math.min(1, (now - start) / 3800) : 0;
    const dawn = 0.25 + 0.75 * (1 - Math.pow(1 - p, 3));
    scene(dawn, t);
    const px = s.getImageData(0, 0, N, N).data;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, W, H);
    const cell = Math.max(4.5, W / 96);
    g.fillStyle = "#fff";
    for (let y = cell / 2, r = 0; y < H; y += cell, r++) {
      const sy = Math.min(N - 1, Math.floor((y / H) * N));
      for (let x = cell / 2, q = 0; x < W; x += cell, q++) {
        const sx = Math.min(N - 1, Math.floor((x / W) * N));
        let v = px[(sy * N + sx) * 4] / 255;
        if (!reduce) v *= 0.92 + 0.08 * Math.sin(t * 1.7 + r * 0.9 + q * 0.6);
        if (v < 0.05) continue;
        g.globalAlpha = 0.45 + 0.55 * v;
        g.beginPath(); g.arc(x, y, Math.min(cell * 0.5, cell * 0.56 * Math.sqrt(v)), 0, 6.283); g.fill();
      }
    }
    g.globalAlpha = 1;
  };

  size();
  addEventListener("resize", () => { size(); draw(performance.now()); });
  if ("IntersectionObserver" in window)
    new IntersectionObserver((es) => es.forEach((en) => {
      vis = en.isIntersecting;
      if (vis && !seen) { seen = true; start = performance.now(); }
    }), { threshold: 0.25 }).observe(c);
  else { seen = true; vis = true; }
  draw(performance.now());
  if (reduce) return;
  const loop = (now) => {
    const rising = seen && now - start < 4000;
    if (vis && !document.hidden && now - last > (rising ? 40 : 90)) { last = now; draw(now); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
