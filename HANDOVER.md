# Handover — david-bieri.github.io

Read `CLAUDE.md` first (conventions, media database, coverage band, clips). This file is the task list for the next Claude Code session. It is public: keep private matters out of it.

## Where things stand (18 Nov 2026, after PR #13)
- **Live at https://www.david-bieri.com** (GitHub Pages, branch `main`, root). `CNAME` = `www.david-bieri.com`. The bare `david-bieri.com` points at GitHub Pages, and GitHub 301-redirects it to www. HTTPS (Let's Encrypt, valid to 16 Feb 2027) covers both names. Keep www canonical, and don't add apex records in the Bluehost zone.
- **Title:** "Associate Professor of Urban Affairs" everywhere (see CLAUDE.md).
- **CV:** `cv/CV_DSBieri.tex` mirrors Overleaf, which is the ground truth.
  - The PDF `assets/docs/CV_DSBieri.pdf` was compiled 18 Nov with EB Garamond: 19 pp., 0 overfull boxes.
  - `cv/media_section.tex` is generated and lists the two most recent years. The full archive lives on media.html.
- **Media:** `data/media.csv` (275 rows) → `python3 tools/build_media.py`.
  - 13 placeholder headlines remain.
  - 14 items are `featured`, shown in the "Selected interviews" grid on media.html.
  - 7 rows play the outlet's own YouTube upload through the click-to-load player.
  - History: `data/MEDIA_CHANGELOG.md`.
- **Headshot and publications:** done 18 Nov (PRs #14 and #11).
- **Checks:** `python3 tools/check_pages.py` (with `python3 -m http.server 8765` running) screenshots all six pages at 1280/390 px. It flags horizontal scroll, failed requests, console errors and third-party requests. The only third-party request left is Google Fonts.

## Tasks, in order (one branch and PR per task)
1. **CNN Drive link.** Row `2820382` (CNN, 15 Mar 2025) links a Google Drive copy of CNN footage, and it is a featured card. Remove the `url`, keep the row and its quote, and note why — unless David says CNN agreed.
2. **Self-host the fonts.** Archivo and Source Serif 4 load from fonts.googleapis.com, the only third-party request on the site. Serve woff2 subsets from `assets/fonts/` (only the weights and styles in use) and drop the Google Fonts link from all six pages. Nothing should look different.
3. **Talks and service.** Render `data/service.csv` as a Talks and Service page or section; design it in Claude Design first.
   - David's two recorded talks get the click-to-load player once he supplies their YouTube/Vimeo/VTechWorks URLs: the Ashford comments (Jan 2021) and "Thinking About Affordable Housing: How Theory Matters" (Feb 2021). Use the `-plus` versions.
   - The catalogue and transcripts are in OneDrive `Media/_catalogue`, not in this repo.
4. **Legacy assets.** The old files are on the Bluehost account and can no longer be fetched over the web. David downloads `public_html` (docs, images, audio) from cPanel; then copy what the redirect stubs and the CV link to into the repo, and check every old URL in `legacy/README.md`. Add forwarding pages for old URLs that are still linked from elsewhere (VT pages, old syllabi, Google Scholar), not only the ones the CV uses.
5. **Logos.** Start with `python3 tools/prep_logo.py --check`, which lists the band slots that are still text placeholders; TIME, CNN, AP and the WSJ matter most. As official one-colour marks arrive, run `python3 tools/prep_logo.py <file.svg> <slug>` (see `assets/logos/README.md`). Don't switch on a half-logo, half-name band.
6. **Click-test script.** Add `tools/click_test.py` next to `check_pages.py`: on media.html, click each issue chip, the Virginia toggle, an outlet mark and a Watch button, then confirm the hash, the row count and that the On air row matches the filter. Today these clicks are done by hand in every session.
7. **Google Scholar.** Pull citation counts and the h-index from https://scholar.google.com/citations?user=l_KyksEAAAAJ in the browser (it rate-limits scripts). Add them to the About page only if David agrees.
8. **Media leftovers** (lower priority):
   - the ~85 one-off URLs that haven't been checked;
   - the Kiplinger row (1 Apr 2025), which still links a research.vt.edu re-post;
   - KNX row `2396145`, which may be misdated (2023 vs 2024);
   - FOX 5 DC clip URLs for 15 Sep and 29 Oct 2026;
   - the SSRN link for the 2026 prediction-markets working paper, once David has the number.

   The 13 remaining placeholders need David's memory, not a search. Station clips David saved himself are not re-hosted without the station's permission.
9. **End the session** with the session-handover skill. Update `WEBSITE_SESSION_NOTES.md` in the Website project; `SESSION_NOTES.md` in this repo records the 18 Nov media session only.

## Running sessions
- **Check links on David's computer, not in the cloud.** The cloud sandbox can't reach outlet sites, and the environment service refused to add their hosts (18 Nov). Locally, use the built-in browser for WFXR, WRIC and Outlook. Expect bot walls on Nexstar video pages.
- **In a cloud session**, `tools/check_pages.py` needs `pip install playwright` and `CHROME=/opt/pw-browsers/chromium`; otherwise run the same checks through the Playwright MCP.
- **One HANDOVER task per branch and PR.** Screenshots at 1280 and 390 px before each commit (CLAUDE.md). End with the session-handover skill.

After every media edit: `python3 tools/build_media.py`, then `python3 tools/build_cv_media.py > cv/media_section.tex`. Then David pastes `media_section.tex` into Overleaf.

Do not:
- add a framework, a build step or analytics;
- commit video files (GitHub rejects files over 100 MB; Pages sites are capped at 1 GB);
- change the title conventions in CLAUDE.md;
- redesign without a Claude Design pass. The tokens in `main.css` are the baseline.

Later sessions (not now): the sister sites august-loesch.github.io and circular-flows.github.io will share these tokens. Specs are in the Website project docs.
