#!/usr/bin/env python3
"""Bake the self-hosted JetBrains Mono webfonts in src/assets/fonts.

The cursor grid assumes every glyph on a row advances by the same width, so the
page cannot afford a glyph the font does not have: the browser would fetch that
one character from some other font, at some other width, and every column after
it would sit a few pixels off. Google Fonts' own subsets stop well short of what
the pages use - no arrows, no geometric shapes, no block elements - so the fonts
are subset here instead, from the upstream release, over ranges wide enough that
new copy is unlikely to fall outside them.

    pip install fonttools brotli
    python scripts/build-fonts.py

Every glyph in the result advances 600/1000 em; the script checks that before
writing, because a proportional glyph slipping in is exactly the bug this
guards against.
"""

import io
import shutil
import sys
import urllib.request
import zipfile
from pathlib import Path

from fontTools.subset import main as subset_main
from fontTools.ttLib import TTFont

VERSION = "2.304"
RELEASE = (
    "https://github.com/JetBrains/JetBrainsMono/releases/download/"
    f"v{VERSION}/JetBrainsMono-{VERSION}.zip"
)
FACES = ["Regular", "Bold", "Italic"]
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "fonts"

# Latin-1 and punctuation for prose; arrows, geometric shapes, box drawing and
# block elements for the parts of the pages drawn out of characters.
UNICODES = ",".join(
    [
        "U+0000-00FF",
        "U+0131",
        "U+0152-0153",
        "U+02B0-02FF",
        "U+2000-206F",
        "U+20A0-20BF",
        "U+2100-214F",
        "U+2190-21FF",
        "U+2200-22FF",
        "U+2300-23FF",
        "U+2500-257F",
        "U+2580-259F",
        "U+25A0-25FF",
        "U+2610-2612",
        "U+2713-2718",
        "U+FEFF",
        "U+FFFD",
    ]
)


def main():
    print(f"fetching JetBrains Mono {VERSION}")
    with urllib.request.urlopen(RELEASE) as response:
        archive = zipfile.ZipFile(io.BytesIO(response.read()))

    OUT.mkdir(parents=True, exist_ok=True)
    work = OUT / ".src"
    work.mkdir(exist_ok=True)

    with archive.open("OFL.txt") as src, (OUT / "OFL.txt").open("wb") as dst:
        shutil.copyfileobj(src, dst)

    for face in FACES:
        ttf = work / f"JetBrainsMono-{face}.ttf"
        with archive.open(f"fonts/ttf/JetBrainsMono-{face}.ttf") as src, ttf.open("wb") as dst:
            shutil.copyfileobj(src, dst)

        out = OUT / f"JetBrainsMono-{face}.woff2"
        subset_main(
            [
                str(ttf),
                f"--output-file={out}",
                "--flavor=woff2",
                "--layout-features=*",
                "--no-hinting",
                "--desubroutinize",
                f"--unicodes={UNICODES}",
            ]
        )

        font = TTFont(out)
        cmap = font.getBestCmap()
        advances = {font["hmtx"][glyph][0] for glyph in cmap.values()}
        if advances - {0, 600}:
            sys.exit(f"{out.name}: non-monospaced advances {sorted(advances)}")
        print(f"{out.name}: {len(cmap)} glyphs, {out.stat().st_size // 1024} KB")

    shutil.rmtree(work)


if __name__ == "__main__":
    main()
