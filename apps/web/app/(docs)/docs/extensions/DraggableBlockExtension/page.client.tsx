"use client"

import { DynamicCodeExample } from '../../../components/dynamic-code-example'
import { SimpleCodeBlock } from '../../../components/simple-code-block'
import { getHighlightedCode, getRawCode } from '@/lib/generated/code-registry'
import { BasicEditorWithDraggableBlockExtension } from './examples/BasicEditorWithDraggableBlockExtension'
import { Badge } from "@repo/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card"
import { MousePointer, Zap, Settings, Code, Move, Palette } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table"

export default function DraggableBlockExtensionPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">DraggableBlockExtension</h1>
          <p className="text-xl text-muted-foreground mt-2">Intuitive drag-and-drop for content blocks</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your editor with smooth, professional drag-and-drop functionality.
          Rearrange paragraphs, images, and any content blocks with visual feedback and animations.
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
            Reactive State
          </Badge>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Everything you need for seamless block rearrangement in your editor.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MousePointer className="h-6 w-6 text-primary" />
                Visual Drag Handles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Hover over blocks to reveal drag handles. Click and drag to move content
                with smooth visual feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Move className="h-6 w-6 text-primary" />
                Multiple Movement Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Drag blocks directly, use up/down buttons, or even drag via text selection
                for flexible content rearrangement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                Reactive State System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Real-time drag state updates without polling. Access `activeStates.isDragging`
                for immediate feedback on drag operations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Start</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Get drag-and-drop working in your editor in just a few lines.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Import and add DraggableBlockExtension"
                html={getHighlightedCode('draggable-block-basic-usage') || ''}
                raw={getRawCode('draggable-block-basic-usage') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>With Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleCodeBlock
                title="Customize drag behavior"
                html={getHighlightedCode('draggable-block-configuration') || ''}
                raw={getRawCode('draggable-block-configuration') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Demo */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Try DraggableBlockExtension</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demo showcasing drag-and-drop features. Hover over blocks, grab handles, and rearrange content!
          </p>
        </div>

        <DynamicCodeExample
          title="DraggableBlockExtension Demo"
          description="Try dragging blocks, using move buttons, and text selection drag"
          codes={['docs/extensions/DraggableBlockExtension/examples/BasicEditorWithDraggableBlockExtension.tsx']}
          preview={<BasicEditorWithDraggableBlockExtension />}
          tabs={['preview', 'Editor']}
        />
      </div>

      {/* Reactive State System */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Reactive State System</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Access drag state reactively without performance-killing polling.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Drag State</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCodeBlock
              title="Access reactive drag state"
              html={getHighlightedCode('draggable-block-reactive-state') || ''}
              raw={getRawCode('draggable-block-reactive-state') || ''}
            />
            <p className="text-muted-foreground mt-4 leading-relaxed">
              The <code className="bg-muted px-1 py-0.5 rounded text-sm">activeStates.isDragging</code> updates
              immediately when drag operations start and stop, providing real-time feedback without any polling.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Configuration Options</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Customize every aspect of the drag-and-drop experience.
        </p>

        <Card className='p-0'>
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
                  <TableCell className="font-mono text-sm">showMoveButtons</TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Show up/down arrow buttons for manual block movement.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">showUpButton</TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Enable the move up button specifically.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">showDownButton</TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Enable the move down button specifically.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">buttonStackPosition</TableCell>
                  <TableCell>
                    <Badge variant="secondary">'left' | 'right'</Badge>
                  </TableCell>
                  <TableCell>
                    Position of the move buttons relative to blocks.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">enableTextSelectionDrag</TableCell>
                  <TableCell>
                    <Badge variant="secondary">boolean</Badge>
                  </TableCell>
                  <TableCell>
                    Allow dragging blocks by selecting text within them.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">theme</TableCell>
                  <TableCell>
                    <Badge variant="secondary">object</Badge>
                  </TableCell>
                  <TableCell>
                    CSS class names for customizing handles, indicators, and animations.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">handleRenderer</TableCell>
                  <TableCell>
                    <Badge variant="secondary">function</Badge>
                  </TableCell>
                  <TableCell>
                    Custom renderer for drag handles with full control.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">buttonsRenderer</TableCell>
                  <TableCell>
                    <Badge variant="secondary">function</Badge>
                  </TableCell>
                  <TableCell>
                    Custom renderer for move up/down buttons.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">dropIndicatorRenderer</TableCell>
                  <TableCell>
                    <Badge variant="secondary">function</Badge>
                  </TableCell>
                  <TableCell>
                    Custom renderer for the drop indicator line.
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
                title="Custom styling with theme classes"
                html={getHighlightedCode('draggable-block-styling') || ''}
                raw={getRawCode('draggable-block-styling') || ''}
              />
              <SimpleCodeBlock
                title="Custom handle renderer for full control"
                html={getHighlightedCode('draggable-block-events') || ''}
                raw={getRawCode('draggable-block-events') || ''}
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
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">moveBlock(sourceKey, targetKey, insertAfter)</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Programmatically move a block to a new position.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">moveCurrentBlockUp()</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Move the currently selected block up one position.
                  </p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">moveCurrentBlockDown()</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Move the currently selected block down one position.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Active States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">isDragging</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time boolean indicating if a drag operation is in progress.
                  </p>
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
              title="Using commands programmatically"
              html={getHighlightedCode('draggable-block-commands') || ''}
              raw={getRawCode('draggable-block-commands') || ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Tips for the best drag-and-drop experience.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Always provide clear visual cues like handles and drop indicators
                to guide users through the drag process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The reactive state system ensures optimal performance without polling.
                Animations are hardware-accelerated for smooth 60fps experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ensure drag handles are keyboard accessible and provide alternative
                navigation methods for users who can't use a mouse.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Test with real users to ensure the drag interaction feels natural
                and intuitive in your specific use case.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
