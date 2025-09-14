"use client";

import React from "react";
import Link from "next/link";
import { BasicEditorExample } from "../../examples/BasicEditorExample";
import { AdvancedFeaturesExample } from "../../examples/AdvancedFeaturesExample";
import { ThemedEditorExample } from "../../examples/ThemedEditorExample";
import { TailwindBasedExample } from "../../examples/TailwindBasedExample";
import {
  DefaultTemplate,
  DefaultTemplateRef,
} from "@/components/templates/default/DefaultTemplate";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  CheckCircle,
  Zap,
  Palette,
  Play,
  Shield,
  Puzzle,
  Rocket,
  Github,
  BookOpen,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { InstallCommand } from "@/components/install-command";
import { DynamicCodeExample } from "../../components/dynamic-code-example";

export function IntroductionPageClient() {
  const editorRef = React.useRef<DefaultTemplateRef>(null);

  // Handle when editor is ready - inject content immediately
  const handleEditorReady = React.useCallback((methods: DefaultTemplateRef) => {
    console.log("🎯 Editor ready - injecting content immediately");
    methods.injectMarkdown(`# A Developer's Journey with Rich Text Editors

As a developer who's always valued clean, maintainable code, I found rich text editors to be one of the most challenging areas to work with. Complex APIs, inconsistent behaviors, and endless edge cases made building reliable editors feel like an uphill battle.

That's why I built LexKit — a clean, type-safe abstraction on top of Meta's Lexical that makes rich text editing approachable and enjoyable. It's designed to eliminate the frustration and let you focus on building great user experiences.

Your support means everything to me. Whether it's starring the repo, reporting bugs, suggesting features, or contributing code — every bit helps keep this project alive and growing. As an independent developer, your engagement directly impacts what I can build and maintain.

Ready to try it? Pick your package manager above and let's build something amazing together! 🚀`);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            LexKit — a type-safe rich text editor framework
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Build editors fast. LexKit is headless and TypeScript-first, powered
          by Meta's Lexical. Perfect for blogs, apps, and teams.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Type-Safe & Scalable
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production-Ready
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            Fully Customizable
          </Badge>
        </div>
      </div>

      {/* DefaultTemplate Demo */}
      <div className="max-w-4xl mx-auto">
        <DefaultTemplate ref={editorRef} onReady={handleEditorReady} />
      </div>

      {/* What Makes LexKit Different */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">What makes LexKit different</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Developer-friendly: safe commands, flexible extensions, and
            ready-to-use features.
          </p>
        </div>

        {/* Modern Step Cards */}
        <div className="grid md:grid-cols-3 md:gap-6 gap-4">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Card className="relative border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg">Install & Plug In</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  Install in one line. Get a working editor with smart defaults.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Card className="relative border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg">Define Extensions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  Pick what you need: bold, images, tables. Get safe, auto-typed
                  commands.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Card className="relative border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg">Build Your UI</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  Use the Provider and hooks. Build UIs easily. Export to HTML
                  or Markdown.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Simple closing statement */}
        <div className="text-center">
          <p className="text-muted-foreground font-medium">
            That's it. Simple, powerful, and fun to use.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 md:gap-6 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Lightning Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              Fast and efficient. Handles big documents with ease.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Puzzle className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Truly Extensible</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              Mix and match 25+ extensions. Build custom features easily.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Type-Safe Commands</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              Safe commands and states. Fewer bugs, better code.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Get Started</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Install LexKit and start building in minutes.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Install LexKit</h3>
          <InstallCommand packages={["@lexkit/editor"]} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Install Lexical Dependencies
          </h3>
          <InstallCommand
            packages={[
              "lexical",
              "@lexical/react",
              "@lexical/html",
              "@lexical/markdown",
              "@lexical/list",
              "@lexical/rich-text",
              "@lexical/selection",
              "@lexical/utils",
            ]}
          />
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Brought to you with ❤️</h4>
          <p className="text-muted-foreground leading-relaxed">
            LexKit is free, open-source software built by developers, for
            developers. Your support keeps this project alive — whether it's a
            GitHub star, bug report, feature suggestion, or a small donation.
            Every contribution helps maintain and improve LexKit for everyone.
          </p>
          <div className="flex items-center md:gap-6 gap-4 pt-2">
            <a
              href="https://github.com/novincode/lexkit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ⭐ Star on GitHub
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              💝 Support the project
            </a>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Progressive Examples</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step examples: from basic to advanced.
          </p>
        </div>

        <div className="space-y-12">
          <DynamicCodeExample
            codes={[
              "examples/BasicEditorExample.tsx",
              "examples/basic-editor.css",
            ]}
            title="1. Basic Editor"
            description="Basic text formatting: bold, italic, lists."
            preview={<BasicEditorExample />}
            tabs={["preview", "component"]}
          />

          <DynamicCodeExample
            codes={[
              "examples/ThemedEditorExample.tsx",
              "examples/themed-editor.css",
            ]}
            title="2. Themed Editor"
            description="Custom themes and styling."
            preview={<ThemedEditorExample />}
            tabs={["preview", "component", "css"]}
          />

          <DynamicCodeExample
            codes={[
              "examples/AdvancedFeaturesExample.tsx",
              "examples/advanced-editor.css",
            ]}
            title="3. Advanced Features"
            description="Tables, images, exports, and more."
            preview={<AdvancedFeaturesExample />}
            tabs={["preview", "component"]}
          />

          <DynamicCodeExample
            codes={["examples/TailwindBasedExample.tsx"]}
            title="4. Tailwind Theming"
            description="Pure Tailwind CSS styling — no custom CSS files."
            preview={<TailwindBasedExample />}
            tabs={["preview", "component"]}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <Card>
        <CardContent className="text-center py-12 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Continue your journey</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to build something amazing? Explore our documentation and
              examples.
            </p>
          </div>
          <div className="flex items-center justify-center md:gap-6 gap-4 flex-wrap">
            <Link
              href="/docs/getting-started"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              🚀 Quick Start
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/docs/extensions"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              🧩 Extensions
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/docs/examples"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              💡 Examples
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="https://github.com/novincode/lexkit"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              ⭐ GitHub
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
