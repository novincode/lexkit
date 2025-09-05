import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode, $isCodeNode, CodeNode } from '@lexical/code';
import { $createParagraphNode } from 'lexical';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { ReactNode } from 'react';

/**
 * Commands provided by the CodeExtension for toggling code blocks
 */
export type CodeCommands = {
  /** Toggle between code block and paragraph for the current selection */
  toggleCodeBlock: () => void;
};

/**
 * State queries provided by the CodeExtension for checking code block status
 */
export type CodeStateQueries = {
  /** Check if the current selection is within a code block */
  isInCodeBlock: () => Promise<boolean>;
};

/**
 * CodeExtension - Provides code block functionality for the Lexical editor
 *
 * This extension enables users to create and manage code blocks in the editor.
 * It provides commands to toggle between code blocks and regular paragraphs,
 * and state queries to check if the current selection is within a code block.
 *
 * The extension integrates with Lexical's CodeNode and provides a clean API
 * for toolbar integration and programmatic control.
 *
 * @example
 * ```tsx
 * import { codeExtension } from '@lexkit/editor/extensions/formatting/CodeExtension';
 *
 * const extensions = [codeExtension];
 * const editor = createEditorSystem(extensions);
 *
 * // Use in component
 * const { commands } = useEditor();
 * commands.toggleCodeBlock(); // Toggle code block on/off
 * ```
 */
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

  /**
   * Register the extension with the Lexical editor
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Get the Lexical nodes required by this extension
   * @returns Array of node classes
   */
  getNodes() {
    return [CodeNode];
  }

  /**
   * Get the commands provided by this extension
   * @param editor - The Lexical editor instance
   * @returns Object containing available commands
   */
  getCommands(editor: LexicalEditor): CodeCommands {
    return {
      toggleCodeBlock: () => this.toggleCodeBlock(editor),
    };
  }

  /**
   * Toggle between code block and paragraph for the current selection
   * @param editor - The Lexical editor instance
   */
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

  /**
   * Get the state queries provided by this extension
   * @param editor - The Lexical editor instance
   * @returns Object containing available state queries
   */
  getStateQueries(editor: LexicalEditor): CodeStateQueries {
    return {
      isInCodeBlock: () => Promise.resolve(this.isFormat('code', editor)),
    };
  }

  /**
   * Check if the current selection matches the specified format
   * @param format - The format to check for (currently only 'code')
   * @param editor - The Lexical editor instance
   * @returns True if all selected nodes match the format
   */
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

  /**
   * Get the nearest block node from the given node
   * @param node - The starting node
   * @returns The nearest CodeNode or null
   */
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

  /**
   * Get the format type of a given node
   * @param node - The node to check
   * @returns The format type or null
   */
  private getNodeFormat(node: CodeNode): 'code' | null {
    if ($isCodeNode(node)) return 'code';
    return null;
  }

  /**
   * Get the current format synchronously (for use inside editor.update())
   * @returns The current format or null
   */
  private getCurrentFormatSync(): 'code' | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;
    const anchorNode = selection.anchor.getNode();
    const block = this.getBlockNode(anchorNode);
    return block ? this.getNodeFormat(block) : null;
  }
}

export const codeExtension = new CodeExtension();
