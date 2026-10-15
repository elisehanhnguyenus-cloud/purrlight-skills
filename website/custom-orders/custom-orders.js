/* ============================================================
   Purrlight Custom Orders — page behavior
   - every "Place your order" link → ORDER_FORM_URL (prices.js), utm passed through
   - inline estimators ("Build your piece"): chips → live estimate from prices.js
   - sticky order bar on phones
   No framework, ES5, works without JS (copy + prices are plain HTML).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- order link: one constant + utm passthrough (brief §5) ---------- */
  function orderUrl(extra) {
    var url = ORDER_FORM_URL;
    var qs = [];
    try {
      var params = new URLSearchParams(location.search);
      params.forEach(function (v, k) { if (/^utm_/i.test(k)) qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(v)); });
    } catch (e) { /* old browsers: plain link */ }
    if (extra) qs.push(extra);
    if (qs.length) url += (url.indexOf("?") > -1 ? "&" : "?") + qs.join("&");
    return url;
  }
  function applyOrderLinks() {
    var href = orderUrl();
    var els = document.querySelectorAll("[data-order]");
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute("href", href);
      els[i].setAttribute("target", "_blank");
      els[i].setAttribute("rel", "noopener");
    }
  }
  applyOrderLinks();

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (children) for (var i = 0; i < children.length; i++) if (children[i]) n.appendChild(children[i]);
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- builder definitions ----------
     Each option group renders as chips (native radio/checkbox inside a label).
     `read(form)` turns the chosen values into the estimator's input. */
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
      groups: [
        { name: "size", legend: "Size", type: "radio", options: [
          { value: "Petite", label: "Petite", note: "12–20 cm · 5–8 in" },
          { value: "Classic", label: "Classic", note: "20–30 cm · most chosen", checked: true },
          { value: "Grand", label: "Grand", note: "30 cm & up · 12 in +" }
        ] },
        { name: "yarn", legend: "Yarn", type: "radio", options: [
          { value: "Cotton", label: "Cotton", checked: true },
          { value: "Velvet", label: "Velvet" },
          { value: "Fluffy", label: "Fluffy" }
        ] },
        { name: "pets", legend: "How many pets", type: "radio", options: [
          { value: "1", label: "One pet", checked: true },
          { value: "2", label: "Two pets", note: "second pet on the same order −$10" }
        ] }
      ],
      read: function (v) { return { size: v.size, yarn: v.yarn, pets: Number(v.pets) }; },
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
          { value: "fine", label: "Fine-art paper", price: "included", checked: true },
          { value: "do", label: "Handmade Vietnamese Dó papyrus", price: "+$5" }
        ] },
        { name: "frame", legend: "Frame", type: "radio", printOnly: true, options: [
          { value: "no", label: "No frame", checked: true },
          { value: "yes", label: "Add a frame", priceBy: { "4x6": "+$8", "5x7": "+$16", "8x10": "+$24" } }
        ] },
        { name: "extras", legend: "Extras", type: "checkbox", options: [
          { value: "giftBox", label: "Gift box", price: "+$5" },
          { value: "rosary", label: "Crochet rosary add-on", price: "+$15" }
        ] },
        { name: "qty", legend: "How many paintings", type: "qty", min: 1, max: 20, note: "5% off from the 2nd painting · 10% off from the 5th" }
      ],
      read: function (v) { return { format: v.format, doPaper: v.paper === "do", frame: v.frame === "yes", giftBox: v.extras.indexOf("giftBox") > -1, rosary: v.extras.indexOf("rosary") > -1, qty: Number(v.qty) }; },
      est: function (o) { return estWatercolor(o); }
    },
    housewarming: {
      product: "Housewarming & Closing Gift Box",
      groups: [
        { name: "addons", legend: "Add or swap, +$10 each", type: "radio", options: [
          { value: "0", label: "Basic set", price: "$50", checked: true },
          { value: "1", label: "+ 1 item", price: "+$10" },
          { value: "2", label: "+ 2 items", price: "+$20" },
          { value: "3", label: "+ 3 items", price: "+$30" }
        ], note: "small succulent or aloe vera · cold cut box · 3-berry fruit box" },
        { name: "qty", legend: "How many boxes", type: "qty", min: 1, max: 20, note: "5% off from the 2nd box · 10% off from the 5th" }
      ],
      read: function (v) { return { addons: Number(v.addons), qty: Number(v.qty) }; },
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

  /* ---------- sticky order bar (phones) — created first so builders can update it ---------- */
  var lastPick = null;
  var bar = el("div", { "class": "order-bar", hidden: "" });
  var barText = el("span", { "class": "order-bar-text", text: "Free U.S. shipping on every custom order" });
  var barBtn = el("a", { "class": "btn btn-primary btn-small", "data-order": "", href: orderUrl(), target: "_blank", rel: "noopener", text: "Place your order" });
  bar.appendChild(barText); bar.appendChild(barBtn);
  document.body.appendChild(bar);
  function updateBar() {
    if (lastPick) barText.textContent = lastPick.product + " · estimate " + money(lastPick.total);
  }

  /* ---------- render one builder ---------- */
  var builderCount = 0;

  function renderBuilder(host, key) {
    var def = BUILDERS[key];
    if (!def) return;
    var id = "b" + (++builderCount);
    var form = el("form", { "class": "pick", "data-pick": key, "aria-labelledby": id + "-h", novalidate: "" });
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    form.appendChild(el("h3", { "class": "pick-title", id: id + "-h", text: "Build your piece" }));
    form.appendChild(el("p", { "class": "pick-hint", text: "Tap your options to see the price — then place your order and tell us the same in the form." }));

    def.groups.forEach(function (g, gi) {
      var fs = el("fieldset", { "class": "pick-group", "data-group": g.name });
      if (g.printOnly) fs.setAttribute("data-print-only", "");
      fs.appendChild(el("legend", { text: g.legend }));
      if (g.type === "qty") {
        var row = el("div", { "class": "qty-row" });
        var dec = el("button", { type: "button", "class": "qty-btn", "aria-label": "Fewer", text: "−" });
        var inp = el("input", { type: "number", name: g.name, min: String(g.min), max: String(g.max), value: "1", inputmode: "numeric", "aria-label": g.legend });
        var inc = el("button", { type: "button", "class": "qty-btn", "aria-label": "More", text: "+" });
        dec.addEventListener("click", function () { inp.value = Math.max(g.min, Number(inp.value || 1) - 1); update(); });
        inc.addEventListener("click", function () { inp.value = Math.min(g.max, Number(inp.value || 1) + 1); update(); });
        row.appendChild(dec); row.appendChild(inp); row.appendChild(inc);
        fs.appendChild(row);
      } else {
        var chips = el("div", { "class": "chips", role: g.type === "radio" ? "radiogroup" : "group" });
        g.options.forEach(function (o, oi) {
          var inputId = id + "-" + g.name + "-" + oi;
          var input = el("input", { type: g.type, name: g.name, value: o.value, id: inputId });
          if (o.checked) input.checked = true;
          var lab = el("label", { "class": "chip", "for": inputId });
          var txt = el("span", { "class": "chip-text", text: o.label });
          lab.appendChild(input);
          lab.appendChild(txt);
          if (o.price) lab.appendChild(el("span", { "class": "chip-price", text: o.price }));
          if (o.priceBy) lab.appendChild(el("span", { "class": "chip-price", "data-price-by": JSON.stringify(o.priceBy) }));
          if (o.note) lab.appendChild(el("span", { "class": "chip-note", text: o.note }));
          chips.appendChild(lab);
        });
        fs.appendChild(chips);
      }
      if (g.note) fs.appendChild(el("p", { "class": "group-note", text: g.note }));
      form.appendChild(fs);
    });

    /* summary */
    var sum = el("div", { "class": "pick-summary", "aria-live": "polite" });
    var lines = el("ul", { "class": "pick-lines" });
    var totalRow = el("p", { "class": "pick-total" });
    var noteRow = el("p", { "class": "pick-note" });
    sum.appendChild(lines); sum.appendChild(totalRow); sum.appendChild(noteRow);
    form.appendChild(sum);

    var actions = el("div", { "class": "pick-actions" });
    var orderBtn = el("a", { "class": "btn btn-primary", "data-order": "", href: "#", text: "Place your order" });
    var copyBtn = el("button", { type: "button", "class": "btn btn-ghost", text: "Copy my pick" });
    var resetBtn = el("button", { type: "button", "class": "link-btn", text: "Start over" });
    actions.appendChild(orderBtn); actions.appendChild(copyBtn); actions.appendChild(resetBtn);
    form.appendChild(actions);
    var copied = el("p", { "class": "pick-copied", role: "status" });
    form.appendChild(copied);

    function values() {
      var v = { extras: [] };
      var inputs = form.querySelectorAll("input");
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.type === "radio") { if (inp.checked) v[inp.name] = inp.value; }
        else if (inp.type === "checkbox") { if (inp.checked) v.extras.push(inp.value); }
        else v[inp.name] = inp.value;
      }
      return v;
    }

    var current = null;
    function update() {
      var v = values();
      /* print-only groups (paper, frame) only apply to printed paintings */
      var printOnly = form.querySelectorAll("[data-print-only]");
      for (var i = 0; i < printOnly.length; i++) {
        var off = v.format === "digital";
        printOnly[i].disabled = off;
        printOnly[i].classList.toggle("is-off", off);
      }
      /* price labels that depend on another choice */
      var dyn = form.querySelectorAll("[data-price-by]");
      for (var d = 0; d < dyn.length; d++) {
        var map = JSON.parse(dyn[d].getAttribute("data-price-by"));
        dyn[d].textContent = map[v.format] || map[v.kind] || "";
      }
      var est = def.est(def.read(v));
      current = est;
      lines.innerHTML = "";
      est.lines.forEach(function (l) {
        var li = el("li");
        li.appendChild(el("span", { text: l.label }));
        li.appendChild(el("span", { "class": "amt", text: money(l.amount) }));
        lines.appendChild(li);
      });
      totalRow.innerHTML = '<span>Estimate</span><strong class="amt">' + esc(money(est.total)) + '</strong><span class="deposit">50% deposit ' + esc(money(est.deposit)) + "</span>";
      noteRow.textContent = est.note || "";
      noteRow.hidden = !est.note;
      lastPick = { product: def.product, total: est.total };
      updateBar();
      copied.textContent = "";
    }
    form.addEventListener("change", update);
    form.addEventListener("input", function (e) { if (e.target && e.target.type === "number") update(); });

    copyBtn.addEventListener("click", function () {
      var text = summaryLine(def.product, current);
      var done = function () { copied.textContent = "Copied — paste it into the order form."; };
      var fail = function () { copied.textContent = text; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    });
    resetBtn.addEventListener("click", function () { form.reset(); update(); });

    host.appendChild(form);
    update();
  }

  var hosts = document.querySelectorAll("[data-builder]");
  for (var h = 0; h < hosts.length; h++) renderBuilder(hosts[h], hosts[h].getAttribute("data-builder"));
  applyOrderLinks();   /* builders added new order buttons */

  /* ---------- sticky bar visibility: after the hero CTA scrolls away, until the closing CTA ---------- */
  var heroCta = document.querySelector(".hero-cta");
  var closing = document.querySelector(".closing");
  if ("IntersectionObserver" in window && heroCta && closing) {
    var pastHero = false, atClosing = false;
    var sync = function () { bar.hidden = !(pastHero && !atClosing); document.body.classList.toggle("has-bar", !bar.hidden); };
    new IntersectionObserver(function (es) { es.forEach(function (e) { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; }); sync(); }, { threshold: 0 }).observe(heroCta);
    new IntersectionObserver(function (es) { es.forEach(function (e) { atClosing = e.isIntersecting; }); sync(); }, { threshold: 0.2 }).observe(closing);
  }
})();
