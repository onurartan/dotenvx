#!/usr/bin/env node
import { Command } from "commander";
import pkg from "../package.json";
import { loadUserConfig } from "./config";

import { build } from "./commands/build";
import { check } from "./commands/check";
import { print } from "./commands/print";
import { types } from "./commands/types";

async function main() {
  const program = new Command();
  const config = await loadUserConfig();

  program
    .name("dotenvx")
    .description("Enhanced CLI for .envx - Manage .envx files effortlessly")
    .version(pkg.version);

  program
    .command("build")
    .description("Build .env file from .envx")
    .option("-i, --input <file>", "Input .envx file", config.input || ".envx")
    .option(
      "-o, --output <file>",
      "Output .env file",
      config.output?.env || ".env"
    )
    .option("--overwrite", "Overwrite output", config.overwrite || false)
    .action(build);

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
      config.output?.types || "envx.ts"
    )
    .action(types);

  program.parse();
}

main();
