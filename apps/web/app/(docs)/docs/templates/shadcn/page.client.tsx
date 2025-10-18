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
import { InstallCommand } from "@/components/install-command";
import {
  ShadcnTemplate,
  ShadcnTemplateRef,
} from "@/components/templates/shadcn/ShadcnTemplate";
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
  MousePointer,
  Move,
  Menu,
} from "lucide-react";

export default function ShadcnTemplatePageClient() {
  const editorRef = useRef<ShadcnTemplateRef>(null);
  const [isDark, setIsDark] = useState(false);

  // Handle when editor is ready - inject sample content
  const handleEditorReady = React.useCallback((methods: ShadcnTemplateRef) => {
    console.log("🎯 ShadcnTemplate ready - injecting sample content");
    // Only inject if editor is empty to prevent re-focus loops
    const currentContent = methods.getMarkdown();
    if (!currentContent || currentContent.trim() === "") {
      methods.injectMarkdown(`# Welcome to LexKit ShadcnTemplate

This is a **modern rich text editor** built with Lexical, React, and SHADCN UI components. It includes:

## ✨ Key Features

- **SHADCN UI Integration**: Beautiful, accessible components
- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Floating Toolbar**: Context-aware formatting on text selection
- **Draggable Blocks**: Drag content blocks to reorder
- **Context Menu**: Right-click for quick actions
- **Lists**: Ordered and unordered lists with nesting
- **Links**: Auto-link detection and manual link creation
- **Images**: Drag & drop, paste, or upload images with dialogs
- **Tables**: Create and edit tables with ease
- **Code Blocks**: Syntax highlighting for code snippets
- **HTML Embeds**: Insert and preview HTML content
- **Markdown**: Import/export markdown content
- **Command Palette**: Keyboard-driven editing (Ctrl+K)
- **Themes**: Light and dark mode support

## 🚀 Getting Started

Select some text and try the **floating toolbar** that appears, or right-click for the **context menu**. Press **Ctrl+K** to open the command palette!

> **Tip**: Hover over the left edge of paragraphs to see **drag handles** for reordering content.`);
    }
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
          <h1 className="text-4xl font-bold">ShadcnTemplate</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Modern Rich Text Editor with SHADCN UI
          </p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The ShadcnTemplate is a beautiful, production-ready rich text editor
          that combines the power of Lexical with the elegance of SHADCN UI
          components.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            SHADCN UI
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <MousePointer className="h-3 w-3 mr-1" />
            Floating Toolbar
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Move className="h-3 w-3 mr-1" />
            Draggable Blocks
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              ShadcnTemplate Editor
            </CardTitle>
            <CardDescription>
              Try the floating toolbar, context menu (right-click), command
              palette (Ctrl+K), and drag handles on the left edge of content
              blocks.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              <ShadcnTemplate ref={editorRef} onReady={handleEditorReady} />
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
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-primary" />
                Floating Toolbar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Context-aware toolbar that appears when you select text,
                providing quick access to formatting options.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="h-5 w-5 text-primary" />
                Draggable Blocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hover over the left edge of content blocks to reveal drag
                handles for reordering your document.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" />
                Context Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Right-click anywhere in the editor to access a context menu with
                formatting and block actions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Command className="h-5 w-5 text-primary" />
                Command Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Press Ctrl+K to open a searchable command palette for
                keyboard-driven editing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Image Dialogs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Beautiful modal dialogs for inserting images via URL or file
                upload with drag & drop support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                HTML Embeds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Insert and preview HTML content directly in your documents with
                live editing capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Installation</h2>

        <Card>
          <CardHeader>
            <CardTitle>Install Required SHADCN UI Components</CardTitle>
            <CardDescription>
              The ShadcnTemplate requires these SHADCN UI components. Install them all at once:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstallCommand
              packages={[
                "button",
                "toggle",
                "command",
                "tooltip",
                "tabs",
                "select",
                "separator",
                "label",
                "input",
                "dropdown-menu",
                "switch",
                "dialog",
                "collapsible",
                "textarea"
              ]}
              commandMap={{
                npm: (packages) => `npx shadcn@latest add ${packages.join(" ")}`,
                yarn: (packages) => `yarn dlx shadcn@latest add ${packages.join(" ")}`,
                pnpm: (packages) => `pnpm dlx shadcn@latest add ${packages.join(" ")}`,
                bun: (packages) => `bunx --bun shadcn@latest add ${packages.join(" ")}`,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Path Note</CardTitle>
            <CardDescription>
              The code examples below show imports from <code className="bg-muted px-1 py-0.5 rounded text-sm">@/components/ui/...</code>.
              If your shadcn components are in a different path, adjust the imports accordingly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Usage Examples</h2>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="ref">With Ref</TabsTrigger>
            <TabsTrigger value="theme">Theming</TabsTrigger>
            <TabsTrigger value="extensions">Extensions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>
                  Get started with the ShadcnTemplate in just a few lines of
                  code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="Basic ShadcnTemplate"
                  html={getHighlightedCode("shadcn-template-basic-usage") || ""}
                  raw={getRawCode("shadcn-template-basic-usage") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ref">
            <Card>
              <CardHeader>
                <CardTitle>Using Refs</CardTitle>
                <CardDescription>
                  Access editor methods programmatically using React refs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate with Ref"
                  html={getHighlightedCode("shadcn-template-with-ref") || ""}
                  raw={getRawCode("shadcn-template-with-ref") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theming</CardTitle>
                <CardDescription>
                  Customize the appearance using the built-in theme system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate Theme"
                  html={getHighlightedCode("shadcn-template-theme") || ""}
                  raw={getRawCode("shadcn-template-theme") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extensions">
            <Card>
              <CardHeader>
                <CardTitle>Extensions</CardTitle>
                <CardDescription>
                  Configure and customize editor extensions for your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate Extensions"
                  html={getHighlightedCode("shadcn-template-extensions") || ""}
                  raw={getRawCode("shadcn-template-extensions") || ""}
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
              <CardTitle>ShadcnTemplate Props</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  className?: string
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Additional CSS classes to apply to the editor wrapper.
                </p>
              </div>
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  onReady?: (methods: ShadcnTemplateRef) =&gt; void
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Callback fired when the editor is ready with access to editor
                  methods.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ShadcnTemplateRef Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  injectMarkdown(content: string): void
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Inject markdown content into the editor.
                </p>
              </div>
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  injectHTML(content: string): void
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Inject HTML content into the editor.
                </p>
              </div>
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  getMarkdown(): string
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Get the current content as markdown.
                </p>
              </div>
              <div>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  getHTML(): string
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  Get the current content as HTML.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Source Code */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Source Code</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The ShadcnTemplate is open source. View the complete implementation on
          GitHub.
        </p>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="main">Main Component</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>ShadcnTemplate.tsx</CardTitle>
                <CardDescription>
                  The main editor component with all features integrated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate Main Component"
                  html={getHighlightedCode("shadcn/ShadcnTemplate.tsx") || ""}
                  raw={getRawCode("shadcn/ShadcnTemplate.tsx") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styles">
            <Card>
              <CardHeader>
                <CardTitle>shadcn-styles.css</CardTitle>
                <CardDescription>
                  Essential CSS styles for animations and special behaviors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate Styles"
                  html={getHighlightedCode("shadcn/shadcn-styles.css") || ""}
                  raw={getRawCode("shadcn/shadcn-styles.css") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>theme.ts</CardTitle>
                <CardDescription>
                  Complete theme configuration using Tailwind CSS classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="ShadcnTemplate Theme"
                  html={getHighlightedCode("shadcn/theme.ts") || ""}
                  raw={getRawCode("shadcn/theme.ts") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

      

          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>
                  Custom SHADCN UI components used throughout the editor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleCodeBlock
                  title="SHADCN UI Components"
                  html={getHighlightedCode("shadcn/index.ts") || ""}
                  raw={getRawCode("shadcn/index.ts") || ""}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-6">
          <Link href="https://github.com/novincode/lexkit/tree/main/apps/web/components/templates/shadcn">
            <Button variant="outline" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
