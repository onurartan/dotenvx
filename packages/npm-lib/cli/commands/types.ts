import fs from "fs/promises";
import path from "path";

import { generateTypesFromEnvx } from "../../src/utils/generateTypesFromEnvx";
import { parseEnvx } from "../../src/core/parser";
import { completeSchemaFromEnvx } from "../../src/utils";

export async function types(options: { input: string; output: string }) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const outputPath = path.resolve(process.cwd(), options.output);
     const outputPath_relativePath = path.relative(process.cwd(), outputPath);

    const content = await fs.readFile(inputPath, "utf-8");
    const { env, schema: parsedSchema } = parseEnvx(content);

    const fullSchema = completeSchemaFromEnvx(env, parsedSchema);

    const typesContent = generateTypesFromEnvx(fullSchema);
    await fs.writeFile(outputPath, typesContent);

    console.log(`[envx:sucess] ✔ TypeScript definitions generated at: ${outputPath_relativePath}`);
  } catch (err: any) {
    console.error("[envx:error] ✖ Error generating types:", err.message || err);
    process.exit(1);
  }
}
