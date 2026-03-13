import { Icon } from "@iconify/react";

export default function Sidebar({ pages, activeFileName, onFileSelect }) {
  const DEFAULT_ICON = "mdi:file-outline";
  return (
    <aside className="sidebar">

      <div className="tree-header">
        <Icon icon={"mdi:folder-multiple-outline"} width={16} /> ~/portfolio
      </div>

      <ul className="tree-content">
        {Object.keys(pages).map((file) => {
          const page = pages[file];
          const icon = page && page.icon ? page.icon : DEFAULT_ICON;
          const isActive = file === activeFileName;
          return (
            <li key={file}>
              <button
                type="button"
                className={`tree-item ${isActive ? "active" : ""}`}
                onClick={() => onFileSelect(file)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon icon={icon} width={18}/> {file}
              </button>
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
