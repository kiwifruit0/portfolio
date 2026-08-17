#!/usr/bin/env python3
"""Recolour the backdrop wallpaper for every colorscheme.

The source artwork is indexed pixel art with a six-colour palette, so recolouring
it is exact and free: keep every pixel index, swap the palette. Each theme maps
the six shades (ordered dark to light) onto its own ramp. Doing this at build
time avoids blending a 4K image in the compositor on every paint.

Run from the repo root:  python3 scripts/build-backdrops.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src" / "assets" / "nord-pixel.png"
OUT_DIR = ROOT / "src" / "assets" / "backdrops"

# theme -> (darkest, lightest). The six source shades are spread evenly between
# them. The light theme ramps the other way, which inverts the artwork without
# muddying its hue.
RAMPS = {
    "tokyonight": ("#14151f", "#414a72"),
    "gruvbox": ("#1e1c1a", "#574c3c"),
    "catppuccin": ("#14141f", "#454764"),
    "rose-pine": ("#181524", "#40395c"),
    "everforest": ("#1f262a", "#4b5a54"),
    "latte": ("#f2f4f8", "#8f93a6"),
}


def to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def luminance(rgb):
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]


def main():
    if not SOURCE.exists():
        raise SystemExit(f"missing source image: {SOURCE}")

    image = Image.open(SOURCE)
    if image.mode != "P":
        raise SystemExit(f"expected an indexed PNG, got mode {image.mode}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    palette = image.getpalette()
    used = sorted(set(image.convert("P").tobytes()))
    order = sorted(used, key=lambda i: luminance(palette[i * 3 : i * 3 + 3]))
    steps = max(len(order) - 1, 1)

    for name, (shadow, highlight) in RAMPS.items():
        a, b = to_rgb(shadow), to_rgb(highlight)
        new_palette = list(palette)
        for rank, index in enumerate(order):
            t = rank / steps
            for channel in range(3):
                new_palette[index * 3 + channel] = round(a[channel] + t * (b[channel] - a[channel]))

        recoloured = image.copy()
        recoloured.putpalette(new_palette)
        target = OUT_DIR / f"{name}.png"
        recoloured.save(target, optimize=True)
        print(f"{target.relative_to(ROOT)}  {target.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
