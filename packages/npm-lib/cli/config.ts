import path from "path";
import { pathToFileURL } from "url";
import { existsSync } from "fs";

export async function loadUserConfig() {
  const file = "envx.config.js";
  const fullPath = path.resolve(process.cwd(), file);
  if (existsSync(fullPath)) {
    const url = pathToFileURL(fullPath).href;
    const config = await import(url);
    return config.default || config;
  }
  return {};
}
