export default function Sidebar({ pages, activeFileName, onFileSelect }) {
  const DEFAULT_ICON = "";
  return (
    <aside className="sidebar">

      <div className="tree-header">
         ~/portfolio
      </div>

      <ul className="tree-content">
        {Object.keys(pages).map((file) => {
          const page = pages[file];
          const icon = page && page.icon ? page.icon : DEFAULT_ICON;
          return (
          <li
            key={file}
            className={`tree-item ${file === activeFileName ? "active" : ""}`}
            onClick={() => onFileSelect(file)}
          >
          {icon} {file}
          </li>
        );
        })}
      </ul>

      <div className="status-line">
        neo-tree filesystem [{Object.keys(pages).length}]
      </div>

    </aside>
  );
}
