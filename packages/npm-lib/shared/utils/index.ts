import fs from "fs";
import path from "path";
import { EnvSchema } from "../../src/types";
import { META_JSON_FILE_NAME } from "../constants";

/**
 * Reads `.envx.meta.json` file and returns it as a typed EnvSchema object.
 * @param filePath - Path to .envx.meta.json (default: process.cwd()/.envx.meta.json)
 */
export function parseEnvxMetaFile(filePath?: string): EnvSchema {
  const resolvedPath =
    filePath ?? path.join(process.cwd(), META_JSON_FILE_NAME);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Meta file not found at ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8");

  try {
    const parsed: EnvSchema = JSON.parse(raw);
    return parsed;
  } catch (err) {
    throw new Error(
      `Invalid JSON in ${resolvedPath}: ${(err as Error).message}`
    );
  }
}
