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

  /* Format: every medium gets the same treatment, one verb and one icon */
  var VERB = { tv: "Watch", radio: "Listen", podcast: "Listen", print: "Read", online: "Read" };
  var ICON = {
    Watch: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>',
    Listen: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    Read: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3.5h10M3 6.5h10M3 9.5h10M3 12.5h6" stroke="currentColor" stroke-width="1.4"/></svg>'
  };
  function verb(m) { return VERB[m.type] || "Read"; }
  function fmtTag(m) { var v = verb(m); return '<span class="fmt">' + ICON[v] + v + '</span>'; }
  function byline(m) { return esc(m.outlet) + ' · ' + fmtShort(m.date); }
  var strong = media.filter(function (m) { return !m.weak; });
  var wallRank = {}; (window.OUTLETS || []).forEach(function (o, i) { wallRank[o.name] = i; });

  /* Issue tiles (home page): latest headline per issue and the outlets that covered it */
  var tiles = $("#issue-tiles");
  if (tiles) {
    var t = Object.keys(TL).map(function (k) {
      var xs = media.filter(function (m) { return m.topic === k; });
      var lead = xs.filter(function (m) { return !m.weak; })[0] || xs[0];
      var outs = [], seen = {};
      xs.forEach(function (m) { if (!seen[m.outlet]) { seen[m.outlet] = 1; outs.push(m.outlet); } });
      outs.sort(function (a, b) { return (wallRank[a] || 999) - (wallRank[b] || 999); });
      return { k: k, lead: lead, outs: outs.slice(0, 4) };
    }).filter(function (x) { return x.lead; });
    t.sort(function (a, b) { return a.lead.date < b.lead.date ? 1 : -1; });
    tiles.innerHTML = t.map(function (x) {
      return '<a class="tile" href="media.html#' + x.k + '">' +
        '<span class="name">' + esc(TL[x.k]) + '</span>' +
        '<span class="when">Latest · ' + fmtShort(x.lead.date) + '</span>' +
        '<span class="head">' + esc(x.lead.title) + '</span>' +
        '<span class="outs">' + x.outs.map(esc).join(' · ') + '</span></a>';
    }).join("");
  }

  /* In the news (media page): issue filter, lead, also-recent, card grid, archive */
  var news = $("#news");
  if (news) {
    var st = { issue: "all", va: false, q: "", shown: 12 };
    function fromHash() {
      st.issue = "all"; st.va = false;
      location.hash.replace(/^#/, "").split("&").forEach(function (h) {
        if (TL[h]) st.issue = h; if (h === "virginia") st.va = true;
      });
    }
    fromHash();
    window.addEventListener("hashchange", function () { fromHash(); st.shown = 12; render(); });
    var upd = $("#updated"); if (upd && media.length) upd.textContent = "Updated " + fmtShort(media[0].date);
    var bar = $("#issue-chips");
    bar.innerHTML = '<button class="chip" data-v="all">All issues</button>' +
      Object.keys(TL).map(function (k) { return '<button class="chip" data-v="' + k + '">' + esc(TL[k]) + '</button>'; }).join("") +
      '<span class="sep" aria-hidden="true"></span><button class="chip place" data-va="1">Virginia</button>';
    bar.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      if (b.dataset.va) st.va = !st.va; else st.issue = b.dataset.v;
      st.shown = 12; render(true);
    });
    var more = $("#more");
    if (more) more.addEventListener("click", function () { st.shown += 12; render(); });

    var list = $("#archive");
    list.innerHTML = media.map(function (m) {
      return '<li class="row" data-topic="' + esc(m.topic) + '" data-va="' + (m.va ? 1 : 0) + '" data-text="' + esc((m.outlet + " " + (m.program || "") + " " + m.title + " " + (m.quote || "")).toLowerCase()) + '">' +
        '<div class="d">' + fmt(m.date) + '</div>' +
        '<div><div class="o">' + esc(m.outlet) + (m.program && m.program !== m.outlet && m.program !== m.title ? ' <span class="muted">· ' + esc(m.program) + '</span>' : '') + '</div><div class="t">' + titleLink(m) + '</div>' +
        (m.quote ? '<div class="q">“' + esc(m.quote) + '”</div>' : '') + audioEl(m) + '</div>' +
        '<div class="k">' + fmtTag(m) + '<br>' + esc(TL[m.topic] || m.topic) + '</div></li>';
    }).join("");
    var rows = list.querySelectorAll(".row");
    var search = $("#search");
    if (search) search.addEventListener("input", function () { st.q = search.value.trim().toLowerCase(); render(); });

    function keep(m) { return (st.issue === "all" || m.topic === st.issue) && (!st.va || m.va); }
    function card(m) {
      return '<article class="ncard">' + fmtTag(m) + '<div class="t">' + titleLink(m) + '</div>' +
        (m.quote ? '<p class="q">“' + esc(m.quote) + '”</p>' : '') + audioEl(m) +
        '<div class="meta">' + byline(m) + '</div></article>';
    }
    function render(fromChip) {
      Array.prototype.forEach.call(bar.querySelectorAll(".chip"), function (c) {
        c.setAttribute("aria-pressed", c.dataset.va ? st.va : c.dataset.v === st.issue);
      });
      var xs = strong.filter(keep), lead = xs[0], also = xs.slice(1, 5), grid = xs.slice(5, 5 + st.shown);
      $("#lead").innerHTML = lead ?
        '<article class="lead-item"><div class="kicker">' + esc(TL[lead.topic] || "") + (lead.va ? ' · Virginia' : '') + '</div>' +
        '<h2 class="lead-title">' + titleLink(lead) + '</h2>' +
        (lead.quote ? '<p class="q">“' + esc(lead.quote) + '”</p>' : '') + audioEl(lead) +
        '<div class="meta">' + fmtTag(lead) + '<span>' + byline(lead) + '</span></div></article>' +
        (also.length ? '<aside class="also" aria-label="Also recent"><h3>Also recent</h3><ol>' + also.map(function (m) {
          return '<li>' + fmtTag(m) + '<span class="t">' + titleLink(m) + '</span><span class="meta">' + byline(m) + '</span></li>';
        }).join("") + '</ol></aside>' : '') :
        '<p class="empty">Nothing on that combination yet. Try another issue.</p>';
      $("#news-grid").innerHTML = grid.map(card).join("");
      $("#news-grid").hidden = !grid.length;
      if (more) more.hidden = xs.length <= 5 + st.shown;
      var shown = 0;
      Array.prototype.forEach.call(rows, function (r) {
        var ok = (st.issue === "all" || r.dataset.topic === st.issue) && (!st.va || r.dataset.va === "1") &&
                 (!st.q || r.dataset.text.indexOf(st.q) > -1);
        r.classList.toggle("hidden", !ok); if (ok) shown++;
      });
      $("#empty").hidden = shown > 0;
      $("#count").textContent = shown + " of " + rows.length;
      var label = (st.issue === "all" ? "" : TL[st.issue]) + (st.va ? (st.issue === "all" ? "" : ", ") + "Virginia" : "");
      $("#archive-scope").textContent = label ? "Showing: " + label : "";
      if (fromChip && history.replaceState) {
        var h = [st.issue === "all" ? "" : st.issue, st.va ? "virginia" : ""].filter(Boolean).join("&");
        history.replaceState(null, "", h ? "#" + h : location.pathname);
      }
    }
    render();
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
