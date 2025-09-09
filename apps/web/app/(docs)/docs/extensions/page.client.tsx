'use client'

import React from 'react';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import BasicEditorWithCustomExtension from './examples/BasicEditorWithCustomExtension';
import BasicEditorWithBaseExtension from './examples/BasicEditorWithBaseExtension';
import { DynamicCodeExample } from '@/app/(docs)/components/dynamic-code-example';
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
  Sparkles
} from 'lucide-react';

export default function ExtensionsPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Creating Custom Extensions</h1>
          <p className="text-xl text-muted-foreground mt-2">Extend LexKit with powerful custom functionality</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Learn how to build type-safe extensions that seamlessly integrate with LexKit's editor system.
          From simple commands to complex UI components, unlock the full potential of your editor.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Powerful API
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Extensible
          </Badge>
        </div>
      </div>

      {/* Understanding Extensions */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What Are Extensions?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Extensions are modular pieces of functionality that enhance your LexKit editor.
          They provide commands, state queries, UI components, and custom behavior.
        </p>

        <div className="grid md:grid-cols-3 md:gap-6 gap-4">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wrench className="h-6 w-6 text-primary" />
                Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Define actions that users can trigger. Commands are strongly typed and
                accessible through the editor's command palette and toolbar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                State Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Query the current state of your editor. Use these to enable/disable buttons,
                show contextual UI, or make decisions based on content.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                UI Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Add toolbar buttons, floating panels, context menus, and other UI elements
                that integrate seamlessly with your editor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Extension Anatomy */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Extension Anatomy</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Let's break down what makes up a LexKit extension.
        </p>

        {/* Method 1: createExtension Function */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-lg px-6 py-3">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Method 1: createExtension Function</h3>
            </div>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              The functional approach - perfect for simple, focused extensions
            </p>
          </div>

          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                The createExtension Function
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Every extension starts with the <code>createExtension</code> function. This factory
                function creates a strongly typed extension instance with proper TypeScript support.
              </p>
              <SimpleCodeBlock
                title="Basic Extension Structure"
                html={getHighlightedCode('create-extension-basic') || ''}
                raw={getRawCode('create-extension-basic') || ''}
              />
            </CardContent>
          </Card>

          <div className="md:grid md:grid-cols-2 md:gap-6 gap-4 flex flex-col">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-primary" />
                  Commands Object
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Define the actions your extension provides. Each command is a function that
                  receives the Lexical editor instance and performs some operation.
                </p>
                <SimpleCodeBlock
                  html={getHighlightedCode('extension-commands') || ''}
                  raw={getRawCode('extension-commands') || ''}
                />
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 max-w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  State Queries
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col'>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Define functions that return information about the editor's current state.
                  These are async functions that can read from the editor safely.
                </p>
                <SimpleCodeBlock
                  html={getHighlightedCode('extension-state-queries') || ''}
                  raw={getRawCode('extension-state-queries') || ''}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Live Example - createExtension */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try createExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demo of the functional approach. Click the buttons to test extension features!
          </p>
        </div>

        <DynamicCodeExample
          title="createExtension Demo"
          description="Functional approach - simple and focused"
          codes={['docs/extensions/examples/TestExtension.tsx', 'docs/extensions/examples/BasicEditorWithCustomExtension.tsx']}
          preview={<BasicEditorWithCustomExtension />}
          tabs={['preview', 'Extension', 'Editor']}
        />
      </div>

      {/* Class-Based Implementation */}
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-lg px-6 py-3">
            <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-3xl font-bold text-green-900 dark:text-green-100">Method 2: BaseExtension Class</h2>
          </div>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            The object-oriented approach - ideal for complex extensions with inheritance
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                Extending BaseExtension
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The BaseExtension class provides a more traditional class-based approach to creating extensions.
                This is perfect for complex extensions that need inheritance or shared state.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Key Benefits:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Traditional class-based architecture</li>
                  <li>• Instance methods and properties</li>
                  <li>• Inheritance and method overriding</li>
                  <li>• Better for complex state management</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:gap-6 gap-4 md:grid md:grid-cols-2">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-primary" />
                  Commands Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Implement the <code>getCommands</code> method to return your extension's command functions.
                  Each command receives the Lexical editor instance and performs operations.
                </p>
                <SimpleCodeBlock
                  html={getHighlightedCode('base-extension-commands') || ''}
                  raw={getRawCode('base-extension-commands') || ''}
                />
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  State Queries Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Implement the <code>getStateQueries</code> method to return async functions that
                  query the editor's current state safely using <code>editor.read()</code>.
                </p>
                <SimpleCodeBlock
                  html={getHighlightedCode('base-extension-state-queries') || ''}
                  raw={getRawCode('base-extension-state-queries') || ''}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                When to Use BaseExtension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Choose BaseExtension when you need:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Perfect For:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complex state management</li>
                    <li>• Multiple related commands</li>
                    <li>• Inheritance hierarchies</li>
                    <li>• Instance-specific configuration</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Use createExtension For:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Simple, functional extensions</li>
                    <li>• Quick prototyping</li>
                    <li>• Single-purpose extensions</li>
                    <li>• Less complex state needs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Example - BaseExtension */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try BaseExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demo of the class-based approach. Same functionality, different architecture!
          </p>
        </div>

        <DynamicCodeExample
          title="BaseExtension Demo"
          description="Class-based approach - perfect for complex extensions"
          codes={['docs/extensions/examples/TestBaseExtension.tsx', 'docs/extensions/examples/BasicEditorWithBaseExtension.tsx']}
          preview={<BasicEditorWithBaseExtension />}
          tabs={['preview', 'Extension', 'Editor']}
        />
      </div>

      {/* Integration Steps */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-lg px-6 py-3">
            <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Using Your Extension</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <strong>Universal Integration:</strong> No matter which approach you choose to create your extensions,
            the integration process is exactly the same. Both createExtension and BaseExtension extensions
            work identically in your editor system.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <Code className="h-3 w-3 mr-1" />
              Same Integration
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Zap className="h-3 w-3 mr-1" />
              Same API
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Target className="h-3 w-3 mr-1" />
              Same Usage
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                Define Extensions Array
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Create a const assertion array containing your extensions. The process is identical
                regardless of how you created your extensions - both approaches work the same way.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden">
                <pre className="text-sm">{`const extensions = [YourExtension] as const;`}</pre>

              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                Create Editor System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Use the <code>createEditorSystem</code> function to generate a typed Provider
                and useEditor hook based on your extensions. The process is identical for both approaches.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden">
                <pre className="text-sm">{`const { Provider, useEditor } = createEditorSystem<typeof extensions>();`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Use in Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Wrap your editor with the Provider and use the useEditor hook to access
                commands and state queries from your extensions. Works the same way for both approaches.
              </p>
              <SimpleCodeBlock
                title="Using Extension Commands"
                html={getHighlightedCode('use-extension-commands') || ''}
                raw={getRawCode('use-extension-commands') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for building maintainable and performant extensions.
        </p>

        <div className="grid md:grid-cols-2 md:gap-6 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                Type Safety First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Leverage TypeScript's power. Define clear interfaces for your commands and
                state queries. This prevents runtime errors and improves developer experience.
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
                Always return a cleanup function from your initialize method. This ensures
                event listeners and other resources are properly disposed of.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                Performance Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Use <code>editor.read()</code> for reading operations and <code>editor.update()</code>
                for mutations. Avoid unnecessary re-renders and optimize state queries.
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
                Document your extension's API clearly. Include JSDoc comments for commands
                and state queries to help other developers understand your extension.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
