"use client"

import { SimpleCodeBlock } from '@/app/(docs)/components/simple-code-block'
import { getHighlightedCode, getRawCode } from '@/lib/generated/code-registry'
import { Badge } from "@repo/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Code, Zap, Shield, Layers, Target, Sparkles } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table"

export default function CreateEditorSystemPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">createEditorSystem</h1>
          <p className="text-xl text-muted-foreground mt-2">Type-safe editor system factory</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The core factory function that creates a fully typed editor system based on your extensions.
          Provides compile-time safety and intelligent autocomplete for your editor components.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Type Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Auto Complete
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Layers className="h-3 w-3 mr-1" />
            Extensible
          </Badge>
        </div>
      </div>

      {/* What It Does */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What It Does</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          createEditorSystem is the heart of LexKit's type system. It analyzes your extensions
          and generates a perfectly typed Provider component and useEditor hook.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                Type Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Analyzes your extension array and extracts command types, state queries,
                and configuration options at compile time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Runtime Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Creates a runtime system that manages extension registration,
                command aggregation, and state synchronization.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Developer Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Provides intelligent autocomplete, compile-time error checking,
                and a clean API for building editor components.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Basic Usage */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Basic Usage</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Get started with createEditorSystem in three simple steps.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Define Your Extensions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create a const array of extensions for type safety.
              </p>
              <SimpleCodeBlock
                title="Define extensions array"
                html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { boldExtension, italicExtension, linkExtension } </span><span style="color:#F97583">from</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">'@lexkit/editor'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> extensions = [boldExtension, italicExtension, linkExtension] </span><span style="color:#F97583">as const</span></span></code></pre>`}
                raw={`import { boldExtension, italicExtension, linkExtension } from '@lexkit/editor'

const extensions = [boldExtension, italicExtension, linkExtension] as const`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Create Your Editor System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use createEditorSystem with your extensions to generate typed components.
              </p>
              <SimpleCodeBlock
                title="Create typed editor system"
                html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { createEditorSystem } </span><span style="color:#F97583">from</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">'@lexkit/editor'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> { Provider, useEditor } = createEditorSystem&lt;</span><span style="color:#F97583">typeof</span><span style="color:#E1E4E8"> extensions&gt;()</span></span></code></pre>`}
                raw={`import { createEditorSystem } from '@lexkit/editor'

const { Provider, useEditor } = createEditorSystem<typeof extensions>()`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Use in Your Components</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Wrap your editor components with the Provider and use the hook.
              </p>
              <SimpleCodeBlock
                title="Use the typed system"
                html={getHighlightedCode('create-editor-system-basic-usage') || ''}
                raw={getRawCode('create-editor-system-basic-usage') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Type Safety */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Type Safety Benefits</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          createEditorSystem provides compile-time guarantees about your editor's capabilities.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Intelligent Autocomplete</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Only available commands and states are suggested"
              html={getHighlightedCode('create-editor-system-type-safety') || ''}
              raw={getRawCode('create-editor-system-type-safety') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Configuration</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Customize your editor system with configuration options.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Provider Props</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">extensions</TableCell>
                  <TableCell>Extension[]</TableCell>
                  <TableCell>Required. Array of extensions to include in the editor.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">config</TableCell>
                  <TableCell>EditorConfig</TableCell>
                  <TableCell>Optional. Configuration object with theme and other settings.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">children</TableCell>
                  <TableCell>ReactNode</TableCell>
                  <TableCell>Required. Your editor components.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example with Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Configure theme and other options"
              html={getHighlightedCode('create-editor-system-with-config') || ''}
              raw={getRawCode('create-editor-system-with-config') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Usage */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Advanced Usage</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Take advantage of createEditorSystem's advanced features.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Multiple Editor Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create different editor systems for different use cases in the same app.
              </p>
              <SimpleCodeBlock
                title="Different editors for different purposes"
                html={getHighlightedCode('create-editor-system-multiple-editors') || ''}
                raw={getRawCode('create-editor-system-multiple-editors') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Advanced State Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access export/import utilities, state queries, and the raw editor instance.
              </p>
              <SimpleCodeBlock
                title="Full access to editor capabilities"
                html={getHighlightedCode('create-editor-system-advanced-state') || ''}
                raw={getRawCode('create-editor-system-advanced-state') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">API Reference</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Complete reference for the createEditorSystem API.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Provider Component
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">Provider&lt;Exts&gt;</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    React component that provides editor context. Wraps your editor components.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">extensions: Exts</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Required. Your extension array.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">config?: EditorConfig</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional. Editor configuration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                useEditor Hook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">commands</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    All available commands from your extensions.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">activeStates</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current state of all formatters and selections.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">editor</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Raw Lexical editor instance for advanced use.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">export / import</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilities for content serialization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for getting the most out of createEditorSystem.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Use Const Assertions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Always use <code className="bg-muted px-1 rounded">as const</code> with your extension arrays
                to enable full type inference.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Single Responsibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Create separate editor systems for different use cases rather than
                one system with all possible extensions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Type Your Props</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Use <code className="bg-muted px-1 rounded">typeof extensions</code> when calling createEditorSystem
                to maintain type safety.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Composition Over Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Build complex editors by composing simpler ones rather than
                configuring a single complex system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
