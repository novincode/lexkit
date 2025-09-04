import React from 'react';
import { createCustomNodeExtension, Extension, BaseExtensionConfig } from '@repo/editor/extensions';

// Define types for custom commands/queries (for type safety)
type MyCommands = {
  insertMyBlock: (payload: { text: string; color: string }) => void;
};
type MyStateQueries = {
  isMyBlockActive: () => Promise<boolean>;
};

// Create the extension
const myCustomExtension: Extension<'myBlock', BaseExtensionConfig, MyCommands, MyStateQueries> = createCustomNodeExtension<'myBlock', MyCommands, MyStateQueries>({
  nodeType: 'myBlock',
  defaultPayload: { text: 'Hello World', color: 'blue' },
  render: ({ payload, isSelected }) => React.createElement('div', {
    style: {
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
    }
  }, payload.text),
  // Custom commands (type-safe)
  commands: (editor) => ({
    insertMyBlock: (payload: { text: string; color: string }) => {
      editor.dispatchCommand('insert-custom-node' as any, payload);
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

export { myCustomExtension };