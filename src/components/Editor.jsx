import { useState, useEffect, useRef } from "react";

// Walk the DOM and return one metadata entry per block element.
// y and lineNumberHeight come directly from the DOM so tall elements (e.g. h1)
// produce a correctly-sized line-number row without needing empty filler rows.
function buildLineData(container) {
  const elements = Array.from(
    container.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li")
  );

  if (elements.length === 0) {
    return [{ y: 2, xOffset: 0, charWidth: 8.4, height: 22, textLength: 0, lineNumberHeight: 27 }];
  }

  return elements.map((el) => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize); // px
    // JetBrains Mono has a ~0.6 advance-width-to-font-size ratio
    const charWidth = parseFloat((fontSize * 0.6).toFixed(2));
    // Scale cursor height with the font; cap just below element height
    const cursorHeight = Math.min(Math.round(fontSize * 1.6), el.offsetHeight - 2);
    // el.offsetLeft already includes any ul/ol padding-left indent
    const xOffset = el.offsetLeft;
    // Vertically centre the cursor block within the element
    const y = el.offsetTop + Math.round((el.offsetHeight - cursorHeight) / 2);
    // Clamp text length to the available horizontal space after the indent
    const rawLen = (el.textContent || "").trim().length;
    const maxChars = Math.floor((container.clientWidth - xOffset) / charWidth);
    const textLength = Math.min(rawLen, maxChars);

    return { y, xOffset, charWidth, height: cursorHeight, textLength, lineNumberHeight: el.offsetHeight };
  });
}

export default function Editor({ file, children }) {
  const [cursor, setCursor] = useState(0);
  const [column, setColumn] = useState(0);
  const [linesData, setLinesData] = useState([
    { y: 2, xOffset: 0, charWidth: 8.4, height: 22, textLength: 0, lineNumberHeight: 27 },
  ]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const data = buildLineData(contentRef.current);
    setLinesData(data);
    setCursor(data.length - 1);
    setColumn(0);
  }, [children]);

  useEffect(() => {
    const maxCol = (row) => {
      const len = linesData[row]?.textLength ?? 0;
      return Math.max(0, len - 1);
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
  }, [linesData, cursor]);

  const currentLine = linesData[cursor] ?? { y: 2, xOffset: 0, charWidth: 8.4, height: 22, textLength: 0, lineNumberHeight: 27 };
  const cursorX = currentLine.xOffset + column * currentLine.charWidth;
  const cursorY = currentLine.y;

  return (
    <main className="editor">
      <div className="editor-scroll-container">
        <div className="editor-content">
          <div className="line-numbers">
            {linesData.map((line, i) => {
              const num = i === cursor ? i + 1 : Math.abs(cursor - i);
              return (
                <div
                  key={i}
                  className={`line-number ${i === cursor ? "active" : ""}`}
                  style={{ height: `${line.lineNumberHeight}px`, lineHeight: `${line.lineNumberHeight}px` }}
                >
                  {num}
                </div>
              );
            })}
          </div>

          <div className="editor-body" ref={contentRef}>
            {children}
            <div
              className="cursor"
              style={{
                transform: `translate(${cursorX}px, ${cursorY}px)`,
                width: `${currentLine.charWidth}px`,
                height: `${currentLine.height}px`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="status-line">
        <div className="status-left">
          <div className="status-mode">NORMAL</div>
          <div className="status-item">{file.name}</div>
        </div>
        <div className="status-right">
          <div className="status-item">{cursor + 1}:{column + 1}</div>
          <div className="status-item">{file.language}</div>
        </div>
      </div>
    </main>
  );
}
