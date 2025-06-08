import { ERROR_MESSAGES } from "../../shared/errors";
import { allowedSchemaTypes } from "../config";
import { EnvError, EnvSchema, EnvVarSchema } from "../types";

interface ParsedLine {
  key: string;
  value: any;
}

interface ParseResult {
  env: ParsedLine[];
  schema: EnvSchema;
}

/**
 * Parses a custom `.envx` file format into environment variables and their schema definitions.
 *
 * The parser supports:
 * - Standard key=value lines
 * - Multiline values wrapped with triple quotes (`"""`)
 * - Optional schema definitions using section headers like `[VARNAME]`
 *
 * Example:
 * ```
 * API_KEY="abc123"
 *
 * [API_KEY]
 * type = string
 * required = true
 * ```
 *
 * @param {string} content - Raw contents of the `.envx` file.
 * @returns {{ env: ParsedLine[], schema: EnvSchema }} Parsed environment variables and associated schema definitions.
 *
 * @throws {EnvError} If the syntax is invalid or required attributes are missing.
 */
export function parseEnvx(content: string): ParseResult {
  const lines = content.split(/\r?\n/);
  const env: ParsedLine[] = [];
  const schema: EnvSchema = {};

  let currentSchemaKey: string | null = null;
  let multilineKey: string | null = null;
  let multilineBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const trimmedLine = originalLine.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    if (multilineKey) {
      if (trimmedLine.endsWith('"""')) {
        multilineBuffer.push(trimmedLine.slice(0, -3));
        env.push({ key: multilineKey, value: multilineBuffer.join("\n") });
        multilineKey = null;
        multilineBuffer = [];
      } else {
        multilineBuffer.push(originalLine);
      }
      continue;
    }

    if (isSchemaHeader(trimmedLine)) {
      currentSchemaKey = parseSchemaHeader(trimmedLine, i, schema);
      continue;
    }

    if (currentSchemaKey) {
      parseSchemaLine(trimmedLine, i, schema[currentSchemaKey]);
      continue;
    }

    const { key, value, isMultilineStart } = parseEnvLine(trimmedLine, i);
    if (isMultilineStart) {
      multilineKey = key;
      multilineBuffer.push(value);
    } else {
      env.push({ key, value });
    }
  }

  return { env, schema };
}

function parseSchemaHeader(
  line: string,
  lineNumber: number,
  schema: EnvSchema
): string {
  const key = line.slice(1, -1).trim();
  if (!key) {
    // throw new EnvError(
    //   `[envx:error] Line ${lineNumber + 1}: Schema block name cannot be empty.`
    // );
    throw new EnvError(ERROR_MESSAGES.lib.parser.schemaBlockEmpty(lineNumber));
  }

  if (schema[key]) {
    // throw new EnvError(
    //   `[envx:error] Line ${
    //     lineNumber + 1
    //   }: Schema key "${key}" is already defined. Duplicate schema definitions are not allowed.`
    // );

    throw new EnvError(
      ERROR_MESSAGES.lib.parser.schemaKeyDuplicate(lineNumber, key)
    );
  }

  schema[key] = schema[key] ?? {};
  return key;
}

/**
 * Parses a line inside a schema block and applies it to the given schema variable.
 *
 * Supported keys: type, required, default, values
 *
 * @param {string} line - The line inside the schema block.
 * @param {number} lineNumber - Current line number (zero-based).
 * @param {EnvVarSchema} target - Target schema object for this variable.
 *
 * @throws {EnvError} For unknown keys or invalid value formats.
 */
function parseSchemaLine(
  line: string,
  lineNumber: number,
  target: EnvVarSchema
) {
  const [rawKey, rawValue] = splitKeyValue(line, lineNumber);
  const key = rawKey.trim();
  const value: any = stripQuotes(rawValue.trim());

  switch (key) {
    case "required":
      target.required = value === "true";
      break;

    case "type":
      if (target.type !== undefined) {
        // throw new EnvError(
        //   `[envx:error] Line ${
        //     lineNumber + 1
        //   }: "type" is already defined for this variable. You cannot redefine it.`
        // );
        throw new EnvError(
          ERROR_MESSAGES.lib.parser.typeAlreadyDefined(lineNumber)
        );
      }
      if (!allowedSchemaTypes.includes(value)) {
        // throw new EnvError(
        //   `[envx:error] Line ${lineNumber + 1}: Unsupported type "${value}".`
        // );

        throw new EnvError(
          ERROR_MESSAGES.lib.unsupportedType(lineNumber, value)
        );
      }
      target.type = value as EnvVarSchema["type"];
      break;

    case "default":
      applyDefault(value, lineNumber, target);
      break;

    case "values":
      try {
        const parsed = JSON.parse(value);
        if (
          !Array.isArray(parsed) ||
          !parsed.every((v) => typeof v === "string")
        ) {
          throw new EnvError(
            `[envx:error] Line ${
              lineNumber + 1
            }: The parsed "values" field must be an array of strings. ` +
              `Please ensure the JSON array contains only string elements.`
          );
        }
        target.values = parsed;
      } catch {
        // throw new EnvError(
        //   `[envx:error] Line ${
        //     lineNumber + 1
        //   }: "values" must be a valid JSON string array.`
        // );

        throw new EnvError(
          ERROR_MESSAGES.lib.parser.invalidValuesJson(lineNumber)
        );
      }
      break;

    case "deprecated":
      target.deprecated = value;
      break;
    case "description":
      target.description = value;
      break;

    default:
      throw new EnvError(
        ERROR_MESSAGES.lib.parser.unknownSchemaProperty(lineNumber, key)
      );
    // throw new EnvError(
    //   `[envx:error] Line ${lineNumber + 1}: Unknown schema property "${key}".`
    // );
  }
}

function isSchemaHeader(line: string): boolean {
  // --- Checks if a line is a schema section header, e.g. [MY_VARIABLE]. --- //
  return /^\[.*\]$/.test(line);
}

function applyDefault(value: string, lineNumber: number, target: EnvVarSchema) {
  const { type, values } = target;
  if (!type) {
    // throw new EnvError(
    //   `[envx:error] Line ${
    //     lineNumber + 1
    //   }: "type" must be defined before "default".`
    // );
    throw new EnvError(
      ERROR_MESSAGES.lib.parser.typeRequiredBeforeDefault(lineNumber)
    );
  }

  switch (type) {
    case "number":
      const num = Number(value);
      if (isNaN(num)) {
        // throw new EnvError(
        //   `[envx:error] Line ${
        //     lineNumber + 1
        //   }: Default value must be a valid number.`
        // );

        throw new EnvError(
          ERROR_MESSAGES.lib.parser.defaultMustBeNumber(lineNumber)
        );
      }
      target.default = num;
      break;

    case "boolean":
      if (value !== "true" && value !== "false") {
        // throw new EnvError(
        //   `[envx:error] Line ${
        //     lineNumber + 1
        //   }: Default value must be "true" or "false".`
        // );
        throw new EnvError(
          ERROR_MESSAGES.lib.parser.defaultMustBeBoolean(lineNumber)
        );
      }
      target.default = value === "true";
      break;

    case "enum":
      if (!values || !values.includes(value)) {
        // throw new EnvError(
        //   `[envx:error] Line ${
        //     lineNumber + 1
        //   }: Default "${value}" is not in enum values.`
        // );
        throw new EnvError(
          ERROR_MESSAGES.lib.parser.defaultNotInEnum(lineNumber, value)
        );
      }
      target.default = value;
      break;

    default:
      target.default = value;
  }
}

/**
 * Parses a single line representing an environment variable.
 *
 * Supports multiline strings that start with triple quotes (`"""`).
 *
 * @param {string} line - The line to parse.
 * @param {number} lineNumber - The line number for error messages.
 * @returns {{ key: string, value: string, isMultilineStart: boolean }} Parsed result.
 *
 * @throws {EnvError} If the line is invalid or missing a key.
 */
function parseEnvLine(
  line: string,
  lineNumber: number
): {
  key: string;
  value: string;
  isMultilineStart: boolean;
} {
  const [rawKey, rawValue] = splitKeyValue(line, lineNumber);
  const key = rawKey.trim();

  if (!key) {
    // throw new EnvError(
    //   `[envx:error] Line ${lineNumber + 1}: Variable name cannot be empty.`
    // );
    throw new EnvError(ERROR_MESSAGES.lib.parser.variableNameEmpty(lineNumber));
  }

  const trimmedValue = rawValue.trim();
  if (trimmedValue.startsWith('"""')) {
    return {
      key,
      value: trimmedValue.slice(3),
      isMultilineStart: true,
    };
  }

  return {
    key,
    value: stripQuotes(trimmedValue),
    isMultilineStart: false,
  };
}

function splitKeyValue(line: string, lineNumber: number): [string, string] {
  const eqIndex = line.indexOf("=");
  if (eqIndex === -1) {
    // throw new EnvError(
    //   `[envx:error] Line ${
    //     lineNumber + 1
    //   }: Missing "=" delimiter in assignment.`
    // );
    throw new EnvError(ERROR_MESSAGES.lib.parser.missingDelimiter(lineNumber));
  }
  return [line.slice(0, eqIndex), line.slice(eqIndex + 1)];
}

function stripQuotes(value: string): string {
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === `"` && last === `"`) || (first === `'` && last === `'`)) {
    return value.slice(1, -1);
  }
  return value;
}
