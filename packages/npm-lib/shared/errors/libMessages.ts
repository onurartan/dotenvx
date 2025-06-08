export const LIB_ERROR_MESSAGES = {
  // --- [lib] index.ts error messages --- //
  fileDoesNotExist: (path: string) => {
    return `[envx:error] The specified file does not exist: ${path}`;
  },

  unsupportedType: (lineNumber: number, type: string) =>
    `[envx:error] Line ${lineNumber + 1}: Unsupported type "${type}".`,

  // --- [lib] validator.ts error messages --- //
  validator: {
    invalidNumber: (key: string, value: string) =>
      `Invalid value for "${key}": expected a number but received "${value}".`,
    invalidBoolean: (key: string, value: string) =>
      `Invalid boolean for "${key}": expected "true" or "false" but received "${value}".`,
    missingEnumValues: (key: string) =>
      `Enum values are not defined for "${key}". Please specify allowed values.`,
    invalidEnum: (key: string, value: string, allowed: string[]) =>
      `Invalid enum value for "${key}": expected one of [${allowed.join(
        ", "
      )}] but received "${value}".`,
    invalidEmail: (key: string, value: string) =>
      `Invalid email format for "${key}": received "${value}". Please provide a valid email address.`,
    invalidUrl: (key: string, value: string) =>
      `Invalid URL format for "${key}": received "${value}". Please provide a valid URL.`,
    unsupportedType: (key: string, type: string) =>
      `Unsupported type "${type}" specified for "${key}".`,
    requiredMissing: (key: string) =>
      `Required environment variable "${key}" is missing and has no default value.`,
  },

  // --- [lib] resolver.ts error messages --- //
  resolver: {
    circularDependency: (key: string) =>
      `[envx:error] Circular dependency detected while resolving "${key}".\n→ Check for variables referencing each other in a loop.`,
    interpolationFailed: (key: string) =>
      `[envx:error] Failed to resolve variable "${key}". No value found for interpolation.`,
    requiredMissingInResolve: (key: string) =>
      `[envx:error] Environment variable "${key}" is not set and no default is defined.\n→ Define "${key}" in your .envx file or provide a default value in the schema.`,
  },

  // --- [lib] parser.ts error messages --- //
  parser: {
    schemaBlockEmpty: (lineNumber: number) =>
      `[envx:error] Line ${lineNumber + 1}: Schema block name cannot be empty.`,

    schemaKeyDuplicate: (lineNumber: number, key: string) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: Schema key "${key}" is already defined. Duplicate schema definitions are not allowed.`,

    typeAlreadyDefined: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: "type" is already defined for this variable. You cannot redefine it.`,

    unknownSchemaProperty: (lineNumber: number, key: string) =>
      `[envx:error] Line ${lineNumber + 1}: Unknown schema property "${key}".`,

    missingDelimiter: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: Missing "=" delimiter in assignment.`,

    variableNameEmpty: (lineNumber: number) =>
      `[envx:error] Line ${lineNumber + 1}: Variable name cannot be empty.`,

    typeRequiredBeforeDefault: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: "type" must be defined before "default".`,

    defaultMustBeNumber: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: Default value must be a valid number.`,

    defaultMustBeBoolean: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: Default value must be "true" or "false".`,

    defaultNotInEnum: (lineNumber: number, value: string) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: Default "${value}" is not in enum values.`,

    invalidValuesJson: (lineNumber: number) =>
      `[envx:error] Line ${
        lineNumber + 1
      }: "values" must be a valid JSON string array.`,
  },
};
