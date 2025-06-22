import fs from "fs/promises";
// import path from "path";

import { EnvSchema } from "../../src/types";
import { createMetaJson } from "../../src/utils/createMetaJson";
// import { META_JSON_FILE_NAME } from "../../shared/constants";

export const createMetaJsonFile = async (
  fullSchema: EnvSchema,
  metaFilePath: string
) => {
  const metaJsonContent = createMetaJson(fullSchema);
  await fs.writeFile(metaFilePath, metaJsonContent);
};
