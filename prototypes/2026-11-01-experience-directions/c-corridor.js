/* PREVIEW 01/11 — Direction 2, "The studio door and a short corridor" (js/concept-boot.js loads this with
   ?concept=corridor; never shipped).
   1. The welcome (home page only, once per tab): the studio's shopfront — a jade double door with glass panes and brass
      knobs under an arched fanlight gilded "Purrlight Studio", a brass shop bell, a hanging card, carriage lanterns on
      wide screens, a gach bong tiled terrace — all drawn in code. "Come in" (or a tap on the door) rings the bell,
      swings the doors inward in 3D, and walks the visitor at eye height down a short corridor (tiled floor,
      botanical-stripe paper over wood wainscoting, brass sconces and a pendant, Elise's real photographs in gilt and
      wood frames) to Merlin's real portrait over an arch of warm light; stepping through it shows the real home page.
      The corridor, doors and terrace are CSS 3D; the shopfront wall is a flat layer scaled on the same camera curve. About 4.4 s after the tap; a tap anywhere fast-forwards,
      "Skip intro" and Esc end it at once. Never with reduced motion (also when switched on mid-way), with ?nointro or
      a #link, and - unless ?intro=1 - not inside a frame, for automated browsers or on a second visit in the tab.
      Merlin is only ever Elise's real photo; nothing here draws a cat.
   2. The whole site feels like the rooms of the studio: page-to-page navigation steps through an arched doorway (view
      transitions, reversed on Back), a brass room plaque named from the page's own title, a wainscot rail under the
      header, arched frames on key photos and a gach bong tile band at the thresholds. All built here and in
      css/c-corridor.css, so with JavaScript off nothing changes.
   Plain ES5, no library. */
(function () {
  "use strict";
  var d = document.documentElement;
  var C = window.PL_CONCEPT;
  if (!C || C.name !== "corridor") return;
  var BASE = C.base || "";
  var q = location.search;
  var reduceMq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  function svgUrl(s) { return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }

  /* ---------- textures, drawn in code (used by the welcome and by the tile bands across the site) ---------- */
  /* an encaustic cement tile (gach bong): teal quarter-circles meet at the corners, a terracotta four-petal flower with
     sage leaves in the middle, a gold centre; the thin grout line is shared with the next tile */
  function quarters(r, fill) {
    return '<g fill="' + fill + '"><path d="M0 0H' + r + 'A' + r + ' ' + r + ' 0 0 1 0 ' + r + 'Z"/>' +
      '<path d="M100 0V' + r + 'A' + r + ' ' + r + ' 0 0 1 ' + (100 - r) + ' 0Z"/>' +
      '<path d="M100 100H' + (100 - r) + 'A' + r + ' ' + r + ' 0 0 1 100 ' + (100 - r) + 'Z"/>' +
      '<path d="M0 100V' + (100 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + r + ' 100Z"/></g>';
  }
  var TILE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">' +
    '<rect width="100" height="100" fill="#EEE4D0"/>' +
    quarters(27, "#35524C") + quarters(18, "#EEE4D0") + quarters(10, "#B4643E") +
    '<path fill="#35524C" d="M41 0H59L50 10ZM100 41V59L90 50ZM59 100H41L50 90ZM0 59V41L10 50Z"/>' +
    '<circle cx="50" cy="50" r="28" fill="none" stroke="#35524C" stroke-width="1.5"/>' +
    '<g fill="#B4643E"><path id="p" d="M50 24C56.5 31 57.5 40.5 50 49C42.5 40.5 43.5 31 50 24Z"/>' +
    '<use href="#p" transform="rotate(90 50 50)"/><use href="#p" transform="rotate(180 50 50)"/><use href="#p" transform="rotate(270 50 50)"/></g>' +
    '<g fill="#7E9A78"><path id="l" d="M50.5 49.5C51.5 42 57 36.5 65.5 34.5C63.5 43 58 48.5 50.5 49.5Z"/>' +
    '<use href="#l" transform="rotate(90 50 50)"/><use href="#l" transform="rotate(180 50 50)"/><use href="#l" transform="rotate(270 50 50)"/></g>' +
    '<circle cx="50" cy="50" r="5.5" fill="#C9963F" stroke="#35524C" stroke-width="1.6"/>' +
    '<rect x=".5" y=".5" width="99" height="99" fill="none" stroke="#7D6A52" stroke-opacity=".5"/></svg>';
  /* a light botanical-stripe paper: a sage band with a climbing sprig, a gold pin line, tiny terracotta florets */
  var PAPER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64" width="48" height="64">' +
    '<rect width="48" height="64" fill="#F4EBDC"/><rect width="14" height="64" fill="#DFE5D4"/>' +
    '<rect x="14" width="1" height="64" fill="#C7B285" fill-opacity=".7"/><rect x="31" width=".8" height="64" fill="#C7B285" fill-opacity=".45"/>' +
    '<path d="M7 0C2.5 10 11.5 22 7 32C2.5 42 11.5 54 7 64" fill="none" stroke="#8CA283" stroke-width=".9"/>' +
    '<g fill="#8CA283"><path d="M5.6 13C2 12 1 9 1.5 7C4 8 5.8 10 5.6 13Z"/><path d="M8.6 45C12 44 13 41 12.6 39C10 40 8.4 42 8.6 45Z"/>' +
    '<path d="M8.2 24C11 22.5 11.8 20 11.4 18.4C9.4 19.4 8.2 21.4 8.2 24Z"/><path d="M5.8 56C3 54.5 2.2 52 2.6 50.4C4.6 51.4 5.8 53.4 5.8 56Z"/></g>' +
    '<g fill="#C48867" fill-opacity=".75"><circle cx="23" cy="15" r="1"/><circle cx="24.6" cy="13.4" r=".8"/><circle cx="21.6" cy="13.6" r=".8"/>' +
    '<circle cx="40" cy="47" r="1"/><circle cx="41.6" cy="45.4" r=".8"/><circle cx="38.6" cy="45.6" r=".8"/></g></svg>';
  /* fine grain for plaster, paper and wood */
  var NOISE = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n" x="0" y="0">' +
    '<feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>' +
    '<feColorMatrix values="0 0 0 0 .3 0 0 0 0 .22 0 0 0 0 .14 0 0 0 .32 0"/></filter>' +
    '<rect width="180" height="180" filter="url(#n)"/></svg>';
  try {
    d.style.setProperty("--c-corridor-tile", svgUrl(TILE));
    d.style.setProperty("--c-corridor-paper", svgUrl(PAPER));
    d.style.setProperty("--c-corridor-noise", svgUrl(NOISE));
  } catch (e) { /* old browsers: plain colours */ }

  var homePath = null;
  try { homePath = new URL(BASE, location.href).pathname; } catch (e) { homePath = null; }
  var isHome = !!homePath && location.pathname.replace(/index\.html$/, "") === homePath;

  /* ---------- B. page to page: a step back through the doorway on Back/Forward (css/c-corridor.css has the rest) ---- */
  window.addEventListener("pagereveal", function (e) {
    try {
      var a = window.navigation && navigation.activation;
      if (!e.viewTransition || !a || a.navigationType !== "traverse" || !a.from || !a.entry) return;
      if (a.entry.index < a.from.index) e.viewTransition.types.add("c-corridor-back");
    } catch (err) { /* older browsers: the forward step is fine */ }
  });

  /* ---------- B. the room plaque: a small brass plate named from the page's own title, no new claims ---------- */
  function roomName() {
    var p = location.pathname, t = document.title || "";
    if (isHome) return "";   /* review: the home hero already says who we are; a "Purrlight Studio" plate there read as a sticker */
    if (/custom-orders\/(index\.html)?$/.test(p)) return "Custom Orders";
    if (/\/(shop|product)\.html$/.test(p)) return "The Shop";
    if (/\/about\.html$/.test(p)) return "Our Story";
    if (/\/partners\.html$/.test(p)) return "Partner Program";
    if (/\/shipping-returns\.html$/.test(p)) return "Shipping & Returns";
    var first = t.split(" — ")[0];
    return first && first !== "Purrlight Studio" ? first : "";
  }
  function plaque() {
    var main = document.getElementById("main"), name = roomName();
    if (!main || !name || main.querySelector(".c-corridor-plaque")) return;
    var h1 = main.querySelector("h1"), crumbs = main.querySelector(".crumbs");
    /* no plate when the heading right under it already says the same words (Custom Orders, Shipping & returns) */
    function norm(s) { return String(s || "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").toLowerCase(); }
    if (h1 && norm(h1.textContent) === norm(name)) return;
    var at = h1, prev = h1 && h1.previousElementSibling;
    if (prev && /eyebrow/.test(prev.className)) at = prev;
    if (crumbs) at = crumbs;   /* a product page: above the breadcrumbs, so the category stays with the name */
    var p = document.createElement("p");
    p.className = "c-corridor-plaque";
    p.setAttribute("aria-hidden", "true");   /* the page's own title, said again: decoration for sighted visitors only */
    p.innerHTML = '<span class="c-corridor-plaque-plate"><i></i><span class="c-corridor-plaque-text"></span><i></i></span>';
    p.querySelector(".c-corridor-plaque-text").textContent = name;
    if (at && at.parentNode) at.parentNode.insertBefore(p, at); else main.insertBefore(p, main.firstChild);
    if (/hero/.test((p.parentNode && p.parentNode.className) || "") || (h1 && h1.closest && h1.closest(".hero"))) p.classList.add("c-corridor-plaque--hero");
    if (at === crumbs) p.classList.add("c-corridor-plaque--top");
  }
  onReady(function () { try { plaque(); } catch (e) { /* decoration only */ } });

  /* ---------- A. the welcome: home page only ---------- */
  if (!isHome) return;
  var KEY = "pl-corridor-intro";
  var force = /[?&]intro=1\b/.test(q);
  var seen = false, framed = true;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked: show it */ }
  try { framed = window.top !== window.self; } catch (e) { /* a cross-origin parent: framed */ }
  var bot = navigator.webdriver || /bot|crawl|spider|slurp|facebookexternalhit|lighthouse/i.test(navigator.userAgent);
  if (/[?&]nointro\b/.test(q) || location.hash || reduced() || (!force && (seen || bot || framed))) return;

  d.classList.add("c-corridor-intro");   /* css: a plaster-cream curtain until the scene is built, the page held back */
  try { history.scrollRestoration = "manual"; } catch (e) { /* old browsers */ }

  var ov = null, hit = null, inerted = [], timers = [], done = false, state = "idle";
  var onReduce = null;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function remember() { try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* fine */ } }
  function img(p) { return BASE + p; }

  function finish() {
    if (done) return;
    done = true;
    state = "done";
    remember();
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    timers = [];
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("visibilitychange", onVis);
    if (reduceMq && onReduce) { if (reduceMq.removeEventListener) reduceMq.removeEventListener("change", onReduce); else if (reduceMq.removeListener) reduceMq.removeListener(onReduce); }
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
    ov = null;
    for (var j = 0; j < inerted.length; j++) inerted[j].removeAttribute("inert");
    inerted = [];
    d.classList.remove("c-corridor-intro", "c-corridor-built", "c-corridor-reveal");
    /* the page's last few ms of settling would otherwise run on after the welcome is gone: land it now */
    try {
      var kids = document.body.children, k, a, m;
      for (k = 0; k < kids.length; k++) {
        a = kids[k].getAnimations ? kids[k].getAnimations() : [];
        for (m = 0; m < a.length; m++) if (a[m].transitionProperty === "transform") a[m].finish();
      }
    } catch (e) { /* older browsers: it settles by itself */ }
    try { history.scrollRestoration = "auto"; } catch (e) { /* old browsers */ }
  }

  /* the camera: eye height 160 world units above the floor, the door 150 wide and 240 high, the corridor 176 wide,
     320 high and 520 deep. u = screen px per world unit at the door's plane, P = the perspective distance in px, so the
     visitor stands P/u units from the door. Each drawn plane is laid out k times larger and scaled back by 1/k
     (css: --k), so it keeps crisp detail when the camera comes close. */
  /* STOP = how far from the end wall the walk ends (layout() sets it per screen, so the arch and Merlin's portrait fill
     about the same share of any screen at the end).
     The end wall is not a 3D plane: Chrome stops painting part of a 3D plane once it is projected much bigger than the
     screen (in review it showed as a flat block cutting the arch in the last second), so like the shopfront it is a flat
     layer, here UNDER the 3D corridor. A wall facing the visitor only ever grows about the eye as we walk, so a 2D scale
     on the camera's own curve (plus the small drop of the closing glance up) matches it; it is drawn a little larger than
     the opening, and the 3D walls, floor and ceiling hide its edges. It is laid out at its end size and scaled down, so
     it is sharpest at the end of the walk. */
  var L = 520, STOP = 230, gStreet = null, kfStyle = null, geo = { u: 1, P: 800, czEnd: 1000, sHide: 4, E: 3 };
  var EASE = [0.4, 0, 0.3, 1], GLANCE = [0.45, 0, 0.55, 1], LOOK = 2.6;
  /* a css cubic-bezier as progress for a given share of the time */
  function bezierOf(e, x) {
    var lo = 0, hi = 1, t = x, i, xt;
    for (i = 0; i < 30; i++) {
      t = (lo + hi) / 2;
      xt = 3 * (1 - t) * (1 - t) * t * e[0] + 3 * (1 - t) * t * t * e[2] + t * t * t;
      if (xt < x) lo = t; else hi = t;
    }
    return 3 * (1 - t) * (1 - t) * t * e[1] + 3 * (1 - t) * t * t * e[3] + t * t * t;
  }
  function bezier(x) { return bezierOf(EASE, x); }   /* the camera's curve (the same as the css transition) */
  /* the end wall's 2D scale (screen px per world unit, over its laid-out E) with the camera this far along */
  function endScale(p) { return geo.u * geo.P / Math.max(1, geo.P + L * geo.u - geo.czEnd * p) / geo.E; }
  function walkKeyframes() {
    var out = "@keyframes c-corridor-front-walk {", end = "@keyframes c-corridor-end-walk {", i, x, p, sc, a, hidden = false, N = 48;
    for (i = 0; i <= N; i++) {
      x = i / N;
      p = bezier(x);
      if (!hidden) {
        sc = geo.P / Math.max(1, geo.P - geo.czEnd * p);
        if (sc >= geo.sHide) { hidden = true; out += (x * 100).toFixed(2) + "% { transform: scale(" + (geo.u * geo.sHide).toFixed(4) + "); opacity: 0; }"; }
        else out += (x * 100).toFixed(2) + "% { transform: scale(" + (geo.u * sc).toFixed(4) + "); opacity: 1; }";
      }
      /* the glance up over the second half of the walk (css: c-corridor-glance) lowers the far wall by P * tan(angle) */
      a = x <= 0.5 ? 0 : LOOK * Math.PI / 180 * bezierOf(GLANCE, (x - 0.5) / 0.5);
      end += (x * 100).toFixed(2) + "% { transform: translateY(" + (geo.P * Math.tan(a)).toFixed(2) + "px) scale(" + endScale(p).toFixed(5) + "); }";
    }
    return out + "100% { transform: scale(" + (geo.u * geo.sHide).toFixed(4) + "); opacity: 0; } }" + end + "}";
  }
  function grid(x0, y0, w, h, mw, mh, cb) {
    var cols = Math.max(1, Math.ceil(w / mw)), rows = Math.max(1, Math.ceil(h / mh)), tw = w / cols, th = h / rows, i, j;
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      cb(Math.round(x0 + i * tw), Math.round(y0 + j * th), Math.ceil(tw) + (i < cols - 1 ? 1 : 0), Math.ceil(th) + (j < rows - 1 ? 1 : 0));
    }
  }
  function street(x, z, w, h, fw) {
    var bx = -(x + fw) + "px " + -z + "px";
    return '<div class="c-corridor-p c-corridor-street" style="--w:' + w + 'px;--h:' + h + 'px;transform:translate3d(' + x + 'px,160px,' + z + 'px) rotateX(90deg) scale(calc(1 / var(--k)))">' +
      '<div class="c-corridor-k" style="background-position:' + [bx, bx, bx, bx, bx, bx, (-17 - x) + "px " + -z + "px"].join(",") + '"></div></div>';
  }
  function layout() {
    if (!ov) return;
    var vw = window.innerWidth || d.clientWidth, vh = window.innerHeight || d.clientHeight;
    var phone = vw < 700;
    var u = phone ? Math.min(vw * 0.9 / 236, vh * 0.56 / 366) : Math.min(vw * 0.8 / 236, vh * 0.62 / 366);
    var P = phone ? vh * 0.66 : Math.max(vw * 0.66, vh * 0.75);
    /* the words sit on the plaster beside the door on wide or landscape screens, else above it (review: a landscape phone
       or a tablet had them over the fanlight) */
    var side = vw >= 900 || vw > vh * 1.25;
    var ye = side ? vh * 0.47 : Math.max(vh * 0.5, (phone ? 156 : 176) + 206 * u);   /* room above the cornice for the words */
    ye = Math.round(Math.min(ye, vh - 162 * u - 110));                                /* and below the step for the button */
    var fw = Math.ceil(vw / u / 2 + 90), ft = Math.ceil(ye / u + 70);
    var sd = Math.ceil(Math.max(120, P / u - 160 * P / Math.max(1, vh - ye) + 50));   /* the terrace stops before the visitor's feet */
    var kf = Math.max(1, Math.min(2, u * 1.1));
    var s = ov.style;
    s.setProperty("--u", u.toFixed(4));
    s.setProperty("--P", Math.round(P) + "px");
    s.setProperty("--ye", ye + "px");
    s.setProperty("--fw", fw + "px");
    s.setProperty("--ft", ft + "px");
    s.setProperty("--sd", sd + "px");
    s.setProperty("--kf", kf.toFixed(2));
    ov.classList.toggle("is-wide", vw / u / 2 > 215);
    ov.classList.toggle("is-side", side);
    /* beside the door: the room left of the surround (the words sit below the lantern), and a size that keeps
       "Sketched by Merlin," on one line in it */
    s.setProperty("--line-w", Math.max(150, Math.round(vw / 2 - 126 * u - 16 - Math.max(40, 0.07 * vw))) + "px");
    /* wide screens end a little farther back and glance up a little more, so Merlin's frame sits whole under the top */
    STOP = Math.round(Math.min(300, Math.max(212, P * 320 / ((phone ? 1.3 : 1.2) * vh))));
    LOOK = phone ? 2.6 : 4.2;
    s.setProperty("--look", LOOK + "deg");
    s.setProperty("--cz-end", Math.round(P + u * (L - STOP)) + "px");
    s.setProperty("--e", (P / STOP).toFixed(4));
    /* Chrome may paint only part of a very large plane under a perspective camera, so the terrace is laid as tiles no
       bigger than half a screen (their textures line up across tiles); the wall is the flat shopfront layer */
    var mw = 0.48 * vw / u, mh = 0.48 * vh / u, h = "";
    grid(-fw, 0, 2 * fw, sd, mw, mh, function (x, z, w, t) { h += street(x, z, w, t, fw); });
    if (gStreet) gStreet.innerHTML = h;
    geo = { u: u, P: P, czEnd: P + u * (L - STOP), E: P / STOP,
      /* the shopfront is out of sight once the doorway fills the screen: its sides, its top (80 above the eye), the step */
      sHide: 1.03 * Math.max(vw / 2 / (75 * u), ye / (80 * u), (vh - ye) / (160 * u)) };
    s.setProperty("--es0", endScale(0).toFixed(5));
    if (kfStyle && state === "idle") kfStyle.textContent = walkKeyframes();
    /* the door, for a tap: its frame, the fanlight and the step */
    if (hit) {
      var hs = hit.style;
      hs.left = Math.round(vw / 2 - 104 * u) + "px";
      hs.top = Math.round(ye - 206 * u) + "px";
      hs.width = Math.round(208 * u) + "px";
      hs.height = Math.round(372 * u) + "px";
    }
  }

  function open() {
    if (state !== "idle" || !ov) return;
    state = "walking";
    remember();
    ov.classList.add("is-open");                                         /* the bell rings, the doors swing in */
    later(function () { ov.classList.add("is-walk"); }, 480);            /* and we walk in, at eye height */
    later(function () { ov.classList.add("is-bloom"); }, 3120);          /* the arch's light fills the view */
    later(reveal, 3860);
    later(finish, 4440);
  }
  function reveal() {
    if (!ov) return;
    ov.classList.add("is-gone");                                         /* the light lifts off */
    d.classList.add("c-corridor-reveal");                                /* and the bright room comes forward */
  }
  function fastForward() {
    if (state !== "walking" || !ov) return;
    state = "ff";
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    timers = [];
    ov.classList.add("is-ff", "is-bloom");
    later(reveal, 280);
    later(finish, 860);
  }
  function onKey(e) {
    if (e.key === "Escape" || e.key === "Esc") { finish(); return; }
    if (state === "walking" && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) { e.preventDefault(); fastForward(); }
  }
  function onVis() { if (document.hidden && state !== "idle") finish(); }   /* never leave a half-walked corridor behind */
  /* the scene is fitted to the screen while we stand at the door; a turn of the phone mid-walk skips to the light */
  function onResize() { if (state === "idle") layout(); else if (state === "walking") fastForward(); }

  /* ---------- the drawings ---------- */
  var DEFS =
    '<linearGradient id="cc-jade-h" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#3E6356"/><stop offset=".22" stop-color="#5C8775"/><stop offset=".6" stop-color="#507B6A"/><stop offset="1" stop-color="#3B5F52"/></linearGradient>' +
    '<linearGradient id="cc-jade-v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5A8573"/><stop offset=".5" stop-color="#4F7968"/><stop offset="1" stop-color="#436B5B"/></linearGradient>' +
    '<linearGradient id="cc-jade-lt" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#77A291"/><stop offset="1" stop-color="#5B8674"/></linearGradient>' +
    '<linearGradient id="cc-glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFE7C6" stop-opacity=".16"/><stop offset=".7" stop-color="#F5C28E" stop-opacity=".22"/><stop offset="1" stop-color="#E8A87C" stop-opacity=".34"/></linearGradient>' +
    '<radialGradient id="cc-tglass" cx="0" cy="-82" r="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFE2B8"/><stop offset=".45" stop-color="#E9A66E"/><stop offset=".8" stop-color="#A9693F"/><stop offset="1" stop-color="#7C4A2C"/></radialGradient>' +
    '<linearGradient id="cc-gilt" x1="0" x2="0" y1="-132" y2="-84" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".3" stop-color="#EBC06A"/><stop offset=".52" stop-color="#B07A2A"/><stop offset=".72" stop-color="#E7BF68"/><stop offset="1" stop-color="#FFEBB0"/></linearGradient>' +
    '<linearGradient id="cc-brass-h" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#8A6226"/><stop offset=".3" stop-color="#E8C677"/><stop offset=".55" stop-color="#B98A3C"/><stop offset=".8" stop-color="#F0D48C"/><stop offset="1" stop-color="#93692A"/></linearGradient>' +
    '<linearGradient id="cc-brass-v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F3D993"/><stop offset=".45" stop-color="#C39243"/><stop offset="1" stop-color="#7E5820"/></linearGradient>' +
    '<radialGradient id="cc-knob" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#FFF5D2"/><stop offset=".3" stop-color="#E7C371"/><stop offset=".75" stop-color="#9E7130"/><stop offset="1" stop-color="#5F4114"/></radialGradient>' +
    '<linearGradient id="cc-bell" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#7A5320"/><stop offset=".25" stop-color="#F6DE9C"/><stop offset=".5" stop-color="#C99A48"/><stop offset=".85" stop-color="#8E6426"/><stop offset="1" stop-color="#5E3F12"/></linearGradient>' +
    '<radialGradient id="cc-lampglass" cx=".5" cy=".62" r=".7"><stop offset="0" stop-color="#FFF8E4"/><stop offset=".45" stop-color="#FBDDAA"/><stop offset="1" stop-color="#E7A867"/></radialGradient>' +
    '<radialGradient id="cc-globe" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#FFFDF6"/><stop offset=".55" stop-color="#FCEBD0"/><stop offset="1" stop-color="#EBC394"/></radialGradient>' +
    '<filter id="cc-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>' +
    '<filter id="cc-grain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".6 .025" numOctaves="2" seed="7"/>' +
    '<feColorMatrix values="0 0 0 0 .12 0 0 0 0 .2 0 0 0 0 .16 0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>';

  /* a door leaf: 75 x 232, jade stiles and rails, six glass panes, a raised panel, a brass kick plate and knob */
  function leafSvg(right) {
    var kx = right ? 5.2 : 69.8;
    var s = '<svg class="c-corridor-leafsvg" viewBox="0 0 75 232" width="75" height="232" focusable="false">' +
      '<path fill="url(#cc-jade-v)" fill-rule="evenodd" d="M0 0H75V232H0ZM10 10H65V144H10Z"/>' +
      '<path fill="#000" fill-rule="evenodd" filter="url(#cc-grain)" d="M0 0H75V232H0ZM10 10H65V144H10Z"/>' +
      '<path d="M.6 231.4V.6H74.4" fill="none" stroke="#86AF9E" stroke-width="1.2" stroke-opacity=".8"/>' +
      '<path d="M74.4 .6V231.4H.6" fill="none" stroke="#223D35" stroke-width="1.2" stroke-opacity=".7"/>' +
      '<rect x="10" y="10" width="55" height="134" fill="url(#cc-glass)"/>' +
      '<path d="M10 70L48 10H58L10 86Z" fill="#FFFDF6" fill-opacity=".09"/><path d="M10 112L65 30V40L10 120Z" fill="#FFFDF6" fill-opacity=".06"/>' +
      '<g fill="url(#cc-jade-lt)"><rect x="36" y="10" width="3" height="134"/><rect x="10" y="53.5" width="55" height="3"/><rect x="10" y="97.5" width="55" height="3"/></g>' +
      '<g fill="#2D4A40" fill-opacity=".55"><rect x="38.4" y="10" width=".9" height="134"/><rect x="10" y="56" width="55" height=".8"/><rect x="10" y="100" width="55" height=".8"/></g>' +
      '<path d="M10 144V10H65" fill="none" stroke="#2A463C" stroke-width="2"/><path d="M65 10V144H10" fill="none" stroke="#8DB4A3" stroke-width="1.3"/>' +
      '<rect x="12" y="157" width="51" height="42" fill="#46705F"/>' +
      '<path d="M12 199V157H63" fill="none" stroke="#2B483E" stroke-width="2"/><path d="M63 157V199H12" fill="none" stroke="#86AE9D" stroke-width="1.3"/>' +
      '<path d="M18 163H57L52 168H23Z" fill="#7AA493"/><path d="M57 163V193L52 188V168Z" fill="#3E6555"/><path d="M57 193H18L23 188H52Z" fill="#34584A"/><path d="M18 193V163L23 168V188Z" fill="#6D9887"/>' +
      '<rect x="23" y="168" width="29" height="20" fill="url(#cc-jade-v)"/>' +
      '<rect x="3" y="207" width="69" height="20" rx="1.2" fill="url(#cc-brass-h)"/>' +
      '<path d="M3 207.6H72" stroke="#FFF3CC" stroke-opacity=".7" stroke-width=".8"/><path d="M3 226.4H72" stroke="#5E4216" stroke-opacity=".6" stroke-width=".8"/>' +
      '<g fill="#6E4E1C"><circle cx="6.5" cy="210.5" r=".9"/><circle cx="68.5" cy="210.5" r=".9"/><circle cx="6.5" cy="223.5" r=".9"/><circle cx="68.5" cy="223.5" r=".9"/></g>' +
      '<rect x="' + (kx - 3.6) + '" y="105" width="7.2" height="31" rx="3.6" fill="url(#cc-brass-v)" stroke="#6A4A18" stroke-width=".5"/>' +
      '<ellipse cx="' + (kx + 0.8) + '" cy="117.4" rx="4.6" ry="2.4" fill="#2A1C0A" fill-opacity=".35"/>' +
      '<circle cx="' + kx + '" cy="114.6" r="4.3" fill="url(#cc-knob)"/>' +
      '<path d="M' + kx + ' 125.4a1.3 1.3 0 0 1 .7 2.4l.5 3h-2.4l.5-3a1.3 1.3 0 0 1 .7-2.4Z" fill="#3A280C"/>' +
      '</svg>';
    return s;
  }

  /* the door surround: jade pilasters and entablature, the arched fanlight with its gilded name, the transom bar */
  var SURROUND = '<svg class="c-corridor-surround" viewBox="-126 -208 252 370" width="252" height="370" focusable="false">' +
    /* its soft shadow on the plaster, painted once with the drawing (no live css filter) */
    '<g fill="#46301C" fill-opacity=".3" filter="url(#cc-soft)" transform="translate(0 5)"><rect x="-106" y="-180" width="34" height="340"/><rect x="72" y="-180" width="34" height="340"/><rect x="-123" y="-206" width="246" height="38"/></g>' +
    /* fanlight */
    '<path d="M-68 -82A68 68 0 0 1 68 -82Z" fill="url(#cc-tglass)"/>' +
    '<g stroke="url(#cc-jade-lt)" stroke-width="2"><path id="cc-spokes" d="M0 -82' + spokes() + '" fill="none"/></g>' +
    '<path d="M-56 -82A56 56 0 0 1 56 -82" fill="none" stroke="#4E7968" stroke-width="2.6"/>' +
    '<path d="M-56 -82A56 56 0 0 1 56 -82" fill="none" stroke="#8DB4A3" stroke-width=".7" transform="translate(0 -1.3)"/>' +
    '<path id="cc-arc" d="M-41 -84A41 41 0 0 1 41 -84" fill="none"/>' +
    '<text font-family="Fraunces, Georgia, serif" font-weight="600" font-size="12.8" letter-spacing="1.3" text-anchor="middle" fill="#2A1A0B" fill-opacity=".55" transform="translate(.7 .9)"><textPath href="#cc-arc" startOffset="50%">PURRLIGHT</textPath></text>' +
    '<text font-family="Fraunces, Georgia, serif" font-weight="600" font-size="12.8" letter-spacing="1.3" text-anchor="middle" fill="url(#cc-gilt)" stroke="#3A2412" stroke-width="1.1" stroke-linejoin="round" paint-order="stroke"><textPath href="#cc-arc" startOffset="50%">PURRLIGHT</textPath></text>' +
    '<text x="0" y="-90.5" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="7.4" letter-spacing="2.6" text-anchor="middle" fill="url(#cc-gilt)" stroke="#3A2412" stroke-width=".8" stroke-linejoin="round" paint-order="stroke">STUDIO</text>' +
    '<path d="M-14 -102.5H-8M8 -102.5H14" stroke="#E7BF68" stroke-width=".9"/>' +
    /* spandrels and the arch frame */
    '<path fill="url(#cc-jade-v)" fill-rule="evenodd" d="M-76 -172H76V-80H-76ZM-68 -82A68 68 0 0 1 68 -82Z"/>' +
    '<path fill="#000" fill-rule="evenodd" filter="url(#cc-grain)" d="M-76 -172H76V-80H-76ZM-68 -82A68 68 0 0 1 68 -82Z"/>' +
    '<path d="M-68 -82A68 68 0 0 1 68 -82" fill="none" stroke="#2C4A40" stroke-width="2.2"/>' +
    '<path d="M-74 -82A74 74 0 0 1 74 -82" fill="none" stroke="#86AE9D" stroke-width="1.1"/>' +
    '<path d="M-6 -151H6L4 -142H-4Z" fill="#6F9A88" stroke="#2C4A40" stroke-width=".6"/>' +
    '<circle cx="-56" cy="-150" r="3.2" fill="url(#cc-brass-v)"/><circle cx="56" cy="-150" r="3.2" fill="url(#cc-brass-v)"/>' +
    /* transom bar */
    '<rect x="-76" y="-86" width="152" height="7" fill="url(#cc-jade-lt)"/><path d="M-76 -79.4H76" stroke="#24403A" stroke-width="1.2"/><path d="M-76 -85.6H76" stroke="#9CC0AF" stroke-width=".8"/>' +
    /* pilasters, capitals, plinths */
    pilaster(-1) + pilaster(1) +
    /* entablature */
    '<rect x="-113" y="-192" width="226" height="22" fill="url(#cc-jade-v)"/>' +
    '<rect x="-113" y="-192" width="226" height="22" fill="#000" filter="url(#cc-grain)"/>' +
    '<path d="M-104 -187H104M-104 -175H104" stroke="#D7AE5C" stroke-width=".8" stroke-opacity=".9"/>' +
    '<rect x="-113" y="-170.5" width="226" height="2.5" fill="#2E4C42"/>' +
    '<path d="M-121 -192H121L117 -199H-117Z" fill="#6E9A88"/><rect x="-123" y="-206" width="246" height="7.5" fill="url(#cc-jade-lt)"/>' +
    '<path d="M-123 -205.4H123" stroke="#A9CBBB" stroke-width=".9"/><path d="M-121 -192H121" stroke="#24403A" stroke-width="1.4"/>' +
    '</svg>';
  function spokes() {
    var s = "", i, a, r1 = 56, r2 = 68, c = -82;
    for (i = 1; i < 12; i++) {
      a = Math.PI * i / 12;
      s += "M" + (-Math.cos(a) * r1).toFixed(2) + " " + (c - Math.sin(a) * r1).toFixed(2) + "L" + (-Math.cos(a) * r2).toFixed(2) + " " + (c - Math.sin(a) * r2).toFixed(2);
    }
    return s;
  }
  function pilaster(side) {
    var x = side < 0 ? -103 : 75, w = 28;
    var ix = x + 5, iw = w - 10;
    return '<rect x="' + x + '" y="-170" width="' + w + '" height="330" fill="url(#cc-jade-h)"/>' +
      '<rect x="' + x + '" y="-170" width="' + w + '" height="330" fill="#000" filter="url(#cc-grain)"/>' +
      '<rect x="' + ix + '" y="-150" width="' + iw + '" height="276" fill="#4A7464"/>' +
      '<path d="M' + ix + ' 126V-150H' + (ix + iw) + '" fill="none" stroke="#2A463C" stroke-width="1.5"/>' +
      '<path d="M' + (ix + iw) + ' -150V126H' + ix + '" fill="none" stroke="#8DB4A3" stroke-width="1"/>' +
      '<path d="M' + (x + w / 2) + ' -140V116" stroke="#35574B" stroke-width="1.2"/>' +
      '<rect x="' + (x - 3) + '" y="-180" width="' + (w + 6) + '" height="10" fill="url(#cc-jade-lt)"/>' +
      '<path d="M' + (x - 3) + ' -170.6H' + (x + w + 3) + '" stroke="#24403A" stroke-width="1.2"/>' +
      '<path d="M' + (x - 3) + ' -179.4H' + (x + w + 3) + '" stroke="#A9CBBB" stroke-width=".8"/>' +
      '<rect x="' + (x - 3) + '" y="134" width="' + (w + 6) + '" height="26" fill="#3F6455"/>' +
      '<path d="M' + (x - 3) + ' 134.6H' + (x + w + 3) + '" stroke="#86AE9D" stroke-width="1"/>' +
      '<rect x="' + (x - 3) + '" y="134" width="' + (w + 6) + '" height="26" fill="#000" filter="url(#cc-grain)"/>';
  }

  /* the shop bell on a scrolled bracket, hung from the right pilaster */
  var BELL = '<svg class="c-corridor-bellsvg" viewBox="0 0 50 70" width="50" height="70" focusable="false">' +
    '<rect x="33" y="3" width="11" height="15" rx="2" fill="url(#cc-brass-v)" stroke="#6A4A18" stroke-width=".5"/>' +
    '<circle cx="38.5" cy="6.5" r=".9" fill="#5E4214"/><circle cx="38.5" cy="14.5" r=".9" fill="#5E4214"/>' +
    '<path d="M37 10H14.5C9.5 10 8 15.5 12 16.6C15 17.4 16.4 13.6 13.4 13.2" fill="none" stroke="#7A5622" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M37 9.3H14.5" stroke="#F1D58E" stroke-width=".8" stroke-linecap="round"/></svg>' +
    /* the bell itself on its own element, so its swing runs on the compositor */
    '<span class="c-corridor-bellswing"><svg class="c-corridor-bellsvg" viewBox="0 0 50 70" width="50" height="70" focusable="false">' +
      '<path d="M14 10V16" stroke="#6A4A18" stroke-width="1.4"/>' +
      '<path d="M14 15C8.6 15 7.2 21 7.2 27C7.2 32 5.4 34.4 3 36.4H25C22.6 34.4 20.8 32 20.8 27C20.8 21 19.4 15 14 15Z" fill="url(#cc-bell)"/>' +
      '<path d="M10.2 19.5C9.4 22 9.2 26 9.4 30.5" stroke="#FFF6D6" stroke-opacity=".75" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="14" cy="36.4" rx="11" ry="2.1" fill="#8A6226"/><ellipse cx="14" cy="36" rx="10" ry="1.2" fill="#E9C77A"/>' +
      '<circle cx="14" cy="39.8" r="2.4" fill="url(#cc-knob)"/></svg></span>';

  /* a brass carriage lantern on a wall plate, its glass lit warm */
  var LAMP = '<svg viewBox="0 0 40 78" width="40" height="78" focusable="false">' +
    '<path d="M9 23H33L30 46H13Z" fill="#46301C" fill-opacity=".22" filter="url(#cc-soft)" transform="translate(2 6)"/>' +
    '<rect x="15.5" y="50" width="9" height="24" rx="2" fill="url(#cc-brass-v)" stroke="#6A4A18" stroke-width=".5"/>' +
    '<path d="M20 50V44" stroke="#7A5622" stroke-width="2.2"/>' +
    '<circle cx="20" cy="5.5" r="2.4" fill="url(#cc-knob)"/><path d="M7 19L20 8L33 19Z" fill="url(#cc-brass-h)" stroke="#6A4A18" stroke-width=".5"/>' +
    '<rect x="6" y="18.5" width="28" height="3.5" rx=".8" fill="url(#cc-brass-v)"/>' +
    '<path d="M8.5 22H31.5L28.5 41H11.5Z" fill="url(#cc-lampglass)" stroke="#8A6226" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M16 22.5L17 40.5M24 22.5L23 40.5" stroke="#8A6226" stroke-width=".8"/>' +
    '<ellipse cx="20" cy="33" rx="2.2" ry="4.5" fill="#FFFDF4"/>' +
    '<rect x="10.5" y="41" width="19" height="3.4" rx=".8" fill="url(#cc-brass-v)"/><path d="M16.5 44.4H23.5L20 48Z" fill="#8A6226"/></svg>';

  /* a pendant lamp with an opal globe, close under the ceiling (a flat card that always faces the visitor) */
  var PENDANT = '<i class="c-corridor-halo"></i><svg class="c-corridor-pendsvg" viewBox="0 0 40 50" width="40" height="50" focusable="false">' +
    '<ellipse cx="20" cy="1.6" rx="7" ry="2" fill="url(#cc-brass-h)"/><path d="M20 2V20" stroke="#5E4214" stroke-width=".9"/>' +
    '<path d="M14.5 20H25.5L24 25H16Z" fill="url(#cc-brass-h)"/>' +
    '<circle cx="20" cy="36.5" r="12" fill="url(#cc-globe)"/><ellipse cx="16.2" cy="31.6" rx="3.4" ry="2.1" fill="#fff" fill-opacity=".85"/></svg>';

  function plane(cls, inner, style) {
    return '<div class="c-corridor-p ' + cls + '"' + (style ? ' style="' + style + '"' : '') + '><div class="c-corridor-k">' + (inner || "") + '</div></div>';
  }
  /* a framed photograph hung on a side wall: its own crisp plane a hair in front of the paper, centred at depth zc */
  /* (Elise's photographs are shown as they are: no shading laid over them, only the frame and the light around it) */
  function wallFrame(side, zc, w, h, cls, src, pos) {
    var top = -10 - h / 2, x = side < 0 ? -87.2 : 87.2, z = side < 0 ? -(zc - w / 2) : -(zc + w / 2);
    return plane("c-corridor-framep",
      '<span class="c-corridor-frame ' + cls + '" style="--cord:' + (top + 107) + 'px">' +
        '<span class="c-corridor-mat"><img src="' + img(src) + '" alt="" decoding="async" style="object-position:' + pos + '"></span></span>',
      "--w:" + w + "px;--h:" + h + "px;transform:translate3d(" + x + "px," + top + "px," + z + "px) rotateY(" + (side < 0 ? 90 : -90) + "deg) scale(calc(1 / var(--k)))");
  }
  function sconce(x) { return '<span class="c-corridor-sconce" style="left:' + (x - 11) + 'px"><i></i></span>'; }
  /* depth into the corridor (from the facade) to each side wall's own x */
  function lx(z) { return z - 14; }
  function rx(z) { return L - z; }

  function scene() {
    var paper = '<span class="c-corridor-wains"></span><span class="c-corridor-rails"></span><span class="c-corridor-shade"></span>';
    return '' +
      /* the corridor */
      plane("c-corridor-floor") +
      plane("c-corridor-ceil", '<i class="c-corridor-rose" style="top:' + lx(190) + 'px"></i>') +
      plane("c-corridor-wall c-corridor-wall-l", paper + sconce(lx(310)) + sconce(lx(482))) +
      plane("c-corridor-wall c-corridor-wall-r", paper + sconce(rx(150)) + sconce(rx(392))) +
      wallFrame(-1, 215, 78, 78, "c-corridor-frame--gilt", "assets/img/products/bennet-darcy-set-600.webp", "50% 40%") +
      wallFrame(-1, 405, 72, 72, "c-corridor-frame--wood", "assets/img/products/saint-joan-of-arc-doll-600.webp", "50% 30%") +
      wallFrame(1, 282, 74, 74, "c-corridor-frame--wood", "assets/img/products/americana-doll-bag-charm-600.webp", "50% 45%") +
      plane("c-corridor-pendant", PENDANT) +
      plane("c-corridor-jamb c-corridor-jamb-l") + plane("c-corridor-jamb c-corridor-jamb-r") + plane("c-corridor-jamb c-corridor-jamb-t") +
      /* outside: the terrace and the plaster wall (small tiles, built to fit the screen in layout()), the step, the
         jade surround */
      '<div class="c-corridor-g c-corridor-g-street"></div>' + plane("c-corridor-sill") + plane("c-corridor-riser") +
      '<div class="c-corridor-leaf c-corridor-leaf-l">' + plane("c-corridor-face", leafSvg(false) + '<i class="c-corridor-sheen"></i><i class="c-corridor-turn"></i>') + '</div>' +
      '<div class="c-corridor-leaf c-corridor-leaf-r">' + plane("c-corridor-face", leafSvg(true) +
        '<span class="c-corridor-card"><span>Made by hand.</span><span>Made to be kept.</span></span>' +
        '<i class="c-corridor-sheen"></i><i class="c-corridor-turn"></i>') + '</div>';
  }
  /* the end wall: its arch of warm light and Merlin's real portrait above it, a flat layer under the 3D corridor (see STOP) */
  function endWall() {
    return '<div class="c-corridor-endflat" aria-hidden="true"><div class="c-corridor-endk"><i class="c-corridor-arch"></i>' +
      '<span class="c-corridor-merlin"><i class="c-corridor-piclight"></i>' +
      '<span class="c-corridor-frame c-corridor-frame--gilt c-corridor-frame--oval"><span class="c-corridor-mat">' +
        '<img src="' + img("assets/img/home/merlin-real-360.webp") + '" alt="" decoding="async" style="object-position:50% 34%"></span></span>' +
      '<span class="c-corridor-nameplate">the cat who takes notes</span></span></div></div>';
  }
  /* the shopfront wall itself: a flat layer above the 3D scene (a plane at the door's depth only ever grows about the
     eye as we walk, so a 2D scale keyed to the same camera curve matches it exactly, and Chrome paints it in full) */
  function front() {
    return '<div class="c-corridor-front" aria-hidden="true">' +
      '<span class="c-corridor-walls"><i class="c-corridor-plaster c-corridor-plaster-l"></i><i class="c-corridor-plaster c-corridor-plaster-r"></i><i class="c-corridor-plaster c-corridor-plaster-t"></i></span>' +
      '<span class="c-corridor-lamp c-corridor-lamp-l">' + LAMP + '</span><span class="c-corridor-lamp c-corridor-lamp-r">' + LAMP + '</span>' +
      SURROUND + '<span class="c-corridor-bell">' + BELL + '</span></div>';
  }

  function build() {
    if (done) return;
    try {
      ov = document.createElement("div");
      ov.className = "c-corridor-ov";
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-labelledby", "c-corridor-line");
      ov.tabIndex = -1;   /* focus goes into the dialog without drawing a ring on the scene */
      ov.innerHTML =
        '<svg class="c-corridor-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' + DEFS + '</defs></svg>' +
        endWall() + '<div class="c-corridor-stage" aria-hidden="true"><div class="c-corridor-head"><div class="c-corridor-look"><div class="c-corridor-cam">' +
          scene() +
        '</div></div></div></div>' + front() + '<div class="c-corridor-vignette" aria-hidden="true"></div>' +
        '<div class="c-corridor-hit" aria-hidden="true"></div>' +
        '<button class="c-corridor-skip" type="button">Skip intro</button>' +
        '<p class="c-corridor-line" id="c-corridor-line">Sketched by Merlin,<br><span>stitched by us.</span></p>' +
        '<button class="c-corridor-go" type="button"><span>Come in</span></button>' +
        '<div class="c-corridor-bloom" aria-hidden="true"></div>';
      document.body.insertBefore(ov, document.body.firstChild);
      gStreet = ov.querySelector(".c-corridor-g-street");
      kfStyle = document.createElement("style");
      ov.appendChild(kfStyle);
      hit = ov.querySelector(".c-corridor-hit");
      layout();
      d.classList.add("c-corridor-built");
      [].forEach.call(document.body.children, function (n) {
        if (n !== ov && n.tagName !== "SCRIPT" && !n.hasAttribute("inert")) { n.setAttribute("inert", ""); inerted.push(n); }
      });
      ov.querySelector(".c-corridor-go").addEventListener("click", open);
      hit.addEventListener("click", open);
      ov.querySelector(".c-corridor-skip").addEventListener("click", function (e) { e.stopPropagation(); finish(); });
      /* once walking, a tap anywhere fast-forwards (the tap that opened the door has already landed) */
      ov.addEventListener("pointerdown", function (e) {
        if (state !== "walking") return;
        if (e.target && e.target.closest && e.target.closest(".c-corridor-skip")) return;
        fastForward();
      });
      document.addEventListener("keydown", onKey, true);
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("resize", onResize);
      if (reduceMq) {
        onReduce = function () { if (reduceMq.matches) finish(); };
        if (reduceMq.addEventListener) reduceMq.addEventListener("change", onReduce); else if (reduceMq.addListener) reduceMq.addListener(onReduce);
      }
      try { ov.focus({ preventScroll: true }); } catch (e) { ov.focus(); }
    } catch (err) {
      finish();   /* never let the welcome block the shop */
    }
  }
  onReady(build);
})();
