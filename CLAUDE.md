# david-bieri.com — working notes for Claude Code

Personal site of David S. Bieri (Associate Professor of Public Policy, SPIA, Virginia Tech). GitHub Pages user site; custom domain via `CNAME`.

## Stack and conventions
- Plain HTML, one stylesheet (`assets/css/main.css`), one script (`assets/js/site.js`). No framework, no build step, no bundler, no analytics. Keep it that way.
- Content that changes often lives in data files, not markup:
  - `assets/data/media.js` — media appearances (`window.MEDIA`, `OUTLETS`, `TOPIC_LABELS`, `TYPE_LABELS`). Generated; see Media database below.
  - `assets/data/publications.js` — `window.PUBS`; `selected: true` puts it on the home page.
- Design tokens are the `:root` variables at the top of `main.css` (paper, ink, rule, red accent, link). Fonts: Archivo (headings, UI) and Source Serif 4 (body). Don't add typefaces or colors outside the token set.
- Title used everywhere: "Associate Professor of Public Policy, School of Public and International Affairs, Virginia Tech". Handles: X @space_economy, Instagram @raumwirtschaft. Email bieri@vt.edu.
- Structured data (Person/WebSite JSON-LD) is in `index.html`; keep it consistent with the Wikidata item and the SPIA page.
- Nav and footer are duplicated per page by hand; when they change, change all six pages (`index, about, research, publications, media, teaching`).

## Checks before committing
- Open each page at desktop and ~390px width; no horizontal scroll, filters on `media.html` work, console clean except the optional headshot.
- Every new media entry has `date` (YYYY-MM-DD), `outlet`, `type`, `topic` (one of the eight issues), `title`, `url`, and `va=yes` if it is a Virginia story or outlet.

## Open items
- `assets/images/headshot.jpg` and `assets/docs/CV_DSBieri.pdf` to be added by David.
- Verify `publications.js` against the CV; verify media URLs that still point at VT media-mentions pages.
- Migrate legacy david-bieri.com assets (PDFs, audio) into `assets/docs/` and add forwarding stubs for old URLs.

## Media database (added 17 Nov)
- **Source of truth is `data/media.csv`** (290 rows, 2014–2026). Edit it in Excel/Sheets or by hand, then run `python3 tools/build_media.py`, which regenerates `assets/data/media.js` and any missing `assets/logos/<slug>.svg` wordmarks. Never edit `media.js` directly.
- Columns are documented at the top of `tools/build_media.py`. `featured=yes` and `quote` drive the cards; `logo` is shared across network affiliates (`cbs-affiliate`, `abc-affiliate`, `fox-affiliate`).
- Logos are monochrome typographic wordmarks (`fill: currentColor`, invert in dark mode). To use a real mark, drop a monochrome SVG at `assets/logos/<slug>.svg`; the build script never overwrites an existing file.
- The media section is called **In the news** everywhere (nav, home, media.html). Every format is treated the same: tv shows as Watch, radio/podcast as Listen, print/online as Read.
- **Eight issues** (`topic` column): trade, money, prices, jobs, markets, housing, gov, world. Labels are in `TOPIC_LABELS` in `tools/build_media.py`; the build fails on any other value. `va` is a separate Virginia filter.
- `media.html` is a front page: issue chips plus a Virginia toggle, a lead story, four "Also recent" items, a card grid, the outlet wall, and the full searchable list. All of them follow the same filter, and the state lives in the URL hash (`media.html#trade&virginia`). The home page shows eight issue tiles (latest headline plus outlets), sorted by recency and linking to `media.html#<issue>`.
- Rows with a placeholder headline (`title-from-program` in notes, or under four words) are marked `weak`. They appear in the full list but never as the lead, a card or a tile. Writing real headlines into those rows promotes them automatically.
- `data/service.csv` holds committee service, offices, awards, refereeing, expert testimony and talks from the same Elements export — not rendered yet.
- `data/source/` holds the raw Elements exports; re-export from Elements and re-run the merge when adding a batch (see HANDOVER.md step 4).

## Teaching data
- Teaching figures and quotes on teaching.html are static and come from an analysis of SPOT reports kept privately in OneDrive/Tenure/FARs/TeachingEvals/_analysis. Never commit student comments or per-section scores to this public repo.
