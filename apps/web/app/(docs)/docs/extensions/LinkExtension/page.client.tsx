"use client";

import { DynamicCodeExample } from "../../../components/dynamic-code-example";
import { SimpleCodeBlock } from "../../../components/simple-code-block";
import { getHighlightedCode, getRawCode } from "@/lib/generated/code-registry";
import { BasicEditorWithAutoLinks } from "./examples/BasicEditorWithAutoLinks";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Link, Zap, Settings, Code, Target, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

export default function LinkExtensionPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">LinkExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Powerful hyperlink functionality for your editor
          </p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Add automatic URL detection, manual link creation, and intelligent
          paste behavior to your LexKit editor. Handle links with ease and
          provide a seamless editing experience.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Link className="h-3 w-3 mr-1" />
            Auto-Link URLs
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Smart Paste
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Settings className="h-3 w-3 mr-1" />
            Configurable
          </Badge>
        </div>
      </div>
      {/* Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Everything you need for professional link handling in your editor.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Link className="h-6 w-6 text-primary" />
                Smart URL Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Automatically detects and converts URLs to clickable links as
                you type, with customizable validation rules.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                Intelligent Paste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Smart paste behavior that handles URLs differently based on
                context - cursor paste vs. selected text replacement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                Manual Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Full programmatic control with commands for inserting, editing,
                and removing links through your UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Quick Start */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Start</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Get up and running with LinkExtension in minutes.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Import and configure LinkExtension"
                html={getHighlightedCode("link-extension-basic-usage") || ""}
                raw={getRawCode("link-extension-basic-usage") || ""}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Link Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Enable automatic URL detection"
                html={getHighlightedCode("link-extension-auto-link-text") || ""}
                raw={getRawCode("link-extension-auto-link-text") || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>{" "}
      {/* Smart Paste Behavior */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Smart Paste Behavior</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LinkExtension handles URL pasting intelligently based on your
          selection context.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-900 dark:text-green-100">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                Cursor Paste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Paste a URL when no text is selected. Controlled by{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  autoLinkUrls
                </code>{" "}
                setting.
              </p>
              <div className="mt-3 space-y-2">
                <div className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    autoLinkUrls: true
                  </Badge>
                  <span className="text-muted-foreground">
                    Creates clickable link
                  </span>
                </div>
                <div className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    autoLinkUrls: false
                  </Badge>
                  <span className="text-muted-foreground">
                    Inserts as plain text
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-900 dark:text-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-bold">2</span>
                </div>
                Selected Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Paste a URL over selected text. Controlled by{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  linkSelectedTextOnPaste
                </code>{" "}
                setting.
              </p>
              <div className="mt-3 space-y-2">
                <div className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    linkSelectedTextOnPaste: true
                  </Badge>
                  <span className="text-muted-foreground">
                    Links selected text with URL
                  </span>
                </div>
                <div className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    linkSelectedTextOnPaste: false
                  </Badge>
                  <span className="text-muted-foreground">
                    Replaces text with linked URL
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Live Demo - Moved up */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try LinkExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demo showcasing LinkExtension features. Try pasting URLs
            and using the toolbar!
          </p>
        </div>

        <DynamicCodeExample
          title="LinkExtension Demo"
          description="Try pasting URLs at cursor vs. over selected text"
          codes={[
            "docs/extensions/LinkExtension/examples/BasicEditorWithAutoLinks.tsx",
          ]}
          preview={<BasicEditorWithAutoLinks />}
          tabs={["preview", "Editor"]}
        />
      </div>
      {/* Configuration */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">
          Configuration Options
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Customize LinkExtension behavior to match your needs.
        </p>

        <Card className="p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Option</TableHead>
                  <TableHead className="w-1/4">Type</TableHead>
                  <TableHead className="w-1/2">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">
                    autoLinkText
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <p>Enable automatic conversion of typed URLs to links.</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Only affects URLs typed directly
                        in the editor, not pasted content.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">
                    autoLinkUrls
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Control whether URLs are automatically linked when pasted.
                    When false, pasted URLs remain as plain text.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">
                    linkSelectedTextOnPaste
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    When pasting URLs over selected text, control whether to
                    link the selected text or replace it with the URL.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">
                    validateUrl
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">(url: string) ⇒ boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Custom validation function for URLs. Return true to accept,
                    false to reject.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleCodeBlock
                title="Enable auto-linking for typed URLs"
                html={getHighlightedCode("link-extension-auto-link-text") || ""}
                raw={getRawCode("link-extension-auto-link-text") || ""}
              />
              <SimpleCodeBlock
                title="Disable automatic linking for pasted URLs"
                html={
                  getHighlightedCode("link-extension-disable-auto-link-urls") ||
                  ""
                }
                raw={getRawCode("link-extension-disable-auto-link-urls") || ""}
              />
              <SimpleCodeBlock
                title="Control selected text behavior when pasting URLs"
                html={
                  getHighlightedCode(
                    "link-extension-link-selected-text-on-paste",
                  ) || ""
                }
                raw={
                  getRawCode("link-extension-link-selected-text-on-paste") || ""
                }
              />
              <SimpleCodeBlock
                title="Custom URL validation"
                html={
                  getHighlightedCode("link-extension-custom-validation") || ""
                }
                raw={getRawCode("link-extension-custom-validation") || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">API Reference</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Complete reference for LinkExtension commands and state queries.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    insertLink(url?, text?)
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Insert or apply link to selection. Prompts for URL if not
                    provided.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    removeLink()
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remove link from current selection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                State Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    isLink()
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check if current selection is within a link.
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
          Tips for getting the most out of LinkExtension.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>URL Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Use custom validation to restrict links to trusted domains or
                enforce HTTPS-only policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Combine auto-linking with manual controls. Let users decide when
                to auto-link vs. manual insertion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Keep validation functions lightweight. Complex validation can
                impact typing performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ensure link text is descriptive. Consider adding link previews
                or validation feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
