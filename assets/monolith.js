/* The problem section's picture: a black monolith on a moon at sunrise, with the sun rising over a crescent above
   it. The scene is painted small on a hidden canvas, then redrawn as rows of light dashes whose length follows the
   brightness, so the slab reads as a dark cut-out against the glow. The sun rises once the section comes into view;
   after that only a slow shimmer runs. Pauses when out of view; reduced motion shows the risen sun. */
(function () {
  const c = document.getElementById("monolith");
  if (!c) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const g = c.getContext("2d");
  const N = 300; // the hidden scene is N x N
  const o = document.createElement("canvas");
  o.width = o.height = N;
  const s = o.getContext("2d", { willReadFrequently: true });

  // fixed details: stars and craters
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const stars = Array.from({ length: 60 }, () => [rnd(), rnd() * 0.62, 0.3 + rnd() * 0.7]);
  const craters = Array.from({ length: 14 }, () => [0.06 + rnd() * 0.88, 0.75 + rnd() * 0.22, 0.012 + rnd() * 0.035]);

  const scene = (rise, t) => {
    const P = (v) => v * N;
    s.fillStyle = "#000";
    s.fillRect(0, 0, N, N);
    for (const [x, y, a] of stars) { s.fillStyle = `rgba(255,255,255,${a * 0.55})`; s.fillRect(P(x), P(y), 1.2, 1.2); }
    // the sun climbs over the crescent
    const sy = 0.27 - rise * 0.12, pulse = 1 + Math.sin(t * 0.8) * 0.03;
    let gr = s.createRadialGradient(P(0.5), P(sy), 0, P(0.5), P(sy), P(0.5 * pulse));
    gr.addColorStop(0, `rgba(255,255,255,${0.3 + rise * 0.7})`);
    gr.addColorStop(0.08, `rgba(255,255,255,${0.2 + rise * 0.45})`);
    gr.addColorStop(0.3, `rgba(255,255,255,${0.06 + rise * 0.14})`);
    gr.addColorStop(0.65, `rgba(255,255,255,${0.02 + rise * 0.04})`);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    s.fillStyle = gr;
    s.fillRect(0, 0, N, N);
    // rays
    s.save();
    s.translate(P(0.5), P(sy));
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * Math.PI * 2 + t * 0.02;
      s.rotate((Math.PI * 2) / 14);
      const rg = s.createLinearGradient(0, 0, P(0.55), 0);
      rg.addColorStop(0, `rgba(255,255,255,${0.14 * rise})`);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      s.fillStyle = rg;
      s.beginPath(); s.moveTo(0, 0); s.lineTo(P(0.55), -P(0.012) * (1 + Math.sin(a * 3))); s.lineTo(P(0.55), P(0.012)); s.fill();
    }
    s.restore();
    s.fillStyle = "#fff";
    s.beginPath(); s.arc(P(0.5), P(sy), P(0.022), 0, 6.283); s.fill();
    // crescent: a lit edge, then the dark disc over it
    s.fillStyle = `rgba(255,255,255,${0.55 + 0.45 * rise})`;
    s.beginPath(); s.arc(P(0.5), P(0.212), P(0.06), 0, 6.283); s.fill();
    s.fillStyle = "#000";
    s.beginPath(); s.arc(P(0.5), P(0.222), P(0.06), 0, 6.283); s.fill();
    // dawn light along the horizon, so the slab stands out against it
    gr = s.createRadialGradient(P(0.5), P(0.74), 0, P(0.5), P(0.74), P(0.62));
    gr.addColorStop(0, `rgba(255,255,255,${0.25 + 0.5 * rise})`);
    gr.addColorStop(0.35, `rgba(255,255,255,${0.1 + 0.22 * rise})`);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    s.fillStyle = gr;
    s.fillRect(0, 0, N, N);
    // the moon's surface, lit toward the horizon
    gr = s.createLinearGradient(0, P(0.72), 0, N);
    gr.addColorStop(0, "rgba(225,225,225,1)");
    gr.addColorStop(0.3, "rgba(120,120,120,1)");
    gr.addColorStop(1, "rgba(25,25,25,1)");
    s.fillStyle = gr;
    s.beginPath(); s.arc(P(0.5), P(2.18), P(1.46), 0, 6.283); s.fill();
    for (const [x, y, r] of craters) { s.fillStyle = "rgba(0,0,0,.35)"; s.beginPath(); s.ellipse(P(x), P(y), P(r), P(r * 0.32), 0, 0, 6.283); s.fill(); }
    // the monolith's long shadow toward us
    s.fillStyle = "rgba(0,0,0,.85)";
    s.beginPath(); s.moveTo(P(0.465), P(0.82)); s.lineTo(P(0.535), P(0.82)); s.lineTo(P(0.6), N); s.lineTo(P(0.4), N); s.fill();
    // the slab: front face, a sliver of side, and a rim of light on its edges
    s.fillStyle = "#000";
    s.fillRect(P(0.465), P(0.36), P(0.07), P(0.46));
    s.fillStyle = "rgba(40,40,40,1)";
    s.beginPath(); s.moveTo(P(0.535), P(0.36)); s.lineTo(P(0.552), P(0.353)); s.lineTo(P(0.552), P(0.813)); s.lineTo(P(0.535), P(0.82)); s.fill();
    s.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * rise})`;
    s.fillRect(P(0.465), P(0.36), P(0.004), P(0.46));
    s.fillRect(P(0.465), P(0.36), P(0.087), P(0.003));
  };

  let W = 0, H = 0, d = 1, start = 0, vis = false, seen = false, last = 0;
  const size = () => {
    d = Math.min(2, devicePixelRatio || 1);
    W = c.clientWidth; H = c.clientHeight;
    c.width = Math.round(W * d); c.height = Math.round(H * d);
  };
  const draw = (now) => {
    const t = now / 1000;
    const rise = reduce ? 1 : seen ? Math.min(1, (now - start) / 4200) : 0;
    const e = 1 - Math.pow(1 - rise, 3);
    scene(e, t);
    const px = s.getImageData(0, 0, N, N).data;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, W, H);
    const row = Math.max(4, W / 110), cell = Math.max(5, W / 90);
    for (let y = row / 2, r = 0; y < H; y += row, r++) {
      const sy = Math.min(N - 1, Math.floor((y / H) * N));
      const jit = reduce ? 0 : Math.sin(t * 1.3 + r * 0.7) * 0.6;
      for (let x = cell / 2; x < W; x += cell) {
        const sx = Math.min(N - 1, Math.floor((x / W) * N));
        const v = Math.pow(px[(sy * N + sx) * 4] / 255, 1.35);
        if (v < 0.06) continue;
        const len = Math.min(cell, cell * Math.pow(v, 0.8) * 1.05);
        g.fillStyle = `rgba(226,232,255,${0.35 + v * 0.65})`;
        g.fillRect(x - len / 2 + jit, y - 1, len, 2);
      }
    }
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
    const rising = seen && now - start < 4400;
    if (vis && !document.hidden && now - last > (rising ? 33 : 80)) { last = now; draw(now); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
