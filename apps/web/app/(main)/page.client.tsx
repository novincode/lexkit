'use client'

import React from "react"
import Link from "next/link"
import { DefaultTemplate, DefaultTemplateRef } from "@/components/templates/default/DefaultTemplate"
import { Badge } from "@repo/ui/components/badge"
import { Button } from "@repo/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Separator } from "@repo/ui/components/separator"
import {
  Zap,
  Shield,
  Puzzle,
  Rocket,
  Github,
  Star,
  Download,
  Code,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Heart,
  BookOpen,
  Play,
  ChevronDown
} from "lucide-react"
import { InstallCommand } from "@/components/install-command"

export function HomePageClient() {
  const editorRef = React.useRef<DefaultTemplateRef>(null);

  // Handle when editor is ready - inject content immediately
  const handleEditorReady = React.useCallback((methods: DefaultTemplateRef) => {
    console.log('🎯 Editor ready - injecting content immediately');
    methods.injectMarkdown(`# Welcome to LexKit

**Build amazing React-based rich text editors with ease**

LexKit is a modern, type-safe React framework built on top of Meta's Lexical that makes creating powerful text editors simple and enjoyable.

## ✨ Key Features

- 🚀 **Lightning Fast** - Optimized performance with minimal bundle size
- 🛡️ **Type-Safe** - Full TypeScript support with auto-completion
- 🧩 **Extensible** - 25+ built-in extensions for common features
- 🎨 **Customizable** - Framework-agnostic styling with CSS custom properties
- 📱 **Responsive** - Works perfectly on all devices

## 🏁 Quick Start

\`\`\`bash
npm install @lexkit/editor lexical @lexical/react
\`\`\`

That's it! You're ready to build something amazing.`);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-blue-500/10 to-purple-900/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-20">
          <div className="flex flex-col gap-12 items-center text-center">
            {/* Content Section */}
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-4">
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Open Source & Free
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Build Amazing
                  <span className="text-primary block">Rich Text Editors</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  LexKit is a modern, type-safe React framework built on Meta's Lexical.
                  Create powerful editors with ease — perfect for blogs, apps, and teams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/docs/introduction">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <a href="https://github.com/novincode/lexkit" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>MIT License</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Zero Dependencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>TypeScript First</span>
                </div>
              </div>
            </div>

            {/* Editor Demo Section */}
            <div className="relative w-full max-w-4xl text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative">
                <DefaultTemplate ref={editorRef} onReady={handleEditorReady} />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-purple-900/20 via-purple-800/10 to-slate-800/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Why Choose LexKit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for React developers who want powerful editors without the complexity of raw Lexical
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Lightning Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Optimized for speed with minimal bundle size. Handles large documents effortlessly with smooth scrolling and editing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Type-Safe Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Full TypeScript support with auto-completion. Safe commands and state management prevent runtime errors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Puzzle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Truly Extensible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  25+ built-in extensions for tables, images, links, and more. Easy to create custom extensions for your needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">React-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Purpose-built for React with modern hooks and components. CSS custom properties for easy theming and customization.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Production Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Battle-tested in production. Comprehensive documentation, examples, and active community support.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Developer Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Intuitive API design with excellent developer tools. Fast setup and clear documentation for rapid development.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-800/20 via-slate-700/10 to-slate-600/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto  space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Get Started in Minutes
              </h2>
              <p className="text-xl text-muted-foreground">
                Install LexKit and start building powerful React editors immediately
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Install LexKit</h3>
                <InstallCommand packages={["@lexkit/editor"]} />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Install Lexical Dependencies</h3>
                <InstallCommand packages={["lexical", "@lexical/react", "@lexical/html", "@lexical/markdown", "@lexical/list", "@lexical/rich-text", "@lexical/selection", "@lexical/utils"]} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/introduction">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Documentation
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs/examples">
                  <Play className="mr-2 h-5 w-5" />
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-600/20 via-slate-500/10 to-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of React developers building better editors with LexKit
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/docs/introduction">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <a href="https://github.com/novincode/lexkit" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>
            </div>

            <div className="pt-8 border-t border-border/50">
              <p className="text-muted-foreground">
                Built with ❤️ by developers, for developers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
