/**
 * not part of the library dotenvx is an example file with cli presets for use with examples/
 */

module.exports = {
  input: "./examples/.envx",
  output: {
    env: "./examples/.env",
    types: "./examples/envx.ts",
  },
  overwrite: true,
};
