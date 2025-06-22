#!/usr/bin/env node
import { Command } from "commander";
import pkg from "../package.json";
import { loadUserConfig } from "../shared/configLoader";

import { build } from "./commands/build";
import { check } from "./commands/check";
import { print } from "./commands/print";
import { types } from "./commands/types";
import { generate } from "./commands/generate";
import { watch } from "./commands/watch";

async function main() {
  const program = new Command();
  // const config = await loadUserConfig() [OLD_VERSION(v0.0.102)]
  const config = loadUserConfig();

  const version = pkg.version;

  program
    .name("dotenvx")
    .description("Enhanced CLI for .envx - Manage .envx files effortlessly")
    .version(version);

  program
    .command("build")
    .description("Build .env file from .envx")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .option(
      "-o, --output <file>",
      "Output .env file",
      config.outputs?.env || ".env"
    )
    .option(
      "-m, --metaFilePath <file>",
      "Output metaJsonFile Folder Path (.envx.meta.json)",
      config.outputs?.metaFilePath || "envx.ts"
    )
    .option("--overwrite", "Overwrite output", config.overwrite || false)
    .action(build);

  program
    .command("generate")
    .alias("gen")
    .description("Generate types and build .env from .envx")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .option(
      "-o, --output <file>",
      "Output .env file",
      config.outputs?.env || ".env"
    )
    .option(
      "-t, --typesOutput <file>",
      "Output .ts file",
      config.outputs?.types || "envx.ts"
    )
    .option(
      "-m, --metaFilePath <path>",
      "Meta JSON output folder path",
      config.outputs?.metaFilePath || "."
    )
    .option("--overwrite", "Overwrite output", config.overwrite || false)
    .action((options) => {
      const sharedOptions = {
        ...options,
        output: options.output,
        metaFilePath: options.metaFilePath,
        noTypes: true,
      };
      return generate(sharedOptions);
    });

  program
    .command("watch")
    .description("Watch .envx and regenerate .env + types on change")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .option(
      "-o, --output <file>",
      "Output .env file",
      config.outputs?.env || ".env"
    )
    .option(
      "-t, --typesOutput <file>",
      "Output .ts file",
      config.outputs?.types || "envx.ts"
    )
    .option(
      "-m, --metaFilePath <path>",
      "Meta JSON output folder path",
      config.outputs?.metaFilePath || "."
    )
    .option("--no-types", "Do not generate TypeScript types")
    .option("--no-build", "Do not generate .env file")
    .option("--silent", "Don't log output to console")
    .action(watch);

  program
    .command("check")
    .description("Validate .envx against its schema")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .action(check);

  program
    .command("print")
    .description("Print parsed .envx as JSON")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .action(print);

  program
    .command("types")
    .description("Generate TypeScript definitions from schema")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .option(
      "-o, --output <file>",
      "Output .ts file",
      config.outputs?.types || "envx.ts"
    )
    .option(
      "-m, --metaFilePath <file>",
      "Output metaJsonFile Folder Path (.envx.meta.json)",
      config.outputs?.metaFilePath || "envx.ts"
    )
    .action(types);

  program.parse();
}

main();
