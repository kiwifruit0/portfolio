export default function Sidebar({ files, activeFileName, onFileSelect }) {
  return (
    <aside className="sidebar">

      <div className="tree-header">
         ~/portfolio
      </div>

      <ul className="tree-content">
        {files.map(file => (
          <li
            key={file}
            className={`tree-item ${file === activeFileName ? "active" : ""}`}
            onClick={() => onFileSelect(file)}
          >
             {file}
          </li>
        ))}
      </ul>

      <div className="status-line">
        neo-tree filesystem [{files.length}]
      </div>

    </aside>
  );
}
