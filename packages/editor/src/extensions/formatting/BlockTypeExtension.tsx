import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection'; // Key import!
import { $createParagraphNode, $isParagraphNode, ParagraphNode } from 'lexical';
import { $createHeadingNode, $isHeadingNode, HeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createQuoteNode, $isQuoteNode, QuoteNode } from '@lexical/rich-text';
import { BaseExtension } from '../base/BaseExtension';
import { ExtensionCategory } from '../types';
import { $getNearestNodeOfType } from '@lexical/utils'; // For better state queries

/**
 * Supported block formats for the BlockFormatExtension
 */
export type BlockFormat = 'p' | HeadingTagType | 'quote';

/**
 * Commands provided by the BlockFormatExtension for block-level formatting
 */
export type BlockFormatCommands = {
  /** Toggle to a specific block format */
  toggleBlockFormat: (format: BlockFormat) => void;
  /** Toggle to paragraph format */
  toggleParagraph: () => void;
  /** Toggle to a heading format */
  toggleHeading: (tag: HeadingTagType) => void;
  /** Toggle to quote format */
  toggleQuote: () => void;
};

/**
 * State queries provided by the BlockFormatExtension for checking block formats
 */
export type BlockFormatStateQueries = {
  /** Check if current selection is in a paragraph */
  isParagraph: () => Promise<boolean>;
  /** Check if current selection is in an H1 heading */
  isH1: () => Promise<boolean>;
  /** Check if current selection is in an H2 heading */
  isH2: () => Promise<boolean>;
  /** Check if current selection is in an H3 heading */
  isH3: () => Promise<boolean>;
  /** Check if current selection is in an H4 heading */
  isH4: () => Promise<boolean>;
  /** Check if current selection is in an H5 heading */
  isH5: () => Promise<boolean>;
  /** Check if current selection is in an H6 heading */
  isH6: () => Promise<boolean>;
  /** Check if current selection is in a quote block */
  isQuote: () => Promise<boolean>;
};

/**
 * BlockFormatExtension - Provides block-level formatting functionality
 *
 * This extension enables users to change block-level elements like paragraphs,
 * headings (H1-H6), and quotes. It provides a comprehensive set of commands
 * for toggling between different block formats and state queries for checking
 * the current block format.
 *
 * The extension supports true toggling - if you apply the same format that's
 * already active, it will revert to a paragraph.
 *
 * @example
 * ```tsx
 * import { blockFormatExtension } from '@repo/editor/extensions/formatting/BlockTypeExtension';
 *
 * const extensions = [blockFormatExtension];
 * const editor = createEditorSystem(extensions);
 *
 * // Use in component
 * const { commands } = useEditor();
 * commands.toggleHeading('h1'); // Convert selection to H1
 * commands.toggleQuote(); // Convert selection to quote block
 * ```
 */
export class BlockFormatExtension extends BaseExtension<
  'blockFormat',
  {}, // No extra config needed
  BlockFormatCommands,
  BlockFormatStateQueries
> {
  constructor() {
    super('blockFormat', [ExtensionCategory.Toolbar]);
  }

  /**
   * Register the extension with the Lexical editor
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    // No custom commands to register; we use editor.update for changes
    return () => {};
  }

  /**
   * Get the Lexical nodes required by this extension
   * @returns Array of node classes
   */
  getNodes() {
    return [ParagraphNode, HeadingNode, QuoteNode]; // Include ParagraphNode if overriding
  }

  /**
   * Get the commands provided by this extension
   * @param editor - The Lexical editor instance
   * @returns Object containing available commands
   */
  getCommands(editor: LexicalEditor): BlockFormatCommands {
    return {
      toggleBlockFormat: (format: BlockFormat) => this.toggleBlockFormat(editor, format),
      toggleParagraph: () => this.toggleBlockFormat(editor, 'p'),
      toggleHeading: (tag: HeadingTagType) => this.toggleBlockFormat(editor, tag),
      toggleQuote: () => this.toggleBlockFormat(editor, 'quote'),
    };
  }

  /**
   * Toggle the block format for the current selection
   * @param editor - The Lexical editor instance
   * @param format - The target block format
   */
  private toggleBlockFormat(editor: LexicalEditor, format: BlockFormat) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Optional: Check if already in this format; if yes, revert to 'p' (true toggle)
        const currentFormat = this.getCurrentFormatSync(); // Sync version for inside update
        if (currentFormat === format) {
          $setBlocksType(selection, () => $createParagraphNode());
          return;
        }

        // Set the new format
        $setBlocksType(selection, () => {
          if (format === 'p') return $createParagraphNode();
          if (format === 'quote') return $createQuoteNode();
          return $createHeadingNode(format);
        });
      }
    });
  }

  /**
   * Get the state queries provided by this extension
   * @param editor - The Lexical editor instance
   * @returns Object containing available state queries
   */
  getStateQueries(editor: LexicalEditor): BlockFormatStateQueries {
    return {
      isParagraph: () => Promise.resolve(this.isFormat('p', editor)),
      isH1: () => Promise.resolve(this.isFormat('h1', editor)),
      isH2: () => Promise.resolve(this.isFormat('h2', editor)),
      isH3: () => Promise.resolve(this.isFormat('h3', editor)),
      isH4: () => Promise.resolve(this.isFormat('h4', editor)),
      isH5: () => Promise.resolve(this.isFormat('h5', editor)),
      isH6: () => Promise.resolve(this.isFormat('h6', editor)),
      isQuote: () => Promise.resolve(this.isFormat('quote', editor)),
    };
  }

  /**
   * Get the nearest block node from the given node
   * @param node - The starting node
   * @returns The nearest block node or null
   */
  private getBlockNode(node: any): ParagraphNode | HeadingNode | QuoteNode | null {
    let current = node;
    while (current) {
      if ($isParagraphNode(current) || $isHeadingNode(current) || $isQuoteNode(current)) {
        return current;
      }
      current = current.getParent();
    }
    return null;
  }

  /**
   * Check if all blocks in the current selection match the specified format
   * @param format - The format to check for
   * @param editor - The Lexical editor instance
   * @returns True if all selected blocks match the format
   */
  private isFormat(format: BlockFormat, editor: LexicalEditor): boolean {
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
   * Get the format type of a given block node
   * @param node - The block node to check
   * @returns The format type or null
   */
  private getNodeFormat(node: ParagraphNode | HeadingNode | QuoteNode): BlockFormat | null {
    if ($isParagraphNode(node)) return 'p';
    if ($isHeadingNode(node)) return node.getTag();
    if ($isQuoteNode(node)) return 'quote';
    return null;
  }

  /**
   * Get the current block format of the selection
   * @param editor - The Lexical editor instance
   * @returns The current format or null
   */
  private getCurrentFormat(editor: LexicalEditor): BlockFormat | null {
    let format: BlockFormat | null = null;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const block = this.getBlockNode(anchorNode);
        if (block) {
          format = this.getNodeFormat(block);
        }
      }
    });
    return format;
  }

  /**
   * Get the current block format synchronously (for use inside editor.update())
   * @returns The current format or null
   */
  private getCurrentFormatSync(): BlockFormat | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;
    const anchorNode = selection.anchor.getNode();
    const block = this.getBlockNode(anchorNode);
    return block ? this.getNodeFormat(block) : null;
  }
}

export const blockFormatExtension = new BlockFormatExtension();