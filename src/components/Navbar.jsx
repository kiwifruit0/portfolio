import { useState } from "react";

function pageLabel(page) {
  return page.replace(/\..+$/, "");
}

export default function Navbar({ pages, activeFileName, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="nav-logo">
        ~/toby.jennings
      </div>

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
        {pages.map(page => (
          <button
            key={page}
            onClick={() => {
              onNavigate(page);
              setIsMenuOpen(false);
            }}
            className={`nav-link ${activeFileName === page ? "active" : ""}`}
            aria-current={activeFileName === page ? "page" : undefined}
          >
            {pageLabel(page)}
          </button>
        ))}
      </div>

    </nav>
  );
}
