'use client'

import { Badge } from '@repo/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { DynamicCodeExample } from '../../../components/dynamic-code-example'
import { SimpleCodeBlock } from '../../../components/simple-code-block'
import { getHighlightedCode, getRawCode } from '@/lib/generated/code-registry'
import LINK_EXTENSION_CODES from './codes'
import { BasicEditorWithAutoLinks } from './examples/BasicEditorWithAutoLinks'
import {
  Link,
  Settings,
  MousePointer,
  Play,
  Code,
  Palette,
  Shield,
  Zap
} from 'lucide-react'

export default function LinkExtensionPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">LinkExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">Simple, powerful link management</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Add comprehensive link functionality to your LexKit editor with automatic URL handling
          and customizable validation. No complex configuration needed.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Auto-Linking
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <MousePointer className="h-3 w-3 mr-1" />
            Smart Paste
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Settings className="h-3 w-3 mr-1" />
            Simple Config
          </Badge>
        </div>
      </div>

      {/* What It Does */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What It Does</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LinkExtension provides simple yet powerful link management using Lexical's built-in features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Smart Pasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Paste URLs anywhere - they'll automatically become clickable links.
                Select text and paste a URL to link the selected text (Lexical's built-in behavior).
                Control cursor pasting with the autoLinkUrls option.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Manual Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use toolbar buttons to manually create and edit links.
                Click existing links to edit them.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Optional Auto-Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Optionally auto-link URLs as you type them in the editor.
                Perfect for when you want instant link creation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuration Table */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Configuration Options</h2>
        <Card>
          <CardHeader>
            <CardTitle>LinkConfig Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">autoLinkUrls</TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell>true</TableCell>
                  <TableCell>Automatically link URLs when pasted at cursor</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">autoLinkText</TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell>false</TableCell>
                  <TableCell>Auto-link URLs as you type them</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">validateUrl</TableCell>
                  <TableCell>(url: string) =&gt; boolean</TableCell>
                  <TableCell>Basic URL validation</TableCell>
                  <TableCell>Custom function to validate URLs</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Live Example */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try LinkExtension</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of automatic link handling. Paste URLs, select text and paste URLs to replace with linked URLs, or use the toolbar buttons.
          </p>
        </div>

        <div className="space-y-8">
          <DynamicCodeExample
            title="Link Editor Demo"
            description="Try pasting URLs anywhere, selecting text and pasting URLs to link the selected text, or using the toolbar buttons to create links manually."
            codes={['docs/extensions/LinkExtension/examples/BasicEditorWithAutoLinks.tsx']}
            preview={<BasicEditorWithAutoLinks />}
            tabs={['preview', 'code']}
          />
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How Link Pasting Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Paste URL at Cursor
                </h4>
                <div className="text-sm space-y-2 bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p><strong>Action:</strong> Paste "https://example.com" at cursor</p>
                  <p><strong>Result:</strong> <a href="#" className="text-blue-500 underline">https://example.com</a> (when autoLinkUrls: true)</p>
                  <p className="text-xs text-muted-foreground">Creates a new link at the cursor position when auto-linking is enabled</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  linkSelectedTextOnPaste: true
                </h4>
                <div className="text-sm space-y-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p><strong>Selected:</strong> "click here"</p>
                  <p><strong>Paste:</strong> "https://example.com"</p>
                  <p><strong>Result:</strong> <a href="#" className="text-blue-500 underline">click here</a></p>
                  <p className="text-xs text-muted-foreground">Links the selected text with the pasted URL (Lexical's built-in behavior)</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-red-700 flex items-center gap-2">
                <Link className="h-4 w-4" />
                linkSelectedTextOnPaste: false
              </h4>
              <div className="text-sm space-y-2 bg-red-50 dark:bg-red-900/20 p-3 rounded mt-2">
                <p><strong>Selected:</strong> "click here"</p>
                <p><strong>Paste:</strong> "https://example.com"</p>
                <p><strong>Result:</strong> <a href="#" className="text-blue-500 underline">https://example.com</a></p>
                <p className="text-xs text-muted-foreground">Replaces selected text with the linked URL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Code Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Basic Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Basic Usage"
                html={getHighlightedCode('link-basic-usage') || ''}
                raw={getRawCode('link-basic-usage') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto-Link Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Auto-Link As You Type"
                html={getHighlightedCode('link-auto-link-text') || ''}
                raw={getRawCode('link-auto-link-text') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Using Commands"
                html={getHighlightedCode('link-commands') || ''}
                raw={getRawCode('link-commands') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Paste Behavior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Paste Behavior Options"
                html={getHighlightedCode('link-paste-behavior') || ''}
                raw={getRawCode('link-paste-behavior') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-lg px-6 py-3">
            <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Quick Start</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add link functionality to your editor in just a few lines of code.
          </p>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Import & Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleCodeBlock
              title="Import LinkExtension"
              html={getHighlightedCode('link-import') || ''}
              raw={getRawCode('link-import') || ''}
            />
            <SimpleCodeBlock
              title="Add to Extensions Array"
              html={getHighlightedCode('link-basic-usage') || ''}
              raw={getRawCode('link-basic-usage') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Simple</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the default configuration first. It handles most use cases automatically
                with smart paste behavior and manual link creation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Link When Appropriate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enable autoLinkText for user-friendly experiences where instant link creation
                is desired, like in chat applications or note-taking apps.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use custom URL validation to restrict links to trusted domains
                or enforce security policies in enterprise applications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Provide clear visual feedback for links and make link editing
                intuitive with toolbar buttons and keyboard shortcuts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
