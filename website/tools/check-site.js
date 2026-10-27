#!/usr/bin/env node
/* ============================================================
   Purrlight Studio — check the site before it goes live
   ------------------------------------------------------------
   deploy-pages.sh runs this on the committed files and stops the deploy on
   any error, so a missing comma or a price typed as text never empties the
   live shop. Run it yourself any time:   node website/tools/check-site.js
   No install needed (plain Node). Not published: deploy removes tools/.

   It checks: every .js file parses; js/products.js loads and each piece has
   an id, a name, a canon collection, a number price, a photo that exists,
   details and an Etsy link; SALES / QUIET / NOT_HANDMADE / SAFETY_LINE_SKIP
   name real pieces; the gown sale matches in products.js and prices.js;
   custom-orders/prices.js has no price typed as text; every .json parses and
   content/follow.json is in shape; every local file an HTML or CSS file
   points at exists.
   ============================================================ */
"use strict";
var fs = require("fs");
var path = require("path");
var vm = require("vm");
var childProcess = require("child_process");

var ROOT = path.resolve(process.argv[2] || path.join(__dirname, ".."));
var errors = [];
var counts = {};
function fail(where, msg) { errors.push(where + ": " + msg); }
function rel(f) { return path.relative(ROOT, f).split(path.sep).join("/") || "."; }
function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (d) {
    if (d.name === ".git" || d.name === "node_modules") return;
    var f = path.join(dir, d.name);
    if (d.isDirectory()) walk(f, out); else out.push(f);
  });
  return out;
}
var FILES = walk(ROOT, []);
var byExt = function (ext) { return FILES.filter(function (f) { return path.extname(f) === ext; }); };
/* exact-case file list: GitHub Pages is case-sensitive even when this Mac's disk is not */
var SITE = new Set(FILES.map(rel));
var HAS_CNAME = SITE.has("CNAME");   /* own domain: "/x" means the site root; on github.io/purrlight-skills/ it does not */
function has(p) {   /* p: a path relative to the site root */
  p = path.posix.normalize(p).replace(/^\.\//, "");
  if (p === ".." || p.indexOf("../") === 0) return false;
  return SITE.has(p) || SITE.has(p.replace(/\/?$/, "/index.html"));
}
var exists = has;
var readText = function (f) { return fs.readFileSync(f, "utf8").replace(/^\uFEFF/, ""); };
/* the same rule as isSaleTime() in js/products.js: a real date and time, e.g. 2026-10-26T05:00:00Z */
function isSaleTime(t) {
  var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.exec(typeof t === "string" ? t : "");
  if (!m || isNaN(Date.parse(t))) return false;
  var days = new Date(Date.UTC(+m[1], +m[2], 0)).getUTCDate();
  return +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= days && +m[4] < 24 && +m[5] < 60 && !(m[6] && +m[6] > 59);
}

/* ---------- every script parses ---------- */
byExt(".js").forEach(function (f) {
  try { childProcess.execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); }
  catch (e) { fail(rel(f), "lỗi cú pháp (thiếu dấu phẩy, ngoặc, dấu nháy?)\n    " + String(e.stderr || e.message).trim().split("\n").slice(0, 4).join("\n    ")); }
});
counts.js = byExt(".js").length;

/* ---------- load a browser script in a sandbox and read its top-level names ---------- */
function load(file, names) {
  var src = readText(path.join(ROOT, file));
  var warns = [];
  var box = { console: { log: function () {}, warn: function (m) { warns.push(String(m)); }, error: function (m) { warns.push(String(m)); } },
    setTimeout: function () {}, Date: Date, Math: Math, JSON: JSON };
  var grab = names.map(function (n) { return JSON.stringify(n) + ": typeof " + n + ' !== "undefined" ? ' + n + " : undefined"; }).join(", ");
  vm.runInNewContext(src + "\n;this.__out = {" + grab + "};", box, { filename: file });
  return { out: box.__out, warns: warns };
}

/* ---------- the catalog ---------- */
var cat = null;
try { cat = load("js/products.js", ["PRODUCTS", "SALES", "QUIET", "NOT_HANDMADE", "SAFETY_LINE_SKIP", "CATEGORIES", "ETSY_SHOP_URL"]); }
catch (e) { fail("js/products.js", "không chạy được: " + e.message); }
if (cat) {
  var C = cat.out, P = Array.isArray(C.PRODUCTS) ? C.PRODUCTS : [];
  cat.warns.forEach(function (w) { fail("js/products.js", w); });
  if (!P.length) fail("js/products.js", "PRODUCTS trống hoặc không phải danh sách");
  var names = (C.CATEGORIES || []).map(function (c) { return c.name; });
  var photo = function (at, what, src) {   /* product photos are written into the page as they are: no leading "/" */
    if (typeof src !== "string" || !src) fail(at, "thiếu ảnh " + what);
    else if (src.charAt(0) === "/" && !HAS_CNAME) fail(at, what + ' "' + src + '" bắt đầu bằng "/" — trên github.io/purrlight-skills/ ảnh sẽ hỏng; bỏ dấu "/" đầu');
    else if (!exists(src.replace(/^\/+/, ""))) fail(at, "không thấy ảnh " + what + " " + src + " (tên file phải đúng cả chữ hoa/thường)");
  };
  (C.CATEGORIES || []).forEach(function (c) { photo("js/products.js CATEGORIES", '"' + c.name + '" img', c.img); });
  var ids = {};
  P.forEach(function (p, i) {
    var at = "js/products.js món #" + (i + 1) + (p && p.id ? ' "' + p.id + '"' : "");
    if (!p || typeof p !== "object") { fail(at, "không phải một khối { … }"); return; }
    if (typeof p.id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) fail(at, "id phải là chữ thường-nối-gạch, vd \"maine-coon-cat\"");
    else if (ids[p.id]) fail(at, "id bị trùng"); else ids[p.id] = true;
    if (typeof p.name !== "string" || !p.name.trim()) fail(at, "thiếu name");
    if (names.indexOf(p.category) < 0) fail(at, 'category "' + p.category + '" không có trong CATEGORIES');
    var price = p.regular != null ? p.regular : p.price;   /* a running sale has already moved the full price to p.regular */
    if (typeof price !== "number" || !isFinite(price) || price <= 0) fail(at, 'price phải là số, vd 55 — không phải "55" hay "$55" (đang là ' + JSON.stringify(price) + ")");
    if (p.priceFrom != null && typeof p.priceFrom !== "boolean") fail(at, "priceFrom chỉ là true hoặc false");
    if (["", "made-to-order", "new", "the-original", undefined].indexOf(p.badge) < 0) fail(at, 'badge "' + p.badge + '" không có (dùng "", "made-to-order", "new" hoặc "the-original")');
    photo(at, "img", p.img);
    if (p.imgLarge != null) photo(at, "imgLarge", p.imgLarge);
    if (p.imgLargeW != null && typeof p.imgLargeW !== "number") fail(at, "imgLargeW phải là số (chiều rộng ảnh lớn, px)");
    if (typeof p.desc !== "string" || !p.desc.trim()) fail(at, "thiếu desc");
    if (!Array.isArray(p.details) || !p.details.length || p.details.some(function (d) { return typeof d !== "string"; })) fail(at, 'details phải là danh sách chữ, vd ["…", "…"]');
    if (typeof p.etsyUrl !== "string" || !/^https:\/\/www\.etsy\.com\/listing\/\d+/.test(p.etsyUrl)) fail(at, "etsyUrl phải là link https://www.etsy.com/listing/…");
  });
  ["QUIET", "NOT_HANDMADE", "SAFETY_LINE_SKIP"].forEach(function (k) {
    if (!Array.isArray(C[k])) { fail("js/products.js", k + " phải là danh sách"); return; }
    C[k].forEach(function (id) { if (!ids[id]) fail("js/products.js " + k, 'không có món nào id "' + id + '"'); });
  });
  if (!C.SALES || typeof C.SALES !== "object") fail("js/products.js", "SALES phải là { … } (để trống {} khi không có sale)");
  else Object.keys(C.SALES).forEach(function (id) {   /* off / ends / id were checked by products.js itself (its warnings above) */
    if (typeof C.SALES[id].through !== "string" || !C.SALES[id].through.trim()) fail("js/products.js SALES", '"' + id + '": thiếu dòng through (chữ khách thấy)');
  });
  counts.products = P.length;
  counts.sales = C.SALES ? Object.keys(C.SALES).length : 0;
}

/* ---------- Custom Orders prices ---------- */
var pr = null;
try { pr = load("custom-orders/prices.js", ["PRICES", "PAY", "ORDER_FORM_URL", "MERLIN_SCENE", "summaryLine", "pickParts", "estGodparent"]); }
catch (e) { fail("custom-orders/prices.js", "không chạy được: " + e.message); }
if (pr) {
  pr.warns.forEach(function (w) { fail("custom-orders/prices.js", w); });
  var leaves = 0;
  (function scan(v, at) {
    if (typeof v === "number") { leaves++; if (!isFinite(v) || v < 0) fail("custom-orders/prices.js " + at, "số không hợp lệ: " + v); }
    else if (typeof v === "string") { if (/^\s*\$?\s*\d+(\.\d+)?\s*$/.test(v) && !/(^|\.)(through|day|label|ends)$/.test(at)) fail("custom-orders/prices.js " + at, 'giá gõ thành chữ "' + v + '" — bỏ dấu nháy và dấu $'); }
    else if (Array.isArray(v)) v.forEach(function (x, i) { scan(x, at + "[" + i + "]"); });
    else if (v && typeof v === "object") Object.keys(v).forEach(function (k) { scan(v[k], at ? at + "." + k : k); });
  })(pr.out.PRICES, "PRICES");
  if (!pr.out.PRICES) fail("custom-orders/prices.js", "không thấy PRICES");
  counts.prices = leaves;
  /* the gown sale lives in both files */
  var g = pr.out.PRICES && pr.out.PRICES.christening && pr.out.PRICES.christening.gownSale;
  var s = cat && cat.out.SALES && cat.out.SALES["christening-gown-set"];
  var gownSkipped = cat && cat.warns.some(function (w) { return w.indexOf('"christening-gown-set"') > -1; });   /* already reported */
  var live = function (x) { return x && Date.now() < Date.parse(x.ends); };
  if (g && (typeof g.off !== "number" || !(g.off >= 1 && g.off <= 90) || !isSaleTime(g.ends))) fail("custom-orders/prices.js gownSale", "off phải là số 1–90 và ends dạng 2026-10-26T05:00:00Z");
  else if (!gownSkipped && (live(g) || live(s))) {
    if (!g || !s || g.off !== s.off || Date.parse(g.ends) !== Date.parse(s.ends)) fail("sale bộ đầm rửa tội", "js/products.js SALES và custom-orders/prices.js gownSale lệch nhau (off/ends) — sửa cả hai cho giống");
  }
}

/* ---------- the booth sells at the web's prices (Elise 21/10/2026) ---------- */
if (pr && pr.out.PRICES) {
  var desk = readText(path.join(ROOT, "js/event-desk.js"));
  var grid = function (name) {   /* e.g. doll: { Petite: [45, 85], Classic: [80, 160], Grand: [130, 245] } */
    var m = new RegExp("\\b" + name + ":\\s*\\{([^}]*)\\}").exec(desk), out = {};
    if (!m) return null;
    m[1].replace(/(\w+):\s*\[([^\]]*)\]/g, function (_, k, v) { out[k] = v.split(",").map(Number); return ""; });
    return out;
  };
  var P2 = pr.out.PRICES, dg = grid("doll"), cg = grid("cat");
  if (!dg || !cg) fail("js/event-desk.js", "không đọc được bảng giá booth (customGrid: cat / doll)");
  else {
    if (!dg.Classic || dg.Classic[0] !== P2.portraitDoll.base) fail("giá búp bê", "booth Classic 1 con $" + (dg.Classic && dg.Classic[0]) + " ≠ web Custom Portrait Doll $" + P2.portraitDoll.base + " — sửa js/event-desk.js và custom-orders/prices.js cho giống");
    (P2.pet.sizes || []).forEach(function (size) {
      if (JSON.stringify(cg[size]) !== JSON.stringify(P2.pet.table[size])) fail("giá thú cưng " + size, "booth " + JSON.stringify(cg[size]) + " ≠ web " + JSON.stringify(P2.pet.table[size]) + " — sửa cả hai cho giống");
    });
    /* gridListings: an Etsy listing that is a grid piece rings up at the grid at the booth (Elise 21/10/2026) —
       a renamed id would silently put the Etsy price back on the booth chip */
    var gl = /\bgridListings:\s*\{([\s\S]*?)\n\s*\}/.exec(desk), ids = new Set((cat && Array.isArray(cat.out.PRODUCTS) ? cat.out.PRODUCTS : []).map(function (p) { return p.id; })), nGl = 0;
    if (!gl) fail("js/event-desk.js", "không thấy gridListings (món Etsy tính theo bảng giá booth)");
    else gl[1].replace(/"([^"]+)":\s*\{\s*kind:\s*"(\w+)",\s*size:\s*"(\w+)"\s*\}/g, function (_, id, kind, size) {
      nGl++;
      var g = kind === "cat" ? cg : kind === "doll" ? dg : null;
      if (!ids.has(id)) fail("js/event-desk.js gridListings", "\"" + id + "\" không có trong js/products.js");
      if (!g || !g[size]) fail("js/event-desk.js gridListings", "\"" + id + "\": " + kind + " / " + size + " không có trong bảng giá booth");
      return "";
    });
    if (gl && !nGl) fail("js/event-desk.js gridListings", "không đọc được dòng nào (dạng \"id\": { kind: \"cat\", size: \"Grand\" })");
  }
}

/* ---------- deposit: PAY (prices.js) = the #pay cards in custom-orders/index.html (plan 21/10/2026) ---------- */
if (pr && pr.out.PAY) {
  var PAYX = pr.out.PAY, coHtml = readText(path.join(ROOT, "custom-orders/index.html")), WAYS = ["zelle", "venmo", "square", "stripe"];
  var wayBlock = function (key) {   /* the card's HTML, from its opening tag to the next card or the end of the list */
    var i = coHtml.indexOf('data-pay="' + key + '"');
    if (i < 0) return null;
    var start = coHtml.lastIndexOf("<div", i), rest = coHtml.slice(i), stop = rest.search(/<div class="pay-(way|done)"/);
    return { open: coHtml.slice(start, coHtml.indexOf(">", i) + 1), html: coHtml.slice(start, stop > 0 ? i + stop : undefined) };
  };
  var attr = function (html, sel) { var m = new RegExp("<[^>]*" + sel + "[^>]*>").exec(html || ""); return m ? m[0] : ""; };
  var hrefOf = function (tag) { var m = /\shref="([^"]*)"/.exec(tag); return m ? m[1].replace(/&amp;/g, "&") : null; };
  var textOf = function (html, sel) { var m = new RegExp("<[^>]*" + sel + "[^>]*>([^<]*)<").exec(html || ""); return m ? m[1].trim() : null; };
  if (!Array.isArray(PAYX.order) || !PAYX.order.length) fail("custom-orders/prices.js PAY.order", "phải là danh sách các cách trả, ví dụ [\"zelle\", \"venmo\", \"square\", \"stripe\"]");
  else PAYX.order.forEach(function (key, i) {
    var where = "custom-orders/prices.js PAY." + key;
    if (WAYS.indexOf(key) < 0) { fail("custom-orders/prices.js PAY.order", "\"" + key + "\" chưa có thẻ trên trang (chỉ có " + WAYS.join(", ") + ")"); return; }
    if (PAYX.order.indexOf(key) !== i) fail("custom-orders/prices.js PAY.order", "\"" + key + "\" bị lặp");
    var m = PAYX[key];
    if (!m || typeof m !== "object") { fail(where, "thiếu"); return; }
    var data = key === "zelle" ? m.to : key === "venmo" ? m.handle : m.url;
    if (typeof data !== "string") { fail(where, "phải có " + (key === "zelle" ? "to" : key === "venmo" ? "handle" : "url") + " (để \"\" nếu chưa có)"); return; }
    var b = wayBlock(key);
    if (!b) { fail("custom-orders/index.html", "không thấy thẻ data-pay=\"" + key + "\" trong #pay"); return; }
    var hidden = /\shidden(\s|>|=)/.test(b.open);
    if (!data && !hidden) fail("custom-orders/index.html", "thẻ " + key + " đang hiện nhưng PAY." + key + " trống — thêm hidden vào thẻ");
    if (data && hidden) fail("custom-orders/index.html", "thẻ " + key + " đang ẩn (hidden) nhưng PAY." + key + " đã có — bỏ hidden");
    ["back", "notes"].forEach(function (k) { if (k in m && typeof m[k] !== "boolean") fail(where + "." + k, "phải là true hoặc false (không có dấu nháy)"); });
    if (m.qr && !has(path.posix.normalize("custom-orders/" + m.qr))) fail(where + ".qr", "không thấy ảnh " + m.qr);
    if (!data) return;
    if (key === "zelle") {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data)) fail(where + ".to", "không giống địa chỉ email: " + data);
      if (textOf(b.html, "data-zelle-to") !== data) fail("custom-orders/index.html", "địa chỉ Zelle trong thẻ ≠ PAY.zelle.to (" + data + ") — sửa cả hai cho giống");
    } else if (key === "venmo") {
      if (!/^@[A-Za-z0-9_-]{5,30}$/.test(data)) fail(where + ".handle", "phải có dạng @tên (5–30 chữ, số, - hoặc _): " + data);
      if (textOf(b.html, "data-venmo-to") !== data) fail("custom-orders/index.html", "tên Venmo trong thẻ ≠ PAY.venmo.handle (" + data + ") — sửa cả hai cho giống");
    } else {
      if (!/^https:\/\/[^\s?#]+$/.test(data)) fail(where + ".url", "phải là link https không có dấu ? hay # (trang tự thêm số cọc khi được phép): " + data);
      else if (key === "square" && !/^https:\/\/(square\.link\/u\/[A-Za-z0-9]+|checkout\.square\.site\/merchant\/[A-Za-z0-9\/_-]+)$/.test(data)) fail(where + ".url", "không phải link Square (square.link/u/…): " + data);
      else if (key === "stripe") {
        if (!/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(data)) fail(where + ".url", "không phải link Stripe (buy.stripe.com/…): " + data);
        else if (/^https:\/\/buy\.stripe\.com\/test_/.test(data)) fail(where + ".url", "đây là link chế độ thử (test_) — dùng link thật");
        if (!(Number.isInteger(m.minCents) && Number.isInteger(m.maxCents) && m.minCents >= 50 && m.minCents <= m.maxCents)) fail(where, "minCents / maxCents phải là số cent nguyên, 50 ≤ minCents ≤ maxCents");
      }
      if (hrefOf(attr(b.html, "data-pay-link")) !== data) fail("custom-orders/index.html", "link nút " + key + " ≠ PAY." + key + ".url — sửa cả hai cho giống");
    }
  });
  /* a card left out of PAY.order must carry hidden (the page hides it too); the "or in Venmo" words show with the Venmo card only */
  var listed = Array.isArray(PAYX.order) ? PAYX.order : [];
  WAYS.forEach(function (key) {
    var b = wayBlock(key);
    if (listed.indexOf(key) < 0 && b && !/\shidden(\s|>|=)/.test(b.open)) fail("custom-orders/index.html", "thẻ " + key + " không có trong PAY.order nhưng đang hiện — thêm hidden vào thẻ, hoặc thêm \"" + key + "\" vào PAY.order");
  });
  var venmoOn = listed.indexOf("venmo") > -1 && PAYX.venmo && typeof PAYX.venmo.handle === "string" && PAYX.venmo.handle !== "";
  var vw = attr(coHtml, "data-venmo-word");
  if (!vw) fail("custom-orders/index.html", "thiếu <span data-venmo-word> (chữ \" or in Venmo\" trong khối \"I've sent my deposit\")");
  else if (/\shidden(\s|>|=)/.test(vw) === venmoOn) fail("custom-orders/index.html", venmoOn ? "chữ \" or in Venmo\" đang ẩn nhưng đã có Venmo — bỏ hidden ở <span data-venmo-word>" : "chữ \" or in Venmo\" đang hiện nhưng chưa có Venmo — thêm hidden vào <span data-venmo-word>");
  if (PAYX.thanks !== "thanks.html" || !has("custom-orders/thanks.html")) fail("custom-orders/prices.js PAY.thanks", "phải là \"thanks.html\" và có file custom-orders/thanks.html");
}
/* the thank-you page: never indexed, never reads the address's query (a provider's "st=Completed" must never become "paid") */
if (has("custom-orders/thanks.html")) {
  if (!/<meta name="robots" content="noindex, nofollow">/.test(readText(path.join(ROOT, "custom-orders/thanks.html")))) fail("custom-orders/thanks.html", "thiếu <meta name=\"robots\" content=\"noindex, nofollow\">");
  var tj = has("custom-orders/thanks.js") ? readText(path.join(ROOT, "custom-orders/thanks.js")) : "";
  if (!tj) fail("custom-orders/thanks.js", "không có file");
  else if (/location\s*\.\s*(search|href)|URLSearchParams|document\s*\.\s*(URL|location)/.test(tj)) fail("custom-orders/thanks.js", "không được đọc địa chỉ trang (location.search / location.href / URLSearchParams)");
  /* the letter's delivery table (thanks.js GETS) = the order page's ways (custom-orders.js GET_IT picks + DELIVERY names):
     a pick word missing there and every letter for that way shows the line as sent (Elise 21/10, the letter) */
  var coJs = has("custom-orders/custom-orders.js") ? readText(path.join(ROOT, "custom-orders/custom-orders.js")) : "";
  var getsBlock = (/var GETS = \{([\s\S]*?)\n  \};/.exec(tj) || [])[1] || "", GETS = null;
  try { GETS = vm.runInNewContext("({" + getsBlock + "\n})"); } catch (e) { GETS = null; }
  var dm = /var DELIVERY = (\{[^}]*\})/.exec(coJs), DELIV = null;
  try { DELIV = dm ? vm.runInNewContext("(" + dm[1] + ")") : null; } catch (e) { DELIV = null; }
  if (!getsBlock || !GETS) fail("custom-orders/thanks.js", "không thấy bảng GETS (cách nhận hàng của lá thư)");
  else if (!DELIV) fail("custom-orders/custom-orders.js", "không đọc được DELIVERY (tên các cách nhận hàng)");
  else {
    Object.keys(DELIV).forEach(function (k) { if (!GETS[DELIV[k]]) fail("custom-orders/thanks.js GETS", "thiếu cách nhận hàng \"" + DELIV[k] + "\" (DELIVERY trong custom-orders.js)"); });
    /* each GET_IT pick: under its own way in GETS, and readable by the letter (pickParts) */
    var re = /(\w+): \{ name: "[^"]+",[^\n]*?pick: "([^"]+)"/g, m2, seen = 0;
    while ((m2 = re.exec(coJs))) {
      var key = m2[1], pick = m2[2], way = DELIV[key];
      seen++;
      if (!way) { fail("custom-orders/custom-orders.js GET_IT." + key, "không có trong DELIVERY"); continue; }
      if (!GETS[way] || !Array.isArray(GETS[way].picks) || GETS[way].picks.indexOf(pick) < 0) fail("custom-orders/thanks.js GETS", 'thiếu chữ "' + pick + '" trong picks của "' + way + '" (GET_IT.' + key + ".pick trong custom-orders.js)");
      if (pr && pr.out.summaryLine && pr.out.pickParts && pr.out.estGodparent) {
        var parts = pr.out.pickParts(pr.out.summaryLine("X", pr.out.estGodparent({ count: 1 }), pick), "X");
        if (!parts || parts.how !== pick) fail("custom-orders/custom-orders.js GET_IT." + key + ".pick", 'lá thư không đọc được chữ "' + pick + '" — không dùng dấu · hoặc — trong chữ này');
      }
    }
    if (seen !== Object.keys(DELIV).length - 1) fail("custom-orders/custom-orders.js GET_IT", "đọc được " + seen + " cách nhận hàng có pick, cần " + (Object.keys(DELIV).length - 1) + " (mọi cách trừ Digital file)");
  }
}
/* the Merlin scene: on only with Elise's approval date and all 8 files */
if (pr && pr.out.MERLIN_SCENE) {
  var MS = pr.out.MERLIN_SCENE;
  if (MS.on !== true && MS.on !== false) fail("custom-orders/prices.js MERLIN_SCENE.on", "phải là true hoặc false");
  if (MS.on === true) {
    if (!(isSaleTime(String(MS.approved) + "T00:00:00Z") && /^\d{4}-\d{2}-\d{2}$/.test(String(MS.approved)))) fail("custom-orders/prices.js MERLIN_SCENE", "on: true cần ngày Elise duyệt ở approved (dạng 2026-10-25)");
    ["assets/video/merlin-order-960.mp4", "assets/video/merlin-order-960.webm", "assets/video/merlin-order-phone-640.mp4", "assets/video/merlin-order-phone-640.webm",
     "assets/img/custom/merlin-order-poster-960.webp", "assets/img/custom/merlin-order-poster-phone-640.webp", "assets/img/custom/merlin-order-still-960.webp", "assets/img/custom/merlin-order-still-phone-640.webp"]
      .forEach(function (f) { if (!has(f)) fail("MERLIN_SCENE", "on: true nhưng thiếu file " + f); });
  }
  var cc = Array.isArray(MS.cc) ? MS.cc : null, lastEnd = -1;
  if (!cc) fail("custom-orders/prices.js MERLIN_SCENE.cc", "phải là danh sách [giây bắt đầu, giây kết thúc, \"chữ\"]");
  else cc.forEach(function (c, i) {
    if (!Array.isArray(c) || typeof c[0] !== "number" || typeof c[1] !== "number" || typeof c[2] !== "string" || !(c[0] < c[1]) || c[0] < lastEnd) fail("custom-orders/prices.js MERLIN_SCENE.cc[" + i + "]", "phải là [bắt đầu, kết thúc, \"chữ\"], theo thứ tự thời gian, không chồng nhau");
    else lastEnd = c[1];
  });
}

/* ---------- JSON files, and the follow strip ---------- */
var json = {};
byExt(".json").forEach(function (f) {
  try { json[rel(f)] = JSON.parse(readText(f)); }
  catch (e) { fail(rel(f), "JSON hỏng: " + e.message); }
});
var F = json["content/follow.json"];
if (F) {
  var NETS = ["instagram", "tiktok", "pinterest", "facebook"];
  var url = function (u) { return u === "" || (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u)); };
  Object.keys(F.profiles || {}).forEach(function (k) {
    if (NETS.indexOf(k) < 0) fail("content/follow.json profiles", 'mạng "' + k + '" không có');
    else if (!url(F.profiles[k] == null ? "" : F.profiles[k])) fail("content/follow.json profiles." + k, "phải là link https://… hoặc để trống");
  });
  if (!Array.isArray(F.tiles)) fail("content/follow.json", "tiles phải là danh sách");
  else F.tiles.forEach(function (t, i) {
    var at = "content/follow.json ảnh #" + (i + 1);
    var img = String(t.image || "").split("#")[0].split("?")[0].replace(/^\/+/, "");   /* as js/follow.js reads it */
    try { img = decodeURIComponent(img); } catch (e) { /* left as typed */ }
    if (!/^https:\/\//.test(img) && !exists(img)) fail(at, "không thấy ảnh " + t.image + " (tên file phải đúng cả chữ hoa/thường)");
    if (typeof t.alt !== "string" || !t.alt.trim()) fail(at, "thiếu alt (mô tả ảnh)");
    if (NETS.indexOf(t.network) < 0) fail(at, 'network "' + t.network + '" không có');
    if (!url(t.link == null ? "" : t.link)) fail(at, "link phải là https://… hoặc để trống");
  });
}
counts.json = Object.keys(json).length;

/* ---------- local files that HTML and CSS point at ---------- */
var refs = 0;
function checkRef(file, ref) {
  ref = ref.trim().replace(/&amp;/g, "&");
  /* any scheme (https:, mailto:, webcal:, sms:…), an in-page #anchor, //host, or a value built by a script */
  if (!ref || /^[a-z][a-z0-9+.-]*:/i.test(ref) || /^(#|\/\/)/.test(ref) || /[{}+$]/.test(ref)) return;
  var clean = ref.split("#")[0].split("?")[0];
  try { clean = decodeURIComponent(clean); } catch (e) { fail(rel(file), 'đường dẫn có dấu "%" lạ: ' + ref + ' (dấu cách viết %20, dấu % viết %25)'); return; }
  if (!clean) return;
  refs++;
  /* 404.html is served at any missing address and any depth, so it is the one page written from the site root */
  if (rel(file) === "404.html") {
    if (HAS_CNAME && clean.indexOf("/purrlight-skills/") === 0) { fail(rel(file), '"' + ref + '": có CNAME (web ở tên miền riêng) — bỏ "/purrlight-skills" khỏi mọi đường dẫn trong 404.html'); return; }
    if (clean.indexOf(SITE_ROOT) !== 0) { fail(rel(file), '"' + ref + '" phải bắt đầu bằng "' + SITE_ROOT + '"' + (HAS_CNAME ? " (có CNAME: web ở tên miền riêng, bỏ /purrlight-skills)" : "") + " — trang này hiện ở mọi địa chỉ sai, kể cả /a/b/c, nên đường dẫn tương đối sẽ hỏng"); return; }
    if (!has(clean.slice(SITE_ROOT.length) || "index.html")) fail(rel(file), "trỏ tới file không có: " + ref + " (tên file phải đúng cả chữ hoa/thường)");
    return;
  }
  if (clean.charAt(0) === "/" && !HAS_CNAME) { fail(rel(file), '"' + ref + '" bắt đầu bằng "/" — trên github.io/purrlight-skills/ link này hỏng; viết đường dẫn tương đối'); return; }
  var target = clean.charAt(0) === "/" ? clean.slice(1) : path.posix.join(path.posix.dirname(rel(file)), clean);
  if (!has(target)) fail(rel(file), "trỏ tới file không có: " + ref + " (tên file phải đúng cả chữ hoa/thường)");
}
var CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g, CSS_IMPORT = /@import\s+(['"])([^'"]+)\1/g;
function cssRefs(f, c) {
  var m;
  c = c.replace(/\/\*[\s\S]*?\*\//g, "");
  while ((m = CSS_URL.exec(c))) checkRef(f, m[2]);
  while ((m = CSS_IMPORT.exec(c))) checkRef(f, m[2]);
}
/* no <base> anywhere: it changes where every link on the page goes (404.html writes its paths from the root instead) */
var SITE_ROOT = HAS_CNAME ? "/" : "/purrlight-skills/";
byExt(".html").forEach(function (f) {
  if (/<base\b/i.test(readText(f).replace(/<!--[\s\S]*?-->/g, ""))) fail(rel(f), "có thẻ <base> — bỏ đi (nó đổi đích của mọi link trong trang)");
});
byExt(".html").forEach(function (f) {
  var h = readText(f).replace(/<!--[\s\S]*?-->/g, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, function (tag) { return tag.replace(/>[\s\S]*$/, ">"); });
  var m, attr = /\s(?:src|href|poster)\s*=\s*(["'])([\s\S]*?)\1/g, set = /\ssrcset\s*=\s*(["'])([\s\S]*?)\1/g;
  while ((m = attr.exec(h))) checkRef(f, m[2]);
  while ((m = set.exec(h))) m[2].split(",").forEach(function (part) { checkRef(f, part.trim().split(/\s+/)[0]); });
  cssRefs(f, h);   /* style="…url()…" and <style> blocks */
});
byExt(".css").forEach(function (f) { cssRefs(f, readText(f)); });
counts.refs = refs;

/* ---------- home page: the favorites and collection tiles written into index.html (seen without JavaScript and by
   search engines and link previews, 25/10) = products.js and js/main.js. js/main.js redraws them with live prices and
   sales; change a name, a full price, a photo, a badge, a collection or the favorites in both places. ---------- */
var decodeEnt = function (t) {   /* the HTML entities a hand edit may use, so a correct spelling never blocks a deploy */
  var named = { amp: "&", apos: "'", quot: '"', rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", nbsp: " ", mdash: "—", ndash: "–" };
  return String(t || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, function (all, e) {
    if (e[0] === "#") { var n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return isNaN(n) ? all : String.fromCharCode(n); }
    return Object.prototype.hasOwnProperty.call(named, e.toLowerCase()) ? named[e.toLowerCase()] : all;
  });
};
var sameText = function (a, b) {   /* ’ and ' count as the same apostrophe */
  var n = function (t) { return decodeEnt(t).replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim(); };
  return n(a) === n(b);
};
if (cat && has("index.html") && has("js/main.js")) {
  var home = readText(path.join(ROOT, "index.html")).replace(/<!--[\s\S]*?-->/g, "");
  var PP = Array.isArray(cat.out.PRODUCTS) ? cat.out.PRODUCTS : [], CC = cat.out.CATEGORIES || [];
  var money = function (n) { return "$" + Number(n).toFixed(2).replace(/\.00$/, ""); };
  var mainSrc = readText(path.join(ROOT, "js/main.js"));
  var BADGES = {}, bm, badgeRe = /p\.badge === "([a-z-]+)"\) badge = '(<span class="badge [a-z-]+">[^<]*<\/span>)'/g;   /* the labels cardHTML() writes */
  while ((bm = badgeRe.exec(mainSrc))) BADGES[bm[1]] = bm[2];
  if (!Object.keys(BADGES).length) fail("js/main.js", "không đọc được nhãn (badge) trong cardHTML() — sửa check-site.js theo");
  var favSrc = (/var favIds = \[([^\]]*)\]/.exec(mainSrc) || [])[1] || "";
  var favIds = (favSrc.match(/"([^"]+)"/g) || []).map(function (q) { return q.slice(1, -1); });
  var favOpen = home.search(/<div[^>]*\sdata-favorites[\s>]/), favGrid = "";
  if (favOpen > -1) { var fe = home.indexOf("</section>", favOpen); favGrid = home.slice(favOpen, fe > -1 ? fe : undefined); }
  var cardRe = /<a class="product-card"([^>]*)>([\s\S]*?)<\/a>/g, cm, staticIds = [];
  while ((cm = cardRe.exec(favGrid))) {
    var attrs = cm[1], body = cm[2], sidM = /\sdata-static-id="([^"]+)"/.exec(attrs);
    if (!sidM) { fail("index.html", "một thẻ sản phẩm viết sẵn trong [data-favorites] thiếu data-static-id"); continue; }
    var sid = sidM[1], sp = PP.filter(function (x) { return x.id === sid; })[0];
    staticIds.push(sid);
    if (!sp) { fail("index.html", 'món viết sẵn "' + sid + '" không có trong js/products.js'); continue; }
    var g = function (re, src) { var x = re.exec(src === undefined ? body : src); return x ? x[1] : null; };
    if (decodeEnt(g(/\shref="([^"]*)"/, attrs)) !== "product.html?id=" + encodeURIComponent(sid)) fail("index.html", 'link món viết sẵn "' + sid + '" phải là product.html?id=' + encodeURIComponent(sid));
    if (!sameText(g(/<h3>([\s\S]*?)<\/h3>/), sp.name)) fail("index.html", 'tên món viết sẵn "' + sid + '" ≠ products.js ("' + sp.name + '")');
    var want = (sp.priceFrom ? '<span class="price-from">from</span> ' : "") + money(sp.regular || sp.price);
    if (String(g(/<p class="price">([\s\S]*?)<\/p>/) || "").trim() !== want) fail("index.html", 'giá món viết sẵn "' + sid + '" phải là giá gốc ' + money(sp.regular || sp.price) + (sp.priceFrom ? ' (có chữ "from")' : "") + " như products.js");
    if (g(/<img src="([^"]+)"/) !== sp.img) fail("index.html", 'ảnh món viết sẵn "' + sid + '" ≠ products.js (' + sp.img + ")");
    var srcset = g(/\ssrcset="([^"]*)"/), wantSet = sp.imgLarge ? sp.img + " 600w, " + sp.imgLarge + " " + (sp.imgLargeW || 1000) + "w" : null;
    if ((srcset || null) !== wantSet) fail("index.html", 'srcset món viết sẵn "' + sid + '" ≠ products.js (' + (wantSet || "không có ảnh lớn — bỏ srcset") + ")");
    if (!sameText(g(/<p class="card-cat">([\s\S]*?)<\/p>/), sp.category)) fail("index.html", 'danh mục món viết sẵn "' + sid + '" ≠ products.js ("' + sp.category + '")');
    var badgeHas = g(/(<span class="badge [^"]*">[\s\S]*?<\/span>)/), badgeWant = BADGES[sp.badge] || null;
    if (sp.badge && !badgeWant) fail("js/main.js", 'cardHTML() không có nhãn cho badge "' + sp.badge + '" (món ' + sid + ")");
    else if (badgeHas || badgeWant ? !(badgeHas && badgeWant && sameText(badgeHas, badgeWant)) : false) fail("index.html", 'nhãn món viết sẵn "' + sid + '" phải là ' + (badgeWant || "không có nhãn") + " như js/main.js cardHTML() với badge \"" + (sp.badge || "") + '"');
  }
  if (staticIds.join(",") !== favIds.join(",")) fail("index.html", "các món viết sẵn (" + staticIds.join(", ") + ") ≠ favIds trong js/main.js (" + favIds.join(", ") + ")");
  var tileRe = /<a class="cat-tile" href="shop\.html\?cat=([^"]+)">[\s\S]*?<img src="([^"]+)"[\s\S]*?<\/span><span>([\s\S]*?)<\/span><\/a>/g, tm, tiles = [];
  while ((tm = tileRe.exec(home))) tiles.push({ q: (function () { try { return decodeURIComponent(decodeEnt(tm[1])); } catch (e) { return tm[1]; } })(), img: tm[2], name: tm[3] });
  if (tiles.length !== CC.length) fail("index.html", "có " + tiles.length + " ô danh mục viết sẵn, CATEGORIES trong products.js có " + CC.length);
  CC.forEach(function (c, i) {
    var t = tiles[i];
    if (t && (!sameText(t.name, c.name) || t.q !== c.name || t.img !== c.img)) fail("index.html", "ô danh mục viết sẵn thứ " + (i + 1) + ' ≠ CATEGORIES "' + c.name + '" (tên, link hoặc ảnh)');
  });
}
/* every Etsy link written into the pages (data-etsy) = ETSY_SHOP_URL in products.js — js/main.js sets them too, but
   without JavaScript the written one is what a visitor gets (25/10) */
if (cat && cat.out.ETSY_SHOP_URL) byExt(".html").forEach(function (f) {
  var h = readText(f).replace(/<!--[\s\S]*?-->/g, ""), m, re = /<a\b[^>]*\sdata-etsy\b[^>]*>/g;
  while ((m = re.exec(h))) {
    var href = (/\shref="([^"]*)"/.exec(m[0]) || [])[1];
    if (decodeEnt(href) !== cat.out.ETSY_SHOP_URL) fail(rel(f), 'link data-etsy "' + href + '" ≠ ETSY_SHOP_URL (' + cat.out.ETSY_SHOP_URL + ")");
  }
});

/* ---------- Custom Orders "Questions before you order" (27/10): the answers repeat sentences that live elsewhere on the
   page (refund terms, tax, deposit, shipping) — each [data-copy-of="id"] must equal that element word for word, and the
   FAQ JSON-LD must equal the visible questions (the seasonal Christmas one, .xmas-only, stays out of the JSON-LD) ---------- */
if (has("custom-orders/index.html")) {
  var coHtml = readText(path.join(ROOT, "custom-orders/index.html")).replace(/<!--[\s\S]*?-->/g, "");
  var plain = function (h) { return decodeEnt(String(h || "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(); };
  var byId = function (id) {
    var m = new RegExp('<(\\w+)[^>]*\\sid="' + id + '"[^>]*>([\\s\\S]*?)</\\1>').exec(coHtml);
    return m ? plain(m[2]) : null;
  };
  var cm2, copyRe = /<(\w+)[^>]*\sdata-copy-of="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g, copies = 0;
  while ((cm2 = copyRe.exec(coHtml))) {
    copies++;
    var src = byId(cm2[2]);
    if (src === null) fail("custom-orders/index.html", 'data-copy-of="' + cm2[2] + '": không có phần tử id="' + cm2[2] + '"');
    else if (plain(cm2[3]) !== src) fail("custom-orders/index.html", 'câu hỏi đáp chép "' + cm2[2] + '" đã lệch với bản gốc trên trang — sửa cả hai cùng lúc');
  }
  var pm2, partRe = /<(\w+)[^>]*\sdata-part-of="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  while ((pm2 = partRe.exec(coHtml))) {
    var whole = byId(pm2[2]);
    if (whole === null) fail("custom-orders/index.html", 'data-part-of="' + pm2[2] + '": không có phần tử id="' + pm2[2] + '"');
    else if (whole.toLowerCase().indexOf(plain(pm2[3]).toLowerCase()) === -1) fail("custom-orders/index.html", 'đoạn chép "' + plain(pm2[3]).slice(0, 40) + '…" không còn nằm trong "' + pm2[2] + '" — sửa cả hai cùng lúc');
  }
  var faqItems = [], fm, faqRe = /<details class="faq-item([^"]*)"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/details>/g;
  var GUARDED = /<(\w+)[^>]*\sdata-(?:copy|part)-of="[^"]+"[^>]*>[\s\S]*?<\/\1>/g;
  while ((fm = faqRe.exec(coHtml))) {
    /* every answer quotes the page: the whole <p> or parts of it marked data-copy-of / data-part-of, and the words in
       between carry no numbers (times, rounds, prices, dates live only in the quoted parts, so they cannot go stale) */
    var whole2 = /^<p[^>]*\sdata-copy-of=/.test(fm[0].slice(fm[0].indexOf("<p", fm[0].indexOf("</summary>"))));
    var glue = whole2 ? "" : plain(fm[3].replace(GUARDED, " "));
    if (!whole2 && !GUARDED.test(fm[3])) fail("custom-orders/index.html", 'câu hỏi đáp "' + plain(fm[2]) + '" không chép câu nào trên trang (cần data-copy-of hoặc data-part-of)');
    else if (/\d/.test(glue)) fail("custom-orders/index.html", 'câu hỏi đáp "' + plain(fm[2]) + '" có con số ngoài phần chép ("' + glue.slice(0, 50) + '") — đưa nó vào phần chép từ trang');
    GUARDED.lastIndex = 0;
    if (fm[1].indexOf("xmas-only") === -1) faqItems.push({ q: plain(fm[2]), a: plain(fm[3]) });
  }
  if (/<section\b[^>]*\bid="faq"[^>]*\shidden\b/.test(coHtml) && /id="faq-ld"/.test(coHtml)) fail("custom-orders/index.html", "phần hỏi đáp đang ẩn (hidden) mà FAQ JSON-LD vẫn còn — ẩn thì bỏ cả JSON-LD");
  var ldm = /<script type="application\/ld\+json" id="faq-ld">([\s\S]*?)<\/script>/.exec(coHtml);
  if (faqItems.length || ldm) {
    var ld = null;
    try { ld = ldm ? JSON.parse(ldm[1]) : null; } catch (e) { fail("custom-orders/index.html", "FAQ JSON-LD không đọc được: " + e.message); }
    var ents = ld && ld.mainEntity ? ld.mainEntity : [];
    if (ldm && ents.length !== faqItems.length) fail("custom-orders/index.html", "FAQ JSON-LD có " + ents.length + " câu, trang hiện " + faqItems.length + " câu");
    faqItems.forEach(function (it, i) {
      var e = ents[i];
      if (!e || e.name !== it.q || !e.acceptedAnswer || e.acceptedAnswer.text !== it.a) fail("custom-orders/index.html", 'FAQ JSON-LD câu ' + (i + 1) + ' ("' + it.q + '") ≠ chữ hiện trên trang');
    });
  }
}

/* ---------- result ---------- */
if (errors.length) {
  console.error("check-site: " + errors.length + " lỗi — chưa được deploy:\n");
  errors.forEach(function (e) { console.error("  ✗ " + e); });
  process.exit(1);
}
console.log("check-site: OK — " + counts.js + " file JS, " + (counts.products || 0) + " món, " + (counts.sales || 0) + " sale, " +
  (counts.prices || 0) + " giá Custom Orders, " + counts.json + " file JSON, " + counts.refs + " đường dẫn file.");
