"use client";
import {
  Book,
  Code,
  FileText,
  Lightbulb,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useDocumentation } from "@/hooks/useDocumentation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CodeBlock } from "@/components/CodeBlock";
import { SectionHeader } from "@/components/SectionHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { StepCard } from "@/components/StepCard";
import { CLICommandCard } from "@/components/CLICommandCard";

import { sections, cliCommands, codeExamples } from "@/data/docsData";
import { PACKAGE_NAME } from "@/config";


  const features = [
    {
      title: "Type Safety",
      description: "Full TypeScript support with auto-generated types",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Validation",
      description: "Schema-based validation with detailed error messages",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Interpolation",
      description: "Smart variable interpolation and ternary expressions",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      title: "CLI Tools",
      description: "Powerful command-line tools for development workflow",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
  ];

  const configFileSteps = [
    {
      title: "Create envx.config.js",
      description:
        "Create an `envx.config.js` file in your project root to customize dotenvx CLI behavior.",
      code: `module.exports = {
  input: "./.envx",      // Path to your .envx file
  output: {
    env: "./.env",       // Output path for generated .env file
    types: "./envx.ts",  // Output path for generated TypeScript types
  },
  overwrite: true,                // Overwrite output files if they exist
};`,
      language: "javascript",
    },
    {
      title: "How dotenvx CLI uses envx.config.js",
      description:
        "When you run commands like `npx dotenvx build`, the CLI automatically loads this config file and uses its settings for input, output, and overwrite options.",
      code: "npx dotenvx build",
      language: "bash",
    },
    {
      title: "Run CLI commands with config",
      description:
        "Now you can simply run commands without extra flags, as dotenvx will use your config defaults:",
      code: `npx dotenvx build    # Generates .env from your .envx based on config
npx dotenvx check    # Validates your .envx file using the config
npx dotenvx types    # Generates TypeScript types according to config`,
      language: "bash",
    },
    {
      title: "Override config options (optional)",
      description:
        "You can still override config values directly via CLI flags if needed, e.g.:",
      code: `npx dotenvx build --input ./custom/.envx --output ./custom/.env`,
      language: "bash",
    },
  ];

export default function DocsPage() {
  const {
    copied,
    darkMode,
    searchQuery,
    activeSection,
    setSearchQuery,
    copyToClipboard,
    toggleDarkMode,
    scrollToSection,
    setSectionRef,
  } = useDocumentation();



  return (
    <div className={`min-h-screen dark:dark`}>
      <div className="bg-background text-foreground">
        <Header
          // darkMode={darkMode}
          // onToggleDarkMode={toggleDarkMode}
          sections={sections}
          activeSection={activeSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSectionClick={scrollToSection}
        />

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 border-r bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="sticky top-16 h-[calc(100vh-4rem)] p-6">
              <Sidebar
                sections={sections}
                activeSection={activeSection}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSectionClick={scrollToSection}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-12">
            <div className="mx-auto  max-[512px]:max-w-lg max-[600px]:max-w-xl sm:max-w-2xl  md:max-w-3xl lg:max-w-4xl space-y-16">
              {/* Getting Started */}
              <section>
                <SectionHeader
                  id="getting-started"
                  title="Getting Started with dotenvx"
                  description="dotenvx is a powerful, type-safe environment configuration format that extends the traditional .env files with validation and dynamic features."
                  icon={<Book className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <Alert className="border-primary/20 bg-primary/5">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Key Features</AlertTitle>
                    <AlertDescription>
                      Schema validation with TypeScript integration, variable
                      interpolation with ternary expressions, multiline string
                      support, and comprehensive CLI tools for modern
                      development workflows.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    {features.map((feature, index) => (
                      <FeatureCard key={index} {...feature} />
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => scrollToSection("installation")}
                      className="bg-gradient-to-r from-primary to-purple-600"
                    >
                      Installation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* Installation */}
              <section>
                <SectionHeader
                  id="installation"
                  title="Installation"
                  description="Install dotenvx using your preferred package manager."
                  icon={<Code className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <CodeBlock
                    title="npm"
                    language="bash"
                    showLineNumbers={false}
                    id="install-npm"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {`npm install ${PACKAGE_NAME}`}
                  </CodeBlock>

                  <Alert className="border-yellow-500/20 bg-yellow-500/5">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <AlertTitle>💡 Development vs Production</AlertTitle>
                    <AlertDescription>
                      For development, install as a regular dependency. For
                      production builds, you may want to install as a
                      devDependency if you're only using the CLI tools for
                      build-time validation.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("basic-usage")}
                      variant="outline"
                    >
                      Next: Basic Usage
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* Basic Usage */}
              <section>
                <SectionHeader
                  id="basic-usage"
                  title="Basic Usage"
                  description="Here's how to get started with dotenvx in your Node.js application."
                  icon={<FileText className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        1
                      </span>
                      Create a .envx file
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create a{" "}
                      <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
                        .envx
                      </code>{" "}
                      file in your project root with schema definitions:
                    </p>
                    <CodeBlock
                      title=".envx"
                      language="bash"
                      id="envx-example"
                      darkMode={darkMode}
                      copied={copied}
                      onCopy={copyToClipboard}
                    >
                      {codeExamples.envxBasic}
                    </CodeBlock>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                      </span>
                      Load in your application
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Import and use dotenvx in your Node.js application for
                      type-safe environment variable access:
                    </p>
                    <CodeBlock
                      title="index.ts"
                      language="typescript"
                      id="basic-usage-example"
                      darkMode={darkMode}
                      copied={copied}
                      onCopy={copyToClipboard}
                    >
                      {codeExamples.basicUsage}
                    </CodeBlock>
                  </div>

                  <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Benefits</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>
                          No more type casting (parseInt, === 'true', etc.)
                        </li>
                        <li>
                          Validation errors at startup instead of runtime
                          crashes
                        </li>
                        <li>
                          TypeScript integration for autocomplete and type
                          checking
                        </li>
                        <li>Default values for optional variables</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("cli-commands")}
                      variant="outline"
                    >
                      Next: CLI Commands
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* .envx File Syntax */}
              <section>
                <SectionHeader
                  id="envx-syntax"
                  title=".envx File Syntax"
                  description="Learn the syntax and features of .envx files that go beyond traditional .env files."
                  icon={<FileText className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <CodeBlock
                    title=".envx"
                    language="bash"
                    id="envx-syntax-example"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {codeExamples.envxSyntax}
                  </CodeBlock>

                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <AlertTitle>What is .envx?</AlertTitle>
                    <AlertDescription>
                      .envx is a new file format that extends traditional .env
                      files with powerful features like schema validation,
                      variable interpolation, ternary expressions, and multiline
                      strings. Think of it as a programming language
                      specifically designed for environment configuration.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FeatureCard
                      title="Variable Interpolation"
                      description="Reference other variables using ${VARIABLE} syntax"
                      icon={<Code className="w-5 h-5 text-blue-500" />}
                    />
                    <FeatureCard
                      title="Ternary Expressions"
                      description="Conditional values with ${CONDITION} ? 'true' : 'false'"
                      icon={<Code className="w-5 h-5 text-purple-500" />}
                    />
                    <FeatureCard
                      title="Multiline Strings"
                      description="Use triple quotes for JSON configs and long text"
                      icon={<FileText className="w-5 h-5 text-green-500" />}
                    />
                    <FeatureCard
                      title="Schema Definitions"
                      description="Define types and validation rules inline"
                      icon={<CheckCircle className="w-5 h-5 text-orange-500" />}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("schema-validation")}
                      variant="outline"
                    >
                      Next: Schema & Validation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* Schema & Validation */}
              <section>
                <SectionHeader
                  id="schema-validation"
                  title="Schema & Validation"
                  description="Define schemas for your environment variables to ensure type safety and validation."
                  icon={<CheckCircle className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <CodeBlock
                    title="schema-example.envx"
                    language="bash"
                    id="schema-validation-example"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {codeExamples.schemaValidation}
                  </CodeBlock>

                  <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Why Schema Validation?</AlertTitle>
                    <AlertDescription>
                      Schema validation catches configuration errors early,
                      ensures type safety, provides documentation, and enables
                      automatic TypeScript type generation. No more runtime
                      crashes due to missing or invalid environment variables!
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("interpolation")}
                      variant="outline"
                    >
                      Next: Variable Interpolation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* Variable Interpolation */}
              <section>
                <SectionHeader
                  id="interpolation"
                  title="Variable Interpolation"
                  description="Use variable interpolation and ternary expressions for dynamic configuration."
                  icon={<Code className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <CodeBlock
                    title="interpolation-example.envx"
                    language="bash"
                    id="interpolation-example"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {codeExamples.interpolation}
                  </CodeBlock>

                  <Alert className="border-purple-500/20 bg-purple-500/5">
                    <Code className="h-4 w-4 text-purple-500" />
                    <AlertTitle>Smart Configuration</AlertTitle>
                    <AlertDescription>
                      Variable interpolation allows you to build complex
                      configurations from simple building blocks. Ternary
                      expressions enable environment-specific settings without
                      duplicating configuration files.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("typescript")}
                      variant="outline"
                    >
                      Next: TypeScript Integration
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* TypeScript Integration */}
              <section>
                <SectionHeader
                  id="typescript"
                  title="TypeScript Integration"
                  description="Generate TypeScript types from your schema for complete type safety."
                  icon={<Code className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <CodeBlock
                    title="typescript-example.ts"
                    language="typescript"
                    id="typescript-example"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {codeExamples.typescript}
                  </CodeBlock>

                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Code className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Full TypeScript Support</AlertTitle>
                    <AlertDescription>
                      dotenvx automatically generates TypeScript definitions
                      from your .envx schema, providing autocomplete, type
                      checking, and compile-time error detection for environment
                      variables.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("examples")}
                      variant="outline"
                    >
                      Next: Examples
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* Examples */}
              <section>
                <SectionHeader
                  id="examples"
                  title="Examples"
                  description="Real-world examples of using .envx files and dotenvx in different frameworks."
                  icon={<FileText className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <FeatureCard
                      title="Next.js"
                      description="Server and client-side environment variables"
                      icon={<Code className="w-5 h-5 text-black" />}
                    />
                    <FeatureCard
                      title="Express.js"
                      description="Backend API configuration"
                      icon={<Code className="w-5 h-5 text-green-600" />}
                    />
                    <FeatureCard
                      title="React"
                      description="Frontend application settings"
                      icon={<Code className="w-5 h-5 text-blue-600" />}
                    />
                  </div>

                  <CodeBlock
                    title="next.js-example"
                    language="javascript"
                    id="nextjs-example"
                    darkMode={darkMode}
                    copied={copied}
                    onCopy={copyToClipboard}
                  >
                    {codeExamples.examples.nextjs}
                  </CodeBlock>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => scrollToSection("migration")}
                      variant="outline"
                    >
                      Next: Migration Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-16" />

              {/* CLI Commands */}
              <section>
                <SectionHeader
                  id="cli-commands"
                  title="CLI Commands"
                  description="dotenvx provides a comprehensive CLI for validating, building, and managing your environment configurations."
                  icon={<Code className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  {cliCommands.map((command) => (
                    <CLICommandCard
                      key={command.name}
                      {...command}
                      darkMode={darkMode}
                      copied={copied}
                      onCopy={copyToClipboard}
                    />
                  ))}
                </div>
              </section>

              <Separator className="my-16" />

              {/* Configuration File */}
              <section>
                <SectionHeader
                  id="configuration-file"
                  title="Configuration File"
                  description="envx.config.js is a file that can be used to add pre-cli settings for dotenvx"
                  icon={<Code className="w-5 h-5" />}
                  setSectionRef={setSectionRef}
                />

                <div className="space-y-8 mt-8">
                  <div className="space-y-4">
                    {configFileSteps.map((step, index) => (
                      <StepCard
                        key={index}
                        step={index + 1}
                        title={step.title}
                        description={step.description}
                        code={step.code}
                        language={step.language}
                        darkMode={darkMode}
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
