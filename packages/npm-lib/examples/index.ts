/**
 * 🧪 DOTENVX USAGE EXAMPLE
 *
 * Run the following command to generate TypeScript types from your `.envx`:
 *
 *     npx dotenvxjs types
 *     npx dotenvxjs generate (.env file and type files are created)
 *
 * This will generate the `envx.ts` file used below for full intellisense support.
 */

import { getEnvx, loadEnvx, getEnv } from "../src";
import { Envx } from "./envx";
import { bold, green, cyan, yellow, dim } from "colorette";

// --- 1. loadEnvx ---
// Loads environment variables from the ".envx" file into process.env.
// This makes these variables globally accessible via process.env in your application.
// Recommended for development or environments that support process.env injection.
// Note: No type checking is performed; this only loads variables.
// loadEnvx("examples/.envx");
loadEnvx();

// --- 2. getEnvx ---
// Reads the ".envx" file and returns a type-safe object representing the env variables.
// Does NOT modify process.env.
// Use this when you want typed access to environment variables (e.g., in frontend or backend).
// const envx = getEnvx<Envx>("examples/.envx");
const envx = getEnvx<Envx>();

// --- 3. getEnv ---
// Reads the pre-built ".env" file and the ".envx.meta.json" schema file,
// then returns a type-safe object of environment variables.
// Does NOT modify process.env.
// Recommended for production environments where you consume a ready .env file.
// Provides both type safety and runtime validation.
// const env = getEnv<Envx>("examples/.env");
const env = getEnv<Envx>();

/* -------------------------------------------
   🔍 OUTPUT: Environment Variable Examples
-------------------------------------------- */

console.log(bold(cyan("🌐 Runtime Environment Variables")));
console.log(`${bold("API_TOKEN")}:        ${process.env.API_TOKEN}`);
console.log(`${bold("API_URL")}:          ${process.env.API_URL}`);
console.log(`${bold("FULL_API_URL")}:     ${process.env.FULL_API_URL}`);
console.log(`${bold("PORT")}:             ${process.env.PORT}`);
console.log(`${bold("NODE_ENV")}:         ${process.env.NODE_ENV}`);
console.log("");

console.log(bold(green("📦 envx (typed .envx access)")));
console.log(`${bold("DATABASE_NAME")}:    ${envx.DATABASE_NAME}`);
console.log(`${bold("WEBSITE_URL")}:      ${envx.WEBSITE_URL}`);
console.log(`${bold("BASE")}:             ${envx.BASE}`);
console.log("");

console.log(bold(yellow("📁 env (typed .env access via meta schema)")));
console.log(`${bold("[ENV] BASE")}:       ${env.BASE}`);
console.log("");

/* -------------------------------------------
   ⚙️  Conditional Behavior (DEV_MODE / NODE_ENV)
-------------------------------------------- */

console.log(bold(cyan("🧠 Conditional Logic Tests")));

if (envx.DEV_MODE === false) {
  console.log(`${bold("[ENVX](DEV_MODE)")}: ${yellow("DEV_MODE is false")}`);
} else {
  console.log(`${bold("[ENVX](DEV_MODE)")}: ${green("DEV_MODE is true")}`);
}

if (env.DEV_MODE === false) {
  console.log(`${bold("[ENV](DEV_MODE)")}:  ${yellow("DEV_MODE is false")}`);
} else {
  console.log(`${bold("[ENV](DEV_MODE)")}:  ${green("DEV_MODE is true")}`);
}

switch (env.NODE_ENV) {
  case "production":
    console.log(`${bold("[ENV](NODE_ENV)")}: 🏭 ${green("Production Mode")}`);
    break;
  case "development":
    console.log(`${bold("[ENV](NODE_ENV)")}: 🛠️ ${yellow("Development Mode")}`);
    break;
  default:
    console.log(
      `${bold("[ENV](NODE_ENV)")}: 🧪 ${cyan("Test Mode or Unknown")}`
    );
    break;
}
