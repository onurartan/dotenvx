"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className = "",
}: FeatureCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-background to-muted/30 ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
