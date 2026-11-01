/* PREVIEW 01/11 — Direction 3, "Merlin's house" (js/concept-boot.js loads this with ?concept=house; never shipped).
   1. The welcome (home page only, once per tab): at dusk, a narrow three-storey shophouse (nha pho: an ochre French-
      colonial facade, jade louvered shutters, wrought-iron balcony, berry-and-cream awning, a silk lantern, "Purrlight
      Studio" in gold on the parapet). Its windows light up from the street to the roof: the gift shop window with three
      of Elise's real pieces, the studio upstairs (her real worktable photo), and Merlin's reading room at the top (the
      real Merlin, a blue-and-white teacup and a stack of books on the sill). "Step inside" (or a tap on the house)
      flies the camera in to the shop door, the door opens and the real home page comes forward: about 3.2 s after the
      tap; a tap anywhere fast-forwards, "Skip intro" and Esc end it at once. Never with reduced motion (also when
      switched on mid-way), ?nointro or a #link, and - unless ?intro=1 - not inside a frame, for automated browsers or
      on a second visit in the tab. Merlin is only ever Elise's real photo; nothing here draws a cat.
   2. The whole site is the same house: a small Art-Deco floor dial in the header (G the gift shop = Shop and product
      pages, 1 the studio = Custom Orders, 2 the tea room = Our Story, the street = home, no needle elsewhere), page-to-
      page navigation rides up or down like a lift (the old floor slides away, the new one arrives; same floor = a soft
      cross-fade; from the street = stepping in), and a thin trim under the header per floor (awning, measuring tape,
      wallpaper). All built here, so with JavaScript off nothing changes.
   Plain ES5, no library. */
(function () {
  "use strict";
  var d = document.documentElement;
  var C = window.PL_CONCEPT;
  if (!C || C.name !== "house") return;
  var BASE = C.base || "";
  var q = location.search;
  var reduceMq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  function read(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* storage blocked: fine */ } }

  /* ---------- which floor of the house is this page? ---------- */
  var homePath = null;
  try { homePath = new URL(BASE, location.href).pathname; } catch (e) { homePath = null; }
  var path = location.pathname;
  var rel = homePath !== null && path.indexOf(homePath) === 0 ? path.slice(homePath.length) : null;
  function floorOf(r) {
    if (r === null) return "none";
    if (r === "" || r === "index.html") return "street";
    if (r === "shop.html" || r === "product.html") return "G";
    if (/^custom-orders(\/|$)/.test(r)) return "1";
    if (r === "about.html") return "2";
    return "none";
  }
  var FLOOR = floorOf(rel);
  d.setAttribute("data-house-floor", FLOOR);
  var FKEY = "pl-house-floor";
  var prevFloor = read(FKEY);
  store(FKEY, FLOOR);

  /* ---------- should the welcome run? (the same rules as js/intro.js, with our own key) ---------- */
  var KEY = "pl-house-intro";
  var force = /[?&]intro=1\b/.test(q);
  var seen = read(KEY) === "1", framed = true;
  try { framed = window.top !== window.self; } catch (e) { /* a cross-origin parent: framed */ }
  var bot = navigator.webdriver || /bot|crawl|spider|slurp|facebookexternalhit|lighthouse/i.test(navigator.userAgent);
  var isHome = homePath !== null && path.replace(/index\.html$/, "") === homePath;
  var introPlanned = isHome && !(/[?&]nointro\b/.test(q) || location.hash || reduced() || (!force && (seen || bot || framed)));
  if (introPlanned) {
    d.classList.add("c-house-intro");   /* css/c-house.css: a dusk curtain until the street is built, the page held back */
    try { history.scrollRestoration = "manual"; } catch (e) { /* old browsers */ }
  }

  /* ---------- page to page: like a lift between the floors (css: html.c-house-vt-*) ---------- */
  var LEVEL = { street: -1, G: 0, "1": 1, "2": 2 };
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function moveType(from, to) {
    if (!from || from === to || !has(LEVEL, from) || !has(LEVEL, to)) return "same";
    if (LEVEL[from] === -1) return "in";    /* from the street, through the shop door */
    if (LEVEL[to] === -1) return "out";     /* back out onto the street */
    return LEVEL[to] > LEVEL[from] ? "up" : "down";
  }
  var firstReveal = true;
  window.addEventListener("pagereveal", function (e) {
    var from = firstReveal ? prevFloor : read(FKEY);   /* a later reveal = back/forward from the cache */
    firstReveal = false;
    store(FKEY, FLOOR);
    var vt = e.viewTransition;
    if (!vt) return;
    if (introPlanned || reduced()) { try { vt.skipTransition(); } catch (x) { /* fine */ } return; }
    var t = moveType(from, FLOOR), cls = "c-house-vt-" + t;
    d.classList.add(cls);
    try { if (vt.types) vt.types.add("house-" + t); } catch (x) { /* fine */ }
    var clean = function () { d.classList.remove(cls); };
    try { vt.finished.then(clean, clean); } catch (x) { setTimeout(clean, 900); }
  });

  /* ---------- the floor dial in the header ---------- */
  var ANGLE = { street: -90, G: -45, "1": 0, "2": 45 };
  var NAME = { G: "the gift shop", "1": "the studio", "2": "the tea room" };
  var needle = null;
  function swing(from) {
    if (!needle) return;
    var to = ANGLE[FLOOR];
    var start = from && has(ANGLE, from) && !reduced() ? ANGLE[from] : to;
    needle.style.transition = "none";
    needle.style.transform = "rotate(" + start + "deg)";
    if (start === to) return;
    void needle.offsetWidth;
    setTimeout(function () { needle.style.transition = ""; needle.style.transform = "rotate(" + to + "deg)"; }, 140);
  }
  function buildLift() {
    var row = document.querySelector(".site-header .header-inner");
    if (!row || row.querySelector(".c-house-lift")) return;
    var lift = document.createElement("span");
    lift.className = "c-house-lift";
    lift.setAttribute("aria-hidden", "true");
    lift.innerHTML =
      '<span class="c-house-dial">' +
        '<i class="c-house-dial-face"></i>' +
        '<i class="c-house-dial-dot" style="--a:-90deg"></i>' +
        '<b style="--a:-45deg">G</b><b style="--a:0deg">1</b><b style="--a:45deg">2</b>' +
        (has(ANGLE, FLOOR) ? '<i class="c-house-needle"></i>' : '') +
        '<i class="c-house-hub"></i>' +
      '</span>' +
      (NAME[FLOOR] ? '<span class="c-house-fname">' + NAME[FLOOR] + '</span>' : '');
    row.insertBefore(lift, row.querySelector(".header-cta") || row.querySelector(".nav-toggle"));
    needle = lift.querySelector(".c-house-needle");
    /* the one-row header on wide screens has no room: there the dial hangs just under it, a small brass plate */
    var fit = function () {
      lift.classList.remove("c-house-hang");
      if (row.scrollWidth > row.clientWidth + 1) lift.classList.add("c-house-hang");
    };
    fit();
    var t = 0;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(fit, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit, function () { /* fine */ });
    swing(prevFloor);
  }
  window.addEventListener("pageshow", function (e) { if (e.persisted && needle) swing(read(FKEY)); });

  /* ================================================================================================================
     The welcome: the shophouse at dusk
     ================================================================================================================ */
  var IMG = BASE + "assets/img/";
  function img(src, cls, pos) {
    return '<img class="' + cls + '" src="' + IMG + src + '" alt="" decoding="async"' + (pos ? ' style="object-position:' + pos + '"' : '') + '>';
  }
  /* shared gradients and the wrought-iron bay pattern, referenced by the small drawings below */
  var DEFS =
    '<svg class="c-house-defs" width="0" height="0" focusable="false"><defs>' +
      '<linearGradient id="chs-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E9B6"/><stop offset=".46" stop-color="#D6A649"/><stop offset=".56" stop-color="#9C6B22"/><stop offset="1" stop-color="#EBCB7E"/></linearGradient>' +
      '<linearGradient id="chs-goldh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9C6B22"/><stop offset=".3" stop-color="#F3DB98"/><stop offset=".6" stop-color="#C9963E"/><stop offset="1" stop-color="#8A5C1C"/></linearGradient>' +
      '<linearGradient id="chs-stuc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A88458"/><stop offset="1" stop-color="#7C5E40"/></linearGradient>' +
      '<linearGradient id="chs-por" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CFC8BA"/><stop offset=".38" stop-color="#FFFDF7"/><stop offset=".7" stop-color="#ECE6DA"/><stop offset="1" stop-color="#A9A194"/></linearGradient>' +
      '<radialGradient id="chs-silk" cx=".42" cy=".42" r=".62"><stop offset="0" stop-color="#FFD39A"/><stop offset=".35" stop-color="#F06A4A"/><stop offset=".78" stop-color="#B42249"/><stop offset="1" stop-color="#6E1230"/></radialGradient>' +
      '<radialGradient id="chs-lampglass" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".55" stop-color="#F7C987"/><stop offset="1" stop-color="#C97E45"/></radialGradient>' +
      '<linearGradient id="chs-terra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A3A20"/><stop offset=".35" stop-color="#B8663D"/><stop offset=".6" stop-color="#A4542F"/><stop offset="1" stop-color="#5E2B17"/></linearGradient>' +
      '<radialGradient id="chs-leaf" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#6F8F5E"/><stop offset=".6" stop-color="#3E5B38"/><stop offset="1" stop-color="#22351F"/></radialGradient>' +
      '<pattern id="chs-rail" width="24.5" height="40" patternUnits="userSpaceOnUse">' +
        '<g fill="none" stroke="#1C1816" stroke-width="1.35" stroke-linecap="round">' +
          '<path d="M.6 0V40M12.25 14V26"/>' +
          '<path d="M12.25 4C5 4 4 14 9.5 14C12 14 12 10.6 9.8 10.6M12.25 4C19.5 4 20.5 14 15 14C12.5 14 12.5 10.6 14.7 10.6"/>' +
          '<path d="M12.25 36C5 36 4 26 9.5 26C12 26 12 29.4 9.8 29.4M12.25 36C19.5 36 20.5 26 15 26C12.5 26 12.5 29.4 14.7 29.4"/>' +
        '</g><circle cx="12.25" cy="20" r="2.1" fill="#1C1816"/>' +
      '</pattern>' +
    '</defs></svg>';

  var PARAPET =
    '<svg class="c-house-parapet" viewBox="0 0 360 92" preserveAspectRatio="none">' +
      '<defs><pattern id="chs-bal" x="27" y="46" width="8.5" height="28" patternUnits="userSpaceOnUse">' +
        '<path d="M1.6 0h5.3v2.6c-1.5 1-1.5 2.8 0 3.9c1.9 1.6 2.1 6 .1 9.4c-1 1.7-1 3.7 0 5.2c.7 1.2.7 2.8 0 4v3H1.6v-3c-.7-1.2-.7-2.8 0-4c1-1.5 1-3.5 0-5.2c-2-3.4-1.8-7.8.1-9.4c1.5-1.1 1.5-2.9 0-3.9z" fill="url(#chs-stuc)"/>' +
        '<path d="M2.4 3.2c-1 1-.9 2.2.3 3.2c1.6 1.4 1.7 5.6-.1 8.8" fill="none" stroke="#E7C892" stroke-opacity=".35" stroke-width=".8"/>' +
      '</pattern></defs>' +
      /* plinth and the two balustrades (the gaps show the sky) */
      '<rect x="0" y="74" width="360" height="18" fill="#93704A"/>' +
      '<rect x="0" y="74" width="360" height="2" fill="#C9A26C" opacity=".55"/>' +
      '<rect x="26" y="46" width="70" height="28" fill="url(#chs-bal)"/>' +
      '<rect x="264" y="46" width="70" height="28" fill="url(#chs-bal)"/>' +
      '<rect x="20" y="38" width="80" height="8" rx="1" fill="#A07B50"/><rect x="20" y="38" width="80" height="2" fill="#D9B57D" opacity=".6"/>' +
      '<rect x="260" y="38" width="80" height="8" rx="1" fill="#A07B50"/><rect x="260" y="38" width="80" height="2" fill="#D9B57D" opacity=".6"/>' +
      /* the curved pediment in the middle, with its gilt name board */
      '<path d="M96 92V44C120 44 127 9 180 7C233 9 240 44 264 44V92Z" fill="url(#chs-stuc)"/>' +
      '<path d="M96 44C120 44 127 9 180 7C233 9 240 44 264 44" fill="none" stroke="#DDBB84" stroke-opacity=".7" stroke-width="2.2"/>' +
      '<g stroke="#E2C189" stroke-opacity=".45" stroke-width="1.1" fill="none"><path d="M180 27V14M180 27L171 16.5M180 27L189 16.5M180 27L164.5 21M180 27L195.5 21"/><path d="M168 27a12 12 0 0 1 24 0" stroke-opacity=".6"/></g>' +
      '<rect x="111" y="31" width="138" height="38" rx="3" fill="#1F3D35"/>' +
      '<rect x="111" y="31" width="138" height="38" rx="3" fill="none" stroke="url(#chs-gold)" stroke-width="2"/>' +
      '<rect x="115" y="35" width="130" height="30" rx="1.5" fill="none" stroke="#C9A04E" stroke-opacity=".55" stroke-width=".7"/>' +
      '<text x="118.7" y="56.2" textLength="123" lengthAdjust="spacingAndGlyphs" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="15" fill="#0C1A16" opacity=".8">Purrlight Studio</text>' +
      '<text x="118" y="55.4" textLength="123" lengthAdjust="spacingAndGlyphs" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="15" fill="url(#chs-gold)">Purrlight Studio</text>' +
      /* corner posts with urn finials, and the two small posts either side of the pediment */
      '<g fill="url(#chs-stuc)"><rect x="0" y="24" width="22" height="68"/><rect x="338" y="24" width="22" height="68"/><rect x="92" y="34" width="8" height="40"/><rect x="260" y="34" width="8" height="40"/></g>' +
      '<g fill="#B89062"><rect x="-2" y="20" width="26" height="5" rx="1"/><rect x="336" y="20" width="26" height="5" rx="1"/></g>' +
      '<g fill="#9C7A51"><path d="M5 20h12l-2-3.5c3-2 3.5-6 .5-8.5c-1.2-1-1.6-2.2-1-3.5h-7c.6 1.3.2 2.5-1 3.5c-3 2.5-2.5 6.5.5 8.5z"/><path d="M343 20h12l-2-3.5c3-2 3.5-6 .5-8.5c-1.2-1-1.6-2.2-1-3.5h-7c.6 1.3.2 2.5-1 3.5c-3 2.5-2.5 6.5.5 8.5z"/></g>' +
      '<g fill="#D8B47C" opacity=".5"><path d="M8 9c-1.6 1.6-1.6 4.2.4 5.8" stroke="#D8B47C" stroke-width="1" fill="none"/><path d="M346 9c-1.6 1.6-1.6 4.2.4 5.8" stroke="#D8B47C" stroke-width="1" fill="none"/></g>' +
    '</svg>';

  var CUP =
    '<svg viewBox="0 0 40 34" class="c-house-cupsvg">' +
      '<ellipse cx="20" cy="31" rx="17" ry="2.6" fill="#3A2A20" opacity=".35"/>' +
      '<ellipse cx="20" cy="29.4" rx="17" ry="3.1" fill="#CFC8BA"/><ellipse cx="20" cy="28.7" rx="16.2" ry="2.5" fill="url(#chs-por)"/>' +
      '<ellipse cx="20" cy="28.6" rx="12.5" ry="1.6" fill="none" stroke="#2F4C8A" stroke-width=".7"/>' +
      '<path d="M29.4 15.4c4.6-1.3 6.5 3.4 3 6.5c-1.3 1.1-2.9 1.7-4 1.8" fill="none" stroke="#D9D2C5" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M8 12h22c0 9-4 15.6-11 15.6S8 21 8 12z" fill="url(#chs-por)"/>' +
      '<path d="M8.5 16h21" stroke="#2F4C8A" stroke-width="1.5"/>' +
      '<path d="M10.5 19.6q2.2-2.1 4.4 0t4.4 0t4.4 0t4.4 0" stroke="#2F4C8A" stroke-width=".8" fill="none"/>' +
      '<circle cx="19" cy="23.4" r="1.3" fill="#2F4C8A"/>' +
      '<ellipse cx="19" cy="12" rx="11" ry="2.1" fill="#6E3F22"/>' +
      '<ellipse cx="19" cy="12" rx="11" ry="2.1" fill="none" stroke="#D3AA55" stroke-width=".8"/>' +
      '<path d="M10.6 14.2c.4 4.6 2 8.2 4.6 10.2" stroke="#FFFFFF" stroke-opacity=".65" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
    '</svg>';
  var STEAM =
    '<svg viewBox="0 0 30 40" class="c-house-steam">' +
      '<path d="M9 38c-4-6 4-9 0-16s3-10 1-17" /><path d="M16 38c-4-7 5-10 1-18s4-9 2-16" /><path d="M23 38c-3-5 3-8 0-13s3-8 1-13" />' +
    '</svg>';
  var BOOKS =
    '<svg viewBox="0 0 46 30" class="c-house-bookssvg">' +
      '<ellipse cx="23" cy="28.6" rx="21" ry="1.8" fill="#2A1C14" opacity=".4"/>' +
      '<rect x="2.5" y="20" width="40" height="8.4" rx="1.6" fill="#6B2335"/><rect x="2.5" y="20" width="40" height="2.2" rx="1" fill="#A3485C" opacity=".7"/>' +
      '<path d="M8 20.4v7.6M37 20.4v7.6" stroke="url(#chs-goldh)" stroke-width="1.2"/>' +
      '<rect x="6" y="12.2" width="34" height="7.8" rx="1.6" fill="#3F5E50"/><rect x="6" y="12.2" width="34" height="2" rx="1" fill="#7A9A85" opacity=".6"/>' +
      '<rect x="15" y="14.8" width="16" height="2.6" rx=".6" fill="url(#chs-goldh)"/>' +
      '<rect x="4.5" y="5.4" width="30" height="6.8" rx="1.5" fill="#2B3A5A"/><rect x="4.5" y="5.4" width="30" height="1.8" rx=".9" fill="#5F729A" opacity=".6"/>' +
      '<path d="M9 5.8v6M30 5.8v6" stroke="url(#chs-goldh)" stroke-width="1"/>' +
      '<path d="M34.5 6.6h1.6v4.8h-1.6" fill="#EFE6D2"/>' +
    '</svg>';
  var RAIL = '<svg viewBox="0 0 196 40" preserveAspectRatio="none"><rect width="196" height="40" fill="url(#chs-rail)"/><rect width="196" height="3.2" rx="1.6" fill="#24201D"/><rect y="2.4" width="196" height=".9" fill="#F2B98A" opacity=".35"/><rect y="37.2" width="196" height="2.4" fill="#1C1816"/></svg>';
  /* bougainvillea (hoa giay) spilling over the balcony: a few clusters of bracts and leaves */
  var BOUGAIN = (function () {
    var s = '<svg viewBox="0 0 120 110" class="c-house-bougsvg">', i, j;
    var leaves = [[14, 22, 7], [28, 14, 8], [44, 9, 7], [60, 15, 9], [76, 10, 7], [92, 17, 8], [106, 26, 7], [84, 30, 7], [66, 30, 6], [48, 26, 6], [100, 40, 6.5], [108, 52, 5.5], [100, 60, 5], [34, 30, 5], [20, 34, 5], [58, 36, 5]];
    /* pointed leaves with a pale midrib */
    for (i = 0; i < leaves.length; i++) s += '<g transform="translate(' + leaves[i][0] + ' ' + leaves[i][1] + ') rotate(' + ((i * 41) % 80 - 40) + ') scale(' + leaves[i][2] + ')"><path d="M-1 0Q-.2-.84 1 0Q-.2.84-1 0z" fill="url(#chs-leaf)"/><path d="M-.85 0H.8" stroke="#9DB98A" stroke-opacity=".45" stroke-width=".07"/></g>';
    /* clusters of papery bracts: a few deep, most mid, a few catching the window light */
    var clusters = [[20, 16, 7], [38, 10, 8], [56, 12, 9], [74, 8, 7], [90, 14, 8], [104, 22, 7], [70, 24, 6], [50, 22, 5], [98, 34, 8], [104, 47, 6], [101, 58, 4], [30, 24, 6], [86, 26, 7], [14, 28, 5], [62, 30, 5], [44, 32, 4]];
    var cols = ["#9E1F55", "#C22F6B", "#D6457C", "#E05A8A", "#B8285F"];
    var seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    /* each flower is three papery bracts round a tiny cream floret, as bougainvillea grows - not a dot */
    for (i = 0; i < clusters.length; i++) {
      var n = clusters[i][2], m = Math.ceil(n * 0.75);
      for (j = 0; j < m; j++) {
        var a = rnd() * 6.283, rr = rnd() * (2 + n * 0.5);
        var x = clusters[i][0] + Math.cos(a) * rr, y = clusters[i][1] + Math.sin(a) * rr * 0.8;
        var a0 = rnd() * 120, sz = 0.85 + rnd() * 0.4, col = cols[Math.floor(rnd() * cols.length)], k;
        s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + sz.toFixed(2) + ')" fill="' + col + '">';
        for (k = 0; k < 3; k++) s += '<ellipse cx="1.45" cy="0" rx="1.75" ry="1.25" transform="rotate(' + (a0 + k * 120).toFixed(0) + ')"/>';
        s += '<circle r=".5" fill="#F6E7C8"/></g>';
      }
      s += '<ellipse cx="' + (clusters[i][0] - 1.5) + '" cy="' + (clusters[i][1] - 1.8) + '" rx="1.6" ry="1.1" fill="#F7A9C2" opacity=".55"/>';
    }
    return s + '</svg>';
  })();
  var LANTERN =
    '<svg viewBox="0 0 26 56" class="c-house-lantsvg">' +
      '<path d="M13 0V6" stroke="#1C1816" stroke-width="1.2"/>' +
      '<rect x="8.4" y="5.4" width="9.2" height="3.4" rx="1" fill="url(#chs-gold)"/>' +
      '<ellipse cx="13" cy="22.4" rx="11.2" ry="14" fill="url(#chs-silk)"/>' +
      '<path d="M13 8.6C4.6 12.4 4.6 32.4 13 36.2M13 8.6C21.4 12.4 21.4 32.4 13 36.2M13 8.6C8.8 12 8.8 32.8 13 36.2M13 8.6C17.2 12 17.2 32.8 13 36.2" stroke="#7A1530" stroke-opacity=".45" stroke-width=".6" fill="none"/>' +
      '<ellipse cx="10" cy="17" rx="3" ry="5" fill="#FFE7B8" opacity=".35"/>' +
      '<rect x="8.4" y="35.6" width="9.2" height="3.4" rx="1" fill="url(#chs-gold)"/>' +
      '<path d="M13 39v3" stroke="#C9A04E" stroke-width="1.2"/><path d="M11.2 42h3.6l1.2 12h-6z" fill="#B42249"/><path d="M11.6 42h2.8" stroke="url(#chs-gold)" stroke-width="1.6"/>' +
    '</svg>';
  function pot(kind) {
    var tree = kind === "kumquat"
      ? '<circle cx="18" cy="17" r="14" fill="url(#chs-leaf)"/><circle cx="11" cy="12" r="6" fill="#4E6E44" opacity=".7"/>' +
        '<g fill="#E58A2E"><circle cx="10" cy="20" r="1.9"/><circle cx="17" cy="9" r="1.8"/><circle cx="25" cy="15" r="1.9"/><circle cx="22" cy="24" r="1.8"/><circle cx="13" cy="27" r="1.7"/><circle cx="28" cy="22" r="1.6"/><circle cx="8" cy="13" r="1.6"/></g>' +
        '<g fill="#FFD08A" opacity=".8"><circle cx="9.5" cy="19.4" r=".6"/><circle cx="16.5" cy="8.4" r=".6"/><circle cx="24.5" cy="14.4" r=".6"/></g>'
      : '<circle cx="18" cy="18" r="13.5" fill="url(#chs-leaf)"/><g fill="#7C9A66" opacity=".5"><circle cx="12" cy="12" r="2"/><circle cx="16" cy="9" r="1.6"/><circle cx="21" cy="11" r="1.8"/><circle cx="10" cy="17" r="1.5"/></g>';
    return '<svg viewBox="0 0 36 52" class="c-house-potsvg">' + tree +
      '<path d="M17.4 30v-4" stroke="#4A3324" stroke-width="1.6"/>' +
      '<path d="M8.6 32h18.8l-2.6 18H11.2z" fill="url(#chs-terra)"/>' +
      '<rect x="6.6" y="29.2" width="22.8" height="4.6" rx="1.2" fill="url(#chs-terra)"/><rect x="6.6" y="29.2" width="22.8" height="1.3" rx=".6" fill="#E3A07A" opacity=".55"/>' +
      '<ellipse cx="18" cy="50.6" rx="10" ry="1.6" fill="#140E0B" opacity=".55"/>' +
    '</svg>';
  }
  var LAMP =
    '<svg viewBox="0 0 44 470" class="c-house-lampsvg">' +
      '<defs><radialGradient id="chs-lglo"><stop offset="0" stop-color="#FFE2B0" stop-opacity=".55"/><stop offset=".45" stop-color="#FFC890" stop-opacity=".16"/><stop offset="1" stop-color="#FFC890" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="22" cy="48" r="84" fill="url(#chs-lglo)"/>' +
      '<g fill="#1E1A18">' +
        '<path d="M10 470V452h24v18z"/><path d="M13 452l2-14h14l2 14z"/><path d="M16 438V120h12v318z"/>' +
        '<rect x="13.5" y="300" width="17" height="5" rx="1.5"/><rect x="13.5" y="120" width="17" height="5" rx="1.5"/><rect x="11" y="110" width="22" height="10" rx="2"/>' +
        '<path d="M19 110V78h6v32z"/><path d="M8 78h28l-3-6H11z"/><path d="M6 24h32l-5-12H11z"/><path d="M20 12V4h4v8z"/><circle cx="22" cy="3" r="3"/>' +
      '</g>' +
      '<path d="M10 72l-3-48h30l-3 48z" fill="url(#chs-lampglass)"/>' +
      '<path d="M22 24v48M15 24l-1.3 48M29 24l1.3 48" stroke="#1E1A18" stroke-width="1.3"/>' +
      '<path d="M18.5 132v300" stroke="#5C4C40" stroke-width="1.2" opacity=".55"/>' +
    '</svg>';
  /* the gilt lettering on the shop window: one of the signature lines */
  var GILT =
    '<svg viewBox="0 0 192 60" class="c-house-gilt">' +
      '<path id="chs-arc" d="M22 42Q96 20 170 42" fill="none"/>' +
      '<text font-family="Fraunces, Georgia, serif" font-weight="600" font-size="9" fill="#2A140A" opacity=".55" transform="translate(.5 .7)"><textPath href="#chs-arc" startOffset="9" textLength="142" lengthAdjust="spacingAndGlyphs">MADE BY HAND · MADE TO BE KEPT</textPath></text>' +
      '<text font-family="Fraunces, Georgia, serif" font-weight="600" font-size="9" fill="url(#chs-gold)"><textPath href="#chs-arc" startOffset="9" textLength="142" lengthAdjust="spacingAndGlyphs">MADE BY HAND · MADE TO BE KEPT</textPath></text>' +
    '</svg>';
  var FAN =
    '<svg viewBox="0 0 88 26" preserveAspectRatio="none" class="c-house-fansvg">' +
      '<g stroke="#1F3D35" stroke-width="1.7" fill="none"><path d="M44 26L4 2M44 26L24 0M44 26V0M44 26L64 0M44 26L84 2M44 26L0 16M44 26L88 16"/><path d="M30 26a14 14 0 0 1 28 0" stroke-width="2.2"/></g>' +
      '<path d="M37 26a7 7 0 0 1 14 0z" fill="url(#chs-gold)"/>' +
    '</svg>';

  /* inside the shop, the back wall seen through the open door (drawn 200 x 270; the doorway shows x 56-144, y 36-250):
     warm plaster, a picture rail, the counter with kraft gift boxes and a brass bell, yarn on two small shelves, and an
     arch into the back room where the real Merlin sits among the gift boxes (Elise's photo, only cropped by the arch) */
  function yarn(cx, cy, g) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="url(#' + g + ')"/>' +
      '<path d="M' + (cx - 4) + ' ' + (cy - 1.5) + 'q4 -3.5 8 0M' + (cx - 4.4) + ' ' + (cy + 1) + 'q4.4 -3.6 8.8 0M' + (cx - 3.4) + ' ' + (cy + 3.2) + 'q3.4 -2.6 6.8 0" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width=".6"/>';
  }
  var BACK =
    '<svg viewBox="0 0 200 270" preserveAspectRatio="none" class="c-house-backsvg">' +
      '<defs>' +
        '<radialGradient id="chs-plaster" cx=".5" cy=".24" r=".7"><stop offset="0" stop-color="#FFF3DE"/><stop offset=".45" stop-color="#F3D2A6"/><stop offset="1" stop-color="#C98E5E"/></radialGradient>' +
        '<clipPath id="chs-archclip"><path d="M79 188V102a21 21 0 0 1 42 0V188Z"/></clipPath>' +
        '<radialGradient id="chs-y1" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="#F4C7D2"/><stop offset=".6" stop-color="#C9516E"/><stop offset="1" stop-color="#7E2440"/></radialGradient>' +
        '<radialGradient id="chs-y2" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="#FFF0C4"/><stop offset=".6" stop-color="#E5B95C"/><stop offset="1" stop-color="#9C6B22"/></radialGradient>' +
        '<radialGradient id="chs-y3" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="#E2EEDC"/><stop offset=".6" stop-color="#8FAF96"/><stop offset="1" stop-color="#4E6E5A"/></radialGradient>' +
        '<radialGradient id="chs-y4" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F1E3CC"/><stop offset="1" stop-color="#B9A281"/></radialGradient>' +
      '</defs>' +
      '<rect width="200" height="270" fill="url(#chs-plaster)"/>' +
      /* picture rail and a faint stripe above it */
      '<rect x="0" y="40" width="200" height="26" fill="#FFFFFF" opacity=".08"/>' +
      '<rect x="0" y="66" width="200" height="2.4" fill="#B98F44"/><rect x="0" y="68.4" width="200" height="1.2" fill="#7A5226" opacity=".45"/>' +
      /* the arch into the back room: a gilt frame, a shadowed reveal, then the photo */
      '<path d="M73 190V102a27 27 0 0 1 54 0V190Z" fill="#6E4A2A" opacity=".35"/>' +
      '<path d="M75 189V102a25 25 0 0 1 50 0V189Z" fill="url(#chs-gold)"/>' +
      '<path d="M78 189V102a22 22 0 0 1 44 0V189Z" fill="#3A2618"/>' +
      '<image href="' + IMG + 'home/about-merlin-studio-720.webp" x="79" y="81" width="42" height="108" preserveAspectRatio="xMidYMid slice" clip-path="url(#chs-archclip)"/>' +
      '<path d="M79 104a21 21 0 0 1 42 0" fill="none" stroke="#2A1A10" stroke-opacity=".35" stroke-width="5"/>' +
      '<path d="M96 76.5h8l-1.2 6h-5.6z" fill="url(#chs-gold)"/>' +
      /* two small shelves of yarn either side of the arch */
      '<g fill="#7A4A2A"><rect x="56" y="118" width="17" height="2.4" rx=".6"/><rect x="56" y="152" width="17" height="2.4" rx=".6"/><rect x="127" y="118" width="17" height="2.4" rx=".6"/><rect x="127" y="152" width="17" height="2.4" rx=".6"/></g>' +
      '<g fill="#3E2614" opacity=".25"><rect x="56" y="120.4" width="17" height="3"/><rect x="56" y="154.4" width="17" height="3"/><rect x="127" y="120.4" width="17" height="3"/><rect x="127" y="154.4" width="17" height="3"/></g>' +
      yarn(64.5, 113, "chs-y1") + yarn(64.5, 147, "chs-y3") + yarn(135.5, 113, "chs-y2") + yarn(135.5, 147, "chs-y4") +
      /* the counter: a wooden top, a jade front with gilt panels */
      '<rect x="40" y="190" width="120" height="6" fill="#8A5634"/><rect x="40" y="190" width="120" height="1.6" fill="#D9A273" opacity=".8"/>' +
      '<rect x="44" y="196" width="112" height="74" fill="#2F5449"/><rect x="44" y="196" width="112" height="5" fill="#16302A" opacity=".55"/>' +
      '<g fill="none" stroke="#C9A04E" stroke-opacity=".75" stroke-width="1"><rect x="62" y="208" width="34" height="30"/><rect x="104" y="208" width="34" height="30"/></g>' +
      /* on the counter: kraft gift boxes with a berry ribbon, and a brass bell */
      '<rect x="60" y="176" width="16" height="14" fill="#C9A27A"/><rect x="60" y="176" width="16" height="2.4" fill="#E2C39C"/><rect x="66.8" y="176" width="2.4" height="14" fill="#B42249"/>' +
      '<rect x="63" y="168" width="10" height="8" fill="#D8B68E"/><rect x="67" y="168" width="2" height="8" fill="#B42249"/><path d="M68 168c-3-3.4-5.4-1.2-2.6.4M68 168c3-3.4 5.4-1.2 2.6.4" fill="none" stroke="#B42249" stroke-width="1.1"/>' +
      '<path d="M128 190c0-7 3-9.4 6-9.4s6 2.4 6 9.4z" fill="url(#chs-gold)"/><circle cx="134" cy="179.6" r="1.3" fill="#9C6B22"/><rect x="126" y="189" width="16" height="1.6" rx=".8" fill="#6E4A16"/>' +
    '</svg>';
  /* a schoolhouse pendant lamp hanging inside the shop: it passes overhead as we walk in */
  var PEND =
    '<svg viewBox="0 0 40 62" class="c-house-pendsvg">' +
      '<defs><radialGradient id="chs-milk" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FFF1D6"/><stop offset="1" stop-color="#E9C391"/></radialGradient>' +
      '<radialGradient id="chs-phalo"><stop offset="0" stop-color="#FFE6B8" stop-opacity=".75"/><stop offset=".5" stop-color="#FFD39A" stop-opacity=".22"/><stop offset="1" stop-color="#FFD39A" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="20" cy="40" r="20" fill="url(#chs-phalo)"/>' +
      '<path d="M20 0V24" stroke="#3A2A20" stroke-width="1"/>' +
      '<rect x="15" y="23" width="10" height="5" rx="1.2" fill="url(#chs-gold)"/>' +
      '<path d="M14.5 28h11c0 3.4 6.5 6.6 6.5 13.4c0 4.6-3.6 7.2-12 7.2s-12-2.6-12-7.2c0-6.8 6.5-10 6.5-13.4z" fill="url(#chs-milk)"/>' +
      '<path d="M8.6 44.6c3 1.6 6.8 2.2 11.4 2.2s8.4-.6 11.4-2.2" fill="none" stroke="#C9A04E" stroke-width="1"/>' +
    '</svg>';

  function shutter(cls) { return '<i class="c-house-sh ' + cls + '"><i class="c-house-shg"></i></i>'; }

  var SCENE =
    DEFS +
    '<div class="c-house-sky" aria-hidden="true"><i class="c-house-stars"></i><i class="c-house-moon"></i><i class="c-house-haze"></i></div>' +
    /* two 3D scenes under one camera: the street (drawn first) and the house. In one shared scene Chrome's depth
       sorting drops part of the facade while the camera flies over the pavement */
    '<div class="c-house-cam" aria-hidden="true"><div class="c-house-world c-house-ground">' +
      /* the neighbours, faintly */
      '<div class="c-house-nb c-house-nb-l"><i class="c-house-nbroof"></i><i class="c-house-nbw c-house-nbw-a"></i><i class="c-house-nbw c-house-nbw-b c-house-nbw-lit"></i><i class="c-house-nbw c-house-nbw-c"></i><i class="c-house-nbw c-house-nbw-d"></i><i class="c-house-nbshop"></i></div>' +
      '<div class="c-house-nb c-house-nb-r"><i class="c-house-nbw c-house-nbw-e c-house-nbw-lit"></i><i class="c-house-nbw c-house-nbw-f"></i><i class="c-house-nbw c-house-nbw-g"></i><i class="c-house-nbw c-house-nbw-h c-house-nbw-lit"></i><i class="c-house-nbbal"></i><i class="c-house-nbshop c-house-nbshop-r"></i></div>' +
      /* the pavement and the road, as a real ground plane */
      '<div class="c-house-street"><i class="c-house-mat"></i></div>' +
      '<span class="c-house-lamp c-house-near">' + LAMP + '</span>' +
    '</div><div class="c-house-world c-house-main">' +
      '<div class="c-house-facade">' +
        /* everything on the wall plane is painted as one flat layer, cheap to zoom; true depth is kept where the
           parallax shows: the door and the shop inside it, the awning, the balcony, the lantern and the pots */
        '<div class="c-house-flat">' +
        '<div class="c-house-wall"><i class="c-house-glow"></i></div>' +
        PARAPET +
        '<i class="c-house-pil c-house-pil-l"></i><i class="c-house-pil c-house-pil-r"></i>' +
        '<i class="c-house-cor c-house-cor-top"></i><i class="c-house-cor c-house-cor-mid"></i>' +
        /* top floor: Merlin's reading room, the window open, a teacup and books on the sill */
        '<div class="c-house-win c-house-w2">' +
          '<div class="c-house-room">' + img("home/merlin-real-360.webp", "c-house-photo", "50% 30%") + '<i class="c-house-dark"></i></div>' +
          '<i class="c-house-arch"></i>' +
          shutter("c-house-sh-l") + shutter("c-house-sh-r") +
          '<span class="c-house-props"><i class="c-house-sill"></i><span class="c-house-books">' + BOOKS + '</span><span class="c-house-cup">' + STEAM + CUP + '</span></span>' +
        '</div>' +
        /* first floor: the studio, French doors onto the balcony */
        '<div class="c-house-win c-house-w1">' +
          '<div class="c-house-room">' + img("custom/pet-crochet-group.webp", "c-house-photo", "64% 22%") + '</div>' +
          '<i class="c-house-fd"><i class="c-house-dark"></i></i>' +
          '<i class="c-house-arch1"><i class="c-house-hood"></i></i>' +
          shutter("c-house-sh-l c-house-sh1") + shutter("c-house-sh-r c-house-sh1") +
        '</div>' +
        '<i class="c-house-slab-top"></i>' +
        /* the shop sign: Elise's logo on an ivory board */
        '<span class="c-house-fascia"><i class="c-house-fascia-plate"><img src="' + BASE + 'assets/brand/logo-flat.png" alt="" width="360" height="119" decoding="async"></i></span>' +
        '<i class="c-house-sf"></i>' +
        /* ground floor: the gift shop window */
        '<div class="c-house-dw">' +
          '<i class="c-house-dw-back"></i>' +
          '<span class="c-house-display">' +
            '<i class="c-house-fr c-house-fr-a">' + img("products/anne-shirley-set-600.webp", "", "50% 30%") + '</i>' +
            '<i class="c-house-fr c-house-fr-b">' + img("products/tuxedo-cat-600.webp", "", "50% 40%") + '</i>' +
            '<i class="c-house-fr c-house-fr-c">' + img("products/bennet-darcy-set-600.webp", "", "50% 40%") + '</i>' +
          '</span>' +
          '<span class="c-house-glass">' + GILT + '<i class="c-house-dark"></i></span>' +
        '</div>' +
        '</div>' +
        '<span class="c-house-balc"><span class="c-house-rail">' + RAIL + '</span><i class="c-house-slab"></i><span class="c-house-boug">' + BOUGAIN + '</span></span>' +
        /* the shop door */
        '<div class="c-house-door">' +
          '<span class="c-house-in">' + BACK + '</span><i class="c-house-infloor"></i><i class="c-house-soffit"></i><i class="c-house-inceil"></i>' +
          '<span class="c-house-pend">' + PEND + '</span>' +
          '<i class="c-house-dside c-house-dside-l"></i><i class="c-house-dside c-house-dside-r"></i>' +
          '<span class="c-house-fan">' + FAN + '<i class="c-house-dark"></i></span>' +
          '<i class="c-house-leaf c-house-leaf-l"><i class="c-house-pane"><i class="c-house-dark"></i></i><i class="c-house-knob"></i><i class="c-house-lshade"></i></i>' +
          '<i class="c-house-leaf c-house-leaf-r"><i class="c-house-pane"><i class="c-house-dark"></i></i><i class="c-house-knob"></i><i class="c-house-lshade"></i></i>' +
        '</div>' +
        '<div class="c-house-awning"><i class="c-house-val"></i></div>' +
        '<span class="c-house-lantern c-house-near"><i class="c-house-lglow"></i>' + LANTERN + '</span>' +
        '<span class="c-house-pot c-house-pot-l c-house-near">' + pot("box") + '</span>' +
        '<span class="c-house-pot c-house-pot-r c-house-near">' + pot("kumquat") + '</span>' +
      '</div>' +
    '</div></div>' +
    '<i class="c-house-wash" aria-hidden="true"></i>' +
    '<button class="c-house-skip" type="button">Skip intro</button>' +
    '<div class="c-house-card">' +
      '<p class="c-house-line" id="c-house-line">Sketched by Merlin,<br><em>stitched by us.</em></p>' +
      '<button class="c-house-go" type="button"><span>Step inside</span></button>' +
    '</div>';

  /* the house is drawn 360 x 800 units; the door's middle sits at (282, 693) */
  var HW = 360, HH = 800, EYE = 300, DOOR_X = 282, DOOR_Y = 693, DOOR_H = 214;
  var ov = null, worlds = [], inerted = [], done = false, opened = false, settled = false, timers = [], geo = null, raf = 0;
  var rx = 0, ry = 0;   /* the mouse tilt, degrees */
  function setT(t) { for (var i = 0; i < worlds.length; i++) worlds[i].style.transform = t; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function remember() { store(KEY, "1"); }

  function layout() {
    if (!ov || opened) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var wide = vw >= 900 && vw / vh >= 1.2;
    ov.classList.toggle("is-wide", wide);
    var card = ov.querySelector(".c-house-card");
    var top = wide ? Math.max(26, vh * 0.05) : Math.max(56, vh * 0.065);
    var bottom = wide ? Math.max(58, vh * 0.085) : card.offsetHeight + 4;
    var k = Math.min((vh - top - bottom) / HH, (wide ? vw * 0.42 : vw * 0.8) / HW);
    var cx = vw / 2;
    if (wide) {
      var r = card.getBoundingClientRect().right;
      cx = Math.max(cx, r + 48 + HW * k / 2);
      cx = Math.min(cx, vw - HW * k / 2 - 24);
    }
    var houseTop = vh - bottom - HH * k;
    var oy = houseTop + EYE * k, p = 850 * k;
    geo = { k: k, cx: cx, top: houseTop, oy: oy, p: p, vh: vh };
    var cam = ov.querySelector(".c-house-cam");
    cam.style.perspective = p.toFixed(1) + "px";
    cam.style.perspectiveOrigin = cx.toFixed(1) + "px " + oy.toFixed(1) + "px";
    for (var i = 0; i < worlds.length; i++) {
      worlds[i].style.left = (cx - HW / 2).toFixed(1) + "px";
      worlds[i].style.top = houseTop.toFixed(1) + "px";
    }
    setT(base(ov.classList.contains("is-on") ? 0 : -90 * k));
  }
  /* one shape of transform for every state, so the browser can glide between them: move, tilt about the eye line, scale */
  function T(dx, dy, dz, ax, ay) {
    var k = geo.k, e = (EYE * k).toFixed(1);
    return "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px," + dz.toFixed(1) + "px) translateY(" + e + "px) rotateX(" + ax.toFixed(2) + "deg) rotateY(" + ay.toFixed(2) + "deg) translateY(-" + e + "px) scale3d(" + k + "," + k + "," + k + ")";
  }
  function base(z) { return T(0, 0, z, rx, ry); }
  function flyTo() {
    var g = geo, k = g.k;
    var dx = -(DOOR_X - HW / 2) * k, dy = g.oy - (g.top + DOOR_Y * k);
    var s = Math.max(0.86 * g.vh / (DOOR_H * k), 2.6);   /* the doorway fills most of the screen; the warm light does the rest */
    var dz = g.p * (1 - 1 / s) + 12 * k;
    return T(dx, dy, dz, 0, 0);
  }

  function finish() {
    if (done) return;
    done = true;
    remember();
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
    inerted.forEach(function (n) { n.removeAttribute("inert"); });
    d.classList.remove("c-house-intro", "c-house-built", "c-house-reveal");
    /* the page's last few frames of settling in (0.94 -> 1) end now, so nothing is left even slightly scaled */
    inerted.forEach(function (n) {
      if (!n.getAnimations) return;
      try { n.getAnimations().forEach(function (a) { if (a.transitionProperty === "transform") a.finish(); }); } catch (x) { /* fine */ }
    });
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("resize", layout);
    window.removeEventListener("pointermove", onPointer);
    if (reduceMq) { if (reduceMq.removeEventListener) reduceMq.removeEventListener("change", onReduce); else if (reduceMq.removeListener) reduceMq.removeListener(onReduce); }
    try { history.scrollRestoration = "auto"; } catch (e) { /* old browsers */ }
  }
  function onKey(e) { if (e.key === "Escape" || e.key === "Esc") finish(); }
  function onReduce() { if (reduceMq && reduceMq.matches) finish(); }
  function onVis() {
    if (!ov) return;
    if (document.hidden) { if (opened) finish(); else ov.classList.add("is-paused"); }
    else ov.classList.remove("is-paused");
  }
  /* a mouse: the house turns a few degrees towards it, so its depth shows (no motion of its own) */
  var px = 0, py = 0;
  function onPointer(e) {
    if (opened || e.pointerType !== "mouse") return;
    px = e.clientX / window.innerWidth - 0.5;
    py = e.clientY / window.innerHeight - 0.5;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      if (opened || !settled || !geo) return;
      ry = px * 7; rx = -py * 3.5;
      setT(base(0));
    });
  }

  /* the tap: the camera flies in under the awning to the shop door, the door opens, the page comes forward */
  function open() {
    if (opened || done) return;
    opened = true;
    remember();
    rx = ry = 0;
    ov.classList.add("is-go");
    setT(flyTo());
    later(function () { ov.classList.add("is-doors"); }, 1100);
    later(function () { ov.classList.add("is-through"); }, 2150);   /* a moment to see inside the shop first */
    later(function () { ov.classList.add("is-gone"); d.classList.add("c-house-reveal"); }, 2600);
    later(finish, 3350);
  }
  /* a second tap: straight to the end */
  function fastForward() {
    if (done || ov.classList.contains("is-ff")) return;
    timers.forEach(clearTimeout);
    timers = [];
    ov.classList.add("is-ff", "is-doors", "is-through");
    later(function () { ov.classList.add("is-gone"); d.classList.add("c-house-reveal"); }, 200);
    later(finish, 940);
  }
  function onClick(e) {
    var t = e.target;
    if (t.closest && t.closest(".c-house-skip")) { finish(); return; }
    if (!opened) open(); else fastForward();
  }

  function build() {
    if (done) return;
    try {
      ov = document.createElement("div");
      ov.className = "c-house-ov";
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-labelledby", "c-house-line");
      ov.tabIndex = -1;   /* focus goes into the dialog without drawing a ring on the scene */
      ov.innerHTML = SCENE;
      document.body.insertBefore(ov, document.body.firstChild);
      worlds = [].slice.call(ov.querySelectorAll(".c-house-world"));
      d.classList.add("c-house-built");
      [].forEach.call(document.body.children, function (n) {
        if (n !== ov && n.tagName !== "SCRIPT" && !n.hasAttribute("inert")) { n.setAttribute("inert", ""); inerted.push(n); }
      });
      layout();
      if (document.fonts && document.fonts.load) {
        document.fonts.load("600 15px Fraunces").then(function () {
          if (done || !ov) return;
          var par = ov.querySelector(".c-house-parapet"), gl = ov.querySelector(".c-house-gilt");
          if (par) par.outerHTML = PARAPET;
          if (gl) gl.outerHTML = GILT;
        }, function () { /* the letters stay as they are */ });
      }
      ov.addEventListener("click", onClick);
      document.addEventListener("keydown", onKey);
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("resize", layout);
      window.addEventListener("pointermove", onPointer);
      if (reduceMq) { if (reduceMq.addEventListener) reduceMq.addEventListener("change", onReduce); else if (reduceMq.addListener) reduceMq.addListener(onReduce); }
      try { ov.focus({ preventScroll: true }); } catch (e) { ov.focus(); }
      /* the next frame: dusk settles, the camera eases in a little, and the windows light up from the street up */
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        if (done || opened) return;
        void ov.offsetWidth;
        ov.classList.add("is-on");
        setT(base(0));
        later(function () { settled = true; ov.classList.add("is-settled"); }, 2900);
      }); });
    } catch (err) {
      finish();   /* never let the welcome block the shop */
    }
  }

  onReady(function () {
    try { buildLift(); } catch (e) { /* the dial is decoration only */ }
    if (introPlanned) build();
  });
})();
