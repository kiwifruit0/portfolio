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
          return (
          <li
            key={file}
            className={`tree-item ${file === activeFileName ? "active" : ""}`}
            onClick={() => onFileSelect(file)}
          >
          <Icon icon={pages[file].icon} width={18}/> {file}
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
