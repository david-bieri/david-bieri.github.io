# Fonts

Self-hosted since 18 Nov 2026; the site makes no request to Google Fonts. Both families are under the SIL Open Font License 1.1 (`OFL-Archivo.txt`, `OFL-SourceSerif4.txt`).

| File | Family, style | Subset | Source |
|---|---|---|---|
| `archivo-latin.woff2`, `archivo-latin-ext.woff2` | Archivo, normal, variable `wght` | latin, latin-ext | Google Fonts v25, unchanged |
| `source-serif-4-latin.woff2`, `-latin-ext`, `-cyrillic` | Source Serif 4, normal, variable `wght` + `opsz` 8–60 | latin, latin-ext, cyrillic | Google Fonts v15, unchanged |
| `source-serif-4-italic-latin.woff2`, `-latin-ext`, `-cyrillic` | Source Serif 4, italic 400, variable `opsz` 8–60 | latin, latin-ext, cyrillic | Google Fonts v15, unchanged |

- The `@font-face` rules are at the top of `assets/css/main.css`. They copy Google's CSS for `Archivo:wght@500;600;700` and `Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400`: one rule per weight and Google's `unicode-range` values, so a page downloads only the subsets its text needs (usually three files).
- Cyrillic is kept for Source Serif 4 because some media rows name Russian-language outlets. Archivo has no Cyrillic on Google Fonts, so Cyrillic in headings falls back to a system font, as before. Greek, Vietnamese and cyrillic-ext are dropped: no page uses them.
- Every file is byte-identical to what Google Fonts serves for the site's CSS2 request. Trimming the weight axis with fontTools was tried and dropped: it shifted Archivo's rendering by a few pixels, and Source Serif 4 reserves the name "Source", which the OFL doesn't allow on a modified copy. Google ships each style as one variable file, so the weights in use (Archivo 500/600/700, Source Serif 4 400/600, italic 400) can't be split further without modifying the fonts.
- Every page preloads `source-serif-4-latin.woff2` and `archivo-latin.woff2`.
- To add a weight or style: fetch the new CSS2 URL from fonts.googleapis.com with a current browser user agent, download the woff2 files it names, and add matching rules.
