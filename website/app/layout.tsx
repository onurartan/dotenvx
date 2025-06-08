import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@trymagic/toast";
import { ThemeProvider } from "magic-toast";
import { WEBSITE_URL } from "@/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dotenvx – A Modern Environment File Format",
  description:
    ".envx is a new environment configuration format. Like .env, but with type safety, schema, and smart logic — all in one file.",
  keywords: [
    ".envx",
    "dotenvx",
    "Dotenvx",
    "dotenvxjs",
    "envx",
    ".env alternative",
    "modern env file",
    "environment file format",
    "typed env config",
    "nodejs env file",
    "schema-based env",
    "env validation",
    "dotenvx",
  ],
  metadataBase: new URL(WEBSITE_URL),
  openGraph: {
    title: ".envx – A Modern Environment File Format",
    description:
      "A new configuration file format to replace .env. Supports schema definitions, defaults, enums, conditional logic, and interpolation.",
    url: WEBSITE_URL,
    siteName: "dotenvx",
    images: [
      {
        url: `${WEBSITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: ".envx file format preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ".envx – A Modern .env Alternative",
    description:
      ".envx is a smarter, safer, and more expressive format for environment configs. It's like .env, but evolved.",
    images: [`${WEBSITE_URL}/twitter-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark" enableSystem attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
