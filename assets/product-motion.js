/* Product page motion (styles in product-motion.css).
   Reads each product screen and plays it step by step when it scrolls into view, and again when you come back:
   a user message is typed into the box and sent, Otto thinks, then his answer, cards and rows land one at a time,
   update rows get applied and pop-ups come in last. Each row's stage also gets a living backdrop.
   Reduced motion shows the last frame. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  document.documentElement.classList.add('pm');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const mx = (el, cls) => { el.classList.add('mx'); if (cls) el.classList.add(cls); return el; };
  const hide = (el, on = true) => el.classList.toggle('x', on);
  const bump = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const svg = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(11);

  function Clock() {
    let ids = [];
    return { at(ms, fn) { ids.push(setTimeout(fn, ms)); }, clear() { ids.forEach(clearTimeout); ids = []; } };
  }
  function snap(el, fn) { el.classList.add('snap'); fn(); void el.offsetWidth; el.classList.remove('snap'); }

  /* ---------- backdrops ---------- */
  function kindOf(el) {
    if ($('.flow,.trig', el)) return 'flow';
    if ($('.urow', el)) return 'call';
    if ($('.tli,.src', el)) return 'sync';
    if ($('.um,.om', el)) return 'chat';
    if ($('tbody tr,.mrow,.tbl', el)) return 'data';
    return 'chat';
  }
  function backdrop(stage, kind) {
    const b = document.createElement('div');
    b.className = 'pm-vbg';
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<i class="au a1"></i><i class="au a2"></i><i class="au a3"></i><i class="spot"></i>';
    const W = 1000, H = 700;
    const art = svg('svg', { class: 'art', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice' });
    if (kind === 'chat') {
      const g = svg('g', { class: 'pm-cn' }, art), pts = [];
      for (let i = 0; i < 60; i++) pts.push([rnd() * W, rnd() * H, rnd()]);
      pts.forEach((p, i) => pts.slice(i + 1).forEach(q => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 125) svg('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, g); }));
      pts.forEach((p, i) => {
        const c = svg('circle', { cx: p[0], cy: p[1], r: (1.4 + p[2] * 2).toFixed(1) }, g);
        c.style.animationDelay = (-p[2] * 4).toFixed(2) + 's';
        if (i % 9 === 0) svg('circle', { class: 'ring', cx: p[0], cy: p[1], r: 8 }, g);
      });
      svg('circle', { class: 'sweep', cx: W / 2, cy: H / 2, r: 560 }, g);
      svg('circle', { class: 'sweep b', cx: W / 2, cy: H / 2, r: 560 }, g);
    } else if (kind === 'sync') {
      const g = svg('g', { class: 'pm-st' }, art);
      for (let i = 0; i < 9; i++) {
        const y = 40 + i * 78, a = 30 + rnd() * 40, ph = rnd() * 400;
        const d = `M-50 ${y} C ${200 + ph * .2} ${y - a}, ${420 + ph * .3} ${y + a}, 620 ${y} S 900 ${y - a}, 1050 ${y}`;
        svg('path', { d }, g);
        svg('path', { d, class: 'f' + (i % 3 === 1 ? ' r' : i % 3 === 2 ? ' s' : '') }, g);
      }
    } else if (kind === 'call') {
      const g = svg('g', { class: 'pm-wf' }, art);
      for (let i = 0; i < 90; i++) {
        const h = 20 + Math.abs(Math.sin(i * 0.37) * 90 + Math.sin(i * 1.3) * 40) + rnd() * 30;
        const r = svg('rect', { x: i * 11.2, y: H - h - 10, width: 4, height: h, rx: 2 }, g);
        r.style.animationDelay = (-rnd() * 1.8).toFixed(2) + 's';
      }
      // the customer's own words from the screen, floating up behind it
      const quotes = $$('small', stage).map(s => s.textContent.trim()).filter(t => /^["“]/.test(t)).slice(0, 4);
      const spots = [[6, 16, 0], [60, 8, -5], [48, 70, -10], [4, 60, -3], [68, 42, -12], [24, 84, -8]];
      quotes.concat(quotes).slice(0, 6).forEach((t, k) => {
        const [x, y, d] = spots[k], q = document.createElement('span');
        q.className = 'pm-qf'; q.textContent = t.length > 44 ? t.slice(0, 42) + '…"' : t;
        q.style.left = x + '%'; q.style.top = y + '%'; q.style.animationDelay = d + 's';
        b.appendChild(q);
      });
    } else if (kind === 'flow') {
      const g = svg('g', { class: 'pm-ng' }, art), cols = 7, rows = 5, cw = W / cols, rh = H / rows, nodes = [], paths = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) if (rnd() > .42) nodes.push([c * cw + cw / 2, r * rh + rh / 2]);
      nodes.forEach((n, i) => { const m = nodes.find((q, j) => j > i && q[0] > n[0] && Math.abs(q[1] - n[1]) <= rh + 1); if (m) { const mid = (n[0] + m[0]) / 2, d = `M${n[0] + 22} ${n[1]} H${mid} V${m[1]} H${m[0] - 22}`; svg('path', { d }, g); paths.push(d); } });
      nodes.forEach(n => svg('rect', { x: n[0] - 22, y: n[1] - 14, width: 44, height: 28, rx: 7 }, g));
      paths.forEach((d, i) => { if (i % 2) return; const c = svg('circle', { r: 2.2 }, g); svg('animateMotion', { dur: (3 + (i % 4)) + 's', repeatCount: 'indefinite', path: d, begin: (-i * .7) + 's' }, c); });
    } else {
      const g = svg('g', { class: 'pm-dg' }, art);
      for (let r = 0; r < 14; r++) for (let c = 0; c < 6; c++) {
        if (rnd() < .25) continue;
        const e = svg('rect', { x: 20 + c * 166, y: 14 + r * 50, width: 150, height: 34, rx: 8 }, g);
        e.style.animationDelay = (-rnd() * 6).toFixed(2) + 's';
      }
    }
    b.insertBefore(art, $('.spot', b).nextSibling);
    const e = document.createElement('i'); e.className = 'edge'; b.appendChild(e);
    stage.prepend(b);
  }

  /* ---------- reading a screen into steps ---------- */
  const ITEM = '.um,.om,.card,.urow,.lrow,.mrow,.tli,.src,.trig,.step,.conn,.oc,.toast,tbody tr';
  const ROWS = '.lrow,.mrow,.tli,tbody tr,.card-b>div,.urow';

  function build(root, stage) {
    root.classList.add('pm-own');
    // the old one-time fade staggered parts with inline delays; the steps set their own timing
    $$('[style*="transition-delay"]', root).forEach(e => { e.style.transitionDelay = ''; });
    const resets = [], beats = [], applies = [], done = new Set();
    let t = 350;
    const inDone = el => { for (let a = el; a && a !== root; a = a.parentElement) if (done.has(a)) return true; return false; };
    const at = (ms, fn) => beats.push([ms, fn]);
    const reveal = (el, when, cls = 'pop', land = false) => {
      mx(el, cls); resets.push(() => { hide(el); el.classList.remove('pm-land'); });
      at(when, () => { hide(el, false); if (land) bump(el, 'pm-land'); });
    };

    function card(c, when) {
      done.add(c);
      reveal(c, when);
      let tt = when + 300;
      const rows = $$(ROWS, c).filter((r, i, a) => !a.some(o => o !== r && o.contains(r)));
      const head = $('.card-h .r', c), m = head && head.textContent.match(/^(\d+)(\s+found.*)$/);
      if (m && +m[1] === rows.length) {
        const tail = m[2];
        resets.push(() => { head.textContent = '0' + tail; });
        rows.forEach((r, k) => at(tt + k * 170, () => { head.textContent = (k + 1) + tail; }));
      }
      rows.forEach((r, k) => { reveal(r, tt + k * 170, '', true); if (r.matches('.urow')) urow(r); });
      tt += rows.length * 170;
      const foot = $('.card-f', c);
      if (foot) {
        reveal(foot, tt + 120);
        const btn = $('.pb', foot);
        if (btn) at(tt + 650, () => bump(btn, 'pm-nudge'));
        tt += 300;
      }
      return tt + 150;
    }
    function urow(r) {
      const b = $('.ibp', r); if (!b) return;
      r.classList.add('pm-urow');
      const a = document.createElement('span');
      a.className = 'pm-applied x';
      a.innerHTML = '<svg class="i12"><use href="#i-Check"/></svg>Applied';
      r.appendChild(a);
      resets.push(() => { r.classList.remove('ok'); a.classList.add('x'); b.classList.remove('press'); });
      applies.push([r, b, a]);
    }
    function um(el, when) {
      done.add(el);
      const app = el.closest('.app') || root;
      const box = $$('.composer .ta, .dock>span:not(.sp):not(.ib):not(.send)', app).find(b => !b.classList.contains('pm-ta'));
      const text = ($('.ubub', el) || el).textContent.trim();
      if (!box) { reveal(el, when); return when + 450; }
      // type the message into the box, then send it
      box.classList.add('pm-ta');
      const chip = $('.skchip', el);
      box.innerHTML = `<span class="pm-ph">${box.innerHTML}<span class="pm-typed">${chip ? `<span class="pm-kchip">${chip.innerHTML}</span>` : ''}<span class="pm-tx"></span><i class="pm-caret"></i></span></span>`;
      const tx = $('.pm-tx', box), send = $('.send', app);
      if (send) send.classList.add('pm-send');
      mx(el);
      resets.push(() => { hide(el); box.classList.remove('pm-typing'); tx.textContent = ''; if (send) send.classList.add('idle'); });
      at(when, () => box.classList.add('pm-typing'));
      let tt = when + (chip ? 450 : 200);
      for (let i = 1; i <= text.length; i++) {
        tt += 24 * (0.55 + ((i * 7) % 5) / 5) + (text[i - 2] === ' ' ? 10 : 0);
        const s = text.slice(0, i);
        at(tt, () => { tx.textContent = s; if (send) send.classList.remove('idle'); });
      }
      if (send) at(tt + 380, () => bump(send, 'press'));
      at(tt + 560, () => { box.classList.remove('pm-typing'); tx.textContent = ''; if (send) send.classList.add('idle'); hide(el, false); });
      return tt + 950;
    }
    function om(el, when) {
      done.add(el);
      const body = $('.body', el) || el;
      body.classList.add('pm-om-body');
      const title = $('.card-h', body);
      const word = title ? title.textContent.replace(/\d.*$/, '').trim().toLowerCase() : '';
      const think = document.createElement('div');
      think.className = 'pm-think';
      think.innerHTML = '<span class="pm-spn"></span><span class="pm-shim"></span>';
      const say = $('.pm-shim', think);
      const kids = [...body.children];
      body.prepend(think);
      mx(think); mx(el, 'pop');
      resets.push(() => { hide(el); hide(think); });
      at(when, () => { hide(el, false); hide(think, false); say.textContent = 'Reading your workspace'; if (stage) stage.classList.add('pm-scan'); });
      at(when + 700, () => { say.textContent = word ? `Finding ${word}` : 'Writing the answer'; });
      at(when + 1400, () => { hide(think); if (stage) stage.classList.remove('pm-scan'); });
      let tt = when + 1550;
      kids.forEach(k => {
        if (k.matches('.card')) { tt = card(k, tt); return; }
        done.add(k);
        reveal(k, tt, '');
        $$(ROWS, k).forEach((r, i) => { done.add(r); reveal(r, tt + 120 + i * 150, '', true); tt += 150; });
        tt += 260;
      });
      return tt;
    }

    for (const el of $$(ITEM, root)) {
      if (inDone(el) || el.closest('.sb,.pm-vbg')) continue;
      if (el.matches('.um')) t = um(el, t);
      else if (el.matches('.om')) t = om(el, t);
      else if (el.matches('.card')) t = card(el, t);
      else {
        done.add(el);
        const row = el.matches('.lrow,.mrow,.tli,tbody tr,.urow');
        reveal(el, t, el.matches('.conn') ? '' : 'pop', row);
        if (el.matches('.urow')) urow(el);
        t += el.matches('tbody tr') ? 90 : el.matches('.conn') ? 110 : 150;
      }
    }
    // update rows get applied one by one
    if (applies.length) {
      t += 500;
      applies.forEach(([r, b, a], k) => {
        at(t + k * 800, () => bump(b, 'press'));
        at(t + k * 800 + 260, () => { r.classList.add('ok'); a.classList.remove('x'); });
      });
      t += applies.length * 800;
    }
    // pop-ups come in last
    $$('.acc', root).forEach((a, k) => {
      mx(a, 'pop');
      resets.push(() => { hide(a); a.classList.remove('pm-fl'); });
      at(t + 250 + k * 450, () => hide(a, false));
      at(t + 900 + k * 450, () => a.classList.add('pm-fl'));
    });
    if (!beats.length) return null;
    return {
      reset() { resets.forEach(f => f()); if (stage) stage.classList.remove('pm-scan'); },
      final() { snap(root, () => { resets.forEach(f => f()); beats.forEach(([, fn]) => fn()); }); $$('.pm-typing', root).forEach(b => b.classList.remove('pm-typing')); if (stage) stage.classList.remove('pm-scan'); },
      play(c) { beats.forEach(([ms, fn]) => c.at(ms, fn)); },
    };
  }

  /* ---------- wire up every screen on the page ---------- */
  const screens = [];
  $$('.prow .vis').forEach(v => screens.push([v, v]));
  $$('.pshot').forEach(p => screens.push([p, null]));
  screens.forEach(([root, stage]) => {
    if (stage) {
      const k = kindOf(stage);
      stage.classList.add('pm-stage', 'pm-k-' + k);
      backdrop(stage, k);
    }
    let sc;
    try { sc = build(root, stage); } catch (e) { console.warn('product motion', e); return; }
    if (!sc) return;
    if (RM || !('IntersectionObserver' in window)) { sc.final(); return; }
    const clock = Clock();
    let on = false;
    snap(root, sc.reset);
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= .3 && !on) { on = true; clock.clear(); snap(root, sc.reset); sc.play(clock); }
      else if (!e.isIntersecting && on) { on = false; clock.clear(); }
    }), { threshold: [0, .3] }).observe(root);
  });
  /* bigger screens: each row's screen fills its stage, scaling up past its design size (the shared fitter stops at 1) */
  const MAX = 1.45;
  const fits = $$('.prow .pm-stage>.fit');
  function fitBig() {
    fits.forEach(f => {
      const w = +f.dataset.w, inner = f.firstElementChild;
      if (!w || !inner || !f.clientWidth) return;
      const s = Math.min(MAX, f.clientWidth / w);
      inner.style.transform = `scale(${s.toFixed(4)})`;
      inner.style.marginLeft = (Math.max(0, f.clientWidth - w * s) / 2) + 'px';
      f.style.height = Math.ceil(inner.offsetHeight * s) + 'px';
    });
  }
  // runs after the shared fitter, which refits 120ms after a resize
  let rt = 0;
  const refit = () => { clearTimeout(rt); rt = setTimeout(fitBig, 180); };
  addEventListener('resize', refit);
  addEventListener('load', refit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(refit); fits.forEach(f => ro.observe(f.parentElement)); }
  fitBig();

  /* the screen tilts toward the pointer, with a glare that follows it */
  if (!RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.prow .pm-stage').forEach(stage => {
      const fit = $(':scope>.fit', stage);
      if (!fit) return;
      const glare = document.createElement('i');
      glare.className = 'pm-glare';
      stage.appendChild(glare);
      let raf = 0;
      stage.addEventListener('pointermove', e => {
        const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          stage.classList.add('pm-tilt');
          fit.style.transform = `rotateX(${((.5 - y) * 6).toFixed(2)}deg) rotateY(${((x - .5) * 8).toFixed(2)}deg)`;
          stage.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          stage.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        });
      });
      stage.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); stage.classList.remove('pm-tilt'); fit.style.transform = ''; });
    });
  }
  dispatchEvent(new Event('resize'));
})();
