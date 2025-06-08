"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import type { Section } from "@/types/docs";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSectionClick: (id: string) => void;
  className?: string;
}

export function Sidebar({
  sections,
  activeSection,
  searchQuery,
  onSearchChange,
  onSectionClick,
  className
}: SidebarProps) {
  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

  const filteredSections = sections.filter(
    (item) =>
      searchQuery === "" ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Documentation
        </h2>
        {/* <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur"
          />
        </div> */}
      </div>

      <ScrollArea className={cn("h-[calc(100vh-200px)]", className)}>
        <div className="space-y-6">
          {Object.entries(groupedSections).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-1">
                {items
                  .filter((item) => filteredSections.includes(item))
                  .map((section) => (
                    <Button
                      key={section.id}
                      variant={
                        activeSection === section.id ? "secondary" : "ghost"
                      }
                      className={`w-full justify-start h-auto p-3 text-left transition-all ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => onSectionClick(section.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {section.icon}
                        <span className="text-sm flex-1">{section.label}</span>
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
