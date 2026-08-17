// Modelled on neovim's :checkhealth output. Levels mirror the real thing:
//   OK   - used in anger, on something that shipped
//   INFO - context, or something in progress
//   WARN - honestly still learning
export const healthSections = [
  {
    id: "languages",
    title: "Languages",
    entries: [
      {
        level: "OK",
        name: "Python",
        note: "main language. FastAPI backends, the dbt automation tool at Technicus, and the grade-predictor model."
      },
      {
        level: "OK",
        name: "Java",
        note: "Spring Boot services behind the file-transfer platform at NatWest."
      },
      {
        level: "OK",
        name: "C++",
        note: "systems coursework, and the ESP32-S3 firmware for LoChord."
      },
      {
        level: "OK",
        name: "C",
        note: "operating systems and computer architecture coursework."
      },
      {
        level: "OK",
        name: "SQL",
        note: "migration work at Technicus, plus the data management module."
      },
      {
        level: "OK",
        name: "JavaScript",
        note: "React frontends for Echo, Outside, and this site."
      },
      {
        level: "OK",
        name: "Bash",
        note: "Linux is my only desktop OS, so this one is unavoidable."
      },
      {
        level: "INFO",
        name: "Rust",
        note: "learning it properly this year. Nothing shipped yet, so I won't claim it."
      }
    ]
  },
  {
    id: "backend",
    title: "Backend and data",
    entries: [
      {
        level: "OK",
        name: "FastAPI",
        note: "the backend behind both hackathon wins, including a low-latency voice pipeline."
      },
      {
        level: "OK",
        name: "Spring Boot",
        note: "request and approval pipeline for internal file transfers at NatWest."
      },
      {
        level: "OK",
        name: "dbt",
        note: "config-driven transformations across a full client pipeline."
      },
      {
        level: "OK",
        name: "MongoDB",
        note: "Atlas, storing and serving audio for Echo."
      },
      {
        level: "OK",
        name: "REST API design",
        note: "the seam between every frontend and backend I have written."
      },
      {
        level: "OK",
        name: "AWS",
        note: "deployment and storage during my internships."
      }
    ]
  },
  {
    id: "systems",
    title: "Systems and security",
    entries: [
      {
        level: "OK",
        name: "Operating systems",
        note: "processes, scheduling, virtual memory. Favourite module of the degree so far."
      },
      {
        level: "OK",
        name: "Networks and security",
        note: "protocol design and the threat model behind it; directly useful in regulated fintech."
      },
      {
        level: "OK",
        name: "System architecture",
        note: "caches, pipelines, and why the fast path is fast."
      },
      {
        level: "OK",
        name: "Concurrency",
        note: "threads, locks, and the bugs they cause."
      },
      {
        level: "OK",
        name: "Linux",
        note: "daily driver for four years, Arch specifically."
      }
    ]
  },
  {
    id: "embedded",
    title: "Embedded",
    entries: [
      {
        level: "OK",
        name: "ESP32-S3",
        note: "LoChord: native USB MIDI over TinyUSB, an SPI display, encoders and a joystick."
      },
      {
        level: "OK",
        name: "PlatformIO / Arduino",
        note: "the toolchain for every microcontroller project I have built."
      },
      {
        level: "OK",
        name: "I2C / SPI",
        note: "talking to displays and peripherals, and reading a datasheet to find out why it isn't working."
      },
      {
        level: "WARN",
        name: "KiCad",
        note: "self-taught and still learning. LoChord is the first board I have taken from schematic to layout."
      }
    ]
  },
  {
    id: "frontend",
    title: "Frontend",
    entries: [
      {
        level: "OK",
        name: "React",
        note: "every project on the projects page, including this one."
      },
      {
        level: "OK",
        name: "Tailwind",
        note: "the two hackathon builds, where speed mattered more than bespoke CSS."
      },
      {
        level: "OK",
        name: "Vite",
        note: "build tooling for this site."
      },
      {
        level: "INFO",
        name: "LVGL",
        note: "embedded UI for LoChord's 428x142 display, laid out in EEZ Studio."
      }
    ]
  },
  {
    id: "tooling",
    title: "Tooling",
    entries: [
      { level: "OK", name: "Git", note: "branches, rebases, and the occasional reflog rescue." },
      { level: "OK", name: "CMake", note: "building C and C++ projects that have more than one file." },
      { level: "OK", name: "Jupyter", note: "where the grade predictor was actually figured out." },
      { level: "OK", name: "Neovim", note: "see: this entire website." }
    ]
  },
  {
    id: "offline",
    title: "Away from the keyboard",
    entries: [
      { level: "INFO", name: "Guitar", note: "playing them, and fixing up old ones." },
      { level: "INFO", name: "Ableton", note: "making music, which is partly why LoChord exists." },
      { level: "INFO", name: "Volleyball", note: "regularly, and badly." }
    ]
  }
];

export const healthSummary = [
  { level: "OK", name: "Degree", note: "1st in both years so far, on track for a 1st overall." },
  { level: "OK", name: "Industry", note: "two summers shipped: NatWest 2026, Technicus 2025." },
  { level: "INFO", name: "Availability", note: "graduate roles starting summer or autumn 2027." }
];
