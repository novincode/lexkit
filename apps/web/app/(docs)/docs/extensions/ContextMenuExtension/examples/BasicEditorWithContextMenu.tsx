"use client";

// Basic Context Menu Editor Example
// Demonstrates context menu functionality with tables and custom providers
import {
  createEditorSystem,
  contextMenuExtension,
  ContextMenuExtension,
  tableExtension,
  TableExtension,
  historyExtension,
  RichText,
} from "@lexkit/editor";
import "@/app/(docs)/examples/basic-editor.css";

// Context menu configuration with table support
const contextMenuExt = new ContextMenuExtension({
  theme: {
    container: 'bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48 text-black',
    item: 'px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors text-black',
    itemDisabled: 'opacity-50 cursor-not-allowed text-gray-400'
  }
});

const tableExt = new TableExtension({
  enableContextMenu: true,
  contextMenuExtension: contextMenuExt,
});

const extensionsWithContextMenu = [
  contextMenuExt,
  tableExt,
  historyExtension,
] as const;

// Create typed editor system
const { Provider, useEditor } =
  createEditorSystem<typeof extensionsWithContextMenu>();

// Simple Toolbar
function Toolbar() {
  const { commands } = useEditor();

  const insertTable = () => {
    commands.insertTable({ rows: 3, columns: 3, includeHeaders: true });
  };

  return (
    <div className="basic-toolbar">
      <button onClick={insertTable} title="Insert table">
        📊 Insert Table
      </button>
    </div>
  );
}

// Main Editor Component
function BasicEditorWithContextMenu() {
  return (
    <Provider 
      extensions={extensionsWithContextMenu}
      config={{
        theme: {
          table: 'border-collapse border border-gray-300 my-4 shadow-sm',
          tableRow: 'hover:bg-gray-50 transition-colors',
          tableCell: 'border border-gray-300 px-4 py-2',
          tableCellHeader: 'border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left'
        }
      }}
    >
      <div className="basic-editor">
        <Toolbar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder",
          }}
          placeholder="Right-click on tables and other content to see context menus! Try inserting a table first."
        />
      </div>
    </Provider>
  );
}

export default BasicEditorWithContextMenu;