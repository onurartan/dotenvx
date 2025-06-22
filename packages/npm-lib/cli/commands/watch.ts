import { build } from "./build";
import { types } from "./types";

import chokidar from "chokidar";
import debounce from "lodash.debounce";
import { logger } from "../../shared/logger";
import { blue, bold, cyan, dim, yellow } from "colorette";
import { DEFAULT_ENV_FILE, DEFAULT_ENVX_FILE } from "../../shared/constants";

interface WatchOptions {
  input?: string;
  output?: string;
  metaFilePath?: string;
  typesOutput?: string;
  silent?: boolean;
  noTypes?: boolean;
  noBuild?: boolean;
}

export async function watch(options: WatchOptions) {
  const inputFile = options.input || DEFAULT_ENVX_FILE;
  const metaPath = options.metaFilePath || ".";
  const outputFile = options.output || DEFAULT_ENV_FILE;
  const typesOut = options.typesOutput || "envx.ts";

  if (!options.silent) {
    logger.log(bold(cyan("🌱 envx is now watching for changes...")));
    logger.log(`🔍 Watching ${inputFile} for changes...`);
  }

  try {
    if (!options.noBuild) {
      await build({
        input: inputFile,
        output: outputFile,
        metaFilePath: metaPath,
        overwrite: true,
      });
      if (!options.silent)
        // console.log(`[envx:success] ✔ .env build completed.`);
        logger.success(blue(bold(".env build completed.")));
    }

    if (!options.noTypes) {
      await types({
        input: inputFile,
        output: typesOut,
        metaFilePath: metaPath,
      });
      if (!options.silent)
        // console.log(`[envx:success] ✔ Type generation completed.`);
        logger.success(blue(bold("Type generation completed.")));
    }
  } catch (err) {
    logger.error(`Error during initial generation: ${err.message || err}`);
  }

  const regenerate = debounce(async () => {
    logger.log(dim("\n────────────────────────────────────────"));

    if (!options.silent) {
      // logger.log(`🔁 Change detected in ${inputFile}. Regenerating...`);
      logger.log(bold(yellow("\n🔁 Change detected. Regenerating...")));
    }

    try {
      if (!options.noBuild) {
        await build({
          input: inputFile,
          output: outputFile,
          metaFilePath: metaPath,
          overwrite: true,
        });
        if (!options.silent)
          logger.success(blue(bold(".env build completed.")));
      }

      if (!options.noTypes) {
        await types({
          input: inputFile,
          output: typesOut,
          metaFilePath: metaPath,
        });
        if (!options.silent)
          logger.success(blue(bold("Type generation completed.")));
      }
    } catch (err) {
      logger.error(`Error during regeneration: ${err.message || err}`);
    }
  }, 400);

  chokidar.watch(inputFile, { ignoreInitial: true }).on("change", regenerate);
}
