/*
CONFIG FILE STRUCT and ARGUMENTS
`envx.config.js`
module.exports = {
  input: "./examples/.envx",
  outputs: {
    env: "./examples/.env",
    types: "./examples/envx.ts",
    metaFilePath: "./examples", // Only Folder path (not include file name)
  },
  overwrite: true,
};

input -> Specifies the path to the .envx file
outputs -> used to specify output files
  env -> Used to specify the path of the .env file to be converted from .envx
  types -> to specify the path to the typescript type file to create
  [NEW] metaFilePath -> It is a json file with type etc. data to be created with .env during build, only the folder pathh name can be specified.
overwrite (true/false) -> If .env is present at the time of conversion and the value is true, it is overwritten directly, no questions asked 

*/

import path from "path";
// import { pathToFileURL } from "url";
import { existsSync } from "fs";

export function loadUserConfig() {
  const file = "envx.config.js";
  const fullPath = path.resolve(process.cwd(), file);
  if (existsSync(fullPath)) {
    // const url = pathToFileURL(fullPath).href; [OLD_VERSION(v0.0.102)]
    // const config = await import(url); [OLD_VERSION(v0.0.102)]

    const config = require(fullPath);
    return config;
  }
  return {};
}
