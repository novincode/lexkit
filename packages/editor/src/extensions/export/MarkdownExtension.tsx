import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { BaseExtensionConfig } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, $createParagraphNode } from 'lexical';

export type MarkdownConfig = {
  customTransformers?: Array<any>;
};

export type MarkdownCommands = {
  exportToMarkdown: () => string;
  importFromMarkdown: (markdown: string) => void;
};

export type MarkdownStateQueries = {
  canExportMarkdown: () => Promise<boolean>;
};

export class MarkdownExtension extends BaseExtension<
  'markdown',
  MarkdownConfig & BaseExtensionConfig,
  MarkdownCommands,
  MarkdownStateQueries,
  ReactNode[]
> {
  constructor() {
    super('markdown', [ExtensionCategory.Toolbar]);
    this.config = { customTransformers: [] };
  }

  configure(config: Partial<MarkdownConfig & BaseExtensionConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

  getCommands(editor: LexicalEditor): MarkdownCommands {
    // Combine default and custom transformers
    const transformers = [...TRANSFORMERS, ...(this.config.customTransformers || [])];

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            // Use Lexical's built-in markdown conversion with all transformers
            const markdown = $convertToMarkdownString(transformers);
            return markdown;
          } catch (error) {
            console.error('❌ Markdown export error:', error);
            return '';
          }
        });
      },

      importFromMarkdown: (markdown: string) => {
        editor.update(() => {
          try {
            const root = $getRoot();
            root.clear();

            if (!markdown.trim()) {
              root.append($createParagraphNode());
              return;
            }

            $convertFromMarkdownString(markdown, transformers);
          } catch (error) {
            console.error('❌ Markdown import error:', error);
            const root = $getRoot();
            root.clear();
            root.append($createParagraphNode());
          }
        }, { discrete: true });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): MarkdownStateQueries {
    return {
      canExportMarkdown: async () => true,
    };
  }
}

export const markdownExtension = new MarkdownExtension();
