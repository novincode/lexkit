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
    console.log('🔧 Configuring MarkdownExtension with custom transformers:', config.customTransformers?.length || 0);
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
    
    console.log('🔧 MarkdownExtension getCommands - Total transformers:', transformers.length);
    console.log('🔧 Custom transformers added:', this.config.customTransformers?.length || 0);

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            console.log('🔄 Starting markdown export with', transformers.length, 'transformers');
            
            // Debug: Log transformer types
            transformers.forEach((t, i) => {
              console.log(`Transformer ${i}: type=${t.type}, deps=${t.dependencies?.length || 0}`);
            });
            
            // Use Lexical's built-in markdown conversion with all transformers
            const markdown = $convertToMarkdownString(transformers);
            
            console.log('✅ Markdown export completed, result length:', markdown.length);
            console.log('✅ Markdown content:', markdown);
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

            console.log('🔄 Importing markdown with', transformers.length, 'transformers');
            console.log('🔄 Markdown to import:', markdown);
            
            $convertFromMarkdownString(markdown, transformers);
            
            console.log('✅ Markdown import completed');
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
