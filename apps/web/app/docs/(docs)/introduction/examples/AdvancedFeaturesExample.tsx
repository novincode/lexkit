"use client"

import React, { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, imageExtension, linkExtension, historyExtension, htmlExtension, markdownExtension } from "@lexkit/editor"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import "./advanced-editor.css"

// Define extensions as const for type safety
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  linkExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Error Boundary (required by Lexical)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>
  } catch (error) {
    console.error('Editor Error:', error)
    return (
      <div style={{
        color: 'red',
        border: '1px solid red',
        padding: '20px',
        backgroundColor: '#ffe6e6',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        <h3>Editor Error</h3>
        <p>Something went wrong. Please refresh the page.</p>
      </div>
    )
  }
}

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
        >
          Bold
        </button>

        <button
          onClick={() => commands.toggleItalic()}
          className={activeStates.italic ? 'active' : ''}
        >
          Italic
        </button>

        <button
          onClick={() => commands.toggleUnderline()}
          className={activeStates.underline ? 'active' : ''}
        >
          Underline
        </button>
      </div>

      {/* Lists */}
      <div>
        <button
          onClick={() => commands.toggleUnorderedList()}
          className={activeStates.unorderedList ? 'active' : ''}
        >
          • List
        </button>

        <button
          onClick={() => commands.toggleOrderedList()}
          className={activeStates.orderedList ? 'active' : ''}
        >
          1. List
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
        >
          ↶ Undo
        </button>

        <button
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          className={!activeStates.canRedo ? 'disabled' : ''}
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

      <RichTextPlugin
        contentEditable={
          <ContentEditable className="advanced-content" />
        }
        placeholder={
          <div className="advanced-placeholder">
            Start writing your advanced content here... Try adding images, links, and formatting!
          </div>
        }
        ErrorBoundary={ErrorBoundary}
      />
    </div>
  )
}

// Internal component that uses the editor
function AdvancedFeaturesExampleInner() {
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [markdownDialogOpen, setMarkdownDialogOpen] = useState(false)
  const [exportedHtml, setExportedHtml] = useState("")
  const [exportedMarkdown, setExportedMarkdown] = useState("")

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

  const handleExportMarkdown = async () => {
    try {
      const markdown = await commands.exportToMarkdown()
      setExportedMarkdown(markdown)
      setMarkdownDialogOpen(true)
    } catch (error) {
      console.error('Failed to export Markdown:', error)
      alert('Failed to export Markdown')
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

        <Dialog open={markdownDialogOpen} onOpenChange={setMarkdownDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={handleExportMarkdown}>
              Export Markdown
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Exported Markdown</DialogTitle>
            </DialogHeader>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto whitespace-pre-wrap">
              {exportedMarkdown}
            </pre>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export function AdvancedFeaturesExample() {
  return (
    <Provider extensions={extensions}>
      <AdvancedFeaturesExampleInner />
    </Provider>
  )
}
