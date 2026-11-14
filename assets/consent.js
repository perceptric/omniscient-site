/* Cookie consent for tryomniscient.com.
   Shows a small card until the visitor accepts or rejects, and remembers the choice for a year.
   Analytics only load after "Accept": add them as <script type="text/plain" data-consent="analytics" data-src="..."></script>
   (or inline code inside such a tag) and this file turns them on. A link to #cookies (the footer's "Cookie settings") opens the card again.
   Other scripts can read window.omniConsent.get() ("accepted", "rejected" or null) and listen with window.omniConsent.on(fn). */
(function () {
  var KEY = "omni_consent", DAYS = 365, fns = [];

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v && v.c && Date.now() - v.t < DAYS * 864e5) return v.c;
    } catch (e) {}
    var m = document.cookie.match(/(?:^|; )omni_consent=(accepted|rejected)/);
    return m ? m[1] : null;
  }
  function write(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {}
    try { document.cookie = "omni_consent=" + c + "; max-age=" + DAYS * 86400 + "; path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : ""); } catch (e) {}
  }
  function enable() {
    document.querySelectorAll('script[type="text/plain"][data-consent="analytics"]').forEach(function (old) {
      var s = document.createElement("script");
      if (old.dataset.src) { s.src = old.dataset.src; s.async = true; } else s.text = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
  }

  var css = ".ck{position:fixed;left:16px;bottom:16px;z-index:1000;width:min(380px,calc(100vw - 32px));padding:18px 18px 16px;border-radius:16px;background:#fff;color:#0a0a0a;"
    + "box-shadow:0 0 0 1px rgba(0,0,0,.08),0 24px 60px -18px rgba(0,0,0,.28),0 2px 6px rgba(0,0,0,.05);font:400 14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;"
    + "-webkit-font-smoothing:antialiased;opacity:0;transform:translateY(8px);filter:blur(2px);transition:opacity .4s cubic-bezier(.22,1,.36,1),transform .4s cubic-bezier(.22,1,.36,1),filter .4s}"
    + ".ck.on{opacity:1;transform:none;filter:none}"
    + ".ck b{display:block;font-weight:500;font-size:15px;letter-spacing:-.01em;margin-bottom:4px}"
    + ".ck p{margin:0;color:#6b6b6b;overflow-wrap:break-word}"
    + ".ck p a{color:#0a0a0a;text-decoration:underline;text-underline-offset:2px}"
    + ".ck-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}"
    + ".ck button{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 16px;border:0;border-radius:999px;font-family:inherit;font-weight:500;font-size:14px;line-height:1;cursor:pointer;transition:background .15s,box-shadow .15s}"
    + ".ck .ck-y{background:#0a0a0a;color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.85),0 1px 3px rgba(0,0,0,.4)}"
    + ".ck .ck-y:hover{background:#262626}"
    + ".ck .ck-n{background:#fff;color:#0a0a0a;box-shadow:0 0 0 1px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06)}"
    + ".ck .ck-n:hover{box-shadow:0 0 0 1px rgba(0,0,0,.22),0 2px 4px rgba(0,0,0,.1)}"
    + ".ck button:focus-visible{outline:2px solid #0a0a0a;outline-offset:2px}"
    + "@media (prefers-reduced-motion:reduce){.ck{transition:none}}";

  var card;
  function show() {
    if (!card) {
      var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
      card = document.createElement("div");
      card.className = "ck"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Cookie choices");
      card.innerHTML = "<b>Cookies</b><p>We use cookies to understand how people use this site and to improve it. Storage the site needs to work is always on. <a href=\"/privacy/\">Privacy policy</a></p>"
        + "<div class=\"ck-row\"><button type=\"button\" class=\"ck-y\">Accept</button><button type=\"button\" class=\"ck-n\">Reject</button></div>";
      card.querySelector(".ck-y").addEventListener("click", function () { choose("accepted"); });
      card.querySelector(".ck-n").addEventListener("click", function () { choose("rejected"); });
      document.body.appendChild(card);
    }
    card.style.display = "";
    requestAnimationFrame(function () { requestAnimationFrame(function () { card.classList.add("on"); }); });
  }
  function hide() {
    if (!card) return;
    card.classList.remove("on");
    setTimeout(function () { if (card && !card.classList.contains("on")) card.style.display = "none"; }, 420);
  }
  function choose(c) {
    write(c); hide();
    if (c === "accepted") enable();
    fns.forEach(function (f) { try { f(c); } catch (e) {} });
  }

  window.omniConsent = { get: read, on: function (f) { fns.push(f); }, open: show };

  function start() {
    var c = read();
    if (c === "accepted") enable();
    else if (!c) setTimeout(show, 900);
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href="#cookies"]');
      if (a) { e.preventDefault(); show(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
