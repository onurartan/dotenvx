import fs from "fs";
import path from "path";
import { EnvSchema, EnvResult, EnvxError } from "./types";
import { loadEnvxFromString } from "./core";

import { ERROR_MESSAGES } from "../shared/errors";
import { addBuiltinEnvVarsToSchema } from "./utils";

import { parseEnvxMetaFile } from "../shared/utils";
import { loadUserConfig } from "../shared/configLoader";
import {
  DEFAULT_ENV_FILE,
  DEFAULT_ENVX_FILE,
  META_JSON_FILE_NAME,
} from "../shared/constants";

// ---- Load user configuration ---- //
const config = loadUserConfig();

/**
 * Reads a pre-built `.env` file and its associated meta JSON schema,
 * then returns a type-safe object with all environment variables loaded and validated.
 *
 * **Important:**
 * - This function **does NOT** modify `process.env`.
 * - Intended for production or runtime environments where `.env` is pre-generated.
 *
 * @template T - The shape of the environment variables (defaults to EnvResult).
 * @param {string} [filePath=DEFAULT_ENV_FILE] - Path to the `.env` file.
 * @returns {T} Type-safe environment variables object.
 *
 * @throws {EnvxError} Throws if `.env` file does not exist.
 *
 * @example
 * ```ts
 * import { getEnv } from "dotenvx";
 * const env = getEnv<Envx>("path/to/.env");
 * console.log(env.API_URL);
 * ```
 */
export function getEnv<T extends Record<string, any> = EnvResult>(
  filePath = DEFAULT_ENV_FILE
): T {
  const metaFileFullPath = path.join(
    config?.outputs?.metaFilePath || ".",
    META_JSON_FILE_NAME
  );

  const metaFilePath = path.resolve(process.cwd(), metaFileFullPath);
  const envFilePath = config?.outputs?.env || filePath;
  const absPath = path.resolve(process.cwd(), envFilePath);

  if (!fs.existsSync(absPath)) {
    throw new EnvxError(ERROR_MESSAGES.lib.fileDoesNotExist(absPath));
  }

  const envContent = fs.readFileSync(absPath, { encoding: "utf-8" });
  const envSchema = parseEnvxMetaFile(metaFilePath);

  const envVars = loadEnvxFromString(envContent, envSchema);

  return envVars.result as T;
}

/**
 * Reads a `.envx` file and returns a type-safe object representing the environment variables.
 *
 * **Important:**
 * - This function **does NOT** modify `process.env`.
 * - Validates environment variables against the provided schema and adds built-in variables automatically.
 *
 * @template T - The shape of the environment variables (defaults to EnvResult).
 * @param {string} [filePath=DEFAULT_ENVX_FILE] - Path to the `.envx` file.
 * @param {EnvSchema} [schema] - Optional schema for validation and type inference.
 * @returns {T} Typed environment variables object.
 *
 * @throws {EnvxError} Throws if `.envx` file does not exist.
 *
 * @example
 * ```ts
 * import { getEnvx } from "dotenvx";
 * const envx = getEnvx<Envx>("path/to/.envx", mySchema);
 * console.log(envx.DATABASE_URL);
 * ```
 */
export function getEnvx<T extends Record<string, any> = EnvResult>(
  filePath = DEFAULT_ENVX_FILE,
  schema?: EnvSchema
): T {
  const envxFilePath = config?.outputs?.env || filePath;
  const absPath = path.resolve(process.cwd(), envxFilePath);

  if (!fs.existsSync(absPath)) {
    throw new EnvxError(ERROR_MESSAGES.lib.fileDoesNotExist(absPath));
  }

  const content = fs.readFileSync(absPath, { encoding: "utf-8" });

  const finalSchema = addBuiltinEnvVarsToSchema(schema);

  const envVars = loadEnvxFromString(content, finalSchema);

  return envVars.result as T;
}

/**
 * Loads environment variables from a `.envx` file, validates them against the schema,
 * and **injects them into `process.env`**, allowing global access within the Node.js process.
 *
 * Use this function when you want environment variables available globally in your app.
 *
 * @template T - The shape of the environment variables (defaults to EnvResult).
 * @param {string} [filePath=DEFAULT_ENVX_FILE] - Path to the `.envx` file.
 * @param {EnvSchema} [schema] - Optional schema for validation and type inference.
 * @returns {T} The loaded and injected environment variables as a typed object.
 *
 * @throws {EnvxError} Throws if `.envx` file does not exist.
 *
 * @example
 * ```ts
 * import { loadEnvx } from "dotenvx";
 * loadEnvx("path/to/.envx");
 * console.log(process.env.API_KEY);
 * ```
 */
export function loadEnvx<T extends Record<string, any> = EnvResult>(
  filePath = DEFAULT_ENVX_FILE,
  schema?: EnvSchema
): T {
  const envVars = getEnvx<T>(filePath, schema);

  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = String(value);
  });

  return envVars as T;
}
