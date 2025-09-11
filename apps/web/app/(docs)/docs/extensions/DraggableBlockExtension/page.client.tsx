'use client'

import React from 'react';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
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
  Sparkles,
  Move,
  MousePointer,
  Hand
} from 'lucide-react';

export default function DraggableBlockExtensionPageClient() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">DraggableBlockExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">Drag and drop blocks with beautiful UI</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Add intuitive drag-and-drop functionality to your LexKit editor. Move paragraphs, images,
          embeds, and any content block with smooth animations and visual feedback.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <MousePointer className="h-3 w-3 mr-1" />
            Drag & Drop
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Move className="h-3 w-3 mr-1" />
            Block Movement
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Smooth Animations
          </Badge>
        </div>
      </div>

      {/* What It Does */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What It Does</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          The DraggableBlockExtension adds professional drag-and-drop capabilities to your editor,
          making content rearrangement intuitive and visually appealing.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Hand className="h-6 w-6 text-primary" />
                Drag Handles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Hover over any block to reveal a draggable handle. Click and drag to move content
                blocks anywhere in your document with visual drop indicators.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Move className="h-6 w-6 text-primary" />
                Move Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Quick up/down buttons appear alongside the drag handle for precise block movement.
                Perfect for small adjustments without full drag operations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Visual Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful animations, drop indicators, and smooth transitions provide clear visual
                feedback during drag operations for a professional user experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Everything you need for professional drag-and-drop functionality.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                Universal Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Works with all content types: paragraphs, headings, images, embeds, custom blocks,
                and any Lexical node that supports the standard move operations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                Performance Optimized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Debounced resize handling, efficient DOM queries, and smooth animations ensure
                the extension doesn't impact editor performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                Highly Configurable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Customize button positions, themes, animations, and behavior through a comprehensive
                configuration system. Enable/disable features as needed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                Headless Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Complete control over UI rendering with custom renderers for handles, buttons,
                and drop indicators. Style it to match your design system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Example */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try DraggableBlockExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hover over blocks to see the drag handles, then drag to rearrange content!
          </p>
        </div>

        <DynamicCodeExample
          title="DraggableBlockExtension Demo"
          description="Drag and drop blocks with smooth animations"
          codes={['docs/extensions/draggable-block/DraggableBlockDemo.tsx']}
          preview={<DraggableBlockDemo />}
          tabs={['preview', 'Demo Code']}
        />
      </div>

      {/* Configuration */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Configuration</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Customize the extension to fit your needs with comprehensive configuration options.
        </p>

        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              DraggableConfig Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The extension accepts a comprehensive configuration object that lets you customize
              every aspect of the drag-and-drop experience.
            </p>
            <SimpleCodeBlock
              title="Configuration Options"
              html={getHighlightedCode('draggable-block-configuration') || ''}
              raw={getRawCode('draggable-block-configuration') || ''}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Play className="h-5 w-5 text-primary" />
                Button Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Control which buttons appear and their positioning.
              </p>
              <SimpleCodeBlock
                html={getHighlightedCode('draggable-block-styling') || ''}
                raw={getRawCode('draggable-block-styling') || ''}
              />
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                Custom Renderers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Provide custom components for complete UI control.
              </p>
              <SimpleCodeBlock
                html={getHighlightedCode('draggable-block-events') || ''}
                raw={getRawCode('draggable-block-events') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-lg px-6 py-3">
            <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Using DraggableBlockExtension</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add drag-and-drop to your editor in just a few lines of code.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                Import the Extension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Import the extension and add it to your extensions array.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden">
                <pre className="text-sm">{`import { draggableBlockExtension } from '@lexkit/editor/extensions/core';`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                Add to Extensions Array
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Include it in your extensions array with optional configuration.
              </p>
              <SimpleCodeBlock
                title="Adding to Extensions"
                html={getHighlightedCode('draggable-block-basic-usage') || ''}
                raw={getRawCode('draggable-block-basic-usage') || ''}
              />
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Use Commands (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Access the moveBlock command for programmatic control.
              </p>
              <SimpleCodeBlock
                title="Using Commands"
                html={getHighlightedCode('draggable-block-import') || ''}
                raw={getRawCode('draggable-block-import') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for implementing drag-and-drop effectively in your editor.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                User Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Keep the drag handles visible but not intrusive. Use smooth animations to provide
                clear feedback during drag operations. Consider touch devices for mobile users.
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
                The extension is optimized for performance, but avoid over-customizing renderers
                which could impact smooth animations. Use the built-in debouncing for resize events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Start with default settings and customize gradually. The extension works great
                out-of-the-box, so only configure what you specifically need to change.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ensure drag handles have proper ARIA labels and keyboard navigation support.
                The extension provides semantic HTML and proper focus management.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Demo Component
function DraggableBlockDemo() {
  // This would be a real demo with the extension
  return (
    <div className="p-6 border rounded-lg bg-muted/50">
      <p className="text-center text-muted-foreground">
        Demo component would show the editor with draggable blocks
      </p>
    </div>
  );
}
