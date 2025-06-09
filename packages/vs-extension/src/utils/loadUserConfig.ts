import path from "path";
import { pathToFileURL } from "url";
import { existsSync } from "fs";
import * as vscode from "vscode";

export async function loadUserConfig(
  fileName: string,
  defaultEnvFilePath: string = ".env",
  defaultTypeFilePath: string = "./types/envx.ts"
) {
  const defaultValue = {
    input: fileName,
    output: {
      env: defaultEnvFilePath,
      types: defaultTypeFilePath,
    },
  };
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders?.length === 0) {
    return defaultValue;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  const configFile = "envx.config.js";
  const configPath = path.resolve(rootPath, configFile);
  if (existsSync(configPath)) {
    const configUrl = pathToFileURL(configPath).href;
    const config = await import(configUrl);
    return config.default || config;
  }
  return defaultValue;
}
