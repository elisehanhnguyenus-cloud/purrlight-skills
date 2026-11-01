/* PREVIEW 01/11 — Direction 1, "Merlin's book" (js/concept-boot.js loads this with ?concept=book; never shipped).
   1. The welcome (home page only, once per tab): Merlin's clothbound notebook lies on a walnut tea table under a lamp,
      with a blue-and-white teacup on a quilt-patch coaster and a ball of peach yarn. "Open the book" (or a tap on the
      book) swings the cover open onto a gach bong endpaper with a bookplate and the real Merlin as a living photograph,
      turns one page to "chapter one", and that page comes forward into the real home page. About 3.9 s after the tap;
      a tap anywhere fast-forwards, "Skip intro" and Esc end it at once. Never with reduced motion (also when switched
      on mid-way), with ?nointro or a #link, and - unless ?intro=1 - not inside a frame, for automated browsers or on a
      second visit in the tab. Merlin is only ever Elise's real photo and video; nothing here draws a cat.
   2. The whole site reads as the same book: page-to-page navigation turns a page (view transitions), a running head
      and folio under the header (not on the home page: a chapter opening has none), a berry ribbon on the current
      menu link, paper grain, gold rules under section headings, an ink-settle reveal and a colophon at the foot.
      All built here, so with JavaScript off nothing changes.
   Plain ES5, no library. */
(function () {
  "use strict";
  var d = document.documentElement;
  var C = window.PL_CONCEPT;
  if (!C || C.name !== "book") return;
  var BASE = C.base || "";
  var q = location.search;
  var reduceMq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }

  /* ---------- should the welcome run? (the same rules as js/intro.js, with our own key) ---------- */
  var KEY = "pl-book-intro";
  var force = /[?&]intro=1\b/.test(q);
  var seen = false, framed = true, homePath = null;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked: show it */ }
  try { framed = window.top !== window.self; } catch (e) { /* a cross-origin parent: framed */ }
  try { homePath = new URL(BASE, location.href).pathname; } catch (e) { homePath = null; }
  var bot = navigator.webdriver || /bot|crawl|spider|slurp|facebookexternalhit|lighthouse/i.test(navigator.userAgent);
  var isHome = homePath !== null && location.pathname.replace(/index\.html$/, "") === homePath;
  var introPlanned = isHome && !(/[?&]nointro\b/.test(q) || location.hash || reduced() || (!force && (seen || bot || framed)));
  if (introPlanned) {
    d.classList.add("c-book-intro");   /* css/c-book.css: a walnut curtain until the table is built, the page held back */
    try { history.scrollRestoration = "manual"; } catch (e) { /* old browsers */ }
  }

  /* ---------- page to page: the old page turns away around its left edge (back/forward: the page turns back) ---------- */
  window.addEventListener("pagereveal", function (e) {
    var vt = e.viewTransition;
    if (!vt) return;
    if (introPlanned || reduced()) { try { vt.skipTransition(); } catch (x) { /* fine */ } return; }
    var back = false;
    try {
      var act = window.navigation && navigation.activation;
      if (act && act.navigationType === "traverse") back = !(act.entry && act.from) || act.entry.index < act.from.index;
    } catch (x) { back = false; }
    if (back) d.classList.add("c-book-back");
    /* one plain layer that turns with the page and carries its shading (see css: ::view-transition-new(c-book-leaf)) */
    var leaf = document.createElement("div");
    leaf.className = "c-book-vtl";
    leaf.setAttribute("aria-hidden", "true");
    d.appendChild(leaf);
    var clean = function () { d.classList.remove("c-book-back"); if (leaf.parentNode) leaf.parentNode.removeChild(leaf); };
    try { vt.finished.then(clean, clean); } catch (x) { setTimeout(clean, 700); }
  });

  /* ================================================================================================================
     The whole site: running head + folio, ribbon on the current link, gold rules under headings
     ================================================================================================================ */
  var ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  function sitewide() {
    try {
      var header = document.querySelector(".site-header");
      var nav = document.querySelector(".main-nav");
      var links = nav ? nav.querySelectorAll("a") : [];
      var current = null, idx = -1, i;
      for (i = 0; i < links.length; i++) { if (links[i].hasAttribute("aria-current")) { current = links[i]; idx = i; break; } }

      /* the running head: the page's own name, from its <title>. Not on the home page: like a chapter-opening page in a
         printed book it has none (and the hero's buttons stay where they were, above the fold on a laptop) */
      var label = isHome ? "" : (document.title || "").split(" — ")[0].replace(/^\s+|\s+$/g, "");
      if (!isHome && (/product\.html$/.test(location.pathname) || label.length > 26)) label = current ? current.textContent : "Shop";
      if (header && label) {
        var rh = document.createElement("div");
        rh.className = "c-book-rh";
        rh.setAttribute("aria-hidden", "true");
        rh.innerHTML = '<div class="c-book-rh-in"><span class="c-book-rh-l">Purrlight Studio</span>' +
          '<span class="c-book-rh-orn"></span><span class="c-book-rh-r"></span></div>';
        var right = rh.querySelector(".c-book-rh-r");
        right.appendChild(document.createTextNode(label));
        if (idx > -1 && ROMAN[idx]) {
          var folio = document.createElement("span");
          folio.className = "c-book-folio";
          folio.textContent = ROMAN[idx];
          right.appendChild(folio);
        }
        header.parentNode.insertBefore(rh, header.nextSibling);
      }

      /* the berry ribbon hangs from the top of the header down to the current link (bar) or sits at the row's end (drawer) */
      if (nav && header) {
        var place = function () {
          var drawer = getComputedStyle(nav).position === "fixed";
          d.setAttribute("data-c-book-nav", drawer ? "drawer" : "bar");
          var a = nav.querySelector("a[aria-current]") || links[0];
          if (!drawer && a) {
            var top = a.getBoundingClientRect().top - header.getBoundingClientRect().top;
            nav.style.setProperty("--c-book-rib", Math.max(8, Math.round(top)) + "px");
          }
        };
        place();
        var raf = 0;
        window.addEventListener("resize", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(place, function () {});
      }

      /* a thin gold rule draws in under each section heading as it comes into view */
      var hs = document.querySelectorAll("main h2");
      var list = [];
      for (i = 0; i < hs.length; i++) {
        var h = hs[i];
        if (h.closest(".product-card, .visually-hidden, .sr-only, [hidden], .trust-bar") || h.classList.contains("sr-only") || h.classList.contains("visually-hidden")) continue;
        h.classList.add("c-book-h");
        if (getComputedStyle(h).textAlign === "center") h.classList.add("c-book-h-c");
        list.push(h);
      }
      if ("IntersectionObserver" in window && list.length) {
        d.classList.add("c-book-rules");
        var io = new IntersectionObserver(function (en) {
          en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("c-book-h-in"); io.unobserve(x.target); } });
        }, { threshold: 0.6 });
        list.forEach(function (h2) { io.observe(h2); });
      }
    } catch (err) { /* the book dressing is optional; the shop never depends on it */ }
  }
  onReady(sitewide);

  if (!introPlanned) return;

  /* ================================================================================================================
     The welcome
     ================================================================================================================ */
  var CAPS = [[0.6, 3.5, "Christmas is coming very close now."], [3.5, 6.6, "Wishing you a very peaceful holiday season,"], [6.6, 9.2, "warmth with your family and loved ones."]];
  var ov, video, capEl, soundBtn, inerted = [], timers = [], done = false, started = 0, holding = false, step = 0, videoFailed = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { while (timers.length) clearTimeout(timers.pop()); }
  function remember() { try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* fine */ } }
  function A(p) { return BASE + p; }

  function stopVideo() {
    if (!video) return;
    try {
      video.pause();
      while (video.firstChild) video.removeChild(video.firstChild);
      video.removeAttribute("src");
      video.load();
    } catch (e) { /* fine */ }
    video = null;
  }

  function finish() {
    if (done) return;
    done = true;
    remember();
    clearTimers();
    stopVideo();
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
    inerted.forEach(function (n) { n.removeAttribute("inert"); });
    d.classList.remove("c-book-intro", "c-book-built", "c-book-reveal");
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVis);
    if (reduceMq) {
      if (reduceMq.removeEventListener) reduceMq.removeEventListener("change", onReduce);
      else if (reduceMq.removeListener) reduceMq.removeListener(onReduce);
    }
    try { history.scrollRestoration = "auto"; } catch (e) { /* old browsers */ }
  }
  function onKey(e) { if (e.key === "Escape" || e.key === "Esc") finish(); }
  function onVis() { if (document.hidden && started) finish(); }   /* back from another tab: straight to the shop */
  function onReduce() { if (reduceMq.matches) finish(); }

  /* the last beat: the chapter-one page comes forward and the real home page settles in under it */
  function zoom() {
    step = 3;
    ov.classList.add("is-zoom");
    later(function () {
      ov.classList.add("is-fade");
      d.classList.add("c-book-reveal");
    }, 220);   /* the dissolve starts as the words go, so there is no blank-paper pause */
    later(stopVideo, 300);
    later(finish, 760);
  }
  function turn() {
    if (step >= 2) return;
    step = 2;
    holding = false;
    ov.classList.add("is-turn");
    later(zoom, 900);
  }
  /* a tap anywhere once it has started: straight to the end */
  function fastForward() {
    if (done || step >= 4) return;
    step = 4;
    clearTimers();
    ov.classList.add("is-ff", "is-fade");
    d.classList.add("c-book-reveal");
    later(finish, 380);
  }

  function open() {
    if (started || done) return;
    started = Date.now();
    step = 1;
    remember();
    ov.classList.add("is-open");
    try { ov.focus({ preventScroll: true }); } catch (e) { ov.focus(); }
    if (video && videoFailed) photoInstead();
    else if (video) {
      try { video.currentTime = 0; } catch (e) { /* not loaded yet */ }
      var p = video.play();
      if (p && p.then) p.then(function () { if (soundBtn && video) soundBtn.hidden = false; }, photoInstead);
      else if (soundBtn) soundBtn.hidden = false;
      /* still nothing to show after a moment (no source, a slow line): the photo instead */
      later(function () { if (video && (video.paused || video.readyState < 2)) photoInstead(); }, 1300);
    }
    later(function () { ov.classList.add("is-spread"); }, 900);
    later(function () { if (!holding) turn(); }, 2250);
  }

  function photoInstead() {   /* the video cannot play: the real Merlin photo, and his line from the home page */
    if (!video || !video.parentNode) return;
    var img = document.createElement("img");
    img.src = A("assets/img/home/about-merlin-studio-720.webp");
    img.alt = "";
    img.width = 720; img.height = 336;
    video.parentNode.replaceChild(img, video);
    video = null;
    if (soundBtn) soundBtn.hidden = true;
    if (capEl) capEl.textContent = "the real Merlin";
  }

  function onSound(e) {
    e.stopPropagation();
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      /* a visitor who asks for his voice hears the whole greeting: the page waits for it (a tap still moves on) */
      if (step < 2) {
        holding = true;
        clearTimers();
        later(function () { ov.classList.add("is-spread"); }, 0);
        if (video.currentTime > 0.5 || video.ended) { try { video.currentTime = 0; } catch (x) { /* fine */ } }
        var pp = video.play();
        if (pp && pp.catch) pp.catch(function () {});
        later(function () { if (holding) turn(); }, 11500);   /* safety net if "ended" never comes */
      }
    } else {
      video.muted = true;
    }
    soundBtn.setAttribute("aria-pressed", video.muted ? "false" : "true");
    soundBtn.lastChild.textContent = video.muted ? "Sound on" : "Sound off";
  }

  function caption() {
    if (!video || !capEl) return;
    var t = video.currentTime, s = "";
    for (var i = 0; i < CAPS.length; i++) { if (t >= CAPS[i][0] && t < CAPS[i][1]) { s = CAPS[i][2]; break; } }
    if (capEl.textContent !== s) capEl.textContent = s;
  }

  /* ---------- drawings (code-made: book, cup, yarn, ribbon, tiles; never a cat) ---------- */
  var SVG_DEFS =
    '<svg class="c-book-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="c-book-gold" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#8C6526"/><stop offset=".28" stop-color="#F1D894"/><stop offset=".5" stop-color="#B98A3E"/>' +
        '<stop offset=".74" stop-color="#EBCB80"/><stop offset="1" stop-color="#8C6526"/></linearGradient>' +
      '<filter id="c-book-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="c-book-blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
      /* an Art Nouveau corner: two whiplash curves, a curl and a bud (stroke and colour come from each <use>) */
      '<symbol id="c-book-orn" viewBox="0 0 60 60">' +
        '<path fill="none" d="M4 56C4 27 27 4 56 4"/>' +
        '<path fill="none" d="M12 46C12 26 26 12 46 12"/>' +
        '<path fill="none" d="M20 36c0-9 7-16 16-16c5 0 8 4 5 8c-2 3-7 2-6-2"/>' +
        '<path fill="none" d="M12 46c4-3 8-3 11 0M46 12c-3 4-3 8 0 11"/>' +
        '<path fill="currentColor" stroke="none" d="M7 7c6 0 10 4 10 10c-6 0-10-4-10-10z"/>' +
      '</symbol>' +
      '<symbol id="c-book-fleuron" viewBox="0 0 64 24">' +
        '<path fill="currentColor" stroke="none" d="M32 21c-6-2-10-6-10-10c0-3 2-5 5-5c2 0 4 1 5 4c1-3 3-4 5-4c3 0 5 2 5 5c0 4-4 8-10 10z"/>' +
        '<path fill="none" d="M2 12h15M47 12h15M17 12c2-3 4-3 5-1M47 12c-2-3-4-3-5-1"/>' +
      '</symbol>' +
    '</defs></svg>';

  function corner(cls) {
    return '<svg class="c-book-corner ' + cls + '" viewBox="0 0 60 60" aria-hidden="true" focusable="false">' +
      '<use href="#c-book-orn" stroke="#1A2A23" color="#1A2A23" stroke-width="1.9" opacity=".7" transform="translate(.7 1)"/>' +
      '<use href="#c-book-orn" stroke="url(#c-book-gold)" color="#DDBB72" stroke-width="1.6"/></svg>';
  }
  function fleuron(color) {
    return '<svg class="c-book-fl" viewBox="0 0 64 24" aria-hidden="true" focusable="false">' +
      '<use href="#c-book-fleuron" stroke="' + color + '" color="' + color + '" stroke-width="1.2"/></svg>';
  }

  var TEACUP =
    '<svg class="c-book-cup" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs>' +
      '<radialGradient id="c-book-porc" cx=".42" cy=".36" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3F0E8"/><stop offset="1" stop-color="#D4CDBF"/></radialGradient>' +
      '<linearGradient id="c-book-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#EDE8DE"/><stop offset="1" stop-color="#BDB4A4"/></linearGradient>' +
      '<radialGradient id="c-book-tea" cx=".44" cy=".38" r=".72"><stop offset="0" stop-color="#C98A45"/><stop offset=".5" stop-color="#94541F"/><stop offset="1" stop-color="#57300F"/></radialGradient>' +
      '<radialGradient id="c-book-wall" cx=".5" cy=".64" r=".6"><stop offset=".7" stop-color="#FBF9F4"/><stop offset="1" stop-color="#CBC2B2"/></radialGradient>' +
    '</defs>' +
      '<ellipse cx="108" cy="118" rx="80" ry="76" fill="#0C0602" opacity=".6" filter="url(#c-book-blur)"/>' +
      '<circle cx="100" cy="104" r="80" fill="url(#c-book-porc)"/>' +
      '<circle cx="100" cy="104" r="78.5" fill="none" stroke="#FFFFFF" stroke-width="1.4" opacity=".8"/>' +
      '<circle cx="100" cy="104" r="71" fill="none" stroke="#2C4A8A" stroke-width="2.2"/>' +
      '<circle cx="100" cy="104" r="66.6" fill="none" stroke="#2C4A8A" stroke-width="4.6" stroke-dasharray="1.6 3.6" opacity=".85"/>' +
      '<circle cx="100" cy="104" r="62.4" fill="none" stroke="#2C4A8A" stroke-width="1"/>' +
      '<ellipse cx="106" cy="114" rx="47" ry="45" fill="#2A1A0C" opacity=".35" filter="url(#c-book-blur2)"/>' +
      '<path d="M140 98c24-8 33 22 9 28" fill="none" stroke="#CFC8BA" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M140 98c24-8 33 22 9 28" fill="none" stroke="#FBFAF6" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="100" cy="104" r="43" fill="url(#c-book-body)"/>' +
      '<circle cx="100" cy="104" r="39.5" fill="none" stroke="#2C4A8A" stroke-width="2.4" opacity=".9"/>' +
      '<circle cx="100" cy="96" r="45" fill="url(#c-book-wall)"/>' +
      '<circle cx="100" cy="96" r="44.4" fill="none" stroke="#2C4A8A" stroke-width="1.8"/>' +
      '<circle cx="100" cy="96" r="41" fill="none" stroke="#2C4A8A" stroke-width=".8" opacity=".7"/>' +
      '<circle cx="100" cy="100" r="34.5" fill="url(#c-book-tea)"/>' +
      '<ellipse cx="89" cy="88" rx="12" ry="5.5" fill="#FFE9C8" opacity=".45" transform="rotate(-26 89 88)"/>' +
      '<path d="M66 80a40 40 0 0 1 28-25" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" opacity=".95"/>' +
    '</svg>';

  var STEAM = '<div class="c-book-steam" aria-hidden="true"><i></i><i></i><i></i></div>';

  var QUILT =
    '<svg class="c-book-quilt" viewBox="-6 -6 132 132" aria-hidden="true" focusable="false">' +
      '<rect x="6" y="9" width="112" height="112" rx="4" fill="#0A0502" opacity=".55" filter="url(#c-book-blur)"/>' +
      '<rect x="2" y="2" width="112" height="112" rx="3" fill="#EDE0C6"/>' +
      '<rect x="30" y="30" width="56" height="56" fill="#93382E"/>' +
      '<path fill="#33456A" d="M30 30L2 2h28zM86 30L114 2h-28zM30 86L2 114h28zM86 86L114 114h-28z"/>' +
      '<path fill="#93382E" d="M30 2l14 28h-14zM86 2l-14 28h14zM30 114l14-28h-14zM86 114l-14-28h14zM2 30l28 14v-14zM2 86l28-14v14zM114 30l-28 14v-14zM114 86l-28-14v14z"/>' +
      '<rect x="44" y="44" width="28" height="28" fill="#EDE0C6"/>' +
      '<path d="M58 48.5l2.6 5.4l5.9 .8l-4.3 4.1l1 5.9l-5.2-2.8l-5.2 2.8l1-5.9l-4.3-4.1l5.9-.8z" fill="#33456A"/>' +
      '<rect x="7" y="7" width="102" height="102" rx="2" fill="none" stroke="#FBF3E2" stroke-width="1.1" stroke-dasharray="3 2.6" opacity=".85"/>' +
      '<rect x="30" y="30" width="56" height="56" fill="none" stroke="#FBF3E2" stroke-width=".9" stroke-dasharray="2.4 2.4" opacity=".7"/>' +
      '<rect x="2" y="2" width="112" height="112" rx="3" fill="none" stroke="#C9B68F" stroke-width="1.2"/>' +
    '</svg>';

  var YARN =
    '<svg class="c-book-yarn" viewBox="0 0 240 200" aria-hidden="true" focusable="false"><defs>' +
      '<radialGradient id="c-book-ball" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFD9BA"/><stop offset=".45" stop-color="#E8A479"/><stop offset="1" stop-color="#8E5030"/></radialGradient>' +
      '<linearGradient id="c-book-hook" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBD3A2"/><stop offset=".5" stop-color="#B98A4A"/><stop offset="1" stop-color="#755024"/></linearGradient>' +
    '</defs>' +
      '<ellipse cx="94" cy="114" rx="62" ry="58" fill="#0A0502" opacity=".6" filter="url(#c-book-blur)"/>' +
      '<path d="M124 96C160 62 178 96 214 40S250 2 262 -18" fill="none" stroke="#0A0502" stroke-width="4" opacity=".45" filter="url(#c-book-blur2)"/>' +
      '<path d="M120 90C156 56 174 90 210 34S246 -4 258 -24" fill="none" stroke="#D08E62" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle cx="84" cy="100" r="60" fill="url(#c-book-ball)"/>' +
      '<g fill="none" stroke="#A9623B" stroke-width="2.1" stroke-linecap="round" opacity=".5">' +
        '<path d="M28 80c30 28 72 38 114 26"/><path d="M27 100c34 22 78 26 115 10"/><path d="M38 126c32 14 64 14 96 0"/>' +
        '<path d="M58 44c-8 34 0 76 30 112"/><path d="M84 40c-10 36-6 78 22 114"/><path d="M110 46c-6 30-2 66 18 96"/>' +
      '</g>' +
      '<g fill="none" stroke="#FFE8D4" stroke-width="1.5" stroke-linecap="round" opacity=".7">' +
        '<path d="M44 66c20 18 46 24 74 18"/><path d="M68 46c-6 22-2 44 12 66"/><path d="M40 86c18 12 36 16 56 14"/>' +
      '</g>' +
      '<g transform="rotate(-26 128 158)">' +
        '<rect x="48" y="160" width="176" height="7" rx="3.5" fill="#0A0502" opacity=".5" filter="url(#c-book-blur2)"/>' +
        '<rect x="44" y="154" width="176" height="7" rx="3.5" fill="url(#c-book-hook)"/>' +
        '<rect x="116" y="152.5" width="30" height="10" rx="2" fill="#7E5A2E"/>' +
        '<path d="M44 157.5c-6 0-8-5-3-7" fill="none" stroke="#B98A4A" stroke-width="4" stroke-linecap="round"/>' +
      '</g>' +
    '</svg>';

  var RIBBON =
    '<svg class="c-book-ribbon" viewBox="0 0 70 130" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="c-book-silk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#76122D"/><stop offset=".36" stop-color="#C2405F"/><stop offset=".52" stop-color="#E07C93"/><stop offset=".7" stop-color="#B42249"/><stop offset="1" stop-color="#650F26"/></linearGradient>' +
    '</defs>' +
      '<path d="M16 0h16c2 30 8 52 20 78l-3 34l-12-14l-14 10c-6-36-8-70-7-108z" fill="#080402" opacity=".55" filter="url(#c-book-blur2)" transform="translate(4 5)"/>' +
      '<path d="M16 0h16c2 30 8 52 20 78l-3 34l-12-14l-14 10c-6-36-8-70-7-108z" fill="url(#c-book-silk)"/>' +
    '</svg>';

  var NIB =
    '<svg class="c-book-nib" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M20 3l9 15c2 4 1 8-2 11l-7 8l-7-8c-3-3-4-7-2-11z" fill="none" stroke="#7A5A3A" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 16v18" stroke="#7A5A3A" stroke-width="1.3"/><circle cx="20" cy="16" r="2.2" fill="#7A5A3A"/></svg>';

  function build() {
    if (done) return;
    try {
      var mobile = window.matchMedia && matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
      ov = document.createElement("div");
      ov.className = "c-book-ov" + (mobile ? " is-phone" : "");
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-labelledby", "c-book-line");
      ov.tabIndex = -1;   /* focus goes into the dialog without a ring on the table */
      ov.innerHTML = SVG_DEFS +
        '<div class="c-book-table" aria-hidden="true"><i class="c-book-grain"></i><i class="c-book-pool"></i><i class="c-book-vig"></i></div>' +
        '<div class="c-book-stage" aria-hidden="true"><div class="c-book-cam"><div class="c-book-world">' +
          '<div class="c-book-prop c-book-p-quilt">' + QUILT + '</div>' +
          '<div class="c-book-prop c-book-p-cup">' + TEACUP + STEAM + '</div>' +
          '<div class="c-book-prop c-book-p-yarn">' + YARN + '</div>' +
          '<div class="c-book-prop c-book-p-ribbon">' + RIBBON + '</div>' +
          '<div class="c-book-book">' +
            '<i class="c-book-shadow"></i><i class="c-book-shadow c-book-shadow-l"></i>' +
            '<div class="c-book-block"><i class="c-book-tail"></i><i class="c-book-fore"></i></div>' +
            /* page 3 in the book: the chapter-one title page, under the leaf */
            '<div class="c-book-page c-book-p2"><div class="c-book-p2-in">' +
              fleuron("#B08440") +
              '<p class="c-book-ch">✦ chapter one</p>' +
              '<i class="c-book-rule"></i>' +
              '<p class="c-book-h1">Heirloom crochet dolls &amp; <em>keepsakes.</em></p>' +
              '<p class="c-book-folio-p">i</p>' +
            '</div><i class="c-book-cast"></i></div>' +
            /* the leaf: the living photograph on its front, its back with a faint show-through */
            '<div class="c-book-leaf">' +
              '<div class="c-book-face c-book-page c-book-p1"><div class="c-book-p1-in">' +
                '<div class="c-book-ph-head"><p class="c-book-plate-s">the cat who takes notes</p></div>' +
                '<figure class="c-book-photo"><div class="c-book-photo-in">' +
                  '<video muted playsinline preload="auto" disablepictureinpicture aria-hidden="true" poster="' + A("assets/img/home/about-merlin-studio-720.webp") + '">' +
                    '<source src="' + A("assets/video/hero-merlin-voice-phone-640.webm") + '" type="video/webm">' +
                    '<source src="' + A("assets/video/hero-merlin-voice-phone-640.mp4") + '" type="video/mp4">' +
                  '</video></div>' +
                  '<i class="c-book-pc c-book-pc-tl"></i><i class="c-book-pc c-book-pc-tr"></i><i class="c-book-pc c-book-pc-bl"></i><i class="c-book-pc c-book-pc-br"></i>' +
                '</figure>' +
                '<p class="c-book-cap"></p>' +
              '</div><i class="c-book-lift"></i><i class="c-book-turnshade"></i></div>' +
              '<div class="c-book-face c-book-page c-book-verso"><i class="c-book-through"></i><i class="c-book-turnshade"></i></div>' +
            '</div>' +
            /* the cover: cloth front, gach bong endpaper with the bookplate inside, and its own thickness */
            '<div class="c-book-cover">' +
              '<div class="c-book-face c-book-front">' +
                '<i class="c-book-cloth"></i><i class="c-book-joint"></i>' +
                '<i class="c-book-frame c-book-frame-o"></i><i class="c-book-frame c-book-frame-i"></i>' +
                corner("c-tl") + corner("c-tr") + corner("c-bl") + corner("c-br") +
                '<p class="c-book-title"><span class="c-book-title-s">From</span><span>Merlin’s</span><span>Notebook</span></p>' +
                '<div class="c-book-label"><img src="' + A("assets/brand/logo-flat.png") + '" alt="" width="360" height="119"></div>' +
                '<p class="c-book-motto"><span>Made by hand.</span><span>Made to be kept.</span></p>' +
                '<i class="c-book-coverlight"></i>' +
              '</div>' +
              '<div class="c-book-face c-book-endpaper">' +
                '<div class="c-book-plate">' + NIB +
                  '<p class="c-book-plate-t">From Merlin’s notebook</p>' +
                  fleuron("#9C7A4E") +
                  '<p class="c-book-plate-s">the cat who takes notes</p>' +
                '</div><i class="c-book-endshade"></i>' +
              '</div>' +
              '<i class="c-book-cedge c-book-cedge-fore"></i><i class="c-book-cedge c-book-cedge-tail"></i>' +
            '</div>' +
          '</div>' +
        '</div></div></div>' +
        '<p class="c-book-line" id="c-book-line">Sketched by Merlin,<br> <em>stitched by us.</em></p>' +
        '<button class="c-book-open" type="button">Open the book</button>' +
        '<button class="c-book-sound" type="button" aria-pressed="false" hidden>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          '<span>Sound on</span></button>' +
        '<button class="c-book-skip" type="button">Skip intro</button>';

      document.body.insertBefore(ov, document.body.firstChild);
      d.classList.add("c-book-built");
      [].forEach.call(document.body.children, function (n) {
        if (n !== ov && n.tagName !== "SCRIPT" && !n.hasAttribute("inert")) { n.setAttribute("inert", ""); inerted.push(n); }
      });

      video = ov.querySelector("video");
      capEl = ov.querySelector(".c-book-cap");
      soundBtn = ov.querySelector(".c-book-sound");
      video.muted = true;
      video.addEventListener("timeupdate", caption);
      video.addEventListener("ended", function () { if (holding) turn(); });
      var srcs = video.querySelectorAll("source");
      var failed = function () { videoFailed = true; if (started) photoInstead(); };
      if (srcs.length) srcs[srcs.length - 1].addEventListener("error", failed);
      video.addEventListener("error", failed);

      ov.querySelector(".c-book-open").addEventListener("click", function (e) { e.stopPropagation(); open(); });
      ov.querySelector(".c-book-book").addEventListener("click", function (e) { if (!started) { e.stopPropagation(); open(); } });
      ov.querySelector(".c-book-skip").addEventListener("click", function (e) { e.stopPropagation(); finish(); });
      soundBtn.addEventListener("click", onSound);
      ov.addEventListener("click", function () { if (started && Date.now() - started > 250) fastForward(); });
      document.addEventListener("keydown", onKey);
      document.addEventListener("visibilitychange", onVis);
      if (reduceMq) {
        if (reduceMq.addEventListener) reduceMq.addEventListener("change", onReduce);
        else if (reduceMq.addListener) reduceMq.addListener(onReduce);
      }
      try { ov.focus({ preventScroll: true }); } catch (e) { ov.focus(); }
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (ov) ov.classList.add("is-in"); }); });
    } catch (err) {
      finish();   /* never let the welcome block the shop */
    }
  }
  onReady(build);
})();
