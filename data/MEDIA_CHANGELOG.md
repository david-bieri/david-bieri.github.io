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

# Headlines, Outlook pass and backfill check — 18 Nov 2026

## Headlines (42 placeholders → 13)
**From the outlet's own page (built-in browser, one approval per load), 14 rows:** Guardian 2017 (re-dated 7 → 8 Jun,
the publication date), MinnPost 2017, Roanoke Times 2018, Coin Rivet 2018, Investment Watch 2018, WFXR ×6
(2022–24; the site's bot wall blocked one video page until wfxrtv.com was allowed site-wide), WJLA Feb 2023,
Reckon 2023, Northern Virginia Daily 2024. Note `title-from-…` replaced by `headline from outlet page, 18 Nov 2026`.

**Pages that would not load, 4 rows:** Circa (site closed; headline confirmed from Sinclair syndication, URL blanked),
Earnest and Whiterock Locators (404, URL blanked), Washington Post Feb 2022 (403 to the browser pane, URL kept). The last
three carry the URL-slug wording, marked `unverified` in `notes`.

**From the Outlook Media folder, 11 rows** (no URL; `title` is a topic line, as for the 2026 FOX 5 rows):
Sky News Arabia 2 Mar 2023 (Swiss inflation and the franc), KNX 10 Mar / 12 Apr / 2 Jun 2023 and 11 Jul 2024
(jobs reports, CPI releases), WJLA 19 May 2023 (debt ceiling; inferred from the 16 May pitch that led to the booking),
WUSA 21 Sep 2023 (UAW strike; request dated 19 Sep), WSET 29 Sep 2023 (shutdown economics), WMAL and FOX 5 27 Mar
2024 and FOX 5 30 Mar 2024 (Key Bridge collapse; the 30 Mar topic is inferred from the thread). Each note says which
email the topic came from.

**Still placeholders, 13 rows:** KNUS ×8 (2019–21), NBC LX Apr 2022, FOX 5 Jun and Oct 2022 — the Media folder only
reaches back to Dec 2022 and the online archive has no media mail; FOX 5 4 May 2023 (booking and a TVEyes clip, no
topic); KNX 14 Nov 2023 (no 2023 thread; a KNX CPI interview was booked for 14 Nov 2024 — this row may be misdated).

## Topics (c)
Re-tagged on the rows that got a headline: Roanoke Times 2018 → markets; WFXR rate-hike clip → housing; WFXR inflation
clip, WJLA, KNX CPI ×2 → prices; WaPo rent piece → housing; Sky News Arabia → world; WJLA debt ceiling, WSET shutdown → gov;
Key Bridge rows (incl. the LiveNOW segment of 27 Mar 2024, for consistency) → trade. `jobs` is down from 58 to 44.

## Backfill Aug–Nov 2026 (b)
The Media folder has nothing after 21 Oct (USA Today source list, not an appearance). Inbox/mailbox searches (VT media
relations senders, "interview", outlet names) found no appearance after 30 Oct that isn't already in the file.
Checked and not added: ABC News Live 17 Aug (show cancelled the segment), WUSA9 6 Aug (declined, travelling), KNX 12 Aug
CPI request (no confirmation in the thread), an unread housing-market interview request of 26 Oct (left unread).
FOX 5 DC 15 Sep and 29 Oct: still no clip URL (fox5dc.com search and web search). The Gray car-affordability piece
(WBTV row, 24 Oct) was syndicated nationwide; the original at localnewslive.com is recorded in its note.

## Same day, after review
- `featured` re-curated to 10 national/international items (TIME ×2, The New Republic, CBS News ×2, Al Jazeera, SCMP,
  AP, WSJ, Marketplace); every quote checked against the article text. The previous 21 flags are cleared.
- Added `x-2026-08-12-knx` (KNX, July CPI report; confirmed by David). ABC News Live 17 Aug stays out (cancelled).
- Saved clips in OneDrive `Media` (catalogued in `Media/_catalogue`) confirmed four rows: WJLA 19 May 2023 (headline is
  now the on-air chyron, "Implications of the looming debt crisis"), KNX 28 Apr 2023, NewsNation 16 Jul 2026 and
  CNN 15 Mar 2025. A saved PDF confirmed the Washington Post 3 Feb 2022 headline (a syndicated Bloomberg column).
- Featured extended to 14: The Hill 30 Oct 2026 (quote from the article, supplied by David), NewsNation 16 Jul 2026 and
  CNN 15 Mar 2025 (quotes from the saved clips' transcripts), NerdWallet 30 Jul 2026. They render as the new
  "Selected interviews" grid on media.html (the cards had dropped out of the site in the front-page redesign).
- WDBJ7 22 Jan 2021: programme corrected to *WDBJ7 Evening News* (David).
- New optional columns `video`, `audio`, `poster`, `transcript`; 7 rows with an outlet-uploaded YouTube link (RTVI ×5,
  WFXR and WDBJ7 2017) now play on the page, loaded only on click.

# Outlook In-Place Archive pass — 18 Nov 2026 (evening)

The earlier pass only saw the live mailbox, whose Media folder starts in Dec 2022. The **In-Place Archive ›
Admin › Media** folder holds the rest: 433 messages, June 2016 – Nov 2022. All 429 readable messages were listed
with their preview text and about 30 were opened in full. 275 → 279 rows; placeholders 13 → 4.

## Placeholders resolved (9)
KNUS 16 Apr 2019 (Brexit; about 25 min live by phone), 1 May 2019 (Spanish general election), 15 Oct 2019
(Boris Johnson and the Brexit deadline), 23 Oct 2019 (after the Commons vote on the withdrawal bill), 5 Feb 2021
(Biden's economic plan; *inferred* from the invitation, which followed his FOX 5 segment on it), 9 Apr 2021
(Europe's third COVID wave), 9 Jun 2021 (inflation, jobs and Biden's economy); NBC LX 15 Apr 2022 (inflation and the
economy; live-to-tape for NBC Boston/LX); FOX 5 DC 16 Oct 2022 (butter shortage and supply-chain glitches).
Titles are topic lines from the booking emails, as for the other no-URL rows. Each note names the source.

## Still placeholders (4)
KNUS 4 Jun 2019 (booked for 3:30 p.m. MT; the thread has no topic); FOX 5 DC 16 Jun 2022 (see below); FOX 5 DC
4 May 2023 and KNX 14 Nov 2023 (after the archive's range; unchanged from the earlier pass).

## Added (4)
- FOX 5 DC, 5 Apr 2022 — Biden's extension of the student-loan pause (live Zoom at 5 p.m., confirmed by email).
- Commercial Observer, 10 Jul 2019 — "Can Commercial Real Estate Investment Truly Be Democratized?" (Chava Gourarie).
- WFIR, 10 Mar 2023 — "Stubborn inflation may mean more interest rate hikes" (found via a wfirnews.com search).
- KNUS, 27 Aug 2021 — Chuck and Julie Show (booked and Zoom link sent; topic inferred).

## Corrected
- WDBJ7 inauguration story re-dated 20 → 13 Jan 2017 (interview 13 Jan, clip circulated 14 Jan).
- WFIR daylight-saving row (28 Oct 2026) now has its story: "The debate over changing our clocks twice a year
  continues", posted 5 Nov.
- WSET 22 Jan 2021: the piece is by Sinclair's national reporter Leandra Bernstein, published on WSET's site;
  `program` now says so.
- WFIR 14 Jan 2021: the long-form In-Depth version (15 Jan) is recorded in `notes`.

## Needs David — not added
- **FOX 5 DC 16 Jun 2022** (row `2216170`, interviewer Lokay J): the archive has no booking for 16 Jun. It has two
  10:45 p.m. live hits that summer — 7 Jun (World Bank cuts its growth forecast, warns of stagflation) and 13 Jul
  (with Jim Lokay; a clip service and media relations both confirm it aired). The row is probably 13 Jul; the
  other date is then missing.
- Booked or interviewed, but no published piece found: Inman News (Marian McPherson, 6 Jul 2022, Brooke Amendment);
  Bloomberg (Suzanne Woolley, call 24 Jun 2022, follow-up to the 30% rent-rule column); Wall Street Journal (David
  Harrison, call 21 Feb 2020, HUD Location Affordability Index); Cardinal News (Dwayne Yancey, Zoom 23 Sep 2022,
  Smith Mountain Lake); Nexstar Digital (Michael Bartiromo, phone 9 Mar 2022, inflation).
- WFXR bookings with no story found: 22 Feb 2022 (gas prices, 4 p.m. confirmed), 11 Mar 2022 (U.S. ban on Russian
  imports, D'mon Reynolds), 13 Apr 2022 (inflation at a record high), 7 Jul 2022 (layoffs and recession). WSLS 7 Jul
  2022 (Boris Johnson's resignation) was offered the same day.
- WFIR stories that name only "a Virginia Tech professor": "Lack of Brexit deal being felt Virginia" (6 Feb 2019)
  and "VT Prof: New leaders could mean movement over Brexit" (6 Aug 2019). They follow his WFIR Brexit interviews of
  17 Jan and 25 Jul 2019; audio is on the pages.
- Requests that went unconfirmed or were declined: KNUS 3 and 21 Sep 2021 (Evergrande), WFIR 11 Jul 2022 (dollar–euro
  parity), FOX 5 9 Sep 2022 (declined; reporter asked to quote his emailed paragraph), Business Insider May 2022,
  Agência Estado Apr 2022 (shrinkflation), Fortune (Erik Sherman) May 2019.

## Same evening, after David's review (279 → 288 rows)
- FOX 5 DC row `2216170` re-dated 16 Jun → **13 Jul 2022** (David: it is the Jim Lokay segment). The 7 Jun segment
  (World Bank growth cut and stagflation warning) added as `x-2022-06-07-fox5`. Neither clip is findable on fox5dc.com.
- Interviews added from the archive: Inman (now with its article, published **31 May 2023**, "A squad of economists
  is waging a stealth war on America's '30% rule'"), Wall Street Journal 21 Feb 2020, Bloomberg 24 Jun 2022,
  Cardinal News 23 Sep 2022, Nexstar Media Wire 9 Mar 2022, WFXR 22 Feb, 11 Mar and 13 Apr 2022. Except Inman, none
  has a published piece or clip that could be found; titles are topic lines and the notes say so. Bloomberg's
  13 Sep 2022 piece on outdated money rules was checked (via the FA Magazine reprint) and does not quote him.
- WDBJ7 5 Mar 2026 row now has its story: "Roanoke family feels economic squeeze as grocery costs, inflation outpace
  wages" (found by web search).
- Not added (no booking confirmed): WFXR and WSLS 7 Jul 2022, KNUS Sep 2021, WFIR Jul 2022, and the two WFIR 2019
  Brexit stories that do not name him.
