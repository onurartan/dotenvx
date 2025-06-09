export const SCHEMA_KEYS = [
  { key: "type", description: "Value type (boolean, string, number, ...)" },
  { key: "required", description: "Is this value required? (true/false)" },
  { key: "default", description: "Default value if none provided" },
  { key: "deprecated", description: "Is this key deprecated? (true/false)" },
  { key: "description", description: "Human readable description" },
  {
    key: "values",
    description:
      'Allowed values array. Only valid if type="enum". Example: values=["prod","dev"]',
  },
];

export const TYPE_VALUES = ["boolean", "string", "number", "url", "email", "enum"];
export const BOOL_VALUES = ["true", "false"];
