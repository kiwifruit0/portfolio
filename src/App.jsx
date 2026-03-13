import React, { Suspense, lazy, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Education from "./pages/Education";

const CV = lazy(() => import("./pages/CV"));

const pages = {
  "index.md": {
    name: "index.md",
    language: "markdown",
    component: Home,
    icon: "mdi:language-markdown"
  },
  "projects.cpp": {
    name: "projects.cpp",
    language: "c++",
    component: Projects,
    icon: "mdi:language-cpp"
  },
  "experience.py": {
    name: "experience.py",
    language: "python",
    component: Experience,
    icon: "mdi:language-python"
  },
  "education.sh": {
    name: "education.sh",
    language: "bash",
    component: Education,
    icon: "mdi:terminal-line"
  },
  "cv.pdf": {
    name: "cv.pdf",
    language: "pdf",
    component: CV,
    icon: "mdi:file-pdf-box"
  }
};

export default function App() {
  const [activeFileName, setActiveFileName] = useState("index.md");

  const activePage = pages[activeFileName];
  const ActiveComponent = activePage.component;

  return (
    <div className="app-container">

      <Navbar
        pages={Object.keys(pages)}
        activeFileName={activeFileName}
        onNavigate={setActiveFileName}
      />

      <div className="nvim-container">
        <Sidebar
          pages={pages}
          activeFileName={activeFileName}
          onFileSelect={setActiveFileName}
        />

        <Editor file={activePage}>
          <Suspense fallback={<div className="page"><p>Loading viewer...</p></div>}>
            <ActiveComponent />
          </Suspense>
        </Editor>
      </div>

    </div>
  );
}
