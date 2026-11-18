# Handover — david-bieri.github.io

Paste the block below as the first message in a Claude Code session opened in this repository. Run the session on David's own machine if possible: the cloud workspace can't reach outlet sites, which makes link checking slow.

---

Read CLAUDE.md (conventions) and SESSION_NOTES.md (state of the last session, 18 Nov 2026) first. This repo is my personal academic site: plain HTML/CSS/JS, a GitHub Pages user site, live at https://www.david-bieri.com. I am on the senior faculty market, so the site has to stay application-ready. Finish these items before any redesign. Do them in order, one branch and PR per step, and run `python3 tools/check_pages.py` (desktop + 390 px) before each commit.

0. **Merge state.** Check that PR #13 (media pass of 18 Nov) is merged. If it isn't, ask me before building on it.
1. **CNN Drive link.** Row `2820382` (CNN, 15 Mar 2025) links a Google Drive copy of CNN footage and is a featured card. Remove the `url`, keep the row and its quote, and note why — unless I tell you CNN agreed.
2. **Headshot and sharing image.** I'll name one of the `dsb*.png` / `dsb_vt*.jpeg` files in OneDrive `Media`. Crop it to 4:5 at ≥1000 px and save it as `assets/images/headshot.jpg`. Remove the "DB" placeholder. Add `og:image` / `twitter:image` to all six pages, plus `image` in the JSON-LD.
3. **Publications against the CV.** The CV is final (`cv/CV_DSBieri.tex`, PDF in `assets/docs/`). Make `assets/data/publications.js` match it: titles, venues, years, page numbers, status (forthcoming, working paper) and "Bieri, D." order. Keep the data-file format. List every change in the PR.
4. **Talks.** Render `data/service.csv` (talks, testimony, service) as a "Talks" list on research.html, using the same pattern as the media archive. My two recorded talks (Ashford, Jan 2021; affordable housing, Feb 2021) get the click-to-load player once I give you their YouTube/Vimeo/VTechWorks URLs. The catalogue is in OneDrive `Media/_catalogue`.
5. **Self-host the fonts.** Archivo and Source Serif 4 currently load from fonts.googleapis.com, the only third-party request on the site. Serve woff2 subsets from `assets/fonts/` (only the weights and styles in use) and remove the Google Fonts link from all six pages. Nothing should look different.
6. **Legacy assets.** Follow `legacy/README.md`. Bring the old site's PDFs and audio into `assets/docs/`. Add forwarding stubs for old URLs that are still linked from elsewhere, check every `legacy/docs/...` reference in the data files, and drop `docs/MiRTIF.zip` (it's a 404 upstream).
7. **Logos.** `python3 tools/prep_logo.py --check` lists the coverage-band outlets that are still typographic placeholders. Add official one-colour marks where the sources and permissions in `assets/logos/README.md` allow it.
8. **Google Scholar.** Open https://scholar.google.com/citations?user=l_KyksEAAAAJ in the browser (it rate-limits scripts). Note total citations, h-index and i10. Add a `cites` field to `publications.js` and render it discreetly after the venue.
9. **Media leftovers** (lower priority; see `data/MEDIA_CHANGELOG.md`):
   - the ~85 one-off URLs that haven't been checked;
   - the Kiplinger row (1 Apr 2025), which still links a research.vt.edu re-post;
   - KNX row `2396145`, which may be misdated (2023 vs 2024);
   - FOX 5 DC clip URLs for 15 Sep and 29 Oct 2026.

   The 13 remaining placeholder headlines need my memory, not a search.
10. **End the session** with the session-handover skill: rewrite SESSION_NOTES.md and this list.

After every media edit: `python3 tools/build_media.py`, then `python3 tools/build_cv_media.py > cv/media_section.tex`, then tell me to paste `media_section.tex` into Overleaf.

Do not:
- add a framework, a build step or analytics;
- commit video files;
- re-host station footage without the station's permission;
- change the title "Associate Professor of Public Policy, School of Public and International Affairs, Virginia Tech";
- redesign anything.

Design changes come later from a Design System artifact in the Website project; the current tokens in `main.css` are the baseline.

Later sessions (not now): the two sister sites, august-loesch.github.io and circular-flows.github.io, will share these tokens. Specs are in the Website project docs (`circular-flows-org-implementation.md`, `workflow-strategy.md`).

---
