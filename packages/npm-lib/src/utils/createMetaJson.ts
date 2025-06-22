import { EnvSchema } from "../types";

export function createMetaJson(schema: EnvSchema): string {
  const meta: Record<string, any> = {};

  for (const key in schema) {
    meta[key] = {
      type: schema[key].type || "string",
      required: schema[key].required || false,
      description: schema[key].description || undefined,
      values: schema[key].values || undefined,
      default: schema[key].default || undefined,
    };
    // Optional olarak undefined olan keyleri temizleyebilirsin
    for (const prop in meta[key]) {
      if (meta[key][prop] === undefined) {
        delete meta[key][prop];
      }
    }
  }

  return JSON.stringify(meta, null, 2);
}
