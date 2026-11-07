/* PREVIEW (06/11) — copied from ../haven/cat-cursor.js for haven3d; additions: the .cat-hot class (the 3D canvas gets
   the same kitten pointer while it hovers a pickable piece on the shelf) and window.catHop(x, y) so a click on a 3D
   piece gets the same hop as a click on a link.
   The cat that comes with the pointer. On a mouse, hovering a button or link shows a pointer with a
   small ginger kitten (never Merlin, who is a tuxedo); on any click or tap of a button/link a kitten hops up from the
   spot and fades (600 ms). Reduced motion: the pointer still changes, no hop. Plain ES5, no library. */
(function () {
  var face = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'>" +
    "<path d='M2 7 L3 1 L7.5 4.5 Z' fill='%23E8A87C' stroke='%239C5325' stroke-width='.8' stroke-linejoin='round'/>" +
    "<path d='M16 7 L15 1 L10.5 4.5 Z' fill='%23E8A87C' stroke='%239C5325' stroke-width='.8' stroke-linejoin='round'/>" +
    "<circle cx='9' cy='10' r='7.2' fill='%23E8A87C' stroke='%239C5325' stroke-width='.8'/>" +
    "<path d='M4.6 6.8 q1.2 -1 2 .2 M13.4 6.8 q-1.2 -1 -2 .2' stroke='%23C4763F' stroke-width='.7' fill='none' stroke-linecap='round'/>" +
    "<ellipse cx='9' cy='12.4' rx='3.6' ry='2.7' fill='%23FFF3E6'/>" +
    "<circle cx='6.3' cy='9.4' r='1' fill='%234A423B'/><circle cx='11.7' cy='9.4' r='1' fill='%234A423B'/>" +
    "<path d='M8.1 11.5 h1.8 l-.9 1z' fill='%23DB426B'/></svg>";
  var cursor = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>" +
    "<path d='M2 2 L2 18 L6.2 14 L9.2 20.2 L11.8 19 L8.9 13 L14.6 13 Z' fill='%23FFFBF4' stroke='%234A423B' stroke-width='1.3' stroke-linejoin='round'/>" +
    "<g transform='translate(14 14)'>" + face.replace(/^<svg[^>]*>|<\/svg>$/g, "") + "</g></svg>";
  var css = "@media (hover: hover) and (pointer: fine) {" +
    "[data-cat-cursor] a, [data-cat-cursor] button, [data-cat-cursor] [role=button], [data-cat-cursor] .cat-hot { cursor: url(\"data:image/svg+xml," + cursor + "\") 2 2, pointer; } }" +
    ".cat-hop { position: fixed; z-index: 2147483600; width: 26px; height: 26px; margin: -13px 0 0 -13px; pointer-events: none;" +
    " background: url(\"data:image/svg+xml," + face + "\") center / contain no-repeat; animation: cat-hop .6s cubic-bezier(.2,.7,.3,1) forwards; }" +
    "@keyframes cat-hop { 0% { opacity: 0; transform: translate(10px, 0) scale(.6); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(14px, -30px) scale(1); } }" +
    "@media (prefers-reduced-motion: reduce) { .cat-hop { display: none; } }";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  document.documentElement.setAttribute("data-cat-cursor", "");
  /* on click (not pointerdown, so a scroll that starts on a button never sets it off). When the click leaves the page,
     the kitten gets 300 ms to hop before the browser moves on (preview only; on the site it would ride the page fade). */
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");
  function hop(x, y) {
    var s = document.createElement("span");
    s.className = "cat-hop";
    s.setAttribute("aria-hidden", "true");
    s.style.left = x + "px";
    s.style.top = y + "px";
    document.body.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
  }
  window.catHop = hop;   /* haven3d: used by the 3D shelf when a piece is clicked */
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("a, button, [role=button]") : null;
    if (!t || e.defaultPrevented) return;
    var x = e.clientX, y = e.clientY;
    if (!x && !y) { var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }   /* keyboard */
    hop(x, y);
    var leaving = t.tagName === "A" && t.href && t.target !== "_blank" && !e.metaKey && !e.ctrlKey && !e.shiftKey && t.getAttribute("href").charAt(0) !== "#";
    if (leaving && !(calm && calm.matches)) { e.preventDefault(); var href = t.href; setTimeout(function () { location.href = href; }, 300); }
  }, true);   /* capture: a button that stops the click still gets its kitten */
})();
