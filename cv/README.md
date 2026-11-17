# CV

`CV_DSBieri.tex` is your February 2026 CV with four edits and the media section replaced by `\input{media_section}`.
`media_section.tex` is generated from `../data/media.csv` by `python3 tools/build_cv_media.py > cv/media_section.tex`.
Regenerate whenever the CSV changes; never edit `media_section.tex` by hand.

In the CV preamble, `\newcommand{\CVmediaRecent}{2}` prints only the two most recent years of media with a one-line
pointer to the online archive (recommended for job applications: ~1.5 pages). Omit the macro to print all years (~7 pages).

Edits made to the .tex (all reversible):
- header date → November 2026; title → "Associate Professor of Public Policy" (header and Academic appointments), matching SPIA, the website and the Wikidata/JSON-LD work
- `\bibitem[254]` → `[25]`; "under conctract" → "under contract"
- two dead `www-personal.umich.edu` links → `david-bieri.com/legacy/docs/...` (files land there in Claude Code step 1)
- `harvard` package: only `\harvarditem` is used, twice, in "in preparation"; consider `\item` instead and drop the package

Compiles with your font stack (EB Garamond, newtx, T2A); this container lacks those, so only the media section was test-compiled here.
