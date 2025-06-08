import fs from "fs/promises";
import path from "path";
import { loadEnvxFromString } from "../../src/core";

export async function print(options: { input: string }) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const content = await fs.readFile(inputPath, "utf-8");

    const parsed = loadEnvxFromString(content);
    console.log(JSON.stringify(parsed.result, null, 2));
  } catch (err: any) {
    console.error("[envx:error] ✖ Error reading .envx file:", err.message || err);
    process.exit(1);
  }
}
