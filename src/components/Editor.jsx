import { Icon } from "@iconify/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  FALLBACK_ROW,
  buildLineModel,
  firstNonBlank,
  linkForRow,
  maxColumn,
  nextWordStart,
  paragraphJump,
  prevWordStart,
  wordEnd
} from "../lib/lineModel";

const SCROLLOFF = 3;
const STICKY_EOL = Number.MAX_SAFE_INTEGER;

const MODE_LABEL = {
  normal: "NORMAL",
  command: "COMMAND",
  search: "SEARCH"
};

// Locate every occurrence of `query` and turn it into absolute overlay boxes.
// Drawing boxes instead of injecting <mark> keeps React's DOM untouched.
function findMatchBoxes(container, query) {
  if (!container || !query) return [];

  const needle = query.toLowerCase();
  const containerRect = container.getBoundingClientRect();
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const boxes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent;
    if (!text) continue;
    const haystack = text.toLowerCase();

    let from = haystack.indexOf(needle);
    while (from !== -1) {
      const range = document.createRange();
      range.setStart(node, from);
      range.setEnd(node, from + needle.length);
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
      if (rects.length > 0) {
        boxes.push({
          rects: rects.map((rect) => ({
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height
          }))
        });
      }
      from = haystack.indexOf(needle, from + Math.max(1, needle.length));
    }
  }

  return boxes.sort((a, b) => a.rects[0].y - b.rects[0].y || a.rects[0].x - b.rects[0].x);
}

export default function Editor({ file, children, cli, options, inputLocked, apiRef }) {
  const [rows, setRows] = useState([FALLBACK_ROW]);
  // Row, column and the "desired" column vim remembers across vertical moves
  // live in one state object so every motion can be a functional update. Key
  // repeat outruns React's render loop, and reading `cursor` from the closure
  // would drop all but the first press of a held key.
  const [pos, setPos] = useState({ row: 0, col: 0, desired: 0 });
  const [fillerRows, setFillerRows] = useState(0);
  const [matches, setMatches] = useState([]);
  const cursor = pos.row;
  const column = pos.col;
  const pendingKey = useRef("");
  const pendingTimer = useRef(null);
  const bodyRef = useRef(null);
  const scrollRef = useRef(null);

  const isPdf = file.language === "pdf";
  const {
    mode,
    command,
    message,
    messageType,
    inputRef,
    searchQuery,
    currentMatchIndex,
    setSearchMatches,
    setCurrentMatchIndex,
    handleSubmit,
    handleChange,
    handleInputKeyDown
  } = cli;

  /* ---------------------------------------------------------------- layout */

  const remeasure = useCallback(() => {
    const body = bodyRef.current;
    const scroller = scrollRef.current;
    if (!body) return;

    const model = buildLineModel(body);
    setRows(model);
    setPos((prev) => {
      const row = Math.min(prev.row, model.length - 1);
      return { row, col: Math.min(prev.col, maxColumn(model[row])), desired: prev.desired };
    });

    if (scroller) {
      const contentHeight = body.getBoundingClientRect().height;
      const spare = scroller.clientHeight - contentHeight - 40;
      setFillerRows(spare > 0 ? Math.floor(spare / 27) : 0);
    }
  }, []);

  useLayoutEffect(() => {
    // The PDF viewer paints to a canvas, so there is nothing to measure and no
    // cursor to draw.
    if (isPdf) return undefined;

    const body = bodyRef.current;
    if (!body) return undefined;

    remeasure();

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(remeasure);
    };

    const mo = new MutationObserver(schedule);
    mo.observe(body, { subtree: true, childList: true, characterData: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(body);

    // Web fonts landing after first paint shift every measurement.
    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      ro.disconnect();
    };
    // Keyed on the file, not on `children`: the element identity changes on
    // every parent render, and resetting the cursor then would be maddening.
  }, [file.name, isPdf, remeasure]);

  /* ---------------------------------------------------------------- search */

  // Kept in refs so jumping between matches doesn't re-fire whenever the
  // layout is re-measured.
  const matchesRef = useRef(matches);
  const rowsRef = useRef(rows);

  useEffect(() => {
    matchesRef.current = matches;
    rowsRef.current = rows;
  }, [matches, rows]);

  useEffect(() => {
    if (isPdf) return;
    const found = findMatchBoxes(bodyRef.current, searchQuery);
    setMatches(found);
    setSearchMatches(found);
  }, [searchQuery, rows, isPdf, setSearchMatches]);

  useEffect(() => {
    setCurrentMatchIndex(searchQuery ? 0 : -1);
  }, [searchQuery, setCurrentMatchIndex]);

  // Follow the active match with both the viewport and the cursor.
  useEffect(() => {
    if (currentMatchIndex < 0) return;
    const currentRows = rowsRef.current;
    const box = matchesRef.current[currentMatchIndex]?.rects?.[0];
    if (!box || currentRows.length === 0) return;
    const nearest = currentRows.reduce(
      (best, row, index) =>
        Math.abs(row.y - box.y) < Math.abs(currentRows[best].y - box.y) ? index : best,
      0
    );
    const raw = Math.round((box.x - currentRows[nearest].x) / currentRows[nearest].charWidth);
    const col = Math.max(0, Math.min(raw, maxColumn(currentRows[nearest])));
    setPos({ row: nearest, col, desired: col });
  }, [currentMatchIndex]);

  /* ------------------------------------------------------------- scrolling */

  const scrollCursorIntoView = useCallback((rowIndex, model) => {
    const scroller = scrollRef.current;
    const body = bodyRef.current;
    const row = model[rowIndex];
    if (!scroller || !body || !row) return;

    const bodyRect = body.getBoundingClientRect();
    const top = bodyRect.top + row.y;
    const bottom = top + row.height;
    const pad = SCROLLOFF * 27;

    // Below 1024px the container is `overflow: visible` and the window is what
    // scrolls, so fall back to scrolling the page itself.
    const scrolls = scroller.scrollHeight > scroller.clientHeight + 1;
    const viewTop = scrolls ? scroller.getBoundingClientRect().top : 0;
    const viewBottom = scrolls ? scroller.getBoundingClientRect().bottom : window.innerHeight;

    let delta = 0;
    if (top - pad < viewTop) {
      delta = top - pad - viewTop;
    } else if (bottom + pad > viewBottom) {
      delta = bottom + pad - viewBottom;
    }
    if (delta === 0) return;

    if (scrolls) {
      scroller.scrollTop += delta;
    } else {
      window.scrollBy({ top: delta });
    }
  }, []);

  useEffect(() => {
    scrollCursorIntoView(cursor, rows);
  }, [cursor, rows, scrollCursorIntoView]);

  const placeCursorLine = useCallback(
    (where) => {
      const scroller = scrollRef.current;
      const body = bodyRef.current;
      const row = rows[cursor];
      if (!scroller || !body || !row) return;
      const offset = body.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      const absolute = scroller.scrollTop + offset + row.y;
      const target =
        where === "top"
          ? absolute - 27
          : where === "bottom"
            ? absolute - scroller.clientHeight + 54
            : absolute - scroller.clientHeight / 2;
      scroller.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    },
    [cursor, rows]
  );

  /* --------------------------------------------------------------- motions */

  // Every motion is expressed as (previous position) -> (row, col) so that a
  // burst of key repeats composes correctly instead of all reading the same
  // pre-render position.
  const motion = useCallback(
    (compute) =>
      setPos((prev) => {
        const result = compute(prev) ?? prev;
        const row = Math.max(0, Math.min(rows.length - 1, result.row));
        const col = Math.max(0, Math.min(result.col, maxColumn(rows[row])));
        return { row, col, desired: result.sticky ? STICKY_EOL : col };
      }),
    [rows]
  );

  const setPosition = useCallback(
    (row, col, options = {}) => motion(() => ({ row, col, sticky: options.sticky })),
    [motion]
  );

  const moveVertical = useCallback(
    (delta) =>
      setPos((prev) => {
        const row = Math.max(0, Math.min(rows.length - 1, prev.row + delta));
        return { row, col: Math.min(prev.desired, maxColumn(rows[row])), desired: prev.desired };
      }),
    [rows]
  );

  const gotoLine = useCallback(
    (logical) => {
      let seen = 0;
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i].showLineNumber) seen += 1;
        if (seen === logical) {
          setPosition(i, 0);
          return;
        }
      }
      setPosition(rows.length - 1, 0);
    },
    [rows, setPosition]
  );

  useEffect(() => {
    if (apiRef) {
      apiRef.current = { gotoLine };
    }
  }, [apiRef, gotoLine]);

  const pageRows = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return 10;
    return Math.max(1, Math.floor(scroller.clientHeight / 27));
  }, []);

  const openLink = useCallback(() => {
    const href = linkForRow(rows[cursor]);
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      cli.showMessage("E447: no link under the cursor", "error", 2000);
    }
  }, [cli, cursor, rows]);

  useEffect(() => {
    if (isPdf || inputLocked) return undefined;

    const armPending = (key) => {
      pendingKey.current = key;
      window.clearTimeout(pendingTimer.current);
      pendingTimer.current = window.setTimeout(() => {
        pendingKey.current = "";
      }, 700);
    };

    const handleKey = (event) => {
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      if (event.metaKey || event.altKey) return;

      const key = event.key;
      const pending = pendingKey.current;

      if (pending === "g") {
        pendingKey.current = "";
        window.clearTimeout(pendingTimer.current);
        if (key === "g") {
          event.preventDefault();
          setPosition(0, 0);
          return;
        }
        if (key === "x") {
          event.preventDefault();
          openLink();
          return;
        }
      }

      if (pending === "z") {
        pendingKey.current = "";
        window.clearTimeout(pendingTimer.current);
        if (key === "z" || key === "t" || key === "b") {
          event.preventDefault();
          placeCursorLine(key === "z" ? "centre" : key === "t" ? "top" : "bottom");
          return;
        }
      }

      if (event.ctrlKey) {
        const half = Math.max(1, Math.floor(pageRows() / 2));
        switch (key) {
          case "d":
            event.preventDefault();
            moveVertical(half);
            return;
          case "u":
            event.preventDefault();
            moveVertical(-half);
            return;
          case "f":
            event.preventDefault();
            moveVertical(pageRows());
            return;
          case "b":
            event.preventDefault();
            moveVertical(-pageRows());
            return;
          case "e":
            event.preventDefault();
            scrollRef.current?.scrollBy({ top: 27 });
            return;
          case "y":
            event.preventDefault();
            scrollRef.current?.scrollBy({ top: -27 });
            return;
          default:
            return;
        }
      }

      switch (key) {
        case "g":
        case "z":
          event.preventDefault();
          armPending(key);
          return;
        case "j":
        case "ArrowDown":
          event.preventDefault();
          moveVertical(1);
          return;
        case "k":
        case "ArrowUp":
          event.preventDefault();
          moveVertical(-1);
          return;
        case "h":
        case "ArrowLeft":
          event.preventDefault();
          motion((prev) => ({ row: prev.row, col: prev.col - 1 }));
          return;
        case "l":
        case "ArrowRight":
          event.preventDefault();
          motion((prev) => ({ row: prev.row, col: prev.col + 1 }));
          return;
        case "w":
        case "W":
          event.preventDefault();
          motion((prev) => {
            const next = nextWordStart(rows, prev.row, prev.col);
            return { row: next.row, col: next.column };
          });
          return;
        case "b":
        case "B":
          event.preventDefault();
          motion((prev) => {
            const back = prevWordStart(rows, prev.row, prev.col);
            return { row: back.row, col: back.column };
          });
          return;
        case "e":
        case "E":
          event.preventDefault();
          motion((prev) => {
            const end = wordEnd(rows, prev.row, prev.col);
            return { row: end.row, col: end.column };
          });
          return;
        case "0":
          event.preventDefault();
          motion((prev) => ({ row: prev.row, col: 0 }));
          return;
        case "^":
          event.preventDefault();
          motion((prev) => ({ row: prev.row, col: firstNonBlank(rows[prev.row]) }));
          return;
        case "$":
          event.preventDefault();
          motion((prev) => ({ row: prev.row, col: maxColumn(rows[prev.row]), sticky: true }));
          return;
        case "G":
          event.preventDefault();
          setPosition(rows.length - 1, 0);
          return;
        case "{":
          event.preventDefault();
          motion((prev) => ({ row: paragraphJump(rows, prev.row, -1), col: 0 }));
          return;
        case "}":
          event.preventDefault();
          motion((prev) => ({ row: paragraphJump(rows, prev.row, 1), col: 0 }));
          return;
        case "Enter":
          event.preventDefault();
          openLink();
          return;
        default:
          pendingKey.current = "";
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inputLocked, isPdf, motion, moveVertical, openLink, pageRows, placeCursorLine, rows, setPosition]);

  /* ---------------------------------------------------------------- render */

  const currentRow = rows[cursor] ?? FALLBACK_ROW;
  const cursorX = currentRow.x + column * currentRow.charWidth;
  // The block paints over the glyph, so it has to redraw it in the inverse
  // colour. Whitespace stays a plain block.
  const covered = currentRow.text?.[column] ?? "";
  const charUnderCursor = covered.trim() ? covered : "";

  const gutter = useMemo(() => {
    const entries = [];
    let logical = 0;
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      if (row.showLineNumber) {
        logical += 1;
      }
      const isCursor = index === cursor;
      const label = row.showLineNumber
        ? options.relativeNumber && !isCursor
          ? String(Math.abs(index - cursor))
          : String(logical)
        : "";
      entries.push({
        key: index,
        label,
        height: row.rowHeight,
        active: isCursor,
        tall: row.rowHeight > 40
      });
    }
    return entries;
  }, [rows, cursor, options.relativeNumber]);

  const percentThrough =
    rows.length <= 1 ? "All" : `${Math.round((cursor / (rows.length - 1)) * 100)}%`;

  return (
    <main className="editor">
      <div className="editor-scroll-container" ref={scrollRef}>
        <div className="editor-content">
          {!isPdf && options.number && (
            <div className="line-numbers">
              {gutter.map((entry) => (
                <div
                  key={entry.key}
                  className={`line-number ${entry.active ? "active" : ""} ${entry.tall ? "tall" : ""}`}
                  style={{ height: `${entry.height}px`, lineHeight: `${entry.height}px` }}
                >
                  {entry.label}
                </div>
              ))}
              {Array.from({ length: fillerRows }).map((_, index) => (
                <div key={`filler-${index}`} className="line-number filler">
                  ~
                </div>
              ))}
            </div>
          )}

          <div className="editor-canvas">
            <div className="editor-body" ref={bodyRef}>
              {children}
            </div>

            {!isPdf && (
              <div className="editor-overlay" aria-hidden="true">
                {options.cursorLine && (
                  <div
                    className="cursor-line"
                    style={{
                      transform: `translateY(${currentRow.y - (currentRow.rowHeight - currentRow.height) / 2}px)`,
                      height: `${currentRow.rowHeight}px`
                    }}
                  />
                )}

                {matches.map((match, matchIndex) =>
                  match.rects.map((rect, rectIndex) => (
                    <div
                      key={`${matchIndex}-${rectIndex}`}
                      className={`search-box ${matchIndex === currentMatchIndex ? "current" : ""}`}
                      style={{
                        transform: `translate(${rect.x}px, ${rect.y}px)`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`
                      }}
                    />
                  ))
                )}

                <div
                  className="cursor"
                  style={{
                    transform: `translate(${cursorX}px, ${currentRow.y}px)`,
                    width: `${currentRow.charWidth}px`,
                    height: `${currentRow.height}px`,
                    fontSize: `${currentRow.fontSize}px`
                  }}
                >
                  {charUnderCursor}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="status-line editor-status">
        {mode !== "normal" ? (
          <form onSubmit={handleSubmit} className="status-command-form">
            <span className="status-command-prompt">{mode === "command" ? ":" : "/"}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              className="status-command-input"
              autoComplete="off"
              spellCheck="false"
              aria-label={mode === "command" ? "command" : "search"}
            />
            {mode === "command" && <span className="status-hint">tab completes</span>}
          </form>
        ) : message ? (
          <div className={`status-message ${messageType}`}>{message}</div>
        ) : (
          <>
            <div className="status-left">
              <div className={`status-mode mode-${mode}`}>{MODE_LABEL[mode]}</div>
              <div className="status-item status-branch">
                <Icon icon="mdi:source-branch" width={13} /> main
              </div>
              <div className="status-item status-file">
                <Icon icon={file.icon} width={13} /> {file.name}
              </div>
              {searchQuery && (
                <div className="status-item status-search-info">
                  /{searchQuery} [{matches.length ? currentMatchIndex + 1 : 0}/{matches.length}]
                </div>
              )}
            </div>
            <div className="status-right">
              <div className="status-item status-lang">{file.language}</div>
              {!isPdf && <div className="status-item">{percentThrough}</div>}
              {!isPdf && (
                <div className="status-pos">
                  {cursor + 1}:{column + 1}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
