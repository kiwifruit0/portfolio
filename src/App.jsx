import React, { useState } from 'react';
import './App.css';

const fileSystem = {
  'index.md': {
    name: 'index.md',
    language: 'markdown',
    content: [
      '# INTRODUCTION',
      '',
      "Hi, I'm a 2nd year CS student at Southampton looking for SWE roles.",
      'Current focus: "Full-stack web development & distributed systems"'
    ]
  },
  'projects.rs': {
    name: 'projects.rs',
    language: 'rust',
    content: [
      'fn main() {',
      '    let projects = vec![',
      '        "Neovim Portfolio Website",',
      '        "Distributed Key-Value Store",',
      '        "Machine Learning Pipeline",',
      '    ];',
      '    println!("{:#?}", projects);',
      '}'
    ]
  },
  'experience.ts': {
    name: 'experience.ts',
    language: 'typescript',
    content: [
      'interface Role {',
      '  company: string;',
      '  title: string;',
      '  techStack: string[];',
      '}',
      '',
      'const internship: Role = {',
      '  company: "Looking for 2026 Opportunities!",',
      '  title: "Software Engineering Intern",',
      '  techStack: ["React", "Node.js", "Python", "Go"]',
      '};'
    ]
  }
};

export default function App() {
  // state to track which file is currently active
  const [activeFileName, setActiveFileName] = useState('index.md');
  const activeFile = fileSystem[activeFileName];

  return (
    <div className="nvim-container">
      {/* top tabline */}
      <div className="tabline">
        <span className="tab">nvim .</span>
      </div>

      <div className="main-area">
        {/* left sidebar */}
        <Sidebar
          files={Object.keys(fileSystem)}
          activeFileName={activeFileName}
          onFileSelect={setActiveFileName}
        />

        {/* right editor */}
        <Editor file={activeFile} />
      </div>
    </div>
  );
}

// sub-components

function Sidebar({ files, activeFileName, onFileSelect }) {
  return (
    <aside className="sidebar">
      <div className="tree-header">
        <span style={{ color: 'var(--nord14)' }}>📁</span> ~/dev/portfolio
      </div>

      <ul className="tree-content">
        {files.map(fileName => (
          <li
            key={fileName}
            className={`tree-item ${fileName === activeFileName ? 'active' : ''}`}
            onClick={() => onFileSelect(fileName)}
          >
            <span>📄 {fileName}</span>
            {fileName === activeFileName && <span style={{ color: 'var(--nord14)' }}>[+]</span>}
          </li>
        ))}
      </ul>

      <div className="status-line">
        neo-tree filesystem [{files.length}] [-]
      </div>
    </aside>
  );
}

function Editor({ file }) {
  // cursor always on end line of file
  const activeLineIndex = file.content.length - 1;

  return (
    <main className="editor">
      <div className="editor-content">
        {file.content.map((lineText, index) => {
          const isActiveLine = index === activeLineIndex;

          // relative line numbers
          const displayLineNumber = isActiveLine ? index + 1 : Math.abs(activeLineIndex - index);

          return (
            <div key={index} className={`line ${isActiveLine ? 'active' : ''}`}>
              <span className="line-number">{displayLineNumber}</span>
              <span>
                {lineText}
                {isActiveLine && <span className="cursor"></span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="status-line">
        <div className="status-left">
          <div className="status-mode">NORMAL</div>
          <div className="status-item">{file.name} [+]</div>
        </div>
        <div className="status-right">
          <div className="status-item">utf-8</div>
          <div className="status-item">{file.language}</div>
          <div className="status-item">Bot {activeLineIndex + 1}:1</div>
        </div>
      </div>
    </main>
  );
}
