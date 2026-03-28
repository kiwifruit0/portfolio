import { useState, useEffect, useRef } from "react";

export function useCommandLine(fileName) {
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isCommandMode && event.key === ":" && !event.ctrlKey && !event.metaKey) {
        const target = event.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        
        event.preventDefault();
        setIsCommandMode(true);
        setCommand("");
        setMessage("");
      } else if (isCommandMode && event.key === "Escape") {
        event.preventDefault();
        setIsCommandMode(false);
        setCommand("");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isCommandMode]);

  useEffect(() => {
    if (isCommandMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCommandMode]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedCommand = command.trim();

    if (trimmedCommand === "w" || trimmedCommand === "w!") {
      setMessage(`"${fileName}" [+] 0L, 0B written`);
      setMessageType("success");
    } else if (trimmedCommand === "q" || trimmedCommand === "q!" || trimmedCommand === "quit") {
      setMessage("no :)");
      setMessageType("error");
    } else if (trimmedCommand === "wq" || trimmedCommand === "wq!") {
      setMessage(`"${fileName}" [+] 0L, 0B written`);
      setMessageType("mixed");
      setTimeout(() => {
        setMessage("no :)");
        setMessageType("error");
      }, 1500);
    } else if (trimmedCommand) {
      setMessage(`E492: Not an editor command: ${trimmedCommand}`);
      setMessageType("error");
    }

    setIsCommandMode(false);
    setCommand("");
  };

  const handleChange = (event) => {
    setCommand(event.target.value);
  };

  return {
    isCommandMode,
    command,
    message,
    messageType,
    inputRef,
    handleSubmit,
    handleChange
  };
}
