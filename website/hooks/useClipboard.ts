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
    navigator.clipboard.writeText(text);
    setIsCopied(id);
  };

  return { isCopied, copy };
}

export default useClipboard;
