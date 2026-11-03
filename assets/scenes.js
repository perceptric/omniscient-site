// Scenes: small product screens drawn in HTML and CSS that play step by step (styles in scenes.css and product.css).
// A part with data-at="n" comes in at step n, a part with data-off="n" leaves at step n, and the scene gets the
// classes s1 to sn as it goes (a part that is in has is-on, one that has left has is-gone). data-t lists the wait in ms before each step.
// Product pages: a scene plays once when it comes into view and stays on its last frame; hover or tap plays it again.
// Product menu: the scenes play while the menu is open, and the hovered or focused card's scene loops.
// Reduced motion shows the last frame.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function make(root) {
    var parts = root.querySelectorAll("[data-at],[data-off]");
    var t = (root.getAttribute("data-t") || "0").split(",").map(Number);
    var last = t.length, step = 0, timer = 0, busy = false, loop = false, played = false;

    function show(n) {
      step = n;
      for (var k = 1; k <= last; k++) root.classList.toggle("s" + k, k <= n);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], at = +(p.getAttribute("data-at") || 0), off = p.getAttribute("data-off");
        off = off === null ? 1e9 : +off;
        p.classList.toggle("is-on", n >= at && n < off);
        p.classList.toggle("is-gone", n >= off);
      }
    }
    function next() {
      if (step < last) {
        timer = setTimeout(function () { show(step + 1); next(); }, t[step]);
        return;
      }
      // Leave time for the last step's own motion before it counts as done.
      timer = setTimeout(function () {
        busy = false;
        root.classList.remove("is-live");
        if (loop) timer = setTimeout(again, 2200);
      }, 900);
    }
    function play() {
      clearTimeout(timer);
      played = true;
      root.classList.add("in");
      if (reduce.matches) { show(last); busy = false; return; }
      busy = true;
      root.classList.add("is-live");
      show(0);
      next();
    }
    // Everything leaves the way it came in, then the scene plays again.
    function again() {
      clearTimeout(timer);
      if (reduce.matches) return play();
      busy = true;
      show(0);
      timer = setTimeout(play, 420);
    }
    // Straight to the first frame, with no motion.
    function reset() {
      clearTimeout(timer);
      busy = false;
      root.classList.remove("is-live");
      root.classList.add("is-snap");
      show(0);
      void root.offsetWidth;
      root.classList.remove("is-snap");
    }

    root.classList.add("is-armed");
    show(0);
    return {
      root: root,
      play: play,
      reset: reset,
      later: function (ms) { clearTimeout(timer); if (reduce.matches) play(); else timer = setTimeout(play, ms); },
      stop: function () { clearTimeout(timer); busy = false; loop = false; root.classList.remove("is-live"); },
      replay: function () { if (played && !busy) again(); },
      loop: function (on) { loop = on; if (on && !busy) again(); },
    };
  }

  var all = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
  if (!all.length) return;

  // The Product menu.
  var panel = document.getElementById("menu-product");
  var group = panel && panel.closest(".nav__group");
  var minis = all.filter(function (el) { return panel && panel.contains(el); }).map(make);
  if (group && minis.length && "MutationObserver" in window) {
    var open = false;
    new MutationObserver(function () {
      var now = group.classList.contains("is-open");
      if (now === open) return;
      open = now;
      minis.forEach(function (s, i) {
        if (open) { s.reset(); s.later(140 + i * 160); } else s.stop();
      });
    }).observe(group, { attributes: true, attributeFilter: ["class"] });
    minis.forEach(function (s) {
      var card = s.root.closest(".menu__card") || s.root;
      var on = function () { if (open) s.loop(true); };
      var off = function () { s.loop(false); };
      card.addEventListener("pointerenter", on);
      card.addEventListener("focus", on);
      card.addEventListener("pointerleave", off);
      card.addEventListener("blur", off);
    });
  }

  // Scenes on the page.
  var hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var shots = all.filter(function (el) { return !(panel && panel.contains(el)); }).map(make);
  shots.forEach(function (s) {
    s.root.addEventListener("pointerenter", function () { if (hover.matches) s.replay(); });
    s.root.addEventListener("click", function () { s.replay(); });
  });
  if (!("IntersectionObserver" in window)) return shots.forEach(function (s) { s.play(); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      shots.forEach(function (s) { if (s.root === e.target) s.play(); });
    });
  }, { threshold: 0.4 });
  shots.forEach(function (s) { io.observe(s.root); });
})();
