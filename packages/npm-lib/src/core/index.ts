import { parseEnvx } from "./parser";
import { validateEnv } from "./validator";
import { EnvSchema, EnvResult } from "../types";
import { resolveEnvx } from "./resolver";
import { completeSchemaFromEnvx } from "../utils";

export function loadEnvxFromString(
  content: string,
  schema?: EnvSchema
): { result: EnvResult; schema?: EnvSchema } {
  const { env, schema: parsedSchema } = parseEnvx(content);

  const fullSchema = completeSchemaFromEnvx(env, parsedSchema);

  const effectiveSchema: EnvSchema | undefined = schema
    ? { ...fullSchema, ...schema }
    : Object.keys(fullSchema).length > 0
    ? fullSchema
    : undefined;

  const resolved = resolveEnvx(env, effectiveSchema);

  if (effectiveSchema) {
    const validatedEnvs = validateEnv(
      Object.entries(resolved).map(([key, value]) => ({ key, value })),
      effectiveSchema
    );
    return { result: validatedEnvs, schema: effectiveSchema };
  }

  return { result: resolved, schema: effectiveSchema };
}
