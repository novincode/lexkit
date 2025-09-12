'use client'

import { Badge } from '@repo/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { SimpleCodeBlock } from '../../../components/simple-code-block'
import { getHighlightedCode, getRawCode } from '@/lib/generated/code-registry'
import DRAGGABLE_BLOCK_EXTENSION_CODES from './codes'
import {
  Move,
  Settings,
  MousePointer,
  Zap,
  Play,
  Code,
  Palette
} from 'lucide-react'

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
            <Zap className="h-3 w-3 mr-1" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Intuitive Dragging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hover over blocks to see drag handles, then drag to rearrange content seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smooth Animations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beautiful animations and visual feedback make dragging feel natural and responsive.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Highly Configurable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize drag handles, animations, and behavior to match your design system.
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
            <CardTitle>DraggableConfig Interface</CardTitle>
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
                  <TableCell className="font-mono">dragHandle</TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell>true</TableCell>
                  <TableCell>Show drag handles on blocks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">animationDuration</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Animation duration in milliseconds</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">easing</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>'ease-out'</TableCell>
                  <TableCell>CSS easing function for animations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">onDragStart</TableCell>
                  <TableCell>(node) =&gt; void</TableCell>
                  <TableCell>undefined</TableCell>
                  <TableCell>Callback when drag starts</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">onDragEnd</TableCell>
                  <TableCell>(node) =&gt; void</TableCell>
                  <TableCell>undefined</TableCell>
                  <TableCell>Callback when drag ends</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">onDrop</TableCell>
                  <TableCell>(dragged, target) =&gt; void</TableCell>
                  <TableCell>undefined</TableCell>
                  <TableCell>Callback when blocks are reordered</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Live Example */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try DraggableBlockExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hover over blocks to see the drag handles, then drag to rearrange content!
          </p>
        </div>

        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Demo component would show the editor with draggable blocks
          </p>
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
                html={getHighlightedCode('draggable-block-basic-usage') || ''}
                raw={getRawCode('draggable-block-basic-usage') || ''}
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
                html={getHighlightedCode('draggable-block-configuration') || ''}
                raw={getRawCode('draggable-block-configuration') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Event Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Event Handling"
                html={getHighlightedCode('draggable-block-events') || ''}
                raw={getRawCode('draggable-block-events') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Custom Styling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Custom Styling"
                html={getHighlightedCode('draggable-block-styling') || ''}
                raw={getRawCode('draggable-block-styling') || ''}
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
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleCodeBlock
                title="Import and Setup"
                html={getHighlightedCode('draggable-block-import') || ''}
                raw={getRawCode('draggable-block-import') || ''}
              />
              <SimpleCodeBlock
                title="Add to Extensions Array"
                html={getHighlightedCode('draggable-block-basic-usage') || ''}
                raw={getRawCode('draggable-block-basic-usage') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Always provide clear visual cues like drag handles and drop indicators
                to help users understand the drag-and-drop functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use appropriate animation durations and consider disabling animations
                on low-performance devices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ensure drag handles are keyboard accessible and provide alternative
                methods for reordering content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Test with real users to ensure the drag-and-drop interaction feels
                natural and intuitive.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
