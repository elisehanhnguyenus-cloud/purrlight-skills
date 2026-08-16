/* Purrlight Studio — shared behavior: nav, rendering, filters, product page */

(function () {
  "use strict";

  var fmt = function (n) { return "$" + n.toFixed(2).replace(/\.00$/, ""); };

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var close = document.querySelector(".nav-close");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    });
    var shut = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    if (close) close.addEventListener("click", shut);
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") shut();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") shut();
    });
  }

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- product card builder ---------- */
  function buyHref(p) { return p.etsyUrl || ETSY_SHOP_URL; }

  function cardHTML(p) {
    var badge = "";
    if (p.badge === "made-to-order") badge = '<span class="badge made-to-order">Made to order</span>';
    if (p.badge === "new") badge = '<span class="badge new">New</span>';
    return (
      '<a class="product-card reveal" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
      badge +
      '<div class="card-media"><img src="' + p.img + '" alt="" loading="lazy" width="600" height="600"></div>' +
      '<div class="card-body">' +
      '<p class="card-cat">' + p.category + "</p>" +
      "<h3>" + p.name + "</h3>" +
      '<p class="price">' + fmt(p.price) + "</p>" +
      "</div></a>"
    );
  }

  function renderGrid(el, items) {
    el.innerHTML = items.map(cardHTML).join("");
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); }
        });
      }, { threshold: 0.08 });
      el.querySelectorAll(".reveal").forEach(function (c) { io2.observe(c); });
    } else {
      el.querySelectorAll(".reveal").forEach(function (c) { c.classList.add("in"); });
    }
  }

  /* ---------- homepage: favorites ---------- */
  var favGrid = document.querySelector("[data-favorites]");
  if (favGrid && typeof PRODUCTS !== "undefined") {
    var favIds = ["baptism-set", "mini-doll-keychain", "storybook-doll", "crochet-cat"];
    renderGrid(favGrid, favIds.map(function (id) {
      return PRODUCTS.find(function (p) { return p.id === id; });
    }).filter(Boolean));
  }

  /* ---------- homepage: category tiles ---------- */
  var catGrid = document.querySelector("[data-categories]");
  if (catGrid && typeof CATEGORIES !== "undefined") {
    catGrid.innerHTML = CATEGORIES.map(function (c) {
      return (
        '<a class="cat-tile reveal" href="shop.html?cat=' + encodeURIComponent(c.name) + '">' +
        '<span class="cat-art"><img src="' + c.img + '" alt="" width="400" height="400"></span>' +
        "<span>" + c.name + "</span></a>"
      );
    }).join("");
    catGrid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- shop page ---------- */
  var shopGrid = document.querySelector("[data-shop-grid]");
  if (shopGrid && typeof PRODUCTS !== "undefined") {
    var bar = document.querySelector("[data-filter-bar]");
    var count = document.querySelector("[data-shop-count]");
    var cats = ["All"].concat(CATEGORIES.map(function (c) { return c.name; }));
    var params = new URLSearchParams(location.search);
    var active = params.get("cat") || "All";
    if (cats.indexOf(active) === -1) active = "All";

    function apply(cat) {
      active = cat;
      var items = cat === "All" ? PRODUCTS : PRODUCTS.filter(function (p) { return p.category === cat; });
      renderGrid(shopGrid, items);
      if (count) {
        count.textContent = items.length + (items.length === 1 ? " piece" : " pieces") +
          (cat === "All" ? ", all made in small batches" : " in " + cat);
      }
      bar.querySelectorAll(".filter-chip").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.cat === cat ? "true" : "false");
      });
      try {
        var url = new URL(location.href);
        if (cat === "All") url.searchParams.delete("cat");
        else url.searchParams.set("cat", cat);
        history.replaceState(null, "", url);
      } catch (err) { /* sandboxed contexts may refuse URL rewrites — filtering still works */ }
    }

    bar.innerHTML = cats.map(function (c) {
      return '<button class="filter-chip" data-cat="' + c + '" aria-pressed="false">' + c + "</button>";
    }).join("");
    bar.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (chip) apply(chip.dataset.cat);
    });
    apply(active);
  }

  /* ---------- product detail page ---------- */
  var pdp = document.querySelector("[data-pdp]");
  if (pdp && typeof PRODUCTS !== "undefined") {
    var id = new URLSearchParams(location.search).get("id");
    var p = PRODUCTS.find(function (x) { return x.id === id; }) || PRODUCTS[0];

    document.title = p.name + " — Purrlight Studio";
    var set = function (sel, val, attr) {
      var el = pdp.querySelector(sel);
      if (!el) return;
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    };
    set("[data-pdp-crumb]", p.name);
    set("[data-pdp-cat]", p.category);
    set("[data-pdp-name]", p.name);
    set("[data-pdp-price]", fmt(p.price));
    set("[data-pdp-desc]", p.desc);
    var img = pdp.querySelector("[data-pdp-img]");
    if (img) { img.src = p.img; img.alt = p.name; }
    var buy = pdp.querySelector("[data-pdp-buy]");
    if (buy) buy.href = buyHref(p);
    /* bundle addons — "make it a set" */
    var addonWrap = pdp.querySelector("[data-pdp-addons]");
    if (addonWrap && p.addons && p.addons.length) {
      var sel = addonWrap.querySelector("select");
      sel.innerHTML = p.addons.map(function (a, i) {
        var tag = a.delta ? " (+" + fmt(a.delta) + ")" : "";
        return '<option value="' + i + '">' + a.label + tag + "</option>";
      }).join("");
      addonWrap.hidden = false;
      sel.addEventListener("change", function () {
        var a = p.addons[Number(sel.value)] || p.addons[0];
        set("[data-pdp-price]", fmt(p.price + a.delta));
      });
    }

    var detailList = pdp.querySelector("[data-pdp-details]");
    if (detailList) {
      detailList.innerHTML = p.details.map(function (d) { return "<li>" + d + "</li>"; }).join("");
    }

    /* related: same category first, then others */
    var relGrid = document.querySelector("[data-related]");
    if (relGrid) {
      var rel = PRODUCTS.filter(function (x) { return x.id !== p.id && x.category === p.category; });
      PRODUCTS.forEach(function (x) {
        if (rel.length < 4 && x.id !== p.id && rel.indexOf(x) === -1) rel.push(x);
      });
      renderGrid(relGrid, rel.slice(0, 4));
    }
  }

  /* ---------- etsy links ---------- */
  document.querySelectorAll("[data-etsy]").forEach(function (el) {
    el.href = ETSY_SHOP_URL;
  });

  /* ---------- newsletter (no backend yet — honest placeholder) ---------- */
  var form = document.querySelector("[data-newsletter]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.parentElement.querySelector(".newsletter-msg");
      /* TODO: connect to Klaviyo/Mailchimp form action, then remove this stub */
      if (msg) msg.textContent = "Our newsletter is almost ready — for now, favorite our Etsy shop to follow along ✨";
    });
  }

  /* ---------- footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
