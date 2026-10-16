/* ============================================================
   Purrlight Custom Orders — page behavior
   - every "Place your order" link → ORDER_FORM_URL (prices.js), utm passed through
   - gift studio (the OREOiD idea): pick one piece (tabs) → options on the left, and on the right
     what's inside + a live estimate from prices.js; added items fade in, the photo follows the choice
   - the customer's pick reaches the form as a copied summary line (or a prefilled field when
     ORDER_FORM_PREFILL_ENTRY is set) — the page never invents a price: every number is prices.js = brief §3
   - site nav drawer, sticky order bar on phones, picks remembered on this device, #piece deep links
   No framework, ES5. Without JS every piece shows in full (copy, prices, options and mailto links are HTML).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- site nav (same behavior as the main site) ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var closeBtn = document.querySelector(".nav-close");
  if (toggle && nav) {
    /* while the drawer is open everything outside it is inert (main, footer, order bar, skip link, logo, CTA, the toggle itself) */
    var outside = function () {
      var list = [document.getElementById("main"), document.querySelector("footer"), document.querySelector(".order-bar"), document.querySelector(".skip-link"), document.querySelector(".logo"), document.querySelector(".header-cta"), toggle];
      return list.filter(Boolean);
    };
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

  /* ---------- order link: one constant + utm passthrough (brief §5) ---------- */
  var lastPick = null;   /* { product, total, deposit, text, getit } — the pick the customer is building */
  /* blank lines to fill in, so a shipping order brings its address and a time to receive it (Elise 16/10) */
  var FILL_IN = { ship: "\n\nShipping address: \nA good time to receive it: \n", sat: "\n\nA good time to pick it up: \n", sun: "\n\nA good time to pick it up: \n" };
  FILL_IN.out = FILL_IN.ship;
  function orderUrl() {
    var url = ORDER_FORM_URL;
    if (/^mailto:/i.test(url)) {   /* the fallback email link: the pick travels in the message body */
      if (lastPick) url += (url.indexOf("?") > -1 ? "&" : "?") + "body=" + encodeURIComponent(lastPick.text + (FILL_IN[lastPick.getit] || ""));
      return url;
    }
    var qs = [];
    try {
      var params = new URLSearchParams(location.search);
      params.forEach(function (v, k) { if (/^utm_/i.test(k)) qs.push(encodeURIComponent(k.toLowerCase()) + "=" + encodeURIComponent(v)); });   /* Tally field names are case-sensitive */
    } catch (e) { /* old browsers: plain link */ }
    if (lastPick && /^https:\/\/(www\.)?tally\.so\//i.test(url)) {
      /* Tally: hidden fields named pick, product, total, deposit and delivery (see prices.js); amounts always with cents,
         like "Copy deposit amount"; delivery "Digital file" makes the form's phone + time-to-receive questions optional */
      qs.push("pick=" + encodeURIComponent(lastPick.text), "product=" + encodeURIComponent(lastPick.product),
        "total=" + lastPick.total.toFixed(2), "deposit=" + lastPick.deposit.toFixed(2));
      if (DELIVERY[lastPick.getit]) qs.push("delivery=" + encodeURIComponent(DELIVERY[lastPick.getit]));
    } else if (lastPick && ORDER_FORM_PREFILL_ENTRY) {
      if (url.indexOf("usp=") === -1) qs.push("usp=pp_url");
      qs.push(encodeURIComponent(ORDER_FORM_PREFILL_ENTRY) + "=" + encodeURIComponent(lastPick.text));
    }
    if (qs.length) url += (url.indexOf("?") > -1 ? "&" : "?") + qs.join("&");
    return url;
  }
  function applyOrderLinks() {
    /* same tab on purpose: Linktree opens this page inside in-app browsers that block pop-ups;
       the pick is remembered on the device, so coming back costs nothing */
    var href = orderUrl();
    var els = document.querySelectorAll("[data-order]");
    for (var i = 0; i < els.length; i++) els[i].setAttribute("href", href);
  }
  applyOrderLinks();

  /* ---------- Tally popup (Elise 16/10): an order button opens the form over the page instead of leaving it ----------
     Same form, same hidden fields as the link (pick, product, total, deposit, delivery, utm) — read from the clicked
     link's own href. Bottom right, 376 px (phones: a little smaller — .tally-popup in the CSS), the form title hidden
     (the form is also used at events and its title says so), and the waving-hand emoji Elise chose (it holds still
     for visitors who ask for reduced motion — see the CSS).
     Tally's script loads after the page; until it has — or if it is blocked — the link opens the form page as before.
     Sent: the popup closes and the page goes to "Pay your deposit" (the form's own redirect, done here). */
  var TALLY_FORM = (ORDER_FORM_URL.match(/^https:\/\/(?:www\.)?tally\.so\/r\/([A-Za-z0-9]+)$/) || [])[1];
  if (TALLY_FORM) {
    var tallyOpener = null, tallyHref = null, tallyTimer = null;
    var tallyOpen = function () { return document.querySelector(".tally-form-" + TALLY_FORM); };
    var loadTally = function () {
      var sc = document.createElement("script");
      sc.src = "https://tally.so/widgets/embed.js"; sc.async = true;
      document.head.appendChild(sc);
    };
    if (document.readyState === "complete") loadTally(); else window.addEventListener("load", loadTally);
    var hiddenFields = function (href) {
      var out = {}, q = href.split("#")[0].split("?")[1] || "";
      q.split("&").forEach(function (kv) {
        var i = kv.indexOf("=");
        if (i > 0) { try { out[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " ")); } catch (err) { /* a bad escape: leave it out */ } }
      });
      return out;
    };
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[data-order]") : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   /* a new tab stays a new tab */
      var T = window.Tally, href = a.getAttribute("href") || "";
      if (!T || typeof T.openPopup !== "function" || href.indexOf(ORDER_FORM_URL) !== 0) return;
      e.preventDefault();
      if (tallyOpen() && href === tallyHref) {   /* same pick: back into the form — what they typed stays */
        var f0 = document.querySelector(".tally-form-" + TALLY_FORM + " iframe"); if (f0) f0.focus();
        return;
      }
      if (tallyOpen()) T.closePopup(TALLY_FORM);   /* one popup, with the latest pick */
      tallyOpener = a; tallyHref = href;
      /* the form never shows (tally.so down or blocked while the script loaded): after 10 s, open the form page instead */
      clearTimeout(tallyTimer);
      tallyTimer = setTimeout(function () {
        var pop = tallyOpen();
        if (pop && pop.style.opacity !== "1") { tallyOpener = null; tallyHref = null; T.closePopup(TALLY_FORM); location.href = href; }
      }, 10000);
      T.openPopup(TALLY_FORM, {
        width: 376, hideTitle: true, emoji: { text: "\uD83D\uDC4B", animation: "wave" }, hiddenFields: hiddenFields(href),
        onOpen: function () { clearTimeout(tallyTimer); var f = document.querySelector(".tally-form-" + TALLY_FORM + " iframe"); if (f) f.focus(); },
        onClose: function () { clearTimeout(tallyTimer); tallyHref = null; var o = tallyOpener; tallyOpener = null; if (o && document.documentElement.contains(o)) o.focus({ preventScroll: true }); },
        onSubmit: function () {
          tallyOpener = null;
          T.closePopup(TALLY_FORM);
          var sec = document.getElementById("pay"), pay = document.getElementById("pay-h");
          location.hash = "pay";
          if (sec) sec.scrollIntoView();   /* also when the address already ends in #pay (the "How to pay" link) */
          if (pay) { pay.setAttribute("tabindex", "-1"); pay.focus({ preventScroll: true }); }
        }
      });
    });
    document.addEventListener("keydown", function (e) {   /* Esc closes it (while focus is on the page; inside, the form's own × does) */
      if ((e.key === "Escape" || e.key === "Esc") && window.Tally && tallyOpen()) window.Tally.closePopup(TALLY_FORM);
    });
  }

  /* ---------- the gown set's sale (Elise 16/10: 25% off through Oct 25, Central Time): $89 struck through + the sale
     price, and a line under the price — drawn with each estimate, so the tile and the estimate always agree; when the
     sale ends (prices.js gownSale.ends) the page shows $89 again, even if it was left open ---------- */
  var gownShown = null;
  function renderGownSale(gp) {
    var state = gp.sale ? "sale" : "regular";
    if (state === gownShown) return;
    gownShown = state;
    var tp = document.querySelector('[data-sale-price="gown"]'), line = document.querySelector('[data-sale-note="gown"]');
    if (tp) {
      tp.textContent = gp.sale ? "" : money(gp.regular);
      if (gp.sale) {
        tp.appendChild(el("s", null, [el("span", { "class": "sr-only", text: "Was " }), document.createTextNode(money(gp.regular))]));
        tp.appendChild(document.createTextNode(" "));
        tp.appendChild(el("span", { "class": "sr-only", text: "now " }));
        tp.appendChild(el("span", { "class": "sale-price", text: money(gp.price) }));
      }
    }
    if (line) {
      line.textContent = gp.sale ? "Christening gown set: " + gp.sale.off + "% off through " + gp.sale.day.replace(/ /g, "\u00a0") + " (Central\u00a0Time)" : "";
      line.hidden = !gp.sale;
    }
  }
  function refreshGown() {   /* the sale ended while the page was open: estimate, tile and order links back to $89 */
    var g = byId.christening;
    if (!g || gownShown !== "sale" || gownPrice().sale) return;
    g.update(false);
    if (lastPick && lastPick.product === g.def.product) pick(g);
  }
  if (gownPrice().sale) {
    setTimeout(refreshGown, Date.parse(PRICES.christening.gownSale.ends) - new Date().getTime() + 1000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshGown(); });   /* background tabs sleep through timers */
  }

  /* ---------- tiny helpers ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (children) for (var i = 0; i < children.length; i++) if (children[i]) n.appendChild(children[i]);
    return n;
  }
  function store(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ } }
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function copyText(text, onDone, onFail) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(onDone, function () { legacyCopy(text, onDone, onFail); }); }
    else legacyCopy(text, onDone, onFail);
  }
  function legacyCopy(text, onDone, onFail) {
    var prev = document.activeElement;   /* select() moves focus to the textarea: give it back to the button */
    try {
      var ta = el("textarea", { readonly: "", "aria-hidden": "true", tabindex: "-1", style: "position:fixed;left:-9999px;top:0" });
      ta.value = text; document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) onDone(); else onFail();
    } catch (e) { onFail(); }
    if (prev && prev.focus && prev !== document.body) { try { prev.focus({ preventScroll: true }); } catch (e2) { prev.focus(); } }
  }
  function isDisabled(inp) { try { return inp.matches(":disabled"); } catch (e) { return inp.disabled; } }   /* counts a disabled <fieldset> too */
  /* data-when="format!=digital&paper=do" — every condition must hold; "name=a,b" (one of), "name!=a" (none of), "name~a" (checkbox list holds a) */
  function holds(expr, v) {
    var conds = expr.split("&");
    for (var i = 0; i < conds.length; i++) {
      var m = conds[i].match(/^([\w-]+)(!=|=|~)(.*)$/);
      if (!m) continue;
      var val = v[m[1]], ok;
      if (m[2] === "~") ok = Array.isArray(val) && val.indexOf(m[3]) > -1;
      else { var hit = m[3].split(",").indexOf(String(val)) > -1; ok = m[2] === "=" ? hit : !hit; }
      if (!ok) return false;
    }
    return true;
  }

  /* ---------- sticky order bar (phones) ---------- */
  var BAR_CAP = "Free U.S. shipping or pickup in Pearland";   /* until a piece is chosen; then how this pick reaches the customer */
  function barCapText() {
    if (!current || !current.est) return BAR_CAP;
    if (current.est.digitalOnly) return "Digital file — nothing to ship";
    return (GET_IT[current.getit] || GET_IT.ship).short;
  }
  var bar = el("div", { "class": "order-bar", hidden: "", role: "region", "aria-label": "Order" });
  var barCap = el("span", { "class": "order-bar-cap", text: BAR_CAP });
  var barText = el("span", { "class": "order-bar-text", text: "Custom Orders" });
  var barBtn = el("a", { "class": "btn btn-primary btn-small", "data-order": "", href: orderUrl() }, [
    el("span", { "class": "long", text: "Place your order" }), el("span", { "class": "short", text: "Order" })
  ]);
  var barThumb = el("img", { "class": "order-bar-thumb", alt: "", width: "44", height: "44", hidden: "" });   /* the photo now showing — the phone's view of the box */
  bar.appendChild(barThumb);
  bar.appendChild(el("span", { "class": "order-bar-col" }, [barCap, barText])); bar.appendChild(barBtn);
  document.body.appendChild(bar);
  var capTimer = null;
  function barAdded(label) {   /* a short "Added: …" in the bar — the phone's view of the box filling up */
    var swap = label.match(/^Swap: .* → (.*)$/);
    barCap.textContent = swap ? "Swapped in: " + swap[1] : "Added: " + label.replace(/\s*\(.*\)$/, "").replace(/^Add: /, "");
    barCap.classList.add("is-added");
    clearTimeout(capTimer);
    capTimer = setTimeout(function () { barCap.textContent = barCapText(); barCap.classList.remove("is-added"); }, 2600);
  }

  /* ---------- the seven pieces ----------
     Options are plain inputs in index.html; `read(values)` turns them into the estimator's input.
     `item` names the main line in the box when the estimator's label is only the option (e.g. "Classic · Cotton"). */
  var GIFTS = {
    portraitDoll: {
      product: "Custom Portrait Crochet Doll",
      read: function (v) { return { shadowbox: v.shadowbox === "yes" }; },
      est: function (o) { return estPortraitDoll(o); }
    },
    pet: {
      product: "Custom Cat / Dog / Pet Crochet", item: "Your pet, in yarn",
      read: function (v) { return { size: v.size, yarn: v.yarn, pets: Number(v.pets) }; },
      est: function (o) { return estPet(o); }
    },
    watercolor: {
      product: "Custom Digital Watercolor Painting", item: "Digital watercolor painting",
      read: function (v) {
        var print = v.format !== "digital", x = v.extras || [];
        return { format: v.format, fineArt: print && v.paper === "fine", doPaper: print && v.paper === "do", frame: print && v.frame === "yes", giftBox: print && x.indexOf("giftBox") > -1, rosary: x.indexOf("rosary") > -1, qty: v.qty };
      },
      est: function (o) { return estWatercolor(o); }
    },
    housewarming: {
      product: "Housewarming & Closing Gift Box",
      /* each add-on goes into the box (its own price), or swaps out one basic item (g.swaps: add-on value → basic key) —
         then it costs the difference between the two (PRICES.housewarming.addons − .basics) */
      read: function (v, form, g) {
        var list = [], boxes = form ? form.querySelectorAll('input[name="addons"]') : [];
        for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) {
          var basic = g && g.swaps[boxes[i].value] ? g.art.querySelector('[data-basic="' + g.swaps[boxes[i].value] + '"]') : null;
          list.push({ key: boxes[i].value, name: boxes[i].getAttribute("data-label") || boxes[i].value, swapFor: basic ? basic.getAttribute("data-short") || lowerFirst(basic.getAttribute("data-text")) : "", swapKey: basic ? g.swaps[boxes[i].value] : "" });
        }
        return { addons: list, qty: v.qty };
      },
      est: function (o) { return estHousewarming(o); }
    },
    christening: {   /* the Confirmation gift box is "coming soon": shown as information, not orderable */
      product: "Christening & Confirmation Gifts",
      read: function () { return {}; },
      est: function () { var now = new Date().getTime(); renderGownSale(gownPrice(now)); return estChristeningGown({ now: now }); }   /* the tile and the estimate read one clock */
    },
    godparent: {
      product: "Godparent Gift Set",
      read: function (v) { return { count: Number(v.count) }; },
      est: function (o) { return estGodparent(o); }
    },
    calendar: {
      product: "Custom Watercolor Pet Calendar 2027 — Digital Painting", item: "2027 pet calendar",
      read: function (v) { return { kind: v.kind, pages: Number(v.pages) }; },
      est: function (o) { return estCalendar(o); }
    }
  };

  var studio = document.getElementById("studio");
  var live = el("p", { "class": "sr-only", role: "status" });   /* one quiet announcement per change */
  if (studio) studio.appendChild(live);

  function readValues(form) {
    var v = {};
    if (!form) return v;
    var inputs = form.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      if (inp.type === "radio") { if (inp.checked) v[inp.name] = inp.value; }
      else if (inp.type === "checkbox") { v[inp.name] = v[inp.name] || []; if (inp.checked && !inp.disabled) v[inp.name].push(inp.value); }
      else if (inp.type === "number") v[inp.name] = String(clampNum(inp.value, Number(inp.min) || 1, Number(inp.max) || 50));
    }
    return v;
  }
  function clampNum(n, min, max) { n = Math.floor(Number(n)); return n >= min ? Math.min(n, max) : min; }
  function lowerFirst(t) { t = String(t || ""); return t.charAt(0).toLowerCase() + t.slice(1); }
  function signed(n) { var c = Math.round(n * 100); return c > 0 ? "+" + money(n) : money(n); }   /* +$10 · $0 · −$5 */

  /* pickup or shipping — one step after every piece's options (Elise 16/10). Shipping is free; an order shipped outside
     Texas carries no Texas sales tax (Elise 16/10, second message). */
  var SHIP_HINT = "In your order, add your shipping address and a good time to receive it.";
  var GET_IT = {
    ship: { name: "Ship within Texas", note: "Free shipping", short: "Free shipping in Texas", pick: "Ship to my Texas address (free shipping)", hint: SHIP_HINT },
    out: { name: "Ship outside Texas", note: "Free U.S. shipping · no Texas sales tax", short: "Free shipping · outside Texas", pick: "Ship to my address outside Texas (free U.S. shipping)",
      hint: SHIP_HINT + " No Texas sales tax when it ships to another state." },
    sat: { name: "Pickup Saturday", note: "Pearland Town Center", short: "Pickup Saturday · Pearland Town Center", pick: "Pickup Saturday at Pearland Town Center",
      hint: "Pickup at Pearland Town Center on Saturday — in your order, add a good time to pick it up." },
    sun: { name: "Pickup Sunday", note: "Pearland Town Center", short: "Pickup Sunday · Pearland Town Center", pick: "Pickup Sunday at Pearland Town Center",
      hint: "Pickup at Pearland Town Center on Sunday — in your order, add a good time to pick it up." }
  };
  var GET_KEYS = ["ship", "out", "sat", "sun"];
  /* the order form's hidden "delivery" field */
  var DELIVERY = { ship: "Ship within Texas", out: "Ship outside Texas", sat: "Pickup Saturday", sun: "Pickup Sunday", digital: "Digital file" };
  /* a digital file has nothing to ship: only where the buyer lives matters (for Texas sales tax) */
  var WHERE = { tx: { name: "In Texas", note: "8.25% Texas sales tax" }, out: { name: "Outside Texas", note: "No Texas sales tax" } };
  function stepAfterLast(form, fs) {   /* right after the last numbered step (the pet form ends with its price table) */
    var steps = form.querySelectorAll("fieldset.step"), last = steps[steps.length - 1];
    form.insertBefore(fs, last ? last.nextSibling : null);
  }
  function radioTiles(name, keys, defs, first) {
    var tiles = el("div", { "class": "tiles cols-1" });   /* one per row on phones: name above its note */
    keys.forEach(function (k) {
      var inp = el("input", { type: "radio", name: name, value: k });
      if (k === first) { inp.checked = true; inp.defaultChecked = true; }
      tiles.appendChild(el("label", { "class": "tile" }, [inp, el("span", { "class": "tile-name", text: defs[k].name }), el("span", { "class": "tile-note", text: defs[k].note })]));
    });
    return tiles;
  }
  function stepLegend(text) {
    return el("legend", null, [el("span", { "class": "step-n", "aria-hidden": "true", text: "" }), document.createTextNode(" "), el("span", { "class": "step-label", text: text })]);
  }
  function addGetIt(form, id) {
    var fs = el("fieldset", { "class": "step step-getit" });
    fs.appendChild(stepLegend("Pickup or shipping"));
    var off = el("p", { "class": "step-off", id: id + "-getit-off" });
    off.hidden = true;
    fs.appendChild(off);
    fs.appendChild(radioTiles("getit", GET_KEYS, GET_IT, "ship"));
    var how = el("p", { "class": "step-hint getit-how", id: id + "-getit-how", text: GET_IT.ship.hint });
    fs.appendChild(how);
    fs.setAttribute("aria-describedby", how.id);
    stepAfterLast(form, fs);
    return fs;
  }
  function addWhere(form, id) {
    var fs = el("fieldset", { "class": "step step-where" });
    fs.appendChild(stepLegend("Where you live"));
    var hint = el("p", { "class": "step-hint", id: id + "-where-hint", text: "A digital file has nothing to ship — Texas sales tax applies to buyers in Texas." });
    fs.appendChild(hint);
    fs.appendChild(radioTiles("where", ["tx", "out"], WHERE, "tx"));
    fs.setAttribute("aria-describedby", hint.id);
    fs.hidden = true;
    stepAfterLast(form, fs);
    return fs;
  }

  /* − / + around a quantity field (the field itself stays typeable) */
  function enhanceQty(wrap, onChange) {
    var input = wrap.querySelector("input");
    if (!input) return;
    var min = Number(input.min) || 1, max = Number(input.max) || 50;
    var minus = el("button", { type: "button", "class": "qty-btn", "aria-label": "One fewer", text: "−" });
    var plus = el("button", { type: "button", "class": "qty-btn", "aria-label": "One more", text: "+" });
    wrap.insertBefore(minus, input); wrap.appendChild(plus);
    var capNote = el("p", { "class": "step-hint qty-cap", id: input.id + "-cap", text: "Up to " + max + " here — for more, write the number in your order." });
    capNote.hidden = true;
    wrap.parentNode.insertBefore(capNote, wrap.nextSibling);
    function clamp(n) { return clampNum(n, min, max); }
    /* aria-disabled, not disabled: a disabled button drops the keyboard focus it holds */
    function sync() {
      var n = clamp(input.value);
      minus.setAttribute("aria-disabled", n <= min ? "true" : "false"); plus.setAttribute("aria-disabled", n >= max ? "true" : "false");
      capNote.hidden = n < max;
    }
    function set(n) { input.value = clamp(n); sync(); onChange(); }
    minus.addEventListener("click", function () { if (clamp(input.value) > min) set(clamp(input.value) - 1); });
    plus.addEventListener("click", function () { if (clamp(input.value) < max) set(clamp(input.value) + 1); });
    input.addEventListener("input", function () {
      if (input.value === "") return;   /* still typing: wait */
      var n = Number(input.value);
      if (n > max || (n >= min && n !== Math.floor(n))) input.value = clamp(n);   /* 60 → 50, 2.5 → 2 straight away */
      if (Number(input.value) >= min) { sync(); onChange(); }
    });
    input.addEventListener("change", function () { input.value = clamp(input.value); sync(); });   /* the form's change listener updates */
    wrap.syncQty = sync;
    sync();
  }

  /* ---------- one piece: options → box + estimate ---------- */
  function setupGift(art) {
    var key = art.getAttribute("data-gift"), def = GIFTS[key];
    if (!def) return null;
    var form = art.querySelector(".gift-steps");
    var box = art.querySelector(".box");
    var end = art.querySelector(".box-end");
    var storeKey = "purrlight-custom-pick:" + key;
    var g = { id: art.id, key: key, def: def, art: art, est: null, text: "", swaps: {} };

    /* estimate · deposit today · balance after the photo is approved */
    var totalRow = el("p", { "class": "box-total" });
    var depositRow = el("p", { "class": "box-deposit" });
    var balanceRow = el("p", { "class": "box-balance" });
    var noteRow = el("p", { "class": "box-note" });
    [noteRow, balanceRow, depositRow, totalRow].forEach(function (n) { end.insertBefore(n, end.firstChild); });
    var copyBtn = el("button", { type: "button", "class": "link-btn pick-copy", text: "Copy my pick" });
    var resetBtn = el("button", { type: "button", "class": "link-btn pick-reset", text: "Start over" });
    var actions = el("div", { "class": "pick-actions" }, [copyBtn, form ? resetBtn : null, el("a", { "class": "pick-how", href: "#pay", text: "How to pay" })]);
    var copied = el("p", { "class": "pick-copied", role: "status" });
    end.appendChild(actions); end.appendChild(copied);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
    var table = art.querySelector("details.all-prices");
    if (table) table.open = false;   /* open without JS; with the tiles doing the work it folds away */
    /* card message (doll, godparents): goes into the pick, never stored on the device */
    /* how it reaches the customer (Elise 16/10): free U.S. shipping, or pickup at Pearland Town Center on Saturday or Sunday */
    var getit = form ? addGetIt(form, art.id) : null;
    var where = form ? addWhere(form, art.id) : null;
    var msgEl = form ? form.querySelector("[data-message]") : null;
    var msgStep = msgEl ? msgEl.closest(".step-message") : null;
    var msgCount = msgStep ? msgStep.querySelector(".msg-count") : null;
    if (msgStep) msgStep.hidden = false;
    if (msgEl && msgCount) {   /* the counter is visual; the limit itself is read out with the field */
      var msgHint = el("span", { "class": "sr-only", id: msgEl.id + "-hint", text: "Up to 160 characters." });
      msgCount.parentNode.insertBefore(msgHint, msgCount);
      msgEl.setAttribute("aria-describedby", msgHint.id);
    }
    function message() { return msgEl ? msgEl.value.replace(/\s+/g, " ").trim().slice(0, 160) : ""; }
    function pickText() { var m = message(); return summaryLine(def.product, g.est, g.how) + (m ? ' · Card message: "' + m + '"' : ""); }
    if (msgEl) msgEl.addEventListener("input", function () {
      if (msgCount) msgCount.textContent = msgEl.value.length + " / 160";
      g.text = pickText(); copied.textContent = ""; pick(g);   /* quietly: no announcement per keystroke */
    });
    /* housewarming: the basic items that an add-on can swap out */
    var basics = art.querySelectorAll("[data-basic]");
    for (var bi = 0; bi < basics.length; bi++) basics[bi].setAttribute("data-text", basics[bi].textContent);
    var swapWrap = art.querySelector("[data-swaps]");
    function syncSwaps(v) {
      if (!swapWrap) return;
      var on = v.addons || [];
      for (var k in g.swaps) if (on.indexOf(k) === -1) delete g.swaps[k];
      var sig = on.join(",");
      if (swapWrap.getAttribute("data-sig") !== sig) {
        swapWrap.innerHTML = "";
        if (on.length) swapWrap.appendChild(el("p", { "class": "swaps-title", text: "For each add-on, choose:" }));
        on.forEach(function (val) {
          var box2 = form.querySelector('input[name="addons"][value="' + val + '"]');
          var sid = art.id + "-swap-" + val;
          var sel = el("select", { id: sid, "data-swap": val });
          var HW = PRICES.housewarming, add = HW.addons[val] || 0;
          sel.appendChild(el("option", { value: "", text: "Add to the box (" + signed(add) + ")" }));
          for (var b = 0; b < basics.length; b++) {
            var bkey = basics[b].getAttribute("data-basic"), worth = HW.basics[bkey];
            sel.appendChild(el("option", { value: bkey, text: "Swap for the " + (basics[b].getAttribute("data-short") || lowerFirst(basics[b].getAttribute("data-text"))) + (worth === undefined ? "" : " (" + signed(add - worth) + ")") }));
          }
          sel.value = g.swaps[val] || "";
          sel.addEventListener("change", function () { if (sel.value) g.swaps[val] = sel.value; else delete g.swaps[val]; });   /* the form's change listener updates */
          swapWrap.appendChild(el("div", { "class": "swap-row" }, [el("label", { "for": sid, text: box2 ? box2.getAttribute("data-label") : val }), sel]));
        });
        swapWrap.setAttribute("data-sig", sig);
      }
      swapWrap.hidden = !on.length;
      /* one basic item can be swapped only once */
      var sels = swapWrap.querySelectorAll("select");
      for (var s1 = 0; s1 < sels.length; s1++) for (var o1 = 0; o1 < sels[s1].options.length; o1++) {
        var opt = sels[s1].options[o1], taken = false;
        for (var k2 in g.swaps) if (k2 !== sels[s1].getAttribute("data-swap") && g.swaps[k2] === opt.value) taken = true;
        opt.disabled = !!opt.value && taken;
      }
      /* the painting swapped out → no home photo to send */
      var photoStep = art.querySelector(".step-photos");
      if (photoStep) { var noPainting = false; for (var k4 in g.swaps) if (g.swaps[k4] === "painting") noPainting = true; photoStep.hidden = noPainting; }
      /* the box shows what was swapped out */
      for (var b2 = 0; b2 < basics.length; b2++) {
        var bk = basics[b2].getAttribute("data-basic"), by = "";
        for (var k3 in g.swaps) if (g.swaps[k3] === bk) { var ab = form.querySelector('input[name="addons"][value="' + k3 + '"]'); by = ab ? ab.getAttribute("data-label") : k3; }
        basics[b2].textContent = basics[b2].getAttribute("data-text");
        basics[b2].classList.toggle("is-swapped", !!by);
        if (by) { basics[b2].appendChild(document.createTextNode(" ")); basics[b2].appendChild(el("span", { "class": "swapped-for", text: "— swapped for " + lowerFirst(by) })); }
      }
    }
    var qtyWrap = art.querySelector("[data-qty]");

    var prevLabels = null, prevTotal = null, prevQty = 1;
    function update(fromUser, changed, val) {
      var v = readValues(form);
      /* print-only steps / tiles (paper, frame, gift box) only apply to printed paintings */
      var isDigital = v.format === "digital";
      var printOnly = art.querySelectorAll("[data-print-only]");
      for (var i = 0; i < printOnly.length; i++) {
        var node = printOnly[i];
        if (node.tagName === "FIELDSET") {
          node.disabled = isDigital;
          /* back to its defaults (fine-art, no frame) — the same as the gift box below, so a later print starts clean */
          if (isDigital) { var rs = node.querySelectorAll('input[type="radio"]'); for (var k = 0; k < rs.length; k++) rs[k].checked = rs[k].defaultChecked; }
        }
        else { var inp = node.querySelector("input"); if (inp) { inp.disabled = isDigital; if (isDigital) inp.checked = false; } }
        node.classList.toggle("is-off", isDigital);
        var why = node.querySelector(".step-off");
        if (why) { why.hidden = !isDigital; if (isDigital) node.setAttribute("aria-describedby", why.id); else node.removeAttribute("aria-describedby"); }
      }
      g.say = "";
      if (getit) {   /* fresh items (PRICES.housewarming.fresh) are pickup only; live plants (…plants) stay in Texas */
        var P = PRICES[key] || {}, freshNames = [], plantOn = false;
        (v.addons || []).forEach(function (a) {
          var box1 = form.querySelector('input[name="addons"][value="' + a + '"]');
          if ((P.fresh || []).indexOf(a) > -1) freshNames.push(box1 ? box1.getAttribute("data-label") : a);
          if ((P.plants || []).indexOf(a) > -1) plantOn = true;
        });
        var freshOn = freshNames.length > 0, ok = { ship: !freshOn, out: !freshOn && !plantOn, sat: true, sun: true }, gin = {}, cur = "";
        GET_KEYS.forEach(function (k) {
          gin[k] = getit.querySelector('input[value="' + k + '"]');
          gin[k].disabled = !ok[k];
          gin[k].parentNode.classList.toggle("is-off", !ok[k]);
          if (gin[k].checked) cur = k;
        });
        var freshWhy = (freshNames.length > 1 ? freshNames.join(" and ") + " are" : "The " + lowerFirst(freshNames[0]) + " is") + " pickup only";
        /* the page moved the customer: say so, and move them back once the reason is gone (unless they chose since) */
        if (!ok[cur]) {
          var to = ok.ship ? "ship" : "sat";
          gin[to].checked = true;
          g.auto = { from: g.auto ? g.auto.from : (cur || "ship"), to: to };
          g.say = (freshOn ? freshWhy : "We ship plants within Texas only") + " — set to " + GET_IT[to].pick + "." + (to === "sat" ? " Sunday works too." : "");
        } else if (g.auto && gin[g.auto.to].checked && g.auto.from !== g.auto.to) {
          var back = ok[g.auto.from] ? g.auto.from : (g.auto.from === "out" && ok.ship ? "ship" : "");
          if (back && back !== g.auto.to) {
            gin[back].checked = true;
            if (back === g.auto.from) { g.say = "Back to " + GET_IT[back].name + "."; g.auto = null; }
            else { g.say = "We ship plants within Texas only — set to " + GET_IT[back].pick + "."; g.auto.to = back; }
          }
        }
        var offNote = getit.querySelector(".step-off"), howNote = getit.querySelector(".getit-how");
        offNote.textContent = [freshOn ? freshWhy + "." : "", plantOn ? "We ship plants within Texas only." : ""].filter(Boolean).join(" ");
        offNote.hidden = !offNote.textContent;
        getit.setAttribute("aria-describedby", (offNote.hidden ? "" : offNote.id + " ") + howNote.id);
      }
      v = readValues(form);   /* re-read: disabled extras drop out */
      syncSwaps(v);
      /* browsers without :has(): mirror the checked state as a class */
      var tin = art.querySelectorAll(".tile input");
      for (var q = 0; q < tin.length; q++) tin[q].parentNode.classList.toggle("is-checked", tin[q].checked && !isDisabled(tin[q]));
      /* prices that follow another choice (yarn by size, frame by print size, pages by format) */
      var dyn = art.querySelectorAll("[data-price-by]");
      for (var d = 0; d < dyn.length; d++) {
        var spec = JSON.parse(dyn[d].getAttribute("data-price-by"));
        dyn[d].textContent = spec.map[v[spec.key]] || "";
      }
      /* conditional rows, captions and photos */
      var whens = art.querySelectorAll("[data-when]:not(.shot)");
      for (var w = 0; w < whens.length; w++) {
        var show = holds(whens[w].getAttribute("data-when"), v);
        if (show && whens[w].hidden && fromUser) whens[w].classList.add("is-new");
        whens[w].hidden = !show;
      }
      /* the photo follows the choice ("now showing", OREOiD): the view tied to the step just changed, else the view
         already shown while it still applies, else the first view whose condition holds, else the main photo */
      var shots = art.querySelectorAll(".gift-photo .shot"), mainShot = null, curShot = null, valid = [], showShot = null;
      for (var s = 0; s < shots.length; s++) {
        var sw = shots[s].getAttribute("data-when"), so = shots[s].getAttribute("data-on");
        if (!sw && !so) { mainShot = shots[s]; continue; }
        if (!shots[s].hidden) curShot = shots[s];
        if (!sw || holds(sw, v)) valid.push(shots[s]);
      }
      /* a box just ticked: its own view first (the rosary, not the gift box ticked before it) */
      if (changed && val) for (var s1 = 0; s1 < valid.length && !showShot; s1++) if (("&" + valid[s1].getAttribute("data-when") + "&").indexOf("&" + changed + "~" + val + "&") > -1) showShot = valid[s1];
      if (changed && !showShot) for (var s2 = 0; s2 < valid.length && !showShot; s2++) if ((" " + valid[s2].getAttribute("data-on") + " ").indexOf(" " + changed + " ") > -1) showShot = valid[s2];
      if (!showShot && curShot && valid.indexOf(curShot) > -1) showShot = curShot;
      if (!showShot) for (var s3 = 0; s3 < valid.length && !showShot; s3++) if (valid[s3].hasAttribute("data-when")) showShot = valid[s3];
      showShot = showShot || mainShot;
      for (var s4 = 0; s4 < shots.length; s4++) {
        var vis = shots[s4] === showShot;
        if (vis && shots[s4].hidden && fromUser) { shots[s4].classList.remove("is-new"); void shots[s4].offsetWidth; shots[s4].classList.add("is-new"); }
        shots[s4].hidden = !vis;
      }

      var est = def.est(def.read(v, form, g));
      if (getit) {
        getit.hidden = !!est.digitalOnly;   /* a digital file has nothing to ship … */
        where.hidden = !est.digitalOnly;    /* … only where the buyer lives matters for tax */
        var gw = GET_IT[v.getit] || GET_IT.ship;
        g.getit = est.digitalOnly ? "digital" : (GET_IT[v.getit] ? v.getit : "ship");
        g.how = est.digitalOnly ? "" : gw.pick;
        var howHint = getit.querySelector(".getit-how");
        if (howHint) howHint.textContent = gw.hint;
        if (est.digitalOnly ? v.where === "out" : g.getit === "out") est = outOfTexas(est);   /* no Texas sales tax */
        /* where the buyer lives (a file) and where it ships (a parcel) can differ — keep both, but say the tax came back */
        if (fromUser && g.wasDigital !== undefined && g.wasDigital !== !!est.digitalOnly && !est.outOfTexas) {
          var also = "";
          if (!est.digitalOnly && v.where === "out" && g.getit === "ship" && !isDisabled(getit.querySelector('input[value="out"]'))) also = "Texas sales tax added — choose Ship outside Texas if it ships to another state.";
          else if (est.digitalOnly && v.getit === "out") also = "Texas sales tax added — under Where you live, choose Outside Texas if you live outside Texas.";
          if (also) g.say = (g.say ? g.say + " " : "") + also;
        }
        g.wasDigital = !!est.digitalOnly;
      }
      g.est = est;
      if (form) {   /* number the steps that show (a swapped-out painting hides "Your photos"); step 1 is the picker */
        var fss = form.querySelectorAll("fieldset.step"), sn = 2;
        for (var f = 0; f < fss.length; f++) { var num = fss[f].querySelector(".step-n"); if (num && !fss[f].hidden) num.textContent = String(sn++); }
      }
      g.text = pickText();
      if (qtyWrap && qtyWrap.syncQty) qtyWrap.syncQty();
      /* the box: main line first, the included rows (static HTML), then each add-on */
      var old = box.querySelectorAll("li.line");
      for (var o = 0; o < old.length; o++) box.removeChild(old[o]);
      var added = [], oldLabels = prevLabels || [];
      function addonKey(l) { var m = l.match(/^Swap: .* → (.*)$/); return m ? m[1] : l.replace(/^Add: /, ""); }
      function sayLine(l) { var m = l.match(/^Swap: (.*) → (.*)$/); return m ? m[2] + " replaces the " + m[1] : l.replace(/^Add: /, "Added: "); }
      est.lines.forEach(function (l, idx) {
        var li = el("li", { "class": "line " + (idx === 0 ? "line-main" : "line-add") });
        var name = el("span", { "class": "line-name" });
        if (idx === 0 && def.item) { name.appendChild(el("span", { "class": "line-item", text: def.item })); name.appendChild(el("span", { "class": "line-sub", text: l.label })); }
        else { name.textContent = l.label; if (l.detail) name.appendChild(el("span", { "class": "line-sub", text: l.detail })); }
        li.appendChild(name);
        li.appendChild(el("span", { "class": "amt", text: idx === 0 ? money(l.amount) : signed(l.amount) }));
        if (prevLabels && prevLabels.indexOf(l.label) === -1) { added.push(l.label); if (fromUser) li.classList.add("is-new"); }
        if (idx === 0) box.insertBefore(li, box.firstChild); else box.appendChild(li);
      });
      if (est.qty > 1) {   /* order more, save more: × N, then the saving */
        var qli = el("li", { "class": "line line-qty" }, [el("span", { "class": "line-name", text: "× " + est.qty + " " + est.many }), el("span", { "class": "amt", text: money(est.subtotal) })]);
        var sli = el("li", { "class": "line line-save" }, [el("span", { "class": "line-name", text: "Order more, save more" }), el("span", { "class": "amt", text: "−" + money(est.saving) })]);
        if (fromUser && prevQty !== est.qty) { qli.classList.add("is-new"); sli.classList.add("is-new"); }
        box.appendChild(qli); box.appendChild(sli);
      }
      prevQty = est.qty;
      /* Texas sales tax (8.25%) — not on fresh fruit, none when it ships (or the buyer lives) outside Texas */
      var taxName = el("span", { "class": "line-name", text: est.outOfTexas ? "Texas sales tax" : taxLabel() });
      if (est.outOfTexas || est.taxFree) taxName.appendChild(el("span", { "class": "line-sub", text: est.outOfTexas ? "None outside Texas" : "Not on the fresh fruit" }));
      box.appendChild(el("li", { "class": "line line-tax" }, [taxName, el("span", { "class": "amt", text: est.outOfTexas ? "$0" : "+" + money(est.tax) })]));
      prevLabels = est.lines.map(function (l) { return l.label; });
      totalRow.innerHTML = "";
      totalRow.appendChild(el("span", { text: "Estimate" }));
      var amt = el("strong", { "class": "amt", text: money(est.total) });
      if (fromUser && prevTotal !== null && prevTotal !== est.total) amt.classList.add("is-new");
      totalRow.appendChild(amt);
      prevTotal = est.total;
      depositRow.innerHTML = ""; balanceRow.innerHTML = "";
      var db = moneyPair(est.deposit, est.balance);
      depositRow.appendChild(el("span", { text: "Deposit today (50%)" })); depositRow.appendChild(el("strong", { "class": "amt", text: db[0] }));
      balanceRow.appendChild(el("span", { text: "Balance after you approve the photo" })); balanceRow.appendChild(el("span", { "class": "amt", text: db[1] }));
      if (fromUser) g.goneNote = "";
      noteRow.textContent = [est.note, est.digitalOnly ? "" : (GET_IT[v.getit] || GET_IT.ship).short].filter(Boolean).join(" · ") + (g.goneNote ? " " + g.goneNote : "");
      copied.textContent = "";
      if (fromUser) store(storeKey, { v: v, swaps: g.swaps, u: 1, auto: g.auto || 0 });   /* a plain page view remembers nothing */
      if (g === current) setBarThumb(g);
      if (fromUser) {
        var newKeys = prevLabels.slice(1).map(addonKey);
        var removed = oldLabels.filter(function (lab, ix) { return ix > 0 && newKeys.indexOf(addonKey(lab)) === -1; });   /* a swapped main line, or an add-on that only changed role, is not a removal */
        live.textContent = (added.length ? added.map(sayLine).join(", ") + ". " : "") + (removed.length ? "Removed: " + removed.map(addonKey).join(", ") + ". " : "") + (est.qty > 1 ? est.qty + " " + est.many + ". " : "") + "Estimate " + money(est.total) + "." + (g.say ? " " + g.say : "");
        var addOn = added.filter(function (a) { return a !== prevLabels[0]; });
        if (addOn.length) barAdded(addOn[addOn.length - 1]);
        pick(g);
      }
    }
    g.update = update;
    if (form) {
      form.addEventListener("change", function (e) {
        var t = e.target;
        if (!t || t === msgEl) return;
        if (t.name === "getit") g.auto = null;   /* the customer chose: keep it */
        update(true, t.name, t.type === "checkbox" && t.checked ? t.value : "");
      });
      if (qtyWrap) enhanceQty(qtyWrap, function () { update(true); });
      form.addEventListener("focusin", function (e) { var t = e.target, lab = t && t.parentNode; if (lab && lab.classList && lab.classList.contains("tile")) { try { lab.classList.toggle("is-focus", t.matches(":focus-visible")); } catch (err) { /* no :focus-visible */ } } });
      form.addEventListener("focusout", function (e) { var lab = e.target && e.target.parentNode; if (lab && lab.classList) lab.classList.remove("is-focus"); });
    }

    var copiedTimer = null;
    copyBtn.addEventListener("click", function () {
      copyText(g.text, function () {
        copied.textContent = "Copied — paste it into your order.";
        clearTimeout(copiedTimer); copiedTimer = setTimeout(function () { copied.textContent = ""; }, 4000);
      }, function () { copied.textContent = "Copy not available here — note your pick when you order: " + g.text; });
    });
    function mainView() { var sh = art.querySelectorAll(".gift-photo .shot"); for (var i = 0; i < sh.length; i++) sh[i].hidden = sh[i].hasAttribute("data-when") || sh[i].hasAttribute("data-on"); }
    resetBtn.addEventListener("click", function () {
      if (form) form.reset();
      g.swaps = {}; g.auto = null;
      mainView();
      if (msgCount) msgCount.textContent = "Up to 160 characters";
      update(true); store(storeKey, null);
    });

    /* remember the pick on this device (restoring is not a fresh pick — the links wait for a real tap) */
    var saved = load(storeKey);
    if (form && saved && saved.u === 1 && saved.v && typeof saved.v === "object") {
      g.restored = true;
      /* a pickup the page chose (an older pick stored 1 = ship → Saturday) */
      if (saved.auto === 1) g.auto = { from: "ship", to: "sat" };
      else if (saved.auto && GET_IT[saved.auto.from] && GET_IT[saved.auto.to]) g.auto = { from: saved.auto.from, to: saved.auto.to };
      var inputs = form.querySelectorAll("input");
      for (var r = 0; r < inputs.length; r++) {
        var inp2 = inputs[r];
        if (inp2.type === "radio") { if (Object.prototype.hasOwnProperty.call(saved.v, inp2.name)) inp2.checked = saved.v[inp2.name] === inp2.value; }
        else if (inp2.type === "checkbox") inp2.checked = Array.isArray(saved.v[inp2.name]) && saved.v[inp2.name].indexOf(inp2.value) > -1;
        else if (inp2.type === "number" && /^\d{1,3}$/.test(String(saved.v[inp2.name]))) inp2.value = Math.max(Number(inp2.min) || 1, Math.min(Number(saved.v[inp2.name]), Number(inp2.max) || 50));
      }
      if (saved.swaps && typeof saved.swaps === "object") for (var sk in saved.swaps) {
        if (!Object.prototype.hasOwnProperty.call(saved.swaps, sk)) continue;
        var ck = String(sk).replace(/[^\w-]/g, ""), cv = String(saved.swaps[sk]).replace(/[^\w-]/g, ""), used = false;
        for (var uk in g.swaps) if (g.swaps[uk] === cv) used = true;   /* a basic item swaps once */
        if (ck && cv && !used && form.querySelector('input[name="addons"][value="' + ck + '"]') && art.querySelector('[data-basic="' + cv + '"]')) g.swaps[ck] = cv;
      }
      /* a saved add-on that is no longer offered (the cold cut box went back to "coming soon") is dropped: say so */
      var gone = (Array.isArray(saved.v.addons) ? saved.v.addons : []).map(function (a) { return String(a).replace(/[^\w-]/g, ""); })
        .filter(function (a) { return a && !form.querySelector('input[name="addons"][value="' + a + '"]'); });
      if (gone.length) {
        var soonNames = gone.map(function (a) { var t = art.querySelector('[data-soon="' + a + '"] .tile-name'); return t ? t.textContent : ""; }).filter(Boolean);
        g.goneNote = soonNames.length ? soonNames.join(" and ") + (soonNames.length > 1 ? " are" : " is") + " coming soon — taken out of your saved pick." : "An item in your saved pick is no longer offered — taken out.";
      }
      /* a stored radio value that no longer exists would leave a group empty: fall back to the default */
      var groups = {};
      for (var r2 = 0; r2 < inputs.length; r2++) if (inputs[r2].type === "radio") groups[inputs[r2].name] = groups[inputs[r2].name] || inputs[r2].checked;
      for (var gname in groups) if (!groups[gname]) {
        var defs = form.querySelectorAll('input[type="radio"][name="' + gname + '"]');
        for (var r3 = 0; r3 < defs.length; r3++) defs[r3].checked = defs[r3].defaultChecked;
      }
    }
    g.clear = function () { if (form) form.reset(); g.swaps = {}; g.auto = null; mainView(); if (msgCount) msgCount.textContent = "Up to 160 characters"; };
    g.form = form;
    update(false);
    return g;
  }

  var gifts = [], byId = Object.create(null);   /* #__proto__ / #constructor are not pieces */
  var arts = document.querySelectorAll("article.gift[data-gift]");
  for (var a = 0; a < arts.length; a++) { var gg = setupGift(arts[a]); if (gg) { gifts.push(gg); byId[gg.id] = gg; } }
  var current = null;

  function updateBar() {
    if (current && current.est) barText.textContent = "Estimate " + money(current.est.total) + " · " + current.def.product;   /* the number first: phones cut the end */
    if (!barCap.classList.contains("is-added")) barCap.textContent = barCapText();
    if (current) setBarThumb(current);
  }
  function setBarThumb(g) {
    var img = g.art.querySelector(".gift-photo .shot:not([hidden]) img");
    if (!img) { barThumb.hidden = true; return; }
    if (barThumb.getAttribute("src") !== img.getAttribute("src")) barThumb.setAttribute("src", img.getAttribute("src"));
    barThumb.hidden = false;
  }

  /* ---------- pay your deposit: Square link (customer types the amount) or Zelle ---------- */
  var payPick = document.querySelector("[data-pay-pick]");
  var paySquare = document.querySelectorAll("[data-pay-square]");
  var zelleTo = document.querySelector("[data-zelle-to]");
  if (typeof PAY !== "undefined") {
    for (var ps = 0; ps < paySquare.length; ps++) paySquare[ps].setAttribute("href", PAY.squareUrl);
    if (zelleTo) zelleTo.textContent = PAY.zelleTo;
  }
  /* each copy button reports right under itself (one status per way to pay), so phones see it next to the tap */
  function payStatusAfter(block) {
    var st = el("p", { "class": "pay-status", role: "status" });
    if (block && block.parentNode) block.parentNode.insertBefore(st, block.nextSibling);
    return st;
  }
  function payCopy(st, text, done) {
    copyText(text, function () { st.textContent = done; clearTimeout(st.timer); st.timer = setTimeout(function () { st.textContent = ""; }, 4000); },
      function () { st.textContent = "Copy not available here — " + text; });
  }
  var copyAmountBtn = el("button", { type: "button", "class": "link-btn pay-copy-amount", text: "Copy deposit amount", hidden: "" });
  var copyZelleBtn = el("button", { type: "button", "class": "link-btn pay-copy-zelle", text: "Copy address" });
  var squareStatus = null, zelleStatus = null;
  if (paySquare.length && paySquare[0].parentNode) { paySquare[0].parentNode.appendChild(copyAmountBtn); squareStatus = payStatusAfter(paySquare[0].parentNode); }
  if (zelleTo && zelleTo.parentNode) {
    zelleTo.parentNode.appendChild(document.createTextNode(" "));   /* never "…@gmail.comCopy address" */
    zelleTo.parentNode.appendChild(copyZelleBtn);
    zelleStatus = payStatusAfter(zelleTo.parentNode);
  }
  /* the deposit to copy is the pick the order links carry — never a piece the customer has not chosen */
  copyAmountBtn.addEventListener("click", function () {
    if (lastPick && squareStatus) payCopy(squareStatus, lastPick.deposit.toFixed(2).replace(/\.00$/, ""), "Copied " + money(lastPick.deposit) + " — paste it on the Square page.");
  });
  copyZelleBtn.addEventListener("click", function () { if (zelleStatus) payCopy(zelleStatus, zelleTo ? zelleTo.textContent : "", "Copied the Zelle address."); });
  function updatePay() {
    copyAmountBtn.hidden = !lastPick;
    if (!payPick) return;
    payPick.hidden = !lastPick;
    payPick.innerHTML = "";
    if (!lastPick) return;
    payPick.appendChild(document.createTextNode("Your pick — " + lastPick.product + ": deposit "));
    payPick.appendChild(el("strong", { text: money(lastPick.deposit) }));
    payPick.appendChild(document.createTextNode(" (estimate " + money(lastPick.total) + ")."));
  }

  /* how the photos travel: the order email today, the order form once ORDER_FORM_URL is a form */
  var howPhotos = document.querySelectorAll("[data-photo-how]");
  var byEmail = /^mailto:/i.test(ORDER_FORM_URL);
  /* Instagram / TikTok / Facebook in-app browsers can drop a form while a photo is being picked */
  var inApp = /Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance/i.test(navigator.userAgent || "");
  for (var hp = 0; hp < howPhotos.length; hp++) howPhotos[hp].textContent = byEmail ? "Attach them to your order email."
    : "Upload them in the order form." + (inApp ? " Opened this inside an app? Use its ••• menu to open the page in your browser so your photos attach." : "") + " Photos won't attach? Email them to purrlightstudiollc@gmail.com.";
  function pick(g) {   /* the customer is now building this piece: it is what the order links carry */
    lastPick = { product: g.def.product, total: g.est.total, deposit: g.est.deposit, text: g.text, getit: g.getit };
    if (g === current) updateBar();
    updatePay();
    applyOrderLinks();
  }

  /* ---------- step 1: choose your gift (tabs over the seven pieces) ---------- */
  var picker = document.querySelector(".picker");
  var tabs = picker ? picker.querySelectorAll("a[data-tab]") : [];
  var CURRENT_KEY = "purrlight-custom-pick:_current";
  function activate(id, opts) {
    var g = byId[id];
    if (!g) return;
    opts = opts || {};
    current = g;
    for (var i = 0; i < gifts.length; i++) {
      var on = gifts[i] === g;
      if (on && gifts[i].art.hidden && opts.user) gifts[i].art.classList.add("is-new");
      gifts[i].art.hidden = !on;
    }
    for (var t = 0; t < tabs.length; t++) {
      var sel = tabs[t].getAttribute("data-tab") === id;
      tabs[t].setAttribute("aria-selected", sel ? "true" : "false");
      tabs[t].setAttribute("tabindex", sel ? "0" : "-1");
      tabs[t].classList.toggle("is-on", sel);
      if (sel && picker.scrollWidth > picker.clientWidth) {   /* phones: keep the chosen tile in view without moving the page */
        var li = tabs[t].parentNode, left = li.getBoundingClientRect().left - picker.getBoundingClientRect().left + picker.scrollLeft;
        if (left < picker.scrollLeft || left + li.offsetWidth > picker.scrollLeft + picker.clientWidth) picker.scrollLeft = Math.max(0, left - 16);
      }
    }
    updateBar();
    if (opts.user) {
      store(CURRENT_KEY, id);
      try { history.replaceState(null, "", "#" + id); } catch (e) { /* file:// or old browser */ }
      live.textContent = "Estimate " + money(g.est.total) + ".";   /* the tab name is already read out */
      pick(g);
    }
  }
  if (picker && gifts.length) {
    picker.setAttribute("role", "tablist");
    for (var t = 0; t < tabs.length; t++) (function (tab, idx) {
      var id = tab.getAttribute("data-tab");
      tab.parentNode.setAttribute("role", "presentation");
      tab.setAttribute("role", "tab");
      tab.id = "tab-" + id;
      tab.setAttribute("aria-controls", id);
      if (byId[id]) { byId[id].art.setAttribute("role", "tabpanel"); }
      tab.addEventListener("click", function (e) { e.preventDefault(); activate(id, { user: true }); });
      tab.addEventListener("keydown", function (e) {
        var n = tabs.length, next = null;
        if (e.key === "ArrowRight") next = (idx + 1) % n;
        else if (e.key === "ArrowLeft") next = (idx - 1 + n) % n;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = n - 1;
        else if (e.key === " ") { e.preventDefault(); activate(id, { user: true }); return; }
        if (next === null) return;
        e.preventDefault();
        tabs[next].focus();
        activate(tabs[next].getAttribute("data-tab"), { user: true });
      });
    })(tabs[t], t);

    var fromHash = location.hash ? location.hash.slice(1) : "";
    var saved = load(CURRENT_KEY);
    var startId = byId[fromHash] ? fromHash : (typeof saved === "string" && byId[saved] ? saved : gifts[0].id);
    activate(startId, {});
    /* a remembered or linked piece is the customer's own pick: the order links carry it from the start */
    if (byId[fromHash] || startId === saved || current.restored) pick(current);
    if (byId[fromHash]) {   /* a #piece link (QR card, Linktree, another page): show the studio with that piece chosen */
      var toPicker = function () { var label = document.getElementById("pick-label"); if (label && label.scrollIntoView) label.scrollIntoView(); };
      setTimeout(toPicker, 0);
      /* the browser's own jump to #piece can land after this script; settle on the picker once the page has loaded */
      if (document.readyState !== "complete") window.addEventListener("load", function () { setTimeout(toPicker, 0); });
    }
    window.addEventListener("hashchange", function () {
      var id = location.hash.slice(1);
      if (!byId[id]) return;
      activate(id, { user: true });
      var label = document.getElementById("pick-label");
      if (label && label.scrollIntoView) label.scrollIntoView();
    });
  }

  /* ---------- or start from a gift idea (presets) ---------- */
  var PRESETS = {   /* cheapest first (Elise 16/10): an easy first click */
    petprint:  { id: "watercolor",    values: { format: "5x7", paper: "regular" }, show: "pet" },   /* opens on a pet painting */
    memorial:  { id: "watercolor",    values: { format: "5x7", paper: "do", frame: "yes", extras: ["giftBox"] }, show: "frame" },   /* the cat on Dó in a floating frame */
    realtor:   { id: "housewarming",  values: { addons: ["succulent"] } },
    christmas: { id: "portrait-doll", values: { shadowbox: "yes" } }
  };
  function setValues(form, values) {
    if (!form) return;
    for (var name in values) {
      var val = values[name], ins = form.querySelectorAll('input[name="' + name + '"]');
      for (var i = 0; i < ins.length; i++) {
        if (ins[i].type === "checkbox") ins[i].checked = Array.isArray(val) && val.indexOf(ins[i].value) > -1;
        else if (ins[i].type === "radio") { if (ins[i].value === val) ins[i].checked = true; }
        else ins[i].value = val;
      }
    }
  }
  /* the price on each idea card comes from the same estimator: apply the preset to a copy of the form */
  function presetEstimate(p) {
    var g = byId[p.id];
    if (!g || !g.form) return null;
    var clone = g.form.cloneNode(true);
    clone.reset();
    setValues(clone, p.values);
    var ins = clone.querySelectorAll("input");
    for (var i = 0; i < ins.length; i++) ins[i].disabled = false;
    var v = readValues(clone);
    return g.def.est(g.def.read(v, clone, { swaps: {}, art: g.art }));
  }
  var ideas = document.querySelector("[data-ideas]");
  if (ideas && gifts.length) {
    var ideaBtns = ideas.querySelectorAll("[data-preset]");
    for (var ib = 0; ib < ideaBtns.length; ib++) (function (btn) {
      var p = PRESETS[btn.getAttribute("data-preset")];
      if (!p || !byId[p.id]) { btn.parentNode.hidden = true; return; }
      var est = presetEstimate(p), price = btn.querySelector("[data-idea-price]");
      if (price && est) {   /* the idea's price before tax, like the prices on the tiles */
        price.textContent = money(est.pre);
        price.appendChild(el("span", { "class": "idea-tax", text: " + tax" }));
      }
      btn.addEventListener("click", function () {
        var g = byId[p.id];
        var msg = g.form && g.form.querySelector("[data-message]"), keep = msg ? msg.value : "";   /* the card message is the customer's own words */
        /* and so is how it reaches them (what they chose, not what the page moved them to) and where they live */
        var gi = g.form && g.form.querySelector('input[name="getit"]:checked'), keepHow = gi ? (g.auto ? g.auto.from : gi.value) : "";
        var wi = g.form && g.form.querySelector('input[name="where"]:checked'), keepWhere = wi ? wi.value : "";
        g.clear();
        setValues(g.form, p.values);
        if (keepHow) setValues(g.form, { getit: keepHow });
        if (keepWhere) setValues(g.form, { where: keepWhere });
        if (msg && keep) { msg.value = keep; var mc = g.form.querySelector(".msg-count"); if (mc) mc.textContent = keep.length + " / 160"; }
        activate(p.id, { user: true });
        g.update(true, p.show);
        live.textContent = btn.querySelector(".idea-name").textContent + " — " + g.def.product + ". Estimate " + money(g.est.total) + "." + (g.say ? " " + g.say : "");
        var head = g.art.querySelector(".gift-title");
        if (head) { head.setAttribute("tabindex", "-1"); head.focus({ preventScroll: true }); }
        g.art.scrollIntoView({ block: "start" });
      });
    })(ideaBtns[ib]);
    var ideaRow = ideas.querySelector(".ideas-list");
    if (ideaRow) ideaRow.addEventListener("focusin", function (e) {   /* phones: a tabbed-to idea slides fully into view */
      var li = e.target && e.target.closest ? e.target.closest("li") : null;
      if (li && ideaRow.scrollWidth > ideaRow.clientWidth) li.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    ideas.hidden = false;
  }

  /* keyboard focus never ends up under the phone order bar (scroll-padding covers most browsers; this covers the rest) */
  document.addEventListener("focusin", function (e) {
    var t = e.target;
    if (bar.hidden || !bar.offsetHeight || !t || !t.getBoundingClientRect || bar.contains(t)) return;
    if (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains("tile")) t = t.parentNode;   /* the tile, not its 1px radio */
    var r = t.getBoundingClientRect(), top = bar.getBoundingClientRect().top;
    if (r.bottom > top - 8 && r.top < window.innerHeight) window.scrollBy(0, r.bottom - top + 16);
  });

  /* ---------- sticky bar visibility ---------- */
  var heroCta = document.querySelector(".hero-cta");
  var closing = document.querySelector(".closing");
  if ("IntersectionObserver" in window && heroCta && closing) {
    var pastHero = false, atClosing = false;
    var sync = function () { bar.hidden = !(pastHero && !atClosing); document.body.classList.toggle("has-bar", !bar.hidden); document.documentElement.classList.toggle("has-bar", !bar.hidden); };
    new IntersectionObserver(function (es) { es.forEach(function (e) { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; }); sync(); }, { threshold: 0 }).observe(heroCta);
    new IntersectionObserver(function (es) { es.forEach(function (e) { atClosing = e.isIntersecting; }); sync(); }, { threshold: 0.4 }).observe(closing);
  } else if (heroCta) {
    /* no IntersectionObserver: a plain scroll rule */
    var onScroll = function () { var show = window.scrollY > 420; bar.hidden = !show; document.body.classList.toggle("has-bar", show); document.documentElement.classList.toggle("has-bar", show); };
    window.addEventListener("scroll", onScroll); onScroll();
  }
})();
