import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { BaseExtensionConfig } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, $createParagraphNode } from 'lexical';
import { HTMLEmbedNode } from '../media/HTMLEmbedExtension';

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
  private debounceTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super('markdown', [ExtensionCategory.Toolbar]);
    this.config = { customTransformers: [] };
  }

  configure(config: Partial<MarkdownConfig & BaseExtensionConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  getCommands(editor: LexicalEditor): MarkdownCommands {
    const transformers = [...(this.config.customTransformers || []), ...TRANSFORMERS];

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            return $convertToMarkdownString(transformers);
          } catch (error) {
            console.error('❌ Markdown export error:', error);
            return '';
          }
        });
      },

      importFromMarkdown: (markdown: string) => {
        // Clear existing debounce
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }

        // Debounce the import to prevent constant re-parsing while typing
        this.debounceTimeout = setTimeout(() => {
          editor.update(() => {
            try {
              const root = $getRoot();
              root.clear();

              if (!markdown.trim()) {
                root.append($createParagraphNode());
                return;
              }

              // Pre-process html-embed blocks
              let processedMarkdown = markdown;
              const htmlEmbedBlocks: { html: string; placeholder: string }[] = [];
              
              processedMarkdown = processedMarkdown.replace(/```html-embed\s*\n([\s\S]*?)\n```/g, (match, htmlContent) => {
                const placeholder = `HTMLEMBEDPLACEHOLDER${htmlEmbedBlocks.length}HTMLEMBEDPLACEHOLDER`;
                htmlEmbedBlocks.push({ html: htmlContent.trim(), placeholder });
                return placeholder;
              });

              $convertFromMarkdownString(processedMarkdown, transformers);

              // Replace placeholders with HTML embed nodes
              if (htmlEmbedBlocks.length > 0) {
                const traverseAndReplace = (node: any) => {
                  if (node.getTextContent?.()) {
                    const text = node.getTextContent();
                    for (const { html, placeholder } of htmlEmbedBlocks) {
                      if (text === placeholder) {
                        const payload = { html, preview: true };
                        const embedNode = new HTMLEmbedNode(payload);
                        if (node !== root && node.getParent?.()) {
                          node.replace(embedNode);
                          return;
                        }
                      }
                    }
                  }
                  
                  if (node.getChildren?.()) {
                    [...node.getChildren()].forEach(child => traverseAndReplace(child));
                  }
                };
                
                traverseAndReplace(root);
              }
            } catch (error) {
              console.error('❌ Markdown import error:', error);
              $getRoot().clear();
              $getRoot().append($createParagraphNode());
            }
          }, { discrete: true });
        }, 500); // 500ms debounce - balanced for good UX
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
