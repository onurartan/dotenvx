"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Terminal, Settings } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import type { CLICommand } from "@/types/docs";

interface CLICommandCardProps extends CLICommand {
  darkMode: boolean;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

export function CLICommandCard({
  name,
  description,
  usage,
  options,
  darkMode,
  copied,
  onCopy,
}: CLICommandCardProps) {
  return (
    <Card className="bg-gradient-to-br from-background to-muted/30 p-0">
      <CardHeader className="border-b bg-muted/30 py-2 h-[55px]">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="font-mono bg-primary/10 text-primary border-primary/20"
          >
            envx {name}
          </Badge>
          <CardTitle className="text-xl">{description}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 p-5">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Usage:
          </h4>
          <CodeBlock
            title="terminal"
            language="bash"
            showLineNumbers={false}
            id={`cli-${name}-usage`}
            darkMode={darkMode}
            copied={copied}
            onCopy={onCopy}
          >
            {usage}
          </CodeBlock>
        </div>

        {options.length > 1 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Options:
            </h4>
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Option</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Default</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options.map((option, index) => (
                    <TableRow
                      key={option.name}
                      className={index % 2 === 0 ? "bg-muted/20" : ""}
                    >
                      <TableCell className="font-mono text-sm text-primary">
                        {option.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {option.description}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {option.default}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
