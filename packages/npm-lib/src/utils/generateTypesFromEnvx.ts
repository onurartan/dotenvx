import { EnvSchema, EnvType, EnvVarSchema } from "../types";

function tsTypeFromEnvType(type: EnvType, schema: EnvVarSchema): string {
  switch (type) {
    case "string":
    case "email":
    case "url":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "enum":
      return schema.values && schema.values.length > 1
        ? schema.values.map((v) => `"${v}"`).join(" | ")
        : "string";
    default:
      return "any";
  }
}

/**
 * creates a typescript interface for each variable according to the schema structure, which is important because it can be used with getEnvx
 * @param schema EnvSchema
 * @returns typescript interface
 */
export function generateTypesFromEnvx(schema: EnvSchema): string {
  let lines: string[] = [];

  lines.push(`// AUTO GENERATED FILE - DO NOT EDIT\n`);
  lines.push(`export interface Envx {`);

  for (const key in schema) {
    const { type = "string", required } = schema[key];

    const tsType = tsTypeFromEnvType(type, schema[key]);

    const optionalFlag = required ? "" : "?";

    lines.push(`  ${key}${optionalFlag}: ${tsType};`);
  }

  lines.push(`}\n`);

  return lines.join("\n");
}
