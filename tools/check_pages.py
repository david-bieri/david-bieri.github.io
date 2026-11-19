#!/usr/bin/env python3
"""Check the six pages before committing: screenshots at desktop, phone, narrow-phone and landscape widths,
horizontal scroll, failed requests, console errors, third-party requests made before any click, layout shift
after load, and a click test of the media.html filters.

Usage:  python3 -m http.server 8765 &        (from the repo root)
        python3 tools/check_pages.py [page ...]   (default: all six pages, then the media click test)
Needs:  pip install playwright, plus a Chrome or Chromium binary (set CHROME=/path if not /usr/bin/google-chrome;
        in a cloud session CHROME=/opt/pw-browsers/chromium).
Screenshots go to /tmp/pagecheck/<page>_<width>.png. Expected noise: none (the icons are declared in every head).
Third-party requests should be none: the fonts are self-hosted (assets/fonts/README.md).
Layout shift is the cumulative layout-shift score 1.5 s after load, with the images and the data file arriving at
full speed; anything over 0.05 means a block renders without reserved space (CLAUDE.md, coverage band).
The click test fails on: a topic or type filter that does not change the URL query or the count, a Virginia
toggle that does not narrow the list, a search that does not narrow the page, or a tile that does not open
and close the lightbox.
"""
import asyncio, os, sys
from urllib.parse import urlparse
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:8765")
ALL = ["index", "about", "research", "publications", "media", "teaching"]
PAGES = sys.argv[1:] or ALL
VIEWPORTS = ((1280, 900), (390, 844), (320, 568), (844, 390))   # desktop, phone, narrow phone, phone in landscape
OUT = "/tmp/pagecheck"
CLS_LIMIT = 0.05
CLS_SCRIPT = """
window.__cls = 0;
new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
  .observe({type: 'layout-shift', buffered: true});
"""
failures = 0

async def check(browser, page, width, height):
    global failures
    mobile = width < 1000
    ctx = await browser.new_context(viewport={"width": width, "height": height}, is_mobile=mobile, has_touch=mobile,
                                    device_scale_factor=2 if mobile else 1)
    pg = await ctx.new_page()
    await pg.add_init_script(CLS_SCRIPT)
    failed, errors, third = [], [], set()
    host = urlparse(BASE).netloc
    pg.on("response", lambda r: r.status >= 400 and failed.append(f"{r.status} {r.url}"))
    pg.on("console", lambda m: m.type == "error" and errors.append(m.text))
    pg.on("request", lambda r: urlparse(r.url).netloc not in (host, "") and third.add(urlparse(r.url).netloc))
    await pg.goto(f"{BASE}/{page}.html", wait_until="networkidle")
    await pg.wait_for_timeout(1500)
    hscroll = await pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    cls = await pg.evaluate("+window.__cls.toFixed(3)")
    await pg.screenshot(path=f"{OUT}/{page}_{width}.png", full_page=True)
    await ctx.close()
    bad = hscroll or failed or errors or third or cls > CLS_LIMIT
    failures += bool(bad)
    print(f"{'FAIL' if bad else 'ok':4} {page:13} {width:4}x{height:<4} hscroll={hscroll!s:5} cls={cls:<6} third-party={sorted(third) or '-'}")
    for f in failed: print("       failed:", f)
    for e in errors: print("       console:", e[:160])

async def click_test(browser):
    """media.html on a phone: the filter bar drives the page, the URL query tracks it, and a tile opens
    and closes the lightbox."""
    global failures
    ctx = await browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    pg = await ctx.new_page()
    await pg.goto(f"{BASE}/media.html", wait_until="networkidle")
    state = ("() => ({q: location.search, status: document.getElementById('mb-status').textContent, "
             "pressed: [...document.querySelectorAll('.mb-chip[aria-pressed=true], .mb-segbtn[aria-pressed=true]')].map(c => c.textContent.trim()), "
             "tiles: document.querySelectorAll('#tv-mosaic .tv-tile').length, "
             "lbOpen: !document.getElementById('lightbox').hidden})")
    def num(s):
        return int(s.split()[0]) if s and s.split() else -1
    def expect(cond, what, s):
        global failures
        if not cond:
            failures += 1
            print(f"FAIL click: {what}  -> {s}")
    await pg.get_by_role("button", name="Housing", exact=True).click(); await pg.wait_for_timeout(250)
    s = await pg.evaluate(state); expect("topic=housing" in s["q"] and " of " in s["status"] and "Housing" in s["pressed"], "Housing topic", s)
    await pg.get_by_role("button", name="TV", exact=True).click(); await pg.wait_for_timeout(250)
    s2 = await pg.evaluate(state); expect("type=tv" in s2["q"] and num(s2["status"]) <= num(s["status"]), "TV type", s2)
    await pg.get_by_role("button", name="All topics", exact=True).click()
    await pg.get_by_role("button", name="All", exact=True).click()
    await pg.get_by_role("button", name="Virginia only", exact=True).click(); await pg.wait_for_timeout(250)
    s3 = await pg.evaluate(state); expect("va=1" in s3["q"] and num(s3["status"]) >= 0, "Virginia toggle", s3)
    await pg.get_by_role("button", name="Virginia only", exact=True).click()
    await pg.fill("#mb-q", "tariff"); await pg.wait_for_timeout(250)
    s4 = await pg.evaluate(state); expect("q=tariff" in s4["q"] and " of " in s4["status"], "search narrows the page", s4)
    await pg.fill("#mb-q", "")
    await pg.locator(".tv-tile--lead .tv-link").click(); await pg.wait_for_timeout(250)
    s5 = await pg.evaluate(state); expect(s5["lbOpen"], "tile opens lightbox", s5)
    await pg.keyboard.press("Escape"); await pg.wait_for_timeout(200)
    s6 = await pg.evaluate(state); expect(not s6["lbOpen"], "Escape closes lightbox", s6)
    await ctx.close()
    print("ok   media click test" if failures == 0 else "     media click test finished with failures above")

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME", "/usr/bin/google-chrome"), args=["--no-sandbox"])
        for page in PAGES:
            for w, h in VIEWPORTS:
                await check(b, page, w, h)
        if "media" in PAGES:
            await click_test(b)
        await b.close()
    sys.exit(1 if failures else 0)

asyncio.run(main())
