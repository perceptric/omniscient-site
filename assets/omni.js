/* Shared runtime for the product and team pages, cut from index.html by tools/pages/build.py. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ic = (n, c='i') => `<svg class="${c}"><use href="#i-${n}"/></svg>`;
/* star tile for dark stages */
(function(){ const c=document.createElement('canvas'); c.width=c.height=520; const g=c.getContext('2d');
  for(let i=0;i<170;i++){ const r=Math.random()<.9?Math.random()*.7+.2:Math.random()*1+.8; g.globalAlpha=Math.random()*.5+.12; g.fillStyle='#fff'; g.beginPath(); g.arc(Math.random()*520,Math.random()*520,r,0,6.283); g.fill(); }
  try{ document.documentElement.style.setProperty('--stars-tile',`url(${c.toDataURL()})`); }catch(e){} })();

/* sidebar */
function sidebar(active){
  const lk = (key, icon, label) => `<a class="lk${active===key?' on':''}" data-v="${key}">${ic(icon)}<span>${label}</span></a>`;
  const sec = (label, items) => `<div class="div"></div><div class="lbl">${label}</div><div class="nl">${items}</div>`;
  return `<div class="ws"><span class="wsl"><svg class="m"><use href="#mark"/></svg></span><b>Northwind</b>${ic('ChevronsUpDown','i14')}<span class="fold">${ic('PanelLeft','i14')}</span></div>
  <div class="search">${ic('SearchIcon')}<span>Search</span><span class="kbd">⌘K</span></div>
  <div class="sbn">${sec('Otto', lk('ask','Sparkles','Ask Otto')+lk('k','Book','Knowledge')+lk('s','Box','Skills'))}
  ${sec('CRM', lk('companies','Building','Companies')+lk('people','Users','People')+lk('deals','Handshake','Opportunities'))}
  ${sec('Intelligence', lk('meetings','Calendar','Meetings')+lk('emails','Mail','Emails')+lk('notes','StickyNote','Notes'))}
  ${sec('Automations', lk('workflows','Bot','Workflows'))}</div>
  <div class="sbf">${lk('settings','Settings','Settings')}<div class="me"><span class="av">JR</span><div><b>Jonah Reyes</b><small>jonah@northwind.co</small></div>${ic('LogOut','i14')}</div></div>`;
}
document.querySelectorAll('[data-sb]').forEach(el => { el.innerHTML = sidebar(el.dataset.sb); });
const FACES={"JR": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wgARCABgAGADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAwUCBAYAAQf/xAAZAQACAwEAAAAAAAAAAAAAAAAAAQIEBQP/2gAMAwEAAhADEAAAAVXpPZc+Q284nEhfVPzR5vg2gynlCjKc2DlCYZ+sz7hYNYc38/QyaLeZnpE7rO6LTyQRJ6KmeuYdAd2VS5fdqLFWzVRvqskodrGWhnzHLp86disALsIArWdULP36t27WWAEwsSPpZUYgsNKBT1Q0Sb6fkuPZOzXjqXSrPbnfg1vK52qVucCCZMxmkT4hYywtfd4zK1FfMGklNbqF+plIBN88n//EACQQAAICAgICAgIDAAAAAAAAAAECAAMEERIhBRMQIyIyFBUx/9oACAEBAAEFAuI3qD8Rf5Et8cYPxmJke5TXyV6yIBxAG4R8Z2QalA3B1N9lolprfHsFtREI+P8AYBPJKfZTT7JXhqZ/XpuzEQTIo4jxTbxoy/BiKVHk+68Rfrx6xrgJcg1lJtfEA6gJ3DubmeN49QfVF3CAIRkOzNZVYp8avAsfgrCu4QRLx9NKNZRXiEMjng2Gt0bH9Iw+QB3rsL2YRwJj9jBfUtuCpjU7ox7OEzrRrFX6m2Jrox+1rJncqPE5BsWynCv4X02UtkOVWocVK7VLCxO5uD9qcW2yPz99T+yV3W1rkMyphDZV+1MI4uBqUY73nGwEqlSDfkMX05lmOd/yLElhfImAge80+pg2orEzcROh0F6mRjrl1PW1bMksTcwVIzrqts2LudqV/cL8r1MrFXJVgUOp43HDW2JssupaoItuFD//xAAgEQABAwUAAwEAAAAAAAAAAAABAAIRAwQQEiEgMTJR/9oACAEDAQE/AUG4I8Ldux6tW/iqsBajm39Jsn2oKq/WbZ3YW6L0TJzb9cujhVeT3waYMhUqu4VeNSc//8QAIBEAAQQBBQEBAAAAAAAAAAAAAQACAxEQBBIgITETQf/aAAgBAgEBPwHnM7aF9HKKQ2hnUFOr8VgeKPzOob1aDFs7QFZnNNQN+KLo8HCxRU0RjKgJLqz/AP/EACgQAAEDAgYCAgIDAAAAAAAAAAEAAhEDIRASIDFBUTJxImETgUJicv/aAAgBAQAGPwLEtpiB3jIV/IYeSGjI3+WnMEHamnghSdlspheKkL/LtPaYfvSVU6nC40xTbKAqUKrfuFKy0qE/2JXyg+k496N8DKAYYKzZqnoqrHGyDyHEfSeeDwjb1gMBhCARi5TiTui0mQrJp5hX0XW6e39q5hhXxc+HdBfjaSCmsnM+EB1hGiwj2ncFtkWE34WUUz+nJ1QiPpflefWM4fEQO0D5O7OBdxUus7DDlDqbl8rNRpHYiyuvJXjBoxymzuCix1nDjCAqaKkK6Nyho6eNiixwgjA1Y2sEcbi6/8QAJBABAAICAgIDAAIDAAAAAAAAAQARITFBUWFxgZGhELHB4fD/2gAIAQEAAT8huDUVcNi6CF3aVfcq5odyzER4eoCGO/z5iHTVwDCgCcssfwEKbDl6P4wN4mksJyBhv5JhlkDBCLFhrX+RPzQmRRBON1BkoQ6KqlmLsJsmSA3B76mAPygp9FfyWCIzmPU1VTGpU+mJTiWTi4mHJEEeIO47UG7lKx7om275iUMqReQeGSr0nvYR8ltf3KT3DFQMstbSkB4gb7UcVXs3OjDwGPcEWqgvdotr/qikXkybqIJxz7ZmNglYyFDeJuV2xEF9qub7zODpKK7msMHIxlXmYZtBz0qNjBWZdK3HjZxFZZaXNhEPq5XfAMy2OjWkB7NdY9zMaV+WeHwS6GWTipaYBhcwywv2YGt3AobLXuJ8oJjinNZCRcQOYHDmi/3MAJYSsBLD0xFiNvRN0/U+iASczE3F98yppH7DcA1WY1i76dsLH8xIiFmo7x9oINkcL5lfkaNEEBhFOIz1MAnUVO4IopCVqbW/qahA4KRxhUa7YblbFQJklvwL/W+JcbVI8QqTUYfkYbo7jqVpuE//2gAMAwEAAgADAAAAEBT75pjEDxfHY2fs6efqaxKYWSEk8oXTIVWsM//EABwRAQEBAAMAAwAAAAAAAAAAAAEAERAhMUFRYf/aAAgBAwEBPxDNi9eNC8ngcYn1FiEO+T2T2G0VXXqAYPo5w3kHR1Fis+jwoQMmGRC/CzglL0i/aAZakO3/xAAcEQEBAQADAAMAAAAAAAAAAAABEQAQITEgQZH/2gAIAQIBAT8QmeQOWqZdo6eLvHBoJfNGYEPtlb4utqpcOAxCHAXJYxdvzog+/AW8N0jzGBpnrf/EACUQAQACAgICAQQDAQAAAAAAAAEAESExQVFhcYGRobHRweHw8f/aAAgBAQABPxBWBZmF8GFg6legzBK1VczsNEG8DmXKDJxCWUiGFTHe8BwekIhKteY9HqSxATKxUUodRN8wCg+5UwNsPBjzGpih0spkWm/cI1Wf1AoeT7wGqCpYBWrybgro+szrKmJNG5UU4fMPC1zHLlA9H9JDGQCHZC7Y1knTBkaYIE1itSr5KkIrMoN8FDX3lHHLcMcy8sqphtpeVTNwOXlOULXi/wCkKoZ3cHnTL3A6Ngl86D5hVuXJU6DYeLp/qZYa3KOKYpNtEUGS2wlhwmILAotrrMWpIWKAg8GWh+SB0EsgzBhMfmLqZtfUIAEWqvDofiKlkUJMjzLg2L1EAsDFDzHOqZgmxdoc/wCuPhYL6048wzaamS4Bby1flZQtZLbCFrFKFIRpHz9zDABo+jYSCtkGQvMVYJd26hYb546hqhlMQQ2vEWlbg6E7q4bShYb8MFFbQzq+XqKYrlpxiKnQparOnzB9xHHUCmcpXq1liWGipZHBRiUiHbGpiXhE5zqGADpIQfaHlZ/mXCXlbB6UPESZmWrZsRrJiNCuDCnotPiMKjY5yUahm/pSVYvmPBLE1mpq69wMQnuPDUOLcytYrjBjuotWDOgUR91F8Vq3bj9QCvutmeuZf8zJLdsF3FFP88EF1CXcGq4Q3ekOSKI7PUEUdlp+58EWS0XVj8D3D86W8xBakJxwH1p+Z3QQ4Pnz5giBvGj8kfApsnweCHJso+InxcK4El3AIxZrKCwh8MVAA5FxUAA0KwcBCwGaqVwdRuBNk/2OmK9Typ0jyPDAd48yug20cQ6uA+l4d3PD9o5c5VcMpGA5gwBVN4CBgcrBrWdxU1nUsDxNzSwf9F9o9JrfIhO4Yx8syYd30PzCGcgfEVtYlrBehgm/XY01P//Z"};
/* ---------- photo avatars ---------- */
const TONE={Customer:'green',Won:'green',Prospect:'blue',Discovery:'blue',Upcoming:'blue',Partner:'violet',Proposal:'violet',Negotiation:'amber','Needs reply':'yellow',Churned:'red',Lost:'red'};
function tones(root){ (root || document).querySelectorAll('.badge').forEach(el => { const t = TONE[el.textContent.trim()] || 'gray'; el.classList.remove('dark','line'); el.classList.add('t-'+t); }); }

/* company logos: each site's own icon, as the app shows it (CompanyLogo) */
const BRAND={"LI": "linear", "VE": "vercel", "NO": "notion", "ST": "stripe", "FI": "figma", "RA": "ramp", "AB": "airbnb", "SH": "shopify", "AN": "anthropic", "OA": "openai"};
function brands(root){
  (root||document).querySelectorAll('.logo').forEach(el=>{
    const k=el.textContent.trim(), b=BRAND[k]; if(!b||el.dataset.b) return;
    el.dataset.b=k; el.setAttribute('aria-label',k);
    el.innerHTML=`<i><img src="/assets/img/co/${b}.png" alt=""></i>`;
  });
}
function faces(root){
  tones(root);
  brands(root);
  (root || document).querySelectorAll('.av').forEach(el => {
    const k = el.textContent.trim();
    if (FACES[k] && !el.classList.contains('ph')){ el.style.backgroundImage = `url(${FACES[k]})`; el.classList.add('ph'); el.setAttribute('aria-label', k); }
  });
}


/* fit scaler */
const fits = [...document.querySelectorAll('.fit')];
function layoutFits(){
  for (const f of fits){
    const w = +f.dataset.w, inner = f.firstElementChild;
    const s = Math.min(1, f.clientWidth / w);
    inner.style.transform = s < 1 ? `scale(${s})` : '';
    inner.style.marginLeft = s < 1 ? '0' : 'auto';
    f.style.height = (inner.offsetHeight * s) + 'px';
  }
}


/* starfield in every black band */
const SKIES=[...document.querySelectorAll('.cosmos')].map(sec=>({sec,c:sec.querySelector('canvas.sky'),stars:[],W:0,H:0,d:1,vis:true,shoot:null,next:2500+Math.random()*3000}));
SKIES.forEach(k=>k.g=k.c.getContext('2d'));
let skyVis=true;
function initStars(){
  SKIES.forEach(k=>{ k.d=Math.min(2,devicePixelRatio||1); k.W=k.sec.clientWidth; k.H=k.sec.clientHeight; k.c.width=k.W*k.d; k.c.height=k.H*k.d;
    const n=Math.min(1100,Math.round(k.W*k.H/2200));
    k.stars=Array.from({length:n},()=>({x:Math.random()*k.W,y:Math.random()*k.H,r:Math.random()<.93?Math.random()*.75+.2:Math.random()*1.1+.8,a:Math.random()*.6+.15,s:Math.random()*1.8+.4,p:Math.random()*6.283})); });
}
function drawStars(t){
  SKIES.forEach(k=>{ if(!k.vis && t) return; const g=k.g; g.setTransform(k.d,0,0,k.d,0,0); g.clearRect(0,0,k.W,k.H); g.fillStyle='#fff';
    for(const s of k.stars){ g.globalAlpha=reduce?s.a:s.a*(.6+.4*Math.sin(t*.001*s.s+s.p)); g.beginPath(); g.arc(s.x,s.y,s.r,0,6.283); g.fill(); if(s.r>1.3){ g.globalAlpha*=.12; g.beginPath(); g.arc(s.x,s.y,s.r*4,0,6.283); g.fill(); } }
    if(!reduce){
      if(!k.shoot && t>k.next) k.shoot={x:Math.random()*k.W*.8+k.W*.1,y:Math.random()*k.H*.3,vx:-(3+Math.random()*3),vy:1.6+Math.random()*1.4,life:0};
      const sh=k.shoot;
      if(sh){ sh.life++; sh.x+=sh.vx*2; sh.y+=sh.vy*2; const a=Math.max(0,1-sh.life/70);
        const gr=g.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*28,sh.y-sh.vy*28); gr.addColorStop(0,`rgba(255,255,255,${a})`); gr.addColorStop(1,'rgba(255,255,255,0)');
        g.globalAlpha=1; g.strokeStyle=gr; g.lineWidth=1.2; g.beginPath(); g.moveTo(sh.x,sh.y); g.lineTo(sh.x-sh.vx*28,sh.y-sh.vy*28); g.stroke();
        if(sh.life>70){ k.shoot=null; k.next=t+5000+Math.random()*7000; } }
    }
    g.globalAlpha=1; });
}
if('IntersectionObserver' in window) SKIES.forEach(k=>new IntersectionObserver(es=>es.forEach(e=>{ k.vis=e.isIntersecting; })).observe(k.sec));


/* hero starlight: a sparse ink sky. Fine dust that twinkles, a few four-point sparkles that breathe,
   soft light behind them, and a clear area behind the headline. Drifts in depth with the pointer. */
(function(){
  const c=document.getElementById('hsky'); if(!c) return; const g=c.getContext('2d'), hero=c.parentElement;
  let W=0,H=0,d=1,dust=[],glints=[],glow=null,vis=true,tx=0,ty=0,px=0,py=0,shoot=null,next=3500;
  const rnd=Math.random;
  const boxes=()=>{ const hr=hero.getBoundingClientRect(); return [...hero.querySelectorAll('.wrap h1,.hero-form,.hlive,.hlede,.hpill,.hchecks,.plede,.pchip,.pcrumb')].map(e=>{ const r=e.getBoundingClientRect(); return {x0:r.left-hr.left-28,y0:r.top-hr.top-20,x1:r.right-hr.left+28,y1:r.bottom-hr.top+20}; }); };
  const inBox=(B,x,y)=>B.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);
  const init=()=>{
    d=Math.min(2,devicePixelRatio||1); W=hero.clientWidth; H=Math.min(hero.clientHeight,1100); c.style.height=H+'px'; c.width=W*d; c.height=H*d;
    const B=boxes(), n=Math.round(Math.min(130,W*H/9000)); dust=[];
    for(let i=0;i<n*3&&dust.length<n;i++){ const x=rnd()*W, y=rnd()*H*.82; if(inBox(B,x,y)&&rnd()<.92) continue;
      const m=Math.pow(rnd(),3); dust.push({x,y,r:.4+m*.9,a:.07+m*.35,s:.4+rnd()*1.4,p:rnd()*6.283,z:.1+rnd()*.6}); }
    // sparkles: one large, two medium, the rest small, spaced apart and away from text
    const sizes=W>900?[18,11,8,6,5]:[12,7,5];
    glints=[]; let tries=0;
    while(glints.length<sizes.length&&tries++<4000){ const x=W*(.04+rnd()*.92), y=H*(.05+rnd()*.5);
      if(inBox(B,x,y)) continue; if(glints.some(q=>Math.hypot(q.x-x,q.y-y)<Math.min(W,900)*.25)) continue;
      const R=sizes[glints.length]; glints.push({x,y,R,p:rnd()*6.283,s:.5+rnd()*.5,z:.5+rnd()*.5,rot:(rnd()-.5)*.25}); }
    // soft light: faint pools of gray behind the sky, drawn once
    glow=document.createElement('canvas'); glow.width=W; glow.height=H; const h=glow.getContext('2d');
    [[W*.82,H*.18,W*.34],[W*.62,H*.5,W*.26],[W*.12,H*.08,W*.22]].forEach(([x,y,r])=>{ const gr=h.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(150,165,255,.05)'); gr.addColorStop(1,'rgba(150,165,255,0)'); h.fillStyle=gr; h.fillRect(0,0,W,H); });
  };
  const star=(x,y,R,w)=>{ g.beginPath(); g.moveTo(x,y-R); g.quadraticCurveTo(x+w,y-w,x+R,y); g.quadraticCurveTo(x+w,y+w,x,y+R); g.quadraticCurveTo(x-w,y+w,x-R,y); g.quadraticCurveTo(x-w,y-w,x,y-R); g.closePath(); g.fill(); };
  const draw=t=>{
    g.setTransform(d,0,0,d,0,0); g.clearRect(0,0,W,H); px+=(tx-px)*.05; py+=(ty-py)*.05;
    g.globalAlpha=1; g.drawImage(glow,px*-8,py*-6);
    g.fillStyle='#fff';
    for(const s of dust){ const tw=reduce?1:.55+.45*Math.sin(t*.001*s.s+s.p); g.globalAlpha=s.a*tw; g.beginPath(); g.arc(s.x+px*s.z*16,s.y+py*s.z*10,s.r,0,6.283); g.fill(); }
    for(const q of glints){
      const b=reduce?1:.78+.22*Math.sin(t*.0009*q.s+q.p), x=q.x+px*q.z*26, y=q.y+py*q.z*16, R=q.R*b;
      const hr=R*3.2, gr=g.createRadialGradient(x,y,0,x,y,hr); gr.addColorStop(0,`rgba(255,255,255,${.09*b})`); gr.addColorStop(1,'rgba(150,165,255,0)');
      g.globalAlpha=1; g.fillStyle=gr; g.fillRect(x-hr,y-hr,hr*2,hr*2);
      g.save(); g.translate(x,y); g.rotate(q.rot+(reduce?0:Math.sin(t*.0003*q.s+q.p)*.06)); g.fillStyle='#fff';
      g.globalAlpha=.9*b; star(0,0,R,R*.13);
      g.globalAlpha=.35*b; g.rotate(Math.PI/4); star(0,0,R*.42,R*.08);
      g.restore();
    }
    if(!reduce){ if(!shoot&&t>next) shoot={x:W*(.55+rnd()*.4),y:H*(.04+rnd()*.14),vx:-(2.6+rnd()*1.2),vy:.9+rnd()*.5,life:0};
      if(shoot){ shoot.life++; shoot.x+=shoot.vx*2.2; shoot.y+=shoot.vy*2.2; const a=Math.sin(Math.min(1,shoot.life/80)*Math.PI)*.45, L=60;
        const gr=g.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.vx*L,shoot.y-shoot.vy*L); gr.addColorStop(0,`rgba(255,255,255,${a})`); gr.addColorStop(1,'rgba(150,165,255,0)');
        g.globalAlpha=1; g.strokeStyle=gr; g.lineWidth=1; g.lineCap='round'; g.beginPath(); g.moveTo(shoot.x,shoot.y); g.lineTo(shoot.x-shoot.vx*L,shoot.y-shoot.vy*L); g.stroke();
        g.fillStyle=`rgba(255,255,255,${a*1.4})`; g.beginPath(); g.arc(shoot.x,shoot.y,1.1,0,6.283); g.fill();
        if(shoot.life>80){ shoot=null; next=t+9000+rnd()*9000; } } }
    g.globalAlpha=1;
  };
  init(); draw(0); addEventListener('resize',()=>{ init(); draw(performance.now()); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ init(); draw(performance.now()); });
  hero.addEventListener('pointermove',e=>{ const r=hero.getBoundingClientRect(); tx=(e.clientX-r.left)/r.width-.5; ty=(e.clientY-r.top)/r.height-.5; });
  if('IntersectionObserver' in window) new IntersectionObserver(es=>es.forEach(e=>{vis=e.isIntersecting;})).observe(hero);
  if(!reduce){ const loop=t=>{ if(vis) draw(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();

/* nav: mega menus open on hover or click, close on leave, Escape or a link */
(function(){
  const nav=document.querySelector('.nav'); if(!nav) return;
  const ts=[...nav.querySelectorAll('.mm-t')]; let shut;
  const close=()=>{ ts.forEach(t=>{ t.setAttribute('aria-expanded','false'); document.getElementById(t.getAttribute('aria-controls')).classList.remove('on'); }); };
  const open=t=>{ clearTimeout(shut); ts.forEach(x=>{ const on=x===t; x.setAttribute('aria-expanded',on); document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on',on); }); };
  ts.forEach(t=>{ const m=document.getElementById(t.getAttribute('aria-controls'));
    if(m.classList.contains('mm-sm')){ const place=()=>{ const w=nav.querySelector('.wrap').getBoundingClientRect(), r=t.getBoundingClientRect(), end=nav.querySelector('.nav-cta').getBoundingClientRect().right-w.left; m.style.left=Math.max(24,Math.min(r.left+r.width/2-w.left-m.offsetWidth/2,end-m.offsetWidth))+'px'; }; t.addEventListener('mouseenter',place); t.addEventListener('focus',place); }
    t.addEventListener('mouseenter',()=>{ if(matchMedia('(hover:hover)').matches) open(t); });
    t.addEventListener('click',()=>{ t.getAttribute('aria-expanded')==='true'?close():open(t); });
    m.addEventListener('mouseenter',()=>clearTimeout(shut));
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',close)); });
  nav.addEventListener('mouseleave',()=>{ shut=setTimeout(close,180); });
  nav.querySelectorAll('.links>a').forEach(a=>a.addEventListener('mouseenter',close));
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  document.addEventListener('click',e=>{ if(!nav.contains(e.target)) close(); });
})();

/* finale: reveal and its own starfield */
(function(){
  const fin=document.querySelector('.finale'); if(!fin) return;
  if('IntersectionObserver' in window){ new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) fin.classList.add('in'); }),{threshold:.25}).observe(fin); } else fin.classList.add('in');
  const c=document.getElementById('sky2'), g=c.getContext('2d'); let st=[],W=0,H=0,d=1,vis=false;
  const init=()=>{ d=Math.min(2,devicePixelRatio||1); W=fin.clientWidth; H=fin.clientHeight; c.width=W*d; c.height=H*d; st=Array.from({length:Math.min(500,Math.round(W*H/2600))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()<.92?Math.random()*.7+.2:Math.random()+.8,a:Math.random()*.6+.15,s:Math.random()*1.6+.4,p:Math.random()*6.28,v:Math.random()*.12+.02})); };
  const draw=t=>{ g.setTransform(d,0,0,d,0,0); g.clearRect(0,0,W,H); g.fillStyle='#fff'; for(const s of st){ const y=reduce?s.y:(s.y - t*0.01*s.v*3 + H*10)%H; g.globalAlpha=reduce?s.a:s.a*(.6+.4*Math.sin(t*.001*s.s+s.p)); g.beginPath(); g.arc(s.x,y,s.r,0,6.283); g.fill(); } g.globalAlpha=1; };
  init(); draw(0); addEventListener('resize',()=>{ init(); draw(performance.now()); });
  if('IntersectionObserver' in window) new IntersectionObserver(es=>es.forEach(e=>{vis=e.isIntersecting;})).observe(fin);
  if(!reduce){ const loop=t=>{ if(vis) draw(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();


/* the night sky behind the whole page: three depths of stars that drift with the scroll, slow twinkle,
   a shooting star now and then. One fixed canvas, drawn only while the tab is visible. */
(function(){
  const c=document.getElementById('space'); if(!c) return; const g=c.getContext('2d'), neb=document.querySelector('.space .nebula');
  let W=0,H=0,d=1,L=[],shoot=null,next=2600; const rnd=Math.random;
  const init=()=>{ d=Math.min(2,devicePixelRatio||1); W=innerWidth; H=innerHeight; c.width=W*d; c.height=H*d;
    const n=Math.min(900,Math.round(W*H/1500)); L=[.04,.12,.26].map((z,k)=>Array.from({length:Math.round(n*[.62,.28,.1][k])},()=>{ const m=Math.pow(rnd(),k===2?1.4:3);
      const tint=rnd(); return {x:rnd()*W,y:rnd()*H*1.2,r:(k===0?.25:k===1?.4:.7)+m*(k===2?1.1:.7),a:.18+m*.7,s:.3+rnd()*1.6,p:rnd()*6.283,z,c:tint<.12?'200,215,255':tint<.18?'255,228,200':'255,255,255'}; })); };
  const draw=t=>{ const sy=scrollY; g.setTransform(d,0,0,d,0,0); g.clearRect(0,0,W,H);
    for(const layer of L) for(const s of layer){ let y=(s.y-sy*s.z)%(H*1.2); if(y<0) y+=H*1.2; if(y>H+4) continue;
      const tw=reduce?1:.62+.38*Math.sin(t*.001*s.s+s.p); g.globalAlpha=s.a*tw; g.fillStyle=`rgb(${s.c})`; g.beginPath(); g.arc(s.x,y,s.r,0,6.283); g.fill();
      if(s.r>1.25){ g.globalAlpha=s.a*tw*.18; g.beginPath(); g.arc(s.x,y,s.r*3.2,0,6.283); g.fill(); } }
    if(!reduce){ if(!shoot&&t>next) shoot={x:W*(.3+rnd()*.7),y:H*(.05+rnd()*.35),vx:-(3+rnd()*2),vy:1.1+rnd()*.8,life:0};
      if(shoot){ shoot.life++; shoot.x+=shoot.vx*2.4; shoot.y+=shoot.vy*2.4; const a=Math.sin(Math.min(1,shoot.life/70)*Math.PI)*.7, T=70;
        const gr=g.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.vx*T,shoot.y-shoot.vy*T); gr.addColorStop(0,`rgba(255,255,255,${a})`); gr.addColorStop(1,'rgba(255,255,255,0)');
        g.globalAlpha=1; g.strokeStyle=gr; g.lineWidth=1.1; g.lineCap='round'; g.beginPath(); g.moveTo(shoot.x,shoot.y); g.lineTo(shoot.x-shoot.vx*T,shoot.y-shoot.vy*T); g.stroke();
        if(shoot.life>70){ shoot=null; next=t+7000+rnd()*9000; } } }
    g.globalAlpha=1; if(neb) neb.style.transform=`translate3d(0,${(-sy*.06).toFixed(1)}px,0)`; };
  init(); draw(0); let rz; addEventListener('resize',()=>{ clearTimeout(rz); rz=setTimeout(()=>{ init(); draw(performance.now()); },120); });
  if(reduce) addEventListener('scroll',()=>draw(0),{passive:true});
  else { const loop=t=>{ if(!document.hidden) draw(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();


/* email fields: check the address, then sign up */
document.querySelectorAll('.hero-form').forEach(f=>{ const i=f.querySelector('input');
  i.addEventListener('input',()=>f.classList.remove('bad'));
  f.addEventListener('submit',e=>{ e.preventDefault(); const v=i.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ f.classList.add('bad'); i.focus(); return; }
    location.href=f.action+'?email='+encodeURIComponent(v); }); });
/* reveal on scroll: each revealed block fills in its lines one after another */
const STAGGER='.um,.om,.lrow,.urow,.mrow,.tli,.flow>*,.oc,.src,.slash a,.card-b>div,.toast,.plogo,.pts>div,.cmp li,.cmp li span,.cmp li i';
document.querySelectorAll('.rv').forEach(r=>{ let k=0; r.querySelectorAll(STAGGER).forEach(el=>{ if(el.matches('.cmp li span,.cmp li i')){ el.style.transitionDelay=(180+[...el.closest('ul').children].indexOf(el.closest('li'))*160)+'ms'; return; } el.style.transitionDelay=Math.min(1400,120+k++*90)+'ms'; }); });
(function(){ const els=[...document.querySelectorAll('.rv')]; if(!('IntersectionObserver' in window)||reduce){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'}); els.forEach(e=>io.observe(e)); })();
/* billing switch on the Pricing page */
(function(){ const by=document.getElementById('b-year'), bm=document.getElementById('b-month'); if(!by||!bm) return;
  const set=y=>{ by.setAttribute('aria-pressed',y); bm.setAttribute('aria-pressed',!y);
    document.querySelectorAll('.price b[data-y]').forEach(b=>b.textContent='$'+(y?b.dataset.y:b.dataset.m));
    document.querySelectorAll('.note[data-y]').forEach(n=>n.textContent=y?n.dataset.y:n.dataset.m); };
  by.addEventListener('click',()=>set(true)); bm.addEventListener('click',()=>set(false)); })();
faces();
function resizeAll(){ layoutFits(); initStars(); drawStars(performance.now()); }
resizeAll();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resizeAll, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(resizeAll);
if (!reduce){ const loop = t => { drawStars(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();
