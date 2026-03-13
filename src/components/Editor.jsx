import { useState, useEffect, useRef } from "react";

const DEFAULT_LINE = { y: 2, xOffset: 0, charWidth: 8.4, height: 22, textLength: 0, lineNumberHeight: 27 };

function maxColumnForLine(line) {
  return Math.max(0, (line?.textLength ?? 0) - 1);
}

// Walk the DOM and return metadata for each cursor row.
// Wrappable rows (p/li) are split into visual lines so wrapped text is navigable.
function buildLineData(container) {
  const elements = Array.from(
    container.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li")
  );

  if (elements.length === 0) {
    return [DEFAULT_LINE];
  }

  const containerStyle = window.getComputedStyle(container);
  const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
  const defaultLineHeight = parseFloat(containerStyle.lineHeight) || 27;
  const lines = [];

  elements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize) || 14;
    const lineHeight = parseFloat(style.lineHeight) || defaultLineHeight;
    // JetBrains Mono has a ~0.6 advance-width-to-font-size ratio
    const charWidth = parseFloat((fontSize * 0.6).toFixed(2));
    const elHeight = Math.max(el.offsetHeight, 1);
    // el.offsetLeft already includes any ul/ol padding-left indent
    const xOffset = el.offsetLeft;
    const isWrappable = el.tagName === "P" || el.tagName === "LI";
    const visualRows = isWrappable
      ? Math.max(1, Math.round(elHeight / lineHeight))
      : 1;
    const rowHeight = isWrappable ? lineHeight : elHeight;
    const cursorHeight = Math.max(1, Math.min(Math.round(fontSize * 1.6), Math.max(1, rowHeight - 2)));
    const rawLen = (el.textContent || "").trim().length;
    const maxChars = Math.max(1, Math.floor((container.clientWidth - xOffset - paddingRight) / charWidth));

    for (let rowIndex = 0; rowIndex < visualRows; rowIndex += 1) {
      const showLineNumber = rowIndex === 0;
      const y = isWrappable
        ? el.offsetTop + rowIndex * lineHeight + Math.round((lineHeight - cursorHeight) / 2)
        : el.offsetTop + Math.round((elHeight - cursorHeight) / 2);
      const textLength = !isWrappable || visualRows === 1
        ? Math.min(rawLen, maxChars)
        : Math.max(0, Math.min(maxChars, rawLen - rowIndex * maxChars));

      lines.push({
        y,
        xOffset,
        charWidth,
        height: cursorHeight,
        textLength,
        lineNumberHeight: rowHeight,
        showLineNumber
      });
    }
  });

  return lines.length > 0 ? lines : [DEFAULT_LINE];
}

export default function Editor({ file, children }) {
  const [cursor, setCursor] = useState(0);
  const [column, setColumn] = useState(0);
  const [linesData, setLinesData] = useState([DEFAULT_LINE]);
  const contentRef = useRef(null);
  const isPdfViewer = file.language === "pdf";

  useEffect(() => {
    if (isPdfViewer) {
      return undefined;
    }

    if (!contentRef.current) return;
    const container = contentRef.current;

    // Full reset when the page changes
    const data = buildLineData(container);
    setLinesData(data);
    setCursor(data.length - 1);
    setColumn(0);

    const refreshLineData = () => {
      const updated = buildLineData(container);
      setLinesData(updated);
      setCursor((prevCursor) => {
        const clampedCursor = Math.min(prevCursor, updated.length - 1);
        setColumn((prevColumn) => Math.min(prevColumn, maxColumnForLine(updated[clampedCursor])));
        return clampedCursor;
      });
    };

    // Re-read positions whenever content inside the editor body changes
    // (e.g. TwoColumnCards recalculates its width after a resize)
    const mo = new MutationObserver(refreshLineData);
    mo.observe(container, { subtree: true, childList: true, characterData: true });

    // Wrapping can change without DOM mutations when container width changes.
    const ro = new ResizeObserver(refreshLineData);
    ro.observe(container);

    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [children, isPdfViewer]);

  useEffect(() => {
    if (isPdfViewer) {
      return undefined;
    }

    const maxCol = (row) => {
      return maxColumnForLine(linesData[row]);
    };

    const handleKey = (e) => {
      if (["h", "j", "k", "l", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "k":
        case "ArrowUp": {
          const next = Math.max(0, cursor - 1);
          setCursor(next);
          setColumn((col) => Math.min(col, maxCol(next)));
          break;
        }
        case "j":
        case "ArrowDown": {
          const next = Math.min(linesData.length - 1, cursor + 1);
          setCursor(next);
          setColumn((col) => Math.min(col, maxCol(next)));
          break;
        }
        case "h":
        case "ArrowLeft":
          setColumn((prev) => Math.max(0, prev - 1));
          break;
        case "l":
        case "ArrowRight":
          setColumn((prev) => Math.min(maxCol(cursor), prev + 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [linesData, cursor, isPdfViewer]);

  const currentLine = linesData[cursor] ?? DEFAULT_LINE;
  const cursorX = currentLine.xOffset + column * currentLine.charWidth;
  const cursorY = currentLine.y;

  let logicalLine = 0;
  return (
    <main className="editor">
      <div className="editor-scroll-container">
        <div className="editor-content">
          {!isPdfViewer && (
            <div className="line-numbers">

              {linesData.map((line, i) => {
                if (line.showLineNumber) logicalLine += 1;

                return (
                  <div
                    key={i}
                    className={`line-number ${i === cursor ? "active" : ""}`}
                    style={{
                      height: `${line.lineNumberHeight}px`,
                      lineHeight: `${line.lineNumberHeight}px`
                    }}
                  >
                    {line.showLineNumber ? logicalLine : ""}
                  </div>
                );
              })}
            </div>
          )}

          <div className="editor-body" ref={contentRef}>
            {children}
            {!isPdfViewer && (
              <div
                className="cursor"
                style={{
                  transform: `translate(${cursorX}px, ${cursorY}px)`,
                  width: `${currentLine.charWidth}px`,
                  height: `${currentLine.height}px`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="status-line">
        <div className="status-left">
          <div className="status-mode">NORMAL</div>
          <div className="status-item">{file.name}</div>
        </div>
        <div className="status-right">
          {!isPdfViewer && <div className="status-item">{cursor + 1}:{column + 1}</div>}
          <div className="status-item">{file.language}</div>
        </div>
      </div>
    </main>
  );
}
