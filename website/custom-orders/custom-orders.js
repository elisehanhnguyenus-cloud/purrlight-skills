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
  var lastPick = null;   /* { product, total, text } — the pick the customer is building */
  function orderUrl() {
    var url = ORDER_FORM_URL;
    if (/^mailto:/i.test(url)) {   /* the stopgap email link: the pick travels in the message body */
      if (lastPick) url += (url.indexOf("?") > -1 ? "&" : "?") + "body=" + encodeURIComponent(lastPick.text);
      return url;
    }
    var qs = [];
    try {
      var params = new URLSearchParams(location.search);
      params.forEach(function (v, k) { if (/^utm_/i.test(k)) qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(v)); });
    } catch (e) { /* old browsers: plain link */ }
    if (lastPick && ORDER_FORM_PREFILL_ENTRY) {
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
    try {
      var ta = el("textarea", { readonly: "", "aria-hidden": "true", style: "position:fixed;left:-9999px;top:0" });
      ta.value = text; document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) onDone(); else onFail();
    } catch (e) { onFail(); }
  }
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
  var BAR_CAP = "Free U.S. shipping on every custom order";
  var bar = el("div", { "class": "order-bar", hidden: "", role: "region", "aria-label": "Order" });
  var barCap = el("span", { "class": "order-bar-cap", text: BAR_CAP });
  var barText = el("span", { "class": "order-bar-text", text: "Custom Orders" });
  var barBtn = el("a", { "class": "btn btn-primary btn-small", "data-order": "", href: orderUrl() }, [
    el("span", { "class": "long", text: "Place your order" }), el("span", { "class": "short", text: "Order" })
  ]);
  bar.appendChild(el("span", { "class": "order-bar-col" }, [barCap, barText])); bar.appendChild(barBtn);
  document.body.appendChild(bar);
  var capTimer = null;
  function barAdded(label) {   /* a short "Added: …" in the bar — the phone's view of the box filling up */
    barCap.textContent = "Added: " + label.replace(/\s*\(.*\)$/, ""); barCap.classList.add("is-added");
    clearTimeout(capTimer);
    capTimer = setTimeout(function () { barCap.textContent = BAR_CAP; barCap.classList.remove("is-added"); }, 2600);
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
      product: "Custom Digital Watercolor Painting", item: "Watercolor painting",
      read: function (v) {
        var print = v.format !== "digital", x = v.extras || [];
        return { format: v.format, doPaper: print && v.paper === "do", frame: print && v.frame === "yes", giftBox: print && x.indexOf("giftBox") > -1, rosary: x.indexOf("rosary") > -1 };
      },
      est: function (o) { return estWatercolor(o); }
    },
    housewarming: {
      product: "Housewarming & Closing Gift Box",
      read: function (v, form) {
        var names = [], boxes = form ? form.querySelectorAll('input[name="addons"]') : [];
        for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) names.push(boxes[i].getAttribute("data-label") || boxes[i].value);
        return { addons: names };
      },
      est: function (o) { return estHousewarming(o); }
    },
    christening: {
      product: "Christening & Confirmation Gifts",
      read: function (v) { return { set: v.set === "confirmation" ? "confirmation" : "gown" }; },
      est: function (o) { return o.set === "confirmation" ? estConfirmationBox() : estChristeningGown(); }
    },
    godparent: {
      product: "Godparent Gift Set",
      read: function () { return {}; },
      est: function () { return estGodparent(); }
    },
    calendar: {
      product: "Custom Watercolor Pet Calendar 2027", item: "2027 pet calendar",
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
    }
    return v;
  }

  /* ---------- one piece: options → box + estimate ---------- */
  function setupGift(art) {
    var key = art.getAttribute("data-gift"), def = GIFTS[key];
    if (!def) return null;
    var form = art.querySelector(".gift-steps");
    var box = art.querySelector(".box");
    var end = art.querySelector(".box-end");
    var storeKey = "purrlight-custom-pick:" + key;
    var g = { id: art.id, key: key, def: def, art: art, est: null, text: "" };

    var totalRow = el("p", { "class": "box-total" });
    var noteRow = el("p", { "class": "box-note" });
    end.insertBefore(noteRow, end.firstChild); end.insertBefore(totalRow, noteRow);
    var copyBtn = el("button", { type: "button", "class": "link-btn pick-copy", text: "Copy my pick" });
    var resetBtn = el("button", { type: "button", "class": "link-btn pick-reset", text: "Start over" });
    var actions = el("div", { "class": "pick-actions" }, [copyBtn, form ? resetBtn : null, el("a", { "class": "pick-how", href: "#how", text: "How it works" })]);
    var copied = el("p", { "class": "pick-copied", role: "status" });
    end.appendChild(actions); end.appendChild(copied);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
    var table = art.querySelector("details.all-prices");
    if (table) table.open = false;   /* open without JS; with the tiles doing the work it folds away */

    var prevLabels = null, prevTotal = null;
    function update(fromUser) {
      var v = readValues(form);
      /* print-only steps / tiles (paper, frame, gift box) only apply to printed paintings */
      var isDigital = v.format === "digital";
      var printOnly = art.querySelectorAll("[data-print-only]");
      for (var i = 0; i < printOnly.length; i++) {
        var node = printOnly[i];
        if (node.tagName === "FIELDSET") node.disabled = isDigital;
        else { var inp = node.querySelector("input"); if (inp) { inp.disabled = isDigital; if (isDigital) inp.checked = false; } }
        node.classList.toggle("is-off", isDigital);
      }
      v = readValues(form);   /* re-read: disabled extras drop out */
      /* browsers without :has(): mirror the checked state as a class */
      var tin = art.querySelectorAll(".tile input");
      for (var q = 0; q < tin.length; q++) tin[q].parentNode.classList.toggle("is-checked", tin[q].checked && !tin[q].disabled);
      /* prices that follow another choice (yarn by size, frame by print size, pages by format) */
      var dyn = art.querySelectorAll("[data-price-by]");
      for (var d = 0; d < dyn.length; d++) {
        var spec = JSON.parse(dyn[d].getAttribute("data-price-by"));
        dyn[d].textContent = spec.map[v[spec.key]] || "";
      }
      /* conditional rows, captions and photos */
      var whens = art.querySelectorAll("[data-when]");
      for (var w = 0; w < whens.length; w++) {
        var show = holds(whens[w].getAttribute("data-when"), v);
        if (show && whens[w].hidden && fromUser) whens[w].classList.add("is-new");
        whens[w].hidden = !show;
      }
      var shots = art.querySelectorAll(".gift-photo .shot"), alt = false;
      for (var s = 0; s < shots.length; s++) if (shots[s].hasAttribute("data-when") && !shots[s].hidden) alt = true;
      for (var s2 = 0; s2 < shots.length; s2++) if (!shots[s2].hasAttribute("data-when")) {
        if (!alt && shots[s2].hidden && fromUser) shots[s2].classList.add("is-new");
        shots[s2].hidden = alt;
      }

      var est = def.est(def.read(v, form));
      g.est = est; g.text = summaryLine(def.product, est);
      /* the box: main line first, the included rows (static HTML), then each add-on */
      var old = box.querySelectorAll("li.line");
      for (var o = 0; o < old.length; o++) box.removeChild(old[o]);
      var added = [];
      est.lines.forEach(function (l, idx) {
        var li = el("li", { "class": "line " + (idx === 0 ? "line-main" : "line-add") });
        var name = el("span", { "class": "line-name" });
        if (idx === 0 && def.item) { name.appendChild(el("span", { "class": "line-item", text: def.item })); name.appendChild(el("span", { "class": "line-sub", text: l.label })); }
        else name.textContent = l.label;
        li.appendChild(name);
        li.appendChild(el("span", { "class": "amt", text: (idx === 0 ? "" : "+") + money(l.amount) }));
        if (prevLabels && prevLabels.indexOf(l.label) === -1) { added.push(l.label); if (fromUser) li.classList.add("is-new"); }
        if (idx === 0) box.insertBefore(li, box.firstChild); else box.appendChild(li);
      });
      prevLabels = est.lines.map(function (l) { return l.label; });
      totalRow.innerHTML = "";
      totalRow.appendChild(el("span", { text: "Estimate" }));
      var amt = el("strong", { "class": "amt", text: money(est.total) });
      if (fromUser && prevTotal !== null && prevTotal !== est.total) amt.classList.add("is-new");
      totalRow.appendChild(amt);
      prevTotal = est.total;
      noteRow.textContent = (est.note ? est.note + " · " : "") + "Free U.S. shipping";
      copied.textContent = "";
      store(storeKey, { v: v });
      if (fromUser) {
        live.textContent = (added.length ? added.join(", ") + ". " : "") + "Estimate " + money(est.total) + ".";
        var addOn = added.filter(function (a) { return a !== prevLabels[0]; });
        if (addOn.length) barAdded(addOn[addOn.length - 1]);
        pick(g);
      }
    }
    g.update = update;
    if (form) {
      form.addEventListener("change", function () { update(true); });
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
    resetBtn.addEventListener("click", function () { if (form) form.reset(); store(storeKey, null); update(true); });

    /* remember the pick on this device (restoring is not a fresh pick — the links wait for a real tap) */
    var saved = load(storeKey);
    if (form && saved && saved.v && typeof saved.v === "object") {
      var inputs = form.querySelectorAll("input");
      for (var r = 0; r < inputs.length; r++) {
        var inp2 = inputs[r];
        if (inp2.type === "radio") { if (Object.prototype.hasOwnProperty.call(saved.v, inp2.name)) inp2.checked = saved.v[inp2.name] === inp2.value; }
        else if (inp2.type === "checkbox") inp2.checked = Array.isArray(saved.v[inp2.name]) && saved.v[inp2.name].indexOf(inp2.value) > -1;
      }
      /* a stored radio value that no longer exists would leave a group empty: fall back to the default */
      var groups = {};
      for (var r2 = 0; r2 < inputs.length; r2++) if (inputs[r2].type === "radio") groups[inputs[r2].name] = groups[inputs[r2].name] || inputs[r2].checked;
      for (var gname in groups) if (!groups[gname]) {
        var defs = form.querySelectorAll('input[type="radio"][name="' + gname + '"]');
        for (var r3 = 0; r3 < defs.length; r3++) defs[r3].checked = defs[r3].defaultChecked;
      }
    }
    update(false);
    return g;
  }

  var gifts = [], byId = {};
  var arts = document.querySelectorAll("article.gift[data-gift]");
  for (var a = 0; a < arts.length; a++) { var gg = setupGift(arts[a]); if (gg) { gifts.push(gg); byId[gg.id] = gg; } }
  var current = null;

  function updateBar() {
    if (current && current.est) barText.textContent = "Estimate " + money(current.est.total) + " · " + current.def.product;   /* the number first: phones cut the end */
  }
  function pick(g) {   /* the customer is now building this piece: it is what the order links carry */
    lastPick = { product: g.def.product, total: g.est.total, text: g.text };
    if (g === current) updateBar();
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
      live.textContent = g.def.product + " — estimate " + money(g.est.total) + ".";
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

  /* ---------- sticky bar visibility ---------- */
  var heroCta = document.querySelector(".hero-cta");
  var closing = document.querySelector(".closing");
  if ("IntersectionObserver" in window && heroCta && closing) {
    var pastHero = false, atClosing = false;
    var sync = function () { bar.hidden = !(pastHero && !atClosing); document.body.classList.toggle("has-bar", !bar.hidden); };
    new IntersectionObserver(function (es) { es.forEach(function (e) { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; }); sync(); }, { threshold: 0 }).observe(heroCta);
    new IntersectionObserver(function (es) { es.forEach(function (e) { atClosing = e.isIntersecting; }); sync(); }, { threshold: 0.4 }).observe(closing);
  } else if (heroCta) {
    /* no IntersectionObserver: a plain scroll rule */
    var onScroll = function () { var show = window.scrollY > 420; bar.hidden = !show; document.body.classList.toggle("has-bar", show); };
    window.addEventListener("scroll", onScroll); onScroll();
  }
})();
