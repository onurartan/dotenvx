"use client";

import { useTheme } from "magic-toast";
import { useState, useEffect, useRef, useCallback } from "react";

export function useDocumentation() {
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { theme, setTheme } = useTheme();
  const isDarkMode = theme == "dark";

  // Auto-clear copied state
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark");
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  }, []);

  const setSectionRef = useCallback((id: string) => {
    return (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    };
  }, []);

  return {
    copied,
    darkMode: isDarkMode,
    searchQuery,
    activeSection,
    setSearchQuery,
    copyToClipboard,
    toggleDarkMode,
    scrollToSection,
    setSectionRef,
  };
}
