'use client'

import React from "react"
import Link from "next/link"
import { Badge } from "@repo/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Button } from "@repo/ui/components/button"
import { InstallCommand } from "@/components/install-command"
import { DynamicCodeExample } from "../../components/dynamic-code-example"
import { BasicEditorExample } from "../../examples/BasicEditorExample"
import {
  CheckCircle,
  AlertTriangle,
  Zap,
  Settings,
  BookOpen,
  Github,
  ArrowRight,
  Wrench,
  Layers,
  Shield,
  Package
} from "lucide-react"

export function InstallationPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Installation Guide</h1>
          <p className="text-xl text-muted-foreground mt-2">Get LexKit running in your project</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Follow our step-by-step guide to install LexKit and its peer dependencies.
          We'll get you from zero to a working editor in under 5 minutes.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Quick Setup
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Package className="h-3 w-3 mr-1" />
            Multiple Package Managers
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Type-Safe Installation
          </Badge>
        </div>
      </div>

      {/* Understanding Peer Dependencies */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Understanding LexKit's Architecture</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LexKit is built on Meta's Lexical framework. Here's why this matters for your installation.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                Why Peer Dependencies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                LexKit doesn't bundle Lexical — instead, it declares it as a peer dependency.
                This gives you full control over versioning and reduces bundle size.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Smaller bundle size</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Version control in your hands</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Avoid dependency conflicts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wrench className="h-6 w-6 text-primary" />
                What This Means for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You'll install both LexKit and its Lexical dependencies together.
                This ensures compatibility and gives you access to all Lexical's features.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Pro Tip:</p>
                <p className="text-sm text-muted-foreground">
                  Always check our documentation for the recommended Lexical version
                  that matches your LexKit version.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Installation Steps</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Install LexKit first, then its Lexical peer dependencies.
          </p>
        </div>

        {/* Clean Installation Commands */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Install LexKit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Start with the main LexKit package that provides our type-safe editor system.
              </CardDescription>
              <InstallCommand packages={["@lexkit/editor"]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Install Lexical Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Install the Lexical packages that power LexKit's functionality. These are peer dependencies.
              </CardDescription>
              <InstallCommand packages={["lexical", "@lexical/react", "@lexical/html", "@lexical/markdown", "@lexical/list", "@lexical/rich-text", "@lexical/selection", "@lexical/utils"]} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start Example */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Quick Start Example</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See LexKit in action with this basic example.
          </p>
        </div>

        <DynamicCodeExample
          codes={['examples/BasicEditorExample.tsx']}
          title="Your First LexKit Editor"
          description="A simple editor with basic formatting capabilities."
          preview={<BasicEditorExample />}
          tabs={['preview', 'component']}
        />
      </div>

      {/* Troubleshooting */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Troubleshooting</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Common issues and their solutions.
        </p>

        <div className="grid md:grid-cols-2 md:gap-6 gap-4">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="h-5 w-5" />
                Version Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                If you see version conflicts, try installing with the <code>--legacy-peer-deps</code> flag
                or check our documentation for compatible version combinations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Settings className="h-5 w-5" />
                TypeScript Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Make sure your TypeScript version is compatible. LexKit requires TypeScript 4.5+
                and proper type definitions for all Lexical packages.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="text-center py-12 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Ready to Build?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Now that LexKit is installed, let's start building amazing editors!
            </p>
          </div>
          <div className="flex items-center justify-center md:gap-6 gap-4 flex-wrap">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/extensions"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Explore Extensions
            </Link>
            <Link
              href="https://github.com/novincode/lexkit"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
