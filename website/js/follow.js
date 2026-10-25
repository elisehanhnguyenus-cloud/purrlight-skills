/* Purrlight Studio — "follow" photo strip above the footer (Mushie-style), on every customer page.
   Data: content/follow.json (heading, social profiles, 3–12 tiles). Elise edits it in the admin
   (website/admin/, Sveltia) or asks Claude; this file only reads it. No data → the strip stays hidden. */

(function () {
  "use strict";

  var box = document.querySelector("[data-follow]");
  if (!box || !window.fetch) return;

  /* paths in follow.json are relative to the site root ("assets/…"); the admin may store "/assets/…" —
     both resolve against this script's folder, so the strip works under /purrlight-skills/ and on a domain */
  var script = document.currentScript || document.querySelector('script[src$="js/follow.js"]');
  var base = (script && script.src || "").replace(/js\/follow\.js(\?.*)?$/, "");
  var asset = function (src) { return /^https:\/\//.test(src) ? src : base + String(src || "").replace(/^\/+/, ""); };
  var web = function (url) { return /^https:\/\/[^\s"'<>]+$/.test(url || "") ? url : ""; };

  var NETWORKS = {
    instagram: { name: "Instagram", cta: "Follow on Instagram" },
    tiktok: { name: "TikTok", cta: "Watch on TikTok" },
    pinterest: { name: "Pinterest", cta: "Pin Us on Pinterest" },
    facebook: { name: "Facebook", cta: "Find Us on Facebook" }
  };
  /* small line icons, drawn here so the strip needs no icon font or brand logo files */
  var ICONS = {
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.6 2.6 2.3 4 5 4.2"/>',
    pinterest: '<path d="M12 21l1.6-6.6"/><path d="M8.6 14.6A5.6 5.6 0 1 1 13.6 17c-1.4 0-2.4-.8-2.4-2.2"/>',
    facebook: '<path d="M14.5 8H13a1.5 1.5 0 0 0-1.5 1.5V21M9 13h5"/><circle cx="12" cy="12" r="9"/>'
  };
  var icon = function (net) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[net] || "") + "</svg>";
  };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  var render = function (d) {
    var profiles = d.profiles || {};
    var tiles = (d.tiles || []).filter(function (t) { return t && t.image; }).slice(0, 12);
    if (!tiles.length) return;

    var head = el("div", "wrap follow-head");
    var h2 = el("h2");
    h2.id = "follow-title";
    if (d.kicker) h2.appendChild(el("span", "kicker", d.kicker));
    h2.appendChild(document.createTextNode(d.title || "Purrlight, daily"));
    head.appendChild(h2);

    var grid = el("div", "follow-tiles");
    tiles.forEach(function (t) {
      var net = NETWORKS[t.network] ? t.network : "";
      var href = web(t.link) || web(profiles[net]);
      var tile = el(href ? "a" : "div", "follow-tile");
      var img = el("img");
      img.src = asset(t.image);
      img.alt = t.alt || "";
      img.width = 600; img.height = 600;
      img.loading = "lazy"; img.decoding = "async";
      tile.appendChild(img);
      if (href) {
        tile.href = href;
        tile.target = "_blank";
        tile.rel = "noopener";
        tile.setAttribute("aria-label", (t.alt ? t.alt + " — " : "") + "Purrlight on " + (net ? NETWORKS[net].name : "the web") + " (opens in a new tab)");
        var veil = el("span", "follow-veil");
        veil.innerHTML = icon(net);
        if (net) veil.appendChild(el("span", "", NETWORKS[net].name));
        tile.appendChild(veil);
      }
      /* photos from customers carry their credit, per house rule (Brand Canon v2) */
      if (t.credit) tile.appendChild(el("span", "follow-credit", "photo: " + t.credit));
      grid.appendChild(tile);
    });

    var links = el("div", "wrap social-follow follow-links");
    ["instagram", "tiktok", "pinterest", "facebook"].forEach(function (net) {
      var url = web(profiles[net]);
      if (!url) return;
      var a = el("a", "btn btn-ghost btn-small", NETWORKS[net].cta);
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    });

    box.textContent = "";
    box.appendChild(head);
    box.appendChild(grid);
    if (links.children.length) box.appendChild(links);
    box.hidden = false;
  };

  fetch(base + "content/follow.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { if (d) render(d); })
    .catch(function () { /* offline or file:// — the strip just stays hidden */ });
})();
