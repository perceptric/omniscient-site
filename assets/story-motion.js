/* Home page story and teams motion (styles in story-motion.css).
   Each of the four story screens plays step by step when it is the one showing and is in view, and plays again the
   next time it comes back. The teams chat types each persona's question and streams Otto's answer.
   Every stage also gets a living backdrop. Reduced motion shows the last frame. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;
  root.classList.add('mo');
  const ico = (id, c = 'i14') => `<svg class="${c}"><use href="#i-${id}"/></svg>`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const mx = (el, cls = '') => { if (el) el.classList.add('mx', ...cls.split(' ').filter(Boolean)); return el; };
  const hide = (el, on = true) => el && el.classList.toggle('x', on);
  const svg = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(7);

  function Clock() {
    let ids = [];
    return { at(ms, fn) { ids.push(setTimeout(fn, ms)); }, clear() { ids.forEach(clearTimeout); ids = []; } };
  }
  // Types text into el, one character at a time, with a little human unevenness. Returns the end time.
  function typeInto(clock, el, text, start, speed = 30) {
    let t = start;
    for (let i = 1; i <= text.length; i++) {
      t += speed * (0.55 + ((i * 7) % 5) / 5) + (text[i - 2] === ' ' ? speed * 0.4 : 0);
      clock.at(t, () => { el.textContent = text.slice(0, i); });
    }
    return t;
  }
  function snap(el, fn) { el.classList.add('snap'); fn(); void el.offsetWidth; el.classList.remove('snap'); }
  function count(clock, el, from, to, start, dur, fmt = n => n) {
    const steps = Math.min(30, Math.abs(to - from));
    for (let i = 0; i <= steps; i++) clock.at(start + (dur * i) / steps, () => { el.textContent = fmt(Math.round(from + ((to - from) * i) / steps)); });
  }

  /* ---------- backdrops ---------- */
  function backdrop(host, kind) {
    if (host.querySelector(':scope>.vbg')) return;
    const b = document.createElement('div');
    b.className = 'vbg';
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<i class="au a1"></i><i class="au a2"></i><i class="au a3"></i><i class="spot"></i>';
    const W = 1000, H = 700;
    const art = svg('svg', { class: 'art', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice' });
    if (kind === 'pro') {
      const g = svg('g', { class: 'cn' }, art), pts = [];
      for (let i = 0; i < 64; i++) pts.push([rnd() * W, rnd() * H, rnd()]);
      pts.forEach((p, i) => pts.slice(i + 1).forEach(q => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 125) svg('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, g); }));
      pts.forEach((p, i) => {
        const c = svg('circle', { cx: p[0], cy: p[1], r: (1.4 + p[2] * 2).toFixed(1) }, g);
        c.style.animationDelay = (-p[2] * 4).toFixed(2) + 's';
        if (i % 9 === 0) svg('circle', { class: 'ring', cx: p[0], cy: p[1], r: 8 }, g);
      });
      svg('circle', { class: 'sweep', cx: W / 2, cy: H / 2, r: 560 }, g);
      svg('circle', { class: 'sweep b', cx: W / 2, cy: H / 2, r: 560 }, g);
    } else if (kind === 'uni') {
      const g = svg('g', { class: 'st' }, art);
      for (let i = 0; i < 9; i++) {
        const y = 40 + i * 78, a = 30 + rnd() * 40, ph = rnd() * 400;
        const d = `M-50 ${y} C ${200 + ph * .2} ${y - a}, ${420 + ph * .3} ${y + a}, 620 ${y} S ${900} ${y - a}, 1050 ${y}`;
        svg('path', { d }, g);
        svg('path', { d, class: 'f' + (i % 3 === 1 ? ' r' : i % 3 === 2 ? ' s' : '') }, g);
      }
    } else if (kind === 'ai') {
      const g = svg('g', { class: 'wfb' }, art);
      for (let i = 0; i < 90; i++) {
        const h = 20 + Math.abs(Math.sin(i * 0.37) * 90 + Math.sin(i * 1.3) * 40) + rnd() * 30;
        const r = svg('rect', { x: i * 11.2, y: H - h - 10, width: 4, height: h, rx: 2 }, g);
        r.style.animationDelay = (-rnd() * 1.8).toFixed(2) + 's';
      }
      [['"Send us the proposal…"', 8, 18, 0], ['"Around $80 to $90k"', 62, 10, -5], ['"Can we have pricing before Friday?"', 50, 66, -10], ['"We want to roll out to two teams first"', 4, 58, -3], ['"Legal will want a look"', 70, 40, -12], ['"Timing matters more than price"', 22, 82, -8]]
        .forEach(([t, x, y, d]) => { const q = document.createElement('span'); q.className = 'qf'; q.textContent = t; q.style.left = x + '%'; q.style.top = y + '%'; q.style.animationDelay = d + 's'; b.appendChild(q); });
    } else if (kind === 'flow') {
      const g = svg('g', { class: 'ng' }, art), cols = 7, rows = 5, cw = W / cols, rh = H / rows, nodes = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) if (rnd() > .42) nodes.push([c * cw + cw / 2, r * rh + rh / 2]);
      const paths = [];
      nodes.forEach((n, i) => { const m = nodes.find((q, j) => j > i && q[0] > n[0] && Math.abs(q[1] - n[1]) <= rh + 1); if (m) { const mid = (n[0] + m[0]) / 2; const d = `M${n[0] + 22} ${n[1]} H${mid} V${m[1]} H${m[0] - 22}`; svg('path', { d }, g); paths.push(d); } });
      nodes.forEach(n => svg('rect', { x: n[0] - 22, y: n[1] - 14, width: 44, height: 28, rx: 7 }, g));
      paths.forEach((d, i) => { if (i % 2) return; const c = svg('circle', { r: 2.2 }, g); const a = svg('animateMotion', { dur: (3 + (i % 4)) + 's', repeatCount: 'indefinite', path: d, begin: (-i * .7) + 's' }, c); });
    }
    b.insertBefore(art, b.querySelector('.spot').nextSibling);
    const e = document.createElement('i'); e.className = 'edge'; b.appendChild(e);
    host.prepend(b);
  }

  /* ---------- 1. Pipeline on demand ---------- */
  const SKILLS = [['Radar', 'Find leads', 'Search people and companies'], ['Building', 'Research account', 'A brief on any company'], ['Mail', 'Draft follow-up', 'Write the next email'], ['TableIcon', 'Enrich list', 'Fill in missing fields']];
  function scenePro(vis) {
    const win = $('.app.win', vis), body = win.children[1], um = $('.um', body), om = $('.om', body), comp = $('.composer', body);
    const ob = $('.body', om), p = $('p', ob), card = $('.card', ob), rows = $$('.lrow', card), foot = $('.card-f', card), cnt = $('.card-h .r', card), save = $('.pb', foot), send = $('.send', comp);
    const query = $('.ubub', um).textContent.trim();
    body.classList.add('s1b');
    const think = document.createElement('div');
    think.className = 'think';
    think.innerHTML = '<span class="spn"></span><span class="tt shim"></span>';
    ob.prepend(think);
    const tt = $('.tt', think);
    const ta = $('.ta', comp);
    ta.innerHTML = `<span class="ph">${ta.textContent}</span><span class="typed"><span class="kchip gone">${ico('Box', 'i12')}Find leads</span><span class="tx"></span><i class="caret"></i></span>`;
    const ph = $('.ph', ta), kchip = $('.kchip', ta), tx = $('.tx', ta);
    const menu = document.createElement('div');
    menu.className = 'skm';
    menu.innerHTML = `<div class="skm-h">Skills</div><div class="skm-l"><i class="skhl"></i>${SKILLS.map(([i, n, d]) => `<div class="ski"><span class="tile">${ico(i)}</span><div><b>${n}</b><span>${d}</span></div><kbd>↵</kbd></div>`).join('')}</div>`;
    body.appendChild(menu);
    const hl = $('.skhl', menu), items = $$('.ski', menu);
    [um, om, think, menu, ...rows, foot, p, card, ph].forEach(e => mx(e));
    mx(menu, 'pop'); mx(card, 'pop');
    const place = () => { menu.style.bottom = (comp.offsetHeight + 28) + 'px'; };
    const pick = i => { hl.style.transform = `translateY(${i * 48}px)`; items.forEach((it, k) => it.classList.toggle('on', k === i)); };
    function reset() {
      place();
      [um, om, think, menu, ...rows, foot, p, card].forEach(e => hide(e));
      hide(ph, false); comp.classList.remove('typing');
      tx.textContent = ''; kchip.classList.add('gone'); send.classList.add('idle');
      items.forEach(i => i.classList.remove('dim')); pick(0); hl.classList.remove('press');
      cnt.textContent = '0 found'; vis.classList.remove('scan'); $$('.cn circle.hit', vis).forEach(c => c.classList.remove('hit'));
    }
    function final() {
      reset();
      [um, om, ...rows, foot, p, card].forEach(e => hide(e, false));
      cnt.textContent = rows.length + ' found';
    }
    function play(c) {
      c.at(500, () => { comp.classList.add('typing'); hide(ph); });
      c.at(900, () => { tx.textContent = '/'; hide(menu, false); });
      c.at(1500, () => { tx.textContent = '/f'; items.forEach((it, k) => it.classList.toggle('dim', !/^f/i.test(SKILLS[k][1]) && !/ f/i.test(SKILLS[k][1]))); });
      c.at(1700, () => { tx.textContent = '/fi'; items.forEach((it, k) => it.classList.toggle('dim', !/^fi/i.test(SKILLS[k][1]))); });
      c.at(2200, () => hl.classList.add('press'));
      c.at(2400, () => { hide(menu); tx.textContent = ''; kchip.classList.remove('gone'); send.classList.remove('idle'); });
      const end = typeInto(c, tx, query, 2700, 30);
      c.at(end + 450, () => send.classList.add('press'));
      c.at(end + 650, () => { send.classList.remove('press'); comp.classList.remove('typing'); tx.textContent = ''; kchip.classList.add('gone'); send.classList.add('idle'); hide(ph, false); hide(um, false); });
      const t0 = end + 1050;
      c.at(t0, () => { hide(om, false); hide(think, false); tt.textContent = 'Searching 2.4M people and companies'; vis.classList.add('scan'); });
      c.at(t0 + 1100, () => { tt.textContent = 'Checking who is hiring for sales'; });
      const dots = $$('.cn circle:not(.ring):not(.sweep)', vis);
      c.at(t0 + 1500, () => { for (let k = 0; k < 4; k++) dots[(k * 13 + 5) % dots.length]?.classList.add('hit'); });
      c.at(t0 + 2100, () => { hide(think); hide(p, false); vis.classList.remove('scan'); });
      c.at(t0 + 2400, () => hide(card, false));
      rows.forEach((r, k) => c.at(t0 + 2650 + k * 220, () => { hide(r, false); cnt.textContent = (k + 1) + ' found'; }));
      c.at(t0 + 2650 + rows.length * 220 + 150, () => hide(foot, false));
      c.at(t0 + 2650 + rows.length * 220 + 700, () => { save.classList.remove('glow'); void save.offsetWidth; save.classList.add('glow'); });
    }
    return { reset, final, play };
  }

  /* ---------- 2. Every relationship, fully captured ---------- */
  function sceneUni(vis) {
    const row = $('.vis-in.row', vis), srcs = $$('.src', row), win = $('.app.win', row), box = win.lastElementChild, its = $$('.tli', box);
    row.classList.add('s2row');
    box.classList.add('tlx');
    // the list keeps the height of four items; measured once the screen is laid out
    let H = 0;
    const size = () => { if (H || !box.offsetParent) return; box.style.height = ''; box.replaceChildren(gmail, otto, meet, wa); H = box.offsetHeight; box.style.height = H + 'px'; };
    const tm = el => $('.tm', el);
    const [gmail, meet, wa, otto] = its;
    const mk = (icon, t1, when) => { const d = document.createElement('div'); d.className = 'tli'; d.innerHTML = `<span class="chip">${ico(icon)}</span><div><div class="t1">${t1}</div></div><span class="tm">${when}</span>`; return d; };
    const old = [mk('Pencil', '<b>Otto</b> created the deal <b>Workspace rollout</b>', 'Nov 4'), mk('Users', '<b>Tuomas</b> added as a contact', 'Oct 30')];
    const ottoT2 = document.createElement('div'); ottoT2.className = 't2'; ottoT2.textContent = 'Heard on the weekly sync';
    otto.querySelector('.t1').after(ottoT2);
    const later = new Map([[wa, 'Nov 10'], [meet, 'Yesterday'], [otto, 'Yesterday'], [gmail, '2h ago']]);
    // source pill index: Gmail 0, Meet 1, WhatsApp 2
    const EV = [
      { item: wa, src: 2, logo: '/assets/logos/whatsapp.svg', head: 'New WhatsApp message', sub: 'Tuomas: "Can we add two more teams?"' },
      { item: meet, src: 1, logo: '/assets/logos/meet.svg', head: 'Meeting recorded', sub: 'Weekly sync with Karri and Tuomas' },
      { item: otto, src: -1, icon: 'Sparkles', head: 'Otto updated the record', sub: 'Stage set to Negotiation' },
      { item: gmail, src: 0, logo: '/assets/logos/gmail.svg', head: 'New email synced', sub: 'Karri: "Sending the order form today"' },
    ];
    const base = srcs.map(s => +$('small', s).textContent);
    const toast = document.createElement('div');
    toast.className = 'acc acc-br s2t';
    toast.innerHTML = '<span class="acc-ic"></span><div><b></b><span></span></div>';
    vis.appendChild(toast);
    mx(toast, 'pop');
    // wires from each source pill to the record
    const wires = svg('svg', { class: 'wires' });
    row.prepend(wires);
    const paths = [];
    function drawWires() {
      wires.innerHTML = '';
      paths.length = 0;
      const rr = row.getBoundingClientRect(), s = rr.width / row.offsetWidth || 1;
      wires.setAttribute('width', row.offsetWidth); wires.setAttribute('height', row.offsetHeight);
      const wr = win.getBoundingClientRect(), br = box.getBoundingClientRect();
      const x2 = (wr.left - rr.left) / s - 1, y2 = (br.top - rr.top) / s + 26;
      srcs.forEach(sp => {
        const r = sp.getBoundingClientRect();
        const x1 = (r.right - rr.left) / s + 2, y1 = (r.top + r.height / 2 - rr.top) / s, k = (x2 - x1) * .6;
        paths.push(svg('path', { d: `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}` }, wires));
      });
    }
    function packet(i, c, at) {
      const path = paths[i]; if (!path) return;
      c.at(at, () => {
        path.classList.add('hot');
        const dot = svg('circle', { r: 3.5 }, wires), L = path.getTotalLength(), t0 = performance.now();
        const step = t => { const k = Math.min(1, (t - t0) / 650), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, pt = path.getPointAtLength(L * e); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); if (k < 1) requestAnimationFrame(step); else { dot.remove(); path.classList.remove('hot'); } };
        requestAnimationFrame(step);
      });
    }
    function push(item) {
      const kids = [...box.children], before = kids.map(k => k.offsetTop);
      box.prepend(item);
      item.classList.remove('new'); void item.offsetWidth; item.classList.add('new');
      kids.forEach((k, i) => { k.style.transition = 'none'; k.style.transform = `translateY(${before[i] - k.offsetTop}px)`; });
      void box.offsetWidth;
      kids.forEach(k => { k.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; k.style.transform = ''; });
    }
    function setToast(e) {
      $('.acc-ic', toast).innerHTML = e.logo ? `<img src="${e.logo}" alt="">` : ico(e.icon);
      $('b', toast).textContent = e.head; $('span:not(.acc-ic)', toast).textContent = e.sub;
      toast.classList.remove('bump'); void toast.offsetWidth; toast.classList.add('bump');
    }
    function reset() {
      size();
      box.replaceChildren(...old);
      its.concat(old).forEach(i => { i.classList.remove('new'); i.style.transform = ''; });
      EV.forEach(e => { tm(e.item).textContent = 'Just now'; });
      srcs.forEach((s, i) => { s.classList.remove('ping'); $('small', s).textContent = base[i] - (EV.some(e => e.src === i) ? 1 : 0); });
      hide(toast);
      drawWires();
    }
    function final() {
      size();
      box.replaceChildren(gmail, otto, meet, wa, ...old);
      its.forEach(i => { i.classList.remove('new'); tm(i).textContent = later.get(i); });
      srcs.forEach((s, i) => { $('small', s).textContent = base[i]; });
      hide(toast, true);
      drawWires();
    }
    function play(c) {
      drawWires();
      EV.forEach((e, k) => {
        const t = 600 + k * 1700;
        if (e.src >= 0) {
          c.at(t, () => { const s = srcs[e.src]; s.classList.remove('ping'); void s.offsetWidth; s.classList.add('ping'); $('small', s).textContent = base[e.src]; });
          packet(e.src, c, t + 80);
        }
        c.at(t + 700, () => {
          if (k > 0) tm(EV[k - 1].item).textContent = later.get(EV[k - 1].item);
          push(e.item); setToast(e); hide(toast, false);
        });
      });
    }
    addEventListener('resize', () => requestAnimationFrame(drawWires));
    return { reset, final, play };
  }

  /* ---------- 3. A self-driving CRM ---------- */
  function sceneAi(vis) {
    const win = $('.app.win', vis), toast = $('.acc', vis), hrow = win.children[1], rows = $$('.urow', win);
    win.classList.add('s3');
    hrow.innerHTML = `<span class="h3s"><span class="hA mx"><span class="wv"><i></i><i></i><i></i><i></i><i></i></span>Reading the call transcript<span class="pbar"><i></i></span><span class="hmin">42 min</span></span><span class="hB mx">Record updates to review <span class="cnt" style="color:var(--t4);font-weight:400">3</span></span></span>`;
    const hA = $('.hA', hrow), hB = $('.hB', hrow), bar = $('.pbar i', hrow), cnt = $('.cnt', hrow);
    const marks = [['the proposal'], ['$80 to $90k'], ['before Friday']];
    rows.forEach((r, k) => {
      const sm = $('small', r);
      sm.innerHTML = sm.innerHTML.replace(marks[k][0], `<mark>${marks[k][0]}</mark>`);
      const a = document.createElement('span'); a.className = 'applied'; a.innerHTML = ico('Check', 'i12') + 'Applied'; r.appendChild(a); mx(a, 'pop');
      mx(r);
    });
    mx(toast, 'pop');
    const TO = [['Record updated', 'Stage moved to Proposal'], ['Record updated', 'Amount set to $86,400'], ['Record updated', 'Next step: Send pricing by Friday']];
    const setToast = k => { $('b', toast).textContent = TO[k][0]; $('span', toast.lastElementChild).textContent = TO[k][1]; toast.classList.remove('bump'); void toast.offsetWidth; toast.classList.add('bump'); };
    function reset() {
      hide(hA); hide(hB); bar.classList.remove('go');
      rows.forEach(r => { hide(r); r.classList.remove('ok', 'lit'); hide($('.applied', r)); $('.ibp', r).classList.remove('press'); });
      hB.firstChild.textContent = 'Record updates to review '; cnt.textContent = '3'; hide(toast);
      $('b', toast).textContent = TO[0][0]; $('span', toast.lastElementChild).textContent = TO[0][1];
    }
    function final() { reset(); hide(hB, false); rows.forEach(r => { hide(r, false); r.classList.add('lit'); }); hide(toast, false); }
    function play(c) {
      c.at(250, () => { hide(hA, false); });
      c.at(450, () => bar.classList.add('go'));
      c.at(2300, () => { hide(hA); hide(hB, false); });
      rows.forEach((r, k) => { c.at(2550 + k * 260, () => hide(r, false)); c.at(2850 + k * 260, () => r.classList.add('lit')); });
      rows.forEach((r, k) => {
        const t = 4000 + k * 1100;
        c.at(t, () => $('.ibp', r).classList.add('press'));
        c.at(t + 260, () => { r.classList.add('ok'); hide($('.applied', r), false); cnt.textContent = String(2 - k); cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump'); setToast(k); hide(toast, false); });
      });
      c.at(4000 + rows.length * 1100 + 300, () => { hB.firstChild.textContent = 'Record up to date '; cnt.textContent = ''; });
    }
    return { reset, final, play };
  }

  /* ---------- 4. Your playbook, executed at scale ---------- */
  function sceneFlow(vis) {
    const flow = $('.app.flow', vis), trig = $('.trig', flow), conns = $$('.conn', flow), steps = $$('.step', flow), stat = $('.acc-stat', vis);
    flow.classList.add('s4f');
    const num = $('b', stat), spark = $('.spark path', stat), sdot = $('.spark circle', stat);
    const L = spark.getTotalLength ? spark.getTotalLength() : 200;
    spark.style.strokeDasharray = L;
    const tsm = $('small', trig), s1 = $('small', steps[0]), bell = $('.tile svg', steps[2]);
    const tok = document.createElement('div'); tok.className = 'tok x'; tok.innerHTML = '<span class="av"></span><span class="nm"></span>'; flow.appendChild(tok);
    const LEADS = [['IZ', 'Ivan Zhao'], ['GR', 'Guillermo Rauch'], ['KS', 'Karri Saarinen'], ['DA', 'Dario Amodei']];
    [trig, ...steps].forEach(e => mx(e, 'pop'));
    conns.forEach(e => mx(e));
    mx(stat, 'pop');
    let runs = 0, timer = 0;
    const yOf = el => el.offsetTop + el.offsetHeight / 2 - 15;
    function reset() {
      clearTimeout(timer);
      [trig, ...steps, ...conns].forEach(e => hide(e)); hide(stat);
      spark.style.transition = 'none'; spark.style.strokeDashoffset = L; void spark.offsetWidth; spark.style.transition = '';
      sdot.style.opacity = 0; num.textContent = '0'; tsm.textContent = '12 in it now'; s1.textContent = '40 sent, 9 replied';
      tok.classList.add('x'); [trig, ...steps].forEach(e => e.classList.remove('hit')); runs = 0;
    }
    function final() { reset(); [trig, ...steps, ...conns].forEach(e => hide(e, false)); hide(stat, false); spark.style.strokeDashoffset = 0; sdot.style.opacity = 1; num.textContent = '38'; }
    function run(c, t, n) {
      const [ini, name] = LEADS[n % LEADS.length];
      c.at(t, () => { $('.av', tok).textContent = ini; $('.nm', tok).textContent = name; tok.style.transition = 'none'; tok.style.transform = `translateY(${yOf(trig)}px)`; void tok.offsetWidth; tok.style.transition = ''; tok.classList.remove('x'); trig.classList.add('hit'); tsm.textContent = (13 + n) + ' in it now'; });
      const at = [trig, ...steps];
      at.slice(1).forEach((s, k) => {
        c.at(t + 900 + k * 1000, () => { at[k].classList.remove('hit'); tok.style.transform = `translateY(${yOf(s)}px)`; });
        c.at(t + 1500 + k * 1000, () => {
          s.classList.add('hit');
          if (k === 0) s1.textContent = `${41 + n} sent, ${9 + (n % 2)} replied`;
          if (k === 2) { bell.classList.remove('ring-b'); void bell.getBoundingClientRect(); bell.classList.add('ring-b'); }
        });
      });
      c.at(t + 4300, () => { steps[2].classList.remove('hit'); tok.classList.add('x'); num.textContent = String(39 + n); stat.classList.remove('bump'); void stat.offsetWidth; stat.classList.add('bump'); });
      if (n < 3) run(c, t + 5000, n + 1);
    }
    function play(c) {
      c.at(150, () => hide(trig, false));
      [0, 1, 2].forEach(k => { c.at(450 + k * 380, () => hide(conns[k], false)); c.at(620 + k * 380, () => hide(steps[k], false)); });
      c.at(1700, () => { hide(stat, false); spark.style.strokeDashoffset = 0; });
      count(c, num, 0, 38, 1750, 1000);
      c.at(2900, () => { sdot.style.opacity = 1; });
      run(c, 3000, 0);
    }
    return { reset, final, play };
  }

  /* ---------- wire up the story ---------- */
  const KINDS = ['pro', 'uni', 'ai', 'flow'], BUILD = [scenePro, sceneUni, sceneAi, sceneFlow];
  const all = [];
  const feats = $$('.feat');
  $$('.feat>.vis').forEach(v => all.push([v, +v.closest('.feat').dataset.i]));
  $$('.screens>.vis').forEach((v, k) => all.push([v, k]));
  all.forEach(([vis, k]) => {
    if (!(k >= 0 && k < 4)) return;
    vis.classList.add('s-' + KINDS[k]);
    backdrop(vis, KINDS[k]);
    let sc;
    try { sc = BUILD[k](vis); } catch (e) { console.warn('story motion', k, e); return; }
    const clock = Clock(), inScreens = !!vis.closest('.screens');
    let active = false, seen = false;
    const want = () => seen && vis.offsetParent !== null && (!inScreens || vis.classList.contains('on'));
    const update = () => {
      const w = want(); if (w === active) return; active = w; clock.clear();
      if (!w) return;
      if (RM) { sc.final(); return; }
      snap(vis, sc.reset); sc.play(clock);
    };
    if (RM) sc.final(); else snap(vis, sc.reset);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => { seen = e.isIntersecting; update(); }), { threshold: .3 }).observe(vis);
    else { seen = true; }
    new MutationObserver(update).observe(vis, { attributes: true, attributeFilter: ['class'] });
    addEventListener('resize', update);
    update();
  });
  if (typeof layoutFits === 'function') layoutFits();
  if (!feats.length) return;
})();

/* ---------- teams: type each question, then stream Otto's answer ---------- */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.querySelector('.tm-stage'); if (!stage) return;
  const NS = 'http://www.w3.org/2000/svg';
  // backdrop (built by the story script's helper shape, repeated here so this part stands alone)
  if (!stage.querySelector(':scope>.vbg')) {
    const b = document.createElement('div'); b.className = 'vbg'; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<i class="au a1"></i><i class="au a2"></i><i class="au a3"></i><i class="spot"></i>';
    const art = document.createElementNS(NS, 'svg'); art.setAttribute('class', 'art'); art.setAttribute('viewBox', '0 0 1000 700'); art.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    art.innerHTML = '<g class="orb"><g><ellipse cx="500" cy="350" rx="470" ry="300"/><ellipse class="d" cx="500" cy="350" rx="380" ry="240"/></g><g class="r"><ellipse class="d" cx="500" cy="350" rx="560" ry="360"/></g></g>';
    b.appendChild(art);
    // chips sit in the top and bottom margins around the chat
    [['Mail', '41 emails read', 'top', 4, 6, -6], ['Briefcase', '7 opportunities', 'top', 30, -8, 5], ['Sparkles', 'Why we win', 'top', 56, 6, 6], ['Video', '26 calls', 'top', 80, -6, -5],
     ['Building', '36 accounts', 'bottom', 6, 8, -6], ['Code', 'Ran code on 31 deals', 'bottom', 32, -6, 5], ['Dollar', '$412,000 forecast', 'bottom', 62, 6, -5]]
      .forEach(([ic, t, edge, x, fx, fy], i) => { const c = document.createElement('span'); c.className = 'fchip'; c.innerHTML = `<svg class="i"><use href="#i-${ic}"/></svg>${t}`; c.style.left = x + '%'; c.style[edge] = '8px'; c.style.setProperty('--fx', fx + 'px'); c.style.setProperty('--fy', fy + 'px'); c.style.animationDelay = (-i * 1.3) + 's'; b.appendChild(c); });
    const e = document.createElement('i'); e.className = 'edge'; b.appendChild(e);
    stage.prepend(b);
  }
  const bodies = [...document.querySelectorAll('.tm-bodies .tm-body')], comp = document.querySelector('.tm-comp');
  if (!bodies.length || !comp) return;
  const send = comp.querySelector('.tm-send');
  const tq = document.createElement('span'); tq.className = 'tq'; comp.appendChild(tq);
  const caret = document.createElement('i'); caret.className = 'caret';
  let ids = [];
  const at = (ms, fn) => ids.push(setTimeout(fn, ms));
  const clear = () => { ids.forEach(clearTimeout); ids = []; };
  const parts = b => ({ ask: b.querySelector('.tm-ask'), who: b.querySelector('.tm-who'), meta: b.querySelector('.tm-meta'), lines: [...b.querySelectorAll('.tm-a>*')], q: b.querySelector('.tm-q').textContent.trim() });
  bodies.forEach(b => {
    const p = parts(b);
    [p.ask, p.who, p.meta, ...p.lines].forEach(e => e.classList.add('mx'));
    const s = document.createElement('span'); s.className = 'spn'; p.meta.prepend(s);
    const t = document.createElement('span'); t.className = 'mt'; while (p.meta.childNodes.length > 1) t.appendChild(p.meta.childNodes[1]); p.meta.appendChild(t);
  });
  const hideAll = b => { const p = parts(b); [p.ask, p.who, p.meta, ...p.lines].forEach(e => e.classList.add('x')); };
  const showAll = b => { const p = parts(b); [p.ask, p.who, p.meta, ...p.lines].forEach(e => e.classList.remove('x')); p.meta.classList.remove('busy'); p.meta.querySelector('.mt').classList.remove('shim'); };
  function play(b) {
    clear();
    const p = parts(b), mt = p.meta.querySelector('.mt');
    b.classList.add('snap'); hideAll(b); p.meta.classList.remove('busy'); mt.classList.remove('shim'); void b.offsetWidth; b.classList.remove('snap');
    comp.classList.add('typing'); send.classList.remove('go'); tq.textContent = ''; tq.appendChild(caret);
    let t = 250;
    for (let i = 1; i <= p.q.length; i++) {
      t += 26 * (0.55 + ((i * 7) % 5) / 5);
      at(t, () => { tq.textContent = p.q.slice(0, i); tq.appendChild(caret); send.classList.add('go'); });
    }
    at(t + 350, () => { send.classList.remove('press'); void send.offsetWidth; send.classList.add('press'); });
    at(t + 550, () => { comp.classList.remove('typing'); send.classList.remove('go'); tq.textContent = ''; p.ask.classList.remove('x'); });
    at(t + 900, () => { p.who.classList.remove('x'); });
    at(t + 1050, () => { p.meta.classList.remove('x'); p.meta.classList.add('busy'); mt.classList.add('shim'); });
    at(t + 2250, () => { p.meta.classList.remove('busy'); mt.classList.remove('shim'); });
    p.lines.forEach((l, k) => at(t + 2400 + k * 260, () => l.classList.remove('x')));
  }
  let seen = false;
  const current = () => bodies.find(b => b.classList.contains('on'));
  const go = () => { const b = current(); if (!b) return; if (RM) { showAll(b); return; } if (seen) play(b); else { clear(); hideAll(b); } };
  // react only when a body turns on or off (play and hide toggle other classes on it too)
  bodies.forEach(b => { let was = b.classList.contains('on'); new MutationObserver(() => {
    const on = b.classList.contains('on'); if (on === was) return; was = on;
    if (on) go(); else if (!RM) { b.classList.add('snap'); hideAll(b); void b.offsetWidth; b.classList.remove('snap'); }
  }).observe(b, { attributes: true, attributeFilter: ['class'] }); });
  if (RM) bodies.forEach(showAll); else bodies.forEach(hideAll);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => { const was = seen; seen = e.isIntersecting; if (seen && !was) go(); }), { threshold: .35 }).observe(stage);
  else { seen = true; go(); }
})();
