/* The problem section's picture: a black monolith on rocky ground at dawn, after the opening of 2001: A Space
   Odyssey (drawn from scratch, no film still). A dark cliff on the left, a bright sky low on the horizon with streaks
   of cloud, broken rock in front, and the slab standing in it. The scene is painted small on a hidden canvas, then
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

  // the boulders in front, fixed
  const rocks = Array.from({ length: 9 }, (_, k) => ({ x: 0.04 + k * 0.12 + rnd() * 0.05, y: 0.68 + rnd() * 0.1, w: 0.07 + rnd() * 0.07, h: 0.035 + rnd() * 0.035 }));

  const img = s.createImageData(N, N);
  const scene = (dawn, t) => {
    const D = img.data, drift = t * 0.012, hz = 0.6;
    for (let j = 0; j < N; j++) {
      const y = j / N;
      for (let i = 0; i < N; i++) {
        const x = i / N;
        let v;
        if (y < hz) {
          // sky: dark at the top, bright low on the horizon, brightest behind the right half
          const low = Math.pow(y / hz, 2.2);
          const sunGlow = Math.exp(-(Math.pow((x - 0.62) / 0.34, 2) + Math.pow((y - hz) / 0.16, 2)));
          v = (0.02 + 0.6 * low) * (0.35 + 0.65 * dawn) + 0.5 * sunGlow * dawn;
          // streaks of cloud, dark against the bright sky
          const cl = fbm(x * 5 + drift, y * 16);
          const band = Math.exp(-Math.pow((y - 0.18) / 0.12, 2)) + 0.8 * Math.exp(-Math.pow((y - 0.42) / 0.06, 2));
          v *= 1 - Math.min(0.9, Math.max(0, cl - 0.48) * 3.2 * band);
        } else {
          // rocky ground, lit from the low sun, darker toward us
          const r = fbm(x * 9, y * 14);
          v = (0.18 + 0.5 * r) * (1 - (y - hz) * 1.25) * (0.5 + 0.5 * dawn);
        }
        // the cliff on the left and the rock on the right edge
        const cliff = 0.3 - 0.16 * Math.pow(y / 0.62, 1.6) + 0.05 * (fbm(y * 8, 3) - 0.5);
        if (x < cliff && y < 0.66) v = Math.max(0, fbm(x * 10, y * 10) - 0.62) * 0.5;
        if (x > 0.93 - 0.08 * fbm(y * 6, 7) && y < 0.5) v = 0;
        const k = (j * N + i) * 4;
        D[k] = D[k + 1] = D[k + 2] = Math.max(0, Math.min(255, v * 255));
        D[k + 3] = 255;
      }
    }
    s.putImageData(img, 0, 0);
    const P = (v) => v * N;
    // boulders in front, lit on top
    for (const b of rocks) {
      s.fillStyle = "rgba(0,0,0,.55)";
      s.beginPath(); s.ellipse(P(b.x), P(b.y + b.h * 0.4), P(b.w), P(b.h), 0, 0, 6.283); s.fill();
      s.fillStyle = `rgba(255,255,255,${0.18 + 0.2 * dawn})`;
      s.beginPath(); s.ellipse(P(b.x), P(b.y), P(b.w * 0.8), P(b.h * 0.35), 0, Math.PI, 0); s.fill();
    }
    // the slab: dark front, a lighter side, a lit edge, standing in the rock
    s.fillStyle = "#020202";
    s.fillRect(P(0.34), P(0.09), P(0.105), P(0.81));
    s.fillStyle = "rgba(40,40,40,1)";
    s.beginPath(); s.moveTo(P(0.445), P(0.09)); s.lineTo(P(0.47), P(0.1)); s.lineTo(P(0.47), P(0.89)); s.lineTo(P(0.445), P(0.9)); s.fill();
    s.fillStyle = `rgba(255,255,255,${0.12 + 0.3 * dawn})`;
    s.fillRect(P(0.443), P(0.2), P(0.003), P(0.7));
    // its shadow across the ground
    s.fillStyle = "rgba(0,0,0,.6)";
    s.beginPath(); s.moveTo(P(0.34), P(0.9)); s.lineTo(P(0.47), P(0.89)); s.lineTo(P(0.3), N); s.lineTo(P(0.12), N); s.fill();
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
    const cell = Math.max(5, W / 82);
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
