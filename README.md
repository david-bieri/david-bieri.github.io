# david-bieri.com

Plain HTML/CSS/JS. No build step, no framework, no trackers.

## Deploy (GitHub Pages)
1. Create the repository `david-bieri/david-bieri.github.io` (public).
2. Copy everything in this folder into the repo root, commit, push to `main`.
3. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
4. DNS for david-bieri.com: four `A` records to 185.199.108.153 / .109.153 / .110.153 / .111.153, plus `CNAME www → david-bieri.github.io`. The `CNAME` file in this folder tells Pages the domain. Tick *Enforce HTTPS* once the certificate issues (minutes to an hour).

## Before pushing
- Drop a portrait at `assets/images/headshot.jpg` (4:5, ≥ 1000 px wide). Until then the hero shows initials.
- Drop the CV at `assets/docs/CV_DSBieri.pdf`.
- Check `assets/data/publications.js` against the CV (years and venues for the newer CJRES piece and the chapters were reconstructed from RePEc and the old site).
- Check `assets/data/media.js`: a few entries link to Virginia Tech's media-mentions page rather than the outlet; swap in the direct URL where you have it. The Oct 2024 CNN entry needs its URL.

## Editing
- Media appearances: add an object to `assets/data/media.js`. `featured: true` surfaces it on the home page and in "Selected appearances".
- Publications: `assets/data/publications.js`; `selected: true` puts it on the home page.
- Everything else is the HTML.
