/* ============================================================
   Purrlight Custom Orders — page behavior
   - every "Place your order" link → ORDER_FORM_URL (prices.js), utm passed through
   - inline estimators ("Build your piece"): chips / the pet price table → live estimate from prices.js
   - the customer's pick reaches the form as a copied summary line (or a prefilled field when
     ORDER_FORM_PREFILL_ENTRY is set) — the page never invents a price: every number is prices.js = brief §3
   - site nav drawer, sticky order bar on phones, picks remembered on this device
   No framework, ES5, works without JS (copy, prices and the mailto links are plain HTML).
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
  var lastPick = null;   /* { product, total, text } — the last pick the customer touched */
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

  /* ---------- sticky order bar (phones) ---------- */
  var bar = el("div", { "class": "order-bar", hidden: "", role: "region", "aria-label": "Order" });
  var barCap = el("span", { "class": "order-bar-cap", text: "Free U.S. shipping on every custom order" });
  var barText = el("span", { "class": "order-bar-text", text: "Custom Orders" });
  var barBtn = el("a", { "class": "btn btn-primary btn-small", "data-order": "", href: orderUrl() }, [
    el("span", { "class": "long", text: "Place your order" }), el("span", { "class": "short", text: "Order" })
  ]);
  bar.appendChild(el("span", { "class": "order-bar-col" }, [barCap, barText])); bar.appendChild(barBtn);
  document.body.appendChild(bar);
  var sectionInView = "";
  function updateBar() {
    if (lastPick) barText.textContent = lastPick.product + " · estimate " + money(lastPick.total);
    else if (sectionInView) barText.textContent = sectionInView;
  }

  /* ---------- builder definitions ----------
     Each option group renders as chips (native radio/checkbox inside a label) or uses the section's own
     price table (pet). `read(values)` turns the chosen values into the estimator's input. */
  var BUILDERS = {
    portraitDoll: {
      product: "Custom Portrait Crochet Doll",
      groups: [
        { name: "shadowbox", legend: "Display", type: "radio", options: [
          { value: "no", label: "Doll only", price: "$80", checked: true },
          { value: "yes", label: "Add a wooden shadowbox display case", price: "+$10" }
        ] }
      ],
      read: function (v) { return { shadowbox: v.shadowbox === "yes" }; },
      est: function (o) { return estPortraitDoll(o); }
    },
    pet: {
      product: "Custom Cat / Dog / Pet Crochet",
      table: true,   /* size × yarn come from the price table above (tap a price) */
      groups: [
        { name: "pets", legend: "How many pets", type: "radio", options: [
          { value: "1", label: "One pet", checked: true },
          { value: "2", label: "Two pets", note: "Second pet on the same order −$10" }
        ], note: "A second pet is priced at the same size and yarn — tell us when you order if they differ." }
      ],
      read: function (v) { return { size: v.size || "Classic", yarn: v.yarn || "Cotton", pets: Number(v.pets) }; },
      est: function (o) { return estPet(o); }
    },
    watercolor: {
      product: "Custom Digital Watercolor Painting",
      groups: [
        { name: "format", legend: "Format", type: "radio", options: [
          { value: "digital", label: "Digital file", price: "$10", checked: true },
          { value: "4x6", label: "Print 4×6", price: "$12" },
          { value: "5x7", label: "Print 5×7", price: "$15" },
          { value: "8x10", label: "Print 8×10", price: "$20" }
        ] },
        { name: "paper", legend: "Paper", type: "radio", printOnly: true, options: [
          { value: "fine", label: "Fine-art paper", checked: true },
          { value: "do", label: "Handmade Vietnamese Dó papyrus", price: "+$5" }
        ], detail: { src: "../assets/img/custom/do-paper-print-detail.webp", w: 560, h: 747, alt: "Watercolor cat print held up to the light on handmade Vietnamese Dó papyrus, showing the paper's fibers", caption: "Printed on handmade Vietnamese Dó papyrus" } },
        { name: "frame", legend: "Frame", type: "radio", printOnly: true, options: [
          { value: "no", label: "No frame", checked: true },
          { value: "yes", label: "Add a frame", priceBy: { "4x6": "+$8", "5x7": "+$16", "8x10": "+$24" } }
        ] },
        { name: "extras", legend: "Extras", type: "checkbox", options: [
          { value: "giftBox", label: "Gift box", price: "+$5", printOnly: true },
          { value: "rosary", label: "Crochet rosary add-on", price: "+$15" }
        ] }
      ],
      read: function (v) { var print = v.format !== "digital"; return { format: v.format, doPaper: print && v.paper === "do", frame: print && v.frame === "yes", giftBox: print && v.extras.indexOf("giftBox") > -1, rosary: v.extras.indexOf("rosary") > -1 }; },
      est: function (o) { return estWatercolor(o); }
    },
    housewarming: {
      product: "Housewarming & Closing Gift Box",
      groups: [
        { name: "addons", legend: "Add or swap, +$10 each", type: "checkbox", options: [
          { value: "succulent", label: "Small succulent or aloe vera", price: "+$10" },
          { value: "coldcut", label: "Cold cut box", price: "+$10" },
          { value: "berry", label: "3-berry fruit box", price: "+$10" }
        ] }
      ],
      read: function (v) { return { addons: v.extras.length }; },
      est: function (o) { return estHousewarming(o); }
    },
    calendar: {
      product: "Custom Watercolor Pet Calendar 2027",
      groups: [
        { name: "kind", legend: "Format", type: "radio", options: [
          { value: "print", label: "Design + print", checked: true },
          { value: "digital", label: "Digital files only" }
        ] },
        { name: "pages", legend: "Pages", type: "radio", options: [
          { value: "1", label: "1 page", priceBy: { print: "$20", digital: "$15" }, checked: true },
          { value: "6", label: "6 pages", priceBy: { print: "$50", digital: "$25" } }
        ] }
      ],
      read: function (v) { return { kind: v.kind, pages: Number(v.pages) }; },
      est: function (o) { return estCalendar(o); }
    }
  };

  /* ---------- render one builder ---------- */
  var builderCount = 0;

  function renderBuilder(host, key) {
    var def = BUILDERS[key];
    if (!def) return;
    var id = "b" + (++builderCount);
    var storeKey = "purrlight-custom-pick:" + key;
    var section = host.closest ? host.closest("section") : null;
    var form = el("form", { "class": "pick", "data-pick": key, "aria-labelledby": id + "-h", novalidate: "" });
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    form.appendChild(el("h3", { "class": "pick-title", id: id + "-h", text: "Build your piece" }));
    form.appendChild(el("p", { "class": "pick-hint", text: def.table
      ? "Tap a price in the table, then your options — the estimate updates as you go."
      : "Tap your options — the estimate updates as you go." }));

    /* pet: the price table IS the size × yarn picker (one radio group, arrow keys move) */
    var tableState = { size: "Classic", yarn: "Cotton" };
    var cells = [];
    var sizeLine = null;
    if (def.table && section) {
      var tds = section.querySelectorAll("[data-pet-table] td[data-size]");
      for (var c = 0; c < tds.length; c++) (function (td, idx) {
        var b = el("button", { type: "button", "class": "cell-btn", role: "radio", "aria-checked": "false", tabindex: "-1", text: td.textContent.trim() });
        b.setAttribute("aria-label", td.getAttribute("data-size") + " · " + td.getAttribute("data-yarn") + " " + td.textContent.trim());
        td.textContent = ""; td.appendChild(b);
        var choose = function () { tableState.size = td.getAttribute("data-size"); tableState.yarn = td.getAttribute("data-yarn"); update(); };
        b.addEventListener("click", choose);
        b.addEventListener("keydown", function (e) {
          var step = { ArrowRight: 1, ArrowDown: 3, ArrowLeft: -1, ArrowUp: -3 }[e.key];
          if (step === undefined) return;
          e.preventDefault();
          var next = cells[(idx + step + cells.length) % cells.length];
          next.btn.focus(); next.btn.click();
        });
        cells.push({ btn: b, size: td.getAttribute("data-size"), yarn: td.getAttribute("data-yarn") });
      })(tds[c], c);
      sizeLine = el("p", { "class": "pick-chosen" });
      form.appendChild(sizeLine);
    }

    def.groups.forEach(function (g) {
      var fs = el("fieldset", { "class": "pick-group", "data-group": g.name });
      if (g.printOnly) fs.setAttribute("data-print-only", "");
      fs.appendChild(el("legend", { text: g.legend }));
      var chips = el("div", { "class": "chips", role: g.type === "radio" ? "radiogroup" : "group" });
      g.options.forEach(function (o, oi) {
        var inputId = id + "-" + g.name + "-" + oi;
        var input = el("input", { type: g.type, name: g.name, value: o.value, id: inputId });
        if (o.checked) input.setAttribute("checked", "");   /* defaultChecked → form.reset() restores it */
        var lab = el("label", { "class": "chip", "for": inputId });
        if (o.printOnly) lab.setAttribute("data-print-only", "");
        lab.appendChild(input);
        lab.appendChild(el("span", { "class": "chip-text", text: o.label }));
        if (o.price) lab.appendChild(el("span", { "class": "chip-price", text: o.price }));
        if (o.priceBy) lab.appendChild(el("span", { "class": "chip-price", "data-price-by": JSON.stringify(o.priceBy) }));
        if (o.note) lab.appendChild(el("span", { "class": "chip-note", text: o.note }));
        chips.appendChild(lab);
      });
      fs.appendChild(chips);
      if (g.detail) {
        var fig = el("figure", { "class": "pick-detail", hidden: "" });
        fig.appendChild(el("img", { src: g.detail.src, width: String(g.detail.w), height: String(g.detail.h), alt: g.detail.alt, loading: "lazy", decoding: "async" }));
        fig.appendChild(el("figcaption", { text: g.detail.caption }));
        fs.appendChild(fig);
      }
      if (g.note) fs.appendChild(el("p", { "class": "group-note", text: g.note }));
      form.appendChild(fs);
    });

    /* summary ("now making") */
    var sum = el("div", { "class": "pick-summary", "aria-live": "polite", "aria-atomic": "true" });
    var lines = el("ul", { "class": "pick-lines" });
    var totalRow = el("p", { "class": "pick-total" });
    var noteRow = el("p", { "class": "pick-note" });
    sum.appendChild(lines); sum.appendChild(totalRow); sum.appendChild(noteRow);
    form.appendChild(sum);

    var actions = el("div", { "class": "pick-actions" });
    var copyBtn = el("button", { type: "button", "class": "link-btn pick-copy", text: "Copy my pick" });
    var resetBtn = el("button", { type: "button", "class": "link-btn pick-reset", text: "Start over" });
    actions.appendChild(copyBtn); actions.appendChild(resetBtn);
    form.appendChild(actions);
    var copied = el("p", { "class": "pick-copied", role: "status" });
    form.appendChild(copied);

    function values() {
      var v = { extras: [] };
      var inputs = form.querySelectorAll("input");
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.type === "radio") { if (inp.checked) v[inp.name] = inp.value; }
        else if (inp.type === "checkbox") { if (inp.checked && !inp.disabled) v.extras.push(inp.value); }
      }
      if (def.table) { v.size = tableState.size; v.yarn = tableState.yarn; }
      return v;
    }

    var current = null, currentText = "";
    function update(silent) {
      var v = values();
      var isDigital = v.format === "digital";
      /* print-only groups / chips (paper, frame, gift box) only apply to printed paintings */
      var printOnly = form.querySelectorAll("[data-print-only]");
      for (var i = 0; i < printOnly.length; i++) {
        var node = printOnly[i];
        if (node.tagName === "FIELDSET") node.disabled = isDigital;
        else { var inp = node.querySelector("input"); if (inp) { inp.disabled = isDigital; if (isDigital) inp.checked = false; } }
        node.classList.toggle("is-off", isDigital);
        if (node.tagName === "FIELDSET") node.setAttribute("aria-disabled", isDigital ? "true" : "false");   /* labels carry no role: the input's disabled state is enough */
      }
      v = values();   /* re-read: disabled extras drop out */
      /* browsers without :has(): mirror the checked state as a class */
      var cin = form.querySelectorAll(".chip input");
      for (var q = 0; q < cin.length; q++) cin[q].parentNode.classList.toggle("is-checked", cin[q].checked && !cin[q].disabled);
      /* price labels that follow another choice (frame by print size, calendar pages by format) */
      var dyn = form.querySelectorAll("[data-price-by]");
      for (var d = 0; d < dyn.length; d++) {
        var map = JSON.parse(dyn[d].getAttribute("data-price-by"));
        dyn[d].textContent = map[v.format] || map[v.kind] || "";
      }
      /* "now showing": the Dó paper photo appears when that paper is chosen */
      var details = form.querySelectorAll(".pick-detail");
      for (var f = 0; f < details.length; f++) details[f].hidden = !(v.paper === "do" && !isDigital);
      /* pet table highlight + chosen line */
      if (def.table) {
        for (var k = 0; k < cells.length; k++) {
          var on = cells[k].size === tableState.size && cells[k].yarn === tableState.yarn;
          cells[k].btn.setAttribute("aria-checked", on ? "true" : "false");
          cells[k].btn.setAttribute("tabindex", on ? "0" : "-1");   /* roving tabindex: one tab stop */
          cells[k].btn.classList.toggle("is-on", on);
        }
        if (sizeLine) sizeLine.textContent = "Chosen in the table: " + tableState.size + " · " + tableState.yarn;
      }
      var est = def.est(def.read(v));
      current = est;
      currentText = summaryLine(def.product, est);
      lines.innerHTML = "";
      est.lines.forEach(function (l) {
        var li = el("li");
        li.appendChild(el("span", { text: l.label }));
        li.appendChild(el("span", { "class": "amt", text: money(l.amount) }));
        lines.appendChild(li);
      });
      totalRow.innerHTML = "";
      totalRow.appendChild(el("span", { text: "Estimate" }));
      totalRow.appendChild(el("strong", { "class": "amt", text: money(est.total) }));
      noteRow.textContent = est.note || "";
      noteRow.hidden = !est.note;
      copied.textContent = "";
      store(storeKey, { v: v, t: tableState });
      if (!silent) {
        lastPick = { product: def.product, total: est.total, text: currentText };
        updateBar();
        applyOrderLinks();   /* carries the pick into the form when a prefill field is configured */
      }
    }
    form.addEventListener("change", function () { update(false); });
    form.addEventListener("focusin", function (e) { if (e.target && e.target.parentNode && e.target.parentNode.classList && e.target.parentNode.classList.contains("chip")) { try { e.target.parentNode.classList.toggle("is-focus", e.target.matches(":focus-visible")); } catch (err) { /* no :focus-visible */ } } });
    form.addEventListener("focusout", function (e) { if (e.target && e.target.parentNode && e.target.parentNode.classList) e.target.parentNode.classList.remove("is-focus"); });

    var copiedTimer = null;
    copyBtn.addEventListener("click", function () {
      copyText(currentText, function () {
        copied.textContent = "Copied — paste it into your order.";
        clearTimeout(copiedTimer); copiedTimer = setTimeout(function () { copied.textContent = ""; }, 4000);
      }, function () { copied.textContent = "Copy not available here — note your pick when you order: " + currentText; });
    });
    resetBtn.addEventListener("click", function () {
      form.reset(); tableState.size = "Classic"; tableState.yarn = "Cotton";
      store(storeKey, null); update(false);
    });

    /* remember the pick on this device (restoring is not a fresh pick — the bar waits for a real tap) */
    var saved = load(storeKey);
    if (saved && saved.v && typeof saved.v === "object") {
      var inputs = form.querySelectorAll("input");
      for (var s = 0; s < inputs.length; s++) {
        var inp2 = inputs[s];
        if (inp2.type === "radio") { if (Object.prototype.hasOwnProperty.call(saved.v, inp2.name)) inp2.checked = saved.v[inp2.name] === inp2.value; }
        else if (inp2.type === "checkbox") inp2.checked = Array.isArray(saved.v.extras) && saved.v.extras.indexOf(inp2.value) > -1;
      }
      if (saved.t && def.table && PRICES.pet.sizes.indexOf(saved.t.size) > -1 && PRICES.pet.yarns.indexOf(saved.t.yarn) > -1) tableState = { size: saved.t.size, yarn: saved.t.yarn };
    }

    host.appendChild(form);
    update(true);
  }

  var hosts = document.querySelectorAll("[data-builder]");
  for (var h = 0; h < hosts.length; h++) renderBuilder(hosts[h], hosts[h].getAttribute("data-builder"));

  /* ---------- sticky bar visibility + "where am I" label ---------- */
  var heroCta = document.querySelector(".hero-cta");
  var closing = document.querySelector(".closing");
  var products = document.querySelectorAll("section.product");
  var rail = document.querySelector(".rail");
  var railLinks = rail ? rail.querySelectorAll("a") : [];
  function markSection(sec) {
    var t = sec.querySelector(".product-title"), p = sec.querySelector(".price");
    sectionInView = (t ? t.textContent : "") + (p ? " · " + p.textContent : "");
    updateBar();
    for (var i = 0; i < railLinks.length; i++) {
      var on = railLinks[i].getAttribute("href") === "#" + sec.id;
      railLinks[i].classList.toggle("is-current", on);
      if (on) railLinks[i].setAttribute("aria-current", "true"); else railLinks[i].removeAttribute("aria-current");
    }
  }
  if ("IntersectionObserver" in window && heroCta && closing) {
    var pastHero = false, atClosing = false;
    var sync = function () { bar.hidden = !(pastHero && !atClosing); document.body.classList.toggle("has-bar", !bar.hidden); };
    new IntersectionObserver(function (es) { es.forEach(function (e) { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; }); sync(); }, { threshold: 0 }).observe(heroCta);
    new IntersectionObserver(function (es) { es.forEach(function (e) { atClosing = e.isIntersecting; }); sync(); }, { threshold: 0.4 }).observe(closing);
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) markSection(e.target); }); }, { threshold: 0.35 });
    for (var p = 0; p < products.length; p++) io.observe(products[p]);
  } else if (heroCta) {
    /* no IntersectionObserver: a plain scroll rule */
    var onScroll = function () { var show = window.scrollY > 480; bar.hidden = !show; document.body.classList.toggle("has-bar", show); };
    window.addEventListener("scroll", onScroll); onScroll();
  }
})();
