import { Fragment, useState, useLayoutEffect, useRef } from "react";

const CHAR_W = 8.4;        // JetBrains Mono advance width at 14px
const COL_GAP = 2;         // chars between the two columns
const PADDING_LEFT  = 10;  // .editor-body padding-left  (px)
const PADDING_RIGHT = 20;  // .editor-body padding-right (px) — must match CSS

// word-wrap a string to fit within `width` chars, returning one string per line.
function wrapText(text, width) {
  if (!text) return [""];
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= width) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      // single word longer than width: hard-truncate
      line = word.length > width ? word.slice(0, width - 3) + "..." : word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

// pad / truncate a string to exactly `width` chars.
function pad(str, width) {
  const s = str || "";
  if (width <= 0) return "";
  if (s.length > width) {
    return width > 3 ? s.slice(0, width - 3) + "..." : s.slice(0, width);
  }
  return s + " ".repeat(width - s.length);
}

function truncate(str, width) {
  const s = str || "";
  if (width <= 0) return "";
  if (s.length <= width) return s;
  return width > 3 ? `${s.slice(0, width - 3)}...` : s.slice(0, width);
}

// ensure a url has a scheme so it renders as a link and not plain text
function normalizeUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

// build the jsx rows for one card.
// descLineCount lets the caller normalise heights across a pair.
function buildRows(props, W, descLineCount) {
  const INNER = W - 6;
  const { name, desc, tech = [], link = "" } = props;
  const b = (s) => <span className="card-border">{s}</span>;
  const maxNameLength = Math.max(4, W - 8);
  const displayName = pad(name, maxNameLength).trimEnd();
  const titleDashes = Math.max(1, W - displayName.length - 5);
  const techStr = tech.map((t) => `[${t}]`).join("  ");
  const linkPrefix = "↗  ";
  const linkWidth = Math.max(0, INNER - linkPrefix.length);
  const displayLink = truncate(link, linkWidth);
  const linkPadding = " ".repeat(Math.max(0, linkWidth - displayLink.length));

  const descLines = wrapText(desc, INNER);
  // pad to the shared target so both cards in a pair are the same height
  while (descLines.length < descLineCount) descLines.push("");

  return [
    // ╭─ name ─────────────────────────────────╮
    <>{b("╭─ ")}<span className="card-name">{displayName}</span>{b(" " + "─".repeat(titleDashes) + "╮")}</>,
    // ├────────────────────────────────────────┤
    <>{b("├" + "─".repeat(W - 2) + "┤")}</>,
    // │  description line(s)                   │
    ...descLines.map((line) => (
      <>{b("│  ")}<span className="card-desc">{pad(line, INNER)}</span>{b("  │")}</>
    )),
    // │  [Tech]  [Tech]                        │
    <>{b("│  ")}<span className="card-tech">{pad(techStr, INNER)}</span>{b("  │")}</>,
    // │  ↗  link                               │
    <>
      {b("│  ")}
      <span className="card-link">
        {link ? (
          <>
            {linkPrefix}<a href={normalizeUrl(link)} target="_blank" rel="noopener noreferrer">{displayLink}</a>{linkPadding}
          </>
        ) : (
          " ".repeat(INNER)
        )}
      </span>
      {b("  │")}
    </>,
    // ╰────────────────────────────────────────╯
    <>{b("╰" + "─".repeat(W - 2) + "╯")}</>,
  ];
}

// renders cards in pairs as merged <p> rows so the cursor grid stays aligned.
// width is measured from the live dom and updates on resize.
export default function TwoColumnCards({ cards = [] }) {
  const [editorWidth, setEditorWidth] = useState(0);
  const anchorRef = useRef(null);

  useLayoutEffect(() => {
    const body = anchorRef.current?.closest(".editor-body");
    if (!body) return;
    const update = () => setEditorWidth(body.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(body);
    return () => ro.disconnect();
  }, []);

  // available chars between left-padding start and right-padding start
  const availablePx = Math.max(320, (editorWidth || 640) - PADDING_LEFT - PADDING_RIGHT);
  const isDesktopViewport = typeof window !== "undefined" && window.innerWidth >= 1024;
  const isSingleColumn = !isDesktopViewport && availablePx < 960;
  const W = isSingleColumn
    ? Math.max(30, Math.floor(availablePx / CHAR_W) - 2)
    : Math.max(20, Math.floor((availablePx / CHAR_W - COL_GAP) / 2));
  const INNER = W - 6;

  if (isSingleColumn) {
    return (
      <>
        {cards.map((card, cardIndex) => {
          const descLineCount = wrapText(card.desc, INNER).length;
          const rows = buildRows(card, W, descLineCount);
          return (
            <Fragment key={card.name}>
              {cardIndex > 0 && <p className="blank"></p>}
              {rows.map((row, rowIndex) => (
                <p
                  key={rowIndex}
                  className="card-row"
                  ref={cardIndex === 0 && rowIndex === 0 ? anchorRef : null}
                >
                  {row}
                </p>
              ))}
            </Fragment>
          );
        })}
      </>
    );
  }

  const pairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i + 1] ?? null]);
  }

  return (
    <>
      {pairs.map((pair, pi) => {
        const [leftProps, rightProps] = pair;

        // determine shared desc line count for this pair
        const leftDescLines  = wrapText(leftProps.desc,  INNER).length;
        const rightDescLines = rightProps ? wrapText(rightProps.desc, INNER).length : 0;
        const descLineCount  = Math.max(leftDescLines, rightDescLines);

        const leftRows  = buildRows(leftProps,  W, descLineCount);
        const rightRows = rightProps ? buildRows(rightProps, W, descLineCount) : null;
        const gap = " ".repeat(COL_GAP);

        return (
          <Fragment key={pi}>
            {pi > 0 && <p className="blank"></p>}
            {leftRows.map((leftRow, ri) => (
              <p
                key={ri}
                className="card-row"
                ref={ri === 0 && pi === 0 ? anchorRef : null}
              >
                {leftRow}
                {rightRows && <>{gap}{rightRows[ri]}</>}
              </p>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
