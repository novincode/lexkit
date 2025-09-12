'use client'

import { Badge } from '@repo/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { DynamicCodeExample } from '../../../components/dynamic-code-example'
import { SimpleCodeBlock } from '../../../components/simple-code-block'
import { getHighlightedCode, getRawCode } from '@/lib/generated/code-registry'
import LINK_EXTENSION_CODES from './codes'
import { BasicEditorWithAutoLinks } from './examples/BasicEditorWithAutoLinks'
import { BasicEditorWithManualLinks } from './examples/BasicEditorWithManualLinks'
import {
  Link,
  Settings,
  MousePointer,
  Play,
  Code,
  Palette,
  Shield
} from 'lucide-react'

export default function LinkExtensionPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">LinkExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">Powerful link management for your editor</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Add comprehensive link functionality to your LexKit editor with auto-linking,
          paste handling, and customizable validation.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Requirement</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                LinkExtension requires <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded text-xs">blockFormatExtension</code> to work fully with paste functionality and link insertion.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Link className="h-3 w-3 mr-1" />
            Link Management
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Link className="h-3 w-3 mr-1" />
            Auto-Linking
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <MousePointer className="h-3 w-3 mr-1" />
            Paste Handling
          </Badge>
        </div>
      </div>

      {/* What It Does */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What It Does</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LinkExtension provides comprehensive link management with configurable auto-linking and paste behavior.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Dependency Note</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                For full functionality including paste handling and link insertion, always include <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs">blockFormatExtension</code> in your extensions array.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Auto-Linking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically convert URLs to clickable links when pasted or typed.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Smart Paste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Control whether pasting URLs over selected text creates links or replaces content.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fine-tune link behavior with comprehensive configuration options.
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
                  <TableCell>Automatically link URLs when pasted</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">linkSelectedTextOnPaste</TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell>true</TableCell>
                  <TableCell>Link selected text when pasting URLs over it</TableCell>
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
            See how different configurations affect link behavior when pasting URLs.
          </p>
        </div>

        <div className="space-y-8">
          <DynamicCodeExample
            title="Auto-Linking Editor"
            description="Paste URLs anywhere - they'll automatically become links. Try selecting text and pasting a URL."
            codes={['docs/extensions/LinkExtension/examples/BasicEditorWithAutoLinks.tsx']}
            preview={<BasicEditorWithAutoLinks />}
            tabs={['preview', 'code']}
          />

          <DynamicCodeExample
            title="Manual Linking Only"
            description="URLs are pasted as plain text. Use the link button to create links manually."
            codes={['docs/extensions/LinkExtension/examples/BasicEditorWithManualLinks.tsx']}
            preview={<BasicEditorWithManualLinks />}
            tabs={['preview', 'code']}
          />
        </div>

        {/* Behavior Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Paste Behavior Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">linkSelectedTextOnPaste: true</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Selected text:</strong> "click here"</p>
                  <p><strong>Paste URL:</strong> "https://example.com"</p>
                  <p><strong>Result:</strong> <a href="#" className="text-blue-500 underline">click here</a></p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-red-700">linkSelectedTextOnPaste: false</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Selected text:</strong> "click here"</p>
                  <p><strong>Paste URL:</strong> "https://example.com"</p>
                  <p><strong>Result:</strong> "https://example.com"</p>
                </div>
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
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Configuration Options"
                html={getHighlightedCode('link-configuration') || ''}
                raw={getRawCode('link-configuration') || ''}
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
                <Shield className="h-5 w-5" />
                Custom Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="URL Validation"
                html={getHighlightedCode('link-custom-validation') || ''}
                raw={getRawCode('link-custom-validation') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration */}
            {/* Integration */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-lg px-6 py-3">
            <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Using LinkExtension</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add link functionality to your editor in just a few lines of code.
          </p>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
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
              <CardTitle>Choose the Right Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consider your users' needs. Auto-linking everything might be convenient,
                but selective linking gives users more control.
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
                or enforce HTTPS-only policies.
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
                intuitive with toolbar buttons.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For large documents, consider disabling auto-link-as-you-type
                if it impacts performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Demo Component
function LinkDemo() {
  return (
    <div className="p-6 border rounded-lg bg-muted/50">
      <p className="text-center text-muted-foreground">
        Demo component would show the editor with link functionality
      </p>
    </div>
  );
}
