// Each entry gets one preview. `image` wins when it is set: that is a real
// screenshot out of src/assets/projects/. Entries without one fall back to
// `mockup`, a themeable inline SVG wireframe from components/ProjectShot.jsx,
// which is what the shipped-nothing-to-photograph projects use.
//
// The .webp files are downscaled from the source .png screenshots in the same
// folder; the originals are ~4MB and have no business in a bundle.
export const projects = [
  {
    id: "echo",
    name: "Echo",
    tagline: "1st place - ElevenLabs track, SotonHack 2026",
    period: "Feb 2026",
    award: "1st place",
    image: { src: new URL("../assets/projects/echo.webp", import.meta.url).href, width: 1440, height: 857 },
    shotCaption: "the daily summary prompt, mid-playback",
    tech: ["React", "Tailwind", "Python", "FastAPI", "ElevenLabs", "Gemini", "MongoDB"],
    link: "github.com/kiwifruit0/Echo",
    desc:
      "A voice-based social app that crosses the semi-anonymous forum style of Reddit with the daily-prompt rhythm of BeReal. Everything is spoken: you leave a voice note, and the feed answers back in voice.",
    points: [
      "Built a low-latency voice pipeline in Python FastAPI using ElevenLabs for TTS and STT, storing audio in MongoDB Atlas.",
      "Integrated Gemini for intent detection, summarisation, and interest classification so each user's feed is personalised.",
      "Designed the frontend in React and Tailwind with reactive 3D visuals and a 3D connected friend graph.",
      "Won the ElevenLabs track out of the whole hackathon field."
    ]
  },
  {
    id: "wander",
    name: "Wander",
    tagline: "1st place - Soton Data Science x WECS Hackathon",
    period: "Nov 2025",
    award: "1st place",
    image: { src: new URL("../assets/projects/wander.webp", import.meta.url).href, width: 1444, height: 859 },
    shotCaption: "the world map, with the player card and category stats",
    tech: ["React", "Tailwind", "Python", "FastAPI", "Mapbox", "REST"],
    link: "github.com/Ryan-Shino/WECSHackathonProject",
    desc:
      "A location-aware web app that gamifies going outside. Visit a gym, a park, or a cafe and the app classifies where you are and turns it into points, stats, and a leaderboard.",
    points: [
      "Implemented real-time geolocation processing with Mapbox to classify the kind of place a user had walked into.",
      "Built the Python FastAPI backend and wired it to a React + Tailwind frontend over REST.",
      "Designed a progression system with category-based stat tracking and competitive leaderboards.",
      "Owned the API integration between the frontend and the geolocation service."
    ]
  },
  {
    id: "grade-predictor",
    name: "Grade Predictor",
    tagline: "Machine learning coursework, taken further",
    period: "2025",
    mockup: "chart",
    shotCaption: "feature weights and predicted vs actual grades",
    tech: ["Python", "NumPy", "Regression", "Jupyter"],
    link: "github.com/kiwifruit0/grade_predictor",
    desc:
      "A prototype that predicts student grades from academic and non-academic attributes, so educators can spot who might need extra support before results day rather than after.",
    points: [
      "Engineered features and built a custom regression model in Python, trained on an open-source dataset.",
      "Tuned the regression algorithm and evaluated performance, improving roughly 15% over a baseline linear model.",
      "Surfaced the most influential attributes behind student outcomes, giving educators visibility into key predictors.",
      "Wrote the whole model without a high-level ML framework, to actually understand the maths."
    ]
  },
  {
    id: "portfolio",
    name: "This Website",
    tagline: "A portfolio that behaves like my editor",
    period: "2025 - present",
    mockup: "editor",
    shotCaption: "you are looking at it",
    tech: ["React", "Vite", "CSS"],
    link: "github.com/kiwifruit0/portfolio",
    desc:
      "A single-page React app that pretends to be Neovim. Real block cursor on a measured text grid, hjkl motions, an ex command line, Telescope-style fuzzy finder, live grep, and seven colorschemes.",
    points: [
      "Measures every rendered line with DOM Ranges so the block cursor lands on real characters, even through wrapped text.",
      "Implements a usable subset of vim motions: hjkl, w/b/e, 0/^/$, gg/G, {/}, ctrl-d/u, zz, and gx to follow links.",
      "Ships an ex command line with tab completion and history, plus a fuzzy finder over files, commands and page contents.",
      "Themes are pure CSS custom properties, so :colorscheme repaints the entire site instantly."
    ]
  },
  {
    id: "lochord",
    name: "LoChord",
    tagline: "A real-time MIDI chord instrument, hardware and firmware",
    period: "2026 - present",
    status: "wip",
    badge: "in progress",
    mockup: "device",
    shotCaption: "chord keys, joystick voicing, three encoders, 2.79\" LVGL display",
    tech: ["ESP32-S3", "C++", "PlatformIO", "TinyUSB", "LVGL", "KiCad", "MIDI"],
    link: "",
    desc:
      "A pocket chord instrument I am designing from the schematic up. Eight low-profile keys play chords within a scale, a joystick reshapes the voicing as you hold them, and a loop button drives a record/play/overdub state machine. It speaks class-compliant USB MIDI, so it drives anything in Ableton.",
    points: [
      "Writing the firmware in C++ on an ESP32-S3 with PlatformIO, using the chip's native USB via TinyUSB for MIDI with no adapter in the middle.",
      "Designing the board myself in KiCad: 8 Kailh Choc switches, 3 clickable rotary encoders, a Switch joystick module on a 0.5mm FPC, and an SPI TFT.",
      "Driving a 428x142 NV3007 display with LVGL, with the interface laid out in EEZ Studio.",
      "Keeping firmware and hardware honest with a single PINOUT.md that both sides have to agree with before either changes.",
      "Next: an onboard wavetable synth over an I2S codec, which is why the headphone jack and analogue rail are already on the board."
    ]
  }
];
