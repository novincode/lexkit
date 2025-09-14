"use client";

// Basic Draggable Block Editor Example
// Demonstrates drag-and-drop functionality for rearranging blocks
import {
  createEditorSystem,
  draggableBlockExtension,
  historyExtension,
  RichText,
} from "@lexkit/editor";
import "@/app/(docs)/examples/basic-editor.css";

// Draggable block configuration
// - showMoveButtons: true (default) → Show up/down buttons for manual movement
// - showUpButton: true → Enable move up button
// - showDownButton: true → Enable move down button
// - buttonStackPosition: 'left' → Position buttons on the left side
// - enableTextSelectionDrag: true → Allow dragging via text selection
const extensionsWithDraggableBlocks = [
  draggableBlockExtension.configure({
    showMoveButtons: true,
    showUpButton: true,
    showDownButton: true,
    buttonStackPosition: "left",
    enableTextSelectionDrag: true,
  }),
  historyExtension,
] as const;

// Create typed editor system
const { Provider, useEditor } =
  createEditorSystem<typeof extensionsWithDraggableBlocks>();

// Toolbar Component - Shows drag-related buttons and state
function Toolbar() {
  const { commands, activeStates } = useEditor();
  const isDragging = activeStates?.isDragging || false;

  const moveUp = () => {
    commands.moveCurrentBlockUp();
  };

  const moveDown = () => {
    commands.moveCurrentBlockDown();
  };

  return (
    <div className="basic-toolbar">
      <button onClick={moveUp} title="Move current block up">
        ⬆️ Move Up
      </button>
      <button onClick={moveDown} title="Move current block down">
        ⬇️ Move Down
      </button>
      <button
        onClick={() => commands.undo()}
        disabled={!activeStates?.canUndo}
        className={!activeStates?.canUndo ? "disabled" : ""}
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button
        onClick={() => commands.redo()}
        disabled={!activeStates?.canRedo}
        className={!activeStates?.canRedo ? "disabled" : ""}
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </button>
      <div className="text-sm text-muted-foreground ml-4 ">
        Dragging: {isDragging ? "YEAH" : "Nope"}
      </div>
    </div>
  );
}

// Main Draggable Block Editor Component
export function BasicEditorWithDraggableBlockExtension() {
  return (
    <Provider extensions={extensionsWithDraggableBlocks}>
      <div className="basic-editor">
        <Toolbar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder",
          }}
          placeholder="Hover over blocks to see drag handles, then drag to rearrange content! Try selecting text and dragging too."
        />
      </div>
    </Provider>
  );
}
