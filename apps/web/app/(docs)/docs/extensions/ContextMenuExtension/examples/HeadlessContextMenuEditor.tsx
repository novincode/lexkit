"use client";

// Headless Context Menu Editor Example
// Demonstrates basic context menu functionality without tables or other extensions
import {
  createEditorSystem,
  contextMenuExtension,
  ContextMenuExtension,
  RichText,
} from "@lexkit/editor";
import { useEffect } from "react";
import "@/app/(docs)/examples/basic-editor.css";

// Simple context menu configuration
const contextMenuExt = new ContextMenuExtension({
  theme: {
    container: 'bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48 text-black',
    item: 'px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors text-black',
    itemDisabled: 'opacity-50 cursor-not-allowed text-gray-400'
  }
});

const basicExtensions = [
  contextMenuExt,
] as const;

// Create typed editor system
const { Provider, useEditor } =
  createEditorSystem<typeof basicExtensions>();

// Custom provider registration component
function CustomProviders() {
  const { commands } = useEditor();

  useEffect(() => {
    // Register basic text provider
    commands.registerProvider({
      id: 'basic-text-provider',
      priority: 10,
      canHandle: ({ target }) => {
        return target.closest('p, div, span') !== null && !target.closest('td, th');
      },
      getItems: () => [
        {
          label: '✨ Format Text',
          action: () => alert('Format text action!')
        },
        {
          label: '📋 Copy Selection',
          action: () => alert('Copy selection action!')
        }
      ]
    });

    // Register general provider for all content
    commands.registerProvider({
      id: 'general-provider',
      priority: 1,
      canHandle: () => true,
      getItems: () => [
        {
          label: '🔍 Inspect Element',
          action: () => alert('Inspect action triggered!')
        }
      ]
    });
  }, [commands]);

  return null;
}

// Simple Toolbar
function Toolbar() {
  return (
    <div className="basic-toolbar">
      <span className="text-sm text-gray-600">Right-click in the editor below to see the context menu</span>
    </div>
  );
}

// Main Editor Component
function HeadlessContextMenuEditor() {
  return (
    <Provider extensions={basicExtensions}>
      <CustomProviders />
      <div className="basic-editor">
        <Toolbar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder",
          }}
          placeholder="Right-click on text to see different context menu options!"
        />
      </div>
    </Provider>
  );
}

export default HeadlessContextMenuEditor;