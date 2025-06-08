export type EnvType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "email"
  | "url";

export interface EnvVarSchema {
  type: EnvType;
  required?: boolean;
  default?: string | number | boolean;
  values?: Array<string>;
  deprecated?: boolean;
  description?: string;
}

export type EnvSchema = Record<string, EnvVarSchema>;

export type EnvResult = Record<string, string | number | boolean>;

export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvError";
  }
}
