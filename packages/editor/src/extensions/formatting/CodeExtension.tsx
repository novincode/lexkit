import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $createCodeNode, $isCodeNode, CodeNode } from '@lexical/code';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';

export type CodeCommands = {
  insertCodeBlock: (language?: string) => void;
  toggleCodeBlock: () => void;
};

export type CodeStateQueries = {
  isInCodeBlock: () => Promise<boolean>;
};

export class CodeExtension extends BaseExtension<
  'code',
  {},
  CodeCommands,
  CodeStateQueries,
  ReactNode[]
> {
  constructor() {
    super('code', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

  getNodes() {
    return [CodeNode];
  }

  getCommands(editor: LexicalEditor): CodeCommands {
    return {
      insertCodeBlock: (language: string = '') => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const codeNode = $createCodeNode(language);
            selection.insertNodes([codeNode]);
          }
        });
      },

      toggleCodeBlock: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (this.isSelectionInCodeBlock(selection)) {
              // If already in code block, exit it by converting to paragraph
              $setBlocksType(selection, () => $createParagraphNode());
            } else {
              // Insert new code block
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
            }
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): CodeStateQueries {
    return {
      isInCodeBlock: async () => {
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          return $isRangeSelection(selection) && this.isSelectionInCodeBlock(selection);
        });
      },
    };
  }

  // Helper method to check if selection is inside a code block
  private isSelectionInCodeBlock(selection: any): boolean {
    const nodes = selection.getNodes();
    for (const node of nodes) {
      let current = node;
      while (current) {
        if ($isCodeNode(current)) {
          return true;
        }
        current = current.getParent();
      }
    }
    return false;
  }
}

export const codeExtension = new CodeExtension();
