export default function Navbar({ pages, onNavigate }) {
  return (
    <nav className="navbar">

      <div className="nav-logo">
        ~/toby.jennings
      </div>

      <div className="nav-links">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className="nav-link"
          >
            {page.replace(/\..+$/, "")}
          </button>
        ))}
      </div>

    </nav>
  );
}
