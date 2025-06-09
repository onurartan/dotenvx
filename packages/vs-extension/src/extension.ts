import * as vscode from "vscode";
import { registerFormatter } from "./formatter";
import { generateEnvCommand } from "./core/generateEnvCommand";
import { EnvxCodeLensProvider } from "./core/codeLensProvider";
import { BOOL_VALUES, SCHEMA_KEYS, TYPE_VALUES } from "./constants";
import { diagnosticCollection } from "./config";
import { validateEnvxDocument } from "./core/validateEnvxDocument";
import { generateTypesCommand } from "./core/generateTypesCommand";

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

export function activate(context: vscode.ExtensionContext) {
  registerValidation(context);
  registerFormatter(context);

  context.subscriptions.push(
    generateEnvCommand(),
    generateTypesCommand(),
    createSectionProvider(),
    createValueProvider(),
    createKeyPrefixProvider(),
    createHoverProvider()
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "envx" },
      new EnvxCodeLensProvider()
    )
  );
}
