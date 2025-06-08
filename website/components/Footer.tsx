import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import { SOCIAL_LINKS } from "@/config";

const Footer = () => {
  const currentYear = new Date().getFullYear().toString();
  return (
    <footer className="border-t bg-gradient-to-br from-muted/30 to-muted/10 center">
      <div className="container py-12">
        <div className="flex flex-col gap-6 md:flex-row justify-between items-center">
          <Logo />

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <a
              href={SOCIAL_LINKS.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span>MIT License © {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
