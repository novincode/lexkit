import React from 'react';
import { createCustomNodeExtension, Extension, BaseExtensionConfig } from '@repo/editor/extensions';
import { $getSelection, $isRangeSelection, $insertNodes, $getRoot, $createParagraphNode, LexicalNode } from 'lexical';

// Define types for custom commands/queries (for type safety)
type CustomPayload = Record<string, any>;
type MyCommands = {
  insertMyBlock: (payload: { text: string; color: string }) => void;
};
type MyStateQueries = {
  isMyBlockActive: () => Promise<boolean>;
};

// Create the extension
const { extension, $createCustomNode } = createCustomNodeExtension<'myBlock', MyCommands, MyStateQueries>({
  nodeType: 'myBlock',
  defaultPayload: { text: 'Hello World', color: 'blue' },
  render: ({ node, payload, isSelected, updatePayload }) => (
    <div
      style={{
        border: `3px solid ${payload.color}`,
        padding: '20px',
        background: isSelected ? 'lightyellow' : 'lightblue',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      contentEditable
      suppressContentEditableWarning
    >
      {payload.text}
    </div>
  ),
  // Custom commands (type-safe)
  commands: (editor) => ({
    insertMyBlock: (payload: { text: string; color: string }) => {
      editor.update(() => {
        const node = $createCustomNode(payload);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([node as LexicalNode]);
        } else {
          $getRoot().append($createParagraphNode().append(node as LexicalNode));
        }
      });
    },
  }),
  // Custom queries
  stateQueries: (editor) => ({
    isMyBlockActive: () => new Promise((resolve) => {
      editor.getEditorState().read(() => {
        // Logic to check if myBlock is active
        resolve(false); // Placeholder
      });
    }),
  }),
});

export { extension as myCustomExtension };
