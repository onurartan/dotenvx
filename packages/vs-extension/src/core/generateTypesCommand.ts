import * as vscode from "vscode";
import { loadUserConfig } from "../utils/loadUserConfig";

export const generateTypesCommand = () => {
  return vscode.commands.registerCommand("dotenvx.generateTypes", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    const fileName = editor.document.fileName;
    const isEnvxLike = /(^|\.)(envx)(\..+)?$/.test(fileName);
    if (!isEnvxLike) {
      vscode.window.showErrorMessage(
        "⚠️ This command only works with .envx files."
      );
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Generating types from .envx...",
        cancellable: false,
      },
      async () => {
        try {
          const defaultEnvFilePath = ".env";
          const defaultTypeFilePath = "./types/envx.ts";

          const config = await loadUserConfig(
            fileName,
            defaultEnvFilePath,
            defaultTypeFilePath
          );

          const input = config?.input || fileName;
          const type_output = config?.output?.types || defaultTypeFilePath;

          const terminal = vscode.window.createTerminal("Dotenvx");
          terminal.show();
          terminal.sendText(
            `npx dotenvxjs types --input "${input}" --output "${type_output}"`
          );

          vscode.window.showInformationMessage(
            `✅ Type file successfully generated at: ${type_output}`
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            `❌ Failed to generate types. Check your configuration or terminal output.`
          );
        }
      }
    );
  });
};
