/* Shared behaviour: nav toggle, media rendering, publications rendering. No dependencies. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmt(d) { var p = d.split("-"); return MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0]; }
  function logoImg(m, cls) {
    return m.logo ? '<img class="' + (cls || 'logo') + '" src="assets/logos/' + esc(m.logo) + '.svg" alt="" loading="lazy" onerror="this.remove()">' : '';
  }
  function titleLink(m, cls) {
    return m.url ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(m.title) + '</a>' : '<span class="' + (cls || 'nolink') + '">' + esc(m.title) + '</span>';
  }
  function audioEl(m) { return m.audio ? '<audio controls preload="none" src="' + esc(m.audio) + '"></audio>' : ''; }
  function fmtShort(d) { var p = d.split("-"); return MONTHS[+p[1] - 1] + " " + p[0]; }

  /* Nav */
  var toggle = $(".nav-toggle"), nav = $(".nav");
  if (toggle && nav) toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", open);
  });

  var media = (window.MEDIA || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var TL = window.TOPIC_LABELS || {}, TY = window.TYPE_LABELS || {};

  /* Wire strip: latest 6 */
  var wire = $("#wire-list");
  if (wire) wire.innerHTML = media.slice(0, 6).map(function (m) {
    return '<li><b>' + esc(m.outlet) + '</b>' + titleLink(m, 'plain') + ' <span class="muted">' + fmtShort(m.date) + '</span></li>';
  }).join("");

  /* Featured cards */
  function card(m) {
    return '<article class="card">' +
      '<div class="outlet">' + (m.logo ? logoImg(m, 'logo card-logo') : '<span class="outlet-name">' + esc(m.outlet) + '</span>') + '</div>' +
      '<div class="title">' + titleLink(m) + '</div>' +
      (m.quote ? '<p class="quote">“' + esc(m.quote) + '”</p>' : '') + audioEl(m) +
      '<div class="meta">' + fmt(m.date) + ' · ' + esc(TY[m.type] || m.type) + '</div></article>';
  }
  var feat = $("#featured");
  if (feat) {
    var n = +feat.getAttribute("data-count") || 6;
    feat.innerHTML = media.filter(function (m) { return m.featured; }).slice(0, n).map(card).join("");
  }

  /* Outlet wall */
  var wall = $("#outlets");
  if (wall) {
    var lim = +wall.getAttribute("data-count") || 24, seenLogo = {};
    var picks = (window.OUTLETS || []).filter(function (o) { if (!o.logo || seenLogo[o.logo]) return false; seenLogo[o.logo] = 1; return true; }).slice(0, lim);
    wall.innerHTML = picks.map(function (o) {
      return '<li title="' + esc(o.name) + ' · ' + o.n + '"><img src="assets/logos/' + esc(o.logo) + '.svg" alt="' + esc(o.name) + '" loading="lazy"></li>';
    }).join("");
  }

  /* Stats */
  var stats = $("#stats");
  if (stats) {
    var years = media.map(function (m) { return +m.date.slice(0, 4); });
    var outlets = {}; media.forEach(function (m) { outlets[m.outlet] = 1; });
    var since = Math.min.apply(null, years);
    var last12 = media.filter(function (m) { return m.date >= isoMinus(365); }).length;
    stats.innerHTML =
      '<div class="stat"><b>' + media.length + '+</b><span>appearances since ' + since + '</span></div>' +
      '<div class="stat"><b>' + last12 + '</b><span>in the past twelve months</span></div>' +
      '<div class="stat"><b>' + Object.keys(outlets).length + '</b><span>outlets, local to international</span></div>' +
      '<div class="stat"><b>' + Object.keys(countBy(media, "topic")).length + '</b><span>topics, from tariffs to the Fed</span></div>';
  }
  function isoMinus(days) { var d = new Date(); d.setDate(d.getDate() - days); return d.toISOString().slice(0, 10); }
  function countBy(arr, k) { var o = {}; arr.forEach(function (x) { o[x[k]] = (o[x[k]] || 0) + 1; }); return o; }

  /* Full archive with filters */
  var list = $("#archive");
  if (list) {
    var state = { topic: "all", type: "all", q: "" };
    function row(m) {
      return '<li class="row" data-topic="' + esc(m.topic) + '" data-type="' + esc(m.type) + '" data-text="' + esc((m.outlet + " " + m.title + " " + (m.quote || "")).toLowerCase()) + '">' +
        '<div class="d">' + fmt(m.date) + '</div>' +
        '<div><div class="o">' + esc(m.outlet) + (m.program && m.program !== m.outlet ? ' <span class="muted">· ' + esc(m.program) + '</span>' : '') + '</div><div class="t">' + titleLink(m) + '</div>' +
        (m.quote ? '<div class="q">“' + esc(m.quote) + '”</div>' : '') + audioEl(m) + '</div>' +
        '<div class="k">' + esc(TY[m.type] || m.type) + '<br>' + esc(TL[m.topic] || m.topic) + '</div></li>';
    }
    list.innerHTML = media.map(row).join("");
    var rows = list.querySelectorAll(".row"), empty = $("#empty");
    function apply() {
      var shown = 0;
      Array.prototype.forEach.call(rows, function (r) {
        var ok = (state.topic === "all" || r.dataset.topic === state.topic) &&
                 (state.type === "all" || r.dataset.type === state.type) &&
                 (!state.q || r.dataset.text.indexOf(state.q) > -1);
        r.classList.toggle("hidden", !ok); if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      var cnt = $("#count"); if (cnt) cnt.textContent = shown + " of " + rows.length;
    }
    function chips(container, key, labels, counts) {
      if (!container) return;
      var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
      container.innerHTML = '<button class="chip" aria-pressed="true" data-v="all">All</button>' +
        keys.map(function (k) { return '<button class="chip" aria-pressed="false" data-v="' + esc(k) + '">' + esc(labels[k] || k) + ' <span class="muted">' + counts[k] + '</span></button>'; }).join("");
      container.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        Array.prototype.forEach.call(container.querySelectorAll(".chip"), function (c) { c.setAttribute("aria-pressed", c === b); });
        state[key] = b.dataset.v; apply();
      });
    }
    chips($("#topic-chips"), "topic", TL, countBy(media, "topic"));
    chips($("#type-chips"), "type", TY, countBy(media, "type"));
    var search = $("#search");
    if (search) search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); apply(); });
    apply();
  }

  /* Publications */
  var pubs = $("#pubs");
  if (pubs && window.PUBS) {
    var KL = window.KIND_LABELS, order = ["book", "article", "chapter", "working", "progress"];
    var sel = pubs.getAttribute("data-selected") === "true";
    var items = window.PUBS.filter(function (p) { return !sel || p.selected; });
    if (sel) {
      pubs.innerHTML = items.sort(function (a, b) { return b.year - a.year; }).map(pub).join("");
    } else {
      pubs.innerHTML = order.map(function (k) {
        var g = items.filter(function (p) { return p.kind === k; }).sort(function (a, b) { return b.year - a.year; });
        return g.length ? '<section class="pubgroup"><h2>' + KL[k] + '</h2>' + g.map(pub).join("") + '</section>' : '';
      }).join("");
    }
    function pub(p) {
      return '<div class="pub"><div class="y">' + p.year + '</div><div>' +
        '<div class="t">' + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : esc(p.title)) + (p.authors ? ' <span class="muted">(' + esc(p.authors) + ')</span>' : '') + '</div>' +
        '<div class="v">' + esc(p.venue) + '</div>' + (p.note ? '<div class="n">' + esc(p.note) + '</div>' : '') + '</div></div>';
    }
  }
})();
