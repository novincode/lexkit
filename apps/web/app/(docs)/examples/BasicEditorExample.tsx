"use client";

// Basic Editor Example - Getting Started
// This is the simplest LexKit editor with essential text formatting
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  historyExtension,
  listExtension,
  linkExtension,
  RichText,
} from "@lexkit/editor";
import "./basic-editor.css";

// 1. Define your extensions (as const for type safety)
const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  linkExtension,
  historyExtension,
] as const;

// 2. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Toolbar Component - Shows basic text formatting buttons
function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div className="basic-toolbar">
      <button
        onClick={() => commands.toggleBold()}
        className={activeStates.bold ? "active" : ""}
        title="Bold (Ctrl+B)"
      >
        Bold
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        className={activeStates.italic ? "active" : ""}
        title="Italic (Ctrl+I)"
      >
        Italic
      </button>
      <button
        onClick={() => commands.toggleUnorderedList()}
        className={activeStates.unorderedList ? "active" : ""}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => commands.toggleOrderedList()}
        className={activeStates.orderedList ? "active" : ""}
        title="Numbered List"
      >
        1. List
      </button>
      <button
        onClick={() => commands.undo()}
        disabled={!activeStates.canUndo}
        className={!activeStates.canUndo ? "disabled" : ""}
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button
        onClick={() => commands.redo()}
        disabled={!activeStates.canRedo}
        className={!activeStates.canRedo ? "disabled" : ""}
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </button>
    </div>
  );
}

// Editor Component - Renders the actual editor with toolbar
function Editor() {
  return (
    <div className="basic-editor">
      <Toolbar />
      <RichText
        classNames={{
          container: "basic-editor-container",
          contentEditable: "basic-content",
          placeholder: "basic-placeholder",
        }}
        placeholder="Start writing your content here..."
      />
    </div>
  );
}

// Main Component
export function BasicEditorExample() {
  return (
    <Provider extensions={extensions}>
      <Editor />
    </Provider>
  );
}
