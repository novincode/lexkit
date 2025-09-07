"use client"

import React from "react"
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension, richTextExtension } from "@lexkit/editor"
import "./modern-editor.css"

// Define extensions as const for type safety
const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  historyExtension,
  richTextExtension({
    placeholder: "Start writing with the modern editor...",
    classNames: {
      contentEditable: "modern-editor-input",
      placeholder: "modern-editor-placeholder"
    }
  })
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Toolbar Component
function Toolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="modern-toolbar">
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
      <button onClick={() => commands.undo()}>
        Undo
      </button>
      <button onClick={() => commands.redo()}>
        Redo
      </button>
    </div>
  )
}

// Editor Component
function Editor() {
  return (
    <div className="modern-editor">
      <Toolbar />
      <div className="editor-container">
        {/* RichTextPlugin is automatically included via richTextExtension */}
      </div>
    </div>
  )
}

// Main Component
export function ModernEditorExample() {
  return (
    <Provider extensions={extensions}>
      <Editor />
    </Provider>
  )
}
