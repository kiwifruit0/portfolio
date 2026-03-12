import React, { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Education from "./pages/Education";

const pages = {
  "index.md": {
    name: "index.md",
    language: "markdown",
    component: Home
  },
  "projects.cpp": {
    name: "projects.cpp",
    language: "c++",
    component: Projects,
    icon: ""
  },
  "experience.py": {
    name: "experience.py",
    language: "python",
    component: Experience,
    icon: ""
  },
  "education.sh": {
    name: "education.sh",
    language: "bash",
    component: Education,
    icon: ""
  },
  "asdfasdf": {
    name: "asdfasdf",
    language: "adasdf"
  }
};

export default function App() {
  const [activeFileName, setActiveFileName] = useState("index.md");

  const activePage = pages[activeFileName];
  const ActiveComponent = activePage.component;
  console.log(activePage);

  return (
    <div className="app-container">

      <Navbar
        pages={Object.keys(pages)}
        onNavigate={setActiveFileName}
      />

      <div className="nvim-container">
        <Sidebar
          files={Object.keys(pages)}
          activeFileName={activeFileName}
          onFileSelect={setActiveFileName}
        />

        <Editor file={activePage}>
          <ActiveComponent />
        </Editor>
      </div>

    </div>
  );
}
