/* Home page menus for the older pages. Written by tools/pages/build.py. */
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
