// Turns rendered DOM into a vim-style grid of navigable rows.
//
// The old implementation guessed where text sat by dividing element heights by
// the line-height and assuming a fixed advance width. That drifted on wrapped
// paragraphs, on headings with their own font-size, and on anything indented.
// This version asks the browser directly: a Range over each element's contents
// reports one client rect per visual line, which gives exact x/y/width for
// every row including wrapped ones.

const ROW_SELECTOR = "h1, h2, h3, h4, h5, h6, p, li, pre";

export const FALLBACK_ROW = {
  y: 2,
  x: 0,
  charWidth: 8.4,
  fontSize: 14,
  height: 22,
  rowHeight: 27,
  text: "",
  textLength: 0,
  showLineNumber: true,
  element: null,
  font: {
    fontFamily: "monospace",
    fontWeight: "400",
    fontStyle: "normal",
    letterSpacing: "normal"
  }
};

// Enough of the row's typography to redraw one of its characters on top of
// itself, pixel for pixel. The cursor overlay needs this: a heading and a
// paragraph share the grid but not the weight or the size.
function fontOf(style) {
  return {
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    letterSpacing: style.letterSpacing
  };
}

const charWidthCache = new Map();
let measureContext = null;

function charWidthFor(style) {
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const cached = charWidthCache.get(font);
  if (cached) {
    return cached;
  }

  if (!measureContext) {
    measureContext = document.createElement("canvas").getContext("2d");
  }

  let width = 0;
  if (measureContext) {
    measureContext.font = font;
    // Average over a run of characters: sub-pixel advances round more honestly.
    width = measureContext.measureText("0".repeat(50)).width / 50;
  }

  const fontSize = parseFloat(style.fontSize) || 14;
  const resolved = width > 0.5 ? width : fontSize * 0.6;
  charWidthCache.set(font, resolved);
  return resolved;
}

// Merge client rects that share a visual line.
function groupRectsByLine(rects) {
  const usable = Array.from(rects)
    .filter((rect) => rect.width > 0.5 && rect.height > 0.5)
    .sort((a, b) => a.top - b.top || a.left - b.left);

  const groups = [];
  usable.forEach((rect) => {
    const current = groups[groups.length - 1];
    // More than a couple of pixels of vertical overlap means "same line".
    if (current && rect.top < current.bottom - 2) {
      current.left = Math.min(current.left, rect.left);
      current.right = Math.max(current.right, rect.right);
      current.top = Math.min(current.top, rect.top);
      current.bottom = Math.max(current.bottom, rect.bottom);
    } else {
      groups.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
    }
  });

  return groups;
}

// Reproduce the browser's greedy word wrap by filling each measured row width.
// Monospace means character count and pixel width are interchangeable, so the
// split lands exactly where the browser put it.
//
// Tokenising into words *and* runs of spaces (rather than splitting on " ")
// keeps multi-space padding intact, which matters for elements that preserve
// whitespace: their rendered columns have to line up with the cursor grid.
//
// Only a word can be pushed onto the next row. Whitespace is always absorbed by
// the row it follows, because a space at a wrap point hangs off the end of the
// line rather than being rendered at the start of the next one. Letting a space
// carry over gave every wrapped row a phantom leading character, which shifted
// its whole grid one column right and put the cursor on the wrong glyph.
function splitTextAcrossRows(text, capacities) {
  if (capacities.length === 1) {
    return [text];
  }

  const tokens = text.match(/\S+|\s+/g) ?? [];
  const rows = [];
  let index = 0;

  capacities.forEach((capacity, rowIndex) => {
    const isLast = rowIndex === capacities.length - 1;
    if (isLast) {
      rows.push(tokens.slice(index).join(""));
      index = tokens.length;
      return;
    }

    let line = "";
    while (index < tokens.length) {
      const token = tokens[index];
      const isSpace = /^\s/.test(token);
      // A row has to take at least one word, however long that word is.
      if (!isSpace && line.trim() !== "" && line.length + token.length > capacity) {
        break;
      }
      line += token;
      index += 1;
    }
    rows.push(line);
  });

  return rows;
}

// `pre` and `pre-wrap` render every space, so collapsing them here would put
// the model out of step with what is on screen.
function preservesWhitespace(style) {
  return /^(pre|pre-wrap|break-spaces)$/.test(style.whiteSpace);
}

// Not everything inside a row belongs on the row's character grid.
//
// Replaced content is a picture, not a line of characters, and `textContent`
// does not agree: it happily returns the <text> labels inside an inline SVG,
// which left the model believing a wireframe was ninety characters of prose.
//
// `data-offgrid` marks the other case: decoration such as a badge, which has
// its own font-size, letter-spacing and padding and so occupies a width no
// whole number of the row's characters can describe.
//
// Both are skipped for text *and* for measurement, so a row that opens with a
// badge starts at the first character that is genuinely on the grid. A row with
// nothing left falls through to the blank-row branch and stays navigable.
const NON_TEXT = /^(svg|img|canvas|video|iframe|object|picture)$/i;

function isOffGrid(element) {
  return NON_TEXT.test(element.tagName) || element.dataset?.offgrid !== undefined;
}

function gridTextNodes(element, out = []) {
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue) {
        out.push(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && !isOffGrid(node)) {
      gridTextNodes(node, out);
    }
  });
  return out;
}

function isNested(element, all) {
  let parent = element.parentElement;
  while (parent) {
    if (all.has(parent)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

export function buildLineModel(container) {
  if (!container) {
    return [FALLBACK_ROW];
  }

  const candidates = Array.from(container.querySelectorAll(ROW_SELECTOR));
  const candidateSet = new Set(candidates);
  const elements = candidates.filter(
    (el) => el.offsetParent !== null && !isNested(el, candidateSet)
  );

  if (elements.length === 0) {
    return [FALLBACK_ROW];
  }

  const containerRect = container.getBoundingClientRect();
  const rows = [];

  elements.forEach((element) => {
    const style = window.getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize) || 14;
    const charWidth = charWidthFor(style);
    const font = fontOf(style);
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top - containerRect.top;
    const elementBottom = elementRect.bottom - containerRect.top;

    // Measured over the on-grid text nodes rather than the whole element, so a
    // badge or a picture contributes neither characters nor rects.
    const nodes = gridTextNodes(element);
    const range = document.createRange();
    const rects = [];
    nodes.forEach((node) => {
      range.selectNodeContents(node);
      rects.push(...range.getClientRects());
    });
    const groups = groupRectsByLine(rects);

    const raw = nodes.map((node) => node.nodeValue).join("");
    const text = preservesWhitespace(style)
      ? raw.replace(/[\r\n]+/g, "").replace(/\s+$/, "")
      : raw.replace(/\s+/g, " ").trim();

    if (groups.length === 0 || text === "") {
      // Blank lines and image-only rows: still navigable, just empty.
      const contentLeft =
        elementRect.left -
        containerRect.left +
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.borderLeftWidth) || 0);
      const rowHeight = Math.max(1, elementBottom - elementTop);
      const height = Math.max(1, Math.min(Math.round(fontSize * 1.6), Math.round(rowHeight)));
      rows.push({
        y: elementTop + (rowHeight - height) / 2,
        x: contentLeft,
        charWidth,
        fontSize,
        height,
        rowHeight,
        text: "",
        textLength: 0,
        showLineNumber: true,
        element,
        font
      });
      return;
    }

    const capacities = groups.map((group) =>
      Math.max(1, Math.round((group.right - group.left) / charWidth))
    );
    const rowTexts = splitTextAcrossRows(text, capacities);

    groups.forEach((group, index) => {
      const groupTop = group.top - containerRect.top;
      // Gutter rows tile the element's full box height so line numbers stay
      // glued to the text they label.
      const nextTop =
        index + 1 < groups.length ? groups[index + 1].top - containerRect.top : elementBottom;
      const gutterTop = index === 0 ? elementTop : groupTop;
      const rowHeight = Math.max(1, nextTop - gutterTop);
      const groupHeight = Math.max(1, group.bottom - group.top);
      const height = Math.max(1, Math.min(Math.round(fontSize * 1.6), Math.round(groupHeight)));
      const rowText = (rowTexts[index] ?? "").trimEnd();

      rows.push({
        y: groupTop + (groupHeight - height) / 2,
        x: group.left - containerRect.left,
        charWidth,
        fontSize,
        height,
        rowHeight,
        text: rowText,
        textLength: rowText.length,
        showLineNumber: index === 0,
        element,
        font
      });
    });
  });

  return rows.length > 0 ? rows : [FALLBACK_ROW];
}

export function maxColumn(row) {
  return Math.max(0, (row?.textLength ?? 0) - 1);
}

const WORD_CHAR = /[A-Za-z0-9_]/;

function classOf(char) {
  if (!char || /\s/.test(char)) return "space";
  return WORD_CHAR.test(char) ? "word" : "punct";
}

// Vim `w`: start of the next word, wrapping onto following rows.
export function nextWordStart(rows, rowIndex, column) {
  let row = rowIndex;
  let col = column;
  let text = rows[row]?.text ?? "";
  const startClass = classOf(text[col]);

  if (startClass !== "space") {
    while (col < text.length && classOf(text[col]) === startClass) col += 1;
  }
  while (true) {
    while (col < text.length && classOf(text[col]) === "space") col += 1;
    if (col < text.length) {
      return { row, column: col };
    }
    if (row + 1 >= rows.length) {
      return { row, column: maxColumn(rows[row]) };
    }
    row += 1;
    col = 0;
    text = rows[row]?.text ?? "";
    if (text.length === 0) {
      return { row, column: 0 };
    }
  }
}

// Vim `b`: start of the previous word.
export function prevWordStart(rows, rowIndex, column) {
  let row = rowIndex;
  let col = column - 1;
  let text = rows[row]?.text ?? "";

  while (true) {
    while (col >= 0 && classOf(text[col]) === "space") col -= 1;
    if (col >= 0) {
      const wordClass = classOf(text[col]);
      while (col > 0 && classOf(text[col - 1]) === wordClass) col -= 1;
      return { row, column: col };
    }
    if (row - 1 < 0) {
      return { row, column: 0 };
    }
    row -= 1;
    text = rows[row]?.text ?? "";
    col = text.length - 1;
    if (text.length === 0) {
      return { row, column: 0 };
    }
  }
}

// Vim `e`: end of the current or next word.
export function wordEnd(rows, rowIndex, column) {
  let row = rowIndex;
  let col = column + 1;
  let text = rows[row]?.text ?? "";

  while (true) {
    while (col < text.length && classOf(text[col]) === "space") col += 1;
    if (col < text.length) {
      const wordClass = classOf(text[col]);
      while (col + 1 < text.length && classOf(text[col + 1]) === wordClass) col += 1;
      return { row, column: col };
    }
    if (row + 1 >= rows.length) {
      return { row, column: maxColumn(rows[row]) };
    }
    row += 1;
    col = 0;
    text = rows[row]?.text ?? "";
    if (text.length === 0) {
      return { row, column: 0 };
    }
  }
}

export function firstNonBlank(row) {
  const text = row?.text ?? "";
  const index = text.search(/\S/);
  return index < 0 ? 0 : index;
}

// Vim `{` / `}`: nearest blank row in the given direction.
export function paragraphJump(rows, rowIndex, direction) {
  let index = rowIndex + direction;
  while (index > 0 && index < rows.length - 1) {
    if ((rows[index].textLength ?? 0) === 0) {
      return index;
    }
    index += direction;
  }
  return direction > 0 ? rows.length - 1 : 0;
}

// The first link on the row under the cursor, for `gx`.
export function linkForRow(row) {
  const element = row?.element;
  if (!element) return null;
  if (element.tagName === "A" && element.href) return element.href;
  const anchor = element.querySelector("a[href]");
  return anchor ? anchor.href : null;
}
