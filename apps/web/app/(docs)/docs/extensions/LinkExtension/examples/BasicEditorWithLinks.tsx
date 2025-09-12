"use client"

// Basic Editor with Links Example
// Demonstrates link functionality with different configurations
import { createEditorSystem, boldExtension, italicExtension, historyExtension, listExtension, linkExtension, RichText } from "@lexkit/editor"
import "./basic-editor-with-links.css"

// Example 1: Default link configuration (autoLinkUrls: true, linkSelectedTextOnPaste: true)
const extensionsWithLinks = [
  boldExtension,
  italicExtension,
  listExtension,
  linkExtension.configure({
    autoLinkUrls: true,
    linkSelectedTextOnPaste: true,
    autoLinkText: true
  }),
  historyExtension
] as const

// Example 2: Manual linking only (autoLinkUrls: false)
const extensionsManualLinks = [
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

// Create typed editor systems
const { Provider: ProviderWithLinks, useEditor: useEditorWithLinks } = createEditorSystem<typeof extensionsWithLinks>()
const { Provider: ProviderManual, useEditor: useEditorManual } = createEditorSystem<typeof extensionsManualLinks>()

// Toolbar Component - Shows basic text formatting and link buttons
function Toolbar({ useEditorHook }: { useEditorHook: any }) {
  const { commands, activeStates } = useEditorHook()

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

// Editor Component - Renders the actual editor with toolbar
function Editor({ Provider, useEditorHook, title }: { Provider: any, useEditorHook: any, title: string }) {
  return (
    <div className="basic-editor">
      <h3 className="example-title">{title}</h3>
      <Toolbar useEditorHook={useEditorHook} />
      <RichText
        classNames={{
          container: "basic-editor-container",
          contentEditable: "basic-content",
          placeholder: "basic-placeholder"
        }}
        placeholder="Try pasting URLs or selecting text and inserting links..."
      />
    </div>
  )
}

// Main Components
export function BasicEditorWithAutoLinks() {
  return (
    <ProviderWithLinks extensions={extensionsWithLinks}>
      <Editor
        Provider={ProviderWithLinks}
        useEditorHook={useEditorWithLinks}
        title="Auto-Linking Editor (linkSelectedTextOnPaste: true)"
      />
    </ProviderWithLinks>
  )
}

export function BasicEditorWithManualLinks() {
  return (
    <ProviderManual extensions={extensionsManualLinks}>
      <Editor
        Provider={ProviderManual}
        useEditorHook={useEditorManual}
        title="Manual Linking Only (autoLinkUrls: false)"
      />
    </ProviderManual>
  )
}
