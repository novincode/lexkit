import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection'; // Key import!
import { $createParagraphNode, $isParagraphNode, ParagraphNode } from 'lexical';
import { $createHeadingNode, $isHeadingNode, HeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createQuoteNode, $isQuoteNode, QuoteNode } from '@lexical/rich-text';
import { BaseExtension } from '../base/BaseExtension';
import { ExtensionCategory } from '../types';
import { $getNearestNodeOfType } from '@lexical/utils'; // For better state queries

// Define supported formats as a type for scalability/type-safety
export type BlockFormat = 'p' | HeadingTagType | 'quote';

// Commands: Use a single toggleBlockFormat for scalability, plus shorthands
export type BlockFormatCommands = {
  toggleBlockFormat: (format: BlockFormat) => void;
  toggleParagraph: () => void;
  toggleHeading: (tag: HeadingTagType) => void;
  toggleQuote: () => void;
};

// State Queries: One per format
export type BlockFormatStateQueries = {
  isParagraph: () => Promise<boolean>;
  isH1: () => Promise<boolean>;
  isH2: () => Promise<boolean>;
  isH3: () => Promise<boolean>;
  isH4: () => Promise<boolean>;
  isH5: () => Promise<boolean>;
  isH6: () => Promise<boolean>;
  isQuote: () => Promise<boolean>;
};

export class BlockFormatExtension extends BaseExtension<
  'blockFormat',
  {}, // No extra config needed
  BlockFormatCommands,
  BlockFormatStateQueries
> {
  constructor() {
    super('blockFormat', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // No custom commands to register; we use editor.update for changes
    return () => {};
  }

  getNodes() {
    return [ParagraphNode, HeadingNode, QuoteNode]; // Include ParagraphNode if overriding
  }

  getCommands(editor: LexicalEditor): BlockFormatCommands {
    return {
      toggleBlockFormat: (format: BlockFormat) => this.toggleBlockFormat(editor, format),
      toggleParagraph: () => this.toggleBlockFormat(editor, 'p'),
      toggleHeading: (tag: HeadingTagType) => this.toggleBlockFormat(editor, tag),
      toggleQuote: () => this.toggleBlockFormat(editor, 'quote'),
    };
  }

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
    }, { onError: (error: Error) => console.error('Block format error:', error) }); // Optional error handling
  }

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

  // Helper: Get the nearest block node
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

  // Helper: Check if all blocks in selection match format (better than anchor-only)
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

  // Helper: Get format of a node
  private getNodeFormat(node: ParagraphNode | HeadingNode | QuoteNode): BlockFormat | null {
    if ($isParagraphNode(node)) return 'p';
    if ($isHeadingNode(node)) return node.getTag();
    if ($isQuoteNode(node)) return 'quote';
    return null;
  }

  // Helper: Get current format (uses anchor if mixed; null if mixed)
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

  // Sync version for use inside update()
  private getCurrentFormatSync(): BlockFormat | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;
    const anchorNode = selection.anchor.getNode();
    const block = this.getBlockNode(anchorNode);
    return block ? this.getNodeFormat(block) : null;
  }
}

export const blockFormatExtension = new BlockFormatExtension();