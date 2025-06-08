import { parseEnvx } from "../../src/core/parser";
import { resolveEnvx } from "../../src/core/resolver";

describe("resolveEnvx", () => {
  it("should parse and resolve basic envx content", () => {
    const content = `
      API_KEY="abc123"
      
      [API_KEY]
      type="string"
      required=true
    `;

    const { env, schema } = parseEnvx(content);
    const resolved = resolveEnvx(env, schema);

    expect(resolved).toEqual({ API_KEY: "abc123" });
  });

  it("should apply default when not present", () => {
    const content = `
    [TIMEOUT]
    type="number"
    default=30
    required=true
  `;

    const { env, schema } = parseEnvx(content);
    const resolved = resolveEnvx(env, schema);

    expect(resolved).toEqual({ TIMEOUT: 30 });
  });

  it("should resolve interpolated variables", () => {
    const content = `
     HOST="localhost"
    PORT="3000"
    URL="http://\${HOST}:\${PORT}"

    [URL]
    type="string"
    required=true
    `;

    const { env, schema } = parseEnvx(content);
    const resolved = resolveEnvx(env, schema);

    expect(resolved.URL).toBe("http://localhost:3000");
  });

  it("should give an error resolving interpolated variables", () => {
    const content = `
    PORT="3000"
    URL="http://\${HOST}:\${PORT}"

    [URL]
    type="string"
    required=true
    `;

    const { env, schema } = parseEnvx(content);

    expect(() => resolveEnvx(env, schema)).toThrow(
      /No value found for interpolation/
    );
  });

  it("if required and no value is given, it should give an error", () => {
    const content = `
    DB_NAME="hello"

    [DATABASE_URL]
    type="string"
    required=true
    `;

    const { env, schema } = parseEnvx(content);

    expect(() => resolveEnvx(env, schema)).toThrow(
      /Environment variable \"DATABASE_URL\" is not set and no default is defined/
    );
  });

  it("if there is a structure that will cause an infinite loop, it should give an error", () => {
    const content = `
    DB_NAME=\${DB_NAME}
    `;

    const { env, schema } = parseEnvx(content);

    expect(() => resolveEnvx(env, schema)).toThrow(
      /Circular dependency detected while resolving \"DB_NAME\"/
    );
  });
});
