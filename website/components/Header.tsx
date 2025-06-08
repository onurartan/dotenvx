"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import type { Section } from "@/types/docs";
import Logo from "./Logo";

interface HeaderProps {
  // darkMode: boolean;
  // onToggleDarkMode: () => void;
  sections: Section[];
  activeSection: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSectionClick: (id: string) => void;
}

export function Header({
  // darkMode,
  // onToggleDarkMode,
  sections,
  activeSection,
  searchQuery,
  onSearchChange,
  onSectionClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 center px-2">
      <div className="container flex h-16 items-center justify-between">
        <Link href={"/"} className="flex items-center gap-6">
          <Logo badge="Documentation" />
        </Link>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button> */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-3">
              <Sidebar
                sections={sections}
                activeSection={activeSection}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onSectionClick={onSectionClick}
                className="h-[90vh]"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
