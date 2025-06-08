import type React from "react"
export interface Section {
  id: string
  label: string
  icon: React.ReactNode
  category: string
}

export interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  id?: string
  className?: string
}

export interface SectionHeaderProps {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
}

export interface NavigationItem {
  id: string
  label: string
  href?: string
}

export interface CLICommand {
  name: string
  description: string
  usage: string
  options: CLIOption[]
}

export interface CLIOption {
  name: string
  description: string
  default: string
}

export interface APIFunction {
  name: string
  description: string
  params: APIParameter[]
  returns: string
  example: string
}

export interface APIParameter {
  name: string
  type: string
  default: string
  description: string
}

export interface TroubleshootingItem {
  question: string
  answer: string
}

export interface ExampleCode {
  [key: string]: string
}
