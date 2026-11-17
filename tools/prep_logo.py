#!/usr/bin/env python3
"""Prepare an official outlet mark for the coverage band.

Usage:  python3 tools/prep_logo.py <downloaded.svg> <slug>        e.g.  ~/Downloads/npr.svg npr
        python3 tools/prep_logo.py --check                         list which band slots have real marks

What it does
  * refuses files with embedded raster images or scripts (an SVG that wraps a PNG is not a vector mark)
  * reports the colours used; warns if the mark is multi-coloured (get the one-colour version instead)
  * dark colours  -> fill="currentColor"   (follows the page: grey, darker on hover, light in dark mode)
  * white/knockout -> var(--paper)         (stays the page background, so cut-outs read correctly)
  * strips fixed width/height, keeps or builds a viewBox, drops editor metadata
  * writes assets/logos/<slug>.svg, replacing the typographic wordmark (build_media.py never overwrites it back)

Afterwards: open media.html locally (python3 -m http.server) and check the mark at desktop and phone width,
in light and dark mode. If it looks small, the source artboard has padding: crop it in the source file.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGOS = os.path.join(ROOT, "assets", "logos")
NAMED = {"black": "#000000", "white": "#ffffff", "none": None, "transparent": None, "currentcolor": None}
COLOR = r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:black|white)\b"


def to_rgb(c):
    c = c.strip().lower()
    if c in NAMED:
        c = NAMED[c]
        if c is None:
            return None
    if c.startswith("#"):
        h = c[1:]
        if len(h) in (3, 4):
            h = "".join(x * 2 for x in h[:3])
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    nums = re.findall(r"[\d.]+", c)
    return tuple(int(float(n)) for n in nums[:3]) if len(nums) >= 3 else None


def light(rgb):
    return rgb is not None and (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) > 200


def check():
    sys.path.insert(0, os.path.join(ROOT, "tools"))
    src = open(os.path.join(ROOT, "tools", "build_media.py"), encoding="utf-8").read()
    slugs = re.findall(r'\("([a-z0-9-]+)", "[^"]+", \[', src)
    for s in slugs:
        p = os.path.join(LOGOS, s + ".svg")
        txt = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
        kind = "missing" if not txt else ("wordmark (placeholder)" if "<text" in txt else "official mark")
        print(f"  {s:12s} {kind}")


def main():
    if len(sys.argv) == 2 and sys.argv[1] == "--check":
        return check()
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    path, slug = sys.argv[1], sys.argv[2]
    if not re.match(r"^[a-z0-9-]+$", slug):
        sys.exit("slug must be lowercase letters, digits and hyphens, e.g. npr, wapo, fox5")
    svg = open(os.path.expanduser(path), encoding="utf-8").read()
    if "<svg" not in svg:
        sys.exit("Not an SVG file.")
    if re.search(r"<image\b|data:image/", svg):
        sys.exit("This SVG embeds a raster image, so it is not a real vector mark. Look for a vector (SVG, EPS or PDF) version.")
    if re.search(r"<script\b|\bon[a-z]+\s*=", svg, re.I):
        sys.exit("This SVG contains scripts or event handlers; refusing it.")

    svg = re.sub(r"<\?xml[^>]*\?>|<!DOCTYPE[^>]*>|<!--.*?-->", "", svg, flags=re.S)
    svg = re.sub(r"<metadata\b.*?</metadata>|<sodipodi:[^>]*/>|<sodipodi:[^>]*>.*?</sodipodi:[^>]*>", "", svg, flags=re.S)

    found = {}
    for m in re.finditer(r"(?:fill|stroke|stop-color)\s*[:=]\s*[\"']?\s*(" + COLOR + ")", svg, re.I):
        rgb = to_rgb(m.group(1))
        if rgb is not None:
            found[rgb] = found.get(rgb, 0) + 1
    dark = [c for c in found if not light(c)]
    pale = [c for c in found if light(c)]
    print(f"colours: {len(dark)} dark, {len(pale)} light/white")
    if len(dark) > 1:
        print("WARNING: more than one ink colour. They will all become the same grey; if parts of the mark depend on\n"
              "         colour contrast, download the one-colour (black or white) version instead.")
    if "<linearGradient" in svg or "<radialGradient" in svg:
        print("WARNING: gradients found. Use a flat one-colour version of the mark.")

    def recolour(m):
        rgb = to_rgb(m.group(2))
        if rgb is None:
            return m.group(0)
        return m.group(1) + ("var(--paper, #fff)" if light(rgb) else "currentColor")
    svg = re.sub(r"((?:fill|stroke|stop-color)\s*[:=]\s*[\"']?\s*)(" + COLOR + ")", recolour, svg, flags=re.I)

    head = re.search(r"<svg\b[^>]*>", svg).group(0)
    new = head
    w = re.search(r'\swidth="([\d.]+)', head)
    h = re.search(r'\sheight="([\d.]+)', head)
    if "viewBox" not in head:
        if not (w and h):
            sys.exit("No viewBox and no numeric width/height; open and re-save the file from a vector editor.")
        new = new.replace("<svg", f'<svg viewBox="0 0 {w.group(1)} {h.group(1)}"', 1)
    new = re.sub(r'\s(?:width|height)="[^"]*"', "", new)
    if "fill=" not in new:  # unfilled paths default to black; make the default follow the page too
        new = new.replace("<svg", '<svg fill="currentColor"', 1)
    svg = svg.replace(head, new, 1).strip() + "\n"

    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).replace(",", " ").split()]
    out = os.path.join(LOGOS, slug + ".svg")
    replaced = os.path.exists(out)
    open(out, "w", encoding="utf-8").write(svg)
    print(f"wrote assets/logos/{slug}.svg ({'replaced wordmark' if replaced else 'new'}), "
          f"proportions {vb[2] / vb[3]:.2f}:1, {len(svg) // 1024 + 1} KB")


if __name__ == "__main__":
    main()
