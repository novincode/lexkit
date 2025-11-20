"use client";

import React from "react";
import { ShadcnTemplate } from "../../../../components/templates/shadcn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { ExternalLink, Github } from "lucide-react";

export default function ShadcnTemplatePage() {
  return (
    <div className="flex-1 flex flex-col">
      <ShadcnTemplate />
      <div className="flex-1" />
      <div className="mt-12 mb-12">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Want to use this template?</CardTitle>
            <CardDescription className="text-base">
              Check out the documentation to learn how to integrate the ShadcnTemplate into your project and customize it with shadcn/ui components.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild variant="default">
              <a href="/docs/templates/shadcn" className="inline-flex items-center gap-2">
                Read Documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://github.com/novincode/lexkit/tree/main/apps/web/components/templates/shadcn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                View Source on GitHub
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
