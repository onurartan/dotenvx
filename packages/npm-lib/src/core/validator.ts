import { ERROR_MESSAGES } from "../../shared/errors";
import { EnvSchema, EnvResult, EnvType, EnvError } from "../types";
import { isEmail } from "../utils";

/**
 * Parses a single environment variable value according to its declared type.
 *
 * @param key - The environment variable name.
 * @param value - The raw string value to parse.
 * @param type - Expected type of the value.
 * @param values - Allowed enum values if type is "enum".
 * @returns Parsed and typed value.
 * @throws {EnvError} When the value doesn't conform to the expected type.
 */
function parseValueByType(
  key: string,
  value: string,
  type: EnvType,
  values?: string[]
): string | number | boolean {
  switch (type) {
    case "string":
      return value;

    case "number": {
      const num = Number(value);
      if (isNaN(num)) {
        throw new EnvError(
          ERROR_MESSAGES.lib.validator.invalidNumber(key, value)
        );
      }
      return num;
    }

    case "boolean": {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
      throw new EnvError(
        ERROR_MESSAGES.lib.validator.invalidBoolean(key, value)
      );
    }

    case "enum": {
      if (!values?.length) {
        throw new EnvError(ERROR_MESSAGES.lib.validator.missingEnumValues(key));
      }
      if (!values.includes(value)) {
        throw new EnvError(
          ERROR_MESSAGES.lib.validator.invalidEnum(key, value, values)
        );
      }
      return value;
    }

    case "email": {
      if (!isEmail(value)) {
        throw new EnvError(
          ERROR_MESSAGES.lib.validator.invalidEmail(key, value)
        );
      }
      return value;
    }

    case "url": {
      try {
        new URL(value);
        return value;
      } catch {
        throw new EnvError(ERROR_MESSAGES.lib.validator.invalidUrl(key, value));
      }
    }

    default:
      throw new EnvError(
        ERROR_MESSAGES.lib.validator.unsupportedType(key, type)
      );
  }
}

/**
 * Validates and parses environment variables based on the provided schema.
 *
 * @param parsed - Array of parsed env key-value pairs.
 * @param schema - The validation schema defining expected types and requirements.
 * @returns Object with validated and typed environment variables.
 * @throws {EnvError} When required variables are missing or values are invalid.
 */
export function validateEnv(
  parsed: { key: string; value: string }[],
  schema?: EnvSchema
): EnvResult {
  const result: EnvResult = {};
  const parsedMap = new Map(parsed.map(({ key, value }) => [key, value]));

  for (const key in schema) {
    const { type, required, default: defValue, values } = schema[key];
    const rawValue = parsedMap.get(key);

    if (rawValue !== undefined) {
      // >_if value have check type
      result[key] = parseValueByType(
        key,
        rawValue,
        type,
        type === "enum" ? values : undefined
      );
      continue;
    }

    if (defValue !== undefined) {
      result[key] = parseValueByType(
        key,
        String(defValue),
        type,
        type === "enum" ? values : undefined
      );
      continue;
    }

    if (required) {
      throw new EnvError(ERROR_MESSAGES.lib.validator.requiredMissing(key));
    }
  }

  for (const [key, value] of parsedMap.entries()) {
    if (!(key in result)) {
      result[key] = value;
    }
  }

  return result;
}
