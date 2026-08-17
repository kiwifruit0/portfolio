// `mockup` selects a themeable inline SVG wireframe from components/ProjectShot.jsx.
// To use a real screenshot instead, drop a PNG in src/assets/previews/ and set
// `image: new URL("../assets/previews/echo.png", import.meta.url).href` on the entry.
export const projects = [
  {
    id: "echo",
    name: "Echo",
    tagline: "1st place - ElevenLabs track, SotonHack 2026",
    period: "Feb 2026",
    award: "1st place",
    mockup: "echo",
    shotCaption: "voice feed, recorder, and the 3D friend graph",
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
    id: "wecs",
    name: "Outside",
    tagline: "1st place - Soton Data Science x WECS Hackathon",
    period: "Nov 2025",
    award: "1st place",
    mockup: "map",
    shotCaption: "live map, category stats, and the leaderboard",
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
    id: "fyp",
    name: "Final-Year Project",
    tagline: "In progress - 2026/27",
    period: "2026 - 2027",
    status: "wip",
    mockup: "blank",
    shotCaption: "placeholder - swap this entry out once the project is underway",
    tech: ["TBC"],
    link: "",
    desc:
      "Placeholder for my individual final-year project. This entry is a scaffold, not a real project yet - fill in the title, stack, and outcomes as the year progresses.",
    points: [
      "TODO: one line on the problem and why it matters.",
      "TODO: the technical approach and the hardest part of it.",
      "TODO: a measurable result.",
      "TODO: link to the repo or write-up."
    ]
  }
];
