import Link from "next/link"
import { ArrowRight, Zap, Shield, Puzzle, Rocket } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Badge } from "@repo/ui/components/badge"
import { CodeBlock } from "../components/code-block"

export default function IntroductionPage() {
  return (
    <div className="docs-container">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            v1.0.0
          </Badge>
          <Badge variant="outline">
            Stable Release
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Welcome to LexKit
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
          A headless, extensible rich text editor built on Lexical with full TypeScript support. 
          Build beautiful editors with complete control over your UI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild size="lg">
            <Link href="/docs/quick-start">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/novincode/lexkit" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Type-Safe</CardTitle>
            </div>
            <CardDescription>
              Commands and state queries are automatically typed based on your extensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock language="tsx" className="text-sm">
{`const extensions = [boldExtension, italicExtension] as const;
const { commands, activeStates } = useEditor();

// ✅ TypeScript knows these exist
commands.toggleBold();
if (activeStates.bold) { /* styled */ }`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-primary" />
              <CardTitle>Truly Headless</CardTitle>
            </div>
            <CardDescription>
              Zero UI components - build your own interface exactly how you want it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Zero built-in UI components</li>
              <li>• Plug-and-play extensions</li>
              <li>• Custom nodes support</li>
              <li>• Complete theme control</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Production Ready</CardTitle>
            </div>
            <CardDescription>
              Built-in features for real-world applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• HTML & Markdown export/import</li>
              <li>• Image handling with upload</li>
              <li>• Table support with GFM</li>
              <li>• Undo/Redo with history</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <CardTitle>Developer Experience</CardTitle>
            </div>
            <CardDescription>
              Designed for developer productivity and maintainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Zero-config setup</li>
              <li>• Tree-shakeable packages</li>
              <li>• TypeScript first</li>
              <li>• Comprehensive docs</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Example</h2>
        <p className="text-muted-foreground mb-6">
          Here's a complete, working example that showcases LexKit's power:
        </p>
        
        <CodeBlock 
          language="tsx" 
          title="app/page.tsx"
          className="mb-6"
        >
{`import React from 'react';
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  listExtension,
  markdownExtension,
} from '@lexkit/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// 1. Define your extensions (as const for type safety)
const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  markdownExtension,
] as const;

// 2. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// 3. Create your toolbar
function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div className="flex gap-2 p-2 border-b">
      <button
        onClick={() => commands.toggleBold()}
        className={activeStates.bold ? 'bg-blue-100' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        className={activeStates.italic ? 'bg-blue-100' : ''}
      >
        Italic
      </button>
    </div>
  );
}

// 4. Create your editor
function Editor() {
  return (
    <div className="border rounded-lg">
      <Toolbar />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="p-4 min-h-[200px] outline-none" />
        }
        placeholder={<div className="text-gray-400 p-4">Start writing...</div>}
        ErrorBoundary={() => <div>Something went wrong!</div>}
      />
    </div>
  );
}

// 5. Use it in your app
export default function App() {
  return (
    <Provider extensions={extensions}>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">My LexKit Editor</h1>
        <Editor />
      </div>
    </Provider>
  );
}`}
        </CodeBlock>

        <div className="bg-muted/50 border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>✅ This example works out-of-the-box!</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Copy and paste this into a Next.js page and you'll have a fully functional editor with type-safe commands.
          </p>
        </div>
      </div>

      {/* What Makes LexKit Special */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">What Makes LexKit Special</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">🎯 Type-Safe Commands & State</h3>
            <p className="text-muted-foreground mb-4">
              Commands and state queries are automatically typed based on your extensions. 
              No more runtime errors from typos in command names.
            </p>
            <CodeBlock language="tsx">
{`const extensions = [boldExtension, imageExtension] as const;
const { commands, activeStates } = useEditor();

// ✅ TypeScript knows these exist and their signatures
commands.toggleBold();        // ✅ Available
commands.insertImage({});     // ✅ Available with proper types
commands.nonExistent();       // ❌ TypeScript error

// ✅ State queries are also typed
if (activeStates.bold) { /* ... */ }        // ✅ Available
if (activeStates.imageSelected) { /* ... */ } // ✅ Available`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">🧩 Truly Headless & Composable</h3>
            <p className="text-muted-foreground mb-4">
              LexKit provides zero UI components. You build your interface exactly how you want it, 
              using your preferred styling solution.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Zero UI components - complete control over your interface</li>
              <li>Plug-and-play extensions - mix and match functionality</li>
              <li>Custom nodes support - add any content type</li>
              <li>Theme system - style it your way</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">🚀 Production Features Out-of-the-Box</h3>
            <p className="text-muted-foreground mb-4">
              LexKit comes with everything you need for real-world applications:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>HTML & Markdown export/import with custom transformers</li>
              <li>Image handling with upload, paste, and alignment</li>
              <li>Table support with context menus and GitHub Flavored Markdown</li>
              <li>Command palette with searchable commands and keyboard shortcuts</li>
              <li>Context menus and floating toolbars for contextual actions</li>
              <li>Undo/Redo with full history</li>
              <li>Multi-format editing (Visual, HTML, Markdown modes)</li>
              <li>Error boundaries and robust error handling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="border rounded-lg p-6 bg-muted/20">
        <h3 className="text-lg font-semibold mb-4">Ready to get started?</h3>
        <p className="text-muted-foreground mb-6">
          Follow our step-by-step guide to build your first editor with LexKit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/docs/installation">
              Installation Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/quick-start">
              Quick Start Tutorial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
