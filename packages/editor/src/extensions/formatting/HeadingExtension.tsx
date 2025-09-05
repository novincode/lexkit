import { LexicalEditor, $getSelection, $isRangeSelection, $createParagraphNode, $isParagraphNode } from 'lexical';
import { $createHeadingNode, $isHeadingNode, HeadingNode, HeadingTagType, $createQuoteNode, $isQuoteNode, QuoteNode } from '@lexical/rich-text';
import { BaseExtension } from '../base/BaseExtension';
import { ExtensionCategory } from '../types';

type HeadingCommands = {
  toggleH1: () => void;
  toggleH2: () => void;
  toggleH3: () => void;
  toggleH4: () => void;
  toggleH5: () => void;
  toggleH6: () => void;
  toggleParagraph: () => void;
  toggleQuote: () => void;
};

type HeadingStateQueries = {
  isH1: () => Promise<boolean>;
  isH2: () => Promise<boolean>;
  isH3: () => Promise<boolean>;
  isH4: () => Promise<boolean>;
  isH5: () => Promise<boolean>;
  isH6: () => Promise<boolean>;
  isParagraph: () => Promise<boolean>;
  isQuote: () => Promise<boolean>;
};

export class HeadingExtension extends BaseExtension<
  'heading',
  {},
  HeadingCommands,
  HeadingStateQueries
> {
  constructor() {
    super('heading', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  getNodes() {
    return [HeadingNode, QuoteNode];
  }

  getCommands(editor: LexicalEditor): HeadingCommands {
    return {
      toggleH1: () => this.toggleHeading(editor, 'h1'),
      toggleH2: () => this.toggleHeading(editor, 'h2'),
      toggleH3: () => this.toggleHeading(editor, 'h3'),
      toggleH4: () => this.toggleHeading(editor, 'h4'),
      toggleH5: () => this.toggleHeading(editor, 'h5'),
      toggleH6: () => this.toggleHeading(editor, 'h6'),
      toggleParagraph: () => this.toggleHeading(editor, 'p'),
      toggleQuote: () => this.toggleHeading(editor, 'quote'),
    };
  }

  private toggleHeading(editor: LexicalEditor, tag: HeadingTagType | 'p' | 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        for (const node of nodes) {
          if ($isParagraphNode(node) || $isHeadingNode(node) || $isQuoteNode(node)) {
            if (tag === 'p') {
              node.replace($createParagraphNode());
            } else if (tag === 'quote') {
              node.replace($createQuoteNode());
            } else {
              node.replace($createHeadingNode(tag as HeadingTagType));
            }
          }
        }
      }
    });
  }

  getStateQueries(editor: LexicalEditor): HeadingStateQueries {
    return {
      isH1: async () => this.getCurrentHeading(editor) === 'h1',
      isH2: async () => this.getCurrentHeading(editor) === 'h2',
      isH3: async () => this.getCurrentHeading(editor) === 'h3',
      isH4: async () => this.getCurrentHeading(editor) === 'h4',
      isH5: async () => this.getCurrentHeading(editor) === 'h5',
      isH6: async () => this.getCurrentHeading(editor) === 'h6',
      isParagraph: async () => this.getCurrentHeading(editor) === 'p',
      isQuote: async () => this.getCurrentHeading(editor) === 'quote',
    };
  }

  private getCurrentHeading(editor: LexicalEditor): string | null {
    let type: string | null = null;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        if ($isHeadingNode(anchorNode)) {
          type = (anchorNode as any).getTag();
        } else if ($isParagraphNode(anchorNode)) {
          type = 'p';
        } else if ($isQuoteNode(anchorNode)) {
          type = 'quote';
        }
      }
    });
    return type;
  }
}

export const headingExtension = new HeadingExtension();
