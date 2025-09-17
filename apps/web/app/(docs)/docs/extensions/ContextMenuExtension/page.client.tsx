"use client";

import { DynamicCodeExample } from "../../../components/dynamic-code-example";
import { SimpleCodeBlock } from "../../../components/simple-code-block";
import { getHighlightedCode, getRawCode } from "@/lib/generated/code-registry";
import BasicEditorWithContextMenu from "./examples/BasicEditorWithContextMenu";
import HeadlessContextMenuEditor from "./examples/HeadlessContextMenuEditor";
import AdvancedContextMenuEditor from "./examples/AdvancedContextMenuEditor";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { MousePointer, Zap, Settings, Palette } from "lucide-react";

export default function ContextMenuExtensionPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">ContextMenuExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Powerful, extensible context menu system
          </p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Build rich, context-aware menus that appear on right-click. Perfect for
          content-specific actions like table operations, link editing, and custom workflows.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <MousePointer className="h-3 w-3 mr-1" />
            Right-Click Menus
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Provider System
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Settings className="h-3 w-3 mr-1" />
            Extensible
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            Customizable
          </Badge>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Everything you need for professional context menu experiences.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <MousePointer className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Provider-Based Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Register multiple providers that can handle different content types
                and selection contexts with priority-based resolution.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Automatic Initialization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Smart initialization ordering ensures context menu providers register
                before dependent extensions, eliminating timing issues.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <Palette className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Headless & Themeable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete control over appearance with custom renderers, themes,
                and styles. Works with any design system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Start</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Get context menus working in your editor with minimal setup.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Import and add ContextMenuExtension"
                html={getHighlightedCode("context-menu-basic-usage") || ""}
                raw={getRawCode("context-menu-basic-usage") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Enable context menus for table operations"
                html={getHighlightedCode("context-menu-table-integration") || ""}
                raw={getRawCode("context-menu-table-integration") || ""}
              />
              <p className="text-sm text-muted-foreground mt-4">
                The ContextMenuExtension automatically handles initialization ordering,
                so table context menus work without manual array positioning.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Demo */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try ContextMenuExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demos showcasing different levels of context menu functionality.
          </p>
        </div>

        <div className="space-y-8">
          <DynamicCodeExample
            title="Headless Context Menu"
            description="Basic context menu functionality without tables or other extensions"
            codes={[
              "docs/extensions/ContextMenuExtension/examples/HeadlessContextMenuEditor.tsx",
            ]}
            preview={<HeadlessContextMenuEditor />}
            tabs={["preview", "Editor"]}
          />

          <DynamicCodeExample
            title="Table Context Menu"
            description="Context menu with table support and improved theming"
            codes={[
              "docs/extensions/ContextMenuExtension/examples/BasicEditorWithContextMenu.tsx",
            ]}
            preview={<BasicEditorWithContextMenu />}
            tabs={["preview", "Editor"]}
          />

          <DynamicCodeExample
            title="Advanced Context Menu"
            description="Custom providers for different content types with enhanced theming"
            codes={[
              "docs/extensions/ContextMenuExtension/examples/AdvancedContextMenuEditor.tsx",
            ]}
            preview={<AdvancedContextMenuEditor />}
            tabs={["preview", "Editor"]}
          />
        </div>
      </div>

      {/* Provider System */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Provider System</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The core of ContextMenuExtension - register providers for different content types.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Registering Custom Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Add context menu items for specific content"
              html={getHighlightedCode("context-menu-provider-registration") || ""}
              raw={getRawCode("context-menu-provider-registration") || ""}
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Provider Properties:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li><strong>id:</strong> Unique identifier for the provider</li>
                <li><strong>priority:</strong> Higher numbers checked first (default: 0)</li>
                <li><strong>canHandle:</strong> Function to determine if this provider should handle the context</li>
                <li><strong>getItems:</strong> Function returning menu items for this context</li>
                <li><strong>renderer:</strong> Optional custom renderer for this provider's menu</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customization */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Customization</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Complete control over appearance and behavior.
        </p>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Renderer</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Create custom context menu styling"
                html={getHighlightedCode("context-menu-custom-renderer") || ""}
                raw={getRawCode("context-menu-custom-renderer") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Customize behavior and appearance"
                html={getHighlightedCode("context-menu-configuration") || ""}
                raw={getRawCode("context-menu-configuration") || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">API Reference</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Commands and state queries for programmatic control.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">registerProvider(provider)</code>
                  <p className="text-sm text-muted-foreground">Register a context menu provider</p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">unregisterProvider(id)</code>
                  <p className="text-sm text-muted-foreground">Remove a provider by ID</p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">showContextMenu(config)</code>
                  <p className="text-sm text-muted-foreground">Show context menu programmatically</p>
                </div>
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">hideContextMenu()</code>
                  <p className="text-sm text-muted-foreground">Hide the current context menu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>State Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">isContextMenuOpen()</code>
                  <p className="text-sm text-muted-foreground">Check if context menu is visible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Programmatic Control</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Control context menus programmatically"
              html={getHighlightedCode("context-menu-programmatic-control") || ""}
              raw={getRawCode("context-menu-programmatic-control") || ""}
            />
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for the best context menu experience.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use appropriate priority values. Higher priority providers (like tables)
                should have higher numbers to be checked first.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Initialization Order</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The ContextMenuExtension uses initPriority to ensure it registers
                before dependent extensions, eliminating manual array ordering.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep canHandle functions lightweight. Avoid complex DOM queries
                or heavy computations in provider registration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ensure menu items have clear labels and consider keyboard navigation
                support for comprehensive accessibility.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}