# Handover — david-bieri.github.io

Paste the block below as the first message in a Claude Code session opened in this repository.

---

Read CLAUDE.md first; it holds the conventions. This repo is my personal academic site (plain HTML/CSS/JS, GitHub Pages user site, custom domain david-bieri.com via CNAME). It was scaffolded in a cloud session on 17 Nov 2026 and is live at https://david-bieri.github.io/. The old site at https://www.david-bieri.com/ (2016, VT-hosted template) is still serving until DNS is switched. I am applying for an academic position; the site must be presentable within 36 hours, so finish the deploy items before any redesign.

Do these in order and commit after each:

1. **Legacy assets.** Follow `legacy/README.md`: wget the old site's `docs/` and `images/` into `legacy/`. Confirm every `legacy/docs/...` URL in `assets/data/publications.js` and `assets/data/media.js` resolves to a file. Remove the `docs/MiRTIF.zip` reference (404 upstream). Commit the files (largest is a 17 MB mp4; if it pushes the repo past taste, drop the mp4 and link the WDBJ page instead).
2. **Headshot and CV.** I will put `headshot.jpg` (4:5, ≥1000px) in `assets/images/` and `CV_DSBieri.pdf` in `assets/docs/`. If they are not there yet, use `legacy/images/Portrait_DSB_small.jpg` and `legacy/docs/CV_DSBieri_Web.pdf` as stopgaps and tell me.
3. **Reconcile publications against the CV.** Open the CV PDF, compare with `assets/data/publications.js`. The 2024 CJRES "Gesetz and Gestalt" entry, the 2026 Carriers-of-History status, and the chapter page numbers were reconstructed from RePEc and the old site — fix what the CV says differently. Keep the data-file format.
4. **Media database.** Source of truth is `data/media.csv` (273 rows from the Elements export, legacy site and the 2026 reconciliation; consolidated and link-checked 17 Nov, see `data/MEDIA_CHANGELOG.md`); `python3 tools/build_media.py` regenerates `assets/data/media.js` and logos, `python3 tools/build_cv_media.py > cv/media_section.tex` the CV section. Done on 17 Nov: duplicates merged, conventions standardized, 58 placeholder headlines recovered, 130 of 215 URLs checked (8 dead ones blanked), 17 rows re-tagged. Still to do, in this order: (a) 42 rows still carry `title-from-program` / `title-from-url` in `notes` — 24 have no URL (FOX 5 DC and KNUS live hits 2019–2023, KNX, WMAL, WJLA, WSET, WUSA9, Sky News Arabia, NBC LX) and need the Outlook "Media" folder; 18 have URLs that could not be fetched (Nexstar sites wfxrtv/wric block scripted fetches; one-off domains) — open each in a browser and write the headline into `title`, then clear the note; (b) the ~85 one-off URLs (one per domain) were not link-checked; (c) re-check `topic` on the 42 placeholder rows once they have headlines (`jobs`, 58 rows, is still the catch-all); (d) choose the `featured` set by hand: 10–12 items, national/international, with a strong `quote` each — currently 21 flagged, several 2026 items (TIME, The Hill, CBS News, NPR Throughline) have no quote; (e) backfill Aug–Nov 2026 from the Outlook "Media" folder — the two FOX 5 DC live hits (15 Sep, 29 Oct) have no clip URL and nothing after 30 Oct is in yet; (f) the Kiplinger row (1 Apr 2025) still links a `research.vt.edu` re-post.

5. **Logos.** The coverage band shows 16 outlets (`BAND` in `tools/build_media.py`); placeholders render as the outlet name. To add an official one-colour mark, run `python3 tools/prep_logo.py <file.svg> <slug>`; sources, permissions and the checklist are in `assets/logos/README.md`. `python3 tools/prep_logo.py --check` shows what is still missing.
5b. **Google Scholar.** Fetch https://scholar.google.com/citations?user=l_KyksEAAAAJ in the browser (it rate-limits scripts), note total citations / h-index / i10, and reconcile `publications.js` against the Scholar list; add citation counts as a `cites` field and render it discreetly after the venue.
5c. **Teaching.** A Teaching block (four figures, four anonymous SPOT quotes) is already on teaching.html. Raw evaluation data and comments are deliberately NOT in this public repo; they live in OneDrive/Tenure/FARs/TeachingEvals/_analysis. Do not add them.
6. **Visual check.** Headless screenshots of all six pages at 1280 and 390 px; compare to the look of the current commit. No horizontal scroll, filters work, console clean. Fix anything off. Then run a link check over the whole site.
7. **Go-live.** Confirm Settings → Pages is set to main / root and the custom domain field shows david-bieri.com. Give me the exact DNS records to enter at my registrar and tell me when to tick Enforce HTTPS. Do not touch DNS yourself.
8. **End the session** with the session-handover skill: write SESSION_NOTES.md with what was done, what is open, and what you would do next.

Do not: add a framework or build step; add analytics; change the title "Associate Professor of Public Policy, School of Public and International Affairs, Virginia Tech"; redesign anything. Design changes come later from a Design System artifact in the Website project; the current tokens in `main.css` are the baseline.

Later sessions (not now): the two sister sites, august-loesch.github.io and circular-flows.github.io, will share these tokens. Specs are in the Website project docs (`circular-flows-org-implementation.md`, `workflow-strategy.md`).

---
