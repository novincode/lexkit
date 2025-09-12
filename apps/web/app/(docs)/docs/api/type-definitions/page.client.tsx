'use client'

import React from 'react';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { SimpleCodeBlock } from '@/app/(docs)/components/simple-code-block';
import { getRawCode, getHighlightedCode } from '@/lib/generated/code-registry';
import {
  CheckCircle,
  Zap,
  Settings,
  BookOpen,
  Github,
  ArrowRight,
  Wrench,
  Layers,
  Code,
  Play,
  Lightbulb,
  Target,
  Sparkles,
  FileText,
  Type,
  FunctionSquare,
  Database,
  Cpu,
  Braces
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export default function TypeDefinitionsPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Type Definitions</h1>
          <p className="text-xl text-muted-foreground mt-2">Complete TypeScript reference for LexKit</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Comprehensive TypeScript definitions that power LexKit's type-safe architecture.
          Understand the core interfaces, generics, and utility types that make LexKit type-safe.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Type className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Braces className="h-3 w-3 mr-1" />
            Generic Types
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Database className="h-3 w-3 mr-1" />
            Complete Reference
          </Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Links</h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/docs/api/create-editor-system">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  createEditorSystem API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Learn how to create typed editor systems from your extension arrays.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/api/extensions">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wrench className="h-6 w-6 text-primary" />
                  Extensions API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Complete API reference for creating, configuring, and using LexKit extensions.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Core Concepts</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LexKit's type system is built around several key concepts that work together to provide compile-time safety and excellent developer experience.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Type className="h-6 w-6 text-primary" />
                Generic Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Extensive use of TypeScript generics to provide type safety at compile time,
                ensuring that commands, state queries, and plugins are correctly typed.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                Extension Arrays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Type-safe arrays of extensions that are analyzed at compile time to extract
                available commands, state queries, and plugin types.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-primary" />
                Type Inference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Advanced type inference utilities that automatically extract and merge types
                from extension arrays, providing IntelliSense and compile-time validation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Editor Configuration Types */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Editor Configuration Types</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Types that define how the editor is configured and themed.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>EditorConfig Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="EditorConfig Interface"
              html={getHighlightedCode('type-definitions-editor-config') || ''}
              raw={getRawCode('type-definitions-editor-config') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NodeTheme Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="NodeTheme Interface"
              html={getHighlightedCode('type-definitions-node-theme') || ''}
              raw={getRawCode('type-definitions-node-theme') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Editor Context Types */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Editor Context Types</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The main context type that provides type-safe access to the editor and its extensions.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>EditorContextType Interface</CardTitle>
            <CardDescription>
              Generic interface that provides strongly typed access to editor functionality based on the extensions array
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="EditorContextType Interface"
              html={getHighlightedCode('type-definitions-editor-context-type') || ''}
              raw={getRawCode('type-definitions-editor-context-type') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>editor</code></TableCell>
                  <TableCell><code>LexicalEditor | null</code></TableCell>
                  <TableCell>The raw Lexical editor instance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>config</code></TableCell>
                  <TableCell><code>EditorConfig</code></TableCell>
                  <TableCell>Editor configuration including theme</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>extensions</code></TableCell>
                  <TableCell><code>Exts</code></TableCell>
                  <TableCell>Array of registered extensions (typed)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>commands</code></TableCell>
                  <TableCell><code>any</code></TableCell>
                  <TableCell>Aggregated commands from all extensions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>activeStates</code></TableCell>
                  <TableCell><code>any</code></TableCell>
                  <TableCell>Current state of all extensions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>plugins</code></TableCell>
                  <TableCell><code>ReactNode[]</code></TableCell>
                  <TableCell>React plugins from extensions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>hasExtension</code></TableCell>
                  <TableCell><code>Function</code></TableCell>
                  <TableCell>Check if a specific extension is loaded</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Extension Types */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Extension Types</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Core types that define the extension system and its contracts.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>ExtensionCategory Enum</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Extension Categories"
              html={getHighlightedCode('type-definitions-extension-category-enum') || ''}
              raw={getRawCode('type-definitions-extension-category-enum') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BaseExtensionConfig Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Base Configuration Interface"
              html={getHighlightedCode('type-definitions-base-extension-config') || ''}
              raw={getRawCode('type-definitions-base-extension-config') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extension Interface</CardTitle>
            <CardDescription>
              The core interface that all extensions must implement, with extensive generic type parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Extension Interface"
              html={getHighlightedCode('type-definitions-extension-interface') || ''}
              raw={getRawCode('type-definitions-extension-interface') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Type Extraction Utilities */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Type Extraction Utilities</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Advanced TypeScript utilities that extract and merge types from extension arrays.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>BaseCommands Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Base Commands"
              html={getHighlightedCode('type-definitions-base-commands') || ''}
              raw={getRawCode('type-definitions-base-commands') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type Extraction Helpers</CardTitle>
            <CardDescription>
              Utility types that analyze extension arrays to extract available functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Type Extraction Utilities"
              html={getHighlightedCode('type-definitions-extract-types') || ''}
              raw={getRawCode('type-definitions-extract-types') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EditorContextType (Extensions Version)</CardTitle>
            <CardDescription>
              The extensions version of EditorContextType with proper type extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="EditorContextType (Extensions)"
              html={getHighlightedCode('type-definitions-editor-context-type-extensions') || ''}
              raw={getRawCode('type-definitions-editor-context-type-extensions') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Type System Benefits */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Type System Benefits</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          How LexKit's advanced type system improves your development experience.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                IntelliSense Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Get full autocomplete for commands, state queries, and extension methods.
                Never guess what methods are available on your editor context.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                Compile-Time Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Catch extension configuration errors and API misuse at compile time,
                preventing runtime errors and improving code reliability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                Refactoring Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                When you change extension APIs or add/remove extensions, TypeScript
                will guide you through all the necessary updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                Better DX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Rich type information enables better IDE support, documentation,
                and makes the codebase more maintainable and self-documenting.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Usage Examples</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          See how the type system works in practice with real code examples.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Typed Extension Array</CardTitle>
            <CardDescription>
              Creating a type-safe array of extensions that TypeScript can analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Typed Extension Usage"
              html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> extensions = [</span></span>
<span class="line"><span style="color:#E1E4E8">  boldExtension,</span></span>
<span class="line"><span style="color:#E1E4E8">  italicExtension,</span></span>
<span class="line"><span style="color:#E1E4E8">  linkExtension</span></span>
<span class="line"><span style="color:#E1E4E8">] </span><span style="color:#F97583">as const</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#E1E4E8"> MyEditorContext = EditorContextType&lt;</span><span style="color:#F97583">typeof</span><span style="color:#E1E4E8"> extensions&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// Now you have full type safety!</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> MyEditor: React.FC = () =&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#F97583">const</span><span style="color:#E1E4E8"> { commands, activeStates } = useEditor();</span></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">// commands has all available commands with proper types</span></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">// activeStates has all state queries with boolean types</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span></code></pre>`}
              raw={`const extensions = [
  boldExtension,
  italicExtension,
  linkExtension
] as const;

type MyEditorContext = EditorContextType<typeof extensions>;

// Now you have full type safety!
const MyEditor: React.FC = () => {
  const { commands, activeStates } = useEditor();
  // commands has all available commands with proper types
  // activeStates has all state queries with boolean types
};`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
