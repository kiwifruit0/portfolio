# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # vite dev server with HMR
npm run build     # production build into dist/
npm run preview   # serve the built dist/
npm run lint      # eslint over the repo (flat config, dist ignored)
```

There is no test suite. Two Python asset scripts are run by hand from the repo root and their
output is committed:

```bash
python3 scripts/build-backdrops.py   # recolour the backdrop per theme -> src/assets/backdrops/
python3 scripts/build-fonts.py       # subset JetBrains Mono -> src/assets/fonts/ (needs fonttools, brotli)
```

## What this is

A personal portfolio (React 19 + Vite, plain JS, no router, no state library) whose entire UI is a
simulated Neovim. Pages are "buffers", the cursor is real and driven by vim motions, and there is a
working command line, fuzzy finder and leader menu. Correctness here mostly means *the cursor lands
on the character you expect*, so changes to layout, typography or fonts are cursor bugs waiting to
happen.

## Architecture

**`src/App.jsx` is the whole application shell.** It owns the `pages` map (filename -> page
component, language, icon), the active file, theme, vim `options`, sidebar visibility, and the
`overlay` (finder or float window). "Routing" is `setActiveFileName`; the `pages` object is the
single place a new page is registered. App also handles *global* keys: leader (`Space`) sequences
from `LEADER_MAP`, `:`, `/`, `?`, `n`/`N`, `Ctrl-p`, `Ctrl-g`, `Escape`.

**Command context flows down, not up.** App builds a memoised `commandContext` (navigate,
setTheme, openFinder, openWindow, setOption, gotoLine, …) and passes it to `useCommandLine`, which
calls `createCommands(ctx)` in `src/lib/commands.js`. Every `:command` is a `{ name, aliases,
usage, desc, complete, run }` object built from that context — adding a command means adding an
entry there, and adding a *capability* means threading a new callback through `commandContext`.
Editor-owned actions are reached the other way, through `editorApi` (an imperative ref exposing
`gotoLine`).

**`src/lib/lineModel.js` is the load-bearing piece.** It turns the rendered DOM into a grid of
navigable rows by running a `Range` over each `h1..h6, p, li, pre` element and reading its client
rects — one rect per *visual* line, so wrapped paragraphs and indented text are exact. It also
measures each row's character advance via a canvas (cached per font string) and re-derives the
wrap points. All vim motions (`w b e { } ^ $` …) are pure functions over that row array.
Consequences worth knowing before touching it:

- Every glyph on a row must come from the monospace face. A character missing from the subset gets
  fetched from a fallback at a different advance width and every column after it drifts — that is
  why fonts are self-hosted and subset by `scripts/build-fonts.py`, which fails the build if any
  glyph is not 600/1000 em.
- Web fonts landing after first paint invalidate the cached advances; `Editor` calls
  `resetCharWidthCache()` on `document.fonts` `ready`/`loadingdone` and re-measures.
- Content is measured, not parsed, so page markup matters: pages render a `<div className="page">`
  of ordinary block elements, with `<p className="blank">` used for the empty rows between
  paragraphs.

**`src/components/Editor.jsx`** wraps the active page: it re-measures via `MutationObserver` +
`ResizeObserver`, owns cursor `{row, col, desired}` in one state object (functional updates only —
key repeat outruns React's render loop), draws the cursor, line numbers, search-match boxes and
the status line, and handles motion keys plus pending prefixes (`g`, `z`). Search highlights are
absolutely positioned boxes computed from Ranges rather than injected `<mark>` elements, so
React's DOM is never mutated underneath it. `cv.pdf` renders through pdfjs to a canvas, so the
editor short-circuits all measuring and key handling when `file.language === "pdf"`.

**Content is data, not JSX.** `src/content/*.js` holds profile, experience, education, projects and
skills; pages render it. `src/content/searchIndex.js` flattens all of it into
`{ file, line, text }` records at module load, which is what live grep (`Ctrl-g`) and the finder
preview pane read. New content must be reachable from `searchIndex.js` or it is invisible to grep.

**Theming is pure CSS custom properties.** `src/lib/themes.js` lists the themes and persists the
choice to `localStorage`; `applyTheme` only sets `data-theme` on `<html>`. `src/themes.css`
redefines the same sixteen Nord-named slots (`--nord0..15`) plus `--page-bg`/`--backdrop` per
theme, and `src/App.css` (the single stylesheet, ~1.7k lines) references only those slots — no
component knows which theme is active. Adding a theme means: an entry in `themes.js`, a block in
`themes.css`, a ramp in `scripts/build-backdrops.py`, and re-running that script.

## Conventions

- Double-quoted strings, no semicolon-free style, `.jsx` for components and `.js` for logic/content.
- Comments in this codebase explain *why* — usually a browser behaviour or a bug that was fixed.
  Match that: prefer one explanatory comment over several descriptive ones.
- `no-unused-vars` is an error except for `^[A-Z_]` identifiers.
