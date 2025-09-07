"use client"

import React, { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension } from "@lexkit/editor"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"

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
    <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => commands.toggleBold()}
        style={{
          fontWeight: activeStates.bold ? 'bold' : 'normal',
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.bold ? '#f3f4f6' : 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Bold
      </button>

      <button
        onClick={() => commands.toggleItalic()}
        style={{
          fontStyle: activeStates.italic ? 'italic' : 'normal',
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.italic ? '#f3f4f6' : 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Italic
      </button>

      <button
        onClick={() => commands.toggleUnorderedList()}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.unorderedList ? '#f3f4f6' : 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        • List
      </button>

      <button
        onClick={() => commands.toggleOrderedList()}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.orderedList ? '#f3f4f6' : 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        1. List
      </button>

      <button
        onClick={() => commands.undo()}
        disabled={!activeStates.canUndo}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.canUndo ? 'white' : '#f9fafb',
          borderRadius: '4px',
          cursor: activeStates.canUndo ? 'pointer' : 'not-allowed',
          opacity: activeStates.canUndo ? 1 : 0.5
        }}
      >
        ↶ Undo
      </button>

      <button
        onClick={() => commands.redo()}
        disabled={!activeStates.canRedo}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          background: activeStates.canRedo ? 'white' : '#f9fafb',
          borderRadius: '4px',
          cursor: activeStates.canRedo ? 'pointer' : 'not-allowed',
          opacity: activeStates.canRedo ? 1 : 0.5
        }}
      >
        ↷ Redo
      </button>
    </div>
  )
}

// Editor Component
function Editor() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      <Toolbar />

      <RichTextPlugin
        contentEditable={
          <ContentEditable
            style={{
              padding: '16px',
              outline: 'none',
              minHeight: '200px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
        }
        placeholder={
          <div style={{ color: '#9ca3af', padding: '16px' }}>
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
      <div className="border rounded-lg p-4">
        <Provider extensions={extensions}>
          <Editor />
        </Provider>
      </div>

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
