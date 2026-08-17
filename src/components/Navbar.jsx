import { Icon } from "@iconify/react";
import { useState } from "react";

function label(file) {
  return file.replace(/\.[^.]+$/, "");
}

export default function Navbar({ pages, activeFileName, onNavigate, theme, onCycleTheme, onOpenFinder }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const files = Object.keys(pages);

  return (
    <nav className="navbar">
      <div className="nav-logo">~/toby.jennings</div>

      <button
        type="button"
        className="nav-menu-toggle"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
      >
        {isMenuOpen ? "close" : "menu"}
      </button>

      <div id="primary-navigation" className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        {files.map((file) => {
          const isActive = activeFileName === file;
          return (
            <button
              key={file}
              onClick={() => {
                onNavigate(file);
                setIsMenuOpen(false);
              }}
              className={`nav-link ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              title={file}
            >
              <Icon icon={pages[file].icon} width={14} className="nav-link-icon" />
              <span>{label(file)}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-tools">
        <button type="button" className="nav-tool" onClick={onOpenFinder} title="find files (Ctrl-p)">
          <Icon icon="mdi:magnify" width={15} />
          <span className="nav-tool-label">C-p</span>
        </button>
        <button type="button" className="nav-tool" onClick={onCycleTheme} title="change colorscheme">
          <Icon icon="mdi:palette-outline" width={15} />
          <span className="nav-tool-label">{theme}</span>
        </button>
      </div>
    </nav>
  );
}
