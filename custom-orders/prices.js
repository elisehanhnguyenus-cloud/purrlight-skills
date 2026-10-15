/* ============================================================
   Purrlight Custom Orders — price model (pure data + math, no DOM)
   ------------------------------------------------------------
   SOURCE OF TRUTH: "Custom Orders Landing Page — Handoff Brief" §3
   (Notion, Morgan Chen / Elise, 15/10/2026). Every number below is a
   number from that brief — do not add or change a price here without
   changing the brief first. The page copy prints the brief's prices
   verbatim; this file only lets the estimator add them up.

   Deliberately NOT computed (the brief leaves them open, so the page
   quotes the brief's own sentences instead): quantities, the 5% / 10%
   "order more" tiers, deposits, "both godparents".

   Readings that the brief leaves open (flagged to Elise — change ONE
   constant if she decides otherwise):
   - Watercolor "Print 4×6 $12 · 5×7 $15 · 8×10 $20" are read as the
     price of a printed painting (not $10 digital + print).
   - "+$5" applies to handmade Vietnamese Dó papyrus; fine-art paper is
     read as the print's default paper. A gift box is offered for prints.
   - "Second pet on the same order −$10": the second pet is $10 less
     than its own size × yarn price (same size and yarn assumed).
   ============================================================ */

/* The one Google Form for all seven products (brief §1 / §5) — THE ONLY PLACE TO EDIT.
   TODO Elise: paste the Google Form link here. Until the form exists the buttons email the studio
   (the same mailto is written in the HTML, so the page also works without JavaScript). */
var ORDER_FORM_URL = "mailto:hello@purrlight.studio?subject=Custom%20order";
/* Optional: the Google Form field that should receive the customer's pick (e.g. "entry.123456789").
   Leave "" and the page copies the pick to the clipboard instead. To find the id: Google Form → ⋮ → Get pre-filled link. */
var ORDER_FORM_PREFILL_ENTRY = "";

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
    frame: { "4x6": 8, "5x7": 16, "8x10": 24 },  /* 5×7 and 8×10 derived from "+$8 per size step" — Elise to confirm */
    giftBox: 5,
    rosary: 15
  },
  housewarming: { base: 50, addon: 10 },                                     /* §3.5 */
  christening: { gownSet: 89, confirmationBox: 55 },                         /* §3.6 (confirmation box: coming soon) */
  godparent: { base: 95 },                                                   /* §3.7 */
  calendar: {                                                                /* §3.8 */
    print:   { 1: 20, 6: 50 },   /* 1 page $20 · add 5 more pages +$30 (6 pages $50) */
    digital: { 1: 15, 6: 25 }
  }
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
  var r = finish(lines);
  r.note = "Estimate for one painting";
  return r;
}

function estHousewarming(o) {
  var addons = o && o.addons > 0 ? Math.min(Math.floor(o.addons), 3) : 0;
  var lines = [{ label: "Housewarming & Closing Gift Box", amount: PRICES.housewarming.base }];
  if (addons) lines.push({ label: "Add or swap × " + addons, amount: PRICES.housewarming.addon * addons });
  var r = finish(lines);
  r.note = "Estimate for one box";
  return r;
}

function estCalendar(o) {
  var kind = o && o.kind === "digital" ? "digital" : "print";
  var pages = o && o.pages === 6 ? 6 : 1;
  var label = (kind === "print" ? "Design + print" : "Digital files only") + " · " + (pages === 1 ? "1 page" : "6 pages");
  return finish([{ label: label, amount: PRICES.calendar[kind][pages] }]);
}

function estGodparent() { return finish([{ label: "Godparent Gift Set", amount: PRICES.godparent.base }]); }
function estChristeningGown() { return finish([{ label: "Christening Gown Set — lace & satin", amount: PRICES.christening.gownSet }]); }

function finish(lines) {
  var total = 0;
  for (var i = 0; i < lines.length; i++) total += lines[i].amount;
  return { total: Math.round(total * 100) / 100, lines: lines, note: "" };
}

/* one-line summary the customer can paste into the order form */
function summaryLine(product, est) {
  var parts = [];
  for (var i = 0; i < est.lines.length; i++) parts.push(est.lines[i].label + " " + money(est.lines[i].amount));
  return "My pick: " + product + " — " + parts.join(" · ") + " — estimate " + money(est.total) + " · Free U.S. shipping";
}

if (typeof module !== "undefined") {
  module.exports = { ORDER_FORM_URL: ORDER_FORM_URL, ORDER_FORM_PREFILL_ENTRY: ORDER_FORM_PREFILL_ENTRY, PRICES: PRICES, money: money, estPortraitDoll: estPortraitDoll, estPet: estPet, estWatercolor: estWatercolor, estHousewarming: estHousewarming, estCalendar: estCalendar, estGodparent: estGodparent, estChristeningGown: estChristeningGown, summaryLine: summaryLine };
}
