import { Fragment } from "react";

// Card dimensions — two cards + a 2-char gap = 78 chars per merged row
const W = 38;      // card width in monospace chars
const INNER = 32;  // inner content: │  <32 chars>  │
const GAP = "  ";  // gap between the two columns

function pad(s) {
  const str = s || "";
  if (str.length >= INNER) return str.slice(0, INNER - 3) + "...";
  // Use regular spaces; white-space:pre on the row element keeps them intact
  return str + " ".repeat(INNER - str.length);
}

// Returns an array of 6 JSX fragments — one per card row.
// Always 6 rows so paired cards are the same height.
function cardLines({ name, desc, tech = [], link = "" }) {
  const titleDashes = W - name.length - 5;
  const techStr = tech.map((t) => `[${t}]`).join("  ");
  const linkStr = link ? `↗  ${link}` : "";

  const b = (s) => <span className="card-border">{s}</span>;

  return [
    // ╭─ name ────────────────────────────╮
    <>
      {b("╭─ ")}
      <span className="card-name">{name}</span>
      {b(" " + "─".repeat(Math.max(1, titleDashes)) + "╮")}
    </>,

    // ├────────────────────────────────────┤
    <>{b("├" + "─".repeat(W - 2) + "┤")}</>,

    // │  description                       │
    <>
      {b("│  ")}
      <span className="card-desc">{pad(desc)}</span>
      {b("  │")}
    </>,

    // │  [Tech]  [Tech]                    │  (blank row if no tech)
    <>
      {b("│  ")}
      <span className="card-tech">{pad(techStr)}</span>
      {b("  │")}
    </>,

    // │  ↗  link                           │  (blank row if no link)
    <>
      {b("│  ")}
      <span className="card-link">{pad(linkStr)}</span>
      {b("  │")}
    </>,

    // ╰────────────────────────────────────╯
    <>{b("╰" + "─".repeat(W - 2) + "╯")}</>,
  ];
}

// Renders cards in pairs as merged rows so the cursor grid stays aligned.
// Each visual row is a single <p> containing both cards' content side-by-side.
export default function TwoColumnCards({ cards = [] }) {
  const pairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i + 1] ?? null]);
  }

  return (
    <>
      {pairs.map((pair, pi) => {
        const [left, right] = pair;
        const L = cardLines(left);
        const R = right ? cardLines(right) : null;

        return (
          <Fragment key={pi}>
            {pi > 0 && <p className="blank"></p>}
            {L.map((leftRow, ri) => (
              <p key={ri} className="card-row">
                {leftRow}
                {R && <>{GAP}{R[ri]}</>}
              </p>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

