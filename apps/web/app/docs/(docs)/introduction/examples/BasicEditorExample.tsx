"use client"

import React from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension } from "@lexkit/editor"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import "./basic-editor.css"

// Define extensions as const for type safety
const extensions = [boldExtension, italicExtension, listExtension, historyExtension] as const

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

// Toolbar Component
function Toolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="basic-toolbar">
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
  )
}

// Editor Component
function Editor() {
  return (
    <div className="basic-editor">
      <Toolbar />

      <RichTextPlugin
        contentEditable={
          <ContentEditable className="basic-content" />
        }
        placeholder={
          <div className="basic-placeholder">
            Start writing your content here...
          </div>
        }
        ErrorBoundary={ErrorBoundary}
      />
    </div>
  )
}

export function BasicEditorExample() {
  return (
    <div className="space-y-4">
      <Provider extensions={extensions}>
        <Editor />
      </Provider>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Reset Editor
        </Button>
      </div>
    </div>
  )
}
