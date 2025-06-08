"use client";

import { Copy, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import useClipboard from "@/hooks/useClipboard";
import { useTheme } from "magic-toast";
import { transparentOneDark } from "@/constants";

const codeExample = `# .envx - Modern environment configuration
DEV_MODE=false

# Smart interpolation with ternary expressions
API_URL=\${DEV_MODE} ? "http://localhost:3000" : "https://api.example.com"
API_TOKEN=\${DEV_MODE} ? "dev-token" : "prod-token"

# Multiline strings with triple quotes
DATABASE_CONFIG="""
{
  "host": "localhost",
  "port": 5432,
  "ssl": true
}
"""

# Schema definition for type safety
[DEV_MODE]
type="boolean"
description="Development mode flag"

[API_URL]
type="url"
required=true
description="Main API endpoint"`;

const CodePreview = () => {
  const { theme } = useTheme();
  const isDarkMode = theme == "dark";

  const { isCopied, copy } = useClipboard();

  return (
    <section className="py-16 center">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background to-muted/30 p-0">
            <CardHeader className="border-b bg-muted/50 backdrop-blur flex items-center justify-center w-full p-2 h-[50px] px-3">
              <div className="flex items-center justify-between w-full h-full  mt-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    .envx
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Example .envx
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copy(codeExample, "hero-code")}
                >
                  {isCopied === "hero-code" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <SyntaxHighlighter
                language="bash"
                // style={isDarkMode ? transparentOneDark : oneLight}
                style={transparentOneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "transparent",
                  fontSize: "14px",
                }}
                lineNumberStyle={{
                  color: isDarkMode ? "#6b7280" : "#9ca3af",
                  paddingRight: "1rem",
                }}
                lineProps={{
                  style: {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {codeExample}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CodePreview;
