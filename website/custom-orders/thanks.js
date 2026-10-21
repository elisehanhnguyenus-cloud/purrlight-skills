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

  /* ---------- the copy of the order sent from this tab — every field checked, anything odd is left out ---------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DELIVERY = ["Ship within Texas", "Ship outside Texas", "Pickup Saturday", "Pickup Sunday", "Digital file"];
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
      out.pick = c.pick.slice(0, 600);
      out.total = Number(c.total);
      out.deposit = Number(c.deposit);
      out.delivery = DELIVERY.indexOf(c.delivery) > -1 ? c.delivery : "";
    }
    return out;
  }
  var copy = readCopy();

  /* ---------- the letter ---------- */
  var letter = $("#letter"), meta = $("[data-letter-meta]"), order = $("[data-letter-order]"), note = $("[data-letter-note]");
  if (copy) {
    var neutral = $("[data-thanks-neutral]");
    if (neutral && (copy.code || copy.product)) neutral.hidden = true;   /* this tab sent the form: the line for balance payers and other devices is not for them */
    if (meta && (copy.day || copy.code)) {
      meta.textContent = [copy.day, copy.code ? "Order code " + copy.code : ""].filter(Boolean).join(" · ");
      meta.hidden = false;
    }
    if (order && copy.product) {
      order.textContent = "";
      order.appendChild(el("p", "letter-product", copy.product));
      order.appendChild(el("p", "letter-pick", copy.pick));
      order.appendChild(el("p", "letter-money", "Estimate " + fmt(copy.total) + " · 50% deposit " + fmt(copy.deposit) + " · the balance after you approve the photo of your finished piece"));
      if (copy.delivery) order.appendChild(el("p", "letter-delivery", copy.delivery));
    }
    if (note && copy.code) note.textContent = "When you pay, write " + copy.code + "-D in the payment note.";
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
  function letterText() {
    if (!letter) return "";
    var parts = [];
    Array.prototype.forEach.call(letter.querySelectorAll(".letter-from, .letter-title, .letter-meta:not([hidden]), .letter-order p, .letter-sub, .letter-steps li, .letter-note, .letter-fine"), function (n) {
      var t = n.textContent.replace(/\s+/g, " ").trim();
      if (!t) return;
      if (n.tagName === "LI") t = (Array.prototype.indexOf.call(n.parentNode.children, n) + 1) + ". " + t;
      parts.push(t);
    });
    return parts.join("\n");
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
