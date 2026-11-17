# Legacy assets from the 2016 site

Download the old site's `docs/` and `images/` folders here so links in `assets/data/*.js` of the form `legacy/docs/...` resolve:

    cd legacy
    wget -r -np -nH --cut-dirs=0 -R "index.html*" https://www.david-bieri.com/docs/ https://www.david-bieri.com/images/

Expected: 27 files in docs/ (PDFs, one mp3, one mp4) and 5 in images/. `docs/MiRTIF.zip` is already 404 on the old host; drop that link.
After download, copy `images/Portrait_DSB_small.jpg` to `../assets/images/headshot.jpg` only as a stopgap — it is 2016-vintage and low resolution; replace with a current portrait.
