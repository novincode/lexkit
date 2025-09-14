"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { SimpleCodeBlock } from "@/app/(docs)/components/simple-code-block";
import { getRawCode, getHighlightedCode } from "@/lib/generated/code-registry";
import {
  DefaultTemplate,
  DefaultTemplateRef,
} from "@/components/templates/default/DefaultTemplate";
import {
  Github,
  Code,
  Palette,
  Zap,
  Settings,
  Image,
  FileText,
  Keyboard,
  Eye,
  EyeOff,
  Download,
  Upload,
  Moon,
  Sun,
  Command,
} from "lucide-react";

export default function DefaultTemplatePageClient() {
  const editorRef = useRef<DefaultTemplateRef>(null);
  const [isDark, setIsDark] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Handle when editor is ready - inject sample content
  const handleEditorReady = React.useCallback((methods: DefaultTemplateRef) => {
    console.log("🎯 DefaultTemplate ready - injecting sample content");
    methods.injectMarkdown(`# Welcome to LexKit DefaultTemplate

This is a **fully-featured rich text editor** built with Lexical and React. It includes:

## ✨ Key Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Lists**: Ordered and unordered lists with nesting
- **Links**: Auto-link detection and manual link creation
- **Images**: Drag & drop, paste, or upload images
- **Tables**: Create and edit tables with ease
- **Code Blocks**: Syntax highlighting for code snippets
- **Markdown**: Import/export markdown content
- **Themes**: Light and dark mode support
- **Command Palette**: Keyboard-driven editing (Ctrl+K)

## 🚀 Getting Started

Select some text and try the toolbar buttons above, or press **Ctrl+K** to open the command palette!

> **Tip**: You can paste images directly into the editor or use the image button in the toolbar.`);
  }, []);

  const handleExportMarkdown = () => {
    const markdown = editorRef.current?.getMarkdown();
    if (markdown) {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lexkit-content.md";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportHTML = () => {
    const html = editorRef.current?.getHTML();
    if (html) {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lexkit-content.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">DefaultTemplate</h1>
          <p className="text-xl text-muted-foreground mt-2">
            A Complete Rich Text Editor Solution
          </p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The DefaultTemplate is a production-ready rich text editor component
          that includes a comprehensive toolbar, theme support, and all
          essential editing features.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            Themed
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Feature Rich
          </Badge>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Interactive Demo</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {isDark ? "Light" : "Dark"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              DefaultTemplate Editor
            </CardTitle>
            <CardDescription>
              Try the toolbar buttons, command palette (Ctrl+K), and various
              editing features below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DefaultTemplate ref={editorRef} onReady={handleEditorReady} />

              {showPreview && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Content Preview</h4>
                  <div className="space-y-2">
                    <div>
                      <strong>Markdown:</strong>
                      <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                        {editorRef.current?.getMarkdown()?.substring(0, 200)}...
                      </pre>
                    </div>
                    <div>
                      <strong>HTML:</strong>
                      <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                        {editorRef.current?.getHTML()?.substring(0, 200)}...
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  onClick={handleExportMarkdown}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Markdown
                </Button>
                <Button onClick={handleExportHTML} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export HTML
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                Rich Text Editing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Full rich text editing with formatting, lists, links, images,
                tables, and code blocks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Keyboard className="h-5 w-5 text-primary" />
                Command Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Keyboard-driven editing with a searchable command palette
                (Ctrl+K).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                Theme Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Built-in light and dark themes with CSS variable support for
                customization.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Image className="h-5 w-5 text-primary" />
                Media Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Drag & drop images, paste from clipboard, and upload
                functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-5 w-5 text-primary" />
                Markdown Import/Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Seamless markdown import and export with full feature support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                Extensible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Built on LexKit's extension system - easily add custom features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Usage Examples</h2>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Usage</TabsTrigger>
            <TabsTrigger value="ref">With Ref</TabsTrigger>
            <TabsTrigger value="theme">Custom Theme</TabsTrigger>
            <TabsTrigger value="extensions">Extensions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>
                  Get started with the DefaultTemplate in minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="Basic DefaultTemplate"
                  html={
                    getHighlightedCode("default-template-basic-usage") || ""
                  }
                  raw={getRawCode("default-template-basic-usage") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ref">
            <Card>
              <CardHeader>
                <CardTitle>Using Refs</CardTitle>
                <CardDescription>
                  Access editor methods for programmatic control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="DefaultTemplate with Ref"
                  html={getHighlightedCode("default-template-with-ref") || ""}
                  raw={getRawCode("default-template-with-ref") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Custom Themes</CardTitle>
                <CardDescription>
                  Customize the editor appearance with themes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SimpleCodeBlock
                  title="Custom Theme Object"
                  html={getHighlightedCode("default-template-theme") || ""}
                  raw={getRawCode("default-template-theme") || ""}
                />
                <SimpleCodeBlock
                  title="CSS Variables"
                  html={
                    getHighlightedCode("default-template-css-variables") || ""
                  }
                  raw={getRawCode("default-template-css-variables") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extensions">
            <Card>
              <CardHeader>
                <CardTitle>Working with Extensions</CardTitle>
                <CardDescription>
                  Configure and customize editor extensions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SimpleCodeBlock
                  title="Extension Configuration"
                  html={getHighlightedCode("default-template-extensions") || ""}
                  raw={getRawCode("default-template-extensions") || ""}
                />
                <SimpleCodeBlock
                  title="Command Palette"
                  html={
                    getHighlightedCode("default-template-command-palette") || ""
                  }
                  raw={getRawCode("default-template-command-palette") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">API Reference</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>DefaultTemplate Props</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    onReady?: (methods: DefaultTemplateRef) =&gt; void
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Callback when editor is ready
                  </p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {"theme?: Partial<EditorTheme>"}
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Custom theme object
                  </p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    className?: string
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Additional CSS classes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DefaultTemplateRef Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    injectMarkdown(content: string): void
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Load markdown content
                  </p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    injectHTML(content: string): void
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Load HTML content
                  </p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    getMarkdown(): string
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Export as markdown
                  </p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    getHTML(): string
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Export as HTML
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Source Code */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Source Code</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The DefaultTemplate is open source. View the complete implementation
          on GitHub.
        </p>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="main">DefaultTemplate.tsx</TabsTrigger>
            <TabsTrigger value="styles">styles.css</TabsTrigger>
            <TabsTrigger value="theme">theme.ts</TabsTrigger>
            <TabsTrigger value="commands">commands.ts</TabsTrigger>
            <TabsTrigger value="components">components.tsx</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>Main Component</CardTitle>
                <CardDescription>
                  The core DefaultTemplate component with all features and
                  extensions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="DefaultTemplate.tsx"
                  html={getHighlightedCode("default/DefaultTemplate.tsx") || ""}
                  raw={getRawCode("default/DefaultTemplate.tsx") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styles">
            <Card>
              <CardHeader>
                <CardTitle>Styles</CardTitle>
                <CardDescription>
                  Complete CSS styling with framework-agnostic design and theme
                  support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="styles.css"
                  html={getHighlightedCode("default/styles.css") || ""}
                  raw={getRawCode("default/styles.css") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Configuration</CardTitle>
                <CardDescription>
                  Theme object defining CSS classes for all editor elements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="theme.ts"
                  html={getHighlightedCode("default/theme.ts") || ""}
                  raw={getRawCode("default/theme.ts") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Command System</CardTitle>
                <CardDescription>
                  Command definitions, keyboard shortcuts, and command palette
                  integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="commands.ts"
                  html={getHighlightedCode("default/commands.ts") || ""}
                  raw={getRawCode("default/commands.ts") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>
                  Custom UI components for toolbar, dropdowns, and dialogs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="components.tsx"
                  html={getHighlightedCode("default/components.tsx") || ""}
                  raw={getRawCode("default/components.tsx") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-6">
          <Link href="https://github.com/novincode/lexkit/tree/main/apps/web/components/templates/default">
            <Button size="lg" className="flex items-center gap-3">
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
