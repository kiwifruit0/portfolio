import { useState, useEffect } from "react";

export default function Editor({ file, children }) {

  const [cursor, setCursor] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const editor = document.querySelector(".editor-content");

    if (!editor) return;

    const lines = editor.querySelectorAll(".editor-line");
    setLineCount(lines.length || 1);

  }, [children]);

  useEffect(() => {

    const handleKey = (e) => {

      setCursor(prev => {

        if (e.key === "j") return Math.min(prev + 1, lineCount - 1);
        if (e.key === "k") return Math.max(prev - 1, 0);

        return prev;

      });

    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);

  }, [lineCount]);

  const lines = Array.from({ length: lineCount });

  return (
    <main className="editor">

      <div className="editor-content">

        <div className="line-numbers">
          {lines.map((_, i) => {

            const num = i === cursor ? i + 1 : Math.abs(cursor - i);

            return (
              <div key={i} className={`line-number ${i === cursor ? "active" : ""}`}>
                {num}
              </div>
            );
          })}
        </div>

        <div className="editor-body">

          {lines.map((_, i) => (
            <div key={i} className="editor-line">
              {i === 0 ? children : null}
              {i === cursor && <span className="cursor"></span>}
            </div>
          ))}

        </div>

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
