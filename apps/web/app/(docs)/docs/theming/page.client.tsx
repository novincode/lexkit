"use client";

import { DynamicCodeExample } from "@/app/(docs)/components/dynamic-code-example";
import { SimpleCodeBlock } from "@/app/(docs)/components/simple-code-block";
import { getHighlightedCode, getRawCode } from "@/lib/generated/code-registry";
import { ThemedEditorExample } from "@/app/(docs)/examples/ThemedEditorExample";
import { TailwindBasedExample } from "@/app/(docs)/examples/TailwindBasedExample";
import { CustomThemeExample } from "./examples/CustomThemeExample";
import { DarkModeExample } from "./examples/DarkModeExample";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  Palette,
  Code,
  Zap,
  Settings,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export default function ThemingPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Theming</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Complete control over your editor's appearance
          </p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Customize every aspect of your LexKit editor with powerful theming
          capabilities. From CSS classes to Tailwind utilities, make your editor
          match your design system perfectly.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            CSS Classes
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            Tailwind Ready
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Layers className="h-3 w-3 mr-1" />
            Type Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Extensible
          </Badge>
        </div>
      </div>

      {/* Overview */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">
          Theme System Overview
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LexKit's theming system builds on Lexical's foundation while adding
          powerful customization options.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Lexical Foundation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Extends Lexical's built-in theme system with additional
                properties for toolbar, containers, and custom extensions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                CSS & Tailwind
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use any CSS classes or Tailwind utilities. Full control over
                styling without framework restrictions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Type Safe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with intelligent autocomplete and
                compile-time validation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Start</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Get started with theming in just a few lines of code.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Define Your Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Create a custom theme object"
                html={getHighlightedCode("theming-basic-usage") || ""}
                raw={getRawCode("theming-basic-usage") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Apply the Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Apply your theme to the editor"
                html={getHighlightedCode("theming-apply-theme") || ""}
                raw={getRawCode("theming-apply-theme") || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tailwind Example */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Tailwind CSS Example</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          See how to style your editor using pure Tailwind CSS classes.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Tailwind Theme Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Complete Tailwind theme example"
              html={getHighlightedCode("theming-tailwind-theme") || ""}
              raw={getRawCode("theming-tailwind-theme") || ""}
            />
          </CardContent>
        </Card>
      </div>

      {/* Live Demos */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Live Examples</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See theming in action with these interactive examples.
          </p>
        </div>

        <div className="space-y-8">
          <DynamicCodeExample
            title="Custom CSS Classes Theme"
            description="Using custom CSS classes for complete styling control"
            codes={["docs/theming/examples/CustomThemeExample.tsx"]}
            preview={<CustomThemeExample />}
            tabs={["preview", "Editor"]}
          />

          <DynamicCodeExample
            title="Dynamic Dark Mode Theme"
            description="Switch between light and dark themes dynamically"
            codes={["docs/theming/examples/DarkModeExample.tsx"]}
            preview={<DarkModeExample />}
            tabs={["preview", "Editor"]}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Multiple Ways to Implement Dark Mode</AlertTitle>
            <AlertDescription>
              There are several approaches to dark mode theming:
              <br />
              <strong>1. Theme Object Replacement:</strong> Replace the entire
              theme object (like the example above) for complete control.
              <br />
              <strong>2. Parent Container Classes:</strong> Add dark mode
              classes to parent containers and let CSS handle the styling
              cascade.
              <br />
              <strong>3. CSS Variables:</strong> Use CSS custom properties that
              change based on a dark mode class.
              <br />
              <strong>4. Hybrid Approach:</strong> Combine theme objects with
              CSS variables for maximum flexibility.
            </AlertDescription>
          </Alert>

          <DynamicCodeExample
            title="Custom CSS Classes Theme"
            description="Using custom CSS classes for complete styling control"
            codes={["examples/ThemedEditorExample.tsx"]}
            preview={<ThemedEditorExample />}
            tabs={["preview", "Editor"]}
          />

          <DynamicCodeExample
            title="Tailwind CSS Theme"
            description="Pure Tailwind utilities for modern, responsive styling"
            codes={["examples/TailwindBasedExample.tsx"]}
            preview={<TailwindBasedExample />}
            tabs={["preview", "Editor"]}
          />
        </div>
      </div>

      {/* Theme Properties */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Theme Properties</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Complete reference of all available theme properties.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lexical Built-in Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Text Formatting
                    </TableCell>
                    <TableCell>
                      <code>text.bold</code>
                    </TableCell>
                    <TableCell>Bold text styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Text Formatting
                    </TableCell>
                    <TableCell>
                      <code>text.italic</code>
                    </TableCell>
                    <TableCell>Italic text styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Text Formatting
                    </TableCell>
                    <TableCell>
                      <code>text.underline</code>
                    </TableCell>
                    <TableCell>Underline text styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Text Formatting
                    </TableCell>
                    <TableCell>
                      <code>text.strikethrough</code>
                    </TableCell>
                    <TableCell>Strikethrough styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Text Formatting
                    </TableCell>
                    <TableCell>
                      <code>text.code</code>
                    </TableCell>
                    <TableCell>Inline code styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Content Elements
                    </TableCell>
                    <TableCell>
                      <code>paragraph</code>
                    </TableCell>
                    <TableCell>Paragraph styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Content Elements
                    </TableCell>
                    <TableCell>
                      <code>heading.h1-h6</code>
                    </TableCell>
                    <TableCell>Heading levels (h1 through h6)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Content Elements
                    </TableCell>
                    <TableCell>
                      <code>quote</code>
                    </TableCell>
                    <TableCell>Blockquote styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Content Elements
                    </TableCell>
                    <TableCell>
                      <code>link</code>
                    </TableCell>
                    <TableCell>Link styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Content Elements
                    </TableCell>
                    <TableCell>
                      <code>image</code>
                    </TableCell>
                    <TableCell>Image styling</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LexKit Custom Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Toolbar</TableCell>
                    <TableCell>
                      <code>toolbar.button</code>
                    </TableCell>
                    <TableCell>Base button styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Toolbar</TableCell>
                    <TableCell>
                      <code>toolbar.buttonActive</code>
                    </TableCell>
                    <TableCell>Active button styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Toolbar</TableCell>
                    <TableCell>
                      <code>toolbar.buttonDisabled</code>
                    </TableCell>
                    <TableCell>Disabled button styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Toolbar</TableCell>
                    <TableCell>
                      <code>toolbar.group</code>
                    </TableCell>
                    <TableCell>Button group container</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Containers</TableCell>
                    <TableCell>
                      <code>container</code>
                    </TableCell>
                    <TableCell>Main editor container</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Containers</TableCell>
                    <TableCell>
                      <code>wrapper</code>
                    </TableCell>
                    <TableCell>Editor wrapper element</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Containers</TableCell>
                    <TableCell>
                      <code>richText.contentEditable</code>
                    </TableCell>
                    <TableCell>Content editable area</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Containers</TableCell>
                    <TableCell>
                      <code>richText.placeholder</code>
                    </TableCell>
                    <TableCell>Placeholder text</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extension-Specific Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Extension</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Draggable Blocks
                    </TableCell>
                    <TableCell>
                      <code>draggable.handle</code>
                    </TableCell>
                    <TableCell>Drag handle styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Draggable Blocks
                    </TableCell>
                    <TableCell>
                      <code>draggable.handleHover</code>
                    </TableCell>
                    <TableCell>Hover state for drag handle</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Draggable Blocks
                    </TableCell>
                    <TableCell>
                      <code>draggable.blockDragging</code>
                    </TableCell>
                    <TableCell>Block being dragged styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Draggable Blocks
                    </TableCell>
                    <TableCell>
                      <code>draggable.dropIndicator</code>
                    </TableCell>
                    <TableCell>Drop zone indicator styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Floating Toolbar
                    </TableCell>
                    <TableCell>
                      <code>floatingToolbar.container</code>
                    </TableCell>
                    <TableCell>Toolbar container styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Floating Toolbar
                    </TableCell>
                    <TableCell>
                      <code>floatingToolbar.button</code>
                    </TableCell>
                    <TableCell>Toolbar buttons styling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Floating Toolbar
                    </TableCell>
                    <TableCell>
                      <code>floatingToolbar.buttonActive</code>
                    </TableCell>
                    <TableCell>Active button state styling</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Extension-Specific Theming */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">
          Extension-Specific Theming
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Customize the appearance of specific extensions like draggable blocks
          and floating toolbar.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Extension Theme Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Extension-specific theme configuration"
              html={getHighlightedCode("theming-extension-specific") || ""}
              raw={getRawCode("theming-extension-specific") || ""}
            />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Usage */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Advanced Usage</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Take your theming to the next level with advanced techniques.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Theme Merging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Combine themes or override specific properties without rewriting
                everything.
              </p>
              <SimpleCodeBlock
                title="Theme merging example"
                html={getHighlightedCode("theming-merge-themes") || ""}
                raw={getRawCode("theming-merge-themes") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Dynamic Theming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Change themes dynamically based on user preferences or
                application state.
              </p>
              <SimpleCodeBlock
                title="Dynamic theme switching example"
                html={
                  getHighlightedCode("theming-dynamic-theme-switching") || ""
                }
                raw={getRawCode("theming-dynamic-theme-switching") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                CSS Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use CSS custom properties for dynamic color schemes and
                responsive design.
              </p>
              <SimpleCodeBlock
                title="CSS Variables theme example"
                html={getHighlightedCode("theming-css-variables") || ""}
                raw={getRawCode("theming-css-variables") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Component-Level Theming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Apply different themes to different editor instances in the same
                application.
              </p>
              <SimpleCodeBlock
                title="Component-level theming example"
                html={getHighlightedCode("theming-component-level") || ""}
                raw={getRawCode("theming-component-level") || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for creating maintainable and performant themes.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Design System Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use your existing design system tokens and classes. Maintain
                consistency across your application by leveraging established
                patterns and variables.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep themes lightweight and avoid complex selectors. Use CSS
                custom properties for dynamic values to minimize re-renders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensure sufficient color contrast and consider focus states. Test
                with screen readers and keyboard navigation to maintain
                usability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design themes that work across different screen sizes. Use
                responsive utilities and consider touch interactions for mobile
                devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Migration Guide */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Migration Guide</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Upgrading from plain Lexical themes to LexKit theming.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>From Lexical to LexKit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Before (Lexical only)</h4>
                <SimpleCodeBlock
                  title="Plain Lexical theme configuration"
                  html={getHighlightedCode("theming-migration-before") || ""}
                  raw={getRawCode("theming-migration-before") || ""}
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">After (LexKit)</h4>
                <SimpleCodeBlock
                  title="LexKit theme configuration with extensions"
                  html={getHighlightedCode("theming-migration-after") || ""}
                  raw={getRawCode("theming-migration-after") || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
