#!/usr/bin/env python3
"""Check the six pages before committing: screenshots at desktop and phone width, horizontal scroll,
failed requests, console errors and third-party requests made before any click.

Usage:  python3 -m http.server 8765 &        (from the repo root)
        python3 tools/check_pages.py [page ...]   (default: all six pages)
Needs:  pip install playwright, plus a Chrome or Chromium binary (set CHROME=/path if not /usr/bin/google-chrome).
Screenshots go to /tmp/pagecheck/<page>_<width>.png. Expected noise: the missing headshot until it is added,
and fonts.googleapis.com until the fonts are self-hosted.
"""
import asyncio, os, sys
from urllib.parse import urlparse
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:8765")
PAGES = sys.argv[1:] or ["index", "about", "research", "publications", "media", "teaching"]
WIDTHS = (1280, 390)
OUT = "/tmp/pagecheck"

async def check(browser, page, width):
    pg = await browser.new_page(viewport={"width": width, "height": 900})
    failed, errors, third = [], [], set()
    host = urlparse(BASE).netloc
    pg.on("response", lambda r: r.status >= 400 and failed.append(f"{r.status} {r.url}"))
    pg.on("console", lambda m: m.type == "error" and errors.append(m.text))
    pg.on("request", lambda r: urlparse(r.url).netloc not in (host, "") and third.add(urlparse(r.url).netloc))
    await pg.goto(f"{BASE}/{page}.html", wait_until="networkidle")
    hscroll = await pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    await pg.screenshot(path=f"{OUT}/{page}_{width}.png", full_page=True)
    await pg.close()
    flag = "FAIL" if hscroll or failed else "ok"
    print(f"{flag:4} {page:13} {width:5}  hscroll={hscroll}  third-party={sorted(third) or '-'}")
    for f in failed: print("       failed:", f)
    for e in errors: print("       console:", e[:160])

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME", "/usr/bin/google-chrome"), args=["--no-sandbox"])
        for page in PAGES:
            for w in WIDTHS:
                await check(b, page, w)
        await b.close()

asyncio.run(main())
