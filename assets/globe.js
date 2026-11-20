/* The home page globe: a real Earth under the hero, drawn with one WebGL2 shader (no library).
   Day side from NASA's Blue Marble, night side from NASA's Black Marble city lights, ocean shine from a water mask,
   clouds that drift on their own, and a blue atmosphere on the rim. The sun sits up and to the left, so the
   terminator crosses the cap and cities light up as they turn into the night. A 2D canvas on top draws arcs between
   the cities Omniscient's customers work from. Falls back to the plain planet when WebGL2 or the images aren't there.
   Textures load after the page does; the globe fades in when they are ready and pauses while out of view. */
(function () {
  const box = document.querySelector(".horizon");
  if (!box) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl0 = document.createElement("canvas");
  const gl = gl0.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;

  const wrap = document.createElement("div");
  wrap.className = "globe";
  wrap.setAttribute("aria-hidden", "true");
  const fx = document.createElement("canvas");
  gl0.className = "globe-gl";
  fx.className = "globe-fx";
  wrap.append(gl0, fx);
  box.prepend(wrap);
  const g = fx.getContext("2d");

  const VS = `#version 300 es
  in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
  precision highp float;
  uniform vec2 uRes; uniform vec2 uC; uniform float uR; uniform float uSpin; uniform float uCloud; uniform float uTilt; uniform vec3 uSun; uniform float uFade;
  uniform sampler2D uDay, uNight, uWater, uClouds;
  out vec4 o;
  const float PI = 3.14159265;
  vec3 toGlobe(vec3 n, float spin){
    float c = cos(uTilt), s = sin(uTilt);
    vec3 a = vec3(n.x, c*n.y - s*n.z, s*n.y + c*n.z);
    float cs = cos(spin), sn = sin(spin);
    return vec3(cs*a.x + sn*a.z, a.y, -sn*a.x + cs*a.z);
  }
  vec4 tex(sampler2D t, vec2 uv){
    // the seam at 180 degrees: pick whichever wrap of the longitude changes least between pixels
    vec2 uv2 = vec2(fract(uv.x + .5) - .5, uv.y);
    vec2 dx = dFdx(uv), dy = dFdy(uv), dx2 = dFdx(uv2), dy2 = dFdy(uv2);
    if (abs(dx.x) + abs(dy.x) > abs(dx2.x) + abs(dy2.x)) { return textureGrad(t, uv2, dx2, dy2); }
    return textureGrad(t, uv, dx, dy);
  }
  vec2 uvOf(vec3 q){ return vec2(atan(q.x, q.z) / (2.*PI) + .5, .5 - asin(clamp(q.y, -1., 1.)) / PI); }
  void main(){
    vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 d = (px - uC) / uR; d.y = -d.y;
    float r2 = dot(d, d), r = sqrt(r2);
    vec3 sun = normalize(uSun);
    vec3 col = vec3(0.); float a = 0.;
    // atmosphere: a soft blue rim, brighter on the sunny side
    float sunSide = clamp(dot(normalize(d), normalize(sun.xy)) * .5 + .5, 0., 1.);
    if (r >= 1.) {
      float h = (r - 1.) * uR;
      float glow = (exp(-h / 7.) * .9 + exp(-h / 26.) * .42 + exp(-h / 70.) * .16) * (1. - smoothstep(70., 120., h));
      glow *= .35 + .9 * sunSide;
      col = vec3(.36, .55, 1.) * glow; a = clamp(glow, 0., 1.);
    } else {
      vec3 n = vec3(d, sqrt(1. - r2));
      vec3 q = toGlobe(n, uSpin);
      vec2 uv = uvOf(q);
      float ndl = dot(n, sun);
      float day = smoothstep(-.12, .28, ndl);
      vec3 dayc = pow(tex(uDay, uv).rgb, vec3(1.08)) * 1.05;
      vec3 lights = tex(uNight, uv).rgb;
      float water = tex(uWater, uv).r;
      vec3 qc = toGlobe(n, uSpin + uCloud);
      float cl = tex(uClouds, uvOf(qc)).r;
      // lit side
      vec3 lit = dayc * (.15 + .95 * max(ndl, 0.));
      lit = mix(lit, vec3(.9, .94, 1.) * (.12 + .95 * max(ndl, 0.)), cl * .85);
      vec3 hv = normalize(sun + vec3(0., 0., 1.));
      float spec = pow(max(dot(n, hv), 0.), 60.) * water * (1. - cl) * .9;
      lit += vec3(1., .93, .8) * spec * day;
      // night side: city lights, dimmed under clouds, and a faint blue ground
      vec3 night = lights * vec3(1.35, 1.05, .7) * (1. - cl * .75) + dayc * .018 + vec3(.004, .007, .016);
      col = mix(night, lit, day);
      // terminator glow and the atmosphere seen through the edge
      float fres = pow(1. - n.z, 3.);
      col += vec3(1., .55, .3) * exp(-pow(ndl / .07, 2.)) * .08;
      col += vec3(.3, .5, 1.) * fres * (.25 + .9 * max(ndl + .2, 0.));
      col *= .92;
      // antialias the limb into the rim glow
      float inside = smoothstep(1., 1. - 1.5 / uR, r);
      float glow = (.35 + .9 * sunSide) * 1.57;
      col = mix(vec3(.36, .55, 1.) * glow, col, inside);
      a = mix(clamp(glow, 0., 1.), 1., inside);
    }
    o = vec4(col * uFade, a * uFade);
  }`;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    wrap.remove();
    return;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ["uRes", "uC", "uR", "uSpin", "uCloud", "uTilt", "uSun", "uFade", "uDay", "uNight", "uWater", "uClouds"].forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));

  const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
  const load = (src, unit) =>
    new Promise((res, rej) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        const t = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
        res();
      };
      im.onerror = rej;
      im.src = src;
    });

  // Cities: the arcs run between them. [lat, lon]
  const CITY = {
    ny: [40.71, -74.0], sf: [37.77, -122.42], la: [34.05, -118.24], aus: [30.27, -97.74], den: [39.74, -104.99], chi: [41.88, -87.63],
    tor: [43.65, -79.38], mex: [19.43, -99.13], lon: [51.5, -0.12], par: [48.86, 2.35], sto: [59.33, 18.07], mil: [45.46, 9.19],
    ber: [52.52, 13.4], lis: [38.72, -9.14], dub: [25.2, 55.27], mum: [19.08, 72.88], sin: [1.35, 103.82], tok: [35.68, 139.69], seo: [37.57, 126.98], syd: [-33.87, 151.21],
  };
  const PAIRS = [["ny", "lon"], ["sf", "tok"], ["lon", "sto"], ["par", "ny"], ["aus", "mex"], ["chi", "ber"], ["la", "sf"], ["lis", "tor"], ["mil", "dub"], ["dub", "mum"], ["den", "ny"], ["seo", "sin"], ["mum", "sin"], ["tok", "syd"], ["tor", "chi"], ["lon", "mil"]];
  const vec = ([la, lo], h = 1) => {
    const p = (la * Math.PI) / 180, l = (lo * Math.PI) / 180;
    return [Math.cos(p) * Math.sin(l) * h, Math.sin(p) * h, Math.cos(p) * Math.cos(l) * h];
  };
  const slerp = (a, b, t) => {
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(dot), s = Math.sin(om) || 1;
    const ka = Math.sin((1 - t) * om) / s, kb = Math.sin(t * om) / s;
    return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
  };
  const arcs = PAIRS.map(([x, y], k) => {
    const A = vec(CITY[x]), B = vec(CITY[y]), dot = A[0] * B[0] + A[1] * B[1] + A[2] * B[2], lift = 0.06 + Math.acos(dot) * 0.12;
    const pts = [];
    for (let i = 0; i <= 48; i++) { const t = i / 48, v = slerp(A, B, t), h = 1 + Math.sin(t * Math.PI) * lift; pts.push([v[0] * h, v[1] * h, v[2] * h]); }
    return { pts, off: k * 0.37, dur: 3.2 + (k % 5) * 0.6 };
  });
  const cities = Object.values(CITY).map((c) => vec(c));

  const TILT = 0.36, SUN = [-0.86, 0.4, 0.22], PAD = 120;
  let W = 0, H = 0, d = 1, R = 0, C = [0, 0], vis = true, ready = false, fade = 0, t0 = performance.now();
  // a view-space point from a globe-space point (the inverse of the shader's toGlobe)
  const toView = (q, spin) => {
    const cs = Math.cos(spin), sn = Math.sin(spin);
    const a = [cs * q[0] - sn * q[2], q[1], sn * q[0] + cs * q[2]];
    const c = Math.cos(TILT), s = Math.sin(TILT);
    return [a[0], c * a[1] + s * a[2], -s * a[1] + c * a[2]];
  };
  const size = () => {
    d = Math.min(1.75, devicePixelRatio || 1);
    // the canvas spans the whole window and starts PAD above the box, so the rim glow is never cut off
    W = document.documentElement.clientWidth;
    const bw = box.clientWidth;
    R = Math.max(380, Math.min(bw * 0.56, 900));
    H = Math.round(PAD + 26 + R * 0.62);
    C = [W / 2, PAD + 26 + R];
    wrap.style.top = -PAD + "px";
    for (const c of [gl0, fx]) { c.width = Math.round(W * d); c.height = Math.round(H * d); c.style.height = H + "px"; }
    gl.viewport(0, 0, gl0.width, gl0.height);
  };

  const draw = (now) => {
    const t = reduce ? 40 : (now - t0) / 1000 + 40;
    const spin = -1.1 + t * 0.022, cloud = t * 0.004;
    if (ready && fade < 1) fade = Math.min(1, fade + (reduce ? 1 : 0.025));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uRes, gl0.width, gl0.height);
    gl.uniform2f(U.uC, C[0] * d, C[1] * d);
    gl.uniform1f(U.uR, R * d);
    gl.uniform1f(U.uSpin, spin);
    gl.uniform1f(U.uCloud, cloud);
    gl.uniform1f(U.uTilt, TILT);
    gl.uniform3f(U.uSun, SUN[0], SUN[1], SUN[2]);
    gl.uniform1f(U.uFade, fade);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // arcs and city dots on the near side
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, W, H);
    if (!fade) return;
    const P = (q) => { const v = toView(q, spin); return [C[0] + v[0] * R, C[1] - v[1] * R, v[2]]; };
    g.globalCompositeOperation = "lighter";
    for (const c of cities) {
      const p = P(c);
      if (p[2] < 0.05 || p[1] > H) continue;
      const a = Math.min(1, p[2] * 3) * fade;
      g.fillStyle = `rgba(190,215,255,${0.85 * a})`;
      g.beginPath(); g.arc(p[0], p[1], 1.6, 0, 6.283); g.fill();
      g.fillStyle = `rgba(120,160,255,${0.18 * a})`;
      g.beginPath(); g.arc(p[0], p[1], 5, 0, 6.283); g.fill();
    }
    g.lineCap = "round";
    for (const arc of arcs) {
      const ph = ((t / arc.dur + arc.off) % 1.6) / 1.2; // 0..1.33: travel, then rest
      if (ph > 1.25) continue;
      const head = Math.min(1, ph), tail = Math.max(0, ph - 0.35);
      const pts = arc.pts.map(P), n = pts.length - 1;
      for (let i = Math.floor(tail * n); i < Math.ceil(head * n); i++) {
        const a = pts[i], b = pts[i + 1];
        if (a[2] < 0 || b[2] < 0) continue;
        const k = (i / n - tail) / Math.max(0.001, head - tail);
        const al = Math.max(0, Math.min(1, k)) * Math.min(1, a[2] * 4) * fade * (ph > 1 ? 1 - (ph - 1) * 4 : 1);
        g.strokeStyle = `rgba(170,200,255,${0.75 * al})`;
        g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      const hp = pts[Math.min(n, Math.round(head * n))];
      if (hp[2] > 0 && ph <= 1) {
        g.fillStyle = `rgba(230,240,255,${0.95 * fade})`;
        g.beginPath(); g.arc(hp[0], hp[1], 1.8, 0, 6.283); g.fill();
        g.fillStyle = `rgba(140,175,255,${0.25 * fade})`;
        g.beginPath(); g.arc(hp[0], hp[1], 6, 0, 6.283); g.fill();
      }
    }
    g.globalCompositeOperation = "source-over";
  };

  size();
  let rz;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { size(); draw(performance.now()); }, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((e) => (vis = e.isIntersecting))).observe(wrap);

  const go = () => {
    const base = "/assets/img/globe/";
    Promise.all([load(base + "day.webp", 0), load(base + "night.webp", 1), load(base + "water.webp", 2), load(base + "clouds.webp", 3)])
      .then(() => {
        gl.uniform1i(U.uDay, 0); gl.uniform1i(U.uNight, 1); gl.uniform1i(U.uWater, 2); gl.uniform1i(U.uClouds, 3);
        ready = true;
        box.classList.add("has-globe");
        if (reduce) { fade = 1; draw(performance.now()); return; }
        let last = 0;
        // 30 frames a second is plenty for a slow turn, and halves the GPU work
        const loop = (now) => { if (vis && !document.hidden && now - last > 30) { last = now; draw(now); } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      })
      .catch(() => wrap.remove());
  };
  if (document.readyState === "complete") go();
  else addEventListener("load", go);
})();
