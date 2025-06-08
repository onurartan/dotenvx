"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CodeBlock } from "./CodeBlock"

interface StepCardProps {
  step: number
  title: string
  description: string
  code: string
  language?: string
  darkMode: boolean
  copied: string | null
  onCopy: (text: string, id: string) => void
}

export function StepCard({
  step,
  title,
  description,
  code,
  language = "bash",
  darkMode,
  copied,
  onCopy,
}: StepCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 py-4">
        <CardTitle className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {step}
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <CodeBlock
          language={language}
          darkMode={darkMode}
          copied={copied}
          onCopy={onCopy}
          showLineNumbers={false}
          id={`step-${step}`}
        >
          {code}
        </CodeBlock>
      </CardContent>
    </Card>
  )
}
