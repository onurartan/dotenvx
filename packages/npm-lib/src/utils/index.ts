import { BUILTIN_SCHEMA } from "../config";
import { EnvSchema, EnvVarSchema } from "../types";

export function toBoolean(value: any): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
}

export const isEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

function inferTypeFromValue(value: any): EnvVarSchema["type"] {
  if (typeof value === "boolean") return "boolean";
  if (!isNaN(Number(value)) && value !== "" && value !== null) return "number";
  return "string";
}

/**
 * used to set default schema for variables without schema value
 */
export function completeSchemaFromEnvx(
  env: { key: string; value: any }[],
  schema: EnvSchema
): EnvSchema {
  const completedSchema: EnvSchema = { ...BUILTIN_SCHEMA, ...schema };

  env.forEach(({ key, value }) => {
    if (!completedSchema[key]) {
      completedSchema[key] = {
        type: inferTypeFromValue(value),
        required: false,
      };
    }
  });

  return completedSchema;
}

export function addBuiltinEnvVarsToSchema(schema?: EnvSchema): EnvSchema {
  return {
    ...BUILTIN_SCHEMA,
    ...(schema || {}),
  };
}
