import fs from "fs/promises";
import path from "path";
import { loadEnvxFromString } from "../../src/core";

export async function check(options: { input: string }) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const content = await fs.readFile(inputPath, "utf-8");

    const parsed = loadEnvxFromString(content);


    console.log("[envx:success] ✔ No validation errors found in .envx file.");
  } catch (err: any) {
    console.error("[envx:error] ✖ Error reading or validating .envx:", err.message || err);
    process.exit(1);
  }
}
