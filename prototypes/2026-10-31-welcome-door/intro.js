/* Purrlight Studio — the welcome door on the home page (preview 31/10, after Elise liked the opening of kenailapp.com).
   Once per visit: crochet stitches drift down a cream page around the logo and Merlin's signature line, under an
   arched door. "Open chapter one" opens the door onto the real Merlin, then the page comes forward through it.
   Never shown with reduced motion (also when switched on mid-way), with a #link, inside a frame (unless ?intro=1),
   to automated browsers and crawlers, or without JavaScript (nothing is hidden then). "Skip intro" and Esc end it at
   once; the stitches slow to a stop after 7 s, so nothing runs for ever. Plain ES5, no library. */
(function () {
  "use strict";
  var d = document.documentElement, q = location.search;
  var force = /[?&]intro=1\b/.test(q);
  var reduceMq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  var seen = false, framed = true;
  try { seen = sessionStorage.getItem("pl-intro") === "1"; } catch (e) { /* storage blocked: show it */ }
  try { framed = window.top !== window.self; } catch (e) { /* a cross-origin parent: framed */ }
  var bot = navigator.webdriver || /bot|crawl|spider|slurp|facebookexternalhit|lighthouse/i.test(navigator.userAgent);
  if (/[?&]nointro\b/.test(q) || location.hash || (reduceMq && reduceMq.matches) || (!force && (seen || bot || framed))) return;

  d.classList.add("pl-intro");   /* css/intro.css: a cream curtain until the door is built, the page held back */
  try { history.scrollRestoration = "manual"; } catch (e) { /* old browsers */ }

  var overlay, stopStitches = function () {}, inerted = [], done = false, timers = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var remember = function () { try { sessionStorage.setItem("pl-intro", "1"); } catch (e) { /* fine */ } };

  function finish() {
    if (done) return;
    done = true;
    remember();
    timers.forEach(clearTimeout);
    stopStitches();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    inerted.forEach(function (n) { n.removeAttribute("inert"); });
    d.classList.remove("pl-intro", "pl-built", "pl-reveal");
    document.removeEventListener("keydown", onKey);
    try { history.scrollRestoration = "auto"; } catch (e) { /* old browsers */ }
  }
  function onKey(e) { if (e.key === "Escape" || e.key === "Esc") finish(); }

  function open() {
    if (overlay.classList.contains("is-open")) return;
    remember();
    overlay.classList.add("is-open");                   /* the leaves swing back onto Merlin */
    later(function () { overlay.classList.add("is-through"); }, 1050);   /* the words go, the doorway fills with warm light */
    later(function () {
      overlay.classList.add("is-gone");                 /* the light lifts off */
      d.classList.add("pl-reveal");                     /* and the page comes forward */
    }, 1850);
    later(finish, 2550);
  }

  /* the falling stitches: crochet chart symbols (chain, single, half double, double crochet) in the yarn colours */
  function stitches(canvas) {
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return function () {};
    var COLORS = ["232,168,124", "180,34,73", "202,141,65", "78,99,70", "156,83,37"];
    var KINDS = ["o", "x", "t", "f"], GAP = 16;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, cols = [], raf = 0, t0 = 0, last = 0, stopped = false;
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    function column(i, n, anywhere) {
      return { x: (i + 0.5) * W / n + (Math.random() - 0.5) * 12, y: anywhere ? Math.random() * H * 1.2 : -Math.random() * H * 0.4,
        v: 24 + Math.random() * 34, len: 4 + Math.floor(Math.random() * 8), c: pick(COLORS), seed: Math.floor(Math.random() * 4) };
    }
    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(7, Math.round(W / 38));
      cols = [];
      for (var i = 0; i < n; i++) cols.push(column(i, n, true));
    }
    function glyph(k, x, y, s) {
      ctx.beginPath();
      if (k === "o") ctx.ellipse(x, y, s * 0.55, s * 0.34, 0, 0, Math.PI * 2);
      else if (k === "x") { ctx.moveTo(x - s * 0.42, y - s * 0.42); ctx.lineTo(x + s * 0.42, y + s * 0.42); ctx.moveTo(x + s * 0.42, y - s * 0.42); ctx.lineTo(x - s * 0.42, y + s * 0.42); }
      else {
        ctx.moveTo(x - s * 0.42, y - s * 0.5); ctx.lineTo(x + s * 0.42, y - s * 0.5); ctx.moveTo(x, y - s * 0.5); ctx.lineTo(x, y + s * 0.5);
        if (k === "f") { ctx.moveTo(x - s * 0.3, y + s * 0.12); ctx.lineTo(x + s * 0.3, y - s * 0.16); }
      }
      ctx.stroke();
    }
    function frame(now) {
      if (stopped) return;
      if (!t0) t0 = last = now;
      var dt = Math.min(0.05, (now - last) / 1000), age = (now - t0) / 1000;
      last = now;
      var speed = age < 7 ? 1 : Math.max(0, 1 - (age - 7) / 2.5);   /* slows to a stop after 7 s */
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i];
        c.y += c.v * dt * speed;
        if (c.y - c.len * GAP > H) { var fresh = column(i, cols.length, false); fresh.x = c.x; cols[i] = c = fresh; }
        for (var j = 0; j < c.len; j++) {
          var y = c.y - j * GAP;
          if (y < -GAP || y > H + GAP) continue;
          ctx.strokeStyle = "rgba(" + c.c + "," + (j === 0 ? 0.9 : 0.62 * (1 - j / c.len)).toFixed(3) + ")";
          glyph(KINDS[(c.seed + j) % KINDS.length], c.x, y, j === 0 ? 11 : 9);
        }
      }
      if (speed > 0) raf = requestAnimationFrame(frame);
    }
    function onVis() { if (document.hidden) cancelAnimationFrame(raf); else if (!stopped) raf = requestAnimationFrame(function (n) { last = n; frame(n); }); }
    size();
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener("resize", size); document.removeEventListener("visibilitychange", onVis); };
  }

  function build() {
    if (done) return;
    try {
      overlay = document.createElement("div");
      overlay.className = "pl-intro-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "pl-intro-line");
      overlay.tabIndex = -1;   /* focus goes into the dialog without drawing a ring on the door */
      overlay.innerHTML =
        '<canvas class="pl-stitches" aria-hidden="true"></canvas>' +
        '<button class="pl-skip" type="button">Skip intro</button>' +
        '<div class="pl-intro-card">' +
          '<img class="pl-intro-logo" src="assets/brand/logo-flat.png" alt="Purrlight Studio" width="360" height="119">' +
          '<p class="pl-intro-line" id="pl-intro-line">Sketched by Merlin,<br><em>stitched by us.</em></p>' +
          '<p class="pl-intro-hand">Made by hand. Made to be kept.</p>' +
          '<button class="pl-door" type="button">' +
            '<span class="pl-door-light" aria-hidden="true">' +
              '<img src="assets/img/home/merlin-real-360.webp" alt="" width="360" height="360">' +
              '<span class="pl-door-chapter">✦ chapter one</span>' +
            '</span>' +
            '<span class="pl-door-leaf pl-door-l" aria-hidden="true"></span>' +
            '<span class="pl-door-leaf pl-door-r" aria-hidden="true"></span>' +
            '<span class="pl-door-label">Open chapter one</span>' +
          '</button>' +
        '</div>';
      document.body.insertBefore(overlay, document.body.firstChild);
      d.classList.add("pl-built");
      [].forEach.call(document.body.children, function (n) {
        if (n !== overlay && n.tagName !== "SCRIPT" && !n.hasAttribute("inert")) { n.setAttribute("inert", ""); inerted.push(n); }
      });
      stopStitches = stitches(overlay.querySelector(".pl-stitches"));
      overlay.querySelector(".pl-door").addEventListener("click", open);
      overlay.querySelector(".pl-skip").addEventListener("click", finish);
      document.addEventListener("keydown", onKey);
      if (reduceMq) {
        var onReduce = function () { if (reduceMq.matches) finish(); };
        if (reduceMq.addEventListener) reduceMq.addEventListener("change", onReduce); else if (reduceMq.addListener) reduceMq.addListener(onReduce);
      }
      try { overlay.focus({ preventScroll: true }); } catch (e) { overlay.focus(); }
    } catch (err) {
      finish();   /* never let the welcome block the shop */
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
