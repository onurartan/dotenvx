"use client";

import { Copy, Check, ArrowRight, Download, Star, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClipboard from "@/hooks/useClipboard";
import { PACKAGE_NAME } from "@/config";

// after beta
// const stats = [
//   {
//     icon: <Download className="w-5 h-5" />,
//     label: "Downloads",
//     value: "50K+",
//   },
//   {
//     icon: <Star className="w-5 h-5" />,
//     label: "GitHub Stars",
//     value: "2.1K",
//   },
//   { icon: <Users className="w-5 h-5" />, label: "Developers", value: "5K+" },
// ];

const installCommands = {
  npm: `npm install ${PACKAGE_NAME}`,
  pnpm: `pnpm add ${PACKAGE_NAME}`,
  yarn: `yarn add ${PACKAGE_NAME}`,
};

const HeroSection = () => {
  const { isCopied, copy } = useClipboard();
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 flex flex-col items-center justify-center px-3">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%239C92AC fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      <div className="container relative ">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-6 bg-background/50 backdrop-blur"
          >
            🚀 The .envx File Format & dotenvx Library
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            {/* <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-primary bg-clip-text text-transparent">
              Dotenvx
            </span> */}
            <span>Dotenvx</span>
          </h1>

          <p className="text-lg leading-8 text-muted-foreground sm:text-xl max-w-3xl mx-auto mb-4">
            <strong>dotenvx</strong> is a modern, type-safe alternative to .env
            files — with validation, smart interpolation, enums, defaults, CLI
            support, and VSCode integration. Configuration and schema live
            together in a single <strong>.envx</strong> file.
          </p>
          <div className="mt-8 flex flex-col  gap-4 justify-center items-center">
            <Tabs defaultValue="npm" className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur">
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
                {/* <TabsTrigger disabled value="python">
                  python (soon)
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="npm" className="mt-4">
                <div className="flex items-center gap-2 rounded-lg border bg-background/50 backdrop-blur p-3 shadow-lg">
                  <code className="flex-1 text-sm font-mono">
                    {installCommands.npm}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(installCommands.npm, "npm")}
                  >
                    {isCopied === "npm" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="pnpm" className="mt-4">
                <div className="flex items-center gap-2 rounded-lg border bg-background/50 backdrop-blur p-3 shadow-lg">
                  <code className="flex-1 text-sm font-mono">
                    {installCommands.pnpm}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(installCommands.pnpm, "pnpm")}
                  >
                    {isCopied === "pnpm" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="yarn" className="mt-4">
                <div className="flex items-center gap-2 rounded-lg border bg-background/50 backdrop-blur p-3 shadow-lg">
                  <code className="flex-1 text-sm font-mono">
                    {installCommands.yarn}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(installCommands.yarn, "yarn")}
                  >
                    {isCopied === "yarn" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* <Button
              asChild
              size="lg"
              className="bg-gradient-to-r w-1/2 from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
            >
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r w-1/2 from-primary bg-white shadow-lg"
            >
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats - after beta */}
          {/* <div className="mt-12 flex justify-center gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="p-1 rounded-full bg-primary/10">
                  {stat.icon}
                </div>
                <span className="font-medium text-foreground">
                  {stat.value}
                </span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
