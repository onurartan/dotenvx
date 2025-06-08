import {
  Book,
  Code,
  FileText,
  Braces,
  Settings,
  Puzzle,
  Terminal,
} from "lucide-react";
import type { Section, CLICommand, TroubleshootingItem } from "@/types/docs";
import { PACKAGE_NAME } from "@/config";

export const sections: Section[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: <Book className="w-4 h-4" />,
    category: "Basics",
  },
  {
    id: "installation",
    label: "Installation",
    icon: <Code className="w-4 h-4" />,
    category: "Basics",
  },
  {
    id: "basic-usage",
    label: "Basic Usage",
    icon: <FileText className="w-4 h-4" />,
    category: "Basics",
  },
  {
    id: "envx-syntax",
    label: ".envx File Syntax",
    icon: <Braces className="w-4 h-4" />,
    category: "Configuration",
  },
  {
    id: "schema-validation",
    label: "Schema & Validation",
    icon: <Settings className="w-4 h-4" />,
    category: "Configuration",
  },
  {
    id: "interpolation",
    label: "Variable Interpolation",
    icon: <Puzzle className="w-4 h-4" />,
    category: "Configuration",
  },
  {
    id: "typescript",
    label: "TypeScript Integration",
    icon: <Code className="w-4 h-4" />,
    category: "Advanced",
  },
  {
    id: "cli-commands",
    label: "CLI Commands",
    icon: <Terminal className="w-4 h-4" />,
    category: "Advanced",
  },
  {
    id: "configuration-file",
    label: "Configuration File",
    icon: <Settings className="w-4 h-4" />,
    category: "Advanced",
  },
  {
    id: "examples",
    label: "Examples",
    icon: <FileText className="w-4 h-4" />,
    category: "Examples",
  },

  // {
  //   id: "troubleshooting",
  //   label: "Troubleshooting",
  //   icon: <HelpCircle className="w-4 h-4" />,
  //   category: "Help",
  // },
];

export const cliCommands: CLICommand[] = [
  {
    name: "build",
    description: "Validates your .envx file and generates TypeScript types",
    usage: "npx dotenvx build",
    options: [
      {
        name: "--output",
        description: "Output directory for generated files",
        default: "./types",
      },
    ],
  },
  {
    name: "check",
    description: "Validates your .envx file against the defined schema",
    usage: "npx dotenvx check",
    options: [],
  },
  {
    name: "types",
    description: "Generates TypeScript type definitions from your schema",
    usage: "npx dotenvx types",
    options: [
      {
        name: "--output",
        description: "Output file path",
        default: "envx.ts",
      },
    ],
  },
];

export const codeExamples = {
  envxBasic: `# .envx - Modern environment configuration with schema
DEV_MODE=false

# Smart interpolation with ternary expressions
API_URL=\${DEV_MODE} ? "http://localhost:3000" : "https://api.example.com"
API_TOKEN=\${DEV_MODE} ? "dev-token" : "prod-token"
FULL_API_URL="\${API_URL}?token=\${API_TOKEN}&env=\${NODE_ENV}"

# Basic configuration
PORT=8080
DATABASE_NAME="myapp_db"

# Multiline strings with triple quotes
DATABASE_CONFIG="""
{
  "host": "localhost",
  "port": 5432,
  "ssl": true,
  "pool": {
    "min": 2,
    "max": 10
  }
}
"""

# Schema definitions (always at the bottom)
[DEV_MODE]
type="boolean"
description="Development mode flag"
default=false

[API_URL]
type="url"
required=true
description="Main API endpoint URL"

[PORT]
type="number"
required=true
description="Server port number"
default=3000

[NODE_ENV]
type="enum"
values=["development", "production", "test", "staging"]
default="development"
required=true
description="Application environment"`,

  basicUsage: `import { loadEnvx, getEnvx } from '${PACKAGE_NAME}';

// > npx dotenvx types
import {Envx} from "./envx.ts";

// Loading and validating environment variables for use with process.env
loadEnvx();

// Type-safe access with getEnvx
const env = getEnvx<Envx>();
console.log(env.PORT); // TypeScript knows this is a number
console.log(env.DEV_MODE); // TypeScript knows this is a boolean`,

  envxSyntax: `# Basic variable assignment
KEY="value"
NUMBER=123
BOOLEAN=true

# Comments start with #
# This is a comment

# Multiline strings with triple quotes
MULTILINE="""
This is a
multiline string
with "quotes" inside
"""

# Variable interpolation
BASE_URL="https://api.example.com"
API_URL="\${BASE_URL}/v1"

# Ternary expressions
IS_DEV=true
API_KEY=\${IS_DEV} ? "dev-key" : "prod-key"

# Schema definitions
[KEY]
type="string"
required=true
description="API key for authentication"

[NUMBER]
type="number"
min=0
max=1000
description="Maximum number of items"

[BOOLEAN]
type="boolean"
default=false
description="Feature flag"

[ENUM_VALUE]
type="enum"
values=["option1", "option2", "option3"]
default="option1"
description="Selected option"`,

  schemaValidation: `# Schema definition syntax
[VARIABLE_NAME]
type="string|number|boolean|enum|url|email"
description="Human readable description"
required=true|false
default="default value"

# Additional type-specific validations
# For enum:
values=["option1", "option2", "option3"]

# vsCode plugin specific
depracted=true # if true, a warning is specified in the variable vsCode plugin must be installed
description="...." # thanks to the variable schema with the description, a description is added to the variable with vscode, so that it can be known what the variable is without looking at the schema again with hover

# Example schema definitions
[API_KEY]
type="string"
required=true
description="API key for authentication"

[MAX_CONNECTIONS]
type="number"
default=10
description="Maximum number of concurrent connections"

[DEBUG_MODE]
type="boolean"
default=false
description="Enable debug logging"

[LOG_LEVEL]
type="enum"
values=["debug", "info", "warn", "error"]
default="info"
description="Application log level"`,

  interpolation: `# Basic variable interpolation
BASE_URL="https://api.example.com"
API_URL="\${BASE_URL}/v1"
FULL_URL="\${API_URL}/resource?token=abc123"

# Nested interpolation
PREFIX="api"
SUFFIX="v1"
NESTED_URL="https://\${PREFIX}.example.com/\${SUFFIX}"

# Ternary expressions
IS_DEV=true
API_KEY=\${IS_DEV} ? "dev-key-12345" : "prod-key-67890"
LOG_LEVEL=\${IS_DEV} ? "debug" : "info"

# Combining ternary and interpolation
ENV="development"
BASE=\${ENV} == "development" ? "http://localhost:3000" : "https://api.example.com"
AUTH_URL="\${BASE}/auth"
USER_URL="\${BASE}/users"
`,

  // # Multiple conditions ( SOOOON)
  // STAGE="test"
  // CONFIG=\${STAGE} == "dev" ? "dev-config" : \${STAGE} == "test" ? "test-config" : "prod-config"

  typescript: `// 1. Generate TypeScript types from your schema
// Run: npx dotenvx types --output env.ts

// 2. The generated envx.ts file will look like:
  interface Envx {
    PORT: number;
    API_URL: string;
    DEV_MODE: boolean;
    NODE_ENV: 'development' | 'production' | 'test' | 'staging';
    // ... other variables from your schema
  }

// 3. Use in your TypeScript code
import { loadEnvx, getEnvx } from '${PACKAGE_NAME}';
import {Envx} from "./envx.ts";

// Load and validate environment variables
loadEnvx();

// Type-safe access to all environment variables
const env = getEnvx<Envx>();
const nodeEnv: 'development' | 'production' | 'test' | 'staging' = env.NODE_ENV;`,

  examples: {
    nextjs: `// Next.js example
// In your .envx file
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_FEATURE_FLAGS="""
{
  "newUI": true,
  "betaFeatures": false
}
"""
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

[NEXT_PUBLIC_API_URL]
type="url"
required=true

[NEXT_PUBLIC_FEATURE_FLAGS]
type="json"
required=true

[DATABASE_URL]
type="string"
required=true

// In your next.config.js
const { loadEnvx } = require('${PACKAGE_NAME}');
// if you use process.env
loadEnvx();


// lib/env.ts
// In your app
import { getEnvx } from '${PACKAGE_NAME}';
export const env = getEnvx();

// Server-side
import {env} from "/lib/env.ts";

export async function getServerSideProps() {
  const dbUrl = env.DATABASE_URL;
  // Connect to database using dbUrl
  return { props: { /* ... */ } };
}

// Client-side (only NEXT_PUBLIC_ variables)
export default function HomePage() {
  const apiUrl = env.NEXT_PUBLIC_API_URL;
  const featureFlags = JSON.parse(env.NEXT_PUBLIC_FEATURE_FLAGS);

  return (
    <div>
      <h1>API URL: {apiUrl}</h1>
      {featureFlags.newUI && <NewUIComponent />}
    </div>
  );
}`,

    express: `// Express.js example
// In your .envx file
PORT=3000
DATABASE_URL="mongodb://localhost:27017/myapp"
JWT_SECRET="super-secret-key"
LOG_LEVEL="info"

[PORT]
type="number"
required=true
default=3000

[DATABASE_URL]
type="string"
required=true

[JWT_SECRET]
type="string"
required=true
minLength=16

[LOG_LEVEL]
type="enum"
values=["debug", "info", "warn", "error"]
default="info"

// In your app.js
const express = require('express');
const { loadEnvx, getEnvx } = require('${PACKAGE_NAME}');

// Load and validate environment variables (if you use process.env)
loadEnvx();

const app = express();
const env = getEnvx();
const port = env.PORT;
const dbUrl = env.DATABASE_URL;
const jwtSecret = env.JWT_SECRET;
const logLevel = env.LOG_LEVEL;

// Configure logging based on LOG_LEVEL
configureLogging(logLevel);

// Connect to database using dbUrl
connectToDatabase(dbUrl);

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,

    react: `// React application example
// In your .envx file
REACT_APP_API_URL="https://api.example.com"
REACT_APP_FEATURE_FLAGS="""
{
  "darkMode": true,
  "analytics": true
}
"""

[REACT_APP_API_URL]
type="url"
required=true

[REACT_APP_FEATURE_FLAGS]
type="json"
required=true


// lib/env.ts
// In your app
import { getEnvx } from '${PACKAGE_NAME}';
export const env = getEnvx();

// In your src/index.js or src/App.js
import { loadEnvx } from '${PACKAGE_NAME}';

// Load and validate environment variables ( if you use process.env)
loadEnvx();

import { env } from './lib/env';



function App() {
  const apiUrl =env.REACT_APP_API_URL;
  const featureFlags = JSON.parse(env.REACT_APP_FEATURE_FLAGS);

  return (
    <div className={featureFlags.darkMode ? 'dark-theme' : 'light-theme'}>
      <h1>My React App</h1>
      <p>API URL: {apiUrl}</p>
      {featureFlags.analytics && <AnalyticsComponent />}
    </div>
  );
}

export default App;`,
  },
};

export const troubleshootingItems: TroubleshootingItem[] = [
  {
    question: "Variable not found or undefined",
    answer: `Make sure your variable is defined in the .envx file and that you're loading the correct file. Check the path provided to loadEnvx().

\`\`\`javascript
// Specify the path explicitly
loadEnvx({ path: './path/to/.envx' });
\`\`\`

Also verify that the variable name is spelled correctly and that case matches exactly.`,
  },
  {
    question: "Type validation errors",
    answer: `If you're getting type validation errors, check that your variable values match the types defined in your schema.

\`\`\`
Error: Validation failed for PORT: Expected number, got string "3000"
\`\`\`

Make sure to use the correct format in your .envx file:
- Numbers should not be quoted: \`PORT=3000\` (not \`PORT="3000"\`)
- Booleans should be \`true\` or \`false\` (not quoted)
- Strings should be quoted: \`API_KEY="abc123"\``,
  },
  {
    question: "Schema validation errors",
    answer: `If your variables don't meet the constraints defined in your schema, you'll get validation errors.

\`\`\`
Error: Validation failed for API_KEY: String length (8) is less than minimum length (16)
\`\`\`

Check your schema constraints like \`minLength\`, \`maxLength\`, \`min\`, \`max\`, \`pattern\`, etc.`,
  },
];
