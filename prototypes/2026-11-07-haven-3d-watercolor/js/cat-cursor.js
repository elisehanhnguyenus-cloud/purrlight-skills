/* PREVIEW (v3, 07/11) — the cat from the Purrlight logo rides the pointer.
   Owner request 07/11: "Icon con trỏ chính là chú mèo trong logo, chứ không phải tạo thành 1 kiểu mặt mèo." So the pointer
   and the click hop use ONLY assets/logo-cat.png (an exact-pixel cut of the real logo's cat): scaled, never redrawn,
   traced or recoloured. Nothing else is drawn but a tiny ivory pointer tip at the hotspot (so clicks stay precise) and a
   soft ivory halo behind the cat (contrast on the berry buttons).
   - Fine pointers (mouse, trackpad): over links, buttons, [role=button] and .cat-hot (pickable pieces on the 3D shelf,
     the open door) the cursor becomes tip + logo cat. CSS cursors need a URL, so the images are data URLs made here at
     run time from logo-cat.png on a canvas: 34 px at 1x, 51 px at 1.5x, 68 px at 2x (image-set), hotspot at the tip.
   - Any click or tap of a link/button: the logo cat hops up from the spot and fades (600 ms). window.catHop(x, y) lets
     the 3D shelf do the same for a picked piece.
   - Reduced motion: the pointer still changes, no hop.
   Plain ES5, no library. The image path comes from data-cat on the script tag, else ../assets/logo-cat.png next to this
   file. */
(function () {
  var me = document.currentScript;
  var SRC = (me && me.getAttribute("data-cat")) || (me && me.src ? new URL("../assets/logo-cat.png", me.src).href : "assets/logo-cat.png");
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");
  var root = document.documentElement;
  var HOT = "[data-cat-cursor] a[href], [data-cat-cursor] button:not(:disabled), [data-cat-cursor] [role=button], [data-cat-cursor] .cat-hot";

  /* the hop: the logo cat itself (aspect 171:224), a small arc up and to the right, a little tilt, fading out */
  var base = ".cat-hop { position: fixed; z-index: 2147483600; width: 30px; height: 39px; margin: -36px 0 0 -6px; pointer-events: none;" +
    " background: url(\"" + SRC + "\") center / contain no-repeat; filter: drop-shadow(0 0 1.5px #FFFBF4) drop-shadow(0 0 2px rgba(255, 251, 244, .9));" +
    " transform-origin: 50% 100%; animation: cat-hop .62s cubic-bezier(.2, .7, .3, 1) forwards; }" +
    "@keyframes cat-hop { 0% { opacity: 0; transform: translate(4px, 10px) scale(.55) rotate(-8deg); }" +
    " 22% { opacity: 1; transform: translate(8px, -6px) scale(.9) rotate(4deg); }" +
    " 55% { opacity: 1; transform: translate(13px, -20px) scale(1) rotate(-3deg); }" +
    " 100% { opacity: 0; transform: translate(18px, -30px) scale(1) rotate(2deg); } }" +
    "@media (prefers-reduced-motion: reduce) { .cat-hop { display: none; } }";
  var st = document.createElement("style");
  st.textContent = base;
  document.head.appendChild(st);
  root.setAttribute("data-cat-cursor", "");

  /* ---- cursor images ---- */
  function cursorURL(img, k) {
    /* 34 css px: room for the cat and its halo (nothing clipped at the canvas edge); 68 device px at 2x (cursors <= 128) */
    var S = 34, c = document.createElement("canvas");
    c.width = c.height = Math.round(S * k);
    var g = c.getContext("2d");
    if (!g) return null;
    g.scale(k, k);
    /* the logo cat right at the tip, so the cat itself is the pointer: 22 x 28.8 css px (aspect 171:224 kept exactly) */
    var cw = 22, ch = cw * img.naturalHeight / img.naturalWidth, cx = 3.5, cy = 2.0;
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    /* a soft ivory halo hugging its lines (contrast on the berry buttons): only the SHADOW of an off-canvas copy is drawn
       (shadow offsets are device px, untouched by the scale), so the cat's own pixels are drawn exactly once */
    g.save(); g.shadowColor = "rgba(255, 251, 244, 1)"; g.shadowBlur = 2.2 * k; g.shadowOffsetX = 1000 * k; g.shadowOffsetY = 0;
    g.drawImage(img, cx - 1000, cy, cw, ch); g.drawImage(img, cx - 1000, cy, cw, ch);
    g.restore();
    g.drawImage(img, cx, cy, cw, ch);   /* the cat, exact pixels (only scaled), drawn once */
    /* the pointer tip: a tiny ivory arrowhead with an ink edge, its point is the hotspot (1, 1) */
    g.beginPath();
    g.moveTo(1, 1); g.lineTo(1, 7.5); g.lineTo(2.8, 6); g.lineTo(4, 8.6); g.lineTo(5.2, 8); g.lineTo(4, 5.5); g.lineTo(6.2, 5.3); g.closePath();
    g.lineJoin = "round"; g.lineWidth = 1.05; g.strokeStyle = "#4A423B"; g.fillStyle = "#FFFBF4";
    g.fill(); g.stroke();
    try { return c.toDataURL("image/png"); } catch (e) { return null; }
  }
  function buildCursor(img) {
    var u1 = cursorURL(img, 1), u15 = cursorURL(img, 1.5), u2 = cursorURL(img, 2);
    if (!u1) return;
    var set = "url(\"" + u1 + "\") 1x, url(\"" + u15 + "\") 1.5x, url(\"" + u2 + "\") 2x";
    var css = "@media (hover: hover) and (pointer: fine) { " + HOT + " {" +
      " cursor: url(\"" + u1 + "\") 1 1, pointer;" +
      " cursor: -webkit-image-set(" + set + ") 1 1, pointer;" +
      " cursor: image-set(" + set + ") 1 1, pointer; } }";
    var s2 = document.createElement("style");
    s2.id = "cat-cursor-css";
    s2.textContent = css;
    document.head.appendChild(s2);
    root.setAttribute("data-cat-cursor-ready", "");
    window.catCursor = { x1: u1, x15: u15, x2: u2 };   /* tests: the generated images */
  }
  var img = new Image();
  img.decoding = "async";
  img.onload = function () { try { buildCursor(img); } catch (e) { /* keep the system pointer */ } };
  img.src = SRC;

  /* ---- the hop ---- */
  function hop(x, y) {
    if (calm && calm.matches) return;
    var s = document.createElement("span");
    s.className = "cat-hop";
    s.setAttribute("aria-hidden", "true");
    s.style.left = x + "px";
    s.style.top = y + "px";
    document.body.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
  }
  window.catHop = hop;   /* haven3d: used by the 3D shelf when a piece is clicked */
  /* on click (not pointerdown, so a scroll that starts on a button never sets it off). When the click leaves the page,
     the cat gets 300 ms to hop before the browser moves on (preview only; on the site it would ride the page fade). */
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("a, button, [role=button]") : null;
    if (!t || e.defaultPrevented) return;
    var x = e.clientX, y = e.clientY;
    if (!x && !y) { var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }   /* keyboard */
    hop(x, y);
    var leaving = t.tagName === "A" && t.href && t.target !== "_blank" && !e.metaKey && !e.ctrlKey && !e.shiftKey && t.getAttribute("href").charAt(0) !== "#";
    if (leaving && !(calm && calm.matches)) { e.preventDefault(); var href = t.href; setTimeout(function () { location.href = href; }, 300); }
  }, true);   /* capture: a button that stops the click still gets its cat */
})();
