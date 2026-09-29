/* ============================================================
   Purrlight Studio — Event Order Desk
   ------------------------------------------------------------
   Staff console for in-person events (markets, fairs, pop-ups).
   Two flows for a customer standing at the booth:
     THANKS — bought & took the piece home today → personalized thank-you
     ORDER  — placed an order to be made / shipped → order confirmation
   No backend. Works offline once loaded. Orders are kept in this
   device's localStorage (or a shared store when the hosting page
   defines window.PurrlightRemoteStore — see README).

   HOW TO EDIT (for Elise): everything a human might change lives in
   DESK_CONFIG below. Message wording lives in the build*() functions
   near the middle of the file — every line there follows the
   customer-service hard rules (no promised dates, no safety claims,
   no invented policy). Keep it that way.
   ============================================================ */

var DESK_CONFIG = {
  studioName: "Purrlight Studio",
  studioCity: "Pearland, Texas",
  studioEmail: "hello@purrlight.studio",         /* Brand Canon v2 — the old .com address must not appear anywhere */

  /* Base URL of the live site, with trailing slash. The domain is decided
     (purrlight.studio, Canon v2) but the site is not deployed yet — set this
     to "https://purrlight.studio/" the day it goes live. Leave "" to derive
     from wherever this page is served; on a local file the Link + QR option
     stays hidden (there is nothing a customer could open). */
  publicBaseUrl: "",

  /* Sales tax. rate 8.25% = the figure the fair P&L uses (Notion, họp 05/09/2026).
     mode "none"     — no tax line at all. DEFAULT until the Texas Sales and Use
                       Permit is confirmed (Notion Booth Kit, 18/09/2026: "chưa có").
     mode "included" — booth prices are tax-in; the message says so.
     mode "added"    — tax on top of the price.
     Change it in the ⚙ settings panel at the booth, or here. */
  tax: { rate: 0.0825, mode: "none" },

  /* What the booth actually takes (Notion Booth Kit 25/09/2026: Square / Zelle / cash). */
  payMethods: ["Cash", "Card (Square)", "Zelle", "Other"],

  /* Approved booth price grid — Elise, 25/09/2026 (Cat Show Booth Kit & Changelog).
     Custom cat = size × yarn. Custom doll = size × single/pair. Deposit 50%.
     Dogs, rabbits and other pets use the cat grid. */
  customGrid: {
    yarns: [
      { key: "cotton", label: "Yaoh Cotton", code: "C" },
      { key: "velvet", label: "Chenille Velvet", code: "V" },
      { key: "rabbit", label: "Rabbit Fluff Fur", code: "R" }
    ],
    sizes: ["Petite", "Classic", "Grand"],
    cat:  { Petite: [40, 48, 55], Classic: [55, 67, 79], Grand: [90, 105, 120] },
    doll: { Petite: [45, 85],     Classic: [85, 160],    Grand: [130, 245] },   /* [single, pair] */
    poses: ["Sitting", "Standing", "Lying"],
    eyes: ["Awake", "Sleepy"],
    petTypes: ["Cat", "Dog", "Rabbit", "Other pet"],
    depositRate: 0.5
  },

  /* Words that must never reach a customer from the free-text fields
     (dates promised, safety claims, "shipped" before a scan). The desk
     refuses to save while one is present. */
  bannedInNote: [
    /\b(safe|safely|non-?toxic|hypoallergenic|cpsia|astm|en ?71|suitable from birth|tested)\b/i,
    /\b(shipped|has shipped|on its way|will arrive|arrives?|arriving|deliver(ed|y)? (by|on|before))\b/i,
    /\b(by|before|in time for) (christmas|xmas|thanksgiving|halloween|easter|valentine'?s?|mother'?s day|father'?s day|birthday|the weekend|(next )?(mon|tues|wednes|thurs|fri|satur|sun)day|jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|june?|july?|aug(ust)?|sep(t|tember)?|oct(ober)?|nov(ember)?|dec(ember)?|the \d{1,2}(st|nd|rd|th)?|\d{1,2}\/\d{1,2})\b/i,
    /\b(magic|magical|blessed|spell|manifest|wizard)\b/i,
    /\b(handmade|hand-?crafted|made|crafted) in (the )?(usa|texas|america|us)\b/i,
    /\b(toys?|plush|plushie|nursery|for kids|babies|baby|toddlers?|newborns?)\b/i,
    /\b(luxe|luxury|premium|artisanal|bespoke|curated|elevated|exclusive|perfect gift|the best|#1|no\.? ?1)\b/i,
    /\bfree shipping\b/i,
    /\b(purrks|points|rewards? code|discount code|promo code|leave (us )?a review|review us)\b/i
  ],
  /* mail clients start truncating around here — the desk suggests Copy above it */
  mailtoSoftLimit: 1900,

  /* Order-form terms approved by Elise 25/09/2026 (Booth Kit) — shown on
     every confirmation that contains a custom piece. The deposit/balance
     sentence is assembled from what was ACTUALLY paid (see customTermsFor);
     this is the fixed part. */
  customTermsFixed: "US shipping is included. Custom pieces can't be returned, but anything wrong or damaged is on us, 100%.",

  /* Items that are NOT handmade keepsakes (printed to order / molded PVC):
     a purchase of only these gets no "made by hand", no care line and no
     safety line — the product page carries their own wash/care notes. */
  notHandmade: ["whisker-tee", "cat-pvc-keychain"],
  /* Items the safety line must never follow: an infant garment cannot carry
     "Not suitable for children under 3", and pet accessories are not
     children's items. Only the verbatim line is permitted, so nothing
     replaces it here. */
  safetyLineSkip: ["baptism-set", "pet-bandana", "bow-collar", "felt-fish"],

  /* Shown in the money lines of an order (free US shipping is on — per Elise;
     wording per the misleading-claims rule: "included", never "free" when
     it's built into the price). Blank = no line. */
  shippingLine: "US shipping included",

  /* Studio stance: offer a smaller size, not a lower price; handmade
     discounts are capped at 15% (Marketing guardrail). The desk warns above it. */
  discountCap: 0.15,

  /* Pearland-stock pieces that are NOT in products.js (per customer-service
     skill, 8/2026). They appear as quick-add chips with NO price — the price
     is typed at the booth, never guessed by the tool. */
  extraItems: ["Stress ball set", "Linen doll bag charm", "Americana doll", "Catnip ball"],

  /* Timelines the customer reads. Ranges + conditions only — never a date.
     First person singular, the way every approved customer letter is written.
     The "made" wording carries the approved 10–14-day phrase from the
     customer-service skill; the year-end customs caveat is the studio's own
     known risk (a shipment was held in 8/2026). */
  timelines: [
    { key: "stock",  label: "Ready now — ships from our Texas studio",
      text: "Your piece is ready at our Texas studio. It ships with tracking, and I'll message you the tracking number the moment it's on its way." },
    { key: "made",   label: "Made to order — ships from our Vietnam workshop",
      text: "Your piece will be made by hand in small batches. I'll message you when it leaves our workshop; from there, delivery typically takes 10–14 days, though customs can add time, especially toward the end of the year." },
    { key: "custom", label: "Custom piece — about 2 weeks (5 in the holiday season)",
      /* lead time per Elise 25/09/2026: 2 weeks; Thanksgiving–Christmas +3 weeks. Never promise faster. */
      text: "Custom pieces are usually ready in about two weeks — about five weeks in the Thanksgiving–Christmas season — and I'll send you a photo to approve before anything ships. From there, delivery typically takes 10–14 days once it leaves our workshop, though customs can add time, especially toward the end of the year." }
  ],

  /* Shown when a balance remains on an order WITHOUT a custom piece. There is
     no approved policy for non-custom balances (only the custom terms
     exist), so this says nothing about WHEN it is due — the "Balance $X"
     money line stands on its own. */
  balanceLine: "I'll be in touch about the balance before anything ships.",

  /* Custom pieces are made from the customer's photo. Replies go to whatever
     mailbox the booth phone sends from, so the studio address is named too
     (and cc'd on every email) — CONFIRM hello@purrlight.studio works before
     the first event (Notion Booth Kit 18/09: not yet confirmed). */
  photoLine: "If you haven't already, reply with the clearest photo you have of {pet} — front-on, in daylight if you can — or send it to {email}. That photo is what we work from.",

  /* Approved promise line (The Purrlight Promise on the product page),
     with the contact channel changed from Etsy to this email. */
  promiseLine: "Every piece is checked by hand before it ships. If anything arrives less than perfect, just reply to this email — we'll make it right.",

  /* Optional follow-on lines at the end of the thank-you (one or two at most).
     Empty = nothing added. The Instagram handle @purrlightstudio is taken by
     someone else (Canon v2) — use the Linktree or TikTok/Pinterest handle. */
  followOnLines: [],

  /* Verbatim lines already used on the product page (The Purrlight Promise). */
  careLine: "Handmade things like gentle care: spot clean with a damp cloth and keep keepsakes out of direct sun.",
  safetyLine: "Handmade keepsake for adult-guided use. Not tested as a children's toy. Not suitable for children under 3. Keep away from open flame. Spot clean only.",

  signName: "Elise",
  tagline: "Made by hand. Made to be kept."
};
/* A hosting page may override any key above by defining window.DESK_CONFIG_OVERRIDES
   before this file loads (publicBaseUrl: false hides Link + QR entirely). */
(function () {
  var ov = window.DESK_CONFIG_OVERRIDES;
  if (ov) for (var k in ov) if (Object.prototype.hasOwnProperty.call(ov, k)) DESK_CONFIG[k] = ov[k];
})();

(function () {
  "use strict";

  var CFG = DESK_CONFIG;

  /* ---------- tiny helpers ---------- */
  var pad2 = function (n) { return ("0" + n).slice(-2); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  /* two-tap confirmation built into the button itself (no dialogs — some
     hosts swallow confirm() entirely, and a second tap is faster at a booth) */
  function armed(btn, fn, label) {
    if (btn.getAttribute("data-armed") === "1") { btn.removeAttribute("data-armed"); btn.textContent = btn.getAttribute("data-label"); fn(); return; }
    btn.setAttribute("data-label", btn.textContent); btn.setAttribute("data-armed", "1"); btn.textContent = label || "Tap again to confirm";
    setTimeout(function () { if (btn.getAttribute("data-armed") === "1") { btn.removeAttribute("data-armed"); btn.textContent = btn.getAttribute("data-label"); } }, 4000);
  }
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var cents = function (n) { return Math.round((Number(String(n).replace(/[^0-9.\-]/g, "")) || 0) * 100); };
  var money = function (c) {
    var neg = c < 0; c = Math.abs(Math.round(c));
    var s = "$" + Math.floor(c / 100) + "." + ("0" + (c % 100)).slice(-2);
    return (neg ? "−" : "") + s.replace(/\.00$/, "");
  };
  var firstName = function (n) { return (n || "").trim().split(/\s+/)[0] || "there"; };
  /* a bare YYYY-MM-DD is parsed as LOCAL (new Date("2026-09-27") would be UTC and
     print one day early for every daytime booth order in Texas) */
  var fmtDate = function (iso) {
    var d;
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) { var q = iso.split("-"); d = new Date(+q[0], q[1] - 1, +q[2]); }
    else d = iso ? new Date(iso) : new Date();
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  var localYmd = function (v) { var d = v ? new Date(v) : new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); };
  var fmtTime = function (iso) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };
  var digits = function (s) { return String(s || "").replace(/[^0-9+]/g, ""); };
  var isEmail = function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim()); };

  /* base64url of UTF-8 JSON — the customer link carries the confirmation itself */
  function encodePayload(obj) {
    var b = btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decodePayload(s) {
    s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }

  /* ---------- storage ---------- */
  var LS = { orders: "purrlight.desk.orders", settings: "purrlight.desk.settings", draft: "purrlight.desk.draft" };
  var storageOk = true;   /* flips false the first time a write fails (private mode, full quota) */
  function lsGet(k, fallback) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { if (storageOk) { storageOk = false; if (typeof updateStatus === "function") updateStatus(); } return false; }
  }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }

  var listeners = [];
  var LocalStore = {
    orders: lsGet(LS.orders, []),
    all: function () { return this.orders.slice(); },
    put: function (o) {
      var i = indexOfId(this.orders, o.id);
      if (i > -1) this.orders[i] = o; else this.orders.unshift(o);
      lsSet(LS.orders, this.orders); this.emit();
    },
    remove: function (id) {
      var i = indexOfId(this.orders, id);
      if (i > -1) this.orders.splice(i, 1);
      lsSet(LS.orders, this.orders); this.emit();
    },
    replaceAll: function (list) { this.orders = list; lsSet(LS.orders, this.orders); this.emit(); },
    onChange: function (fn) { listeners.push(fn); },
    emit: function () { listeners.forEach(function (fn) { fn(); }); },
    label: "Saved on this device · works offline"
  };
  function indexOfId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return i; return -1; }

  /* A hosting page (the shared hosted version) may wrap the local store with a
     synced one — same interface: all/put/remove/replaceAll/onChange/label. */
  var Store = (typeof window.PurrlightRemoteStore === "function") ? window.PurrlightRemoteStore(LocalStore) : LocalStore;

  var settings = lsGet(LS.settings, {});
  if (!settings.device) settings.device = randomTag();
  if (!settings.taxMode) settings.taxMode = CFG.tax.mode;
  if (typeof settings.taxRate !== "number") settings.taxRate = CFG.tax.rate;
  saveSettings();
  function saveSettings() { lsSet(LS.settings, settings); }
  function randomTag() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
    for (var i = 0; i < 2; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }

  /* ---------- order id: E<yymmdd>-<device>-<seq> — unique across phones ---------- */
  function nextId(now) {
    var d = new Date(now);
    var stamp = String(d.getFullYear()).slice(-2) + pad2(d.getMonth() + 1) + pad2(d.getDate());
    var prefix = "E" + stamp + "-" + settings.device + "-";
    /* highest number ever handed out for this prefix — kept in settings so a
       deleted order's number is never reused (paper forms CS-001… work the same way) */
    settings.seq = settings.seq || {};
    var max = settings.seq[prefix] || 0;
    Store.all().forEach(function (o) {
      if (o.id && o.id.indexOf(prefix) === 0) max = Math.max(max, parseInt(o.id.slice(prefix.length), 10) || 0);
    });
    var n = max + 1;
    settings.seq[prefix] = n; saveSettings();
    return prefix + (n < 10 ? "0" + n : String(n));   /* never truncated: 100 stays 100 */
  }

  /* ---------- money ---------- */
  function computeTotals(items, discount, paid) {
    var sub = 0;
    items.forEach(function (it) { sub += (Number(it.qty) || 0) * cents(it.unit); });
    var disc = Math.min(Math.max(cents(discount), 0), sub);
    var taxable = sub - disc;
    var tax = settings.taxMode === "added" ? Math.round(taxable * settings.taxRate) : 0;   /* "included" and "none" add nothing */
    var total = taxable + tax;
    var pd = Math.min(Math.max(cents(paid), 0), total);
    return { subtotal: sub, discount: disc, tax: tax, taxMode: settings.taxMode, taxRate: settings.taxRate, total: total, paid: pd, balance: total - pd };
  }
  function statusOf(t) { return t.balance <= 0 ? "paid" : (t.paid > 0 ? "deposit" : "unpaid"); }

  /* ============================================================
     MESSAGES — the words the customer reads.
     Rules: warm, short, American English. Ranges + conditions, never a
     date. No "safe"/"non-toxic". No policy the studio hasn't written.
     ============================================================ */

  function timelineFor(key) {
    for (var i = 0; i < CFG.timelines.length; i++) if (CFG.timelines[i].key === key) return CFG.timelines[i];
    return CFG.timelines[1];
  }
  function itemText(it) {
    return it.qty + " × " + it.name + (it.addon ? " — " + it.addon : "") + " — " + money(it.qty * cents(it.unit));
  }
  function moneyLines(t, payMethod, withShipping) {
    var out = ["Subtotal " + money(t.subtotal)];
    if (t.discount) out.push("Discount −" + money(t.discount));
    if (t.taxMode === "added") out.push("Sales tax " + money(t.tax));
    if (withShipping && CFG.shippingLine) out.push(CFG.shippingLine);
    out.push("Total " + money(t.total) + (t.taxMode === "included" ? " (Texas sales tax included)" : ""));
    out.push("Paid today " + money(t.paid) + (payMethod ? " · " + payMethod : ""));
    if (t.balance > 0) out.push("Balance " + money(t.balance));
    return out.join("\n");
  }
  function hasCustom(o) { for (var i = 0; i < o.items.length; i++) if (o.items[i].custom) return true; return false; }
  function petNames(o) {
    var n = []; o.items.forEach(function (i) { if (i.custom && i.custom.pet && n.indexOf(i.custom.pet) === -1) n.push(i.custom.pet); });
    return n;
  }
  /* which lines are handmade keepsakes (custom + typed-at-booth count as handmade) */
  function isKeepsake(it) { return !it.pid || (CFG.notHandmade || []).indexOf(it.pid) === -1; }
  function hasKeepsake(o) { for (var i = 0; i < o.items.length; i++) if (isKeepsake(o.items[i])) return true; return false; }
  function needsSafety(o) {
    for (var i = 0; i < o.items.length; i++) {
      var it = o.items[i];
      if (!isKeepsake(it)) continue;
      if (it.pid && (CFG.safetyLineSkip || []).indexOf(it.pid) > -1) continue;
      return true;
    }
    return false;
  }
  function qtyTotal(o) { var n = 0; o.items.forEach(function (i) { n += Number(i.qty) || 0; }); return n; }
  /* the approved 25/09 terms, said about what was ACTUALLY paid */
  function customTermsFor(t) {
    var s = t.balance > 0
      ? "What we agreed at the booth: " + money(t.paid) + " deposit today, and the balance of " + money(t.balance) + " when you approve a photo of the finished piece."
      : "What we agreed at the booth: paid in full today — I'll send you a photo of the finished piece to approve before it ships.";
    return s + " " + CFG.customTermsFixed + (t.balance > 0 ? " Your deposit is refundable until work begins." : " It's refundable in full until work begins.");
  }
  function replyLine() { return "A question, or a change of heart? Just reply to this email, or write to " + CFG.studioEmail + "."; }
  function shipLines(sh) {
    if (!sh || !(sh.line1 || sh.city)) return "";
    return [sh.name, sh.line1, sh.line2, [sh.city, sh.state].filter(Boolean).join(", ") + (sh.zip ? " " + sh.zip : "")]
      .filter(function (x) { return x && String(x).trim(); }).join("\n");
  }
  function followOnText() { return (CFG.followOnLines || []).filter(Boolean).join("\n"); }
  /* the one approved customer sign-off: "Warmly, Elise · Purrlight Studio" */
  function signOff() {
    return "Warmly,\n" + CFG.signName + " · " + CFG.studioName + "\n" + CFG.studioCity + " · " + CFG.studioEmail;
  }
  /* the dated changelog line the customer-service skill requires for every
     action that touches a customer or money — paste into Notion */
  function logLine(o) {
    var t = o.totals;
    return [localYmd(o.createdAt), o.id, "event" + (o.event ? ": " + o.event : ""), o.type === "order" ? "order confirmation" : "thank-you",
      o.customer.name, money(t.total) + " · paid " + money(t.paid) + (o.payMethod ? " " + o.payMethod : "") + (t.balance > 0 ? " · balance " + money(t.balance) : ""),
      "staff: " + (o.staff || "—"), "message written"].join(" · ");
  }
  /* "today" only if it still is — a message re-sent on Sunday for a Saturday order says the date */
  function whereToday(o) {
    var when = localYmd(o.createdAt) === localYmd() ? "today" : "on " + fmtDate(o.createdAt);
    return o.event ? "at " + o.event + " " + when : when;
  }

  /* the one-line story from products.js, so the note names the piece the way the site does */
  function shortFor(it) {
    if (!it.pid || typeof PRODUCTS === "undefined") return "";
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === it.pid) return PRODUCTS[i].short || "";
    return "";
  }
  function buildThanks(o) {
    var first = firstName(o.customer.name);
    var many = o.items.length > 1 || (o.items[0] && o.items[0].qty > 1);
    var p = [];
    p.push("Hi " + first + ",");
    p.push("Thank you for finding us " + whereToday(o) + " — and for taking home " + (many ? "these pieces" : "this piece") + ":\n" +
      o.items.map(function (it) { var s = o.items.length <= 2 ? shortFor(it) : ""; return itemText(it) + (s ? "\n   " + s : ""); }).join("\n"));
    if (o.note) p.push(o.note);
    if (hasKeepsake(o)) p.push(CFG.careLine + " Because each piece is made by hand, yours is one of a kind — that's the point.");
    if (needsSafety(o)) p.push(CFG.safetyLine);
    p.push("For your records: " + money(o.totals.paid) + " paid" + (o.payMethod ? " by " + o.payMethod : "") + (o.totals.taxMode === "added" ? " (includes " + money(o.totals.tax) + " sales tax)" : (o.totals.taxMode === "included" ? " (Texas sales tax included)" : "")) + (o.totals.balance > 0 ? " · balance " + money(o.totals.balance) : "") + ".");
    p.push("If anything is ever less than you hoped, just reply to this email, or write to " + CFG.studioEmail + " — we'll make it right.");
    var f = followOnText(); if (f) p.push(f);
    p.push(CFG.tagline);
    p.push(signOff());
    return { subject: "Thank you, " + first + " — from " + CFG.studioName, body: p.join("\n\n") };
  }

  function buildOrder(o) {
    var first = firstName(o.customer.name);
    var tl = timelineFor(o.timeline);
    var p = [];
    p.push("Hi " + first + ",");
    p.push("Thank you for placing an order with us " + whereToday(o) + ". Here's everything, so you have it in writing:");
    p.push("Order " + o.id + " · " + fmtDate(o.createdAt) + "\n" + o.items.map(itemText).join("\n"));
    p.push(moneyLines(o.totals, o.payMethod, true));
    if (o.totals.balance > 0 && !hasCustom(o)) p.push(CFG.balanceLine);
    var sh = shipLines(o.ship);
    p.push(sh ? "Ship to:\n" + sh : "I'll confirm your shipping address by message before anything ships.");
    p.push(tl.text);
    if (hasCustom(o)) {
      var pets = petNames(o);
      p.push(CFG.photoLine.replace("{pet}", pets.length ? pets.join(" and ") : "the one we're making").replace("{email}", CFG.studioEmail));
      p.push(customTermsFor(o.totals));
    }
    if (o.note) p.push(o.note);
    p.push(CFG.promiseLine + (hasKeepsake(o) ? " " + CFG.careLine : ""));
    if (needsSafety(o)) p.push(CFG.safetyLine);
    p.push(replyLine());
    p.push(CFG.tagline);
    p.push(signOff());
    return { subject: "Your " + CFG.studioName + " order " + o.id + " — confirmed", body: p.join("\n\n") };
  }

  function buildSms(o, link) {
    var first = firstName(o.customer.name), t = o.totals;
    var s = o.type === "order"
      ? "Hi " + first + " — thank you for your " + CFG.studioName + " order " + o.id + ". Total " + money(t.total) + ", paid " + money(t.paid) + (t.balance > 0 ? ", balance " + money(t.balance) : "") + ". " + (o.timeline === "stock" ? "I'll text you the tracking number when it ships." : "I'll message you when it leaves our workshop.")
      : "Hi " + first + " — thank you for taking home " + o.items.map(function (i) { return i.qty + "× " + i.name; }).join(", ") + " " + whereToday(o) + ". " + money(t.paid) + " paid" + (o.payMethod ? " by " + o.payMethod : "") + (t.balance > 0 ? ", balance " + money(t.balance) : "") + ".";
    if (link) s += " Details: " + link;
    return s + " — " + CFG.signName + ", " + CFG.studioName + " · " + CFG.studioEmail;
  }

  /* what goes into the customer link: no email, no phone, no street address.
     Kept compact on purpose — every byte makes the QR denser. */
  function payloadFor(o) {
    var sh = o.ship && (o.ship.city || o.ship.state) ? [o.ship.city, o.ship.state].filter(Boolean).join(", ") : "";
    var t = o.totals;
    return {
      v: 2, t: o.type === "order" ? "o" : "t", id: o.id, n: firstName(o.customer.name), ev: o.event || "", d: localYmd(o.createdAt),
      it: o.items.map(function (i) { return [i.name + (i.addon ? " — " + i.addon : ""), i.qty, cents(i.unit)]; }),
      m: [t.subtotal, t.discount, t.tax, t.total, t.paid, t.balance, t.taxMode === "added" ? "a" : (t.taxMode === "included" ? "i" : "n")],
      pm: o.payMethod || "", sh: sh, tl: o.timeline || "", nt: o.note || "",
      cu: hasCustom(o) ? (petNames(o).join(" and ") || 1) : 0,
      k: hasKeepsake(o) ? 1 : 0, s: needsSafety(o) ? 1 : 0
    };
  }
  /* normalize any payload version into what renderConfirm reads */
  function normalizePayload(p) {
    if (!p || typeof p !== "object") throw new Error("bad payload");
    var num = function (x) { var n = Number(x); return isFinite(n) ? n : 0; };
    if (p.v === 2) {
      var m = p.m || [];
      p.t = p.t === "o" ? "order" : "thanks";
      p.tt = { subtotal: num(m[0]), discount: num(m[1]), tax: num(m[2]), total: num(m[3]), paid: num(m[4]), balance: num(m[5]), taxMode: m[6] === "i" ? "included" : (m[6] === "a" ? "added" : "none") };
    }
    /* everything numeric is coerced — the hash is attacker-controlled text, never trusted markup */
    p.it = (p.it || []).map(function (i) { return [String((i && i[0]) || ""), num(i && i[1]), num(i && i[2])]; });
    if (!p.tt || typeof p.tt.total !== "number") throw new Error("bad payload");
    ["n", "id", "ev", "d", "pm", "sh", "tl", "nt"].forEach(function (k) { p[k] = p[k] == null ? "" : String(p[k]); });
    if (typeof p.cu !== "number") p.cu = p.cu ? String(p.cu) : 0;
    return p;
  }
  function baseUrl() {
    if (CFG.publicBaseUrl === false) return "";
    if (CFG.publicBaseUrl) return CFG.publicBaseUrl;
    if (/^https?:/.test(location.protocol)) return location.href.replace(/[#?].*$/, "").replace(/[^\/]*$/, "");
    return "";
  }
  function linkFor(o) {
    var b = baseUrl();
    return b ? b + "confirm.html#" + encodePayload(payloadFor(o)) : "";
  }

  /* ============================================================
     CUSTOMER PAGE (confirm.html) — renders from the link payload
     ============================================================ */
  function renderConfirm(root, p) {
    var isOrder = p.t === "order";
    var t = p.tt || {};
    var rows = [];
    rows.push(['Subtotal', money(t.subtotal)]);
    if (t.discount) rows.push(['Discount', "−" + money(t.discount)]);
    if (t.taxMode === "added") rows.push(['Sales tax', money(t.tax)]);
    var html =
      '<div class="confirm-card">' +
      '<p class="confirm-kicker">' + esc(CFG.studioName) + (p.ev ? ' · ' + esc(p.ev) : '') + '</p>' +
      '<h1>' + (isOrder ? 'Your order is in, ' : 'Thank you, ') + esc(p.n) + '.</h1>' +
      '<p class="lede">' + (isOrder ? "Here's everything we agreed on at the booth — so you have it in writing." : "A little note from our booth, so you have it in writing.") + '</p>' +
      '<p class="oid">' + (isOrder ? 'Order <strong>' + esc(p.id) + '</strong> · ' : '') + esc(fmtDate(p.d)) + '</p>' +
      '<table class="confirm-items"><thead><tr><th>Piece</th><th>Amount</th></tr></thead><tbody>' +
      (p.it || []).map(function (i) {
        var qty = Number(i[1]) || 0, unit = Number(i[2]) || 0;
        return '<tr><td>' + esc(i[0]) + '<span class="sub">' + qty + ' × ' + money(unit) + '</span></td><td>' + money(qty * unit) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<div class="confirm-rows">' +
      rows.map(function (r) { return '<div class="row"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>'; }).join('') +
      (isOrder && CFG.shippingLine ? '<div class="row"><span>Shipping</span><span>' + esc(CFG.shippingLine.replace(/^US shipping /i, "")) + '</span></div>' : '') +
      '<div class="row total"><span>Total' + (t.taxMode === "included" ? ' <small>(Texas sales tax included)</small>' : '') + '</span><span>' + money(t.total) + '</span></div>' +
      '<div class="row' + (t.balance > 0 ? '' : ' paid-full') + '"><span>Paid' + (p.pm ? ' · ' + esc(p.pm) : '') + '</span><span>' + money(t.paid) + '</span></div>' +
      (t.balance > 0 ? '<div class="row balance"><span>Balance</span><span>' + money(t.balance) + '</span></div>' : '') +
      '</div>';
    if (isOrder) {
      var tl = timelineFor(p.tl);
      html += '<div class="confirm-section"><h2>What happens next</h2><p>' + esc(tl.text) + '</p>' +
        (t.balance > 0 && !p.cu ? '<p>' + esc(CFG.balanceLine) + '</p>' : '') +
        (p.sh ? '<p>Shipping to ' + esc(p.sh) + ' — I\'ll confirm the full address with you by message.</p>' : '') + '</div>';
      if (p.cu) html += '<div class="confirm-section"><h2>Your custom piece</h2><p>' + esc(CFG.photoLine.replace("{pet}", p.cu === 1 ? "the one we're making" : p.cu).replace("{email}", CFG.studioEmail)) + '</p><p>' + esc(customTermsFor(t)) + '</p></div>';
    }
    if (p.nt) html += '<div class="confirm-section"><h2>A note from us</h2><p>' + esc(p.nt) + '</p></div>';
    if (p.k !== 0) html += '<div class="confirm-section"><h2>Care</h2><p>' + esc(CFG.careLine) + ' Because each piece is made by hand, yours is one of a kind — that\'s the point.</p></div>';
    if (p.s !== 0) html += '<div class="confirm-note"><svg viewBox="0 0 24 24" fill="none" stroke="#A9812F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.6L20 10l-6.1 1.4L12 17l-1.9-5.6L4 10l6.1-1.4Z"/></svg><span>' + esc(CFG.safetyLine) + '</span></div>';
    html +=
      '<div class="confirm-section"><h2>Questions</h2><p>Write to us anytime at <a href="mailto:' + esc(CFG.studioEmail) + '">' + esc(CFG.studioEmail) + '</a>' + (isOrder ? ' — mention order ' + esc(p.id) + '.' : '.') + '</p></div>' +
      '<p class="confirm-sign">' + esc(CFG.tagline) + '<small>— ' + esc(CFG.signName) + ', ' + esc(CFG.studioName) + ' · ' + esc(CFG.studioCity) + '</small></p>' +
      '<div class="confirm-actions"><button class="btn btn-ghost" type="button" data-print>Print / save as PDF</button>' +
      (root.getAttribute("data-shop-link") !== "false" ? '<a class="btn btn-primary" href="shop.html">See more pieces</a>' : '') + '</div>' +
      '</div>';
    root.innerHTML = html;
    var pb = $("[data-print]", root); if (pb) pb.addEventListener("click", function () { window.print(); });
    document.title = (isOrder ? "Order " + p.id : "Thank you, " + p.n) + " — " + CFG.studioName;
  }

  window.PurrlightDesk = { renderConfirm: renderConfirm, decodePayload: decodePayload, encodePayload: encodePayload, payloadFor: payloadFor, normalizePayload: normalizePayload, buildThanks: buildThanks, buildOrder: buildOrder, computeTotals: computeTotals };

  var confirmRoot = $("[data-confirm]");
  if (confirmRoot) {
    var raw = location.hash.slice(1);
    if (raw) {
      try { renderConfirm(confirmRoot, normalizePayload(decodePayload(raw))); }
      catch (e) { confirmRoot.innerHTML = '<div class="confirm-blank"><h1>That link didn\'t open.</h1><p>Please open the link exactly as it was sent, or write to us at <a href="mailto:' + esc(CFG.studioEmail) + '">' + esc(CFG.studioEmail) + '</a>.</p></div>'; }
    }
    /* no payload → the static blank state in the HTML stays */
  }

  /* ============================================================
     STAFF CONSOLE (event.html)
     ============================================================ */
  var form = $("[data-desk-form]");
  if (!form) return;

  var mode = "thanks";          /* "thanks" | "order" */
  var lines = [];               /* [{ pid, name, addons, addonIndex, addon, qty, unit, custom }] */
  var editingId = null;         /* set while re-editing a saved order */
  var current = null;           /* the order shown in the output panel */
  var catalog = (typeof PRODUCTS !== "undefined") ? PRODUCTS : [];

  var el = {
    modeBtns: $$(".mode-switch [data-mode]"),
    name: $("#c-name"), email: $("#c-email"), phone: $("#c-phone"), note: $("#c-note"), optIn: $("#c-optin"),
    picker: $("[data-picker]"), search: $("#pick-search"), linesEl: $("[data-lines]"),
    discount: $("#m-discount"), discNote: $("[data-disc-note]"), paid: $("#m-paid"),
    subtotal: $("[data-subtotal]"), discRow: $("[data-disc-row]"), taxRow: $("[data-tax-row]"), taxAmt: $("[data-tax]"), taxLbl: $("[data-tax-label]"),
    total: $("[data-total]"), balRow: $("[data-bal-row]"), balance: $("[data-balance]"),
    payChips: $("[data-pay]"), tlChips: $("[data-timelines]"),
    shName: $("#s-name"), shLine1: $("#s-line1"), shLine2: $("#s-line2"), shCity: $("#s-city"), shState: $("#s-state"), shZip: $("#s-zip"),
    out: $("[data-out]"), logList: $("[data-log-list]"), logCount: $$("[data-log-count]"), eventName: $$("[data-event-name]"),
    toast: $("[data-toast]"), status: $("[data-status]"), submit: $("[data-submit]")
  };

  /* ---------- mode ---------- */
  function setMode(m) {
    mode = m;
    el.modeBtns.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    $$("[data-only]").forEach(function (s) { s.hidden = s.getAttribute("data-only") !== m; });
    el.submit.textContent = m === "order" ? "Save & write the confirmation" : "Save & write the thank-you";
    if (m === "order" && !paidTouched) el.paid.value = "";   /* deposits are typed, never assumed */
    renderMoney();
  }
  el.modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); saveDraft(); }); });

  /* ---------- chips (pay method, timeline) ---------- */
  function renderChips(root, name, options, checkedKey) {
    root.innerHTML = options.map(function (o) {
      var key = o.key || o, label = o.label || o;
      return '<label><input type="radio" name="' + name + '" value="' + esc(key) + '"' + (key === checkedKey ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
    }).join("");
  }
  renderChips(el.payChips, "pay", CFG.payMethods, settings.lastPay || CFG.payMethods[0]);
  renderChips(el.tlChips, "timeline", CFG.timelines, "made");
  function chipValue(root) { var c = $("input:checked", root); return c ? c.value : ""; }
  var timelineTouched = false;
  el.tlChips.addEventListener("change", function () { timelineTouched = true; });

  /* ---------- picker: custom grid first (the booth's real business), then catalog ---------- */
  var GRID = CFG.customGrid;
  function pickerItems() {
    var list = [
      { kind: "cat",  name: "Custom cat", price: null, hint: "from " + money(cents(GRID.cat.Petite[0])) + " · size × yarn" },
      { kind: "doll", name: "Custom doll", price: null, hint: "from " + money(cents(GRID.doll.Petite[0])) + " · single or pair" }
    ];
    catalog.forEach(function (p) { list.push({ kind: "catalog", pid: p.id, name: p.name, price: p.price, addons: p.addons || null }); });
    (CFG.extraItems || []).forEach(function (n) { list.push({ kind: "other", name: n, price: null, hint: "price at the booth" }); });
    return list;
  }
  var pickerList = pickerItems();
  function renderPicker(filter) {
    var q = (filter || "").trim().toLowerCase();
    el.picker.innerHTML = pickerList.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) > -1; }).map(function (p) {
      var n = countInLines(p.name);
      return '<button type="button" class="item-chip' + (p.kind !== "catalog" ? ' custom' : '') + (p.kind === "cat" || p.kind === "doll" ? ' grid' : '') + (n ? ' added' : '') + '" data-add="' + esc(p.name) + '">' +
        '<strong>' + esc(p.name) + '</strong><span>' + (p.price == null ? esc(p.hint || '') : money(cents(p.price))) + '</span>' +
        (n ? '<span class="n">' + n + '</span>' : '') + '</button>';
    }).join("") + '<button type="button" class="item-chip custom" data-add-custom><strong>+ Something else</strong><span>name &amp; price</span></button>';
  }
  function countInLines(name) { var n = 0; lines.forEach(function (l) { if (l.name === name) n += l.qty; }); return n; }
  el.picker.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add], [data-add-custom]");
    if (!b) return;
    if (b.hasAttribute("data-add-custom")) { addLine({ kind: "other", name: "", price: null }); return; }
    var name = b.getAttribute("data-add");
    var p = null; pickerList.forEach(function (x) { if (x.name === name) p = x; });
    if (p) addLine(p);
  });
  if (el.search) el.search.addEventListener("input", function () { renderPicker(el.search.value); });

  function addLine(p) {
    /* same catalog piece, no addons → bump qty instead of a second line */
    if (p.kind === "catalog" && !p.addons) {
      for (var i = 0; i < lines.length; i++) if (lines[i].pid === p.pid) { lines[i].qty += 1; renderLines(); return; }
    }
    var l = { kind: p.kind, pid: p.pid || null, name: p.name, addons: p.addons || null, addonIndex: 0, addon: "", qty: 1,
      unit: p.price == null ? "" : p.price, custom: null };
    if (p.kind === "cat" || p.kind === "doll") {
      l.custom = { size: "Classic", yarn: 0, pair: 0, pet: "", pose: "", eyes: "", code: "", type: p.kind === "cat" ? "Cat" : "" };
      /* a custom piece follows the custom lead time unless staff already chose otherwise */
      if (!timelineTouched) { var r = $('input[value="custom"]', el.tlChips); if (r) r.checked = true; }
    }
    lines.push(l);
    renderLines();
    if (p.kind !== "catalog") { var last = el.linesEl.lastElementChild; var inp = last && $("input", last); if (inp) inp.focus(); }
  }
  function lineUnit(l) {
    if (l.kind === "cat") return cents(GRID.cat[l.custom.size][l.custom.yarn]);
    if (l.kind === "doll") return cents(GRID.doll[l.custom.size][l.custom.pair]);
    if (l.addons && l.addons[l.addonIndex]) return cents(l.unit) + cents(l.addons[l.addonIndex].delta);
    return cents(l.unit);
  }
  /* what the customer reads for a custom line: "Classic · Chenille Velvet" + "Mochi · sitting · awake eyes · V-12" */
  function customSpec(l) {
    var c = l.custom;
    return l.kind === "cat" ? c.size + " · " + GRID.yarns[c.yarn].label : c.size + " · " + (c.pair ? "pair" : "single");
  }
  /* "Custom cat" / "Custom dog" / "Custom pet" — the grid is the same for every pet */
  function customName(l) {
    if (l.kind !== "cat") return "Custom doll";
    var t = (l.custom.type || "Cat").toLowerCase();
    return "Custom " + (t === "other pet" ? "pet" : t);
  }
  function customDetail(l) {
    var c = l.custom, d = [];
    if (c.pet) d.push(c.pet);
    if (c.pose) d.push(c.pose.toLowerCase());
    if (c.eyes) d.push(c.eyes.toLowerCase() + " eyes");
    if (c.code) d.push("yarn " + c.code);
    return d.join(" · ");
  }
  function opts(list, sel, labelOf) {
    return list.map(function (x, j) { var v = labelOf ? j : x; return '<option value="' + esc(v) + '"' + (String(v) === String(sel) ? ' selected' : '') + '>' + esc(labelOf ? labelOf(x) : x) + '</option>'; }).join("");
  }
  function renderLines() {
    if (!lines.length) { el.linesEl.innerHTML = '<li class="empty-lines">Nothing added yet — tap a piece above.</li>'; }
    else el.linesEl.innerHTML = lines.map(function (l, i) {
      var head;
      if (l.kind === "cat" || l.kind === "doll") {
        var c = l.custom;
        head = '<div class="line-name">' + esc(customName(l)) + '</div><div class="custom-grid">' +
          (l.kind === "cat" ? '<select data-ct="' + i + '" aria-label="Pet">' + opts(GRID.petTypes, c.type || "Cat") + '</select>' : '') +
          '<select data-cs="' + i + '" aria-label="Size">' + opts(GRID.sizes, c.size) + '</select>' +
          (l.kind === "cat"
            ? '<select data-cy="' + i + '" aria-label="Yarn">' + opts(GRID.yarns, c.yarn, function (y) { return y.label; }) + '</select>'
            : '<select data-cp="' + i + '" aria-label="Single or pair">' + opts(["Single", "Pair"], c.pair, function (x) { return x; }) + '</select>') +
          '<input type="text" data-cpet="' + i + '" value="' + esc(c.pet) + '" placeholder="' + (l.kind === "cat" ? "Their name" : "Who is it?") + '" aria-label="Name" autocapitalize="words">' +
          '<select data-cpose="' + i + '" aria-label="Pose"><option value="">Pose</option>' + opts(GRID.poses, c.pose) + '</select>' +
          '<select data-ceyes="' + i + '" aria-label="Eyes"><option value="">Eyes</option>' + opts(GRID.eyes, c.eyes) + '</select>' +
          '<input type="text" data-ccode="' + i + '" value="' + esc(c.code) + '" placeholder="Yarn code · V-12" aria-label="Yarn colour code" autocapitalize="characters">' +
          '</div><div class="line-sub">' + money(lineUnit(l)) + ' each · 50% deposit ' + money(Math.round(lineUnit(l) * GRID.depositRate)) + '</div>';
      } else if (l.kind === "other") {
        head = '<div class="field-row"><input type="text" placeholder="What did they get?" value="' + esc(l.name) + '" data-ln="' + i + '" aria-label="Item name">' +
          '<input class="line-price" type="text" inputmode="decimal" placeholder="$ price each" value="' + esc(l.unit) + '" data-lp="' + i + '" aria-label="Price each"></div>';
      } else {
        head = '<div class="line-name">' + esc(l.name) + '</div>' +
          (l.addons ? '<select data-la="' + i + '" aria-label="Set option">' + l.addons.map(function (a, j) {
            return '<option value="' + j + '"' + (j === l.addonIndex ? ' selected' : '') + '>' + esc(a.label) + (a.delta ? ' (+' + money(cents(a.delta)) + ')' : '') + '</option>';
          }).join("") + '</select>' : '<div class="line-sub">' + money(cents(l.unit)) + ' each</div>');
      }
      return '<li class="line' + (l.custom ? ' line-custom' : '') + '"><div>' + head + '</div>' +
        '<div class="line-controls"><span class="stepper"><button type="button" data-dec="' + i + '" aria-label="One less">−</button><output aria-live="polite">' + l.qty + '</output><button type="button" data-inc="' + i + '" aria-label="One more">+</button></span>' +
        '<span class="line-total">' + money(l.qty * lineUnit(l)) + '</span>' +
        '<button type="button" class="rm" data-rm="' + i + '" aria-label="Remove">×</button></div></li>';
    }).join("");
    renderPicker(el.search ? el.search.value : "");
    renderMoney();
    saveDraft();
  }
  el.linesEl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var i;
    if (b.hasAttribute("data-inc")) { i = +b.getAttribute("data-inc"); lines[i].qty += 1; }
    else if (b.hasAttribute("data-dec")) { i = +b.getAttribute("data-dec"); lines[i].qty -= 1; if (lines[i].qty < 1) lines.splice(i, 1); }
    else if (b.hasAttribute("data-rm")) { i = +b.getAttribute("data-rm"); lines.splice(i, 1); }
    else return;
    renderLines();
  });
  el.linesEl.addEventListener("change", function (e) {
    var t = e.target, l;
    if (t.hasAttribute("data-la")) { l = lines[+t.getAttribute("data-la")]; l.addonIndex = +t.value; l.addon = l.addons[l.addonIndex].delta ? l.addons[l.addonIndex].label : ""; renderLines(); }
    else if (t.hasAttribute("data-cs")) { lines[+t.getAttribute("data-cs")].custom.size = t.value; renderLines(); }
    else if (t.hasAttribute("data-ct")) { lines[+t.getAttribute("data-ct")].custom.type = t.value; renderLines(); }
    else if (t.hasAttribute("data-cy")) { lines[+t.getAttribute("data-cy")].custom.yarn = +t.value; renderLines(); }
    else if (t.hasAttribute("data-cp")) { lines[+t.getAttribute("data-cp")].custom.pair = +t.value; renderLines(); }
    else if (t.hasAttribute("data-cpose")) { lines[+t.getAttribute("data-cpose")].custom.pose = t.value; saveDraft(); }
    else if (t.hasAttribute("data-ceyes")) { lines[+t.getAttribute("data-ceyes")].custom.eyes = t.value; saveDraft(); }
  });
  el.linesEl.addEventListener("input", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-ln")) { lines[+t.getAttribute("data-ln")].name = t.value; saveDraft(); }
    if (t.hasAttribute("data-lp")) { lines[+t.getAttribute("data-lp")].unit = t.value; renderMoneyOnly(); }
    if (t.hasAttribute("data-cpet")) { lines[+t.getAttribute("data-cpet")].custom.pet = t.value.trim(); saveDraft(); }
    if (t.hasAttribute("data-ccode")) { lines[+t.getAttribute("data-ccode")].custom.code = t.value.trim().toUpperCase(); saveDraft(); }
  });
  /* re-render line totals for custom prices without losing the caret */
  function renderMoneyOnly() {
    $$(".line", el.linesEl).forEach(function (li, i) { var tot = $(".line-total", li); if (tot && lines[i]) tot.textContent = money(lines[i].qty * lineUnit(lines[i])); });
    renderMoney();
    saveDraft();
  }

  /* ---------- money panel ---------- */
  function currentItems() {
    return lines.filter(function (l) { return l.name.trim() && l.qty > 0; }).map(function (l) {
      if (l.custom) {
        var c = l.custom;
        return { pid: null, kind: l.kind, name: customName(l) + " · " + customSpec(l), addon: customDetail(l), qty: l.qty, unit: lineUnit(l) / 100,
          custom: { type: c.type || "", size: c.size, yarn: l.kind === "cat" ? GRID.yarns[c.yarn].label : "", pair: !!c.pair, pet: c.pet, pose: c.pose, eyes: c.eyes, code: c.code } };
      }
      return { pid: l.pid, kind: l.kind, name: l.name.trim(), addon: l.addon || "", qty: l.qty, unit: lineUnit(l) / 100 };
    });
  }
  /* THANKS = they paid in full at the booth, so "Paid today" follows the total
     until someone types in it. ORDER = deposits are typed, never assumed. */
  var paidTouched = false;
  function renderMoney() {
    if (mode === "thanks" && !paidTouched) {
      var t0 = computeTotals(currentItems(), el.discount.value, 0);
      el.paid.value = t0.total ? (t0.total / 100).toFixed(2).replace(/\.00$/, "") : "";
    }
    var t = computeTotals(currentItems(), el.discount.value, el.paid.value);
    el.subtotal.textContent = money(t.subtotal);
    el.discRow.hidden = false;
    el.taxRow.hidden = t.taxMode !== "added";
    el.taxAmt.textContent = money(t.tax);
    el.taxLbl.textContent = "Sales tax " + (t.taxRate * 100).toFixed(2).replace(/\.?0+$/, "") + "%";
    el.total.textContent = money(t.total) + (t.taxMode === "included" ? " · tax incl." : "");
    if (el.discNote) {
      var over = t.subtotal && t.discount > Math.round(t.subtotal * (CFG.discountCap || 1));
      el.discNote.hidden = !over;
      el.discount.setAttribute("aria-invalid", over ? "true" : "false");
    }
    el.balance.textContent = money(t.balance);
    el.balRow.classList.toggle("zero", t.balance <= 0);
    return t;
  }
  function markPaidFull() {
    var t = computeTotals(currentItems(), el.discount.value, 0);
    el.paid.value = (t.total / 100).toFixed(2).replace(/\.00$/, "");
    renderMoney();
  }
  el.discount.addEventListener("input", function () { renderMoney(); saveDraft(); });
  el.paid.addEventListener("input", function () { paidTouched = true; renderMoney(); saveDraft(); });
  $$("[data-paid-full]").forEach(function (b) { b.addEventListener("click", function () { paidTouched = mode === "order"; markPaidFull(); saveDraft(); }); });
  $$("[data-paid-none]").forEach(function (b) { b.addEventListener("click", function () { paidTouched = true; el.paid.value = "0"; renderMoney(); saveDraft(); }); });
  $$("[data-paid-half]").forEach(function (b) { b.addEventListener("click", function () {
    paidTouched = true;
    var t = computeTotals(currentItems(), el.discount.value, 0);
    el.paid.value = (Math.round(t.total * (GRID.depositRate || 0.5)) / 100).toFixed(2).replace(/\.00$/, ""); renderMoney(); saveDraft();
  }); });

  /* ---------- draft autosave (a dropped connection never eats a half-typed order) ---------- */
  var draftTimer = null;
  function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(function () {
      lsSet(LS.draft, { mode: mode, editingId: editingId, paidTouched: paidTouched, timelineTouched: timelineTouched, lines: lines, fields: readFields() });
    }, 250);
  }
  function readFields() {
    return { name: el.name.value, email: el.email.value, phone: el.phone.value, note: el.note.value, optIn: !!(el.optIn && el.optIn.checked),
      discount: el.discount.value, paid: el.paid.value, pay: chipValue(el.payChips), timeline: chipValue(el.tlChips),
      shName: el.shName.value, shLine1: el.shLine1.value, shLine2: el.shLine2.value, shCity: el.shCity.value, shState: el.shState.value, shZip: el.shZip.value };
  }
  function writeFields(f) {
    el.name.value = f.name || ""; el.email.value = f.email || ""; el.phone.value = f.phone || ""; el.note.value = f.note || "";
    if (el.optIn) el.optIn.checked = !!f.optIn;
    el.discount.value = f.discount || ""; el.paid.value = f.paid || "";
    if (f.pay) { var c = $('input[value="' + f.pay.replace(/"/g, '\\"') + '"]', el.payChips); if (c) c.checked = true; }
    if (f.timeline) { var t = $('input[value="' + f.timeline + '"]', el.tlChips); if (t) t.checked = true; }
    el.shName.value = f.shName || ""; el.shLine1.value = f.shLine1 || ""; el.shLine2.value = f.shLine2 || "";
    el.shCity.value = f.shCity || ""; el.shState.value = f.shState || ""; el.shZip.value = f.shZip || "";
  }
  form.addEventListener("input", saveDraft);
  form.addEventListener("change", saveDraft);

  /* ---------- validation + save ---------- */
  function lintText(s) {
    if (!s) return "";
    for (var i = 0; i < (CFG.bannedInNote || []).length; i++) { var m = String(s).match(CFG.bannedInNote[i]); if (m) return m[0]; }
    return "";
  }
  function setErr(input, msg) {
    var wrap = input.closest(".field"); var e = wrap && $(".err", wrap);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (e) e.textContent = msg || "";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = readFields(), items = currentItems(), ok = true, firstBad = null;
    setErr(el.name, ""); setErr(el.email, ""); setErr(el.phone, "");
    if (!f.name.trim()) { setErr(el.name, "A first name makes it personal."); ok = false; firstBad = firstBad || el.name; }
    if (f.email.trim() && !isEmail(f.email)) { setErr(el.email, "That email doesn't look complete."); ok = false; firstBad = firstBad || el.email; }
    if (mode === "order" && !f.email.trim() && !digits(f.phone)) { setErr(el.email, "An email or a phone — we need one way to reach them about the order."); ok = false; firstBad = firstBad || el.email; }
    if (!items.length) { toast("Add at least one piece first."); ok = false; }
    var missingPrice = lines.filter(function (l) { return l.kind === "other" && l.name.trim() && l.qty > 0 && (l.unit === "" || l.unit == null); });
    if (missingPrice.length) { toast("Type a price for “" + missingPrice[0].name + "”."); ok = false; }
    var unnamed = lines.filter(function (l) { return l.kind === "cat" && !l.custom.pet; });
    if (unnamed.length) { toast("What's their name? It goes into the confirmation."); ok = false; }
    var bad = lintText(f.note);
    if (bad) { setErr(el.note, "That line can't go to a customer (" + bad + "). No promised dates, no safety claims, no \"shipped\", no banned words."); ok = false; firstBad = firstBad || el.note; }
    else setErr(el.note, "");
    /* the other free text that reaches the customer: item names typed at the booth, pet names, yarn codes */
    var badLine = "";
    lines.forEach(function (l) {
      var texts = l.kind === "other" ? [l.name] : (l.custom ? [l.custom.pet, l.custom.code] : []);
      texts.forEach(function (s) { var b = lintText(s); if (b && !badLine) badLine = b; });
    });
    if (badLine) { toast("A piece name or pet name contains \"" + badLine + "\" — that can't go to a customer."); ok = false; }
    /* THANKS = took it home = paid in full. A balance means it is an ORDER. */
    var tt = computeTotals(items, f.discount, f.paid);
    if (mode === "thanks" && tt.balance > 0) { toast("Took home today means paid in full — tap \"full\", or switch to Order if a balance remains."); ok = false; }
    /* studio rule: no custom piece without a deposit at the booth (SOP CS 2027) */
    if (mode === "order" && tt.paid === 0 && lines.some(function (l) { return !!l.custom; })) { toast("Custom pieces need a deposit at the booth — tap \"50% deposit\"."); ok = false; }
    if (!ok) { if (firstBad) firstBad.focus(); return; }

    var now = new Date().toISOString();
    var existing = editingId ? findOrder(editingId) : null;
    var order = {
      id: existing ? existing.id : nextId(now),
      type: mode,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      sent: existing ? existing.sent : undefined,   /* an edit must not erase "emailed 2:14 pm" */
      event: settings.event || "",
      staff: settings.staff || "",
      device: settings.device,
      customer: { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), optIn: f.optIn },
      items: items,
      note: f.note.trim(),
      discount: cents(f.discount) / 100,
      paid: cents(f.paid) / 100,
      payMethod: f.pay,
      ship: mode === "order" ? { name: f.shName.trim() || f.name.trim(), line1: f.shLine1.trim(), line2: f.shLine2.trim(), city: f.shCity.trim(), state: f.shState.trim().toUpperCase(), zip: f.shZip.trim() } : null,
      timeline: mode === "order" ? (f.timeline || "made") : ""
    };
    order.totals = computeTotals(items, f.discount, f.paid);
    order.status = statusOf(order.totals);
    settings.lastPay = f.pay; saveSettings();
    Store.put(order);
    lsDel(LS.draft);
    editingId = null;
    showOrder(order);
    resetForm();
    toast("Saved · " + order.id);
    if (window.innerWidth < 900) el.out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  function findOrder(id) { var r = null; Store.all().forEach(function (o) { if (o.id === id) r = o; }); return r; }
  function resetForm() {
    lines = [];
    paidTouched = false;
    timelineTouched = false;
    writeFields({ pay: settings.lastPay || CFG.payMethods[0], timeline: "made" });
    $$("[aria-invalid]", form).forEach(function (i) { setErr(i, ""); });
    renderLines();
    el.submit.textContent = mode === "order" ? "Save & write the confirmation" : "Save & write the thank-you";
  }
  function loadForEdit(o) {
    editingId = o.id;
    paidTouched = true;       /* keep what was actually paid */
    timelineTouched = true;   /* and the timeline that was promised */
    setMode(o.type);
    lines = o.items.map(function (i) {
      if (i.custom) {
        var yarnIdx = 0; GRID.yarns.forEach(function (y, j) { if (y.label === i.custom.yarn) yarnIdx = j; });
        return { kind: i.kind, pid: null, name: i.kind === "cat" ? "Custom cat" : "Custom doll", addons: null, addonIndex: 0, addon: "", qty: i.qty, unit: "",
          custom: { type: i.custom.type || (i.kind === "cat" ? "Cat" : ""), size: i.custom.size || "Classic", yarn: yarnIdx, pair: i.custom.pair ? 1 : 0, pet: i.custom.pet || "", pose: i.custom.pose || "", eyes: i.custom.eyes || "", code: i.custom.code || "" } };
      }
      var p = null; catalog.forEach(function (c) { if (c.id === i.pid) p = c; });
      var addonIndex = 0;
      if (p && p.addons) p.addons.forEach(function (a, j) { if (a.label === i.addon) addonIndex = j; });
      return { kind: p ? "catalog" : "other", pid: i.pid, name: i.name, addons: p ? (p.addons || null) : null, addonIndex: addonIndex, addon: i.addon,
        qty: i.qty, unit: p ? p.price : i.unit, custom: null };
    });
    var sh = o.ship || {};
    writeFields({ name: o.customer.name, email: o.customer.email, phone: o.customer.phone, note: o.note, optIn: o.customer.optIn,
      discount: o.discount ? String(o.discount) : "", paid: String(o.paid), pay: o.payMethod, timeline: o.timeline || "made",
      shName: sh.name, shLine1: sh.line1, shLine2: sh.line2, shCity: sh.city, shState: sh.state, shZip: sh.zip });
    renderLines();
    el.submit.textContent = "Update " + o.id;
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Editing " + o.id + " — save to update");
  }

  /* ---------- output panel ---------- */
  var outTab = "email";
  function showOrder(o) {
    current = o;
    var msg = o.type === "order" ? buildOrder(o) : buildThanks(o);
    var link = linkFor(o);
    var sms = buildSms(o, link);
    var email = o.customer.email;
    var phone = digits(o.customer.phone);
    /* cc the studio: replies and pet photos must not die in a helper's personal inbox, and the studio keeps a copy */
    var mailHref = "mailto:" + (email || "") + "?cc=" + encodeURIComponent(CFG.studioEmail) + "&subject=" + encodeURIComponent(msg.subject) + "&body=" + encodeURIComponent(msg.body.replace(/\n/g, "\r\n"));
    var smsHref = "sms:" + (phone || "") + "?&body=" + encodeURIComponent(sms);
    var st = o.status === "paid" ? '<span class="status-pill">paid in full</span>' : (o.status === "deposit" ? '<span class="status-pill owe">balance ' + money(o.totals.balance) + '</span>' : '<span class="status-pill owe">unpaid</span>');
    /* CS Hard Rule 1: event orders of more than 5 pieces go to Elise before anything is promised */
    var big = qtyTotal(o) > 5;
    el.out.innerHTML =
      '<div class="out-head"><h2>' + (o.type === "order" ? "Confirmation" : "Thank-you") + ' for ' + esc(firstName(o.customer.name)) + '</h2>' +
      '<span class="oid">' + esc(o.id) + '</span></div>' +
      '<p>' + st + (o.type === "thanks" ? ' <span class="status-pill thanks">took home today</span>' : '') + (big ? ' <span class="status-pill owe">6+ pieces — Elise confirms before sending</span>' : '') + '</p>' +
      '<div class="msg-tabs" role="tablist"><button type="button" role="tab" data-tab="email" aria-selected="' + (outTab === "email") + '">Email</button><button type="button" role="tab" data-tab="sms" aria-selected="' + (outTab === "sms") + '">Text</button></div>' +
      '<p class="msg-subject" data-subj><span>Subject:</span> <strong>' + esc(msg.subject) + '</strong></p>' +
      '<pre class="msg" data-msg tabindex="0"></pre>' +
      '<div class="out-actions">' +
      '<a class="btn btn-glow" data-mail href="' + esc(mailHref) + '"' + (email ? '' : ' aria-disabled="true" title="No email on this order"') + '><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>Email</a>' +
      '<a class="btn btn-primary" data-sms href="' + esc(smsHref) + '"' + (phone ? '' : ' aria-disabled="true" title="No phone on this order"') + '><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg>Text</a>' +
      '<button class="btn btn-ghost" type="button" data-copy><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5h10"/></svg>Copy</button>' +
      (CFG.canPrint === false ? '' : '<button class="btn btn-ghost" type="button" data-print><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/></svg>Print</button>') +
      '</div>' +
      '<p class="out-to">To: ' + (email ? '<span class="sel">' + esc(email) + '</span> <button type="button" class="btn btn-ghost btn-small" data-copy-to="' + esc(email) + '">copy</button>' : '<em>no email</em>') +
      (phone ? ' · <span class="sel">' + esc(o.customer.phone) + '</span> <button type="button" class="btn btn-ghost btn-small" data-copy-to="' + esc(phone) + '">copy</button>' : '') + '</p>' +
      (link
        ? '<div class="qr-wrap"><div data-qr></div><p>Customer scans to open their copy — no typing.<br><a href="' + esc(link) + '" target="_blank" rel="noopener">open link</a> · <button type="button" class="btn btn-ghost btn-small" data-copy-link>copy link</button></p></div>'
        : '<p class="out-note">Link + QR appear once the site is live (or set publicBaseUrl in event-desk.js).</p>') +
      (msg.body.length > (CFG.mailtoSoftLimit || 1900) ? '<p class="out-note"><strong>Long message</strong> — if your Mail app cuts it off, tap Copy and paste it in instead.</p>' : '') +
      '<p class="out-note">Email and Text open your phone\'s own app with the message filled in — read it once, then send. Nothing is sent automatically.</p>' +
      '<p class="out-note" data-sent-marks>' + sentMarks(o) + '</p>' +
      '<p class="out-note"><button type="button" class="btn btn-ghost btn-small" data-copy-log>Copy log line</button> <span class="tiny">for the Notion changelog · ' + esc(logLine(o)) + '</span></p>';
    renderTab(msg, sms);
    $$("[data-tab]", el.out).forEach(function (b) { b.addEventListener("click", function () { outTab = b.getAttribute("data-tab"); $$("[data-tab]", el.out).forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); }); renderTab(msg, sms); }); });
    $("[data-copy]", el.out).addEventListener("click", function () { copyText(outTab === "sms" ? sms : "Subject: " + msg.subject + "\n\n" + msg.body, "Message copied"); markSent(o, "copied"); });
    /* a tap opens the mail/text app; only the person knows whether Send was pressed — ask */
    var ml = $("[data-mail]", el.out); if (email) ml.addEventListener("click", function () { askSent(o, "emailed", "Did the email go out?"); });
    var sm = $("[data-sms]", el.out); if (phone) sm.addEventListener("click", function () { askSent(o, "texted", "Did the text go out?"); });
    var pr = $("[data-print]", el.out); if (pr) pr.addEventListener("click", function () { window.print(); markSent(o, "printed"); });
    $$("[data-copy-to]", el.out).forEach(function (b) { b.addEventListener("click", function () { copyText(b.getAttribute("data-copy-to"), "Copied"); }); });
    var cl = $("[data-copy-link]", el.out); if (cl) cl.addEventListener("click", function () { copyText(link, "Link copied"); });
    $("[data-copy-log]", el.out).addEventListener("click", function () { copyText(logLine(o), "Log line copied — paste into Notion"); });
    $$("[aria-disabled='true']", el.out).forEach(function (a) { a.addEventListener("click", function (ev) { ev.preventDefault(); toast(a.hasAttribute("data-mail") ? "No email on this order — use Copy, Text or Print." : "No phone on this order — use Copy, Email or Print."); }); });
    if (link && window.qrcode) {
      try {
        var q = qrcode(0, "L"); q.addData(link); q.make();   /* L = fewest modules; the link is re-typeable anyway */
        $("[data-qr]", el.out).innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
        var svg = $("[data-qr] svg", el.out); if (svg) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "QR code for the customer's copy"); }
      } catch (err) { /* payload too long for a QR — the link still works */ }
    }
  }
  /* which channel the message went out on — so the log can show who never got theirs */
  function markSent(o, how) {
    o.sent = o.sent || {};
    o.sent[how] = new Date().toISOString();
    o.updatedAt = o.sent[how];
    Store.put(o);
    var m = $("[data-sent-marks]", el.out); if (m) m.innerHTML = sentMarks(o);
  }
  function askSent(o, how, question) {
    var m = $("[data-sent-marks]", el.out); if (!m) return;
    m.innerHTML = '<span class="sent-ask">' + esc(question) + ' <button type="button" class="btn btn-primary btn-small" data-sent-yes>Yes, sent</button> <button type="button" class="btn btn-ghost btn-small" data-sent-no>Not yet</button></span>';
    $("[data-sent-yes]", m).addEventListener("click", function () { markSent(o, how); });
    $("[data-sent-no]", m).addEventListener("click", function () { m.innerHTML = sentMarks(o); });
  }
  function sentMarks(o) {
    var s = o.sent || {}, keys = Object.keys(s);
    if (!keys.length) return '<span class="status-pill owe">not sent yet</span>';
    return keys.map(function (k) { return '<span class="status-pill">' + esc(k) + ' ' + esc(fmtTime(s[k])) + '</span>'; }).join(" ");
  }
  function renderTab(msg, sms) {
    var pre = $("[data-msg]", el.out), subj = $("[data-subj]", el.out);
    if (outTab === "sms") { pre.textContent = sms; subj.hidden = true; }
    else { pre.textContent = msg.body; subj.hidden = false; }
  }
  function copyText(text, okMsg) {
    var done = function () { toast(okMsg); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); }); }
    else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) { /* nothing */ } document.body.removeChild(ta);
  }

  /* ---------- log ---------- */
  var logFilter = "all";
  $$("[data-log-filter]").forEach(function (b) { b.addEventListener("click", function () {
    logFilter = b.getAttribute("data-log-filter");
    $$("[data-log-filter]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    renderLog();
  }); });
  function cashBox(all) {
    var today = localYmd(), n = 0, paid = 0, owed = 0, by = {};
    all.forEach(function (o) {
      if (localYmd(o.createdAt) !== today) return;
      var t = o.totals || {};
      n++; paid += t.paid || 0; owed += t.balance || 0;
      if (t.paid) by[o.payMethod || "—"] = (by[o.payMethod || "—"] || 0) + t.paid;
    });
    if (!n) return "";
    return "Today: " + n + (n === 1 ? " order" : " orders") + " · collected " + money(paid) +
      (Object.keys(by).length ? " (" + Object.keys(by).map(function (k) { return k + " " + money(by[k]); }).join(" · ") + ")" : "") +
      (owed ? " · balances outstanding " + money(owed) : "");
  }
  function renderLog() {
    var all = Store.all().slice().sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
    el.logCount.forEach(function (c) { c.textContent = all.length; });
    var cb = $("[data-cashbox]"); if (cb) cb.textContent = cashBox(all);
    var list = all.filter(function (o) {
      if (logFilter === "owed") return o.totals.balance > 0;
      if (logFilter === "unsent") return !o.sent || !Object.keys(o.sent).length;
      return true;
    });
    if (!all.length) { el.logList.innerHTML = '<li class="log-empty">No orders yet on this device.</li>'; return; }
    if (!list.length) { el.logList.innerHTML = '<li class="log-empty">Nothing matches this filter.</li>'; return; }
    el.logList.innerHTML = list.map(function (o) {
      var t = o.totals || {}, c = o.customer || {}, items = o.items || [];
      var st = o.status === "paid" ? "paid" : (o.status === "deposit" ? "balance " + money(t.balance || 0) : "unpaid");
      var sentKeys = Object.keys(o.sent || {});
      return '<li><details class="log-item" data-id="' + esc(o.id) + '"><summary>' +
        '<span class="li-name">' + esc(c.name) + ' <span class="status-pill' + (o.type === "thanks" ? ' thanks' : (o.status === "paid" ? '' : ' owe')) + '">' + (o.type === "thanks" ? "thank-you" : st) + '</span>' +
        (sentKeys.length ? '' : ' <span class="status-pill owe">not sent</span>') + '</span>' +
        '<span class="li-amt">' + money(t.total || 0) + '</span>' +
        '<span class="li-sub">' + esc(o.id) + ' · ' + esc(fmtTime(o.createdAt)) + (o.event ? ' · ' + esc(o.event) : '') + ' · ' + esc(items.map(function (i) { return i.qty + "× " + i.name; }).join(", ")) + (sentKeys.length ? ' · ' + esc(sentKeys.join(", ")) : '') + '</span>' +
        '</summary><div class="li-body"><dl>' +
        '<dt>Contact</dt><dd>' + esc([c.email, c.phone].filter(Boolean).join(" · ") || "—") + '</dd>' +
        (o.ship && shipLines(o.ship) ? '<dt>Ship to</dt><dd>' + esc(shipLines(o.ship)).replace(/\n/g, "<br>") + '</dd>' : '') +
        '<dt>Paid</dt><dd>' + money(t.paid || 0) + (o.payMethod ? ' · ' + esc(o.payMethod) : '') + '</dd>' +
        (o.note ? '<dt>Note</dt><dd>' + esc(o.note) + '</dd>' : '') +
        '</dl><div class="li-actions"><button type="button" class="btn btn-primary" data-open="' + esc(o.id) + '">Open message</button><button type="button" class="btn btn-ghost" data-edit="' + esc(o.id) + '">Edit</button><button type="button" class="btn btn-danger" data-del="' + esc(o.id) + '">Delete</button></div></div></details></li>';
    }).join("");
  }
  el.logList.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var o;
    if (b.hasAttribute("data-open")) { o = findOrder(b.getAttribute("data-open")); if (o) { showOrder(o); el.out.scrollIntoView({ behavior: "smooth", block: "start" }); } }
    if (b.hasAttribute("data-edit")) { o = findOrder(b.getAttribute("data-edit")); if (o) loadForEdit(o); }
    if (b.hasAttribute("data-del")) { var id = b.getAttribute("data-del"); armed(b, function () { Store.remove(id); if (current && current.id === id) { current = null; el.out.innerHTML = '<p class="out-empty">Save an order to write its message here.</p>'; } toast("Deleted " + id); }, "Tap again to delete"); }
  });
  Store.onChange(renderLog);
  Store.onChange(function () { updateStatus(); });

  /* ---------- export / import ---------- */
  /* A hosting page may supply window.PurrlightDownload(name, text, mime, onFail);
     it must call onFail() when it cannot save so we fall back to copying. */
  var download = function (name, text, mime) {
    var fallback = function () { copyText(text, "Download not available here — copied instead. Paste into a file named " + name); };
    if (typeof window.PurrlightDownload === "function") { window.PurrlightDownload(name, text, mime, fallback); return; }
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    } catch (e) { fallback(); }
  };
  /* only rows in the desk's own shape are merged — a stray file must never brick the log */
  function validOrder(o) {
    return !!(o && typeof o === "object" && typeof o.id === "string" && typeof o.createdAt === "string" && o.customer && typeof o.customer.name === "string" &&
      Array.isArray(o.items) && o.totals && typeof o.totals.total === "number" && (o.type === "thanks" || o.type === "order"));
  }
  function csvCell(v) { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function toCsv(list) {
    var head = ["id", "type", "created_at", "event", "staff", "customer_name", "email", "phone", "email_optin", "items", "custom_details", "subtotal", "discount", "tax", "tax_mode", "total", "paid", "balance", "status", "pay_method", "ship_name", "ship_address", "timeline", "note"];
    var rows = list.map(function (o) {
      var t = o.totals, sh = o.ship || {};
      return [o.id, o.type, o.createdAt, o.event, o.staff, o.customer.name, o.customer.email, o.customer.phone, o.customer.optIn ? "yes" : "no",
        o.items.map(function (i) { return i.qty + "x " + i.name + (i.addon ? " [" + i.addon + "]" : "") + " @" + (cents(i.unit) / 100).toFixed(2); }).join(" | "),
        o.items.filter(function (i) { return i.custom; }).map(function (i) { var c = i.custom; return [c.pet, c.size, c.yarn, c.pair ? "pair" : "", c.pose, c.eyes, c.code].filter(Boolean).join(" / "); }).join(" | "),
        (t.subtotal / 100).toFixed(2), (t.discount / 100).toFixed(2), (t.tax / 100).toFixed(2), t.taxMode || "", (t.total / 100).toFixed(2), (t.paid / 100).toFixed(2), (t.balance / 100).toFixed(2),
        o.status, o.payMethod, sh.name || "", [sh.line1, sh.line2, sh.city, sh.state, sh.zip].filter(Boolean).join(", "), o.timeline || "", o.note].map(csvCell).join(",");
    });
    return "﻿" + head.join(",") + "\n" + rows.join("\n");
  }
  function stamp() { var d = new Date(); return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()); }
  $$("[data-export-csv]").forEach(function (b) { b.addEventListener("click", function () {
    var all = Store.all(); if (!all.length) { toast("Nothing to export yet."); return; }
    download("purrlight-event-orders-" + stamp() + ".csv", toCsv(all), "text/csv;charset=utf-8"); toast("CSV ready — " + all.length + " orders");
  }); });
  $$("[data-export-json]").forEach(function (b) { b.addEventListener("click", function () {
    var all = Store.all(); if (!all.length) { toast("Nothing to export yet."); return; }
    download("purrlight-event-orders-" + stamp() + ".json", JSON.stringify({ exportedAt: new Date().toISOString(), device: settings.device, event: settings.event, orders: all }, null, 2), "application/json"); toast("Backup ready");
  }); });
  var importInput = $("[data-import-json]");
  if (importInput) importInput.addEventListener("change", function () {
    var f = importInput.files && importInput.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result), list = data.orders || data, mine = Store.all(), added = 0, skipped = 0;
        if (!Array.isArray(list)) throw new Error("bad");
        list.forEach(function (o) {
          if (!validOrder(o)) { skipped++; return; }
          if (indexOfId(mine, o.id) === -1) { mine.push(o); added++; }
        });
        if (added) Store.replaceAll(mine);
        toast("Merged " + added + " new order" + (added === 1 ? "" : "s") + (skipped ? " · skipped " + skipped + " that weren't desk orders" : ""));
      } catch (e) { toast("That file isn't a Purrlight backup."); }
      importInput.value = "";
    };
    r.readAsText(f);
  });
  $$("[data-clear-all]").forEach(function (b) { b.addEventListener("click", function () {
    var n = Store.all().length; if (!n) { toast("The log is already empty."); return; }
    armed(b, function () { Store.replaceAll([]); toast("Log cleared — " + n + " orders removed"); }, "Tap again to delete all " + n);
  }); });

  /* ---------- settings ---------- */
  var panel = $("[data-settings]");
  function openSettings() {
    $("#st-event", panel).value = settings.event || "";
    $("#st-staff", panel).value = settings.staff || "";
    $("#st-device", panel).value = settings.device;
    $("#st-taxmode", panel).value = settings.taxMode;
    $("#st-taxrate", panel).value = (settings.taxRate * 100).toFixed(3).replace(/\.?0+$/, "");
    panel.hidden = false; $("#st-event", panel).focus();
  }
  function closeSettings() { panel.hidden = true; }
  $$("[data-open-settings]").forEach(function (b) { b.addEventListener("click", openSettings); });
  $$("[data-close-settings]").forEach(function (b) { b.addEventListener("click", closeSettings); });
  $("[data-save-settings]", panel).addEventListener("click", function () {
    settings.event = $("#st-event", panel).value.trim();
    settings.staff = $("#st-staff", panel).value.trim();
    var dev = $("#st-device", panel).value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
    if (dev) settings.device = dev;
    var tm = $("#st-taxmode", panel).value; settings.taxMode = (tm === "included" || tm === "added") ? tm : "none";
    var rate = parseFloat($("#st-taxrate", panel).value); if (!isNaN(rate) && rate >= 0 && rate < 30) settings.taxRate = Math.round(rate * 100000) / 10000000;
    saveSettings(); applyEventName(); renderMoney(); closeSettings(); toast("Settings saved");
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closeSettings(); });
  function applyEventName() { el.eventName.forEach(function (s) { s.textContent = settings.event || "Set event name"; }); }

  /* ---------- hand-over sheet: the customer types their own details ---------- */
  var handover = $("[data-handover]");
  if (handover) {
    var H = function (id) { return $("#" + id, handover); };
    $$("[data-open-handover]").forEach(function (b) { b.addEventListener("click", function () {
      var f = readFields();
      H("h-name").value = f.name; H("h-email").value = f.email; H("h-phone").value = f.phone; H("h-optin").checked = f.optIn;
      H("h-line1").value = f.shLine1; H("h-line2").value = f.shLine2; H("h-city").value = f.shCity; H("h-state").value = f.shState; H("h-zip").value = f.shZip;
      $("[data-handover-ship]", handover).hidden = mode !== "order";
      handover.hidden = false; document.body.style.overflow = "hidden";
      H(f.name ? "h-email" : "h-name").focus();
    }); });
    $("[data-handover-done]", handover).addEventListener("click", function () {
      el.name.value = H("h-name").value.trim(); el.email.value = H("h-email").value.trim(); el.phone.value = H("h-phone").value.trim();
      if (el.optIn) el.optIn.checked = H("h-optin").checked;
      if (mode === "order") { el.shLine1.value = H("h-line1").value.trim(); el.shLine2.value = H("h-line2").value.trim(); el.shCity.value = H("h-city").value.trim(); el.shState.value = H("h-state").value.trim().toUpperCase(); el.shZip.value = H("h-zip").value.trim(); }
      handover.hidden = true; document.body.style.overflow = "";
      saveDraft(); toast("Got it — thanks, " + (firstName(el.name.value) !== "there" ? firstName(el.name.value) : "friend") + ". Hand it back.");
      el.submit.focus();
    });
  }

  /* ---------- status + toast ---------- */
  function updateStatus() {
    if (!el.status) return;
    var off = ("onLine" in navigator) && !navigator.onLine;
    el.status.classList.toggle("offline", off || !storageOk);
    $("span:last-child", el.status).textContent = !storageOk
      ? "NOT SAVING on this device (private mode or storage full) — Copy or Print each message before moving on"
      : (Store.label || LocalStore.label) + (off ? " · offline right now — everything still saves here" : "");
  }
  window.addEventListener("online", updateStatus); window.addEventListener("offline", updateStatus);
  var toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg; el.toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.toast.classList.remove("show"); }, 2600);
  }
  $$("[data-scroll-log]").forEach(function (b) { b.addEventListener("click", function () { $("[data-log]").scrollIntoView({ behavior: "smooth" }); }); });

  /* ---------- boot ---------- */
  applyEventName();
  updateStatus();
  renderLog();
  var draft = lsGet(LS.draft, null);
  if (draft && draft.fields) {
    editingId = draft.editingId || null;
    paidTouched = !!draft.paidTouched;
    timelineTouched = !!draft.timelineTouched;
    setMode(draft.mode || "thanks");
    lines = (draft.lines || []).map(function (l) {
      /* re-attach catalog addons and prices from the live catalog */
      var p = null; catalog.forEach(function (c) { if (c.id === l.pid) p = c; });
      if (p) { l.addons = p.addons || null; l.unit = p.price; l.kind = "catalog"; }
      if (!l.kind) l.kind = l.custom ? "cat" : "other";
      return l;
    });
    writeFields(draft.fields);
    renderLines();
    if (editingId) el.submit.textContent = "Update " + editingId;
    if (lines.length || draft.fields.name) toast("Picked up where you left off");
  } else {
    setMode("thanks");
    resetForm();
  }
  if (!settings.event) setTimeout(openSettings, 400);
})();
