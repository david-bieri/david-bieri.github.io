# david-bieri.com — working notes for Claude Code

Personal site of David Bieri (Associate Professor of Urban Affairs, SPIA, Virginia Tech). GitHub Pages user site; custom domain via `CNAME` (**www.david-bieri.com**; the bare david-bieri.com points at GitHub Pages (four A and four AAAA records), and GitHub 301-redirects it to www; the Let's Encrypt certificate covers both. Bluehost only holds the DNS zone and the old hosting files). Absolute URLs (canonical, sitemap, JSON-LD, og) use `https://www.david-bieri.com`.

## Stack and conventions
- Plain HTML, one stylesheet (`assets/css/main.css`), one script (`assets/js/site.js`). No framework, no build step, no bundler, no analytics. Keep it that way.
- Content that changes often lives in data files, not markup:
  - `assets/data/media.js` — media appearances (`window.MEDIA`, `OUTLETS`, `TOPIC_LABELS`, `TYPE_LABELS`). Generated; see Media database below.
  - `assets/data/publications.js` — `window.PUBS`; `selected: true` puts it on the home page.
- Design tokens are the `:root` variables at the top of `main.css` (paper, ink, rule, red accent, link). Fonts: Archivo (headings, UI) and Source Serif 4 (body), self-hosted from `assets/fonts/` (`@font-face` at the top of `main.css`; see `assets/fonts/README.md`), so the site makes no third-party request. Don't add typefaces or colors outside the token set.
- Name: **David Bieri**, no middle initial, on the site and in the CV (including "Bieri, D." in the CV's publication lists). The JSON-LD `alternateName` keeps "David S. Bieri" and "David Stephan Bieri" so search engines connect the old bylines.
- Title used everywhere (site, CV, letters): "Associate Professor of Urban Affairs, School of Public and International Affairs, Virginia Tech", the official HR title (tenured 2023). Decided 18 Nov 2026; it replaces the earlier "Public Policy" wording. "Associate Professor of Public Policy" survives only as the second JSON-LD `jobTitle` (media often use it) and verbatim inside media headlines, which are never edited. Economics is a courtesy appointment ("Associate Professor of Economics, by courtesy"); Blackwood and Kellogg are faculty affiliations. Handles: X @space_economy, Instagram @raumwirtschaft. Email bieri@vt.edu.
- Structured data (Person/WebSite JSON-LD) is in `index.html`; keep it consistent with the Wikidata item and the SPIA page.
- Nav and footer are duplicated per page by hand; when they change, change all six pages (`index, about, research, publications, media, teaching`).

## Design skills
- `.claude/skills/` holds `impeccable` and `motion` (versions in `.claude/skills/SOURCES.md`); `.mcp.json` adds the Playwright browser. Use them for craft, review and the browser checks below, not to change the stack, tokens, fonts, title or voice set out in this file — these conventions override any skill's defaults.

## Checks before committing
- Open each page at desktop and ~390px width; no horizontal scroll, filters on `media.html` work, console clean except the optional headshot.
- `python3 tools/check_pages.py` (with `python3 -m http.server 8765` running) does the mechanical part: screenshots of all six pages at 1280 and 390 px in /tmp/pagecheck, horizontal scroll, failed requests, console errors, third-party requests before any click.
- Every new media entry has `date` (YYYY-MM-DD), `outlet`, `type`, `topic` (one of the eight issues), `title`, `url`, and `va=yes` if it is a Virginia story or outlet.

## Open items
- `assets/images/headshot.jpg` added 18 Nov 2026 (studio portrait, 1000×1250, 4:5, under 200 KB, metadata stripped). `assets/docs/CV_DSBieri.pdf` added 18 Nov 2026; regenerate from the Overleaf project, which is the CV source of truth — `cv/` mirrors it.
- Photos (18 Nov 2026): `assets/images/og.jpg` (1200×630, office photo) is the link-preview image in the head of all six pages (`og:image` + `twitter:card summary_large_image`); `about-office.jpg` is the About banner; `press-studio.jpg` (full resolution) and `press-office.jpg` are the press downloads at `about.html#press`, linked from the booking line on media.html. The JSON-LD `image` stays the headshot.
- Verify `publications.js` against the CV; verify media URLs that still point at VT media-mentions pages.
- Migrate legacy david-bieri.com assets (PDFs, audio) into `assets/docs/` and add forwarding stubs for old URLs.

## Media database (added 17 Nov)
- **Source of truth is `data/media.csv`** (275 rows, 2014–2026; consolidated 17 Nov, see data/MEDIA_CHANGELOG.md). Edit it in Excel/Sheets or by hand, then run `python3 tools/build_media.py`, which regenerates `assets/data/media.js` and any missing `assets/logos/<slug>.svg` wordmarks. Never edit `media.js` directly.
- Columns are documented at the top of `tools/build_media.py`. `featured=yes` plus a `quote` puts an item in the **Selected interviews** card grid on media.html (`#featured`; curated 18 Nov to 14 national/international items, every quote checked against the source). `logo` is shared across network affiliates (`cbs-affiliate`, `abc-affiliate`, `fox-affiliate`).
- **Clips** (added 18 Nov): optional columns `video`, `audio`, `poster`, `transcript`. `video` takes a YouTube/Vimeo URL or an https .mp4/.webm URL; when blank, a YouTube link in `url` is used automatically (the outlet's own upload, with its `t=` start time). The page shows a "Watch here" button and loads the third-party player only on click (youtube-nocookie / Vimeo dnt), so nothing tracks visitors by default. Never commit video files to this repo (GitHub rejects files over 100 MB; Pages sites are capped at 1 GB). Station footage David saved himself (OneDrive `Media`, catalogued in `Media/_catalogue`) is not re-hosted without the station's permission; link the outlet's page instead.
- The home page **Latest** strip shows the three most recent rows with a real headline (wrapping, no horizontal scroll) and an "All coverage" link.
- **Coverage band** (`#band` on media.html, `#band-home` on index): the 16 outlets in `BAND` in `tools/build_media.py`. Each mark links to `media.html#outlet=<slug>`, and hovering one shows its latest headline. SVGs are inlined so `currentColor` follows the page, and every mark gets the same visual area. Typographic placeholder SVGs (containing `<text>`) render as the outlet name in Archivo. Every other outlet is listed as plain text (`window.ALSO`). To add an official mark: `python3 tools/prep_logo.py <file.svg> <slug>`; sources and permissions are in `assets/logos/README.md`.
- The media section is called **In the news** everywhere (nav, home, media.html). Every format is treated the same: tv shows as Watch, radio/podcast as Listen, print/online as Read.
- **Eight issues** (`topic` column): trade, money, prices, jobs, markets, housing, gov, world. Labels are in `TOPIC_LABELS` in `tools/build_media.py`; the build fails on any other value. `va` is a separate Virginia filter.
- `media.html` is a front page: issue chips plus a Virginia toggle, a lead story, four "Also recent" items, an **On air** row (up to four appearances with a broadcast still, from the `poster` column: 16:9, 1280×720 JPEG in `assets/media/posters/<id>.jpg`, network logo and caption left in so the still credits itself; the same still is the video player's poster when the row has a `video`; the build fails if a local poster file is missing), a card grid, and the full searchable list, with the coverage band above them. All of them follow the same filter, and the state lives in the URL hash (`media.html#trade&virginia`). Filtering by outlet also works (`#outlet=cnn`; CBS and ABC include their affiliates). The home page shows eight issue tiles (latest headline plus outlets), sorted by recency and linking to `media.html#<issue>`.
- Rows with a placeholder headline (`title-from-program` in notes, or under four words) are marked `weak`. They appear in the full list but never as the lead, a card or a tile. Writing real headlines into those rows promotes them automatically.
- `data/service.csv` holds committee service, offices, awards, refereeing, expert testimony and talks from the same Elements export — not rendered yet.
- `data/source/` holds the raw Elements exports; re-export from Elements and re-run the merge when adding a batch (see HANDOVER.md step 4).

## Teaching data
- Teaching figures and quotes on teaching.html are static and come from an analysis of SPOT reports kept privately in OneDrive/Tenure/FARs/TeachingEvals/_analysis. Never commit student comments or per-section scores to this public repo.
