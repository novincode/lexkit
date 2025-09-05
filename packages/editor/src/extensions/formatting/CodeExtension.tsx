import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode, $isCodeNode, CodeNode } from '@lexical/code';
import { $createParagraphNode } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';

export type CodeCommands = {
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
    return () => {};
  }

  getNodes() {
    return [CodeNode];
  }

  getCommands(editor: LexicalEditor): CodeCommands {
    return {
      toggleCodeBlock: () => this.toggleCodeBlock(editor),
    };
  }

  private toggleCodeBlock(editor: LexicalEditor) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Check if already in code block
        const currentFormat = this.getCurrentFormatSync();
        if (currentFormat === 'code') {
          // Exit code block - convert to paragraph
          $setBlocksType(selection, () => $createParagraphNode());
          return;
        }

        // Enter code block
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }

  getStateQueries(editor: LexicalEditor): CodeStateQueries {
    return {
      isInCodeBlock: () => Promise.resolve(this.isFormat('code', editor)),
    };
  }

  // Helper: Check if selection is in code block
  private isFormat(format: 'code', editor: LexicalEditor): boolean {
    let matches = true;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        matches = false;
        return;
      }
      const nodes = selection.getNodes();
      for (const node of nodes) {
        const block = this.getBlockNode(node);
        if (!block) {
          matches = false;
          break;
        }
        const blockFormat = this.getNodeFormat(block);
        if (blockFormat !== format) {
          matches = false;
          break;
        }
      }
    });
    return matches;
  }

  // Helper: Get the nearest block node
  private getBlockNode(node: any): CodeNode | null {
    let current = node;
    while (current) {
      if ($isCodeNode(current)) {
        return current;
      }
      current = current.getParent();
    }
    return null;
  }

  // Helper: Get format of a node
  private getNodeFormat(node: CodeNode): 'code' | null {
    if ($isCodeNode(node)) return 'code';
    return null;
  }

  // Sync version for use inside update()
  private getCurrentFormatSync(): 'code' | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;
    const anchorNode = selection.anchor.getNode();
    const block = this.getBlockNode(anchorNode);
    return block ? this.getNodeFormat(block) : null;
  }
}

export const codeExtension = new CodeExtension();
