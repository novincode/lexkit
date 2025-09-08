import React from "react"
import { DynamicCodeExample } from "../components/dynamic-code-example"
import { BasicEditorExample } from "./examples/BasicEditorExample"
import { AdvancedFeaturesExample } from "./examples/AdvancedFeaturesExample"
import { ThemedEditorExample } from "./examples/ThemedEditorExample"
import { TailwindBasedExample } from "./examples/TailwindBasedExample"
import { DefaultTemplate } from "../../../templates/default/DefaultTemplate"
import { Badge } from "@repo/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { CheckCircle, Zap, Palette, Code2, Download, Play, Shield, Puzzle, Rocket, Github, BookOpen } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { InstallCommand } from "@/components/install-command"

export default function IntroductionPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">LexKit — a type-safe rich text editor framework</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Build editors fast. LexKit is headless and TypeScript-first, powered by Meta's Lexical. Perfect for blogs, apps, and teams.
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
        {/* DefaultTemplate Demo */}
        <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
            <Play className="h-4 w-4" />
            Try LexKit in Action: Default Editor Demo
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Try it live: type, format, add images. See LexKit in action.
          </p>
          <div className="border rounded-md overflow-hidden text-left">
            <DefaultTemplate />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Ready to use. No setup needed. Just works.
          </p>
        </div>
      </div>

      {/* What Makes LexKit Tick? */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What makes LexKit different</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Developer-friendly: safe commands, flexible extensions, and ready-to-use features.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Step 1: Install & Plug In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Install in one line. Get a working editor with smart defaults.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Step 2: Define Extensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pick what you need: bold, images, tables. Get safe, auto-typed commands.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Step 3: Build Your UI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Use the Provider and hooks. Build UIs easily. Export to HTML or Markdown.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-center">
          That's it. Simple, powerful, and fun to use.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
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
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Get Started in Minutes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Install LexKit and start building in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Install LexKit</h3>
            <InstallCommand packages={["@lexkit/editor"]} />
            <p className="text-sm text-muted-foreground">PeerDepends on Lexical packages.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Install Lexical Dependencies</h3>
            <InstallCommand packages={["lexical", "@lexical/react", "@lexical/html", "@lexical/markdown", "@lexical/list", "@lexical/rich-text", "@lexical/selection", "@lexical/utils"]} />
            <p className="text-sm text-muted-foreground">Core packages for LexKit features.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-lg mt-1">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">A Developer&apos;s Journey with Rich Text Editors</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    As a developer who&apos;s always valued clean, maintainable code, I found rich text editors
                    to be one of the most challenging areas to work with. Complex APIs, inconsistent behaviors,
                    and endless edge cases made building reliable editors feel like an uphill battle.
                  </p>
                  <p>
                    That&apos;s why I built LexKit — a clean, type-safe abstraction on top of Meta&apos;s Lexical
                    that makes rich text editing approachable and enjoyable. It&apos;s designed to eliminate
                    the frustration and let you focus on building great user experiences.
                  </p>
                  <p>
                    <strong>Your support means everything to me.</strong> Whether it&apos;s starring the repo,
                    reporting bugs, suggesting features, or contributing code — every bit helps keep this
                    project alive and growing. As an independent developer, your engagement directly impacts
                    what I can build and maintain.
                  </p>
                  <p className="font-medium text-foreground">
                    Ready to try it? Pick your package manager above and let&apos;s build something amazing together! 🚀
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            codes={['BasicEditorExample.tsx', 'basic-editor.css']}
            title="1. Basic Editor"
            description="Basic text formatting: bold, italic, lists."
            preview={<BasicEditorExample />}
            tabs={['preview', 'component']}
          />

          <DynamicCodeExample
            codes={['ThemedEditorExample.tsx', 'themed-editor.css']}
            title="2. Themed Editor"
            description="Custom themes and styling."
            preview={<ThemedEditorExample />}
            tabs={['preview', 'component', 'css']}
          />

          <DynamicCodeExample
            codes={['AdvancedFeaturesExample.tsx', 'advanced-editor.css']}
            title="3. Advanced Features"
            description="Tables, images, exports, and more."
            preview={<AdvancedFeaturesExample />}
            tabs={['preview', 'component']}
          />

          <DynamicCodeExample
            codes={['TailwindBasedExample.tsx']}
            title="4. Tailwind Theming"
            description="Pure Tailwind CSS styling — no custom CSS files."
            preview={<TailwindBasedExample />}
            tabs={['preview', 'component']}
          />
        </div>
      </div>

      {/* Call to Action */}
      <Card>
        <CardContent className="relative text-center py-12 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Ready to ship rich text features faster?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build better editors with less code. Try it now.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" asChild>
              <a href="/docs/getting-started">📚 Documentation</a>
            </Badge>
            <Badge variant="outline" asChild>
              <a href="/docs/api-reference">🔧 API Reference</a>
            </Badge>
            <Badge variant="outline" asChild>
              <a href="https://github.com/novincode/lexkit">⭐ GitHub</a>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
