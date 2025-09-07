import Link from "next/link"
import { ArrowRight, Zap, Shield, Puzzle, Rocket } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Badge } from "@repo/ui/components/badge"
import { CodeExample } from "../components/code-example"
import { CodeBlock } from "../components/code-block"
import { BasicEditorExample } from "./examples/BasicEditorExample"
import { AdvancedFeaturesExample } from "./examples/AdvancedFeaturesExample"

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
        
        <CodeExample
          title="Basic Editor Setup"
          preview={<BasicEditorExample />}
          code={
            <CodeBlock 
              language="tsx" 
              title="BasicEditor.tsx"
            >
{`import { useState } from "react"
import { Button } from "@repo/ui/components/button"

export function BasicEditorExample() {
  const [content, setContent] = useState("")

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 min-h-[200px]">
        <h3 className="text-lg font-semibold mb-2">LexKit Editor</h3>
        <div className="prose prose-sm">
          <p>Start typing your content here...</p>
          <p>This is a placeholder for the actual editor.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => console.log("Clear")}
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
        <Button 
          onClick={() => console.log("Focus")}
          variant="outline"
          size="sm"
        >
          Focus
        </Button>
      </div>
    </div>
  )
}`}
            </CodeBlock>
          }
        />

              </div>

      {/* Advanced Features Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Advanced Features</h2>
        <p className="text-muted-foreground mb-6">
          LexKit comes with powerful features out of the box. Here's an example showing document management:
        </p>
        
        <CodeExample
          title="Document Management"
          preview={<AdvancedFeaturesExample />}
          code={
            <CodeBlock 
              language="tsx" 
              title="AdvancedFeatures.tsx"
              highlightLines={[15, 20, 25]}
            >
{`import { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/card"

export function AdvancedFeaturesExample() {
  const [title, setTitle] = useState("My Document")
  const [content, setContent] = useState("This is a sample document with advanced features.")

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Document Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md resize-none"
            rows={4}
            placeholder="Enter your content"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="outline">Preview</Button>
        </div>
      </CardContent>
    </Card>
  )
}`}
            </CodeBlock>
          }
        />
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
            <CodeBlock language="tsx" title="Type Safety Example">
{`const extensions = [boldExtension, imageExtension] as const;
const { commands, activeStates } = useEditor();

// ✅ TypeScript knows these exist and their signatures
commands.toggleBold();        // ✅ Available
commands.insertImage({});     // ✅ Available with proper types
commands.nonExistent();       // ❌ TypeScript error

// ✅ State queries are also typed
if (activeStates.bold) { /* ... */ }        // ✅ Available
if (activeStates.nonExistent) { /* ... */ }  // ❌ TypeScript error`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">🔌 Extension System</h3>
            <p className="text-muted-foreground mb-4">
              Build custom extensions or use our extensive library. Everything is composable and reusable.
            </p>
            <CodeBlock language="tsx" title="Custom Extension">
{`// Create your own extension
const customExtension = createExtension({
  name: 'custom',
  nodes: [CustomNode],
  commands: {
    insertCustom: () => ({ state, dispatch }) => {
      // Custom command logic
    }
  },
  toolbar: CustomToolbarComponent
});

// Use it in your editor
const extensions = [customExtension, ...otherExtensions] as const;`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">📱 Production Features</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="text-sm">
                <strong>Editor Features:</strong>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Real-time collaboration ready</li>
                  <li>• Image upload & management</li>
                  <li>• Table editing with GFM support</li>
                  <li>• Markdown import/export</li>
                </ul>
              </div>
              <div className="text-sm">
                <strong>Developer Features:</strong>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Zero-config setup</li>
                  <li>• Tree-shakeable packages</li>
                  <li>• Comprehensive testing utilities</li>
                  <li>• Error boundaries and robust error handling</li>
                </ul>
              </div>
            </div>
          </div>
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
