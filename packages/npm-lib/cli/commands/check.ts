import fs from "fs/promises";
import path from "path";
import { loadEnvxFromString } from "../../src/core";
import { logger } from "../../shared/logger";

export async function check(options: { input: string }) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const content = await fs.readFile(inputPath, "utf-8");

    const parsed = loadEnvxFromString(content);

    // console.log("[envx:success] ✔ No validation errors found in .envx file.");
    logger.success("No validation errors found in .envx file.");
  } catch (err) {
    logger.error(`Error reading or validating .envx: ${err.message || err}`);
    process.exit(1);
  }
}
