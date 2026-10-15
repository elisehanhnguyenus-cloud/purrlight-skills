/* ============================================================
   Purrlight Custom Orders — price model (pure data + math, no DOM)
   ------------------------------------------------------------
   SOURCE OF TRUTH: "Custom Orders Landing Page — Handoff Brief" §3
   (Notion, Morgan Chen / Elise, 15/10/2026) + Elise's decisions of
   15/10/2026 (marked "Elise 15/10"). Every number below traces to one of
   those — do not add or change a price here without the owner's word.

   Decided by Elise 15/10/2026:
   - Frames 4×6 $8 · 5×7 $16 · 8×10 $24 (confirmed).
   - "Order more, save more" (paintings, housewarming boxes): counted per
     item — the 1st at full price, the 2nd–4th 5% off, the 5th onward 10%
     off — on the whole item (painting with its paper/frame/box/rosary;
     box with its add-ons).
   - Both godparents: the second set is $10 less ($95 + $85).
   - 50% deposit when ordering; the balance after the photo is approved.

   Readings still open (flagged to Elise — change ONE constant if needed):
   - Watercolor "Print 4×6 $12 · 5×7 $15 · 8×10 $20" are read as the
     price of a printed painting (not $10 digital + print).
   - "+$5" applies to handmade Vietnamese Dó papyrus; fine-art paper is
     read as the print's default paper. A gift box is offered for prints.
   - "Second pet on the same order −$10": the second pet is $10 less
     than its own size × yarn price (same size and yarn assumed).
   - Housewarming "Add or swap, +$10 each": adding and swapping cost the same.
   ============================================================ */

/* The one order form for all seven products (brief §1 / §5). Edit it HERE — every order link on the
   page is rewritten from this constant on load. TODO Elise: paste the form link (Tally recommended, see below).
   Until the form exists the buttons email the studio. The same mailto is written into index.html
   (data-order hrefs + <noscript> lines) only as the no-JavaScript fallback; it may stay as email. */
var ORDER_FORM_URL = "mailto:hello@purrlight.studio?subject=Custom%20order";
/* Recommended form: a free Tally form (no sign-in for customers, photo uploads up to 10 MB each).
   Paste its link (https://tally.so/r/XXXXXX) above; give the form four hidden fields named
   pick, product, total and deposit — the page fills them in. (Google Forms makes customers sign in
   to upload photos, which Instagram/TikTok in-app browsers often block.)
   Optional, Google Forms only: the field that should receive the customer's pick (e.g. "entry.123456789").
   Leave "" and the page copies the pick to the clipboard instead. To find the id: Google Form → ⋮ → Get pre-filled link. */
var ORDER_FORM_PREFILL_ENTRY = "";

/* Where the deposit is paid (Elise 15/10/2026). The Square link is a "Custom order" payment link where the
   customer types the amount; Zelle goes to this address. The same values are written into index.html (#pay)
   for visitors without JavaScript — change both together. */
var PAY = {
  squareUrl: "https://square.link/u/UUg2LtbP",
  zelleTo: "purrlightstudiollc@gmail.com"
};

var PRICES = {
  portraitDoll: { base: 80, shadowbox: 10 },                               /* §3.2 */
  pet: {                                                                     /* §3.3 */
    sizes: ["Petite", "Classic", "Grand"],
    yarns: ["Cotton", "Velvet", "Fluffy"],
    table: { Petite: [40, 48, 55], Classic: [55, 67, 79], Grand: [90, 105, 120] },
    secondPetOff: 10
  },
  watercolor: {                                                              /* §3.4 */
    formats: [
      { key: "digital", label: "Digital file", price: 10 },
      { key: "4x6", label: "Print 4×6", price: 12 },
      { key: "5x7", label: "Print 5×7", price: 15 },
      { key: "8x10", label: "Print 8×10", price: 20 }
    ],
    doPaper: 5,                                   /* handmade Vietnamese Dó papyrus +$5 */
    frame: { "4x6": 8, "5x7": 16, "8x10": 24 },  /* Elise 15/10: confirmed */
    giftBox: 5,
    rosary: 15
  },
  housewarming: { base: 50, addon: 10, maxAddons: 4 },                       /* §3.5 · add-ons list: Elise 15/10 */
  christening: { gownSet: 89, confirmationBox: 55 },                         /* §3.6 (confirmation box: coming soon) */
  godparent: { base: 95, secondOff: 10 },                                    /* §3.7 · second set −$10: Elise 15/10 */
  calendar: {                                                                /* §3.8 */
    print:   { 1: 20, 6: 50 },   /* 1 page $20 · add 5 more pages +$30 (6 pages $50) */
    digital: { 1: 15, 6: 25 }
  },
  volume: {                                   /* Elise 15/10: per item, on the whole item */
    tiers: [{ from: 2, off: 0.05 }, { from: 5, off: 0.10 }],
    maxQty: 50
  },
  depositRate: 0.5                            /* brief §1 + Elise 15/10: 50% deposit today */
};

/* ---------- helpers ---------- */
function money(n) {
  var s = (Math.round(n * 100) / 100).toFixed(2);
  return "$" + s.replace(/\.00$/, "");
}

/* ---------- estimators (each returns {total, lines:[{label, amount}], note}) ---------- */
function estPortraitDoll(o) {
  var lines = [{ label: "Custom Portrait Crochet Doll", amount: PRICES.portraitDoll.base }];
  if (o && o.shadowbox) lines.push({ label: "Wooden shadowbox display case", amount: PRICES.portraitDoll.shadowbox });
  return finish(lines);
}

function estPet(o) {
  var size = o && PRICES.pet.sizes.indexOf(o.size) > -1 ? o.size : "Classic";
  var yarn = o && PRICES.pet.yarns.indexOf(o.yarn) > -1 ? o.yarn : "Cotton";
  var each = PRICES.pet.table[size][PRICES.pet.yarns.indexOf(yarn)];
  var lines = [{ label: size + " · " + yarn, amount: each }];
  var r;
  if (o && o.pets === 2) {
    lines.push({ label: "Second pet on the same order (" + size + " · " + yarn + ", −$" + PRICES.pet.secondPetOff + ")", amount: each - PRICES.pet.secondPetOff });
    r = finish(lines);
    r.note = "Second pet priced at the same size and yarn — estimate";
    return r;
  }
  return finish(lines);
}

function estWatercolor(o) {
  var fmt = null;
  for (var i = 0; i < PRICES.watercolor.formats.length; i++) if (PRICES.watercolor.formats[i].key === (o && o.format)) fmt = PRICES.watercolor.formats[i];
  fmt = fmt || PRICES.watercolor.formats[0];
  var isPrint = fmt.key !== "digital";
  var lines = [{ label: fmt.label, amount: fmt.price }];
  if (isPrint && o.doPaper) lines.push({ label: "Handmade Vietnamese Dó papyrus", amount: PRICES.watercolor.doPaper });
  if (isPrint && o.frame) lines.push({ label: "Frame " + fmt.label.replace("Print ", ""), amount: PRICES.watercolor.frame[fmt.key] });
  if (isPrint && o.giftBox) lines.push({ label: "Gift box", amount: PRICES.watercolor.giftBox });
  if (o && o.rosary) lines.push({ label: "Crochet rosary add-on", amount: PRICES.watercolor.rosary });
  var r = applyQty(finish(lines), o && o.qty, "painting", "paintings");
  r.note = r.qty > 1 ? "Estimate for " + r.qty + " paintings with the same options" : "Estimate for one painting";
  return r;
}

/* o.addons: [{ name, swapFor }] (swapFor "" = added to the box) — or plain names, or a count. +$10 each either way. */
function estHousewarming(o) {
  var lines = [{ label: "Housewarming & Closing Gift Box", amount: PRICES.housewarming.base }];
  var a = o && o.addons, max = PRICES.housewarming.maxAddons;
  if (Array.isArray(a)) {
    for (var i = 0; i < a.length && i < max; i++) {
      var it = typeof a[i] === "object" && a[i] ? a[i] : { name: String(a[i]) };
      lines.push({ label: it.swapFor ? "Swap: " + it.swapFor + " → " + it.name : "Add: " + it.name, amount: PRICES.housewarming.addon });
    }
  } else {
    var n = a > 0 ? Math.min(Math.floor(a), max) : 0;
    if (n) lines.push({ label: "Add or swap × " + n, amount: PRICES.housewarming.addon * n });
  }
  var r = applyQty(finish(lines), o && o.qty, "box", "boxes");
  r.note = r.qty > 1 ? "Estimate for " + r.qty + " boxes with the same items" : "Estimate for one box";
  return r;
}

function estCalendar(o) {
  var kind = o && o.kind === "digital" ? "digital" : "print";
  var pages = o && o.pages === 6 ? 6 : 1;
  var label = (kind === "print" ? "Design + print" : "Digital files only") + " · " + (pages === 1 ? "1 page" : "6 pages");
  return finish([{ label: label, amount: PRICES.calendar[kind][pages] }]);
}

function estGodparent(o) {
  var lines = [{ label: "Godparent Gift Set", amount: PRICES.godparent.base }];
  if (o && o.count === 2) lines.push({ label: "Second godparent set (−$" + PRICES.godparent.secondOff + ")", amount: PRICES.godparent.base - PRICES.godparent.secondOff });
  return finish(lines);
}
function estChristeningGown() { return finish([{ label: "Christening Gown Set — lace & satin", amount: PRICES.christening.gownSet }]); }

function round2(n) { return Math.round(n * 100) / 100; }

function finish(lines) {
  var total = 0;
  for (var i = 0; i < lines.length; i++) total += lines[i].amount;
  return settle({ total: round2(total), lines: lines, note: "", qty: 1 });
}

/* the discount rate of the n-th identical item (1-based): 0 · 5% from the 2nd · 10% from the 5th */
function itemOff(n) {
  var off = 0, t = PRICES.volume.tiers;
  for (var i = 0; i < t.length; i++) if (n >= t[i].from) off = t[i].off;
  return off;
}

/* qty identical items: lines stay per item; subtotal, saving and total cover all of them */
function applyQty(r, qty, one, many) {
  var q = Math.floor(Number(qty));
  if (!(q >= 1)) q = 1;
  if (q > PRICES.volume.maxQty) q = PRICES.volume.maxQty;
  r.qty = q; r.unit = r.total; r.one = one; r.many = many;
  if (q > 1) {
    var saving = 0;
    for (var i = 2; i <= q; i++) saving += round2(r.unit * itemOff(i));
    r.subtotal = round2(r.unit * q);
    r.saving = round2(saving);
    r.total = round2(r.subtotal - r.saving);
  }
  return settle(r);
}

/* 50% deposit today, the rest after the photo is approved */
function settle(r) {
  r.deposit = round2(r.total * PRICES.depositRate);
  r.balance = round2(r.total - r.deposit);
  return r;
}

/* one-line summary the customer can paste into the order form */
function summaryLine(product, est) {
  var parts = [];
  for (var i = 0; i < est.lines.length; i++) parts.push(est.lines[i].label + " " + money(est.lines[i].amount));
  var qty = est.qty > 1 ? " — × " + est.qty + " " + est.many + " " + money(est.subtotal) + ", order more, save more −" + money(est.saving) : "";
  return "My pick: " + product + " — " + parts.join(" · ") + qty + " — estimate " + money(est.total) + " · deposit (50%) " + money(est.deposit) + " · Free U.S. shipping";
}

if (typeof module !== "undefined") {
  module.exports = { ORDER_FORM_URL: ORDER_FORM_URL, ORDER_FORM_PREFILL_ENTRY: ORDER_FORM_PREFILL_ENTRY, PAY: PAY, PRICES: PRICES, money: money, itemOff: itemOff, applyQty: applyQty, estPortraitDoll: estPortraitDoll, estPet: estPet, estWatercolor: estWatercolor, estHousewarming: estHousewarming, estCalendar: estCalendar, estGodparent: estGodparent, estChristeningGown: estChristeningGown, summaryLine: summaryLine };
}
