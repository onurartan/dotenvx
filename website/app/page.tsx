"use client";

import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useTheme } from "magic-toast";
import CodePreview from "@/components/home/CodePreview";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import Comparison from "@/components/home/Comparison";
import Footer from "@/components/Footer";
import { SOCIAL_LINKS } from "@/config";

export default function Home() {
  const { theme } = useTheme();
  const isDarkMode = theme == "dark";

  return (
    <div className={`min-h-screen dark:dark`}>
      <div className="bg-background text-foreground mx-auto">
        <Navbar />
        <HeroSection />
        <CodePreview />
        <Features />
        <Comparison />

        <section className="py-24 px-3 center">
          <div className="container">
            <Card className="mx-auto max-w-4xl border-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Ready to Upgrade Your Environment Config?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join developers who have already switched to dotenvx for
                  better type safety, validation, and developer experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
                  >
                    <Link href="/docs">
                      Read Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="shadow-lg"
                  >
                    <a
                      href={SOCIAL_LINKS.github_repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
