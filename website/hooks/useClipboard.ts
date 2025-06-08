import { useState, useEffect } from "react";

function useClipboard(timeoutMs = 2000) {
  const [isCopied, setIsCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(null);
      }, timeoutMs);
      return () => clearTimeout(timeout);
    }
  }, [isCopied, timeoutMs]);

  const copy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(id);
    } else {
      console.warn("Clipboard API not available");
    }
  };

  return { isCopied, copy };
}

export default useClipboard;
