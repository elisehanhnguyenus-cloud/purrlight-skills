/* PREVIEW ONLY (01/11) — switches the whole preview site into one of three experience directions, so Elise can
   browse every page in that direction. ?concept=book|corridor|house turns one on (kept for this tab), ?concept=off
   turns it off. When on: html[data-concept=<name>] is set, and css/c-<name>.css + js/c-<name>.js load right here in
   the <head> (render-blocking, so page-to-page transitions see the styles on the very first frame). The plain
   welcome door (js/intro.js) stays out of the way while a direction is on. Never shipped to website/. */
(function () {
  var d = document.documentElement, q = location.search, name = null, KEY = "pl-concept", OK = { book: 1, corridor: 1, house: 1 };
  var m = /[?&]concept=([a-z]+)/.exec(q);
  try {
    if (m) { if (OK[m[1]]) { sessionStorage.setItem(KEY, m[1]); } else { sessionStorage.removeItem(KEY); } }
    name = sessionStorage.getItem(KEY);
  } catch (e) { name = m && OK[m[1]] ? m[1] : null; }
  if (!name || !OK[name]) return;
  var me = document.currentScript, base = me ? me.src.replace(/js\/concept-boot\.js.*$/, "") : "";
  d.setAttribute("data-concept", name);
  window.PL_CONCEPT = { name: name, base: base };
  document.write('<link rel="stylesheet" href="' + base + 'css/c-' + name + '.css">');
  document.write('<script src="' + base + 'js/c-' + name + '.js"><\/script>');
  var LABEL = { book: "Hướng 1 · Cuốn sách", corridor: "Hướng 2 · Cửa và hành lang", house: "Hướng 3 · Ngôi nhà 3 tầng" };
  function chip() {
    var c = document.createElement("div");
    c.className = "pl-concept-chip";
    c.setAttribute("translate", "no");
    c.innerHTML = '<span>Bản thử: ' + LABEL[name] + '</span> <a href="' + base + 'index.html?concept=' + name + '&amp;intro=1">Xem lại màn chào</a> <a href="' + base + 'index.html?concept=off">Thoát</a>';
    var s = c.style;
    s.position = "fixed"; s.left = "10px"; s.bottom = "10px"; s.zIndex = "2147482000"; s.font = "600 12px/1.3 system-ui, sans-serif";
    s.background = "rgba(59,42,32,.88)"; s.color = "#FBF6EE"; s.padding = "7px 10px"; s.borderRadius = "10px"; s.maxWidth = "calc(100vw - 20px)";
    s.display = "flex"; s.flexWrap = "wrap"; s.gap = "4px 10px"; s.alignItems = "center";
    [].forEach.call(c.querySelectorAll("a"), function (a) { a.style.color = "#F6DCC4"; a.style.textDecoration = "underline"; });
    document.body.appendChild(c);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", chip); else chip();
})();
