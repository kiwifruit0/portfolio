import { useEffect, useRef } from "react";
import { KEYMAPS, LEADER_MAP } from "../lib/commands";

function HelpContent({ commands }) {
  return (
    <div className="help-grid">
      <section>
        <h4 className="float-section">motions & keys</h4>
        <ul className="help-list">
          {KEYMAPS.map((entry) => (
            <li key={entry.keys}>
              <kbd>{entry.keys}</kbd>
              <span>{entry.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="float-section">&lt;leader&gt; is space</h4>
        <ul className="help-list">
          {LEADER_MAP.map((entry) => (
            <li key={entry.keys}>
              <kbd>{`<Space>${entry.keys}`}</kbd>
              <span>{entry.label}</span>
            </li>
          ))}
        </ul>

        <h4 className="float-section">commands</h4>
        <ul className="help-list help-list-commands">
          {commands.map((command) => (
            <li key={command.name}>
              <kbd>{command.usage || `:${command.name}`}</kbd>
              <span>{command.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function FloatWindow({ title, lines, variant, commands = [], onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" || event.key === "q") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="float-overlay" onMouseDown={onClose} role="presentation">
      <div
        className={`float-window ${variant === "help" ? "float-window-wide" : ""}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className="float-titlebar">
          <span className="float-title">{title}</span>
          <button ref={closeRef} type="button" className="float-close" onClick={onClose}>
            press q or esc to close
          </button>
        </div>

        <div className="float-content">
          {variant === "help" ? (
            <HelpContent commands={commands} />
          ) : (
            <pre className="float-pre">{(lines || []).join("\n")}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
