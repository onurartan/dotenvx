"use client";
// import { Moon, Sun } from "lucide-react";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useTheme } from "magic-toast";
import { PROJECT_VERSION, SOCIAL_LINKS } from "@/config";
import Logo from "./Logo";

const Navbar = () => {
  //   const { theme, setTheme } = useTheme();
  //   const isDarkMode = theme == "dark";

  //   const toggleDarkMode = () => {
  //     setTheme(isDarkMode ? "light" : "dark");
  //   };
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
      <nav className="container flex h-16 items-center justify-between">
        <Link href={"/"}>
          <Logo badge={`v${PROJECT_VERSION}`} />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Documentation
          </Link>
          {/* <Link
            href="#examples"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Examples
          </Link> */}
          <a
            href={SOCIAL_LINKS.github_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            GitHub
          </a>
          {/* ----- will be added in the future because I like the dark mode structure ----- */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button> */}
        </nav>

        {/* <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div> */}
      </nav>
    </header>
  );
};

export default Navbar;
