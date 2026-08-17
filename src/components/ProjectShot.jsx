// Themeable UI previews for the projects page.
//
// These are hand-drawn wireframes, not photographs: they repaint with the
// active colorscheme, which real screenshots cannot do. To swap in a real
// screenshot, drop a PNG in src/assets/previews/ and set `image` on the
// project entry in src/content/projects.js.

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

function bars(count, x, y, gap, maxHeight, seed) {
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.abs(Math.sin((i + seed) * 1.7));
    const height = 4 + wave * maxHeight;
    return (
      <rect
        key={i}
        x={x + i * gap}
        y={y - height / 2}
        width={gap - 2}
        height={height}
        rx="1.5"
        fill={i % 5 === 0 ? "var(--nord8)" : "var(--nord9)"}
        opacity={0.55 + wave * 0.45}
      />
    );
  });
}

function EchoShot() {
  return (
    <Chrome title="echo — daily voice">
      <rect x="16" y="38" width="300" height="80" rx="6" fill="var(--nord1)" />
      <circle cx="42" cy="60" r="10" fill="var(--nord15)" />
      <rect x="60" y="54" width="90" height="7" rx="3.5" fill="var(--nord4)" opacity="0.8" />
      <rect x="60" y="66" width="56" height="6" rx="3" fill="var(--nord3)" />
      <g>{bars(30, 26, 96, 9, 34, 0.4)}</g>

      <rect x="16" y="128" width="300" height="80" rx="6" fill="var(--nord1)" />
      <circle cx="42" cy="150" r="10" fill="var(--nord7)" />
      <rect x="60" y="144" width="120" height="7" rx="3.5" fill="var(--nord4)" opacity="0.8" />
      <rect x="60" y="156" width="70" height="6" rx="3" fill="var(--nord3)" />
      <g>{bars(30, 26, 186, 9, 26, 2.1)}</g>

      <rect x="332" y="38" width="292" height="170" rx="6" fill="var(--nord1)" />
      <text x="346" y="56" fontSize="9" fill="var(--nord3)" fontFamily="monospace">
        friend graph
      </text>
      <g stroke="var(--nord10)" strokeWidth="1.2" opacity="0.7">
        <line x1="478" y1="130" x2="400" y2="88" />
        <line x1="478" y1="130" x2="556" y2="92" />
        <line x1="478" y1="130" x2="392" y2="172" />
        <line x1="478" y1="130" x2="548" y2="176" />
        <line x1="400" y1="88" x2="556" y2="92" />
        <line x1="392" y1="172" x2="548" y2="176" />
      </g>
      <circle cx="478" cy="130" r="16" fill="var(--nord8)" />
      <circle cx="400" cy="88" r="9" fill="var(--nord15)" />
      <circle cx="556" cy="92" r="9" fill="var(--nord14)" />
      <circle cx="392" cy="172" r="9" fill="var(--nord13)" />
      <circle cx="548" cy="176" r="9" fill="var(--nord12)" />

      <rect x="240" y="196" width="76" height="24" rx="12" fill="var(--nord11)" />
      <circle cx="262" cy="208" r="5" fill="var(--nord6)" />
      <rect x="272" y="205" width="34" height="6" rx="3" fill="var(--nord6)" opacity="0.85" />
    </Chrome>
  );
}

function MapShot() {
  return (
    <Chrome title="outside — go outside, get points">
      <rect x="16" y="38" width="380" height="170" rx="6" fill="var(--nord1)" />
      <g stroke="var(--nord2)" strokeWidth="6" fill="none">
        <path d="M16 96 H396" />
        <path d="M16 160 H396" />
        <path d="M120 38 V208" />
        <path d="M280 38 V208" />
      </g>
      <rect x="140" y="110" width="120" height="36" rx="4" fill="var(--nord2)" opacity="0.8" />
      <rect x="300" y="52" width="70" height="30" rx="4" fill="var(--nord2)" opacity="0.8" />
      <g>
        <circle cx="120" cy="96" r="18" fill="var(--nord14)" opacity="0.22" />
        <circle cx="120" cy="96" r="6" fill="var(--nord14)" />
        <circle cx="280" cy="160" r="6" fill="var(--nord13)" />
        <circle cx="330" cy="120" r="6" fill="var(--nord15)" />
        <circle cx="70" cy="170" r="6" fill="var(--nord12)" />
      </g>

      <rect x="410" y="38" width="214" height="170" rx="6" fill="var(--nord1)" />
      <text x="424" y="58" fontSize="9" fill="var(--nord3)" fontFamily="monospace">
        leaderboard
      </text>
      {[0, 1, 2, 3, 4].map((row) => (
        <g key={row}>
          <rect x="424" y={70 + row * 26} width="14" height="14" rx="3" fill="var(--nord2)" />
          <rect
            x="446"
            y={73 + row * 26}
            width={150 - row * 22}
            height="8"
            rx="4"
            fill={row === 0 ? "var(--nord13)" : "var(--nord9)"}
            opacity={row === 0 ? 1 : 0.7 - row * 0.1}
          />
        </g>
      ))}
    </Chrome>
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
  echo: EchoShot,
  map: MapShot,
  chart: ChartShot,
  editor: EditorShot,
  device: DeviceShot,
  blank: BlankShot
};

export default function ProjectShot({ mockup, image, alt, caption }) {
  const Mockup = MOCKUPS[mockup] ?? BlankShot;

  return (
    <p className="project-shot">
      <span className="project-shot-frame">
        {image ? (
          <img src={image} alt={alt} className="project-shot-image" />
        ) : (
          <svg viewBox={VIEW} className="project-shot-svg" role="img" aria-label={alt}>
            <Mockup />
          </svg>
        )}
      </span>
      {caption && <span className="project-shot-caption">{caption}</span>}
    </p>
  );
}
