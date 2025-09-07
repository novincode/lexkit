"use client"

import React from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, linkExtension, historyExtension } from "@lexkit/editor"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
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

      <RichTextPlugin
        contentEditable={
          <ContentEditable className="themed-content" />
        }
        placeholder={
          <div className="themed-placeholder">
            Experience the power of theming! This editor uses custom CSS classes for complete control over appearance.
          </div>
        }
        ErrorBoundary={ErrorBoundary}
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
