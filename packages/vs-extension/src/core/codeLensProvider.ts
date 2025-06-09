import * as vscode from "vscode";

export class EnvxCodeLensProvider implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void> | undefined;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const isEnvxLike = /(^|\.)(envx)(\..+)?$/.test(document.fileName);
    if (!isEnvxLike) {
      return [];
    }

    const topOfFile = new vscode.Range(0, 0, 0, 0);

    return [
      new vscode.CodeLens(topOfFile, {
        title: "▶ Generate .env file",
        command: "dotenvx.generateEnv",
        tooltip: "Run dotenvx build to generate .env from this file",
      }),
    ];
  }
}
