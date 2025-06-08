"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Comparison = () => {
  return (
    <section className="py-24 px-3 bg-gradient-to-br from-muted/30 to-muted/10 center">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              .envx vs Traditional .env
            </h2>
            <p className="text-lg text-muted-foreground">
              See what makes .envx the modern choice for environment
              configuration.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <span className="text-2xl">📄</span>
                  Traditional .env Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Simple key=value pairs only",
                  "No type information",
                  "No validation or schema",
                  "No variable interpolation",
                  "No conditional values",
                  "No multiline support",
                  "Manual type conversion needed",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-destructive">✗</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 relative bg-gradient-to-br from-background to-primary/5 shadow-lg">
              <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-primary to-purple-600 shadow-lg">
                Modern Format
              </Badge>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <span className="text-2xl">⚡</span>
                  .envx Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Rich syntax with schema definitions",
                  "Built-in type system",
                  "Schema validation & constraints",
                  "Variable interpolation with ${VAR}",
                  "Ternary expressions for conditions",
                  "Multiline strings with triple quotes",
                  "Automatic type conversion & safety",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
