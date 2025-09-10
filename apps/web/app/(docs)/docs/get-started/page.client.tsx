"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { CheckCircle, Download, Code, Palette, Zap, ArrowRight, Play, Settings, Layers, Target, Wrench, Sparkles, Lightbulb, Package, BookOpen } from 'lucide-react'
import { InstallCommand } from '@/components/install-command'
import { DynamicCodeExample } from '../../components/dynamic-code-example'
import { BasicEditorExample } from '../../examples/BasicEditorExample'
import { TailwindBasedExample } from '../../examples/TailwindBasedExample'
import { DefaultTemplate, DefaultTemplateRef } from '@/components/templates/default/DefaultTemplate'
import { SimpleCodeBlock } from '../../components/simple-code-block'
import { getRawCode, getHighlightedCode } from '@/lib/generated/code-registry'
import React from 'react'

export function GetStartedPageClient() {
  const editorRef = React.useRef<DefaultTemplateRef>(null);

  // Handle when editor is ready - inject content immediately
  const handleEditorReady = React.useCallback((methods: DefaultTemplateRef) => {
    console.log('🎯 Editor ready - injecting content immediately');
    methods.injectMarkdown(`# Welcome to LexKit!

This is your first LexKit editor. Try the toolbar buttons above to format text, create lists, and more.

**Bold text**, *italic text*, and \`inline code\` are just the beginning. LexKit gives you complete control over your rich text editing experience.

Ready to build something amazing? Let's get started! 🚀`);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Get Started with LexKit</h1>
          <p className="text-xl text-muted-foreground mt-2">Build your first rich text editor in minutes</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Follow this step-by-step guide to create powerful, type-safe rich text editors with LexKit. We'll cover installation, basic setup, theming, and extensions.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Download className="h-3 w-3 mr-1" />
            5 Minute Setup
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Try LexKit Live</h2>
          <p className="text-lg text-muted-foreground">
            Experience the power of LexKit with this interactive editor. Use the toolbar to format text, create lists, and explore features.
          </p>
        </div>
        <DefaultTemplate ref={editorRef} onReady={handleEditorReady} />
      </div>

      {/* Installation Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            1. Installation
          </CardTitle>
          <CardDescription>
            Install LexKit and its dependencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-background/80 rounded-lg p-4 border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Install LexKit
              </h4>
              <InstallCommand packages={['@lexkit/editor']} />
            </div>
            <div className="bg-background/80 rounded-lg p-4 border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Install Lexical Dependencies
              </h4>
              <InstallCommand packages={['lexical', '@lexical/react', '@lexical/html', '@lexical/markdown', '@lexical/list', '@lexical/rich-text', '@lexical/selection', '@lexical/utils']} />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Ready to Code!</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  That's it! LexKit is now installed and ready to use. Let's create your first editor.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Choose Your Approach */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            2. Choose Your Approach
          </CardTitle>
          <CardDescription>
            LexKit offers two ways to create rich text editors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-background/80 rounded-lg p-4 border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                Option A: RichText as Extension
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Use RichText as a LexKit extension with createEditorSystem for full type safety and modularity. RichTextExtension is built on top of Lexical's RichTextPlugin to make using the original tool easier.
              </p>
              <SimpleCodeBlock
                html={getHighlightedCode('richtext-with-extensions') || ''}
                raw={getRawCode('richtext-with-extensions') || ''}
                title="RichText as LexKit Extension"
                height="h-48"
              />
            </div>

            <div className="bg-background/80 rounded-lg p-4 border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-green-600" />
                Option B: Manual RichText Setup
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Use createEditorSystem with manual RichTextPlugin setup for maximum control. You can also use RichTextPlugin from Lexical directly, but LexKit's RichTextExtension is built on top of it to make using the original Lexical tool easier.
              </p>
              <SimpleCodeBlock
                html={getHighlightedCode('richtext-lexical-direct') || ''}
                raw={getRawCode('richtext-lexical-direct') || ''}
                title="Manual RichText Setup"
                height="h-48"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Which to Choose?</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>RichText as Extension:</strong> Use createEditorSystem with RichTextExtension for full type safety and modularity. Perfect for complex editors.</li>
                  <li><strong>Manual RichText Setup:</strong> Use createEditorSystem with manual RichTextPlugin setup for maximum control. Great for advanced customization.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            2. How LexKit Works
          </CardTitle>
          <CardDescription>
            Understand the core concepts: createEditorSystem, extensions, and RichText
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>
              LexKit is built around three core concepts that work together to give you complete control:
            </p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
            <div className="bg-background/80 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">createEditorSystem</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                A factory function that creates a typed editor system based on your extensions. Provides full type safety.
              </p>
            </div>

            <div className="bg-background/80 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Layers className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold">Extensions</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Modular pieces that add functionality like bold, italic, lists, images, etc. Mix and match as needed.
              </p>
            </div>

            <div className="bg-background/80 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold">RichText</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                The core editor component that renders the editable content. Can be used standalone or with extensions.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Two Ways to Use LexKit
            </h4>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-3">
              <div className="text-sm">
                <strong className="text-primary">Extension System:</strong> Use <code>createEditorSystem</code> with RichTextExtension for full type safety and modularity. Perfect for complex editors.
              </div>
              <div className="text-sm">
                <strong className="text-primary">Manual Setup:</strong> Use <code>createEditorSystem</code> with manual RichTextPlugin setup for maximum control. Great for advanced customization.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theming and Styling */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            3. Theming and Styling
          </CardTitle>
          <CardDescription>
            Style your editor with Tailwind CSS or custom themes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-background/80 rounded-lg p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-600" />
              LexKit Theme System
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Use LexKit's theme system to apply classnames to different editor elements for complete styling control.
            </p>
            <SimpleCodeBlock
              html={getHighlightedCode('theming-with-lexkit') || ''}
              raw={getRawCode('theming-with-lexkit') || ''}
              title="LexKit Theme System"
              height="h-64"
            />
          </div>

          <DynamicCodeExample
            codes={['examples/ThemedEditorExample.tsx']}
            title="Themed Editor Example"
            description="See the theme system in action with custom classnames for each editor element."
            preview={<TailwindBasedExample />}
            tabs={['preview', 'component']}
          />
        </CardContent>
      </Card>

      {/* Working with Extensions */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            4. Working with Extensions
          </CardTitle>
          <CardDescription>
            Add powerful features with LexKit's extension system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-background/80 rounded-lg p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-green-600" />
              Using Built-in Extensions
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              LexKit comes with 25+ extensions for common features. Here's how to use them:
            </p>
            <SimpleCodeBlock
              html={getHighlightedCode('extension-setup') || ''}
              raw={getRawCode('extension-setup') || ''}
              title="Setup Extension System"
              height="h-40"
            />
          </div>

          <div className="bg-background/80 rounded-lg p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-600" />
              Using Extension Commands
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Access type-safe commands and state queries in your components:
            </p>
            <SimpleCodeBlock
              html={getHighlightedCode('use-extension-commands') || ''}
              raw={getRawCode('use-extension-commands') || ''}
              title="Using Extension Commands"
              height="h-48"
            />
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Available Extensions</h4>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Text Formatting:</strong> Bold, italic, underline, strikethrough, code
                  </div>
                  <div>
                    <strong>Structure:</strong> Headings, lists, quotes, horizontal rules
                  </div>
                  <div>
                    <strong>Rich Content:</strong> Tables, images, links, code blocks
                  </div>
                  <div>
                    <strong>Advanced:</strong> History, command palette, context menus
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background/80 rounded-lg p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Creating Custom Extensions
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your own extensions for custom functionality:
            </p>
            <SimpleCodeBlock
              html={getHighlightedCode('create-extension-basic') || ''}
              raw={getRawCode('create-extension-basic') || ''}
              title="Create Custom Extension"
              height="h-32"
            />
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/docs/extensions">
                  Learn Extension Development
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-0 shadow-sm bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            What's Next?
          </CardTitle>
          <CardDescription>
            Build on what you've learned and create amazing editors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Play className="h-4 w-4" />
                Keep Learning
              </h4>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/docs/examples">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Examples
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/docs/extensions">
                    <Wrench className="h-4 w-4 mr-2" />
                    Master Extensions
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/docs/introduction">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Read Full Docs
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick Wins
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Add image upload to your editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Implement table editing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Add keyboard shortcuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Create custom extensions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Export to HTML/Markdown</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Ready to Build?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You've learned the fundamentals of LexKit. Now you can:
                </p>
                <div className="flex flex-col md:grid md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Create production editors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Customize with themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Extend with custom features</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
