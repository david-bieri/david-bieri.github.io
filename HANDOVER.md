# Handover — david-bieri.github.io

Paste the block below as the first message in a Claude Code session opened in this repository.

---

Read CLAUDE.md first; it holds the conventions. This repo is my personal academic site (plain HTML/CSS/JS, GitHub Pages user site, custom domain david-bieri.com via CNAME). It was scaffolded in a cloud session on 17 Nov 2026 and is live at https://david-bieri.github.io/. The old site at https://www.david-bieri.com/ (2016, VT-hosted template) is still serving until DNS is switched. I am applying for an academic position; the site must be presentable within 36 hours, so finish the deploy items before any redesign.

Do these in order and commit after each:

1. **Legacy assets.** Follow `legacy/README.md`: wget the old site's `docs/` and `images/` into `legacy/`. Confirm every `legacy/docs/...` URL in `assets/data/publications.js` and `assets/data/media.js` resolves to a file. Remove the `docs/MiRTIF.zip` reference (404 upstream). Commit the files (largest is a 17 MB mp4; if it pushes the repo past taste, drop the mp4 and link the WDBJ page instead).
2. **Headshot and CV.** I will put `headshot.jpg` (4:5, ≥1000px) in `assets/images/` and `CV_DSBieri.pdf` in `assets/docs/`. If they are not there yet, use `legacy/images/Portrait_DSB_small.jpg` and `legacy/docs/CV_DSBieri_Web.pdf` as stopgaps and tell me.
3. **Reconcile publications against the CV.** Open the CV PDF, compare with `assets/data/publications.js`. The 2024 CJRES "Gesetz and Gestalt" entry, the 2026 Carriers-of-History status, and the chapter page numbers were reconstructed from RePEc and the old site — fix what the CV says differently. Keep the data-file format.
4. **Media database.** Source of truth is `data/media.csv` (290 rows from the Elements export, legacy site and the 2026 reconciliation); `python3 tools/build_media.py` regenerates `assets/data/media.js` and logos. Do in this order: (a) 62 rows carry `title-from-program` in `notes` — they have no headline; where a URL exists, open it and write the real headline into `title`, then clear the note; (b) rows with `type=online` from `liberalarts.vt.edu` or `research.vt.edu` are VT re-posts; replace `url` with the outlet's own link where it exists; (c) run a link check over every `url`, and blank out dead ones (the renderer shows plain text when `url` is empty); (d) review the `topic` column — now the eight issues (trade, money, prices, jobs, markets, housing, gov, world) plus a `va` flag, re-tagged by keyword on 17 Nov; `jobs` (82 rows) is the catch-all for rows with placeholder headlines, so re-check those once real headlines are in; (e) choose the `featured` set by hand: 10–12 items, national/international, with a strong `quote` each. Pull quotes from the linked articles.
5. **Logos.** The wordmarks in `assets/logos/` are generated placeholders. For the top 20 outlets on the wall, replace with a real monochrome SVG mark only where usage is clearly permitted (press kits); otherwise keep the wordmark. Keep everything `currentColor`.
5b. **Google Scholar.** Fetch https://scholar.google.com/citations?user=l_KyksEAAAAJ in the browser (it rate-limits scripts), note total citations / h-index / i10, and reconcile `publications.js` against the Scholar list; add citation counts as a `cites` field and render it discreetly after the venue.
5c. **Teaching.** A Teaching block (four figures, four anonymous SPOT quotes) is already on teaching.html. Raw evaluation data and comments are deliberately NOT in this public repo; they live in OneDrive/Tenure/FARs/TeachingEvals/_analysis. Do not add them.
6. **Visual check.** Headless screenshots of all six pages at 1280 and 390 px; compare to the look of the current commit. No horizontal scroll, filters work, console clean. Fix anything off. Then run a link check over the whole site.
7. **Go-live.** Confirm Settings → Pages is set to main / root and the custom domain field shows david-bieri.com. Give me the exact DNS records to enter at my registrar and tell me when to tick Enforce HTTPS. Do not touch DNS yourself.
8. **End the session** with the session-handover skill: write SESSION_NOTES.md with what was done, what is open, and what you would do next.

Do not: add a framework or build step; add analytics; change the title "Associate Professor of Public Policy, School of Public and International Affairs, Virginia Tech"; redesign anything. Design changes come later from a Design System artifact in the Website project; the current tokens in `main.css` are the baseline.

Later sessions (not now): the two sister sites, august-loesch.github.io and circular-flows.github.io, will share these tokens. Specs are in the Website project docs (`circular-flows-org-implementation.md`, `workflow-strategy.md`).

---
