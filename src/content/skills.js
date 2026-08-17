// Laid out like lazy.nvim's plugin list. `state` is deliberately not a grade:
// "loaded" means I use it on real work, "learning" means I am still picking it
// up and will say so. Each note describes what the thing lets me do, not the
// single job I happened to use it on.
export const skillSections = [
  {
    id: "languages",
    title: "Languages",
    entries: [
      {
        name: "C++",
        state: "loaded",
        note: "systems and performance-critical code, real-time firmware, and anything where memory and latency are mine to control"
      },
      {
        name: "Python",
        state: "loaded",
        note: "general-purpose workhorse: backend services, data pipelines, machine learning, and automation"
      },
      {
        name: "Java",
        state: "loaded",
        note: "backend services in a regulated codebase, with the review and testing that banking demands"
      },
      {
        name: "C",
        state: "loaded",
        note: "operating systems, memory, and architecture - what everything above is actually doing"
      },
      {
        name: "SQL",
        state: "loaded",
        note: "schema design, query work, and moving large datasets between systems without losing any of it"
      },
      {
        name: "JavaScript",
        state: "loaded",
        note: "interactive React frontends, two of them prizewinning, and this editor"
      },
      {
        name: "Bash",
        state: "loaded",
        note: "automation and glue; Linux is my only desktop OS"
      },
      {
        name: "Rust",
        state: "learning",
        note: "learning it properly this year, nothing shipped yet, so I won't claim it"
      }
    ]
  },
  {
    id: "backend",
    title: "Backend and data",
    entries: [
      {
        name: "FastAPI",
        state: "loaded",
        note: "REST services and low-latency streaming; the backend behind both hackathon wins"
      },
      {
        name: "Spring Boot",
        state: "loaded",
        note: "request and approval pipelines inside a bank's internal network"
      },
      {
        name: "dbt",
        state: "loaded",
        note: "config-driven transformations across a full client pipeline, 40 manual steps down to 11"
      },
      {
        name: "MongoDB",
        state: "loaded",
        note: "document modelling and Atlas, including storing and serving audio"
      },
      {
        name: "REST design",
        state: "loaded",
        note: "the seam between every frontend and backend I have written"
      },
      {
        name: "AWS",
        state: "loaded",
        note: "deployment and storage across both internships"
      }
    ]
  },
  {
    id: "systems",
    title: "Systems and security",
    entries: [
      {
        name: "Operating systems",
        state: "loaded",
        note: "processes, scheduling, virtual memory, and the concurrency bugs that come with them"
      },
      {
        name: "Architecture",
        state: "loaded",
        note: "caches, pipelines, and reasoning about why the fast path is fast"
      },
      {
        name: "Networks & sec",
        state: "loaded",
        note: "protocol design and the threat model behind it; directly useful in regulated fintech"
      },
      {
        name: "Linux",
        state: "loaded",
        note: "daily driver for years, configured by hand, debugged at the syscall level"
      }
    ]
  },
  {
    id: "embedded",
    title: "Embedded",
    entries: [
      {
        name: "ESP32-S3",
        state: "loaded",
        note: "real-time firmware: native USB MIDI, SPI displays, encoder and joystick input"
      },
      {
        name: "PlatformIO",
        state: "loaded",
        note: "the toolchain behind every microcontroller project I have built"
      },
      {
        name: "I2C / SPI",
        state: "loaded",
        note: "driving peripherals, and reading the datasheet to find out why they aren't driving"
      },
      {
        name: "KiCad",
        state: "learning",
        note: "first board taken from schematic all the way to layout; still learning the craft"
      },
      {
        name: "LVGL",
        state: "learning",
        note: "embedded UI on a 428x142 display, laid out in EEZ Studio"
      }
    ]
  },
  {
    id: "frontend",
    title: "Frontend",
    entries: [
      {
        name: "React",
        state: "loaded",
        note: "every project on the projects page, including the one you are reading"
      },
      {
        name: "Tailwind",
        state: "loaded",
        note: "when shipping in 24 hours matters more than bespoke CSS"
      },
      {
        name: "Vite",
        state: "loaded",
        note: "build tooling and dev server for this site"
      }
    ]
  },
  {
    id: "tooling",
    title: "Tooling",
    entries: [
      { name: "Git", state: "loaded", note: "branches, rebases, and the occasional reflog rescue" },
      { name: "CMake", state: "loaded", note: "building C and C++ projects with more than one file in them" },
      { name: "Jupyter", state: "loaded", note: "where the grade predictor was actually worked out" },
      { name: "Neovim", state: "loaded", note: "see: this entire website" }
    ]
  }
];

export const skillFooter = [
  "Two summers in industry, two hackathon wins, and firsts in both years so far.",
  "Everything marked in use has been written against something real. The three still",
  "loading are honest gaps, and I would rather say so than pad the list."
];
