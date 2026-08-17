import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { commandNames, createCommands, findCommand } from "../lib/commands";

const MAX_HISTORY = 50;

function longestCommonPrefix(values) {
  if (values.length === 0) return "";
  return values.reduce((prefix, value) => {
    let i = 0;
    while (i < prefix.length && i < value.length && prefix[i] === value[i]) i += 1;
    return prefix.slice(0, i);
  });
}

export function useCommandLine(context) {
  const [mode, setMode] = useState("normal"); // normal | command | search
  const [command, setCommand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [notice, setNotice] = useState({ text: "", type: "", token: 0 });
  const [history, setHistory] = useState([]);
  const historyCursor = useRef(-1);
  const completion = useRef(null);
  const inputRef = useRef(null);

  const message = notice.text;
  const messageType = notice.type;

  const clearMessage = useCallback(() => {
    setNotice((prev) => (prev.text ? { text: "", type: "", token: prev.token + 1 } : prev));
  }, []);

  const showMessage = useCallback((text, type = "success", duration = 3500) => {
    setNotice((prev) => ({ text, type, token: prev.token + 1, duration }));
  }, []);

  // Messages expire on their own; the timer is keyed on the token so a new
  // message always restarts the countdown.
  useEffect(() => {
    if (!notice.text || notice.duration === 0) return undefined;
    const timer = window.setTimeout(
      () => setNotice((prev) => (prev.token === notice.token ? { text: "", type: "", token: prev.token } : prev)),
      notice.duration ?? 3500
    );
    return () => window.clearTimeout(timer);
  }, [notice]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
  }, []);

  const commands = useMemo(
    () => createCommands({ ...context, showMessage, clearSearch }),
    [context, showMessage, clearSearch]
  );

  const enterCommandMode = useCallback(
    (initial = "") => {
      setMode("command");
      setCommand(initial);
      historyCursor.current = -1;
      completion.current = null;
      clearMessage();
    },
    [clearMessage]
  );

  const enterSearchMode = useCallback(() => {
    setMode("search");
    setCommand("");
    clearSearch();
    clearMessage();
  }, [clearMessage, clearSearch]);

  const exitMode = useCallback(() => {
    setMode("normal");
    setCommand("");
    completion.current = null;
  }, []);

  const matchCount = searchMatches.length;
  const nextMatch = useCallback(
    (direction) => {
      if (matchCount === 0) return;
      setCurrentMatchIndex((prev) => (prev + direction + matchCount) % matchCount);
    },
    [matchCount]
  );

  const runCommandLine = useCallback(
    (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      // :42 jumps to a line, same as vim.
      if (/^\d+$/.test(trimmed)) {
        context.gotoLine(Number(trimmed));
        return;
      }

      const [head, ...rest] = trimmed.split(/\s+/);
      const target = findCommand(commands, head);
      if (!target) {
        showMessage(`E492: not an editor command: ${head}`, "error");
        return;
      }
      target.run(rest.join(" ").trim());
    },
    [commands, context, showMessage]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const value = command.trim();

      if (mode === "search") {
        if (value) {
          setSearchQuery(value);
        } else {
          clearSearch();
        }
        exitMode();
        return;
      }

      if (value) {
        setHistory((prev) => [value, ...prev.filter((item) => item !== value)].slice(0, MAX_HISTORY));
        runCommandLine(value);
      }
      exitMode();
    },
    [command, mode, exitMode, clearSearch, runCommandLine]
  );

  const handleChange = useCallback((event) => {
    completion.current = null;
    setCommand(event.target.value);
  }, []);

  const applyCompletion = useCallback(
    (shift) => {
      if (mode !== "command") return;

      if (!completion.current) {
        const value = command;
        const spaceIndex = value.indexOf(" ");
        let base;
        let prefix;
        let pool;

        if (spaceIndex === -1) {
          base = "";
          prefix = value;
          pool = commandNames(commands);
        } else {
          base = `${value.slice(0, spaceIndex + 1)}`;
          prefix = value.slice(spaceIndex + 1);
          const target = findCommand(commands, value.slice(0, spaceIndex));
          pool = target?.complete ? target.complete() : [];
        }

        const candidates = pool.filter((entry) => entry.startsWith(prefix)).sort();
        if (candidates.length === 0) return;

        // Vim fills in the shared prefix first, then cycles.
        const shared = longestCommonPrefix(candidates);
        if (candidates.length > 1 && shared.length > prefix.length) {
          setCommand(base + shared);
          return;
        }

        completion.current = { base, candidates, index: -1 };
      }

      const state = completion.current;
      state.index =
        (state.index + (shift ? -1 : 1) + state.candidates.length) % state.candidates.length;
      setCommand(state.base + state.candidates[state.index]);
    },
    [command, commands, mode]
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        exitMode();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        applyCompletion(event.shiftKey);
        return;
      }
      if (event.key === "ArrowUp" && mode === "command" && history.length > 0) {
        event.preventDefault();
        historyCursor.current = Math.min(historyCursor.current + 1, history.length - 1);
        setCommand(history[historyCursor.current]);
        return;
      }
      if (event.key === "ArrowDown" && mode === "command") {
        event.preventDefault();
        historyCursor.current = Math.max(historyCursor.current - 1, -1);
        setCommand(historyCursor.current === -1 ? "" : history[historyCursor.current]);
        return;
      }
      if (event.key === "Backspace" && command === "") {
        event.preventDefault();
        exitMode();
      }
    },
    [applyCompletion, command, exitMode, history, mode]
  );

  useEffect(() => {
    if (mode !== "normal" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  return {
    mode,
    command,
    commands,
    message,
    messageType,
    inputRef,
    searchQuery,
    searchMatches,
    currentMatchIndex,
    setSearchMatches,
    setCurrentMatchIndex,
    clearSearch,
    clearMessage,
    showMessage,
    enterCommandMode,
    enterSearchMode,
    exitMode,
    nextMatch,
    runCommandLine,
    handleSubmit,
    handleChange,
    handleInputKeyDown
  };
}
