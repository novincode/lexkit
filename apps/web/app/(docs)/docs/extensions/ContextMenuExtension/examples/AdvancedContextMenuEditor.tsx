"use client";

// Advanced Context Menu Editor Example
// Demonstrates advanced context menu usage with custom providers and table theming
import {
  createEditorSystem,
  contextMenuExtension,
  ContextMenuExtension,
  tableExtension,
  TableExtension,
  historyExtension,
  RichText,
} from "@lexkit/editor";
import { useEffect } from "react";
import "@/app/(docs)/examples/basic-editor.css";

// Advanced context menu configuration with custom providers
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

const advancedExtensions = [
  contextMenuExt,
  tableExt,
  historyExtension,
] as const;

// Create typed editor system
const { Provider, useEditor } =
  createEditorSystem<typeof advancedExtensions>();

// Custom Toolbar with more options
function AdvancedToolbar() {
  const { commands } = useEditor();

  const insertTable = () => {
    commands.insertTable({ rows: 3, columns: 3, includeHeaders: true });
  };

  return (
    <div className="basic-toolbar">
      <button onClick={insertTable} title="Insert table">
        📊 Insert Table
      </button>
      <span className="text-sm text-gray-600 ml-4">Right-click on tables and text for different context menus</span>
    </div>
  );
}

// Custom provider registration component
function CustomProviders() {
  const { commands } = useEditor();

  useEffect(() => {
    // Register custom provider for headings
    commands.registerProvider({
      id: 'heading-provider',
      priority: 50,
      canHandle: ({ target }) => {
        return target.closest('h1, h2, h3, h4, h5, h6') !== null;
      },
      getItems: () => [
        {
          label: '✨ Heading Actions',
          action: () => alert('Heading context menu item clicked!')
        },
        {
          label: '📝 Edit Heading',
          action: () => alert('Edit heading action!')
        }
      ]
    });

    // Register custom provider for paragraphs
    commands.registerProvider({
      id: 'paragraph-provider',
      priority: 40,
      canHandle: ({ target }) => {
        return target.closest('p') !== null && !target.closest('td, th');
      },
      getItems: () => [
        {
          label: '📄 Paragraph Actions',
          action: () => alert('Paragraph context menu item clicked!')
        },
        {
          label: '🎨 Format Text',
          action: () => alert('Format text action!')
        }
      ]
    });

    // Register custom provider for general content
    commands.registerProvider({
      id: 'general-provider',
      priority: 10,
      canHandle: () => true, // Handle all contexts
      getItems: () => [
        {
          label: '🔍 Inspect Element',
          action: () => alert('Inspect action triggered!')
        },
        {
          label: '📋 Copy Content',
          action: () => alert('Copy action triggered!')
        }
      ]
    });
  }, [commands]);

  return null;
}

// Main Editor Component
function AdvancedContextMenuEditor() {
  return (
    <Provider 
      extensions={advancedExtensions}
      config={{
        theme: {
          table: 'border-collapse border border-blue-300 my-4 shadow-sm rounded-lg overflow-hidden',
          tableRow: 'hover:bg-blue-25 transition-colors',
          tableCell: 'border border-blue-300 px-4 py-3',
          tableCellHeader: 'border border-blue-300 px-4 py-3 bg-blue-50 font-semibold text-left text-blue-900'
        }
      }}
    >
      <CustomProviders />
      <div className="basic-editor">
        <AdvancedToolbar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder",
          }}
          placeholder="Try right-clicking on headings, tables, and regular text to see different context menus!"
        />
      </div>
    </Provider>
  );
}

export default AdvancedContextMenuEditor;