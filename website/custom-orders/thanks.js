/* ============================================================
   Purrlight Custom Orders — the thank-you page after paying a deposit (plan 21/10/2026 §3)
   - the letter Merlin drops in the mailbox ("Your order was confirmed", Elise 21/10), from this tab's copy of the order
     that was sent (sessionStorage "purrlight-order-copy", written by custom-orders.js): code, piece, estimate, deposit
   - this page cannot see payments: it never reads the address's query. A provider may add one when it sends the
     customer back; it is removed unread, so the page says the same thing however it was reached
   - everything from the copy is written with textContent (the copy comes from a link the customer could edit)
   No framework, ES5. Without JavaScript the general letter shows in full.
   ============================================================ */
(function () {
  "use strict";

  /* whatever a provider added to the address goes, unread (the path is all this page keeps) */
  try { if (window.history && history.replaceState) history.replaceState(null, "", location.pathname); } catch (e) { /* old browsers */ }

  /* ---------- site nav (same behavior as the other pages) ---------- */
  var toggle = document.querySelector(".nav-toggle"), nav = document.querySelector(".main-nav"), closeBtn = document.querySelector(".nav-close");
  if (toggle && nav) {
    var outside = function () { return [document.getElementById("main"), document.querySelector("footer"), document.querySelector(".skip-link"), document.querySelector(".logo"), toggle].filter(Boolean); };
    var setInert = function (on) { outside().forEach(function (n) { if (on) n.setAttribute("inert", ""); else n.removeAttribute("inert"); }); };
    var shut = function () {
      if (!nav.classList.contains("open")) return;
      nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); setInert(false); toggle.focus();
    };
    toggle.addEventListener("click", function () {
      nav.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); setInert(true);
      (closeBtn || nav.querySelector("a")).focus();
    });
    if (closeBtn) closeBtn.addEventListener("click", shut);
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") shut(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") shut(); });
  }
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  function $(s) { return document.querySelector(s); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
  var fmt = typeof money === "function" ? money : function (n) { return "$" + Number(n).toFixed(2); };
  var codeOk = typeof isOrderCode === "function" ? isOrderCode : function (s) { return /^[ACDEFHJKMNPRTWXY3479]{4}$/.test(s || ""); };

  /* ---------- how it reaches them: ONE table for the order's delivery line and step 4 (Elise 21/10) ----------
     key   = the order form's "delivery" field, as custom-orders.js writes it (DELIVERY) and the copy keeps it
     picks = the pick's own words for that way (custom-orders.js GET_IT[…].pick, or summaryLine's defaults) — the copy's
             delivery and the pick must agree before anything is tailored (tools/check-site.js: every GET_IT pick is here)
     icon  = the drawing (step 4 in thanks.html) · note = the order page's note for that way (GET_IT[…].note; "Nothing to
             ship": the order bar's "Digital file — nothing to ship") · step = step 4, How it works cut to that way */
  var GETS = {
    "Ship within Texas":  { icon: "ship", picks: ["Ship to my Texas address (free shipping)", "Free U.S. shipping"], note: "Free shipping", step: "Pay the balance, then it ships free in the U.S." },
    "Ship outside Texas": { icon: "ship", picks: ["Ship to my address outside Texas (free U.S. shipping)", "Free U.S. shipping"], note: "Free U.S. shipping", step: "Pay the balance, then it ships free in the U.S." },
    "Pickup Saturday":    { icon: "pickup", picks: ["Pickup Saturday at Pearland Town Center", "Pickup at Pearland Town Center"], note: "Pearland Town Center", step: "Pay the balance, then pick it up at Pearland Town Center on Saturday." },
    "Pickup Sunday":      { icon: "pickup", picks: ["Pickup Sunday at Pearland Town Center", "Pickup at Pearland Town Center"], note: "Pearland Town Center", step: "Pay the balance, then pick it up at Pearland Town Center on Sunday." },
    "Digital file":       { icon: "digital", picks: [""], note: "Nothing to ship", step: "Once you approve the final, we email you your files." }   /* Elise 21/10 */
  };
  function own(o, k) { return typeof k === "string" && Object.prototype.hasOwnProperty.call(o, k); }
  var KNOWN_HOW = {};   /* every pick word this page wrote (a how it doesn't know = a line it didn't write, or one cut short) */
  for (var gk in GETS) if (own(GETS, gk)) GETS[gk].picks.forEach(function (p) { KNOWN_HOW[p] = true; });

  /* where the order code goes when paying: only the ways the order page shows that have a box for it — Zelle's memo,
     Venmo's note, a card page once its note box is on (PAY.square / PAY.stripe notes: true) — named the way the order
     page's hints name them. Square today has no note box: its payers are not asked for one (we match by hand). */
  var NOTE_BOX = { zelle: "the Zelle memo", venmo: "the Venmo note", square: "the Square note", stripe: "the Stripe box \u201COrder code or your name\u201D" };
  function noteWhere() {
    var P = typeof PAY !== "undefined" && PAY && Array.isArray(PAY.order) ? PAY : null, list = [];
    if (P) P.order.forEach(function (k) {
      var m = P[k] || {}, on = k === "zelle" ? !!m.to : k === "venmo" ? !!m.handle : !!m.url && m.notes === true;
      if (on && own(NOTE_BOX, k) && list.indexOf(NOTE_BOX[k]) < 0) list.push(NOTE_BOX[k]);
    });
    return list.length < 2 ? list.join("") : list.slice(0, -1).join(", ") + " or " + list[list.length - 1];
  }
  (function () {   /* the static lines (no copy): the same places */
    var w = noteWhere();
    if (w) Array.prototype.forEach.call(document.querySelectorAll("[data-note-where]"), function (n) { n.textContent = w; });
  })();

  /* ---------- the copy of the order sent from this tab — every field checked, anything odd is left out ---------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function readCopy() {
    var c = null;
    try { c = JSON.parse(window.sessionStorage.getItem("purrlight-order-copy")); } catch (e) { return null; }
    if (!c || c.v !== 1 || c.sent !== true) return null;
    var out = { code: codeOk(c.code) ? c.code : "", day: "" };
    var d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(c.at || "");
    if (d && +d[2] >= 1 && +d[2] <= 12 && +d[3] >= 1 && +d[3] <= 31) out.day = MONTHS[+d[2] - 1] + " " + (+d[3]) + ", " + d[1];
    var amt = /^\d{1,5}\.\d{2}$/;
    if (typeof c.product === "string" && c.product && typeof c.pick === "string" && c.pick && amt.test(c.total) && amt.test(c.deposit) && Number(c.deposit) <= Number(c.total)) {
      out.product = c.product.slice(0, 120);
      out.pick = c.pick.slice(0, 1000);   /* the longest pick the page writes is 769 characters (custom-orders.js keeps 1000 too) */
      out.total = Number(c.total);
      out.deposit = Number(c.deposit);
      out.delivery = own(GETS, c.delivery) ? c.delivery : "";
    }
    return out;
  }
  var copy = readCopy();

  /* ---------- the letter ---------- */
  var letter = $("#letter"), meta = $("[data-letter-meta]"), order = $("[data-letter-order]"), note = $("[data-letter-note]");
  var stepLi = $("[data-step-get-li]"), stepText = $("[data-step-get]");
  function cents(n) { return Math.round(n * 100); }
  function signed(n) { return cents(n) > 0 ? "+" + fmt(n) : fmt(n); }   /* +$10 · $0 · −$5, as in the box on the order page */
  function flat(s) { return String(s).replace(/\s+/g, " ").trim(); }
  /* one line of the order: the name (and a small line under it), the amount on the right. data-copy = the line in Copy
     text: "name amount (small line)" — copySub: the small line as it reads mid-line (a fixed note starts lower-case) */
  function row(tag, cls, name, amt, sub, copySub) {
    var r = el(tag, "ledger-row" + (cls ? " " + cls : "")), n = el("span", "ledger-name", name);
    if (sub) n.appendChild(el("span", "ledger-sub", sub));
    r.appendChild(n);
    if (amt) r.appendChild(el("span", "ledger-amt", amt));
    r.setAttribute("data-copy", flat(name + (amt ? " " + amt : "") + (sub ? " (" + (copySub || sub) + ")" : "")));
    return r;
  }
  /* the sums: a <dl> (estimate, 50% deposit, balance) — always the copy's own checked amounts */
  function sum(cls, name, amt, sub, copySub) {
    var d = el("div", "ledger-row " + cls), t = el("dt", "ledger-name", name);
    if (sub) t.appendChild(el("span", "ledger-sub", sub));
    d.appendChild(t);
    d.appendChild(el("dd", "ledger-amt", amt));
    d.setAttribute("data-copy", name + " " + amt + (sub ? " (" + (copySub || sub) + ")" : ""));
    return d;
  }
  /* a drawing: the page's own step-4 drawing, copied node by node (never a string, never from the copy) */
  function drawing(name, size) {
    var src = letter && letter.querySelector('[data-ic="' + name + '"]');
    if (!src) return null;
    var s = src.cloneNode(true);
    s.removeAttribute("data-ic"); s.setAttribute("class", "ledger-ic"); s.setAttribute("width", size); s.setAttribute("height", size);
    return s;
  }
  var getIt = "";   /* the copy's delivery, once it agrees with the pick — step 4 follows it */
  /* a digital file is paid in full (Elise 21/10): its "deposit" is the whole estimate — a 50% deposit never is */
  function full(c) { return !!(c && c.total && cents(c.deposit) === cents(c.total)); }
  /* how it reaches them: the copy's delivery with the order page's note when the pick says the same; the pick's own
     words when they disagree (an edited copy); nothing when there is neither */
  function howRow(delivery, how) {
    var g = own(GETS, delivery) ? GETS[delivery] : null, icon, title, sub = "";
    if (g && g.picks.indexOf(how) > -1) { getIt = delivery; icon = g.icon; title = delivery; sub = g.note; }
    else if (how) { icon = /^Pickup/.test(how) ? "pickup" : "ship"; title = how; }
    else return null;
    var p = el("p", "ledger-how"), n = el("span", "ledger-name", title), ic = drawing(icon, "24");
    if (ic) p.appendChild(ic);
    if (sub) n.appendChild(el("span", "ledger-sub", sub));
    p.appendChild(n);
    p.setAttribute("data-copy", flat(title + (sub ? " · " + sub : "")));
    return p;
  }
  /* the order (Elise 21/10: easy to read, check and skim). From pickParts() (prices.js) only when it reads the line back
     and its estimate and deposit are the copy's to the cent; otherwise the line as it was sent. Either way the estimate,
     deposit and balance are the copy's own checked amounts. */
  function ledger(c) {
    var parts = typeof pickParts === "function" ? pickParts(c.pick, c.product) : null;
    if (parts && (cents(parts.total) !== cents(c.total) || cents(parts.deposit) !== cents(c.deposit) || (parts.how && !KNOWN_HOW[parts.how]))) parts = null;
    var box = document.createDocumentFragment();
    box.appendChild(el("p", "ledger-head", "Your pick"));
    var first = parts ? parts.items[0] : null;
    /* the piece: its name, the option under it (the way the order page's box shows it), the price */
    box.appendChild(row("p", "ledger-product", c.product, first ? fmt(first.amount) : "", first && first.label !== c.product ? first.label : ""));
    if (parts) {
      var lines = el("ul", "ledger-lines");
      lines.setAttribute("role", "list");   /* list-style none: Safari would drop the list otherwise */
      for (var i = 1; i < parts.items.length; i++) lines.appendChild(row("li", "", parts.items[i].label, signed(parts.items[i].amount), parts.items[i].detail));
      if (parts.qty) {
        lines.appendChild(row("li", "ledger-qty", "× " + parts.qty.n + " " + parts.qty.many, fmt(parts.qty.subtotal)));
        lines.appendChild(row("li", "", "Order more, save more", "−" + fmt(parts.qty.saving)));
      }
      lines.appendChild(parts.tax ? row("li", "", parts.tax.label, "+" + fmt(parts.tax.amount), parts.tax.fruit ? "Not on the fresh fruit" : "", "not on the fresh fruit")
                                  : row("li", "", "Texas sales tax", "$0", "None outside Texas", "none outside Texas"));
      box.appendChild(lines);
      var how = howRow(c.delivery, parts.how);
      if (how) box.appendChild(how);
    } else {
      var raw = el("p", "ledger-raw", c.pick);   /* the line as it was sent */
      raw.setAttribute("data-copy", flat(c.pick));
      box.appendChild(raw);
    }
    var pair = typeof moneyPair === "function" ? moneyPair(c.deposit, (cents(c.total) - cents(c.deposit)) / 100) : [fmt(c.deposit), fmt((cents(c.total) - cents(c.deposit)) / 100)];
    var sums = el("dl", "ledger-sums");
    sums.appendChild(sum("ledger-total", "Estimate", fmt(c.total)));
    if (full(c)) sums.appendChild(sum("ledger-deposit", "Pay in full", fmt(c.total)));   /* a digital file (Elise 21/10): no deposit, no balance */
    else {
      sums.appendChild(sum("ledger-deposit", "50% deposit", pair[0]));
      sums.appendChild(sum("ledger-balance", "Balance", pair[1], "After you approve the photo", "after you approve the photo"));   /* the order page's "Balance after you approve the photo", in two parts */
    }
    box.appendChild(sums);
    return box;
  }

  /* the steps of a digital file (Elise 21/10): paid in full, a preview with up to 5 rounds of edits, the files by email
     once the final is approved — the camera step (a photo of the finished piece) is not one of them */
  function paidInFullSteps() {
    var steps = letter ? letter.querySelectorAll(".tl-step") : [];
    if (steps.length !== 4) return;
    var set = function (li, label, text) { li.querySelector(".tl-label").textContent = label; if (text) li.querySelector(".tl-text").textContent = text; };
    set(steps[0], "Your payment", "We check your payment by hand and email you once it's in.");
    set(steps[1], "Preview & edits", "We send you a preview first. Up to 5 rounds of edits are included; more are charged.");
    steps[2].hidden = true;
    steps[3].querySelector(".tl-n").textContent = "3";
  }

  if (copy) {
    var neutral = $("[data-thanks-neutral]");
    if (neutral && (copy.code || copy.product)) neutral.hidden = true;   /* this tab sent the form: the line for balance payers and other devices is not for them */
    if (meta && (copy.day || copy.code)) {   /* "Oct 21, 2026 · Order code 7RJ7", the code in bold */
      meta.textContent = [copy.day, copy.code ? "Order code " : ""].filter(Boolean).join(" · ");
      if (copy.code) meta.appendChild(el("strong", "", copy.code));
      meta.hidden = false;
    }
    if (order && copy.product) {
      var built = ledger(copy);
      order.textContent = "";
      order.appendChild(built);
      if (full(copy)) getIt = "Digital file";
      if (getIt && stepText && stepLi) { stepText.textContent = GETS[getIt].step; stepLi.setAttribute("data-how", GETS[getIt].icon); }
      if (full(copy)) paidInFullSteps();
    }
    if (note && copy.code) {   /* exactly what to write when paying, set apart so it is easy to copy by eye */
      note.textContent = "";
      note.appendChild(document.createTextNode("When you pay, write "));
      if (copy.product) note.appendChild(el("strong", "letter-code", copy.code + (full(copy) ? "-F" : "-D")));   /* F: paid in full · D: deposit */
      else {   /* the order itself is not in this tab: a deposit, or a digital file paid in full */
        note.appendChild(el("strong", "letter-code", copy.code + "-D"));
        note.appendChild(document.createTextNode(" — or "));
        note.appendChild(el("strong", "letter-code", copy.code + "-F"));
        note.appendChild(document.createTextNode(" for a digital file paid in full —"));
      }
      note.appendChild(document.createTextNode(" in " + (noteWhere() || "the payment note") + "."));
    }
    if (full(copy)) {   /* paid in full: the booth's paid-in-full terms (Elise 25/09) and "payment" for "deposit" */
      var terms = $(".thanks-terms"), fact = $("[data-thanks-fact]");
      if (terms) terms.textContent = "It's refundable in full until work begins. Custom pieces can't be returned, but anything wrong or damaged is on us, 100%.";
      if (fact) fact.textContent = fact.textContent.replace("We check every deposit by hand", "We check every payment by hand");
    }
  }

  /* the mailbox: the letter folds into it, the button opens it (open again by itself for printing) */
  var box = $(".mailbox-btn"), label = $("[data-mailbox-label]");
  if (box && letter) {
    var setOpen = function (open) {
      letter.hidden = !open;
      box.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Fold your letter away" : "Open your letter";
    };
    box.hidden = false;
    setOpen(false);
    box.addEventListener("click", function () {
      var open = letter.hidden;
      setOpen(open);
      if (open) letter.focus({ preventScroll: false });
    });
    window.addEventListener("beforeprint", function () { letter.hidden = false; });
    window.addEventListener("afterprint", function () { setOpen(box.getAttribute("aria-expanded") === "true"); });
  }

  /* print or save as PDF · copy the words (printing may not work inside Instagram's or TikTok's browser) */
  var actions = $("[data-letter-actions]"), status = $("[data-letter-status]");
  function say(t) { if (!status) return; status.textContent = t; clearTimeout(say.timer); say.timer = setTimeout(function () { status.textContent = ""; }, 4000); }
  /* the letter as plain text, in four parts with a blank line between them: the heading; the order (one line per line
     of it, "Add: Scented candle +$10", then what to write when paying); "What happens next" as "1. Your deposit — We
     check …"; the fine print */
  function letterText() {
    if (!letter) return "";
    var out = [];
    function words(n) { return n ? flat(n.textContent) : ""; }
    function part(sel, fn) {
      var got = [];
      Array.prototype.forEach.call(letter.querySelectorAll(sel), function (n) { var t = fn ? fn(n) : words(n); if (t) got.push(t); });
      if (got.length) out.push(got.join("\n"));
    }
    part(".letter-from, .letter-title, .letter-meta:not([hidden])");
    part(".ledger-head, [data-copy], .ledger-empty, .letter-note", function (n) { return n.getAttribute("data-copy") || words(n); });
    part(".letter-sub, .tl-step:not([hidden])", function (n) { return n.tagName === "LI" ? words(n.querySelector(".tl-n")) + ". " + words(n.querySelector(".tl-label")) + " — " + words(n.querySelector(".tl-text")) : words(n); });
    part(".letter-fine");
    return out.join("\n\n");
  }
  function copyText(text, done, fail) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () { legacy(text, done, fail); }); }
    else legacy(text, done, fail);
  }
  function legacy(text, done, fail) {
    var prev = document.activeElement;
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.setAttribute("aria-hidden", "true"); ta.tabIndex = -1;
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) done(); else fail();
    } catch (e) { fail(); }
    if (prev && prev.focus && prev !== document.body) prev.focus();
  }
  if (actions) {
    actions.hidden = false;
    var pr = $("[data-letter-print]"), cp = $("[data-letter-copy]");
    if (pr) pr.addEventListener("click", function () { try { window.print(); } catch (e) { say("Printing isn't available here — use Copy text."); } });
    if (cp) cp.addEventListener("click", function () {
      var t = letterText();
      copyText(t, function () { say("Copied your letter."); }, function () { say("Copy isn't available here — select the letter and copy it."); });
    });
  }
})();
