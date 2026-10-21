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
try { pr = load("custom-orders/prices.js", ["PRICES", "PAY", "ORDER_FORM_URL"]); }
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
  }
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
byExt(".html").forEach(function (f) {
  var h = readText(f).replace(/<!--[\s\S]*?-->/g, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, function (tag) { return tag.replace(/>[\s\S]*$/, ">"); });
  var m, attr = /\s(?:src|href|poster)\s*=\s*(["'])([\s\S]*?)\1/g, set = /\ssrcset\s*=\s*(["'])([\s\S]*?)\1/g;
  while ((m = attr.exec(h))) checkRef(f, m[2]);
  while ((m = set.exec(h))) m[2].split(",").forEach(function (part) { checkRef(f, part.trim().split(/\s+/)[0]); });
  cssRefs(f, h);   /* style="…url()…" and <style> blocks */
});
byExt(".css").forEach(function (f) { cssRefs(f, readText(f)); });
counts.refs = refs;

/* ---------- result ---------- */
if (errors.length) {
  console.error("check-site: " + errors.length + " lỗi — chưa được deploy:\n");
  errors.forEach(function (e) { console.error("  ✗ " + e); });
  process.exit(1);
}
console.log("check-site: OK — " + counts.js + " file JS, " + (counts.products || 0) + " món, " + (counts.sales || 0) + " sale, " +
  (counts.prices || 0) + " giá Custom Orders, " + counts.json + " file JSON, " + counts.refs + " đường dẫn file.");
