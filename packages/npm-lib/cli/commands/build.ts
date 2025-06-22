import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import readline from "readline";
import { loadEnvxFromString } from "../../src/core";
import { META_JSON_FILE_NAME } from "../../shared/constants";
import { createMetaJsonFile } from "../utils";
import { BUILTIN_SCHEMA } from "../../src/config";
import { logger } from "../../shared/logger";

async function confirmOverwrite(file: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    rl.question(`⚠️ "${file}" exists. Overwrite? (y/N): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

export async function build(options: {
  input: string;
  output: string;
  metaFilePath: string;
  overwrite: boolean;
  noTypes?: boolean;
}) {
  const input = path.resolve(process.cwd(), options.input);
  const output = path.resolve(process.cwd(), options.output);
  const output_relativePath = path.relative(process.cwd(), output);
  const overwrite = options.overwrite;
  const noTypes = options?.noTypes ?? false;

  if (!overwrite && existsSync(output)) {
    const confirmed = await confirmOverwrite(output_relativePath);
    if (!confirmed) {
      // console.log("[envx:info] ✖ Operation cancelled.");
      logger.info("✖ Operation cancelled.");
      process.exit(0);
    }
  }

  const content = await fs.readFile(input, "utf-8");
  const parsed = loadEnvxFromString(content);

  const raw = Object.entries(parsed.result)
    .map(([key, value]) => `${key}="${String(value).replace(/\n/g, "\\n")}"`)
    .join("\n");

  // >_ CREATE META JSON FILE
  if (!noTypes) {
    const metaFilePath = path.join(
      options.metaFilePath || ".",
      META_JSON_FILE_NAME
    );
    await createMetaJsonFile(parsed.schema || BUILTIN_SCHEMA, metaFilePath);
    logger.success(
      `Meta JSON schema generated at: ${path.relative(
        process.cwd(),
        metaFilePath
      )}`
    );
  }

  const dir = path.dirname(output);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(output, raw);

  logger.success(`.env file generated at: ${output_relativePath}`);
}
