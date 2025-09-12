"use client"

// Auto-Linking Editor Example
// Demonstrates automatic link creation when pasting URLs
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension, linkExtension, RichText, blockFormatExtension } from "@lexkit/editor"
import "@/app/(docs)/examples/basic-editor.css"

// Auto-linking configuration (autoLinkUrls: true, linkSelectedTextOnPaste: true)
const extensionsWithAutoLinks = [
  boldExtension,
  blockFormatExtension,
  italicExtension,
  listExtension,
  linkExtension.configure({
    autoLinkUrls: true,
    linkSelectedTextOnPaste: true,
    autoLinkText: true
  }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensionsWithAutoLinks>()

// Toolbar Component - Shows basic text formatting and link buttons
function Toolbar() {
  const { commands, activeStates } = useEditor()

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      commands.insertLink(url)
    }
  }

  return (
    <div className="basic-toolbar">
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
      <button
        onClick={insertLink}
        className={activeStates.isLink ? 'active' : ''}
        title="Insert Link"
      >
        🔗 Link
      </button>
      <button
        onClick={() => commands.removeLink()}
        disabled={!activeStates.isLink}
        className={!activeStates.isLink ? 'disabled' : ''}
        title="Remove Link"
      >
        ❌ Unlink
      </button>
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
  )
}

// Main Auto-Linking Editor Component
export function BasicEditorWithAutoLinks() {
  return (
    <Provider extensions={extensionsWithAutoLinks}>
      <div className="basic-editor">
        <h3 className="example-title">Auto-Linking Editor (linkSelectedTextOnPaste: true)</h3>
        <Toolbar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder"
          }}
          placeholder="Try pasting URLs or selecting text and pasting URLs..."
        />
      </div>
    </Provider>
  )
}
