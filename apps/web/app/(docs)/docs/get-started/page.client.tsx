"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { CheckCircle, Download, Code, Palette, Zap, ArrowRight } from 'lucide-react'
import { InstallCommand } from '@/components/install-command'
import { SimpleCodeBlock } from '../../components/simple-code-block'
import { getHighlightedCode, getRawCode, getTitle } from '@/lib/generated/code-registry'

function CodeDisplay({ id, className }: { id: string; className?: string }) {
  const html = getHighlightedCode(id)
  const raw = getRawCode(id)
  const title = getTitle(id)

  if (!html || !raw) return null

  return (
    <SimpleCodeBlock
      html={html}
      raw={raw}
      title={title || undefined}
      className={className}
    />
  )
}

export function GetStartedPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Get Started with LexKit</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Build powerful rich text editors in minutes. From installation to customization, we'll guide you through every step.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Download className="h-3 w-3 mr-1" />
            Quick Setup
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            Customizable
          </Badge>
        </div>
      </div>

      {/* Installation Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            1. Installation
          </CardTitle>
          <CardDescription>
            Choose your package manager and install LexKit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InstallCommand packages={['@lexkit/editor']} />

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <CodeDisplay id="install-npm" />
            <CodeDisplay id="install-pnpm" />
            <CodeDisplay id="install-yarn" />
          </div>
        </CardContent>
      </Card>

      {/* Basic Setup Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            2. Basic Setup
          </CardTitle>
          <CardDescription>
            Import LexKit and create your first editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>
              Start by importing the necessary components. LexKit provides a simple API that works out of the box.
            </p>
          </div>

          <CodeDisplay id="basic-import" />

          <div className="prose prose-sm max-w-none">
            <p>
              Create a basic editor component. The <code>DefaultTemplate</code> gives you a fully functional editor with smart defaults.
            </p>
          </div>

          <CodeDisplay id="basic-setup" />

          <div className="prose prose-sm max-w-none">
            <p>
              You can also initialize the editor with content using the <code>onReady</code> callback.
            </p>
          </div>

          <CodeDisplay id="with-content" />
        </CardContent>
      </Card>

      {/* Extensions Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            3. Extensions & Customization
          </CardTitle>
          <CardDescription>
            Extend your editor with custom functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>
              LexKit's extension system allows you to add custom functionality. Create extensions to modify editor behavior, add new commands, or integrate with external services.
            </p>
          </div>

          <CodeDisplay id="custom-extension" />

          <div className="prose prose-sm max-w-none">
            <p>
              Use your extensions by configuring them in the editor system.
            </p>
          </div>

          <CodeDisplay id="extension-setup" />
        </CardContent>
      </Card>

      {/* Styling Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            4. Styling & Theming
          </CardTitle>
          <CardDescription>
            Customize the appearance of your editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>
              LexKit works seamlessly with Tailwind CSS. Style your editor container, content, and toolbar with utility classes.
            </p>
          </div>

          <CodeDisplay id="tailwind-styling" />

          <div className="prose prose-sm max-w-none">
            <p>
              For theme support, wrap your editor with the ThemeProvider component.
            </p>
          </div>

          <CodeDisplay id="theme-provider" />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-0 shadow-sm bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Ready to Build!
          </CardTitle>
          <CardDescription>
            Your LexKit editor is ready. Here are some next steps to explore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 md:gap-6 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Explore Examples</h4>
              <p className="text-sm text-muted-foreground">
                Check out our interactive examples to see LexKit in action with different configurations and use cases.
              </p>
              <Button asChild variant="outline">
                <Link href="/docs/examples">
                  View Examples
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Learn More</h4>
              <p className="text-sm text-muted-foreground">
                Dive deeper into LexKit's API, configuration options, and advanced features.
              </p>
              <Button asChild variant="outline">
                <Link href="/docs/introduction">
                  Read Documentation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
