import { ERROR_MESSAGES } from "../../shared/errors";
import { EnvError, EnvSchema } from "../types";
import { toBoolean } from "../utils";

type EnvMap = Record<string, any>;

export function resolveEnvx(
  entries: { key: string; value: any }[],
  schema?: EnvSchema
): EnvMap {
  const rawEnv: EnvMap = {};
  const resolvedEnv: EnvMap = {};

  for (const entry of entries) {
    rawEnv[entry.key] = entry.value;
  }

  if (schema) {
    for (const key in schema) {
      if (rawEnv[key] === undefined && schema[key].default !== undefined) {
        rawEnv[key] = schema[key].default;
      }
    }
  }

  const resolving = new Set<string>();

  for (const key of Object.keys(rawEnv)) {
    resolvedEnv[key] = resolveValue(
      rawEnv[key],
      rawEnv,
      resolvedEnv,
      resolving,
      key
    );
  }

  if (schema) {
    for (const key in schema) {
      if (schema[key].required && rawEnv[key] === undefined) {
        // throw new Error(
        //   `[envx:error] Environment variable "${key}" is not set and no default is defined.\n` +
        //     `→ Define "${key}" in your .envx file or provide a default value in the schema.`
        // );

        throw new EnvError(
          ERROR_MESSAGES.lib.resolver.requiredMissingInResolve(key)
        );
      }
    }
  }

  return resolvedEnv;
}

function resolveValue(
  rawValue: any,
  rawEnv: EnvMap,
  resolvedEnv: EnvMap,
  resolving: Set<string>,
  currentKey: string
): any {
  if (typeof rawValue !== "string") return rawValue;

  if (resolving.has(currentKey)) {
    // throw new Error(
    //   `[envx:error] Circular dependency detected while resolving "${currentKey}".\n` +
    //     `→ Check for variables referencing each other in a loop.`
    // );
    throw new EnvError(
      ERROR_MESSAGES.lib.resolver.circularDependency(currentKey)
    );
  }

  resolving.add(currentKey);

  if (isTernary(rawValue)) {
    rawValue = resolveTernary(rawValue, rawEnv, resolvedEnv, resolving);
  }

  if (hasInterpolation(rawValue)) {
    rawValue = resolveInterpolation(rawValue, rawEnv, resolvedEnv, resolving);
  }

  resolving.delete(currentKey);

  return rawValue;
}

function hasInterpolation(str: string): boolean {
  return typeof str === "string" && str.includes("${");
}

function resolveInterpolation(
  str: string,
  rawEnv: EnvMap,
  resolvedEnv: EnvMap,
  resolving: Set<string>
): string {
  return str.replace(/\${([^}]+)}/g, (_, varName) => {
    const name = varName.trim();

    if (resolvedEnv[name] !== undefined) return String(resolvedEnv[name]);
    if (rawEnv[name] !== undefined)
      return String(
        resolveValue(rawEnv[name], rawEnv, resolvedEnv, resolving, name)
      );

    // throw new Error(
    //   `[envx:error] Failed to resolve variable "${name}". No value found for interpolation.`
    // );

    throw new EnvError(ERROR_MESSAGES.lib.resolver.interpolationFailed(name));
  });
}

function isTernary(str: string): boolean {
  return /^\s*\${[^}]+}(?:\s*(==|!=)\s*"[^"]*")?\s*\?\s*"[^"]*"\s*:\s*"[^"]*"\s*$/.test(
    str.trim()
  );
}

function resolveTernary(
  str: string,
  rawEnv: EnvMap,
  resolvedEnv: EnvMap,
  resolving: Set<string>
): string {
  const cleaned = str.trim();

  const match = cleaned.match(
    /^\s*\${([^}]+)}(?:\s*(==|!=)\s*"([^"]*)")?\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"\s*$/
  );

  if (!match) return str;

  const [, varName, operator, compareValue, trueVal, falseVal] = match;
  const name = varName.trim();

  const actualValue =
    resolvedEnv[name] !== undefined
      ? resolvedEnv[name]
      : resolveValue(rawEnv[name], rawEnv, resolvedEnv, resolving, name);

  let condition: boolean;

  if (operator === "==" || operator === "!=") {
    const cmp = String(actualValue) === compareValue;
    condition = operator === "==" ? cmp : !cmp;
  } else {
    condition = toBoolean(actualValue);
  }

  return condition ? trueVal : falseVal;
}
