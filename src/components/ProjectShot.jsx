// UI previews for the projects page.
//
// A project with an `image` renders that screenshot. Everything else falls back
// to one of the hand-drawn wireframes below, which are inline SVG so they
// repaint with the active colorscheme - the right answer for a project with
// nothing photographable, like hardware that is still on the bench.

const VIEW = "0 0 640 240";

function Chrome({ title, children }) {
  return (
    <>
      <rect x="0" y="0" width="640" height="240" rx="8" fill="var(--shot-bg)" />
      <rect x="0" y="0" width="640" height="26" rx="8" fill="var(--nord1)" />
      <rect x="0" y="18" width="640" height="8" fill="var(--nord1)" />
      <circle cx="16" cy="13" r="4" fill="var(--nord11)" />
      <circle cx="30" cy="13" r="4" fill="var(--nord13)" />
      <circle cx="44" cy="13" r="4" fill="var(--nord14)" />
      <rect x="60" y="7" width="180" height="12" rx="6" fill="var(--nord2)" />
      <text x="70" y="17" fontSize="9" fill="var(--nord4)" fontFamily="monospace">
        {title}
      </text>
      {children}
    </>
  );
}

function ChartShot() {
  const points = [18, 34, 30, 52, 48, 66, 72, 70, 88, 96, 92, 110];
  return (
    <Chrome title="grade_predictor.ipynb">
      <rect x="16" y="38" width="300" height="170" rx="6" fill="var(--nord1)" />
      <text x="30" y="58" fontSize="9" fill="var(--nord3)" fontFamily="monospace">
        predicted vs actual
      </text>
      <line x1="34" y1="192" x2="300" y2="192" stroke="var(--nord3)" strokeWidth="1" />
      <line x1="34" y1="70" x2="34" y2="192" stroke="var(--nord3)" strokeWidth="1" />
      <line x1="34" y1="192" x2="300" y2="72" stroke="var(--nord3)" strokeWidth="1" strokeDasharray="4 4" />
      {points.map((value, index) => (
        <circle
          key={index}
          cx={44 + index * 21}
          cy={186 - value}
          r="4"
          fill="var(--nord8)"
          opacity="0.85"
        />
      ))}

      <rect x="332" y="38" width="292" height="170" rx="6" fill="var(--nord1)" />
      <text x="346" y="58" fontSize="9" fill="var(--nord3)" fontFamily="monospace">
        feature weights
      </text>
      {[
        ["studytime", 210, "var(--nord14)"],
        ["absences", 168, "var(--nord9)"],
        ["failures", 140, "var(--nord9)"],
        ["support", 96, "var(--nord9)"],
        ["travel", 62, "var(--nord12)"]
      ].map(([name, width, colour], index) => (
        <g key={name}>
          <text x="346" y={82 + index * 26} fontSize="8" fill="var(--nord4)" fontFamily="monospace">
            {name}
          </text>
          <rect x="412" y={74 + index * 26} width={width} height="10" rx="5" fill={colour} opacity="0.85" />
        </g>
      ))}
    </Chrome>
  );
}

function EditorShot() {
  return (
    <Chrome title="portfolio — index.md">
      <rect x="0" y="26" width="120" height="214" fill="var(--nord1)" />
      {["index.md", "projects.cpp", "experience.py", "education.sh", "skills.lua", "contact.java"].map(
        (name, index) => (
          <g key={name}>
            {index === 0 && <rect x="6" y={40 + index * 20} width="108" height="16" rx="3" fill="var(--nord2)" />}
            <text
              x="14"
              y={51 + index * 20}
              fontSize="8"
              fill={index === 0 ? "var(--nord8)" : "var(--nord4)"}
              fontFamily="monospace"
            >
              {name}
            </text>
          </g>
        )
      )}

      {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
        <text
          key={line}
          x="146"
          y={54 + (line - 1) * 20}
          fontSize="8"
          fill="var(--nord3)"
          fontFamily="monospace"
          textAnchor="end"
        >
          {line}
        </text>
      ))}

      <text x="160" y="54" fontSize="13" fill="var(--nord8)" fontFamily="monospace">
        Toby Jennings
      </text>
      <rect x="160" y="66" width="330" height="7" rx="3.5" fill="var(--nord4)" opacity="0.55" />
      <rect x="160" y="86" width="380" height="7" rx="3.5" fill="var(--nord4)" opacity="0.55" />
      <rect x="160" y="106" width="250" height="7" rx="3.5" fill="var(--nord4)" opacity="0.55" />
      <rect x="160" y="146" width="120" height="7" rx="3.5" fill="var(--nord14)" opacity="0.8" />
      <rect x="160" y="166" width="180" height="7" rx="3.5" fill="var(--nord14)" opacity="0.8" />
      <rect x="346" y="160" width="10" height="16" fill="var(--nord9)" />

      <rect x="0" y="216" width="640" height="24" fill="var(--nord1)" />
      <rect x="0" y="216" width="70" height="24" fill="var(--nord9)" />
      <text x="12" y="232" fontSize="9" fill="var(--nord0)" fontFamily="monospace" fontWeight="bold">
        NORMAL
      </text>
      <text x="84" y="232" fontSize="9" fill="var(--nord4)" fontFamily="monospace">
        index.md
      </text>
      <text x="580" y="232" fontSize="9" fill="var(--nord4)" fontFamily="monospace">
        8:14
      </text>
    </Chrome>
  );
}

// LoChord is hardware, so this one draws the device rather than a browser.
function DeviceShot() {
  const keys = [
    { x: 196, y: 150, w: 60 },
    { x: 262, y: 150, w: 60 },
    { x: 328, y: 150, w: 60 },
    { x: 394, y: 150, w: 60 }
  ];
  const topKeys = [
    { x: 196, y: 112, w: 44 },
    { x: 246, y: 112, w: 30 },
    { x: 282, y: 112, w: 44 }
  ];

  return (
    <>
      <rect x="0" y="0" width="640" height="240" rx="8" fill="var(--shot-bg)" />
      <rect x="70" y="18" width="500" height="204" rx="14" fill="var(--nord1)" stroke="var(--nord3)" />

      {/* 2.79" 428x142 display */}
      <rect x="196" y="34" width="258" height="62" rx="4" fill="var(--nord0)" stroke="var(--nord3)" />
      <text x="206" y="52" fontSize="9" fill="var(--nord8)" fontFamily="monospace">
        C maj7
      </text>
      <text x="206" y="66" fontSize="8" fill="var(--nord4)" fontFamily="monospace">
        scale: C major   bpm 96
      </text>
      <rect x="206" y="74" width="150" height="5" rx="2.5" fill="var(--nord2)" />
      <rect x="206" y="74" width="92" height="5" rx="2.5" fill="var(--nord14)" />
      <circle cx="438" cy="46" r="5" fill="var(--nord11)" />
      <text x="380" y="88" fontSize="8" fill="var(--nord3)" fontFamily="monospace">
        REC
      </text>

      {/* chord keys */}
      {topKeys.map((key) => (
        <rect
          key={`t${key.x}`}
          x={key.x}
          y={key.y}
          width={key.w}
          height="30"
          rx="4"
          fill="var(--nord2)"
          stroke="var(--nord3)"
        />
      ))}
      {keys.map((key, index) => (
        <rect
          key={`b${key.x}`}
          x={key.x}
          y={key.y}
          width={key.w}
          height="34"
          rx="4"
          fill={index === 1 ? "var(--nord9)" : "var(--nord2)"}
          stroke="var(--nord3)"
        />
      ))}
      <rect x="332" y="112" width="122" height="30" rx="4" fill="var(--nord2)" stroke="var(--nord3)" />
      <text x="342" y="131" fontSize="8" fill="var(--nord3)" fontFamily="monospace">
        loop
      </text>

      {/* joystick */}
      <circle cx="126" cy="150" r="34" fill="var(--nord2)" stroke="var(--nord3)" />
      <circle cx="126" cy="150" r="18" fill="var(--nord0)" />
      <circle cx="136" cy="142" r="9" fill="var(--nord15)" />
      <text x="96" y="200" fontSize="8" fill="var(--nord3)" fontFamily="monospace">
        voicing
      </text>

      {/* encoders */}
      {[
        [126, 62, "var(--nord13)"],
        [508, 70, "var(--nord7)"],
        [508, 140, "var(--nord12)"]
      ].map(([cx, cy, colour]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="22" fill="var(--nord2)" stroke="var(--nord3)" />
          <circle cx={cx} cy={cy} r="13" fill="var(--nord0)" />
          <rect x={cx - 1.5} y={cy - 13} width="3" height="9" rx="1.5" fill={colour} />
        </g>
      ))}

      {/* usb-c + headphone jack */}
      <rect x="296" y="212" width="48" height="9" rx="4.5" fill="var(--nord3)" />
      <circle cx="410" cy="216" r="7" fill="var(--nord0)" stroke="var(--nord3)" />
      <text x="286" y="234" fontSize="8" fill="var(--nord3)" fontFamily="monospace">
        USB-C MIDI
      </text>
    </>
  );
}

function BlankShot() {
  return (
    <>
      <rect
        x="1"
        y="1"
        width="638"
        height="238"
        rx="8"
        fill="none"
        stroke="var(--nord3)"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
      <text
        x="320"
        y="112"
        fontSize="16"
        fill="var(--nord3)"
        fontFamily="monospace"
        textAnchor="middle"
      >
        [ no screenshot yet ]
      </text>
      <text
        x="320"
        y="140"
        fontSize="11"
        fill="var(--nord3)"
        fontFamily="monospace"
        textAnchor="middle"
      >
        drop one in src/assets/previews/
      </text>
    </>
  );
}

const MOCKUPS = {
  chart: ChartShot,
  editor: EditorShot,
  device: DeviceShot,
  blank: BlankShot
};

export default function ProjectShot({ mockup, image, alt, caption }) {
  const Mockup = MOCKUPS[mockup] ?? BlankShot;

  // The media and the caption are separate block elements on purpose. The
  // cursor grid measures a row element with one DOM Range, and a Range that
  // spans a picture *and* text reports the picture as another line of text -
  // so the caption got dealt out across both, and every column on it was
  // wrong. One element per row keeps the two from being confused.
  return (
    <>
      <p className={`project-shot${image ? " photo" : ""}`}>
        <span className="project-shot-frame">
          {image ? (
            // The intrinsic size is declared so the browser reserves the right
            // box before the file arrives. Without it the page reflows on load
            // and the cursor grid has to be measured twice.
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={alt}
              className="project-shot-image"
            />
          ) : (
            <svg viewBox={VIEW} className="project-shot-svg" role="img" aria-label={alt}>
              <Mockup />
            </svg>
          )}
        </span>
      </p>
      {caption && <p className="project-shot-caption">{caption}</p>}
    </>
  );
}
