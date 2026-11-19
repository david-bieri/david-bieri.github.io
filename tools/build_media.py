#!/usr/bin/env python3
"""Build assets/data/media.js and assets/logos/*.svg from data/media.csv.

Usage:  python3 tools/build_media.py
Edit data/media.csv (Excel, Sheets, or a text editor), run this, commit both.

Columns (conventions as of the 17 Nov 2026 consolidation; see data/MEDIA_CHANGELOG.md)
  id          stable identifier: the Elements activity ID (digits) for rows from the Elements export,
              or x-YYYY-MM-DD-<logo> for rows added by hand. Never reuse or renumber.
  date        YYYY-MM-DD (air date / publication date)
  outlet      display name. Network affiliates are "CALL (NET)" or "CALL (NET City)", e.g. "WSET (ABC)",
              "WDBJ7 (CBS Roanoke)"; national networks are the brand, e.g. "CBS News", "FOX News", "CNN".
              One spelling per outlet -- check the existing rows before adding a variant.
  logo        wordmark slug: lowercase, no hyphens (thehill, nypost, augustafreepress), except the shared
              affiliate slugs cbs-affiliate | abc-affiliate | fox-affiliate | nbc-affiliate. A new slug
              gets a generated SVG in assets/logos/ on the next build.
  program     show, section or bureau, e.g. "Good Day DC (live)", "CBS MoneyWatch"; blank if none
  title       the outlet's headline, sentence case. Rows still carrying the placeholder notes
              title-from-url / title-from-program have no real headline yet (see HANDOVER.md).
  type        tv | radio | print | online | podcast  -- the medium of the appearance, which follows the
              outlet (a radio station's web write-up is still radio; a TV clip page is tv).
  topic       exactly one of the eight issues (the filters on media.html and the tiles on the home page):
                trade   Trade & tariffs          money    The Fed & money
                prices  Prices & cost of living  jobs     Jobs & the economy
                markets Markets & new finance    housing  Housing
                gov     Government & budgets     world    Global affairs & energy
  va          "yes" if the story is about Virginia or ran on a Virginia outlet (drives the Virginia filter).
              Every Virginia station/paper row is flagged; Virginia Tech News rows only when the story is about Virginia.
  scope       Local | State | Regional | National | International -- the story's geography (Elements field;
              for hand-added rows defaults to the tier)
  tier        national | international | regional | state | local -- the outlet's reach (drives outlet wall ordering)
  url         direct link to the story on the outlet's own site; blank if none (title renders as plain text).
              No landing pages, no translate proxies, no VT media-mentions pages where the original exists.
  interviewer host or reporter as "Surname I" (not rendered; kept for your records)
  featured    "yes" to surface on the home page and in Selected appearances
  quote       optional pull quote (rendered in cards)
  video       optional; plays on the page, loaded only when the visitor clicks Watch. Either a YouTube/Vimeo URL
              (youtube.com/watch?v=…&t=…, youtu.be/…, youtube.com/live/…, vimeo.com/…) or a direct https URL to an
              .mp4/.webm file. Left blank, a YouTube link in `url` is used automatically (the outlet's own upload).
              Never point this at a file in this repo: GitHub rejects files over 100 MB and Pages sites are capped at 1 GB.
  audio       optional; direct https URL to an .mp3/.m4a (or assets/media/… path for a small file, < 10 MB)
  poster      optional still for the appearance: assets/media/posters/<id>.jpg (1280x720, 16:9, < 200 KB) or https URL.
              Used by the video player when the row has a `video`, and by the On air row on media.html either way.
              Leave the network logo and caption in so the still credits itself. A local path that does not exist fails the build.
  transcript  optional; assets/media/transcripts/<id>.txt or https URL, shown as a "Transcript" link
  notes       provenance and anything else; not rendered. "merged duplicate <id>" records a consolidation.
"""
import csv, html, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "media.csv")
OUT = os.path.join(ROOT, "assets", "data", "media.js")
LOGOS = os.path.join(ROOT, "assets", "logos")

rows = list(csv.DictReader(open(SRC, encoding="utf-8")))
bad = [r for r in rows if not re.match(r"\d{4}-\d{2}-\d{2}$", r["date"]) or not r["outlet"] or not r["title"]]
if bad:
    sys.exit("Rows missing date/outlet/title: " + ", ".join(r.get("id", "?") for r in bad))
rows.sort(key=lambda r: r["date"], reverse=True)

TOPIC_LABELS = {"trade": "Trade & tariffs", "money": "The Fed & money", "prices": "Prices & cost of living",
    "jobs": "Jobs & the economy", "markets": "Markets & new finance", "housing": "Housing",
    "gov": "Government & budgets", "world": "Global affairs & energy"}
odd = [r.get("id", "?") for r in rows if r["topic"] not in TOPIC_LABELS]
if odd:
    sys.exit("Rows with a topic outside the eight issues: " + ", ".join(odd))
missing = [r.get("id", "?") + " (" + r["poster"] + ")" for r in rows
           if r.get("poster") and not r["poster"].startswith("http") and not os.path.isfile(os.path.join(ROOT, r["poster"]))]
if missing:
    sys.exit("Rows whose poster file does not exist: " + ", ".join(missing))
YES = ("yes", "true", "1", "x")

def video_ref(u, explicit, rid):
    """Normalise a video reference to {'yt': id, 'start': s} | {'vimeo': id} | {'src': url}, or None."""
    if not u:
        return None
    from urllib.parse import urlparse, parse_qs
    p = urlparse(u); host = p.netloc.lower().replace("www.", "").replace("m.", "")
    q = parse_qs(p.query)
    def secs(t):
        t = (t or "").rstrip("s")
        if not t: return 0
        if t.isdigit(): return int(t)
        mm = re.match(r"(?:(\d+)h)?(?:(\d+)m)?(?:(\d+))?", t)
        return sum(int(x or 0) * k for x, k in zip(mm.groups(), (3600, 60, 1))) if mm else 0
    vid = None
    if host == "youtu.be":
        vid = p.path.strip("/")
    elif host in ("youtube.com", "youtube-nocookie.com"):
        if p.path == "/watch": vid = (q.get("v") or [None])[0]
        elif re.match(r"^/(live|embed|shorts)/", p.path): vid = p.path.split("/")[2]
    if vid:
        out = {"yt": vid}
        st = secs((q.get("t") or q.get("start") or [""])[0])
        if st: out["start"] = st
        return out
    if host == "vimeo.com" and re.match(r"^/\d+", p.path):
        return {"vimeo": p.path.split("/")[1]}
    if explicit:
        if re.search(r"\.(mp4|webm)(\?|$)", u) and u.startswith("https://"):
            return {"src": u}
        sys.exit(f"Row {rid}: video must be a YouTube/Vimeo URL or an https .mp4/.webm URL: {u}")
    return None

GENERIC = {"news", "live", "tv", "magazine", "radio", "the", "npr", "fm", "us", "dc", "washington", "com"}
def toks(s):
    return set(re.sub(r"[^\w]+", " ", s.lower()).split())
def same_as_outlet(program, outlet):
    """The programme repeats the outlet ('Wall Street Journal' under 'The Wall Street Journal', 'Yahoo! News' under
    'Yahoo News', 'NPR Marketplace' under 'Marketplace'): drop it. A real programme name ('WFIR In-Depth',
    'FOX 5 DC News at 10 p.m.') stays."""
    a, b = toks(program), toks(outlet)
    return bool(a) and (a <= b or a - b <= GENERIC)

media = []
for r in rows:
    m = {k: r[k] for k in ("id", "date", "outlet", "logo", "program", "title", "type", "topic", "scope", "tier", "url") if r.get(k)}
    if m.get("program") and same_as_outlet(m["program"], m["outlet"]):
        del m["program"]  # the row shows the outlet already (S12 of the 18 Nov review)
    if r.get("featured", "").strip().lower() in YES:
        m["featured"] = True
    if r.get("va", "").strip().lower() in YES:
        m["va"] = True
    notes = r.get("notes", "")
    if "title-from-program" in notes or r["title"] == r.get("program") or (len(r["title"].split()) < 4 and "headline" not in notes.lower()):
        m["weak"] = True  # placeholder or topic-line title: kept in the archive, skipped for the lead, cards and tiles.
        # A short title whose notes say where the headline was confirmed ("headline from outlet page") is a real headline.
    if r.get("quote"):
        m["quote"] = r["quote"]
    v = video_ref(r.get("video", "").strip() or r.get("url", ""), explicit=bool(r.get("video", "").strip()), rid=r["id"])
    if v:
        m["video"] = v
    for k in ("audio", "poster", "transcript"):
        val = r.get(k, "").strip()
        if val:
            if not val.startswith("https://") and not os.path.exists(os.path.join(ROOT, val)):
                sys.exit(f"Row {r['id']}: {k} file not found: {val}")
            m[k] = val
    media.append(m)

# Outlet wall: distinct outlets ranked by tier then frequency
tier_rank = {"national": 0, "international": 1, "regional": 2, "state": 3, "local": 4, "": 5}
# Editorial prominence for the outlet wall: these lead, in this order; everything else follows by tier and frequency.
PROMINENT = ["wsj", "wapo", "time", "newsweek", "cnn", "cbs", "abc", "ap", "marketplace", "npr", "guardian", "politico",
             "bloomberg", "aljazeera", "dw", "scmp", "thehill", "nypost", "businessweek", "fortune", "csm", "upi", "yahoo",
             "kiplinger", "bi", "money", "fox", "fox5", "wtop", "knx"]
freq, tier, logo = {}, {}, {}
for m in media:
    freq[m["outlet"]] = freq.get(m["outlet"], 0) + 1
    tier.setdefault(m["outlet"], m.get("tier", ""))
    logo.setdefault(m["outlet"], m.get("logo", ""))
def prom(o):
    return PROMINENT.index(logo[o]) if logo[o] in PROMINENT else 99
outlets = sorted(freq, key=lambda o: (prom(o), tier_rank.get(tier[o], 5), -freq[o], o))
wall = [{"name": o, "logo": logo[o], "n": freq[o], "tier": tier[o]} for o in outlets]

# Coverage band (media page and home page): the outlets shown as marks, in this order. Each entry is
# (slug for assets/logos/<slug>.svg, display name, logo slugs it covers in media.csv). Everything else is
# listed as plain text under the band. Drop an official monochrome SVG at assets/logos/<slug>.svg to
# replace the typographic wordmark (tools/prep_logo.py does the clean-up).
BAND = [("wsj", "The Wall Street Journal", ["wsj"]), ("wapo", "The Washington Post", ["wapo"]),
    ("time", "TIME", ["time"]), ("newsweek", "Newsweek", ["newsweek"]), ("cnn", "CNN", ["cnn"]),
    ("cbs", "CBS", ["cbs", "cbs-affiliate"]), ("abc", "ABC", ["abc", "abc-affiliate"]), ("ap", "Associated Press", ["ap"]),
    ("politico", "POLITICO", ["politico"]), ("thehill", "The Hill", ["thehill"]), ("guardian", "The Guardian", ["guardian"]),
    ("aljazeera", "Al Jazeera", ["aljazeera"]), ("dw", "DW", ["dw"]), ("npr", "NPR", ["npr"]),
    ("marketplace", "Marketplace", ["marketplace"]), ("fox5", "FOX 5 DC", ["fox5"])]
in_band = {s for _, _, ss in BAND for s in ss} | {"fox", "fox-affiliate", "nbc-affiliate"}
# Plain-text line under the band: prominent outlets first, then international, then national. Aggregators skipped.
SKIP_ALSO = {"Newswise", "Forward Pathway", "WalletHub", "Investment Watch Blog", "Whiterock Locators", "AInvest", "Coin Rivet", "EFN", "Fox LiveNOW", "KNX Radio (Los Angeles)"}
cand = [o for o in wall if o["logo"] not in in_band and o["tier"] in ("national", "international") and o["name"] not in SKIP_ALSO]
also = [o["name"] for o in sorted(cand, key=lambda o: (prom(o["name"]) == 99, o["tier"] != "international"))]
def is_placeholder(slug):
    f = os.path.join(LOGOS, slug + ".svg")
    return not os.path.isfile(f) or "<text" in open(f, encoding="utf-8").read()
# wm: the slot still holds a generated wordmark, so the page sets the name in its own type without fetching the SVG
band = [{"slug": k, "name": n, "logos": ss, **({"wm": True} if is_placeholder(k) else {})} for k, n, ss in BAND]

TYPE_LABELS = {"tv": "Television", "radio": "Radio", "print": "Print", "online": "Online", "podcast": "Podcast"}

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// GENERATED by tools/build_media.py from data/media.csv — edit the CSV, not this file.\n")
    f.write("window.MEDIA = " + json.dumps(media, ensure_ascii=False, indent=1) + ";\n")
    f.write("window.OUTLETS = " + json.dumps(wall, ensure_ascii=False) + ";\n")
    f.write("window.TOPIC_LABELS = " + json.dumps(TOPIC_LABELS) + ";\n")
    f.write("window.TYPE_LABELS = " + json.dumps(TYPE_LABELS) + ";\n")
    f.write("window.BAND = " + json.dumps(band, ensure_ascii=False) + ";\n")
    f.write("window.ALSO = " + json.dumps(also[:22], ensure_ascii=False) + ";\n")

# Home page data: the same shape as MEDIA, but only the rows the home page can show get their title and
# url (latest three with a real headline, the lead per issue, the latest per band outlet); every other row
# keeps date, outlet, logo and topic so the issue tiles can still list outlets. About a fifth of media.js.
HOME_OUT = os.path.join(ROOT, "assets", "data", "media-home.js")
def firsts(xs):
    strong = [m for m in xs if not m.get("weak")]
    return (strong[:1] or xs[:1])
full = {id(m) for m in firsts(media)[:0]}
full |= {id(m) for m in [m for m in media if not m.get("weak")][:3]}
for t in TOPIC_LABELS:
    full |= {id(m) for m in firsts([m for m in media if m["topic"] == t])}
for b in band:
    full |= {id(m) for m in firsts([m for m in media if m.get("logo") in b["logos"]])}
home = [m if id(m) in full else {k: m[k] for k in ("date", "outlet", "logo", "topic", "weak") if k in m} for m in media]
with open(HOME_OUT, "w", encoding="utf-8") as f:
    f.write("// GENERATED by tools/build_media.py from data/media.csv — the home page's slice of media.js; edit the CSV, not this file.\n")
    f.write("window.MEDIA = " + json.dumps(home, ensure_ascii=False, separators=(",", ":")) + ";\n")
    f.write("window.OUTLETS = " + json.dumps([{"name": o["name"], "logo": o["logo"]} for o in wall], ensure_ascii=False, separators=(",", ":")) + ";\n")
    f.write("window.TOPIC_LABELS = " + json.dumps(TOPIC_LABELS) + ";\n")
    f.write("window.BAND = " + json.dumps(band, ensure_ascii=False) + ";\n")

# Monochrome wordmarks: one SVG per logo slug, text set in the site's sans. Replace any file with a real
# monochrome mark if you have usage rights; the renderer just loads assets/logos/<slug>.svg.
os.makedirs(LOGOS, exist_ok=True)
names = {}
for m in media:
    names.setdefault(m.get("logo", ""), m["outlet"])
names.update({"cbs-affiliate": "CBS", "abc-affiliate": "ABC", "fox-affiliate": "FOX", "nbc-affiliate": "NBC"})
for slug, name in names.items():
    if not slug:
        continue
    path = os.path.join(LOGOS, slug + ".svg")
    if os.path.exists(path):
        continue  # never overwrite a hand-placed mark
    label = re.sub(r"\s*\(.*?\)\s*", " ", name).strip()
    # size so the longest labels still fit a 240-unit box; centre with text-anchor
    size = max(13, min(30, int(400 / max(len(label), 6))))
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" role="img" aria-label="{label}">'
           f'<text x="120" y="24" text-anchor="middle" dominant-baseline="central" '
           f'font-family="Archivo, Helvetica Neue, Arial, sans-serif" font-weight="700" '
           f'font-size="{size}" letter-spacing="-0.02em" fill="currentColor">{html.escape(label)}</text></svg>')
    open(path, "w", encoding="utf-8").write(svg)

print(f"{len(media)} appearances, {len(wall)} outlets, {len(os.listdir(LOGOS))} logos -> {os.path.relpath(OUT, ROOT)}")

# ---------------------------------------------------------------------------
# media.html static markup. The page works and is indexable without JS; site.js
# only layers filtering, year toggles and the lightbox on top of what is here.
# Edit the CSV and re-run; never edit the generated regions of media.html by hand.
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"]
LEAD_SIZES = "(min-width: 1200px) 700px, 100vw"
SMALL_SIZES = "(min-width: 1200px) 240px, 50vw"
VERB = {"tv": "Watch", "radio": "Listen", "podcast": "Listen", "print": "Read", "online": "Read"}
# Display rules for this page only (CSV is left untouched). A clean headline for the Fox 5 Fed row,
# and the prefix/suffix the RTVI rows carry in the CSV so the translated title reads as a headline.
HEADLINE_OVERRIDES = {"3451854": "Federal Reserve decision preview"}
# Alt-text descriptions of the stills (from the intake manifest, branch intake/stills-2026-11-18); the sentence after the colon.
STILL_DESC = {
    "3449220": "David Bieri in a video window, the full broadcast frame on a dark field",
    "3451854": "David Bieri in split screen beside the Federal Reserve building, lower third reading David Bieri, Virginia Tech Professor",
    "3406078": "David Bieri in studio with a Chinese-language lower third dated 15 February",
    "2820382": "David Bieri in split screen with the anchor, First 100 Days chyron",
    "2512388": "David Bieri in a live RTVI studio segment",
    "2366243": "David Bieri in a live RTVI studio segment",
    "2215064": "David Bieri in the FOX 5 DC studio for a Consumer Alert segment",
    "1599468": "David Bieri in the FOX 5 DC studio analysing President Biden's economic plan",
}

def E(s):
    return html.escape(str(s if s is not None else ""), quote=True)

def disp_title(m):
    t = HEADLINE_OVERRIDES.get(m["id"], m["title"])
    t = re.sub(r"^RTVI:\s*", "", t)
    t = re.sub(r"\s*\(live US-economy segment\)\s*$", "", t)
    return t.strip()

def disp_prog(m, title):
    p = m.get("program")
    return p if (p and p != m["outlet"] and p != title) else None

def mon_year(d):
    return MONTHS[int(d[5:7]) - 1] + " " + d[:4]

def day_mon(d):
    return MONTHS[int(d[5:7]) - 1] + " " + str(int(d[8:10]))

def alt_text(m):
    prog = m.get("program")
    head = m["outlet"] + (", " + prog if prog else "") + ", " + MONTHS_FULL[int(m["date"][5:7]) - 1] + " " + m["date"][:4]
    return head + ": " + STILL_DESC.get(m["id"], "David Bieri on " + m["outlet"])

def picture(m, sizes, eager=False):
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    alt = E(alt_text(m))
    poster = m["poster"]
    base = poster[:-4]
    if poster.startswith("http") or not os.path.isfile(os.path.join(ROOT, base + "-640.webp")):
        return f'<img src="{E(poster)}" width="1280" height="720" alt="{alt}" {load}>'
    return ('<picture>'
            f'<source type="image/webp" srcset="{base}-640.webp 640w, {base}.webp 1280w" sizes="{sizes}">'
            f'<img src="{base}.jpg" srcset="{base}-640.jpg 640w, {base}.jpg 1280w" sizes="{sizes}" '
            f'width="1280" height="720" alt="{alt}" {load}></picture>')

def title_link(m, title):
    u = m.get("url")
    return (f'<a href="{E(u)}" target="_blank" rel="noopener">{E(title)}</a>' if u
            else f'<span class="nolink">{E(title)}</span>')

def tv_tile(m, lead=False):
    # Stretched-link tile: the headline <a> covers the whole tile (CSS ::after); a clip's Play
    # button lives inside the figure as a sibling of the link, so no interactive element is nested.
    t = disp_title(m)
    prog = m.get("program")
    meta = E(" · ".join([m["outlet"]] + ([prog] if prog else []) + [mon_year(m["date"])]))
    u = m.get("url")
    play = (f'<button type="button" class="tv-play" data-id="{E(m["id"])}" '
            f'aria-label="Play clip: {E(t)}"><span class="tri" aria-hidden="true"></span>Play</button>') if m.get("video") else ""
    fig = f'<figure class="shot">{picture(m, LEAD_SIZES if lead else SMALL_SIZES, eager=lead)}{play}</figure>'
    head = (f'<a class="tv-link" href="{E(u)}" target="_blank" rel="noopener">{E(t)}</a>' if u
            else f'<span class="tv-link">{E(t)}</span>')
    cls = "tv-tile tv-tile--lead" if lead else "tv-tile"
    return (f'<article class="{cls}" data-id="{E(m["id"])}">{fig}'
            f'<h3 class="tv-head">{head}</h3><p class="tv-meta">{meta}</p></article>')

def cov_item(m):
    t = disp_title(m)
    return (f'<li class="cov-item"><span class="cov-t">{title_link(m, t)}</span>'
            f'<span class="cov-meta">{E(m["outlet"])} · {E(mon_year(m["date"]))}</span></li>')

def arc_row(m):
    t = disp_title(m)
    prog = disp_prog(m, t)
    main = f'<div class="arc-o">{E(m["outlet"])}</div><div class="arc-t">{title_link(m, t)}</div>'
    if prog:
        main += f'<div class="arc-p">{E(prog)}</div>'
    if m.get("quote"):
        main += f'<div class="arc-q">“{E(m["quote"])}”</div>'
    k = f'<span class="arc-type">{E(TYPE_LABELS.get(m["type"], m["type"]))}</span>'
    if (m.get("video") or m.get("audio")) and m.get("url"):
        k += f'<a class="arc-do" href="{E(m["url"])}" target="_blank" rel="noopener">{VERB.get(m["type"], "Read")}</a>'
    return (f'<li class="arc-row"><span class="arc-d">{E(day_mon(m["date"]))}</span>'
            f'<div class="arc-main">{main}</div><span class="arc-k">{k}</span></li>')

def arc_years(items):
    years = []
    for m in items:
        y = m["date"][:4]
        if not years or years[-1][0] != y:
            years.append((y, []))
        years[-1][1].append(m)
    open_set = {y for y, _ in years[:2]}
    out = []
    for y, rows in years:
        n = len(rows)
        word = "appearance" if n == 1 else "appearances"
        out.append(f'<details class="arc-year"{" open" if y in open_set else ""}>'
                   f'<summary class="arc-sum"><span class="arc-y">{y}</span>'
                   f'<span class="arc-n">{n} {word}</span></summary>'
                   f'<ul class="arc-rows">{"".join(arc_row(m) for m in rows)}</ul></details>')
    return "".join(out)

from urllib.parse import quote_plus
# Coverage band: the BAND outlets as a quiet line of links that filter the list by that outlet's name.
# Static (indexable, no layout shift); site.js intercepts the clicks to filter in place.
band_links = ", ".join(f'<a href="?q={quote_plus(b["name"])}">{E(b["name"])}</a>' for b in band)
band_html = (f'<p class="outlets">{band_links}</p>'
             f'<p class="outlets-also"><b>Also:</b> {", ".join(E(n) for n in also[:22])}, '
             f'and stations across Virginia, Washington and beyond.</p>')

tv_rows = [m for m in media if m.get("poster")][:5]
lead, rest = tv_rows[0], tv_rows[1:5]
tv_html = tv_tile(lead, lead=True) + '<div class="tv-rest">' + "".join(tv_tile(m) for m in rest) + "</div>"
cov_rows = [m for m in media if m.get("featured") and not m.get("poster")][:8]
cov_html = "".join(cov_item(m) for m in cov_rows)
arc_html = arc_years(media)
first_year = min(m["date"][:4] for m in media)
summary = (f"{len(media)} television, radio, print and online appearances in "
           f"{len(wall)} outlets since {first_year}.")
lbase = lead["poster"][:-4]
preload = (f'\n<link rel="preload" as="image" type="image/webp" '
           f'imagesrcset="{lbase}-640.webp 640w, {lbase}.webp 1280w" '
           f'imagesizes="{LEAD_SIZES}" fetchpriority="high">\n')

PAGE = os.path.join(ROOT, "media.html")
doc = open(PAGE, encoding="utf-8").read()
for key, val in {"preload": preload, "summary": summary, "band": band_html, "tv": tv_html,
                 "coverage": cov_html, "archive": arc_html}.items():
    a, b = f"<!-- build:{key} -->", f"<!-- /build:{key} -->"
    i, j = doc.index(a) + len(a), doc.index(b)
    doc = doc[:i] + val + doc[j:]
open(PAGE, "w", encoding="utf-8", newline="\n").write(doc)
print(f"media.html: {len(tv_rows)} tv tiles, {len(cov_rows)} coverage, {len(media)} archive rows")
