import { Icon } from "@iconify/react";
import { profile } from "../content/profile";

const DEFAULT_ICON = "mdi:file-outline";

// Status letters mimic neo-tree's git column: `A` for the buffer you're in,
// `M` for everything else, purely for flavour.
export default function Sidebar({ pages, activeFileName, onFileSelect, theme }) {
  const files = Object.keys(pages);

  return (
    <aside className="sidebar">
      <div className="tree-header">
        <Icon icon="mdi:folder-open-outline" width={16} />
        <span>~/portfolio</span>
      </div>

      <ul className="tree-content">
        <li className="tree-group">src</li>
        {files.map((file) => {
          const page = pages[file];
          const isActive = file === activeFileName;
          return (
            <li key={file}>
              <button
                type="button"
                className={`tree-item ${isActive ? "active" : ""}`}
                onClick={() => onFileSelect(file)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon icon={page.icon || DEFAULT_ICON} width={17} />
                <span className="tree-item-name">{file}</span>
                <span className={`tree-item-flag ${isActive ? "open" : ""}`}>
                  {isActive ? "●" : ""}
                </span>
              </button>
            </li>
          );
        })}

        <li className="tree-group tree-group-spaced">links</li>
        <li>
          <a className="tree-item tree-link" href={`https://${profile.github}`} target="_blank" rel="noreferrer">
            <Icon icon="mdi:github" width={17} />
            <span className="tree-item-name">github</span>
          </a>
        </li>
        <li>
          <a className="tree-item tree-link" href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">
            <Icon icon="mdi:linkedin" width={17} />
            <span className="tree-item-name">linkedin</span>
          </a>
        </li>
      </ul>

      <div className="sidebar-hints">
        <p>
          <kbd>C-p</kbd> files
        </p>
        <p>
          <kbd>C-g</kbd> grep
        </p>
        <p>
          <kbd>?</kbd> keymaps
        </p>
      </div>

      <div className="status-line sidebar-status">
        <span>neo-tree</span>
        <span className="sidebar-status-theme">{theme}</span>
      </div>
    </aside>
  );
}
