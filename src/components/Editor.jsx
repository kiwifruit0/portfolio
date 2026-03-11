export default function Editor({ file, children }) {
  return (
    <main className="editor">

      <div className="editor-content">
        {children}
      </div>

      <div className="status-line">
        <div className="status-left">
          <div className="status-mode">NORMAL</div>
          <div className="status-item">{file.name}</div>
        </div>

        <div className="status-right">
          <div className="status-item">utf-8</div>
          <div className="status-item">{file.language}</div>
        </div>
      </div>

    </main>
  );
}
