"use client"

// Manual Linking Editor Example
// Demonstrates manual link creation - URLs are pasted as plain text
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension, linkExtension, RichText } from "@lexkit/editor"
import "@/app/(docs)/examples/basic-editor.css"

// Manual linking configuration (autoLinkUrls: false, linkSelectedTextOnPaste: false)
const extensionsWithManualLinks = [
  boldExtension,
  italicExtension,
  listExtension,
  linkExtension.configure({
    autoLinkUrls: false,
    linkSelectedTextOnPaste: false,
    autoLinkText: false
  }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensionsWithManualLinks>()

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

// Main Manual Linking Editor Component
export function BasicEditorWithManualLinks() {
  return (
    <Provider extensions={extensionsWithManualLinks}>
      <div className="basic-editor">
        <h3 className="example-title">Manual Linking Only (autoLinkUrls: false)</h3>
        <Toolbar />
      </div>
    </Provider>
  )
}
