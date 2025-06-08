import * as vscode from "vscode";

function createFormatter(): vscode.DocumentFormattingEditProvider {
  return {
    provideDocumentFormattingEdits(
      document: vscode.TextDocument
    ): vscode.TextEdit[] {
      const text = document.getText();
      const lines = text.split(/\r?\n/);

      const formattedLines: string[] = [];
      let inMultilineDescription = false;

      for (let line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('description="""')) {
          inMultilineDescription = true;
          formattedLines.push(trimmed);
          continue;
        }

        if (inMultilineDescription) {
          formattedLines.push(line);
          if (trimmed.endsWith('"""')) {
            inMultilineDescription = false;
          }
          continue;
        }

        const kvMatch = line.match(/^\s*(\w+)\s*=(.*)$/);
        if (kvMatch) {
          const key = kvMatch[1];
          const value = kvMatch[2].trimEnd();
          formattedLines.push(`${key}=${value}`);
        } else {
          formattedLines.push(line);
        }
      }

      const fullRange = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(document.lineCount, 0)
      );

      return [vscode.TextEdit.replace(fullRange, formattedLines.join("\n"))];
    },
  };
}

export function registerFormatter(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      "envx",
      createFormatter()
    )
  );
}
