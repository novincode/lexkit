"use client"

// Manual Linking Editor Example
// Demonstrates manual link creation - URLs are pasted as plain text
// This example shows how LinkExtension works with BlockFormatExtension for full functionality
import { createEditorSystem, historyExtension, linkExtension, blockFormatExtension, RichText } from "@lexkit/editor"
import "@/app/(docs)/examples/basic-editor.css"

// Manual linking configuration (autoLinkUrls: false, linkSelectedTextOnPaste: false)
// - autoLinkUrls: false → Pasted URLs remain as plain text
// - linkSelectedTextOnPaste: false → Pasting URLs over selected text replaces the text
// - autoLinkText: false → URLs typed in the editor remain as plain text
// NOTE: BlockFormatExtension is required for LinkExtension to work properly with paste operations
const extensionsWithManualLinks = [
  blockFormatExtension, // Required for LinkExtension to work with paste operations
  linkExtension.configure({
    // autoLinkUrls: false → Pasted URLs remain as plain text
    // URLs you paste will stay as regular text, not become links automatically
    autoLinkUrls: false,

    // linkSelectedTextOnPaste: false → Pasting URLs over selected text replaces the text
    // If you select text and paste a URL, it will replace the selected text with the URL as plain text
    linkSelectedTextOnPaste: false,

    // autoLinkText: false → URLs typed in the editor remain as plain text
    // URLs you type manually will stay as regular text, not become links automatically
    autoLinkText: false
  }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensionsWithManualLinks>()

// Toolbar Component - Shows only link-related buttons
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
        onClick={insertLink}
        className={activeStates.isLink ? 'active' : ''}
        title="Insert Link"
      >
        🔗 Insert Link
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
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder"
          }}
          placeholder="Try pasting URLs - they will remain as plain text. Use the link button to create links manually..."
        />
      </div>
    </Provider>
  )
}
