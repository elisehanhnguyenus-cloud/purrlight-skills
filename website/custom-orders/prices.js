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
   - Print paper: regular paper is included in the print price · fine-art
     paper +$10 · handmade Vietnamese Dó papyrus +$5.

   Decided by Elise 16/10/2026:
   - Housewarming box: basic $60; add-ons succulent +$10 · scented candle +$10
     · cold cut box +$15 · 3-berry fruit box +$10 · chocolate box (6 pieces) +$20.
   - Fresh items (cold cut, 3-berry) are pickup only (Pearland Town Center,
     Saturday or Sunday) — never shipped.
   - Texas sales tax 8.25% on the order; the 50% deposit is half of the total
     with tax. Up to 50 paintings or boxes per order on the page (accepted).
   - Order form: Elise's Tally form (below).

   Decided by Elise 16/10/2026, second message (after the tax research):
   - The sales tax permit is in hand. No Texas sales tax on orders shipped
     outside Texas (Tax Code 151.330) — a digital file goes by where the buyer
     lives. Fresh fruit (the 3-berry box) is not taxed. Tax charged is remitted.
   - The portrait doll is no longer "sales tax included": taxed like the rest.
   - Cold cut box: "coming soon" (no food permit yet) — shown, not orderable.
   - Succulent / aloe: sold at events, orders taken online. Our choice, not
     a law (plant shipping rules vary by state): we ship plants within Texas only.
     Elise can drop this (or make plants pickup only).
   - Calendars print on premium matte paper only.

   Decided by Elise 16/10/2026, third message:
   - Housewarming swaps: a swapped-in add-on replaces the basic item's own price
     — the swap costs only the difference, and a cheaper add-on takes the
     difference off. Basic items' selling prices: sparkling cider $15 · jam or
     local honey $5 · digital watercolor painting of the home $15 (a 5×7 print on
     Premium Matte paper) · crochet rosary chain $10.

   Decided by Elise 16/10/2026, fifth message:
   - Christening Gown Set: 25% off its $89 through Sun Oct 25, 2026 (end of the day,
     Central Time) — $66.75; from Oct 26 the page goes back to $89 by itself.

   Decided by Elise 16/10/2026, sixth message:
   - The gown set is for girls and ready to ship in 2–3 days; a boys' outfit is
     coming in 2027.
   - Confirmation gift box can be ordered now, shipping after Nov 12: a saint figure
     + rosary chain — 12 cm figure $55 (a saint we have ready, or one made for you),
     or St. Carlo Acutis / St. Michael the Archangel at 10 in, $90.
   - Timing (Elise 16/10, 13th message), holiday season (until Jan 2 2027): crochet pieces are
     made in 2–3 weeks (holiday peak), then delivered in 3 days–1 week in Texas or 2–3 weeks
     elsewhere in the U.S.; paintings are made in 3–5 days, then delivered in 3 days–1 week
     (2–3 days in Pearland). Outside the holidays: delivered within 15 days. Shown with
     shipping only (not pickup, not digital files, not the ready-made gown set): timingNote().
     Not given for gift boxes, calendars or the Confirmation box, so nothing is said for them
     in the season.
   - Eyes (Elise 16/10, later): she makes both closed "sleeping" eyes and open eyes —
     the visitor picks for a saint made to order (12 cm made for you, St. Carlo,
     St. Michael), same price; a saint we have ready comes as it is. The page avoids
     "safety eyes" (no safety claims, Hard Rules).
   - Every made-to-order / custom piece: a design mockup after the deposit, before we
     start; word when it is in the works; a progress update after about a week.
   - Housewarming add-on: mother-of-pearl spoons, 2 for $12 or 4 for $24, in four
     styles (white carved leaf · brown shell carved leaf · wood handle · blue shell handle).

   Readings still open (flagged to Elise — change ONE constant if needed):
   - Watercolor "Print 4×6 $12 · 5×7 $15 · 8×10 $20" are read as the
     price of a printed painting (not $10 digital + print).
   - A gift box is offered for prints.
   - "Second pet on the same order −$10": the second pet is $10 less
     than its own size × yarn price (same size and yarn assumed).
   ============================================================ */

/* The one order form for all seven products (brief §1 / §5). Edit it HERE — every order link on the
   page is rewritten from this constant on load. The same link is written into index.html (data-order
   hrefs) for visitors without JavaScript — change both together.
   Elise's Tally form (16/10/2026, "Purrlight Custom Gift Order"): free plan, no sign-in for customers,
   photo uploads up to 10 MB each; four hidden fields named pick, product, total and deposit — the page
   fills them in (total and deposit with cents, e.g. 46.01). Notifications go to the studio Gmail; after
   sending, the form returns the customer to #pay on this page.
   A mailto: link also works here (the pick goes in the email body, with blank lines for the shipping
   address and a time to receive it). purrlight.studio is not registered yet (DNS NXDOMAIN, checked
   15/10/2026): email goes to the studio Gmail. */
var ORDER_FORM_URL = "https://tally.so/r/M1KOkY";
/* (Google Forms makes customers sign in to upload photos, which Instagram/TikTok in-app browsers often block.)
   Google Forms only: the field that should receive the customer's pick (e.g. "entry.123456789").
   A Google Form link with this left "" does NOT carry the pick — the customer would have to use "Copy my pick"
   and paste it. To find the id: Google Form → ⋮ → Get pre-filled link. */
var ORDER_FORM_PREFILL_ENTRY = "";

/* Where the deposit is paid (Elise 15/10/2026). The Square link is a "Custom order" payment link where the
   customer types the amount; Zelle goes to this address. The same values are written into index.html (#pay)
   for visitors without JavaScript — change both together. */
var PAY = {
  squareUrl: "https://square.link/u/UUg2LtbP",
  zelleTo: "purrlightstudiollc@gmail.com"
};

var PRICES = {
  portraitDoll: { base: 80, shadowbox: 10 },                               /* §3.2 · taxed like the rest (Elise 16/10, second message) */
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
    fineArt: 10,                                  /* Elise 15/10: fine-art paper +$10 (regular paper included) */
    doPaper: 5,                                   /* handmade Vietnamese Dó papyrus +$5 */
    frame: { "4x6": 8, "5x7": 16, "8x10": 24 },  /* Elise 15/10: confirmed */
    giftBox: 5,
    rosary: 15
  },
  housewarming: {                                                            /* §3.5 · Elise 15/10 + 16/10 */
    base: 60,
    addons: { succulent: 10, candle: 10, coldcut: 15, berry: 10, chocolate: 20,   /* cold cut: coming soon, not orderable */
              spoons: { 2: 12, 4: 24 } },                  /* mother-of-pearl spoons: price by how many (Elise 16/10) */
    basics: { cider: 15, jam: 5, painting: 15, rosary: 10 },   /* Elise 16/10 (3rd): what each basic item sells for — a swap costs the difference */
    fresh: ["coldcut", "berry"],                  /* pickup only — the page turns shipping off from this list */
    plants: ["succulent"],                        /* ships within Texas only — the page turns "ship outside Texas" off */
    taxFree: ["berry"],                           /* fresh fruit: not taxed in Texas */
    maxAddons: 5
  },
  christening: {                                                             /* §3.6 (confirmation box: coming soon) */
    gownSet: 89,
    confirmation: {                                  /* Elise 16/10: ships after Nov 12 */
      ready:   { price: 55, label: "a saint we have ready, 12 cm" },
      made:    { price: 55, label: "a saint made for you, 12 cm" },
      carlo:   { price: 90, label: "St. Carlo Acutis, 10 in" },
      michael: { price: 90, label: "St. Michael the Archangel, 10 in" }
    },
    eyes: { closed: "closed (sleeping) eyes", open: "open eyes" },   /* Elise 16/10: either, same price; not for a saint we have ready */
    gownSale: { off: 25, ends: "2026-10-26T05:00:00Z", through: "Oct 25", day: "Sun, Oct 25" }   /* Elise 16/10: 25% off through Sun Oct 25 (midnight CDT) */
  },
  godparent: { base: 95, secondOff: 10 },                                    /* §3.7 · second set −$10: Elise 15/10 */
  calendar: {                                                                /* §3.8 */
    print:   { 1: 20, 6: 50 },   /* 1 page $20 · add 5 more pages +$30 (6 pages $50) */
    digital: { 1: 15, 6: 25 }
  },
  volume: {                                   /* Elise 15/10: per item, on the whole item */
    tiers: [{ from: 2, off: 0.05 }, { from: 5, off: 0.10 }],
    maxQty: 50
  },
  depositRate: 0.5,                           /* brief §1 + Elise 15/10: 50% deposit today */
  salesTaxBp: 825                             /* Texas sales tax 8.25% (basis points: exact cents) — not on orders shipped outside Texas */
};

/* ---------- helpers ---------- */
function money(n) {
  if (Math.round(n * 100) < 0) return "−" + money(-n);   /* a swap to a cheaper item: −$5 */
  var s = (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "");
  return "$" + s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");   /* $1,095 — only the whole dollars have 4+ digits in a row */
}
/* two amounts that sit together (deposit + balance): both with cents when either has cents — "$46.01" and "$46.00" */
function moneyPair(a, b) {
  if (Math.round(a * 100) % 100 === 0 && Math.round(b * 100) % 100 === 0) return [money(a), money(b)];
  var f = function (n) { return "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  return [f(a), f(b)];
}

/* ---------- estimators (each returns {total, lines:[{label, amount, taxFree?, detail?}], note}) — taxFree: the
   untaxed part of the line in dollars (true = all of it) ---------- */
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
  if (isPrint && o.fineArt) lines.push({ label: "Fine-art paper", amount: PRICES.watercolor.fineArt });
  else if (isPrint && o.doPaper) lines.push({ label: "Handmade Vietnamese Dó papyrus", amount: PRICES.watercolor.doPaper });
  if (isPrint && o.frame) lines.push({ label: "Frame " + fmt.label.replace("Print ", ""), amount: PRICES.watercolor.frame[fmt.key] });
  if (isPrint && o.giftBox) lines.push({ label: "Gift box", amount: PRICES.watercolor.giftBox });
  if (o && o.rosary) lines.push({ label: "Crochet rosary add-on", amount: PRICES.watercolor.rosary });
  var r = applyQty(finish(lines), o && o.qty, "painting", "paintings");
  r.digitalOnly = !isPrint && !(o && o.rosary);   /* nothing ships */
  r.note = r.qty > 1 ? "Estimate for " + r.qty + " paintings with the same options" : "Estimate for one painting";
  return r;
}

/* o.addons: [{ key, name, swapFor, swapKey }] (swapFor "" = added to the box) or plain keys. Added: the add-on's own
   price. Swapped in for a basic item (swapKey, a PRICES.housewarming.basics key): the add-on replaces that item's
   price — the line is the difference, below zero when the add-on costs less (Elise 16/10, third message).
   Fresh add-ons (cold cut, berries) make the box pickup only; fresh fruit is not taxed (taxFree = its own price,
   since the basic item it replaces was taxed). */
/* an add-on's price: one number, or by variant (spoons: { 2: 12, 4: 24 }, it.variant "2" or "4") */
function addonPrice(P, it) {
  var p = P.addons[it.key];
  if (p && typeof p === "object") return Object.prototype.hasOwnProperty.call(p, it.variant) ? p[it.variant] : p[Object.keys(p)[0]];
  return p;
}
function estHousewarming(o) {
  var P = PRICES.housewarming;
  var lines = [{ label: "Housewarming & Closing Gift Box", amount: P.base }];
  var a = o && Array.isArray(o.addons) ? o.addons : [], fresh = false;
  for (var i = 0, n = 0; i < a.length && n < P.maxAddons; i++) {
    var it = typeof a[i] === "object" && a[i] ? a[i] : { key: String(a[i]) };
    if (!Object.prototype.hasOwnProperty.call(P.addons, it.key)) continue;
    var name = it.name || it.key, price = addonPrice(P, it), swapped = it.swapFor && Object.prototype.hasOwnProperty.call(P.basics, it.swapKey);
    var line = { label: it.swapFor ? "Swap: " + it.swapFor + " → " + name : "Add: " + name, amount: swapped ? round2(price - P.basics[it.swapKey]) : price, taxFree: P.taxFree.indexOf(it.key) > -1 ? price : 0 };
    if (swapped) line.detail = name + " " + money(price) + " − " + it.swapFor + " " + money(P.basics[it.swapKey]);
    lines.push(line);
    if (P.fresh.indexOf(it.key) > -1) fresh = true;
    n++;
  }
  var r = applyQty(finish(lines), o && o.qty, "box", "boxes");
  r.pickupOnly = fresh;
  r.note = r.qty > 1 ? "Estimate for " + r.qty + " boxes with the same items" : "Estimate for one box";
  return r;
}

function estCalendar(o) {
  var kind = o && o.kind === "digital" ? "digital" : "print";
  var pages = o && o.pages === 6 ? 6 : 1;
  var label = (kind === "print" ? "Design + print" : "Digital files only") + " · " + (pages === 1 ? "1 page" : "6 pages");
  var r = finish([{ label: label, amount: PRICES.calendar[kind][pages] }]);
  r.digitalOnly = kind === "digital";
  return r;
}

function estGodparent(o) {
  var lines = [{ label: "Godparent Gift Set", amount: PRICES.godparent.base }];
  if (o && o.count === 2) lines.push({ label: "Second godparent set (−$" + PRICES.godparent.secondOff + ")", amount: PRICES.godparent.base - PRICES.godparent.secondOff });
  return finish(lines);
}
/* the gown set's price now: the sale price until gownSale.ends, then the regular price (now: a time in ms, for tests) */
function gownPrice(now) {
  var C = PRICES.christening, sale = C.gownSale, t = typeof now === "number" ? now : new Date().getTime();
  var on = !!sale && t < Date.parse(sale.ends);
  return { price: on ? Math.round(C.gownSet * (100 - sale.off)) / 100 : C.gownSet, regular: C.gownSet, sale: on ? sale : null };
}
var TIMING = {   /* Elise 16/10 (13th message) */
  yarn:  { make: "made in 2–3 weeks", ship: "delivered in 3 days–1 week", out: "delivered in 2–3 weeks" },
  paint: { make: "made in 3–5 days", ship: "delivered in 3 days–1 week", out: "delivered in 3 days–1 week" },
  offSeason: "delivered within 15 days",
  kinds: { portraitDoll: "yarn", pet: "yarn", godparent: "yarn", watercolor: "paint" }
};
/* the timing line for a shipped piece: key = the gift (data-gift), getit = ship (Texas) / out (elsewhere in the U.S.),
   season = the holiday season is on */
function timingNote(key, getit, season) {
  if (!season) return TIMING.offSeason;
  var t = TIMING[TIMING.kinds[key]];
  return t ? t.make + " · " + (getit === "out" ? t.out : t.ship) : "";
}
function estChristeningGown(o) {
  var g = gownPrice(o && o.now);
  var r = finish([{ label: "Christening Gown Set — lace & satin" + (g.sale ? " (" + g.sale.off + "% off " + money(g.regular) + " through " + g.sale.through + " CT)" : ""), amount: g.price }]);
  r.note = "Ready in 2–3 days";   /* to ship or to pick up */
  r.readyMade = true;   /* already made: no "after it's finished" delivery note */
  return r;
}
/* o.figure: ready · made · carlo · michael (PRICES.christening.confirmation) · o.eyes: closed · open (not for "ready") */
function estConfirmation(o) {
  var C = PRICES.christening.confirmation, E = PRICES.christening.eyes, f = o && Object.prototype.hasOwnProperty.call(C, o.figure) ? o.figure : "ready";
  var eyes = f !== "ready" ? ", " + E[o && o.eyes === "open" ? "open" : "closed"] : "";
  var r = finish([{ label: "Confirmation gift box — " + C[f].label + eyes + " (ready after Nov 12)", amount: C[f].price }]);
  r.note = "Ready after Nov 12";   /* to ship or to pick up */
  return r;
}

function round2(n) { return Math.round(n * 100) / 100; }

/* r.pre = price before tax · r.taxFree = the part of it not taxed (fresh fruit) · r.tax · r.total = what the customer
   pays (with tax) · deposit + balance = total */
function finish(lines) {
  var pre = 0, free = 0;
  for (var i = 0; i < lines.length; i++) { pre += lines[i].amount; free += lines[i].taxFree === true ? lines[i].amount : (lines[i].taxFree || 0); }
  return settle({ pre: round2(pre), taxFree: round2(free), lines: lines, note: "", qty: 1 });
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
  r.qty = q; r.unit = r.pre; r.one = one; r.many = many;
  if (q > 1) {
    var saving = 0;
    for (var i = 2; i <= q; i++) saving += round2(r.unit * itemOff(i));
    r.subtotal = round2(r.unit * q);
    r.saving = round2(saving);
    r.pre = round2(r.subtotal - r.saving);
    if (r.taxFree) r.taxFree = round2(r.taxFree * r.pre / r.unit);   /* each item's untaxed part, with the same discount */
  }
  return settle(r);
}

/* Texas sales tax on the taxed part of the price (whole cents, half a cent rounds up) — none when the order ships
   outside Texas — then 50% deposit today and the rest after the photo is approved */
function settle(r) {
  var pre = Math.round(r.pre * 100), taxed = r.outOfTexas ? 0 : pre - Math.round((r.taxFree || 0) * 100);
  var tax = Math.round(Math.max(0, taxed) * PRICES.salesTaxBp / 10000);
  var cents = pre + tax, dep = Math.ceil(cents * PRICES.depositRate);   /* a half cent always rounds the deposit up */
  r.tax = tax / 100;
  r.total = cents / 100;
  r.deposit = dep / 100;
  r.balance = (cents - dep) / 100;
  return r;
}
/* an estimate for an order that ships outside Texas (or a digital file for a buyer outside Texas): no Texas sales tax */
function outOfTexas(r) { r.outOfTexas = true; return settle(r); }
function taxLabel() { return "Texas sales tax (" + (PRICES.salesTaxBp / 100) + "%)"; }

/* one-line summary the customer can paste into the order form; `how` = how it reaches them (pickup or shipping) */
function summaryLine(product, est, how) {
  var parts = [];
  for (var i = 0; i < est.lines.length; i++) parts.push(est.lines[i].label + " " + money(est.lines[i].amount) + (est.lines[i].detail ? " (" + est.lines[i].detail + ")" : ""));
  var qty = est.qty > 1 ? " — × " + est.qty + " " + est.many + " " + money(est.subtotal) + ", order more, save more −" + money(est.saving) : "";
  var tax = est.outOfTexas ? " — no Texas sales tax (outside Texas)" : " — " + taxLabel() + " " + money(est.tax) + (est.taxFree ? " (not on the fresh fruit)" : "");
  return "My pick: " + product + " — " + parts.join(" · ") + qty + tax + " — estimate " + money(est.total) + " · deposit (50%) " + money(est.deposit) + (est.digitalOnly ? "" : " · " + (how || (est.pickupOnly ? "Pickup at Pearland Town Center" : "Free U.S. shipping")));
}

if (typeof module !== "undefined") {
  module.exports = { ORDER_FORM_URL: ORDER_FORM_URL, ORDER_FORM_PREFILL_ENTRY: ORDER_FORM_PREFILL_ENTRY, PAY: PAY, PRICES: PRICES, money: money, moneyPair: moneyPair, taxLabel: taxLabel, outOfTexas: outOfTexas, itemOff: itemOff, applyQty: applyQty, estPortraitDoll: estPortraitDoll, estPet: estPet, estWatercolor: estWatercolor, estHousewarming: estHousewarming, estCalendar: estCalendar, estGodparent: estGodparent, estChristeningGown: estChristeningGown, estConfirmation: estConfirmation, TIMING: TIMING, timingNote: timingNote, addonPrice: addonPrice, gownPrice: gownPrice, summaryLine: summaryLine };
}
