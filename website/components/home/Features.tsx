"use client";

import { Code, Zap, FileText, Terminal, Sparkles, Puzzle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import {
//   oneDark,
//   oneLight,
// } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { useTheme } from "magic-toast";
import { transparentOneDark } from "@/constants";
import { PACKAGE_NAME } from "@/config";

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: ".envx File Format",
    description:
      "Type-safe, expressive config format with schema, validation, and dynamic logic support.",
    color: "from-blue-500 to-cyan-500",
    demo: `# .envx example
API_URL=\${DEV} ? "localhost" : "prod.com"

[API_URL]
type="url"
required=true`,
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "dotenvx Library",
    description:
      "TypeScript library to read .envx files with full schema validation and type safety.",
    color: "from-purple-500 to-pink-500",
    demo: `import { loadEnvx, getEnvx, getEnv } from '${PACKAGE_NAME}'
import { Envx } from './envx.ts'

loadEnvx() // Loads and validates .envx files during development

const env = getEnvx<Envx>() // Use in dev or when .envx is available

// For production:
// 1) Run \`npx dotenvx generate\` to create a standard .env file and .envx.meta.json schema
// 2) Use getEnv() to read from .env with type safety (no runtime validation)
const prodEnv = getEnv<Envx>()`,
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Schema Validation",
    description:
      "Define types, constraints, and validation rules inside your .envx file.",
    color: "from-orange-500 to-red-500",
    demo: `[PORT]
type="number"
deprecated=true
required=true`,
  },
  {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Variable Interpolation",
    description:
      "Use other variables and ternary expressions for dynamic environment values.",
    color: "from-green-500 to-emerald-500",
    demo: `BASE_URL="https://api.com"
API_URL="\${BASE_URL}/v1"
KEY=\${DEV} ? "dev-key" : "prod-key"`,
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    title: "Powerful CLI",
    description:
      "Tools for validation, type generation, and converting .envx to .env files.",
    color: "from-indigo-500 to-purple-500",
    demo: `npx dotenvx check
npx dotenvx types
npx dotenvx build
npx dotenvx generate
npx dotenvx watch`,
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "TypeScript Integration",
    description:
      "Auto-generates TypeScript types from your .envx schema for type-safe access.",
    color: "from-yellow-500 to-orange-500",
    demo: `// Auto-generated types
// > npx dotenvx types
import { Envx } from "./envx.ts";
import { getEnvx, getEnv } from "${PACKAGE_NAME}";

const envDev = getEnvx<Envx>()  // Development: full validation and .envx support
const port: number = envDev.PORT
const url: string = envDev.API_URL

const envProd = getEnv<Envx>()  // Production: reads .env with type safety via .envx.meta.json`,
  },
];

const Features = () => {
  // const { theme } = useTheme();
  // const isDarkMode = theme == "dark";

  return (
    <section className="py-24 px-3 flex items-center justify-center">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Why .envx Format?
          </h2>
          <p className="text-lg text-muted-foreground">
            .envx is an enhanced environment configuration format with
            validation, interpolation, and schema support
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all duration-500 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}
              />
              <CardHeader className="pb-4">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="rounded-lg bg-muted/50 p-2 border">
                  <SyntaxHighlighter
                    language={
                      feature.title.includes("CLI") ? "bash" : "javascript"
                    }
                    // style={isDarkMode ? oneDark : oneLight}
                    style={transparentOneDark}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: "transparent",
                      fontSize: "12px",
                    }}
                  >
                    {feature.demo}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
