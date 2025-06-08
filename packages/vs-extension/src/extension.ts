import * as vscode from "vscode";
import { registerFormatter } from "./formatter";

const SCHEMA_KEYS = [
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

const TYPE_VALUES = ["boolean", "string", "number", "url", "email", "enum"];
const BOOL_VALUES = ["true", "false"];

const diagnosticCollection = vscode.languages.createDiagnosticCollection(
  "envxDeprecated"
);

function registerValidation(context: vscode.ExtensionContext) {
  context.subscriptions.push(diagnosticCollection);

  vscode.workspace.onDidOpenTextDocument(validateEnvxDocument);
  vscode.workspace.onDidChangeTextDocument((e) =>
    validateEnvxDocument(e.document)
  );
  vscode.workspace.textDocuments.forEach(validateEnvxDocument);
}

function createBoolValueItems(label: string): vscode.CompletionItem[] {
  return BOOL_VALUES.map((b) => {
    const item = new vscode.CompletionItem(b, vscode.CompletionItemKind.Value);
    item.insertText = b;
    item.documentation = new vscode.MarkdownString(`${label}: ${b}`);
    return item;
  });
}

// ------ key suggesstion ------ //
function createKeyPrefixProvider() {
  return vscode.languages.registerCompletionItemProvider(
    "envx",
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position);
        const textBeforeCursor = line.text.substring(0, position.character);
        const match = textBeforeCursor.match(/(\w*)$/);
        if (!match) {
          return undefined;
        }
        const prefix = match[1].toLowerCase();
        if (prefix.length === 0) {
          return undefined;
        }

        return SCHEMA_KEYS.filter((k) => k.key.startsWith(prefix)).map((k) => {
          const item = new vscode.CompletionItem(
            k.key,
            vscode.CompletionItemKind.Property
          );
          if (k.key === "description") {
            item.insertText = new vscode.SnippetString(
              'description="""\n\t$1\n"""'
            );
            item.documentation = new vscode.MarkdownString(
              'Multi-line description. Use """ to start and end.'
            );
          } else {
            if (k.key === "values") {
              item.insertText = new vscode.SnippetString('values=["$1"]');
              item.documentation = new vscode.MarkdownString(
                'Array of allowed values. Only valid if type="enum".'
              );
            } else {
              item.insertText = new vscode.SnippetString(`${k.key}=$1`);
              item.documentation = new vscode.MarkdownString(k.description);
            }
          }
          return item;
        });
      },
    },
    ..."abcdefghijklmnopqrstuvwxyz".split("")
  );
}

// ------ value suggesstion ------ //
function createValueProvider() {
  return vscode.languages.registerCompletionItemProvider(
    "envx",
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position);
        const textBeforeCursor = line.text.substring(0, position.character);

        if (/type\s*=\s*"?[\w]*$/.test(textBeforeCursor)) {
          const insertWithQuotes = !/type\s*=\s*"/.test(textBeforeCursor);

          return TYPE_VALUES.map((t) => {
            const item = new vscode.CompletionItem(
              t,
              vscode.CompletionItemKind.Value
            );
            item.insertText = insertWithQuotes ? `"${t}"` : t;
            item.documentation = new vscode.MarkdownString(`Type: ${t}`);
            return item;
          });
        }

        if (/required\s*=\s*[\w]*$/.test(textBeforeCursor)) {
          return createBoolValueItems("Boolean value");
        }

        if (/deprecated\s*=\s*[\w]*$/.test(textBeforeCursor)) {
          return createBoolValueItems("Boolean value");
        }

        return undefined;
      },
    },
    '"',
    "="
  );
}

// ------ [KEY] new schema suggesstion ------ //
function createSectionProvider() {
  return vscode.languages.registerCompletionItemProvider(
    "envx",
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position);
        const textBeforeCursor = line.text
          .substring(0, position.character)
          .trim();

        if (/^values$/.test(textBeforeCursor)) {
          const item = new vscode.CompletionItem(
            "values",
            vscode.CompletionItemKind.Property
          );
          item.insertText = new vscode.SnippetString('values=["$1"]');
          item.documentation = new vscode.MarkdownString(
            'Array of allowed values. Only for type="enum".'
          );
          return [item];
        }

        if (textBeforeCursor === "") {
          const prevLineNum = position.line - 1;
          if (prevLineNum >= 0) {
            const prevLineText = document.lineAt(prevLineNum).text.trim();
            if (/^\[.*\]$/.test(prevLineText)) {
              return SCHEMA_KEYS.map((k) => {
                const item = new vscode.CompletionItem(
                  k.key,
                  vscode.CompletionItemKind.Property
                );
                item.insertText = new vscode.SnippetString(`${k.key}=$1`);
                item.documentation = new vscode.MarkdownString(k.description);
                return item;
              });
            }
          }
        }

        return undefined;
      },
    },
    "\n"
  );
}

// ------ creates vscode docs to make a key more readable and meaningful than the description in its schema ------ //
function createHoverProvider() {
  return vscode.languages.registerHoverProvider("envx", {
    provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position, /[\w]+/);
      if (!wordRange) {
        return;
      }

      const hoveredKey = document.getText(wordRange);

      const text = document.getText();
      const lines = text.split(/\r?\n/);

      const schemaDescriptions = new Map<string, string>();

      let currentSection = "";
      let inDescription = false;
      let descriptionLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        const sectionMatch = line.match(/^\[(.+)]$/);
        if (sectionMatch) {
          if (currentSection && descriptionLines.length > 0) {
            schemaDescriptions.set(currentSection, descriptionLines.join("\n"));
          }
          currentSection = sectionMatch[1];
          descriptionLines = [];
          inDescription = false;
          continue;
        }

        if (currentSection) {
          if (line.startsWith('description="""')) {
            inDescription = true;
            descriptionLines.push(line.replace('description="""', "").trim());
            continue;
          }
          if (inDescription) {
            if (line.endsWith('"""')) {
              inDescription = false;
              descriptionLines.push(line.replace('"""', "").trim());
              continue;
            }
            descriptionLines.push(line);
          } else {
            const descMatch = line.match(/^description\s*=\s*"?(.+?)"?$/);
            if (descMatch) {
              schemaDescriptions.set(currentSection, descMatch[1]);
            }
          }
        }
      }
      if (currentSection && descriptionLines.length > 0) {
        schemaDescriptions.set(currentSection, descriptionLines.join("\n"));
      }

      if (schemaDescriptions.has(hoveredKey)) {
        const desc = schemaDescriptions.get(hoveredKey)!;
        return new vscode.Hover(
          new vscode.MarkdownString(`**Description:**\n\n${desc}`)
        );
      }

      return undefined;
    },
  });
}

function validateEnvxDocument(document: vscode.TextDocument) {
  if (document.languageId !== "envx") {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  let currentSection = "";
  const deprecatedMap = new Map<string, number>(); // section name -> line index
  const defaultSections = new Set<string>();
  const usedKeys = new Set<string>();

  // Section info map: section -> { type?: string; valuesUsed: boolean; typeLines: number[] }
  const sectionInfo = new Map<
    string,
    { type?: string; valuesUsed: boolean; typeLines: number[] }
  >();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const sectionMatch = trimmed.match(/^\[(.+)]$/);

    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (!sectionInfo.has(currentSection)) {
        sectionInfo.set(currentSection, { valuesUsed: false, typeLines: [] });
      }
      continue;
    }

    if (!currentSection) {
      continue;
    }

    // Parse key=value
    const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
    if (!kvMatch) {
      continue;
    }

    const key = kvMatch[1];
    let value = kvMatch[2].trim();

    // Remove quotes if any
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    const info = sectionInfo.get(currentSection)!;

    if (key === "type") {
      // Check if 'type' already defined in this section
      if (info.type !== undefined) {
        // Multiple 'type' keys in same section -> error
        const range = new vscode.Range(
          new vscode.Position(i, 0),
          new vscode.Position(i, lines[i].length)
        );
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `Duplicate "type" key in section [${currentSection}]. Only one "type" allowed per section.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }

      info.typeLines.push(i);

      const lowerValue = value.toLowerCase();

      // Check if type value is allowed
      if (!TYPE_VALUES.includes(lowerValue)) {
        const range = new vscode.Range(
          new vscode.Position(i, 0),
          new vscode.Position(i, lines[i].length)
        );
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `"type" value "${value}" is invalid. Allowed types are: ${TYPE_VALUES.join(
              ", "
            )}.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      } else {
        info.type = lowerValue;
      }
    }

    if (key === "values") {
      info.valuesUsed = true;
    }

    if (/^deprecated\s*=\s*true$/i.test(trimmed)) {
      deprecatedMap.set(currentSection, i);
    }

    if (/^default\s*=/.test(trimmed)) {
      defaultSections.add(currentSection);
    }

    // Boolean key validation for 'required' and 'deprecated'
    if (key === "required" || key === "deprecated") {
      const boolVal = value.toLowerCase();
      if (!BOOL_VALUES.includes(boolVal)) {
        const range = new vscode.Range(
          new vscode.Position(i, 0),
          new vscode.Position(i, lines[i].length)
        );
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `"${key}" value "${value}" is invalid. Only "true" or "false" are allowed.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^(\w+)\s*=/);
    if (!match) {
      continue;
    }

    const usedKey = match[1];
    usedKeys.add(usedKey);

    if (deprecatedMap.has(usedKey)) {
      const range = new vscode.Range(
        new vscode.Position(i, 0),
        new vscode.Position(i, lines[i].length)
      );
      const message = `The key "${usedKey}" is deprecated and should be avoided.`;
      diagnostics.push(
        new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning)
      );
    }
  }

  for (const [key, lineIndex] of deprecatedMap.entries()) {
    if (!usedKeys.has(key) && !defaultSections.has(key)) {
      const range = new vscode.Range(
        new vscode.Position(lineIndex, 0),
        new vscode.Position(lineIndex, lines[lineIndex].length)
      );
      const message = `Section [${key}] is deprecated but never used.`;
      diagnostics.push(
        new vscode.Diagnostic(
          range,
          message,
          vscode.DiagnosticSeverity.Information
        )
      );
    }
  }

  // --- values and enum incompatibility check--- //
  for (const [section, info] of sectionInfo.entries()) {
    if (info.valuesUsed && info.type !== "enum") {
      const sectionLine = lines.findIndex(
        (line) => line.trim() === `[${section}]`
      );
      if (sectionLine >= 0) {
        const range = new vscode.Range(
          new vscode.Position(sectionLine, 0),
          new vscode.Position(sectionLine, lines[sectionLine].length)
        );
        const message = `Section [${section}] has "values" defined but its type is not "enum". "values" only valid if type="enum".`;
        diagnostics.push(
          new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error)
        );
      }
    }
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  registerValidation(context);
  registerFormatter(context);

  context.subscriptions.push(
    createSectionProvider(),
    createValueProvider(),
    createKeyPrefixProvider(),
    createHoverProvider()
  );
}
