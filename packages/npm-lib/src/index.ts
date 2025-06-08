import fs from "fs";
import path from "path";
import { EnvSchema, EnvResult, EnvError } from "./types";
import { loadEnvxFromString } from "./core";

import { ERROR_MESSAGES } from "../shared/errors";
import { addBuiltinEnvVarsToSchema } from "./utils";

export function getEnvx<T extends Record<string, any> = EnvResult>(
  filePath = ".envx",
  schema?: EnvSchema
): T {
  const absPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absPath)) {
    throw new EnvError(ERROR_MESSAGES.lib.fileDoesNotExist(absPath));
  }

  const content = fs.readFileSync(absPath, { encoding: "utf-8" });

  const finalSchema = addBuiltinEnvVarsToSchema(schema);

  const envVars = loadEnvxFromString(content, finalSchema);

  return envVars.result as T;
}

export function loadEnvx(filePath = ".envx", schema?: EnvSchema): EnvResult {
  const envVars = getEnvx(filePath, schema);

  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = String(value);
  });

  return envVars;
}
