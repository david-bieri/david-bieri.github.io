# Handover — david-bieri.github.io

Read `CLAUDE.md` first (conventions, media database, coverage band, clips). This file is the task list for the next Claude Code session. It is public: keep private matters out of it.

## Where things stand (18 Nov 2026, after PRs #26–#30)
- **Live at https://www.david-bieri.com** (GitHub Pages, branch `main`, root). `CNAME` = `www.david-bieri.com`. The bare `david-bieri.com` points at GitHub Pages, and GitHub 301-redirects it to www. HTTPS (Let's Encrypt, valid to 16 Feb 2027) covers both names. Keep www canonical, and don't add apex records in the Bluehost zone.
- **Title:** "Associate Professor of Urban Affairs" everywhere (see CLAUDE.md).
- **Design review (18 Nov, PRs #26–#29):** Impeccable, Motion and the taste skill reviewed the site; the must-fix, should-fix and polish groups are merged. CLAUDE.md records the conventions that came out of it (phone filter layout, reserved heights, no eyebrow labels, 14px floor for small text on phones, skills precedence). The report lives in the Claude session that ran it; its 32 findings are closed except the weak headlines below.
- **Follow-ups (PR #30):** skip links, theme-color, the 404 shell, sitemap dates, pushState filters, whole-page search, "Clear filters", DOIs in `publications.js`, the widened `check_pages.py`.
- **CV:** `cv/CV_DSBieri.tex` mirrors Overleaf, which is the ground truth. The PDF `assets/docs/CV_DSBieri.pdf` was compiled 18 Nov (19 pp.). `cv/media_section.tex` is generated and lists the two most recent years.
- **Media:** `data/media.csv` (275 rows) → `python3 tools/build_media.py` (writes `media.js` and `media-home.js`).
  - 16 weak rows remain (13 programme-only titles plus three topic lines); 14 items are `featured`; 7 rows play the outlet's own YouTube upload.
  - History: `data/MEDIA_CHANGELOG.md`.
- **Checks:** `python3 tools/check_pages.py` (with `python3 -m http.server 8765` running): four viewports, layout shift, and the media click test. It exits 1 on any failure.

## Tasks, in order (one branch and PR per task)
1. ~~**CNN Drive link.**~~ Done, by decision (18 Nov): the link was removed in PR #21, then restored in PR #24 at David's request. Row `2820382` keeps its Google Drive link as a deliberate exception (see CLAUDE.md, Clips). Don't remove it.
2. ~~**Self-host the fonts.**~~ Done (PR #22, 18 Nov): Archivo and Source Serif 4 are served from `assets/fonts/` (see its README), and screenshots match the Google-hosted version pixel for pixel. The site makes no third-party request before a click. The same day, PR #23 darkened `--ink-3` (light `#656A6F`, dark `#83898F`) to pass WCAG AA contrast.
3. **Talks and service.** Render `data/service.csv` as a Talks and Service page or section; design it in Claude Design first.
   - David's two recorded talks get the click-to-load player once he supplies their YouTube/Vimeo/VTechWorks URLs: the Ashford comments (Jan 2021) and "Thinking About Affordable Housing: How Theory Matters" (Feb 2021). Use the `-plus` versions.
   - The catalogue and transcripts are in OneDrive `Media/_catalogue`, not in this repo.
4. **Legacy assets.** The old files are on the Bluehost account and can no longer be fetched over the web. David downloads `public_html` (docs, images, audio) from cPanel; then copy what the redirect stubs and the CV link to into the repo, and check every old URL in `legacy/README.md`. Add forwarding pages for old URLs that are still linked from elsewhere (VT pages, old syllabi, Google Scholar), not only the ones the CV uses.
5. **Logos (to follow).** Start with `python3 tools/prep_logo.py --check`, which lists the band slots that are still text placeholders; TIME, CNN, AP and the WSJ matter most. As official one-colour marks arrive, run `python3 tools/prep_logo.py <file.svg> <slug>` (see `assets/logos/README.md`); the build flags each remaining placeholder with `wm: true` and the band stays a line of names until every slot is a mark, so a half-logo band cannot happen by accident.
6. ~~**Click-test script.**~~ Done (PR #30): `check_pages.py` now clicks an issue chip, the Virginia toggle, Back, a band name and the search box on media.html and checks the hash, the count and the On air row. A Watch button is not clicked (it would load YouTube).
7. **Google Scholar.** Pull citation counts and the h-index from https://scholar.google.com/citations?user=l_KyksEAAAAJ in the browser (it rate-limits scripts). Add them to the About page only if David agrees.
8. **Media leftovers** (lower priority):
   - the ~85 one-off URLs that haven't been checked;
   - the Kiplinger row (1 Apr 2025), which still links a research.vt.edu re-post;
   - KNX row `2396145`, which may be misdated (2023 vs 2024);
   - FOX 5 DC clip URLs for 15 Sep and 29 Oct 2026;
   - the SSRN link for the 2026 prediction-markets working paper, once David has the number.

   The 13 programme-only titles (KNUS ×8, FOX 5 ×3, NBC LX, KNX) need David's memory or the Outlook folder, not a search (checked again 18 Nov: nothing indexed). Writing a headline into `media.csv` promotes the row automatically; a short headline is accepted when the `notes` say where it was confirmed. Station clips David saved himself are not re-hosted without the station's permission (the CNN 15 Mar 2025 row is the one exception David chose).
9. **End the session** with the session-handover skill. Update `WEBSITE_SESSION_NOTES.md` in the Website project; `SESSION_NOTES.md` in this repo records the 18 Nov media session only.

## Running sessions
- **Check links on David's computer, not in the cloud.** The cloud sandbox can't reach outlet sites, and the environment service refused to add their hosts (18 Nov). Locally, use the built-in browser for WFXR, WRIC and Outlook. Expect bot walls on Nexstar video pages.
- **In a cloud session**, `tools/check_pages.py` needs `pip install playwright` and `CHROME=/opt/pw-browsers/chromium`; otherwise run the same checks through the Playwright MCP. The cloud proxy also blocks `www.david-bieri.com`, so confirm a deploy from the Actions tab or a phone, not with curl.
- **Skills:** `.claude/skills/` holds impeccable, motion and design-taste-frontend (SOURCES.md says how to run the taste checker, which needs a `--no-sandbox` Chrome wrapper in a container). Precedence is CLAUDE.md, then the skill, then habit.
- **One HANDOVER task per branch and PR.** Screenshots at 1280 and 390 px before each commit (CLAUDE.md). End with the session-handover skill.

After every media edit: `python3 tools/build_media.py`, then `python3 tools/build_cv_media.py > cv/media_section.tex`. Then David pastes `media_section.tex` into Overleaf.

Do not:
- add a framework, a build step or analytics;
- commit video files (GitHub rejects files over 100 MB; Pages sites are capped at 1 GB);
- change the title conventions in CLAUDE.md;
- redesign without a Claude Design pass. The tokens in `main.css` are the baseline.

Later sessions (not now): the sister sites august-loesch.github.io and circular-flows.github.io will share these tokens. Specs are in the Website project docs.
