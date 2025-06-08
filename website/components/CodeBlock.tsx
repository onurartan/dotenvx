"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodeBlockProps } from "@/types/docs";
import { transparentOneDark } from "@/constants";

interface CodeBlockComponentProps extends CodeBlockProps {
  darkMode: boolean;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

export function CodeBlock({
  children,
  language = "bash",
  title,
  showLineNumbers = true,
  id,
  className = "",
  darkMode,
  copied,
  onCopy,
}: CodeBlockComponentProps) {
  const codeId = id || `code-${title || Math.random()}`;

  return (
    <Card
      className={`overflow-hidden border bg-gradient-to-br from-background to-muted/30 p-0 ${className}`}
    >
      {title && (
        <CardHeader className="border-b bg-muted/50 backdrop-blur py-3 h-[50px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(children, codeId)}
              className="h-8 w-8 p-0"
              aria-label="Copy code"
            >
              {copied === codeId ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <SyntaxHighlighter
          language={language}
          // style={darkMode ? oneDark : oneLight}
          style={transparentOneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "14px",
          }}
          lineNumberStyle={{
            color: darkMode ? "#6b7280" : "#9ca3af",
            paddingRight: "1rem",
            minWidth: "2rem",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
}
