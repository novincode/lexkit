"use client"

"use client"

// Auto-Linking Editor Example
// Demonstrates automatic link creation when pasting URLs
// This example shows how LinkExtension works with BlockFormatExtension for full functionality
import { createEditorSystem, historyExtension, linkExtension, blockFormatExtension, RichText } from "@lexkit/editor"
import "@/app/(docs)/examples/basic-editor.css"

// Auto-linking configuration (autoLinkUrls: true, linkSelectedTextOnPaste: true)
// - autoLinkUrls: true → Automatically converts pasted URLs to links
// - linkSelectedTextOnPaste: true → When pasting URLs over selected text, makes the selected text a link
// - autoLinkText: true → Automatically converts URLs typed in the editor to links
// NOTE: BlockFormatExtension is required for LinkExtension to work properly with paste operations
const extensionsWithAutoLinks = [
  blockFormatExtension, // Required for LinkExtension to work with paste operations
  linkExtension.configure({
    // autoLinkUrls: true → Automatically converts pasted URLs to links
    // When you paste a URL anywhere in the editor, it becomes a clickable link
    autoLinkUrls: true,

    // linkSelectedTextOnPaste: true → When pasting URLs over selected text, makes the selected text a link
    // Select some text, paste a URL, and the selected text becomes a link with that URL
    linkSelectedTextOnPaste: true,

    // autoLinkText: true → Automatically converts URLs typed in the editor to links
    // As you type URLs, they automatically become clickable links
    autoLinkText: true
  }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensionsWithAutoLinks>()

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
