import fs from "fs/promises";
import path from "path";

import { generateTypesFromEnvx } from "../../src/utils/generateTypesFromEnvx";
import { parseEnvx } from "../../src/core/parser";
import { completeSchemaFromEnvx } from "../../src/utils";
import { createMetaJsonFile } from "../utils";
import { META_JSON_FILE_NAME } from "../../shared/constants";
import { logger } from "../../shared/logger";

export async function types(options: {
  input: string;
  output: string;
  metaFilePath: string;
}) {
  try {
    const inputPath = path.resolve(process.cwd(), options.input);
    const outputPath = path.resolve(process.cwd(), options.output);
    const outputPath_relativePath = path.relative(process.cwd(), outputPath);

    const content = await fs.readFile(inputPath, "utf-8");
    const { env, schema: parsedSchema } = parseEnvx(content);

    const fullSchema = completeSchemaFromEnvx(env, parsedSchema);

    const typesContent = generateTypesFromEnvx(fullSchema);
    await fs.writeFile(outputPath, typesContent);

    const metaFilePath = path.join(
      options.metaFilePath || ".",
      META_JSON_FILE_NAME
    );
    await createMetaJsonFile(fullSchema, metaFilePath);
    logger.success(
      `TypeScript definitions generated at: ${outputPath_relativePath}`
    );
    logger.success(
      `Meta JSON schema generated at: ${path.relative(
        process.cwd(),
        metaFilePath
      )}`
    );
  } catch (err) {
    // console.error("[envx:error] ✖ Error generating types:", err.message || err);
    logger.error(`Error generating types: ${err.message || err}`);
    process.exit(1);
  }
}
