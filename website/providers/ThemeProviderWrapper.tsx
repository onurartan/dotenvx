"use client";
import { ThemeProvider } from "magic-toast";

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="dark" enableSystem attribute="class">{children}</ThemeProvider>;
}
