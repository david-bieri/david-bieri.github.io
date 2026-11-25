# Session notes — 18 Nov 2026, evening (On-air mosaic merged, repo tidy)

**Last session:** 2026-11-18
**Topic:** merged the Media page redesign, removed the intake folder from main, set up the GitHub CLI, pruned branches
**Horizon:** site must stay application-ready (senior faculty search, 2026–27 cycle)

Project configuration: as in the "media database, clips, CV PDF" block below. Dispatch is now `gh` from this machine (see §3).

## 1. Completed
- ✓ PR #36 `feat/on-air-mosaic` → main: the Media page redesign (server-rendered media.html, one filter bar with state in the URL, Selected television mosaic, Selected coverage, year-grouped archive, lightbox). Check before merge: all six pages pass at four widths, CLS 0.
- ✓ PR #35 `intake/stills-2026-11-18` → main (merged by mistake alongside #36); undone by ✓ PR #37 `chore/remove-intake`, which deletes `intake/` from main. The raw stills stay on the intake branch and in history.
- ✓ GitHub CLI 2.105.0 installed and logged in as `david-bieri` (keyring). `gh pr create` works.
- ✓ Branches: 36 merged branches deleted on GitHub. Left: `main` and `intake/stills-2026-11-18`. Local: `main` only.

## 2. Pending dispatch
- **GitHub:** delete `intake/stills-2026-11-18` once the held stills (§5) are decided: `git push origin --delete intake/stills-2026-11-18`.
- **Browser:** look at the live www.david-bieri.com/media.html on a phone and on desktop after the Pages deploy (not yet done).
- **GitHub:** decide on `claude/upbeat-edison-88l4p0` (one commit, e5cf412, 20 Nov, from another session): it vendors the "UI UX Pro Max" skill 2.15.0 into `.claude/skills/` (51 files, about 64,000 lines; no site pages touched). Not merged. If kept, add it to `.claude/skills/SOURCES.md` and the Design skills list in CLAUDE.md; if not, delete the branch.

## 3. Decisions
- **Intake branches are never merged to main.** Raw material goes onto the live site the moment it reaches main; process it on a feature branch into `assets/` instead.
- **`gh` is installed on this machine.** In a Claude Code session started before the install, add `C:\Program Files\GitHub CLI` to PATH or restart. The claim "GraphQL is blocked" in the config below applied to the earlier environment; `gh pr create` reached GraphQL here.
- **Before deleting branches, test each one with `git merge-base --is-ancestor origin/<b> origin/main`.** A count-based filter wrongly reported three merged branches as unmerged this session.

## 4. Latent issues
- Running `tools/build_media.py` on Windows rewrites `media.html` with LF endings, so git shows it as changed with no content diff. Discard it (`git checkout -- media.html`) or add a `.gitattributes` rule.

## 5. Open questions (David, deferred)
1. Stills for TV rows 3507577 (The Hill/NewsNation, 2026-07-16) and 3298072 (CNN, 2025-11-20). Should 3298072 be featured?
2. A clean frame for 2215064 (its still has a play button baked in).
3. `video`/`audio` URLs: the columns are empty, so the page has no Play buttons.
4. Real headlines for 2396145, 2307674, 2216170 and 1559416 (title equals the programme, so they are marked weak).
5. Held items on the intake branch: the Phoenix Warsh frame, the FOX 5 DC alternatives, two VT photos, the 2026-05-01 "Dr. David Bieri" screenshot, the Blacksburg Symposium photo. Use or drop each.
- Also open: legacy david-bieri.com PDFs and audio → `assets/docs/` with forwarding stubs; check media links that still point at VT media-mentions pages.

## 6. Suggested next session
"Read SESSION_NOTES.md, then process open questions 1–5 with me (I'll supply stills, links and headlines)." If David has no assets ready: "Read SESSION_NOTES.md, then start the legacy-asset migration in HANDOVER.md."

---

# Session notes — 18 Nov 2026 (design review and fixes)

**Topic:** three-skill design review (Impeccable, Motion, design-taste-frontend), then four fix groups and follow-ups
**PRs:** #26 skill vendored · #27 must-fix · #28 should-fix · #29 polish · #30 follow-ups (all merged to `main`)

## Completed
- Review published as a Claude artifact (32 findings: 8 must, 14 should, 10 polish, plus rejected advice and an iPhone checklist).
- Must-fix: `[hidden]` cascade bug, reserved heights (media.html layout shift 0.82 → 0.05), anchors clear the sticky header, phone filter strip with Virginia and the outlet chip pinned, 16px search field, 44px targets, band taps scroll to results, dark red #F25A4E.
- Should-fix: band as a line of names without SVG fetches, 14px floor for small text on phones, archive rows keep verb and issue, no hollow cards, shorter roles line, measure caps, live region on the scope line, menu Escape/outside tap, `media-home.js` (33 KB) and a 115 KB headshot, og tags on every page, "CV (PDF)", archive paged to 25 rows, programme dedupe in the build, site icons, heading sizes.
- Polish: no kickers or arrows, teaching figures as a sentence and quotes as a list, Education list, balanced headings, dead code and inline styles gone, new-tab notes, landscape header, menu button below 900px.
- Follow-ups: skip link, theme-color, 404 shell, sitemap lastmod, pushState filters (Back undoes one step), search narrows the whole page, "Clear filters" chip, named empty states, DOIs (12, from the CV and publishers), Chloe Hurren named in full, `check_pages.py` widened (four viewports, layout shift, click test).

## Decisions
- Skills precedence: CLAUDE.md, then the skill's specific guidance, then Claude's habits (recorded in CLAUDE.md).
- The taste skill is vendored without its photo, scene, object and icon libraries (40 MB → 3.3 MB).
- Filters use `pushState`; the search box narrows every block on media.html, not only the archive.
- The HPD 2017 "cataclysmic money" link now uses the CV's DOI (10.1080/10511482.2017.1298211); the old link carried a different DOI.

## Open
- 16 weak rows (13 programme-only titles): David's memory or the Outlook folder.
- Band logos: all 16 slots are placeholders until marks arrive (HANDOVER task 5).
- iPhone Safari checks that Chromium cannot do: the search field must not zoom, a band name must select on one tap.
- DOIs not found for the Journal of Fixed Income 2005 article and the Michigan Journal of Sustainability 2013 article; the remaining chapters have no chapter DOI on record.
- The CV in Overleaf does not yet list the DOIs added here for CJRES 2023, the Springer 2017 chapter and the Routledge 2021 chapter.

---

# Session notes — 18 Nov 2026 (media database, clips, CV PDF)

**Last session:** 2026-11-18
**Topic:** media.csv headlines and backfill, featured curation, Latest strip, clip player, CV recompile, OneDrive Media catalogue
**Horizon:** site must stay application-ready (senior faculty search, 2026–27 cycle)

---
## Project configuration
**Prefix:** (none; this file is `SESSION_NOTES.md` in the repo root)
**Registry:** `CLAUDE.md` (conventions), `HANDOVER.md` (ordered work list), `data/MEDIA_CHANGELOG.md` (media history)
**Dispatch:**
  → GitHub: branch → PR → merge (`gh api -X PUT repos/david-bieri/david-bieri.github.io/pulls/N/merge`; GraphQL is blocked)
  → Overleaf: paste `cv/media_section.tex` after every media rebuild (Overleaf is the CV source of truth)
  → OneDrive `Media/_catalogue`: catalogue, transcripts, posters of David's saved clips (not in this repo)
---

## 1. Completed this session
- ✓ PR #13 (branch `media-headlines-backfill-nov2026`), merged into main after reconciling with PRs #9–#16:
  - 29 of 42 placeholder headlines recovered (outlet pages, the Outlook "Media" folder, saved clips); `jobs` 58 → 44.
  - Aug–Nov 2026 checked: only KNX 12 Aug added (confirmed by David). Featured set re-curated to 14, each quote checked against its source.
  - New "Selected interviews" grid on media.html. Home **Latest** strip rebuilt as 3 wrapping items.
  - Click-to-load clip player and `video`/`audio`/`poster`/`transcript` columns; 7 rows play the outlet's own YouTube upload.
  - CV PDF recompiled with EB Garamond (19 pp., 0 overfull) → `assets/docs/CV_DSBieri.pdf`.
  - `tools/check_pages.py`: screenshots at 1280/390 plus hscroll, failed-request and third-party checks.
- ✓ OneDrive `Media/_catalogue`: `README.md`, `catalogue.csv`, 10 machine transcripts, posters, contact sheets.

## 2. Pending dispatch
**Overleaf** — paste `cv/media_section.tex` from the merged main.
**David** — upload the two `-plus` talk videos (Ashford, Jan 2021; Affordable housing, Feb 2021) to YouTube, Vimeo or VTechWorks and send the URLs.

## 3. Decisions made this session
- **CV lists two years of media in full; the rest lives on the website**, linked from the CV.
- **The `-plus` talk videos are final.**
- **Never commit video to the repo.** Embed outlet uploads; link live station pages.
- **Station footage David saved is not re-hosted without the station's permission.**
- **Third-party players load only on click** (youtube-nocookie, Vimeo `dnt=1`).
- **No-URL rows get a topic line as `title`**, sourced in `notes`; inferred topics say "inferred".
- **Featured cards show the outlet name, not the wordmark.** Placeholder SVGs scale unevenly.

## 4. Latent issues surfaced
- The CNN 15 Mar 2025 row links a Google Drive copy of CNN footage, and it now sits on a featured card. Remove the link unless CNN agrees.
- KNX row `2396145` (14 Nov 2023) may be misdated. The only matching KNX booking is for 14 Nov 2024.
- 13 placeholder headlines remain: KNUS ×8, NBC LX 2022, FOX 5 2022 ×2, FOX 5 4 May 2023, KNX Nov 2023. Mail before Dec 2022 isn't in Outlook.
- Two headlines come from URL slugs and are marked unverified (Earnest 2017, Whiterock 2020; both pages are 404).
- Google Fonts is the only third-party request on every page.

## 5. Open questions
- Remove the CNN Drive link now?
- Ask the stations (via VT Media Relations) for permission to post the saved WJLA, NewsNation, CNN and KNX clips?

## 6. Suggested next session
"Read CLAUDE.md and HANDOVER.md, then do task 1 (CNN Drive link) and task 2 (self-host the fonts)." Headshot and publications were finished in parallel PRs #14 and #11; PR #13 was merged on top of them.
