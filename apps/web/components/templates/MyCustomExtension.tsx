import React from 'react';
import { createCustomNodeExtension } from '@lexkit/editor/extensions/custom';
import { $getSelection, $isRangeSelection, $getRoot, $createParagraphNode } from 'lexical';

// Create the extension using the factory
type MyCommands = {
  insertMyBlock: (payload: { text: string; color: string }) => void;
};

const { extension: MyCustomExtension, $createCustomNode, jsxToDOM } = createCustomNodeExtension<'myBlock', MyCommands, {}>({
  nodeType: 'myBlock',
  isContainer: true,
  initialChildren: () => [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Hello World' }],
      direction: null,
      format: '',
      indent: 0,
      version: 1
    }
  ],
  // NEW: Use JSX directly! 🎉
  jsx: ({ node, payload, nodeKey, isSelected, updatePayload }) => (
    <div
      data-custom-node-type="myBlock"
      data-lexical-key={nodeKey}
      style={{
        border: isSelected ? '2px solid #007ACC' : '2px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        position: 'relative'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '8px',
          fontWeight: 'bold'
        }}
      >
        Custom Container JSX! 🚀
      </div>
    </div>
  ),
  commands: (editor) => ({
    insertMyBlock: (payload: { text: string; color: string }) => {
      editor.update(() => {
        const node = $createCustomNode(payload);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([node]);
        } else {
          $getRoot().append($createParagraphNode().append(node));
        }
      });
    },
  }),
});

export { MyCustomExtension };

// Usage example:
// 1. Register the extension with your editor
// 2. Use the insertCustomNode command to insert nodes
// 3. The container will render with native Lexical editing capabilities
// 4. Style the container using CSS: [data-custom-node-type="myBlock"]
