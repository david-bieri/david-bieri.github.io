# media.csv — consolidation of 17 Nov 2026

`data/media.csv` went from 290 to 273 rows. The source files were the Elements export (numeric `id`), the
legacy-site rows and the 24-row 2026 additions draft (`media_additions_2026.csv`, `x-…` ids). The additions
had already been appended on 17 Nov; this pass reconciled the two vocabularies and removed the overlap.
Both build scripts (`tools/build_media.py`, `tools/build_cv_media.py`) run clean on the result.

## Field conventions now in force (documented at the top of `tools/build_media.py`)

| field | convention |
|---|---|
| `id` | Elements activity ID for exported rows; `x-YYYY-MM-DD-<logo>` for hand-added rows. Never renumbered. |
| `outlet` | one spelling per outlet; affiliates as `CALL (NET[ City])`, networks as the brand (`CBS News`, `FOX News`) |
| `logo` | lowercase, no hyphens, except `*-affiliate` shared slugs |
| `type` | medium follows the outlet: radio stations → `radio`, FOX 5 clip pages → `tv`, even where Elements said `online` |
| `topic` | the eight site issues only. The additions draft's `energy`→`world`, `inflation`→`prices`, `prediction-markets`→`markets`, `politics-policy`/`macro`/`economy`→`gov` |
| `va` | `yes` for every Virginia station/paper row; VT News rows only when the story is about Virginia |
| `scope` | Title case; filled from `tier` where the additions left it blank |
| `tier` | lowercase; 14 blanks filled (see below) |
| `url` | direct outlet link; trailing `?` stripped; landing pages and translate proxies removed |
| `interviewer` | `Surname I` |
| `notes` | provenance; `merged duplicate <id>` marks a consolidation |

## Duplicates merged (17)

The additions draft re-entered stories that the Elements export already held, usually with a better title or quote.
The Elements row was kept (stable id) and the better fields folded in:

- `x-2026-02-20-cbs-affiliate` → `3449928` (WUSA9, tariff whiplash)
- `x-2026-01-14-vt` → `3449926` (VT News, Fed independence; featured + quote taken)
- `x-2024-12-09-ap` → `2695820` (AP, Nvidia; featured taken)
- `x-2024-07-09-cbs` → `2622565` (CBS MoneyWatch; quote taken; outlet now `CBS News`/`cbs`)
- `x-2024-05-15-marketplace` → `2591379` (featured + quote taken; headline restored)
- `x-2024-03-28-fox` → `2586737` (LiveNOW, Baltimore bridge — aired 27 Mar)
- `x-2023-10-18-bi` → `2366008` (Business Insider; type → online)
- `x-2023-06-12-money` → `2622563` (Money, Dollar Scholar)
- `x-2023-04-28-knx` → `2307664` (KNX)
- `x-2025-04-30-marketplace` → `2833390`
- `x-2025-04-08-scmp` → `2824437` (SCMP; quote taken)
- `x-2019-12-13-knus`, `x-2019-11-15-knus` → `1560958`, `1560959` (KNUS; titles and Podbean URLs taken)
- `x-2017-01-20-fox-affiliate` → `1099112` (WFXR; virginiafirst.com link kept in notes)
- `x-2017-01-20-cbs-affiliate` → `1099111` (WDBJ7 inauguration; the YouTube upload was dated 23 Jan, row re-dated to the 20th)
- `2697572` → `2820355` (Roanoke Star, same article filed once as print and once as online)
- `2307677` → `2245094` (WFXR four-day workweek, same URL under two dates; 15 Mar 2023 kept)

Kept as separate rows on purpose: Newswise and Futurity republications of VT News Q&As (noted as such),
and the two Earnest rent articles (2015 and 2017 are different pieces).

## Misattributed outlets corrected

- Five "CBS" rows whose programme was WDBJ7 → `WDBJ7 (CBS Roanoke)`; one "CBS" row pointing at wset.com → `WSET (ABC)`
- "The Roanoke Times" row that is a WFXR segment → `WFXR (FOX)`; the Roanoke Star rows → `The Roanoke Star`
- "DW" row that is a NerdWallet article → `NerdWallet`; "Money" row on moneysense.ca → `MoneySense (Canada)`
- `WAVY (ABC)` → `WAVY (NBC)` (`nbc-affiliate`); "WIRC" → `WRIC (ABC)`; WSET programmes labelled "13 News Now" (WVEC's brand) → `ABC 13 News`
- `Curious Conversations` → `Virginia Tech News` (podcast kept as `program`); `Washington Examiner (Business)` → `Washington Examiner`
- Spelling variants unified: WFXR (FOX), KNX News 97.1 Los Angeles, WUSA9 (CBS), FOX News, Earnest, Augusta Free Press (`augustafreepress`), Sky News Arabia, WMAL (Washington, DC)

## Other fixes

- Logo slugs renamed and orphaned generated SVGs removed: afp, wirc-abc-8-richmond, wmal-fm-washington-d-c, wrva-news-radio, skynews-arabia-dubai, alaraby-tv, reckon-news, northern-virginia-daily, investment-watch-blog, coin-rivet, earnest-com, american-banker. New slugs: roanokestar, moneysense, michiganradio (Michigan Public Radio is not NPR).
- Truncated Elements titles completed (Assets, Public News Service, Asharq Bloomberg, FinTech TV); Alaraby TV title translated from the Arabic URL slug.
- Interviewer typos: Mullet, Wells, Chenevey, Blodgett, Stanton, Jean-Baptiste.
- `tier` filled for 14 rows (Washington Examiner, American Banker, WMAL, Northern Virginia Daily, Alaraby, Reckon, WRVA, Sky News Arabia, NBC LX, KNUS ×3, Circa, Investment Watch, Coin Rivet, Earnest, MinnPost); `scope` filled for Phoenix TV and one WFXR row.
- URLs: EFN Google-Translate proxy → efn.se; generic landing pages blanked (Public News Service, CNN 23 Oct 2024 — still needs its real link).
- Topic re-tags on two 2026 rows: NPR Virginia debt debate `jobs`→`gov`; New Republic Ohio race `prices`→`gov`.
- File sorted by date descending.

## Still open (unchanged from HANDOVER.md)

100 rows still carry `title-from-url` / `title-from-program` and need real headlines; `jobs` (74) remains the
catch-all for those. Several `online` rows still link to liberalarts.vt.edu / research.vt.edu re-posts rather than
the outlet. The `featured` set (21) has not been re-curated.

# Headline recovery and link check — 17 Nov 2026 (second pass)

## What was checked
130 of the 215 URLs were opened: all 123 on the sixteen most frequent domains (fox5dc, wfirnews, news.vt.edu,
wfxrtv, wsls, youtube, wdbj7, wvtf, virginiabusiness, audacy, wset, marketplace, wric, 13newsnow, newswise,
wallethub) via the browser pane, plus seven one-off pages confirmed through search. Nexstar sites (wfxrtv, wric)
block programmatic fetches after the first page, so 12 of their URLs returned 403 and are **unverified, not dead**.
The remaining ~85 one-off URLs (one per domain) were **not checked**; nothing suggests they are dead.

## Headlines
- 58 placeholder rows now carry the outlet's real headline and the `title-from-*` note is cleared (19 FOX 5 DC
  clips, 14 WFIR, 9 WSLS, 7 WDBJ7, 6 WVTF, 5 RTVI, Marketplace, VT News, WalletHub, American Banker, TND, WSJ).
- RTVI rows: the YouTube titles are the whole programme's Russian headline; they are given in English translation,
  marked "(live US-economy segment)", because the CV generator strips non-Latin text. Programme name stays in `program`.
- 42 placeholders remain: 24 with no URL (FOX 5 DC and KNUS live hits 2019–2023, KNX, WMAL, WJLA, WSET, WUSA9,
  SkyNews Arabia, NBC LX) and 18 whose pages could not be fetched (Nexstar 403s and one-off domains). For these the
  Outlook "Media" folder is the only remaining source.

## Dead links (URL blanked, note added)
- KNX/Audacy episode pages for 2023-11-14, 2024-07-11 and 2026-04-10 (Audacy removed the episode archive)
- KNUS YouTube uploads for 2021-02-05 and 2021-04-09 (videos removed)
- WVEC 13News Now DST video, 2026-10-15 (TEGNA video page redirects to 404)
- WalletHub renters page (2020) and mortgage-calculator page (2016): pages live but the expert panel has rotated and
  no longer carries his commentary

## URLs updated to their current location
Marketplace (4 rows → `/story/…` canonical URLs), WVTF 2018 `/post/…` (2 rows → `/news/2018-05-…`), Virginia
Business `/article/the-prophet/` → `/the-prophet/`, one tracking parameter stripped.

## Row corrections surfaced by the check
- `2307673` (15 May 2023, "VT professor explains debt ceiling") is a WDBJ7 story, not WSLS — outlet/logo corrected.
- The wset.com URL on `3430872` (2 Mar 2026) is actually the 25 Mar article; moved to `x-2026-03-25-abc-affiliate`
  with its headline. The 2 Mar segment has no URL.
- 17 rows re-tagged from `jobs` into the issue their headline shows (Fed decisions → money, OPEC/gas → world, etc.).
  `jobs` is down from 74 to 58.

## Step 3 (VT re-post URLs)
Only one row still linked to a VT re-post: Kiplinger 1 Apr 2025 (`research.vt.edu`). Kiplinger's own URL was not found;
left as is. The liberalarts.vt.edu links were all on duplicate rows removed in the first pass.
