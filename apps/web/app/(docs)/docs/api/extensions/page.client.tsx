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
  FunctionSquare
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export default function ExtensionsApiPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Extensions API</h1>
          <p className="text-xl text-muted-foreground mt-2">Core API reference for LexKit extensions</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Complete API reference for creating, configuring, and using LexKit extensions.
          Learn about the core interfaces, types, and functions that power the extension system.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Type className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <FunctionSquare className="h-3 w-3 mr-1" />
            Functional API
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <FileText className="h-3 w-3 mr-1" />
            Complete Reference
          </Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Links</h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/docs/extensions">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Creating Extensions Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Step-by-step guide to building custom extensions with interactive examples and best practices.
                </p>
              </CardContent>
            </Card>
          </Link>

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
        </div>
      </div>

      {/* Core API Overview */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Core API Overview</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The extension system is built around a few key interfaces and functions that work together to provide type safety and modularity.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FunctionSquare className="h-6 w-6 text-primary" />
                createExtension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Factory function for creating type-safe extensions with a functional API.
                Perfect for simple extensions and rapid development.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                BaseExtension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Abstract base class for creating extensions with traditional object-oriented patterns.
                Ideal for complex extensions with inheritance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Type className="h-6 w-6 text-primary" />
                Extension Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Core TypeScript interfaces and types that define the extension contract
                and ensure type safety throughout the system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* createExtension API */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">createExtension Function</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The primary factory function for creating type-safe extensions.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Function Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="createExtension Type Signature"
              html={getHighlightedCode('extensions-create-extension-signature') || ''}
              raw={getRawCode('extensions-create-extension-signature') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>config</code></TableCell>
                  <TableCell><code>CreateExtensionConfig</code></TableCell>
                  <TableCell>Configuration object defining the extension's behavior</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CreateExtensionConfig Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>name</code></TableCell>
                  <TableCell><code>string</code></TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Unique identifier for the extension</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>category</code></TableCell>
                  <TableCell><code>ExtensionCategory[]</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Categories this extension belongs to</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>config</code></TableCell>
                  <TableCell><code>Partial&lt;Config&gt;</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Default configuration values</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>commands</code></TableCell>
                  <TableCell><code>(editor: LexicalEditor) =&gt; Commands</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Function returning command implementations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>stateQueries</code></TableCell>
                  <TableCell><code>(editor: LexicalEditor) =&gt; StateQueries</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Function returning state query implementations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>plugins</code></TableCell>
                  <TableCell><code>ReactNode[]</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>React components to render as plugins</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>initialize</code></TableCell>
                  <TableCell><code>(editor: LexicalEditor) =&gt; (() =&gt; void) | void</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Initialization function called when extension is registered</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>nodes</code></TableCell>
                  <TableCell><code>any[]</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Custom Lexical nodes provided by the extension</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>supportedFormats</code></TableCell>
                  <TableCell><code>readonly TextFormatType[]</code></TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Text formats supported by this extension</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Creating an extension with createExtension"
              html={getHighlightedCode('extensions-create-extension-example') || ''}
              raw={getRawCode('extensions-create-extension-example') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* BaseExtension Class */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">BaseExtension Class</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Abstract base class for creating extensions with object-oriented patterns.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Class Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="BaseExtension Class Definition"
              html={getHighlightedCode('extensions-base-extension-signature') || ''}
              raw={getRawCode('extensions-base-extension-signature') || ''}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Return Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>register(editor)</code></TableCell>
                  <TableCell><code>() =&gt; void</code></TableCell>
                  <TableCell>Register the extension with the Lexical editor</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>getCommands(editor)</code></TableCell>
                  <TableCell><code>Commands</code></TableCell>
                  <TableCell>Return command implementations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>getStateQueries(editor)</code></TableCell>
                  <TableCell><code>StateQueries</code></TableCell>
                  <TableCell>Return state query implementations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>getPlugins()</code></TableCell>
                  <TableCell><code>Plugins</code></TableCell>
                  <TableCell>Return React plugins/components</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>getNodes()</code></TableCell>
                  <TableCell><code>any[]</code></TableCell>
                  <TableCell>Return custom Lexical nodes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>configure(config)</code></TableCell>
                  <TableCell><code>this</code></TableCell>
                  <TableCell>Configure the extension with new settings</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Creating an extension with BaseExtension"
              html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#E1E4E8"> MyExtension </span><span style="color:#F97583">extends</span><span style="color:#E1E4E8"> BaseExtension&lt;</span><span style="color:#9ECBFF">'my-extension'</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">  constructor() {</span></span>
<span class="line"><span style="color:#E1E4E8">    </span><span style="color:#F97583">super</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'my-extension'</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  register(editor: LexicalEditor): () =&gt; </span><span style="color:#79B8FF">void</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    </span><span style="color:#6A737D">// Registration logic</span></span>
<span class="line"><span style="color:#E1E4E8">    </span><span style="color:#F97583">return</span><span style="color:#E1E4E8"> () =&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">      </span><span style="color:#6A737D">// Cleanup logic</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  getCommands(editor: LexicalEditor) {</span></span>
<span class="line"><span style="color:#E1E4E8">    </span><span style="color:#F97583">return</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">      myCommand: () =&gt; console.log(</span><span style="color:#9ECBFF">'Hello!'</span><span style="color:#E1E4E8>),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  getStateQueries(editor: LexicalEditor) {</span></span>
<span class="line"><span style="color:#E1E4E8">    </span><span style="color:#F97583">return</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">      isActive: </span><span style="color:#F97583">async</span><span style="color:#E1E4E8"> () =&gt; </span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8>,</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8"></span><span style="color:#F97583">const</span><span style="color:#E1E4E8"> myExtension = </span><span style="color:#F97583">new</span><span style="color:#E1E4E8"> MyExtension();</span></span></code></pre>`}
              raw={`class MyExtension extends BaseExtension<'my-extension'> {
  constructor() {
    super('my-extension');
  }

  register(editor: LexicalEditor): () => void {
    // Registration logic
    return () => {
      // Cleanup logic
    };
  }

  getCommands(editor: LexicalEditor) {
    return {
      myCommand: () => console.log('Hello!'),
    };
  }

  getStateQueries(editor: LexicalEditor) {
    return {
      isActive: async () => true,
    };
  }
}

const myExtension = new MyExtension();`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Core Types */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Core Types & Interfaces</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Essential TypeScript types that define the extension system.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extension Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Extension Interface Definition"
                html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">export interface</span><span style="color:#E1E4E8"> Extension&lt;</span></span>
<span class="line"><span style="color:#E1E4E8">  Name </span><span style="color:#F97583">extends string</span><span style="color:#E1E4E8"> = string,</span></span>
<span class="line"><span style="color:#E1E4E8">  Config </span><span style="color:#F97583">extends</span><span style="color:#E1E4E8"> BaseExtensionConfig = BaseExtensionConfig,</span></span>
<span class="line"><span style="color:#E1E4E8">  Commands </span><span style="color:#F97583">extends</span><span style="color:#E1E4E8"> Record&lt;string, any&gt; = {},</span></span>
<span class="line"><span style="color:#E1E4E8">  StateQueries </span><span style="color:#F97583">extends</span><span style="color:#E1E4E8"> Record&lt;string, () =&gt; Promise&lt;boolean&gt;&gt; = {},</span></span>
<span class="line"><span style="color:#E1E4E8">  Plugins </span><span style="color:#F97583">extends</span><span style="color:#E1E4E8"> ReactNode[] = ReactNode[]</span></span>
<span class="line"><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">  name: Name;</span></span>
<span class="line"><span style="color:#E1E4E8">  category: ExtensionCategory[];</span></span>
<span class="line"><span style="color:#E1E4E8">  config: Config;</span></span>
<span class="line"><span style="color:#E1E4E8">  supportedFormats: </span><span style="color:#F97583">readonly</span><span style="color:#E1E4E8"> TextFormatType[];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  register(editor: LexicalEditor): () =&gt; </span><span style="color:#79B8FF">void</span><span style="color:#E1E4E8>;</span></span>
<span class="line"><span style="color:#E1E4E8">  getCommands(editor: LexicalEditor): Commands;</span></span>
<span class="line"><span style="color:#E1E4E8">  getStateQueries(editor: LexicalEditor): StateQueries;</span></span>
<span class="line"><span style="color:#E1E4E8">  getPlugins(): Plugins;</span></span>
<span class="line"><span style="color:#E1E4E8">  getNodes(): any[];</span></span>
<span class="line"><span style="color:#E1E4E8">  configure(config: Partial&lt;Config&gt;): </span><span style="color:#F97583">this</span><span style="color:#E1E4E8>;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>`}
                raw={`              <SimpleCodeBlock
                title="Extension Interface Definition"
                html={getHighlightedCode('extensions-extension-interface') || ''}
                raw={getRawCode('extensions-extension-interface') || ''}
              />`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ExtensionCategory Enum</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Extension Categories"
                html={getHighlightedCode('extensions-extension-category-enum') || ''}
                raw={getRawCode('extensions-extension-category-enum') || ''}
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
                html={`<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">export interface</span><span style="color:#E1E4E8"> BaseExtensionConfig {</span></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">/** Whether the extension is enabled */</span></span>
<span class="line"><span style="color:#E1E4E8">  enabled?: </span><span style="color:#79B8FF">boolean</span><span style="color:#E1E4E8>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">/** Priority for extension loading (higher = loaded first) */</span></span>
<span class="line"><span style="color:#E1E4E8">  priority?: </span><span style="color:#79B8FF">number</span><span style="color:#E1E4E8>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">/** Plugin position relative to editor content */</span></span>
<span class="line"><span style="color:#E1E4E8">  position?: </span><span style="color:#9ECBFF">'before'</span><span style="color:#E1E4E8"> | </span><span style="color:#9ECBFF">'after'</span><span style="color:#E1E4E8>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">/** Custom CSS classes for styling */</span></span>
<span class="line"><span style="color:#E1E4E8">  className?: string;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  </span><span style="color:#6A737D">/** Additional configuration properties */</span></span>
<span class="line"><span style="color:#E1E4E8">  [key: string]: any;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>`}
                raw={`export interface BaseExtensionConfig {
  /** Whether the extension is enabled */
  enabled?: boolean;

  /** Priority for extension loading (higher = loaded first) */
  priority?: number;

  /** Plugin position relative to editor content */
  position?: 'before' | 'after';

  /** Custom CSS classes for styling */
  className?: string;

  /** Additional configuration properties */
  [key: string]: any;
}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">API Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Guidelines for building robust and maintainable extensions.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Type className="h-5 w-5 text-primary" />
                Type Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Leverage TypeScript's type system to ensure compile-time safety.
                Define clear interfaces for commands and state queries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                Proper Cleanup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Always return cleanup functions from registration methods.
                Properly dispose of event listeners and resources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Use <code>editor.read()</code> for reading operations and <code>editor.update()</code> for mutations.
                Avoid unnecessary re-renders and optimize state queries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Document your extension's API with JSDoc comments.
                Include examples and usage patterns for other developers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
