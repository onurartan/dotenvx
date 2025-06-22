import fs from "fs/promises";
import path from "path";
import { loadEnvxFromString } from "../../src/core";
import { logger } from "../../shared/logger";

export async function print(options: { input: string }) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const content = await fs.readFile(inputPath, "utf-8");

    const parsed = loadEnvxFromString(content);
    console.log(JSON.stringify(parsed.result, null, 2));
  } catch (err) {
    logger.error(`Error reading .envx file: ${err.message || err}`);
    process.exit(1);
  }
}
