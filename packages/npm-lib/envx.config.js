/**
 * not part of the library dotenvx is an example file with cli presets for use with examples/
 */

module.exports = {
  input: "./examples/.envx",
  outputs: {
    env: "./examples/.env",
    types: "./examples/envx.ts",
    metaFilePath: "./examples/", // Only Folder path (not include file name)
  },
  overwrite: true,
};
