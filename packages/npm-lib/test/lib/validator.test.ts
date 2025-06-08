import { validateEnv } from "../../src/core/validator";
import { EnvSchema } from "../../src/types";


describe("validateEnv", () => {
  const baseSchema: EnvSchema = {
    STRING_VAR: { type: "string", required: true },
    NUMBER_VAR: { type: "number", required: true },
    BOOLEAN_VAR: { type: "boolean", required: true },
    ENUM_VAR: { type: "enum", required: true, values: ["dev", "prod"] },
    EMAIL_VAR: { type: "email", required: true },
    URL_VAR: { type: "url", required: true },
    OPTIONAL_VAR: { type: "string", required: false, default: "default" },
  };

  const validEnv = [
    { key: "STRING_VAR", value: "hello" },
    { key: "NUMBER_VAR", value: "42" },
    { key: "BOOLEAN_VAR", value: "true" },
    { key: "ENUM_VAR", value: "dev" },
    { key: "EMAIL_VAR", value: "test@example.com" },
    { key: "URL_VAR", value: "https://example.com" },
  ];

  it("should validate and parse all supported types", () => {
    const result = validateEnv(validEnv, baseSchema);
    expect(result).toEqual({
      STRING_VAR: "hello",
      NUMBER_VAR: 42,
      BOOLEAN_VAR: true,
      ENUM_VAR: "dev",
      EMAIL_VAR: "test@example.com",
      URL_VAR: "https://example.com",
      OPTIONAL_VAR: "default",
    });
  });

  it("should throw for invalid number", () => {
    const env = [
      ...validEnv.map((e) => ({ ...e })),
      { key: "NUMBER_VAR", value: "abc" },
    ];
    expect(() => validateEnv(env, baseSchema)).toThrow(/Invalid value /i);
  });

  it("should throw for invalid boolean", () => {
    const env = [
      ...validEnv.map((e) => ({ ...e })),
      { key: "BOOLEAN_VAR", value: "yes" },
    ];
    expect(() => validateEnv(env, baseSchema)).toThrow(/invalid boolean/i);
  });

  it("should throw for invalid enum", () => {
    const env = [
      ...validEnv.map((e) => ({ ...e })),
      { key: "ENUM_VAR", value: "staging" },
    ];
    expect(() => validateEnv(env, baseSchema)).toThrow(/Invalid enum value/i);
  });

  it("should throw for invalid email", () => {
    const env = [
      ...validEnv.map((e) => ({ ...e })),
      { key: "EMAIL_VAR", value: "not-an-email" },
    ];
    expect(() => validateEnv(env, baseSchema)).toThrow(/Invalid email format/i);
  });

  it("should throw for invalid url", () => {
    const env = [
      ...validEnv.map((e) => ({ ...e })),
      { key: "URL_VAR", value: "not-a-url" },
    ];
    expect(() => validateEnv(env, baseSchema)).toThrow(/Invalid URL format/i);
  });

  it("should throw if required variable is missing", () => {
    const missingRequired = validEnv.filter((v) => v.key !== "STRING_VAR");
    expect(() => validateEnv(missingRequired, baseSchema)).toThrow(
      /Required environment variable/i
    );
  });

  it("should parse default values if variable is missing", () => {
    const schema: EnvSchema = {
      SOME_VAR: { type: "string", required: false, default: "fallback" },
    };
    const result = validateEnv([], schema);
    expect(result).toEqual({ SOME_VAR: "fallback" });
  });

  it("should keep unknown keys as string", () => {
    const schema: EnvSchema = {};
    const result = validateEnv([{ key: "EXTRA_VAR", value: "123" }], schema);
    expect(result).toEqual({ EXTRA_VAR: "123" });
  });

  it("should throw if enum has no 'values' defined", () => {
    const schema: EnvSchema = {
      BAD_ENUM: { type: "enum", required: true }, // no `values`
    };
    const env = [{ key: "BAD_ENUM", value: "x" }];
    expect(() => validateEnv(env, schema)).toThrow(
      /Enum values are not defined for \"BAD_ENUM\". Please specify allowed values./i
    );
  });

  it("should throw if unknown type is passed", () => {
    const schema: EnvSchema = {
      UNSUPPORTED: { type: "something" as any, required: true },
    };
    const env = [{ key: "UNSUPPORTED", value: "val" }];
    expect(() => validateEnv(env, schema)).toThrow(/unsupported type/i);
  });
});
