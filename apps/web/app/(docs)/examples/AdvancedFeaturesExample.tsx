"use client"

// Advanced Features Example - Full-Featured Editor
// This example shows advanced features like images, tables, code blocks, and more
import React, { useState, useEffect } from "react"
import { Button } from "@repo/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, imageExtension, linkExtension, historyExtension, htmlExtension, markdownExtension, tableExtension, codeExtension, codeFormatExtension, blockFormatExtension, RichText, defaultLexKitTheme } from "@lexkit/editor"
import { Bold, Italic, Underline, List, ListOrdered, Code, Table, Image, Link, Undo, Redo } from "lucide-react"
import "./advanced-editor.css"

// 1. Define your extensions (as const for type safety)
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  linkExtension.configure({ pasteListener: { insert: true, replace: true } }),
  tableExtension,
  codeExtension,
  codeFormatExtension,
  blockFormatExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
] as const

// 2. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Advanced Toolbar Component
function AdvancedToolbar() {
  const { commands, activeStates } = useEditor()

  // Get current block type for dropdown sync
  const [currentBlockType, setCurrentBlockType] = useState('p')

  // Update current block type when selection changes
  useEffect(() => {
    const updateBlockType = async () => {
      const blockType = commands.getCurrentBlockType()
      setCurrentBlockType(blockType)
    }
    updateBlockType()
  }, [commands, activeStates]) // Re-run when activeStates change

  return (
    <div className="advanced-editor-toolbar">
      {/* Text Formatting */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant={activeStates.bold ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleBold()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </Button>

        <Button
          variant={activeStates.italic ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleItalic()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </Button>

        <Button
          variant={activeStates.underline ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleUnderline()}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </Button>
      </div>

      {/* Paragraph Types */}
      <div className="advanced-editor-toolbar-group">
        <Select value={currentBlockType} onValueChange={(value) => {
          if (value === 'h1') commands.toggleHeading('h1')
          else if (value === 'h2') commands.toggleHeading('h2')
          else if (value === 'h3') commands.toggleHeading('h3')
          else if (value === 'quote') commands.toggleQuote()
          else if (value === 'p') commands.toggleParagraph()
        }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lists */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant={activeStates.unorderedList ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleUnorderedList()}
          title="Bullet List"
        >
          <List size={16} />
        </Button>

        <Button
          variant={activeStates.orderedList ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleOrderedList()}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
      </div>

      {/* Code */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant={activeStates.isInCodeBlock ? "default" : "ghost"}
          size="sm"
          onClick={() => commands.toggleCodeBlock()}
          title="Code Block"
        >
          <Code size={16} />
        </Button>
      </div>

      {/* Tables */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => commands.insertTable({ rows: 4, columns: 4, includeHeaders: true })}
          title="Insert 4x4 Table with Headers"
        >
          <Table size={16} />
        </Button>
      </div>

      {/* Media */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const src = prompt('Enter image URL:')
            if (src) {
              const alt = prompt('Enter alt text:') || 'Image'
              commands.insertImage({ src, alt })
            }
          }}
          title="Insert Image"
        >
          <Image size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Enter link URL:')
            const text = prompt('Enter link text:')
            if (url && text) {
              commands.insertLink(url, text)
            }
          }}
          title="Insert Link"
        >
          <Link size={16} />
        </Button>
      </div>

      {/* History */}
      <div className="advanced-editor-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => commands.undo()}
          disabled={!activeStates.canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo size={16} />
        </Button>
      </div>
    </div>
  )
}

// Advanced Editor Component
function AdvancedEditor() {
  return (
    <div className="advanced-editor">
      <AdvancedToolbar />
      <RichText
        placeholder="Start writing with advanced features like images, links, HTML export, and Markdown support..."
        classNames={{
          contentEditable: "advanced-editor-content",
          placeholder: "advanced-editor-placeholder"
        }}
      />
    </div>
  )
}

// Internal component that uses the editor
function AdvancedFeaturesExampleInner() {
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [exportedHtml, setExportedHtml] = useState("")

  // Get commands from the editor context
  const { commands } = useEditor()

  const handleExportHtml = async () => {
    try {
      const html = await commands.exportToHTML()
      setExportedHtml(html)
      setHtmlDialogOpen(true)
    } catch (error) {
      console.error('Failed to export HTML:', error)
      alert('Failed to export HTML')
    }
  }

  return (
    <div className="space-y-6">
      <AdvancedEditor />

      <div className="flex gap-3">
        <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" onClick={handleExportHtml}>
              Export HTML
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Exported HTML</DialogTitle>
            </DialogHeader>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto whitespace-pre-wrap">
              {exportedHtml}
            </pre>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export function AdvancedFeaturesExample() {
  return (
    <Provider 
      extensions={extensions}
      config={{ theme: defaultLexKitTheme }}
    >
      <AdvancedFeaturesExampleInner />
    </Provider>
  )
}
