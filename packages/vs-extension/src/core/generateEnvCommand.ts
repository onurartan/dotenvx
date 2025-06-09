import * as vscode from "vscode";
import { loadUserConfig } from "../utils/loadUserConfig";

export const generateEnvCommand = () => {
  return vscode.commands.registerCommand("dotenvx.generateEnv", async () => {
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
        title: "Generating .env from .envx...",
        cancellable: false,
      },
      async () => {
        try {
          const defaultEnvFilePath = ".env";
          const config = await loadUserConfig(fileName, defaultEnvFilePath);

          const input = config?.input || fileName;
          const output = config?.output?.env || defaultEnvFilePath;

          const terminal = vscode.window.createTerminal("Dotenvx");
          terminal.show();
          terminal.sendText(
            `npx dotenvxjs build --input "${input}" --output "${output}"`
          );

          vscode.window.showInformationMessage(
            `✅ .env file successfully generated at: ${output}`
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            `❌ Failed to generate .env file. Please check your envx.config.js or terminal output.`
          );
        }
      }
    );
  });
};
