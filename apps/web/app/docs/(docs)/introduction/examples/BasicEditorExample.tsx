"use client"

import React from "react"
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension, richTextExtension } from "@lexkit/editor"
import "./basic-editor.css"

// Define extensions as const for type safety
const extensions = [boldExtension, italicExtension, listExtension, historyExtension, richTextExtension({
  classNames: {
    contentEditable: "basic-content",
    placeholder: "basic-placeholder"
  }
})] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

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
      <div className="editor-container">
        {/* RichTextPlugin is automatically included via richTextExtension */}
      </div>
    </div>
  )
}

// Main Component
export function BasicEditorExample() {
  return (
    <Provider extensions={extensions}>
      <Editor />
    </Provider>
  )
}
