// Blog pages (tools/blog.mjs): product shots play once in view, the contents follow the reading position, and the
// index filters by topic. No library. Without JavaScript every post shows and every shot shows its end state.
(function () {
  // Product shots: the same "in" class product.js adds, so home.css plays each shot once.
  var shots = document.querySelectorAll("[data-anim]");
  if (!("IntersectionObserver" in window)) {
    shots.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    shots.forEach(function (el) { io.observe(el); });
  }
})();

(function () {
  // Contents: the section being read is marked in the side list.
  var links = Array.prototype.slice.call(document.querySelectorAll(".bl-toc a[href^='#']"));
  if (!links.length) return;
  var heads = links.map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))); });
  var current = -1;
  var ticking = false;
  function update() {
    ticking = false;
    // Just below where a contents jump lands a heading (base.css scroll-padding-top: header + 16px).
    var line = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80) + 24;
    var i = -1;
    for (var k = 0; k < heads.length; k++) {
      if (heads[k] && heads[k].getBoundingClientRect().top <= line) i = k;
    }
    if (i === current) return;
    if (current > -1) links[current].removeAttribute("aria-current");
    if (i > -1) links[i].setAttribute("aria-current", "true");
    current = i;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

(function () {
  // Index: filter the cards by topic. ?topic=crm opens on that topic.
  var filter = document.querySelector(".bl-filter");
  if (!filter) return;
  var buttons = Array.prototype.slice.call(filter.querySelectorAll("[data-topic]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".bl-cards .bl-card"));
  var empty = document.querySelector(".bl-empty");
  function show(topic, push) {
    if (!buttons.some(function (b) { return b.getAttribute("data-topic") === topic; })) topic = "all";
    var shown = 0;
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-topic") === topic ? "true" : "false"); });
    cards.forEach(function (c) {
      var on = topic === "all" || c.getAttribute("data-topic") === topic;
      c.hidden = !on;
      if (on) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (push && window.history && history.replaceState) {
      var url = topic === "all" ? location.pathname : location.pathname + "?topic=" + encodeURIComponent(topic);
      history.replaceState(null, "", url);
    }
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () { show(b.getAttribute("data-topic"), true); });
  });
  var match = /[?&]topic=([^&#]+)/.exec(location.search);
  if (match) show(decodeURIComponent(match[1]).toLowerCase(), false);
})();
