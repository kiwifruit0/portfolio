import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./themes.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Finder from "./components/Finder";
import FloatWindow from "./components/FloatWindow";
import WhichKey from "./components/WhichKey";
import { useCommandLine } from "./components/CommandLine";

import { LEADER_MAP } from "./lib/commands";
import { DEFAULT_THEME, applyTheme, isTheme, loadTheme, persistTheme } from "./lib/themes";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Skills from "./pages/Skills";

import cvPdfUrl from "./assets/Toby_Jennings_CV.pdf?url";

const CV = lazy(() => import("./pages/CV"));

const pages = {
  "index.md": { name: "index.md", language: "markdown", component: Home, icon: "mdi:language-markdown" },
  "projects.cpp": { name: "projects.cpp", language: "cpp", component: Projects, icon: "mdi:language-cpp" },
  "experience.py": { name: "experience.py", language: "python", component: Experience, icon: "mdi:language-python" },
  "education.sh": { name: "education.sh", language: "bash", component: Education, icon: "mdi:terminal" },
  "skills.health": { name: "skills.health", language: "checkhealth", component: Skills, icon: "mdi:heart-pulse" },
  "cv.pdf": { name: "cv.pdf", language: "pdf", component: CV, icon: "mdi:file-pdf-box" },
  "contact.java": { name: "contact.java", language: "java", component: Contact, icon: "mdi:card-account-phone-outline" }
};

const FILES = Object.keys(pages);

const DEFAULT_OPTIONS = {
  number: true,
  relativeNumber: false,
  cursorLine: true,
  listChars: false
};

export default function App() {
  const [activeFileName, setActiveFileName] = useState("index.md");
  const [theme, setThemeState] = useState(loadTheme);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [overlay, setOverlay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leader, setLeader] = useState(null);
  const leaderTimer = useRef(null);
  const editorApi = useRef(null);

  const activePage = pages[activeFileName];
  const ActiveComponent = activePage.component;

  /* ----------------------------------------------------------------- theme */

  // The document attribute is the external system here; state is the source.
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((id, { persist = true } = {}) => {
    const next = isTheme(id) ? id : DEFAULT_THEME;
    setThemeState(next);
    if (persist) {
      persistTheme(next);
    }
  }, []);

  /* -------------------------------------------------------------- commands */

  // `cli` is created further down but navigation needs to reset its search, so
  // it is reached through a ref that is refreshed after every render.
  const cliRef = useRef(null);

  const navigate = useCallback((file) => {
    if (!pages[file]) return;
    cliRef.current?.clearSearch();
    setActiveFileName(file);
  }, []);

  const openFinder = useCallback((source, query = "") => {
    setOverlay({ type: "finder", source, query });
  }, []);

  const openWindow = useCallback((title, lines, variant) => {
    setOverlay({ type: "window", title, lines, variant });
  }, []);

  const closeOverlay = useCallback(() => setOverlay(null), []);

  const setOption = useCallback((key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const downloadCv = useCallback(() => {
    const anchor = document.createElement("a");
    anchor.href = cvPdfUrl;
    anchor.download = "Toby_Jennings_CV.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, []);

  const gotoLine = useCallback((line) => {
    editorApi.current?.gotoLine(line);
  }, []);

  const commandContext = useMemo(
    () => ({
      fileName: activeFileName,
      files: FILES,
      navigate,
      theme,
      setTheme,
      openFinder,
      openWindow,
      toggleSidebar: () => setSidebarOpen((open) => !open),
      options,
      setOption,
      downloadCv,
      gotoLine
    }),
    [activeFileName, navigate, theme, setTheme, openFinder, openWindow, options, setOption, downloadCv, gotoLine]
  );

  const cli = useCommandLine(commandContext);

  useEffect(() => {
    cliRef.current = cli;
  }, [cli]);

  const { mode, enterCommandMode, enterSearchMode, exitMode, nextMatch, searchQuery, clearSearch, runCommandLine } = cli;

  /* ---------------------------------------------------------- global keys */

  const cancelLeader = useCallback(() => {
    window.clearTimeout(leaderTimer.current);
    setLeader(null);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      if (overlay) return;

      if (event.ctrlKey && !event.shiftKey && !event.altKey) {
        if (event.key === "p") {
          event.preventDefault();
          openFinder("files");
          return;
        }
        if (event.key === "g") {
          event.preventDefault();
          openFinder("grep");
          return;
        }
      }

      if (mode !== "normal") return;

      if (leader !== null) {
        event.preventDefault();
        if (event.key === "Escape") {
          cancelLeader();
          return;
        }
        if (event.key.length !== 1) return;

        const next = leader + event.key;
        const exact = LEADER_MAP.find((entry) => entry.keys === next);
        if (exact) {
          cancelLeader();
          runCommandLine(exact.command);
          return;
        }
        if (LEADER_MAP.some((entry) => entry.keys.startsWith(next))) {
          window.clearTimeout(leaderTimer.current);
          leaderTimer.current = window.setTimeout(() => setLeader(null), 2500);
          setLeader(next);
          return;
        }
        cancelLeader();
        return;
      }

      switch (event.key) {
        case " ":
          event.preventDefault();
          window.clearTimeout(leaderTimer.current);
          leaderTimer.current = window.setTimeout(() => setLeader(null), 2500);
          setLeader("");
          return;
        case ":":
          event.preventDefault();
          enterCommandMode();
          return;
        case "/":
          event.preventDefault();
          enterSearchMode();
          return;
        case "?":
          event.preventDefault();
          openWindow("help", null, "help");
          return;
        case "n":
          if (searchQuery) {
            event.preventDefault();
            nextMatch(1);
          }
          return;
        case "N":
          if (searchQuery) {
            event.preventDefault();
            nextMatch(-1);
          }
          return;
        case "Escape":
          clearSearch();
          exitMode();
          return;
        default:
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    cancelLeader,
    clearSearch,
    enterCommandMode,
    enterSearchMode,
    exitMode,
    leader,
    mode,
    nextMatch,
    openFinder,
    openWindow,
    overlay,
    runCommandLine,
    searchQuery
  ]);

  useEffect(() => () => window.clearTimeout(leaderTimer.current), []);

  /* ------------------------------------------------------- desktop scroll */

  useEffect(() => {
    const handleWheel = (event) => {
      if (window.innerWidth < 1024 || event.ctrlKey) return;
      const scroller = document.querySelector(".editor-scroll-container");
      if (!(scroller instanceof HTMLElement)) return;
      event.preventDefault();
      scroller.scrollBy({ top: event.deltaY, left: 0 });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const inputLocked = Boolean(overlay) || mode !== "normal" || leader !== null;

  return (
    <div className="app-container">
      <Navbar
        pages={pages}
        activeFileName={activeFileName}
        onNavigate={navigate}
        theme={theme}
        onCycleTheme={() => openFinder("themes")}
        onOpenFinder={() => openFinder("files")}
      />

      <div className="nvim-container">
        {sidebarOpen && (
          <Sidebar
            pages={pages}
            activeFileName={activeFileName}
            onFileSelect={navigate}
            theme={theme}
          />
        )}

        <Editor
          key={activeFileName}
          file={activePage}
          cli={cli}
          options={options}
          inputLocked={inputLocked}
          apiRef={editorApi}
        >
          <Suspense fallback={<div className="page"><p>Loading viewer...</p></div>}>
            <ActiveComponent />
          </Suspense>
        </Editor>
      </div>

      {leader !== null && <WhichKey pending={leader} />}

      {overlay?.type === "finder" && (
        <Finder
          key={overlay.source}
          source={overlay.source}
          initialQuery={overlay.query}
          files={FILES}
          pages={pages}
          commands={cli.commands}
          theme={theme}
          onSetTheme={setTheme}
          onNavigate={navigate}
          onRunCommand={(command) => command.run("")}
          onClose={closeOverlay}
        />
      )}

      {overlay?.type === "window" && (
        <FloatWindow
          title={overlay.title}
          lines={overlay.lines}
          variant={overlay.variant}
          commands={cli.commands}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
}
