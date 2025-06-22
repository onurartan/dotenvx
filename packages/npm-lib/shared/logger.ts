import { green, red, blue, bold, yellow } from "colorette";

type LogLevel = "log" | "info" | "success" | "error" | "warn" | "debug";

interface LoggerOptions {
  silent?: boolean;
}

class Logger {
  private silent: boolean;

  constructor(options?: LoggerOptions) {
    this.silent = options?.silent ?? false;
  }

  private prefix(level: LogLevel) {
    switch (level) {
      //   case "log":
      //     return "";
      case "info":
        return blue("[envx:info] ℹ️ ");
      case "success":
        return green(bold("[envx:success] ✔ "));
      case "error":
        return red(bold("[envx:error] ❌ "));
      case "warn":
        return yellow(bold("[envx:warn] ⚠️ "));
      case "debug":
        return blue(bold("[envx:debug] 🐞 "));
      default:
        return "[envx]";
    }
  }

  log(message: string) {
    if (!this.silent) console.log(`${message}`);
  }

  info(message: string) {
    if (!this.silent) console.log(`${this.prefix("info")} ${message}`);
  }

  success(message: string) {
    if (!this.silent) console.log(`${this.prefix("success")} ${message}`);
  }

  error(message: string | Error) {
    if (!this.silent) {
      const msg = typeof message === "string" ? message : message.message;
      console.error(`${this.prefix("error")} ${msg}`);
    }
  }

  warn(message: string) {
    if (!this.silent) console.warn(`${this.prefix("warn")} ${message}`);
  }

  debug(message: string) {
    if (!this.silent) console.debug(`${this.prefix("debug")} ${message}`);
  }
}

export const logger = new Logger({ silent: false });
