"use client"

// Advanced Features Example - Full-Featured Editor
// This example shows advanced features like images, tables, code blocks, and more
import React, { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, imageExtension, linkExtension, historyExtension, htmlExtension, markdownExtension, tableExtension, codeExtension, codeFormatExtension, blockFormatExtension, RichText, defaultLexKitTheme } from "@lexkit/editor"
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

  return (
    <div className="advanced-toolbar">
      {/* Text Formatting */}
      <div>
        <button
          onClick={() => commands.toggleBold()}
          className={activeStates.bold ? 'active' : ''}
          title="Bold (Ctrl+B)"
        >
          Bold
        </button>

        <button
          onClick={() => commands.toggleItalic()}
          className={activeStates.italic ? 'active' : ''}
          title="Italic (Ctrl+I)"
        >
          Italic
        </button>

        <button
          onClick={() => commands.toggleUnderline()}
          className={activeStates.underline ? 'active' : ''}
          title="Underline (Ctrl+U)"
        >
          Underline
        </button>
      </div>

      {/* Paragraph Types */}
      <div>
        <Select onValueChange={(value) => {
          if (value === 'h1') commands.toggleHeading('h1')
          else if (value === 'h2') commands.toggleHeading('h2')
          else if (value === 'h3') commands.toggleHeading('h3')
          else if (value === 'quote') commands.toggleQuote()
          else if (value === 'paragraph') commands.toggleParagraph()
        }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lists */}
      <div>
        <button
          onClick={() => commands.toggleUnorderedList()}
          className={activeStates.unorderedList ? 'active' : ''}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => commands.toggleOrderedList()}
          className={activeStates.orderedList ? 'active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Code */}
      <div>
        <button
          onClick={() => commands.toggleCodeBlock()}
          className={activeStates.isInCodeBlock ? 'active' : ''}
          title="Code Block"
        >
          Code
        </button>
      </div>

      {/* Tables */}
      <div>
        <button
          onClick={() => commands.insertTable({ rows: 4, columns: 4, includeHeaders: true })}
          title="Insert 4x4 Table with Headers"
        >
          📊
        </button>
      </div>

      {/* Media */}
      <div>
        <button
          onClick={() => {
            const src = prompt('Enter image URL:')
            if (src) {
              const alt = prompt('Enter alt text:') || 'Image'
              commands.insertImage({ src, alt })
            }
          }}
          title="Insert Image"
        >
          📷 Image
        </button>

        <button
          onClick={() => {
            const url = prompt('Enter link URL:')
            const text = prompt('Enter link text:')
            if (url && text) {
              commands.insertLink(url, text)
            }
          }}
          title="Insert Link"
        >
          🔗 Link
        </button>
      </div>

      {/* History */}
      <div>
        <button
          onClick={() => commands.undo()}
          disabled={!activeStates.canUndo}
          className={!activeStates.canUndo ? 'disabled' : ''}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        <button
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          className={!activeStates.canRedo ? 'disabled' : ''}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
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
          contentEditable: "advanced-content",
          placeholder: "advanced-placeholder"
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
            <Button size="sm" variant="outline" onClick={handleExportHtml}>
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
