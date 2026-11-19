/* Shared behaviour: nav toggle, home-page media widgets, the media page (filter, year toggles,
   lightbox) and publications. No dependencies. The media page is server-rendered by
   tools/build_media.py and works without this script; here we only add filtering and the lightbox. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function fmtShort(d) { var p = d.split("-"); return MONTHS[+p[1] - 1] + " " + p[0]; }
  var NEWTAB = '<span class="sr-only"> (opens in a new tab)</span>';
  function titleLink(m, cls) {
    return m.url ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(m.title) + NEWTAB + '</a>' : '<span class="' + (cls || 'nolink') + '">' + esc(m.title) + '</span>';
  }
  /* Static links that open a new tab say so to screen readers. The television tiles are also
     target=_blank (so they work without JS) but this script repurposes them to open the lightbox,
     so they are left out of this pass. */
  Array.prototype.forEach.call(document.querySelectorAll('a[target="_blank"]:not(.tv-link)'), function (a) { if (!a.querySelector(".sr-only")) a.insertAdjacentHTML("beforeend", NEWTAB); });

  /* A third-party player (youtube-nocookie / Vimeo dnt) or a direct video, built only on a click. */
  function makeVideo(v) {
    var el;
    if (v.src) { el = document.createElement("video"); el.controls = true; el.autoplay = true; el.src = v.src; }
    else {
      el = document.createElement("iframe");
      el.src = v.yt ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.yt) + "?autoplay=1&rel=0" + (v.start ? "&start=" + v.start : "")
                    : "https://player.vimeo.com/video/" + encodeURIComponent(v.vimeo) + "?autoplay=1&dnt=1";
      el.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; el.allowFullscreen = true; el.title = "Video player";
    }
    return el;
  }

  /* Nav */
  var toggle = $(".nav-toggle"), nav = $(".nav");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open);
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    };
    toggle.addEventListener("click", function () { setNav(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !e.target.closest(".site-head")) setNav(false);
    });
  }

  var media = (window.MEDIA || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var TL = window.TOPIC_LABELS || {}, TY = window.TYPE_LABELS || {};

  /* Home: latest-three wire strip (wraps; no hidden horizontal scroll) */
  var wire = $("#wire-list");
  if (wire) wire.innerHTML = media.filter(function (m) { return !m.weak; }).slice(0, 3).map(function (m) {
    return '<li><span class="w-meta"><b>' + esc(m.outlet) + '</b> · ' + fmtShort(m.date) + '</span>' + titleLink(m, 'plain') + '</li>';
  }).join("");

  var wallRank = {}; (window.OUTLETS || []).forEach(function (o, i) { wallRank[o.name] = i; });

  /* Home: issue tiles (latest headline per issue and the outlets that covered it) */
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
        '<span class="when">' + fmtShort(x.lead.date) + '</span>' +
        '<span class="head">' + esc(x.lead.title) + '</span>' +
        '<span class="outs">' + x.outs.map(esc).join(' · ') + '</span></a>';
    }).join("");
  }

  /* Home: coverage band. SVGs are inlined so fill="currentColor" follows the page colour; each mark
     gets the same visual area whatever its proportions. */
  var BAND = window.BAND || [];
  function bandItems(b) { return media.filter(function (m) { return b.logos.indexOf(m.logo) > -1; }); }
  function sizeMark(el, w, h, area) {
    var ar = w && h ? w / h : 5, mw = Math.sqrt(area * ar), mh = Math.sqrt(area / ar);
    if (mw > 168) { mh *= 168 / mw; mw = 168; } if (mh > 44) { mw *= 44 / mh; mh = 44; }
    el.style.width = Math.round(mw) + "px"; el.style.height = Math.round(mh) + "px";
  }
  function loadMark(el, slug, area, name, wm) {
    if (wm) { el.classList.add("is-wm"); el.innerHTML = '<span class="wm">' + esc(name) + '</span>'; return; }
    var url = "assets/logos/" + slug + ".svg";
    var fallback = function () { el.innerHTML = '<img src="' + url + '" alt="">'; sizeMark(el, 240, 48, area); };
    if (!window.fetch || location.protocol === "file:") return fallback();
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, "image/svg+xml"), svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== "svg") throw 0;
      if (svg.querySelector("text")) { el.classList.add("is-wm"); el.innerHTML = '<span class="wm">' + esc(name) + '</span>'; return; }
      Array.prototype.forEach.call(svg.querySelectorAll("script,foreignObject"), function (n) { n.remove(); });
      var vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
      var w = vb[2] || parseFloat(svg.getAttribute("width")), h = vb[3] || parseFloat(svg.getAttribute("height"));
      if (!svg.getAttribute("viewBox") && w && h) svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
      el.innerHTML = ""; el.appendChild(document.importNode(svg, true)); sizeMark(el, w, h, area);
    }).catch(fallback);
  }
  function renderBand(root, opts) {
    var items = BAND.map(function (b) { var xs = bandItems(b); return { b: b, xs: xs, latest: xs.filter(function (m) { return !m.weak; })[0] || xs[0] }; })
      .filter(function (x) { return x.xs.length; });
    var area = opts.area || 1500, byName = {};
    items.forEach(function (x) { byName[x.b.slug] = x.b.name; });
    var allWm = items.every(function (x) { return x.b.wm; }), byWm = {};
    items.forEach(function (x) { byWm[x.b.slug] = !!x.b.wm; });
    root.innerHTML = '<div class="band-marks' + (allWm ? ' all-wm' : '') + '">' + items.map(function (x) {
      return '<a class="mark" href="' + opts.href(x.b.slug) + '" data-k="' + x.b.slug + '" aria-label="' + esc(x.b.name) + ': all coverage"><span class="mk"></span></a>';
    }).join("") + '</div>' + (opts.panel ? '<div class="band-panel"></div>' : '') +
      (opts.also && window.ALSO ? '<p class="band-also"><b>Also:</b> ' + window.ALSO.map(esc).join(", ") + ', and stations across Virginia, Washington and beyond.</p>' : '');
    Array.prototype.forEach.call(root.querySelectorAll(".mark"), function (a) { loadMark(a.querySelector(".mk"), a.dataset.k, area, byName[a.dataset.k], byWm[a.dataset.k]); });
    var byKey = {}; items.forEach(function (x) { byKey[x.b.slug] = x; });
    var panel = root.querySelector(".band-panel");
    var dflt = items.slice().sort(function (a, b) { return a.latest.date < b.latest.date ? 1 : -1; })[0];
    function show(k) {
      if (!panel) return; var x = byKey[k] || dflt; if (!x) return;
      var m = x.latest, sel = root.dataset.sel === x.b.slug, n = x.xs.length;
      panel.innerHTML = '<span class="when">Latest on ' + esc(x.b.name) + ' · ' + fmtShort(m.date) + '</span>' +
        '<span class="t">' + titleLink(m) + '</span>' +
        '<a class="all" href="' + opts.href(x.b.slug) + '">' + (sel ? n + (n === 1 ? ' appearance' : ' appearances') + ' below' : 'All coverage from ' + esc(x.b.name)) + '</a>';
    }
    if (window.matchMedia && matchMedia("(hover: hover)").matches) {
      root.addEventListener("mouseover", function (e) { var a = e.target.closest(".mark"); if (a) show(a.dataset.k); });
      root.addEventListener("mouseleave", function () { show(root.dataset.sel); });
    }
    root.addEventListener("focusin", function (e) { var a = e.target.closest(".mark"); if (a) show(a.dataset.k); });
    var api = {
      select: function (k) {
        root.dataset.sel = k || "";
        Array.prototype.forEach.call(root.querySelectorAll(".mark"), function (a) {
          if (a.dataset.k === k) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
        show(k);
      }
    };
    api.select("");
    return api;
  }
  var homeBand = $("#band-home");
  if (homeBand) renderBand(homeBand, { area: 1300, href: function (k) { return "media.html#outlet=" + k; } });

  /* ===== Media page ===== */
  var page = $("#appearances");
  if (page) {
    var OVERRIDES = { "3451854": "Federal Reserve decision preview" };
    var STILL_DESC = {
      "3449220": "David Bieri in a video window, the full broadcast frame on a dark field",
      "3451854": "David Bieri in split screen beside the Federal Reserve building, lower third reading David Bieri, Virginia Tech Professor",
      "3406078": "David Bieri in studio with a Chinese-language lower third dated 15 February",
      "2820382": "David Bieri in split screen with the anchor, First 100 Days chyron",
      "2512388": "David Bieri in a live RTVI studio segment",
      "2366243": "David Bieri in a live RTVI studio segment",
      "2215064": "David Bieri in the FOX 5 DC studio for a Consumer Alert segment",
      "1599468": "David Bieri in the FOX 5 DC studio analysing President Biden's economic plan"
    };
    var VERB = { tv: "Watch", radio: "Listen", podcast: "Listen", print: "Read", online: "Read" };
    var LEAD_SIZES = "(min-width: 1200px) 700px, 100vw", SMALL_SIZES = "(min-width: 1200px) 240px, 50vw", LB_SIZES = "(min-width: 1100px) 1040px, 100vw";
    function dtitle(m) { return (OVERRIDES[m.id] || m.title).replace(/^RTVI:\s*/, "").replace(/\s*\(live US-economy segment\)\s*$/, "").trim(); }
    function dprog(m, t) { var p = m.program; return (p && p !== m.outlet && p !== t) ? p : ""; }
    function monYear(d) { return MONTHS[+d.slice(5, 7) - 1] + " " + d.slice(0, 4); }
    function dayMon(d) { return MONTHS[+d.slice(5, 7) - 1] + " " + (+d.slice(8, 10)); }
    function altText(m) {
      var prog = m.program, head = m.outlet + (prog ? ", " + prog : "") + ", " + MONTHS_FULL[+m.date.slice(5, 7) - 1] + " " + m.date.slice(0, 4);
      return head + ": " + (STILL_DESC[m.id] || "David Bieri on " + m.outlet);
    }
    function picture(m, sizes, eager) {
      var load = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" decoding="async"', alt = esc(altText(m)), poster = m.poster, base = poster.slice(0, -4);
      if (poster.indexOf("http") === 0) return '<img src="' + esc(poster) + '" width="1280" height="720" alt="' + alt + '" ' + load + '>';
      return '<picture><source type="image/webp" srcset="' + base + '-640.webp 640w, ' + base + '.webp 1280w" sizes="' + sizes + '">' +
        '<img src="' + base + '.jpg" srcset="' + base + '-640.jpg 640w, ' + base + '.jpg 1280w" sizes="' + sizes + '" width="1280" height="720" alt="' + alt + '" ' + load + '></picture>';
    }
    function tLink(m, t) { return m.url ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(t) + NEWTAB + '</a>' : '<span class="nolink">' + esc(t) + '</span>'; }
    function tvTile(m, lead) {
      var t = dtitle(m), prog = m.program, meta = esc([m.outlet].concat(prog ? [prog] : []).concat([monYear(m.date)]).join(" · "));
      var play = m.video ? '<button type="button" class="tv-play" data-id="' + esc(m.id) + '" aria-label="Play clip: ' + esc(t) + '"><span class="tri" aria-hidden="true"></span>Play</button>' : "";
      var fig = '<figure class="shot">' + picture(m, lead ? LEAD_SIZES : SMALL_SIZES, lead) + play + '</figure>';
      var head = m.url ? '<a class="tv-link" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(t) + '</a>' : '<span class="tv-link">' + esc(t) + '</span>';
      return '<article class="tv-tile' + (lead ? ' tv-tile--lead' : '') + '" data-id="' + esc(m.id) + '">' + fig + '<h3 class="tv-head">' + head + '</h3><p class="tv-meta">' + meta + '</p></article>';
    }
    function covItem(m) { var t = dtitle(m); return '<li class="cov-item"><span class="cov-t">' + tLink(m, t) + '</span><span class="cov-meta">' + esc(m.outlet) + ' · ' + esc(monYear(m.date)) + '</span></li>'; }
    function arcRow(m) {
      var t = dtitle(m), prog = dprog(m, t);
      var main = '<div class="arc-o">' + esc(m.outlet) + '</div><div class="arc-t">' + tLink(m, t) + '</div>';
      if (prog) main += '<div class="arc-p">' + esc(prog) + '</div>';
      if (m.quote) main += '<div class="arc-q">“' + esc(m.quote) + '”</div>';
      var k = '<span class="arc-type">' + esc(TY[m.type] || m.type) + '</span>';
      if ((m.video || m.audio) && m.url) k += '<a class="arc-do" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + (VERB[m.type] || "Read") + NEWTAB + '</a>';
      return '<li class="arc-row"><span class="arc-d">' + esc(dayMon(m.date)) + '</span><div class="arc-main">' + main + '</div><span class="arc-k">' + k + '</span></li>';
    }
    function arcYears(rows, openAll) {
      var years = [];
      rows.forEach(function (m) { var y = m.date.slice(0, 4); if (!years.length || years[years.length - 1][0] !== y) years.push([y, []]); years[years.length - 1][1].push(m); });
      return years.map(function (yr, i) {
        var y = yr[0], list = yr[1], n = list.length, word = n === 1 ? "appearance" : "appearances";
        var open = openAll || i < 2 ? " open" : "";
        return '<details class="arc-year"' + open + '><summary class="arc-sum"><span class="arc-y">' + y + '</span><span class="arc-n">' + n + ' ' + word + '</span></summary>' +
          '<ul class="arc-rows">' + list.map(arcRow).join("") + '</ul></details>';
      }).join("");
    }

    media.forEach(function (m) { m._text = (m.outlet + " " + (m.program || "") + " " + m.title + " " + (m.quote || "")).toLowerCase(); });
    var bar = $("#mediabar"), status = $("#mb-status"), mosaic = $("#tv-mosaic"), secTV = $("#tv-sec"),
        covList = $("#cov-list"), secCov = $("#cov-sec"), arc = $("#arc"), arcEmpty = $("#arc-empty"), qInput = $("#mb-q");
    var st = { topic: "", type: "", va: false, q: "" };
    var outletBySlug = {}; BAND.forEach(function (b) { outletBySlug[b.slug] = b.name; });

    function readURL() {
      var p = new URLSearchParams(location.search);
      st.topic = TL[p.get("topic")] ? p.get("topic") : "";
      st.type = ["tv", "radio", "print", "online"].indexOf(p.get("type")) > -1 ? p.get("type") : "";
      st.va = p.get("va") === "1";
      st.q = p.get("q") || "";
      var h = location.hash.replace(/^#/, "");  /* legacy home-page links: #trade, #virginia, #outlet=cnn */
      if (h) h.split("&").forEach(function (part) {
        if (TL[part]) st.topic = part;
        else if (part === "virginia") st.va = true;
        else if (part.indexOf("outlet=") === 0) { var nm = outletBySlug[part.slice(7)]; if (nm) st.q = nm; }
      });
    }
    function writeURL() {
      var p = new URLSearchParams();
      if (st.topic) p.set("topic", st.topic);
      if (st.type) p.set("type", st.type);
      if (st.va) p.set("va", "1");
      if (st.q) p.set("q", st.q);
      var qs = p.toString();
      if (history.replaceState) history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }
    function active() { return !!(st.topic || st.type || st.va || st.q); }
    function typeMatch(m) { return !st.type || (st.type === "radio" ? (m.type === "radio" || m.type === "podcast") : m.type === st.type); }
    function keep(m) { return (!st.topic || m.topic === st.topic) && typeMatch(m) && (!st.va || m.va) && (!st.q || m._text.indexOf(st.q.toLowerCase()) > -1); }
    function names() {
      return [st.topic ? TL[st.topic] : "", st.type ? (TY[st.type] || st.type) : "", st.va ? "Virginia" : "", st.q ? "“" + st.q + "”" : ""].filter(Boolean).join(" + ");
    }
    function setPressed() {
      Array.prototype.forEach.call(bar.querySelectorAll("[data-topic]"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-topic") === st.topic); });
      Array.prototype.forEach.call(bar.querySelectorAll("[data-type]"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-type") === st.type); });
      $("#mb-va").setAttribute("aria-pressed", st.va);
      if (qInput && qInput.value !== st.q) qInput.value = st.q;
    }
    function render() {
      var rows = media.filter(keep);
      var tv = rows.filter(function (m) { return m.poster; }).slice(0, 5);
      secTV.hidden = !tv.length;
      if (tv.length) mosaic.innerHTML = tvTile(tv[0], true) + '<div class="tv-rest">' + tv.slice(1).map(function (m) { return tvTile(m, false); }).join("") + '</div>';
      var cov = rows.filter(function (m) { return m.featured && !m.poster; }).slice(0, 8);
      secCov.hidden = !cov.length;
      if (cov.length) covList.innerHTML = cov.map(covItem).join("");
      arc.hidden = !rows.length;
      if (rows.length) arc.innerHTML = arcYears(rows, active());
      if (active()) {
        status.hidden = false;
        status.innerHTML = rows.length + " of " + media.length + (rows.length ? "" : ' <button type="button" class="mb-clear">Clear filters</button>');
      } else { status.hidden = true; status.innerHTML = ""; }
      arcEmpty.hidden = !!rows.length;
      if (!rows.length) arcEmpty.textContent = "No appearances match " + names() + ".";
      setPressed();
    }
    function clear() { st = { topic: "", type: "", va: false, q: "" }; if (qInput) qInput.value = ""; writeURL(); render(); }

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-topic],[data-type],[data-va]"); if (!b) return;
      if (b.hasAttribute("data-va")) st.va = !st.va;
      else if (b.hasAttribute("data-type")) st.type = b.getAttribute("data-type");
      else st.topic = b.getAttribute("data-topic");
      writeURL(); render();
    });
    if (qInput) qInput.addEventListener("input", function () { st.q = this.value.trim(); writeURL(); render(); });

    /* ---- Lightbox ---- */
    var lb = $("#lightbox"), lbStage = $("#lb-stage"), lbCount = $("#lb-count"), lbHead = $("#lb-head"),
        lbMeta = $("#lb-meta"), lbAction = $("#lb-action"), lbPrev = $("#lb-prev"), lbNext = $("#lb-next");
    var lbTiles = [], lbIdx = 0, lbReturn = null;
    function byId(id) { for (var i = 0; i < media.length; i++) if (media[i].id === id) return media[i]; }
    function showLB() {
      var m = byId(lbTiles[lbIdx].getAttribute("data-id")); if (!m) return;
      var t = dtitle(m), prog = m.program;
      lbStage.innerHTML = picture(m, LB_SIZES, false);
      lbCount.textContent = (lbIdx + 1) + " of " + lbTiles.length;
      lbHead.textContent = t;
      lbMeta.textContent = [m.outlet].concat(prog ? [prog] : []).concat([monYear(m.date)]).join(" · ");
      if (m.video) lbAction.innerHTML = '<button type="button" class="lb-play">' + (VERB[m.type] || "Watch") + ' here</button>';
      else if (m.url) lbAction.innerHTML = '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + (VERB[m.type] || "Watch") + ' at ' + esc(m.outlet) + NEWTAB + '</a>';
      else lbAction.innerHTML = "";
      lbPrev.disabled = lbIdx <= 0; lbNext.disabled = lbIdx >= lbTiles.length - 1;
    }
    function stepLB(d) { var n = lbIdx + d; if (n < 0 || n >= lbTiles.length) return; lbIdx = n; showLB(); }
    function openLB(tile) {
      lbTiles = Array.prototype.slice.call(mosaic.querySelectorAll(".tv-tile"));
      lbIdx = lbTiles.indexOf(tile); if (lbIdx < 0) lbIdx = 0;
      lbReturn = tile.querySelector(".tv-link") || tile;
      showLB(); lb.hidden = false; document.body.style.overflow = "hidden";
      $("#lb-close").focus(); document.addEventListener("keydown", lbKey, true);
    }
    function closeLB() { lb.hidden = true; document.body.style.overflow = ""; lbStage.innerHTML = ""; document.removeEventListener("keydown", lbKey, true); if (lbReturn && lbReturn.focus) lbReturn.focus(); }
    function lbKey(e) {
      if (e.key === "Escape") { e.preventDefault(); closeLB(); }
      else if (e.key === "ArrowLeft") { stepLB(-1); }
      else if (e.key === "ArrowRight") { stepLB(1); }
      else if (e.key === "Tab") {
        var f = lb.querySelectorAll('button:not([disabled]), a[href]'); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    lbPrev.addEventListener("click", function () { stepLB(-1); });
    lbNext.addEventListener("click", function () { stepLB(1); });
    Array.prototype.forEach.call(lb.querySelectorAll("[data-close]"), function (el) { el.addEventListener("click", closeLB); });
    lbAction.addEventListener("click", function (e) {
      if (!e.target.closest(".lb-play")) return;
      var m = byId(lbTiles[lbIdx].getAttribute("data-id")); lbStage.innerHTML = ""; lbStage.appendChild(makeVideo(m.video));
    });

    page.addEventListener("click", function (e) {
      var play = e.target.closest(".tv-play");
      if (play) { e.preventDefault(); var fig = play.closest(".shot"); fig.innerHTML = ""; fig.appendChild(makeVideo(byId(play.getAttribute("data-id")).video)); return; }
      var tile = e.target.closest(".tv-tile");
      if (tile && mosaic.contains(tile)) { e.preventDefault(); openLB(tile); return; }
      if (e.target.closest(".mb-clear")) clear();
    });

    readURL(); setPressed();
    if (active()) { render(); writeURL(); }   /* a filter in the URL (or a legacy hash): reflect it and drop the hash */
  }

  /* Publications */
  var pubs = $("#pubs");
  if (pubs && window.PUBS) {
    var KL = window.KIND_LABELS, order = ["book", "article", "chapter", "working", "progress"];
    var sel = pubs.getAttribute("data-selected") === "true";
    var items = window.PUBS.filter(function (p) { return !sel || p.selected; });
    function pub(p) {
      return '<div class="pub"><div class="y">' + p.year + '</div><div>' +
        '<div class="t">' + (p.url || p.doi ? '<a href="' + esc(p.url || "https://doi.org/" + p.doi) + '" target="_blank" rel="noopener">' + esc(p.title) + NEWTAB + '</a>' : esc(p.title)) + (p.authors ? ' <span class="muted">(' + esc(p.authors) + ')</span>' : '') + '</div>' +
        '<div class="v">' + esc(p.venue) + (p.doi ? ' · <a class="doi" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + NEWTAB + '</a>' : '') + '</div>' + (p.note ? '<div class="n">' + esc(p.note) + '</div>' : '') + '</div></div>';
    }
    if (sel) {
      pubs.innerHTML = items.sort(function (a, b) { return b.year - a.year; }).map(pub).join("");
    } else {
      pubs.innerHTML = order.map(function (k) {
        var g = items.filter(function (p) { return p.kind === k; }).sort(function (a, b) { return b.year - a.year; });
        return g.length ? '<section class="pubgroup"><h2>' + KL[k] + '</h2>' + g.map(pub).join("") + '</section>' : '';
      }).join("");
    }
  }
})();
