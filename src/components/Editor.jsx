import { useState, useEffect, useRef, useCallback } from "react";
import { useCommandLine } from "./CommandLine";

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
        showLineNumber,
        element: el
      });
    }
  });

  return lines.length > 0 ? lines : [DEFAULT_LINE];
}

// Highlight search matches in the editor content
function highlightMatches(container, query) {
  // Remove existing highlights
  container.querySelectorAll(".search-highlight").forEach((el) => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  if (!query) return [];

  const matches = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const nodesToProcess = [];

  while (walker.nextNode()) {
    nodesToProcess.push(walker.currentNode);
  }

  nodesToProcess.forEach((textNode) => {
    const text = textNode.textContent;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    
    if (regex.test(text)) {
      const span = document.createElement("span");
      span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
      textNode.parentNode.replaceChild(span, textNode);
      
      span.querySelectorAll(".search-highlight").forEach((mark) => {
        matches.push(mark);
      });
    }
  });

  return matches;
}

export default function Editor({ file, children, onNavigate, availableFiles }) {
  const [cursor, setCursor] = useState(0);
  const [column, setColumn] = useState(0);
  const [linesData, setLinesData] = useState([DEFAULT_LINE]);
  const [pendingG, setPendingG] = useState(false);
  const contentRef = useRef(null);
  const isPdfViewer = file.language === "pdf";
  
  const {
    mode,
    command,
    message,
    messageType,
    inputRef,
    handleSubmit,
    handleChange,
    searchQuery,
    setSearchMatches,
    currentMatchIndex,
    setCurrentMatchIndex,
    clearSearch
  } = useCommandLine(file.name, { onNavigate, availableFiles });

  // Handle search highlighting
  useEffect(() => {
    if (!contentRef.current || isPdfViewer) return;

    const matches = highlightMatches(contentRef.current, searchQuery);
    setSearchMatches(matches);
    
    if (matches.length > 0) {
      setCurrentMatchIndex(0);
    }
  }, [searchQuery, children, isPdfViewer, setSearchMatches, setCurrentMatchIndex]);

  // Scroll to current match
  useEffect(() => {
    if (!contentRef.current || isPdfViewer) return;

    const highlights = contentRef.current.querySelectorAll(".search-highlight");
    highlights.forEach((el, i) => {
      el.classList.toggle("current", i === currentMatchIndex);
    });

    if (highlights[currentMatchIndex]) {
      highlights[currentMatchIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentMatchIndex, isPdfViewer]);

  // Clear search when changing files
  useEffect(() => {
    clearSearch();
  }, [file.name, clearSearch]);

  useEffect(() => {
    if (isPdfViewer) {
      return undefined;
    }

    if (!contentRef.current) return;
    const container = contentRef.current;

    // Full reset when the page changes
    const data = buildLineData(container);
    setLinesData(data);
    const lastLineIndex = data.length - 1;
    setCursor(lastLineIndex);
    setColumn(maxColumnForLine(data[lastLineIndex]));

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

  const jumpToTop = useCallback(() => {
    setCursor(0);
    setColumn(0);
  }, []);

  const jumpToBottom = useCallback(() => {
    const lastLine = linesData.length - 1;
    setCursor(lastLine);
    setColumn(maxColumnForLine(linesData[lastLine]));
  }, [linesData]);

  useEffect(() => {
    if (isPdfViewer || mode !== "normal") {
      return undefined;
    }

    const maxCol = (row) => {
      return maxColumnForLine(linesData[row]);
    };

    const handleKey = (e) => {
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      // Handle gg (go to top)
      if (e.key === "g") {
        if (pendingG) {
          e.preventDefault();
          jumpToTop();
          setPendingG(false);
          return;
        } else {
          setPendingG(true);
          setTimeout(() => setPendingG(false), 500);
          return;
        }
      }

      // Handle G (go to bottom)
      if (e.key === "G" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        jumpToBottom();
        setPendingG(false);
        return;
      }

      // Reset pending g if another key is pressed
      if (pendingG && e.key !== "g") {
        setPendingG(false);
      }

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
  }, [linesData, cursor, isPdfViewer, mode, pendingG, jumpToTop, jumpToBottom]);

  const currentLine = linesData[cursor] ?? DEFAULT_LINE;
  const cursorX = currentLine.xOffset + column * currentLine.charWidth;
  const cursorY = currentLine.y;
  const logicalLineNumbers = linesData.reduce((numbers, line) => {
    const previous = numbers.length > 0 ? numbers[numbers.length - 1] : 0;
    const next = line.showLineNumber ? previous + 1 : previous;
    return [...numbers, next];
  }, []);

  const getModeDisplay = () => {
    if (mode === "command") return "COMMAND";
    if (mode === "search") return "SEARCH";
    return "NORMAL";
  };

  const getPrompt = () => {
    if (mode === "command") return ":";
    if (mode === "search") return "/";
    return "";
  };

  return (
    <main className="editor">
      <div className="editor-scroll-container">
        <div className="editor-content">
          {!isPdfViewer && (
            <div className="line-numbers">
              {linesData.map((line, i) => (
                <div
                  key={i}
                  className={`line-number ${i === cursor ? "active" : ""}`}
                  style={{
                    height: `${line.lineNumberHeight}px`,
                    lineHeight: `${line.lineNumberHeight}px`
                  }}
                >
                  {line.showLineNumber ? logicalLineNumbers[i] : ""}
                </div>
              ))}
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
        {(mode === "command" || mode === "search") ? (
          <form onSubmit={handleSubmit} className="status-command-form">
            <span className="status-command-prompt">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={handleChange}
              className="status-command-input"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        ) : message ? (
          <div className={`status-message ${messageType}`}>
            {messageType === "help" ? <pre className="help-text">{message}</pre> : message}
          </div>
        ) : (
          <>
            <div className="status-left">
              <div className="status-mode">{getModeDisplay()}</div>
              <div className="status-item">{file.name}</div>
              {searchQuery && (
                <div className="status-item status-search-info">
                  /{searchQuery}
                </div>
              )}
            </div>
            <div className="status-right">
              {!isPdfViewer && <div className="status-item">{cursor + 1}:{column + 1}</div>}
              <div className="status-item">{file.language}</div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
