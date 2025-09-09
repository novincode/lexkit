import React from 'react';
import { BaseExtension } from '@lexkit/editor/extensions/base/BaseExtension';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { LexicalEditor, $getSelection, $isRangeSelection, $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

// Define the commands interface
type TestCommands = {
  insertTimestamp: () => void;
  clearContent: () => void;
  getWordCount: () => void;
};

// Define the state queries interface
type TestStateQueries = {
  hasSelection: () => Promise<boolean>;
  isEmpty: () => Promise<boolean>;
};

// Create the extension class extending BaseExtension
class TestBaseExtensionClass extends BaseExtension<
  'test-base-extension',
  {},
  TestCommands,
  TestStateQueries,
  React.ReactNode[]
> {
  constructor() {
    super('test-base-extension', [ExtensionCategory.Toolbar]);
  }

  // Implement the required register method
  register(editor: LexicalEditor): () => void {
    console.log('TestBaseExtension registered!');

    // Return cleanup function
    return () => {
      console.log('TestBaseExtension cleaned up!');
    };
  }

  // Implement the required getCommands method
  getCommands(editor: LexicalEditor): TestCommands {
    return {
      insertTimestamp: () => {
        editor.focus();
        const timestamp = new Date().toLocaleString();
        editor.update(() => {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(timestamp));
          root.append(paragraph);
        });
      },

      clearContent: () => {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      },

      getWordCount: () => {
        alert('Hello World from BaseExtension!');
      }
    };
  }

  // Implement the required getStateQueries method
  getStateQueries(editor: LexicalEditor): TestStateQueries {
    return {
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
    };
  }
}

// Export a singleton instance
export const TestBaseExtension = new TestBaseExtensionClass();
