"use client"

// Auto-Linking Editor Example
// Demonstrates automatic link creation when pasting URLs
import { createEditorSystem, historyExtension, linkExtension, RichText } from "@lexkit/editor"
import "@/app/(docs)/examples/basic-editor.css"

// Auto-linking configuration
// - autoLinkUrls: true (default) → Automatically creates links when pasting URLs at cursor
// - linkSelectedTextOnPaste: true (default) → Links selected text when pasting URLs over selection
// - autoLinkText: true → Automatically converts URLs typed in the editor to links
const extensionsWithAutoLinks = [
  linkExtension.configure({
    autoLinkUrls: true,              // Auto-create links when pasting URLs at cursor
    linkSelectedTextOnPaste: true,   // Link selected text when pasting URLs over selection
    autoLinkText: true               // Auto-convert typed URLs to links
  }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensionsWithAutoLinks>()

// Toolbar Component - Shows only link-related buttons
function Toolbar() {
    const { commands, activeStates } = useEditor()

    const insertLink = () => {
        const url = prompt('Enter URL: ')
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
                <Toolbar />
                <RichText
                    classNames={{
                        container: "basic-editor-container",
                        contentEditable: "basic-content",
                        placeholder: "basic-placeholder"
                    }}
                    placeholder="Try pasting URLs anywhere, selecting text and pasting URLs to link the selected text, or paste links or type them, or use toolbar buttons"
                />
            </div>
        </Provider>
    )
}
