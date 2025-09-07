"use client"

import React from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, linkExtension, historyExtension, errorBoundaryExtension, RichText } from "@lexkit/editor"
import { EditorThemeClasses } from "lexical"
import "./themed-editor.css"

// Define a simple theme with classnames
const simpleTheme: EditorThemeClasses = {
  // Editor content styles
  paragraph: 'lexkit-paragraph',
  heading: {
    h1: 'lexkit-heading-h1',
    h2: 'lexkit-heading-h2',
    h3: 'lexkit-heading-h3',
  },
  list: {
    ul: 'lexkit-list-ul',
    ol: 'lexkit-list-ol',
    listitem: 'lexkit-list-li',
  },
  quote: 'lexkit-quote',
  link: 'lexkit-link',
  text: {
    bold: 'lexkit-text-bold',
    italic: 'lexkit-text-italic',
    underline: 'lexkit-text-underline',
  },
}

// Define extensions as const for type safety
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  linkExtension,
  historyExtension,
  errorBoundaryExtension()
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Themed Toolbar Component
function ThemedToolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="themed-toolbar">
      <div>
        <button
          onClick={() => commands.toggleBold()}
          style={{
            fontWeight: activeStates.bold ? 'bold' : 'normal',
            background: activeStates.bold ? '#4b5563' : '#374151',
            color: activeStates.bold ? '#f9fafb' : '#f9fafb'
          }}
        >
          Bold
        </button>

        <button
          onClick={() => commands.toggleItalic()}
          style={{
            fontStyle: activeStates.italic ? 'italic' : 'normal',
            background: activeStates.italic ? '#4b5563' : '#374151',
            color: activeStates.italic ? '#f9fafb' : '#f9fafb'
          }}
        >
          Italic
        </button>

        <button
          onClick={() => commands.toggleUnderline()}
          style={{
            textDecoration: activeStates.underline ? 'underline' : 'none',
            background: activeStates.underline ? '#4b5563' : '#374151',
            color: activeStates.underline ? '#f9fafb' : '#f9fafb'
          }}
        >
          Underline
        </button>
      </div>

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

      <div>
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

// Themed Editor Component
function ThemedEditor() {
  return (
    <div className="themed-editor">
      <ThemedToolbar />
      <RichText
        placeholder="Experience the power of theming! This editor uses custom CSS classes for complete control over appearance."
        classNames={{
          container: "themed-editor-container",
          contentEditable: "themed-content",
          placeholder: "themed-placeholder"
        }}
      />
    </div>
  )
}

export function ThemedEditorExample() {
  return (
    <div className="space-y-4">
      <Provider extensions={extensions} config={{ theme: simpleTheme }}>
        <ThemedEditor />
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
