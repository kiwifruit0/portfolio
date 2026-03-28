import { useState, useEffect, useRef, useCallback } from "react";

const HELP_TEXT = `Keyboard shortcuts:
  h/j/k/l, arrows  Navigate cursor
  gg               Jump to top of file
  G                Jump to bottom of file
  /pattern         Search for text
  n/N              Next/previous search match
Commands:
  :w               Write (save) file
  :q               Quit
  :e <file>        Open file (e.g. :e contact.java)
  :help            Show this help`;

export function useCommandLine(fileName, { onNavigate, availableFiles = [] } = {}) {
  const [mode, setMode] = useState("normal"); // normal, command, search
  const [command, setCommand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const inputRef = useRef(null);

  const clearMessage = useCallback(() => {
    setMessage("");
    setMessageType("");
  }, []);

  const showMessage = useCallback((msg, type = "success", duration = 3000) => {
    setMessage(msg);
    setMessageType(type);
    if (duration > 0) {
      setTimeout(clearMessage, duration);
    }
  }, [clearMessage]);

  const exitMode = useCallback(() => {
    setMode("normal");
    setCommand("");
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const target = event.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (mode === "normal") {
        if (event.key === ":" && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          setMode("command");
          setCommand("");
          clearMessage();
        } else if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          setMode("search");
          setCommand("");
          setSearchQuery("");
          setSearchMatches([]);
          setCurrentMatchIndex(-1);
          clearMessage();
        } else if (event.key === "n" && searchQuery) {
          event.preventDefault();
          if (searchMatches.length > 0) {
            setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
          }
        } else if (event.key === "N" && searchQuery) {
          event.preventDefault();
          if (searchMatches.length > 0) {
            setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
          }
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        exitMode();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [mode, searchQuery, searchMatches.length, clearMessage, exitMode]);

  useEffect(() => {
    if ((mode === "command" || mode === "search") && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleCommandSubmit = useCallback((event) => {
    event.preventDefault();
    const trimmedCommand = command.trim();

    if (trimmedCommand === "w" || trimmedCommand === "w!") {
      showMessage(`"${fileName}" [+] 0L, 0B written`);
    } else if (trimmedCommand === "q" || trimmedCommand === "q!" || trimmedCommand === "quit") {
      showMessage("no :)", "error");
    } else if (trimmedCommand === "wq" || trimmedCommand === "wq!") {
      showMessage(`"${fileName}" [+] 0L, 0B written`);
      setTimeout(() => showMessage("no :)", "error"), 1500);
    } else if (trimmedCommand === "help" || trimmedCommand === "h") {
      showMessage(HELP_TEXT, "help", 8000);
    } else if (trimmedCommand.startsWith("e ") || trimmedCommand.startsWith("edit ")) {
      const targetFile = trimmedCommand.replace(/^(e|edit)\s+/, "").trim();
      const matchedFile = availableFiles.find(
        (f) => f === targetFile || f.startsWith(targetFile) || f.replace(/\..+$/, "") === targetFile
      );
      if (matchedFile && onNavigate) {
        onNavigate(matchedFile);
        showMessage(`"${matchedFile}"`);
      } else {
        showMessage(`E212: Can't open file for writing: ${targetFile}`, "error");
      }
    } else if (trimmedCommand) {
      showMessage(`E492: Not an editor command: ${trimmedCommand}`, "error");
    }

    exitMode();
  }, [command, fileName, availableFiles, onNavigate, showMessage, exitMode]);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    const query = command.trim();
    if (query) {
      setSearchQuery(query);
      // Search will be performed by the Editor component
    }
    exitMode();
  }, [command, exitMode]);

  const handleSubmit = useCallback((event) => {
    if (mode === "command") {
      handleCommandSubmit(event);
    } else if (mode === "search") {
      handleSearchSubmit(event);
    }
  }, [mode, handleCommandSubmit, handleSearchSubmit]);

  const handleChange = useCallback((event) => {
    setCommand(event.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
  }, []);

  return {
    mode,
    command,
    message,
    messageType,
    inputRef,
    handleSubmit,
    handleChange,
    searchQuery,
    searchMatches,
    setSearchMatches,
    currentMatchIndex,
    setCurrentMatchIndex,
    clearSearch
  };
}
