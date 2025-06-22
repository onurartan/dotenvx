import { logger } from "../../shared/logger";
import { build } from "./build";
import { types } from "./types";
import { red, bold, blue } from "colorette";

export async function generate(options: any) {
  try {
    await build(options);
    logger.success(blue(bold(".env build completed.\n")));

    await types(options);
    logger.success(blue(bold("Type generation completed.\n")));
  } catch (err) {
    logger.error(red(bold(`Error during generation: ${err.message || err}`)));
  }
}
