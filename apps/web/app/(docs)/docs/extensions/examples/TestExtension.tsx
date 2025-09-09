import React from 'react';
import { createExtension } from '@lexkit/editor';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { LexicalEditor, $getSelection, $isRangeSelection, $getRoot } from 'lexical';

// Define the commands interface
type TestCommands = {
  insertTimestamp: () => void;
  clearContent: () => void;
  getWordCount: () => number;
};

// Define the state queries interface
type TestStateQueries = {
  hasSelection: () => Promise<boolean>;
  isEmpty: () => Promise<boolean>;
};

// Create the extension using the new createExtension function
const TestExtension = createExtension<'test-extension', {}, TestCommands, TestStateQueries, React.ReactNode[]>({
  name: 'test-extension',
  category: [ExtensionCategory.Toolbar],

  // Define commands
  commands: (editor) => ({
    insertTimestamp: () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const timestamp = new Date().toLocaleString();
          selection.insertText(timestamp);
        }
      });
    },

    clearContent: () => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },

    getWordCount: () => {
      // This would need to be implemented based on editor content
      return 42; // Placeholder
    }
  }),

  // Define state queries
  stateQueries: (editor) => ({
    hasSelection: async () => {
      return new Promise((resolve) => {
        editor.read(() => {
          const selection = $getSelection();
          resolve($isRangeSelection(selection) && !selection.isCollapsed());
        });
      });
    },

    isEmpty: async () => {
      return new Promise((resolve) => {
        editor.read(() => {
          const root = $getRoot();
          resolve(!root.getTextContent().trim());
        });
      });
    }
  }),

  // Initialize function (optional)
  initialize: (editor) => {
    console.log('TestExtension initialized!');

    // Return cleanup function
    return () => {
      console.log('TestExtension cleaned up!');
    };
  }
});

export { TestExtension };

