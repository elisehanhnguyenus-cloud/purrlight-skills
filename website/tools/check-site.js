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
function rel(f) { return path.relative(ROOT, f) || "."; }
function exists(p) { return fs.existsSync(path.join(ROOT, p)); }
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

/* ---------- every script parses ---------- */
byExt(".js").forEach(function (f) {
  try { childProcess.execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); }
  catch (e) { fail(rel(f), "lỗi cú pháp (thiếu dấu phẩy, ngoặc, dấu nháy?)\n    " + String(e.stderr || e.message).trim().split("\n").slice(0, 4).join("\n    ")); }
});
counts.js = byExt(".js").length;

/* ---------- load a browser script in a sandbox and read its top-level names ---------- */
function load(file, names) {
  var src = fs.readFileSync(path.join(ROOT, file), "utf8");
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
  (C.CATEGORIES || []).forEach(function (c) { if (!c.img || !exists(c.img)) fail("js/products.js CATEGORIES", '"' + c.name + '": không thấy ảnh ' + c.img); });
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
    if (typeof p.img !== "string" || !exists(p.img)) fail(at, "không thấy ảnh img " + p.img);
    if (p.imgLarge != null && (typeof p.imgLarge !== "string" || !exists(p.imgLarge))) fail(at, "không thấy ảnh imgLarge " + p.imgLarge);
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
  else Object.keys(C.SALES).forEach(function (id) {
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
  var live = function (x) { return x && Date.now() < Date.parse(x.ends); };
  if (live(g) || live(s)) {
    if (!g || !s || g.off !== s.off || g.ends !== s.ends) fail("sale bộ đầm rửa tội", "js/products.js SALES và custom-orders/prices.js gownSale lệch nhau (off/ends) — sửa cả hai cho giống");
  }
}

/* ---------- JSON files, and the follow strip ---------- */
var json = {};
byExt(".json").forEach(function (f) {
  try { json[rel(f)] = JSON.parse(fs.readFileSync(f, "utf8")); }
  catch (e) { fail(rel(f), "JSON hỏng: " + e.message); }
});
var F = json[path.join("content", "follow.json")];
if (F) {
  var NETS = ["instagram", "tiktok", "pinterest", "facebook"];
  var url = function (u) { return u === "" || (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u)); };
  Object.keys(F.profiles || {}).forEach(function (k) {
    if (NETS.indexOf(k) < 0) fail("content/follow.json profiles", 'mạng "' + k + '" không có');
    else if (!url(F.profiles[k])) fail("content/follow.json profiles." + k, "phải là link https://… hoặc để trống");
  });
  if (!Array.isArray(F.tiles)) fail("content/follow.json", "tiles phải là danh sách");
  else F.tiles.forEach(function (t, i) {
    var at = "content/follow.json ảnh #" + (i + 1);
    var img = String(t.image || "").replace(/^\/+/, "");
    if (!/^https:\/\//.test(img) && !exists(img)) fail(at, "không thấy ảnh " + t.image);
    if (typeof t.alt !== "string" || !t.alt.trim()) fail(at, "thiếu alt (mô tả ảnh)");
    if (NETS.indexOf(t.network) < 0) fail(at, 'network "' + t.network + '" không có');
    if (!url(t.link == null ? "" : t.link)) fail(at, "link phải là https://… hoặc để trống");
  });
}
counts.json = Object.keys(json).length;

/* ---------- local files that HTML and CSS point at ---------- */
var refs = 0;
function checkRef(file, ref) {
  ref = ref.trim();
  if (!ref || /^(https?:|mailto:|tel:|sms:|data:|blob:|javascript:|#|\/\/)/i.test(ref) || /[{}+$]/.test(ref)) return;
  var clean = decodeURIComponent(ref.split("#")[0].split("?")[0]);
  if (!clean) return;
  var target = clean.charAt(0) === "/" ? path.join(ROOT, clean) : path.join(path.dirname(file), clean);
  if (/\/$/.test(clean) || (fs.existsSync(target) && fs.statSync(target).isDirectory())) target = path.join(target, "index.html");
  refs++;
  if (!fs.existsSync(target)) fail(rel(file), "trỏ tới file không có: " + ref);
}
byExt(".html").forEach(function (f) {
  var h = fs.readFileSync(f, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  var m, attr = /\s(?:src|href|poster)="([^"]*)"/g, set = /\ssrcset="([^"]*)"/g;
  while ((m = attr.exec(h))) checkRef(f, m[1]);
  while ((m = set.exec(h))) m[1].split(",").forEach(function (part) { checkRef(f, part.trim().split(/\s+/)[0]); });
});
byExt(".css").forEach(function (f) {
  var c = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, ""), m, re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  while ((m = re.exec(c))) checkRef(f, m[2]);
});
counts.refs = refs;

/* ---------- result ---------- */
if (errors.length) {
  console.error("check-site: " + errors.length + " lỗi — chưa được deploy:\n");
  errors.forEach(function (e) { console.error("  ✗ " + e); });
  process.exit(1);
}
console.log("check-site: OK — " + counts.js + " file JS, " + (counts.products || 0) + " món, " + (counts.sales || 0) + " sale, " +
  (counts.prices || 0) + " giá Custom Orders, " + counts.json + " file JSON, " + counts.refs + " đường dẫn file.");
