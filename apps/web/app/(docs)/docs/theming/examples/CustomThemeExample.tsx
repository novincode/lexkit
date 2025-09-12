"use client"

// Custom Theme Example - Shows how to create a completely custom theme
// This example demonstrates full theme customization with custom CSS classes

import React from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, linkExtension, historyExtension, RichText } from "@lexkit/editor"
import { LexKitTheme } from "@lexkit/editor"

// Define a completely custom theme
const customTheme: LexKitTheme = {
  // Editor content styles
  paragraph: 'custom-paragraph',
  heading: {
    h1: 'custom-heading-h1',
    h2: 'custom-heading-h2',
    h3: 'custom-heading-h3',
  },
  list: {
    ul: 'custom-list-ul',
    ol: 'custom-list-ol',
    listitem: 'custom-list-item',
  },
  quote: 'custom-quote',
  link: 'custom-link',
  text: {
    bold: 'custom-text-bold',
    italic: 'custom-text-italic',
    underline: 'custom-text-underline',
  },

  // Custom LexKit properties
  toolbar: {
    button: 'custom-toolbar-button',
    buttonActive: 'custom-toolbar-button-active',
    buttonDisabled: 'custom-toolbar-button-disabled',
    group: 'custom-toolbar-group'
  },
  container: 'custom-editor-container',
  wrapper: 'custom-editor-wrapper',
  richText: {
    contentEditable: 'custom-content-editable',
    placeholder: 'custom-placeholder',
  },
}

// Define extensions as const for type safety
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  linkExtension.configure({ pasteListener: { insert: true, replace: true } }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Custom Toolbar Component
function CustomToolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="custom-toolbar">
      <div className="custom-toolbar-group">
        <button
          onClick={() => commands.toggleBold()}
          className={`custom-toolbar-button ${activeStates.bold ? 'custom-toolbar-button-active' : ''}`}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => commands.toggleItalic()}
          className={`custom-toolbar-button ${activeStates.italic ? 'custom-toolbar-button-active' : ''}`}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => commands.toggleUnderline()}
          className={`custom-toolbar-button ${activeStates.underline ? 'custom-toolbar-button-active' : ''}`}
        >
          <u>U</u>
        </button>
      </div>

      <div className="custom-toolbar-group">
        <button
          onClick={() => commands.toggleUnorderedList()}
          className={`custom-toolbar-button ${activeStates.unorderedList ? 'custom-toolbar-button-active' : ''}`}
        >
          • List
        </button>

        <button
          onClick={() => commands.toggleOrderedList()}
          className={`custom-toolbar-button ${activeStates.orderedList ? 'custom-toolbar-button-active' : ''}`}
        >
          1. List
        </button>
      </div>

      <div className="custom-toolbar-group">
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

      <div className="custom-toolbar-group">
        <button
          onClick={() => commands.undo()}
          disabled={!activeStates.canUndo}
          className={`custom-toolbar-button ${!activeStates.canUndo ? 'custom-toolbar-button-disabled' : ''}`}
        >
          ↶ Undo
        </button>

        <button
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          className={`custom-toolbar-button ${!activeStates.canRedo ? 'custom-toolbar-button-disabled' : ''}`}
        >
          ↷ Redo
        </button>
      </div>
    </div>
  )
}

// Custom Editor Component
function CustomEditor() {
  return (
    <div className="custom-editor-container">
      <CustomToolbar />
      <div className="custom-editor-wrapper">
        <RichText
          placeholder="Experience complete theme customization! This editor uses entirely custom CSS classes."
          classNames={{
            contentEditable: "custom-content-editable",
            placeholder: "custom-placeholder"
          }}
        />
      </div>
    </div>
  )
}

export function CustomThemeExample() {
  return (
    <div className="space-y-4">
      <Provider extensions={extensions} config={{ theme: customTheme }}>
        <CustomEditor />
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
