import { EnvSchema, EnvType } from "./types";

export const allowedSchemaTypes: Array<EnvType> = [
  "string",
  "number",
  "boolean",
  "enum",
  "email",
  "url",
];

export const BUILTIN_SCHEMA: EnvSchema = {
  // NODE_ENV: {
  //   type: "enum",
  //   values: ["development", "production", "test"],
  //   default: "development",
  //   required: true,
  //   description: "Specifies the Node.js environment",
  // },
  // TZ: {
  //   type: "string",
  //   default: "UTC",
  //   required: false,
  //   description: "Timezone for Node.js process (default is UTC)",
  // },
};
