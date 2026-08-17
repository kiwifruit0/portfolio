import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fuzzyFilter, fuzzyMatch, highlightSegments, substringMatch } from "../lib/fuzzy";
import { THEMES } from "../lib/themes";
import { searchIndex } from "../content/searchIndex";
import { projects } from "../content/projects";

const SOURCE_META = {
  files: { title: "Find Files", icon: "mdi:file-search-outline", prompt: "> " },
  grep: { title: "Live Grep", icon: "mdi:text-search", prompt: "> " },
  commands: { title: "Commands", icon: "mdi:console-line", prompt: ": " },
  projects: { title: "Projects", icon: "mdi:folder-star-outline", prompt: "> " },
  themes: { title: "Colorschemes", icon: "mdi:palette-outline", prompt: "> " }
};

function previewForFile(file) {
  const lines = searchIndex.filter((entry) => entry.file === file);
  if (lines.length === 0) {
    return ["(binary file)"];
  }
  return lines.slice(0, 40).map((entry) => entry.text);
}

function buildItems(source, context) {
  const { files, pages, commands } = context;

  if (source === "files") {
    return files.map((file) => ({
      key: file,
      label: file,
      hint: pages[file]?.language ?? "",
      icon: pages[file]?.icon ?? "mdi:file-outline",
      searchText: file,
      preview: previewForFile(file),
      previewTitle: file,
      action: { type: "navigate", file }
    }));
  }

  if (source === "grep") {
    return searchIndex.map((entry, index) => ({
      key: `${entry.file}:${entry.line}:${index}`,
      label: entry.text,
      hint: `${entry.file}:${entry.line}`,
      icon: "mdi:text-short",
      searchText: entry.text,
      preview: previewForFile(entry.file),
      previewTitle: `${entry.file}:${entry.line}`,
      previewFocus: entry.text,
      action: { type: "navigate", file: entry.file }
    }));
  }

  if (source === "commands") {
    return commands.map((command) => ({
      key: command.name,
      label: `:${command.name}`,
      hint: command.desc,
      icon: "mdi:chevron-right",
      searchText: `${command.name} ${(command.aliases || []).join(" ")} ${command.desc}`,
      preview: [
        command.usage || `:${command.name}`,
        "",
        command.desc,
        "",
        (command.aliases || []).length ? `aliases: ${command.aliases.join(", ")}` : "no aliases"
      ],
      previewTitle: `:${command.name}`,
      action: { type: "command", command }
    }));
  }

  if (source === "projects") {
    return projects.map((project) => ({
      key: project.id,
      label: project.name,
      hint: project.tagline,
      icon: project.award ? "mdi:trophy-outline" : "mdi:source-branch",
      searchText: `${project.name} ${project.tagline} ${project.tech.join(" ")} ${project.desc}`,
      preview: [
        project.tagline,
        project.period,
        "",
        project.desc,
        "",
        ...project.points.map((point) => `- ${point}`),
        "",
        `stack: ${project.tech.join(", ")}`,
        project.link ? `link:  ${project.link}` : ""
      ],
      previewTitle: project.name,
      action: { type: "project", project }
    }));
  }

  return THEMES.map((entry) => ({
    key: entry.id,
    label: entry.id,
    hint: entry.kind,
    icon: entry.kind === "light" ? "mdi:white-balance-sunny" : "mdi:moon-waning-crescent",
    searchText: `${entry.id} ${entry.kind} ${entry.blurb}`,
    preview: [entry.blurb],
    previewTitle: entry.id,
    themeId: entry.id,
    action: { type: "theme", theme: entry.id }
  }));
}

function ThemeSwatch({ themeId }) {
  const slots = ["--nord9", "--nord8", "--nord14", "--nord13", "--nord12", "--nord11", "--nord15"];
  return (
    <div className="theme-preview" data-theme={themeId}>
      <div className="theme-preview-window">
        <div className="theme-preview-bar">
          <span className="theme-preview-mode">NORMAL</span>
          <span className="theme-preview-file">index.md</span>
        </div>
        <div className="theme-preview-body">
          <p className="theme-preview-heading"># Toby Jennings</p>
          <p className="theme-preview-text">
            final-year cs student <span className="theme-preview-block" />
          </p>
          <p className="theme-preview-muted">-- applying for grad roles --</p>
          <p className="theme-preview-accent">link: github.com/kiwifruit0</p>
        </div>
      </div>
      <div className="theme-swatches">
        {slots.map((slot) => (
          <span key={slot} className="theme-swatch" style={{ background: `var(${slot})` }} />
        ))}
      </div>
    </div>
  );
}

export default function Finder({
  source,
  initialQuery = "",
  files,
  pages,
  commands,
  theme,
  onSetTheme,
  onNavigate,
  onRunCommand,
  onClose
}) {
  const [query, setQuery] = useState(initialQuery);
  // Selection is stored with the query it belongs to, so typing implicitly
  // resets the highlight back to the top result without an effect.
  const [selection, setSelection] = useState({ query: initialQuery, index: 0 });
  const selected = selection.query === query ? selection.index : 0;
  const setSelected = (index) => setSelection({ query, index });
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const committedRef = useRef(false);
  const originalTheme = useRef(theme);

  const items = useMemo(
    () => buildItems(source, { files, pages, commands }),
    [source, files, pages, commands]
  );

  const results = useMemo(
    () =>
      fuzzyFilter(
        query,
        items,
        (item) => item.searchText,
        source === "grep" ? substringMatch : fuzzyMatch
      ),
    [query, items, source]
  );

  const active = results[selected]?.item ?? null;
  const meta = SOURCE_META[source] ?? SOURCE_META.files;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Colorschemes preview live as you move through the list.
  useEffect(() => {
    if (source !== "themes") return undefined;
    if (active?.themeId) {
      onSetTheme(active.themeId, { persist: false });
    }
    return undefined;
  }, [active, source, onSetTheme]);

  useEffect(
    () => () => {
      if (source === "themes" && !committedRef.current) {
        onSetTheme(originalTheme.current, { persist: false });
      }
    },
    [source, onSetTheme]
  );

  useEffect(() => {
    const node = listRef.current?.children?.[selected];
    node?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const commit = (item) => {
    if (!item) return;
    committedRef.current = true;
    const { action } = item;
    // Close first: a command may open another overlay on top.
    onClose();
    if (action.type === "navigate") {
      onNavigate(action.file);
    } else if (action.type === "project") {
      onNavigate("projects.cpp");
    } else if (action.type === "theme") {
      onSetTheme(action.theme, { persist: true });
    } else if (action.type === "command") {
      onRunCommand(action.command);
    }
  };

  const move = (delta) => {
    if (results.length === 0) return;
    setSelected((selected + delta + results.length) % results.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" || (event.ctrlKey && (event.key === "j" || event.key === "n"))) {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp" || (event.ctrlKey && (event.key === "k" || event.key === "p"))) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      commit(active);
    } else if (event.key === "Tab") {
      event.preventDefault();
      move(event.shiftKey ? -1 : 1);
    }
  };

  return (
    <div className="float-overlay" onMouseDown={onClose} role="presentation">
      <div
        className="finder"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-label={meta.title}
      >
        <div className="finder-prompt">
          <Icon icon={meta.icon} width={16} className="finder-prompt-icon" />
          <span className="finder-prompt-char">{meta.prompt}</span>
          <input
            ref={inputRef}
            className="finder-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={meta.title}
            autoComplete="off"
            spellCheck="false"
            aria-label={meta.title}
          />
          <span className="finder-count">
            {results.length === 0 ? "0/0" : `${selected + 1}/${results.length}`}
          </span>
        </div>

        <div className="finder-body">
          <ul className="finder-results" ref={listRef}>
            {results.length === 0 && <li className="finder-empty">no results</li>}
            {results.map((result, index) => {
              const item = result.item;
              const segments = highlightSegments(item.label, item.searchText === item.label ? result.indices : []);
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    className={`finder-result ${index === selected ? "active" : ""}`}
                    onMouseMove={() => setSelected(index)}
                    onClick={() => commit(item)}
                  >
                    <Icon icon={item.icon} width={15} className="finder-result-icon" />
                    <span className="finder-result-label">
                      {segments.map((segment, i) =>
                        segment.match ? (
                          <mark key={i}>{segment.text}</mark>
                        ) : (
                          <span key={i}>{segment.text}</span>
                        )
                      )}
                    </span>
                    {item.hint && <span className="finder-result-hint">{item.hint}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="finder-preview">
            <div className="finder-preview-title">{active?.previewTitle ?? "preview"}</div>
            <div className="finder-preview-body">
              {source === "themes" && active ? (
                <>
                  <ThemeSwatch themeId={active.themeId} />
                  <p className="finder-preview-line">{active.preview[0]}</p>
                </>
              ) : (
                (active?.preview ?? []).map((line, index) => (
                  <p
                    key={index}
                    className={`finder-preview-line ${
                      active?.previewFocus && line === active.previewFocus ? "focus" : ""
                    }`}
                  >
                    {line || " "}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="finder-footer">
          <span>
            <kbd>C-j</kbd>/<kbd>C-k</kbd> move
          </span>
          <span>
            <kbd>Enter</kbd> select
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
