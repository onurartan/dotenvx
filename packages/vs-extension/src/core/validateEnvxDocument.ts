import * as vscode from "vscode";
import { BOOL_VALUES, TYPE_VALUES } from "../constants";
import { diagnosticCollection } from "../config";

function createDiagnostic(
  document: vscode.TextDocument,
  line: number,
  message: string,
  severity: vscode.DiagnosticSeverity
) {
  const range = new vscode.Range(
    new vscode.Position(line, 0),
    new vscode.Position(line, document.lineAt(line).text.length)
  );
  return new vscode.Diagnostic(range, message, severity);
}

function validateSections(
  lines: string[],
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[],
  seenSchemaKeys: Map<string, number>
) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^\[(.+)\]$/);
    if (match) {
      const key = match[1];
      if (seenSchemaKeys.has(key)) {
        diagnostics.push(
          createDiagnostic(
            document,
            i,
            `Duplicate schema key "${key}" found. Only one definition allowed.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      } else {
        seenSchemaKeys.set(key, i);
      }
    }
  }
}

function validateRequiredKeysUsedOrDefault(
  lines: string[],
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[],
  sectionInfo: Map<
    string,
    {
      type?: string;
      valuesUsed: boolean;
      typeLines: number[];
      required?: boolean;
      defaultValuePresent?: boolean;
    }
  >
) {
  const assignedKeys = new Set<string>();
  const requiredNoDefaultKeys = new Set<string>();

  for (const [section, info] of sectionInfo.entries()) {
    if (info.required && !info.defaultValuePresent) {
      requiredNoDefaultKeys.add(section);
    }
  }

  lines.forEach((line) => {
    const assignMatch = line.match(/^(\w+)\s*=/);
    if (assignMatch) {
      assignedKeys.add(assignMatch[1]);
    }
  });

  for (const [section, info] of sectionInfo.entries()) {
    if (
      info.required &&
      !info.defaultValuePresent &&
      !assignedKeys.has(section)
    ) {
      const lineNumber = info.typeLines.length > 0 ? info.typeLines[0] : 0;
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(lineNumber, 0),
            new vscode.Position(
              lineNumber,
              document.lineAt(lineNumber).text.length
            )
          ),
          `Required key "${section}" has no default value and is not assigned in the file.`,
          vscode.DiagnosticSeverity.Error
        )
      );
    }
  }

  lines.forEach((line, idx) => {
    const refMatches = line.match(/\$\{(\w+)\}/g);
    if (!refMatches) {
      return;
    }

    for (const ref of refMatches) {
      const keyName = ref.slice(2, -1);
      if (requiredNoDefaultKeys.has(keyName) && !assignedKeys.has(keyName)) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              new vscode.Position(idx, line.indexOf(ref)),
              new vscode.Position(idx, line.indexOf(ref) + ref.length)
            ),
            `Reference to required key "${keyName}" without default value and no assignment detected. This may cause errors.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }
  });
}

function validateKeyValuePairs(
  lines: string[],
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[],
  sectionInfo: Map<
    string,
    {
      type?: string;
      valuesUsed: boolean;
      typeLines: number[];
      required?: boolean;
      defaultValuePresent?: boolean;
    }
  >,
  deprecatedMap: Map<string, number>,
  defaultSections: Set<string>
) {
  const supportedKeys = new Set([
    "type",
    "values",
    "required",
    "deprecated",
    "default",
    "description",
  ]);

  let currentSection = "";
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const sectionMatch = trimmed.match(/^\[(.+)\]$/);
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

    const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
    if (!kvMatch) {
      continue;
    }

    const key = kvMatch[1];
    let value = kvMatch[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // >_ UNSUPPORTED KEY CHECK ---____---- //
    if (!supportedKeys.has(key)) {
      diagnostics.push(
        createDiagnostic(
          document,
          i,
          `Unsupported key "${key}" found in section [${currentSection}]. Supported keys are: ${[
            ...supportedKeys,
          ].join(", ")}.`,
          vscode.DiagnosticSeverity.Error
        )
      );
      continue;
    }

    const info = sectionInfo.get(currentSection)!;

    switch (key) {
      case "type":
        if (info.type !== undefined) {
          diagnostics.push(
            createDiagnostic(
              document,
              i,
              `Duplicate "type" key in section [${currentSection}]. Only one "type" allowed per section.`,
              vscode.DiagnosticSeverity.Error
            )
          );
        }
        info.typeLines.push(i);
        const lowerValue = value.toLowerCase();
        if (!TYPE_VALUES.includes(lowerValue)) {
          diagnostics.push(
            createDiagnostic(
              document,
              i,
              `"type" value "${value}" is invalid. Allowed types: ${TYPE_VALUES.join(
                ", "
              )}.`,
              vscode.DiagnosticSeverity.Error
            )
          );
        } else {
          info.type = lowerValue;
        }
        break;

      case "values":
        info.valuesUsed = true;
        break;

      case "required":
      case "deprecated":
        if (!BOOL_VALUES.includes(value.toLowerCase())) {
          diagnostics.push(
            createDiagnostic(
              document,
              i,
              `"${key}" value "${value}" is invalid. Only "true" or "false" allowed.`,
              vscode.DiagnosticSeverity.Error
            )
          );
        }
        if (value.toLowerCase() === "true") {
          info.required = true;
        }
        if (key === "deprecated" && value.toLowerCase() === "true") {
          deprecatedMap.set(currentSection, i);
        }
        break;

      case "default":
        defaultSections.add(currentSection);
        info.defaultValuePresent = true;
        break;
    }
  }
}

function checkDeprecatedUsage(
  lines: string[],
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[],
  deprecatedMap: Map<string, number>,
  defaultSections: Set<string>
) {
  const usedKeys = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    if (/^\s*=\s*/.test(lines[i])) {
      diagnostics.push(
        createDiagnostic(
          document,
          i,
          `Invalid line: missing key before '='. Use KEY=value format.`,
          vscode.DiagnosticSeverity.Error
        )
      );
    }

    const match = trimmed.match(/^(\w+)\s*=/);
    if (!match) {
      continue;
    }

    const key = match[1];
    usedKeys.add(key);

    if (deprecatedMap.has(key)) {
      diagnostics.push(
        createDiagnostic(
          document,
          i,
          `The key "${key}" is deprecated and should be avoided.`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  for (const [key, lineIndex] of deprecatedMap.entries()) {
    if (!usedKeys.has(key) && !defaultSections.has(key)) {
      diagnostics.push(
        createDiagnostic(
          document,
          lineIndex,
          `Section [${key}] is deprecated but never used.`,
          vscode.DiagnosticSeverity.Information
        )
      );
    }
  }
}

function checkEnumValuesCompatibility(
  lines: string[],
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[],
  sectionInfo: Map<string, { type?: string; valuesUsed: boolean }>
) {
  for (const [section, info] of sectionInfo.entries()) {
    if (info.valuesUsed && info.type !== "enum") {
      const sectionLine = lines.findIndex(
        (line) => line.trim() === `[${section}]`
      );
      if (sectionLine >= 0) {
        diagnostics.push(
          createDiagnostic(
            document,
            sectionLine,
            `Section [${section}] has "values" defined but type is not "enum". "values" only valid if type="enum".`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }
  }
}

export function validateEnvxDocument(document: vscode.TextDocument) {
  if (document.languageId !== "envx") {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  const deprecatedMap = new Map<string, number>();
  const defaultSections = new Set<string>();
  const sectionInfo = new Map<
    string,
    {
      type?: string;
      valuesUsed: boolean;
      typeLines: number[];
      required?: boolean;
      defaultValuePresent?: boolean;
    }
  >();
  const seenSchemaKeys = new Map<string, number>();

  validateSections(lines, document, diagnostics, seenSchemaKeys);
  validateKeyValuePairs(
    lines,
    document,
    diagnostics,
    sectionInfo,
    deprecatedMap,
    defaultSections
  );
  checkDeprecatedUsage(
    lines,
    document,
    diagnostics,
    deprecatedMap,
    defaultSections
  );
  checkEnumValuesCompatibility(lines, document, diagnostics, sectionInfo);
  validateRequiredKeysUsedOrDefault(lines, document, diagnostics, sectionInfo);

  diagnosticCollection.set(document.uri, diagnostics);
}
