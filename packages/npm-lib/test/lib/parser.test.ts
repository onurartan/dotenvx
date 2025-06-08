import { parseEnvx } from "../../src/core/parser";

describe("parseEnvx", () => {
  it("should parse valid envx content", () => {
    const content = `
      API_KEY="abc123"
      
      [API_KEY]
      type=string
      required=true
    `;

    const result = parseEnvx(content);
    expect(result.env).toEqual([{ key: "API_KEY", value: "abc123" }]);
    expect(result.schema.API_KEY).toMatchObject({
      type: "string",
      required: true,
    });
  });

  it("should throw error on duplicate schema property", () => {
    const content = `
      API_KEY="abc123"

      [API_KEY]
      type=string
      type=number
    `;
    expect(() => parseEnvx(content)).toThrow(/already defined/i);
  });

  it("throws an error if the schema structure is used but no name is specified", () => {
    const content = `
      API_KEY="abc123"

      []
    `;
    expect(() => parseEnvx(content)).toThrow(
      /Schema block name cannot be empty/i
    );
  });

  it("gives an error if the schema is defined twice with the same key value", () => {
    const content = `
      API_KEY="abc123"

      [API_KEY]
      type="number"

      [API_KEY]
      type="string"
      required=true
    `;
    expect(() => parseEnvx(content)).toThrow(
      /is already defined. Duplicate schema definitions are not allowed/i
    );
  });

  it("error if type is used twice in schema", () => {
    const content = `
      API_KEY="abc123"

      [API_KEY]
      type="number"
      type="string"
    `;
    expect(() => parseEnvx(content)).toThrow(
      /\"type\" is already defined for this variable. You cannot redefine it/i
    );
  });

  it("if incorrect input is made for the schema “values” argument", () => {
    const content = `
      API_KEY="abc123"

      [API_KEY]
      type="enum"
      values=1
    `;
    expect(() => parseEnvx(content)).toThrow(
      /\"values\" must be a valid JSON string array/i
    );
  });

  it("if the variable name is empty", () => {
    const content = `
    =API_KEY
    `;
    expect(() => parseEnvx(content)).toThrow(
      /Line 2: Variable name cannot be empty./i
    );
  });


  it("should throw error if '=' delimiter is missing", () => {
  const content = `
    INVALID_LINE
  `;

  expect(() => parseEnvx(content)).toThrow(/missing "="/i);
});

});
