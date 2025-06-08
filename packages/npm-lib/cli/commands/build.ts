import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import readline from "readline";
import { loadEnvxFromString } from "../../src/core";

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

export async function build(options: any) {
  const input = path.resolve(process.cwd(), options.input);
  const output = path.resolve(process.cwd(), options.output);
  const output_relativePath = path.relative(process.cwd(), output);
  const overwrite = options.overwrite;

  if (!overwrite && existsSync(output)) {
    const confirmed = await confirmOverwrite(output_relativePath);
    if (!confirmed) {
      console.log("[envx:info] ✖ Operation cancelled.");
      process.exit(0);
    }
  }

  const content = await fs.readFile(input, "utf-8");
  const parsed = loadEnvxFromString(content);

  const raw = Object.entries(parsed.result)
    .map(([key, value]) => `${key}="${String(value).replace(/\n/g, "\\n")}"`)
    .join("\n");

  const dir = path.dirname(output);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(output, raw);
  console.log(
    `[envx:success] ✔ .env file generated at: ${output_relativePath}`
  );
}
