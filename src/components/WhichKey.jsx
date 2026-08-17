import { LEADER_MAP } from "../lib/commands";

// The little panel that slides up when you hold <leader>, same as which-key.nvim.
export default function WhichKey({ pending }) {
  const entries = pending
    ? LEADER_MAP.filter((entry) => entry.keys.startsWith(pending))
    : LEADER_MAP;

  return (
    <div className="which-key" role="status" aria-live="polite">
      <div className="which-key-header">
        <span className="which-key-prefix">{`<leader>${pending}`}</span>
        <span className="which-key-hint">esc to cancel</span>
      </div>
      <ul className="which-key-list">
        {entries.map((entry) => (
          <li key={entry.keys}>
            <span className="which-key-keys">{entry.keys}</span>
            <span className="which-key-arrow">→</span>
            <span className="which-key-label">{entry.label}</span>
          </li>
        ))}
        {entries.length === 0 && <li className="which-key-empty">no mapping</li>}
      </ul>
    </div>
  );
}
