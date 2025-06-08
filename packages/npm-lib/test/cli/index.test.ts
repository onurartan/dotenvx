import { exec } from "child_process";
import path from "path";

describe("dotenvx CLI", () => {
  const cliPath = path.resolve(__dirname, "../../dist/cli/index.js");

  it("should show help message", (done) => {
    exec(`node ${cliPath} --help`, (error, stdout, stderr) => {
      console.log(stderr);
      console.log(stdout);
      expect(error).toBeNull();
      expect(stdout).toMatch(/Usage:/);
      done();
    });
  });

  it("should build .env from .envx", (done) => {
    exec(
      `node ${cliPath} build -i examples/.envx -o examples/.env --overwrite`,
      (error, stdout, stderr) => {
        console.log(stderr);
        console.log(stdout);
        expect(error).toBeNull();
        expect(stdout).toMatch(/.env file generated at/i);
        done();
      }
    );
  }, 18000);
});
